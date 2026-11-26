/* Felles hjelpere for artistprofil (studio) og artistportal. */
(() => {
"use strict";
const STAGES = [
  { k: "demo", n: "Demo", c: "#8B7FB8", t: "#0A0A0F" },
  { k: "produksjon", n: "Produksjon", c: "#7C3AED", t: "#fff" },
  { k: "vokal", n: "Vokalinnspilling", c: "#D946EF", t: "#fff" },
  { k: "mix", n: "Mix", c: "#F97316", t: "#1A0A00" },
  { k: "master", n: "Master", c: "#22C55E", t: "#04230F" },
  { k: "annet", n: "Annet", c: "#64748B", t: "#fff" },
];
const LEGACY = { skisse: "demo", preprod: "produksjon", innspilling: "produksjon", miks: "mix", release: "annet" };
const stage = (k) => STAGES.find(s => s.k === (LEGACY[k] || k)) || STAGES[STAGES.length - 1];
const STATUS_TXT = { planlagt: "Planlagt", pagar: "Pågår", ferdig: "Ferdig" };
const DOC_CATS = [["kontrakt", "Kontrakter", "#D946EF"], ["splitt", "Splitt-ark", "#F97316"], ["lyrics", "Lyrics", "#38BDF8"], ["presse", "Presse", "#22C55E"], ["artwork", "Artwork", "#FACC15"], ["annet", "Annet", "#8B7FB8"]];
const PLAN_KINDS = [["milepael", "Milepæl", "#A78BFA"], ["release", "Release", "#EC4899"], ["frist", "Frist", "#FFB547"], ["annet", "Annet", "#64748B"]];
const ROOMS = { a: "Studio A", b: "Studio B", c: "Studio C" };
const MONTHS = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];
const MONTHS_L = ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"];
const DAYS = ["søn", "man", "tir", "ons", "tor", "fre", "lør"];

const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const parse = (s) => { if (!s) return null; const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/); if (!m) return null; return new Date(+m[1], +m[2] - 1, +m[3]); };
const today = () => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); };
const dShort = (s) => { const d = typeof s === "string" ? parse(s) || new Date(s) : s; if (!d || isNaN(d)) return ""; return d.getDate() + ". " + MONTHS[d.getMonth()] + (d.getFullYear() !== new Date().getFullYear() ? " " + d.getFullYear() : ""); };
const dLong = (s) => { const d = typeof s === "string" ? parse(s) || new Date(s) : s; if (!d || isNaN(d)) return ""; return d.getDate() + ". " + MONTHS_L[d.getMonth()] + " " + d.getFullYear(); };
const rel = (d) => { const n = Math.round((d - today()) / 86400000); return n === 0 ? "i dag" : n === 1 ? "i morgen" : n === -1 ? "i går" : n > 0 ? "om " + n + " dager" : -n + " dager siden"; };
const fmtSize = (b) => !b ? "" : b > 1048576 ? (b / 1048576).toFixed(1).replace(".", ",") + " MB" : Math.max(1, Math.round(b / 1024)) + " kB";
const safeUrl = (u) => { u = String(u || "").trim(); if (!u) return ""; if (!/^https?:\/\//i.test(u)) u = "https://" + u; try { const x = new URL(u); return /^https?:$/.test(x.protocol) ? x.href : ""; } catch { return ""; } };
const social = (kind, v) => {
  v = String(v || "").trim(); if (!v) return "";
  if (/^https?:\/\//i.test(v) || /\.[a-z]{2,}\//i.test(v)) return safeUrl(v);
  const h = v.replace(/^@/, "");
  return { instagram: "https://instagram.com/" + h, tiktok: "https://www.tiktok.com/@" + h, youtube: "https://youtube.com/@" + h }[kind] || safeUrl(v);
};
const initials = (n) => String(n || "?").trim().split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
function toast(msg, err) { const t = el("div", "toast" + (err ? " err" : ""), msg); document.body.appendChild(t); setTimeout(() => t.remove(), err ? 5000 : 2600); }
const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} } };

