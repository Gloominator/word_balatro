/**
 * Onboarding tutorial: localStorage persistence, spotlight UI, [?] replay up to max dismissed stage id.
 */

const STORAGE_KEY = "wordmath-tutorial-v1";
const TUTORIAL_STORAGE_VERSION = 2;

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
      body: "",
      tip: "Hold a word and drag it over another to see what result you will get (you get the 1st result by default)",
      cta: "Sweet — let's mix",
    },
    2: {
      title: "Mind your INK",
      body:
        "Every mix spends INK. When you get to 0 INK you lose. Choose what you mix carefully!",
      tip: 'Follow the "hot and cold" indicators — they get you closer to the target!',
      cta: "Got it",
    },
    3: {
      title: "STUCK?",
      body: "Out of ideas? Hit Word Booster for fresh words.",
      tip: "Your first Word Booster each stage is always free!",
      cta: "Got it",
    },
    4: {
      title: "Tokens change the recipe",
      body: "Normally, mixing two words gives you the first result in the top matches table. Tokens let you change which matches you see and which rank (2nd, 3rd, …) you get. Try dragging a token onto a word on the field!",
      tip: 'Tokens can be bought in "Purchase Tokens".',
      cta: "Will do",
    },
    5: {
      title: "Wow! Good job!",
      body:
        "Each stage, you'll get quest words from categories in the encyclopedia - 16 categories with 5 words each. Mixing words from the encyclopedia grants bonus tokens and coins so don't miss out on them!",
      tip: "Encyclopedia words are marked with E in top matches - yellow and black ones don't spend INK!",
      cta: "Nice",
    },
    6: {
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
      body: "",
      tip: "Удерживайте слово и перетащите на другое, чтобы увидеть результат (по умолчанию берётся 1-й вариант).",
      cta: "Понял, вперёд",
    },
    2: {
      title: "Следите за чернилами",
      body:
        "Каждое смешивание тратит чернила. Когда чернила закончатся — проигрыш. Выбирайте, что смешивать, вдумчиво!",
      tip:
        "Ориентируйтесь на индикаторы «горячо/холодно» — они подводят к цели!",
      cta: "Понял",
    },
    3: {
      title: "Застряли?",
      body: "Нет идей? Нажмите Word Booster — появятся новые слова.",
      tip: "Первый Word Booster на этапе всегда бесплатный!",
      cta: "Понял",
    },
    4: {
      title: "Жетоны меняют результат",
      body: "Обычно при смешивании двух слов берётся первое из топ-совпадений. Жетоны меняют, какие совпадения видны и какой по счёту результат получите. Перетащите жетон на слово на поле!",
      tip: 'Купить жетоны можно в «Purchase Tokens».',
      cta: "Ок",
    },
    5: {
      title: "Ура, отлично!",
      body:
        "На каждом этапе в квесте участвуют слова из категорий энциклопедии — 16 категорий по 5 слов. Смешивание слов из энциклопедии даёт бонусные жетоны и монеты — не пропускайте!",
      tip: "Слова из энциклопедии помечены E в топ-совпадениях — жёлтые и чёрные не тратят чернила!",
      cta: "Класс",
    },
    6: {
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

let tutorialState = { dismissed: [], version: TUTORIAL_STORAGE_VERSION };
let stageQueue = [];
let activeStage = null;
let replayMode = false;

/** After closing step 1 card, loop ghost hand between starters until the first mix from the field. */
let stage1AwaitingMixAfterWelcome = false;

function copyFor(lang) {
  return STAGE_COPY[lang === "ru" ? "ru" : "en"];
}

function loadTutorialState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { dismissed: [], version: TUTORIAL_STORAGE_VERSION };
    }
    const p = JSON.parse(raw);
    let dismissed = Array.isArray(p.dismissed)
      ? [...new Set(p.dismissed.map(Number).filter((n) => n >= 1 && n <= 6))].sort((a, b) => a - b)
      : [];
    let version = typeof p.version === "number" ? p.version : 1;
    let needsPersist = false;
    if (version < TUTORIAL_STORAGE_VERSION) {
      /* Step 2 used to cover ink + Word Booster; count old completion as both. */
      if (dismissed.includes(2) && !dismissed.includes(3)) {
        dismissed.push(3);
        dismissed.sort((a, b) => a - b);
      }
      version = TUTORIAL_STORAGE_VERSION;
      needsPersist = true;
    }
    const state = { dismissed, version };
    if (needsPersist) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* ignore */
      }
    }
    return state;
  } catch {
    return { dismissed: [], version: TUTORIAL_STORAGE_VERSION };
  }
}

