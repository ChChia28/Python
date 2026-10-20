/* =====================================================================
   Python Quest — durable progress
   Progress lives in localStorage. If storage is blocked (a private
   window, an embed with cookies off) the app says so instead of
   pretending, and the Progress page always offers a backup code.
   ===================================================================== */

let mode = "local";               // "local" | "none"
const listeners = new Set();

export function status() {
  return {
    mode,
    label: mode === "local" ? "Saved in this browser" : "Not being saved — keep a backup",
  };
}

export function onStatusChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function localStorageWorks() {
  try {
    const probe = "pyquest.probe";
    localStorage.setItem(probe, "1");
    const ok = localStorage.getItem(probe) === "1";
    localStorage.removeItem(probe);
    return ok;
  } catch {
    return false;
  }
}

export async function initPersistence() {
  mode = localStorageWorks() ? "local" : "none";
  for (const fn of listeners) fn(status());
  return status();
}

export async function flush() {
  /* localStorage writes are synchronous; nothing to flush */
}

/** Offer a JSON file for download. */
export async function saveBackupFile(filename, text) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return "offered";
}

/** Copy text to the clipboard; falls back to selecting a textarea. */
export async function copyText(text, fallbackEl = null) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    if (fallbackEl) {
      fallbackEl.hidden = false;
      fallbackEl.select();
      try {
        return document.execCommand("copy");
      } catch {
        return false;
      }
    }
    return false;
  }
}
