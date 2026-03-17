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
const SECOND_RESULT_TOKEN_DROP_RATE = 0.05;
const GARBAGE_BIN_UNLOCK_WORDS = 50;
const GARBAGE_WORDS_PER_TOKEN_BASE = 15;
const AVAILABLE_WORD_WARNING_THRESHOLD = 50;
const STORAGE_KEY = "wordmath-progress-v1";

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
  negativeMixSources: {
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
  removedResultWords: new Set(),
  hiddenWordPanelWords: new Set(),
  garbageWordsSinceReward: 0,
  garbageRewardLevel: 0,
  availableNegativeMixTokens: 0,
  totalNegativeMixTokensEarned: 0,
  availableBanWordTokens: 0,
  totalBanWordTokensEarned: 0,
  availableSecondResultTokens: 0,
  totalSecondResultTokensEarned: 0,
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
  garbagePanel: document.querySelector("[data-garbage-panel]"),
  garbageBin: document.querySelector("[data-garbage-bin]"),
  garbageProgress: document.querySelector("[data-garbage-progress]"),
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
  openSettingsButton: document.querySelector("[data-action='open-settings']"),
  closeSettingsButton: document.querySelector("[data-action='close-settings']"),
  exportSaveButton: document.querySelector("[data-action='export-save']"),
  importSaveButton: document.querySelector("[data-action='import-save']"),
  settingsModal: document.querySelector("[data-settings-modal]"),
  saveFileInput: document.querySelector("[data-save-file-input]"),
};

let pendingProgressSave = null;
let activeFloatingCandidatePreview = null;
let activeFloatingCandidatePreviewTimeout = null;

function getSafeCount(value, fallback = 0) {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : fallback;
}

