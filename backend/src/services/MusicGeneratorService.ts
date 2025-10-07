// backend/src/services/MusicGeneratorService.ts
import seedrandom from 'seedrandom';
import { Song, GenerationParams, LanguageData } from '../types';

export class MusicGeneratorService {
  private languageData: Map<string, LanguageData> = new Map();

  constructor() {
    this.initializeLanguageData();
  }

  private initializeLanguageData() {
    // English data
    this.languageData.set('en-US', {
      songTitles: [
        'Electric Dreams', 'Midnight City', 'Neon Lights', 'Digital Love',
        'Cosmic Dance', 'Urban Legend', 'Silent Storm', 'Echo Chamber',
        'Virtual Reality', 'Chemical Romance', 'Solar Flare', 'Ocean Deep',
        'Mountain High', 'Desert Wind', 'Arctic Circle'
      ],
      artistNames: [
        'The Neon Tigers', 'Electric Pulse', 'Crystal Method', 'Digital Dawn',
        'Solar System', 'Urban Myth', 'Cosmic String', 'Virtual Void',
        'Chemical Brothers', 'Arctic Monkeys', 'Kings of Leon', 'Florence + Machine',
        'Imagine Dragons', 'Arcade Fire', 'Vampire Weekend'
      ],
      albumNames: [
        'Digital Revolution', 'Echoes of Tomorrow', 'Neon Dreams', 'Urban Tales',
        'Cosmic Journey', 'Electric Memories', 'Virtual Landscape', 'Chemical Reactions',
        'Solar Power', 'Ocean Waves', 'Mountain Echoes', 'Desert Sun'
      ],
      genres: [
        'Rock', 'Pop', 'Electronic', 'Hip Hop', 'Jazz', 'Classical',
        'Country', 'R&B', 'Reggae', 'Metal', 'Folk', 'Blues'
      ],
      reviewTemplates: [
        'A masterpiece that transcends genres.',
        'Innovative sound that pushes boundaries.',
        'Emotional journey from start to finish.',
        'Perfect blend of melody and rhythm.',
        'Lyrics that speak to the soul.'
      ]
    });

    // German data
    this.languageData.set('de-DE', {
      songTitles: [
        'Elektrische Träume', 'Mitternachtsstadt', 'Neonlichter', 'Digitale Liebe',
        'Kosmischer Tanz', 'Urbane Legende', 'Stiller Sturm', 'Echo Kammer'
      ],
      artistNames: [
        'Die Neon Tiger', 'Elektrischer Puls', 'Kristall Methode', 'Digitale Dämmerung',
        'Sonnensystem', 'Urbanner Mythos', 'Kosmische Saite', 'Virtuelle Leere'
      ],
      albumNames: [
        'Digitale Revolution', 'Echos von Morgen', 'Neon Träume', 'Urbane Geschichten',
        'Kosmische Reise', 'Elektrische Erinnerungen', 'Virtuelle Landschaft'
      ],
      genres: [
        'Rock', 'Pop', 'Elektronisch', 'Hip Hop', 'Jazz', 'Klassisch',
        'Country', 'R&B', 'Reggae', 'Metal', 'Volksmusik', 'Blues'
      ],
      reviewTemplates: [
        'Ein Meisterwerk, das Genres transzendiert.',
        'Innovativer Sound, der Grenzen verschiebt.',
        'Emotionale Reise von Anfang bis Ende.',
        'Perfekte Mischung aus Melodie und Rhythmus.'
      ]
    });
  }

  generateSongs(params: GenerationParams): Song[] {
    const songs: Song[] = [];
    const languageData = this.languageData.get(params.language) || this.languageData.get('en-US')!;
    
    for (let i = 0; i < params.pageSize; i++) {
      const recordIndex = (params.page - 1) * params.pageSize + i;
      const songSeed = this.combineSeed(params.seed, recordIndex);
      
      const rng = seedrandom(songSeed);
      const title = this.pickRandom(languageData.songTitles, rng);
      const artist = this.pickRandom(languageData.artistNames, rng);
      const album = rng() > 0.3 ? this.pickRandom(languageData.albumNames, rng) : 'Single';
      const genre = this.pickRandom(languageData.genres, rng);
      
      // Generate likes using fractional method
      const likesRng = seedrandom(`likes_${songSeed}`);
      const baseLikes = Math.floor(params.averageLikes);
      const fraction = params.averageLikes - baseLikes;
      let likes = baseLikes;
      if (likesRng() < fraction) {
        likes++;
      }

      // Generate reviews
      const reviewRng = seedrandom(`reviews_${songSeed}`);
      const reviewCount = Math.floor(reviewRng() * 3) + 1; // 1-3 reviews
      const reviews = Array.from({ length: reviewCount }, (_, idx) => {
        const template = this.pickRandom(languageData.reviewTemplates, reviewRng);
        return `${template} ${this.generateReviewText(reviewRng)}`;
      });

      songs.push({
        id: recordIndex + 1,
        title,
        artist,
        album,
        genre,
        likes,
        coverImage: this.generateCoverImage(songSeed, title, artist),
        audioPreview: this.generateAudioPreview(songSeed),
        reviews,
        lyrics: this.generateLyrics(songSeed, languageData)
      });
    }

    return songs;
  }

