import { useState, useEffect } from 'react'

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark'
    } catch (e) {
      return 'dark'
    }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('theme', theme)
    } catch (e) {
      // ignore
    }
  }, [theme])

  const toggle = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
      {theme === 'dark' ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
      <span className="theme-toggle-label">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  )
}

export default ThemeToggle
