export default function UserProfile({ user }) {
  return (
    <div className="fade-in" style={{
      display: "flex", gap: 24, alignItems: "flex-start",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: 24,
    }}>
      <img
        src={user.avatarUrl}
        alt={user.login}
        width={80} height={80}
        style={{ borderRadius: "50%", flexShrink: 0, border: "2px solid var(--border)" }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          {user.name && (
            <h1 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)" }}>{user.name}</h1>
          )}
          <a
            href={user.htmlUrl}
            target="_blank"
            rel="noreferrer"
            style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--accent)" }}
          >
            @{user.login}
          </a>
        </div>

        {user.bio && (
          <p style={{ color: "var(--muted)", marginTop: 6, fontSize: 14, lineHeight: 1.5 }}>
            {user.bio}
          </p>
        )}

        <div style={{ display: "flex", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
          <Stat label="repos"      value={user.publicRepos} />
          <Stat label="followers"  value={user.followers}   />
          <Stat label="following"  value={user.following}   />
          {user.location && <Stat label="location" value={user.location} isText />}
        </div>

        {user.blog && (
          <a
            href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
            target="_blank"
            rel="noreferrer"
            style={{ display: "inline-block", marginTop: 8, fontSize: 13, color: "var(--accent)" }}
          >
            🔗 {user.blog}
          </a>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, isText }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
      {!isText && (
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>
          {value.toLocaleString()}
        </span>
      )}
      <span style={{ color: "var(--muted)", fontSize: 13 }}>
        {isText ? value : label}
      </span>
    </div>
  );
}
