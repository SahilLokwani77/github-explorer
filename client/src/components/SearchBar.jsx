import { useState, useRef, useEffect } from "react";
import { getRecentSearches } from "../hooks/useGitHub";

export default function SearchBar({ onSearch, disabled }) {
  const [value, setRecent]    = useState("");
  const [recents, setRecents] = useState([]);
  const [showDrop, setDrop]   = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setRecents(getRecentSearches());
  }, [showDrop]);

  function handleSubmit(e) {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
      setDrop(false);
    }
  }

  function pickRecent(username) {
    setRecent(username);
    onSearch(username);
    setDrop(false);
  }

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 560 }}>
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <span style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            color: "var(--muted)", fontSize: 16, pointerEvents: "none"
          }}>
            ⌕
          </span>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setRecent(e.target.value)}
            onFocus={() => setDrop(true)}
            onBlur={() => setTimeout(() => setDrop(false), 150)}
            placeholder="Enter a GitHub username…"
            disabled={disabled}
            style={{
              width: "100%",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              color: "var(--text)",
              padding: "10px 14px 10px 38px",
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocusCapture={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlurCapture={(e)  => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          style={{
            background: "var(--accent)",
            color: "#0d1117",
            borderRadius: "var(--radius)",
            padding: "10px 20px",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: 13,
            opacity: disabled || !value.trim() ? 0.5 : 1,
            transition: "opacity 0.2s",
          }}
        >
          Search
        </button>
      </form>

      {/* Recent searches dropdown */}
      {showDrop && recents.length > 0 && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          width: "calc(100% - 84px)",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          zIndex: 10,
          overflow: "hidden",
        }}>
          <div style={{ padding: "6px 12px 4px", color: "var(--muted)", fontSize: 11, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Recent
          </div>
          {recents.map((r) => (
            <button
              key={r.username}
              onMouseDown={() => pickRecent(r.username)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "8px 12px",
                color: "var(--text)", fontSize: 14,
                textAlign: "left",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <img
                src={r.avatarUrl}
                alt=""
                width={20} height={20}
                style={{ borderRadius: "50%" }}
              />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{r.username}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
