/* Sosiale medier: kanaler, mal (fra TNS 90-dagers release-plan) og felles visning.
   Dag 0 = releasedag. Negative tall = dager før release. end = siste dag for oppgaver som går over flere dager. */
(() => {
"use strict";
const CHANNELS = [
  { k: "press", n: "Presse", c: "#94A3B8", owner: "label" },
  { k: "spotify", n: "Spotify", c: "#1ED760", owner: "label" },
  { k: "youtube", n: "YouTube", c: "#FF4E45", owner: "artist" },
  { k: "tiktok", n: "TikTok", c: "#25F4EE", owner: "artist" },
  { k: "instagram", n: "Instagram", c: "#E1306C", owner: "artist" },
  { k: "facebook", n: "Facebook", c: "#4C8BF5", owner: "artist" },
  { k: "linkinbio", n: "Link i bio", c: "#A78BFA", owner: "artist" },
  { k: "epost", n: "E-post", c: "#FFB547", owner: "label" },
  { k: "nettverk", n: "Nettverk", c: "#F472B6", owner: "artist" },
  { k: "annet", n: "Annet", c: "#64748B", owner: "studio" },
];
const OWNERS = { artist: "Artist", studio: "Studio", label: "Label/distributør" };
const ch = (k) => CHANNELS.find(c => c.k === k) || CHANNELS[CHANNELS.length - 1];

// [start, slutt|null, kanal, oppgave]
const T = [
  // ---- Før release ----
  [-30, null, "press", "Last opp låta til distributør"],
  [-30, -9, "tiktok", "Lag TikToks og lagre som utkast"],
  [-30, null, "instagram", "Skriv tekster til Instagram-stories og captions"],
  [-29, null, "spotify", "Oppdater bio og bilder på Spotify"],
  [-28, null, "spotify", "Send inn playlist-pitch"],
  [-26, null, "spotify", "Sørg for at du har en relevant Artist Pick"],
  [-10, null, "instagram", "Lag en video med pre-save-lenke"],
  [-8, null, "press", "Send pressemelding"],
  [-7, null, "tiktok", "Lag en video med pre-save-lenke"],
  [-7, null, "instagram", "Lag story med pre-save-lenke"],
  [-7, null, "facebook", "Lag story med pre-save-lenke"],
  [-7, null, "linkinbio", "Legg inn pre-save-lenke (lag Linktree-konto)"],
  [-4, null, "tiktok", "Lag en video med pre-save-lenke"],
  [-4, null, "instagram", "Lag story med pre-save-lenke"],
  [-4, null, "facebook", "Lag story med pre-save-lenke"],
  [-2, null, "instagram", "Lag story med pre-save-lenke"],
  [-1, null, "youtube", "Planlegg Single Screen-video til release"],
  [-1, null, "tiktok", "Lag TikToks og lagre som utkast"],
  [-1, null, "instagram", "Lag story med pre-save-lenke"],
  [-1, null, "facebook", "Oppdater coverbilde"],
  // ---- Releasedag ----
  [0, null, "press", "Send oppdatert pressemelding"],
  [0, null, "spotify", "Slipp låta!"],
  [0, null, "youtube", "Single Screen-video (bare coveret) + community-post"],
  [0, null, "tiktok", "Lip sync-video – gå live her eller på Instagram"],
  [0, null, "instagram", "Grid-post og story-delinger – gå live her eller på TikTok"],
  [0, null, "facebook", "Historien bak låta + lenke til låta"],
  [0, null, "linkinbio", "Lenk til Spotify og YouTube"],
  [0, null, "epost", "Send e-post om singelen ved midnatt (første minutt den er ute)"],
  [0, null, "nettverk", "Snakk med alle du kan – del låta når de spør hva du driver med"],
  // ---- Etter release ----
  [1, null, "spotify", "Sett låta som Artist Pick"],
  [1, null, "youtube", "Oppdater spillelister"],
  [1, 55, "tiktok", "Legg ut ditt beste innhold: lip sync, POV og konseptvideoer"],
  [1, null, "instagram", "Fortell historien om låta i en karusell-post, del til story og del UGC"],
  [2, null, "spotify", "Oppdater artist-spillelisten og relaterte spillelister"],
  [2, null, "youtube", "Oppdater spillelister og lag community-post med lenke"],
  [2, null, "instagram", "Lenk artist-spillelisten i story"],
  [2, null, "facebook", "Del artist-spillelisten"],
  [3, null, "youtube", "Lag en Short som ber folk strømme låta"],
  [3, 4, "instagram", "Stories som viser personligheten din"],
  [5, null, "instagram", "Del en tweet eller Facebook-post i story for kryss-promotering"],
  [6, null, "instagram", "Fortell historien om låta på en ny måte i karusell + story"],
  [7, null, "youtube", "Slipp playthrough/vlog/BTS-video"],
  [7, null, "tiktok", "Begynn å reposte UGC av låta (hvis det finnes)"],
  [7, null, "instagram", "Story og grid med vlog/BTS – fortell en sårbar historie om låta"],
  [7, null, "facebook", "Del playthrough/vlog/BTS-video"],
  [7, 55, "instagram", "Legg ut TikToks som Reels med én ukes forsinkelse"],
  [8, null, "youtube", "Legg ut forrige ukes beste TikTok som Short"],
  [8, null, "instagram", "Sett en låtlinje i ny kontekst: forklar den, lag et meme e.l."],
  [8, null, "facebook", "Legg ut beste TikTok"],
  [9, null, "spotify", "Lag en Music + Talk-episode"],
  [9, null, "instagram", "Lenk Music + Talk-episoden i story"],
  [9, null, "facebook", "Del Music + Talk-episoden"],
  [10, 11, "instagram", "Legg ut stories sent på kvelden"],
  [11, null, "youtube", "Legg ut forrige ukes nest beste TikTok som Short"],
  [13, null, "press", "Følg opp pressemeldingen"],
  [13, null, "youtube", "Planlegg lyric video"],
  [14, null, "youtube", "Slipp lyric video + community-post"],
  [14, null, "tiktok", "TikTok med lyric video"],
  [14, null, "instagram", "Grid og story med lyric video"],
  [14, null, "facebook", "Legg ut lyric video"],
  [14, null, "linkinbio", "Lenk til lyric video"],
  [15, null, "youtube", "Legg ut forrige ukes beste TikTok som Short"],
  [15, null, "tiktok", "Bruk også scener fra lyric videoen i innholdet"],
  [15, null, "facebook", "Legg ut beste TikTok"],
  [16, null, "spotify", "Oppdater artist-spillelisten og relaterte spillelister"],
  [16, null, "facebook", "Del artist-spillelisten"],
  [17, 18, "instagram", "Post tidlig om morgenen"],
  [18, null, "youtube", "Legg ut forrige ukes nest beste TikTok som Short"],
  [19, null, "instagram", "Lag innhold med folk som jobbet på låta eller en annen artist"],
  [19, null, "facebook", "Del beste Reel"],
  [20, null, "instagram", "Snakk om låta på en ny måte i story eller caption"],
  [21, null, "youtube", "Slipp playthrough/vlog/BTS-video"],
  [21, null, "instagram", "Fortell en historie rundt en linje i låta"],
  [21, null, "facebook", "Del playthrough/vlog/BTS-video"],
  [22, null, "facebook", "Legg ut beste TikTok"],
  [23, null, "youtube", "Legg ut beste TikTok som Short"],
  [23, null, "instagram", "Lenk Music + Talk-episoden i story"],
  [23, null, "facebook", "Del Music + Talk-episoden"],
  [25, null, "youtube", "Legg ut forrige ukes nest beste TikTok som Short"],
  [25, 26, "instagram", "Q&A i stories"],
  [26, null, "spotify", "Last opp neste låt"],
  [26, null, "facebook", "Del beste Reel"],
  [27, null, "instagram", "Flashback til noe gammelt i stories"],
  [28, null, "spotify", "Send neste låt til playlist-vurdering"],
  [28, null, "instagram", "Grid og story med musikkvideoen"],
  [28, null, "facebook", "Legg ut musikkvideoen"],
  [28, null, "linkinbio", "Lenk til musikkvideoen"],
  [28, null, "epost", "Send musikkvideoen på e-post og fortell en historie"],
  [28, null, "nettverk", "Ta kontakt med dine største støttespillere"],
  [29, null, "youtube", "Short med klipp fra lyric video + oppdater spillelister"],
  [29, null, "tiktok", "Bruk klipp fra musikkvideo og BTS i innholdet"],
  [29, null, "instagram", "Fortell historien bak videoen i karusell og stories"],
  [29, null, "facebook", "Legg ut beste TikTok"],
  [30, null, "spotify", "Oppdater artist-spillelisten og relaterte spillelister"],
  [30, null, "youtube", "Legg ut forrige ukes beste TikTok som Short"],
  [30, null, "instagram", "Lenk artist-spillelisten i story"],
  [30, null, "facebook", "Del artist-spillelisten"],
  [32, null, "youtube", "Legg ut forrige ukes nest beste TikTok som Short"],
  [33, null, "instagram", "Del en tweet eller Facebook-post i story for kryss-promotering"],
  [33, null, "facebook", "Del beste Reel"],
  [34, null, "tiktok", "Start en Open Verse-challenge"],
  [34, null, "instagram", "Instagram Live med alle som var med på musikkvideoen"],
  [35, null, "youtube", "Slipp playthrough/vlog/BTS-video"],
  [35, null, "tiktok", "Repost UGC – særlig Open Verse-bidrag"],
  [35, null, "facebook", "Del playthrough/vlog/BTS-video"],
  [36, null, "youtube", "Legg ut forrige ukes beste TikTok som Short"],
  [36, null, "facebook", "Legg ut beste TikTok"],
  [37, null, "spotify", "Lag en Music + Talk-episode"],
  [37, null, "instagram", "Lenk Music + Talk-episoden i story"],
  [37, null, "facebook", "Del Music + Talk-episoden"],
  [39, null, "youtube", "Legg ut forrige ukes nest beste TikTok som Short"],
  [40, null, "facebook", "Del beste Reel"],
  [42, null, "spotify", "Alt-versjon/remix slippes"],
  [42, null, "youtube", "Slipp playthrough/vlog/BTS-video eller alt-versjonen"],
  [42, null, "tiktok", "TikToks om det som er nytt i alt-versjonen"],
  [42, null, "instagram", "Promoter alt-versjonen i grid og story"],
  [42, null, "facebook", "Del alt-versjonen (vlog/BTS/playthrough)"],
  [42, null, "linkinbio", "Lenk til alt-versjonen"],
  [43, null, "spotify", "Sett alt-versjonen som Artist Pick"],
  [43, null, "youtube", "Legg ut forrige ukes beste TikTok som Short"],
  [43, null, "instagram", "Karusell med historien om alt-versjonen"],
  [43, null, "facebook", "Legg ut beste TikTok"],
  [44, null, "spotify", "Oppdater artist-spillelisten og relaterte spillelister"],
  [44, null, "instagram", "Lenk artist-spillelisten i story"],
  [44, null, "facebook", "Del artist-spillelisten"],
  [46, null, "youtube", "Legg ut forrige ukes nest beste TikTok som Short"],
  [47, null, "instagram", "Fortell en historie om alt-versjonen"],
  [47, null, "facebook", "Del beste Reel"],
  [50, null, "youtube", "Legg ut forrige ukes beste TikTok som Short"],
  [50, null, "facebook", "Legg ut beste TikTok"],
  [51, null, "spotify", "Lag en Music + Talk-episode"],
  [51, null, "instagram", "Lenk Music + Talk-episoden i story"],
  [51, null, "facebook", "Del Music + Talk-episoden"],
  [53, null, "youtube", "Legg ut forrige ukes nest beste TikTok som Short"],
  [54, null, "facebook", "Del beste Reel"],
  [56, null, "spotify", "Neste låt slippes – start en ny plan"],
];
// Lager oppgaveliste for de valgte kanalene
function templateTasks(channels) {
  const want = new Set(channels && channels.length ? channels : CHANNELS.map(c => c.k));
  return T.filter(t => want.has(t[2])).map((t, i) => ({ start_off: t[0], end_off: t[1], channel: t[2], title: t[3], owner: ch(t[2]).owner, sort: i }));
}

/* ---------- Datoer ---------- */
const pad = (n) => String(n).padStart(2, "0");
const parse = (s) => { const m = String(s || "").match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
const ymd = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const today = () => { const t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); };
const MON = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];
const DAYS = ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"];
const dShort = (d) => d.getDate() + ". " + MON[d.getMonth()];
const offLabel = (o) => o === 0 ? "Releasedag" : o < 0 ? (-o) + (o === -1 ? " dag" : " dager") + " før" : "Dag " + (o + 1);
const taskStart = (c, t) => addDays(parse(c.release_date), t.start_off);
const taskEnd = (c, t) => addDays(parse(c.release_date), t.end_off ?? t.start_off);
const dayOff = (c, d) => Math.round((d - parse(c.release_date)) / 86400000);
const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

// Status for en oppgave i dag
function taskState(c, t) {
  if (t.done) return "done";
  const s = taskStart(c, t), e = taskEnd(c, t), td = today();
  if (e < td) return "late";
  if (s <= td && e >= td) return "now";
  return "future";
}
function progress(c) { const n = c.tasks.length, d = c.tasks.filter(t => t.done).length; return { n, d, pct: n ? Math.round(d / n * 100) : 0 }; }

/* ---------- Tidslinje: kanaler som rader, dager som kolonner ---------- */
function renderTimeline(box, c, opts = {}) {
  box.replaceChildren();
  const tasks = c.tasks.filter(t => !opts.owner || t.owner === opts.owner);
  if (!tasks.length) { box.appendChild(el("div", "empty", "Ingen oppgaver.")); return; }
  const min = Math.min(-3, ...tasks.map(t => t.start_off)) - 2, max = Math.max(3, ...tasks.map(t => t.end_off ?? t.start_off)) + 2;
  const nar = (box.clientWidth || window.innerWidth) < 640, DAY = nar ? 40 : 42, LW = nar ? 92 : 128, span = max - min + 1, W = span * DAY, x = (o) => (o - min) * DAY;
  const rel = parse(c.release_date), td = dayOff(c, today());
  const tl = el("div", "stl"), inn = el("div", "stl-in"); inn.style.width = (LW + W) + "px"; inn.style.setProperty("--lw", LW + "px");
  // Bakgrunn: helger, i dag og releasedag
  const bg = el("div", "stl-bg");
  for (let o = min; o <= max; o++) {
    const d = addDays(rel, o), wk = d.getDay() === 0 || d.getDay() === 6;
    if (wk || o === 0 || o === td) { const z = el("div", o === 0 ? "rel" : o === td ? "td" : "wk"); z.style.cssText = `left:${x(o)}px;width:${DAY}px`; bg.appendChild(z); }
  }
  inn.appendChild(bg);
  // Topp: måned/uke-linje og dagnummer
  const head = el("div", "stl-head"), hl = el("div", "stl-corner", "Kanal"), hr = el("div", "stl-days");
  for (let o = min; o <= max; o++) {
    const d = addDays(rel, o), cell = el("div", "stl-d" + (o === 0 ? " rel" : "") + (o === td ? " td" : "") + (d.getDay() === 0 || d.getDay() === 6 ? " wk" : ""));
    cell.style.cssText = `left:${x(o)}px;width:${DAY}px`;
    const top = o === 0 ? "RELEASE" : o === td ? "I DAG" : (d.getDate() === 1 || d.getDay() === 1 || o === min) ? (d.getDay() === 1 ? "uke " + isoWeek(d) : "") + (d.getDate() === 1 || o === min ? (d.getDay() === 1 ? " · " : "") + MON[d.getMonth()] : "") : "";
    cell.append(el("span", "t", top), el("b", null, d.getDate()), el("span", "w", ["s", "m", "t", "o", "t", "f", "l"][d.getDay()]));
    cell.title = DAYS[d.getDay()] + " " + dShort(d) + " · " + offLabel(o);
    hr.appendChild(cell);
  }
  head.append(hl, hr); inn.appendChild(head);
  // Én rad per kanal; oppgaver legges i egne baner så teksten ikke overlapper
  const used = CHANNELS.filter(k => tasks.some(t => t.channel === k.k));
  for (const k of used) {
    const row = el("div", "stl-row"), lab = el("div", "stl-lab"); const dot = el("i"); dot.style.background = k.c; lab.append(dot, document.createTextNode(k.n));
    const tr = el("div", "stl-track"); const lanes = [];
    const list = tasks.filter(t => t.channel === k.k).sort((a, b) => a.start_off - b.start_off || a.sort - b.sort);
    for (const t of list) {
      const st = taskState(c, t), left = x(t.start_off) + 2, real = ((t.end_off ?? t.start_off) - t.start_off + 1) * DAY - 4;
      const vis = Math.max(real, Math.min(260, t.title.length * 6.4 + 18));
      let lane = lanes.findIndex(e => e <= left - 3); if (lane < 0) { lane = lanes.length; lanes.push(0); } lanes[lane] = left + vis;
      const b = el("button", "stl-b " + st + (t.end_off != null ? " multi" : "")); b.type = "button";
      b.style.cssText = `left:${left}px;width:${vis}px;top:${5 + lane * 25}px;--c:${k.c};--real:${real}px`;
      b.append(el("span", null, t.title));
      b.title = dShort(taskStart(c, t)) + (t.end_off != null ? " – " + dShort(taskEnd(c, t)) : "") + " · " + offLabel(t.start_off) + "\n" + t.title + "\n" + OWNERS[t.owner] + (t.done ? " · ferdig" : "");
      if (opts.onTask) b.onclick = () => opts.onTask(t); else if (opts.onPeek) b.onclick = () => opts.onPeek(t);
      tr.appendChild(b);
    }
    tr.style.height = (lanes.length * 25 + 8) + "px";
    row.append(lab, tr); inn.appendChild(row);
  }
  tl.appendChild(inn); box.appendChild(tl);
  const lg = el("div", "legend");
  [["Ferdig", "done"], ["I dag", "now"], ["Forsinket", "late"], ["Kommer", "future"]].forEach(([n, s]) => { const xx = el("span"); const i = el("i", "lg-" + s); xx.append(i, document.createTextNode(n)); lg.appendChild(xx); });
  lg.appendChild(el("span", "muted", "Rull sidelengs for å se hele perioden. Fylt del av en stolpe = varighet."));
  box.appendChild(lg);
  // Start ved i dag (eller release hvis i dag er utenfor planen)
  requestAnimationFrame(() => { const o = td >= min && td <= max ? td : 0; tl.scrollLeft = Math.max(0, x(o) - DAY * (nar ? 1 : 4)); });
}
function isoWeek(d) { const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); const n = t.getUTCDay() || 7; t.setUTCDate(t.getUTCDate() + 4 - n); const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1)); return Math.ceil(((t - y) / 864e5 + 1) / 7); }

