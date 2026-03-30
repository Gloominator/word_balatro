/**
 * Onboarding tutorial: localStorage persistence, spotlight UI, [?] replay up to max dismissed stage id.
 */

const STORAGE_KEY = "wordmath-tutorial-v1";

const STAGE_COPY = {
  en: {
    proTip: "Pro tip",
    helpTitle: "Tips & tutorials",
    helpSubtitle: "Replay any step you've already finished.",
    helpClose: "Close",
    helpPickLabel: "Jump to step",
    stageLabel: (n) => `Step ${n}`,
    1: {
      title: "Welcome to King Minus Man!",
      body: "You mix words on the field to create new words. Your goal is to find the quest word. Try mixing your first pair!",
      tip: "You can mix a word with itself (double-click or drag a tile onto its twin).",
      cta: "Sweet — let's mix",
    },
    2: {
      title: "Mind your INK",
      body: "Every mix spends INK. Think about the direction you want to go. Out of ideas? Hit Word Booster for fresh words.",
      tip: "Your first Word Booster roll each stage is always free!",
      cta: "Got it",
    },
    3: {
      title: "Tokens change the recipe",
      body: "Normally, mixing two words gives you the first result in the top matches table. Tokens let you change which matches you see and which rank (2nd, 3rd, …) you get. Try dragging a token onto a word on the field!",
      tip: 'Tokens can be bought in "Purchase Tokens".',
      cta: "Will do",
    },
    4: {
      title: "Wow! Good job!",
      body: "Each stage, you'll work through categories in the encyclopedia - 16 categories with 5 words each. Mixing words from the encyclopedia grants bonus tokens!",
      tip: "Peek at the Encyclopedia button in the top bar when you need a reminder.",
      cta: "Nice",
    },
    5: {
      title: "Bonus city",
      body: 'Woah! You hit a bonus pick! Those hand out tokens for free and skip the INK cost. Free real estate!',
      tip: "Hunt for the sparkly chips in the top matches list.",
      cta: "Love it",
    },
  },
  ru: {
    proTip: "Совет",
    helpTitle: "Подсказки",
    helpSubtitle: "Повтор шагов, которые вы уже прошли.",
    helpClose: "Закрыть",
    helpPickLabel: "Перейти к шагу",
    stageLabel: (n) => `Шаг ${n}`,
    1: {
      title: "Добро пожаловать в King Minus Man!",
      body: "Смешивайте слова на поле, чтобы получать новые. Цель — найти слово квеста. Смешайте первую пару!",
      tip: "Слово можно смешать само с собой (двойной клик или перетаскивание).",
      cta: "Понял, вперёд",
    },
    2: {
      title: "Следите за чернилами",
      body: "Каждое смешивание тратит чернила. Думайте, куда идёте. Нет слов — нажмите Word Booster.",
      tip: "Первый Word Booster в этапе всегда бесплатный!",
      cta: "Понял",
    },
    3: {
      title: "Жетоны меняют результат",
      body: "Обычно при смешивании двух слов берётся первое из топ-совпадений. Жетоны меняют, какие совпадения видны и какой по счёту результат получите. Перетащите жетон на слово на поле!",
      tip: 'Купить жетоны можно в «Purchase Tokens».',
      cta: "Ок",
    },
    4: {
      title: "Ура, отлично!",
      body: "На каждом этапе нужно закрывать категории энциклопедии — 16 категорий по 5 слов. Смешивание слов из энциклопедии даёт бонусные жетоны!",
      tip: "Кнопка Encyclopedia наверху — заглядывайте, когда нужно освежить картину.",
      cta: "Класс",
    },
    5: {
      title: "Бонус!",
      body: "Ух ты, бонусный вариант! Жетоны бесплатно, чернила не тратятся. Подарок!",
      tip: "Ищите блестящие метки в топ-совпадениях.",
      cta: "Огонь",
    },
  },
};

let api = null;
let layerRoot = null;
let spotlightBackdrop = null;
let spotlightInteractBlocker = null;
let spotlightCard = null;
let boosterArrowEl = null;
let encArrowEl = null;
let ghostHandEl = null;
let helpBackdrop = null;
let helpCard = null;
let focusRestoreEl = null;

