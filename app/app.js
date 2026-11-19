// Leonida Trophy Guide — offline checklist, filters, spoiler shield, roadmap and detail panel.
// All state lives in localStorage; progress can be exported to and imported from a JSON file.
'use strict';

var EARNED_KEY = 'leonida-trophy-earned-v1';
var SPOILER_KEY = 'leonida-trophy-spoilers-v1';

var ROADMAP = [
  { stage: 0, title: 'Stage 0 — Setup: saves, cheats off, spoilers set',
    why: 'Before the first mission: turn cheats off for the whole run, because launch reporting via PowerPyx says cheats disable trophies. Make a manual save at the start of every chapter and before the final mission — the game has no mission replay, so those saves are the only way back to a missed moment. Leave the spoiler setting ON here until you have earned the story trophies yourself. Expect about 50–80 hours for the story and 200 hours or more for the platinum.',
    ids: [] },
  { stage: 1, title: 'Stage 1 — Story first',
    why: 'Play the campaign straight through. It unlocks both protagonists from Chapter 2, the partner trophies, the VCIA and Ocean Beach moments, and finally the 100% checklist. Grab the moment trophies (37, 44, 45, 47, 49) and the partner pair (33, 34) as their windows open, meditate on Lucia\u2019s balcony in Chapter 1 for trophy 28, and let the 500 choices for trophy 48 accumulate.',
    ids: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 33, 34, 37, 44, 45, 47, 48, 49] },
  { stage: 2, title: 'Stage 2 — Stranger strands',
    why: 'With the world open, finish the stranger strands end to end: Andy, Kenton, Billy, Randy and Tyrone each end in a final-mission trophy, Bret\u2019s hunt adds Fair Game, and any 8 completed strands earn the Strangers & Freaks silver. Strands are chains, so finish what you start.',
    ids: [22, 23, 24, 25, 26, 27, 29] },
  { stage: 3, title: 'Stage 3 — Activities',
    why: 'Clear the skill and sampler trophies while the map is familiar: 42 Shooting Range golds, 14 Top Fun wins, 20 different race wins, 250 stunts, 50 challenges, one of each of the 9 activity types, Cal\u2019s fishing challenge, one arcade game and the Kolt bowling alley. Short repeatable loops, best done in batches.',
    ids: [15, 16, 17, 18, 19, 20, 21, 32, 46] },
  { stage: 4, title: 'Stage 4 — Collectibles & exploration',
    why: 'Sweep Leonida region by region: all 52 areas, the remaining meditation spots, 3 card sets, 100 WAiNK locations, 100 discovered vehicles and 10 Scooter Bros registrations. One exploration pass feeds all of these counters at once, and it is also your best chance to witness the strange event behind The Truth Is Out There.',
    ids: [28, 30, 31, 35, 42, 50, 55] },
  { stage: 5, title: 'Stage 5 — Crime & money',
    why: 'Now get rich and loud: 5 bank vaults, an armored truck, a stealth jewelry job, one illegal operation per gang (9), 5 takedowns in one Combat Focus, the Rhino encounter, a melee drive-by, $250,000 laundered, $100,000 spent and all 8 garages bought. The money trophies feed each other, so earn first, then spend.',
    ids: [36, 38, 39, 40, 41, 43, 51, 52, 53, 54] },
  { stage: 6, title: 'Stage 6 — Completion',
    why: 'Finish whatever the post-story 100% checklist still shows, claim A Long Road at a full 100%, and Vice Got a Price! — the platinum — unlocks automatically as the 55th trophy. Nothing else remains after this stage.',
    ids: [14, 1] }
];

var trophies = [];
var byId = {};
var earned = new Set();
var spoilersOn = true;
var activeKind = 'all';
var selectedId = null;

try { earned = new Set(JSON.parse(localStorage.getItem(EARNED_KEY) || '[]')); } catch (e) { earned = new Set(); }
spoilersOn = localStorage.getItem(SPOILER_KEY) !== 'off';

function el(id) { return document.getElementById(id); }