/* ---------- Liste gruppert per dag ---------- */
function renderList(box, c, opts = {}) {
  box.replaceChildren();
  const td = today();
  let tasks = c.tasks.filter(t => (!opts.owner || t.owner === opts.owner) && (!opts.channel || t.channel === opts.channel) && (opts.showDone || !t.done));
  if (opts.range === "uke") tasks = tasks.filter(t => { const s = taskStart(c, t), e = taskEnd(c, t); return (e >= addDays(td, -7) && s <= addDays(td, 7)) || (!t.done && e < td); });
  // Pågående oppgaver over flere dager vises på i dag (eller startdag)
  const keyDate = (t) => { const s = taskStart(c, t), e = taskEnd(c, t); return t.end_off != null && s < td && e >= td ? td : s; };
  const groups = new Map();
  for (const t of tasks.sort((a, b) => keyDate(a) - keyDate(b) || a.sort - b.sort)) { const k = ymd(keyDate(t)); if (!groups.has(k)) groups.set(k, []); groups.get(k).push(t); }
  if (!groups.size) { box.appendChild(el("div", "empty", opts.range === "uke" ? "Ingen oppgaver denne uken." : "Ingen oppgaver.")); return; }
  for (const [k, list] of groups) {
    const d = parse(k), o = dayOff(c, d);
    const h = el("div", "sday" + (ymd(d) === ymd(td) ? " today" : d < td ? " past" : ""));
    h.append(el("b", null, (ymd(d) === ymd(td) ? "I dag · " : "") + DAYS[d.getDay()][0].toUpperCase() + DAYS[d.getDay()].slice(1) + " " + dShort(d)), el("span", null, offLabel(o)));
    box.appendChild(h);
    for (const t of list) box.appendChild(taskRow(c, t, opts));
  }
}
function taskRow(c, t, opts) {
  const k = ch(t.channel), st = taskState(c, t);
  const r = el("div", "stask " + st);
  const cb = el("input"); cb.type = "checkbox"; cb.checked = t.done; cb.disabled = !!opts.readOnly || (opts.canToggle && !opts.canToggle(t));
  cb.onchange = async () => { cb.disabled = true; try { await opts.onToggle(t, cb.checked); } catch (e) { cb.checked = !cb.checked; } cb.disabled = false; };
  const m = el("div", "m"); const ti = el("div", "ti"); ti.append(el("span", "chip", k.n)); ti.lastChild.style.setProperty("--c", k.c); ti.appendChild(document.createTextNode(t.title)); m.appendChild(ti);
  const sub = [OWNERS[t.owner], t.end_off != null ? "frem til " + dShort(taskEnd(c, t)) : "", st === "late" ? "forsinket" : "", t.note].filter(Boolean).join(" · ");
  if (sub) m.appendChild(el("div", "su", sub));
  r.append(cb, m);
  if (opts.onTask) { const e = el("button", "btn ghost sm", "Endre"); e.type = "button"; e.onclick = () => opts.onTask(t); r.appendChild(e); }
  return r;
}


