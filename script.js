/**
 * @fileoverview This file contains the JavaScript code for the ZEN'SYNC music library.
 * It fetches the music list from the server, renders the music list, creates music items,
 * and handles the play/pause functionality.
 */

/**
 * Initialize the music library
 * @returns {void}
 */ 
document.addEventListener('DOMContentLoaded', () => {
  fetchMusicList()
})

let currentlyPlaying = null

/**
 * Fetch the music list from the server
 * @returns {void}
 */
function fetchMusicList () {
  fetch('music.php')
    .then(response => response.json())
    .then(data => {
      renderMusicList(data)
    })
    .catch(error => console.error('Error:', error))
}

/**
 * Render the music list
 * @param {Array} musicList - The music list to render
 * @returns {void}
 */
function renderMusicList (musicList) {
  const musicListElement = document.getElementById('music-list')
  musicList.forEach(music => {
    const musicItem = createMusicItem(music)
    musicListElement.appendChild(musicItem)
  })
}

/**
 * Create a music item
 * @param {Object} music - The music object
 * @returns {HTMLElement} - The music item
 */
function createMusicItem (music) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  // Define the waveform gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
  gradient.addColorStop(0, '#EE772F') // Top color
  gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
  gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
  gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
  gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
  gradient.addColorStop(1, '#F6B094') // Bottom color

  // Define the progress gradient
  const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
  progressGradient.addColorStop(0, '#656666') // Top color
  progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
  progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
  progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
  progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
  progressGradient.addColorStop(1, '#B1B1B1') // Bottom color

  const item = document.createElement('div')
  item.className = 'music-item'

  const title = document.createElement('h3')
  title.className = 'music-title'
  title.textContent = music.title
  item.appendChild(title)

  const player = document.createElement('div')
  player.className = 'player'
  item.appendChild(player)

  const waveform = document.createElement('div')
  waveform.className = 'waveform'
  player.appendChild(waveform)

  /**
   * Create a WaveSurfer instance
   * @returns {void}
   */
  const wavesurfer = WaveSurfer.create({
    container: waveform,
    waveColor: gradient,
    progressColor: progressGradient,
    responsive: true,
    height: 100,
    barWidth: 2
  })

  /**
   * Load the music file
   * @returns {void}
   */
  wavesurfer.load(music.file)

  const playButton = document.createElement('button');
  playButton.setAttribute('data-playing', 'false');
  playButton.addEventListener('click', () => {
    if (currentlyPlaying && currentlyPlaying !== wavesurfer) {
      currentlyPlaying.pause();
      currentlyPlaying.playButton.setAttribute('data-playing', 'false');
    }

    if (wavesurfer.isPlaying()) {
      wavesurfer.pause();
      playButton.setAttribute('data-playing', 'false');
      currentlyPlaying = null;
    } else {
      wavesurfer.play();
      playButton.setAttribute('data-playing', 'true');
      currentlyPlaying = wavesurfer;
      currentlyPlaying.playButton = playButton;
    }
  });
  player.appendChild(playButton);

  /**
   * Create the metadata
   * @returns {void}
   */
  const metadata = document.createElement('div')
  metadata.className = 'metadata'
  metadata.innerHTML = `
    <p><span class="tag-border-filled">${music.category}</span></p>
    <p><span class="tag-border">fit</span><span class="tag">${music.fit}</span></p>
    <p><span class="tag-border">mood</span><span class="tag">${music.mood}</span></p>
    <p><span class="tag-border">tempo</span><span class="tag">${music.tempo}</span></p>
  `
  item.appendChild(metadata)
  return item
}