function saveEarned() { localStorage.setItem(EARNED_KEY, JSON.stringify(Array.from(earned))); }

function isMasked(t) { return spoilersOn && t.kind === 'story' && !earned.has(t.id); }

function displayName(t) { return isMasked(t) ? 'Hidden trophy' : t.name; }
function displayDesc(t) { return isMasked(t) ? 'Story trophy — name and description stay hidden until you earn it, or turn spoilers OFF above.' : t.description; }

function gradeCounts() {
  var grades = ['platinum', 'gold', 'silver', 'bronze'];
  return grades.map(function (g) {
    var total = trophies.filter(function (t) { return t.grade === g; }).length;
    var got = trophies.filter(function (t) { return t.grade === g && earned.has(t.id); }).length;
    return got + '/' + total + ' ' + g;
  }).join(' · ');
}

function renderProgress() {
  el('progress-text').textContent = earned.size + ' of ' + trophies.length + ' earned (' + Math.round(earned.size / trophies.length * 100) + '%)';
  el('progress-bar').style.width = (earned.size / trophies.length * 100) + '%';
  el('grade-counts').textContent = gradeCounts();
}

function currentFilters() {
  return {
    q: el('search').value.trim().toLowerCase(),
    grade: el('grade-filter').value,
    missable: el('missable-only').checked,
    status: el('status-filter').value
  };
}

function passes(t, f) {
  if (activeKind !== 'all' && t.kind !== activeKind) return false;
  if (f.grade !== 'all' && t.grade !== f.grade) return false;
  if (f.missable && !t.missable) return false;
  if (f.status === 'earned' && !earned.has(t.id)) return false;
  if (f.status === 'remaining' && earned.has(t.id)) return false;
  if (f.q) {
    var hay = (displayName(t) + ' ' + displayDesc(t) + ' ' + t.kind + ' stage ' + t.stage).toLowerCase();
    if (hay.indexOf(f.q) === -1) return false;
  }
  return true;
}

function chip(text, cls) {
  var s = document.createElement('span');
  s.className = cls; s.textContent = text; return s;
}

function renderList() {
  var f = currentFilters();
  var list = el('trophy-list');
  list.replaceChildren();
  var shown = 0;
  trophies.forEach(function (t) {
    if (!passes(t, f)) return;
    shown++;
    var li = document.createElement('li');
    li.className = 'trophy' + (earned.has(t.id) ? ' earned' : '');
    li.id = 'row-' + t.id;
    li.tabIndex = 0;
    li.setAttribute('role', 'button');
    li.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); selectTrophy(t.id, true); }
    });
    var box = document.createElement('input');
    box.type = 'checkbox'; box.checked = earned.has(t.id);
    box.setAttribute('aria-label', 'Mark ' + t.name + ' as earned');
    box.addEventListener('click', function (ev) { ev.stopPropagation(); });
    box.addEventListener('change', function () {
      if (box.checked) earned.add(t.id); else earned.delete(t.id);
      saveEarned(); renderAll();
      if (selectedId === t.id) renderDetail();
    });
    var main = document.createElement('div'); main.className = 'trophy-main';
    var name = document.createElement('div'); name.className = 'trophy-name'; name.textContent = displayName(t);
    var desc = document.createElement('div'); desc.className = 'trophy-desc'; desc.textContent = displayDesc(t);
    var meta = document.createElement('div'); meta.className = 'trophy-meta';
    meta.appendChild(chip(t.grade, 'grade-chip grade-' + t.grade));
    meta.appendChild(chip(t.kind, 'kind-chip'));
    meta.appendChild(chip('Stage ' + t.stage, 'stage-chip'));
    if (t.count !== null && t.count !== undefined) meta.appendChild(chip('Target: ' + t.count + (t.id === 14 ? '%' : (t.id === 52 || t.id === 53 ? ' dollars' : '')), 'count-chip'));
    if (t.hidden) meta.appendChild(chip('Hidden on PSN', 'hidden-note'));
    if (t.missable) meta.appendChild(chip('\u26A0 MISSABLE', 'missable-badge'));
    main.appendChild(name); main.appendChild(desc); main.appendChild(meta);
    li.appendChild(box); li.appendChild(main);
    li.addEventListener('click', function () { selectTrophy(t.id, true); });
    list.appendChild(li);
  });
  el('empty-note').hidden = shown !== 0;
  var earnedShown = trophies.filter(function (t) { return passes(t, f) && earned.has(t.id); }).length;
  el('showing').textContent = 'Showing ' + shown + ' of ' + trophies.length + ' trophies (' + earnedShown + ' earned in this view)' + (f.missable ? ' — missable filter ON' : '') + (spoilersOn ? ' — spoilers ON' : ' — spoilers OFF');
}

