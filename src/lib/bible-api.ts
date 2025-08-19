import { BibleVerse, ESVResponse } from '@/types/bible';

const ESV_API_TOKEN = '72121e94d268320c67d7303b3393e42ca7e4ae08';
const ESV_API_BASE = 'https://api.esv.org/v3';

// Normalize common user inputs like "John 3 16" -> "John 3:16"
function normalizeReference(input: string): string {
  const ref = input.trim().replace(/\s+/g, ' ');
  if (ref.includes(':')) return ref;
  const match = ref.match(/^(.+?)\s+(\d+)\s+(\d+(?:[–-]\d+)?)$/);
  if (match) {
    const [, book, chapter, verses] = match;
    return `${book} ${chapter}:${verses}`;
  }
  return ref;
}

export async function fetchVerse(reference: string): Promise<BibleVerse | null> {
  try {
    const normalized = normalizeReference(reference);
    const response = await fetch(
      `${ESV_API_BASE}/passage/text/?q=${encodeURIComponent(normalized)}&include-headings=false&include-footnotes=false&include-verse-numbers=false&include-short-copyright=false&include-passage-references=false`,
      {
        headers: {
          'Authorization': `Token ${ESV_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch verse');
    }

    const data: ESVResponse = await response.json();
    
    if (!data.passages || data.passages.length === 0) {
      return null;
    }

    // Parse the reference to extract book, chapter, verse (fallback to chapter-only)
    const referenceMatch = data.canonical.match(/^(.+?)\s+(\d+):(\d+)/);
    let book: string, chapter: string, verse: string;
    if (referenceMatch) {
      [, book, chapter, verse] = referenceMatch;
    } else {
      const chapterOnly = data.canonical.match(/^(.+?)\s+(\d+)$/);
      if (chapterOnly) {
        [, book, chapter] = chapterOnly;
        verse = '1';
      } else {
        throw new Error('Invalid reference format');
      }
    }

    return {
      reference: data.canonical,
      text: data.passages[0].trim(),
      book,
      chapter: parseInt(chapter),
      verse: parseInt(verse),
    };
  } catch (error) {
    console.error('Error fetching verse:', error);
    return null;
  }
}

export async function fetchRandomVerse(): Promise<BibleVerse | null> {
  // Popular verses for random selection
  const popularVerses = [
    'John 3:16',
    'Jeremiah 29:11',
    'Romans 8:28',
    'Philippians 4:13',
    'Psalm 23:1',
    'Isaiah 41:10',
    'Matthew 28:20',
    'Proverbs 3:5-6',
    'Romans 8:38-39',
    'Ephesians 2:8-9',
  ];

  const randomReference = popularVerses[Math.floor(Math.random() * popularVerses.length)];
  return fetchVerse(randomReference);
}