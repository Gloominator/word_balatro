const STARTER_POOL = [
  "book",
  "chair",
  "cup",
  "spoon",
  "phone",
  "key",
  "lamp",
  "shoe",
  "bag",
  "clock",
  "plate",
  "brush",
  "pillow",
  "bottle",
  "coin",
  "rope",
  "pencil",
  "mirror",
  "blanket",
  "fork",
];

const ENCYCLOPEDIA_CATEGORIES = [
  {
    name: "Nature",
    words: ["tree", "flower", "river", "mountain", "forest"],
  },
  {
    name: "Weather",
    words: ["rain", "cloud", "wind", "storm", "snow"],
  },
  {
    name: "Food",
    words: ["bread", "soup", "cake", "apple", "cheese"],
  },
  {
    name: "Animals",
    words: ["bird", "fish", "cat", "dog", "horse"],
  },
  {
    name: "Places",
    words: ["house", "bridge", "school", "garden", "city"],
  },
  {
    name: "Tools",
    words: ["hammer", "ladder", "shovel", "knife", "wheel"],
  },
  {
    name: "Materials",
    words: ["glass", "paper", "brick", "steel", "clay"],
  },
  {
    name: "Transport",
    words: ["boat", "train", "bicycle", "truck", "airplane"],
  },
];

const ENCYCLOPEDIA_WORDS = ENCYCLOPEDIA_CATEGORIES.flatMap((category) =>
  category.words.map((word) => ({
    word,
    category: category.name,
  })),
);

const ENCYCLOPEDIA_LOOKUP = new Map(
  ENCYCLOPEDIA_WORDS.map((entry) => [entry.word, entry]),
);

const TILE_WIDTH = 152;
const TILE_HEIGHT = 76;
const DRAG_THRESHOLD = 6;
const DOUBLE_CLICK_MS = 320;
const DEFAULT_CATEGORY_ID = "uncategorized";
const MATCH_HISTORY_LIMIT = 100;
const WORDS_PER_NEGATIVE_MIX_TOKEN = 20;

const state = {
  starters: [],
  discovered: new Map(),
  selfMatchedWords: new Set(),
  tiles: [],
  search: "",
  negativeMix: {
    a: null,
    b: null,
  },
  lastMix: {
    label: "No mix yet.",
    operation: "None",
    candidates: [],
  },
  matchHistory: [],
  matchHistoryKeys: new Set(),
  historySort: "recent",
  wordCategories: [],
  wordAssignments: new Map(),
  googlePickMode: false,
  clickTracker: {
    word: null,
    time: 0,
  },
  availableNegativeMixTokens: 0,
  totalNegativeMixTokensEarned: 0,
  hasActiveNegativeMixToken: false,
  activeSidebarTab: "words",
  unseenTokenRewards: 0,
  nextTileId: 1,
  nextZIndex: 1,
};

const els = {
  status: document.querySelector("[data-status]"),
  encyclopediaCount: document.querySelector("[data-encyclopedia-count]"),
  historyCount: document.querySelector("[data-history-count]"),
  discoveredCount: document.querySelector("[data-discovered-count]"),
  availableCount: document.querySelector("[data-available-count]"),
  wordSearch: document.querySelector("[data-word-search]"),
  wordList: document.querySelector("[data-word-list]"),
  playfield: document.querySelector("[data-playfield]"),
  emptyMessage: document.querySelector("[data-empty-message]"),
  negativePanel: document.querySelector("[data-negative-panel]"),
  closeNegativeButton: document.querySelector("[data-action='close-negative']"),
  negativeSlots: document.querySelectorAll("[data-negative-slot]"),
  negativeWordA: document.querySelector("[data-negative-word-a]"),
  negativeWordB: document.querySelector("[data-negative-word-b]"),
  encyclopediaModal: document.querySelector("[data-encyclopedia-modal]"),
  encyclopediaGrid: document.querySelector("[data-encyclopedia-grid]"),
  historyModal: document.querySelector("[data-history-modal]"),
  historyList: document.querySelector("[data-history-list]"),
  resetButton: document.querySelector("[data-action='reset']"),
  clearFieldButton: document.querySelector("[data-action='clear-field']"),
  clearNegativeButton: document.querySelector("[data-action='clear-negative']"),
  runNegativeButton: document.querySelector("[data-action='run-negative']"),
  addCategoryButton: document.querySelector("[data-action='add-category']"),
  toggleGooglePickButton: document.querySelector("[data-action='toggle-google-pick']"),
  sidebarTitle: document.querySelector("[data-sidebar-title]"),
  openWordTabButton: document.querySelector("[data-action='open-word-tab']"),
  openTokenTabButton: document.querySelector("[data-action='open-token-tab']"),
  tokenCount: document.querySelector("[data-token-count]"),
  tokenPanelCount: document.querySelector("[data-token-panel-count]"),
  tokenList: document.querySelector("[data-token-list]"),
  sidebarPanels: document.querySelectorAll("[data-sidebar-panel]"),
  openHistoryButton: document.querySelector("[data-action='open-history']"),
  closeHistoryButton: document.querySelector("[data-action='close-history']"),
  toggleHistorySortButton: document.querySelector("[data-action='toggle-history-sort']"),
  openEncyclopediaButton: document.querySelector("[data-action='open-encyclopedia']"),
  closeEncyclopediaButton: document.querySelector("[data-action='close-encyclopedia']"),
};