let tutorialState = { dismissed: [] };
let stageQueue = [];
let activeStage = null;
let replayMode = false;

/** @type {number[]} */
let stage1HighlightTileIds = [];
/** After closing step 1 card, keep starter highlights until the first mix from the field. */
let stage1AwaitingMixAfterWelcome = false;

function copyFor(lang) {
  return STAGE_COPY[lang === "ru" ? "ru" : "en"];
}

function loadTutorialState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { dismissed: [] };
    }
    const p = JSON.parse(raw);
    const dismissed = Array.isArray(p.dismissed)
      ? [...new Set(p.dismissed.map(Number).filter((n) => n >= 1 && n <= 5))].sort((a, b) => a - b)
      : [];
    return { dismissed };
  } catch {
    return { dismissed: [] };
  }
}

function saveTutorialState() {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        dismissed: tutorialState.dismissed,
      }),
    );
  } catch {
    /* ignore */
  }
}

function isDismissed(stage) {
  return tutorialState.dismissed.includes(stage);
}

function markDismissed(stage) {
  if (isDismissed(stage)) {
    return;
  }
  tutorialState.dismissed.push(stage);
  tutorialState.dismissed.sort((a, b) => a - b);
  saveTutorialState();
}

function maxReplayStage() {
  if (!tutorialState.dismissed.length) {
    return 0;
  }
  return Math.max(...tutorialState.dismissed);
}

function enqueueStages(stages) {
  const add = stages.filter((s) => s >= 1 && s <= 5 && !isDismissed(s));
  for (const s of add) {
    if (!stageQueue.includes(s)) {
      stageQueue.push(s);
    }
  }
  flushStageQueue();
}

function flushStageQueue() {
  if (activeStage || !stageQueue.length) {
    return;
  }
  const next = stageQueue.shift();
  showSpotlightStage(next, { replay: false });
}

function ensureLayer() {
  if (layerRoot) {
    return;
  }
  layerRoot = document.createElement("div");
  layerRoot.className = "wordmath-tutorial-layer";
  layerRoot.setAttribute("hidden", "");

  spotlightBackdrop = document.createElement("div");
  spotlightBackdrop.className = "wordmath-tutorial-spotlight-dim";

  spotlightInteractBlocker = document.createElement("div");
  spotlightInteractBlocker.className = "wordmath-tutorial-interact-block";
  spotlightInteractBlocker.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  spotlightCard = document.createElement("div");
  spotlightCard.className = "wordmath-tutorial-card";
  spotlightCard.setAttribute("role", "dialog");
  spotlightCard.setAttribute("aria-modal", "true");

  boosterArrowEl = document.createElement("div");
  boosterArrowEl.className = "wordmath-tutorial-arrow wordmath-tutorial-arrow--booster";
  boosterArrowEl.setAttribute("aria-hidden", "true");
  boosterArrowEl.hidden = true;

  encArrowEl = document.createElement("div");
  encArrowEl.className = "wordmath-tutorial-arrow wordmath-tutorial-arrow--encyclopedia";
  encArrowEl.hidden = true;

  ghostHandEl = document.createElement("div");
  ghostHandEl.className = "wordmath-tutorial-ghost-hand";
  ghostHandEl.setAttribute("aria-hidden", "true");
  ghostHandEl.innerHTML = "👆";
  ghostHandEl.hidden = true;

  layerRoot.append(
    spotlightBackdrop,
    spotlightInteractBlocker,
    spotlightCard,
  );
  document.body.append(layerRoot);
  document.body.append(boosterArrowEl);
  document.body.append(encArrowEl);
  document.body.append(ghostHandEl);

  helpBackdrop = document.createElement("div");
  helpBackdrop.className = "modal-backdrop wordmath-tutorial-help-backdrop";
  helpBackdrop.hidden = true;
  helpCard = document.createElement("section");
  helpCard.className = "modal-card wordmath-tutorial-help-card";
  helpCard.setAttribute("role", "dialog");
  helpCard.setAttribute("aria-modal", "true");
  helpBackdrop.append(helpCard);
  document.body.append(helpBackdrop);

  helpBackdrop.addEventListener("click", (e) => {
    if (e.target === helpBackdrop) {
      closeHelpMenu();
    }
  });
}