function renderDetail() {
  var panel = el('detail');
  var t = byId[selectedId];
  if (!t) return;
  panel.replaceChildren();
  var h = document.createElement('h3'); h.textContent = displayName(t);
  var d = document.createElement('p'); d.className = 'd-desc'; d.textContent = '"' + displayDesc(t) + '"';
  panel.appendChild(h); panel.appendChild(d);
  var meta = document.createElement('div'); meta.className = 'trophy-meta';
  meta.appendChild(chip(t.grade, 'grade-chip grade-' + t.grade));
  meta.appendChild(chip(t.kind, 'kind-chip'));
  meta.appendChild(chip('Stage ' + t.stage + ' — Roadmap', 'stage-chip'));
  if (t.missable) meta.appendChild(chip('\u26A0 MISSABLE', 'missable-badge'));
  panel.appendChild(meta);
  if (t.count !== null && t.count !== undefined) {
    var c = document.createElement('p'); c.className = 'd-count';
    c.textContent = 'Count target: ' + t.count + (t.id === 14 ? ' percent completion' : (t.id === 52 || t.id === 53 ? ' dollars' : ''));
    panel.appendChild(c);
  }
  if (t.missable && t.missableNote) {
    var w = document.createElement('p'); w.className = 'd-warn'; w.textContent = '\u26A0 ' + t.missableNote;
    panel.appendChild(w);
  }
  var gh = document.createElement('h4'); gh.textContent = 'GUIDE — IN OUR OWN WORDS';
  var g = document.createElement('p'); g.className = 'd-guide';
  g.textContent = isMasked(t) ? 'This is a story trophy and spoilers are ON, so its guide stays covered until you earn it. Mark it earned in the checklist, or turn spoilers OFF at the top, to read the full guide.' : t.guide;
  panel.appendChild(gh); panel.appendChild(g);
  var sh = document.createElement('h4'); sh.textContent = 'SOURCES';
  var ul = document.createElement('ul');
  (t.sources || []).forEach(function (s) {
    var li = document.createElement('li');
    var a = document.createElement('a'); a.href = s.url; a.textContent = s.label; a.target = '_blank'; a.rel = 'noopener';
    li.appendChild(a); ul.appendChild(li);
  });
  panel.appendChild(sh); panel.appendChild(ul);
  var back = document.createElement('p');
  var bl = document.createElement('a'); bl.href = '#/list'; bl.textContent = 'Back to the checklist'; bl.style.color = '#7de8ff';
  back.appendChild(bl); panel.appendChild(back);
}

function renderRoadmap() {
  var wrap = el('roadmap-stages');
  wrap.replaceChildren();
  ROADMAP.forEach(function (s) {
    var div = document.createElement('div'); div.className = 'stage';
    var h = document.createElement('h3'); h.textContent = s.title;
    var p = document.createElement('p'); p.textContent = s.why;
    div.appendChild(h); div.appendChild(p);
    if (s.ids.length) {
      var ul = document.createElement('ul');
      s.ids.forEach(function (id) {
        var t = byId[id]; if (!t) return;
        var li = document.createElement('li');
        var a = document.createElement('a'); a.href = '#/trophy/' + id; a.textContent = displayName(t);
        li.appendChild(a);
        li.appendChild(document.createTextNode(' — ' + t.grade + (t.missable ? ' — \u26A0 MISSABLE' : '') + (earned.has(id) ? ' — earned \u2713' : '')));
        ul.appendChild(li);
      });
      div.appendChild(ul);
    }
    wrap.appendChild(div);
  });
}