/* ---------- Månedskalender (standardvisning) ---------- */
const MONL = ["januar", "februar", "mars", "april", "mai", "juni", "juli", "august", "september", "oktober", "november", "desember"];
function renderMonth(box, c, opts = {}) {
  box.replaceChildren();
  const rel = parse(c.release_date), td = today();
  let tasks = c.tasks.filter(t => (!opts.owner || t.owner === opts.owner) && (!opts.channel || t.channel === opts.channel) && (opts.showDone !== false || !t.done));
  const first = (opts.month && new Date(opts.month.getFullYear(), opts.month.getMonth(), 1)) || new Date(td.getFullYear(), td.getMonth(), 1);
  const nav = el("div", "mcal-nav");
  const prev = el("button", "btn sub sm", "‹"), next = el("button", "btn sub sm", "›"), now = el("button", "btn sub sm", "I dag"), relb = el("button", "btn sub sm", "Release");
  [prev, next, now, relb].forEach(b => b.type = "button");
  const go = (d) => { opts.month = d; if (opts.onMonth) opts.onMonth(d); renderMonth(box, c, opts); };
  prev.onclick = () => go(new Date(first.getFullYear(), first.getMonth() - 1, 1));
  next.onclick = () => go(new Date(first.getFullYear(), first.getMonth() + 1, 1));
  now.onclick = () => go(new Date(td.getFullYear(), td.getMonth(), 1));
  relb.onclick = () => go(new Date(rel.getFullYear(), rel.getMonth(), 1));
  nav.append(prev, el("b", null, MONL[first.getMonth()][0].toUpperCase() + MONL[first.getMonth()].slice(1) + " " + first.getFullYear()), next, el("span", "spacer"), now, relb);
  box.appendChild(nav);
  // Hvilke oppgaver vises på en dag: énsdagsoppgaver på sin dag, flerdagsoppgaver på start- og sluttdag
  const byDay = new Map(); const put = (d, t, kind) => { const k = ymd(d); if (!byDay.has(k)) byDay.set(k, []); byDay.get(k).push({ t, kind }); };
  for (const t of tasks) { const s = taskStart(c, t), e = taskEnd(c, t); put(s, t, t.end_off != null ? "start" : ""); if (t.end_off != null && ymd(e) !== ymd(s)) put(e, t, "end"); }
  const narrow = (box.clientWidth || window.innerWidth) < 640;
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);
  const chipFor = ({ t, kind }) => {
    const k = ch(t.channel), st = taskState(c, t);
    const b = el("button", "mchip " + st); b.type = "button"; b.style.setProperty("--c", k.c);
    b.append(el("i"), el("span", null, (kind === "start" ? "Fra i dag: " : kind === "end" ? "Siste dag: " : "") + t.title));
    b.title = k.n + " · " + t.title + " · " + OWNERS[t.owner] + (t.done ? " · ferdig" : "");
    b.onclick = () => opts.onTask ? opts.onTask(t) : (opts.onPeek && opts.onPeek(t));
    return b;
  };
  if (narrow) {
    // Mobil: liste over dagene i måneden som har noe
    const list = el("div", "mcal-list");
    for (let d = new Date(first); d <= last; d = addDays(d, 1)) {
      const items = byDay.get(ymd(d)) || [], isRel = ymd(d) === ymd(rel);
      if (!items.length && !isRel) continue;
      const day = el("div", "mcal-lday" + (ymd(d) === ymd(td) ? " today" : ""));
      const h = el("div", "h"); h.append(el("b", null, DAYS[d.getDay()][0].toUpperCase() + DAYS[d.getDay()].slice(1) + " " + dShort(d)), el("span", null, isRel ? "RELEASE" : offLabel(dayOff(c, d))));
      if (isRel) h.classList.add("rel");
      day.appendChild(h); items.forEach(it => day.appendChild(chipFor(it))); list.appendChild(day);
    }
    if (!list.children.length) list.appendChild(el("div", "empty", "Ingen oppgaver denne måneden."));
    box.appendChild(list); return;
  }
  const grid = el("div", "mcal");
  ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"].forEach(n => grid.appendChild(el("div", "mcal-dn", n)));
  const start = addDays(first, -((first.getDay() + 6) % 7));
  for (let i = 0; i < 42; i++) {
    const d = addDays(start, i); if (i >= 35 && d.getMonth() !== first.getMonth()) break;
    const items = byDay.get(ymd(d)) || [], isRel = ymd(d) === ymd(rel);
    const cell = el("div", "mcal-c" + (d.getMonth() !== first.getMonth() ? " out" : "") + (ymd(d) === ymd(td) ? " today" : "") + (isRel ? " rel" : ""));
    const top = el("div", "mcal-top"); top.append(el("span", "n", d.getDate()), el("span", "o", isRel ? "RELEASE" : (dayOff(c, d) >= -30 && dayOff(c, d) <= 56 ? offLabel(dayOff(c, d)).replace(" før", "") : "")));
    cell.appendChild(top);
    const max = 5; items.slice(0, max).forEach(it => cell.appendChild(chipFor(it)));
    if (items.length > max) { const m = el("button", "mchip more", "+" + (items.length - max) + " til"); m.type = "button"; m.onclick = () => { cell.querySelectorAll(".mchip").forEach(x => x.remove()); items.forEach(it => cell.appendChild(chipFor(it))); cell.classList.add("open"); }; cell.appendChild(m); }
    grid.appendChild(cell);
  }
  box.appendChild(grid);
}

