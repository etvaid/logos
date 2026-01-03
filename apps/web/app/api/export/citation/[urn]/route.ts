import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Export citation bundle for a passage
 * Supports BibTeX, RIS, and JSON formats
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ urn: string }> }
) {
  try {
    const { urn } = await params;
    const decodedUrn = decodeURIComponent(urn);
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'bibtex';

    // Fetch passage and work info
    const passage = await queryOne<{
      work: string;
      section: string;
      content: string;
      language: string;
    }>(
      'SELECT work, section, content, language FROM source_texts WHERE urn = $1',
      [decodedUrn]
    );

    if (!passage) {
      return NextResponse.json({ error: 'Passage not found' }, { status: 404 });
    }

    // Get author info if available
    const author = await queryOne<{ name: string; name_english: string }>(
      `SELECT a.name, a.name_english
       FROM authors a
       JOIN works w ON w.author_id = a.id
       WHERE w.title = $1
       LIMIT 1`,
      [passage.work]
    );

    const citation = {
      urn: decodedUrn,
      work: passage.work,
      section: passage.section,
      author: author?.name_english || author?.name || 'Unknown',
      language: passage.language,
      url: `https://vercellogos-classical.vercel.app/passage/${encodeURIComponent(decodedUrn)}`,
      accessed: new Date().toISOString().split('T')[0],
    };

    if (format === 'bibtex') {
      const key = `logos_${passage.work.toLowerCase().replace(/\s+/g, '_')}_${passage.section.replace(/[:.]/g, '_')}`;
      const bibtex = `@misc{${key},
  author = {${citation.author}},
  title = {${citation.work} ${citation.section}},
  howpublished = {LOGOS Classical Text Platform},
  url = {${citation.url}},
  note = {URN: ${citation.urn}},
  urldate = {${citation.accessed}}
}`;

      return new NextResponse(bibtex, {
        headers: {
          'Content-Type': 'application/x-bibtex',
          'Content-Disposition': `attachment; filename="${key}.bib"`,
        },
      });
    }

    if (format === 'ris') {
      const ris = `TY  - ELEC
AU  - ${citation.author}
TI  - ${citation.work} ${citation.section}
PB  - LOGOS Classical Text Platform
UR  - ${citation.url}
N1  - URN: ${citation.urn}
Y2  - ${citation.accessed}
ER  -`;

      return new NextResponse(ris, {
        headers: {
          'Content-Type': 'application/x-research-info-systems',
          'Content-Disposition': `attachment; filename="${passage.work}_${passage.section}.ris"`,
        },
      });
    }

    // JSON format
    return NextResponse.json({
      ...citation,
      content_preview: passage.content.substring(0, 500),
      bibtex_url: `${citation.url.replace('/passage/', '/api/export/citation/')}?format=bibtex`,
      ris_url: `${citation.url.replace('/passage/', '/api/export/citation/')}?format=ris`,
    });
  } catch (error) {
    console.error('Citation export error:', error);
    return NextResponse.json(
      { error: 'Failed to export citation' },
      { status: 500 }
    );
  }
}
