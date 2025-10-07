// shared/types.ts
export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  genre: string;
  likes: number;
  coverImage: string;
  audioPreview: string;
  reviews: string[];
  lyrics: string[];
}

export interface GenerationParams {
  seed: string;
  language: string;
  averageLikes: number;
  page: number;
  pageSize: number;
}

export interface MusicConfig {
  languages: LanguageConfig[];
  genres: string[];
}

export interface LanguageConfig {
  code: string;
  name: string;
  data: LanguageData;
}

export interface LanguageData {
  songTitles: string[];
  artistNames: string[];
  albumNames: string[];
  genres: string[];
  reviewTemplates: string[];
}