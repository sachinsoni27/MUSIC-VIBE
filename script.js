// Check if user is logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('jamifyLoggedIn') || sessionStorage.getItem('jamifyLoggedIn');
    const currentUser = JSON.parse(localStorage.getItem('jamifyCurrentUser') || sessionStorage.getItem('jamifyCurrentUser'));

    return { isLoggedIn, currentUser };
}

// Display user info or login button
function updateAuthUI() {
    const { isLoggedIn, currentUser } = checkAuth();
    const navLinks = document.querySelector('.nav-links');

    if (isLoggedIn && currentUser) {
        // Create user menu
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu';
        userMenu.innerHTML = `
            <span style="color: #fff; margin-right: 20px; font-size: 1rem;">Welcome, ${currentUser.fullname}</span>
            <button id="logoutBtn" style="padding: 8px 20px; background: rgb(13, 118, 199); color: #fff; border: none; border-radius: 5px; cursor: pointer; font-size: 1rem;">Logout</button>
        `;
        navLinks.appendChild(userMenu);

        // Add logout functionality
        document.getElementById('logoutBtn').addEventListener('click', function() {
            localStorage.removeItem('jamifyLoggedIn');
            localStorage.removeItem('jamifyCurrentUser');
            sessionStorage.removeItem('jamifyLoggedIn');
            sessionStorage.removeItem('jamifyCurrentUser');
            window.location.reload();
        });
    } else {
        // Create login/signup buttons
        const authButtons = document.createElement('div');
        authButtons.className = 'auth-buttons';
        authButtons.innerHTML = `
            <a href="login.html" style="padding: 8px 20px; background: transparent; color: #fff; border: 2px solid rgb(13, 118, 199); border-radius: 5px; text-decoration: none; margin-right: 10px; font-size: 1rem; transition: all 0.3s ease;">Login</a>
            <a href="signup.html" style="padding: 8px 20px; background: rgb(13, 118, 199); color: #fff; border: none; border-radius: 5px; text-decoration: none; font-size: 1rem; transition: all 0.3s ease;">Sign Up</a>
        `;
        navLinks.appendChild(authButtons);
    }
}

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', updateAuthUI);

var arzkiya = document.querySelector("#song1");
var jhol = document.querySelector("#song2");
var mahiye = document.querySelector("#song3");
var barbaad = document.querySelector("#song4");
var aabaad = document.querySelector("#song5");
var saiyaara = document.querySelector("#song6");


var song1 = document.querySelector("#Arzkiya");
var song2 = document.querySelector("#Jhol");
var song3 = document.querySelector("#Mahiye-Jinna-Sohna");
var song4 = document.querySelector("#Barbaad_aabaad"); 
var song6 = document.querySelector("#Saiyaara");
var song5 = document.querySelector("#Barbaad");

function Playing_song1(){
    song1.play();
    playSelectedSong(song1);
}
function Playing_song2(){
    song2.play();
    playSelectedSong(song2);
}
function Playing_song3(){
    song3.play();
    playSelectedSong(song3);
}
function Playing_song4(){
    song4.play();
    playSelectedSong(song4);
}
function Playing_song5(){
    song5.play();
    playSelectedSong(song5);
}
function Playing_song6(){
    song6.play();
    playSelectedSong(song6);
}
arzkiya.addEventListener("click", Playing_song1);
jhol.addEventListener("click", Playing_song2);
mahiye.addEventListener("click", Playing_song3);
aabaad.addEventListener("click", Playing_song4);
barbaad.addEventListener("click", Playing_song5);
saiyaara.addEventListener("click", Playing_song6);


const allSongs = [song1, song2, song3, song4, song5, song6];

// A single function to handle playing and pausing
function playSelectedSong(selectedSong) {
    // Loop through the list of all songs
    allSongs.forEach(song => {
        // Pause any song that is not the one we want to play
        if (song !== selectedSong) {
            song.pause();
            song.currentTime = 0; // Optional: Reset the paused song to the beginning
        }
    });
 selectedSong.play();
}




