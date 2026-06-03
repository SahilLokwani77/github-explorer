import { useState } from "react";

const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
  Java: "#b07219",       "C++": "#f34b7d",       Go: "#00ADD8",
  Rust: "#dea584",       Ruby: "#701516",         HTML: "#e34c26",
  CSS: "#563d7c",        Shell: "#89e051",        Kotlin: "#A97BFF",
  Swift: "#F05138",      PHP: "#4F5D95",          Dart: "#00B4AB",
  "C#": "#178600",       C: "#555555",
};

function timeSince(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30)  return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export default function RepoCard({ repo }) {
  const [expanded, setExpanded] = useState(false);
  const langColor = LANG_COLORS[repo.language] || "var(--muted)";

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        padding: "14px 18px",
        transition: "border-color 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
      onClick={() => setExpanded((v) => !v)}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <a
              href={repo.htmlUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 700,
                color: "var(--accent)", flexShrink: 0,
              }}
            >
              {repo.name}
            </a>
            {repo.fork && (
              <span style={{
                fontSize: 10, padding: "1px 7px", borderRadius: 99,
                border: "1px solid var(--border)", color: "var(--muted)",
                fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.05em",
              }}>
                fork
              </span>
            )}
          </div>
          {repo.description && (
            <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4, lineHeight: 1.4 }}>
              {repo.description}
            </p>
          )}
          {repo.topics.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
              {repo.topics.slice(0, 4).map((t) => (
                <span key={t} style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 99,
                  background: "var(--accent-dim)", color: "var(--accent)",
                  fontFamily: "var(--font-mono)",
                }}>
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 14, flexShrink: 0, alignItems: "center", fontSize: 13, color: "var(--muted)" }}>
          {repo.language && (
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: langColor, display: "inline-block" }} />
              {repo.language}
            </span>
          )}
          <span title="Stars">⭐ {repo.stargazersCount.toLocaleString()}</span>
          <span title="Forks" style={{ display: "none" }}>⑂ {repo.forksCount}</span>
          <span style={{ color: "var(--muted)", fontSize: 12 }}>{timeSince(repo.updatedAt)}</span>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{
          marginTop: 12, paddingTop: 12,
          borderTop: "1px solid var(--border)",
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 10, fontSize: 13,
        }}
          onClick={(e) => e.stopPropagation()}
        >
          <Detail label="Open issues"     value={repo.openIssuesCount} />
          <Detail label="Forks"           value={repo.forksCount} />
          <Detail label="Default branch"  value={repo.defaultBranch || "—"} mono />
          <Detail label="Created"         value={new Date(repo.createdAt).toLocaleDateString()} />
        </div>
      )}
    </div>
  );
}

function Detail({ label, value, mono }) {
  return (
    <div>
      <div style={{ color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ color: "var(--text)", marginTop: 2, fontFamily: mono ? "var(--font-mono)" : "inherit" }}>{value}</div>
    </div>
  );
}