function setLayerVisible(v) {
  ensureLayer();
  bindTutorialResizeOnce();
  if (v) {
    layerRoot.removeAttribute("hidden");
    window.requestAnimationFrame(() => updateBlockerGeometry());
  } else {
    layerRoot.setAttribute("hidden", "");
  }
}

function buildProTipRow(tipText, idSuffix, proTipLabel) {
  const wrap = document.createElement("div");
  wrap.className = "wordmath-tutorial-pro-tip";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "wordmath-tutorial-pro-tip-trigger";
  btn.textContent = proTipLabel || "Pro tip";
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", `tutorial-tip-${idSuffix}`);

  const panel = document.createElement("div");
  panel.id = `tutorial-tip-${idSuffix}`;
  panel.className = "wordmath-tutorial-pro-tip-panel";
  panel.hidden = true;
  panel.textContent = tipText;

  const toggle = () => {
    const on = panel.hidden;
    panel.hidden = !on;
    btn.setAttribute("aria-expanded", on ? "true" : "false");
  };
  btn.addEventListener("click", toggle);
  btn.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      toggle();
    }
  });

  wrap.append(btn, panel);
  return wrap;
}

function positionArrow(arrowEl, targetEl, place) {
  if (!arrowEl || !targetEl || targetEl.hidden) {
    return;
  }
  const r = targetEl.getBoundingClientRect();
  if (!r.width) {
    return;
  }
  const ax = place === "below" ? r.left + r.width / 2 - 24 : r.right + 8;
  const ay = place === "below" ? r.bottom + 12 : r.top + r.height / 2 - 24;
  arrowEl.style.left = `${Math.round(ax)}px`;
  arrowEl.style.top = `${Math.round(ay)}px`;
}

function positionBoosterArrow() {
  const targetEl = api?.els?.wordBoosterTopButton;
  if (!boosterArrowEl || boosterArrowEl.hidden || !targetEl || targetEl.hidden) {
    return;
  }
  const r = targetEl.getBoundingClientRect();
  if (!r.width) {
    return;
  }
  const gap = 8;
  const centerX = r.left + r.width / 2;
  const top = r.bottom + gap;
  boosterArrowEl.style.left = `${Math.round(centerX)}px`;
  boosterArrowEl.style.top = `${Math.round(top)}px`;
}

function startBoosterArrowLoop() {
  if (!api?.els?.wordBoosterTopButton) {
    return () => {};
  }
  let frame = 0;
  const tick = () => {
    positionBoosterArrow();
    frame = window.requestAnimationFrame(tick);
  };
  tick();
  return () => window.cancelAnimationFrame(frame);
}

function startEncArrowLoop() {
  if (!api?.els?.openEncyclopediaButton) {
    return () => {};
  }
  let frame = 0;
  const tick = () => {
    positionArrow(encArrowEl, api.els.openEncyclopediaButton, "below");
    frame = window.requestAnimationFrame(tick);
  };
  tick();
  return () => window.cancelAnimationFrame(frame);
}

function stopAllTutorialRafs() {
  if (stopBoosterRaf) {
    stopBoosterRaf();
    stopBoosterRaf = null;
  }
  if (stopEncRaf) {
    stopEncRaf();
    stopEncRaf = null;
  }
}

let resizeListenerBound = false;

function bindTutorialResizeOnce() {
  if (resizeListenerBound) {
    return;
  }
  resizeListenerBound = true;
  window.addEventListener("resize", () => {
    updateBlockerGeometry();
  }, { passive: true });
}

function updateBlockerGeometry() {
  if (!spotlightInteractBlocker || !layerRoot || layerRoot.hasAttribute("hidden")) {
    return;
  }
  const target = api?.getTutorialBlockTarget?.();
  if (!target || !(target instanceof Element)) {
    spotlightInteractBlocker.style.top = "0px";
    spotlightInteractBlocker.style.left = "0px";
    spotlightInteractBlocker.style.width = "100%";
    spotlightInteractBlocker.style.height = "100%";
    return;
  }
  const r = target.getBoundingClientRect();
  spotlightInteractBlocker.style.top = `${Math.round(r.top)}px`;
  spotlightInteractBlocker.style.left = `${Math.round(r.left)}px`;
  spotlightInteractBlocker.style.width = `${Math.round(Math.max(0, r.width))}px`;
  spotlightInteractBlocker.style.height = `${Math.round(Math.max(0, r.height))}px`;
}

