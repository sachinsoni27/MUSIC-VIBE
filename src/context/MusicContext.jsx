import { createContext, useContext, useState, useRef, useEffect } from 'react'

const MusicContext = createContext()

export const useMusic = () => {
  const context = useContext(MusicContext)
  if (!context) {
    throw new Error('useMusic must be used within MusicProvider')
  }
  return context
}

export const MusicProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playlist, setPlaylist] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const audioRef = useRef(null)

  // Create audio element on mount
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.volume = 0.7
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const playSong = (song) => {
    setCurrentSong(song)
    setIsPlaying(true)
    
    if (audioRef.current) {
      // Support both local paths and remote URLs (Jamendo provides full URLs)
      const src = song && song.audio
        ? (song.audio.startsWith('http') || song.audio.startsWith('https') ? song.audio : `/${song.audio}`)
        : ''
      audioRef.current.src = src
      audioRef.current.play().catch(err => console.error('Error playing:', err))
    }
  }

  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(err => console.error('Error playing:', err))
    }
    setIsPlaying(!isPlaying)
  }

  const playNext = () => {
    if (playlist.length === 0) return
    const nextIndex = (currentIndex + 1) % playlist.length
    setCurrentIndex(nextIndex)
    playSong(playlist[nextIndex])
  }

  const playPrevious = () => {
    if (playlist.length === 0) return
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    playSong(playlist[prevIndex])
  }

  const setPlaylistAndPlay = (songs, index = 0) => {
    setPlaylist(songs)
    setCurrentIndex(index)
    playSong(songs[index])
  }

  const value = {
    currentSong,
    isPlaying,
    playlist,
    currentIndex,
    audioRef,
    playSong,
    togglePlay,
    playNext,
    playPrevious,
    setPlaylistAndPlay,
    setIsPlaying
  }

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  )
}

