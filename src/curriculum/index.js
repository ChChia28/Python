/* =====================================================================
   Python Quest — curriculum index
   Ten modules, ordered from "what is a program" to pandas.
   ===================================================================== */

import m01 from "./01-first-steps.js";
import m02 from "./02-control-flow.js";
import m03 from "./03-collections.js";
import m04 from "./04-functions.js";
import m05 from "./05-text.js";
import m06 from "./06-iteration.js";
import m07 from "./07-errors-files.js";
import m08 from "./08-classes.js";
import m09 from "./09-stdlib.js";

export const MODULES = [m01, m02, m03, m04, m05, m06, m07, m08, m09];

/** Every lesson, in course order, with a back-reference to its module. */
export function allLessons() {
  const out = [];
  for (const mod of MODULES) {
    for (const lesson of mod.lessons) out.push({ ...lesson, module: mod });
  }
  return out;
}

/** Every exercise, with its module's packages merged in. */
export function allExercises() {
  const out = [];
  for (const mod of MODULES) {
    for (const lesson of mod.lessons) {
      for (const exercise of lesson.exercises || []) {
        out.push({ ...withPackages(exercise, mod), lesson, module: mod });
      }
    }
  }
  return out;
}

/** An exercise with the module-level packages folded into its own list. */
export function withPackages(exercise, mod) {
  const packages = [...new Set([...(mod.packages || []), ...(exercise.packages || [])])];
  return packages.length ? { ...exercise, packages } : exercise;
}

export function findModule(id) {
  return MODULES.find((m) => m.id === id) || null;
}

export function findLesson(id) {
  for (const mod of MODULES) {
    const lesson = mod.lessons.find((l) => l.id === id);
    if (lesson) return { lesson, module: mod };
  }
  return null;
}

/** Previous / next lesson across module boundaries. */
export function lessonNeighbours(id) {
  const lessons = allLessons();
  const index = lessons.findIndex((l) => l.id === id);
  return {
    prev: index > 0 ? lessons[index - 1] : null,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : null,
    index,
    total: lessons.length,
  };
}

export function moduleExerciseIds(mod) {
  return mod.lessons.flatMap((lesson) => (lesson.exercises || []).map((e) => e.id));
}

/**
 * Flat, lowercase haystack used by the search palette.
 * @param {Map<string, Map<string,string>>} prose  moduleId -> lessonId -> markdown
 */
export function searchIndex(prose = new Map()) {
  return allLessons().map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    module: lesson.module.title,
    moduleNumber: lesson.module.number,
    goal: lesson.goal || "",
    haystack: [
      lesson.title,
      lesson.goal,
      lesson.module.title,
      lesson.keywords ? lesson.keywords.join(" ") : "",
      (prose.get(lesson.module.id) || new Map()).get(lesson.id) || "",
    ]
      .join(" ")
      .toLowerCase(),
  }));
}
