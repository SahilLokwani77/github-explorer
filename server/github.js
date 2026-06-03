const fetch = require("node-fetch");

const GITHUB_BASE = "https://api.github.com";

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN && {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  }),
};

async function fetchUser(username) {
  const res = await fetch(`${GITHUB_BASE}/users/${username}`, { headers });

  if (res.status === 404) {
    const err = new Error(`User '${username}' not found`);
    err.statusCode = 404;
    throw err;
  }

  if (res.status === 403 || res.status === 429) {
    const err = new Error("GitHub API rate limit exceeded. Please try again later.");
    err.statusCode = 429;
    throw err;
  }

  if (!res.ok) {
    const err = new Error("Failed to fetch user from GitHub");
    err.statusCode = 502;
    throw err;
  }

  const data = await res.json();

  return {
    login: data.login,
    name: data.name,
    bio: data.bio,
    avatarUrl: data.avatar_url,
    htmlUrl: data.html_url,
    followers: data.followers,
    following: data.following,
    publicRepos: data.public_repos,
    location: data.location,
    company: data.company,
    blog: data.blog,
    createdAt: data.created_at,
  };
}

async function fetchRepos(username, page = 1) {
  const url = `${GITHUB_BASE}/users/${username}/repos?per_page=30&page=${page}&sort=updated`;
  const res = await fetch(url, { headers });

  if (res.status === 404) {
    const err = new Error(`User '${username}' not found`);
    err.statusCode = 404;
    throw err;
  }

  if (res.status === 403 || res.status === 429) {
    const err = new Error("GitHub API rate limit exceeded. Please try again later.");
    err.statusCode = 429;
    throw err;
  }

  if (!res.ok) {
    const err = new Error("Failed to fetch repositories from GitHub");
    err.statusCode = 502;
    throw err;
  }

  const data = await res.json();
  const linkHeader = res.headers.get("link") || "";
  const hasNextPage = linkHeader.includes('rel="next"');

  const repos = data.map((repo) => ({
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    htmlUrl: repo.html_url,
    language: repo.language,
    stargazersCount: repo.stargazers_count,
    forksCount: repo.forks_count,
    openIssuesCount: repo.open_issues_count,
    defaultBranch: repo.default_branch,
    updatedAt: repo.updated_at,
    createdAt: repo.created_at,
    fork: repo.fork,
    topics: repo.topics || [],
  }));

  return { repos, hasNextPage };
}

module.exports = { fetchUser, fetchRepos };
