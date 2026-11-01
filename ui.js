/* septima-ui v4 — 셉티마 상태창·배틀창. <StatusWindow …/> <BattleField …/> 태그 글을 읽어 화면을 그린다.
   그림: septima-assets 저장소 (c/{인물}_1.webp, mon/M###.webp, place/P###.webp, card/back.webp, icon/*.webp). 그림이 없으면 글만 그린다. */
(function () {
  "use strict";

  var ASSET = (typeof window !== "undefined" && window.SEPTIMA_ASSETS) || "https://cdn.jsdelivr.net/gh/OvO-OvO-OvO-OvO-OvO/septima-assets@main/";
  var MAPS = {"cards":{"불씨 도마뱀":"C001","물방울 수달":"C002","바람 참새":"C003","돌갑 거북":"C004","반딧불 정령":"C005","그림자 박쥐":"C006","견습 기사":"C007","훈련 골렘":"C008","전서 매":"C009","잉걸 사냥개":"C010","여울 가재":"C011","구름 양":"C012","자갈 두더지":"C013","등불 나비":"C014","밤길 고양이":"C015","불갈기 사냥개":"C016","물안개 해마":"C017","칼바람 제비":"C018","바윗등 산양":"C019","새벽빛 학":"C020","밤그늘 살쾡이":"C021","철심 수련 갑주":"C022","연습 허수아비":"C023","실기 시험 골렘":"C024","모의 마수 환영":"C025","녹슨 궤도 골렘":"C026","정석의 불도마뱀":"C027","황금 함성 사자":"C028","잿빛 깃 부엉이 정령":"C029","구조 각인 거상":"C030","은빛 맹약 기사":"C031","첫 결계의 문지기":"C032","마그마 브레이커":"C033","이슬 정령 방울":"C034","봉인 서가":"C035","무쇠갑 거북":"C036","일곱 고드름 파수병":"C037","아기 늑대 보리":"C038","추락의 그림자":"C039","엠버 임프 라이엇":"C040","미러 랜스":"C041","단조 골렘":"C042","잊힌 길의 등불":"C043","프로스트 바이트":"C044","유적 횃불 도마뱀":"C045","은방패 근위기사":"C046","흑요석 등갑 거북":"C047","청람 바람 정령":"C048","증기 해달":"C049","그랑 나이트":"C050","그랑 방패병":"C051","그랑 기마병":"C052","콜로세움 수호상":"C053","길드 철벽 골렘":"C054","발렌 가 바람매":"C055","막차 기관차":"C056","그랑 나이트 엑셀":"C057","영원한 견습 기사":"C058","폭풍의 발톱":"C059","숲지기 궁수":"C060","잎새 정령 사락":"C061","고목 정령 느티":"C062","바람 정령 피리":"C063","모래 왕의 석상":"C064","수호단의 태양 매":"C065","금단의 심장":"C066","온천 원숭이":"C067","화산 산양":"C068","불꽃왕 임프":"C069","증기 고래":"C070","늙은 모루 골렘":"C071","설원 썰매견":"C072","수비대 방패병":"C073","빙갑 기사":"C074","빙관의 망령":"C075","북벽의 수호자":"C076","광란의 마수":"C077","굶주린 봉인석":"C078","화염탄":"C079","물대포":"C080","돌풍":"C081","돌팔매":"C082","섬광탄":"C083","그림자 바늘":"C084","마력탄":"C085","화염 창":"C086","빙결 창":"C087","빙벽":"C088","돌벽":"C089","바람막이":"C090","마력 방벽":"C091","응급 치유":"C092","생명의 물":"C093","연막":"C094","가속":"C095","둔화":"C096","시간 지연":"C097","불꽃 파편":"C098","불길 번지기":"C099","불기둥":"C100","급류":"C101","회오리":"C102","땅울림":"C103","산사태":"C104","빛줄기":"C105","땅거미 늪":"C106","밤의 낫":"C107","안개비":"C108","순풍":"C109","새벽 햇살":"C110","치유의 빛":"C111","어둠 속 손":"C112","기초 수련 방패":"C113","끈끈이 덩어리":"C114","여우불 흩뿌리기":"C115","바위 돌진":"C116","번개 꼬리":"C117","피날레 불꽃":"C118","정지 선언":"C119","철수 호루라기":"C120","정화의 물결":"C121","반려 도장":"C122","포옹의 뿌리":"C123","전언 질풍":"C124","잿불 펀치":"C125","돌진 태클":"C126","마이크 하울링":"C127","빙결 연산":"C128","뒷자리 소문":"C129","거품 세탁":"C130","뒷골목 지름길":"C131","모래시계 룰렛":"C132","무결의 정오":"C133","매듭 푸는 바람":"C134","백증기 연격":"C135","절대 방벽":"C136","천리 바람살":"C137","그랑 성벽":"C138","콜로세움의 함성":"C139","정시 급행":"C140","잿불의 기억":"C141","산성 거품":"C142","떼 울음":"C143","까치 낚아채기":"C144","궤도 방전":"C145","절대 판정":"C146","명장면":"C147","오리진 프레스":"C148","위조 파쇄":"C149","노장의 한 수":"C150","숲의 속삭임":"C151","갈대 화살":"C152","연발 화살":"C153","이끼 이불":"C154","바람길 걸음":"C155","정령의 노래":"C156","바람신의 숨결":"C157","홀림 불빛":"C158","두꺼비 점액":"C159","영혼 울음":"C160","칼깃 비":"C161","숲의 가호":"C162","달빛 질주":"C163","폭풍 포효":"C164","고요한 화살":"C165","사막의 심판":"C166","미라지 미러":"C167","한낮의 신기루":"C168","태양 렌즈":"C169","사구 방벽":"C170","상회의 저울":"C171","모래 삼키기":"C172","환각 안개":"C173","수수께끼의 눈빛":"C174","황금 껍질":"C175","유리 독침":"C176","모래 잠행":"C177","꼬리 섬광":"C178","정보상의 귓속말":"C179","삽 끝의 금맥":"C180","샘 어멈의 장막":"C181","금화로 산 시간":"C182","역봉인":"C183","화산 폭발":"C184","파도 방벽":"C185","증기 분사":"C186","용암 분류":"C187","함포 일제사격":"C188","임프 불똥":"C189","해파리 마비침":"C190","서펜트 휘감기":"C191","흑요 독침":"C192","열수 돌진":"C193","골렘 용암 주먹":"C194","심해 압궤":"C195","불지기 축복":"C196","심연의 눈":"C197","얼음장 송별":"C198","북벽 뿔나팔":"C199","성채 빙벽":"C200","서리 송곳니":"C201","백색 시야":"C202","악몽 속삭임":"C203","서리 할퀴기":"C204","흉조 울음":"C205","얼음뿔 찌르기":"C206","빙원 진동":"C207","심연 기록":"C208","빙층 시추":"C209","피의 서약":"C210","산 제물":"C211","억지 봉인":"C212","마수 사슬":"C213","영혼 절단":"C214","강화 진":"C215","화덕의 온기":"C216","돌비늘 갑옷":"C217","해거름 휘장":"C218","관 승리 깃발":"C219","협약 300주년 문장":"C220","쿨 계측 모래시계":"C221","어지럼 인분":"C222","맹세의 성벽":"C223","협약의 저울":"C224","예산 동결":"C225","담금질":"C226","통금 결계":"C227","산파의 자장가":"C228","둥지 짓기":"C229","잠식 안개":"C230","화로의 담금질":"C231","스포트라이트":"C232","밤안개":"C233","상회의 금고":"C234","백야의 빙쇄":"C235","마그마 해자":"C236","삼중 석주 방진":"C237","협약의 종":"C238","기사단 진형":"C239","의사진행 발언":"C240","대지 서약 진":"C241","정령 마비 향":"C242","한낮의 그늘":"C243","붉은 모래 폭풍":"C244","돌의 맹세":"C245","재의 장막":"C246","심장 고동":"C247","와이번 재폭풍":"C248","불지기의 성화":"C249","용암 왕관":"C250","영원한 동토":"C251","눈보라 장막":"C252","극야의 장막":"C253","흡명":"C254","불멸의 서약":"C255","독안개":"C256","덫 그물":"C257","화염 지뢰":"C258","바람 덫":"C259","구덩이":"C260","눈부신 덫":"C261","어둠 족쇄":"C262","균열 해체 진":"C263","열람 금지":"C264","진흙 덫":"C265","전적 예측":"C266","그믐달 덫":"C267","절벽 매복":"C268","뿌리 감옥":"C269","땅 꺼짐":"C270","정령 올가미":"C271","개미지옥":"C272","돌손 붙잡기":"C273","사냥꾼 올가미":"C274","얼음 낚싯줄":"C275","눈먼 약속":"C276","반사 거울":"C277","역류":"C278","빛 가르기":"C279","가시털 반격":"C280","역풍 수읽기":"C281","심판의 빛":"C282","급정거":"C283","서리꽃 매듭":"C284","훔친 페이지":"C285","항구의 오기":"C286","오로라 체인":"C287","저지의 호루라기":"C288","결계 잔광":"C289","판정 보류":"C290","전적 대조":"C291","기사의 서약":"C292","호수 물보라":"C293","수호단 문양":"C294","그늘 계약":"C295","흑요석 방패":"C296","불꽃 판정":"C297","이그니스 왕명":"C298","늑대의 귀":"C299","예지몽":"C300","점화":"C301","미풍":"C302","정수":"C303","조명":"C304","냉각":"C305","보온":"C306","세척":"C307","건조":"C308","전언":"C309","지혈":"C310","해독":"C311","진정":"C312","석조":"C313","목조":"C314","방범 결계":"C315","수리":"C316","부양":"C317","탐지":"C318","방수":"C319","숙면":"C320","가열":"C321","소각":"C322","경작":"C323","굴착":"C324","확대":"C325","은신":"C326","경량":"C327","시간표 알림":"C328","결투 기록":"C329","자기 진단":"C330","속성 판별 구슬":"C331","마력 계측판":"C332","비상 신호탄":"C333","부정행위 감지 등":"C334","가격표":"C335","가마솥 불":"C336","시보":"C337","감정 돋보기":"C338","낙찰 도장":"C339","중계 확성":"C340","필사":"C341","숲길 표식":"C342","모래 걸러내기":"C343","물길 찾기":"C344","모래 가리개":"C345","한눈 감정":"C346","봉인 위조":"C347","가면의 목소리":"C348","사냥꾼의 모닥불":"C349","온천 찜질":"C350","단조 불꽃":"C351","길잡이 등불":"C352","얼음 구멍":"C353","기억 지우개":"C354"},"monsters":{"고대 빙룡":"M001","흑빙 까마귀":"M002","블리자드 위스프":"M003","서리 담비":"M004","프로스트 울프":"M005","빙하 매머드":"M006","빙각 순록":"M007","나이트메어 스펙터":"M008","잿빛 와이번":"M009","심해 리바이어던":"M010","엠버 임프":"M011","마그마 골렘":"M012","흑요 전갈":"M013","증기 해파리":"M014","타이달 서펜트":"M015","열수 상어":"M016","칼깃 매":"M017","엔트 가디언":"M018","이끼 두꺼비":"M019","뿌리갉이 두더지":"M020","은뿔 사슴":"M021","소울 울프":"M022","폭풍 드레이크":"M023","윌로우 위습":"M024","불씨 여우":"M025","동전 까치":"M026","숲 슬라임":"M027","안개 나방":"M028","궤도 장어":"M029","틈새 갑주":"M030","바위 멧돼지":"M031","하수구 슬라임":"M032","들개 울프":"M033","가시 토끼":"M034","번개 족제비":"M035","유리 전갈":"M036","황금 스카라베":"M037","빛꼬리 자칼":"M038","미라지 팬텀":"M039","모래 가오리":"M040","샌드웜":"M041","스핑크스 가디언":"M042","돌손 파수병":"M043"},"places":{"중앙 본관":"P001","강의동":"P002","제1결투장 (공인)":"P003","제2결투장 (연습)":"P004","봉인 공방":"P005","도서관과 금서고":"P006","기숙사 지구":"P007","의무실과 정신 회복실":"P008","E반 별관":"P009","사육장과 실습 관리소":"P010","금지 숲":"P011","상점가 (아카데미 타운)":"P012","정문과 정문 레일역":"P013","이그니스관":"P014","엘드리온관":"P015","사르카관":"P016","노아관":"P017","그랑 캐피탈 (수도)":"P018","아카데미 타운":"P019","레일 마을":"P020","정적 마을 노엔":"P021","잿빛 평원":"P022","그랑강 강변":"P023","수도 하수도":"P024","엘드리아 (수도)":"P025","루엔 마을":"P026","바람 언덕 케일":"P027","뿌리 마을 모르":"P028","바람의 요람 (성역)":"P029","사르카 (수도)":"P030","오아시스 마을 나기":"P031","모래 마을 제크":"P032","잊힌 도시 유적군":"P033","이그니스 항구 (왕도)":"P034","마그마 마을":"P035","파도 마을 셀":"P036","잿빛 마을 애쉬":"P037","심장산과 화산 심장 신전":"P038","노아 성채 (수도)":"P039","빙하 마을 루크 (입구 마을)":"P040","오로라 마을":"P041","심연 전초기지":"P042","콜로세움 제1경기장":"P043","원탁관":"P044","카드 거래소":"P045","망치 거리":"P046","저지 사무국":"P047","실밥 골목":"P048","구 성벽 터":"P049","중앙역":"P050","그랑강 철교":"P051","도시락 골목":"P052","노엔 결투장 (콜로세움 제12경기장)":"P053","일곱째 잔 찻집":"P054","바람 전당":"P055","물잎 거리":"P056","천년 느티나무":"P057","바람 광장":"P058","큰 느릅나무":"P059","테이머 조합 사육장":"P060","버들 늪":"P061","케일 수련장":"P062","절벽 결투장":"P063","드레이크 둥지 바위":"P064","뿌리 공방 거리":"P065","여관 흙잔":"P066","황금 저울 회관 (햇살층)":"P067","모래 기억관 (저울층)":"P068","검은 우물 시장 (그늘층)":"P069","모래판 (그늘층)":"P070","빈 저울 찻집 (저울층)":"P071","샘 사원":"P072","세 번째 잔 여관":"P073","나기 물 보급역":"P074","삽자루 회관":"P075","한눈 감정소":"P076","유리 공방 거리":"P077","제크 결투장":"P078","문지기 바위":"P079","첫 삽 야영지":"P080","문지기 부족 굴 마을":"P081","사냥꾼 길드 본부 '붉은 탑'":"P082","이그니스 경매장":"P083","붉은 성":"P084","증기 골목":"P085","7번 부두":"P086","대장간 거리":"P087","붉은 온천":"P088","용암 계단 수련장":"P089","가라앉은 유적":"P090","파도 방벽 공방":"P091","셀 등대":"P092","순례길 입구":"P093","재 시장":"P094","99계단":"P095","천장화의 방":"P096","심장실 문":"P097","북벽":"P098","기록탑":"P099","하얀 장화 물자점":"P100","수비대 식당":"P101","빙판 결투장":"P102","지하 빙고 입구":"P103","루크역 온기 대합실":"P104","열두 발 썰매 대여소":"P105","가이드 조합 날씨판":"P106","얼음 호수 결투장":"P107","실 꿰는 골목":"P108","검은 얼음 동굴":"P109","별 관측대":"P110","관측탑":"P111","봉인석 동굴":"P112","심연 협곡":"P113"},"people":{"아누":"anu","아르델":"ardel","아리아":"aria","아샤":"asha","바르톨":"bartol","바즈":"baz","베아":"bea","비비":"bibi","브란":"bran","칼데라":"caldera","클락":"clark","코일":"coil","콜":"col","단야":"danya","델리아":"delia","덴":"den","도일":"doil","돌프":"dolf","엘리":"elly","에녹":"enoch","엔조":"enzo","페이":"fay","핀":"fin","피오":"fio","프리다":"frida","가론":"garon","가츠":"gatz","젬마":"gemma","그랑 3세":"grand","그림":"grim","군나르":"gunnar","구스타프":"gustav","홀":"hall","하넬":"hanel","하르츠":"harz","헤이즈":"haze","화로":"hwaro","이다":"ida","이그나시오 4세":"ignacio","잉그리드":"ingrid","이졸데":"isolde","지니":"jini","죠":"jo","후아나":"juana","카엘":"kael","카심":"kasim","키드":"kid","키리":"kiri","리프":"leaf","레비":"levi","라임":"lime","루카":"luka","마벨":"mabel","마그나":"magna","마루":"maru","메리":"meri","미로":"miro","모모":"momo","무스타파":"mustafa","미르":"myr","나디아":"nadia","니벨":"nibel","노엘":"noel","오드":"ord","오스카":"oscar","오웬":"owen","팔로마":"paloma","펠":"pel","포포":"popo","라몬":"ramon","렌":"ren","리나":"rina","로엔":"roen","세인":"sain","세드":"sed","샤크":"shark","슈아":"shua","시온":"sion","스카디":"skadi","솔":"sol","소라":"sora","타냐":"tanya","타리크":"tariq","테오":"teo","티엘":"tiel","반":"van","베일":"veil","베르":"verr","볼프":"volf","왈리드":"walid","야신":"yasin","유키":"yuki","유나":"yuna","자라":"zara","이그나시오":"ignacio"}};
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
