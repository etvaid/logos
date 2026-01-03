import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

/**
 * Generate a shareable card for a passage
 * Returns HTML that can be rendered to image client-side
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ urn: string }> }
) {
  try {
    const { urn } = await params;
    const decodedUrn = decodeURIComponent(urn);
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'html';

    // Fetch passage data
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

    // Get intertext count
    const intertexts = await queryOne<{ count: number }>(
      'SELECT COUNT(*)::int as count FROM intertext_evidence WHERE source_urn = $1',
      [decodedUrn]
    );

    // Get entity count
    const entities = await queryOne<{ count: number }>(
      'SELECT COUNT(*)::int as count FROM entity_mentions WHERE urn = $1',
      [decodedUrn]
    );

    if (format === 'json') {
      return NextResponse.json({
        urn: decodedUrn,
        work: passage.work,
        section: passage.section,
        content: passage.content,
        language: passage.language,
        intertexts: intertexts?.count || 0,
        entities: entities?.count || 0,
        share_url: `https://vercellogos-classical.vercel.app/passage/${encodeURIComponent(decodedUrn)}`,
      });
    }

    // Generate HTML card
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta property="og:title" content="${passage.work} ${passage.section}">
  <meta property="og:description" content="${passage.content.substring(0, 200)}...">
  <meta property="og:url" content="https://vercellogos-classical.vercel.app/passage/${encodeURIComponent(decodedUrn)}">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
    }
    .card {
      width: 600px;
      padding: 32px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      color: #e8e8e8;
      border-radius: 16px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #f39c12;
    }
    .citation {
      font-size: 14px;
      color: #888;
    }
    .content {
      font-size: 20px;
      line-height: 1.6;
      margin-bottom: 24px;
      font-style: italic;
    }
    .stats {
      display: flex;
      gap: 24px;
      font-size: 14px;
      color: #888;
    }
    .stat {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .stat-value {
      font-weight: bold;
      color: #f39c12;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">LOGOS</div>
      <div class="citation">${passage.work} ${passage.section}</div>
    </div>
    <div class="content">
      ${passage.content.substring(0, 300)}${passage.content.length > 300 ? '...' : ''}
    </div>
    <div class="stats">
      <div class="stat">
        <span class="stat-value">${intertexts?.count || 0}</span>
        <span>intertexts</span>
      </div>
      <div class="stat">
        <span class="stat-value">${entities?.count || 0}</span>
        <span>entities</span>
      </div>
    </div>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Share card error:', error);
    return NextResponse.json(
      { error: 'Failed to generate share card' },
      { status: 500 }
    );
  }
}