function renderAll() { renderProgress(); renderList(); renderRoadmap(); }

function selectTrophy(id, pushHash) {
  selectedId = id;
  renderDetail();
  if (pushHash && location.hash !== '#/trophy/' + id) location.hash = '#/trophy/' + id;
  el('detail').scrollIntoView({ block: 'nearest' });
}

function applyHash() {
  var hash = location.hash || '#/list';
  if (hash.indexOf('#/trophy/') === 0) {
    var id = parseInt(hash.slice('#/trophy/'.length), 10);
    if (byId[id]) {
      // Focus view: slim hero so the open guide fits on one screen, no scrolling.
      document.body.className = 'view-trophy';
      selectedId = id; renderDetail(); renderList();
      window.scrollTo(0, 0);
      return;
    }
  }
  if (hash === '#/roadmap') {
    // Roadmap view: the roadmap takes the page, checklist tucked away.
    document.body.className = 'view-roadmap';
    window.scrollTo(0, 0);
    return;
  }
  if (hash.indexOf('#/list') === 0) {
    document.body.className = '';
    var q = hash.split('?')[1] || '';
    var params = new URLSearchParams(q);
    if (params.get('filter') === 'missable') el('missable-only').checked = true;
    if (params.get('spoilers') === 'off') setSpoilers(false);
    if (params.get('spoilers') === 'on') setSpoilers(true);
    renderList();
    window.scrollTo(0, 0);
  }
}

function setSpoilers(on) {
  spoilersOn = on;
  localStorage.setItem(SPOILER_KEY, on ? 'on' : 'off');
  el('spoiler-select').value = on ? 'on' : 'off';
}

function wireControls() {
  el('search').addEventListener('input', renderList);
  el('grade-filter').addEventListener('change', renderList);
  el('missable-only').addEventListener('change', renderList);
  el('status-filter').addEventListener('change', renderList);
  el('spoiler-select').addEventListener('change', function () {
    setSpoilers(el('spoiler-select').value === 'on');
    renderAll(); if (selectedId) renderDetail();
  });
  Array.prototype.forEach.call(el('kind-chips').querySelectorAll('.chip'), function (b) {
    b.addEventListener('click', function () {
      activeKind = b.getAttribute('data-kind');
      Array.prototype.forEach.call(el('kind-chips').querySelectorAll('.chip'), function (x) { x.classList.toggle('active', x === b); });
      renderList();
    });
  });
  el('export-btn').addEventListener('click', function () {
    var payload = JSON.stringify({ game: 'Grand Theft Auto VI', earnedIds: Array.from(earned), exportedFrom: 'Leonida Trophy Guide' }, null, 2);
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
    a.download = 'leonida-trophy-progress.json'; a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
  });
  el('import-input').addEventListener('change', function (ev) {
    var file = ev.target.files[0]; if (!file) return;
    file.text().then(function (text) {
      var data = JSON.parse(text);
      var ids = Array.isArray(data) ? data : (data.earnedIds || data.earned || []);
      earned = new Set(ids.filter(function (x) { return byId[x]; }).map(Number));
      // Also accept the starter format: an array of trophy names.
      if (Array.isArray(data)) {
        trophies.forEach(function (t) { if (data.indexOf(t.name) !== -1) earned.add(t.id); });
      }
      saveEarned(); renderAll(); if (selectedId) renderDetail();
    }).catch(function () { el('showing').textContent = 'Import failed: that file is not valid progress JSON.'; });
  });
  window.addEventListener('hashchange', applyHash);
}

fetch('data/trophies.json').then(function (r) { return r.json(); }).then(function (doc) {
  trophies = doc.trophies;
  trophies.forEach(function (t) { byId[t.id] = t; });
  el('spoiler-select').value = spoilersOn ? 'on' : 'off';
  wireControls();
  renderAll();
  applyHash();
  if (!selectedId) { selectedId = 17; renderDetail(); }
});
