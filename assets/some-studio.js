/* Sosiale medier for studio: planer, oppgaver, tekstmaler, hashtags og idébank.
   Brukes inne på artistprofilen (artist.html). Krever artist-common.js og some-common.js.
   SOMESTUDIO.mount(root, { rpc, artistId, onChange }) */
(() => {
"use strict";
const P = window.PLA, S = window.SOME, { el, toast } = P;

const MODALS = `
<div class="mback hidden" id="ss-planModal">
  <form class="modal" id="ss-planForm" autocomplete="off" style="width:min(620px,100%)">
    <div class="mh"><h2 id="ss-planH">Ny SoMe-plan</h2><span class="spacer"></span><button type="button" class="btn ghost sm" data-ssclose>✕</button></div>
    <div class="f2">
      <div class="f" id="ss-artWrap"><label for="ss-p-artist">Artist</label><select id="ss-p-artist" required></select></div>
      <div class="f"><label for="ss-p-song">Låt</label><select id="ss-p-song"></select></div>
    </div>
    <div class="f2">
      <div class="f"><label for="ss-p-title">Navn på planen</label><input id="ss-p-title" maxlength="200" required placeholder="For eksempel «Pendel – singel»"></div>
      <div class="f"><label for="ss-p-date">Releasedato</label><input id="ss-p-date" type="date" required><span class="hint" id="ss-p-dateHint"></span></div>
    </div>
    <div class="f" id="ss-chWrap"><label>Kanaler</label><div class="chs" id="ss-p-chs"></div><span class="hint" id="ss-p-count"></span></div>
    <div class="f"><label for="ss-p-notes">Notater</label><textarea id="ss-p-notes" maxlength="4000" style="min-height:70px" placeholder="Tone, hvem som gjør hva …"></textarea></div>
    <label class="check hidden" id="ss-archWrap" style="margin-bottom:10px"><input type="checkbox" id="ss-p-arch"> Arkiver planen</label>
    <div class="mfoot"><button type="button" class="btn danger hidden" id="ss-p-del">Slett</button><span class="spacer"></span><button type="button" class="btn ghost" data-ssclose>Avbryt</button><button class="btn primary" id="ss-p-save">Lag plan</button></div>
  </form>
</div>
<div class="mback hidden" id="ss-taskModal">
  <form class="modal" id="ss-taskForm" autocomplete="off" style="width:min(760px,100%)">
    <div class="mh"><h2 id="ss-taskH">Ny oppgave</h2><span class="spacer"></span><button type="button" class="btn ghost sm" data-ssclose>✕</button></div>
    <div class="f"><label for="ss-t-title">Oppgave</label><input id="ss-t-title" maxlength="300" required></div>
    <div class="f2">
      <div class="f"><label for="ss-t-chan">Kanal</label><select id="ss-t-chan"></select></div>
      <div class="f"><label for="ss-t-owner">Ansvarlig</label><select id="ss-t-owner"><option value="artist">Artist</option><option value="studio">Studio</option><option value="label">Label/distributør</option></select></div>
    </div>
    <div class="f2">
      <div class="f"><label for="ss-t-start">Dato</label><input id="ss-t-start" type="date" required><span class="hint" id="ss-t-startHint"></span></div>
      <div class="f"><label for="ss-t-end">Til og med (valgfritt)</label><input id="ss-t-end" type="date"><span class="hint">For oppgaver som går over flere dager</span></div>
    </div>
    <div class="f"><label for="ss-t-note">Notat</label><input id="ss-t-note" maxlength="2000" placeholder="Idé, hashtag, hvem som filmer …"></div>
    <div class="f"><label for="ss-t-link">Lenke til posten</label><input id="ss-t-link" maxlength="500" placeholder="Når den er ute"></div>
    <label class="check" style="margin-bottom:10px"><input type="checkbox" id="ss-t-done"> Ferdig</label>
    <details open style="margin:4px 0 12px"><summary style="cursor:pointer;font-weight:600;font-size:14px">Beste tid, tekstforslag og hashtags</summary><div id="ss-t-kit" style="margin-top:10px"></div></details>
    <div class="mfoot"><button type="button" class="btn danger hidden" id="ss-t-del">Slett</button><span class="spacer"></span><button type="button" class="btn ghost" data-ssclose>Avbryt</button><button class="btn primary">Lagre</button></div>
  </form>
</div>
<div class="mback hidden" id="ss-tagModal">
  <form class="modal" id="ss-tagForm" autocomplete="off">
    <div class="mh"><h2 id="ss-tagH">Hashtags</h2><span class="spacer"></span><button type="button" class="btn ghost sm" data-ssclose>✕</button></div>
    <p class="muted" style="margin:0 0 12px;font-size:13px">Skriv hashtags med mellomrom eller linjeskift. Artisten kan også endre disse selv.</p>
    <div class="f"><label for="ss-h-bred">Bred rekkevidde</label><textarea id="ss-h-bred" placeholder="#nymusikk #norskmusikk …"></textarea></div>
    <div class="f"><label for="ss-h-nisje">Nisje</label><textarea id="ss-h-nisje" placeholder="Sjanger og stemning"></textarea></div>
    <div class="f"><label for="ss-h-lokal">Lokalt og norsk</label><textarea id="ss-h-lokal" placeholder="#drammen #norskpop …"></textarea></div>
    <div class="mfoot"><span class="spacer"></span><button type="button" class="btn ghost" data-ssclose>Avbryt</button><button class="btn primary">Lagre</button></div>
  </form>
</div>
<div class="mback hidden" id="ss-tplModal">
  <form class="modal" id="ss-tplForm" autocomplete="off" style="width:min(640px,100%)">
    <div class="mh"><h2 id="ss-tplH">Ny tekstmal</h2><span class="spacer"></span><button type="button" class="btn ghost sm" data-ssclose>✕</button></div>
    <p class="muted" style="margin:0 0 10px;font-size:13px">Tekstmalene er felles for alle artister.</p>
    <div class="f"><label for="ss-m-name">Navn</label><input id="ss-m-name" maxlength="120" required placeholder="For eksempel «Slippdag»"></div>
    <div class="f2">
      <div class="f"><label for="ss-m-chan">Kanal</label><select id="ss-m-chan"></select></div>
      <div class="f"><label for="ss-m-cat">Type</label><select id="ss-m-cat"></select></div>
    </div>
    <div class="f"><label for="ss-m-content">Tekst</label><textarea id="ss-m-content" style="min-height:180px" maxlength="4000" required></textarea><span class="hint">[LÅTTITTEL], [ARTIST], [DATO] og [LENKE] fylles inn automatisk.</span></div>
    <div class="mfoot"><button type="button" class="btn danger hidden" id="ss-m-del">Slett</button><span class="spacer"></span><button type="button" class="btn ghost" data-ssclose>Avbryt</button><button class="btn primary">Lagre</button></div>
  </form>
</div>
<div class="mback hidden" id="ss-ideaModal">
  <form class="modal" id="ss-ideaForm" autocomplete="off" style="width:min(640px,100%)">
    <div class="mh"><h2 id="ss-ideaH">Ny idé</h2><span class="spacer"></span><button type="button" class="btn ghost sm" data-ssclose>✕</button></div>
    <p class="muted" style="margin:0 0 10px;font-size:13px">Idébanken er felles for alle artister og vises på artistsiden.</p>
    <div class="f"><label for="ss-i-title">Tittel</label><input id="ss-i-title" maxlength="200" required></div>
    <div class="f"><label for="ss-i-what">Hva det er</label><textarea id="ss-i-what" maxlength="3000"></textarea></div>
    <div class="f"><label for="ss-i-how">Slik kan artisten bruke den</label><textarea id="ss-i-how" maxlength="3000"></textarea></div>
    <div class="f2">
      <div class="f"><label for="ss-i-chan">Kanal</label><select id="ss-i-chan"></select></div>
      <div class="f"><label for="ss-i-cat">Type</label><select id="ss-i-cat"></select></div>
    </div>
    <div class="f2">
      <div class="f"><label for="ss-i-heat">Temperatur</label><select id="ss-i-heat"><option value="1">1 – stigende</option><option value="2">2 – varm</option><option value="3">3 – på topp</option></select></div>
      <div class="f"><label for="ss-i-batch">Gruppe/uke</label><input id="ss-i-batch" maxlength="80" placeholder="For eksempel «Uke 48»"></div>
    </div>
    <div class="f"><label for="ss-i-src">Kilde</label><input id="ss-i-src" maxlength="200" placeholder="Hvor du fant den"></div>
    <label class="check" style="margin-bottom:10px"><input type="checkbox" id="ss-i-arch"> Arkiver (skjules for artistene)</label>
    <div class="mfoot"><button type="button" class="btn danger hidden" id="ss-i-del">Slett</button><span class="spacer"></span><button type="button" class="btn ghost" data-ssclose>Avbryt</button><button class="btn primary">Lagre</button></div>
  </form>
</div>`;

const CSS = `
.ss-chs{display:flex;flex-wrap:wrap;gap:8px}
.ss-chs label{display:inline-flex;gap:6px;align-items:center;background:var(--surface);border:1px solid var(--line);border-radius:99px;padding:5px 11px;font-size:13px;cursor:pointer}
.ss-chs label i{width:9px;height:9px;border-radius:3px}
.ss-chs input{accent-color:#D946EF}
.ss-bar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:14px 0}
.ss-seg{display:inline-flex;border:1px solid var(--line);border-radius:10px;overflow:hidden}
.ss-seg button{background:var(--card);border:0;color:var(--muted);padding:7px 12px;font-size:13px}
.ss-seg button.on{background:#D946EF;color:#fff}
.ss-seg button+button{border-left:1px solid var(--line)}
select.ss-flt{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:7px 10px;color:var(--ink);font-size:13px}
.ss-head{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.ss-hl{flex:1;min-width:0}
.ss-head .big{font:700 clamp(20px,3vw,26px)/1.15 var(--f-display)}
.ss-tag{font-size:11px;color:var(--muted)}
@media (max-width:640px){.ss-head .ss-hl{flex:1 1 100%}.ss-head .btn{flex:1}}
`;

let injected = false;
function inject() {
  if (injected) return; injected = true;
  const st = el("style"); st.textContent = CSS; document.head.appendChild(st);
  const w = el("div"); w.innerHTML = MODALS; while (w.firstElementChild) document.body.appendChild(w.firstElementChild);
  document.querySelectorAll("[data-ssclose]").forEach(b => b.onclick = closeModals);
  document.querySelectorAll("[id^=ss-][id$=Modal]").forEach(m => m.addEventListener("click", (e) => { if (e.target === m) closeModals(); }));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModals(); });
}
const $ = (id) => document.getElementById(id);
function openModal(id) { $(id).classList.remove("hidden"); document.body.style.overflow = "hidden"; }
function closeModals() { document.querySelectorAll("[id^=ss-][id$=Modal]").forEach(m => m.classList.add("hidden")); document.body.style.overflow = ""; }
function armDelete(b, f) { b.onclick = async () => { if (!b.dataset.armed) { b.dataset.armed = "1"; b.textContent = "Sikker? Klikk igjen"; setTimeout(() => { delete b.dataset.armed; b.textContent = "Slett"; }, 3000); return; } try { await f(); } catch (e) { toast(e.message, true); } }; }
const opt = (v, n) => Object.assign(el("option", null, n), { value: v });
const splitTags = (v) => v.split(/[\s,]+/).map(x => x.trim()).filter(Boolean);
const seg = (items, cur, onPick) => { const s = el("div", "ss-seg"); for (const [v, n] of items) { const b = el("button", v === cur ? "on" : null, n); b.type = "button"; b.onclick = () => onPick(v); s.appendChild(b); } return s; };

