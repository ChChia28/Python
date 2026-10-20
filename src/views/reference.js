/* =====================================================================
   Python Quest — cheat sheet
   ===================================================================== */

import { renderMarkdown, escapeHtml } from "../format.js";
import { attachRunButtons } from "../ui.js";

let cached = null;

export default async function renderReference(container) {
  if (!cached) {
    const response = await fetch("content/reference.md");
    if (!response.ok) throw new Error("Could not load content/reference.md");
    cached = await response.text();
  }

  container.innerHTML = `
    <div class="breadcrumb"><a href="#/">Dashboard</a> · Cheat sheet</div>
    <h1>Python cheat sheet</h1>
    <p class="muted">Everything the course covers, on one page. Press ▸ Run on any example.</p>
    <div class="card" id="ref-toc"></div>
    <div class="prose" id="ref-body">${renderMarkdown(cached)}</div>`;

  const body = container.querySelector("#ref-body");
  attachRunButtons(body);

  const headings = [...body.querySelectorAll("h2")];
  headings.forEach((heading, i) => {
    heading.id = `ref-${i}`;
  });
  container.querySelector("#ref-toc").innerHTML =
    `<div class="eyebrow">On this page</div><div class="row chip-row">` +
    headings
      .map((heading, i) => `<a class="chip" href="#ref-${i}">${escapeHtml(heading.textContent)}</a>`)
      .join(" ") +
    `</div>`;

  // in-page anchors must not disturb the hash router
  for (const link of container.querySelectorAll("#ref-toc a")) {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      document
        .getElementById(link.getAttribute("href").slice(1))
        .scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}
