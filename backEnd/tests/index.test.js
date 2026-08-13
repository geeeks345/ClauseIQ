import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";

process.env.NODE_ENV = "test";

const { default: app } = await import("../app.js");

const makeRequest = async (path) => {
  const server = createServer(app);

  await new Promise((resolve) => server.listen(0, resolve));

  const { port } = server.address();

  try {
    return await fetch(`http://127.0.0.1:${port}${path}`);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
};

test("GET / returns backend status payload", async () => {
  const response = await makeRequest("/");
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.message, "ClauseIQ Backend Running");
});

test("GET /unknown-route returns 404", async () => {
  const response = await makeRequest("/unknown-route");

  assert.equal(response.status, 404);
});
