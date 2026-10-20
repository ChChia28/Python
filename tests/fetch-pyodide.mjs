#!/usr/bin/env node
/* Download and unpack the Pyodide distribution the site uses, into
   ./.pyodide, so `npm test` can run exercises offline against the exact
   same Python build. About 340 MB; only needed for running the test suite. */

import { existsSync, mkdirSync, createWriteStream } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { PYODIDE_VERSION } from "../src/runtime-core.js";

const ROOT = resolve(new URL("..", import.meta.url).pathname);
const target = join(ROOT, ".pyodide");
if (existsSync(join(target, "pyodide.mjs"))) {
  console.log(`Pyodide ${PYODIDE_VERSION} already present at ${target}`);
  process.exit(0);
}

const url = `https://github.com/pyodide/pyodide/releases/download/${PYODIDE_VERSION}/pyodide-${PYODIDE_VERSION}.tar.bz2`;
const tmp = join(ROOT, `.pyodide-${PYODIDE_VERSION}.tar.bz2`);
console.log(`Downloading ${url} …`);
const response = await fetch(url);
if (!response.ok) {
  console.error(`Download failed: ${response.status}`);
  process.exit(1);
}
await pipeline(Readable.fromWeb(response.body), createWriteStream(tmp));
mkdirSync(target, { recursive: true });
const tar = spawnSync("tar", ["xjf", tmp, "-C", target, "--strip-components=1"], { stdio: "inherit" });
if (tar.status !== 0) process.exit(tar.status);
console.log(`Unpacked to ${target}. Now run: npm test`);