/* Låtstatus */
function sortedSteps(s) { return (s.steps || []).slice().sort((a, b) => String(a.start || "9").localeCompare(String(b.start || "9"))); }
function songState(s) {
  const st = sortedSteps(s);
  const cur = st.find(x => x.status === "pagar") || st.find(x => x.status !== "ferdig");
  const done = st.length && st.every(x => x.status === "ferdig");
  return { steps: st, cur, done };
}
function pipeline(s) {
  const st = sortedSteps(s);
  const wrap = el("div");
  const p = el("div", "pipe"), l = el("div", "pipelbl");
  for (const x of st) {
    const g = stage(x.type); const i = el("i", x.status || "planlagt"); i.style.setProperty("--c", g.c);
    i.title = (x.label || g.n) + " · " + (STATUS_TXT[x.status] || "Planlagt") + (x.start ? " · " + dShort(x.start) + (x.end ? "–" + dShort(x.end) : "") : "");
    p.appendChild(i); l.appendChild(el("span", null, x.label || g.n));
  }
  if (!st.length) { p.appendChild(el("i")); l.appendChild(el("span", null, "Ingen steg ennå")); }
  wrap.append(p, l); return wrap;
}
function nowText(s) {
  const { cur, done } = songState(s);
  const f = el("div", "now");
  if (done) { f.append(el("b", null, "Ferdig"), document.createTextNode(" · alle steg er fullført")); return f; }
  if (!cur) { f.textContent = "Ikke planlagt ennå"; return f; }
  const g = stage(cur.type);
  f.append(document.createTextNode(cur.status === "pagar" ? "Nå: " : "Neste: "), el("b", null, cur.label || g.n));
  if (cur.start) f.appendChild(document.createTextNode(" · " + dShort(cur.start) + (cur.end ? " – " + dShort(cur.end) : "")));
  return f;
}

/* Tidslinje (produksjonskalender) */
function renderTimeline(box, songs) {
  box.replaceChildren();
  const rows = songs.map(s => ({ s, st: sortedSteps(s).filter(x => parse(x.start)) }));
  const all = rows.flatMap(r => r.st);
  if (!all.length) { box.appendChild(el("div", "empty", "Ingen steg med datoer ennå.")); return; }
  const t = today();
  let a = new Date(Math.min(t, ...all.map(x => parse(x.start)))), b = new Date(Math.max(t, ...all.map(x => parse(x.end) || parse(x.start))));
  a = new Date(a.getFullYear(), a.getMonth(), a.getDate() - 4); b = new Date(b.getFullYear(), b.getMonth(), b.getDate() + 6);
  const span = (b - a) / 86400000 + 1, pos = (d) => ((d - a) / 86400000) / span * 100;
  const tl = el("div", "tl"), inn = el("div", "tl-in"); inn.style.setProperty("--lw", "170px");
  const head = el("div", "tl-head");
  // Månedsmarkører, eller ukemarkører ved kort periode
  const weekly = span < 75;
  for (let d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) {
    const mark = weekly ? d.getDay() === 1 : d.getDate() === 1;
    if (!mark) continue;
    const x = pos(d); if (x > 96) continue;
    const s = el("span", null, weekly ? d.getDate() + ". " + MONTHS[d.getMonth()] : MONTHS_L[d.getMonth()] + (d.getMonth() === 0 ? " " + d.getFullYear() : ""));
    s.style.left = x + "%"; head.appendChild(s);
  }
  inn.appendChild(head);
  const body = el("div"); body.style.position = "relative";
  for (const r of rows) {
    const row = el("div", "tl-row"), lab = el("div", "tl-lab", r.s.title); lab.title = r.s.title;
    const tr = el("div", "tl-track");
    for (const x of r.st) {
      const g = stage(x.type), s0 = parse(x.start), e0 = parse(x.end) || s0;
      const bar = el("div", "tl-bar " + (x.status || "planlagt"));
      const w = (pos(new Date(e0.getTime() + 86400000)) - pos(s0)).toFixed(3);
      bar.style.cssText = `left:${pos(s0)}%;width:max(10px, calc(${w}% - 2px));--c:${g.c};--ct:${g.t}`;
      bar.textContent = x.label || g.n;
      bar.title = (x.label || g.n) + " · " + (STATUS_TXT[x.status] || "Planlagt") + "\n" + dShort(x.start) + " – " + dShort(x.end || x.start);
      tr.appendChild(bar);
    }
    if (!r.st.length) { const n = el("div", "muted", "Ingen datoer"); n.style.cssText = "font-size:12px;padding:13px 10px"; tr.appendChild(n); }
    row.append(lab, tr); body.appendChild(row);
  }
  inn.appendChild(body);
  const tdx = el("div", "tl-today"); tdx.style.left = `calc(var(--lw) + (100% - var(--lw)) * ${pos(t) / 100})`; inn.appendChild(tdx);
  tl.appendChild(inn); box.appendChild(tl);
  const lg = el("div", "legend");
  const used = new Set(all.map(x => stage(x.type).k));
  for (const g of STAGES) if (used.has(g.k)) { const s = el("span"); const i = el("i"); i.style.setProperty("--c", g.c); s.append(i, document.createTextNode(g.n)); lg.appendChild(s); }
  const pl = el("span"); const pi = el("i"); pi.style.cssText = "--c:transparent;box-shadow:inset 0 0 0 1px #8B7FB8"; pl.append(pi, document.createTextNode("Planlagt (omriss)")); lg.appendChild(pl);
  box.appendChild(lg);
}

