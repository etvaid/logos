import { NextResponse } from 'next/server';

interface MorphologyData {
    id: number;
    term: string;
    definition: string;
    examples: string[];
}

const mockData: MorphologyData[] = [
    {
        id: 1,
        term: "Morphology",
        definition: "The branch of linguistics that studies the structure of words.",
        examples: ["unhappiness", "cats", "running"]
    },
    {
        id: 2,
        term: "Phoneme",
        definition: "The smallest unit of sound in a language.",
        examples: ["bat", "pat", "mat"]
    },
    {
        id: 3,
        term: "Morpheme",
        definition: "The smallest meaningful unit of language.",
        examples: ["un-", "-ing", "cat"]
    },
    {
        id: 4,
        term: "Syntax",
        definition: "The arrangement of words and phrases to create well-formed sentences.",
        examples: ["The cat sat on the mat.", "She loves coding."]
    },
    {
        id: 5,
        term: "Semantics",
        definition: "The study of meaning in language.",
        examples: ["The word 'bank' can refer to a financial institution or the side of a river."]
    }
];

export async function GET(request: Request) {
    try {
        return NextResponse.json(mockData);
    } catch (error) {
        console.error("Error fetching morphology data:", error);
        return NextResponse.json({ error: "Failed to fetch morphology data." }, { status: 500 });
    }
}