function titleCase(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function shuffle(array) {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function sampleStarters() {
  return shuffle(STARTER_POOL).slice(0, 2).sort((a, b) => a.localeCompare(b));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getPlayfieldBounds() {
  const width = els.playfield.clientWidth;
  const height = els.playfield.clientHeight;
  return {
    width,
    height,
    maxX: Math.max(0, width - TILE_WIDTH),
    maxY: Math.max(0, height - TILE_HEIGHT),
  };
}

function getDiscoveredWords() {
  return [...state.discovered.values()].sort((a, b) => a.localeCompare(b));
}

function getAvailableWordEntries() {
  const available = new Map();

  state.starters.forEach((word) => {
    available.set(word, {
      key: word,
      word,
    });
  });

  state.discovered.forEach((word, normalized) => {
    const existing = available.get(normalized);
    if (!existing || isPreferredDiscoveredVariant(word, existing.word)) {
      available.set(normalized, {
        key: normalized,
        word,
      });
    }
  });

  return [...available.values()].sort((a, b) => a.word.localeCompare(b.word));
}

function getAvailableWords() {
  return getAvailableWordEntries().map((entry) => entry.word);
}

function getEncyclopediaEntry(word, normalized = word) {
  return ENCYCLOPEDIA_LOOKUP.get(normalized) || ENCYCLOPEDIA_LOOKUP.get(word.toLowerCase()) || null;
}

function getDiscoveredEncyclopediaWords() {
  return new Set(
    [...state.discovered.keys()].filter((word) => ENCYCLOPEDIA_LOOKUP.has(word)),
  );
}

function getEncyclopediaDiscoveryCount() {
  return getDiscoveredEncyclopediaWords().size;
}

function getUnlockedTokenCount() {
  return Math.floor(state.discovered.size / WORDS_PER_NEGATIVE_MIX_TOKEN);
}

function shouldFlashTokenTab() {
  return state.unseenTokenRewards > 0 && state.availableNegativeMixTokens > 0 && state.activeSidebarTab !== "tokens";
}

function setStatus(message, stateName = "ok") {
  els.status.textContent = message;
  els.status.dataset.state = stateName;
}

async function getAssociation(wordA, wordB, operation = "add") {
  const query = new URLSearchParams({
    wordA,
    wordB,
    operation,
  });
  const response = await fetch(`./api/mix?${query.toString()}`);
  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "Could not mix those words.");
  }

  return payload;
}

function updateCounts() {
  els.discoveredCount.textContent = state.discovered.size.toString();
  els.availableCount.textContent = getAvailableWordEntries().length.toString();
  els.encyclopediaCount.textContent = `${getEncyclopediaDiscoveryCount()} / ${ENCYCLOPEDIA_WORDS.length}`;
  els.historyCount.textContent = state.matchHistory.length.toString();
  els.tokenCount.textContent = state.availableNegativeMixTokens.toString();
  els.tokenPanelCount.textContent = state.availableNegativeMixTokens.toString();
}

function getWordKey(word) {
  for (const [key, value] of state.discovered.entries()) {
    if (value === word) {
      return key;
    }
  }
  return word.toLowerCase();
}

function buildSourceButton(entry) {
  const { key, word } = entry;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "source-word";
  button.dataset.kind = "discovered";
  button.dataset.wordKey = key;
  button.textContent = `${titleCase(word)}${state.selfMatchedWords.has(key) ? " ✔️" : ""}`;
  button.draggable = true;
  button.addEventListener("click", () => {
    if (state.googlePickMode) {
      openGoogleMeaning(word);
      return;
    }
    spawnWordOnField(word);
    setStatus(`${titleCase(word)} was added to the field.`);
  });
  button.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", word);
    event.dataTransfer.setData("application/x-word-key", key);
    event.dataTransfer.effectAllowed = "copy";
  });
  return button;
}

function getCategoryById(categoryId) {
  return state.wordCategories.find((category) => category.id === categoryId) || null;
}

function ensureWordAssignments(entries) {
  const validCategoryIds = new Set(state.wordCategories.map((category) => category.id));
  entries.forEach((entry) => {
    if (!validCategoryIds.has(state.wordAssignments.get(entry.key))) {
      state.wordAssignments.set(entry.key, DEFAULT_CATEGORY_ID);
    }
  });
}

function getCategoryIdForWord(key) {
  return state.wordAssignments.get(key) || DEFAULT_CATEGORY_ID;
}

function getVisibleCategoryNameForWord(word) {
  const categoryId = getCategoryIdForWord(getWordKey(word));
  if (categoryId === DEFAULT_CATEGORY_ID) {
    return "";
  }
  return getCategoryById(categoryId)?.name || "";
}

function setGooglePickMode(enabled) {
  state.googlePickMode = enabled;
  renderSidebar();
}