export function syncTutorialBlocker() {
  updateBlockerGeometry();
}

function updateGhostHandLayoutVars() {
  if (!ghostHandEl || !api?.els?.tokenDockOuter || !api?.els?.playfield) {
    return;
  }
  const dock = api.els.tokenDockOuter;
  const pf = api.els.playfield;
  const dr = dock.getBoundingClientRect();
  const pr = pf.getBoundingClientRect();
  const sx = dr.left + dr.width / 2;
  const sy = dr.bottom;
  const ex = pr.left + pr.width / 2;
  const ey = pr.top + Math.min(160, pr.height / 3);
  ghostHandEl.style.left = `${sx}px`;
  ghostHandEl.style.top = `${sy}px`;
  ghostHandEl.style.setProperty("--gh-ex", `${ex - sx}px`);
  ghostHandEl.style.setProperty("--gh-ey", `${ey - sy}px`);
}

function stopGhostHandLoop() {
  if (ghostHandLayoutRaf !== null) {
    window.cancelAnimationFrame(ghostHandLayoutRaf);
    ghostHandLayoutRaf = null;
  }
  if (ghostHandEl) {
    ghostHandEl.hidden = true;
    ghostHandEl.classList.remove("wordmath-tutorial-ghost-hand--anim");
    ghostHandEl.classList.remove("wordmath-tutorial-ghost-hand--anim-loop");
  }
}

function startGhostHandLayoutRaf() {
  if (ghostHandLayoutRaf !== null) {
    window.cancelAnimationFrame(ghostHandLayoutRaf);
    ghostHandLayoutRaf = null;
  }
  const tick = () => {
    if (!ghostHandEl || ghostHandEl.hidden || activeStage !== 3) {
      ghostHandLayoutRaf = null;
      return;
    }
    updateGhostHandLayoutVars();
    ghostHandLayoutRaf = window.requestAnimationFrame(tick);
  };
  ghostHandLayoutRaf = window.requestAnimationFrame(tick);
}

/** Stage 3: looping drag hint until the player dismisses the tutorial modal. */
function startStage3GhostHand() {
  if (!ghostHandEl || !api?.els?.tokenDockOuter || !api?.els?.playfield) {
    return;
  }
  updateGhostHandLayoutVars();
  ghostHandEl.hidden = false;
  ghostHandEl.classList.remove("wordmath-tutorial-ghost-hand--anim");
  ghostHandEl.classList.add("wordmath-tutorial-ghost-hand--anim-loop");
  startGhostHandLayoutRaf();
}

function hideBoosterArrow() {
  if (boosterArrowEl) {
    boosterArrowEl.hidden = true;
  }
}

function hideEncArrow() {
  if (encArrowEl) {
    encArrowEl.hidden = true;
  }
}

let stopBoosterRaf = null;
let stopEncRaf = null;
let ghostHandLayoutRaf = null;

function teardownActiveVisuals() {
  hideBoosterArrow();
  hideEncArrow();
  stopAllTutorialRafs();
  stopGhostHandLoop();
  stage1HighlightTileIds = [];
  stage1AwaitingMixAfterWelcome = false;
  if (api?.refreshTileRender) {
    api.refreshTileRender();
  }
}

function onKeydown(ev) {
  if (ev.key !== "Escape") {
    return;
  }
  dismissActiveStage();
}

