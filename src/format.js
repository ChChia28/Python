/* =====================================================================
   Python Quest — formatting helpers
   A tiny markdown subset for lesson prose, a Python tokeniser used by both
   the highlighter and the editor, and renderers for program output.
   ===================================================================== */

import { escapeHtml } from "./escape.js";
import { formatError, explainError } from "./grade-core.js";

export { escapeHtml };

/* ------------------------------------------------------------- Python --- */

const KEYWORDS = new Set(`
False None True and as assert async await break class continue def del elif else
except finally for from global if import in is lambda nonlocal not or pass raise
return try while with yield match case
`.trim().split(/\s+/));

const BUILTINS = new Set(`
abs all any ascii bin bool bytearray bytes callable chr classmethod compile complex
delattr dict dir divmod enumerate eval exec filter float format frozenset getattr
globals hasattr hash help hex id input int isinstance issubclass iter len list locals
map max memoryview min next object oct open ord pow print property range repr
reversed round set setattr slice sorted staticmethod str sum super tuple type vars zip
self cls __init__ __repr__ __str__ __eq__ __len__ __name__
Exception ValueError TypeError KeyError IndexError NameError ZeroDivisionError
AttributeError RuntimeError StopIteration FileNotFoundError AssertionError
`.trim().split(/\s+/));

const TOKEN_RE = new RegExp(
  [
    String.raw`(#[^\n]*)`,                                            // 1 comment
    String.raw`([rRbBfFuU]{0,2}(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'))`, // 2 string
    String.raw`(@[A-Za-z_][\w.]*)`,                                   // 3 decorator
    String.raw`(\b\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?j?\b|\b0[xXoObB][\da-fA-F_]+\b)`, // 4 number
    String.raw`(\b[A-Za-z_]\w*\b)`,                                   // 5 word
    String.raw`(->|:=|\*\*=?|//=?|[+\-*/%=<>!&|^~]=?|[()\[\]{},.:;])`, // 6 operator / punctuation
  ].join("|"),
  "g"
);

