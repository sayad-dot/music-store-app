# 🎵 Music Store Application

A single-page web application that simulates a music store showcase by generating fake song information with reproducible audio.

## ✨ Features

- **Multi-language Support**: English (USA) and German (Germany)
- **Seed-based Generation**: Reproducible random data using 64-bit seeds
- **Dynamic Likes**: Probabilistic like generation with fractional averages (0-10)
- **Dual View Modes**: Table view with pagination & Gallery view with infinite scrolling
- **Audio Generation**: Server-side audio preview generation with musical melodies
- **Expandable Details**: Song details with covers, reviews, and synchronized lyrics
- **Parameter Independence**: Changing parameters doesn't affect unrelated data

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Axios, CSS3
- **Backend**: Node.js, Express, TypeScript, SeedRandom
- **Audio**: Web Audio API with generated WAV files
- **Deployment**: Vercel (Frontend) + Railway (Backend)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/music-store-app.git
   cd music-store-app