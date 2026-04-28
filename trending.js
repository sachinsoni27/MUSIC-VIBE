// Trending Page JavaScript

let currentAudio = null;
let currentButton = null;

// Play song function
function playSong(audioId) {
    // Prevent event bubbling
    if (event) {
        event.stopPropagation();
    }

    const audio = document.getElementById(audioId);
    const button = document.getElementById('btn-' + audioId);

    if (!audio) {
        showNotification('Audio file not available for this song', 'info');
        return;
    }

    // If there's a currently playing audio and it's different from the clicked one
    if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        if (currentButton) {
            currentButton.classList.remove('playing');
            currentButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    // If clicking the same song - toggle play/pause
    if (currentAudio === audio) {
        if (audio.paused) {
            audio.play();
            button.classList.add('playing');
            button.innerHTML = '<i class="fas fa-pause"></i>';
            showNotification('Playing: ' + getSongName(audioId), 'success');
        } else {
            audio.pause();
            button.classList.remove('playing');
            button.innerHTML = '<i class="fas fa-play"></i>';
            showNotification('Paused', 'info');
        }
    } else {
        // Playing a new song
        audio.play();
        button.classList.add('playing');
        button.innerHTML = '<i class="fas fa-pause"></i>';
        currentAudio = audio;
        currentButton = button;

        showNotification('Now Playing: ' + getSongName(audioId), 'success');

        // Update button when song ends
        audio.addEventListener('ended', function() {
            button.classList.remove('playing');
            button.innerHTML = '<i class="fas fa-play"></i>';
            currentAudio = null;
            currentButton = null;
            showNotification('Song ended', 'info');
        });
    }
}

// Get song name from audio ID
function getSongName(audioId) {
    const button = document.getElementById('btn-' + audioId);
    if (button) {
        const songCard = button.closest('.song-card');
        if (songCard) {
            const songTitle = songCard.querySelector('h3');
            const artistName = songCard.querySelector('p');
            if (songTitle && artistName) {
                return songTitle.textContent + ' - ' + artistName.textContent;
            }
        }
    }
    return 'Unknown Song';
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: #fff;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        max-width: 300px;
    `;
    
    // Set background color based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    }
    
    // Add to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
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

// Animate artist sections on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all artist sections
document.addEventListener('DOMContentLoaded', function() {
    const artistSections = document.querySelectorAll('.artist-section');
    artistSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(section);
    });
    
    // Add hover effect to song cards
    const songCards = document.querySelectorAll('.song-card');
    songCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Smooth scroll to artist section
function scrollToArtist(artistId) {
    const element = document.getElementById(artistId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Add keyboard controls
document.addEventListener('keydown', function(e) {
    if (currentAudio) {
        // Space bar to play/pause
        if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            if (currentAudio.paused) {
                currentAudio.play();
                if (currentButton) {
                    currentButton.classList.add('playing');
                    currentButton.innerHTML = '<i class="fas fa-pause"></i>';
                }
            } else {
                currentAudio.pause();
                if (currentButton) {
                    currentButton.classList.remove('playing');
                    currentButton.innerHTML = '<i class="fas fa-play"></i>';
                }
            }
        }
        
        // Arrow keys for volume
        if (e.code === 'ArrowUp') {
            e.preventDefault();
            currentAudio.volume = Math.min(1, currentAudio.volume + 0.1);
            showNotification(`Volume: ${Math.round(currentAudio.volume * 100)}%`, 'info');
        }
        if (e.code === 'ArrowDown') {
            e.preventDefault();
            currentAudio.volume = Math.max(0, currentAudio.volume - 0.1);
            showNotification(`Volume: ${Math.round(currentAudio.volume * 100)}%`, 'info');
        }
    }
});

// Add visual feedback for playing song
setInterval(function() {
    if (currentAudio && !currentAudio.paused) {
        const progress = (currentAudio.currentTime / currentAudio.duration) * 100;
        if (currentButton) {
            currentButton.style.background = `conic-gradient(
                rgb(13, 118, 199) ${progress}%, 
                rgba(13, 118, 199, 0.3) ${progress}%
            )`;
        }
    }
}, 100);

// Search functionality (optional enhancement)
function searchSongs(query) {
    const songCards = document.querySelectorAll('.song-card');
    const artistSections = document.querySelectorAll('.artist-section');
    
    query = query.toLowerCase();
    
    artistSections.forEach(section => {
        let hasVisibleSongs = false;
        const songs = section.querySelectorAll('.song-card');
        
        songs.forEach(card => {
            const songName = card.querySelector('h3').textContent.toLowerCase();
            const artistName = card.querySelector('p').textContent.toLowerCase();
            
            if (songName.includes(query) || artistName.includes(query)) {
                card.style.display = 'block';
                hasVisibleSongs = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Hide artist section if no songs match
        if (hasVisibleSongs || query === '') {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });
}

// Add like functionality (optional)
function likeSong(songId) {
    const likes = JSON.parse(localStorage.getItem('jamifyLikes') || '[]');
    
    if (likes.includes(songId)) {
        // Unlike
        const index = likes.indexOf(songId);
        likes.splice(index, 1);
        showNotification('Removed from favorites', 'info');
    } else {
        // Like
        likes.push(songId);
        showNotification('Added to favorites', 'success');
    }
    
    localStorage.setItem('jamifyLikes', JSON.stringify(likes));
}

console.log('Trending page loaded successfully!');

