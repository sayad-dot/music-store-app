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

export interface AppState {
  songs: Song[];
  language: string;
  seed: string;
  averageLikes: number;
  displayMode: 'table' | 'gallery';
  currentPage: number;
  isLoading: boolean;
}

export interface GenerationParams {
  seed: string;
  language: string;
  averageLikes: number;
  page: number;
  pageSize: number;
}