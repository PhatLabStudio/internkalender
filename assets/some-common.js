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
  const min = Math.min(-3, ...tasks.map(t => t.start_off)) - 1, max = Math.max(3, ...tasks.map(t => t.end_off ?? t.start_off)) + 1;
  const span = max - min + 1, pos = (o) => (o - min) / span * 100;
  const rel = parse(c.release_date);
  const tl = el("div", "stl"), inn = el("div", "stl-in"); inn.style.minWidth = Math.max(720, span * 11) + "px";
  const head = el("div", "stl-head");
  for (let o = min; o <= max; o++) {
    const d = addDays(rel, o);
    if (o === 0 || (d.getDay() === 1 && Math.abs(o) > 3)) { const s = el("span", o === 0 ? "rel" : null, o === 0 ? "Release" : dShort(d)); s.style.left = pos(o) + "%"; head.appendChild(s); }
  }
  inn.appendChild(head);
  const used = CHANNELS.filter(k => tasks.some(t => t.channel === k.k));
  for (const k of used) {
    const row = el("div", "stl-row"), lab = el("div", "stl-lab"); const dot = el("i"); dot.style.background = k.c; lab.append(dot, document.createTextNode(k.n));
    const tr = el("div", "stl-track");
    // Flere oppgaver samme dag stables i små kolonner
    const per = new Map();
    for (const t of tasks.filter(t => t.channel === k.k)) {
      const st = taskState(c, t), w = (t.end_off != null ? t.end_off - t.start_off + 1 : 1) / span * 100;
      const key = t.start_off + ":" + (t.end_off ?? ""); const n = per.get(key) || 0; per.set(key, n + 1);
      const b = el("button", "stl-b " + st); b.type = "button";
      b.style.cssText = `left:calc(${pos(t.start_off)}% + 1px);width:calc(${w}% - 2px);--c:${k.c};top:${6 + n * 6}px`;
      b.title = offLabel(t.start_off) + (t.end_off != null ? " – " + offLabel(t.end_off) : "") + " · " + dShort(taskStart(c, t)) + "\n" + t.title + "\n" + OWNERS[t.owner] + (t.done ? " · ferdig" : "");
      if (t.end_off != null && w > 6) b.textContent = t.title;
      if (opts.onTask) b.onclick = () => opts.onTask(t);
      tr.appendChild(b);
    }
    row.append(lab, tr); inn.appendChild(row);
  }
  const td = dayOff(c, today());
  if (td >= min && td <= max) { const x = el("div", "stl-today"); x.style.left = `calc(var(--lw) + (100% - var(--lw)) * ${(td - min + 0.5) / span})`; inn.appendChild(x); }
  const rl = el("div", "stl-rel"); rl.style.left = `calc(var(--lw) + (100% - var(--lw)) * ${(0 - min + 0.5) / span})`; inn.appendChild(rl);
  tl.appendChild(inn); box.appendChild(tl);
  const lg = el("div", "legend");
  [["Ferdig", "done"], ["I dag", "now"], ["Forsinket", "late"], ["Kommer", "future"]].forEach(([n, s]) => { const x = el("span"); const i = el("i", "lg-" + s); x.append(i, document.createTextNode(n)); lg.appendChild(x); });
  box.appendChild(lg);
}

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

window.SOME = { renderMonth, CHANNELS, OWNERS, ch, templateTasks, parse, ymd, addDays, today, dShort, offLabel, taskStart, taskEnd, dayOff, taskState, progress, renderTimeline, renderList, taskRow };
})();
