const express = require("express");
const cache = require("./cache");
const { fetchUser, fetchRepos } = require("./github");

const router = express.Router();

// GET /api/user/:username
router.get("/user/:username", async (req, res, next) => {
  const { username } = req.params;
  const cacheKey = `user:${username.toLowerCase()}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({ ...cached, fromCache: true });
  }

  try {
    const user = await fetchUser(username);
    cache.set(cacheKey, user);
    res.json({ ...user, fromCache: false });
  } catch (err) {
    next(err);
  }
});

// GET /api/repos/:username?page=1
router.get("/repos/:username", async (req, res, next) => {
  const { username } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const cacheKey = `repos:${username.toLowerCase()}:${page}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return res.json({ ...cached, fromCache: true });
  }

  try {
    const result = await fetchRepos(username, page);
    cache.set(cacheKey, result);
    res.json({ ...result, fromCache: false });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