function getStringList(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

function buildProgressSnapshot() {
  return {
    version: 1,
    starters: [...state.starters],
    discovered: [...state.discovered.entries()],
    selfMatchedWords: [...state.selfMatchedWords],
    tiles: state.tiles.map((tile) => ({
      id: tile.id,
      word: tile.word,
      secondResultTagged: Boolean(tile.secondResultTagged),
      x: tile.x,
      y: tile.y,
      zIndex: tile.zIndex,
    })),
    negativeMix: { ...state.negativeMix },
    negativeMixSources: { ...state.negativeMixSources },
    lastMix: {
      label: state.lastMix.label,
      operation: state.lastMix.operation,
      candidates: Array.isArray(state.lastMix.candidates) ? [...state.lastMix.candidates] : [],
    },
    matchHistory: state.matchHistory.map((match) => ({
      ...match,
      nextCandidates: Array.isArray(match.nextCandidates) ? [...match.nextCandidates] : [],
    })),
    historySort: state.historySort,
    wordCategories: state.wordCategories.map((category) => ({
      id: category.id,
      name: category.name,
      collapsed: Boolean(category.collapsed),
    })),
    wordAssignments: [...state.wordAssignments.entries()],
    removedResultWords: [...state.removedResultWords],
    hiddenWordPanelWords: [...state.hiddenWordPanelWords],
    garbageWordsSinceReward: state.garbageWordsSinceReward,
    garbageRewardLevel: state.garbageRewardLevel,
    availableNegativeMixTokens: state.availableNegativeMixTokens,
    totalNegativeMixTokensEarned: state.totalNegativeMixTokensEarned,
    availableBanWordTokens: state.availableBanWordTokens,
    totalBanWordTokensEarned: state.totalBanWordTokensEarned,
    availableSecondResultTokens: state.availableSecondResultTokens,
    totalSecondResultTokensEarned: state.totalSecondResultTokensEarned,
    hasActiveNegativeMixToken: state.hasActiveNegativeMixToken,
    activeSidebarTab: state.activeSidebarTab,
    unseenTokenRewards: state.unseenTokenRewards,
    nextTileId: state.nextTileId,
    nextZIndex: state.nextZIndex,
  };
}

function downloadProgressSnapshot() {
  const snapshotJson = JSON.stringify(buildProgressSnapshot(), null, 2);
  const snapshotBlob = new Blob([snapshotJson], { type: "application/json" });
  const snapshotUrl = URL.createObjectURL(snapshotBlob);
  const link = document.createElement("a");
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  link.href = snapshotUrl;
  link.download = `wordmath-save-${timestamp}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => {
    URL.revokeObjectURL(snapshotUrl);
  }, 0);
}

function saveProgress() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(buildProgressSnapshot()));
  } catch (error) {
    console.warn("[wordmath] Could not save progress.", error);
  }
}

function queueProgressSave() {
  if (pendingProgressSave !== null) {
    window.clearTimeout(pendingProgressSave);
  }
  pendingProgressSave = window.setTimeout(() => {
    pendingProgressSave = null;
    saveProgress();
  }, 50);
}

function normalizeSavedTiles(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((tile) => tile && typeof tile.word === "string")
    .map((tile) => ({
      id: getSafeCount(tile.id, 0),
      word: tile.word,
      secondResultTagged: Boolean(tile.secondResultTagged),
      x: Number.isFinite(tile.x) ? tile.x : 0,
      y: Number.isFinite(tile.y) ? tile.y : 0,
      zIndex: getSafeCount(tile.zIndex, 1),
    }))
    .filter((tile) => tile.id > 0);
}

function normalizeSavedHistory(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((match) => match
      && typeof match.left === "string"
      && typeof match.right === "string"
      && typeof match.result === "string"
      && typeof match.operation === "string")
    .map((match) => ({
      left: match.left,
      right: match.right,
      result: match.result,
      operation: match.operation,
      nextCandidates: getStringList(match.nextCandidates),
    }));
}

function normalizeSavedCategories(value) {
  const categories = Array.isArray(value)
    ? value
      .filter((category) => category && typeof category.id === "string" && typeof category.name === "string")
      .map((category) => ({
        id: category.id,
        name: category.name,
        collapsed: Boolean(category.collapsed),
      }))
    : [];

  if (!categories.some((category) => category.id === DEFAULT_CATEGORY_ID)) {
    categories.unshift({
      id: DEFAULT_CATEGORY_ID,
      name: "Uncategorized",
      collapsed: false,
    });
  }

  return categories;
}

function applyProgressSnapshot(snapshot, { statusMessage = "Loaded your saved game." } = {}) {
  const starters = getStringList(snapshot?.starters);
  if (starters.length !== 2) {
    return false;
  }

  const discoveredEntries = Array.isArray(snapshot.discovered)
    ? snapshot.discovered.filter((entry) =>
      Array.isArray(entry)
      && typeof entry[0] === "string"
      && typeof entry[1] === "string")
    : [];
  const discovered = new Map(discoveredEntries);
  starters.forEach((word) => {
    if (!discovered.has(word)) {
      discovered.set(word, word);
    }
  });

  const tiles = normalizeSavedTiles(snapshot.tiles);
  const tileIds = new Set(tiles.map((tile) => tile.id));
  const categories = normalizeSavedCategories(snapshot.wordCategories);
  const validCategoryIds = new Set(categories.map((category) => category.id));
  const wordAssignments = new Map(
    Array.isArray(snapshot.wordAssignments)
      ? snapshot.wordAssignments.filter((entry) =>
        Array.isArray(entry)
        && typeof entry[0] === "string"
        && typeof entry[1] === "string"
        && validCategoryIds.has(entry[1]))
      : [],
  );

  state.starters = starters;
  state.discovered = discovered;
  state.selfMatchedWords = new Set(getStringList(snapshot.selfMatchedWords));
  state.tiles = tiles;
  state.search = "";
  state.negativeMix.a = typeof snapshot.negativeMix?.a === "string" ? snapshot.negativeMix.a : null;
  state.negativeMix.b = typeof snapshot.negativeMix?.b === "string" ? snapshot.negativeMix.b : null;
  state.negativeMixSources.a = tileIds.has(snapshot.negativeMixSources?.a) ? snapshot.negativeMixSources.a : null;
  state.negativeMixSources.b = tileIds.has(snapshot.negativeMixSources?.b) ? snapshot.negativeMixSources.b : null;
  state.lastMix = {
    label: typeof snapshot.lastMix?.label === "string" ? snapshot.lastMix.label : "No mix yet.",
    operation: typeof snapshot.lastMix?.operation === "string" ? snapshot.lastMix.operation : "None",
    candidates: Array.isArray(snapshot.lastMix?.candidates) ? [...snapshot.lastMix.candidates] : [],
  };
  state.matchHistory = normalizeSavedHistory(snapshot.matchHistory);
  state.matchHistoryKeys = new Set(
    state.matchHistory.map((match) =>
      getMatchHistoryKey(match.left, match.right, match.result, match.operation)),
  );
  state.historySort = snapshot.historySort === "result" ? "result" : "recent";
  state.wordCategories = categories;
  state.wordAssignments = wordAssignments;
  state.googlePickMode = false;
  state.clickTracker.word = null;
  state.clickTracker.time = 0;
  state.removedResultWords = new Set(getStringList(snapshot.removedResultWords));
  state.hiddenWordPanelWords = new Set(getStringList(snapshot.hiddenWordPanelWords));
  state.garbageRewardLevel = getSafeCount(snapshot.garbageRewardLevel);
  state.garbageWordsSinceReward = getSafeCount(snapshot.garbageWordsSinceReward) % getCurrentGarbageTarget();
  state.availableNegativeMixTokens = getSafeCount(snapshot.availableNegativeMixTokens);
  state.totalNegativeMixTokensEarned = getSafeCount(snapshot.totalNegativeMixTokensEarned);
  state.availableBanWordTokens = getSafeCount(snapshot.availableBanWordTokens);
  state.totalBanWordTokensEarned = getSafeCount(snapshot.totalBanWordTokensEarned);
  state.availableSecondResultTokens = getSafeCount(snapshot.availableSecondResultTokens);
  state.totalSecondResultTokensEarned = getSafeCount(snapshot.totalSecondResultTokensEarned);
  state.hasActiveNegativeMixToken = Boolean(snapshot.hasActiveNegativeMixToken);
  state.activeSidebarTab = snapshot.activeSidebarTab === "tokens" && hasUnlockedAnyTokenType()
    ? "tokens"
    : "words";
  state.unseenTokenRewards = getSafeCount(snapshot.unseenTokenRewards);
  state.nextTileId = Math.max(
    getSafeCount(snapshot.nextTileId, 1),
    ...tiles.map((tile) => tile.id + 1),
    1,
  );
  state.nextZIndex = Math.max(
    getSafeCount(snapshot.nextZIndex, 1),
    ...tiles.map((tile) => tile.zIndex + 1),
    1,
  );
  els.wordSearch.value = "";

  if (!state.hasActiveNegativeMixToken) {
    state.negativeMix.a = null;
    state.negativeMix.b = null;
    state.negativeMixSources.a = null;
    state.negativeMixSources.b = null;
  }

  renderSidebar();
  renderTiles();
  renderNegativeMix();
  renderHistory();
  setStatus(statusMessage, "ok");
  clearFloatingCandidatePreview();
  return true;
}

function loadProgress() {
  let snapshot;
  try {
    const rawProgress = window.localStorage.getItem(STORAGE_KEY);
    if (!rawProgress) {
      return false;
    }
    snapshot = JSON.parse(rawProgress);
  } catch (error) {
    console.warn("[wordmath] Could not read saved progress.", error);
    window.localStorage.removeItem(STORAGE_KEY);
    return false;
  }

  return applyProgressSnapshot(snapshot);
}

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

  state.hiddenWordPanelWords.forEach((wordKey) => {
    available.delete(wordKey);
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

function isGarbageBinUnlocked() {
  return state.discovered.size >= GARBAGE_BIN_UNLOCK_WORDS;
}

function getCurrentGarbageTarget() {
  return GARBAGE_WORDS_PER_TOKEN_BASE + ((state.garbageRewardLevel * (state.garbageRewardLevel + 1)) / 2);
}

function getTotalUsableTokenCount() {
  return state.availableNegativeMixTokens + state.availableBanWordTokens + state.availableSecondResultTokens;
}

function hasUnlockedAnyTokenType() {
  return state.totalNegativeMixTokensEarned > 0
    || state.totalBanWordTokensEarned > 0
    || state.totalSecondResultTokensEarned > 0;
}

function shouldFlashTokenTab() {
  return state.unseenTokenRewards > 0 && getTotalUsableTokenCount() > 0 && state.activeSidebarTab !== "tokens";
}

function getTileById(tileId) {
  return state.tiles.find((tile) => tile.id === tileId) || null;
}

function getTaggedTileIds(tileIds) {
  return [...new Set(
    tileIds.filter((tileId) => {
      const tile = getTileById(tileId);
      return Boolean(tile?.secondResultTagged);
    }),
  )];
}

function releaseSecondResultTags(tileIds, { refund = false } = {}) {
  let releasedCount = 0;
  getTaggedTileIds(tileIds).forEach((tileId) => {
    const tile = getTileById(tileId);
    if (!tile || !tile.secondResultTagged) {
      return;
    }
    tile.secondResultTagged = false;
    releasedCount += 1;
  });

  if (refund && releasedCount > 0) {
    state.availableSecondResultTokens += releasedCount;
  }

  if (releasedCount > 0) {
    renderSidebar();
  }

  return releasedCount;
}

function getCandidateResultKey(candidate) {
  return (candidate.normalized || candidate.word || "").toLowerCase();
}

function addFamilyForm(forms, value) {
  if (!value || !/^[a-z]+$/.test(value) || value.length < 2) {
    return;
  }
  forms.add(value);
}

function getWordFamilyForms(word) {
  const lowered = (word || "").trim().toLowerCase();
  const forms = new Set();
  if (!lowered) {
    return forms;
  }

  addFamilyForm(forms, lowered);

  if (lowered.endsWith("ies") && lowered.length > 3) {
    addFamilyForm(forms, `${lowered.slice(0, -3)}y`);
  }
  if (lowered.endsWith("ied") && lowered.length > 3) {
    addFamilyForm(forms, `${lowered.slice(0, -3)}y`);
  }
  if (lowered.endsWith("ing") && lowered.length > 4) {
    const stem = lowered.slice(0, -3);
    addFamilyForm(forms, stem);
    addFamilyForm(forms, `${stem}e`);
    if (stem.length >= 2 && stem.at(-1) === stem.at(-2)) {
      addFamilyForm(forms, stem.slice(0, -1));
    }
  }
  if (lowered.endsWith("ed") && lowered.length > 3) {
    const stem = lowered.slice(0, -2);
    addFamilyForm(forms, stem);
    addFamilyForm(forms, `${stem}e`);
    if (stem.length >= 2 && stem.at(-1) === stem.at(-2)) {
      addFamilyForm(forms, stem.slice(0, -1));
    }
  }
  if (lowered.endsWith("es") && lowered.length > 3) {
    addFamilyForm(forms, lowered.slice(0, -2));
    addFamilyForm(forms, lowered.slice(0, -1));
  }
  if (lowered.endsWith("s") && lowered.length > 2 && !lowered.endsWith("ss")) {
    addFamilyForm(forms, lowered.slice(0, -1));
  }

  return forms;
}

function getRemovalKeysForWord(word) {
  const keys = new Set();
  const loweredWord = (word || "").trim().toLowerCase();
  const wordKey = getWordKey(word);
  [loweredWord, wordKey].forEach((value) => {
    if (!value) {
      return;
    }
    keys.add(value);
    getWordFamilyForms(value).forEach((form) => keys.add(form));
  });
  return keys;
}

function isCandidateRemoved(candidate) {
  const candidateKeys = new Set();
  const candidateWord = (candidate.word || "").toLowerCase();
  const candidateNormalized = getCandidateResultKey(candidate);

  [candidateWord, candidateNormalized].forEach((value) => {
    if (!value) {
      return;
    }
    candidateKeys.add(value);
    getWordFamilyForms(value).forEach((form) => candidateKeys.add(form));
  });

  return [...candidateKeys].some((key) => state.removedResultWords.has(key));
}

function filterRemovedCandidates(candidates) {
  return candidates.filter((candidate) => !isCandidateRemoved(candidate));
}

function getSelectedCandidate(candidates, shift) {
  if (!candidates.length) {
    return null;
  }
  if (shift <= 0 || shift >= candidates.length) {
    return candidates[0];
  }
  return candidates[shift];
}

function resolveCandidateSelection(candidates, tileIds = []) {
  const allowedCandidates = filterRemovedCandidates(candidates);
  const taggedTileIds = getTaggedTileIds(tileIds);
  const desiredShift = taggedTileIds.length;
  if (!allowedCandidates.length) {
    const refundedTagCount = taggedTileIds.length > 0
      ? releaseSecondResultTags(taggedTileIds, { refund: true })
      : 0;
    const refundSuffix = refundedTagCount > 0
      ? ` ${refundedTagCount} Second Result token${refundedTagCount === 1 ? " was" : "s were"} refunded.`
      : "";
    return {
      candidate: null,
      candidates: [],
      usedShift: 0,
      refundedTagCount,
      error: `All valid results for that mix have been permanently removed.${refundSuffix}`,
    };
  }
  const canUseShiftedCandidate = desiredShift > 0 && allowedCandidates.length > desiredShift;
  const refundedTagCount = desiredShift > 0 && !canUseShiftedCandidate
    ? releaseSecondResultTags(taggedTileIds, { refund: true })
    : 0;

  if (desiredShift > 0 && canUseShiftedCandidate) {
    releaseSecondResultTags(taggedTileIds);
  }

  return {
    candidate: getSelectedCandidate(allowedCandidates, canUseShiftedCandidate ? desiredShift : 0),
    candidates: allowedCandidates,
    usedShift: canUseShiftedCandidate ? desiredShift : 0,
    refundedTagCount,
    error: null,
  };
}

function setStatus(message, stateName = "ok") {
  els.status.textContent = message;
  els.status.dataset.state = stateName;
}

function clearFloatingCandidatePreview() {
  if (activeFloatingCandidatePreviewTimeout !== null) {
    window.clearTimeout(activeFloatingCandidatePreviewTimeout);
    activeFloatingCandidatePreviewTimeout = null;
  }
  if (activeFloatingCandidatePreview) {
    activeFloatingCandidatePreview.remove();
    activeFloatingCandidatePreview = null;
  }
}

function showFloatingCandidatePreview(candidates, clientPoint = null) {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    clearFloatingCandidatePreview();
    return;
  }

  clearFloatingCandidatePreview();

  const playfieldRect = els.playfield.getBoundingClientRect();
  const bounds = getPlayfieldBounds();
  const preview = document.createElement("div");
  preview.className = "floating-match-preview";

  const title = document.createElement("div");
  title.className = "floating-match-preview-title";
  title.textContent = "Top matches";
  preview.append(title);

  candidates.slice(0, 5).forEach((candidate, index) => {
    const line = document.createElement("div");
    line.className = "floating-match-preview-line";
    line.textContent = `${index + 1}. ${titleCase(candidate.word || candidate.normalized || "")}`;
    preview.append(line);
  });

  const localX = clientPoint
    ? clientPoint.x - playfieldRect.left
    : bounds.width / 2;
  const localY = clientPoint
    ? clientPoint.y - playfieldRect.top
    : bounds.height / 2;
  const previewWidth = 190;
  const previewHeight = 152;
  const x = clamp(localX - (previewWidth / 2), 12, Math.max(12, bounds.width - previewWidth - 12));
  const y = clamp(localY - previewHeight - 26, 12, Math.max(12, bounds.height - previewHeight - 12));
  preview.style.left = `${x}px`;
  preview.style.top = `${y}px`;

  els.playfield.append(preview);
  activeFloatingCandidatePreview = preview;
  activeFloatingCandidatePreviewTimeout = window.setTimeout(() => {
    clearFloatingCandidatePreview();
  }, 2500);
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
  const totalUsableTokenCount = getTotalUsableTokenCount();
  els.tokenCount.textContent = totalUsableTokenCount.toString();
  els.tokenPanelCount.textContent = totalUsableTokenCount.toString();
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

function deleteCategory(categoryId) {
  if (categoryId === DEFAULT_CATEGORY_ID) {
    return;
  }

  const category = getCategoryById(categoryId);
  if (!category) {
    return;
  }

  state.wordCategories = state.wordCategories.filter((entry) => entry.id !== categoryId);
  state.wordAssignments.forEach((assignedCategoryId, wordKey) => {
    if (assignedCategoryId === categoryId) {
      state.wordAssignments.set(wordKey, DEFAULT_CATEGORY_ID);
    }
  });

  renderWordList();
  queueProgressSave();
  setStatus(`${category.name} was deleted. Its words moved to Uncategorized.`);
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
  queueProgressSave();
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
      queueProgressSave();
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

    const actions = document.createElement("div");
    actions.className = "word-category-actions";
    actions.append(count);

    if (category.id !== DEFAULT_CATEGORY_ID) {
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "ghost-button word-category-delete";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        deleteCategory(category.id);
      });
      actions.append(deleteButton);
    }

    header.append(toggle, actions);

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
      queueProgressSave();
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
  queueProgressSave();
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
  queueProgressSave();
  setStatus("Minus mixing is active for your next pair.", "ok");
}

function rollGarbageRewardToken() {
  const roll = Math.random();
  if (roll < 0.65) {
    state.availableSecondResultTokens += 1;
    state.totalSecondResultTokensEarned += 1;
    return "Second Result";
  }
  if (roll < 0.9) {
    state.availableNegativeMixTokens += 1;
    state.totalNegativeMixTokensEarned += 1;
    return "Minus Mix";
  }
  state.availableBanWordTokens += 1;
  state.totalBanWordTokensEarned += 1;
  return "Ban Word";
}

function hideWordFromPanel(word, explicitWordKey = null, tileId = null) {
  if (typeof word !== "string" || !word) {
    return { ok: false, alreadyHidden: false, refundedTagCount: 0 };
  }

  const wordKey = explicitWordKey || getWordKey(word);
  const refundedTagCount = tileId === null ? 0 : removeTile(tileId);
  const refundMessage = refundedTagCount > 0
    ? ` ${refundedTagCount} Second Result token${refundedTagCount === 1 ? " was" : "s were"} refunded.`
    : "";

  if (state.hiddenWordPanelWords.has(wordKey)) {
    return {
      ok: false,
      alreadyHidden: true,
      refundedTagCount,
      statusMessage: `${titleCase(word)} is already hidden from the word panel.${refundMessage}`,
      statusState: "ok",
      rewardedToken: null,
    };
  }

  state.hiddenWordPanelWords.add(wordKey);
  state.garbageWordsSinceReward += 1;
  const garbageTarget = getCurrentGarbageTarget();

  let statusMessage = `${titleCase(word)} was hidden from the word panel.${refundMessage}`;
  let statusState = "ok";

  if (state.garbageWordsSinceReward >= garbageTarget) {
    state.garbageWordsSinceReward = 0;
    state.garbageRewardLevel += 1;
    const rewardedToken = rollGarbageRewardToken();
    state.unseenTokenRewards += 1;
    statusMessage = `${statusMessage} The garbage bin paid out a ${rewardedToken} token.`;
    statusState = "reward";
    if (state.activeSidebarTab === "tokens") {
      state.unseenTokenRewards = 0;
    }
  }

  return {
    ok: true,
    alreadyHidden: false,
    refundedTagCount,
    statusMessage,
    statusState,
    rewardedToken: statusState === "reward" ? statusMessage : null,
  };
}

function sendWordToGarbage(word, explicitWordKey = null, tileId = null) {
  if (!isGarbageBinUnlocked()) {
    setStatus(`The garbage bin unlocks at ${GARBAGE_BIN_UNLOCK_WORDS} discovered words.`, "error");
    return;
  }

  const result = hideWordFromPanel(word, explicitWordKey, tileId);
  if (!result) {
    return;
  }

  renderSidebar();
  queueProgressSave();
  setStatus(result.statusMessage, result.statusState);
}

function getFirstUncategorizedAvailableEntry() {
  return getAvailableWordEntries().find((entry) => getCategoryIdForWord(entry.key) === DEFAULT_CATEGORY_ID) || null;
}

function handleAvailableWordOverflow(previousAvailableCount, currentAvailableCount) {
  if (previousAvailableCount === AVAILABLE_WORD_WARNING_THRESHOLD - 1
    && currentAvailableCount === AVAILABLE_WORD_WARNING_THRESHOLD) {
    return {
      message: "You have 50 available words. Clean your vocabulary.",
      stateName: "error",
    };
  }

  if (previousAvailableCount === AVAILABLE_WORD_WARNING_THRESHOLD
    && currentAvailableCount === AVAILABLE_WORD_WARNING_THRESHOLD + 1) {
    const uncategorizedEntry = getFirstUncategorizedAvailableEntry();
    if (!uncategorizedEntry) {
      return {
        message: "You have more than 50 available words, but nothing in Uncategorized could be auto-binned.",
        stateName: "error",
      };
    }

    const hideResult = hideWordFromPanel(uncategorizedEntry.word, uncategorizedEntry.key);
    const rewardSuffix = hideResult?.statusState === "reward" && hideResult.statusMessage
      ? ` ${hideResult.statusMessage.split(". ").slice(1).join(". ")}`
      : "";

    return {
      message: `${titleCase(uncategorizedEntry.word)} was automatically binned. Clean your vocabulary.${rewardSuffix}`,
      stateName: "error",
    };
  }

  return null;
}

function tagTileWithSecondResultToken(tileId) {
  const tile = getTileById(tileId);
  if (!tile) {
    setStatus("Drop that token onto a word on the field.", "error");
    return;
  }
  if (tile.secondResultTagged) {
    setStatus(`${titleCase(tile.word)} is already tagged.`, "ok");
    return;
  }
  if (state.availableSecondResultTokens <= 0) {
    setStatus("You do not have any second-result tokens yet.", "error");
    return;
  }

  state.availableSecondResultTokens -= 1;
  tile.secondResultTagged = true;
  renderSidebar();
  renderTiles();
  queueProgressSave();
  setStatus(`${titleCase(tile.word)} is tagged to jump to a deeper mix result.`, "ok");
}

function banTileWordFromResults(tileId) {
  const tile = getTileById(tileId);
  if (!tile) {
    setStatus("Drop that token onto a word on the field.", "error");
    return;
  }

  const removalKeys = getRemovalKeysForWord(tile.word);
  if ([...removalKeys].some((key) => state.removedResultWords.has(key))) {
    setStatus(`${titleCase(tile.word)} is already permanently removed from future results.`, "ok");
    return;
  }
  if (state.availableBanWordTokens <= 0) {
    setStatus("You do not have any ban-word tokens yet.", "error");
    return;
  }

  state.availableBanWordTokens -= 1;
  removalKeys.forEach((key) => {
    state.removedResultWords.add(key);
  });
  state.lastMix.candidates = filterRemovedCandidates(state.lastMix.candidates);
  renderSidebar();
  queueProgressSave();
  setStatus(`${titleCase(tile.word)} will no longer appear in future mix results this run.`, "reward");
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
  queueProgressSave();
  setStatus("Minus-mix token refunded.", "ok");
}

function hideNegativeMixAfterUse() {
  state.hasActiveNegativeMixToken = false;
  clearNegativeMix();
  renderSidebar();
  renderNegativeMix();
  queueProgressSave();
}

function buildTokenButton({
  title,
  description,
  count,
  dragType = null,
  onClick = null,
}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "token-button";
  button.draggable = Boolean(dragType);
  button.innerHTML = `
    <span class="token-button-copy">
      <span class="token-button-title">${title}</span>
      <span class="token-button-text">${description}</span>
    </span>
    <span class="token-chip">${count}</span>
  `;

  if (onClick) {
    button.addEventListener("click", onClick);
  }

  if (dragType) {
    button.addEventListener("dragstart", (event) => {
      button.classList.add("is-dragging");
      event.dataTransfer.setData("application/x-token-type", dragType);
      event.dataTransfer.effectAllowed = "copy";
    });
    button.addEventListener("dragend", () => {
      button.classList.remove("is-dragging");
    });
  }

  return button;
}

function renderTokenPanel() {
  els.tokenList.innerHTML = "";

  if (getTotalUsableTokenCount() <= 0) {
    const empty = document.createElement("p");
    empty.className = "source-word-empty";
    empty.textContent = hasUnlockedAnyTokenType()
      ? "No unused tokens right now."
      : "No tokens yet.";
    els.tokenList.append(empty);
    return;
  }

  if (state.availableNegativeMixTokens > 0) {
    els.tokenList.append(buildTokenButton({
      title: "Minus Mix",
      description: "Click or drag onto the field to unlock one A - B mix.",
      count: state.availableNegativeMixTokens,
      dragType: "minus-mix",
      onClick: () => {
        activateNegativeMixToken();
      },
    }));
  }

  if (state.availableBanWordTokens > 0) {
    els.tokenList.append(buildTokenButton({
      title: "Ban Word",
      description: "Drag onto a field word to permanently remove that word from future mix results.",
      count: state.availableBanWordTokens,
      dragType: "ban-word",
      onClick: () => {
        setStatus("Drag a Ban Word token onto a word on the field.", "ok");
      },
    }));
  }

  if (state.availableSecondResultTokens > 0) {
    els.tokenList.append(buildTokenButton({
      title: "Second Result",
      description: "Drag onto a field word to tag it. Tagged mixes jump to the next valid result.",
      count: state.availableSecondResultTokens,
      dragType: "second-result",
      onClick: () => {
        setStatus("Drag a Second Result token onto a word on the field.", "ok");
      },
    }));
  }
}

function renderGarbageBin() {
  const unlocked = isGarbageBinUnlocked();
  els.garbagePanel.hidden = !unlocked;
  if (!unlocked) {
    return;
  }

  els.garbageProgress.textContent = `${state.garbageWordsSinceReward}/${getCurrentGarbageTarget()}`;
}

function renderSidebar() {
  updateCounts();
  const tokensUnlocked = hasUnlockedAnyTokenType();
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
  renderGarbageBin();
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
  queueProgressSave();
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

function getMixOutcomeMessage(
  leftWord,
  rightWord,
  canonicalResult,
  operation,
  isInEncyclopedia,
  wasDiscovered,
  {
    newNegativeMixTokens = 0,
    newBanWordTokens = 0,
    newSecondResultTokens = 0,
    usedShift = 0,
    refundedTagCount = 0,
  } = {},
) {
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

  if (usedShift > 0) {
    const candidateLabel = usedShift === 1 ? "second" : "third";
    message = `${message} A tagged word pushed this mix to the ${candidateLabel} valid result.`;
  }

  if (refundedTagCount > 0) {
    const tokenSuffix = refundedTagCount === 1 ? "token was" : "tokens were";
    message = `${message} There was no deep enough candidate, so ${refundedTagCount} Second Result ${tokenSuffix} refunded.`;
    stateName = "reward";
  }

  const rewardParts = [];
  if (newNegativeMixTokens > 0) {
    const tokenSuffix = newNegativeMixTokens === 1 ? "token" : "tokens";
    rewardParts.push(`${newNegativeMixTokens} minus-mix ${tokenSuffix}`);
  }
  if (newBanWordTokens > 0) {
    const tokenSuffix = newBanWordTokens === 1 ? "token" : "tokens";
    rewardParts.push(`${newBanWordTokens} Ban Word ${tokenSuffix}`);
  }
  if (newSecondResultTokens > 0) {
    const tokenSuffix = newSecondResultTokens === 1 ? "token" : "tokens";
    rewardParts.push(`${newSecondResultTokens} Second Result ${tokenSuffix}`);
  }

  if (rewardParts.length > 0) {
    message = `${message} Congrats! You earned ${rewardParts.join(" and ")}.`;
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

function getCandidateHistoryTrail(candidates, selectedWord) {
  if (!Array.isArray(candidates) || !candidates.length) {
    return [];
  }

  const selectedKey = (selectedWord || "").toLowerCase();
  const selectedIndex = candidates.findIndex((candidate) => {
    return (candidate.word || "").toLowerCase() === selectedKey
      || (candidate.normalized || "").toLowerCase() === selectedKey;
  });
  const trailStart = selectedIndex >= 0 ? selectedIndex + 1 : 1;
  return candidates
    .slice(trailStart, trailStart + 4)
    .map((candidate) => titleCase(candidate.word || candidate.normalized || ""))
    .filter(Boolean);
}

function recordMatch(wordA, wordB, result, operation, candidates = [], selectedWord = result) {
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
    nextCandidates: getCandidateHistoryTrail(candidates, selectedWord),
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
  queueProgressSave();
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
    const nextCandidatesText = Array.isArray(match.nextCandidates) && match.nextCandidates.length
      ? ` (${match.nextCandidates.join(", ")})`
      : "";
    main.textContent = `${titleCase(match.left)} ${match.operation === "subtract" ? "-" : "+"} ${titleCase(match.right)} = ${titleCase(match.result)}${nextCandidatesText}`;

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
    secondResultTagged: false,
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
  queueProgressSave();
}

function removeTile(tileId) {
  const refundedTagCount = releaseSecondResultTags([tileId], { refund: true });
  state.tiles = state.tiles.filter((tile) => tile.id !== tileId);
  Object.keys(state.negativeMixSources).forEach((slot) => {
    if (state.negativeMixSources[slot] === tileId) {
      state.negativeMixSources[slot] = null;
      state.negativeMix[slot] = null;
    }
  });
  renderTiles();
  renderNegativeMix();
  queueProgressSave();
  return refundedTagCount;
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

function handleTileClick(word, position, tileId = null) {
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
    return runSelfMatch(word, position, tileId);
  }

  state.clickTracker.word = word;
  state.clickTracker.time = now;
  return Promise.resolve();
}

async function runSelfMatch(word, position = null, tileId = null) {
  const mix = await getAssociation(word, word, "add");
  const selection = resolveCandidateSelection(mix.candidates, tileId ? [tileId] : []);
  if (!selection.candidate) {
    throw new Error(selection.error || "No valid result remained for that mix.");
  }
  setLastMix(`${titleCase(word)} + ${titleCase(word)}`, "add", selection.candidates);
  if (position) {
    const playfieldRect = els.playfield.getBoundingClientRect();
    showFloatingCandidatePreview(selection.candidates, {
      x: playfieldRect.left + position.x,
      y: playfieldRect.top + position.y,
    });
  } else {
    showFloatingCandidatePreview(selection.candidates);
  }
  const selectedCandidate = selection.candidate;
  const {
    canonicalResult,
    isInEncyclopedia,
    wasDiscovered,
    newNegativeMixTokens,
    newBanWordTokens,
    newSecondResultTokens,
    vocabularyOverflow,
  } = rememberResult(selectedCandidate.word, selectedCandidate.normalized);
  markWordAsSelfMatched(word);
  recordMatch(word, word, canonicalResult, "add", selection.candidates, selectedCandidate.word);
  spawnWordOnField(canonicalResult, position);
  const status = getMixOutcomeMessage(word, word, canonicalResult, "add", isInEncyclopedia, wasDiscovered, {
    newNegativeMixTokens,
    newBanWordTokens,
    newSecondResultTokens,
    usedShift: selection.usedShift,
    refundedTagCount: selection.refundedTagCount,
  });
  setStatus(vocabularyOverflow?.message || status.message, vocabularyOverflow?.stateName || status.stateName);
}

async function handleMix(firstTile, secondTile, clientPoint = null) {
  const mix = await getAssociation(firstTile.word, secondTile.word, "add");
  const selection = resolveCandidateSelection(mix.candidates, [firstTile.id, secondTile.id]);
  if (!selection.candidate) {
    throw new Error(selection.error || "No valid result remained for that mix.");
  }
  setLastMix(`${titleCase(firstTile.word)} + ${titleCase(secondTile.word)}`, "add", selection.candidates);
  showFloatingCandidatePreview(selection.candidates, clientPoint);
  const selectedCandidate = selection.candidate;
  const {
    canonicalResult,
    isInEncyclopedia,
    wasDiscovered,
    newNegativeMixTokens,
    newBanWordTokens,
    newSecondResultTokens,
    vocabularyOverflow,
  } = rememberResult(selectedCandidate.word, selectedCandidate.normalized);
  if (firstTile.word.toLowerCase() === secondTile.word.toLowerCase()) {
    markWordAsSelfMatched(firstTile.word);
  }
  recordMatch(firstTile.word, secondTile.word, canonicalResult, "add", selection.candidates, selectedCandidate.word);
  spawnResultTile(canonicalResult, firstTile, secondTile);
  const status = getMixOutcomeMessage(
    firstTile.word,
    secondTile.word,
    canonicalResult,
    "add",
    isInEncyclopedia,
    wasDiscovered,
    {
      newNegativeMixTokens,
      newBanWordTokens,
      newSecondResultTokens,
      usedShift: selection.usedShift,
      refundedTagCount: selection.refundedTagCount,
    },
  );
  setStatus(vocabularyOverflow?.message || status.message, vocabularyOverflow?.stateName || status.stateName);
}

function rememberResult(result, normalized = result) {
  const previousAvailableCount = getAvailableWordEntries().length;
  const canonicalResult = getCanonicalWord(result, normalized);
  const encyclopediaEntry = getEncyclopediaEntry(canonicalResult, normalized);
  const isInEncyclopedia = Boolean(encyclopediaEntry);
  const discoveryKey = encyclopediaEntry?.word ?? normalized;
  const existing = state.discovered.get(discoveryKey) ?? state.discovered.get(normalized);
  const wasDiscovered = Boolean(existing);
  const canonicalIsStarter = state.starters.includes(canonicalResult);
  let didDiscoverNewWord = false;
  let newBanWordTokens = 0;
  let newSecondResultTokens = 0;

  if (!existing && !canonicalIsStarter) {
    state.discovered.set(discoveryKey, canonicalResult);
    didDiscoverNewWord = true;
  } else if (existing && existing !== canonicalResult && isPreferredDiscoveredVariant(canonicalResult, existing)) {
    state.discovered.set(discoveryKey, canonicalResult);
  }

  if (discoveryKey !== normalized && state.discovered.has(normalized)) {
    state.discovered.delete(normalized);
  }

  const unlockedTokenCount = getUnlockedTokenCount();
  const newNegativeMixTokens = Math.max(0, unlockedTokenCount - state.totalNegativeMixTokensEarned);
  if (newNegativeMixTokens > 0) {
    state.totalNegativeMixTokensEarned = unlockedTokenCount;
    state.availableNegativeMixTokens += newNegativeMixTokens;
    state.unseenTokenRewards += newNegativeMixTokens;
  }

  if (didDiscoverNewWord && isInEncyclopedia) {
    state.availableBanWordTokens += 1;
    state.totalBanWordTokensEarned += 1;
    state.unseenTokenRewards += 1;
    newBanWordTokens = 1;
    const discoveredEncyclopediaWords = getDiscoveredEncyclopediaWords();
    if (!discoveredEncyclopediaWords.has(canonicalResult)) {
      console.warn("[wordmath] Encyclopedia reward mismatch", {
        result,
        normalized,
        canonicalResult,
        discoveryKey,
        storedDiscoveredValue: state.discovered.get(discoveryKey) ?? null,
        encyclopediaEntryByCanonical: getEncyclopediaEntry(canonicalResult, canonicalResult),
        encyclopediaEntryByNormalized: getEncyclopediaEntry(normalized, normalized),
        discoveredEncyclopediaKeys: [...discoveredEncyclopediaWords],
      });
    }
  }

  if (didDiscoverNewWord && Math.random() < SECOND_RESULT_TOKEN_DROP_RATE) {
    state.availableSecondResultTokens += 1;
    state.totalSecondResultTokensEarned += 1;
    state.unseenTokenRewards += 1;
    newSecondResultTokens = 1;
  }

  if (newNegativeMixTokens > 0 || newBanWordTokens > 0 || newSecondResultTokens > 0) {
    if (state.activeSidebarTab === "tokens") {
      state.unseenTokenRewards = 0;
    }
  }

  const vocabularyOverflow = didDiscoverNewWord
    ? handleAvailableWordOverflow(previousAvailableCount, getAvailableWordEntries().length)
    : null;

  if (didDiscoverNewWord || newNegativeMixTokens > 0 || newBanWordTokens > 0 || newSecondResultTokens > 0 || vocabularyOverflow) {
    renderSidebar();
  }

  return {
    canonicalResult,
    isInEncyclopedia,
    wasDiscovered,
    newNegativeMixTokens,
    newBanWordTokens,
    newSecondResultTokens,
    vocabularyOverflow,
  };
}

async function runNegativeMix() {
  if (!(state.negativeMix.a && state.negativeMix.b)) {
    setStatus("Negative mixing needs both A and B.", "error");
    return;
  }

  const mix = await getAssociation(state.negativeMix.a, state.negativeMix.b, "subtract");
  const selection = resolveCandidateSelection(mix.candidates, [
    state.negativeMixSources.a,
    state.negativeMixSources.b,
  ].filter(Boolean));
  if (!selection.candidate) {
    throw new Error(selection.error || "No valid result remained for that mix.");
  }
  setLastMix(`${titleCase(state.negativeMix.a)} - ${titleCase(state.negativeMix.b)}`, "subtract", selection.candidates);
  const selectedCandidate = selection.candidate;
  const {
    canonicalResult,
    isInEncyclopedia,
    wasDiscovered,
    newNegativeMixTokens,
    newBanWordTokens,
    newSecondResultTokens,
    vocabularyOverflow,
  } = rememberResult(selectedCandidate.word, selectedCandidate.normalized);
  recordMatch(
    state.negativeMix.a,
    state.negativeMix.b,
    canonicalResult,
    "subtract",
    selection.candidates,
    selectedCandidate.word,
  );
  spawnWordOnField(canonicalResult, { x: 340, y: 48 });
  const status = getMixOutcomeMessage(
    state.negativeMix.a,
    state.negativeMix.b,
    canonicalResult,
    "subtract",
    isInEncyclopedia,
    wasDiscovered,
    {
      newNegativeMixTokens,
      newBanWordTokens,
      newSecondResultTokens,
      usedShift: selection.usedShift,
      refundedTagCount: selection.refundedTagCount,
    },
  );
  hideNegativeMixAfterUse();
  setStatus(vocabularyOverflow?.message || status.message, vocabularyOverflow?.stateName || status.stateName);
}

function clearNegativeMix() {
  state.negativeMix.a = null;
  state.negativeMix.b = null;
  state.negativeMixSources.a = null;
  state.negativeMixSources.b = null;
  renderNegativeMix();
  queueProgressSave();
}

function assignNegativeSlot(slot, word, tileId = null) {
  if (!state.hasActiveNegativeMixToken) {
    setStatus("Use a minus-mix token first.", "error");
    return;
  }
  state.negativeMix[slot] = word;
  state.negativeMixSources[slot] = tileId;
  renderNegativeMix();
  queueProgressSave();
}

function getNegativeSlotAtPoint(clientX, clientY) {
  if (!state.hasActiveNegativeMixToken) {
    return null;
  }
  const element = document.elementFromPoint(clientX, clientY);
  return element ? element.closest("[data-negative-slot]") : null;
}

function getGarbageBinAtPoint(clientX, clientY) {
  if (!isGarbageBinUnlocked()) {
    return null;
  }
  const element = document.elementFromPoint(clientX, clientY);
  return element ? element.closest("[data-garbage-bin]") : null;
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
        }, tile.id);
      } catch (error) {
        setStatus(error.message, "error");
      }
      return;
    }

    const negativeSlotElement = getNegativeSlotAtPoint(endEvent.clientX, endEvent.clientY);
    if (negativeSlotElement) {
      const slot = negativeSlotElement.dataset.negativeSlot;
      assignNegativeSlot(slot, tile.word, tile.id);
      renderTiles();
      setStatus(`${titleCase(tile.word)} was placed into slot ${slot.toUpperCase()}.`);
      return;
    }

    const garbageBinElement = getGarbageBinAtPoint(endEvent.clientX, endEvent.clientY);
    if (garbageBinElement) {
      sendWordToGarbage(tile.word, getWordKey(tile.word), tile.id);
      return;
    }

    const targetTile = findMixTarget(tile);
    if (targetTile) {
      try {
        await handleMix(tile, targetTile, {
          x: endEvent.clientX,
          y: endEvent.clientY,
        });
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
      tileElement.dataset.tileId = String(tile.id);
      tileElement.dataset.tagged = tile.secondResultTagged ? "true" : "false";
      tileElement.style.left = `${tile.x}px`;
      tileElement.style.top = `${tile.y}px`;
      tileElement.style.zIndex = String(tile.zIndex);
      tileElement.addEventListener("pointerdown", (event) => startTileDrag(event, tile.id));
      tileElement.addEventListener("dragover", (event) => {
        const dragTypes = Array.from(event.dataTransfer.types || []);
        const tokenType = dragTypes.includes("application/x-token-type")
          ? event.dataTransfer.getData("application/x-token-type")
          : "";
        if (!tokenType) {
          return;
        }
        event.preventDefault();
      });
      tileElement.addEventListener("drop", (event) => {
        const tokenType = event.dataTransfer.getData("application/x-token-type");
        if (!tokenType) {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (tokenType === "second-result") {
          tagTileWithSecondResultToken(tile.id);
          return;
        }
        if (tokenType === "ban-word") {
          banTileWordFromResults(tile.id);
          return;
        }
        if (tokenType === "minus-mix") {
          activateNegativeMixToken();
        }
      });
      tileElement.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        const refundedTagCount = removeTile(tile.id);
        const refundMessage = refundedTagCount > 0
          ? ` Second Result token refunded.`
          : "";
        setStatus(`${titleCase(tile.word)} was removed from the field.${refundMessage}`);
      });

      const wordElement = document.createElement("div");
      wordElement.className = "tile-word";
      wordElement.textContent = titleCase(tile.word);

      const tagElement = document.createElement("div");
      tagElement.className = "tile-tag";
      tagElement.textContent = "2nd";
      tagElement.hidden = !tile.secondResultTagged;

      const metaElement = document.createElement("div");
      metaElement.className = "tile-meta";
      const categoryName = getVisibleCategoryNameForWord(tile.word);
      metaElement.textContent = categoryName;
      metaElement.hidden = !categoryName;

      tileElement.append(tagElement, wordElement, metaElement);
      els.playfield.append(tileElement);
    });
}

function clearField() {
  const refundedTagCount = releaseSecondResultTags(state.tiles.map((tile) => tile.id), { refund: true });
  state.tiles = [];
  clearNegativeMix();
  renderTiles();
  queueProgressSave();
  const refundMessage = refundedTagCount > 0
    ? ` ${refundedTagCount} Second Result token${refundedTagCount === 1 ? " was" : "s were"} refunded.`
    : "";
  setStatus(`The field was cleared.${refundMessage}`);
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

function openSettings() {
  els.settingsModal.hidden = false;
}

function closeSettings() {
  els.settingsModal.hidden = true;
}

function exportSaveSnapshot() {
  downloadProgressSnapshot();
  setStatus("Save JSON exported.", "ok");
}

function promptSaveImport() {
  els.saveFileInput.value = "";
  els.saveFileInput.click();
}

async function importSaveSnapshotFromFile(file) {
  if (!file) {
    return;
  }

  let snapshot;
  try {
    const raw = await file.text();
    snapshot = JSON.parse(raw);
  } catch (error) {
    setStatus("That file is not valid JSON.", "error");
    return;
  }

  if (!applyProgressSnapshot(snapshot, { statusMessage: "Imported saved game JSON." })) {
    setStatus("That save file is missing required game data.", "error");
    return;
  }

  saveProgress();
  closeSettings();
}

function resetRun() {
  state.starters = sampleStarters();
  state.discovered = new Map(state.starters.map((word) => [word, word]));
  state.selfMatchedWords = new Set();
  state.tiles = [];
  state.search = "";
  state.removedResultWords = new Set();
  state.negativeMix.a = null;
  state.negativeMix.b = null;
  state.negativeMixSources.a = null;
  state.negativeMixSources.b = null;
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
  state.availableBanWordTokens = 0;
  state.totalBanWordTokensEarned = 0;
  state.availableSecondResultTokens = 0;
  state.totalSecondResultTokensEarned = 0;
  state.hiddenWordPanelWords = new Set();
  state.garbageWordsSinceReward = 0;
  state.garbageRewardLevel = 0;
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
  queueProgressSave();

  setStatus(
    `New game started with ${titleCase(state.starters[0])} and ${titleCase(state.starters[1])}. Mix them to discover new words.`,
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

    const tokenType = event.dataTransfer.getData("application/x-token-type");
    if (tokenType === "minus-mix") {
      activateNegativeMixToken();
      return;
    }
    if (tokenType === "ban-word") {
      setStatus("Drop a Ban Word token onto a word on the field.", "error");
      return;
    }
    if (tokenType === "second-result") {
      setStatus("Drop a Second Result token onto a word on the field.", "error");
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

function initGarbageBinDropzone() {
  els.garbageBin.addEventListener("dragover", (event) => {
    const dragTypes = Array.from(event.dataTransfer.types || []);
    if (!dragTypes.includes("text/plain")) {
      return;
    }
    event.preventDefault();
    els.garbageBin.dataset.dragOver = "true";
  });

  els.garbageBin.addEventListener("dragleave", () => {
    els.garbageBin.dataset.dragOver = "false";
  });

  els.garbageBin.addEventListener("drop", (event) => {
    event.preventDefault();
    els.garbageBin.dataset.dragOver = "false";
    const word = event.dataTransfer.getData("text/plain");
    const wordKey = event.dataTransfer.getData("application/x-word-key") || null;
    if (!word) {
      return;
    }
    sendWordToGarbage(word, wordKey);
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
    queueProgressSave();
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
  els.openSettingsButton.addEventListener("click", openSettings);
  els.closeSettingsButton.addEventListener("click", closeSettings);
  els.exportSaveButton.addEventListener("click", exportSaveSnapshot);
  els.importSaveButton.addEventListener("click", promptSaveImport);
  els.saveFileInput.addEventListener("change", async (event) => {
    const [file] = event.target.files || [];
    await importSaveSnapshotFromFile(file);
  });
  els.toggleHistorySortButton.addEventListener("click", () => {
    state.historySort = state.historySort === "recent" ? "result" : "recent";
    renderHistory();
    queueProgressSave();
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
  els.settingsModal.addEventListener("click", (event) => {
    if (event.target === els.settingsModal) {
      closeSettings();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.historyModal.hidden) {
      closeHistory();
    }
    if (event.key === "Escape" && !els.encyclopediaModal.hidden) {
      closeEncyclopedia();
    }
    if (event.key === "Escape" && !els.settingsModal.hidden) {
      closeSettings();
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
    queueProgressSave();
  });
  window.addEventListener("beforeunload", () => {
    if (pendingProgressSave !== null) {
      window.clearTimeout(pendingProgressSave);
      pendingProgressSave = null;
    }
    saveProgress();
  });

  initPlayfieldDropzone();
  initNegativeMixDropzones();
  initGarbageBinDropzone();
}

function init() {
  initEvents();
  if (!loadProgress()) {
    resetRun();
  }
}

init();