function openGoogleMeaning(word) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(`${word} meaning in english`)}`;
  window.open(url, "_blank", "noopener");
  setGooglePickMode(false);
  setStatus(`Opened Google meaning search for ${titleCase(word)}.`);
}

function createDefaultCategoryState() {
  return [
    {
      id: DEFAULT_CATEGORY_ID,
      name: "Uncategorized",
      collapsed: false,
    },
  ];
}

function renderWordList() {
  const availableEntries = getAvailableWordEntries();
  ensureWordAssignments(availableEntries);

  const filteredEntries = availableEntries.filter((entry) =>
    entry.word.includes(state.search.trim().toLowerCase()),
  );

  els.wordList.innerHTML = "";
  if (filteredEntries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "source-word-empty";
    empty.textContent = "No available words match that search.";
    els.wordList.append(empty);
    return;
  }

  state.wordCategories.forEach((category) => {
    const entries = filteredEntries.filter((entry) => getCategoryIdForWord(entry.key) === category.id);

    const section = document.createElement("section");
    section.className = "word-category";
    section.dataset.categoryId = category.id;

    const header = document.createElement("div");
    header.className = "word-category-header";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "word-category-toggle";
    toggle.addEventListener("click", () => {
      category.collapsed = !category.collapsed;
      renderWordList();
    });

    const chevron = document.createElement("span");
    chevron.className = "word-category-chevron";
    chevron.textContent = category.collapsed ? ">" : "v";

    const title = document.createElement("span");
    title.textContent = category.name;

    toggle.append(chevron, title);

    const count = document.createElement("span");
    count.className = "word-category-count";
    count.textContent = entries.length.toString();

    header.append(toggle, count);

    const dropzone = document.createElement("div");
    dropzone.className = "word-category-dropzone";
    dropzone.hidden = category.collapsed;
    dropzone.addEventListener("dragover", (event) => {
      event.preventDefault();
      dropzone.dataset.dragOver = "true";
    });
    dropzone.addEventListener("dragleave", () => {
      dropzone.dataset.dragOver = "false";
    });
    dropzone.addEventListener("drop", (event) => {
      event.preventDefault();
      dropzone.dataset.dragOver = "false";
      const word = event.dataTransfer.getData("text/plain");
      const wordKey = event.dataTransfer.getData("application/x-word-key") || getWordKey(word);
      if (!word) {
        return;
      }
      state.wordAssignments.set(wordKey, category.id);
      renderWordList();
      setStatus(`${titleCase(word)} moved to ${category.name}.`);
    });

    if (entries.length === 0) {
      const empty = document.createElement("p");
      empty.className = "source-word-empty";
      empty.textContent = "No words here yet.";
      dropzone.append(empty);
    } else {
      entries.forEach((entry) => {
        dropzone.append(buildSourceButton(entry));
      });
    }

    section.append(header, dropzone);
    els.wordList.append(section);
  });
}

function renderEncyclopedia() {
  els.encyclopediaGrid.innerHTML = "";
  const discoveredWords = getDiscoveredEncyclopediaWords();

  ENCYCLOPEDIA_CATEGORIES.forEach((category) => {
    const discoveredInCategory = category.words.filter((word) => discoveredWords.has(word));

    const card = document.createElement("section");
    card.className = "category-card";

    const titleRow = document.createElement("div");
    titleRow.className = "category-title";

    const title = document.createElement("h3");
    title.textContent = category.name;

    const count = document.createElement("span");
    count.className = "category-count";
    count.textContent = `${discoveredInCategory.length} / ${category.words.length}`;

    titleRow.append(title, count);

    const list = document.createElement("div");
    list.className = "category-list";

    category.words.forEach((word) => {
      const entry = document.createElement("div");
      const isDiscovered = discoveredWords.has(word);
      entry.className = "encyclopedia-entry";
      entry.dataset.discovered = isDiscovered ? "true" : "false";
      entry.textContent = titleCase(word);
      list.append(entry);
    });

    card.append(titleRow, list);
    els.encyclopediaGrid.append(card);
  });
}

function setActiveSidebarTab(tab) {
  state.activeSidebarTab = tab;
  if (tab === "tokens") {
    state.unseenTokenRewards = 0;
  }
  renderSidebar();
}

function activateNegativeMixToken() {
  if (state.hasActiveNegativeMixToken) {
    setStatus("Negative mixing is already active.", "ok");
    return;
  }
  if (state.availableNegativeMixTokens <= 0) {
    setStatus("You do not have any minus-mix tokens yet.", "error");
    return;
  }

  state.availableNegativeMixTokens -= 1;
  state.hasActiveNegativeMixToken = true;
  clearNegativeMix();
  renderSidebar();
  renderNegativeMix();
  setStatus("Minus mixing is active for your next pair.", "ok");
}

function refundNegativeMixToken() {
  if (!state.hasActiveNegativeMixToken) {
    return;
  }

  state.availableNegativeMixTokens += 1;
  state.hasActiveNegativeMixToken = false;
  clearNegativeMix();
  renderSidebar();
  renderNegativeMix();
  setStatus("Minus-mix token refunded.", "ok");
}

function hideNegativeMixAfterUse() {
  state.hasActiveNegativeMixToken = false;
  clearNegativeMix();
  renderSidebar();
  renderNegativeMix();
}

function renderTokenPanel() {
  els.tokenList.innerHTML = "";

  if (state.availableNegativeMixTokens <= 0) {
    const empty = document.createElement("p");
    empty.className = "source-word-empty";
    empty.textContent = state.totalNegativeMixTokensEarned > 0
      ? "No unused tokens right now."
      : "No tokens yet.";
    els.tokenList.append(empty);
    return;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "token-button";
  button.draggable = true;
  button.innerHTML = `
    <span class="token-button-copy">
      <span class="token-button-title">Minus Mix</span>
      <span class="token-button-text">Click or drag onto the field to unlock one A - B mix.</span>
    </span>
    <span class="token-chip">${state.availableNegativeMixTokens}</span>
  `;
  button.addEventListener("click", () => {
    activateNegativeMixToken();
  });
  button.addEventListener("dragstart", (event) => {
    button.classList.add("is-dragging");
    event.dataTransfer.setData("application/x-negative-token", "minus-mix");
    event.dataTransfer.effectAllowed = "copy";
  });
  button.addEventListener("dragend", () => {
    button.classList.remove("is-dragging");
  });
  els.tokenList.append(button);
}

function renderSidebar() {
  updateCounts();
  const tokensUnlocked = state.totalNegativeMixTokensEarned > 0;
  const isTokenTabActive = state.activeSidebarTab === "tokens";
  els.sidebarTitle.textContent = isTokenTabActive ? "Usable Tokens" : "Word Panel";
  els.openWordTabButton.setAttribute("aria-selected", isTokenTabActive ? "false" : "true");
  els.openTokenTabButton.hidden = !tokensUnlocked;
  els.openTokenTabButton.setAttribute("aria-selected", isTokenTabActive ? "true" : "false");
  els.openTokenTabButton.classList.toggle("sidebar-tab-flashing", shouldFlashTokenTab());
  els.sidebarPanels.forEach((panel) => {
    panel.hidden = panel.dataset.sidebarPanel !== state.activeSidebarTab;
  });
  els.toggleGooglePickButton.hidden = isTokenTabActive;
  els.toggleGooglePickButton.setAttribute("aria-pressed", state.googlePickMode ? "true" : "false");
  renderWordList();
  renderTokenPanel();
  renderEncyclopedia();
}

function renderNegativeMix() {
  els.negativePanel.hidden = !state.hasActiveNegativeMixToken;
  if (els.negativePanel.hidden) {
    return;
  }

  const slots = [
    { key: "a", element: els.negativeWordA },
    { key: "b", element: els.negativeWordB },
  ];

  slots.forEach(({ key, element }) => {
    const word = state.negativeMix[key];
    element.textContent = word ? titleCase(word) : "Drop word";
    element.dataset.empty = word ? "false" : "true";
  });

  els.runNegativeButton.disabled = !(state.negativeMix.a && state.negativeMix.b);
}

function markWordAsSelfMatched(word) {
  state.selfMatchedWords.add(getWordKey(word));
  renderSidebar();
}

function describeOperation(operation) {
  return operation === "subtract" ? "A - B" : "A + B";
}

function isPreferredDiscoveredVariant(candidate, existing) {
  const candidateIng = candidate.endsWith("ing");
  const existingIng = existing.endsWith("ing");
  if (candidateIng !== existingIng) {
    return !candidateIng;
  }

  const candidatePlural = candidate.endsWith("s");
  const existingPlural = existing.endsWith("s");
  if (candidatePlural !== existingPlural) {
    return !candidatePlural;
  }

  return candidate.length < existing.length;
}

function getCanonicalWord(result, normalized = result) {
  const starterVariant = state.starters.find((word) => word === normalized);
  if (starterVariant && !isPreferredDiscoveredVariant(result, starterVariant)) {
    return starterVariant;
  }

  const discoveredVariant = state.discovered.get(normalized);
  if (discoveredVariant && !isPreferredDiscoveredVariant(result, discoveredVariant)) {
    return discoveredVariant;
  }

  return result;
}

function setLastMix(label, operation, candidates) {
  state.lastMix = {
    label,
    operation: describeOperation(operation),
    candidates,
  };
}

function getMixOutcomeMessage(leftWord, rightWord, canonicalResult, operation, isInEncyclopedia, wasDiscovered, newTokensEarned) {
  const operator = operation === "subtract" ? "-" : "+";
  let message;
  let stateName;

  if (isInEncyclopedia && !wasDiscovered) {
    message = `${titleCase(leftWord)} ${operator} ${titleCase(rightWord)} created ${titleCase(canonicalResult)}. It was added to the encyclopedia.`;
    stateName = "success";
  } else if (isInEncyclopedia) {
    message = `${titleCase(leftWord)} ${operator} ${titleCase(rightWord)} created ${titleCase(canonicalResult)}. It was already in the encyclopedia, so it only appeared on the field.`;
    stateName = "ok";
  } else {
    message = `${titleCase(leftWord)} ${operator} ${titleCase(rightWord)} created ${titleCase(canonicalResult)}. It is not one of the 40 encyclopedia words, so it only appeared on the field.`;
    stateName = "ok";
  }

  if (newTokensEarned > 0) {
    const tokenSuffix = newTokensEarned === 1 ? "token" : "tokens";
    message = `${message} Congrats! You earned ${newTokensEarned} minus-mix ${tokenSuffix}.`;
    stateName = "reward";
  }

  return { message, stateName };
}

function getMatchHistoryKey(wordA, wordB, result, operation) {
  if (operation === "subtract") {
    return `${operation}:${wordA.toLowerCase()}|${wordB.toLowerCase()}=>${result.toLowerCase()}`;
  }

  const [first, second] = [wordA.toLowerCase(), wordB.toLowerCase()].sort((a, b) => a.localeCompare(b));
  return `${operation}:${first}|${second}=>${result.toLowerCase()}`;
}

function recordMatch(wordA, wordB, result, operation) {
  const key = getMatchHistoryKey(wordA, wordB, result, operation);
  if (state.matchHistoryKeys.has(key)) {
    return;
  }

  state.matchHistoryKeys.add(key);
  state.matchHistory.unshift({
    left: wordA,
    right: wordB,
    result,
    operation,
  });
  while (state.matchHistory.length > MATCH_HISTORY_LIMIT) {
    const removedMatch = state.matchHistory.pop();
    if (!removedMatch) {
      break;
    }
    state.matchHistoryKeys.delete(
      getMatchHistoryKey(removedMatch.left, removedMatch.right, removedMatch.result, removedMatch.operation),
    );
  }
  updateCounts();
  renderHistory();
}

function renderHistory() {
  els.historyList.innerHTML = "";
  els.toggleHistorySortButton.textContent = state.historySort === "recent" ? "Sort by Result" : "Show Recent";

  if (state.matchHistory.length === 0) {
    const empty = document.createElement("p");
    empty.className = "source-word-empty";
    empty.textContent = "No matches recorded yet.";
    els.historyList.append(empty);
    return;
  }

  const matches = [...state.matchHistory];
  if (state.historySort === "result") {
    matches.sort((a, b) => {
      const resultCompare = a.result.localeCompare(b.result);
      if (resultCompare !== 0) {
        return resultCompare;
      }
      const operationCompare = a.operation.localeCompare(b.operation);
      if (operationCompare !== 0) {
        return operationCompare;
      }
      const leftCompare = a.left.localeCompare(b.left);
      if (leftCompare !== 0) {
        return leftCompare;
      }
      return a.right.localeCompare(b.right);
    });
  }

  matches.forEach((match) => {
    const item = document.createElement("div");
    item.className = "history-item";

    const main = document.createElement("div");
    main.className = "history-item-main";
    main.textContent = `${titleCase(match.left)} ${match.operation === "subtract" ? "-" : "+"} ${titleCase(match.right)} = ${titleCase(match.result)}`;

    const meta = document.createElement("div");
    meta.className = "history-item-meta";
    meta.textContent = match.operation === "subtract" ? "Negative mix" : "Standard mix";

    item.append(main, meta);
    els.historyList.append(item);
  });
}

function makeTile(word, x, y) {
  const bounds = getPlayfieldBounds();
  return {
    id: state.nextTileId,
    word,
    x: clamp(x, 0, bounds.maxX),
    y: clamp(y, 0, bounds.maxY),
    zIndex: state.nextZIndex,
  };
}

function getDefaultSpawnPosition() {
  const bounds = getPlayfieldBounds();
  const centerX = Math.max(0, (bounds.width / 2) - (TILE_WIDTH / 2));
  const centerY = Math.max(0, (bounds.height / 2) - (TILE_HEIGHT / 2));
  const jitterX = Math.floor((Math.random() * 120) - 60);
  const jitterY = Math.floor((Math.random() * 120) - 60);
  return {
    x: clamp(centerX + jitterX, 0, bounds.maxX),
    y: clamp(centerY + jitterY, 0, bounds.maxY),
  };
}

function spawnWordOnField(word, position = null) {
  const spawnPosition = position || getDefaultSpawnPosition();
  const newTile = makeTile(word, spawnPosition.x, spawnPosition.y);
  state.tiles.push(newTile);
  state.nextTileId += 1;
  state.nextZIndex += 1;
  renderTiles();
}

function removeTile(tileId) {
  state.tiles = state.tiles.filter((tile) => tile.id !== tileId);
  renderTiles();
}

function getTileRect(tile) {
  return {
    left: tile.x,
    top: tile.y,
    right: tile.x + TILE_WIDTH,
    bottom: tile.y + TILE_HEIGHT,
  };
}

function getOverlapArea(tileA, tileB) {
  const rectA = getTileRect(tileA);
  const rectB = getTileRect(tileB);
  const overlapWidth = Math.max(0, Math.min(rectA.right, rectB.right) - Math.max(rectA.left, rectB.left));
  const overlapHeight = Math.max(0, Math.min(rectA.bottom, rectB.bottom) - Math.max(rectA.top, rectB.top));
  return overlapWidth * overlapHeight;
}

function findMixTarget(sourceTile) {
  let bestTarget = null;
  let bestOverlap = 0;

  state.tiles.forEach((tile) => {
    if (tile.id === sourceTile.id) {
      return;
    }

    const overlap = getOverlapArea(sourceTile, tile);
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      bestTarget = tile;
    }
  });

  return bestOverlap >= 1800 ? bestTarget : null;
}

function spawnResultTile(word, firstTile, secondTile) {
  const bounds = getPlayfieldBounds();
  const x = clamp(Math.round((firstTile.x + secondTile.x) / 2) + 22, 0, bounds.maxX);
  const y = clamp(Math.round((firstTile.y + secondTile.y) / 2) + 22, 0, bounds.maxY);
  spawnWordOnField(word, { x, y });
}

function handleTileClick(word, position) {
  if (state.googlePickMode) {
    openGoogleMeaning(word);
    return Promise.resolve();
  }

  const now = Date.now();
  const sameWord = state.clickTracker.word === word;
  const withinWindow = now - state.clickTracker.time <= DOUBLE_CLICK_MS;

  if (sameWord && withinWindow) {
    state.clickTracker.word = null;
    state.clickTracker.time = 0;
    return runSelfMatch(word, position);
  }

  state.clickTracker.word = word;
  state.clickTracker.time = now;
  return Promise.resolve();
}

async function runSelfMatch(word, position = null) {
  const mix = await getAssociation(word, word, "add");
  setLastMix(`${titleCase(word)} + ${titleCase(word)}`, "add", mix.candidates);
  const { canonicalResult, isInEncyclopedia, wasDiscovered, newTokensEarned } = rememberResult(mix.result, mix.normalized);
  markWordAsSelfMatched(word);
  recordMatch(word, word, canonicalResult, "add");
  spawnWordOnField(canonicalResult, position);
  const status = getMixOutcomeMessage(word, word, canonicalResult, "add", isInEncyclopedia, wasDiscovered, newTokensEarned);
  setStatus(status.message, status.stateName);
}

async function handleMix(firstTile, secondTile) {
  const mix = await getAssociation(firstTile.word, secondTile.word, "add");
  setLastMix(`${titleCase(firstTile.word)} + ${titleCase(secondTile.word)}`, "add", mix.candidates);
  const { canonicalResult, isInEncyclopedia, wasDiscovered, newTokensEarned } = rememberResult(mix.result, mix.normalized);
  if (firstTile.word.toLowerCase() === secondTile.word.toLowerCase()) {
    markWordAsSelfMatched(firstTile.word);
  }
  recordMatch(firstTile.word, secondTile.word, canonicalResult, "add");
  spawnResultTile(canonicalResult, firstTile, secondTile);
  const status = getMixOutcomeMessage(
    firstTile.word,
    secondTile.word,
    canonicalResult,
    "add",
    isInEncyclopedia,
    wasDiscovered,
    newTokensEarned,
  );
  setStatus(status.message, status.stateName);
}

function rememberResult(result, normalized = result) {
  const canonicalResult = getCanonicalWord(result, normalized);
  const isInEncyclopedia = Boolean(getEncyclopediaEntry(canonicalResult, normalized));
  const existing = state.discovered.get(normalized);
  const wasDiscovered = Boolean(existing);
  const canonicalIsStarter = state.starters.includes(canonicalResult);
  let didDiscoverNewWord = false;

  if (!existing && !canonicalIsStarter) {
    state.discovered.set(normalized, canonicalResult);
    didDiscoverNewWord = true;
  } else if (existing && existing !== canonicalResult && isPreferredDiscoveredVariant(canonicalResult, existing)) {
    state.discovered.set(normalized, canonicalResult);
  }

  const unlockedTokenCount = getUnlockedTokenCount();
  const newTokensEarned = Math.max(0, unlockedTokenCount - state.totalNegativeMixTokensEarned);
  if (newTokensEarned > 0) {
    state.totalNegativeMixTokensEarned = unlockedTokenCount;
    state.availableNegativeMixTokens += newTokensEarned;
    state.unseenTokenRewards += newTokensEarned;
    if (state.activeSidebarTab === "tokens") {
      state.unseenTokenRewards = 0;
    }
  }

  if (didDiscoverNewWord || newTokensEarned > 0) {
    renderSidebar();
  }

  return { canonicalResult, isInEncyclopedia, wasDiscovered, newTokensEarned };
}

async function runNegativeMix() {
  if (!(state.negativeMix.a && state.negativeMix.b)) {
    setStatus("Negative mixing needs both A and B.", "error");
    return;
  }

  const mix = await getAssociation(state.negativeMix.a, state.negativeMix.b, "subtract");
  setLastMix(`${titleCase(state.negativeMix.a)} - ${titleCase(state.negativeMix.b)}`, "subtract", mix.candidates);
  const { canonicalResult, isInEncyclopedia, wasDiscovered, newTokensEarned } = rememberResult(mix.result, mix.normalized);
  recordMatch(state.negativeMix.a, state.negativeMix.b, canonicalResult, "subtract");
  spawnWordOnField(canonicalResult, { x: 340, y: 48 });
  const status = getMixOutcomeMessage(
    state.negativeMix.a,
    state.negativeMix.b,
    canonicalResult,
    "subtract",
    isInEncyclopedia,
    wasDiscovered,
    newTokensEarned,
  );
  hideNegativeMixAfterUse();
  setStatus(status.message, status.stateName);
}

function clearNegativeMix() {
  state.negativeMix.a = null;
  state.negativeMix.b = null;
  renderNegativeMix();
}

function assignNegativeSlot(slot, word) {
  if (!state.hasActiveNegativeMixToken) {
    setStatus("Use a minus-mix token first.", "error");
    return;
  }
  state.negativeMix[slot] = word;
  renderNegativeMix();
}

function getNegativeSlotAtPoint(clientX, clientY) {
  if (!state.hasActiveNegativeMixToken) {
    return null;
  }
  const element = document.elementFromPoint(clientX, clientY);
  return element ? element.closest("[data-negative-slot]") : null;
}

function startTileDrag(event, tileId) {
  if (event.button !== 0) {
    return;
  }

  const tile = state.tiles.find((entry) => entry.id === tileId);
  if (!tile) {
    return;
  }

  event.preventDefault();

  const tileElement = event.currentTarget;
  const fieldRect = els.playfield.getBoundingClientRect();
  const tileRect = tileElement.getBoundingClientRect();
  const pointerOffsetX = event.clientX - tileRect.left;
  const pointerOffsetY = event.clientY - tileRect.top;
  const startClientX = event.clientX;
  const startClientY = event.clientY;
  let dragStarted = false;

  const move = (moveEvent) => {
    const deltaX = moveEvent.clientX - startClientX;
    const deltaY = moveEvent.clientY - startClientY;
    const distance = Math.hypot(deltaX, deltaY);

    if (!dragStarted) {
      if (distance < DRAG_THRESHOLD) {
        return;
      }

      dragStarted = true;
      state.nextZIndex += 1;
      tile.zIndex = state.nextZIndex;
      tileElement.classList.add("dragging");
      tileElement.style.zIndex = String(tile.zIndex);
    }

    const bounds = getPlayfieldBounds();
    tile.x = clamp(moveEvent.clientX - fieldRect.left - pointerOffsetX, 0, bounds.maxX);
    tile.y = clamp(moveEvent.clientY - fieldRect.top - pointerOffsetY, 0, bounds.maxY);
    tileElement.style.left = `${tile.x}px`;
    tileElement.style.top = `${tile.y}px`;
  };

  const end = async (endEvent) => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
    tileElement.classList.remove("dragging");

    if (!dragStarted) {
      try {
        await handleTileClick(tile.word, {
          x: clamp(tile.x + 28, 0, getPlayfieldBounds().maxX),
          y: clamp(tile.y + 28, 0, getPlayfieldBounds().maxY),
        });
      } catch (error) {
        setStatus(error.message, "error");
      }
      return;
    }

    const negativeSlotElement = getNegativeSlotAtPoint(endEvent.clientX, endEvent.clientY);
    if (negativeSlotElement) {
      const slot = negativeSlotElement.dataset.negativeSlot;
      assignNegativeSlot(slot, tile.word);
      renderTiles();
      setStatus(`${titleCase(tile.word)} was placed into slot ${slot.toUpperCase()}.`);
      return;
    }

    const targetTile = findMixTarget(tile);
    if (targetTile) {
      try {
        await handleMix(tile, targetTile);
      } catch (error) {
        renderTiles();
        setStatus(error.message, "error");
      }
      return;
    }

    renderTiles();
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end, { once: true });
}

function renderTiles() {
  els.playfield.querySelectorAll(".tile").forEach((tile) => tile.remove());
  els.emptyMessage.hidden = state.tiles.length > 0;

  [...state.tiles]
    .sort((a, b) => a.zIndex - b.zIndex)
    .forEach((tile) => {
      const tileElement = document.createElement("div");
      tileElement.className = "tile";
      tileElement.dataset.kind = "discovered";
      tileElement.style.left = `${tile.x}px`;
      tileElement.style.top = `${tile.y}px`;
      tileElement.style.zIndex = String(tile.zIndex);
      tileElement.addEventListener("pointerdown", (event) => startTileDrag(event, tile.id));
      tileElement.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        removeTile(tile.id);
        setStatus(`${titleCase(tile.word)} was removed from the field.`);
      });

      const wordElement = document.createElement("div");
      wordElement.className = "tile-word";
      wordElement.textContent = titleCase(tile.word);

      const metaElement = document.createElement("div");
      metaElement.className = "tile-meta";
      const categoryName = getVisibleCategoryNameForWord(tile.word);
      metaElement.textContent = categoryName;
      metaElement.hidden = !categoryName;

      tileElement.append(wordElement, metaElement);
      els.playfield.append(tileElement);
    });
}

function clearField() {
  state.tiles = [];
  renderTiles();
  setStatus("The field was cleared.");
}

function openEncyclopedia() {
  els.encyclopediaModal.hidden = false;
}

function closeEncyclopedia() {
  els.encyclopediaModal.hidden = true;
}

function openHistory() {
  els.historyModal.hidden = false;
}

function closeHistory() {
  els.historyModal.hidden = true;
}

function resetRun() {
  state.starters = sampleStarters();
  state.discovered = new Map(state.starters.map((word) => [word, word]));
  state.selfMatchedWords = new Set();
  state.tiles = [];
  state.search = "";
  state.negativeMix.a = null;
  state.negativeMix.b = null;
  state.lastMix = {
    label: "No mix yet.",
    operation: "None",
    candidates: [],
  };
  state.matchHistory = [];
  state.matchHistoryKeys = new Set();
  state.historySort = "recent";
  state.wordCategories = createDefaultCategoryState();
  state.wordAssignments = new Map(state.starters.map((word) => [word, DEFAULT_CATEGORY_ID]));
  state.googlePickMode = false;
  state.clickTracker.word = null;
  state.clickTracker.time = 0;
  state.availableNegativeMixTokens = 0;
  state.totalNegativeMixTokensEarned = 0;
  state.hasActiveNegativeMixToken = false;
  state.activeSidebarTab = "words";
  state.unseenTokenRewards = 0;
  state.nextTileId = 1;
  state.nextZIndex = 1;
  els.wordSearch.value = "";

  renderSidebar();
  renderTiles();
  renderNegativeMix();
  renderHistory();

  const bounds = getPlayfieldBounds();
  spawnWordOnField(state.starters[0], { x: Math.round(bounds.width * 0.18), y: Math.round(bounds.height * 0.35) });
  spawnWordOnField(state.starters[1], { x: Math.round(bounds.width * 0.58), y: Math.round(bounds.height * 0.35) });

  setStatus(
    `New run started with ${titleCase(state.starters[0])} and ${titleCase(state.starters[1])}. Mix them to discover new words.`,
    "ok",
  );
}

function initPlayfieldDropzone() {
  els.playfield.addEventListener("dragover", (event) => {
    event.preventDefault();
    els.playfield.dataset.dragOver = "true";
  });

  els.playfield.addEventListener("dragleave", () => {
    els.playfield.dataset.dragOver = "false";
  });

  els.playfield.addEventListener("drop", (event) => {
    event.preventDefault();
    els.playfield.dataset.dragOver = "false";

    const tokenType = event.dataTransfer.getData("application/x-negative-token");
    if (tokenType === "minus-mix") {
      activateNegativeMixToken();
      return;
    }

    const word = event.dataTransfer.getData("text/plain");
    if (!word) {
      return;
    }

    const fieldRect = els.playfield.getBoundingClientRect();
    const bounds = getPlayfieldBounds();
    const x = clamp(event.clientX - fieldRect.left - (TILE_WIDTH / 2), 0, bounds.maxX);
    const y = clamp(event.clientY - fieldRect.top - (TILE_HEIGHT / 2), 0, bounds.maxY);
    spawnWordOnField(word, { x, y });
    setStatus(`${titleCase(word)} was dropped onto the field.`);
  });
}

function initNegativeMixDropzones() {
  els.negativeSlots.forEach((slotElement) => {
    const slot = slotElement.dataset.negativeSlot;

    slotElement.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.stopPropagation();
      slotElement.dataset.dragOver = "true";
    });

    slotElement.addEventListener("dragleave", () => {
      slotElement.dataset.dragOver = "false";
    });

    slotElement.addEventListener("drop", (event) => {
      event.preventDefault();
      event.stopPropagation();
      slotElement.dataset.dragOver = "false";
      const word = event.dataTransfer.getData("text/plain");
      if (!word) {
        return;
      }
      assignNegativeSlot(slot, word);
      setStatus(`${titleCase(word)} was placed into slot ${slot.toUpperCase()}.`);
    });
  });
}

function initEvents() {
  els.wordSearch.addEventListener("input", (event) => {
    state.search = event.target.value.trim().toLowerCase();
    renderWordList();
  });

  els.openWordTabButton.addEventListener("click", () => {
    setActiveSidebarTab("words");
  });
  els.openTokenTabButton.addEventListener("click", () => {
    setActiveSidebarTab("tokens");
  });
  els.resetButton.addEventListener("click", resetRun);
  els.clearFieldButton.addEventListener("click", clearField);
  els.clearNegativeButton.addEventListener("click", clearNegativeMix);
  els.closeNegativeButton.addEventListener("click", refundNegativeMixToken);
  els.addCategoryButton.addEventListener("click", () => {
    const name = window.prompt("Category name?");
    if (!name) {
      return;
    }
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    const id = `category-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    state.wordCategories.push({
      id,
      name: trimmed,
      collapsed: false,
    });
    renderWordList();
    setStatus(`Created category ${trimmed}.`);
  });
  els.toggleGooglePickButton.addEventListener("click", () => {
    const nextMode = !state.googlePickMode;
    setGooglePickMode(nextMode);
    setStatus(nextMode
      ? "Google mode is on. Click a field word or available word to search its meaning."
      : "Google mode is off.");
  });
  els.runNegativeButton.addEventListener("click", async () => {
    try {
      await runNegativeMix();
    } catch (error) {
      setStatus(error.message, "error");
    }
  });
  els.openHistoryButton.addEventListener("click", openHistory);
  els.closeHistoryButton.addEventListener("click", closeHistory);
  els.toggleHistorySortButton.addEventListener("click", () => {
    state.historySort = state.historySort === "recent" ? "result" : "recent";
    renderHistory();
  });
  els.openEncyclopediaButton.addEventListener("click", openEncyclopedia);
  els.closeEncyclopediaButton.addEventListener("click", closeEncyclopedia);

  els.encyclopediaModal.addEventListener("click", (event) => {
    if (event.target === els.encyclopediaModal) {
      closeEncyclopedia();
    }
  });
  els.historyModal.addEventListener("click", (event) => {
    if (event.target === els.historyModal) {
      closeHistory();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.historyModal.hidden) {
      closeHistory();
    }
    if (event.key === "Escape" && !els.encyclopediaModal.hidden) {
      closeEncyclopedia();
    }
  });

  window.addEventListener("resize", () => {
    const bounds = getPlayfieldBounds();
    state.tiles = state.tiles.map((tile) => ({
      ...tile,
      x: clamp(tile.x, 0, bounds.maxX),
      y: clamp(tile.y, 0, bounds.maxY),
    }));
    renderTiles();
  });

  initPlayfieldDropzone();
  initNegativeMixDropzones();
}

function init() {
  initEvents();
  renderSidebar();
  renderTiles();
  renderNegativeMix();
  renderHistory();
  resetRun();
}

init();
