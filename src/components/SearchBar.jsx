import { useState, useEffect } from "react";
import "./SearchBar.css";

/**
 * SearchBar component
 * Props:
 * - value: controlled search term (optional)
 * - onSearch(term): called when search is submitted
 * - onClear(): called when clear button pressed
 * - genre: selected genre (optional)
 * - onGenreChange(value): called when genre changes
 * - genres: array of { value, label } options (optional)
 */
export default function SearchBar({ value = "", onSearch, onClear, genre = "all", onGenreChange, genres }) {
  const [term, setTerm] = useState(value);

  useEffect(() => {
    setTerm(value);
  }, [value]);

  const handleSubmit = (e) => {
    e && e.preventDefault && e.preventDefault();
    if (typeof onSearch === "function") onSearch(term.trim());
  };

  const handleClear = () => {
    setTerm("");
    if (typeof onClear === "function") onClear();
    if (typeof onSearch === "function") onSearch("");
    if (typeof onChange === 'function') onChange('')
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit(e);
  };

  const genreOptions = genres || [
    { value: "all", label: "All genres" },
    { value: "pop", label: "Pop" },
    { value: "rock", label: "Rock" },
    { value: "jazz", label: "Jazz" },
    { value: "electronic", label: "Electronic" },
  ];

  return (
    <form className="search-section" onSubmit={handleSubmit} role="search" aria-label="Search songs">
      <div className="search-box">
        <div className="search-icon" aria-hidden="true">
          <i className="fas fa-search"></i>
        </div>

        <input
          type="text"
          placeholder="Search songs (Jamendo)"
          value={term}
          onChange={(e) => { setTerm(e.target.value); if (typeof onChange === 'function') onChange(e.target.value); }}
          onKeyDown={handleKeyDown}
          aria-label="Search songs"
        />

        <select value={genre} onChange={(e) => onGenreChange && onGenreChange(e.target.value)} aria-label="Filter by genre">
          {genreOptions.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>

        <div className="controls">
          <button type="submit" className="btn search-btn" aria-label="Search">
            Search
          </button>
          <button type="button" className="btn clear-btn" onClick={handleClear} aria-label="Clear search">
            Clear
          </button>
        </div>
      </div>
    </form>
  );
}
