const CACHE_TTL_MS = 60 * 1000; // 60 seconds

const store = new Map();

function get(key) {
  const entry = store.get(key);
  if (!entry) return null;

  const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;
  if (isExpired) {
    store.delete(key);
    return null;
  }

  return entry.data;
}

function set(key, data) {
  store.set(key, { data, timestamp: Date.now() });
}

function clear() {
  store.clear();
}

module.exports = { get, set, clear };
