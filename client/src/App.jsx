import { useGitHub } from "./hooks/useGitHub";
import SearchBar from "./components/SearchBar";
import UserProfile from "./components/UserProfile";
import RepoList from "./components/RepoList";
import LanguageChart from "./components/LanguageChart";
import { ProfileSkeleton, RepoSkeleton } from "./components/SkeletonLoader";

export default function App() {
  const { user, repos, hasMore, status, error, search, loadMore } = useGitHub();

  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError   = status === "error";
  const isIdle    = status === "idle";

  return (
    <div style={{ minHeight: "100vh", padding: "0 16px 60px" }}>
      {/* Header */}
      <header style={{
        maxWidth: 780, margin: "0 auto", padding: "40px 0 32px",
        borderBottom: "1px solid var(--border)", marginBottom: 32,
        display: "flex", flexDirection: "column", gap: 24,
      }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700,
            color: "var(--text)", letterSpacing: "-0.02em",
          }}>
            gh<span style={{ color: "var(--accent)" }}>·</span>explorer
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
            Search any GitHub user and explore their public repositories
          </p>
        </div>
        <SearchBar onSearch={search} disabled={isLoading} />
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 780, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Loading skeleton */}
        {isLoading && !user && (
          <>
            <ProfileSkeleton />
            <RepoSkeleton />
          </>
        )}

        {/* Error */}
        {isError && (
          <div style={{
            background: "#f8514920",
            border: "1px solid var(--red)",
            borderRadius: "var(--radius)",
            padding: "14px 18px",
            color: "var(--red)",
            fontFamily: "var(--font-mono)",
            fontSize: 14,
          }}>
            ✕ {error}
          </div>
        )}

        {/* Results */}
        {(isSuccess || (isLoading && user)) && (
          <>
            {user && <UserProfile user={user} />}

            {/* Two column layout on wider screens */}
            <div style={{
              display: "grid",
              gridTemplateColumns: repos.length > 0 ? "1fr 220px" : "1fr",
              gap: 20,
              alignItems: "start",
            }}>
              <div>
                {isLoading && repos.length === 0 ? (
                  <RepoSkeleton />
                ) : (
                  <RepoList
                    repos={repos}
                    hasMore={hasMore}
                    onLoadMore={loadMore}
                    loading={isLoading}
                  />
                )}
              </div>

              {repos.length > 0 && (
                <div style={{ position: "sticky", top: 16 }}>
                  <LanguageChart repos={repos} />
                </div>
              )}
            </div>
          </>
        )}

        {/* Empty state */}
        {isIdle && (
          <div style={{
            textAlign: "center", padding: "80px 0",
            color: "var(--muted)", fontFamily: "var(--font-mono)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⌕</div>
            <div style={{ fontSize: 14 }}>Search a username to get started</div>
          </div>
        )}
      </main>
    </div>
  );
}
