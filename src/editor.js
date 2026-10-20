/* =====================================================================
   Python Quest — code editor
   A textarea with a syntax-highlighted layer behind it. No dependencies,
   no build step; just enough editing comfort to stay out of the way:
   Tab indents four spaces, Enter keeps the indent (and adds one after a
   colon), Ctrl/⌘+Enter runs.
   ===================================================================== */

import { highlightPython } from "./format.js";

const DRAFT_PREFIX = "pyquest.draft.";
const INDENT = "    ";

function loadDraft(key) {
  if (!key) return null;
  try {
    return localStorage.getItem(DRAFT_PREFIX + key);
  } catch {
    return null;
  }
}

function saveDraft(key, value) {
  if (!key) return;
  try {
    if (value.trim()) localStorage.setItem(DRAFT_PREFIX + key, value);
    else localStorage.removeItem(DRAFT_PREFIX + key);
  } catch {
    /* ignore quota errors */
  }
}

export function clearDraft(key) {
  try {
    localStorage.removeItem(DRAFT_PREFIX + key);
  } catch {
    /* ignore */
  }
}

/**
 * @param {object} options
 * @param {string} options.value        initial code
 * @param {number} options.height       editor height in px
 * @param {string} options.storageKey   persists the draft between visits
 * @param {function} options.onRun      Ctrl/Cmd+Enter and the Run button
 * @param {string} options.hint         text shown in the toolbar
 * @param {Array}  options.buttons      [{label, className, onClick, title}]
 * @param {string} options.runLabel     label of the primary button
 */
