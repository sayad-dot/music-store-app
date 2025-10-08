// backend/src/services/MusicGeneratorService.ts
import seedrandom from 'seedrandom';
import { faker, fakerDE, fakerUK } from '@faker-js/faker';
import { Song, GenerationParams } from '../types';

export class MusicGeneratorService {
  private getFakerInstance(language: string) {
    switch (language) {
      case 'de-DE':
        return fakerDE;
      case 'uk-UA':
        return fakerUK;
      default:
        return faker;
    }
  }

  generateSongs(params: GenerationParams): Song[] {
    const songs: Song[] = [];
    
    for (let i = 0; i < params.pageSize; i++) {
      const recordIndex = (params.page - 1) * params.pageSize + i;
      const songSeed = this.combineSeed(params.seed, recordIndex);
      
      const fakerInstance = this.getFakerInstance(params.language);
      
      // Seed the faker instance for reproducibility
      fakerInstance.seed(parseInt(songSeed.substring(0, 10), 36));
      
      const title = this.generateSongTitle(fakerInstance);
      const artist = this.generateArtistName(fakerInstance);
      const album = fakerInstance.datatype.boolean(0.7) ? this.generateAlbumName(fakerInstance) : 'Single';
      const genre = this.generateGenre(fakerInstance);
      
      // Generate likes using fractional method
      const likesRng = seedrandom(`likes_${songSeed}`);
      const baseLikes = Math.floor(params.averageLikes);
      const fraction = params.averageLikes - baseLikes;
      let likes = baseLikes;
      if (likesRng() < fraction) {
        likes++;
      }

      // Generate reviews with proper seeding
      const reviewRng = seedrandom(`reviews_${songSeed}`);
      const reviewCount = Math.floor(reviewRng() * 3) + 1;
      const reviews = Array.from({ length: reviewCount }, (_, idx) => 
        this.generateReview(fakerInstance, reviewRng)
      );

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
        lyrics: this.generateLyrics(fakerInstance, songSeed)
      });
    }

    return songs;
  }

  private combineSeed(baseSeed: string, index: number): string {
    const prime = 1000003;
    let hash = 0;
    for (let i = 0; i < baseSeed.length; i++) {
      hash = (hash * prime + baseSeed.charCodeAt(i)) >>> 0;
    }
    return `${(hash ^ index * prime) >>> 0}`;
  }

  private generateSongTitle(fakerInstance: any): string {
    const patterns = [
      () => `${fakerInstance.word.adjective()} ${fakerInstance.word.noun()}`,
      () => `${fakerInstance.word.noun()} ${fakerInstance.word.preposition()} ${fakerInstance.word.noun()}`,
      () => `${fakerInstance.word.verb()}ing ${fakerInstance.word.adverb()}`,
      () => `${fakerInstance.word.adjective()} ${fakerInstance.word.noun()} ${fakerInstance.word.noun()}`,
      () => `${fakerInstance.word.noun()} ${fakerInstance.number.int({ min: 1, max: 100 })}`,
      () => `The ${fakerInstance.word.adjective()} ${fakerInstance.word.noun()}`,
    ];
    
    const pattern = fakerInstance.helpers.arrayElement(patterns);
    return this.capitalize(pattern());
  }

  private generateArtistName(fakerInstance: any): string {
    const patterns = [
      () => fakerInstance.person.fullName(),
      () => `${fakerInstance.person.firstName()} ${fakerInstance.person.lastName()}`,
      () => `The ${fakerInstance.word.adjective()} ${fakerInstance.word.noun()}s`,
      () => `${fakerInstance.word.adjective()} ${fakerInstance.word.noun()}`,
      () => `${fakerInstance.person.firstName()} and the ${fakerInstance.word.noun()}s`,
      () => `${fakerInstance.word.noun()} ${fakerInstance.word.noun()}`,
    ];
    
    const pattern = fakerInstance.helpers.arrayElement(patterns);
    return this.capitalize(pattern());
  }

  private generateAlbumName(fakerInstance: any): string {
    const patterns = [
      () => `${fakerInstance.word.adjective()} ${fakerInstance.word.noun()}`,
      () => `${fakerInstance.word.noun()} ${fakerInstance.word.preposition()} ${fakerInstance.word.noun()}`,
      () => `The ${fakerInstance.word.adjective()} ${fakerInstance.word.noun()}`,
      () => fakerInstance.company.catchPhrase(),
      () => `${fakerInstance.word.noun()}s ${fakerInstance.word.preposition()} ${fakerInstance.word.noun()}`,
    ];
    
    const pattern = fakerInstance.helpers.arrayElement(patterns);
    return this.capitalize(pattern());
  }

  private generateGenre(fakerInstance: any): string {
    // Use Faker's music genre when available, fallback to creative combinations
    try {
      return fakerInstance.music.genre();
    } catch {
      const genres = [
        'Rock', 'Pop', 'Electronic', 'Hip Hop', 'Jazz', 'Classical',
        'Country', 'R&B', 'Reggae', 'Metal', 'Folk', 'Blues'
      ];
      const baseGenre = fakerInstance.helpers.arrayElement(genres);
      const prefixes = ['Alternative', 'Indie', 'Experimental', 'Progressive', 'Acoustic'];
      const suffixes = ['Fusion', 'Core', 'Wave', 'Rock', 'Pop'];
      
      if (fakerInstance.datatype.boolean()) {
        return `${fakerInstance.helpers.arrayElement(prefixes)} ${baseGenre}`;
      }
      return baseGenre;
    }
  }

  private generateReview(fakerInstance: any, rng: () => number): string {
    const templates = [
      () => `${fakerInstance.word.adjective()} ${fakerInstance.word.noun()} with ${fakerInstance.word.adjective()} ${fakerInstance.word.noun()}.`,
      () => `${fakerInstance.hacker.phrase()}`,
      () => `${fakerInstance.company.catchPhrase()}`,
      () => `The ${fakerInstance.word.adjective()} ${fakerInstance.word.noun()} really ${fakerInstance.word.verb()}s.`,
      () => `${fakerInstance.word.adjective().charAt(0).toUpperCase() + fakerInstance.word.adjective().slice(1)} performance throughout!`,
    ];
    
    const template = fakerInstance.helpers.arrayElement(templates);
    return this.capitalize(template());
  }

  private generateLyrics(fakerInstance: any, seed: string): string[] {
    const lyricRng = seedrandom(`lyrics_${seed}`);
    const lineCount = 8 + Math.floor(lyricRng() * 8);
    const lines: string[] = [];
    
    for (let i = 0; i < lineCount; i++) {
      const wordCount = 3 + Math.floor(lyricRng() * 5);
      const words: string[] = [];
      
      for (let j = 0; j < wordCount; j++) {
        const wordTypes = [
          () => fakerInstance.word.noun(),
          () => fakerInstance.word.verb(),
          () => fakerInstance.word.adjective(),
          () => fakerInstance.word.adverb(),
        ];
        
        const wordType = fakerInstance.helpers.arrayElement(wordTypes);
        words.push(wordType());
      }
      
      lines.push(this.capitalize(words.join(' ')));
    }
    
    return lines;
  }

  private capitalize(str: string): string {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  private generateCoverImage(seed: string, title: string, artist: string): string {
    const rng = seedrandom(seed);
    const hue = Math.floor(rng() * 360);
    const saturation = 60 + Math.floor(rng() * 40);
    const lightness = 40 + Math.floor(rng() * 30);
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    // Generate a second color for gradient
    const hue2 = (hue + 60 + Math.floor(rng() * 120)) % 360;
    const color2 = `hsl(${hue2}, ${saturation}%, ${lightness}%)`;
    
    // Truncate text to fit
    const maxTitleLength = 25;
    const maxArtistLength = 20;
    const truncatedTitle = title.length > maxTitleLength ? title.substring(0, maxTitleLength) + '...' : title;
    const truncatedArtist = artist.length > maxArtistLength ? artist.substring(0, maxArtistLength) + '...' : artist;
    
    const svg = `
      <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad${seed}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad${seed})"/>
        <circle cx="${150 + (rng() - 0.5) * 100}" cy="${150 + (rng() - 0.5) * 100}" r="${30 + rng() * 50}" fill="rgba(255,255,255,0.1)"/>
        <circle cx="${150 + (rng() - 0.5) * 100}" cy="${150 + (rng() - 0.5) * 100}" r="${20 + rng() * 40}" fill="rgba(255,255,255,0.1)"/>
        <rect x="20" y="110" width="260" height="80" fill="rgba(0,0,0,0.6)" rx="8"/>
        <text x="150" y="145" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="18" font-weight="bold">${truncatedTitle}</text>
        <text x="150" y="170" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="14">${truncatedArtist}</text>
      </svg>
    `;
    
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }

  private generateAudioPreview(seed: string): string {
    return `data:audio/wav;base64,${this.generateMelody(seed)}`;
  }

  private generateMelody(seed: string): string {
    const rng = seedrandom(seed);
    const duration = 5;
    const sampleRate = 44100;
    
    // Musical notes in Hz (pentatonic scale for better sound)
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C, D, E, G, A, C
    const beatsPerSecond = 2;
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
    
    let offset = 44;
    const samplesPerBeat = sampleRate / beatsPerSecond;
    
    for (let beat = 0; beat < totalBeats; beat++) {
      const noteIndex = Math.floor(rng() * notes.length);
      const frequency = notes[noteIndex];
      const beatSamples = Math.min(samplesPerBeat, samples - (beat * samplesPerBeat));
      
      for (let i = 0; i < beatSamples; i++) {
        const globalSample = beat * samplesPerBeat + i;
        if (globalSample >= samples) break;
        
        const vibrato = 1 + 0.005 * Math.sin(2 * Math.PI * 5 * globalSample / sampleRate);
        const envelope = Math.exp(-0.001 * (i % samplesPerBeat));
        const sample = Math.sin(2 * Math.PI * frequency * vibrato * globalSample / sampleRate) * envelope;
        const harmonic1 = 0.3 * Math.sin(2 * Math.PI * frequency * 2 * globalSample / sampleRate) * envelope;
        const harmonic2 = 0.2 * Math.sin(2 * Math.PI * frequency * 3 * globalSample / sampleRate) * envelope;
        const value = (sample + harmonic1 + harmonic2) * 0.7 * 0x7FFF;
        view.setInt16(offset, value, true);
        offset += 2;
      }
    }
    
    while (offset < 44 + samples * 2) {
      view.setInt16(offset, 0, true);
      offset += 2;
    }
    
    return Buffer.from(buffer).toString('base64');
  }
}