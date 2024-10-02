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

  const downloadLink = document.createElement('a')
  downloadLink.className = 'download-link'
  downloadLink.href = music.file
  downloadLink.download = music.title
  downloadLink.textContent = "🠋"

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

  const playButton = document.createElement('button')
  playButton.setAttribute('data-playing', 'false')
  playButton.addEventListener('click', () => {
    if (currentlyPlaying && currentlyPlaying !== wavesurfer) {
      currentlyPlaying.pause()
      currentlyPlaying.playButton.setAttribute('data-playing', 'false')
    }

    if (wavesurfer.isPlaying()) {
      wavesurfer.pause()
      playButton.setAttribute('data-playing', 'false')
      currentlyPlaying = null
    } else {
      wavesurfer.play()
      playButton.setAttribute('data-playing', 'true')
      currentlyPlaying = wavesurfer
      currentlyPlaying.playButton = playButton
    }
  })
  player.appendChild(playButton)
  player.appendChild(waveform)
  player.appendChild(downloadLink)

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

// Add this function to sort the music items
function sortMusicItems (criteria, order) {
  const musicList = document.getElementById('music-list')
  const items = Array.from(musicList.children)

  items.sort((a, b) => {
    let valueA, valueB
    if (criteria === 'title') {
      valueA = a.querySelector('h3').textContent
      valueB = b.querySelector('h3').textContent
    } else if (criteria === 'category') {
      valueA = a.querySelector('.tag-border-filled').textContent
      valueB = b.querySelector('.tag-border-filled').textContent
    } else {
      valueA = a.querySelector(`.tag-border:nth-of-type(${getCriteriaIndex(criteria)}) + .tag`).textContent
      valueB = b.querySelector(`.tag-border:nth-of-type(${getCriteriaIndex(criteria)}) + .tag`).textContent
    }

    if (order === 'asc') {
      return valueA.localeCompare(valueB)
    } else {
      return valueB.localeCompare(valueA)
    }
  })

  items.forEach(item => musicList.appendChild(item))
}

function getCriteriaIndex (criteria) {
  switch (criteria) {
    case 'fit':
      return 1
    case 'mood':
      return 2
    case 'tempo':
      return 3
    default:
      return 1
  }
}

// Add event listeners for the sorting controls
document.getElementById('sort-by').addEventListener('change', updateSort)
document.getElementById('sort-order').addEventListener('change', updateSort)

function updateSort () {
  const criteria = document.getElementById('sort-by').value
  const order = document.getElementById('sort-order').value
  const filterCriteria = document.getElementById('filter-by').value

  sortMusicItems(criteria, order)
  filterMusicItems(filterCriteria)
}

// Add event listener for the filter control
document.getElementById('filter-by').addEventListener('change', updateSort)

// Modify the existing code to include initial filtering
fetch('music.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(createMusicItem)
    // Initial sort and filter
    updateSort()
    // Populate mood options
    populateMoodOptions(data)
  })
  .catch(error => console.error('Error:', error))

// Add this function to populate mood options
function populateMoodOptions (data) {
  const moodSet = new Set()
  data.forEach(item => moodSet.add(item.mood))

  const filterSelect = document.getElementById('filter-by')
  const moodOptgroup = document.createElement('optgroup')
  moodOptgroup.label = 'Stimmung'
  moodSet.forEach(mood => {
    const option = document.createElement('option')
    option.value = mood
    option.textContent = mood
    moodOptgroup.appendChild(option)
  })

  filterSelect.appendChild(moodOptgroup)
}

// Add this function to filter music items
function filterMusicItems (filterCriteria) {
  const musicList = document.getElementById('music-list')
  const items = Array.from(musicList.children)

  items.forEach(item => {
    if (filterCriteria === 'all') {
      item.style.display = 'block'
    } else if (filterCriteria === 'instrumental' || filterCriteria === 'vocal') {
      const category = item.querySelector('.tag-border-filled').textContent.toLowerCase()
      item.style.display = category === filterCriteria ? 'block' : 'none'
    }
  })
}
