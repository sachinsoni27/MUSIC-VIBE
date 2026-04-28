import { useState } from 'react'
import { useMusic } from '../context/MusicContext'
import { FaPlay, FaPause, FaChevronDown, FaChevronUp } from 'react-icons/fa'

import { playlists, trendingArtists, trendingSongs } from '../data/songs'

const PlaylistSection = () => {
  const { playSong, setPlaylistAndPlay, currentSong, isPlaying } = useMusic()
  const [expandedPlaylist, setExpandedPlaylist] = useState(null)

  const handlePlaylistClick = (playlistId) => {
    setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId)
  }

  const handlePlayPlaylist = (playlist) => {
    if (playlist.songs.length > 0) {
      setPlaylistAndPlay(playlist.songs, 0)
    }
  }

  const handlePlaylistSongClick = (playlist, index) => {
    setPlaylistAndPlay(playlist.songs, index)
  }

  const handleTrendingSongClick = (song, index) => {
    setPlaylistAndPlay(trendingSongs, index)
  }


  return (
    <>
      {/* Playlists Section */}
      <section className="playlists-section" id="playlists">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-list-ul"></i> <span className="gradient-text">Your Playlists</span>
            </h2>
            <p className="section-subtitle">Curated collections for every mood</p>
          </div>

          <div className="playlist-grid">
            {playlists.map((playlist, index) => (
              <div key={playlist.id} className="playlist-wrapper" style={{ animationDelay: `${index * 0.1}s` }}>
                <div
                  className={`playlist-card ${expandedPlaylist === playlist.id ? 'expanded' : ''}`}
                  onClick={() => handlePlaylistClick(playlist.id)}
                >
                  <div className="playlist-image" style={{ backgroundImage: `url(${playlist.image})` }}>
                    <div
                      className="play-overlay"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlayPlaylist(playlist)
                      }}
                    >
                      <i className="fas fa-play"></i>
                    </div>
                    <div className="playlist-badge">
                      <i className="fas fa-music"></i> {playlist.songs.length}
                    </div>
                  </div>
                  <div className="playlist-info">
                    <h3>{playlist.name}</h3>
                    <p>{playlist.songs.length} songs</p>
                  </div>
                  <div className="expand-icon">
                    {expandedPlaylist === playlist.id ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>

                {expandedPlaylist === playlist.id && (
                  <div className="songs-container">
                    {playlist.songs.length > 0 ? (
                      playlist.songs.map((song, songIndex) => (
                        <div
                          key={song.id}
                          className={`song-item ${currentSong?.id === song.id ? 'active' : ''}`}
                          onClick={() => handlePlaylistSongClick(playlist, songIndex)}
                        >
                          <div className="song-number">
                            {currentSong?.id === song.id && isPlaying ? (
                              <FaPause className="playing-icon" />
                            ) : (
                              <span>{songIndex + 1}</span>
                            )}
                          </div>
                          <div className="song-details">
                            <h4>{song.title}</h4>
                            <p>{song.artist}</p>
                          </div>
                          <div className="song-duration">
                            {song.duration}
                          </div>
                          <div className="song-actions">
                            <button
                              className="action-btn"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handlePlaylistSongClick(playlist, songIndex)
                                }}
                            >
                              {currentSong?.id === song.id && isPlaying ? <FaPause /> : <FaPlay />}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-songs">
                        <p>No songs available in this playlist</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Artists */}
      <section className="artists-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-star"></i> <span className="gradient-text">Popular Artists</span>
            </h2>
            <p className="section-subtitle">Listen to your favorite artists</p>
          </div>

          <div className="artist-sec">
            {trendingArtists.map((artist, index) => (
              <div key={artist.id} className="artist-contain" style={{ animationDelay: `${index * 0.1}s` }}>
                <div
                  className={`artist-card${index + 1}`}
                  style={{ backgroundImage: `url(${artist.image})` }}
                >
                  <div className="artist-overlay">
                    <i className="fas fa-play-circle"></i>
                  </div>
                </div>
                <h3>{artist.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Songs */}
      <section className="songs-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-fire"></i> <span className="gradient-text">Trending Songs</span>
            </h2>
            <p className="section-subtitle">Most played tracks this week</p>
          </div>

          <div className="songs-sec">
            {trendingSongs.map((song, index) => {
              const isCurrentSong = currentSong && currentSong.id === song.id
              return (
                <div
                  key={song.id}
                  className="songs-contain"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className={`songs-card${index + 1} ${isCurrentSong ? 'active' : ''}`}
                    onClick={() => handleTrendingSongClick(song, index)}
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
                    <div className="song-number">#{index + 1}</div>
                  </div>
                  <div className="song-card-info">
                    <h3 className={isCurrentSong ? 'active' : ''}>
                      {song.title}
                    </h3>
                    <p className="artist-name">{song.artist}</p>
                  </div>
                  <button
                    className="add-to-playlist-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log('Add to playlist:', song)
                    }}
                    title="Add to playlist"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default PlaylistSection