// Old player functionality (kept for backward compatibility)
const audioPlayer = document.getElementById('song1');
const playPauseButton = document.getElementById('playPauseButton');

if (playPauseButton && audioPlayer) {
    playPauseButton.addEventListener('click', () => {
      if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.textContent = '⏸';
      } else {
        audioPlayer.pause();
        playPauseButton.textContent = '▶';
      }
    });
}




// Artist Panel for recommended Songs

let ArtistRecom = document.querySelector(".Artist-recom");

var QaydeSe = document.querySelector("#PlaylistSong1");
var playSong = document.querySelector("#recom1");



QaydeSe.addEventListener("click",function(){
  playSong.play();
});


// Music Player Functionality
const mainAudioPlayer = document.getElementById('mainAudioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const likeBtn = document.getElementById('likeBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeIcon = document.getElementById('volumeIcon');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const currentSongTitle = document.getElementById('currentSongTitle');
const currentSongArtist = document.getElementById('currentSongArtist');
const playerThumbnail = document.getElementById('playerThumbnail');

let currentSongData = {
    src: '',
    title: 'No song playing',
    artist: 'Select a song to play',
    thumbnail: ''
};

let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one

// Play song from card
function playFromCard(src, title, artist, thumbnail) {
    currentSongData = { src, title, artist, thumbnail };

    mainAudioPlayer.src = src;
    currentSongTitle.textContent = title;
    currentSongArtist.textContent = artist;
    playerThumbnail.style.backgroundImage = `url('${thumbnail}')`;

    mainAudioPlayer.play();
    isPlaying = true;
    updatePlayPauseButton();
}

// Play/Pause toggle
if (playPauseBtn) {
    playPauseBtn.addEventListener('click', function() {
        if (mainAudioPlayer.src) {
            if (isPlaying) {
                mainAudioPlayer.pause();
                isPlaying = false;
            } else {
                mainAudioPlayer.play();
                isPlaying = true;
            }
            updatePlayPauseButton();
        }
    });
}

function updatePlayPauseButton() {
    const icon = playPauseBtn.querySelector('i');
    if (isPlaying) {
        icon.className = 'fa-solid fa-pause';
    } else {
        icon.className = 'fa-solid fa-play';
    }
}

// Update progress bar
if (mainAudioPlayer) {
    mainAudioPlayer.addEventListener('timeupdate', function() {
        const progress = (mainAudioPlayer.currentTime / mainAudioPlayer.duration) * 100;
        progressBar.style.width = `${progress}%`;

        currentTimeEl.textContent = formatTime(mainAudioPlayer.currentTime);
        totalTimeEl.textContent = formatTime(mainAudioPlayer.duration);
    });

    mainAudioPlayer.addEventListener('ended', function() {
        if (repeatMode === 2) {
            mainAudioPlayer.currentTime = 0;
            mainAudioPlayer.play();
        } else {
            isPlaying = false;
            updatePlayPauseButton();
        }
    });
}

// Seek functionality
if (progressContainer) {
    progressContainer.addEventListener('click', function(e) {
        if (mainAudioPlayer.src) {
            const width = this.clientWidth;
            const clickX = e.offsetX;
            const duration = mainAudioPlayer.duration;

            mainAudioPlayer.currentTime = (clickX / width) * duration;
        }
    });
}

// Volume control
if (volumeSlider) {
    volumeSlider.addEventListener('input', function() {
        mainAudioPlayer.volume = this.value / 100;
        updateVolumeIcon(this.value);
    });

    // Set initial volume
    mainAudioPlayer.volume = 0.7;
}

if (volumeIcon) {
    volumeIcon.addEventListener('click', function() {
        if (mainAudioPlayer.volume > 0) {
            mainAudioPlayer.volume = 0;
            volumeSlider.value = 0;
            updateVolumeIcon(0);
        } else {
            mainAudioPlayer.volume = 0.7;
            volumeSlider.value = 70;
            updateVolumeIcon(70);
        }
    });
}

function updateVolumeIcon(volume) {
    const icon = volumeIcon.querySelector('i');
    if (volume == 0) {
        icon.className = 'fa-solid fa-volume-xmark';
    } else if (volume < 50) {
        icon.className = 'fa-solid fa-volume-low';
    } else {
        icon.className = 'fa-solid fa-volume-high';
    }
}

// Like button
if (likeBtn) {
    likeBtn.addEventListener('click', function() {
        this.classList.toggle('active');
    });
}

// Shuffle button
if (shuffleBtn) {
    shuffleBtn.addEventListener('click', function() {
        isShuffle = !isShuffle;
        this.classList.toggle('active');
    });
}

// Repeat button
if (repeatBtn) {
    repeatBtn.addEventListener('click', function() {
        repeatMode = (repeatMode + 1) % 3;
        const icon = this.querySelector('i');

        if (repeatMode === 0) {
            this.classList.remove('active');
            icon.className = 'fa-solid fa-repeat';
        } else if (repeatMode === 1) {
            this.classList.add('active');
            icon.className = 'fa-solid fa-repeat';
        } else {
            this.classList.add('active');
            icon.className = 'fa-solid fa-repeat-1';
        }
    });
}

// Format time helper
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// ==================== PLAYLIST FUNCTIONALITY ====================

// Playlist data structure
let playlists = JSON.parse(localStorage.getItem('jamifyPlaylists')) || [];
let currentSongToAdd = null;
let currentPlaylistId = null;

// Initialize playlists on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 Initializing playlist functionality...');
    renderPlaylists();
    setupPlaylistEventListeners();
    console.log('✅ Playlist functionality loaded!');
});

