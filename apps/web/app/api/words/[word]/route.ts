import { NextResponse } from 'next/server';

interface WordInfo {
    id: number;
    word: string;
    definition: string;
    language: 'Greek' | 'Latin';
    example: string;
}

const mockData: WordInfo[] = [
    {
        id: 1,
        word: 'ἀλήθεια',
        definition: 'Truth, reality, or fact.',
        language: 'Greek',
        example: 'Ἡ ἀλήθεια ἐλευθερώνει. (The truth sets you free.)',
    },
    {
        id: 2,
        word: 'veritas',
        definition: 'Truth, accuracy, or conformity to fact.',
        language: 'Latin',
        example: 'Veritas vos liberabit. (The truth will set you free.)',
    },
    {
        id: 3,
        word: 'φιλία',
        definition: 'Friendship, affection, or love.',
        language: 'Greek',
        example: 'Ἡ φιλία εἶναι ὀὐσία τῆς ζωῆς. (Friendship is the essence of life.)',
    },
    {
        id: 4,
        word: 'amor',
        definition: 'Love, affection, or desire.',
        language: 'Latin',
        example: 'Amor vincit omnia. (Love conquers all.)',
    },
];

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const wordId = url.searchParams.get('id');

        if (!wordId) {
            return NextResponse.json(
                { error: 'Word ID is required' },
                { status: 400 }
            );
        }

        const id = parseInt(wordId);
        const wordInfo = mockData.find((word) => word.id === id);

        if (!wordInfo) {
            return NextResponse.json(
                { error: 'Word not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(wordInfo);
    } catch (error) {
        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}