function mount(root, cfg) {
  inject();
  const rpc = cfg.rpc, AID = cfg.artistId || null;
  let D = { campaigns: [], artists: [], songs: [] }, KIT = { templates: [], ideas: [], hashtags: {} }, cur = null;
  const ui = { home: "plan", view: "kal", owner: "", chan: "", done: false, month: null, monthFor: null, tplChan: "", wkOwner: "", showArch: false };
  const ideaState = {};
  const camps = () => D.campaigns.filter(c => !AID || c.artist_id === AID);
  const kitFor = () => ({ ...KIT, hashtagsFor: (c) => (c && KIT.hashtags[c.artist_id]) || {} });
  const changed = () => { if (cfg.onChange) cfg.onChange(camps()); };

  async function load() {
    [D, KIT] = await Promise.all([rpc("som_list"), rpc("som_kit")]);
    if (cur) cur = D.campaigns.find(c => c.id === cur.id) || null;
    render(); changed();
  }
  function render() { root.replaceChildren(); cur ? renderCamp() : renderHome(); }

  /* ---------- Oversikt ---------- */
  function renderHome() {
    const tabs = [["plan", "Planer"], ["tpl", "Tekstmaler"]]; if (AID) tabs.push(["tags", "Hashtags"]); tabs.push(["idea", "Idébank"]);
    const tb = el("div", "tabs2"); tb.style.marginTop = "0";
    for (const [k, n] of tabs) { const b = el("button", ui.home === k ? "on" : null, n); b.type = "button"; b.onclick = () => { ui.home = k; render(); }; tb.appendChild(b); }
    root.appendChild(tb);
    if (ui.home === "tpl") return homeTpl();
    if (ui.home === "tags") return homeTags();
    if (ui.home === "idea") return homeIdea();
    homePlans();
  }
  function homePlans() {
    const bar = el("div", "ss-bar"); bar.style.marginTop = "0";
    bar.append(el("span", "muted", "90-dagers release-plan per låt, fra 30 dager før release til 8 uker etter."), el("span", "spacer"));
    bar.lastChild.style.flex = "1";
    const nb = el("button", "btn primary sm", "+ Ny plan"); nb.type = "button"; nb.onclick = () => openPlan(null); bar.appendChild(nb);
    root.appendChild(bar);
    const list = camps().filter(c => ui.showArch || !c.archived);
    const lh = el("div", "ph"); lh.style.cssText = "display:flex;align-items:center;gap:10px;margin:4px 0 10px"; lh.append(el("h2", null, "Låter med plan"), el("span", "spacer"));
    const al = el("label", "check"); al.style.fontSize = "13px"; const ac = el("input"); ac.type = "checkbox"; ac.checked = ui.showArch; ac.onchange = () => { ui.showArch = ac.checked; render(); }; al.append(ac, document.createTextNode(" Vis arkiverte")); lh.appendChild(al);
    root.appendChild(lh);
    if (list.length) { const pk = planPicker(list, null, (id) => openCamp(id)); pk.classList.add("grid"); root.appendChild(pk); }
    else root.appendChild(el("div", "empty", "Ingen planer ennå. Trykk «+ Ny plan», eller «+ SoMe-plan» på en låt."));
    const wkP = el("div", "panel"); wkP.style.marginTop = "6px"; const wh = el("div", "ph"); wh.append(el("h2", null, "Denne uken"), el("span", "spacer"), seg([["", "Alle"], ["artist", "Artist"], ["studio", "Studio"], ["label", "Label"]], ui.wkOwner, (v) => { ui.wkOwner = v; render(); })); wkP.appendChild(wh);
    const wk = el("div"); wkP.appendChild(wk); root.appendChild(wkP);
    const td = S.today(), items = [];
    for (const c of camps().filter(c => !c.archived)) for (const t of c.tasks) {
      if (t.done || (ui.wkOwner && t.owner !== ui.wkOwner)) continue;
      const s = S.taskStart(c, t), e = S.taskEnd(c, t);
      if (e < S.addDays(td, -14) || s > S.addDays(td, 7)) continue;
      items.push({ c, t, kd: e < td ? e : s < td ? td : s });
    }
    items.sort((a, b) => a.kd - b.kd || a.t.sort - b.t.sort);
    let last = "";
    for (const it of items) {
      const k = S.ymd(it.kd); if (k !== last) { last = k; const h = el("div", "sday" + (k === S.ymd(td) ? " today" : it.kd < td ? " past" : "")); h.append(el("b", null, (k === S.ymd(td) ? "I dag · " : it.kd < td ? "Forsinket · " : "") + S.dShort(it.kd)), el("span")); wk.appendChild(h); }
      const r = S.taskRow(it.c, it.t, { onToggle: toggle, onTask: (t) => openTask(t, it.c) });
      r.querySelector(".m").appendChild(el("div", "ss-tag", "♪ " + (it.c.song || it.c.title))); wk.appendChild(r);
    }
    if (!items.length) wk.appendChild(el("div", "empty", "Ingen åpne oppgaver denne uken."));
  }
  function homeTpl() {
    const bar = el("div", "ss-bar"); bar.style.marginTop = "0";
    const sel = el("select", "ss-flt"); sel.append(opt("", "Alle kanaler"), ...S.CHANNELS.map(k => opt(k.k, k.n))); sel.value = ui.tplChan; sel.onchange = () => { ui.tplChan = sel.value; render(); };
    const sp = el("span", "spacer"); sp.style.flex = "1";
    const nb = el("button", "btn primary sm", "+ Ny mal"); nb.type = "button"; nb.onclick = () => openTpl(null);
    bar.append(sel, sp, nb); root.appendChild(bar);
    const plan = camps().find(c => !c.archived) || null;
    root.appendChild(el("p", "muted", (plan ? "Vist med låttittel og dato fra «" + plan.title + "». " : "") + "Malene er felles for alle artister. [LÅTTITTEL], [ARTIST], [DATO] og [LENKE] fylles inn fra planen; andre felt i klammer fylles inn for hånd."));
    root.lastChild.style.cssText = "font-size:13px;margin:0 0 12px";
    const box = el("div", "tpl-list"); root.appendChild(box);
    const list = KIT.templates.filter(t => !ui.tplChan || t.channel === ui.tplChan);
    list.forEach(t => box.appendChild(S.tplCard(t, plan, { onEdit: openTpl })));
    if (!list.length) box.appendChild(el("div", "empty", "Ingen maler for denne kanalen ennå."));
  }
  function homeTags() {
    root.appendChild(el("p", "muted", "Faste hashtags for artisten. Brukes i oppgavene og vises på artistsiden, der artisten også kan endre dem."));
    root.lastChild.style.cssText = "font-size:13px;margin:0 0 12px";
    const b = el("div"); S.renderTags(b, KIT.hashtags[AID] || {}, { empty: "Ingen hashtags ennå." }); root.appendChild(b);
    const e = el("button", "btn sub", "Endre hashtags"); e.type = "button"; e.style.marginTop = "12px"; e.onclick = () => openTags(AID); root.appendChild(e);
  }
  function homeIdea() {
    const bar = el("div", "ss-bar"); bar.style.marginTop = "0";
    const sp = el("span", "muted", "Felles for alle artister. Arkiverte idéer vises bare her."); sp.style.cssText = "flex:1;font-size:13px";
    const nb = el("button", "btn primary sm", "+ Ny idé"); nb.type = "button"; nb.onclick = () => openIdea(null);
    bar.append(sp, nb); root.appendChild(bar);
    const box = el("div"); root.appendChild(box);
    S.renderIdeas(box, KIT.ideas, { state: ideaState, onEdit: openIdea });
  }
  function campCard(c, onClick) {
    const pr = S.progress(c), late = c.tasks.filter(t => S.taskState(c, t) === "late").length, now = c.tasks.filter(t => S.taskState(c, t) === "now").length;
    const card = el("div", "camp"); card.style.setProperty("--c", c.color || "#D946EF");
    const rel = S.parse(c.release_date), d = S.dayOff(c, S.today());
    card.append(el("b", null, c.title), el("div", "meta", (c.song ? c.song + " · " : "") + "release " + S.dShort(rel) + " " + rel.getFullYear() + " · " + (d < 0 ? (-d) + " dager til release" : d === 0 ? "release i dag!" : "dag " + (d + 1) + " etter release") + (c.archived ? " · arkivert" : "")));
    const bar = el("div", "pbar"); const i = el("i"); i.style.width = pr.pct + "%"; bar.appendChild(i); card.appendChild(bar);
    const f = el("div", "meta", pr.d + " av " + pr.n + " ferdig (" + pr.pct + " %)" + (now ? " · " + now + " i dag" : "") + (late ? " · " + late + " forsinket" : "")); if (late) f.style.color = "#FFB3B3"; card.appendChild(f);
    card.onclick = onClick; return card;
  }

  /* ---------- En plan ---------- */
  function openCamp(id) { cur = D.campaigns.find(c => c.id === id) || null; render(); root.scrollIntoView({ behavior: "smooth", block: "start" }); }
  function renderCamp() {
    const c = cur;
    const back = el("button", "btn ghost sm", "← Alle planer"); back.type = "button"; back.onclick = () => { cur = null; render(); }; back.style.marginBottom = "10px"; root.appendChild(back);
    const head = el("div", "ss-head"); const hl = el("div", "ss-hl");
    const rel = S.parse(c.release_date), d = S.dayOff(c, S.today());
    hl.append(el("div", "big", c.song || c.title), el("div", "muted", [c.song && c.title !== c.song ? c.title : "", "release " + S.dShort(rel) + " " + rel.getFullYear(), d < 0 ? (-d) + " dager igjen" : d === 0 ? "release i dag!" : "dag " + (d + 1)].filter(Boolean).join(" · ")));
    hl.lastChild.style.cssText = "font-size:14px;margin-top:2px";
    const ht = el("button", "btn sub", "# Hashtags"); ht.type = "button"; ht.onclick = () => openTags(c.artist_id);
    const ed = el("button", "btn sub", "Endre plan"); ed.type = "button"; ed.onclick = () => openPlan(c);
    const ad = el("button", "btn", "+ Oppgave"); ad.type = "button"; ad.onclick = () => openTask(null, c);
    head.append(hl, ht, ed, ad); root.appendChild(head);
    const pr = S.progress(c), late = c.tasks.filter(t => S.taskState(c, t) === "late").length, now = c.tasks.filter(t => S.taskState(c, t) === "now").length;
    const stats = el("div", "stats");
    stats.append(...[[pr.pct + " %", "ferdig", pr.d + " av " + pr.n], [now, "i dag", "oppgaver å gjøre"], [late, "forsinket", late ? "bør tas igjen" : "alt i rute"], [c.tasks.filter(t => t.owner === "artist" && !t.done).length, "åpne for artisten", "ser dem på artistsiden"]]
      .map(([v, l, s], i) => { const x = el("div", "stat"); const b = el("b", null, v); if (i === 2 && late) b.style.color = "#FF8A8A"; const sm = el("div", "muted", s); sm.style.cssText = "font-size:11.5px;margin-top:2px"; x.append(b, el("span", null, l), sm); return x; }));
    root.appendChild(stats);
    const bar = el("div", "ss-bar");
    bar.append(seg([["kal", "Kalender"], ["tl", "Tidslinje"], ["list", "Liste"], ["uke", "Denne uken"]], ui.view, (v) => { ui.view = v; render(); }),
      seg([["", "Alle"], ["artist", "Artist"], ["studio", "Studio"], ["label", "Label"]], ui.owner, (v) => { ui.owner = v; render(); }));
    const ch = el("select", "ss-flt"); ch.append(opt("", "Alle kanaler"), ...S.CHANNELS.map(k => opt(k.k, k.n))); ch.value = ui.chan; ch.onchange = () => { ui.chan = ch.value; render(); }; bar.appendChild(ch);
    const dl = el("label", "check"); dl.style.fontSize = "13px"; const dc = el("input"); dc.type = "checkbox"; dc.checked = ui.done; dc.onchange = () => { ui.done = dc.checked; render(); }; dl.append(dc, document.createTextNode(" Vis ferdige")); bar.appendChild(dl);
    root.appendChild(bar);
    const body = el("div"); root.appendChild(body);
    const onTask = (t) => openTask(t, c);
    if (ui.view === "kal") {
      if (!ui.month || ui.monthFor !== c.id) { const td = S.today(); const ref = Math.abs(td - rel) < 70 * 864e5 ? td : rel; ui.month = new Date(ref.getFullYear(), ref.getMonth(), 1); ui.monthFor = c.id; }
      requestAnimationFrame(() => S.renderMonth(body, c, { month: ui.month, owner: ui.owner, channel: ui.chan, showDone: true, onTask, onMonth: (m) => { ui.month = m; } }));
    } else if (ui.view === "tl") S.renderTimeline(body, { ...c, tasks: c.tasks.filter(x => !ui.chan || x.channel === ui.chan) }, { owner: ui.owner, onTask });
    else S.renderList(body, c, { owner: ui.owner, channel: ui.chan, showDone: ui.done, onToggle: toggle, onTask, range: ui.view === "uke" ? "uke" : "" });
    if (c.notes) { const n = el("div", "panel"); n.style.marginTop = "16px"; n.append(el("h3", "sec", "Notater")); const p = el("div", null, c.notes); p.style.whiteSpace = "pre-wrap"; n.appendChild(p); root.appendChild(n); }
  }
  async function toggle(t, val) {
    await rpc("som_set_done", { tid: t.id, val }).catch(e => { toast(e.message, true); throw e; });
    t.done = val; render(); changed();
  }

  /* ---------- Plan-skjema ---------- */
  let editC = null;
  function fillSongs() {
    const aid = AID || $("ss-p-artist").value, songs = D.songs.filter(s => s.artist_id === aid);
    $("ss-p-song").replaceChildren(opt("", "Ingen bestemt låt"), ...songs.map(s => opt(s.id, s.title + (s.release_date ? " (release " + S.dShort(S.parse(s.release_date)) + ")" : ""))));
  }
  function countHint() { const chs = [...$("ss-p-chs").querySelectorAll("input:checked")].map(i => i.value); $("ss-p-count").textContent = "Lager " + S.templateTasks(chs).length + " oppgaver fra 90-dagersplanen (kan endres etterpå)."; }
  function pickSong() { const s = D.songs.find(x => x.id === $("ss-p-song").value); if (s) { if (!$("ss-p-title").value) $("ss-p-title").value = s.title + " – singel"; if (s.release_date && !editC) $("ss-p-date").value = s.release_date; } }
  function openPlan(c, songId) {
    editC = c || null; $("ss-planH").textContent = c ? "Endre plan" : "Ny SoMe-plan"; $("ss-p-save").textContent = c ? "Lagre" : "Lag plan";
    $("ss-p-artist").replaceChildren(...D.artists.map(a => opt(a.id, a.name)));
    $("ss-artWrap").classList.toggle("hidden", !!AID);
    $("ss-p-artist").disabled = !!c; $("ss-p-artist").value = c ? c.artist_id : (AID || D.artists[0]?.id || "");
    fillSongs(); $("ss-p-song").value = c ? (c.song_id || "") : (songId || "");
    $("ss-p-title").value = c ? c.title : ""; $("ss-p-date").value = c ? c.release_date : ""; $("ss-p-notes").value = c ? (c.notes || "") : "";
    if (!c && songId) pickSong();
    $("ss-p-dateHint").textContent = c ? "Endrer du datoen, flytter alle oppgavene seg tilsvarende." : "";
    $("ss-chWrap").classList.toggle("hidden", !!c); $("ss-archWrap").classList.toggle("hidden", !c); $("ss-p-arch").checked = c ? !!c.archived : false; $("ss-p-del").classList.toggle("hidden", !c);
    if (!c) { $("ss-p-chs").className = "ss-chs"; $("ss-p-chs").replaceChildren(...S.CHANNELS.filter(k => k.k !== "annet").map(k => { const l = el("label"); const i = el("input"); i.type = "checkbox"; i.value = k.k; i.checked = true; i.onchange = countHint; const d = el("i"); d.style.background = k.c; l.append(i, d, document.createTextNode(k.n)); return l; })); countHint(); }
    openModal("ss-planModal");
  }
  $("ss-p-artist").onchange = fillSongs;
  $("ss-p-song").onchange = pickSong;
  $("ss-planForm").onsubmit = async (e) => {
    e.preventDefault(); const b = $("ss-p-save"); b.disabled = true;
    try {
      const c = { artist_id: AID || $("ss-p-artist").value, song_id: $("ss-p-song").value, title: $("ss-p-title").value.trim(), release_date: $("ss-p-date").value, notes: $("ss-p-notes").value.trim() };
      if (editC) { await rpc("som_update_campaign", { cid: editC.id, c: { ...c, archived: $("ss-p-arch").checked } }); toast("Planen er lagret"); closeModals(); await load(); }
      else {
        const chs = [...$("ss-p-chs").querySelectorAll("input:checked")].map(i => i.value);
        const id = await rpc("som_create", { c: { ...c, channels: chs }, tasks: S.templateTasks(chs) });
        toast("Planen er laget"); closeModals(); cur = { id }; await load();
      }
    } catch (err) { toast(err.message, true); }
    b.disabled = false;
  };
  armDelete($("ss-p-del"), async () => { await rpc("som_delete_campaign", { cid: editC.id }); toast("Planen er slettet"); closeModals(); cur = null; await load(); });

  /* ---------- Oppgave ---------- */
  $("ss-t-chan").replaceChildren(...S.CHANNELS.map(k => opt(k.k, k.n)));
  let editT = null, tCamp = null;
  function drawKit() { S.renderTaskKit($("ss-t-kit"), tCamp, $("ss-t-chan").value, kitFor(), { tagsEmpty: "Ingen hashtags for artisten ennå – legg dem inn med «# Hashtags»." }); }
  function startHint() { const d = S.parse($("ss-t-start").value); $("ss-t-startHint").textContent = d ? S.offLabel(S.dayOff(tCamp, d)) : ""; }
  function openTask(t, c) {
    editT = t || null; tCamp = c; const rel = S.parse(c.release_date);
    $("ss-taskH").textContent = t ? "Endre oppgave" : "Ny oppgave";
    $("ss-t-title").value = t ? t.title : ""; $("ss-t-chan").value = t ? t.channel : "instagram"; $("ss-t-owner").value = t ? t.owner : "artist";
    $("ss-t-start").value = S.ymd(S.addDays(rel, t ? t.start_off : Math.max(S.dayOff(c, S.today()), -30)));
    $("ss-t-end").value = t && t.end_off != null ? S.ymd(S.addDays(rel, t.end_off)) : "";
    $("ss-t-note").value = t ? (t.note || "") : ""; $("ss-t-link").value = t ? (t.link || "") : ""; $("ss-t-done").checked = t ? t.done : false;
    $("ss-t-del").classList.toggle("hidden", !t); startHint(); drawKit(); openModal("ss-taskModal");
  }
  $("ss-t-start").oninput = startHint;
  $("ss-t-chan").onchange = () => { if (!editT) $("ss-t-owner").value = S.ch($("ss-t-chan").value).owner; drawKit(); };
  $("ss-taskForm").onsubmit = async (e) => {
    e.preventDefault();
    const s = S.parse($("ss-t-start").value), en = S.parse($("ss-t-end").value);
    if (!s) { toast("Velg dato", true); return; }
    const so = S.dayOff(tCamp, s), eo = en ? S.dayOff(tCamp, en) : null;
    if (eo != null && eo < so) { toast("Til-datoen må være etter startdatoen", true); return; }
    try {
      await rpc("som_save_task", { t: { id: editT?.id || "", campaign_id: tCamp.id, title: $("ss-t-title").value.trim(), channel: $("ss-t-chan").value, owner: $("ss-t-owner").value, start_off: so, end_off: eo === so ? "" : eo ?? "", note: $("ss-t-note").value.trim(), link: $("ss-t-link").value.trim() } });
      if (editT && $("ss-t-done").checked !== editT.done) await rpc("som_set_done", { tid: editT.id, val: $("ss-t-done").checked });
      toast("Lagret"); closeModals(); await load();
    } catch (err) { toast(err.message, true); }
  };
  armDelete($("ss-t-del"), async () => { await rpc("som_delete_task", { tid: editT.id }); toast("Oppgaven er slettet"); closeModals(); await load(); });

  /* ---------- Hashtags ---------- */
  let tagAid = null;
  function openTags(aid) {
    tagAid = aid; const h = KIT.hashtags[aid] || {}, a = D.artists.find(x => x.id === aid);
    $("ss-tagH").textContent = "Hashtags · " + (a ? a.name : "artist");
    for (const [k] of S.HT_SETS) $("ss-h-" + k).value = (h[k] || []).join(" ");
    openModal("ss-tagModal");
  }
  $("ss-tagForm").onsubmit = async (e) => {
    e.preventDefault(); const h = {}; for (const [k] of S.HT_SETS) h[k] = splitTags($("ss-h-" + k).value);
    try { await rpc("som_set_hashtags", { aid: tagAid, h }); toast("Hashtags er lagret"); closeModals(); await load(); } catch (err) { toast(err.message, true); }
  };

  /* ---------- Tekstmaler ---------- */
  $("ss-m-chan").replaceChildren(...S.CHANNELS.map(k => opt(k.k, k.n)));
  $("ss-m-cat").replaceChildren(...Object.entries(S.TPL_CATS).map(([k, n]) => opt(k, n)));
  let editTpl = null;
  function openTpl(t) {
    editTpl = t || null; $("ss-tplH").textContent = t ? "Endre tekstmal" : "Ny tekstmal";
    $("ss-m-name").value = t ? t.name : ""; $("ss-m-chan").value = t ? t.channel : (ui.tplChan || "instagram"); $("ss-m-cat").value = t ? t.category : "slipp";
    $("ss-m-content").value = t ? t.content : ""; $("ss-m-del").classList.toggle("hidden", !t); openModal("ss-tplModal");
  }
  $("ss-tplForm").onsubmit = async (e) => {
    e.preventDefault();
    try { await rpc("som_save_template", { t: { id: editTpl?.id || "", name: $("ss-m-name").value.trim(), channel: $("ss-m-chan").value, category: $("ss-m-cat").value, content: $("ss-m-content").value } }); toast("Malen er lagret"); closeModals(); await load(); } catch (err) { toast(err.message, true); }
  };
  armDelete($("ss-m-del"), async () => { await rpc("som_delete_template", { tid: editTpl.id }); toast("Malen er slettet"); closeModals(); await load(); });

  /* ---------- Idébank ---------- */
  $("ss-i-chan").replaceChildren(opt("alle", "Alle kanaler"), ...S.CHANNELS.map(k => opt(k.k, k.n)));
  $("ss-i-cat").replaceChildren(...Object.entries(S.IDEA_CATS).map(([k, v]) => opt(k, v.n)));
  let editIdea = null;
  function openIdea(i) {
    editIdea = i || null; $("ss-ideaH").textContent = i ? "Endre idé" : "Ny idé";
    $("ss-i-title").value = i ? i.title : ""; $("ss-i-what").value = i ? (i.what || "") : ""; $("ss-i-how").value = i ? (i.how || "") : "";
    $("ss-i-chan").value = i ? i.channel : "alle"; $("ss-i-cat").value = i ? i.category : "format"; $("ss-i-heat").value = i ? i.heat : 2;
    $("ss-i-batch").value = i ? (i.batch || "") : ""; $("ss-i-src").value = i ? (i.source || "") : ""; $("ss-i-arch").checked = i ? !!i.archived : false;
    $("ss-i-del").classList.toggle("hidden", !i); openModal("ss-ideaModal");
  }
  $("ss-ideaForm").onsubmit = async (e) => {
    e.preventDefault();
    const i = { id: editIdea?.id || "", title: $("ss-i-title").value.trim(), what: $("ss-i-what").value.trim(), how: $("ss-i-how").value.trim(), channel: $("ss-i-chan").value, category: $("ss-i-cat").value, heat: +$("ss-i-heat").value, batch: $("ss-i-batch").value.trim(), source: $("ss-i-src").value.trim(), archived: $("ss-i-arch").checked };
    try { await rpc("som_save_idea", { i }); toast("Idéen er lagret"); closeModals(); await load(); } catch (err) { toast(err.message, true); }
  };
  armDelete($("ss-i-del"), async () => { await rpc("som_delete_idea", { iid: editIdea.id }); toast("Idéen er slettet"); closeModals(); await load(); });

  return {
    load, campaigns: camps,
    openPlan: (id) => { ui.home = "plan"; openCamp(id); },
    newPlan: (songId) => openPlan(null, songId),
    home: () => { cur = null; render(); },
    isOpen: () => !!cur,
  };
}