// Setup event listeners for playlist modals
function setupPlaylistEventListeners() {
    // Create playlist modal
    const createPlaylistBtn = document.getElementById('createPlaylistBtn');
    const createModal = document.getElementById('createPlaylistModal');
    const closeCreateModal = document.getElementById('closeCreateModal');
    const cancelCreateBtn = document.getElementById('cancelCreateBtn');
    const confirmCreateBtn = document.getElementById('confirmCreateBtn');

    if (createPlaylistBtn) {
        createPlaylistBtn.addEventListener('click', () => {
            createModal.classList.add('active');
        });
    }

    if (closeCreateModal) {
        closeCreateModal.addEventListener('click', () => {
            createModal.classList.remove('active');
            clearCreatePlaylistForm();
        });
    }

    if (cancelCreateBtn) {
        cancelCreateBtn.addEventListener('click', () => {
            createModal.classList.remove('active');
            clearCreatePlaylistForm();
        });
    }

    if (confirmCreateBtn) {
        confirmCreateBtn.addEventListener('click', createPlaylist);
    }

    // Add to playlist modal
    const addModal = document.getElementById('addToPlaylistModal');
    const closeAddModal = document.getElementById('closeAddModal');
    const cancelAddBtn = document.getElementById('cancelAddBtn');

    if (closeAddModal) {
        closeAddModal.addEventListener('click', () => {
            addModal.classList.remove('active');
        });
    }

    if (cancelAddBtn) {
        cancelAddBtn.addEventListener('click', () => {
            addModal.classList.remove('active');
        });
    }

    // Playlist details modal
    const detailsModal = document.getElementById('playlistDetailsModal');
    const closeDetailsModal = document.getElementById('closeDetailsModal');
    const closePlaylistDetailsBtn = document.getElementById('closePlaylistDetailsBtn');
    const deletePlaylistBtn = document.getElementById('deletePlaylistBtn');

    if (closeDetailsModal) {
        closeDetailsModal.addEventListener('click', () => {
            detailsModal.classList.remove('active');
        });
    }

    if (closePlaylistDetailsBtn) {
        closePlaylistDetailsBtn.addEventListener('click', () => {
            detailsModal.classList.remove('active');
        });
    }

    if (deletePlaylistBtn) {
        deletePlaylistBtn.addEventListener('click', deleteCurrentPlaylist);
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

// Create new playlist
function createPlaylist() {
    const nameInput = document.getElementById('playlistNameInput');
    const descInput = document.getElementById('playlistDescInput');

    const name = nameInput.value.trim();
    const description = descInput.value.trim();

    if (!name) {
        alert('Please enter a playlist name');
        return;
    }

    const newPlaylist = {
        id: Date.now().toString(),
        name: name,
        description: description || 'No description',
        songs: [],
        createdAt: new Date().toISOString()
    };

    playlists.push(newPlaylist);
    savePlaylistsToStorage();
    renderPlaylists();

    // Close modal and clear form
    document.getElementById('createPlaylistModal').classList.remove('active');
    clearCreatePlaylistForm();

    showNotification('Playlist created successfully!', 'success');
}

// Clear create playlist form
function clearCreatePlaylistForm() {
    document.getElementById('playlistNameInput').value = '';
    document.getElementById('playlistDescInput').value = '';
}

// Render playlists
function renderPlaylists() {
    const playlistsGrid = document.getElementById('playlistsGrid');
    const emptyMessage = document.getElementById('emptyPlaylistMessage');

    if (!playlistsGrid) return;

    if (playlists.length === 0) {
        if (emptyMessage) emptyMessage.style.display = 'block';
        // Clear any existing playlist cards
        const existingCards = playlistsGrid.querySelectorAll('.playlist-card');
        existingCards.forEach(card => card.remove());
        return;
    }

    if (emptyMessage) emptyMessage.style.display = 'none';

    // Clear existing cards
    const existingCards = playlistsGrid.querySelectorAll('.playlist-card');
    existingCards.forEach(card => card.remove());

    // Render each playlist
    playlists.forEach(playlist => {
        const playlistCard = createPlaylistCard(playlist);
        playlistsGrid.appendChild(playlistCard);
    });
}

// Create playlist card element
function createPlaylistCard(playlist) {
    const card = document.createElement('div');
    card.className = 'playlist-card';
    card.onclick = () => openPlaylistDetails(playlist.id);

    card.innerHTML = `
        <div class="playlist-card-header">
            <div class="playlist-icon">
                <i class="fas fa-music"></i>
            </div>
            <div class="playlist-card-info">
                <h3>${playlist.name}</h3>
                <p>${playlist.description}</p>
            </div>
        </div>
        <div class="playlist-card-footer">
            <span class="playlist-song-count">
                <i class="fas fa-headphones"></i>
                ${playlist.songs.length} song${playlist.songs.length !== 1 ? 's' : ''}
            </span>
        </div>
    `;

    return card;
}

// Open add to playlist modal
function openAddToPlaylist(src, title, artist, thumbnail) {
    currentSongToAdd = { src, title, artist, thumbnail };

    const modal = document.getElementById('addToPlaylistModal');
    const songInfo = document.getElementById('songToAddInfo');
    const playlistSelection = document.getElementById('playlistSelection');

    // Display song info
    songInfo.innerHTML = `
        <div class="song-to-add">
            <img src="${thumbnail}" alt="${title}" onerror="this.src='play-button.png'">
            <div class="song-to-add-info">
                <h4>${title}</h4>
                <p>${artist}</p>
            </div>
        </div>
    `;

    // Display available playlists
    if (playlists.length === 0) {
        playlistSelection.innerHTML = `
            <div class="empty-playlist">
                <i class="fas fa-folder-open"></i>
                <p>No playlists available. Create one first!</p>
            </div>
        `;
    } else {
        playlistSelection.innerHTML = '';
        playlists.forEach(playlist => {
            const option = document.createElement('div');
            option.className = 'playlist-option';
            option.onclick = () => addSongToPlaylist(playlist.id);

            const songExists = playlist.songs.some(song => song.src === src);

            option.innerHTML = `
                <div>
                    <h4>${playlist.name}</h4>
                    <p>${playlist.songs.length} song${playlist.songs.length !== 1 ? 's' : ''}</p>
                </div>
                ${songExists ? '<i class="fas fa-check" style="color: rgb(13, 118, 199);"></i>' : '<i class="fas fa-plus"></i>'}
            `;

            playlistSelection.appendChild(option);
        });
    }

    modal.classList.add('active');
}

// Add song to playlist
function addSongToPlaylist(playlistId) {
    const playlist = playlists.find(p => p.id === playlistId);

    if (!playlist) return;

    // Check if song already exists
    const songExists = playlist.songs.some(song => song.src === currentSongToAdd.src);

    if (songExists) {
        showNotification('Song already in playlist!', 'info');
        return;
    }

    // Add song to playlist
    playlist.songs.push(currentSongToAdd);
    savePlaylistsToStorage();
    renderPlaylists();

    showNotification(`Added to "${playlist.name}"!`, 'success');

    // Close modal
    document.getElementById('addToPlaylistModal').classList.remove('active');
}

// Open playlist details
function openPlaylistDetails(playlistId) {
    currentPlaylistId = playlistId;
    const playlist = playlists.find(p => p.id === playlistId);

    if (!playlist) return;

    const modal = document.getElementById('playlistDetailsModal');
    const title = document.getElementById('playlistDetailsTitle');
    const info = document.getElementById('playlistInfo');
    const songsList = document.getElementById('playlistSongsList');

    title.innerHTML = `<i class="fas fa-list"></i> ${playlist.name}`;
    info.innerHTML = `<p>${playlist.description}</p>`;

    // Display songs
    if (playlist.songs.length === 0) {
        songsList.innerHTML = `
            <div class="empty-playlist">
                <i class="fas fa-music"></i>
                <p>No songs in this playlist yet. Add some songs!</p>
            </div>
        `;
    } else {
        songsList.innerHTML = '';
        playlist.songs.forEach((song, index) => {
            const songItem = document.createElement('div');
            songItem.className = 'playlist-song-item';

            songItem.innerHTML = `
                <div class="playlist-song-info">
                    <img src="${song.thumbnail}" alt="${song.title}" onerror="this.src='play-button.png'">
                    <div class="playlist-song-details">
                        <h4>${song.title}</h4>
                        <p>${song.artist}</p>
                    </div>
                </div>
                <div class="playlist-song-actions">
                    <button class="song-action-btn" onclick="playFromCard('${song.src}', '${song.title}', '${song.artist}', '${song.thumbnail}')">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="song-action-btn delete" onclick="removeSongFromPlaylist('${playlistId}', ${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            songsList.appendChild(songItem);
        });
    }

    modal.classList.add('active');
}

// Remove song from playlist
function removeSongFromPlaylist(playlistId, songIndex) {
    const playlist = playlists.find(p => p.id === playlistId);

    if (!playlist) return;

    playlist.songs.splice(songIndex, 1);
    savePlaylistsToStorage();
    renderPlaylists();
    openPlaylistDetails(playlistId); // Refresh the modal

    showNotification('Song removed from playlist', 'info');
}

// Delete current playlist
function deleteCurrentPlaylist() {
    if (!currentPlaylistId) return;

    const playlist = playlists.find(p => p.id === currentPlaylistId);

    if (!playlist) return;

    if (confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
        playlists = playlists.filter(p => p.id !== currentPlaylistId);
        savePlaylistsToStorage();
        renderPlaylists();

        document.getElementById('playlistDetailsModal').classList.remove('active');
        showNotification('Playlist deleted', 'info');
    }
}

// Save playlists to localStorage
function savePlaylistsToStorage() {
    localStorage.setItem('jamifyPlaylists', JSON.stringify(playlists));
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #27ae60, #229954)' :
                     type === 'error' ? 'linear-gradient(135deg, #e74c3c, #c0392b)' :
                     'linear-gradient(135deg, rgb(13, 118, 199), rgb(10, 95, 160))'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        font-size: 1rem;
        font-weight: 500;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
