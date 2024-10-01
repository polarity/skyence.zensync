# ZEN'SYNC Music Library

## Overview
ZEN'SYNC is a web-based music library application that allows users to browse and play music tracks with a visually appealing interface. It features waveform visualizations for each track and provides metadata such as category, fit, mood, and tempo.

## Features
- Dynamic loading of music files and metadata
- Waveform visualization for each track using WaveSurfer.js
- Play/pause functionality with a custom-styled button
- Responsive design
- Metadata display for each track

## Prerequisites
- PHP 7.0 or higher
- Web server (Apache, Nginx, etc.) or PHP's built-in server
- Modern web browser with JavaScript enabled

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/zensync-music-library.git
   cd zensync-music-library
   ```

2. Ensure your music files (.mp3) and corresponding metadata files (.json) are in the `music/` directory.

3. Start the PHP server:
   ```
   php -S localhost:8000
   ```

4. Open a web browser and navigate to `http://localhost:8000`

## File Structure
- `index.html`: Main HTML file
- `styles.css`: CSS styles
- `script.js`: JavaScript for client-side functionality
- `music.php`: PHP script to serve music data
- `music/`: Directory containing music files (.mp3) and metadata files (.json)

## Add Music
- create the music/ directory and add some mp3 files
- add a json file for every mp3 with the same filename
- every json file looks like this:
   ```{
   "category": "instrumental",
   "fit": "titles, teaser",
   "mood": "melancholy",
   "tempo": "slow"
   }```

## Usage
- Browse the list of tracks displayed on the main page
- Click the play button next to a track to start playback
- View metadata for each track below the waveform

## Customization
- Modify `styles.css` to change the appearance
- Adjust waveform colors and behavior in `script.js`

## Troubleshooting
- Ensure PHP is installed and configured correctly
- Check file permissions for the `music/` directory
- Verify that music files have corresponding .json metadata files

## License
This project is licensed under the MIT License.