/* septima-ui v2 — 셉티마 상태창·배틀창. <StatusWindow …/> <BattleField …/> 태그 글을 읽어 화면을 그린다.
   그림: septima-assets 저장소 (card/C###.webp, mon/M###.webp, place/P###.webp, c/{인물}_{상황}.webp). 그림이 없으면 글만 그린다. */
(function () {
  "use strict";

  var ASSET = (typeof window !== "undefined" && window.SEPTIMA_ASSETS) || "https://cdn.jsdelivr.net/gh/OvO-OvO-OvO-OvO-OvO/septima-assets@main/";
  var MAPS = /*MAPS*/{};
  var FONT = 'system-ui,-apple-system,"Segoe UI","Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",sans-serif';
  var C = {
    bg: "#14141c", panel: "#1b1b26", line: "rgba(255,255,255,0.09)", text: "#ececf2", muted: "#9a9aa8",
    hp: "#ff6b6b", mp: "#6c8cff", sp: "#c07cff", ok: "#5fd38d", cool: "#f0b54a", warn: "#f0b54a", gold: "#e8c27a",
    slot: "rgba(255,255,255,0.04)",
    N: "#9aa0a6", R: "#5aa9ff", SR: "#c07cff", SSR: "#f5c04a", LEGEND: "#ff6b6b"
  };
  var ATTRC = { "화": "#ff7a45", "수": "#4fa3ff", "풍": "#5fd3a8", "지": "#c79a5b", "광": "#f5d76e", "암": "#9b7bd8", "무": "#b8bcc8" };

  function list(s) { return String(s == null ? "" : s).split(";").map(function (x) { return x.trim(); }).filter(Boolean); }
  function num(v) { var n = Number(String(v == null ? "" : v).replace(/[^\d.-]/g, "")); return isNaN(n) ? 0 : n; }

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

  function img(path, style) {
    if (!path) return null;
    var el = h("img", style, null, { src: ASSET + path, alt: "", loading: "lazy" });
    el.onerror = function () { el.style.display = "none"; };
    return el;
  }

  function lookup(kind, name) {
    var m = MAPS[kind] || {}, key = String(name || "").replace(/\(.*?\)/g, "").trim();
    if (m[key]) return m[key];
    for (var k in m) if (key && (key.indexOf(k) >= 0 || k.indexOf(key) >= 0)) return m[k];
    return null;
  }
  function cardArt(name) { var c = lookup("cards", name); return c ? "card/" + c + ".webp" : null; }
  function monArt(name) { var c = lookup("monsters", name); return c ? "mon/" + c + ".webp" : null; }
  function placeArt(name) { var c = lookup("places", name); return c ? "place/" + c + ".webp" : null; }
  function face(name) { var s = lookup("people", name); return s ? "c/" + s + "_1.webp" : null; }

  /* 속성 아이콘: 24칸 SVG, 속성 색으로 채운다 */
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
  function attrIcon(attr, size) {
    var d = ATTRP[attr];
    if (!d) return null;
    var ns = "http://www.w3.org/2000/svg", c = ATTRC[attr];
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", size); svg.setAttribute("height", size);
    svg.style.flexShrink = "0"; svg.style.verticalAlign = "-2px";
    var p = document.createElementNS(ns, "path");
    p.setAttribute("d", d);
    if (ATTRLINE[attr]) {
      p.setAttribute("fill", attr === "광" ? c : "none");
      p.setAttribute("stroke", c); p.setAttribute("stroke-width", "2"); p.setAttribute("stroke-linecap", "round");
    } else p.setAttribute("fill", c);
    svg.appendChild(p);
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
  function parseTags(text) {
    var out = [], re = /<\s*(StatusWindow|BattleField)\b([\s\S]*?)\/?\s*>/g, m;
    while ((m = re.exec(text))) out.push({ type: m[1], props: parseAttrs(m[2]) });
    return out;
  }
  function getter(p) {
    var low = {};
    for (var k in p) low[k.toLowerCase()] = p[k];
    return function (key, def) { var v = low[key.toLowerCase()]; return v == null || v === "" ? def : v; };
  }

  /* ---------- 공통 조각 ---------- */
  function Bar(label, value, max, color, minW) {
    var pct = Math.max(0, Math.min(100, (num(value) / Math.max(1, num(max))) * 100));
    return h("div", { flex: "1", minWidth: (minW || 120) + "px" }, [
      h("div", { display: "flex", justifyContent: "space-between", fontSize: "12px", color: C.muted }, [
        h("span", null, [label]), h("span", { color: C.text, fontVariantNumeric: "tabular-nums" }, [num(value) + " / " + num(max)])
      ]),
      h("div", { height: "7px", background: "rgba(255,255,255,0.07)", borderRadius: "4px", marginTop: "3px", overflow: "hidden" }, [
        h("div", { width: pct + "%", height: "7px", background: "linear-gradient(90deg," + color + "aa," + color + ")", borderRadius: "4px", transition: "width .4s" })
      ])
    ]);
  }
  function Row(k, v) {
    return h("div", { display: "flex", gap: "8px", fontSize: "12px", marginTop: "4px" }, [
      h("span", { color: C.muted, minWidth: "48px", flexShrink: "0" }, [k]), h("span", { color: C.text }, [v])
    ]);
  }
  function Fold(title, count, open, body) {
    var d = h("details", { marginTop: "8px", borderTop: "1px solid " + C.line, paddingTop: "6px" }, [
      h("summary", { cursor: "pointer", fontSize: "12px", color: C.gold, listStyle: "none", userSelect: "none", outline: "none" }, [
        "▸ " + title + (count != null ? " " + count : "")
      ]),
      h("div", { marginTop: "6px" }, body)
    ]);
    if (open) d.setAttribute("open", "");
    d.addEventListener("toggle", function () { d.firstChild.firstChild.nodeValue = (d.open ? "▾ " : "▸ ") + title + (count != null ? " " + count : ""); });
    if (open) d.firstChild.firstChild.nodeValue = "▾ " + title + (count != null ? " " + count : "");
    return d;
  }
  function Box(kids) {
    return h("div", {
      background: C.bg, color: C.text, border: "1px solid " + C.line, borderRadius: "12px", overflow: "hidden",
      maxWidth: "560px", boxSizing: "border-box", fontFamily: FONT, lineHeight: "1.45",
      marginBottom: "8px", wordBreak: "keep-all", overflowWrap: "anywhere", boxShadow: "0 2px 12px rgba(0,0,0,.35)"
    }, kids);
  }
  function Pad(kids) { return h("div", { padding: "10px 12px 12px" }, kids); }

  /* ---------- 상태창 ---------- */
  function Card(raw, idx) {
    var f = raw.split("|").map(function (x) { return x.trim(); });
    if (f.length < 4) return h("div", { fontSize: "12px", padding: "6px 8px", border: "1px solid " + C.line, borderRadius: "8px" }, [(idx + 1) + ". " + raw]);
    var name = f[0], kind = f[1], attr = f[2], grade = f[3], atk = f[4], hp = f[5], cool = f[6], mana = f[7], state = f[8];
    var effect = f.slice(9).join(" | ");
    var ready = !state || state.indexOf("사용 가능") >= 0;
    var gc = C[grade] || C.muted, ac = ATTRC[attr] || C.muted;
    var stat = kind === "소환" && atk && atk !== "-" ? "공" + atk + " · 체" + hp : kind;
    var d = h("details", {
      border: "1px solid " + (ready ? C.line : C.cool), borderLeft: "3px solid " + gc, borderRadius: "8px",
      background: ready ? C.panel : "rgba(240,181,74,0.08)", overflow: "hidden"
    }, [
      h("summary", { cursor: "pointer", listStyle: "none", padding: "6px 8px", display: "flex", gap: "8px", alignItems: "center", outline: "none" }, [
        h("div", { position: "relative", width: "40px", height: "40px", borderRadius: "6px", flexShrink: "0", background: ac + "33", overflow: "hidden" }, [
          img(cardArt(name), { width: "100%", height: "100%", objectFit: "cover" }),
          h("div", { position: "absolute", right: "1px", bottom: "1px", width: "15px", height: "15px", borderRadius: "50%", background: "rgba(14,14,20,.85)", display: "flex", alignItems: "center", justifyContent: "center" }, [attrIcon(attr, 11)])
        ]),
        h("div", { flex: "1", minWidth: "0" }, [
          h("div", { display: "flex", justifyContent: "space-between", gap: "6px" }, [
            h("span", { fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, [name]),
            h("span", { fontSize: "11px", color: gc, fontWeight: "700", flexShrink: "0" }, [grade])
          ]),
          h("div", { fontSize: "11px", color: C.muted }, [
            attrIcon(attr, 12), h("span", { color: ac, marginLeft: "3px" }, [attr]), " · " + stat + " · ",
            h("span", { color: ready ? C.ok : C.cool }, [ready ? "사용 가능" : state])
          ])
        ])
      ]),
      h("div", { padding: "0 8px 8px" }, [
        img(cardArt(name), { width: "100%", borderRadius: "6px", display: "block", marginBottom: "6px", aspectRatio: "1/1", objectFit: "cover" }),
        h("div", { fontSize: "11px", color: C.muted }, [kind + " · 쿨 " + (cool || "-") + " · 마력 " + (mana || "-")]),
        effect ? h("div", { fontSize: "12px", marginTop: "4px", color: C.text }, [effect]) : null
      ])
    ]);
    return d;
  }

  function Bond(raw) {
    var m = raw.match(/^(.*?)\s+(-?\d+)\s*$/), name = m ? m[1] : raw, v = m ? num(m[2]) : null;
    return h("div", { display: "flex", alignItems: "center", gap: "6px", padding: "3px 8px 3px 3px", background: C.slot, borderRadius: "999px", fontSize: "12px" }, [
      h("div", { width: "24px", height: "24px", borderRadius: "50%", overflow: "hidden", background: "rgba(255,255,255,.08)", flexShrink: "0" }, [
        img(face(name), { width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 15%" })
      ]),
      h("span", null, [name]),
      v != null ? h("span", { color: v > 0 ? C.ok : v < 0 ? C.hp : C.muted, fontVariantNumeric: "tabular-nums" }, [(v > 0 ? "+" : "") + v]) : null
    ]);
  }

  function Header(title, sub, place) {
    return h("div", { position: "relative", padding: "12px", minHeight: "44px", background: "linear-gradient(135deg,#232338,#15151e)", overflow: "hidden" }, [
      img(placeArt(place), { position: "absolute", inset: "0", width: "100%", height: "100%", objectFit: "cover", opacity: "0.35" }),
      h("div", { position: "absolute", inset: "0", background: "linear-gradient(90deg,rgba(20,20,28,.92),rgba(20,20,28,.55))" }),
      h("div", { position: "relative", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }, [
        h("span", { fontWeight: "700", fontSize: "14px" }, [title]),
        h("span", { fontSize: "12px", color: C.muted }, [sub])
      ])
    ]);
  }

  function StatusWindow(p) {
    var g = getter(p);
    var name = g("name", ""), cls = g("cls", ""), dorm = g("dorm", ""), date = g("date", ""), place = g("place", "");
    var items = list(g("items", "")), cards = list(g("cards", "")), bonds = list(g("bonds", "")), memo = list(g("memo", "")), pouch = list(g("pouch", ""));
    return Box([
      Header("턴 " + num(g("turn", 1)) + (name ? " · " + name : ""), "협약력 300년 " + date + (place ? " · " + place : ""), place),
      Pad([
        g("schedule", "") ? Row("일정", g("schedule", "")) : null,
        cls || dorm ? Row("소속", [cls, dorm ? "거처 " + dorm : ""].filter(Boolean).join(" · ")) : null,
        h("div", { display: "flex", gap: "12px", marginTop: "10px", flexWrap: "wrap" }, [
          Bar("마력", g("mp", 0), g("mpMax", 1), C.mp), Bar("정신력", g("sp", 0), g("spMax", 1), C.sp)
        ]),
        Row("상태", [g("cond", ""), num(g("money", 0)) + " 실링"].filter(Boolean).join(" · ")),
        cards.length ? Fold("카드", cards.length + "/7", true, [h("div", { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "6px" }, cards.slice(0, 7).map(Card))]) : null,
        items.length || pouch.length ? Fold("소지품", null, false, [
          items.length ? Row("아이템", items.join(", ")) : null,
          Row("주머니", pouch.length ? pouch.join(", ") : "없음")
        ]) : null,
        bonds.length ? Fold("인연", bonds.length, false, [h("div", { display: "flex", flexWrap: "wrap", gap: "5px" }, bonds.map(Bond))]) : null,
        memo.length ? Fold("메모", memo.length, false, memo.map(function (m) { return h("div", { fontSize: "12px", color: C.muted, marginTop: "2px" }, ["· " + m]); })) : null
      ])
    ]);
  }

  /* ---------- 배틀창 ---------- */
  function Mon(raw) {
    var f = raw.split("|").map(function (x) { return x.trim(); });
    var name = f[0], atk = f[1], hpNow = f[2], hpFull = f[3], extra = f.slice(4).join(" | ");
    var hasHp = f.length >= 3;
    var pct = hasHp && hpFull ? Math.max(0, Math.min(100, (num(hpNow) / Math.max(1, num(hpFull))) * 100)) : null;
    var art = cardArt(name) || monArt(name);
    return h("div", { width: "124px", border: "1px solid " + C.line, borderRadius: "8px", background: C.panel, overflow: "hidden" }, [
      h("div", { height: "70px", background: "rgba(255,255,255,.05)", overflow: "hidden" }, [img(art, { width: "100%", height: "100%", objectFit: "cover" })]),
      h("div", { padding: "5px 7px 7px" }, [
        h("div", { fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, [name]),
        hasHp ? h("div", { fontSize: "11px", color: C.muted }, ["공" + atk + " · 체" + hpNow + (hpFull ? "/" + hpFull : "")]) : null,
        pct !== null ? h("div", { height: "4px", background: C.line, borderRadius: "2px", marginTop: "3px" }, [
          h("div", { width: pct + "%", height: "4px", background: C.hp, borderRadius: "2px", transition: "width .4s" })
        ]) : null,
        extra ? h("div", { fontSize: "11px", color: C.warn, marginTop: "2px" }, [extra]) : null
      ])
    ]);
  }
  function SetCard(raw) {
    var n = num(raw) || 1, out = [];
    for (var i = 0; i < Math.min(n, 5); i++) {
      out.push(h("div", { width: "44px", height: "62px", borderRadius: "5px", overflow: "hidden", border: "1px solid " + C.gold + "66", background: "linear-gradient(135deg,#1d2346,#0f1226)" }, [
        img("card/back.webp", { width: "100%", height: "100%", objectFit: "cover" })
      ]));
    }
    return h("div", { display: "flex", gap: "4px", alignItems: "center" }, out.concat([h("span", { fontSize: "11px", color: C.muted }, [raw])]));
  }
  function SlotRow(label, nodes, empty) {
    return h("div", { display: "flex", gap: "6px", alignItems: "flex-start", marginTop: "6px", flexWrap: "wrap" }, [
      h("span", { fontSize: "11px", color: C.muted, minWidth: "34px", paddingTop: "6px" }, [label])
    ].concat(nodes.length ? nodes : [h("span", { fontSize: "11px", color: C.muted, padding: "6px 8px", border: "1px dashed " + C.line, borderRadius: "6px" }, [empty])]));
  }

  function BattleField(p) {
    var g = getter(p);
    var mode = g("mode", "duel"), hunt = mode.indexOf("hunt") >= 0 || mode.indexOf("마수") >= 0;
    var first = g("first", ""), injury = g("injury", ""), capture = g("capture", "");
    var tired = Math.max(0, Math.min(5, num(g("foeTired", 0)))), cool = list(g("cool", ""));
    var canCatch = capture.indexOf("가능") >= 0 && capture.indexOf("불") < 0;
    var me = g("me", "") || g("name", ""), foe = g("foe", "상대");
    var foeArt = hunt ? monArt(foe) : face(foe);
    return Box([
      h("div", { position: "relative", padding: "10px 12px", background: hunt ? "linear-gradient(135deg,#3a1d1d,#15151e)" : "linear-gradient(135deg,#1d2a3a,#15151e)", overflow: "hidden" }, [
        img(foeArt, { position: "absolute", right: "0", top: "0", height: "100%", width: "55%", objectFit: "cover", objectPosition: "50% 20%", opacity: "0.45", maskImage: "linear-gradient(90deg,transparent,#000)", webkitMaskImage: "linear-gradient(90deg,transparent,#000)" }),
        h("div", { position: "relative", display: "flex", justifyContent: "space-between", fontSize: "12px", color: C.muted, flexWrap: "wrap", gap: "6px" }, [
          h("span", { color: C.text, fontWeight: "700" }, [(hunt ? "마수전" : "인간전") + " · " + num(g("round", 1)) + "라운드"]),
          h("span", null, [g("side", "") + (first ? " · 선공 " + first : "")])
        ]),
        h("div", { position: "relative", marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }, [
          h("span", { fontWeight: "700", fontSize: "15px" }, [foe]),
          hunt ? h("span", { fontSize: "12px", color: C.warn }, [g("foeState", "") + " · 지침 " + "■".repeat(tired) + "□".repeat(5 - tired)]) : null
        ]),
        hunt ? null : h("div", { position: "relative", display: "flex", gap: "12px", marginTop: "6px", flexWrap: "wrap" }, [
          Bar("HP", g("foeHp", 5000), g("foeHpMax", 5000), C.hp, 110), Bar("마력", g("foeMp", 0), g("foeMpMax", 1), C.mp, 110)
        ])
      ]),
      Pad([
        hunt ? null : SlotRow("마법", list(g("foeSets", "")).map(SetCard), "빈 슬롯"),
        SlotRow(hunt ? "마수" : "몬스터", list(g("foeMons", "")).map(Mon), "빈 슬롯"),
        h("div", { borderTop: "1px solid " + C.line, margin: "12px 0" }),
        SlotRow("몬스터", list(g("myMons", "")).map(Mon), "빈 슬롯"),
        SlotRow("마법", list(g("mySets", "")).map(SetCard), "빈 슬롯"),
        h("div", { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: "10px" }, [
          h("span", { fontWeight: "700" }, [me]),
          injury ? h("span", { fontSize: "12px", color: injury.indexOf("없음") >= 0 ? C.muted : C.warn }, ["부상: " + injury]) : null
        ]),
        h("div", { display: "flex", gap: "12px", marginTop: "6px", flexWrap: "wrap" }, [
          hunt ? null : Bar("HP", g("hp", 5000), g("hpMax", 5000), C.hp, 110),
          Bar("마력", g("mp", 0), g("mpMax", 1), C.mp, 110),
          hunt ? Bar("정신력", g("sp", 0), g("spMax", 1), C.sp, 110) : null
        ]),
        h("div", { fontSize: "11px", color: C.muted, marginTop: "8px", display: "flex", gap: "12px", flexWrap: "wrap" }, [
          h("span", null, ["쿨대기: " + (cool.length ? cool.join(", ") : "없음")]),
          hunt ? h("span", null, ["빈 카드 " + num(g("blanks", 0)) + "장"]) : null,
          hunt ? h("span", { color: canCatch ? C.ok : C.muted }, ["포획: " + (capture || "불가")]) : null
        ])
      ])
    ]);
  }

  /* ---------- 그리기 ---------- */
  function render(tags) {
    var wrap = h("div", { width: "100%" });
    tags.forEach(function (t) {
      try { wrap.appendChild(t.type === "StatusWindow" ? StatusWindow(t.props) : BattleField(t.props)); }
      catch (e) { wrap.appendChild(h("pre", { fontSize: "11px", color: C.muted, whiteSpace: "pre-wrap" }, [String(e)])); }
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
      return { type: el.tagName.toLowerCase() === "statuswindow" ? "StatusWindow" : "BattleField", props: props };
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
