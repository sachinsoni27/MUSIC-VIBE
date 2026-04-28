import { useState, useRef, useEffect } from 'react'
import { useMusic } from '../context/MusicContext'

const MusicPlayer = () => {
  const { currentSong, isPlaying, togglePlay, playNext, playPrevious, audioRef } = useMusic()
  const [currentTime, setCurrentTime] = useState('0:00')
  const [totalTime, setTotalTime]     = useState('0:00')
  const [volume, setVolume]           = useState(70)
  const [isLiked, setIsLiked]         = useState(false)
  const [isShuffle, setIsShuffle]     = useState(false)
  const [isRepeat, setIsRepeat]       = useState(false)
  const [progress, setProgress]       = useState(0)
  const progressRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(formatTime(audio.currentTime))
      setTotalTime(formatTime(audio.duration))
      const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0
      setProgress(pct)
      if (progressRef.current) progressRef.current.style.width = `${pct}%`
    }

    const handleEnded = () => {
      if (isRepeat) { audio.currentTime = 0; audio.play().catch(() => {}) }
      else playNext()
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateTime)
    audio.addEventListener('ended', handleEnded)
    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateTime)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [playNext, isRepeat])

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const handleVolumeChange = (e) => {
    const v = Number(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v / 100
  }

  const handleProgressClick = (e) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    audio.currentTime = (x / rect.width) * audio.duration
  }

  const getVolIcon = () => {
    if (volume === 0)   return 'fa-volume-xmark'
    if (volume < 40)    return 'fa-volume-low'
    if (volume < 75)    return 'fa-volume'
    return 'fa-volume-high'
  }

  const displaySong = currentSong || { title: 'No song playing', artist: 'Select a song to play', image: '' }

  const getImageStyle = (img) => {
    if (!img) return {}
    const url = img.startsWith('http') || img.startsWith('data:') ? img : img.startsWith('/') ? img : `/${img}`
    return { backgroundImage: `url(${url})` }
  }

  return (
    <div className="musicplayer" id="musicPlayer">

      {/* Left — album art + info */}
      <div className="played-songs">
        <div
          className={`player-thumbnail ${isPlaying ? 'is-playing' : ''}`}
          style={getImageStyle(displaySong.image)}
        >
          {isPlaying && (
            <div className="eq-bars">
              <div className="eq-bar" />
              <div className="eq-bar" />
              <div className="eq-bar" />
            </div>
          )}
        </div>
        <div className="song-details">
          <p className="song-title"  id="currentSongTitle">{displaySong.title}</p>
          <p className="song-artist" id="currentSongArtist">{displaySong.artist}</p>
        </div>
        <div className="liked" style={{ marginLeft: '8px' }}>
          <i
            className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`}
            onClick={() => setIsLiked(!isLiked)}
            style={{ cursor: 'pointer', color: isLiked ? '#f43f5e' : 'var(--text-dim)', fontSize:'1rem', transition:'all .2s' }}
          />
        </div>
      </div>

      {/* Center — controls + progress */}
      <div className="song-controls">
        <div className="controls">
          <div className="player_controls">
            <button
              className={`control-btn ${isShuffle ? 'active' : ''}`}
              onClick={() => setIsShuffle(!isShuffle)}
              title="Shuffle"
            >
              <i className="fa-solid fa-shuffle" />
            </button>

            <button className="control-btn" id="prevBtn" onClick={playPrevious} title="Previous">
              <i className="fa-solid fa-backward-step" />
            </button>

            <button
              className={`control-btn play-pause-btn ${isPlaying ? 'playing' : ''}`}
              onClick={togglePlay}
              id="playPauseBtn"
            >
              <i className={`fa-solid fa-${isPlaying ? 'pause' : 'play'}`} />
            </button>

            <button className="control-btn" id="nextBtn" onClick={playNext} title="Next">
              <i className="fa-solid fa-forward-step" />
            </button>

            <button
              className={`control-btn ${isRepeat ? 'active' : ''}`}
              onClick={() => setIsRepeat(!isRepeat)}
              title="Repeat"
            >
              <i className="fa-solid fa-repeat" />
            </button>
          </div>

          <div className="progress-section">
            <span className="time-current">{currentTime}</span>
            <div className="progress-container" onClick={handleProgressClick}>
              <div id="progress-bar" ref={progressRef} />
            </div>
            <span className="time-total">{totalTime}</span>
          </div>
        </div>
      </div>

      {/* Right — volume */}
      <div className="speaker">
        <div
          className="volume-icon"
          onClick={() => {
            const newVol = volume === 0 ? 70 : 0
            setVolume(newVol)
            if (audioRef.current) audioRef.current.volume = newVol / 100
          }}
          title={volume === 0 ? 'Unmute' : 'Mute'}
        >
          <i className={`fa-solid ${getVolIcon()}`} />
        </div>
        <input
          type="range"
          id="volumeSlider"
          min="0" max="100"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  )
}

export default MusicPlayer