/* Kort SoMe-linje til et låtkort (både studio og artistside) */
function songLine(c, opts = {}) {
  const box = el("div", "some-line");
  if (!c) {
    box.append(el("span", "tag some", "SoMe"), el("span", "muted", opts.emptyText || "Ingen plan for sosiale medier ennå"));
    if (opts.onCreate) { const b = el("button", "btn sub sm", "+ SoMe-plan"); b.type = "button"; b.onclick = opts.onCreate; box.appendChild(b); }
    return box;
  }
  const pr = S.progress(c), td = S.today();
  const open = c.tasks.filter(t => !t.done && (!opts.owner || t.owner === opts.owner));
  const late = open.filter(t => S.taskEnd(c, t) < td).length;
  const next = open.filter(t => S.taskEnd(c, t) >= td).sort((a, b) => S.taskStart(c, a) - S.taskStart(c, b))[0];
  const top = el("div", "some-top"); top.append(el("span", "tag some", "SoMe"), el("b", null, pr.pct + " %"), el("span", "muted", "av release-planen ferdig" + (late ? " · " + late + " forsinket" : "")));
  if (late) top.lastChild.style.color = "#FFB3B3";
  const b = el("button", "btn sub sm", opts.openText || "Sosiale medier →"); b.type = "button"; b.onclick = opts.onOpen; top.appendChild(b);
  const bar = el("div", "pbar"); const i = el("i"); i.style.width = pr.pct + "%"; bar.appendChild(i);
  box.append(top, bar);
  if (next) { const s = S.taskStart(c, next), k = S.ch(next.channel); const n = el("div", "some-next"); const chip = el("span", "chip", k.n); chip.style.setProperty("--c", k.c); n.append(el("span", "muted", (s <= td ? "Nå" : "Neste " + S.dShort(s)) + ":"), chip, el("span", null, next.title)); box.appendChild(n); }
  return box;
}

