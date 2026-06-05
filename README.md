# gh·explorer

A full-stack GitHub profile explorer built for the Studio Graphene take-home assessment (Exercise 3). Enter any GitHub username and the app fetches their public profile and repositories through a Node.js proxy backend — never directly from the browser. The backend caches each response for 60 seconds to respect GitHub's rate limits.

**Live demo:** (https://lambent-marshmallow-c9510b.netlify.app)

---

## Tech Stack

| Layer     | Choice       | Why                                                                         |
|-----------|-------------|-----------------------------------------------------------------------------|
| Backend   | Node.js + Express | Lightweight, straightforward REST proxy; easy to reason about          |
| Frontend  | React + Vite      | Fast dev server, functional components with hooks throughout            |
| Charts    | Recharts          | Simple React-native pie chart for language breakdown                    |
| Styling   | Plain CSS + CSS variables | No extra build step; dark theme with design tokens                |
| Storage   | In-memory `Map`   | 60-second TTL cache; no database needed for this scope                  |

---

## How to Run Locally

Assumes only Node.js (v18+) is installed.

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/github-explorer.git
cd github-explorer
```

### 2. Start the backend

```bash
cd server
npm install
npm run dev        # starts on http://localhost:4000
```

Optional — add a GitHub personal access token to raise the rate limit from 60 to 5000 req/hour:

```bash
echo "GITHUB_TOKEN=ghp_your_token_here" > .env
```

### 3. Start the frontend

In a new terminal:

```bash
cd client
npm install
npm run dev        # starts on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Run backend tests

```bash
cd server
npm test
```

---

## API Documentation

Base URL: `http://localhost:4000`

### `GET /api/user/:username`

Fetches a GitHub user's public profile.

**Response (200)**
```json
{
  "login": "torvalds",
  "name": "Linus Torvalds",
  "bio": "Just for fun",
  "avatarUrl": "https://avatars.githubusercontent.com/u/1024025",
  "htmlUrl": "https://github.com/torvalds",
  "followers": 240000,
  "following": 0,
  "publicRepos": 7,
  "location": "Portland, OR",
  "company": null,
  "blog": "",
  "createdAt": "2011-09-03T15:26:22Z",
  "fromCache": false
}
```

**Error responses**
```json
{ "error": "User 'xyz' not found" }           // 404
{ "error": "GitHub API rate limit exceeded…" } // 429
{ "error": "Failed to fetch user from GitHub" }// 502
```

---

### `GET /api/repos/:username?page=1`

Fetches paginated public repositories for a user (30 per page).

**Query params**

| Param | Type   | Default | Description     |
|-------|--------|---------|-----------------|
| page  | number | 1       | Pagination page |

**Response (200)**
```json
{
  "repos": [
    {
      "id": 2325298,
      "name": "linux",
      "fullName": "torvalds/linux",
      "description": "Linux kernel source tree",
      "htmlUrl": "https://github.com/torvalds/linux",
      "language": "C",
      "stargazersCount": 180000,
      "forksCount": 55000,
      "openIssuesCount": 0,
      "defaultBranch": "master",
      "updatedAt": "2024-01-01T12:00:00Z",
      "createdAt": "2011-09-04T22:48:12Z",
      "fork": false,
      "topics": []
    }
  ],
  "hasNextPage": false,
  "fromCache": false
}
```

---

### `GET /health`

Returns `{ "status": "ok" }` — useful for deployment health checks.

---

## Project Structure

```
github-explorer/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx       # Search input + recent searches dropdown
│   │   │   ├── UserProfile.jsx     # Avatar, bio, follower stats
│   │   │   ├── RepoList.jsx        # Sort controls + list container
│   │   │   ├── RepoCard.jsx        # Individual repo row (expandable)
│   │   │   ├── SkeletonLoader.jsx  # Shimmer skeletons for loading state
│   │   │   └── LanguageChart.jsx   # Recharts pie chart (bonus)
│   │   ├── hooks/
│   │   │   └── useGitHub.js        # All fetch logic + localStorage recent searches
│   │   ├── App.jsx                 # Root layout and state orchestration
│   │   ├── main.jsx                # ReactDOM entry point
│   │   └── index.css              # Global CSS variables + animations
│   ├── index.html
│   └── vite.config.js             # Dev proxy → backend :4000
│
├── server/
│   ├── index.js          # Express app, CORS, error middleware
│   ├── routes.js         # /api/user and /api/repos route handlers
│   ├── github.js         # All GitHub API fetch calls
│   ├── cache.js          # In-memory Map with 60s TTL
│   └── index.test.js     # Jest + Supertest tests
│
└── README.md
```

---

## What Works

- Profile display (avatar, bio, stats, blog link)
- Repository list with sort (stars, name, last updated)
- Click-to-expand repo details (issues, forks, default branch)
- Pagination via "Load more repos" (GitHub's 30-per-page)
- Server-side 60-second cache (cache miss → GitHub API, cache hit → instant)
- Graceful error handling: unknown user, rate limit, network failure
- Skeleton loading states for profile and repo list
- Recently searched users (localStorage, persists across sessions)
- Language breakdown pie chart (Recharts)

## Next Steps / What I'd Build With More Time

- **Search-as-you-type debounce** — currently requires hitting Enter or the button; a 300ms debounce would feel more fluid
- **Persistent cache with Redis** — in-memory cache resets on server restart; Redis would survive restarts and work across multiple server instances
- **Language breakdown by lines of code** — the chart currently counts repos per language, not actual lines; the GitHub API has a per-repo `/languages` endpoint
- **Starred repos view** — the GitHub API also exposes starred repos; would be a natural second tab
- **Accessibility pass** — keyboard navigation and ARIA labels need more attention, especially on the expandable repo cards
- **Rate limit header display** — the GitHub API returns `X-RateLimit-Remaining`; surfacing this in the UI would be helpful
