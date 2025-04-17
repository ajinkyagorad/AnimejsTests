# AR Metrics Dashboard

A sci-fi themed augmented reality dashboard with real-time visualizations, draggable elements, and theme support.

## Features

- Real-time audio visualization with microphone input
- YouTube music player integration
- Draggable interface elements
- Multiple color themes (Cyan, Matrix, Solar, Minimal)
- Weather display
- Activity tracking
- Mood tracking
- Connection status
- Particle effects
- Responsive design

## Setup

1. Clone the repository
2. Start a local server (e.g., `python -m http.server 8000`)
3. Open `http://localhost:8000` in your browser

## Usage

- Click and drag elements to reposition them
- Click "Start Audio" to enable microphone visualization
- Use the theme selector at the bottom to change colors
- Elements automatically save their positions
- YouTube player supports custom playlists

## Themes

- **Cyan**: Default cyberpunk theme
- **Matrix**: Green hacker aesthetic
- **Solar**: Yellow/orange warm theme
- **Minimal**: Clean white design

## Requirements

- Modern web browser with WebGL support
- Microphone access for audio visualization
- Internet connection for YouTube integration

## Project Structure

```
sci-fi-dashboard/
├── index.html          # Main HTML structure
├── styles.css          # Styling and animations
├── app.js             # Core dashboard functionality
├── audio.js           # Audio visualization
├── particles.js       # Particle effects
├── notifications.js   # Notification system
├── themes.js          # Theme management
└── README.md          # Documentation
```
