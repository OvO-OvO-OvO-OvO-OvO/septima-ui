/* septima-ui v4 — 셉티마 상태창·배틀창. <StatusWindow …/> <BattleField …/> 태그 글을 읽어 화면을 그린다.
   그림: septima-assets 저장소 (c/{인물}_1.webp, mon/M###.webp, place/P###.webp, card/back.webp, icon/*.webp). 그림이 없으면 글만 그린다. */
(function () {
  "use strict";

  var ASSET = (typeof window !== "undefined" && window.SEPTIMA_ASSETS) || "https://cdn.jsdelivr.net/gh/OvO-OvO-OvO-OvO-OvO/septima-assets@main/";
  var MAPS = /*MAPS*/{};
  var FONT = 'system-ui,-apple-system,"Segoe UI","Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",sans-serif';
  var C = {
    bg: "#14141c", panel: "#1b1b26", line: "rgba(255,255,255,0.09)", text: "#ececf2", muted: "#9a9aa8",
    mp: "#6c8cff", sp: "#c07cff", hp: "#ff6b6b", ok: "#5fd38d", warn: "#f0b54a", gold: "#e8c27a",
    slot: "rgba(255,255,255,0.04)", ink: "#0d1a12"
  };
  var ATTRC = { "화": "#ff7a45", "수": "#4fa3ff", "풍": "#5fd3a8", "지": "#c79a5b", "광": "#f5d76e", "암": "#9b7bd8", "무": "#b8bcc8" };
  var GRADE = { N: { c: "#9aa0a6", w: "600" }, R: { c: "#c3c7d2", w: "600" }, SR: { c: "#e3e6ee", w: "700" }, SSR: { c: "#ffffff", w: "800" } };
  var FOLD_KEY = "septima-ui-fold";
  var NS = "http://www.w3.org/2000/svg";

  var CSS = [
    ".sp-box *{box-sizing:border-box}",
    ".sp-box summary{list-style:none;cursor:pointer;outline:none}",
    ".sp-box summary::-webkit-details-marker{display:none}",
    ".sp-box summary::marker{content:''}",
    ".sp-box summary:focus-visible{outline:1px solid rgba(255,255,255,.4);outline-offset:1px;border-radius:3px}",
    ".sp-sum:hover{background:rgba(255,255,255,.04)}",
    ".sp-arw{display:inline-block;width:6px;height:6px;border-right:1.5px solid #9a9aa8;border-bottom:1.5px solid #9a9aa8;transform:rotate(-45deg);transition:transform .15s;flex-shrink:0;margin:0 3px 0 2px}",
    ".sp-box details[open]>summary .sp-arw{transform:rotate(45deg)}",
    ".sp-gc{display:grid;gap:6px;align-items:start;grid-template-columns:repeat(auto-fill,minmax(min(100%,224px),1fr))}",
    ".sp-gm{display:grid;gap:6px;align-items:start;grid-template-columns:repeat(auto-fill,minmax(min(100%,120px),1fr))}",
    ".sp-ell{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}",
    ".sp-num{font-variant-numeric:tabular-nums}"
  ].join("\n");

  /* ---------- 바탕 도구 ---------- */
  function list(s) { return String(s == null ? "" : s).split(";").map(function (x) { return x.trim(); }).filter(Boolean); }
  function num(v) { var n = Number(String(v == null ? "" : v).replace(/[^\d.-]/g, "")); return isNaN(n) ? 0 : n; }
  function has(v) { return v != null && v !== ""; }
  function trim(x) { return String(x).trim(); }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function tint(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }

  function h(tag, style, kids, attrs) {
    var el = document.createElement(tag);
    if (style) for (var k in style) el.style[k] = style[k];
    if (attrs) for (var a in attrs) el.setAttribute(a, attrs[a]);
    (kids || []).forEach(function (c) {
      if (c == null || c === false) return;
      el.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    });
    return el;
  }
  function S(fn) { try { return fn(); } catch (e) { return null; } }

  /* 접힘 기억: 저장소가 막혀도 오류 없이 기본값으로 */
  function foldGet(id, def) {
    try {
      var s = window.localStorage.getItem(FOLD_KEY);
      if (s) { var o = JSON.parse(s); if (o && typeof o[id] === "boolean") return o[id]; }
    } catch (e) { }
    return def;
  }
  function foldSet(id, val) {
    try {
      var o = {}, s = window.localStorage.getItem(FOLD_KEY);
      if (s) o = JSON.parse(s) || {};
      o[id] = val;
      window.localStorage.setItem(FOLD_KEY, JSON.stringify(o));
    } catch (e) { }
  }

  /* ---------- 그림 찾기 (정확 일치 → 통째로 들어 있음 → 별칭, 없으면 그림 없음) ---------- */
  var IDX = {};
  function norm(s) { return String(s == null ? "" : s).replace(/\s*[\(（][^\)）]*[\)）]/g, "").replace(/\s+/g, " ").trim(); }
  function index(kind) {
    if (IDX[kind]) return IDX[kind];
    var m = MAPS[kind] || {}, o = {}, names = [], k, n, parts, i;
    for (k in m) {
      n = norm(k);
      if (!n) continue;
      if (!o[n]) { o[n] = m[k]; names.push(n); }
      if (kind === "places" && /[과와] /.test(n)) {
        parts = n.split(/[과와] /);
        for (i = 0; i < parts.length; i++) {
          parts[i] = parts[i].trim();
          if (parts[i].length >= 2 && !o[parts[i]]) { o[parts[i]] = m[k]; names.push(parts[i]); }
        }
      }
    }
    names.sort(function (a, b) { return b.length - a.length; });
    IDX[kind] = { map: o, names: names };
    return IDX[kind];
  }
  function within(kind, text) {
    var ix = index(kind), i;
    if (ix.map[text]) return ix.map[text];
    for (i = 0; i < ix.names.length; i++) if (ix.names[i].length >= 2 && text.indexOf(ix.names[i]) >= 0) return ix.map[ix.names[i]];
    return null;
  }
  var PLACE_ALIAS = [["본관", "중앙 본관"], ["로비", "중앙 본관"], ["강의실", "강의동"], ["교실", "강의동"], ["기숙사", "기숙사 지구"]];
  function placeArt(name) {
    var t = norm(name), c, ix, i;
    if (!t) return null;
    c = within("places", t);
    if (!c) {
      ix = index("places");
      for (i = 0; i < PLACE_ALIAS.length; i++) if (t.indexOf(PLACE_ALIAS[i][0]) >= 0 && ix.map[PLACE_ALIAS[i][1]]) { c = ix.map[PLACE_ALIAS[i][1]]; break; }
    }
    return c ? "place/" + c + ".webp" : null;
  }
  function monArt(name) {
    var t = norm(name).replace(/\s*[x×X]\s*\d+$/, "").trim(), c;
    if (!t) return null;
    c = within("monsters", t);
    return c ? "mon/" + c + ".webp" : null;
  }
  function personCode(name) {
    var t = norm(name), m = index("people").map, k, best = null, bl = 0;
    if (!t) return null;
    if (m[t]) return m[t];
    for (k in m) if (k.length > 1 && t.indexOf(k + " ") === 0 && k.length > bl) { best = m[k]; bl = k.length; }
    return best;
  }
  function face(name) { var s = personCode(name); return s ? "c/" + s + "_1.webp" : null; }

  /* ---------- 그림 칸 ---------- */
  /* 고정 크기 칸. mode: crop(머리 부분 확대) · cover · fill. 불러오기 실패하면 칸째 숨긴다 */
  function Pic(path, w, hh, mode) {
    if (!path) return null;
    var box = h("div", { width: w + "px", height: hh + "px", borderRadius: "3px", overflow: "hidden", flexShrink: "0", background: "rgba(255,255,255,.06)", position: "relative" });
    var st = mode === "crop" ? { display: "block", width: "280%", maxWidth: "none", marginLeft: "-90%", marginTop: "0" }
      : mode === "fill" ? { display: "block", width: "100%", height: "100%" }
      : { display: "block", width: "100%", height: "100%", objectFit: "cover" };
    var el = h("img", st, null, { src: ASSET + path, alt: "", loading: "lazy" });
    el.onerror = function () { box.style.display = "none"; };
    box.appendChild(el);
    return box;
  }
  /* 작은 아이콘 그림. 없으면 보이지 않는다 */
  function Icon(path, size, title) {
    var el = h("img", { display: "none", width: size + "px", height: size + "px", objectFit: "contain", flexShrink: "0" }, null, { src: ASSET + path, alt: "" });
    if (title) el.setAttribute("title", title);
    el.onload = function () { el.style.display = "inline-block"; };
    el.onerror = function () { el.style.display = "none"; };
    return el;
  }

  /* ---------- SVG 아이콘 (코드에 그림) ---------- */
  var ATTRP = {
    "화": "M12 2c1 4 6 6.5 6 12a6 6 0 0 1-12 0c0-3 1.6-4.8 3-6 .2 2 1 3.2 2.2 3.8C11 9 10.6 5.6 12 2z",
    "수": "M12 2.5C9 7 5.5 10.6 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10.6 15 7 12 2.5z",
    "풍": "M3 8.5h11a3 3 0 1 0-3-3M3 12.5h15a3 3 0 1 1-3 3M3 16.5h7",
    "지": "M2 20 9 7l4 6 2.5-3.5L22 20z",
    "광": "M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zM12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1",
    "암": "M15.5 3a9 9 0 1 0 5.5 13.6A7.5 7.5 0 0 1 15.5 3z",
    "무": "M12 4.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15z"
  };
  var ATTRLINE = { "풍": 1, "광": 1, "무": 1 };
  function svgBase(size, color) {
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", size); svg.setAttribute("height", size);
    svg.style.flexShrink = "0"; svg.style.verticalAlign = "-2px"; svg.style.color = color;
    return svg;
  }
  function svgPart(svg, tag, attrs) {
    var el = document.createElementNS(NS, tag);
    for (var a in attrs) el.setAttribute(a, attrs[a]);
    svg.appendChild(el);
  }
  function attrIcon(attr, size) {
    var d = ATTRP[attr];
    if (!d) return null;
    var c = ATTRC[attr], svg = svgBase(size, c), line = ATTRLINE[attr];
    svgPart(svg, "path", line
      ? { d: d, fill: attr === "광" ? c : "none", stroke: c, "stroke-width": "2", "stroke-linecap": "round" }
      : { d: d, fill: c });
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", attr);
    var t = document.createElementNS(NS, "title"); t.textContent = attr; svg.appendChild(t);
    return svg;
  }
  /* 마력·정신력·HP·쿨 */
  function statIcon(kind, size) {
    var color = kind === "mp" ? C.mp : kind === "sp" ? C.sp : kind === "hp" ? C.hp : C.warn, svg = svgBase(size, color);
    if (kind === "mp") svgPart(svg, "path", { d: "M7 3h10l5 6-10 13L2 9z", fill: "currentColor" });
    else if (kind === "sp") {
      svgPart(svg, "circle", { cx: "12", cy: "12", r: "8.5", fill: "none", stroke: "currentColor", "stroke-width": "2" });
      svgPart(svg, "circle", { cx: "12", cy: "12", r: "3.2", fill: "currentColor" });
    } else if (kind === "hp") svgPart(svg, "path", { d: "M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z", fill: "currentColor" });
    else {
      svgPart(svg, "circle", { cx: "12", cy: "12", r: "9", fill: "none", stroke: "currentColor", "stroke-width": "2" });
      svgPart(svg, "path", { d: "M12 7v5.5l3.5 2", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" });
    }
    return svg;
  }

  /* ---------- 태그 읽기 ---------- */
  var ATTR = /([A-Za-z_][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/g;
  function parseAttrs(s) {
    var o = {}, m;
    ATTR.lastIndex = 0;
    while ((m = ATTR.exec(s))) {
      var v = m[2] != null ? m[2] : m[3] != null ? m[3] : m[4];
      o[m[1]] = String(v).replace(/^\s*["']|["']\s*$/g, "");
    }
    return o;
  }
  /* 따옴표·중괄호 안의 '>' 는 건너뛰고 태그가 닫히는 '>' 를 찾는다 */
  function tagEnd(text, from) {
    var q = null, depth = 0, i, ch;
    for (i = from; i < text.length; i++) {
      ch = text.charAt(i);
      if (q) { if (ch === q) q = null; continue; }
      if (ch === '"' || ch === "'") { q = ch; continue; }
      if (depth > 0) { if (ch === "{") depth++; else if (ch === "}") depth--; continue; }
      if (ch === "{") depth = 1;
      else if (ch === ">") return i;
    }
    return -1;
  }
  function parseTags(text) {
    var out = [], re = /<\s*(StatusWindow|BattleField)\b/g, m, end, body, from;
    text = String(text == null ? "" : text);
    while ((m = re.exec(text))) {
      from = re.lastIndex;
      end = tagEnd(text, from);
      if (end < 0) { end = text.indexOf(">", from); if (end < 0) end = text.length - 1; }
      body = text.slice(from, end).replace(/\/\s*$/, "");
      out.push({ type: m[1], props: parseAttrs(body), raw: text.slice(m.index, end + 1) });
      re.lastIndex = end + 1;
    }
    return out;
  }
  function getter(p) {
    var low = {};
    for (var k in p) low[k.toLowerCase()] = p[k];
    return function (key, def) { var v = low[key.toLowerCase()]; return v == null || v === "" ? def : v; };
  }

  /* ---------- 공통 조각 ---------- */
  function Box(kids) {
    return h("div", {
      background: C.bg, color: C.text, border: "1px solid " + C.line, borderRadius: "10px", overflow: "hidden",
      maxWidth: "560px", boxSizing: "border-box", fontFamily: FONT, lineHeight: "1.45", fontSize: "12px",
      marginBottom: "8px", wordBreak: "keep-all", overflowWrap: "anywhere"
    }, kids, { "class": "sp-box" });
  }
  function Pad(kids) { return h("div", { padding: "10px 12px 12px" }, kids); }
  function Lab(t, extra) {
    var st = { fontSize: "11px", color: C.muted, flexShrink: "0" };
    if (extra) for (var k in extra) st[k] = extra[k];
    return h("span", st, [t]);
  }
  function Line(kids) { return h("div", { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginTop: "6px", fontSize: "12px" }, kids); }
  function Dot(color) { return h("span", { display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: "0" }); }
  function Arrow() { return h("span", null, null, { "class": "sp-arw" }); }
  function Badge(text, fg, bg) {
    return h("span", {
      fontSize: "11px", fontWeight: "600", padding: "1px 7px", borderRadius: "3px", color: fg, background: bg,
      whiteSpace: "nowrap", flexShrink: "0"
    }, [text]);
  }
  function Bar(label, kind, value, max, color, minW) {
    var cur = num(value), mx = has(max) ? num(max) : cur, pct = mx > 0 ? clamp(cur / mx * 100, 0, 100) : 0;
    return h("div", { flex: "1", minWidth: (minW || 130) + "px" }, [
      h("div", { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px", fontSize: "12px" }, [
        h("span", { display: "inline-flex", alignItems: "center", gap: "4px", color: C.muted }, [statIcon(kind, 12), label]),
        h("span", { color: C.text }, [cur + " / " + mx], { "class": "sp-num" })
      ]),
      h("div", { height: "6px", background: C.line, borderRadius: "3px", marginTop: "3px", overflow: "hidden" }, [
        h("div", { width: pct + "%", height: "6px", background: color, borderRadius: "3px" })
      ])
    ]);
  }

  /* 접는 칸: 머리(항상 보임) + 안쪽. 열림 상태는 저장소가 되면 기억한다 */
  function Fold(id, head, body, def) {
    var open = foldGet(id, def), last = open;
    var d = h("details", { borderTop: "1px solid " + C.line, marginTop: "8px" }, [
      h("summary", null, [
        h("div", { display: "flex", alignItems: "center", gap: "8px", padding: "7px 2px 6px", fontSize: "12px", color: C.muted, minHeight: "32px" }, head.concat([Arrow()]))
      ], { "class": "sp-sum" }),
      h("div", { paddingTop: "4px" }, body)
    ]);
    if (open) d.setAttribute("open", "");
    d.addEventListener("toggle", function () { if (d.open === last) return; last = d.open; foldSet(id, d.open); });
    return d;
  }
  function Static(head) {
    return h("div", { borderTop: "1px solid " + C.line, marginTop: "8px" }, [
      h("div", { display: "flex", alignItems: "center", gap: "8px", padding: "7px 2px 6px", fontSize: "12px", color: C.muted, minHeight: "32px" }, head)
    ]);
  }
  function Val(t) { return h("span", { color: C.text }, [t]); }

  /* 반·관·랭크·실링 그림 (아직 없으면 글만) */
  var DORM = { "이그니스관": "south", "엘드리온관": "east", "사르카관": "west", "노아관": "north" };
  var RANK = { "철": "iron", "동": "bronze", "은": "silver", "금": "gold", "백금": "platinum" };
  function iconsFor(text, kinds) {
    var out = [], t = String(text || ""), m, k;
    if (kinds.indexOf("class") >= 0 && (m = t.match(/(^|[^A-Za-z])([SABCDE])\s*반/))) out.push(["icon/class_" + m[2] + ".webp", m[2] + "반"]);
    if (kinds.indexOf("dorm") >= 0) for (k in DORM) if (t.indexOf(k) >= 0) { out.push(["icon/dorm_" + DORM[k] + ".webp", k]); break; }
    if (kinds.indexOf("rank") >= 0 && (m = t.match(/(백금|철|동|은|금)급(?!생)/))) out.push(["icon/rank_" + RANK[m[1]] + ".webp", m[0]]);
    return out;
  }
  function Tagged(text, kinds, tail) {
    var ic = iconsFor(text, kinds).map(function (x) { return Icon(x[0], 16, x[1]); });
    return h("span", { display: "inline-flex", alignItems: "center", gap: "4px", color: C.text }, ic.concat([text + (tail || "")]));
  }

  /* ---------- 상태창 ---------- */
  function Header(turn, name, date, place) {
    var right = [date, place].filter(Boolean).join(" · "), pic = placeArt(place), bg;
    bg = pic ? Icon(pic, 0) : null;
    if (bg) {
      bg.style.width = "100%"; bg.style.height = "100%"; bg.style.position = "absolute"; bg.style.left = "0"; bg.style.top = "0";
      bg.style.objectFit = "cover"; bg.style.objectPosition = "50% 45%"; bg.style.opacity = ".30";
      bg.onload = function () { bg.style.display = "block"; };
    }
    return h("div", {
      position: "relative", minHeight: "52px", padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: "4px 12px", flexWrap: "wrap", background: C.panel, overflow: "hidden"
    }, [
      bg,
      bg ? h("div", { position: "absolute", left: "0", top: "0", width: "100%", height: "100%", background: "linear-gradient(90deg,rgba(20,20,28,.92),rgba(20,20,28,.35))" }) : null,
      h("span", { position: "relative", fontWeight: "700", fontSize: "14px" }, ["턴 " + num(turn) + (name ? " · " + name : "")]),
      right ? h("span", { position: "relative", fontSize: "12px", color: C.muted }, [right]) : null
    ]);
  }

  function parseCard(raw) {
    var f = raw.split("|").map(trim);
    if (f.length < 4) return null;
    return { name: f[0], kind: f[1], attr: f[2], grade: f[3], atk: f[4], hp: f[5], cool: f[6], mana: f[7], state: f[8] || "", effect: f.slice(9).join(" | ") };
  }
  function cardCool(c, over) {
    /* 남은 쿨: 배틀창 값이 있으면 그것, 없으면 상태 글에서 숫자 */
    var rem = null, ready = !c.state || c.state.indexOf("사용 가능") >= 0, m, mx = /\d/.test(c.cool || "") ? num(c.cool) : null;
    if (over != null) rem = over;
    else if (!ready) { m = c.state.match(/\d+/); rem = m ? Number(m[0]) : -1; }
    return { cooling: rem != null && rem !== 0, rem: rem, max: mx };
  }
  function coolText(c, st) {
    if (st.rem != null && st.rem >= 0) return "쿨 " + st.rem + (st.max ? "/" + st.max : "");
    return c.state;
  }
  function gradeSpan(grade) {
    var g = GRADE[grade] || { c: C.muted, w: "600" };
    return h("span", { fontSize: "11px", color: g.c, fontWeight: g.w, flexShrink: "0" }, [grade]);
  }

  function Card(raw) {
    var c = parseCard(raw);
    if (!c) return h("div", { fontSize: "12px", padding: "6px 8px", border: "1px solid " + C.line, borderRadius: "6px", color: C.muted }, [raw]);
    var st = cardCool(c, null), cooling = st.cooling;
    var stat = c.kind === "소환" && has(c.atk) && c.atk !== "-" ? "공" + c.atk + " · 체" + c.hp : c.kind;
    var meta = [h("span", null, [stat])];
    if (has(c.cool) && c.cool !== "-") meta.push(" · ", h("span", null, ["쿨" + c.cool]));
    if (has(c.mana) && c.mana !== "-") meta.push(" · ", h("span", null, ["마력 "]), h("span", { color: C.mp }, [c.mana]));
    var stateNode = cooling
      ? h("span", { display: "inline-flex", alignItems: "center", gap: "4px", color: C.warn }, [statIcon("cool", 11), coolText(c, st)])
      : h("span", { display: "inline-flex", alignItems: "center", gap: "4px", color: C.ok }, [Dot(C.ok), "사용 가능"]);
    var head = h("div", { padding: "6px 8px" }, [
      h("div", { display: "flex", alignItems: "center", gap: "6px" }, [
        attrIcon(c.attr, 16),
        h("span", { flex: "1", fontSize: "13px", fontWeight: "600" }, [c.name], { "class": "sp-ell" }),
        gradeSpan(c.grade),
        c.effect ? Arrow() : null
      ]),
      h("div", { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "2px 8px", flexWrap: "wrap", fontSize: "11px", color: C.muted, marginTop: "2px" }, [
        h("span", null, meta), stateNode
      ])
    ]);
    var box = { border: "1px solid " + (cooling ? C.warn : C.line), borderRadius: "6px", background: cooling ? tint(C.warn, 0.08) : C.panel, overflow: "hidden" };
    if (!c.effect) return h("div", box, [head]);
    return h("details", box, [
      h("summary", null, [head], { "class": "sp-sum" }),
      h("div", { padding: "6px 8px 8px", borderTop: "1px solid " + C.line, fontSize: "12px", color: C.text }, [c.effect])
    ]);
  }

  function CardsHead(cards) {
    var icons = cards.map(function (raw) {
      var c = parseCard(raw);
      if (!c) return null;
      var ic = attrIcon(c.attr, 14), cooling = cardCool(c, null).cooling;
      if (!ic) return null;
      return h("span", { position: "relative", display: "inline-flex", opacity: cooling ? ".45" : "1" }, [
        ic, cooling ? h("span", { position: "absolute", right: "-2px", top: "-2px", width: "5px", height: "5px", borderRadius: "50%", background: C.warn }) : null
      ]);
    });
    return [
      h("span", null, ["카드"]), h("span", { color: C.text }, [cards.length + "/7"], { "class": "sp-num" }),
      h("span", { marginLeft: "auto", display: "inline-flex", gap: "5px", alignItems: "center" }, icons)
    ];
  }

  function Pouch(pouch) {
    var items = pouch.filter(function (x) { return !/^(없음|-|—)$/.test(x); });
    var head = [Pic("card/back.webp", 24, 24, "fill"), h("span", null, ["봉인 주머니"]), h("span", { color: C.text }, [items.length + "장"], { "class": "sp-num" })];
    if (!items.length) return Static(head);
    var rows = items.map(function (x) {
      var m = x.match(/^(.*?)\s*[\(（]([^\)）]*)[\)）]\s*$/), name = m ? m[1] : x, grade = m ? m[2].trim() : "";
      return h("div", { display: "flex", justifyContent: "space-between", gap: "8px", fontSize: "12px", padding: "2px 2px" }, [
        h("span", { color: C.text }, [name]), grade ? gradeSpan(grade) : null
      ]);
    });
    return Fold("pouch", head, rows, false);
  }

  function Bond(raw) {
    var m = raw.match(/^(.*?)\s+([+-]?\d+)\s*$/), name = m ? m[1] : raw, v = m ? num(m[2]) : null;
    var pic = Pic(face(name), 36, 36, "crop");
    return h("div", { display: "flex", alignItems: "center", gap: "8px", padding: pic ? "4px 8px 4px 4px" : "7px 8px", background: C.slot, borderRadius: "6px", fontSize: "12px", minHeight: "44px" }, [
      pic,
      h("span", { flex: "1" }, [name], { "class": "sp-ell" }),
      v != null ? h("span", { color: v > 0 ? C.ok : v < 0 ? C.hp : C.muted, flexShrink: "0" }, [(v > 0 ? "+" : "") + v], { "class": "sp-num" }) : null
    ]);
  }

  function StatusWindow(p, opt) {
    var g = getter(p), headerOnly = opt && opt.headerOnly;
    var name = g("name", ""), cls = g("cls", ""), dorm = g("dorm", ""), cond = g("cond", ""), place = g("place", "");
    var items = list(g("items", "")), cards = list(g("cards", "")).slice(0, 7), bonds = list(g("bonds", "")), memo = list(g("memo", "")), pouch = list(g("pouch", ""));
    var head = S(function () { return Header(g("turn", 1), name, g("date", ""), place); });
    var body = headerOnly ? [] : [
      S(function () { return g("schedule", "") ? Line([Lab("일정"), Val(g("schedule", ""))]) : null; }),
      S(function () {
        if (!cls && !dorm) return null;
        if (cls && dorm && cls === dorm) return Line([Lab("소속·거처"), Tagged(cls, ["class", "dorm", "rank"])]);
        var k = [];
        if (cls) k.push(Lab("소속"), Tagged(cls, ["class", "rank"]));
        if (dorm) k.push(Lab("거처", cls ? { marginLeft: "8px" } : null), Tagged(dorm, ["dorm"]));
        return Line(k);
      }),
      S(function () {
        var bars = [];
        if (has(g("mp", null))) bars.push(Bar("마력", "mp", g("mp", 0), g("mpMax", null), C.mp));
        if (has(g("sp", null))) bars.push(Bar("정신력", "sp", g("sp", 0), g("spMax", null), C.sp));
        return bars.length ? h("div", { display: "flex", gap: "6px 12px", flexWrap: "wrap", marginTop: "10px" }, bars) : null;
      }),
      S(function () {
        var money = g("money", null);
        if (!cond && !has(money)) return null;
        return h("div", { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px", marginTop: "8px", fontSize: "12px" }, [
          cond ? Tagged(cond, ["rank"]) : h("span"),
          has(money) ? h("span", { display: "inline-flex", alignItems: "center", gap: "4px" }, [Icon("icon/coin.webp", 14), h("span", null, [num(money) + " 실링"], { "class": "sp-num" })]) : null
        ]);
      }),
      S(function () { return cards.length ? Fold("cards", CardsHead(cards), [h("div", null, cards.map(function (c) { return S(function () { return Card(c); }); }), { "class": "sp-gc" })], true) : null; }),
      S(function () {
        if (!items.length) return null;
        var k = [];
        items.forEach(function (x, i) { k.push(Tagged(x, ["rank"], i < items.length - 1 ? "," : "")); });
        return h("div", { display: "flex", gap: "2px 6px", flexWrap: "wrap", alignItems: "center", marginTop: "10px", fontSize: "12px" }, [Lab("소지품", { marginRight: "2px" })].concat(k));
      }),
      S(function () { return Pouch(pouch); }),
      S(function () { return bonds.length ? Fold("bonds", [h("span", null, ["인연"]), h("span", { color: C.text }, [bonds.length], { "class": "sp-num" })], [h("div", null, bonds.map(function (b) { return S(function () { return Bond(b); }); }), { "class": "sp-gm" })], false) : null; }),
      S(function () {
        return memo.length ? Fold("memo", [h("span", null, ["메모"]), h("span", { color: C.text }, [memo.length], { "class": "sp-num" })],
          memo.map(function (m) { return h("div", { fontSize: "12px", color: C.muted, marginTop: "2px" }, ["· " + m]); }), false) : null;
      })
    ];
    return head || body.some(Boolean) ? Box([head, body.some(Boolean) ? Pad(body) : null]) : null;
  }

  /* ---------- 배틀창 ---------- */
  function Mon(raw, hideHp) {
    var f = raw.split("|").map(trim);
    var name = f[0], atk = f[1], hpNow = f[2], hpFull = f[3], extra = f.slice(4).join(" | ");
    var hasHp = f.length >= 3 && has(hpNow), pct = hasHp && has(hpFull) ? clamp(num(hpNow) / Math.max(1, num(hpFull)) * 100, 0, 100) : null;
    var stat = (has(atk) ? "공" + atk : "") + (hasHp && !hideHp ? " · 체" + hpNow + (has(hpFull) ? "/" + hpFull : "") : "");
    return h("div", { border: "1px solid " + C.line, borderRadius: "6px", background: C.slot, padding: "6px 8px" }, [
      h("div", { fontSize: "12px", fontWeight: "600" }, [name], { "class": "sp-ell" }),
      stat ? h("div", { fontSize: "11px", color: C.muted }, [stat.replace(/^ · /, "")], { "class": "sp-ell" }) : null,
      pct !== null && !hideHp ? h("div", { height: "4px", background: C.line, borderRadius: "2px", marginTop: "3px" }, [
        h("div", { width: pct + "%", height: "4px", background: C.hp, borderRadius: "2px" })
      ]) : null,
      extra ? h("div", { fontSize: "11px", color: C.warn, marginTop: "2px" }, [extra]) : null
    ]);
  }
  function Empty(w, hh) { return h("div", { width: w + "px", height: hh + "px", border: "1px dashed " + C.line, borderRadius: "3px", flexShrink: "0" }); }
  function MonRow(label, raws, hideHp) {
    var tiles = raws.map(function (r) { return S(function () { return Mon(r, hideHp); }); });
    return SlotRow(label, tiles.length ? h("div", null, tiles, { "class": "sp-gm" }) : h("div", null, [Empty(120, 44)], { "class": "sp-gm" }));
  }
  /* 세트 장수: 항목마다 처음 나온 숫자, 없음·0·빈칸은 0 */
  function setCount(raw) {
    var total = 0;
    list(raw).forEach(function (x) {
      if (/^(없음|-|—|0)/.test(x)) return;
      var m = x.match(/\d+/);
      total += m ? Number(m[0]) : 1;
    });
    return total;
  }
  function SetRow(raw) {
    var n = setCount(raw), out = [], i;
    for (i = 0; i < Math.min(n, 5); i++) {
      out.push(h("div", { width: "40px", height: "40px", borderRadius: "3px", overflow: "hidden", border: "1px solid " + C.gold, background: "linear-gradient(135deg,#1d2346,#0f1226)", flexShrink: "0" }, [
        h("img", { display: "block", width: "100%", height: "100%" }, null, { src: ASSET + "card/back.webp", alt: "" })
      ]));
      out[i].firstChild.onerror = (function (im) { return function () { im.style.display = "none"; }; })(out[i].firstChild);
    }
    return SlotRow("세트", h("div", { display: "flex", gap: "4px", flexWrap: "wrap" }, n ? out : [Empty(40, 40)]));
  }
  function SlotRow(label, node) {
    return h("div", { display: "flex", gap: "8px", alignItems: "flex-start", marginTop: "8px" }, [
      Lab(label, { width: "34px", paddingTop: "5px" }), h("div", { flex: "1", minWidth: "0" }, [node])
    ]);
  }

  var BEAST = { "경계": C.warn, "흥분": C.hp, "평온": C.muted, "지침": C.ok, "기절": C.ok };
  function beastColor(state) {
    for (var k in BEAST) if (String(state).indexOf(k) >= 0) return BEAST[k];
    return C.muted;
  }
  function Tired(n) {
    var cells = [], i;
    for (i = 0; i < 5; i++) cells.push(h("span", { width: "8px", height: "12px", borderRadius: "2px", background: i < n ? C.warn : "rgba(255,255,255,.1)", display: "inline-block" }));
    return h("span", { display: "inline-flex", alignItems: "center", gap: "3px" }, [Lab("지침", { marginRight: "3px" })].concat(cells));
  }

  function Divider(round, side, first) {
    var badge, sd = String(side || "");
    if (sd) badge = sd.indexOf("상대") >= 0 ? Badge(sd, C.ink, C.warn) : /^내|내 차례/.test(sd) ? Badge(sd, C.ink, C.ok) : Badge(sd, C.text, "rgba(255,255,255,.12)");
    var line = function () { return h("div", { flex: "1", height: "1px", background: C.line, minWidth: "8px" }); };
    return h("div", { display: "flex", alignItems: "center", gap: "8px", margin: "12px 0 4px" }, [
      line(),
      h("div", { display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", justifyContent: "center" }, [
        h("span", { fontSize: "11px", color: C.muted }, [num(round) + "라운드"], { "class": "sp-num" }),
        badge,
        first ? h("span", { fontSize: "11px", color: C.muted }, ["선공 " + first]) : null
      ]),
      line()
    ]);
  }

  /* 내 보유 카드 칩: 이름 · 소비 마력 · 남은 쿨 */
  function coolMap(raw) {
    var o = [];
    list(raw.replace(/,/g, ";")).forEach(function (x) {
      var m = x.match(/^(.*?)\s*(\d+)\s*$/);
      o.push({ name: (m ? m[1] : x).trim(), rem: m ? Number(m[2]) : 1, used: false });
    });
    return o;
  }
  function sameCard(a, b) { a = String(a).replace(/\s+/g, ""); b = String(b).replace(/\s+/g, ""); return a && b && (a === b || (a.length >= 2 && b.length >= 2 && (a.indexOf(b) >= 0 || b.indexOf(a) >= 0))); }
  function Chip(name, attr, mana, mpNow, cooling, coolLabel) {
    var short = mpNow != null && has(mana) && mana !== "-" && num(mana) > mpNow;
    return h("div", {
      border: "1px solid " + (cooling ? C.warn : C.line), borderRadius: "6px", background: cooling ? tint(C.warn, 0.08) : C.panel,
      padding: "4px 8px", minHeight: "40px"
    }, [
      h("div", { display: "flex", alignItems: "center", gap: "5px" }, [attrIcon(attr, 14), h("span", { flex: "1", fontSize: "12px", fontWeight: "600" }, [name], { "class": "sp-ell" })]),
      h("div", { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px", fontSize: "11px", color: C.muted, marginTop: "1px" }, [
        has(mana) && mana !== "-" ? h("span", null, ["마력 ", h("span", { color: short ? C.hp : C.mp }, [mana])]) : h("span"),
        cooling ? h("span", { display: "inline-flex", alignItems: "center", gap: "3px", color: C.warn }, [statIcon("cool", 11), coolLabel]) : Dot(C.ok)
      ])
    ]);
  }
  function Chips(cardRaws, coolRaw, mpNow) {
    var cm = coolMap(coolRaw || ""), out = [];
    cardRaws.forEach(function (raw) {
      var c = parseCard(raw), ov = null, i, st;
      if (!c) return;
      for (i = 0; i < cm.length; i++) if (!cm[i].used && sameCard(cm[i].name, c.name)) { ov = cm[i].rem; cm[i].used = true; break; }
      st = cardCool(c, ov);
      out.push(Chip(c.name, c.attr, c.mana, mpNow, st.cooling, coolText(c, st)));
    });
    cm.forEach(function (x) { if (!x.used && x.rem > 0) out.push(Chip(x.name, "", "", null, true, "쿨 " + x.rem)); });
    return out.length ? h("div", { marginTop: "10px" }, [h("div", null, out, { "class": "sp-gm" })]) : null;
  }

  function injuryBadge(v) {
    if (/없음|무/.test(v)) return Badge("부상 " + v, C.muted, "rgba(255,255,255,.08)");
    if (/중상|위중|중태|치명/.test(v)) return Badge("부상 " + v, C.hp, tint(C.hp, 0.16));
    return Badge("부상 " + v, C.warn, tint(C.warn, 0.16));
  }

  function BattleField(p, sw) {
    var g = getter(p), swg = sw ? getter(sw) : null;
    var mode = String(g("mode", "duel")), hunt = mode.indexOf("hunt") >= 0 || mode.indexOf("마수") >= 0;
    var foe = g("foe", "상대"), foeMons = list(g("foeMons", "")), myMons = list(g("myMons", ""));
    var cards = swg ? list(swg("cards", "")).slice(0, 7) : [];
    var mpNow = has(g("mp", null)) ? num(g("mp", 0)) : null;
    var kids = [];

    kids.push(S(function () {
      var pic = Pic(hunt ? monArt(foe) : face(foe), 56, 56, hunt ? "cover" : "crop");
      return h("div", { display: "flex", alignItems: "center", gap: "10px", minHeight: "56px" }, [
        pic,
        h("span", { flex: "1", fontSize: "15px", fontWeight: "700" }, [foe]),
        h("span", { fontSize: "12px", color: C.muted, flexShrink: "0" }, [hunt ? "마수전" : "인간전"])
      ]);
    }));

    if (hunt) kids.push(S(function () {
      var bars = [], st = g("foeState", ""), tired = clamp(num(g("foeTired", 0)), 0, 5);
      foeMons.forEach(function (raw) {
        var f = raw.split("|").map(trim);
        if (f.length >= 3 && has(f[2])) bars.push(Bar(foeMons.length > 1 ? f[0] : "HP", "hp", f[2], f[3], C.hp, 130));
      });
      return h("div", { display: "flex", alignItems: "flex-end", gap: "8px 12px", flexWrap: "wrap", marginTop: "8px" }, bars.concat([
        h("div", { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", paddingBottom: "1px" }, [
          st ? Badge(st, beastColor(st), tint(beastColor(st), 0.16)) : null, Tired(tired)
        ])
      ]));
    }));
    else kids.push(S(function () {
      var bars = [];
      if (has(g("foeMp", null))) bars.push(Bar("마력", "mp", g("foeMp", 0), g("foeMpMax", null), C.mp, 110));
      if (has(g("foeHp", null))) bars.push(Bar("HP", "hp", g("foeHp", 0), g("foeHpMax", null), C.hp, 110));
      return bars.length ? h("div", { display: "flex", gap: "6px 12px", flexWrap: "wrap", marginTop: "8px" }, bars) : null;
    }));

    if (!hunt) kids.push(S(function () { return SetRow(g("foeSets", "")); }));
    kids.push(S(function () { return MonRow(hunt ? "마수" : "몬스터", foeMons, hunt); }));
    kids.push(S(function () { return Divider(g("round", 1), g("side", ""), g("first", "")); }));
    kids.push(S(function () { return MonRow("몬스터", myMons, false); }));
    if (!hunt || setCount(g("mySets", "")) > 0) kids.push(S(function () { return SetRow(g("mySets", "")); }));

    kids.push(S(function () {
      var bars = [], inj = g("injury", "");
      if (has(g("mp", null))) bars.push(Bar("마력", "mp", g("mp", 0), g("mpMax", null), C.mp, 110));
      if (hunt) { if (has(g("sp", null))) bars.push(Bar("정신력", "sp", g("sp", 0), g("spMax", null), C.sp, 110)); }
      else if (has(g("hp", null))) bars.push(Bar("HP", "hp", g("hp", 0), g("hpMax", null), C.hp, 110));
      if (inj) bars.push(h("div", { paddingBottom: "1px", alignSelf: "flex-end" }, [injuryBadge(inj)]));
      return bars.length ? h("div", { display: "flex", alignItems: "flex-end", gap: "6px 12px", flexWrap: "wrap", marginTop: "10px" }, bars) : null;
    }));
    kids.push(S(function () { return Chips(cards, g("cool", ""), mpNow); }));
    if (hunt) kids.push(S(function () {
      var cap = g("capture", "불가"), ok = cap.indexOf("가능") >= 0 && cap.indexOf("불") < 0;
      return h("div", { display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", fontSize: "12px" }, [
        h("span", { color: C.muted }, ["빈 카드 ", h("span", { color: C.text }, [num(g("blanks", 0))], { "class": "sp-num" })]),
        ok ? Badge("포획 " + cap, C.ink, C.ok) : Badge(/포획/.test(cap) ? cap : "포획 " + cap, C.muted, "rgba(255,255,255,.08)")
      ]);
    }));
    return kids.some(Boolean) ? Box([Pad(kids)]) : null;
  }

  /* ---------- 그리기 ---------- */
  function Raw(raw) {
    var code = h("code", {
      display: "block", fontFamily: 'ui-monospace,Consolas,"Courier New",monospace', fontSize: "11px", color: C.muted, background: C.slot,
      border: "1px solid " + C.line, borderRadius: "6px", padding: "6px 8px", marginBottom: "8px", whiteSpace: "nowrap", overflow: "hidden",
      textOverflow: "ellipsis", cursor: "pointer"
    }, [raw]);
    code.addEventListener("click", function () {
      var open = code.style.whiteSpace === "normal";
      code.style.whiteSpace = open ? "nowrap" : "normal"; code.style.wordBreak = open ? "normal" : "break-all";
    });
    return code;
  }
  function ensureCss() {
    if (document.getElementById("septima-ui-css")) return;
    var st = h("style", null, [CSS], { id: "septima-ui-css" });
    (document.head || document.body || document.documentElement).appendChild(st);
  }
  function render(tags) {
    ensureCss();
    var wrap = h("div", { width: "100%" }), hasBattle = false, sw = null;
    tags.forEach(function (t) {
      if (t.type === "BattleField") hasBattle = true;
      else if (!sw) sw = t.props;
    });
    tags.forEach(function (t) {
      var node = null;
      try { node = t.type === "StatusWindow" ? StatusWindow(t.props, { headerOnly: hasBattle }) : BattleField(t.props, sw); } catch (e) { node = null; }
      if (!node) node = Raw(t.raw || "");
      wrap.appendChild(node);
    });
    return wrap;
  }

  function run() {
    if (document.body) { document.body.style.margin = "0"; document.body.style.background = "transparent"; }
    var done = false;
    Array.prototype.forEach.call(document.querySelectorAll('script[type="text/plain"]'), function (s) {
      if (s.getAttribute("data-septima-done")) return;
      s.setAttribute("data-septima-done", "1");
      var tags = parseTags(s.textContent || "");
      if (!tags.length) return;
      s.parentNode.insertBefore(render(tags), s.nextSibling);
      done = true;
    });
    if (done) return;
    var els = Array.prototype.filter.call(document.querySelectorAll("statuswindow, battlefield"), function (el) { return !el.getAttribute("data-septima-done"); });
    if (!els.length) return;
    var tags = els.map(function (el) {
      el.setAttribute("data-septima-done", "1");
      var props = {};
      Array.prototype.forEach.call(el.attributes, function (a) { props[a.name] = a.value.replace(/^\{\s*["']?|["']?\s*\}$/g, ""); });
      return { type: el.tagName.toLowerCase() === "statuswindow" ? "StatusWindow" : "BattleField", props: props, raw: el.outerHTML };
    });
    els[0].parentNode.insertBefore(render(tags), els[0]);
    els.forEach(function (el) { el.style.display = "none"; });
  }

  if (typeof window !== "undefined") {
    window.SeptimaUI = { parseTags: parseTags, render: render, run: run };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
    else run();
  }
})();
