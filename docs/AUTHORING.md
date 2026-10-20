# Authoring a Python Quest module

Python Quest is a zero-to-hero Python course that runs entirely in the browser
(Pyodide, Python 3.14). Every exercise is **executed and graded for real** —
never string-matched. Each module is two files:

| File | Holds |
|---|---|
| `src/curriculum/NN-<module-id>.js` | structure: lessons → exercises (code, checks, hints) + quiz |
| `content/<module-id>.md` | the teaching prose for every lesson, with runnable examples |

Verify your module before you hand it over:

```bash
PYODIDE_DIST=<path to unpacked pyodide dist> node tests/run-exercises.mjs NN-<module-id>
```

It must end with `0 failed`. The harness runs every solution, every starter,
every prose example, and checks ids, quizzes and rule patterns.

---

## 1. The module file

```js
/* Module 3 — Collections --------------------------------------------- */

export default {
  id: "collections",          // kebab-case, matches content/collections.md
  number: 3,
  title: "Collections",
  level: "Beginner",          // Beginner | Intermediate | Advanced | Hero
  summary: "One or two sentences on what the module gives the learner.",
  packages: [],               // Pyodide packages the whole module needs, e.g. ["numpy", "pandas"]
  lessons: [
    {
      id: "m3-lists",         // "m<module-number>-<slug>", unique across the course
      title: "Lists: create, index, append",
      goal: "One sentence: what the learner can do afterwards.",
      keywords: ["list", "index", "append", "len"],   // for search
      exercises: [ /* 2 per lesson, occasionally 3 */ ],
      quiz: [ /* 1–2 questions */ ],
    },
  ],
};
```

### An exercise

```js
{
  id: "m3-lists-e1",                // "<lesson-id>-e<n>"
  prompt: "Markdown. Say exactly what to **print** or what function to **define**, with its name and arguments.",
  starter: "numbers = [3, 1, 4, 1, 5]\n# your code here\n",   // may be "" — but never already correct
  solution: "numbers = [3, 1, 4, 1, 5]\nprint(len(numbers))",
  hints: [
    "A nudge in the right direction.",
    "More specific — names the function or construct.",
    "Nearly the answer.",
  ],

  // ---- checks: use at least one of these ----
  expectOutput: true,               // stdout must equal the solution's stdout, line by line
  tests: "assert total(2, 3) == 5, 'total(2, 3) should be 5'\nassert total(0, 0) == 0, 'total(0, 0) should be 0'",

  // ---- optional ----
  stdin: ["Ana", "42"],             // what input() returns, in order (only in lessons that teach input)
  setup: "open('notes.txt', 'w').write('line 1\\nline 2\\n')",   // runs before the learner's code; fixtures, files
  requires: [{ re: "\\bfor\\b", msg: "Use a for loop for this one." }],   // regex on the code (comments/strings stripped)
  packages: ["numpy"],              // extra Pyodide packages for this exercise only
  wrong: ["numbers = [3, 1, 4, 1, 5]\nprint(numbers)"],   // plausible wrong answers the checks must reject (recommended, 1–2)
}
```

**Choosing checks**