/** Syntax-highlight Python as HTML. */
export function highlightPython(code) {
  let out = "";
  let last = 0;
  TOKEN_RE.lastIndex = 0;
  let m;
  const src = String(code);
  while ((m = TOKEN_RE.exec(src)) !== null) {
    if (m.index > last) out += escapeHtml(src.slice(last, m.index));
    last = m.index + m[0].length;
    const [, comment, str, deco, num, word] = m;
    const text = escapeHtml(m[0]);
    if (comment) out += `<span class="tok-com">${text}</span>`;
    else if (str) {
      // light up f-string placeholders
      const lit = /^[fF]/.test(m[0])
        ? text.replace(/\{[^{}]*\}/g, (ph) => `<span class="tok-ph">${ph}</span>`)
        : text;
      out += `<span class="tok-str">${lit}</span>`;
    } else if (deco) out += `<span class="tok-deco">${text}</span>`;
    else if (num) out += `<span class="tok-num">${text}</span>`;
    else if (word) {
      if (KEYWORDS.has(word)) out += `<span class="tok-kw">${text}</span>`;
      else if (BUILTINS.has(word)) out += `<span class="tok-fn">${text}</span>`;
      else {
        // a name followed by "(" is a call
        const after = src.slice(last).match(/^\s*\(/);
        out += after ? `<span class="tok-call">${text}</span>` : text;
      }
    } else out += `<span class="tok-op">${text}</span>`;
  }
  if (last < src.length) out += escapeHtml(src.slice(last));
  return out;
}

/** A code block with a header and (optionally) a Run button. */
export function codeBlock(code, { runnable = true, label = "Python", id = "", expectError = false } = {}) {
  const runBtn = runnable
    ? `<button class="btn small ghost run-py" data-code="${escapeHtml(code)}">▸ Run</button>`
    : "";
  return `
  <div class="code-block ${expectError ? "expect-error" : ""}" ${id ? `id="${id}"` : ""}>
    <div class="code-head"><span>${escapeHtml(label)}</span><span class="spacer"></span>${runBtn}</div>
    <pre><code>${highlightPython(code)}</code></pre>
    <div class="code-out" hidden></div>
  </div>`;
}

/* ------------------------------------------------------------ markdown --- */

export function inlineMarkdown(text) {
  return inline(text);
}

function inline(text) {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`);
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*\w])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return out;
}

/**
 * Render the lesson-flavoured markdown subset: headings, paragraphs, lists,
 * tables, blockquote callouts and fenced Python blocks (which become runnable).
 */
export function renderMarkdown(source) {
  const lines = String(source).replace(/\r/g, "").split("\n");
  const html = [];
  let i = 0;

  const isTableRow = (line) => /^\s*\|.*\|\s*$/.test(line);

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    // fenced code
    if (/^```/.test(line)) {
      const lang = line.slice(3).trim();
      const body = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) body.push(lines[i++]);
      i++;
      const code = body.join("\n");
      if (lang === "python" || lang === "") {
        html.push(codeBlock(code, { runnable: lang === "python", label: "Python" }));
      } else if (lang === "python-static" || lang === "python-repl") {
        html.push(codeBlock(code, { runnable: false, label: "Python" }));
      } else if (lang === "python-error") {
        html.push(codeBlock(code, { runnable: true, label: "Python — this one fails on purpose", expectError: true }));
      } else {
        const label = lang === "text" ? "output" : lang;
        html.push(`<div class="code-block plain"><div class="code-head"><span>${escapeHtml(label)}</span></div><pre><code>${escapeHtml(code)}</code></pre></div>`);
      }
      continue;
    }

    // heading
    const heading = /^(#{2,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    // blockquote / callout
    if (/^>\s?/.test(line)) {
      const body = [];
      let variant = "";
      while (i < lines.length && /^>\s?/.test(lines[i])) body.push(lines[i++].replace(/^>\s?/, ""));
      let text = body.join("\n");
      const tag = /^\[!(warn|danger|tip|note)\]\s*/i.exec(text);
      if (tag) {
        const kind = tag[1].toLowerCase();
        variant = kind === "tip" || kind === "note" ? "" : kind;
        text = text.slice(tag[0].length);
      }
      html.push(`<blockquote${variant ? ` class="${variant}"` : ""}>${text
        .split(/\n{2,}/)
        .map((p) => `<p>${inline(p.replace(/\n/g, " "))}</p>`)
        .join("")}</blockquote>`);
      continue;
    }

    // table
    if (isTableRow(line) && isTableRow(lines[i + 1] || "") && /^[\s|:-]+$/.test(lines[i + 1])) {
      const cells = (row) => row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
      const head = cells(lines[i]);
      i += 2;
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) rows.push(cells(lines[i++]));
      html.push(
        `<div class="table-scroll"><table><thead><tr>${head.map((h) => `<th>${inline(h)}</th>`).join("")}</tr></thead><tbody>` +
          rows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("") +
          "</tbody></table></div>"
      );
      continue;
    }

    // lists
    if (/^\s*([-*]|\d+\.)\s+/.test(line)) {
      const ordered = /^\s*\d+\./.test(line);
      const items = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
        let text = lines[i].replace(/^\s*([-*]|\d+\.)\s+/, "");
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*([-*]|\d+\.)\s+/.test(lines[i])) {
          text += " " + lines[i].trim();
          i++;
        }
        items.push(`<li>${inline(text)}</li>`);
      }
      html.push(ordered ? `<ol>${items.join("")}</ol>` : `<ul>${items.join("")}</ul>`);
      continue;
    }

    // paragraph
    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(```|#{2,4}\s|>\s?|\s*([-*]|\d+\.)\s)/.test(lines[i]) &&
      !isTableRow(lines[i])
    ) {
      para.push(lines[i++]);
    }
    html.push(`<p>${inline(para.join(" "))}</p>`);
  }

  return html.join("\n");
}

/* ------------------------------------------------------------- output --- */

const MAX_OUTPUT_CHARS = 20000;

/** Render a RunResult's output: stdout, stderr and any error. */
export function outputBlock(result, { label = "output", emptyText = "(no output)" } = {}) {
  if (!result) return "";
  let stdout = result.stdout || "";
  const truncated = stdout.length > MAX_OUTPUT_CHARS;
  if (truncated) stdout = stdout.slice(0, MAX_OUTPUT_CHARS);
  const parts = [];
  parts.push(
    `<div class="out-head"><span>${escapeHtml(label)}</span><span class="spacer"></span><span class="faint">${
      typeof result.elapsed === "number" ? `${result.elapsed < 1 ? "<1" : Math.round(result.elapsed)} ms` : ""
    }</span></div>`
  );
  if (stdout.length || !result.error) {
    parts.push(
      `<pre class="stdout ${stdout.length ? "" : "empty"}"><code>${
        stdout.length ? escapeHtml(stdout) : emptyText
      }${truncated ? "\n… output truncated" : ""}</code></pre>`
    );
  }
  if (result.stderr && result.stderr.trim()) {
    parts.push(`<pre class="stderr"><code>${escapeHtml(result.stderr.trim())}</code></pre>`);
  }
  if (result.error) {
    const tip = explainError(result.error);
    parts.push(
      `<div class="msg err">${formatError(result.error)}</div>${tip ? `<div class="tip">${tip}</div>` : ""}`
    );
  }
  return `<div class="output">${parts.join("")}</div>`;
}

export function plural(n, word) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}
