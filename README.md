# Wood Block Puzzle Game

A beautiful, wood-themed block puzzle game built with HTML5, CSS3, and JavaScript. Inspired by classic block puzzle games like Tetris, this game features intuitive drag-and-drop mechanics, satisfying sound effects, and a warm wooden aesthetic.

## Features

### Core Gameplay
- **3 Block System**: Always have 3 random blocks available at the bottom
- **Drag & Drop**: Intuitive placement with visual preview
- **Smart Placement**: Intelligent collision detection and positioning
- **Line Clearing**: Complete rows or columns to score points
- **Progressive Difficulty**: New blocks generate when current ones are used

### Visual Design
- **Wood Theme**: Beautiful wooden textures and warm color palette
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: Polished visual feedback for all interactions
- **Grid System**: Clean 10x10 grid with wood grain effects

### Audio Experience
- **Ambient Music**: Relaxing background music with wood-themed tones
- **Sound Effects**: Satisfying audio feedback for block placement and line clearing
- **Audio Controls**: Toggle music and sound effects independently

### Game Features
- **Scoring System**: Points awarded for line completions
- **Leaderboard**: Top 5 scores saved locally
- **Game Over Detection**: Intelligent detection when no moves are possible
- **Restart Functionality**: Easy game restart with preserved leaderboard

## How to Play

1. **Drag Blocks**: Click and drag blocks from the bottom row to the game board
2. **Place Strategically**: Position blocks to complete full rows or columns
3. **Clear Lines**: When a row or column is full, it clears and you score points
4. **Continue Playing**: New blocks appear when you use all current ones
5. **Avoid Game Over**: The game ends when no valid placements remain

## Installation & Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for audio generation)

### Quick Start
1. Clone or download this repository
2. Generate audio files (optional):
   ```bash
   python generate_audio.py
   ```
3. Open `index.html` in your web browser
4. Start playing!

### File Structure
```
wood-block-puzzle/
├── index.html          # Main game file
├── styles.css          # Wood-themed styling
├── game.js            # Game logic and mechanics
├── generate_audio.py  # Audio file generator
├── assets/            # Audio files
│   ├── ambient-wood.wav
│   ├── block-place.wav
│   └── line-clear.wav
└── README.md          # This file
```

## Technical Details

### Game Mechanics
- **Grid System**: 10x10 grid with collision detection
- **Block Shapes**: 30+ different block configurations
- **Placement Algorithm**: Intelligent positioning with preview
- **Line Detection**: Automatic row/column completion detection
- **Score Calculation**: 100 points per line cleared

### Technologies Used
- **HTML5 Canvas**: For game board rendering
- **CSS3**: Advanced styling with gradients and animations
- **Vanilla JavaScript**: No external dependencies
- **Web Audio API**: For sound effects and music
- **Local Storage**: For leaderboard persistence

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization

### Adding New Block Shapes
Edit the `getBlockShapes()` method in `game.js` to add new block configurations.

### Modifying Audio
Replace the generated WAV files in the `assets/` folder with your own audio files.

### Styling Changes
Modify `styles.css` to change colors, fonts, or layout. The wood theme uses CSS gradients and can be easily customized.

## Development

### Audio Generation
The included Python script generates placeholder audio files using NumPy and the wave module. For production, consider using professional audio assets.

### Performance Optimization
- Canvas rendering is optimized for smooth 60fps gameplay
- Audio files are preloaded for instant playback
- Local storage is used efficiently for leaderboard data

## Future Enhancements

Potential features for future versions:
- Multiple difficulty levels
- Special block types (bombs, wildcards)
- Power-ups and bonuses
- Multiplayer mode
- Achievement system
- Particle effects for line clearing

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the game!

---

Enjoy playing Wood Block Puzzle! 🧩🌳