  private combineSeed(baseSeed: string, index: number): string {
    // Simple MAD operation for combining seed and index
    const prime = 1000003;
    let hash = 0;
    for (let i = 0; i < baseSeed.length; i++) {
      hash = (hash * prime + baseSeed.charCodeAt(i)) >>> 0;
    }
    return `${(hash ^ index * prime) >>> 0}`;
  }

  private pickRandom<T>(array: T[], rng: () => number): T {
    return array[Math.floor(rng() * array.length)];
  }

  private generateCoverImage(seed: string, title: string, artist: string): string {
    const rng = seedrandom(seed);
    const color = Math.floor(rng() * 0xFFFFFF).toString(16).padStart(6, '0');
    const svg = `
      <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${color}"/>
        <text x="50%" y="45%" text-anchor="middle" fill="white" font-family="Arial" font-size="20">${title}</text>
        <text x="50%" y="60%" text-anchor="middle" fill="white" font-family="Arial" font-size="16">${artist}</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }

  private generateAudioPreview(seed: string): string {
    return `data:audio/wav;base64,${this.generateMelody(seed)}`;
  }

  private generateMelody(seed: string): string {
    const rng = seedrandom(seed);
    const duration = 5; // 5 seconds
    const sampleRate = 44100;
    
    // Musical notes in Hz (C major scale)
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // C4 to C5
    const beatsPerSecond = 2; // 2 beats per second
    const totalBeats = duration * beatsPerSecond;
    
    const samples = duration * sampleRate;
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);
    
    // Write WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples * 2, true);
    
    // Generate melody with multiple notes
    let offset = 44;
    const samplesPerBeat = sampleRate / beatsPerSecond;
    
    for (let beat = 0; beat < totalBeats; beat++) {
      const noteIndex = Math.floor(rng() * notes.length);
      const frequency = notes[noteIndex];
      const beatSamples = Math.min(samplesPerBeat, samples - (beat * samplesPerBeat));
      
      for (let i = 0; i < beatSamples; i++) {
        const globalSample = beat * samplesPerBeat + i;
        if (globalSample >= samples) break;
        
        // Add some variation to make it more musical
        const vibrato = 1 + 0.005 * Math.sin(2 * Math.PI * 5 * globalSample / sampleRate);
        const envelope = Math.exp(-0.0005 * (i % samplesPerBeat)); // Simple decay
        const sample = Math.sin(2 * Math.PI * frequency * vibrato * globalSample / sampleRate) * envelope;
        
        // Add some harmonics for richer sound
        const harmonic1 = 0.3 * Math.sin(2 * Math.PI * frequency * 2 * globalSample / sampleRate) * envelope;
        const harmonic2 = 0.2 * Math.sin(2 * Math.PI * frequency * 3 * globalSample / sampleRate) * envelope;
        
        const value = (sample + harmonic1 + harmonic2) * 0.7 * 0x7FFF; // Reduce volume slightly
        view.setInt16(offset, value, true);
        offset += 2;
      }
    }
    
    // Fill remaining samples with silence if any
    while (offset < 44 + samples * 2) {
      view.setInt16(offset, 0, true);
      offset += 2;
    }
    
    return Buffer.from(buffer).toString('base64');
  }

  private generateReviewText(rng: () => number): string {
    const adjectives = ['amazing', 'incredible', 'fantastic', 'wonderful', 'brilliant'];
    const nouns = ['production', 'composition', 'arrangement', 'performance', 'energy'];
    return `The ${this.pickRandom(adjectives, rng)} ${this.pickRandom(nouns, rng)} stands out.`;
  }

  private generateLyrics(seed: string, languageData: LanguageData): string[] {
    const lyricRng = seedrandom(`lyrics_${seed}`);
    const lines = [];
    const lineCount = 8 + Math.floor(lyricRng() * 8); // 8-16 lines
    
    for (let i = 0; i < lineCount; i++) {
      const words = [];
      const wordCount = 3 + Math.floor(lyricRng() * 5); // 3-8 words per line
      
      for (let j = 0; j < wordCount; j++) {
        const word = this.generateLyricWord(lyricRng);
        words.push(word);
      }
      
      lines.push(words.join(' '));
    }
    
    return lines;
  }

  private generateLyricWord(rng: () => number): string {
    const syllables = ['love', 'heart', 'dream', 'light', 'dark', 'fire', 'water', 'earth', 'air', 'time', 'night', 'day', 'sky', 'sea', 'star', 'moon', 'sun', 'rain', 'wind', 'snow'];
    const prefixes = ['be', 're', 'un', 'dis', 'pre', 'for', 'with', 'out'];
    const suffixes = ['ing', 'ed', 'ly', 'ness', 'ment', 'ful', 'less', 'able'];
    
    let word = this.pickRandom(syllables, rng);
    
    if (rng() > 0.7) {
      word = this.pickRandom(prefixes, rng) + word;
    }
    
    if (rng() > 0.7) {
      word = word + this.pickRandom(suffixes, rng);
    }
    
    return word;
  }
}