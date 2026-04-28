import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import MusicPlayer from '../components/MusicPlayer'
import Footer from '../components/Footer'
import ThemeToggle from '../components/ThemeToggle'
import SearchBar from '../components/SearchBar'
import { useMusic } from '../context/MusicContext'
import { useSearchParams } from 'react-router-dom'
import '../styles/index.css'
import '../styles/trending.css'

import { trendingArtists, trendingSongs } from '../data/songs'

const Trending = () => {
  const { setPlaylistAndPlay, currentSong, isPlaying } = useMusic()
  const [activeFilter, setActiveFilter] = useState('all')



  // Jamendo API state
  const [jamendoTracks, setJamendoTracks] = useState([])
  const [loadingJamendo, setLoadingJamendo] = useState(false)
  const [jamendoError, setJamendoError] = useState(null)

  // Playlist (favorites) state with persistence
  const [playlist, setPlaylist] = useState([])
  const [playlistMessage, setPlaylistMessage] = useState(null)

  // Load playlist from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('myPlaylist')
      if (raw) setPlaylist(JSON.parse(raw))
    } catch (e) {
      console.error('Failed to load playlist from localStorage', e)
    }
  }, [])

  // Persist playlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('myPlaylist', JSON.stringify(playlist))
    } catch (e) {
      console.error('Failed to save playlist to localStorage', e)
    }
  }, [playlist])

  const addToPlaylist = (song) => {
    const candidate = {
      id: song.id,
      title: song.title || song.name || 'Unknown',
      artist: song.artist || song.artist_name || 'Unknown',
      audio: song.audio,
      image: song.image || song.album_image || '',
      plays: song.plays || song.listened_count || '',
      duration: song.duration || (song.duration ? formatDuration(song.duration) : '')
    }

    const exists = playlist.some((p) => {
      if (p.audio && candidate.audio) return p.audio === candidate.audio
      return p.id === candidate.id
    })

    if (exists) {
      setPlaylistMessage('Song already in playlist')
      setTimeout(() => setPlaylistMessage(null), 1800)
      return
    }

    setPlaylist(prev => [candidate, ...prev])
    setPlaylistMessage('Added to playlist')
    setTimeout(() => setPlaylistMessage(null), 1200)
  }

  const removeFromPlaylist = (id) => {
    setPlaylist(prev => prev.filter(s => s.id !== id))
  }

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [query, setQuery] = useState('')
  const [genreFilter, setGenreFilter] = useState('all')

  // URL search params (persist search and genre in URL)
  const [searchParams, setSearchParams] = useSearchParams()

  // Debounce live search: update `query` 500ms after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = searchTerm.trim()
      if (trimmed !== query) setQuery(trimmed)
    }, 500)

    return () => clearTimeout(handler)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  // Sync URL params to state on load / when params change
  useEffect(() => {
    const q = searchParams.get('q') || ''
    const genreParam = searchParams.get('genre') || 'all'
    if (q !== searchTerm) setSearchTerm(q)
    if (q !== query) setQuery(q)
    if (genreParam !== genreFilter) setGenreFilter(genreParam)
    // keep activeFilter in sync with genre
    const label = genreParam === 'all' ? 'all' : genreParam.charAt(0).toUpperCase() + genreParam.slice(1)
    if (label !== activeFilter) setActiveFilter(label)
  }, [searchParams])

  // Push query and genre into URL so results are shareable
  useEffect(() => {
    const params = {}
    if (query) params.q = query
    if (genreFilter && genreFilter !== 'all') params.genre = genreFilter
    setSearchParams(params, { replace: true })
  }, [query, genreFilter, setSearchParams])

  // Fetch tracks from Jamendo on component mount and when `query` changes
  useEffect(() => {
    setLoadingJamendo(true)
    const base = 'https://api.jamendo.com/v3.0/tracks/'
    const client = 'client_id=364ed607'
    const limit = 'limit=10'
    const searchPart = query ? `&search=${encodeURIComponent(query)}` : ''
    // Include genre tag param when filter is active (Jamendo supports tags parameter)
    const tagsPart = genreFilter && genreFilter !== 'all' ? `&tags=${encodeURIComponent(genreFilter)}` : ''
    const url = `${base}?${client}&${limit}${searchPart}${tagsPart}`

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setJamendoTracks(data.results || [])
        setJamendoError(null)
      })
      .catch((err) => {
        console.error('Jamendo fetch error:', err)
        setJamendoError(err.message || 'Failed to fetch Jamendo tracks')
      })
      .finally(() => setLoadingJamendo(false))
  }, [query, genreFilter])

  const handleSongClick = (song, index) => {
    setPlaylistAndPlay(trendingSongs, index)
  }

  // Map Jamendo tracks to internal song shape and play via MusicPlayer
  const formatDuration = (seconds) => {
    if (seconds === undefined || seconds === null) return ''
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0')
    return `${mins}:${secs}`
  }

  const handleJamendoClick = (index) => {
    const mapped = jamendoTracks.map(t => ({
      id: t.id,
      title: t.name,
      artist: t.artist_name,
      image: t.album_image,
      audio: t.audio,
      plays: t.listened_count ? `${t.listened_count}` : '',
      duration: t.duration ? formatDuration(t.duration) : ''
    }))
    setPlaylistAndPlay(mapped, index)
  }

  // Client-side genre filter (in case Jamendo tag filtering is insufficient)
  const filteredJamendoTracks = jamendoTracks.filter(t => {
    if (!genreFilter || genreFilter === 'all') return true
    const tagsRaw = t.tags || t.tag_list || ''
    const tags = Array.isArray(tagsRaw) ? tagsRaw.join(' ').toLowerCase() : String(tagsRaw).toLowerCase()
    return tags.includes(genreFilter.toLowerCase())
  })

  // Scroll animation effect
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    }, observerOptions)

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <i className="fas fa-arrow-up trend-up"></i>
    if (trend === 'down') return <i className="fas fa-arrow-down trend-down"></i>
    return <i className="fas fa-minus trend-same"></i>
  }

  // Handle filter button clicks and sync with Jamendo genre filter
  const handleFilterClick = (label) => {
    // label: 'all' or genre label like 'Romantic', 'Pop'
    if (label === 'all') {
      setActiveFilter('all')
      setGenreFilter('all')
      return
    }

    // Toggle: if same label clicked again, reset to 'all'
    if (activeFilter === label) {
      setActiveFilter('all')
      setGenreFilter('all')
      return
    }

    setActiveFilter(label)
    // Convert label to Jamendo tag form (lowercase)
    setGenreFilter(label.toLowerCase())
  }

  return (
    <div className="trending-page">
      <Navbar />

      {/* Hero Banner */}
      <div className="trending-hero">
        <div className="trending-hero-overlay"></div>
        <ThemeToggle />
        <div className="trending-hero-content">
          <div className="trending-badge">
            <i className="fas fa-fire"></i>
            <span>HOT THIS WEEK</span>
          </div>
          <h1 className="trending-hero-title">
            <span className="gradient-text">Trending Now</span>
          </h1>
          <p className="trending-hero-subtitle">
            Discover the hottest tracks and artists dominating the charts
          </p>
          <div className="trending-stats">
            <div className="stat-item">
              <i className="fas fa-music"></i>
              <div>
                <h3>{trendingSongs.length}</h3>
                <p>Hot Tracks</p>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-star"></i>
              <div>
                <h3>{trendingArtists.length}</h3>
                <p>Top Artists</p>
              </div>
            </div>
            <div className="stat-item">
              <i className="fas fa-headphones"></i>
              <div>
                <h3>25M+</h3>
                <p>Total Plays</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container3">
        <div className="suggested-songs">

          {/* Trending Artists Section */}
          <div className="section-container animate-on-scroll">
            <div className="section-header">
              <h3 className="section-title" style={{ fontSize: '2.5rem' }}>
                <i className="fas fa-star"></i>
                <span>Popular Artists</span>
              </h3>
              <p className="section-subtitle">The most talented artists of the moment</p>
            </div>
            <div className="artist-sec">
              {trendingArtists.map((artist, index) => (
                <div key={artist.id} className="artist-contain" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="artist-rank-badge">#{artist.rank}</div>
                  <div
                    className={`artist-card${index + 1}`}
                    style={{ backgroundImage: `url(${artist.image})` }}
                  >
                    <div className="artist-overlay">
                      <i className="fas fa-play-circle"></i>
                    </div>
                  </div>
                  <div className="artist-info">
                    <h3>
                      {artist.name}
                      {artist.verified && <i className="fas fa-check-circle verified-badge"></i>}
                    </h3>
                    <div className="artist-stats">
                      <span><i className="fas fa-music"></i> {artist.songs} songs</span>
                      <span><i className="fas fa-users"></i> {artist.followers}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Songs Section */}
          <div className="section-container animate-on-scroll">
            <div className="section-header">
              <h3 className="section-title" style={{ fontSize: '2.5rem' }}>
                <i className="fas fa-music"></i>
                <span>Trending Songs</span>
              </h3>
              <p className="section-subtitle">Collections for every mood</p>
            </div>

            {/* Filter Buttons */}
            <div className="filter-and-search">
              <div className="filter-buttons" role="tablist" aria-label="Genre filters">
                <button
                  className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterClick('all')}
                  aria-pressed={activeFilter === 'all'}
                >
                  <i className="fas fa-th"></i> All
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'Romantic' ? 'active' : ''}`}
                  onClick={() => handleFilterClick('Romantic')}
                  aria-pressed={activeFilter === 'Romantic'}
                >
                  <i className="fas fa-heart"></i> Romantic
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'Pop' ? 'active' : ''}`}
                  onClick={() => handleFilterClick('Pop')}
                  aria-pressed={activeFilter === 'Pop'}
                >
                  <i className="fas fa-star"></i> Pop
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'Punjabi' ? 'active' : ''}`}
                  onClick={() => handleFilterClick('Punjabi')}
                  aria-pressed={activeFilter === 'Punjabi'}
                >
                  <i className="fas fa-drum"></i> Punjabi
                </button>
                <button
                  className={`filter-btn ${activeFilter === 'Classical' ? 'active' : ''}`}
                  onClick={() => handleFilterClick('Classical')}
                  aria-pressed={activeFilter === 'Classical'}
                >
                  <i className="fas fa-music"></i> Classical
                </button>
              </div>

              {/* Search & Genre filter for Jamendo (SearchBar component) */}
              <SearchBar
                value={searchTerm}
                onChange={(val) => setSearchTerm(val)}
                onSearch={(val) => setQuery(val.trim())}
                onClear={() => { setSearchTerm(''); setQuery(''); setGenreFilter('all') }}
                genre={genreFilter}
                onGenreChange={(val) => setGenreFilter(val)}
                genres={[
                  { value: 'all', label: 'All genres' },
                  { value: 'rock', label: 'Rock' },
                  { value: 'pop', label: 'Pop' },
                  { value: 'jazz', label: 'Jazz' },
                  { value: 'electronic', label: 'Electronic' }
                ]}
              />
            </div>

            <div className="songs-sec">
              {/* Jamendo integration: show loading, error, or tracks */}
              {loadingJamendo ? (
                <div className="loader">Loading Jamendo tracks...</div>
              ) : jamendoError ? (
                <div className="error">Error loading Jamendo tracks: {jamendoError}</div>
              ) : jamendoTracks && jamendoTracks.length > 0 ? (
                <>
                  <div style={{ marginBottom: '0.75rem', color: '#777' }}>
                    Showing {jamendoTracks.length} result{jamendoTracks.length !== 1 ? 's' : ''}{query ? ` for "${query}"` : ''}
                  </div>
                  {jamendoTracks.map((track, index) => {
                    const isJamendoCurrent = currentSong && (currentSong.id === track.id) && isPlaying
                    return (
                    <div key={track.id} className="songs-contain" style={{ animationDelay: `${index * 0.05}s` }}>
                      <div className="song-rank-badge">
                        <span className="rank-number">#{index + 1}</span>
                      </div>

                      <div
                        className={`songs-card${(index % 6) + 1} ${isJamendoCurrent ? 'active' : ''}`}
                        id="suggest-song"
                        onClick={() => handleJamendoClick(index)}
                        style={{ backgroundImage: `url(${track.album_image || ''})` }}
                      >
                        <div className="play-overlay">
                          <i className={`fas fa-play-circle`}></i>
                        </div>

                        {isJamendoCurrent && (
                          <div className="now-playing-badge">
                            <i className="fas fa-volume-up"></i> Playing
                          </div>
                        )}

                        <div className="song-stats-overlay">
                          <span><i className="fas fa-play"></i> {track.listened_count || '-'}</span>
                          <span><i className="fas fa-clock"></i> {formatDuration(track.duration)}</span>
                        </div>
                      </div>

                      <div className="song-card-info">
                        <h3>{track.name}</h3>
                        <p className="artist-name">{track.artist_name}</p>

                        {/* Play full song via HTML audio controls (frontend-only) */}
                        <audio controls src={track.audio} style={{ width: '100%', marginTop: '0.5rem' }}>
                          Your browser does not support the <code>audio</code> element.
                        </audio>
                      </div>

                      <button
                        className="add-to-playlist-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          addToPlaylist({
                            id: track.id,
                            title: track.name,
                            artist: track.artist_name,
                            audio: track.audio,
                            image: track.album_image,
                            plays: track.listened_count,
                            duration: track.duration
                          })
                        }}
                        aria-label="Add to playlist"
                      >
                        <i className="fas fa-heart"></i>
                        <span className="add-label">Add to Playlist ❤️</span>
                      </button>
                    </div>
                    )
                  })}
                </>
              ) : query ? (
                <div className="no-results" style={{ padding: '1rem', color: '#555' }}>
                  No results found for "{query}". Try a different search term.
                </div>
              ) : (
                // Fallback: render existing static trendingSongs if Jamendo returned no results
                trendingSongs
                  .filter(song => activeFilter === 'all' || song.genre === activeFilter)
                  .map((song, index) => {
                    const isCurrentSong = currentSong && currentSong.id === song.id
                    return (
                      <div key={song.id} className="songs-contain" style={{ animationDelay: `${index * 0.05}s` }}>
                        <div className="song-rank-badge">
                          <span className="rank-number">#{index + 1}</span>
                          {getTrendIcon(song.trend)}
                        </div>
                        <div
                          className={`songs-card${(index % 6) + 1} ${isCurrentSong ? 'active' : ''}`}
                          id="suggest-song"
                          onClick={() => handleSongClick(song, index)}
                          style={{
                            backgroundImage: `url(${song.image})`
                          }}
                        >
                          <div className="play-overlay">
                            <i className={`fas fa-${isCurrentSong && isPlaying ? 'pause' : 'play'}-circle`}></i>
                          </div>
                          {isCurrentSong && isPlaying && (
                            <div className="now-playing-badge">
                              <i className="fas fa-volume-up"></i> Playing
                            </div>
                          )}
                          <div className="song-stats-overlay">
                            <span><i className="fas fa-play"></i> {song.plays}</span>
                            <span><i className="fas fa-clock"></i> {song.duration}</span>
                          </div>
                        </div>
                        <div className="song-card-info">
                          <h3 className={isCurrentSong ? 'active' : ''}>
                            {song.title}
                          </h3>
                          <p className="artist-name">{song.artist}</p>
                          <span className="genre-tag">{song.genre}</span>
                        </div>
                        <button
                          className="add-to-playlist-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            addToPlaylist({
                              id: song.id,
                              title: song.title,
                              artist: song.artist,
                              audio: song.audio,
                              image: song.image,
                              plays: song.plays,
                              duration: song.duration
                            })
                          }}
                        >
                          <i className="fas fa-heart"></i>
                          <span className="add-label">Add to Playlist ❤️</span>
                        </button>
                      </div>
                    )
                  })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Section */}
      <div className="section-container animate-on-scroll" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
        <div className="section-header">
          <h3 className="section-title" style={{ fontSize: '2.5rem' }}>
            <i className="fas fa-heart" style={{ color: 'var(--accent)' }}></i>
            <span>My Playlist</span>
          </h3>
          <p className="section-subtitle">Your personal collection of favorite tracks</p>
        </div>

        {playlistMessage && (
          <div className="playlist-message" style={{ margin: '0 auto 20px', maxWidth: '800px', textAlign: 'center', background: 'rgba(74,222,128,0.1)', color: '#4ade80', padding: '12px', borderRadius: 'var(--r-md)', border: '1px solid rgba(74,222,128,0.3)' }}>
            <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
            {playlistMessage}
          </div>
        )}

        {playlist.length === 0 ? (
          <div className="glass" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', textAlign: 'center', borderRadius: 'var(--r-lg)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2rem', color: 'var(--text-muted)' }}>
              <i className="fas fa-music"></i>
            </div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--text)' }}>It's quiet here...</h4>
            <p className="muted" style={{ fontSize: '0.95rem' }}>No songs yet. Click "Add to Playlist ❤️" on any track to save your favorites.</p>
          </div>
        ) : (
          <div className="glass" style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', borderRadius: 'var(--r-lg)' }}>
            <ul className="playlist-list" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {playlist.map((p, idx) => (
                <li key={`${p.id}-${idx}`} className="playlist-item" style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--r-md)',
                  border: '1px solid var(--border)', transition: 'all var(--t)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'var(--card-hover)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.2)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ 
                      width: '48px', height: '48px', borderRadius: '8px', 
                      background: p.image ? `url(${p.image}) center/cover` : 'var(--gradient)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)', flexShrink: 0
                    }}>
                      {!p.image && <i className="fas fa-music" style={{ color: '#fff' }}></i>}
                    </div>
                    <div>
                      <strong style={{ fontSize: '1.05rem', color: 'var(--text)', display: 'block', marginBottom: '4px' }}>{p.title}</strong>
                      <div className="track-artist" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <i className="fas fa-user" style={{ fontSize: '0.75rem', marginRight: '6px' }}></i>
                        {p.artist}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      className="btn-primary" 
                      onClick={() => setPlaylistAndPlay(playlist, playlist.findIndex(s => s.id === p.id))}
                      style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: 'var(--r-pill)' }}
                    >
                      <i className="fas fa-play"></i> Play
                    </button>
                    <button 
                      onClick={() => removeFromPlaylist(p.id)}
                      style={{ 
                        width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(244,63,94,0.1)', 
                        border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all var(--t)'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = '#f43f5e'; e.currentTarget.style.color = '#fff' }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; e.currentTarget.style.color = '#f43f5e' }}
                      title="Remove from playlist"
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Footer />
      <MusicPlayer />
    </div>
  )
}

export default Trending