/* ---------- Verktøykasse: beste tider, tekstmaler, hashtags, idébank ---------- */
const BEST_TIMES = {
  tiktok: { d: "Hverdag 18–21 · helg 11–13", tip: "Unngå 14–16. De første 2–3 sekundene avgjør." },
  instagram: { d: "Hverdag 07–09 og 19–21 · helg 10–12", tip: "Reels gir mest rekkevidde. Stories for pre-save og nedtelling." },
  youtube: { d: "Hverdag 17–19 · helg 10–14", tip: "Torsdag og fredag er best for nye videoer." },
  facebook: { d: "Hverdag 12–14 og 19–21", tip: "Fungerer best for lokalt publikum og eldre fans." },
  spotify: { d: "Slipp fredag kl. 00:00", tip: "Redaksjonell pitch senest 7 dager før, helst 3–4 uker." },
  press: { d: "Tirsdag–torsdag 09–11", tip: "Kort mail, lenke til låta og et godt bilde. Ikke vedlegg store filer." },
  epost: { d: "Tirsdag–torsdag 10–11 eller 19–20", tip: "Kort emnefelt med låttittel. Send på releasedagen." },
  linkinbio: { d: "Oppdater samme dag som lenken skal brukes", tip: "Bytt fra pre-save til strømmelenke på releasedagen." },
  nettverk: { d: "Når det passer – helst tidlig i uka", tip: "Personlige meldinger slår masseutsendelser." },
};
const TPL_CATS = { teaser: "Teaser", presave: "Pre-save", slipp: "Slippdag", bts: "Bak kulissene", historie: "Historie", engasjement: "Engasjement", etter: "Etter release", live: "Live", presse: "Presse", annet: "Annet" };
const IDEA_CATS = { format: { n: "Format", c: "#A78BFA" }, taktikk: { n: "Taktikk", c: "#FFB547" }, lyd: { n: "Lyd og musikk", c: "#1ED760" }, estetikk: { n: "Estetikk", c: "#F472B6" } };
const HT_SETS = [["bred", "Bred rekkevidde"], ["nisje", "Nisje"], ["lokal", "Lokalt og norsk"]];
const songName = (c) => c ? (c.song || String(c.title || "").replace(/\s*[–-]\s*(singel|single|ep|album)\s*$/i, "")) : "";
// Fyller inn [LÅTTITTEL], [ARTIST], [DATO] og [LENKE] fra planen. Ukjente felt blir stående.
function fillTemplate(text, c) {
  if (!c) return text;
  const rel = parse(c.release_date);
  const map = { "LÅTTITTEL": songName(c), "ARTIST": c.artist || "", "DATO": rel ? rel.getDate() + ". " + MONL[rel.getMonth()] : "", "LENKE": c.link || "" };
  return String(text).replace(/\[([A-ZÆØÅ]+)\]/g, (m, k) => map[k] ? map[k] : m);
}
async function copyText(text, btn) {
  try { await navigator.clipboard.writeText(text); }
  catch { const ta = el("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch {} ta.remove(); }
  if (btn) { const o = btn.textContent; btn.textContent = "Kopiert ✓"; btn.disabled = true; setTimeout(() => { btn.textContent = o; btn.disabled = false; }, 1400); }
}
const copyBtn = (text, label) => { const b = el("button", "btn sub sm", label || "Kopier"); b.type = "button"; b.onclick = (e) => { e.stopPropagation(); copyText(typeof text === "function" ? text() : text, b); }; return b; };
const tagStr = (arr) => (arr || []).join(" ");
const hasTags = (h) => !!h && HT_SETS.some(([k]) => (h[k] || []).length);

// Beste tid for en kanal (én linje)
function bestTime(channel) {
  const b = BEST_TIMES[channel]; if (!b) return null;
  const x = el("div", "kit-time"); x.append(el("b", null, "Beste tid · " + ch(channel).n + ": "), document.createTextNode(b.d), el("div", "muted", b.tip));
  return x;
}
// Ett malkort med kopier-knapp
function tplCard(t, c, opts = {}) {
  const k = ch(t.channel), body = fillTemplate(t.content, c);
  const card = el("div", "tpl"); card.style.setProperty("--c", k.c);
  const h = el("div", "tpl-h"); const chip = el("span", "chip", k.n); chip.style.setProperty("--c", k.c);
  const cat = TPL_CATS[t.category] || ""; h.append(chip, el("b", null, t.name), el("span", "muted", cat.toLowerCase() === String(t.name).toLowerCase() ? "" : cat), el("span", "spacer"));
  if (opts.onEdit) { const e = el("button", "btn ghost sm", "Endre"); e.type = "button"; e.onclick = () => opts.onEdit(t); h.appendChild(e); }
  h.appendChild(copyBtn(body));
  const pre = el("div", "tpl-b", body);
  card.append(h, pre);
  if (/\[[A-ZÆØÅ]+\]/.test(body)) card.appendChild(el("div", "tpl-hint", "Fyll inn feltene i [klammer] før du poster."));
  return card;
}
// Hashtag-sett med kopier-knapper
function renderTags(box, h, opts = {}) {
  box.replaceChildren();
  if (!hasTags(h)) { box.appendChild(el("div", "muted", opts.empty || "Ingen hashtags lagt inn ennå.")); return; }
  const all = el("div", "ht-row");
  for (const [k, n] of HT_SETS) {
    const list = (h[k] || []); if (!list.length) continue;
    const r = el("div", "ht"); const head = el("div", "ht-h"); head.append(el("b", null, n), el("span", "spacer"), copyBtn(tagStr(list)));
    const tags = el("div", "ht-tags"); list.forEach(t => tags.appendChild(el("span", null, t)));
    r.append(head, tags); all.appendChild(r);
  }
  box.appendChild(all);
  const mix = HT_SETS.map(([k]) => (h[k] || []).slice(0, 3)).flat();
  if (mix.length > 3) { const m = el("div", "ht-mix"); m.append(el("span", "muted", "Miks av alle tre: " + tagStr(mix)), copyBtn(tagStr(mix), "Kopier miks")); box.appendChild(m); }
}
/* Verktøy i en oppgave: beste tid, tekstforslag for kanalen og hashtags */
function renderTaskKit(box, c, t, kit, opts = {}) {
  box.replaceChildren(); if (!kit) return;
  const channel = typeof t === "string" ? t : t.channel;
  const bt = bestTime(channel); if (bt) box.appendChild(bt);
  const tpls = (kit.templates || []).filter(x => x.channel === channel);
  const rest = (kit.templates || []).filter(x => x.channel !== channel);
  const sec = el("div", "kit-sec"); sec.appendChild(el("div", "kit-l", "Tekstforslag" + (tpls.length ? "" : " (ingen for " + ch(channel).n + " – viser alle)")));
  const list = el("div", "tpl-list"); (tpls.length ? tpls : rest).forEach(x => list.appendChild(tplCard(x, c)));
  sec.appendChild(list);
  if (tpls.length && rest.length) { const more = el("button", "btn ghost sm", "Vis maler for andre kanaler (" + rest.length + ")"); more.type = "button"; more.onclick = () => { rest.forEach(x => list.appendChild(tplCard(x, c))); more.remove(); }; sec.appendChild(more); }
  if (!(kit.templates || []).length) sec.appendChild(el("div", "muted", "Ingen tekstmaler ennå."));
  box.appendChild(sec);
  const hs = el("div", "kit-sec"); hs.appendChild(el("div", "kit-l", "Hashtags" + (c && c.artist ? " · " + c.artist : "")));
  const hb = el("div"); renderTags(hb, (kit.hashtagsFor ? kit.hashtagsFor(c) : kit.hashtags) || {}, { empty: opts.tagsEmpty }); hs.appendChild(hb); box.appendChild(hs);
}
/* Idébank */
function heatDots(n) { const s = el("span", "heat"); s.title = ["Stigende", "Varm", "På topp"][n - 1] || ""; for (let i = 1; i <= 3; i++) s.appendChild(el("i", i <= n ? "on" : "")); return s; }
function ideaCard(i, opts = {}) {
  const card = el("div", "idea" + (i.archived ? " arch" : ""));
  const h = el("div", "idea-h");
  const chan = i.channel === "alle" ? { n: "Alle kanaler", c: "#8B7FB8" } : ch(i.channel), cat = IDEA_CATS[i.category] || { n: i.category, c: "#8B7FB8" };
  const a = el("span", "chip", chan.n); a.style.setProperty("--c", chan.c); const b = el("span", "chip", cat.n); b.style.setProperty("--c", cat.c);
  h.append(a, b, el("span", "spacer"), heatDots(i.heat));
  card.append(h, el("h3", null, i.title));
  if (i.what) card.appendChild(el("p", "muted", i.what));
  if (i.how) { const how = el("div", "idea-how"); how.append(el("div", "kit-l", "Slik kan du bruke den"), el("p", null, i.how)); card.appendChild(how); }
  const f = el("div", "idea-f"); f.append(el("span", "muted", [i.source, i.batch, i.archived ? "arkivert" : ""].filter(Boolean).join(" · ")), el("span", "spacer"));
  if (opts.onEdit) { const e = el("button", "btn ghost sm", "Endre"); e.type = "button"; e.onclick = () => opts.onEdit(i); f.appendChild(e); }
  card.appendChild(f);
  return card;
}
function renderIdeas(box, ideas, opts = {}) {
  box.replaceChildren();
  const st = opts.state || (opts.state = {}); for (const k of ["chan", "cat", "q"]) if (st[k] == null) st[k] = "";
  const bar = el("div", "idea-bar");
  const chSel = el("select", "flt"); chSel.append(Object.assign(el("option", null, "Alle kanaler"), { value: "" }), Object.assign(el("option", null, "Gjelder alle"), { value: "alle" }), ...CHANNELS.map(k => Object.assign(el("option", null, k.n), { value: k.k }))); chSel.value = st.chan;
  const caSel = el("select", "flt"); caSel.append(Object.assign(el("option", null, "Alle typer"), { value: "" }), ...Object.entries(IDEA_CATS).map(([k, v]) => Object.assign(el("option", null, v.n), { value: k }))); caSel.value = st.cat;
  const q = el("input", "flt"); q.type = "search"; q.placeholder = "Søk i idébanken"; q.value = st.q;
  bar.append(q, chSel, caSel); box.appendChild(bar);
  const grid = el("div", "idea-grid"); box.appendChild(grid);
  const draw = () => {
    grid.replaceChildren();
    const needle = st.q.trim().toLowerCase();
    const list = ideas.filter(i => (!opts.hideArchived || !i.archived) && (!st.chan || i.channel === st.chan || (st.chan !== "alle" && i.channel === "alle")) && (!st.cat || i.category === st.cat)
      && (!needle || [i.title, i.what, i.how].join(" ").toLowerCase().includes(needle)))
      .sort((a, b) => (a.archived - b.archived) || (b.heat - a.heat) || String(b.created_at).localeCompare(String(a.created_at)));
    list.forEach(i => grid.appendChild(ideaCard(i, opts)));
    if (!list.length) grid.appendChild(el("div", "empty", "Ingen idéer for dette filteret."));
  };
  chSel.onchange = () => { st.chan = chSel.value; draw(); }; caSel.onchange = () => { st.cat = caSel.value; draw(); }; q.oninput = () => { st.q = q.value; draw(); };
  draw();
  box.appendChild(el("div", "muted heat-legend", "Prikkene viser temperatur: 1 = stigende, 2 = varm, 3 = på topp."));
}

window.SOME = { renderMonth, BEST_TIMES, TPL_CATS, IDEA_CATS, HT_SETS, fillTemplate, copyText, copyBtn, bestTime, tplCard, renderTags, renderTaskKit, renderIdeas, ideaCard, hasTags, CHANNELS, OWNERS, ch, templateTasks, parse, ymd, addDays, today, dShort, offLabel, taskStart, taskEnd, dayOff, taskState, progress, renderTimeline, renderList, taskRow };
})();
