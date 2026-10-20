/* =====================================================================
   Python Quest — exercise grading (browser side)
   The platform-neutral rules live in grade-core.js; this file just plugs
   them into the worker-backed runtime and memoises reference output.
   ===================================================================== */

import { run } from "./runtime.js";
import { gradeWith } from "./grade-core.js";

export { explainError, formatError, checkRequires, compareOutput } from "./grade-core.js";

const expectedOutput = new Map();

/**
 * Grade one attempt.
 * @returns {Promise<{status:'pass'|'fail'|'error', title, detail, run}>}
 */
export function gradeExercise(exercise, code, { onStatus = null } = {}) {
  const runner = (options) => run({ ...options, onStatus });
  return gradeWith(runner, exercise, code, expectedOutput);
}

/** Run an exercise without grading it — the "Run" button. */
export function runExercise(exercise, code, { onStatus = null } = {}) {
  return run({
    code,
    setup: exercise.setup || "",
    stdin: exercise.stdin || [],
    packages: exercise.packages || [],
    onStatus,
  });
}