function dismissActiveStage() {
  if (!activeStage) {
    return;
  }
  const s = activeStage;
  const wasReplay = replayMode;

  if (s === 1 && !wasReplay) {
    hideBoosterArrow();
    hideEncArrow();
    stopAllTutorialRafs();
    stage1AwaitingMixAfterWelcome = true;
    api?.refreshTileRender?.();
  } else if (s === 2) {
    hideEncArrow();
    if (stopEncRaf) {
      stopEncRaf();
      stopEncRaf = null;
    }
    const used = api.getWordBoosterStageUses?.() ?? 0;
    if (used <= 0 && api?.els?.wordBoosterTopButton) {
      boosterArrowEl.hidden = false;
      if (!stopBoosterRaf) {
        stopBoosterRaf = startBoosterArrowLoop();
      } else {
        positionBoosterArrow();
      }
    } else {
      hideBoosterArrow();
      if (stopBoosterRaf) {
        stopBoosterRaf();
        stopBoosterRaf = null;
      }
    }
  } else {
    teardownActiveVisuals();
  }

  if (!wasReplay) {
    markDismissed(s);
  }
  spotlightCard.innerHTML = "";
  activeStage = null;
  replayMode = false;
  setLayerVisible(false);
  document.removeEventListener("keydown", onKeydown, true);
  if (focusRestoreEl && typeof focusRestoreEl.focus === "function") {
    focusRestoreEl.focus({ preventScroll: true });
  }
  focusRestoreEl = null;

  window.queueMicrotask(() => flushStageQueue());
}

function renderSpotlightContent(stage, { replay }) {
  const lang = api.getUiLang();
  const C = copyFor(lang);
  const block = C[stage];
  const idS = `s${stage}-${Date.now()}`;

  spotlightCard.innerHTML = "";
  const h = document.createElement("h2");
  h.className = "wordmath-tutorial-card-title";
  h.id = `tutorial-h-${idS}`;
  h.textContent = block.title;
  spotlightCard.setAttribute("aria-labelledby", h.id);

  const p = document.createElement("p");
  p.className = "wordmath-tutorial-card-body";
  p.textContent = block.body;

  const tipRow = buildProTipRow(block.tip, idS, C.proTip);

  const actions = document.createElement("div");
  actions.className = "wordmath-tutorial-card-actions";

  const primary = document.createElement("button");
  primary.type = "button";
  primary.className = "wordmath-tutorial-primary-btn";
  primary.textContent = block.cta;

  primary.addEventListener("click", () => dismissActiveStage());
  actions.append(primary);

  spotlightCard.append(h, p, tipRow, actions);
  return primary;
}

function showSpotlightStage(stage, { replay = false } = {}) {
  ensureLayer();
  teardownActiveVisuals();
  replayMode = replay;
  activeStage = stage;
  focusRestoreEl = document.activeElement;
  setLayerVisible(true);

  document.addEventListener("keydown", onKeydown, true);

  const primary = renderSpotlightContent(stage, { replay });
  window.queueMicrotask(() => primary.focus());

  if (stage === 1 && !replay) {
    const tiles = api.getStarterFieldTiles?.() || [];
    stage1HighlightTileIds = tiles.slice(0, 2).map((t) => t.id);
    api.refreshTileRender?.();
  }

  if (stage === 2) {
    const used = api.getWordBoosterStageUses?.() ?? 0;
    if (used <= 0 && api.els?.wordBoosterTopButton) {
      boosterArrowEl.hidden = false;
      stopBoosterRaf = startBoosterArrowLoop();
    }
  }

  if (stage === 4) {
    encArrowEl.hidden = false;
    stopEncRaf = startEncArrowLoop();
  }

  if (stage === 3) {
    startStage3GhostHand();
  }
}

export function initTutorial(deps) {
  api = deps;
  tutorialState = loadTutorialState();
}

export function notifyGameInit() {
  tutorialState = loadTutorialState();
  stageQueue = [];
  activeStage = null;
  stage1AwaitingMixAfterWelcome = false;

  if (isDismissed(1)) {
    if (api?.getMatchHistoryLength?.() > 0 && !isDismissed(2)) {
      enqueueStages([2]);
    }
    return;
  }

  if (api?.getMatchHistoryLength?.() > 0) {
    markDismissed(1);
    if (!isDismissed(2)) {
      enqueueStages([2]);
    }
    return;
  }

  window.queueMicrotask(() => {
    showSpotlightStage(1, { replay: false });
  });
}

