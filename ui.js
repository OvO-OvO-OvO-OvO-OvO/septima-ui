/* septima-ui — 셉티마 상태창·배틀창. <StatusWindow …/> <BattleField …/> 태그 글을 읽어 화면을 그린다. */
(function () {
  "use strict";

  var FONT = 'system-ui,-apple-system,"Segoe UI","Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",sans-serif';
  var C = {
    bg: "#16161e", line: "rgba(255,255,255,0.10)", text: "#ececf2", muted: "#9a9aa8",
    hp: "#ff6b6b", mp: "#6c8cff", sp: "#c07cff", ok: "#5fd38d", cool: "#f0b54a", warn: "#f0b54a",
    slot: "rgba(255,255,255,0.04)",
    N: "#9aa0a6", R: "#5aa9ff", SR: "#c07cff", SSR: "#f5c04a", LEGEND: "#ff6b6b"
  };

  function list(s) { return String(s == null ? "" : s).split(";").map(function (x) { return x.trim(); }).filter(Boolean); }
  function num(v) { var n = Number(String(v == null ? "" : v).replace(/[^\d.-]/g, "")); return isNaN(n) ? 0 : n; }
  function str(v) { return v == null ? "" : String(v); }

  function h(tag, style, kids) {
    var el = document.createElement(tag);
    if (style) for (var k in style) el.style[k] = style[k];
    (kids || []).forEach(function (c) {
      if (c == null || c === false) return;
      el.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    });
    return el;
  }

  /* ---------- 태그 읽기 ---------- */
  var ATTR = /([A-Za-z_][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/g;

  function parseAttrs(s) {
    var o = {}, m;
    ATTR.lastIndex = 0;
    while ((m = ATTR.exec(s))) {
      var v = m[2] != null ? m[2] : m[3] != null ? m[3] : m[4];
      v = v.trim();
      if (m[4] != null && /^["'].*["']$/.test(v)) v = v.slice(1, -1);
      o[m[1]] = v;
    }
    return o;
  }

  function parseTags(text) {
    var out = [], re = /<\s*(StatusWindow|BattleField)\b([\s\S]*?)\/?\s*>/g, m;
    while ((m = re.exec(text))) out.push({ type: m[1], props: parseAttrs(m[2]) });
    return out;
  }

  // 대소문자 무시로 값 꺼내기 (HTML 요소 속성은 소문자가 된다)
  function getter(p) {
    var low = {};
    for (var k in p) low[k.toLowerCase()] = p[k];
    return function (key, def) {
      var v = low[key.toLowerCase()];
      return v == null || v === "" ? def : v;
    };
  }

  /* ---------- 공통 조각 ---------- */
  function Bar(label, value, max, color, minW) {
    var pct = Math.max(0, Math.min(100, (num(value) / Math.max(1, num(max))) * 100));
    return h("div", { flex: "1", minWidth: (minW || 120) + "px" }, [
      h("div", { display: "flex", justifyContent: "space-between", fontSize: "12px", color: C.muted }, [
        h("span", null, [label]),
        h("span", { color: C.text }, [num(value) + " / " + num(max)])
      ]),
      h("div", { height: "6px", background: C.line, borderRadius: "3px", marginTop: "3px" }, [
        h("div", { width: pct + "%", height: "6px", background: color, borderRadius: "3px" })
      ])
    ]);
  }

  function Row(k, v) {
    return h("div", { display: "flex", gap: "8px", fontSize: "12px", marginTop: "4px" }, [
      h("span", { color: C.muted, minWidth: "48px", flexShrink: "0" }, [k]),
      h("span", { color: C.text }, [v])
    ]);
  }

  function Box(kids) {
    return h("div", {
      background: C.bg, color: C.text, border: "1px solid " + C.line, borderRadius: "10px",
      padding: "12px", maxWidth: "560px", boxSizing: "border-box", fontFamily: FONT, lineHeight: "1.45",
      marginBottom: "8px", wordBreak: "keep-all", overflowWrap: "anywhere"
    }, kids);
  }

  /* ---------- 상태창 ---------- */
  function Card(raw, idx) {
    var f = raw.split("|").map(function (x) { return x.trim(); });
    if (f.length < 4) {
      return h("div", { fontSize: "12px", padding: "6px 8px", border: "1px solid " + C.line, borderRadius: "6px" }, [(idx + 1) + ". " + raw]);
    }
    var name = f[0], kind = f[1], attr = f[2], grade = f[3], atk = f[4], hp = f[5], cool = f[6], mana = f[7], state = f[8];
    var effect = f.slice(9).join(" | ");
    var ready = !state || state.indexOf("사용 가능") >= 0;
    var statLine = kind === "소환" && atk && atk !== "-" ? "공" + atk + " / 체" + hp : kind;
    return h("div", {
      padding: "6px 8px", border: "1px solid " + (ready ? C.line : C.cool), borderRadius: "6px",
      background: ready ? "transparent" : "rgba(240,181,74,0.08)"
    }, [
      h("div", { display: "flex", justifyContent: "space-between", gap: "6px" }, [
        h("span", { fontSize: "13px", color: C.text, fontWeight: "600" }, [(idx + 1) + ". " + name]),
        h("span", { fontSize: "11px", color: C[grade] || C.muted, fontWeight: "700", flexShrink: "0" }, [grade])
      ]),
      h("div", { fontSize: "11px", color: C.muted, marginTop: "2px" }, [
        attr + " · " + statLine + " · 쿨" + (cool || "-") + " · 마력" + (mana || "-")
      ]),
      h("div", { fontSize: "11px", marginTop: "2px", color: ready ? C.ok : C.cool }, [state || "사용 가능"]),
      effect ? h("div", { fontSize: "11px", marginTop: "3px", color: C.muted, borderTop: "1px solid " + C.line, paddingTop: "3px" }, [effect]) : null
    ]);
  }

  function StatusWindow(p) {
    var g = getter(p);
    var name = g("name", ""), cls = g("cls", ""), dorm = g("dorm", "");
    var date = g("date", ""), place = g("place", "");
    var items = list(g("items", "")), cards = list(g("cards", "")), bonds = list(g("bonds", "")), memo = list(g("memo", ""));
    return Box([
      h("div", { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }, [
        h("span", { fontWeight: "700" }, ["턴 " + num(g("turn", 1)) + (name ? " · " + name : "")]),
        h("span", { fontSize: "12px", color: C.muted }, ["협약력 300년 " + date + (place ? " · " + place : "")])
      ]),
      g("schedule", "") ? Row("일정", g("schedule", "")) : null,
      cls || dorm ? Row("소속", [cls, dorm ? "거처 " + dorm : ""].filter(Boolean).join(" · ")) : null,
      h("div", { display: "flex", gap: "12px", marginTop: "10px", flexWrap: "wrap" }, [
        Bar("마력", g("mp", 0), g("mpMax", 1), C.mp),
        Bar("정신력", g("sp", 0), g("spMax", 1), C.sp)
      ]),
      Row("상태", [g("cond", ""), num(g("money", 0)) + " 실링"].filter(Boolean).join(" · ")),
      items.length ? Row("아이템", items.join(", ")) : null,
      cards.length ? h("div", {
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "6px", marginTop: "10px"
      }, cards.slice(0, 7).map(Card)) : null,
      Row("주머니", g("pouch", "없음")),
      bonds.length ? Row("인연", bonds.join(" · ")) : null,
      memo.length ? h("div", {
        marginTop: "8px", paddingTop: "8px", borderTop: "1px solid " + C.line, fontSize: "12px", color: C.muted
      }, memo.map(function (m) { return h("div", null, ["- " + m]); })) : null
    ]);
  }

  /* ---------- 배틀창 ---------- */
  function Mon(raw) {
    var f = raw.split("|").map(function (x) { return x.trim(); });
    var name = f[0], atk = f[1], hpNow = f[2], hpFull = f[3], extra = f.slice(4).join(" | ");
    var hasHp = f.length >= 3;
    var pct = hasHp && hpFull ? Math.max(0, Math.min(100, (num(hpNow) / Math.max(1, num(hpFull))) * 100)) : null;
    return h("div", { minWidth: "118px", padding: "6px 8px", border: "1px solid " + C.line, borderRadius: "6px", background: C.slot }, [
      h("div", { fontSize: "12px", fontWeight: "600" }, [name]),
      hasHp ? h("div", { fontSize: "11px", color: C.muted }, ["공" + atk + " · 체" + hpNow + (hpFull ? "/" + hpFull : "")]) : null,
      pct !== null ? h("div", { height: "4px", background: C.line, borderRadius: "2px", marginTop: "3px" }, [
        h("div", { width: pct + "%", height: "4px", background: C.hp, borderRadius: "2px" })
      ]) : null,
      extra ? h("div", { fontSize: "11px", color: C.warn, marginTop: "2px" }, [extra]) : null
    ]);
  }

  function SetCard(raw) {
    return h("div", { fontSize: "12px", padding: "6px 8px", border: "1px solid " + C.line, borderRadius: "6px", background: C.slot }, [raw]);
  }

  function SlotRow(label, nodes, empty) {
    return h("div", { display: "flex", gap: "6px", alignItems: "flex-start", marginTop: "6px", flexWrap: "wrap" }, [
      h("span", { fontSize: "11px", color: C.muted, minWidth: "34px", paddingTop: "6px" }, [label])
    ].concat(nodes.length ? nodes : [
      h("span", { fontSize: "11px", color: C.muted, padding: "6px 8px", border: "1px dashed " + C.line, borderRadius: "6px" }, [empty])
    ]));
  }

  function BattleField(p) {
    var g = getter(p);
    var mode = g("mode", "duel");
    var hunt = mode.indexOf("hunt") >= 0 || mode.indexOf("마수") >= 0;
    var first = g("first", ""), injury = g("injury", ""), capture = g("capture", "");
    var tired = Math.max(0, Math.min(5, num(g("foeTired", 0))));
    var cool = list(g("cool", ""));
    var canCatch = capture.indexOf("가능") >= 0 && capture.indexOf("불") < 0;
    var me = g("me", "") || g("name", "");

    return Box([
      h("div", { display: "flex", justifyContent: "space-between", fontSize: "12px", color: C.muted, flexWrap: "wrap", gap: "6px" }, [
        h("span", { color: C.text, fontWeight: "700" }, [(hunt ? "마수전" : "인간전") + " · " + num(g("round", 1)) + "라운드"]),
        h("span", null, [g("side", "") + (first ? " · 선공 " + first : "")])
      ]),

      h("div", { marginTop: "10px" }, [
        h("div", { display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }, [
          h("span", { fontWeight: "700" }, [g("foe", "상대")]),
          hunt ? h("span", { fontSize: "12px", color: C.warn }, [
            g("foeState", "") + " · 지침 " + "■".repeat(tired) + "□".repeat(5 - tired)
          ]) : null
        ]),
        hunt ? null : h("div", { display: "flex", gap: "12px", marginTop: "6px", flexWrap: "wrap" }, [
          Bar("HP", g("foeHp", 5000), g("foeHpMax", 5000), C.hp, 110),
          Bar("마력", g("foeMp", 0), g("foeMpMax", 1), C.mp, 110)
        ]),
        hunt ? null : SlotRow("마법", list(g("foeSets", "")).map(SetCard), "빈 슬롯"),
        SlotRow(hunt ? "마수" : "몬스터", list(g("foeMons", "")).map(Mon), "빈 슬롯")
      ]),

      h("div", { borderTop: "1px solid " + C.line, margin: "12px 0" }),

      h("div", null, [
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
      try {
        wrap.appendChild(t.type === "StatusWindow" ? StatusWindow(t.props) : BattleField(t.props));
      } catch (e) {
        wrap.appendChild(h("pre", { fontSize: "11px", color: C.muted, whiteSpace: "pre-wrap" }, [String(e)]));
      }
    });
    return wrap;
  }

  function run() {
    if (document.body) { document.body.style.margin = "0"; document.body.style.background = "transparent"; }
    var done = false;

    // 1) <script type="text/plain" id="septima"> 안의 태그 글
    var srcs = document.querySelectorAll('script[type="text/plain"]');
    Array.prototype.forEach.call(srcs, function (s) {
      if (s.getAttribute("data-septima-done")) return;
      s.setAttribute("data-septima-done", "1");
      var tags = parseTags(s.textContent || "");
      if (!tags.length) return;
      s.parentNode.insertBefore(render(tags), s.nextSibling);
      done = true;
    });
    if (done) return;

    // 2) 태그가 HTML에 바로 들어간 경우 (요소 이름·속성이 소문자로 바뀌어 있다)
    var els = Array.prototype.filter.call(document.querySelectorAll("statuswindow, battlefield"), function (el) {
      return !el.getAttribute("data-septima-done");
    });
    if (!els.length) return;
    var tags = els.map(function (el) {
      el.setAttribute("data-septima-done", "1");
      var props = {};
      Array.prototype.forEach.call(el.attributes, function (a) {
        props[a.name] = a.value.replace(/^\{\s*["']?|["']?\s*\}$/g, "");
      });
      return { type: el.tagName.toLowerCase() === "statuswindow" ? "StatusWindow" : "BattleField", props: props };
    });
    // 닫히지 않은 태그는 서로 안에 들어가 있으므로, 맨 바깥 앞에 한꺼번에 그리고 원래 요소는 숨긴다
    els[0].parentNode.insertBefore(render(tags), els[0]);
    els.forEach(function (el) { el.style.display = "none"; });
  }

  if (typeof window !== "undefined") {
    window.SeptimaUI = { parseTags: parseTags, render: render, run: run };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
    else run();
  }
})();
