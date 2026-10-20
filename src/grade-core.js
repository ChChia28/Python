/* =====================================================================
   Python Quest — grading core
   Platform-neutral: used by the browser grader and the Node test harness.

   An exercise is graded by *running* it, never by string-matching:
     1. optional `requires` patterns (e.g. "use a for loop") on the code
        with comments and string literals stripped,
     2. the learner's code runs in a fresh namespace — any exception is an
        error verdict with a plain-language tip,
     3. if `expectOutput` is set, stdout is compared line by line with the
        output of the reference solution,
     4. if `tests` is set, that Python runs in the same namespace and must
        not raise; an AssertionError's message becomes the feedback.
   ===================================================================== */

import { escapeHtml } from "./escape.js";

/* ------------------------------------------------------------- requires */

/** Strip comments and string literals so pattern checks can't be fooled. */
export function bareCode(code) {
  return String(code)
    .replace(/("""|''')[\s\S]*?\1/g, ' "str" ')
    .replace(/"(?:\\.|[^"\\\n])*"/g, ' "str" ')
    .replace(/'(?:\\.|[^'\\\n])*'/g, " 'str' ")
    .replace(/#[^\n]*/g, " ");
}

export function checkRequires(exercise, code) {
  const bare = bareCode(code);
  for (const rule of exercise.requires || []) {
    const re = new RegExp(rule.re, rule.flags || "m");
    const hit = re.test(bare);
    if (rule.not ? hit : !hit) {
      return { status: "fail", title: rule.msg, detail: rule.detail || "" };
    }
  }
  return null;
}

/* --------------------------------------------------------------- output */

export function normalizeOutput(text) {
  const lines = String(text ?? "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""));
  while (lines.length && !lines[lines.length - 1]) lines.pop();
  return lines;
}

export function compareOutput(expected, actual) {
  const a = normalizeOutput(expected);
  const b = normalizeOutput(actual);
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i += 1) {
    if (a[i] !== b[i]) return { same: false, index: i, expected: a, actual: b };
  }
  return { same: true, index: -1, expected: a, actual: b };
}

/** Side-by-side view of an output mismatch, highlighting the first difference. */
export function outputDiff(cmp, { maxLines = 14 } = {}) {
  const from = Math.max(0, cmp.index - 3);
  const to = Math.min(Math.max(cmp.expected.length, cmp.actual.length), from + maxLines);
  const col = (lines, label) => {
    const rows = [];
    for (let i = from; i < to; i += 1) {
      const text = lines[i];
      const missing = text === undefined;
      rows.push(
        `<div class="diff-line ${i === cmp.index ? "hit" : ""} ${missing ? "missing" : ""}"><span class="n">${
          i + 1
        }</span><code>${missing ? "(no line)" : escapeHtml(text) || "&nbsp;"}</code></div>`
      );
    }
    return `<div class="diff-col"><div class="diff-head">${label}</div>${rows.join("")}</div>`;
  };
  const note =
    cmp.expected[cmp.index] !== undefined && cmp.actual[cmp.index] === undefined
      ? "Your program printed fewer lines than expected."
      : cmp.expected[cmp.index] === undefined
        ? "Your program printed more lines than expected."
        : `Line ${cmp.index + 1} differs.`;
  return `<div class="diff">${col(cmp.expected, "Expected output")}${col(
    cmp.actual,
    "Your output"
  )}</div><p class="faint diff-note">${note} Spacing and capitalisation count; trailing spaces don't.</p>`;
}

/* --------------------------------------------------------------- errors */

const q = (s) => `<code>${escapeHtml(s)}</code>`;

/** A plain-language tip for the most common Python errors. HTML. */
export function explainError(error) {
  if (!error) return "";
  const type = error.type || "";
  const msg = String(error.message || "");
  const tips = [
    [/^IndentationError$/, /expected an indented block/i, () =>
      `The line after a ${q(":")} must be indented. Python uses indentation (4 spaces) to know which lines belong to the ${q("if")}, loop or ${q("def")} above.`],
    [/^IndentationError$/, /unexpected indent/i, () =>
      `This line is indented but the one before it doesn't open a block. Remove the extra spaces at the start of the line.`],
    [/^IndentationError$/, /unindent does not match/i, () =>
      `The indentation here doesn't line up with any line above it. Every line in the same block needs exactly the same number of leading spaces.`],
    [/^SyntaxError$/, /expected ':'/i, () =>
      `Lines that open a block — ${q("if")}, ${q("elif")}, ${q("else")}, ${q("for")}, ${q("while")}, ${q("def")}, ${q("class")}, ${q("try")} — end with a colon.`],
    [/^SyntaxError$/, /was never closed/i, () =>
      `Every opening bracket or quote needs a matching closing one. Count the ${q("(")}, ${q("[")} and ${q("\"")} on that line.`],
    [/^SyntaxError$/, /unterminated string/i, () =>
      `A string opened on this line never closes. Make sure the quotes match: ${q("\"like this\"")} or ${q("'like this'")}.`],
    [/^SyntaxError$/, /forgot a comma/i, () =>
      `Two values are sitting next to each other without an operator or a comma between them.`],
    [/^SyntaxError$/, /unmatched/i, () =>
      `There's a closing bracket with no opening partner. Delete it, or add the missing opening bracket.`],
    [/^SyntaxError$/, /cannot assign|invalid syntax. Maybe you meant '=='/i, () =>
      `Use ${q("==")} to compare values and a single ${q("=")} only to assign to a name.`],
    [/^SyntaxError$/, /Missing parentheses in call to 'print'/i, () =>
      `In Python 3, ${q("print")} is a function: ${q("print(\"hi\")")}.`],
    [/^SyntaxError$/, /invalid syntax/i, () =>
      `Python couldn't parse this line. Check for a missing colon, comma or closing bracket, a stray word, or an operator with nothing on one side.`],
    [/^NameError$/, /name '(.+?)' is not defined/i, (m) =>
      `Python has never seen ${q(m[1])}. Either it's misspelt, it's defined further down (Python reads top to bottom), or you meant a string — text needs quotes: ${q(`"${m[1]}"`)}.`],
    [/^TypeError$/, /can only concatenate str/i, () =>
      `You can't glue a number onto a string with ${q("+")}. Convert it first with ${q("str(number)")}, or use an f-string: ${q('f"Total: {total}"')}.`],
    [/^TypeError$/, /unsupported operand type\(s\) for (\S+): 'str' and 'int'|'int' and 'str'/i, () =>
      `One side of the operator is text and the other is a number. Convert with ${q("int()")}, ${q("float()")} or ${q("str()")} so both sides are the same kind of thing.`],
    [/^TypeError$/, /missing (\d+) required positional argument/i, (m) =>
      `The function was called with too few arguments — it needs ${m[1]} more. Check the ${q("def")} line for what it expects.`],
    [/^TypeError$/, /takes (\d+) positional arguments? but (\d+) were given/i, (m) =>
      `The function was called with ${m[2]} arguments but is defined to take ${m[1]}. If this is a method, remember ${q("self")} comes first in the ${q("def")}.`],
    [/^TypeError$/, /'NoneType' object/i, () =>
      `Something is ${q("None")} where you expected a value. The usual cause: a function that forgot to ${q("return")} (it returns ${q("None")} by default), or a method like ${q(".sort()")} that works in place and returns ${q("None")}.`],
    [/^TypeError$/, /object is not subscriptable/i, () =>
      `You used ${q("[...]")} on something that isn't a sequence or mapping — for example calling ${q("x[0]")} on a number or on a function. Check what the variable actually holds with ${q("print(type(x))")}.`],
    [/^TypeError$/, /object is not iterable/i, () =>
      `You tried to loop over (or unpack) something that isn't a collection. ${q("for i in 5:")} fails; ${q("for i in range(5):")} works.`],
    [/^TypeError$/, /object is not callable/i, () =>
      `You put ${q("()")} after something that isn't a function — often because a variable shadowed a function name (for example naming a variable ${q("list")} or ${q("print")}).`],
    [/^TypeError$/, /unhashable type/i, () =>
      `Dictionary keys and set members must be immutable. A list can't be a key — use a tuple instead.`],
    [/^IndexError$/, /out of range/i, () =>
      `The index is bigger than the collection. Remember indexes start at 0, so the last item of a list with 5 items is ${q("[4]")} (or ${q("[-1]")}).`],
    [/^KeyError$/, /.*/, (m) =>
      `That key isn't in the dictionary. Check the exact spelling and type (${q('"1"')} and ${q("1")} are different keys), or use ${q(".get(key, default)")} when the key might be missing.`],
    [/^ValueError$/, /invalid literal for int\(\)/i, () =>
      `${q("int()")} only accepts text that looks like a whole number. ${q('int("3.5")')} and ${q('int("abc")')} both fail — use ${q("float()")} for decimals.`],
    [/^ValueError$/, /not enough values to unpack|too many values to unpack/i, () =>
      `The number of names on the left of ${q("=")} doesn't match the number of items on the right.`],
    [/^ZeroDivisionError$/, /.*/, () =>
      `You divided by zero. Guard it: ${q("if total == 0:")} before dividing, or handle it with ${q("try/except ZeroDivisionError")}.`],
    [/^AttributeError$/, /'list' object has no attribute 'push'/i, () =>
      `Python lists use ${q(".append(item)")}, not ${q(".push()")}.`],
    [/^AttributeError$/, /'str' object has no attribute/i, () =>
      `Strings are immutable and have their own methods (${q(".upper()")}, ${q(".split()")}…). If you expected a list, check what the variable actually holds.`],
    [/^AttributeError$/, /'(.+?)' object has no attribute '(.+?)'/i, (m) =>
      `A ${q(m[1])} value has no ${q(m[2])}. Either the name is misspelt or the variable isn't the type you think — ${q("print(type(x))")} to check.`],
    [/^UnboundLocalError$/, /.*/, () =>
      `A variable is assigned somewhere inside the function, so Python treats it as local for the whole function — including lines before the assignment. Pass the value in as a parameter, or declare ${q("global name")} if you really mean the outer one.`],
    [/^RecursionError$/, /.*/, () =>
      `The function keeps calling itself without ever reaching a base case. Make sure there is an ${q("if")} that returns without recursing.`],
    [/^EOFError$/, /.*/, () =>
      `${q("input()")} was called but there was nothing left to read. This exercise supplies a fixed list of inputs — call ${q("input()")} only as many times as the task says.`],
    [/^ModuleNotFoundError$/, /No module named '(.+?)'/i, (m) =>
      `There is no module called ${q(m[1])} here. Check the spelling; only the standard library (plus numpy and pandas in the data module) is available.`],
    [/^FileNotFoundError$/, /.*/, () =>
      `That file doesn't exist in the working directory. Files are only created by your code (or the exercise's setup) and the folder is wiped before every run.`],
    [/^StopIteration$/, /.*/, () =>
      `${q("next()")} was called on an exhausted iterator. Give it a default — ${q("next(it, None)")} — or loop with ${q("for")} instead.`],
    [/^AssertionError$/, /.*/, () => ""],
  ];
  for (const [typeRe, msgRe, make] of tips) {
    if (!typeRe.test(type)) continue;
    const m = msgRe.exec(msg);
    if (m) return make(m);
  }
  return "";
}

/** A compact, readable rendering of a runtime/syntax error. HTML. */
export function formatError(error, { filename = "" } = {}) {
  if (!error) return "";
  const where = error.line ? ` <span class="faint">(line ${error.line}${filename ? ` of ${escapeHtml(filename)}` : ""})</span>` : "";
  const text = error.text ? `<pre class="err-line"><code>${escapeHtml(error.text)}${
    error.offset && error.type === "SyntaxError"
      ? `\n${" ".repeat(Math.max(0, error.offset - 1))}^`
      : ""
  }</code></pre>` : "";
  return `<div class="err-head"><strong>${escapeHtml(error.type)}</strong>: ${escapeHtml(error.message)}${where}</div>${text}`;
}

/* ---------------------------------------------------------------- grade */

/**
 * Grade one exercise attempt.
 *
 * @param runner  async ({code, setup, tests, stdin, packages}) => RunResult
 * @param exercise
 * @param code    the learner's code
 * @param cache   Map used to memoise the reference solution's output
 * @returns {Promise<{status:'pass'|'fail'|'error', title, detail, run}>}
 */
export async function gradeWith(runner, exercise, code, cache = new Map()) {
  const source = String(code || "");
  if (!source.trim()) {
    return { status: "error", title: "Write some code first", detail: "The editor is empty." };
  }

  const ruleFail = checkRequires(exercise, source);
  if (ruleFail) return ruleFail;

  const base = {
    setup: exercise.setup || "",
    stdin: exercise.stdin || [],
    packages: exercise.packages || [],
  };

  const run = await runner({ ...base, code: source, tests: exercise.tests || "" });

  if (run.timedOut) {
    return {
      status: "error",
      title: "Your code ran for too long",
      detail:
        "It was stopped after a few seconds — almost always an infinite loop. Check that the loop condition eventually becomes false, or that a <code>while</code> loop changes the variable it tests.",
      run,
    };
  }

  if (!run.ok && run.phase !== "tests") {
    const tip = explainError(run.error);
    return {
      status: "error",
      title: run.phase === "setup" ? "The exercise setup failed" : `${run.error.type}`,
      detail: formatError(run.error) + (tip ? `<div class="tip">${tip}</div>` : ""),
      run,
    };
  }

  if (exercise.expectOutput) {
    let expected = cache.get(exercise.id);
    if (expected === undefined) {
      const ref = await runner({ ...base, code: exercise.solution, tests: "" });
      if (!ref.ok) {
        return {
          status: "error",
          title: "The reference solution failed to run",
          detail: formatError(ref.error),
          run,
        };
      }
      expected = ref.stdout;
      cache.set(exercise.id, expected);
    }
    const cmp = compareOutput(expected, run.stdout);
    if (!cmp.same) {
      const empty = !normalizeOutput(run.stdout).length;
      return {
        status: "fail",
        title: empty ? "Your program printed nothing" : "The output doesn't match yet",
        detail: empty
          ? `Use <code>print()</code> to show the result — returning or computing a value isn't enough here.${
              exercise.tests ? "" : ""
            }`
          : outputDiff(cmp),
        run,
      };
    }
  }

  if (exercise.tests) {
    if (run.tests !== "pass") {
      const err = run.testError || {};
      if (err.type === "AssertionError") {
        return {
          status: "fail",
          title: err.message ? "Not quite" : "A check failed",
          detail: err.message
            ? escapeHtml(err.message)
            : `This check didn't hold:${err.text ? `<pre class="err-line"><code>${escapeHtml(err.text)}</code></pre>` : ""}`,
          run,
        };
      }
      const tip = explainError(err);
      return {
        status: "fail",
        title: `Your code raised ${err.type || "an error"} when the checks ran it`,
        detail: `${formatError(err)}${
          err.text ? `<p class="faint" style="margin:6px 0 0">The check that triggered it:</p><pre class="err-line"><code>${escapeHtml(err.text)}</code></pre>` : ""
        }${tip ? `<div class="tip">${tip}</div>` : ""}`,
        run,
      };
    }
  }

  return { status: "pass", title: "Correct", detail: "", run };
}