export function notifyRememberResult(ctx) {
  const {
    didDiscoverNewWord,
    fromMix,
    previewInkBonusFromRareRoll,
    questResult,
    questTargetBeforeAdvance,
    discoveryKey,
  } = ctx;

  if (questResult?.completedQuest && !isDismissed(4)) {
    const later = [];
    if (previewInkBonusFromRareRoll && !isDismissed(5)) {
      later.push(5);
    }
    enqueueStages([4, ...later]);
  } else if (previewInkBonusFromRareRoll && !isDismissed(5)) {
    const t = questTargetBeforeAdvance ? String(questTargetBeforeAdvance).toLowerCase() : "";
    const d = discoveryKey ? String(discoveryKey).toLowerCase() : "";
    if (!t || d !== t) {
      enqueueStages([5]);
    }
  }

  if (didDiscoverNewWord && fromMix) {
    const wasAwaitingFirstFieldMix = stage1AwaitingMixAfterWelcome;
    if (stage1AwaitingMixAfterWelcome) {
      stage1AwaitingMixAfterWelcome = false;
      stage1HighlightTileIds = [];
      api?.refreshTileRender?.();
    }
    if (wasAwaitingFirstFieldMix && isDismissed(1) && !isDismissed(2)) {
      enqueueStages([2]);
    }
  }
}

export function notifyTokenPanelRendered() {
  const n = api?.getTotalUsableTokens?.() ?? 0;
  if (n <= 0 || isDismissed(3)) {
    return;
  }
  if (activeStage === 3 || stageQueue.includes(3)) {
    return;
  }
  enqueueStages([3]);
}

export function notifyWordBoosterOpened() {
  hideBoosterArrow();
  if (stopBoosterRaf) {
    stopBoosterRaf();
    stopBoosterRaf = null;
  }
}

export function refreshTutorialTileHighlights() {
  if (!api?.els?.playfieldSurface) {
    return;
  }
  api.els.playfieldSurface.querySelectorAll(".tile.tutorial-pick-word").forEach((el) => {
    el.classList.remove("tutorial-pick-word");
  });
  const wantHighlights =
    stage1HighlightTileIds.length > 0
    && (activeStage === 1 || stage1AwaitingMixAfterWelcome);
  if (!wantHighlights) {
    return;
  }
  for (const id of stage1HighlightTileIds) {
    const tile = api.els.playfieldSurface.querySelector(`.tile[data-tile-id="${id}"]`);
    if (tile) {
      tile.classList.add("tutorial-pick-word");
    }
  }
}

export function openTutorialHelpMenu() {
  ensureLayer();
  const lang = api.getUiLang();
  const C = copyFor(lang);
  const M = maxReplayStage();
  helpCard.innerHTML = "";

  const head = document.createElement("div");
  head.className = "modal-head";
  const headText = document.createElement("div");
  const ht = document.createElement("h2");
  ht.textContent = C.helpTitle;
  const sub = document.createElement("p");
  sub.className = "muted";
  sub.textContent = C.helpSubtitle;
  headText.append(ht, sub);
  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "ghost-button";
  closeBtn.textContent = C.helpClose;
  closeBtn.addEventListener("click", closeHelpMenu);
  head.append(headText, closeBtn);

  const body = document.createElement("div");
  body.className = "wordmath-tutorial-help-body";
  const label = document.createElement("p");
  label.className = "muted";
  label.textContent = C.helpPickLabel;
  body.append(label);

  if (M < 1) {
    const empty = document.createElement("p");
    empty.textContent =
      lang === "ru"
        ? "Пока нет завершённых шагов. Поиграйте немного — здесь появятся подсказки."
        : "No steps unlocked yet. Play a bit — tips will show up here.";
    body.append(empty);
  } else {
    for (let s = 1; s <= M; s += 1) {
      const row = document.createElement("button");
      row.type = "button";
      row.className = "wordmath-tutorial-help-row";
      row.textContent = `${C.stageLabel(s)}: ${C[s].title}`;
      row.addEventListener("click", () => {
        closeHelpMenu();
        replayMode = true;
        showSpotlightStage(s, { replay: true });
      });
      body.append(row);
    }
  }

  helpCard.append(head, body);
  helpBackdrop.hidden = false;
  closeBtn.focus();
}

export function closeHelpMenu() {
  if (helpBackdrop) {
    helpBackdrop.hidden = true;
  }
}

/** @returns {boolean} true if Escape was consumed (help menu closed). */
export function tryConsumeTutorialEscape() {
  if (helpBackdrop && !helpBackdrop.hidden) {
    closeHelpMenu();
    return true;
  }
  return false;
}

export function isTutorialLayerActive() {
  return Boolean(activeStage);
}