/* Velg hvilken låt/plan som vises */
function planPicker(list, curId, onPick, opts = {}) {
  const row = el("div", "ppick"), td = S.today();
  for (const c of list) {
    const pr = S.progress(c), rel = S.parse(c.release_date), d = S.dayOff(c, td);
    const open = c.tasks.filter(t => !t.done && (!opts.owner || t.owner === opts.owner));
    const late = open.filter(t => S.taskEnd(c, t) < td).length, now = open.filter(t => S.taskState(c, t) === "now").length;
    const next = open.filter(t => S.taskEnd(c, t) >= td).sort((a, b) => S.taskStart(c, a) - S.taskStart(c, b))[0];
    const b = el("button", "ppick-b" + (c.id === curId ? " on" : "")); b.type = "button";
    b.append(el("b", null, c.song || c.title));
    b.appendChild(el("span", null, "Release " + S.dShort(rel) + " " + rel.getFullYear() + " · " + (d < 0 ? (-d) + " dager igjen" : d === 0 ? "i dag!" : "dag " + (d + 1) + " etter")));
    const st = el("div", "pp-st");
    st.append(el("em", null, pr.pct + " % ferdig"), el("em", null, pr.d + "/" + pr.n));
    if (now) st.appendChild(el("em", "now", now + " nå"));
    if (late) st.appendChild(el("em", "late", late + " forsinket"));
    b.appendChild(st);
    if (next) { const k = S.ch(next.channel), s0 = S.taskStart(c, next); const nx = el("div", "pp-nx"); const chip = el("span", "chip", k.n); chip.style.setProperty("--c", k.c); nx.append(el("small", null, (s0 <= td ? "Nå" : S.dShort(s0)) + ":"), chip, el("span", null, next.title)); b.appendChild(nx); }
    else b.appendChild(el("div", "pp-nx", open.length ? "" : "Alt er gjort 🎉"));
    const bar = el("i"); bar.style.width = pr.pct + "%"; b.appendChild(bar);
    b.onclick = () => onPick(c.id); row.appendChild(b);
  }
  requestAnimationFrame(() => { const on = row.querySelector(".on"); if (on && row.scrollWidth > row.clientWidth) row.scrollLeft = on.offsetLeft - row.offsetLeft - 8; });
  return row;
}

window.SOMESTUDIO = { mount, songLine, planPicker };
})();