export function createEditor(options = {}) {
  const {
    value = "",
    height = 160,
    storageKey = "",
    onRun = null,
    hint = "Ctrl/⌘ + Enter to run",
    buttons = [],
    runLabel = "▸ Run",
  } = options;

  const wrap = document.createElement("div");
  wrap.className = "editor-wrap";
  wrap.style.setProperty("--editor-h", `${height}px`);

  const scroll = document.createElement("div");
  scroll.className = "editor-scroll";

  const gutter = document.createElement("div");
  gutter.className = "editor-gutter";
  gutter.setAttribute("aria-hidden", "true");

  const highlight = document.createElement("pre");
  highlight.className = "editor-highlight";
  highlight.setAttribute("aria-hidden", "true");

  const input = document.createElement("textarea");
  input.className = "editor-input";
  input.spellcheck = false;
  input.autocapitalize = "off";
  input.autocomplete = "off";
  input.setAttribute("autocorrect", "off");
  input.setAttribute("aria-label", "Python editor");
  input.value = loadDraft(storageKey) ?? value;

  scroll.append(gutter, highlight, input);

  const bar = document.createElement("div");
  bar.className = "editor-bar";

  const runBtn = document.createElement("button");
  runBtn.className = "btn primary small";
  runBtn.textContent = runLabel;
  bar.append(runBtn);

  for (const spec of buttons) {
    const btn = document.createElement("button");
    btn.className = spec.className || "btn small ghost";
    btn.textContent = spec.label;
    if (spec.title) btn.title = spec.title;
    btn.addEventListener("click", () => spec.onClick(api));
    bar.append(btn);
    spec.el = btn;
  }

  const spacer = document.createElement("span");
  spacer.className = "spacer";
  const hintEl = document.createElement("span");
  hintEl.className = "editor-hint";
  hintEl.textContent = hint;
  bar.append(spacer, hintEl);

  wrap.append(scroll, bar);

  function paint() {
    const text = input.value;
    highlight.innerHTML = highlightPython(text) + (text.endsWith("\n") ? " " : "");
    const lines = text.split("\n").length;
    gutter.innerHTML = Array.from({ length: lines }, (_, i) => `<span>${i + 1}</span>`).join("");
    // grow the textarea so the caret never falls outside the scroll box
    input.style.height = "auto";
    const h = Math.max(scroll.clientHeight, input.scrollHeight);
    input.style.height = `${h}px`;
    highlight.style.height = `${h}px`;
    gutter.style.height = `${h}px`;
  }

  input.addEventListener("input", () => {
    paint();
    saveDraft(storageKey, input.value);
  });
  input.addEventListener("scroll", () => {
    highlight.scrollTop = input.scrollTop;
    highlight.scrollLeft = input.scrollLeft;
    gutter.scrollTop = input.scrollTop;
  });
  input.addEventListener("focus", () => wrap.classList.add("focused"));
  input.addEventListener("blur", () => wrap.classList.remove("focused"));

  function replaceSelection(text, caretOffset = text.length) {
    const { selectionStart: start, selectionEnd: end, value: v } = input;
    input.value = v.slice(0, start) + text + v.slice(end);
    input.selectionStart = input.selectionEnd = start + caretOffset;
    paint();
    saveDraft(storageKey, input.value);
  }

  input.addEventListener("keydown", (event) => {
    // Ctrl/Cmd + Enter runs
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      if (onRun) onRun(api);
      return;
    }

    const { selectionStart: start, selectionEnd: end, value: text } = input;
    const lineStart = text.lastIndexOf("\n", start - 1) + 1;
    const currentLine = text.slice(lineStart, start);
    const currentIndent = /^[ \t]*/.exec(currentLine)[0];

    // Tab indents instead of leaving the editor
    if (event.key === "Tab") {
      event.preventDefault();
      if (start !== end && text.slice(start, end).includes("\n")) {
        // indent / outdent every selected line
        const blockStart = lineStart;
        const blockEnd = text.indexOf("\n", end) === -1 ? text.length : text.indexOf("\n", end);
        const block = text.slice(blockStart, blockEnd);
        const changed = block
          .split("\n")
          .map((l) => (event.shiftKey ? l.replace(/^ {1,4}/, "") : INDENT + l))
          .join("\n");
        input.value = text.slice(0, blockStart) + changed + text.slice(blockEnd);
        input.selectionStart = blockStart;
        input.selectionEnd = blockStart + changed.length;
      } else if (event.shiftKey) {
        const removed = /^ {1,4}/.exec(text.slice(lineStart))?.[0].length || 0;
        input.value = text.slice(0, lineStart) + text.slice(lineStart + removed);
        input.selectionStart = input.selectionEnd = Math.max(lineStart, start - removed);
      } else {
        replaceSelection(INDENT);
        return;
      }
      paint();
      saveDraft(storageKey, input.value);
      return;
    }

    // Enter keeps the indentation, plus one level after a colon
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const trimmed = currentLine.replace(/#.*$/, "").trimEnd();
      const extra = trimmed.endsWith(":") ? INDENT : "";
      // after return / break / continue / pass, drop one level
      const dedent = /^\s*(return|break|continue|pass|raise)\b/.test(currentLine)
        ? currentIndent.slice(0, Math.max(0, currentIndent.length - INDENT.length))
        : currentIndent;
      replaceSelection(`\n${dedent}${extra}`);
      return;
    }

    // Backspace at an indent boundary removes four spaces
    if (event.key === "Backspace" && start === end && start > 0) {
      const before = text.slice(lineStart, start);
      if (before.length && /^ +$/.test(before) && before.length % INDENT.length === 0) {
        event.preventDefault();
        input.value = text.slice(0, start - INDENT.length) + text.slice(start);
        input.selectionStart = input.selectionEnd = start - INDENT.length;
        paint();
        saveDraft(storageKey, input.value);
      }
    }
  });

  runBtn.addEventListener("click", () => onRun && onRun(api));

  const api = {
    el: wrap,
    input,
    buttons,
    getValue: () => input.value,
    setValue(next, { persist = true } = {}) {
      input.value = next;
      paint();
      if (persist) saveDraft(storageKey, next);
    },
    reset() {
      api.setValue(value, { persist: false });
      clearDraft(storageKey);
    },
    focus: () => input.focus(),
    setBusy(busy, label = "Running…") {
      runBtn.disabled = busy;
      runBtn.textContent = busy ? label : runLabel;
      for (const spec of buttons) if (spec.el) spec.el.disabled = busy;
    },
  };

  // first paint once the element has been measured
  requestAnimationFrame(paint);
  paint();
  return api;
}
