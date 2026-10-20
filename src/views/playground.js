/* =====================================================================
   Python Quest — playground
   A scratch space with a persistent namespace: variables, functions and
   files you create survive between runs until you press Reset.
   ===================================================================== */

import { escapeHtml, outputBlock } from "../format.js";
import { createEditor } from "../editor.js";
import { run, resetPlayground } from "../runtime.js";
import * as store from "../store.js";
import { toast } from "../ui.js";
import { awardEvent } from "../game.js";

const EXAMPLES = [
  {
    name: "Hello",
    code: 'name = "Ada"\nprint(f"Hello, {name}!")\n',
  },
  {
    name: "FizzBuzz",
    code: "for n in range(1, 21):\n    if n % 15 == 0:\n        print(\"FizzBuzz\")\n    elif n % 3 == 0:\n        print(\"Fizz\")\n    elif n % 5 == 0:\n        print(\"Buzz\")\n    else:\n        print(n)\n",
  },
  {
    name: "Word count",
    code: 'text = "the quick brown fox jumps over the lazy dog the end"\ncounts = {}\nfor word in text.split():\n    counts[word] = counts.get(word, 0) + 1\n\nfor word, n in sorted(counts.items(), key=lambda kv: -kv[1]):\n    print(f"{word:<6} {n}")\n',
  },
  {
    name: "Class",
    code: 'class Account:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        self.balance += amount\n        return self\n\n    def __repr__(self):\n        return f"Account({self.owner!r}, {self.balance})"\n\nacc = Account("Mei").deposit(50).deposit(25)\nprint(acc)\n',
  },
  {
    name: "Files",
    code: 'with open("notes.txt", "w") as f:\n    f.write("first line\\nsecond line\\n")\n\nwith open("notes.txt") as f:\n    for i, line in enumerate(f, start=1):\n        print(i, line.rstrip())\n',
  },
  {
    name: "pandas",
    code: 'import pandas as pd\n\ndf = pd.DataFrame({\n    "city": ["KL", "Penang", "KL", "Johor"],\n    "sales": [120, 80, 95, 60],\n})\nprint(df.groupby("city")["sales"].sum().sort_values(ascending=False))\n',
    packages: ["numpy", "pandas"],
  },
];

function variablesPanel(vars) {
  if (!vars || !vars.length) {
    return '<p class="faint" style="margin:0">Nothing defined yet. Run some code and your variables appear here.</p>';
  }
  return `<div class="table-scroll"><table class="grid vars"><thead><tr><th>name</th><th>type</th><th>value</th></tr></thead><tbody>${vars
    .map(
      ([name, type, value]) =>
        `<tr><td><code>${escapeHtml(name)}</code></td><td class="faint">${escapeHtml(type)}</td><td><code>${escapeHtml(
          value
        )}</code></td></tr>`
    )
    .join("")}</tbody></table></div>`;
}

export default async function renderPlayground(container) {
  container.innerHTML = `
    <div class="breadcrumb"><a href="#/">Dashboard</a> · Playground</div>
    <h1>Playground</h1>
    <p class="muted">Try anything. Variables and functions stay defined between runs, and files you write
    stay on the virtual disk, until you press <strong>Reset</strong>.</p>
    <div class="playground-grid">
      <div>
        <div id="pg-editor"></div>
        <div id="pg-output" style="margin-top:14px"></div>
      </div>
      <aside class="playground-side">
        <div class="card">
          <h3>Variables</h3>
          <div id="pg-vars"></div>
        </div>
        <div class="card">
          <h3>Examples</h3>
          <div class="chip-row" id="pg-examples">
            ${EXAMPLES.map((ex, i) => `<button class="chip" data-example="${i}">${escapeHtml(ex.name)}</button>`).join("")}
          </div>
        </div>
        <div class="card">
          <h3>Saved snippets</h3>
          <div id="pg-snippets"></div>
        </div>
      </aside>
    </div>`;

  const output = container.querySelector("#pg-output");
  const vars = container.querySelector("#pg-vars");
  vars.innerHTML = variablesPanel([]);

  let lastPackages = [];

  async function execute(editor) {
    const code = editor.getValue();
    if (!code.trim()) {
      output.innerHTML = '<div class="msg info">Write some code first.</div>';
      return;
    }
    editor.setBusy(true);
    output.innerHTML = '<div class="msg info">Running…</div>';
    try {
      const needsData = /\b(numpy|pandas)\b/.test(code);
      const packages = needsData ? ["numpy", "pandas"] : lastPackages;
      const result = await run({
        code,
        namespace: "playground",
        packages,
        onStatus: (text) => {
          if (text) output.innerHTML = `<div class="msg info">${escapeHtml(text)}</div>`;
        },
      });
      if (needsData) lastPackages = packages;
      output.innerHTML = outputBlock(result, { label: "output" });
      if (result.variables) vars.innerHTML = variablesPanel(result.variables);
      store.recordAttempt(null);
      const award = awardEvent("playground");
      for (const quest of award.quests || []) toast(`Quest complete: ${quest.label}. +${quest.bonus} XP`, "ok");
    } catch (err) {
      output.innerHTML = `<div class="msg err">${escapeHtml(err.message)}</div>`;
    } finally {
      editor.setBusy(false);
    }
  }

  const editor = createEditor({
    value: 'print("Hello from the playground")\n',
    height: 300,
    storageKey: "playground",
    onRun: execute,
    hint: "Ctrl/⌘ + Enter to run",
    buttons: [
      {
        label: "💾 Save",
        className: "btn small ghost",
        onClick: (api) => {
          const name = prompt("Name this snippet");
          if (!name) return;
          store.saveSnippet(name.trim(), api.getValue());
          renderSnippets();
          toast("Saved", "ok");
        },
      },
      {
        label: "↺ Reset",
        className: "btn small ghost",
        title: "Forget every variable and file",
        onClick: async () => {
          await resetPlayground();
          vars.innerHTML = variablesPanel([]);
          output.innerHTML = '<div class="msg info">Namespace cleared — every variable, function and file is gone.</div>';
        },
      },
    ],
  });
  container.querySelector("#pg-editor").append(editor.el);

  for (const button of container.querySelectorAll("[data-example]")) {
    button.addEventListener("click", () => {
      const ex = EXAMPLES[Number(button.dataset.example)];
      editor.setValue(ex.code);
      if (ex.packages) lastPackages = ex.packages;
      editor.focus();
    });
  }

  function renderSnippets() {
    const list = store.snippets();
    const box = container.querySelector("#pg-snippets");
    if (!list.length) {
      box.innerHTML = '<p class="faint" style="margin:0">Press Save to keep a program here.</p>';
      return;
    }
    box.innerHTML = list
      .map(
        (s) => `
        <div class="snippet-row">
          <button class="link" data-load="${escapeHtml(s.name)}">${escapeHtml(s.name)}</button>
          <span class="spacer"></span>
          <button class="icon-btn small" data-del="${escapeHtml(s.name)}" title="Delete">✕</button>
        </div>`
      )
      .join("");
    for (const b of box.querySelectorAll("[data-load]")) {
      b.addEventListener("click", () => {
        const s = store.snippets().find((x) => x.name === b.dataset.load);
        if (s) editor.setValue(s.code);
      });
    }
    for (const b of box.querySelectorAll("[data-del]")) {
      b.addEventListener("click", () => {
        store.deleteSnippet(b.dataset.del);
        renderSnippets();
      });
    }
  }
  renderSnippets();
}
