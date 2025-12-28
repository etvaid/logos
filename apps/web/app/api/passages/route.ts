import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const author = searchParams.get('author') || '';
    const work = searchParams.get('work') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Mock data for now
    const data = {
      passages: [
        {
          id: '1',
          author: 'Homer',
          work: 'Iliad',
          book: '1',
          lines: '1-7',
          greek: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε, πολλὰς δ᾽ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν ἡρώων, αὐτοὺς δὲ ἑλώρια τεῦχε κύνεσσιν οἰωνοῖσί τε πᾶσι, Διὸς δ᾽ ἐτελείετο βουλή, ἐξ οὗ δὴ τὰ πρῶτα διαστήτην ἐρίσαντε Ἀτρεΐδης τε ἄναξ ἀνδρῶν καὶ δῖος Ἀχιλλεύς.',
          translation: 'Sing, goddess, of the rage of Achilles son of Peleus, the destructive rage that brought countless sorrows upon the Achaeans, and hurled many mighty souls of heroes down to Hades, making their bodies prey for dogs and all birds, and the will of Zeus was fulfilled, from the time when first they stood apart in strife Atreus\' son, lord of men, and godlike Achilles.',
          tags: ['epic', 'hero', 'war']
        },
        {
          id: '2',
          author: 'Virgil',
          work: 'Aeneid',
          book: '1',
          lines: '1-4',
          latin: 'Arma virumque cano, Troiae qui primus ab oris Italiam, fato profugus, Laviniaque venit litora, multum ille et terris iactatus et alto vi superum saevae memorem Iunonis ob iram',
          translation: 'I sing of arms and the man who first from the shores of Troy came, exiled by fate, to Italy and Lavinian shores—much buffeted he on sea and land by the power of the gods, because of fierce Juno\'s never-forgetting anger.',
          tags: ['epic', 'hero', 'journey']
        },
        {
          id: '3',
          author: 'Plato',
          work: 'Republic',
          book: '7',
          lines: '514a-515a',
          greek: 'μετὰ ταῦτα δή, εἶπον, ἀπείκασον τοιούτῳ πάθει τὴν ἡμετέραν φύσιν παιδείας τε πέρι καὶ ἀπαιδευσίας. ἰδὲ γὰρ ἀνθρώπους οἷον ἐν καταγείῳ οἰκήσει σπηλαιώδει',
          translation: 'Next, I said, compare our nature in respect of education and its lack to such an experience as this. Picture men dwelling in a sort of subterranean cavern with a long entrance open to the light on its entire width.',
          tags: ['philosophy', 'allegory', 'knowledge']
        },
        {
          id: '4',
          author: 'Cicero',
          work: 'De Officiis',
          book: '1',
          lines: '44',
          latin: 'Omnium autem rerum nec utilius quicquam nec pulchrius temperantia et modestia et aequalitas et pudor.',
          translation: 'But of all things nothing is more useful or more beautiful than temperance and modesty and equality and shame.',
          tags: ['philosophy', 'ethics', 'virtue']
        },
        {
          id: '5',
          author: 'Sophocles',
          work: 'Oedipus Rex',
          lines: '1-3',
          greek: 'ὦ τέκνα, Κάδμου τοῦ πάλαι νέα τροφή, τίνας ποθ᾽ ἕδρας τάσδε μοι θοάζετε ἱκτηρίοις κλάδοισι κοσμηθέντες;',
          translation: 'O children, latest born to Cadmus who was of old, why sit ye before me thus with wreathed branches of suppliants?',
          tags: ['tragedy', 'drama', 'fate']
        }
      ],
      total: 127,
      page: 1,
      limit: limit
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to search passages' }, { status: 500 });
  }
}