export interface BibleVerse {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verse: number;
}

export interface ESVResponse {
  passages: string[];
  canonical: string;
}

export type SnippetTheme = 'code' | 'scripture' | 'modern' | 'minimal';

export interface SnippetCustomization {
  theme: SnippetTheme;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  alignment: 'left' | 'center' | 'right';
  showFilename: boolean;
  fontFamily: string;
  backgroundColor?: string;
  textColor?: string;
  backgroundImage?: string;
}