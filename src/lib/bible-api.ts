import { BibleVerse, ESVResponse } from '@/types/bible';

const ESV_API_TOKEN = '72121e94d268320c67d7303b3393e42ca7e4ae08';
const ESV_API_BASE = 'https://api.esv.org/v3';

export async function fetchVerse(reference: string): Promise<BibleVerse | null> {
  try {
    const response = await fetch(
      `${ESV_API_BASE}/passage/text/?q=${encodeURIComponent(reference)}&include-headings=false&include-footnotes=false&include-verse-numbers=false&include-short-copyright=false&include-passage-references=false`,
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

    // Parse the reference to extract book, chapter, verse
    const referenceMatch = data.canonical.match(/^(.+?)\s+(\d+):(\d+)/);
    if (!referenceMatch) {
      throw new Error('Invalid reference format');
    }

    const [, book, chapter, verse] = referenceMatch;

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