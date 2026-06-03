import { useState, useCallback } from "react";

const BASE = import.meta.env.VITE_API_URL || "";

export function useGitHub() {
  const [user, setUser]       = useState(null);
  const [repos, setRepos]     = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage]       = useState(1);
  const [status, setStatus]   = useState("idle"); // idle | loading | success | error
  const [error, setError]     = useState(null);
  const [currentUsername, setCurrentUsername] = useState("");

  const search = useCallback(async (username) => {
    const trimmed = username.trim();
    if (!trimmed) return;

    setStatus("loading");
    setError(null);
    setUser(null);
    setRepos([]);
    setPage(1);
    setCurrentUsername(trimmed);

    try {
      const [userRes, reposRes] = await Promise.all([
        fetch(`${BASE}/api/user/${trimmed}`),
        fetch(`${BASE}/api/repos/${trimmed}?page=1`),
      ]);

      // Parse both responses (even on error, we want the JSON body)
      const userData  = await userRes.json();
      const reposData = await reposRes.json();

      if (!userRes.ok)  throw new Error(userData.error  || "Failed to load user");
      if (!reposRes.ok) throw new Error(reposData.error || "Failed to load repos");

      setUser(userData);
      setRepos(reposData.repos);
      setHasMore(reposData.hasNextPage);
      setStatus("success");

      // Save to recently searched (localStorage)
      saveRecentSearch(trimmed, userData.avatarUrl);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || status === "loading") return;
    const nextPage = page + 1;
    setStatus("loading");

    try {
      const res  = await fetch(`${BASE}/api/repos/${currentUsername}?page=${nextPage}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load more repos");

      setRepos((prev) => [...prev, ...data.repos]);
      setHasMore(data.hasNextPage);
      setPage(nextPage);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }, [hasMore, status, page, currentUsername]);

  return { user, repos, hasMore, status, error, search, loadMore };
}

// --- Recent searches (localStorage) ---
const RECENT_KEY = "gh_explorer_recent";
const MAX_RECENT = 5;

function saveRecentSearch(username, avatarUrl) {
  try {
    const existing = getRecentSearches().filter((r) => r.username !== username);
    const updated  = [{ username, avatarUrl }, ...existing].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch (_) {}
}

export function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch (_) {
    return [];
  }
}
