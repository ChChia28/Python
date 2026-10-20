# Python Quest

Learn Python from zero to hero, in the browser. Ten modules, ~70 lessons and
~140 graded exercises that run on a **real Python interpreter** (CPython 3.14
compiled to WebAssembly via [Pyodide](https://pyodide.org)). Nothing to
install, no accounts, nothing leaves your browser.

```
First Steps → Making Decisions → Collections → Functions → Working with Text
→ Pythonic Iteration → Errors, Files and Data → Classes and Objects
→ Modules and the Standard Library → Data Hero: NumPy and pandas
```

## What's inside

- **Lessons** — short, example-driven prose with runnable code blocks.
- **Exercises** — your code is executed in a clean namespace and either its
  output is compared with the reference solution's, or a set of checks calls
  your functions. Any correct approach passes. Errors come with plain-language
  tips; output mismatches show a line-by-line diff.
- **Playground** — a scratch space with a persistent namespace, a variables
  panel and saved snippets.
- **Recall deck** — solved exercises come back at widening intervals (spaced
  retrieval) so they stick.
- **XP, levels, quests, streaks with freezes, insight cards, badges** — every
  mechanism is explained on the *Why it works* page, and none of them can take
  anything away from you.
- **Cheat sheet** — the whole course on one page, every example runnable.
- **Layered flat design** — light-first, one accent colour, big rounded cards,
  dark mode, works on a phone.

Progress is stored in `localStorage`; the Progress page exports/imports a
backup code.

## Run it locally

Any static server works — the app is plain HTML/CSS/ES modules with no build
step (ES modules and Web Workers don't load from `file://`):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

The interpreter is loaded from the Pyodide CDN on first visit (~10 MB, cached
afterwards). The data module downloads numpy and pandas on demand (~20 MB).

## Deploy

It's a static site. On Vercel: import the repo, framework preset **Other**, no
build command, output directory `.` — `vercel.json` is already included.

## Verify the curriculum

Every exercise is checked by executing it on the same Pyodide build the site
uses: the solution must pass, the starter must not, `requires` patterns must
hold, prose examples must run, and deliberately wrong answers must be rejected.

```bash
npm run pyodide:fetch    # one-off, ~340 MB, into ./.pyodide
npm test                 # all modules
node tests/run-exercises.mjs 03-collections -v   # one module, verbose
```

## Project layout

```
index.html              shell
assets/styles.css       the design system
src/main.js             routing, sidebar, search palette, theme
src/runtime.js          Python worker manager (timeouts, restarts)
src/worker.js           Pyodide in a Web Worker
src/runtime-core.js     run code, capture output, format errors (shared with tests)
src/grade-core.js       grading rules (shared with tests)
src/game.js             XP, quests, streaks, recall scheduling
src/curriculum/*.js     lessons, exercises, quizzes
content/*.md            lesson prose (one file per module)
tests/run-exercises.mjs the verifier
docs/AUTHORING.md       how to write a module
```

## Add a lesson

See [docs/AUTHORING.md](docs/AUTHORING.md): one entry in the module's `.js`
file, one `::: lesson <id>` section in its `.md` file, then `npm test`.

## License

MIT
