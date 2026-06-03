import { useState, useMemo } from "react";
import RepoCard from "./RepoCard";

const SORT_OPTIONS = [
  { value: "updated",  label: "Recently updated" },
  { value: "stars",    label: "Most stars" },
  { value: "name",     label: "Name A–Z" },
];

export default function RepoList({ repos, hasMore, onLoadMore, loading }) {
  const [sort, setSort] = useState("updated");

  const sorted = useMemo(() => {
    const copy = [...repos];
    if (sort === "stars")   return copy.sort((a, b) => b.stargazersCount - a.stargazersCount);
    if (sort === "name")    return copy.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "updated") return copy.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return copy;
  }, [repos, sort]);

  if (repos.length === 0 && !loading) return null;

  return (
    <div>
      {/* Header + sort */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ color: "var(--muted)", fontSize: 13, fontFamily: "var(--font-mono)" }}>
          {repos.length} repos loaded
        </span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{
            background: "var(--surface)", color: "var(--text)",
            border: "1px solid var(--border)", borderRadius: "var(--radius)",
            padding: "6px 10px", fontSize: 13,
          }}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Repo cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sorted.map((repo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </div>

      {/* Load more */}
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={loading}
          style={{
            marginTop: 16, width: "100%",
            padding: "10px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            color: "var(--accent)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            opacity: loading ? 0.5 : 1,
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => !loading && (e.currentTarget.style.borderColor = "var(--accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          {loading ? "Loading…" : "Load more repos"}
        </button>
      )}
    </div>
  );
}