function saveTutorialState() {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        dismissed: tutorialState.dismissed,
        version: tutorialState.version ?? TUTORIAL_STORAGE_VERSION,
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

function maybeEnqueueWordBoosterHintStage() {
  const n = api?.getAvailableWordCount?.() ?? 0;
  if (n >= 4 && isDismissed(2) && !isDismissed(3)) {
    enqueueStages([3]);
  }
}

function enqueueStages(stages) {
  const add = stages.filter((s) => s >= 1 && s <= 6 && !isDismissed(s));
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

function titleCaseTutorialWord(raw) {
  if (!raw || typeof raw !== "string") {
    return "";
  }
  const t = raw.trim();
  if (!t) {
    return "";
  }
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
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

function positionEncArrow() {
  const targetEl = api?.els?.openEncyclopediaButton;
  if (!encArrowEl || encArrowEl.hidden || !targetEl || targetEl.hidden) {
    return;
  }
  const r = targetEl.getBoundingClientRect();
  if (!r.width) {
    return;
  }
  const gap = 8;
  const centerX = r.left + r.width / 2;
  const top = r.bottom + gap;
  encArrowEl.style.left = `${Math.round(centerX)}px`;
  encArrowEl.style.top = `${Math.round(top)}px`;
}

function startEncArrowLoop() {
  if (!api?.els?.openEncyclopediaButton) {
    return () => {};
  }
  let frame = 0;
  const tick = () => {
    positionEncArrow();
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

function resolveTutorialSpotlightTarget() {
  if (activeStage === 1 && api?.els?.questWord) {
    return api.els.questWord;
  }
  if (activeStage === 2 && api?.els?.questInkPanel) {
    return api.els.questInkPanel;
  }
  return api?.tutorialDefaultBlockEl ?? null;
}

function updateBlockerGeometry() {
  if (!spotlightInteractBlocker || !layerRoot || layerRoot.hasAttribute("hidden")) {
    return;
  }
  const target = resolveTutorialSpotlightTarget();
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
  if (!ghostHandEl || !api?.els?.playfield) {
    return;
  }
  const pf = api.els.playfield;
  const pr = pf.getBoundingClientRect();
  const tokenDock = api.els.tokenDock;
  const firstPill = tokenDock?.querySelector(".token-dock-pill");

  let sx;
  let sy;
  if (firstPill) {
    const tr = firstPill.getBoundingClientRect();
    sx = tr.left + tr.width / 2;
    sy = tr.top + tr.height / 2;
  } else if (tokenDock) {
    const dr = tokenDock.getBoundingClientRect();
    if (!dr.width) {
      return;
    }
    sx = dr.left + Math.min(28, dr.width / 2);
    sy = dr.top + dr.height / 2;
  } else {
    const dock = api.els.tokenDockOuter;
    if (!dock) {
      return;
    }
    const dr = dock.getBoundingClientRect();
    sx = dr.left + dr.width / 2;
    sy = dr.bottom;
  }

  const ex = pr.left + pr.width / 2;
  const ey = pr.top + Math.min(160, pr.height / 3);
  ghostHandEl.style.left = `${sx}px`;
  ghostHandEl.style.top = `${sy}px`;
  ghostHandEl.style.setProperty("--gh-ex", `${ex - sx}px`);
  ghostHandEl.style.setProperty("--gh-ey", `${ey - sy}px`);
}

function stopStage1MixGhostRaf() {
  if (stage1MixGhostRaf !== null) {
    window.cancelAnimationFrame(stage1MixGhostRaf);
    stage1MixGhostRaf = null;
  }
}

function updateStage1MixGhostHandLayout() {
  if (!ghostHandEl || !api?.els?.playfieldSurface) {
    return;
  }
  const tiles = api.getStarterFieldTiles?.() || [];
  if (tiles.length < 2) {
    return;
  }
  const elA = api.els.playfieldSurface.querySelector(`.tile[data-tile-id="${tiles[0].id}"]`);
  const elB = api.els.playfieldSurface.querySelector(`.tile[data-tile-id="${tiles[1].id}"]`);
  if (!elA || !elB) {
    return;
  }
  const a = elA.getBoundingClientRect();
  const b = elB.getBoundingClientRect();
  const sx = a.left + a.width / 2;
  const sy = a.top + a.height / 2;
  const ex = b.left + b.width / 2;
  const ey = b.top + b.height / 2;
  ghostHandEl.style.left = `${Math.round(sx)}px`;
  ghostHandEl.style.top = `${Math.round(sy)}px`;
  ghostHandEl.style.setProperty("--gh-ex", `${ex - sx}px`);
  ghostHandEl.style.setProperty("--gh-ey", `${ey - sy}px`);
}

function startStage1MixGhostHandRaf() {
  stopStage1MixGhostRaf();
  const tick = () => {
    if (!ghostHandEl || ghostHandEl.hidden || !stage1AwaitingMixAfterWelcome) {
      stage1MixGhostRaf = null;
      return;
    }
    updateStage1MixGhostHandLayout();
    stage1MixGhostRaf = window.requestAnimationFrame(tick);
  };
  stage1MixGhostRaf = window.requestAnimationFrame(tick);
}

/** Looping drag hint between the two starter tiles until the first field mix (step 1 after welcome). */
function startStage1MixGhostHand() {
  if (!ghostHandEl || !api?.els?.playfield) {
    return;
  }
  const tiles = api.getStarterFieldTiles?.() || [];
  if (tiles.length < 2) {
    return;
  }
  updateStage1MixGhostHandLayout();
  ghostHandEl.hidden = false;
  ghostHandEl.classList.remove("wordmath-tutorial-ghost-hand--anim");
  ghostHandEl.classList.add("wordmath-tutorial-ghost-hand--anim-loop");
  startStage1MixGhostHandRaf();
}

function stopGhostHandLoop() {
  stopStage1MixGhostRaf();
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
    if (!ghostHandEl || ghostHandEl.hidden || activeStage !== 4) {
      ghostHandLayoutRaf = null;
      return;
    }
    updateGhostHandLayoutVars();
    ghostHandLayoutRaf = window.requestAnimationFrame(tick);
  };
  ghostHandLayoutRaf = window.requestAnimationFrame(tick);
}

/** Stage 4 (tokens): looping drag hint until the player dismisses the tutorial modal. */
function startStage4GhostHand() {
  if (!ghostHandEl || !api?.els?.playfield) {
    return;
  }
  if (!api?.els?.tokenDock && !api?.els?.tokenDockOuter) {
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
let stage1MixGhostRaf = null;

function teardownActiveVisuals() {
  hideBoosterArrow();
  hideEncArrow();
  stopAllTutorialRafs();
  stopGhostHandLoop();
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
    startStage1MixGhostHand();
    api?.refreshTileRender?.();
  } else if (s === 2) {
    hideBoosterArrow();
    if (stopBoosterRaf) {
      stopBoosterRaf();
      stopBoosterRaf = null;
    }
    hideEncArrow();
    if (stopEncRaf) {
      stopEncRaf();
      stopEncRaf = null;
    }
  } else if (s === 3) {
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

  window.queueMicrotask(() => {
    flushStageQueue();
    if (!wasReplay) {
      maybeEnqueueWordBoosterHintStage();
    }
  });
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
  if (stage === 1) {
    const raw = api.getQuestTargetWord?.();
    const label = titleCaseTutorialWord(raw) || (lang === "ru" ? "слово квеста" : "quest word");
    p.textContent =
      lang === "ru"
        ? `Ваша цель — смешать «${label}». Смешивайте слова на поле друг с другом, чтобы получать новые слова. Попробуйте перетащить слова на поле и сделать первое смешивание!`
        : `Your goal is to mix "${label}". You mix words on the field with each other to create new words. Try dragging the words on the field together and mixing your first pair!`;
  } else {
    p.textContent = block.body;
  }

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

  if (stage === 3) {
    const used = api.getWordBoosterStageUses?.() ?? 0;
    if (used <= 0 && api.els?.wordBoosterTopButton) {
      boosterArrowEl.hidden = false;
      stopBoosterRaf = startBoosterArrowLoop();
    }
  }

  if (stage === 5) {
    encArrowEl.hidden = false;
    stopEncRaf = startEncArrowLoop();
  }

  if (stage === 4) {
    startStage4GhostHand();
  }

  window.queueMicrotask(() => updateBlockerGeometry());
}

export function initTutorial(deps) {
  api = deps;
  tutorialState = loadTutorialState();
  if (tutorialState.version == null) {
    tutorialState.version = TUTORIAL_STORAGE_VERSION;
  }
}

export function notifyGameInit() {
  tutorialState = loadTutorialState();
  if (tutorialState.version == null) {
    tutorialState.version = TUTORIAL_STORAGE_VERSION;
  }
  stageQueue = [];
  activeStage = null;
  stage1AwaitingMixAfterWelcome = false;

  if (isDismissed(1)) {
    if (api?.getMatchHistoryLength?.() > 0 && !isDismissed(2)) {
      enqueueStages([2]);
    }
    maybeEnqueueWordBoosterHintStage();
    return;
  }

  if (api?.getMatchHistoryLength?.() > 0) {
    markDismissed(1);
    if (!isDismissed(2)) {
      enqueueStages([2]);
    }
    maybeEnqueueWordBoosterHintStage();
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

  if (questResult?.completedQuest && !isDismissed(5)) {
    const later = [];
    if (previewInkBonusFromRareRoll && !isDismissed(6)) {
      later.push(6);
    }
    enqueueStages([5, ...later]);
  } else if (previewInkBonusFromRareRoll && !isDismissed(6)) {
    const t = questTargetBeforeAdvance ? String(questTargetBeforeAdvance).toLowerCase() : "";
    const d = discoveryKey ? String(discoveryKey).toLowerCase() : "";
    if (!t || d !== t) {
      enqueueStages([6]);
    }
  }

  maybeEnqueueWordBoosterHintStage();

  if (fromMix) {
    const wasAwaitingFirstFieldMix = stage1AwaitingMixAfterWelcome;
    if (stage1AwaitingMixAfterWelcome) {
      stage1AwaitingMixAfterWelcome = false;
      stopGhostHandLoop();
      api?.refreshTileRender?.();
    }
    if (didDiscoverNewWord && wasAwaitingFirstFieldMix && isDismissed(1) && !isDismissed(2)) {
      enqueueStages([2]);
    }
  }
}

export function notifyTokenPanelRendered() {
  const n = api?.getTotalUsableTokens?.() ?? 0;
  if (n <= 0 || isDismissed(4)) {
    return;
  }
  if (activeStage === 4 || stageQueue.includes(4)) {
    return;
  }
  enqueueStages([4]);
}

export function notifyWordBoosterOpened() {
  hideBoosterArrow();
  if (stopBoosterRaf) {
    stopBoosterRaf();
    stopBoosterRaf = null;
  }
}

/** When the Word Booster picker is actually shown: STUCK? step (3) is optional — skip if they found it themselves. */
export function notifyWordBoosterModalOpened() {
  hideBoosterArrow();
  if (stopBoosterRaf) {
    stopBoosterRaf();
    stopBoosterRaf = null;
  }
  if (isDismissed(3) || activeStage === 3) {
    return;
  }
  markDismissed(3);
  const q = stageQueue.indexOf(3);
  if (q >= 0) {
    stageQueue.splice(q, 1);
  }
}

export function refreshTutorialTileHighlights() {
  if (!api?.els?.playfieldSurface) {
    return;
  }
  api.els.playfieldSurface.querySelectorAll(".tile.tutorial-pick-word").forEach((el) => {
    el.classList.remove("tutorial-pick-word");
  });
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