- Task says *print something* → `expectOutput: true`. The prompt must pin the
  format precisely ("one number per line", "`Total: 12`"), because spacing and
  capitalisation count (trailing whitespace doesn't).
- Task says *define a function / class / variable* → `tests`. Tests run in the
  learner's namespace after their code. Use `assert <condition>, "<message the
  learner will read>"`. Messages are the feedback: say what was expected
  ("`area(2, 3)` should return 6, got …") not what went wrong internally.
- Both is fine: a function exercise can also require a demo print.
- Don't grade style. Any correct approach should pass unless the lesson is
  *about* a construct — then add a `requires` rule with a friendly `msg`.
- Tests must be deterministic. If randomness is involved, seed it inside the
  test or test properties (length, range) rather than exact values.
- Tests may define helpers. Keep them short. They may read `__stdout__`? No —
  use `expectOutput` for printed output instead.
- Prefer several small asserts over one big one, so the first failure is specific.
- When a test calls a function that may not exist yet, the learner sees a clear
  NameError — that's fine, but a guard like
  `assert 'area' in dir(), "Define a function called area"` reads better.

**Starter code** is the learner's launch pad: imports, fixture data, a stub
(`def area(w, h):\n    pass`), or a comment. It must *not* pass the checks
(the harness enforces this).

**Hints** go from gentle to nearly-the-answer, 2–3 per exercise.

### A quiz question

```js
{
  q: "What does `len([])` return?",
  options: ["0", "None", "An error", "1"],
  answer: 0,                         // index into options
  explain: "An empty list has no items, so its length is 0. Only the explanation is shown after answering.",
}
```

The first quiz question is also shown as a *prediction* before the lesson is
read, so make it a question the lesson answers — ideally one with a tempting
wrong answer.

---

## 2. The prose file

```markdown
::: lesson m3-lists

Opening paragraph: what problem this solves and the mental model. Plain,
friendly, precise. No fluff, no "In this lesson we will".

## A heading

Prose. Inline code with `backticks`. **Bold** for the key term the first time
it appears.

```python
numbers = [3, 1, 4]
numbers.append(1)
print(numbers)
```

Say what the example prints or demonstrates right after it.

> [!tip] Callout for a shortcut or an idiom.

> [!warn] Callout for a trap learners fall into.

## Common mistakes

A short list of the 2–3 things people get wrong, each with the fix.

::: lesson m3-slicing
…
```

- One `::: lesson <id>` block per lesson, in course order, ids identical to the
  module file.
- 300–600 words per lesson plus 2–4 code examples. Headings use `##`/`###`.
- Fence languages:
  - ```` ```python ```` — **runnable**, shown with a Run button; the harness
    executes it and it must not raise. Make examples print something.
  - ```` ```python-error ```` — runs and **must raise**; use it to show a
    traceback on purpose.
  - ```` ```python-static ```` — shown, not runnable (fragments, pseudo-code).
  - ```` ```text ```` — expected output or a traceback transcript.
- Tables, bullet lists and numbered lists are supported. Links too.
- Examples run in a fresh namespace each time, in an empty working directory.
  They see the module's `packages`.
- No `input()` in examples (it has nothing to read). Teach `input()` in prose
  with a static fence, and grade it with `stdin`.

---

## 3. Environment facts the content must respect

- Python **3.14** (Pyodide). The standard library is available; no network;
  no `tkinter`; `time.sleep` works but keep it ≤ 0.1 s; threads exist but
  don't teach them here.
- The data module may use **numpy 2.4** and **pandas 3.0**. pandas 3 defaults:
  copy-on-write is on, the default string dtype is `str` (not `object`),
  `df.info()` prints to stdout, `.apply` on axis rows is fine.
  `matplotlib` is **not** loaded — teach plotting as "what you'd do next".
- Files: read/write in the current directory only. The directory is wiped
  before every run, so create files in `setup` or in the code itself.
- Runs are killed after ~8 s. Loops that run millions of times are out.
- `print` output is captured raw; `end=""` and `sep=` work as normal.
- `random`: call `random.seed(…)` in examples so output is stable.

---

## 4. Voice and pedagogy

- Second person, present tense, concrete. "Python reads your file top to
  bottom" beats "The interpreter processes statements sequentially".
- Explain the **why** and the **mental model**, then the syntax, then a trap.
- Every lesson ends with a `## Common mistakes` (or `## Watch out for`) section.
- Prefer real-feeling data: names, prices, scores, cities — not foo/bar.
- Exercises escalate: the first one is a near-copy of an example with a twist;
  the second needs a small leap.
- The whole course should feel like one voice. Read `content/first-steps.md`
  if it exists before writing another module.