/* Agenda: steg, planer og bookinger i én liste */
function agendaItems(songs, plans, bookings, opts = {}) {
  const t = today(), from = opts.from || new Date(t.getFullYear(), t.getMonth(), t.getDate() - (opts.pastDays || 0));
  const items = [];
  for (const s of songs) for (const x of s.steps || []) {
    const d = parse(x.start), e = parse(x.end) || d; if (!d || e < from || x.status === "ferdig" && e < t) continue;
    const g = stage(x.type);
    items.push({ d: d < t && e >= t ? t : d, c: g.c, title: (x.label || g.n) + " – " + s.title, sub: (x.status === "pagar" ? "Pågår" : "Planlagt") + " · " + dShort(x.start) + (x.end && x.end !== x.start ? " – " + dShort(x.end) : ""), kind: "steg" });
  }
  for (const p of plans || []) {
    const d = parse(p.date); if (!d && !opts.undated) continue; if (d && d < from && !p.done) { /* forfalt milepæl vises */ } else if (d && d < from) continue;
    const k = PLAN_KINDS.find(x => x[0] === p.kind) || PLAN_KINDS[0];
    items.push({ d, c: k[2], title: p.title, sub: k[1] + (p.note ? " · " + p.note : ""), kind: "plan", plan: p, done: p.done });
  }
  for (const b of bookings || []) {
    const d = parse(b.date); if (!d || d < from) continue;
    items.push({ d, c: "#7C3AED", title: (ROOMS[b.room] || "Studio") + " · " + (b.start || "") + (b.end ? "–" + b.end : ""), sub: "Studiotid" + (b.tech ? " · tekniker " + b.tech : "") + (b.note ? " · " + b.note : ""), kind: "booking" });
  }
  return items.sort((p, q) => (p.d || 8.64e15) - (q.d || 8.64e15));
}
function renderAgenda(box, items, onPlan) {
  box.replaceChildren();
  if (!items.length) { box.appendChild(el("div", "empty", "Ingenting planlagt fremover.")); return; }
  const list = el("div", "agenda");
  for (const it of items) {
    const r = el("div", "ag" + (it.done ? " done" : "") + (it.plan && onPlan ? " click" : ""));
    const d = el("div", "d");
    if (it.d) d.append(el("b", null, it.d.getDate()), el("span", null, MONTHS[it.d.getMonth()] + " · " + DAYS[it.d.getDay()]));
    else d.append(el("b", null, "–"), el("span", null, "uten dato"));
    const m = el("div", "m"), ti = el("div", "ti"); const i = el("i"); i.style.setProperty("--c", it.c); ti.append(i, document.createTextNode(it.title));
    m.append(ti, el("div", "su", it.sub));
    const right = el("div"); if (it.d) right.appendChild(el("span", "tag", rel(it.d)));
    r.append(d, m, right);
    if (it.plan && onPlan) r.onclick = () => onPlan(it.plan);
    list.appendChild(r);
  }
  box.appendChild(list);
}

/* Dokumentikon */
function docIcon(d) {
  const ext = (String(d.file_name || "").match(/\.([A-Za-z0-9]{2,5})$/) || [, d.url ? "LINK" : "FIL"])[1].toUpperCase();
  const c = (DOC_CATS.find(x => x[0] === d.category) || DOC_CATS[5])[2];
  const ic = el("div", "ic", ext.slice(0, 4)); ic.style.setProperty("--c", c); return ic;
}

window.PLA = { STAGES, stage, STATUS_TXT, DOC_CATS, PLAN_KINDS, ROOMS, MONTHS, MONTHS_L, el, esc, ymd, parse, today, dShort, dLong, rel, fmtSize, safeUrl, social, initials, toast, store,
  sortedSteps, songState, pipeline, nowText, renderTimeline, agendaItems, renderAgenda, docIcon };
})();
