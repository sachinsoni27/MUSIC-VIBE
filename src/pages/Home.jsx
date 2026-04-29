import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import MusicPlayer from '../components/MusicPlayer'
import PlaylistSection from '../components/PlaylistSection'
import Footer from '../components/Footer'
import '../styles/index.css'

const Home = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Intersection observer for scroll animations
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('animate-in') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.animate-on-scroll').forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">

          {/* Logo icon */}
          <div className="hero-logo">
            <div className="jamify-logo" style={{ background: 'transparent', boxShadow: 'none' }}>
              <img src="/logo.png" alt="Music Vibe" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>

          <h1 className="hero-title">
            <span className="gradient-text-anim">Music Vibe</span>
          </h1>
          <p className="hero-subtitle">
            Your Ultimate Music Streaming Experience
          </p>

          <div className="hero-stats">
            <div className="stat-box">
              <i className="fas fa-music" />
              <h3>10K+</h3>
              <p>Songs</p>
            </div>
            <div className="stat-box">
              <i className="fas fa-users" />
              <h3>500+</h3>
              <p>Artists</p>
            </div>
            <div className="stat-box">
              <i className="fas fa-list" />
              <h3>100+</h3>
              <p>Playlists</p>
            </div>
          </div>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/trending')}>
              <i className="fas fa-play" /> Start Listening
            </button>
            <button
              className="btn-secondary"
              onClick={() => document.getElementById('playlists')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <i className="fas fa-compass" /> Explore Playlists
            </button>
          </div>
        </div>
      </div>

      {/* Music Player */}
      <MusicPlayer />

      {/* Playlists / Artists / Songs */}
      <PlaylistSection />

      <Footer />
    </div>
  )
}

export default Home
