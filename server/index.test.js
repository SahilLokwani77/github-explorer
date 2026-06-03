const request = require("supertest");
const app = require("./index");
const cache = require("./cache");

// --- Cache unit tests ---
describe("cache", () => {
  beforeEach(() => cache.clear());

  test("returns null for missing keys", () => {
    expect(cache.get("nonexistent")).toBeNull();
  });

  test("returns stored data within TTL", () => {
    cache.set("key1", { name: "Alice" });
    expect(cache.get("key1")).toEqual({ name: "Alice" });
  });

  test("returns null after TTL expires", () => {
    jest.useFakeTimers();
    cache.set("key2", { name: "Bob" });
    jest.advanceTimersByTime(61 * 1000);
    expect(cache.get("key2")).toBeNull();
    jest.useRealTimers();
  });
});

// --- API integration tests ---
describe("GET /api/user/:username", () => {
  test("returns 404 for non-existent user", async () => {
    const res = await request(app).get("/api/user/this-user-absolutely-does-not-exist-xyz123");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  test("returns user data for a valid username", async () => {
    const res = await request(app).get("/api/user/torvalds");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("login", "torvalds");
    expect(res.body).toHaveProperty("avatarUrl");
  }, 10000);
});

describe("GET /health", () => {
  test("returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
