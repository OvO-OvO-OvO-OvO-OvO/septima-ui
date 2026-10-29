/* septima-ui v2 — 셉티마 상태창·배틀창. <StatusWindow …/> <BattleField …/> 태그 글을 읽어 화면을 그린다.
   그림: septima-assets 저장소 (card/C###.webp, mon/M###.webp, place/P###.webp, c/{인물}_{상황}.webp). 그림이 없으면 글만 그린다. */
(function () {
  "use strict";

  var ASSET = (typeof window !== "undefined" && window.SEPTIMA_ASSETS) || "https://cdn.jsdelivr.net/gh/OvO-OvO-OvO-OvO-OvO/septima-assets@main/";
  var MAPS = {"cards":{"불씨 도마뱀":"C001","물방울 수달":"C002","바람 참새":"C003","돌갑 거북":"C004","반딧불 정령":"C005","그림자 박쥐":"C006","견습 기사":"C007","훈련 골렘":"C008","전서 매":"C009","잉걸 사냥개":"C010","여울 가재":"C011","구름 양":"C012","자갈 두더지":"C013","등불 나비":"C014","밤길 고양이":"C015","불갈기 사냥개":"C016","물안개 해마":"C017","칼바람 제비":"C018","바윗등 산양":"C019","새벽빛 학":"C020","밤그늘 살쾡이":"C021","철심 수련 갑주":"C022","연습 허수아비":"C023","실기 시험 골렘":"C024","모의 마수 환영":"C025","녹슨 궤도 골렘":"C026","정석의 불도마뱀":"C027","황금 함성 사자":"C028","잿빛 깃 부엉이 정령":"C029","구조 각인 거상":"C030","은빛 맹약 기사":"C031","첫 결계의 문지기":"C032","마그마 브레이커":"C033","이슬 정령 방울":"C034","봉인 서가":"C035","무쇠갑 거북":"C036","일곱 고드름 파수병":"C037","아기 늑대 보리":"C038","추락의 그림자":"C039","엠버 임프 라이엇":"C040","미러 랜스":"C041","단조 골렘":"C042","잊힌 길의 등불":"C043","프로스트 바이트":"C044","유적 횃불 도마뱀":"C045","은방패 근위기사":"C046","흑요석 등갑 거북":"C047","청람 바람 정령":"C048","증기 해달":"C049","그랑 나이트":"C050","그랑 방패병":"C051","그랑 기마병":"C052","콜로세움 수호상":"C053","길드 철벽 골렘":"C054","발렌 가 바람매":"C055","막차 기관차":"C056","그랑 나이트 엑셀":"C057","영원한 견습 기사":"C058","폭풍의 발톱":"C059","숲지기 궁수":"C060","잎새 정령 사락":"C061","고목 정령 느티":"C062","바람 정령 피리":"C063","모래 왕의 석상":"C064","수호단의 태양 매":"C065","금단의 심장":"C066","온천 원숭이":"C067","화산 산양":"C068","불꽃왕 임프":"C069","증기 고래":"C070","늙은 모루 골렘":"C071","설원 썰매견":"C072","수비대 방패병":"C073","빙갑 기사":"C074","빙관의 망령":"C075","북벽의 수호자":"C076","광란의 마수":"C077","굶주린 봉인석":"C078","화염탄":"C079","물대포":"C080","돌풍":"C081","돌팔매":"C082","섬광탄":"C083","그림자 바늘":"C084","마력탄":"C085","화염 창":"C086","빙결 창":"C087","빙벽":"C088","돌벽":"C089","바람막이":"C090","마력 방벽":"C091","응급 치유":"C092","생명의 물":"C093","연막":"C094","가속":"C095","둔화":"C096","시간 지연":"C097","불꽃 파편":"C098","불길 번지기":"C099","불기둥":"C100","급류":"C101","회오리":"C102","땅울림":"C103","산사태":"C104","빛줄기":"C105","땅거미 늪":"C106","밤의 낫":"C107","안개비":"C108","순풍":"C109","새벽 햇살":"C110","치유의 빛":"C111","어둠 속 손":"C112","기초 수련 방패":"C113","끈끈이 덩어리":"C114","여우불 흩뿌리기":"C115","바위 돌진":"C116","번개 꼬리":"C117","피날레 불꽃":"C118","정지 선언":"C119","철수 호루라기":"C120","정화의 물결":"C121","반려 도장":"C122","포옹의 뿌리":"C123","전언 질풍":"C124","잿불 펀치":"C125","돌진 태클":"C126","마이크 하울링":"C127","빙결 연산":"C128","뒷자리 소문":"C129","거품 세탁":"C130","뒷골목 지름길":"C131","모래시계 룰렛":"C132","무결의 정오":"C133","매듭 푸는 바람":"C134","백증기 연격":"C135","절대 방벽":"C136","천리 바람살":"C137","그랑 성벽":"C138","콜로세움의 함성":"C139","정시 급행":"C140","잿불의 기억":"C141","산성 거품":"C142","떼 울음":"C143","까치 낚아채기":"C144","궤도 방전":"C145","절대 판정":"C146","명장면":"C147","오리진 프레스":"C148","위조 파쇄":"C149","노장의 한 수":"C150","숲의 속삭임":"C151","갈대 화살":"C152","연발 화살":"C153","이끼 이불":"C154","바람길 걸음":"C155","정령의 노래":"C156","바람신의 숨결":"C157","홀림 불빛":"C158","두꺼비 점액":"C159","영혼 울음":"C160","칼깃 비":"C161","숲의 가호":"C162","달빛 질주":"C163","폭풍 포효":"C164","고요한 화살":"C165","사막의 심판":"C166","미라지 미러":"C167","한낮의 신기루":"C168","태양 렌즈":"C169","사구 방벽":"C170","상회의 저울":"C171","모래 삼키기":"C172","환각 안개":"C173","수수께끼의 눈빛":"C174","황금 껍질":"C175","유리 독침":"C176","모래 잠행":"C177","꼬리 섬광":"C178","정보상의 귓속말":"C179","삽 끝의 금맥":"C180","샘 어멈의 장막":"C181","금화로 산 시간":"C182","역봉인":"C183","화산 폭발":"C184","파도 방벽":"C185","증기 분사":"C186","용암 분류":"C187","함포 일제사격":"C188","임프 불똥":"C189","해파리 마비침":"C190","서펜트 휘감기":"C191","흑요 독침":"C192","열수 돌진":"C193","골렘 용암 주먹":"C194","심해 압궤":"C195","불지기 축복":"C196","심연의 눈":"C197","얼음장 송별":"C198","북벽 뿔나팔":"C199","성채 빙벽":"C200","서리 송곳니":"C201","백색 시야":"C202","악몽 속삭임":"C203","서리 할퀴기":"C204","흉조 울음":"C205","얼음뿔 찌르기":"C206","빙원 진동":"C207","심연 기록":"C208","빙층 시추":"C209","피의 서약":"C210","산 제물":"C211","억지 봉인":"C212","마수 사슬":"C213","영혼 절단":"C214","강화 진":"C215","화덕의 온기":"C216","돌비늘 갑옷":"C217","해거름 휘장":"C218","관 승리 깃발":"C219","협약 300주년 문장":"C220","쿨 계측 모래시계":"C221","어지럼 인분":"C222","맹세의 성벽":"C223","협약의 저울":"C224","예산 동결":"C225","담금질":"C226","통금 결계":"C227","산파의 자장가":"C228","둥지 짓기":"C229","잠식 안개":"C230","화로의 담금질":"C231","스포트라이트":"C232","밤안개":"C233","상회의 금고":"C234","백야의 빙쇄":"C235","마그마 해자":"C236","삼중 석주 방진":"C237","협약의 종":"C238","기사단 진형":"C239","의사진행 발언":"C240","대지 서약 진":"C241","정령 마비 향":"C242","한낮의 그늘":"C243","붉은 모래 폭풍":"C244","돌의 맹세":"C245","재의 장막":"C246","심장 고동":"C247","와이번 재폭풍":"C248","불지기의 성화":"C249","용암 왕관":"C250","영원한 동토":"C251","눈보라 장막":"C252","극야의 장막":"C253","흡명":"C254","불멸의 서약":"C255","독안개":"C256","덫 그물":"C257","화염 지뢰":"C258","바람 덫":"C259","구덩이":"C260","눈부신 덫":"C261","어둠 족쇄":"C262","균열 해체 진":"C263","열람 금지":"C264","진흙 덫":"C265","전적 예측":"C266","그믐달 덫":"C267","절벽 매복":"C268","뿌리 감옥":"C269","땅 꺼짐":"C270","정령 올가미":"C271","개미지옥":"C272","돌손 붙잡기":"C273","사냥꾼 올가미":"C274","얼음 낚싯줄":"C275","눈먼 약속":"C276","반사 거울":"C277","역류":"C278","빛 가르기":"C279","가시털 반격":"C280","역풍 수읽기":"C281","심판의 빛":"C282","급정거":"C283","서리꽃 매듭":"C284","훔친 페이지":"C285","항구의 오기":"C286","오로라 체인":"C287","저지의 호루라기":"C288","결계 잔광":"C289","판정 보류":"C290","전적 대조":"C291","기사의 서약":"C292","호수 물보라":"C293","수호단 문양":"C294","그늘 계약":"C295","흑요석 방패":"C296","불꽃 판정":"C297","이그니스 왕명":"C298","늑대의 귀":"C299","예지몽":"C300","점화":"C301","미풍":"C302","정수":"C303","조명":"C304","냉각":"C305","보온":"C306","세척":"C307","건조":"C308","전언":"C309","지혈":"C310","해독":"C311","진정":"C312","석조":"C313","목조":"C314","방범 결계":"C315","수리":"C316","부양":"C317","탐지":"C318","방수":"C319","숙면":"C320","가열":"C321","소각":"C322","경작":"C323","굴착":"C324","확대":"C325","은신":"C326","경량":"C327","시간표 알림":"C328","결투 기록":"C329","자기 진단":"C330","속성 판별 구슬":"C331","마력 계측판":"C332","비상 신호탄":"C333","부정행위 감지 등":"C334","가격표":"C335","가마솥 불":"C336","시보":"C337","감정 돋보기":"C338","낙찰 도장":"C339","중계 확성":"C340","필사":"C341","숲길 표식":"C342","모래 걸러내기":"C343","물길 찾기":"C344","모래 가리개":"C345","한눈 감정":"C346","봉인 위조":"C347","가면의 목소리":"C348","사냥꾼의 모닥불":"C349","온천 찜질":"C350","단조 불꽃":"C351","길잡이 등불":"C352","얼음 구멍":"C353","기억 지우개":"C354"},"monsters":{"고대 빙룡":"M001","흑빙 까마귀":"M002","블리자드 위스프":"M003","서리 담비":"M004","프로스트 울프":"M005","빙하 매머드":"M006","빙각 순록":"M007","나이트메어 스펙터":"M008","잿빛 와이번":"M009","심해 리바이어던":"M010","엠버 임프":"M011","마그마 골렘":"M012","흑요 전갈":"M013","증기 해파리":"M014","타이달 서펜트":"M015","열수 상어":"M016","칼깃 매":"M017","엔트 가디언":"M018","이끼 두꺼비":"M019","뿌리갉이 두더지":"M020","은뿔 사슴":"M021","소울 울프":"M022","폭풍 드레이크":"M023","윌로우 위습":"M024","불씨 여우":"M025","동전 까치":"M026","숲 슬라임":"M027","안개 나방":"M028","궤도 장어":"M029","틈새 갑주":"M030","바위 멧돼지":"M031","하수구 슬라임":"M032","들개 울프":"M033","가시 토끼":"M034","번개 족제비":"M035","유리 전갈":"M036","황금 스카라베":"M037","빛꼬리 자칼":"M038","미라지 팬텀":"M039","모래 가오리":"M040","샌드웜":"M041","스핑크스 가디언":"M042","돌손 파수병":"M043"},"places":{"중앙 본관":"P001","강의동":"P002","제1결투장 (공인)":"P003","제2결투장 (연습)":"P004","봉인 공방":"P005","도서관과 금서고":"P006","기숙사 지구":"P007","의무실과 정신 회복실":"P008","E반 별관":"P009","사육장과 실습 관리소":"P010","금지 숲":"P011","상점가 (아카데미 타운)":"P012","정문과 정문 레일역":"P013","이그니스관":"P014","엘드리온관":"P015","사르카관":"P016","노아관":"P017","그랑 캐피탈 (수도)":"P018","아카데미 타운":"P019","레일 마을":"P020","정적 마을 노엔":"P021","잿빛 평원":"P022","그랑강 강변":"P023","수도 하수도":"P024","엘드리아 (수도)":"P025","루엔 마을":"P026","바람 언덕 케일":"P027","뿌리 마을 모르":"P028","바람의 요람 (성역)":"P029","사르카 (수도)":"P030","오아시스 마을 나기":"P031","모래 마을 제크":"P032","잊힌 도시 유적군":"P033","이그니스 항구 (왕도)":"P034","마그마 마을":"P035","파도 마을 셀":"P036","잿빛 마을 애쉬":"P037","심장산과 화산 심장 신전":"P038","노아 성채 (수도)":"P039","빙하 마을 루크 (입구 마을)":"P040","오로라 마을":"P041","심연 전초기지":"P042","콜로세움 제1경기장":"P043","원탁관":"P044","카드 거래소":"P045","망치 거리":"P046","저지 사무국":"P047","실밥 골목":"P048","구 성벽 터":"P049","중앙역":"P050","그랑강 철교":"P051","도시락 골목":"P052","노엔 결투장 (콜로세움 제12경기장)":"P053","일곱째 잔 찻집":"P054","바람 전당":"P055","물잎 거리":"P056","천년 느티나무":"P057","바람 광장":"P058","큰 느릅나무":"P059","테이머 조합 사육장":"P060","버들 늪":"P061","케일 수련장":"P062","절벽 결투장":"P063","드레이크 둥지 바위":"P064","뿌리 공방 거리":"P065","여관 흙잔":"P066","황금 저울 회관 (햇살층)":"P067","모래 기억관 (저울층)":"P068","검은 우물 시장 (그늘층)":"P069","모래판 (그늘층)":"P070","빈 저울 찻집 (저울층)":"P071","샘 사원":"P072","세 번째 잔 여관":"P073","나기 물 보급역":"P074","삽자루 회관":"P075","한눈 감정소":"P076","유리 공방 거리":"P077","제크 결투장":"P078","문지기 바위":"P079","첫 삽 야영지":"P080","문지기 부족 굴 마을":"P081","사냥꾼 길드 본부 '붉은 탑'":"P082","이그니스 경매장":"P083","붉은 성":"P084","증기 골목":"P085","7번 부두":"P086","대장간 거리":"P087","붉은 온천":"P088","용암 계단 수련장":"P089","가라앉은 유적":"P090","파도 방벽 공방":"P091","셀 등대":"P092","순례길 입구":"P093","재 시장":"P094","99계단":"P095","천장화의 방":"P096","심장실 문":"P097","북벽":"P098","기록탑":"P099","하얀 장화 물자점":"P100","수비대 식당":"P101","빙판 결투장":"P102","지하 빙고 입구":"P103","루크역 온기 대합실":"P104","열두 발 썰매 대여소":"P105","가이드 조합 날씨판":"P106","얼음 호수 결투장":"P107","실 꿰는 골목":"P108","검은 얼음 동굴":"P109","별 관측대":"P110","관측탑":"P111","봉인석 동굴":"P112","심연 협곡":"P113"},"people":{"아누":"anu","바르톨":"bartol","브란":"bran","콜":"col","엘리":"elly","피오":"fio","그랑 3세":"grand","하넬":"hanel","이다":"ida","죠":"jo","키리":"kiri","루카":"luka","메리":"meri","니벨":"nibel","오웬":"owen","리나":"rina","샤크":"shark","소라":"sora","티엘":"tiel","볼프":"volf","아르델":"ardel","바즈":"baz","칼데라":"caldera","덴":"den","에녹":"enoch","프리다":"frida","그림":"grim","하르츠":"harz","이그나시오":"ignacio","카엘":"kael","리프":"leaf","마벨":"mabel","미로":"miro","노엘":"noel","펠":"pel","로엔":"roen","슈아":"shua","타냐":"tanya","반":"van","유키":"yuki","아리아":"aria","베아":"bea","클락":"clark","도일":"doil","페이":"fay","가론":"garon","구스타프":"gustav","헤이즈":"haze","이졸데":"isolde","카심":"kasim","레비":"levi","마그나":"magna","모모":"momo","오드":"ord","포포":"popo","세인":"sain","시온":"sion","타리크":"tariq","베일":"veil","유나":"yuna","아샤":"asha","비비":"bibi","코일":"coil","돌프":"dolf","핀":"fin","가츠":"gatz","홀":"hall","화로":"hwaro","지니":"jini","키드":"kid","라임":"lime","마루":"maru","나디아":"nadia","오스카":"oscar","렌":"ren","세드":"sed","솔":"sol","테오":"teo","베르":"verr","자라":"zara"}};
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
        h("div", { width: "34px", height: "34px", borderRadius: "6px", flexShrink: "0", background: ac + "33", overflow: "hidden" }, [
          img(cardArt(name), { width: "100%", height: "100%", objectFit: "cover" })
        ]),
        h("div", { flex: "1", minWidth: "0" }, [
          h("div", { display: "flex", justifyContent: "space-between", gap: "6px" }, [
            h("span", { fontSize: "13px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, [name]),
            h("span", { fontSize: "11px", color: gc, fontWeight: "700", flexShrink: "0" }, [grade])
          ]),
          h("div", { fontSize: "11px", color: C.muted }, [
            h("span", { color: ac }, [attr]), " · " + stat + " · ",
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
