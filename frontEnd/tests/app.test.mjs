import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const rootDir = new URL("../", import.meta.url);

const readProjectFile = async (relativePath) =>
  readFile(new URL(relativePath, rootDir), "utf8");

test("App routes include login, register, and dashboard pages", async () => {
  const appSource = await readProjectFile("src/App.jsx");

  assert.match(appSource, /path="\/"/);
  assert.match(appSource, /path="\/register"/);
  assert.match(appSource, /path="\/dashboard"/);
});

test("Login page renders the expected ClauseIQ heading", async () => {
  const loginSource = await readProjectFile("src/pages/login.jsx");

  assert.match(loginSource, /ClauseIQ Login/);
  assert.match(loginSource, /Create one here/);
  assert.match(loginSource, /Continue as/);
});

test("Dashboard page includes logout flow text", async () => {
  const dashboardSource = await readProjectFile("src/pages/dashboard.jsx");

  assert.match(dashboardSource, /ClauseIQ Dashboard/);
  assert.match(dashboardSource, /Logout/);
});
