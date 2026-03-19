const STARTER_POOL = [
  "book",
  "chair",
  "cup",
  "key",
  "lamp",
  "sun",
  "moon",
  "star",
  "flame",
  "ocean",
  "beach",
  "island",
  "desert",
  "cave",
  "village",
  "baby",
  "king",
  "queen",
  "friend",
  "crowd",
  "song",
  "movie",
  "story",
  "joke",
  "dream",
  "money",
  "party",
  "game",
  "team",
  "prize",
  "castle",
  "planet",
  "angel",
  "monster",
  "robot",
  "wolf",
  "mouse",
  "snake",
  "bee",
  "seed",
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
  {
    name: "Fashion",
    words: ["shirt", "dress", "hat", "garment", "couture"],
  },
  {
    name: "Fabrics",
    words: ["wool", "silk", "cotton", "denim", "polyester"],
  },
  {
    name: "Colors",
    words: ["red", "blue", "green", "crimson", "turquoise"],
  },
  {
    name: "Anatomy",
    words: ["hand", "bone", "tooth", "artery", "retina"],
  },
  {
    name: "Gestures",
    words: ["wave", "nod", "clap", "beckon", "salute"],
  },
  {
    name: "Illness",
    words: ["cold", "cough", "fever", "migraine", "infection"],
  },
  {
    name: "Technology",
    words: ["screen", "cable", "battery", "algorithm", "database"],
  },
  {
    name: "Filler Words",
    words: ["very", "just", "really", "perhaps", "somehow"],
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
const NEGATIVE_MIX_WIDTH = 168;
const NEGATIVE_MIX_HEIGHT = 132;
const NEGATIVE_MIX_Z_INDEX = 5000;
const DRAGGING_TILE_Z_INDEX = 6000;
const DRAG_THRESHOLD = 6;
const DOUBLE_CLICK_MS = 320;
const DEFAULT_CATEGORY_ID = "uncategorized";
const MATCH_HISTORY_LIMIT = 100;
const NEGATIVE_MIX_FIRST_UNLOCK_WORDS = 5;
const WORDS_PER_NEGATIVE_MIX_TOKEN = 15;
const SECOND_RESULT_FIRST_UNLOCK_WORDS = 10;
const GARBAGE_BIN_UNLOCK_WORDS = 20;
const GARBAGE_WORDS_PER_TOKEN_BASE = 15;
const AVAILABLE_WORD_LIMIT = 25;
const RECENT_DISCOVERED_WORD_LIMIT = 25;
const PLAYFIELD_WORDS_PER_ZONE_UNLOCK = 50;
const PLAYFIELD_BASE_WORLD_SCALE = 2.2;
const PLAYFIELD_ZONE_SCALE_STEP = 1.1;
const PLAYFIELD_ZOOM_STEP = 0.12;
const MIN_PLAYFIELD_ZOOM = 0.02;
const MAX_PLAYFIELD_ZOOM = 1;
const STORAGE_KEY = "wordmath-progress-v1";
const DISCOVERY_TOKEN_DROP_CHANCE = 0.1;
const RANDOM_DISCOVERY_TOKEN_POOL = Object.freeze([3, 4, 5]);
const QUEST_INITIAL_DISCOVERY_TIMER = 60;
const QUEST_TIMER_MIN = 50;
const QUEST_TIMER_MAX = 70;
const QUEST_COMPLETION_REWARD_COUNT = 5;
const QUEST_REWARD_TOKEN_POOL = Object.freeze(["minus-mix", "ban-word", 2, 3, 4, 5]);
const POSITION_TOKEN_RANKS = [2, 3, 4, 5];
const POSITION_TOKEN_CONFIG = Object.freeze({
  2: { title: "Second Result", shortLabel: "2nd" },
  3: { title: "Third Result", shortLabel: "3rd" },
  4: { title: "Fourth Result", shortLabel: "4th" },
  5: { title: "Fifth Result", shortLabel: "5th" },
});

const state = {
  starters: [],
  discovered: new Map(),
  selfMatchedWords: new Set(),
  spawnExistingWords: false,
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
  negativeMixPosition: {
    x: 24,
    y: 24,
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
  recentDiscoveredWordKeys: [],
  removedResultWords: new Set(),
  hiddenWordPanelWords: new Set(),
  garbageWordsSinceReward: 0,
  garbageRewardLevel: 0,
  availableNegativeMixTokens: 0,
  totalNegativeMixTokensEarned: 0,
  progressNegativeMixTokensAwarded: 0,
  availableBanWordTokens: 0,
  totalBanWordTokensEarned: 0,
  availableWildcardTokens: 0,
  totalWildcardTokensEarned: 0,
  availableSecondResultTokens: 0,
  totalSecondResultTokensEarned: 0,
  availableThirdResultTokens: 0,
  totalThirdResultTokensEarned: 0,
  availableFourthResultTokens: 0,
  totalFourthResultTokensEarned: 0,
  availableFifthResultTokens: 0,
  totalFifthResultTokensEarned: 0,
  progressSecondResultTokensAwarded: 0,
  completedEncyclopediaCategories: new Set(),
  hasActiveNegativeMixToken: false,
  activeSidebarTab: "words",
  unseenTokenRewards: 0,
  playfieldZoom: 1,
  playfieldCamera: {
    x: 0,
    y: 0,
  },
  quest: {
    targetWord: null,
    remainingDiscoveries: 0,
    isLost: false,
  },
  nextTileId: 1,
  nextZIndex: 1,
};

const els = {
  status: document.querySelector("[data-status]"),
  encyclopediaCount: document.querySelector("[data-encyclopedia-count]"),
  historyCount: document.querySelector("[data-history-count]"),
  discoveredCount: document.querySelector("[data-discovered-count]"),
  questWord: document.querySelector("[data-quest-word]"),
  questCountdown: document.querySelector("[data-quest-countdown]"),
  availableCount: document.querySelector("[data-available-count]"),
  wordSearch: document.querySelector("[data-word-search]"),
  wordList: document.querySelector("[data-word-list]"),
  playfield: document.querySelector("[data-playfield]"),
  playfieldSurface: document.querySelector("[data-playfield-surface]"),
  emptyMessage: document.querySelector("[data-empty-message]"),
  zoomOutButton: document.querySelector("[data-action='zoom-out']"),
  zoomInButton: document.querySelector("[data-action='zoom-in']"),
  playfieldZoomValue: document.querySelector("[data-playfield-zoom-value]"),
  playfieldZoneValue: document.querySelector("[data-playfield-zone-value]"),
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
  spawnExistingWordsToggle: document.querySelector("[data-setting='spawn-existing-words']"),
  questStrip: document.querySelector(".quest-strip"),
  questLossModal: document.querySelector("[data-quest-loss-modal]"),
  questLossWord: document.querySelector("[data-quest-loss-word]"),
  questTryAgainButton: document.querySelector("[data-action='quest-try-again']"),
};

let pendingProgressSave = null;
let activeFloatingCandidatePreview = null;
let activeFloatingCandidatePreviewTimeout = null;
let activeFloatingWordNotice = null;
let activeFloatingWordNoticeTimeout = null;

function getSafeCount(value, fallback = 0) {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : fallback;
}

function getStringList(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

function getOrdinalLabel(rank) {
  const ones = rank % 10;
  const tens = Math.floor((rank % 100) / 10);
  if (tens === 1) {
    return `${rank}th`;
  }
  if (ones === 1) {
    return `${rank}st`;
  }
  if (ones === 2) {
    return `${rank}nd`;
  }
  if (ones === 3) {
    return `${rank}rd`;
  }
  return `${rank}th`;
}

function getPositionTokenDisplayName(rank) {
  return POSITION_TOKEN_CONFIG[rank]?.title || `${getOrdinalLabel(rank)} Result`;
}

function getPositionTokenShortLabel(rank) {
  return POSITION_TOKEN_CONFIG[rank]?.shortLabel || getOrdinalLabel(rank);
}

function getPositionTokenDragType(rank) {
  return `result-rank-${rank}`;
}

function getPositionTokenRankFromDragType(dragType) {
  const match = /^result-rank-(\d+)$/.exec(dragType || "");
  return match ? getSafeCount(Number(match[1])) : 0;
}

function getAvailablePositionTokenCount(rank) {
  if (rank === 2) {
    return state.availableSecondResultTokens;
  }
  if (rank === 3) {
    return state.availableThirdResultTokens;
  }
  if (rank === 4) {
    return state.availableFourthResultTokens;
  }
  if (rank === 5) {
    return state.availableFifthResultTokens;
  }
  return 0;
}

function getTotalEarnedPositionTokenCount(rank) {
  if (rank === 2) {
    return state.totalSecondResultTokensEarned;
  }
  if (rank === 3) {
    return state.totalThirdResultTokensEarned;
  }
  if (rank === 4) {
    return state.totalFourthResultTokensEarned;
  }
  if (rank === 5) {
    return state.totalFifthResultTokensEarned;
  }
  return 0;
}

function addPositionTokens(rank, count, { markAsEarned = true } = {}) {
  const safeCount = getSafeCount(count);
  if (safeCount <= 0) {
    return;
  }

  if (rank === 2) {
    state.availableSecondResultTokens += safeCount;
    if (markAsEarned) {
      state.totalSecondResultTokensEarned += safeCount;
    }
    return;
  }
  if (rank === 3) {
    state.availableThirdResultTokens += safeCount;
    if (markAsEarned) {
      state.totalThirdResultTokensEarned += safeCount;
    }
    return;
  }
  if (rank === 4) {
    state.availableFourthResultTokens += safeCount;
    if (markAsEarned) {
      state.totalFourthResultTokensEarned += safeCount;
    }
    return;
  }
  if (rank === 5) {
    state.availableFifthResultTokens += safeCount;
    if (markAsEarned) {
      state.totalFifthResultTokensEarned += safeCount;
    }
  }
}

function spendPositionToken(rank) {
  if (getAvailablePositionTokenCount(rank) <= 0) {
    return false;
  }

  if (rank === 2) {
    state.availableSecondResultTokens -= 1;
  } else if (rank === 3) {
    state.availableThirdResultTokens -= 1;
  } else if (rank === 4) {
    state.availableFourthResultTokens -= 1;
  } else if (rank === 5) {
    state.availableFifthResultTokens -= 1;
  } else {
    return false;
  }

  return true;
}

function createEmptyPositionTokenRewardSummary() {
  return Object.fromEntries(POSITION_TOKEN_RANKS.map((rank) => [rank, 0]));
}

function getPositionTokenRewardCount(rewardSummary) {
  return POSITION_TOKEN_RANKS.reduce((total, rank) => total + getSafeCount(rewardSummary?.[rank]), 0);
}

function addWildcardTokens(count, { markAsEarned = true } = {}) {
  const safeCount = getSafeCount(count);
  if (safeCount <= 0) {
    return;
  }

  state.availableWildcardTokens += safeCount;
  if (markAsEarned) {
    state.totalWildcardTokensEarned += safeCount;
  }
}

function spendWildcardToken() {
  if (state.availableWildcardTokens <= 0) {
    return false;
  }

  state.availableWildcardTokens -= 1;
  return true;
}

function getDiscoveryDropPool() {
  return RANDOM_DISCOVERY_TOKEN_POOL;
}

function awardRandomDiscoveryToken() {
  const newPositionTokenRewards = createEmptyPositionTokenRewardSummary();
  let newWildcardTokens = 0;
  const dropPool = getDiscoveryDropPool();
  if (!dropPool.length || Math.random() >= DISCOVERY_TOKEN_DROP_CHANCE) {
    return { newWildcardTokens, newPositionTokenRewards };
  }

  const rewardType = dropPool[Math.floor(Math.random() * dropPool.length)];
  if (rewardType === "wildcard") {
    addWildcardTokens(1);
    state.unseenTokenRewards += 1;
    newWildcardTokens = 1;
    return { newWildcardTokens, newPositionTokenRewards };
  }

  addPositionTokens(rewardType, 1);
  state.unseenTokenRewards += 1;
  newPositionTokenRewards[rewardType] += 1;
  return { newWildcardTokens, newPositionTokenRewards };
}

function mergePositionTokenRewardSummary(target, source) {
  POSITION_TOKEN_RANKS.forEach((rank) => {
    target[rank] += getSafeCount(source?.[rank]);
  });
}

function sampleQuestWord(previousWord = null) {
  const pool = previousWord
    ? ENCYCLOPEDIA_WORDS
      .map((entry) => entry.word)
      .filter((word) => word !== previousWord)
    : ENCYCLOPEDIA_WORDS.map((entry) => entry.word);
  const fallbackPool = pool.length > 0 ? pool : ENCYCLOPEDIA_WORDS.map((entry) => entry.word);
  return fallbackPool[Math.floor(Math.random() * fallbackPool.length)] ?? null;
}

function getRandomQuestDiscoveryTimer() {
  return QUEST_TIMER_MIN + Math.floor(Math.random() * ((QUEST_TIMER_MAX - QUEST_TIMER_MIN) + 1));
}

function assignNewQuest({ initial = false, previousTargetWord = null } = {}) {
  state.quest.targetWord = sampleQuestWord(previousTargetWord);
  state.quest.remainingDiscoveries = initial ? QUEST_INITIAL_DISCOVERY_TIMER : getRandomQuestDiscoveryTimer();
  state.quest.isLost = false;
  return {
    targetWord: state.quest.targetWord,
    remainingDiscoveries: state.quest.remainingDiscoveries,
  };
}

function awardQuestCompletionTokens(count = QUEST_COMPLETION_REWARD_COUNT) {
  const rewardSummary = {
    newNegativeMixTokens: 0,
    newBanWordTokens: 0,
    newWildcardTokens: 0,
    newPositionTokenRewards: createEmptyPositionTokenRewardSummary(),
  };

  for (let index = 0; index < count; index += 1) {
    const rewardType = QUEST_REWARD_TOKEN_POOL[Math.floor(Math.random() * QUEST_REWARD_TOKEN_POOL.length)];
    if (rewardType === "minus-mix") {
      state.availableNegativeMixTokens += 1;
      state.totalNegativeMixTokensEarned += 1;
      state.unseenTokenRewards += 1;
      rewardSummary.newNegativeMixTokens += 1;
      continue;
    }
    if (rewardType === "ban-word") {
      state.availableBanWordTokens += 1;
      state.totalBanWordTokensEarned += 1;
      state.unseenTokenRewards += 1;
      rewardSummary.newBanWordTokens += 1;
      continue;
    }

    addPositionTokens(rewardType, 1);
    state.unseenTokenRewards += 1;
    rewardSummary.newPositionTokenRewards[rewardType] += 1;
  }

  return rewardSummary;
}

function advanceQuest(canonicalResult, { didDiscoverNewWord = false } = {}) {
  const questResult = {
    completedQuest: false,
    failedQuest: false,
    completedTargetWord: state.quest.targetWord,
    nextTargetWord: state.quest.targetWord,
    remainingDiscoveries: state.quest.remainingDiscoveries,
    newNegativeMixTokens: 0,
    newBanWordTokens: 0,
    newWildcardTokens: 0,
    newPositionTokenRewards: createEmptyPositionTokenRewardSummary(),
  };
  if (!state.quest.targetWord || state.quest.isLost) {
    return questResult;
  }

  if (didDiscoverNewWord) {
    state.quest.remainingDiscoveries = Math.max(0, state.quest.remainingDiscoveries - 1);
  }

  if (canonicalResult === state.quest.targetWord) {
    const rewardSummary = awardQuestCompletionTokens();
    const completedTargetWord = state.quest.targetWord;
    const nextQuest = assignNewQuest({
      initial: false,
      previousTargetWord: completedTargetWord,
    });
    questResult.completedQuest = true;
    questResult.completedTargetWord = completedTargetWord;
    questResult.nextTargetWord = nextQuest.targetWord;
    questResult.remainingDiscoveries = nextQuest.remainingDiscoveries;
    questResult.newNegativeMixTokens = rewardSummary.newNegativeMixTokens;
    questResult.newBanWordTokens = rewardSummary.newBanWordTokens;
    questResult.newWildcardTokens = rewardSummary.newWildcardTokens;
    mergePositionTokenRewardSummary(questResult.newPositionTokenRewards, rewardSummary.newPositionTokenRewards);
    return questResult;
  }

  questResult.remainingDiscoveries = state.quest.remainingDiscoveries;
  if (didDiscoverNewWord && state.quest.remainingDiscoveries <= 0) {
    state.quest.isLost = true;
    questResult.failedQuest = true;
  }

  return questResult;
}

function getTileTagRank(tile) {
  if (!tile) {
    return 0;
  }
  if (Number.isFinite(tile.resultTagRank)) {
    return getSafeCount(tile.resultTagRank);
  }
  return tile.secondResultTagged ? 2 : 0;
}

function getTaggedTokenRefundMessage(refundedTagCount) {
  if (refundedTagCount <= 0) {
    return "";
  }
  return ` ${refundedTagCount} tagged-result token${refundedTagCount === 1 ? " was" : "s were"} refunded.`;
}

function buildProgressSnapshot() {
  return {
    version: 2,
    starters: [...state.starters],
    discovered: [...state.discovered.entries()],
    selfMatchedWords: [...state.selfMatchedWords],
    spawnExistingWords: state.spawnExistingWords,
    tiles: state.tiles.map((tile) => ({
      id: tile.id,
      word: tile.word,
      secondResultTagged: getTileTagRank(tile) === 2,
      resultTagRank: getTileTagRank(tile),
      x: tile.x,
      y: tile.y,
      zIndex: tile.zIndex,
    })),
    negativeMix: { ...state.negativeMix },
    negativeMixSources: { ...state.negativeMixSources },
    negativeMixPosition: { ...state.negativeMixPosition },
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
    recentDiscoveredWordKeys: [...state.recentDiscoveredWordKeys],
    removedResultWords: [...state.removedResultWords],
    hiddenWordPanelWords: [...state.hiddenWordPanelWords],
    garbageWordsSinceReward: state.garbageWordsSinceReward,
    garbageRewardLevel: state.garbageRewardLevel,
    availableNegativeMixTokens: state.availableNegativeMixTokens,
    totalNegativeMixTokensEarned: state.totalNegativeMixTokensEarned,
    progressNegativeMixTokensAwarded: state.progressNegativeMixTokensAwarded,
    availableBanWordTokens: state.availableBanWordTokens,
    totalBanWordTokensEarned: state.totalBanWordTokensEarned,
    availableWildcardTokens: state.availableWildcardTokens,
    totalWildcardTokensEarned: state.totalWildcardTokensEarned,
    availableSecondResultTokens: state.availableSecondResultTokens,
    totalSecondResultTokensEarned: state.totalSecondResultTokensEarned,
    availableThirdResultTokens: state.availableThirdResultTokens,
    totalThirdResultTokensEarned: state.totalThirdResultTokensEarned,
    availableFourthResultTokens: state.availableFourthResultTokens,
    totalFourthResultTokensEarned: state.totalFourthResultTokensEarned,
    availableFifthResultTokens: state.availableFifthResultTokens,
    totalFifthResultTokensEarned: state.totalFifthResultTokensEarned,
    progressSecondResultTokensAwarded: state.progressSecondResultTokensAwarded,
    completedEncyclopediaCategories: [...state.completedEncyclopediaCategories],
    hasActiveNegativeMixToken: state.hasActiveNegativeMixToken,
    activeSidebarTab: state.activeSidebarTab,
    unseenTokenRewards: state.unseenTokenRewards,
    playfieldZoom: state.playfieldZoom,
    playfieldCamera: { ...state.playfieldCamera },
    quest: {
      targetWord: state.quest.targetWord,
      remainingDiscoveries: state.quest.remainingDiscoveries,
      isLost: state.quest.isLost,
    },
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
      resultTagRank: Number.isFinite(tile.resultTagRank)
        ? getSafeCount(tile.resultTagRank)
        : (tile.secondResultTagged ? 2 : 0),
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
  if (starters.length < 2) {
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
  const recentDiscoveredWordKeys = getStringList(snapshot.recentDiscoveredWordKeys)
    .slice(-RECENT_DISCOVERED_WORD_LIMIT);

  state.starters = starters;
  state.discovered = discovered;
  state.selfMatchedWords = new Set(getStringList(snapshot.selfMatchedWords));
  state.spawnExistingWords = Boolean(snapshot.spawnExistingWords);
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
  state.recentDiscoveredWordKeys = recentDiscoveredWordKeys.filter((wordKey) => discovered.has(wordKey));
  state.googlePickMode = false;
  state.clickTracker.word = null;
  state.clickTracker.time = 0;
  state.removedResultWords = new Set(getStringList(snapshot.removedResultWords));
  state.hiddenWordPanelWords = new Set(getStringList(snapshot.hiddenWordPanelWords));
  state.garbageRewardLevel = getSafeCount(snapshot.garbageRewardLevel);
  state.garbageWordsSinceReward = getSafeCount(snapshot.garbageWordsSinceReward) % getCurrentGarbageTarget();
  state.availableNegativeMixTokens = getSafeCount(snapshot.availableNegativeMixTokens);
  state.totalNegativeMixTokensEarned = getSafeCount(snapshot.totalNegativeMixTokensEarned);
  state.progressNegativeMixTokensAwarded = Math.min(
    getUnlockedNegativeMixTokenCount(discovered.size),
    getSafeCount(snapshot.progressNegativeMixTokensAwarded, getUnlockedNegativeMixTokenCount(discovered.size)),
  );
  state.availableBanWordTokens = getSafeCount(snapshot.availableBanWordTokens);
  state.totalBanWordTokensEarned = getSafeCount(snapshot.totalBanWordTokensEarned);
  state.availableWildcardTokens = getSafeCount(snapshot.availableWildcardTokens);
  state.totalWildcardTokensEarned = getSafeCount(snapshot.totalWildcardTokensEarned);
  state.availableSecondResultTokens = getSafeCount(snapshot.availableSecondResultTokens);
  state.totalSecondResultTokensEarned = getSafeCount(snapshot.totalSecondResultTokensEarned);
  state.availableThirdResultTokens = getSafeCount(snapshot.availableThirdResultTokens);
  state.totalThirdResultTokensEarned = getSafeCount(snapshot.totalThirdResultTokensEarned);
  state.availableFourthResultTokens = getSafeCount(snapshot.availableFourthResultTokens);
  state.totalFourthResultTokensEarned = getSafeCount(snapshot.totalFourthResultTokensEarned);
  state.availableFifthResultTokens = getSafeCount(snapshot.availableFifthResultTokens);
  state.totalFifthResultTokensEarned = getSafeCount(snapshot.totalFifthResultTokensEarned);
  state.progressSecondResultTokensAwarded = Math.min(
    getUnlockedSecondResultTokenCount(discovered.size),
    getSafeCount(snapshot.progressSecondResultTokensAwarded, getUnlockedSecondResultTokenCount(discovered.size)),
  );
  state.completedEncyclopediaCategories = new Set(
    getStringList(snapshot.completedEncyclopediaCategories).length > 0
      ? getStringList(snapshot.completedEncyclopediaCategories)
      : getCompletedEncyclopediaCategoryNames(new Set(
        [...discovered.keys()].filter((word) => ENCYCLOPEDIA_LOOKUP.has(word)),
      )),
  );
  state.hasActiveNegativeMixToken = Boolean(snapshot.hasActiveNegativeMixToken);
  state.activeSidebarTab = snapshot.activeSidebarTab === "tokens" && hasUnlockedAnyTokenType()
    ? "tokens"
    : "words";
  state.unseenTokenRewards = getSafeCount(snapshot.unseenTokenRewards);
  state.playfieldZoom = getNormalizedPlayfieldZoom(snapshot.playfieldZoom);
  state.playfieldCamera = clampPlayfieldCamera({
    x: Number.isFinite(snapshot.playfieldCamera?.x) ? snapshot.playfieldCamera.x : getDefaultPlayfieldCamera(state.playfieldZoom).x,
    y: Number.isFinite(snapshot.playfieldCamera?.y) ? snapshot.playfieldCamera.y : getDefaultPlayfieldCamera(state.playfieldZoom).y,
  }, state.playfieldZoom);
  state.negativeMixPosition = clampNegativeMixPosition({
    x: Number.isFinite(snapshot.negativeMixPosition?.x) ? snapshot.negativeMixPosition.x : getDefaultNegativeMixPosition().x,
    y: Number.isFinite(snapshot.negativeMixPosition?.y) ? snapshot.negativeMixPosition.y : getDefaultNegativeMixPosition().y,
  });
  const savedQuestTarget = typeof snapshot.quest?.targetWord === "string"
    && ENCYCLOPEDIA_LOOKUP.has(snapshot.quest.targetWord)
    ? snapshot.quest.targetWord
    : null;
  const savedQuestRemaining = getSafeCount(snapshot.quest?.remainingDiscoveries);
  const savedQuestLost = Boolean(snapshot.quest?.isLost);
  if (savedQuestTarget && (savedQuestRemaining > 0 || savedQuestLost)) {
    state.quest.targetWord = savedQuestTarget;
    state.quest.remainingDiscoveries = savedQuestRemaining;
    state.quest.isLost = savedQuestLost;
  } else {
    assignNewQuest({ initial: true });
  }
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

  clampTilesToPlayfieldBounds();
  updatePlayfieldCamera();
  renderSidebar();
  renderTiles();
  renderNegativeMix();
  renderHistory();
  renderSettings();
  setStatus(statusMessage, "ok");
  clearFloatingCandidatePreview();
  clearFloatingWordNotice();
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
  if (typeof word !== "string" || word.length === 0) {
    return "";
  }
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

function roundTo(value, precision = 1000) {
  return Math.round(value * precision) / precision;
}

function getPlayfieldViewportSize() {
  return {
    width: els.playfield.clientWidth,
    height: els.playfield.clientHeight,
  };
}

function getUnlockedPlayfieldZoneCount() {
  return 1 + Math.floor(state.discovered.size / PLAYFIELD_WORDS_PER_ZONE_UNLOCK);
}

function getNextPlayfieldZoneUnlockWordCount() {
  return getUnlockedPlayfieldZoneCount() * PLAYFIELD_WORDS_PER_ZONE_UNLOCK;
}

function getMaxWorldScaleForZoneCount(zoneCount) {
  return PLAYFIELD_BASE_WORLD_SCALE + ((Math.max(1, zoneCount) - 1) * PLAYFIELD_ZONE_SCALE_STEP);
}

function getMinimumUnlockedZoom() {
  return Math.max(MIN_PLAYFIELD_ZOOM, 1 / getUnlockedPlayfieldZoneCount());
}

function getNormalizedPlayfieldZoom(value) {
  const fallback = 1;
  const parsed = Number.isFinite(value) ? value : fallback;
  return clamp(roundTo(parsed), getMinimumUnlockedZoom(), MAX_PLAYFIELD_ZOOM);
}

function getPlayfieldWorldSize() {
  const { width, height } = getPlayfieldViewportSize();
  const unlockedScale = getMaxWorldScaleForZoneCount(getUnlockedPlayfieldZoneCount());
  return {
    width: Math.max(width, Math.round(width * unlockedScale)),
    height: Math.max(height, Math.round(height * unlockedScale)),
  };
}

function getPlayfieldVisibleWorldSize(zoom = state.playfieldZoom) {
  const { width, height } = getPlayfieldViewportSize();
  const safeZoom = clamp(zoom, MIN_PLAYFIELD_ZOOM, MAX_PLAYFIELD_ZOOM);
  return {
    width: width / safeZoom,
    height: height / safeZoom,
  };
}

function getDefaultPlayfieldCamera(zoom = state.playfieldZoom) {
  const world = getPlayfieldWorldSize();
  const visible = getPlayfieldVisibleWorldSize(zoom);
  return {
    x: Math.max(0, (world.width - visible.width) / 2),
    y: Math.max(0, (world.height - visible.height) / 2),
  };
}

function clampPlayfieldCamera(camera = state.playfieldCamera, zoom = state.playfieldZoom) {
  const world = getPlayfieldWorldSize();
  const visible = getPlayfieldVisibleWorldSize(zoom);
  return {
    x: clamp(roundTo(camera.x), 0, Math.max(0, world.width - visible.width)),
    y: clamp(roundTo(camera.y), 0, Math.max(0, world.height - visible.height)),
  };
}

function setPlayfieldCamera(nextCamera, { queueSave = false } = {}) {
  state.playfieldCamera = clampPlayfieldCamera(nextCamera);
  updatePlayfieldCamera();
  renderTiles();
  if (queueSave) {
    queueProgressSave();
  }
}

function getActivePlayfieldZoneCount(zoom = state.playfieldZoom) {
  const visibleScale = 1 / clamp(zoom, MIN_PLAYFIELD_ZOOM, MAX_PLAYFIELD_ZOOM);
  if (visibleScale <= 1.01) {
    return 1;
  }
  return Math.min(
    getUnlockedPlayfieldZoneCount(),
    1 + Math.ceil((visibleScale - 1.001) / PLAYFIELD_ZONE_SCALE_STEP),
  );
}

function getPlayfieldBounds() {
  const { width, height } = getPlayfieldViewportSize();
  const world = getPlayfieldWorldSize();
  return {
    width,
    height,
    worldWidth: world.width,
    worldHeight: world.height,
    minX: 0,
    minY: 0,
    maxX: Math.max(0, world.width - TILE_WIDTH),
    maxY: Math.max(0, world.height - TILE_HEIGHT),
  };
}

function getRenderedPoint(point) {
  return {
    x: (point.x - state.playfieldCamera.x) * state.playfieldZoom,
    y: (point.y - state.playfieldCamera.y) * state.playfieldZoom,
  };
}

function getPlayfieldPointFromClientPoint(clientX, clientY, bounds = getPlayfieldBounds()) {
  const playfieldRect = els.playfield.getBoundingClientRect();
  return {
    x: clamp(state.playfieldCamera.x + ((clientX - playfieldRect.left) / state.playfieldZoom), bounds.minX, bounds.maxX),
    y: clamp(state.playfieldCamera.y + ((clientY - playfieldRect.top) / state.playfieldZoom), bounds.minY, bounds.maxY),
  };
}

function getNegativeMixSize() {
  return {
    width: els.negativePanel?.offsetWidth || NEGATIVE_MIX_WIDTH,
    height: els.negativePanel?.offsetHeight || NEGATIVE_MIX_HEIGHT,
  };
}

function clampNegativeMixPosition(position = state.negativeMixPosition) {
  const world = getPlayfieldWorldSize();
  const size = getNegativeMixSize();
  return {
    x: clamp(roundTo(position.x), 0, Math.max(0, world.width - size.width)),
    y: clamp(roundTo(position.y), 0, Math.max(0, world.height - size.height)),
  };
}

function getDefaultNegativeMixPosition() {
  const visible = getPlayfieldVisibleWorldSize();
  const size = getNegativeMixSize();
  return clampNegativeMixPosition({
    x: state.playfieldCamera.x + Math.max(24, (visible.width - size.width) / 2),
    y: state.playfieldCamera.y + Math.max(24, (visible.height - size.height) / 4),
  });
}

function clampTilesToPlayfieldBounds() {
  const bounds = getPlayfieldBounds();
  state.tiles = state.tiles.map((tile) => ({
    ...tile,
    x: clamp(tile.x, bounds.minX, bounds.maxX),
    y: clamp(tile.y, bounds.minY, bounds.maxY),
  }));
}

function updatePlayfieldCamera() {
  const bounds = getPlayfieldBounds();
  els.playfieldSurface.style.width = `${bounds.worldWidth}px`;
  els.playfieldSurface.style.height = `${bounds.worldHeight}px`;
  state.playfieldCamera = clampPlayfieldCamera(state.playfieldCamera);
  els.playfieldSurface.style.transform = `translate(${-state.playfieldCamera.x * state.playfieldZoom}px, ${-state.playfieldCamera.y * state.playfieldZoom}px) scale(${state.playfieldZoom})`;

  const unlockedZones = getUnlockedPlayfieldZoneCount();
  const visibleZones = getActivePlayfieldZoneCount();
  const nextUnlockAt = getNextPlayfieldZoneUnlockWordCount();

  els.playfieldZoomValue.textContent = `${Math.round(state.playfieldZoom * 100)}%`;
  els.playfieldZoneValue.textContent = `${visibleZones} / ${unlockedZones} zones • next at ${nextUnlockAt} words`;
  els.zoomOutButton.disabled = state.playfieldZoom <= getMinimumUnlockedZoom() + 0.001;
  els.zoomInButton.disabled = state.playfieldZoom >= MAX_PLAYFIELD_ZOOM - 0.001;
}

function setPlayfieldZoom(nextZoom, { silent = false } = {}) {
  const minZoom = getMinimumUnlockedZoom();
  const clampedZoom = clamp(roundTo(nextZoom), minZoom, MAX_PLAYFIELD_ZOOM);
  const hitLockedFrontier = nextZoom < minZoom - 0.001;
  if (Math.abs(clampedZoom - state.playfieldZoom) < 0.001) {
    if (hitLockedFrontier && !silent) {
      const nextUnlockAt = getNextPlayfieldZoneUnlockWordCount();
      if (nextUnlockAt) {
        setStatus(`The next field frontier unlocks at ${nextUnlockAt} discovered words.`, "error");
      }
    }
    updatePlayfieldCamera();
    return false;
  }

  const visibleBefore = getPlayfieldVisibleWorldSize(state.playfieldZoom);
  const centerX = state.playfieldCamera.x + (visibleBefore.width / 2);
  const centerY = state.playfieldCamera.y + (visibleBefore.height / 2);
  state.playfieldZoom = clampedZoom;
  const visibleAfter = getPlayfieldVisibleWorldSize(clampedZoom);
  state.playfieldCamera = clampPlayfieldCamera({
    x: centerX - (visibleAfter.width / 2),
    y: centerY - (visibleAfter.height / 2),
  }, clampedZoom);
  clampTilesToPlayfieldBounds();
  updatePlayfieldCamera();
  renderTiles();
  queueProgressSave();

  if (hitLockedFrontier && !silent) {
    const nextUnlockAt = getNextPlayfieldZoneUnlockWordCount();
    if (nextUnlockAt) {
      setStatus(`The next field frontier unlocks at ${nextUnlockAt} discovered words.`, "error");
    }
  }

  return true;
}

function adjustPlayfieldZoom(delta) {
  setPlayfieldZoom(state.playfieldZoom + delta);
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

function getAvailableEntryForWord(word, normalized = word) {
  const canonicalWord = getCanonicalWord(word, normalized);
  return getAvailableWordEntries().find((entry) =>
    entry.key === normalized
    || entry.key === canonicalWord.toLowerCase()
    || entry.word === canonicalWord) || null;
}

function getEncyclopediaEntry(word, normalized = word) {
  return ENCYCLOPEDIA_LOOKUP.get(normalized) || ENCYCLOPEDIA_LOOKUP.get(word.toLowerCase()) || null;
}

function getDiscoveredEncyclopediaWords() {
  return new Set(
    [...state.discovered.keys()].filter((word) => ENCYCLOPEDIA_LOOKUP.has(word)),
  );
}

function getCompletedEncyclopediaCategoryNames(discoveredWords = getDiscoveredEncyclopediaWords()) {
  return ENCYCLOPEDIA_CATEGORIES
    .filter((category) => category.words.every((word) => discoveredWords.has(word)))
    .map((category) => category.name);
}

function getEncyclopediaDiscoveryCount() {
  return getDiscoveredEncyclopediaWords().size;
}

function getUnlockedNegativeMixTokenCount(discoveredCount = state.discovered.size) {
  if (discoveredCount < NEGATIVE_MIX_FIRST_UNLOCK_WORDS) {
    return 0;
  }
  if (discoveredCount < WORDS_PER_NEGATIVE_MIX_TOKEN) {
    return 1;
  }
  return 2 + Math.floor((discoveredCount - WORDS_PER_NEGATIVE_MIX_TOKEN) / WORDS_PER_NEGATIVE_MIX_TOKEN);
}

function getUnlockedSecondResultTokenCount(discoveredCount = state.discovered.size) {
  return discoveredCount >= SECOND_RESULT_FIRST_UNLOCK_WORDS ? 1 : 0;
}

function isGarbageBinUnlocked() {
  return state.discovered.size >= GARBAGE_BIN_UNLOCK_WORDS;
}

function getCurrentGarbageTarget() {
  return GARBAGE_WORDS_PER_TOKEN_BASE + ((state.garbageRewardLevel * (state.garbageRewardLevel + 1)) / 2);
}

function trackDiscoveredWord(wordKey) {
  if (typeof wordKey !== "string" || !wordKey) {
    return;
  }

  state.recentDiscoveredWordKeys = state.recentDiscoveredWordKeys
    .filter((trackedWordKey) => trackedWordKey !== wordKey);
  state.recentDiscoveredWordKeys.push(wordKey);
  if (state.recentDiscoveredWordKeys.length > RECENT_DISCOVERED_WORD_LIMIT) {
    state.recentDiscoveredWordKeys = state.recentDiscoveredWordKeys
      .slice(-RECENT_DISCOVERED_WORD_LIMIT);
  }
}

function replaceTrackedDiscoveredWordKey(previousKey, nextKey) {
  if (typeof previousKey !== "string" || !previousKey || typeof nextKey !== "string" || !nextKey) {
    return;
  }

  state.recentDiscoveredWordKeys = state.recentDiscoveredWordKeys.map((trackedWordKey) =>
    trackedWordKey === previousKey ? nextKey : trackedWordKey,
  );
  state.recentDiscoveredWordKeys = [...new Set(state.recentDiscoveredWordKeys)]
    .slice(-RECENT_DISCOVERED_WORD_LIMIT);
}

function getTotalUsableTokenCount() {
  return state.availableNegativeMixTokens
    + state.availableBanWordTokens
    + state.availableWildcardTokens
    + POSITION_TOKEN_RANKS.reduce((total, rank) => total + getAvailablePositionTokenCount(rank), 0);
}

function hasUnlockedAnyTokenType() {
  return state.availableNegativeMixTokens > 0
    || state.availableBanWordTokens > 0
    || state.availableWildcardTokens > 0
    || POSITION_TOKEN_RANKS.some((rank) => getAvailablePositionTokenCount(rank) > 0)
    || state.totalNegativeMixTokensEarned > 0
    || state.totalBanWordTokensEarned > 0
    || state.totalWildcardTokensEarned > 0
    || POSITION_TOKEN_RANKS.some((rank) => getTotalEarnedPositionTokenCount(rank) > 0);
}

function shouldFlashTokenTab() {
  return state.unseenTokenRewards > 0 && getTotalUsableTokenCount() > 0 && state.activeSidebarTab !== "tokens";
}

function getTileById(tileId) {
  return state.tiles.find((tile) => tile.id === tileId) || null;
}

function getTaggedTiles(tileIds) {
  return [...new Set(tileIds)]
    .map((tileId) => getTileById(tileId))
    .filter((tile) => getTileTagRank(tile) >= 2);
}

function releaseTaggedResultTokens(tileIds, { refund = false } = {}) {
  let releasedCount = 0;
  getTaggedTiles(tileIds).forEach((tile) => {
    const rank = getTileTagRank(tile);
    if (!tile || rank < 2) {
      return;
    }
    tile.resultTagRank = 0;
    releasedCount += 1;
    if (refund) {
      addPositionTokens(rank, 1, { markAsEarned: false });
    }
  });

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

function setsIntersect(left, right) {
  for (const value of left) {
    if (right.has(value)) {
      return true;
    }
  }
  return false;
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
  const taggedTiles = getTaggedTiles(tileIds);
  const taggedRanks = taggedTiles.map((tile) => getTileTagRank(tile));
  const desiredResultRank = taggedRanks.length <= 0
    ? 1
    : taggedRanks.length === 1
      ? taggedRanks[0]
      : Math.max(...taggedRanks) + 1;
  const desiredShift = Math.max(0, desiredResultRank - 1);
  if (!allowedCandidates.length) {
    const refundedTagCount = taggedTiles.length > 0
      ? releaseTaggedResultTokens(tileIds, { refund: true })
      : 0;
    return {
      candidate: null,
      candidates: [],
      usedShift: 0,
      refundedTagCount,
      error: `All valid results for that mix have been permanently removed.${getTaggedTokenRefundMessage(refundedTagCount)}`,
    };
  }
  const canUseShiftedCandidate = desiredShift > 0 && allowedCandidates.length > desiredShift;
  const refundedTagCount = desiredShift > 0 && !canUseShiftedCandidate
    ? releaseTaggedResultTokens(tileIds, { refund: true })
    : 0;

  if (desiredShift > 0 && canUseShiftedCandidate) {
    releaseTaggedResultTokens(tileIds);
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

function clearFloatingWordNotice() {
  if (activeFloatingWordNoticeTimeout !== null) {
    window.clearTimeout(activeFloatingWordNoticeTimeout);
    activeFloatingWordNoticeTimeout = null;
  }
  if (activeFloatingWordNotice) {
    activeFloatingWordNotice.remove();
    activeFloatingWordNotice = null;
  }
}

function showFloatingWordNotice(message, tone = "success", clientPoint = null) {
  clearFloatingWordNotice();

  const playfieldRect = els.playfield.getBoundingClientRect();
  const notice = document.createElement("div");
  notice.className = "floating-word-notice";
  notice.dataset.tone = tone;
  notice.textContent = message;

  const localX = clientPoint
    ? clientPoint.x - playfieldRect.left
    : els.playfield.clientWidth / 2;
  const localY = clientPoint
    ? clientPoint.y - playfieldRect.top
    : els.playfield.clientHeight / 2;
  notice.style.left = `${localX + 14}px`;
  notice.style.top = `${localY - 16}px`;

  els.playfield.append(notice);
  activeFloatingWordNotice = notice;
  activeFloatingWordNoticeTimeout = window.setTimeout(() => {
    clearFloatingWordNotice();
  }, 300);
}

function getClientPointForWorldPosition(position) {
  if (!position) {
    return null;
  }
  const playfieldRect = els.playfield.getBoundingClientRect();
  const renderedPosition = getRenderedPoint(position);
  return {
    x: playfieldRect.left + renderedPosition.x,
    y: playfieldRect.top + renderedPosition.y,
  };
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
    const error = new Error(payload.error || "Could not mix those words.");
    if (typeof payload.deadEndWord === "string" && payload.deadEndWord) {
      error.deadEndWord = payload.deadEndWord.trim().toLowerCase();
    }
    throw error;
  }

  return payload;
}

async function getRandomWildcardWord() {
  const response = await fetch("./api/random-word");
  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "Could not reveal a random word.");
  }

  const word = typeof payload.word === "string" ? payload.word.trim().toLowerCase() : "";
  const normalized = typeof payload.normalized === "string" ? payload.normalized.trim().toLowerCase() : "";
  if (!word || !normalized) {
    throw new Error("Random word payload was incomplete.");
  }

  return { word, normalized };
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

function renderQuest() {
  const targetWord = state.quest.targetWord ? titleCase(state.quest.targetWord) : "None";
  const countdown = state.quest.remainingDiscoveries;
  let questState = "active";
  if (state.quest.isLost) {
    questState = "danger";
  } else if (countdown <= 10) {
    questState = "danger";
  } else if (countdown <= 20) {
    questState = "warning";
  }

  els.questWord.textContent = targetWord;
  els.questCountdown.textContent = countdown.toString();
  els.questStrip.dataset.state = questState;
  els.questLossWord.textContent = targetWord;
  els.questLossModal.hidden = !state.quest.isLost;
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

function activateNegativeMixToken(point = null) {
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
  if (point) {
    const size = getNegativeMixSize();
    state.negativeMixPosition = clampNegativeMixPosition({
      x: point.x - (size.width / 2),
      y: point.y - (size.height / 2),
    });
  } else {
    state.negativeMixPosition = getDefaultNegativeMixPosition();
  }
  renderSidebar();
  renderNegativeMix();
  queueProgressSave();
  setStatus("Minus mixing is active for your next pair.", "ok");
}

function rollGarbageRewardToken() {
  const roll = Math.random();
  if (roll < 0.65) {
    addPositionTokens(2, 1);
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

function retireDeadEndWord(word, explicitWordKey = null, tileIds = []) {
  const wordKey = explicitWordKey || getWordKey(word);
  const removalKeys = getRemovalKeysForWord(word);
  const relatedTileIds = state.tiles
    .filter((tile) => setsIntersect(getRemovalKeysForWord(tile.word), removalKeys))
    .map((tile) => tile.id);
  const allTileIds = [...new Set([
    ...tileIds.filter((tileId) => Number.isFinite(tileId)),
    ...relatedTileIds,
  ])];

  removalKeys.forEach((key) => {
    state.removedResultWords.add(key);
  });
  state.hiddenWordPanelWords.add(wordKey);

  let refundedTagCount = 0;
  allTileIds.forEach((tileId) => {
    refundedTagCount += removeTile(tileId);
  });
  state.lastMix.candidates = filterRemovedCandidates(state.lastMix.candidates);

  return {
    refundedTagCount,
  };
}

function handleDeadEndMixError(error, sources = []) {
  const deadEndWord = typeof error?.deadEndWord === "string"
    ? error.deadEndWord.trim().toLowerCase()
    : "";
  if (!deadEndWord) {
    return false;
  }

  const matchingSources = sources.filter((source) =>
    source
    && typeof source.word === "string"
    && getRemovalKeysForWord(source.word).has(deadEndWord));
  const displayWord = matchingSources[0]?.word || deadEndWord;
  const explicitWordKey = matchingSources[0]?.wordKey || getWordKey(displayWord);
  const tileIds = matchingSources
    .map((source) => source.tileId)
    .filter((tileId) => Number.isFinite(tileId));
  const { refundedTagCount } = retireDeadEndWord(displayWord, explicitWordKey, tileIds);
  const rewardedToken = rollGarbageRewardToken();

  state.unseenTokenRewards += 1;
  if (state.activeSidebarTab === "tokens") {
    state.unseenTokenRewards = 0;
  }

  renderSidebar();
  renderTiles();
  renderNegativeMix();
  queueProgressSave();

  const refundSuffix = refundedTagCount > 0
    ? getTaggedTokenRefundMessage(refundedTagCount)
    : "";
  setStatus(
    `You found a dead-end word! Here's a ${rewardedToken} token. ${titleCase(displayWord)} was erased from the run.${refundSuffix}`,
    "reward",
  );
  return true;
}

function rollEqualRandomTokenReward() {
  const rewardIndex = Math.floor(Math.random() * 3);
  if (rewardIndex === 0) {
    state.availableNegativeMixTokens += 1;
    return "minus";
  }
  if (rewardIndex === 1) {
    state.availableBanWordTokens += 1;
    state.totalBanWordTokensEarned += 1;
    return "ban";
  }
  addPositionTokens(2, 1);
  return "second";
}

function rewardCompletedEncyclopediaCategories() {
  const discoveredEncyclopediaWords = getDiscoveredEncyclopediaWords();
  const newlyCompletedCategories = getCompletedEncyclopediaCategoryNames(discoveredEncyclopediaWords)
    .filter((categoryName) => !state.completedEncyclopediaCategories.has(categoryName));

  if (!newlyCompletedCategories.length) {
    return {
      completedCategories: [],
      newNegativeMixTokens: 0,
      newBanWordTokens: 0,
      newSecondResultTokens: 0,
    };
  }

  let newNegativeMixTokens = 0;
  let newBanWordTokens = 0;
  let newSecondResultTokens = 0;
  newlyCompletedCategories.forEach((categoryName) => {
    state.completedEncyclopediaCategories.add(categoryName);
    for (let rewardIndex = 0; rewardIndex < 5; rewardIndex += 1) {
      const rewardType = rollEqualRandomTokenReward();
      if (rewardType === "minus") {
        newNegativeMixTokens += 1;
      } else if (rewardType === "ban") {
        newBanWordTokens += 1;
      } else {
        newSecondResultTokens += 1;
      }
    }
  });

  const totalNewTokens = newNegativeMixTokens + newBanWordTokens + newSecondResultTokens;
  state.unseenTokenRewards += totalNewTokens;

  return {
    completedCategories: newlyCompletedCategories,
    newNegativeMixTokens,
    newBanWordTokens,
    newSecondResultTokens,
  };
}

function getRelatedTileIdsForWord(word) {
  const removalKeys = getRemovalKeysForWord(word);
  return state.tiles
    .filter((tile) => setsIntersect(getRemovalKeysForWord(tile.word), removalKeys))
    .map((tile) => tile.id);
}

function hideWordFromPanel(word, explicitWordKey = null, tileIdsOrTileId = null) {
  if (typeof word !== "string" || !word) {
    return { ok: false, alreadyHidden: false, refundedTagCount: 0 };
  }

  const wordKey = explicitWordKey || getWordKey(word);
  const tileIds = tileIdsOrTileId === null
    ? []
    : (Array.isArray(tileIdsOrTileId) ? tileIdsOrTileId : [tileIdsOrTileId]);
  const refundedTagCount = [...new Set(tileIds.filter((tileId) => Number.isFinite(tileId)))]
    .reduce((count, tileId) => count + removeTile(tileId), 0);
  const refundMessage = refundedTagCount > 0
    ? getTaggedTokenRefundMessage(refundedTagCount)
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

function getOldestTrackedAvailableEntry() {
  const availableEntriesByKey = new Map(
    getAvailableWordEntries().map((entry) => [entry.key, entry]),
  );

  for (const wordKey of state.recentDiscoveredWordKeys) {
    const entry = availableEntriesByKey.get(wordKey);
    if (entry) {
      return entry;
    }
  }

  return null;
}

function handleAvailableWordOverflow(previousAvailableCount, currentAvailableCount) {
  if (previousAvailableCount < AVAILABLE_WORD_LIMIT
    || currentAvailableCount <= AVAILABLE_WORD_LIMIT) {
    return null;
  }

  const oldestTrackedEntry = getOldestTrackedAvailableEntry();
  if (!oldestTrackedEntry) {
    return {
      message: `You have more than ${AVAILABLE_WORD_LIMIT} available words, but none of your last ${RECENT_DISCOVERED_WORD_LIMIT} discovered words could be auto-binned.`,
      stateName: "error",
    };
  }

  const hideResult = hideWordFromPanel(
    oldestTrackedEntry.word,
    oldestTrackedEntry.key,
    getRelatedTileIdsForWord(oldestTrackedEntry.word),
  );
  const rewardSuffix = hideResult?.statusState === "reward" && hideResult.statusMessage
    ? ` ${hideResult.statusMessage.split(". ").slice(1).join(". ")}`
    : "";

  return {
    message: `${titleCase(oldestTrackedEntry.word)} was automatically binned to keep your available words at ${AVAILABLE_WORD_LIMIT}.${rewardSuffix}`,
    stateName: "error",
  };
}

function tagTileWithResultToken(tileId, rank) {
  const tile = getTileById(tileId);
  if (!tile) {
    setStatus("Drop that token onto a word on the field.", "error");
    return;
  }
  const existingRank = getTileTagRank(tile);
  if (existingRank >= 2) {
    setStatus(`${titleCase(tile.word)} already has a ${getPositionTokenDisplayName(existingRank)} token on it.`, "ok");
    return;
  }
  if (getAvailablePositionTokenCount(rank) <= 0) {
    setStatus(`You do not have any ${getPositionTokenDisplayName(rank).toLowerCase()} tokens yet.`, "error");
    return;
  }

  if (!spendPositionToken(rank)) {
    setStatus(`You do not have any ${getPositionTokenDisplayName(rank).toLowerCase()} tokens yet.`, "error");
    return;
  }

  tile.resultTagRank = rank;
  renderSidebar();
  renderTiles();
  queueProgressSave();
  setStatus(`${titleCase(tile.word)} is tagged to jump to the ${getOrdinalLabel(rank)} valid mix result.`, "ok");
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

async function useWildcardToken(position = null) {
  if (state.availableWildcardTokens <= 0) {
    setStatus("You do not have any wildcard tokens yet.", "error");
    return;
  }

  let randomWord;
  try {
    randomWord = await getRandomWildcardWord();
  } catch (error) {
    setStatus(error.message || "Could not reveal a random word.", "error");
    return;
  }

  if (!spendWildcardToken()) {
    setStatus("You do not have any wildcard tokens yet.", "error");
    return;
  }

  const {
    canonicalResult,
    isInEncyclopedia,
    wasDiscovered,
    newNegativeMixTokens,
    newBanWordTokens,
    newWildcardTokens,
    newPositionTokenRewards,
    newZonesUnlocked,
    completedCategories,
    questResult,
    vocabularyOverflow,
  } = rememberResult(randomWord.word, randomWord.normalized);
  spawnWordOnField(canonicalResult, position);
  const status = getWildcardOutcomeMessage(
    canonicalResult,
    isInEncyclopedia,
    wasDiscovered,
    {
      newNegativeMixTokens,
      newBanWordTokens,
      newWildcardTokens,
      newPositionTokenRewards,
      newZonesUnlocked,
      completedCategories,
      questResult,
    },
  );
  setStatus(vocabularyOverflow?.message || status.message, vocabularyOverflow?.stateName || status.stateName);
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

  if (state.availableWildcardTokens > 0) {
    els.tokenList.append(buildTokenButton({
      title: "Wildcard",
      description: "Drag onto the field to reveal a random dictionary word.",
      count: state.availableWildcardTokens,
      dragType: "wildcard",
      onClick: () => {
        setStatus("Drag a Wildcard token onto the field.", "ok");
      },
    }));
  }

  POSITION_TOKEN_RANKS.forEach((rank) => {
    const count = getAvailablePositionTokenCount(rank);
    if (count <= 0) {
      return;
    }

    const title = getPositionTokenDisplayName(rank);
    const description = rank === 5
      ? "Drag onto a field word to tag it. One tag jumps to the 5th result; two tagged words jump to the 6th."
      : `Drag onto a field word to tag it. One tag jumps to the ${getOrdinalLabel(rank)} result; two tagged words can push to the ${getOrdinalLabel(rank + 1)}.`;

    els.tokenList.append(buildTokenButton({
      title,
      description,
      count,
      dragType: getPositionTokenDragType(rank),
      onClick: () => {
        setStatus(`Drag a ${title} token onto a word on the field.`, "ok");
      },
    }));
  });
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
  updatePlayfieldCamera();
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
  renderQuest();
}

function renderNegativeMix() {
  els.negativePanel.hidden = !state.hasActiveNegativeMixToken;
  if (els.negativePanel.hidden) {
    return;
  }

  state.negativeMixPosition = clampNegativeMixPosition(state.negativeMixPosition);
  els.negativePanel.style.left = `${state.negativeMixPosition.x}px`;
  els.negativePanel.style.top = `${state.negativeMixPosition.y}px`;

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
    newWildcardTokens = 0,
    newPositionTokenRewards = null,
    newZonesUnlocked = 0,
    completedCategories = [],
    questResult = null,
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
    message = `${titleCase(leftWord)} ${operator} ${titleCase(rightWord)} created ${titleCase(canonicalResult)}.`;
    stateName = "ok";
  } else {
    message = `${titleCase(leftWord)} ${operator} ${titleCase(rightWord)} created ${titleCase(canonicalResult)}. `;
    stateName = "ok";
  }

  if (usedShift > 0) {
    message = `${message} Tagged words pushed this mix to the ${getOrdinalLabel(usedShift + 1)} valid result.`;
  }

  if (refundedTagCount > 0) {
    message = `${message} There was no deep enough candidate, so${getTaggedTokenRefundMessage(refundedTagCount)}`;
    stateName = "reward";
  }

  if (completedCategories.length > 0) {
    const categoryLabel = completedCategories.join(" and ");
    const categorySuffix = completedCategories.length === 1 ? "category" : "categories";
    message = `${message} You completed the ${categoryLabel} encyclopedia ${categorySuffix}.`;
    stateName = "reward";
  }

  if (questResult?.completedQuest) {
    message = `${message} Quest complete: you found ${titleCase(questResult.completedTargetWord)}. Your next quest is ${titleCase(questResult.nextTargetWord)} with ${questResult.remainingDiscoveries} discoveries left.`;
    stateName = "reward";
  }

  const rewardParts = getTokenRewardParts({
    newNegativeMixTokens,
    newBanWordTokens,
    newWildcardTokens,
    newPositionTokenRewards,
  });
  if (rewardParts.length > 0) {
    message = `${message} Congrats! You earned ${rewardParts.join(" and ")}.`;
    stateName = "reward";
  }

  if (newZonesUnlocked > 0) {
    const zoneSuffix = newZonesUnlocked === 1 ? "zone" : "zones";
    message = `${message} Your kingdom expanded with ${newZonesUnlocked} new field ${zoneSuffix}.`;
    stateName = "reward";
  }

  if (questResult?.failedQuest) {
    message = `${message} The quest timer hit 0 before you found ${titleCase(questResult.completedTargetWord)}.`;
    stateName = "error";
  }

  return { message, stateName };
}

function getTokenRewardParts({
  newNegativeMixTokens = 0,
  newBanWordTokens = 0,
  newWildcardTokens = 0,
  newPositionTokenRewards = null,
} = {}) {
  const rewardParts = [];
  if (newNegativeMixTokens > 0) {
    const tokenSuffix = newNegativeMixTokens === 1 ? "token" : "tokens";
    rewardParts.push(`${newNegativeMixTokens} minus-mix ${tokenSuffix}`);
  }
  if (newBanWordTokens > 0) {
    const tokenSuffix = newBanWordTokens === 1 ? "token" : "tokens";
    rewardParts.push(`${newBanWordTokens} Ban Word ${tokenSuffix}`);
  }
  if (newWildcardTokens > 0) {
    const tokenSuffix = newWildcardTokens === 1 ? "token" : "tokens";
    rewardParts.push(`${newWildcardTokens} wildcard ${tokenSuffix}`);
  }
  POSITION_TOKEN_RANKS.forEach((rank) => {
    const count = getSafeCount(newPositionTokenRewards?.[rank]);
    if (count <= 0) {
      return;
    }
    const tokenSuffix = count === 1 ? "token" : "tokens";
    rewardParts.push(`${count} ${getPositionTokenDisplayName(rank)} ${tokenSuffix}`);
  });
  return rewardParts;
}

function getWildcardOutcomeMessage(
  canonicalResult,
  isInEncyclopedia,
  wasDiscovered,
  {
    newNegativeMixTokens = 0,
    newBanWordTokens = 0,
    newWildcardTokens = 0,
    newPositionTokenRewards = null,
    newZonesUnlocked = 0,
    completedCategories = [],
    questResult = null,
  } = {},
) {
  let message;
  let stateName;

  if (isInEncyclopedia && !wasDiscovered) {
    message = `Wildcard revealed ${titleCase(canonicalResult)} and added it to your discovered words.`;
    stateName = "success";
  } else if (isInEncyclopedia) {
    message = `Wildcard revealed ${titleCase(canonicalResult)}. It was already discovered, so it only appeared on the field.`;
    stateName = "ok";
  } else if (!wasDiscovered) {
    message = `${titleCase(canonicalResult)} is not one of the ${ENCYCLOPEDIA_WORDS.length} encyclopedia words, but Wildcard added it to your discovered words.`;
    stateName = "success";
  } else {
    message = `Wildcard revealed ${titleCase(canonicalResult)}. It was already discovered and is not one of the ${ENCYCLOPEDIA_WORDS.length} encyclopedia words, so it only appeared on the field.`;
    stateName = "ok";
  }

  if (completedCategories.length > 0) {
    const categoryLabel = completedCategories.join(" and ");
    const categorySuffix = completedCategories.length === 1 ? "category" : "categories";
    message = `${message} You completed the ${categoryLabel} encyclopedia ${categorySuffix}.`;
    stateName = "reward";
  }

  if (questResult?.completedQuest) {
    message = `${message} Quest complete: you found ${titleCase(questResult.completedTargetWord)}. Your next quest is ${titleCase(questResult.nextTargetWord)} with ${questResult.remainingDiscoveries} discoveries left.`;
    stateName = "reward";
  }

  const rewardParts = getTokenRewardParts({
    newNegativeMixTokens,
    newBanWordTokens,
    newWildcardTokens,
    newPositionTokenRewards,
  });
  if (rewardParts.length > 0) {
    message = `${message} Congrats! You earned ${rewardParts.join(" and ")}.`;
    stateName = "reward";
  }

  if (newZonesUnlocked > 0) {
    const zoneSuffix = newZonesUnlocked === 1 ? "zone" : "zones";
    message = `${message} Your kingdom expanded with ${newZonesUnlocked} new field ${zoneSuffix}.`;
    stateName = "reward";
  }

  if (questResult?.failedQuest) {
    message = `${message} The quest timer hit 0 before you found ${titleCase(questResult.completedTargetWord)}.`;
    stateName = "error";
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
    resultTagRank: 0,
    x: clamp(x, bounds.minX, bounds.maxX),
    y: clamp(y, bounds.minY, bounds.maxY),
    zIndex: state.nextZIndex,
  };
}

function getDefaultSpawnPosition() {
  const bounds = getPlayfieldBounds();
  const visible = getPlayfieldVisibleWorldSize();
  const centerX = Math.round(state.playfieldCamera.x + (visible.width / 2) - (TILE_WIDTH / 2));
  const centerY = Math.round(state.playfieldCamera.y + (visible.height / 2) - (TILE_HEIGHT / 2));
  const jitterX = Math.floor((Math.random() * 120) - 60);
  const jitterY = Math.floor((Math.random() * 120) - 60);
  return {
    x: clamp(centerX + jitterX, bounds.minX, bounds.maxX),
    y: clamp(centerY + jitterY, bounds.minY, bounds.maxY),
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

function getNegativeMixResultSpawnPosition() {
  const bounds = getPlayfieldBounds();
  const gap = 14;
  return {
    x: clamp(state.negativeMixPosition.x + ((NEGATIVE_MIX_WIDTH - TILE_WIDTH) / 2), bounds.minX, bounds.maxX),
    y: clamp(state.negativeMixPosition.y + NEGATIVE_MIX_HEIGHT + gap, bounds.minY, bounds.maxY),
  };
}

function removeTile(tileId) {
  const refundedTagCount = releaseTaggedResultTokens([tileId], { refund: true });
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
  const x = clamp(Math.round((firstTile.x + secondTile.x) / 2) + 22, bounds.minX, bounds.maxX);
  const y = clamp(Math.round((firstTile.y + secondTile.y) / 2) + 22, bounds.minY, bounds.maxY);
  spawnWordOnField(word, { x, y });
}

function handleTileClick(word, position, tileId = null, clientPoint = null) {
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
    return runSelfMatch(word, position, tileId, clientPoint);
  }

  state.clickTracker.word = word;
  state.clickTracker.time = now;
  return Promise.resolve();
}

async function runSelfMatch(word, position = null, tileId = null, clientPoint = null) {
  let mix;
  try {
    mix = await getAssociation(word, word, "add");
  } catch (error) {
    if (handleDeadEndMixError(error, [{ word, wordKey: getWordKey(word), tileId }])) {
      return;
    }
    throw error;
  }
  const selection = resolveCandidateSelection(mix.candidates, tileId ? [tileId] : []);
  if (!selection.candidate) {
    throw new Error(selection.error || "No valid result remained for that mix.");
  }
  setLastMix(`${titleCase(word)} + ${titleCase(word)}`, "add", selection.candidates);
  if (position) {
    showFloatingCandidatePreview(selection.candidates, {
      ...getClientPointForWorldPosition(position),
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
    newWildcardTokens,
    newPositionTokenRewards,
    newZonesUnlocked,
    completedCategories,
    questResult,
    vocabularyOverflow,
  } = rememberResult(selectedCandidate.word, selectedCandidate.normalized);
  markWordAsSelfMatched(word);
  recordMatch(word, word, canonicalResult, "add", selection.candidates, selectedCandidate.word);
  const noticePoint = clientPoint || getClientPointForWorldPosition(position);
  const shouldBlockSpawn = !state.spawnExistingWords && wasDiscovered;
  if (shouldBlockSpawn) {
    showFloatingWordNotice("❌", "error", noticePoint);
  } else {
    spawnWordOnField(canonicalResult, position);
    if (!state.spawnExistingWords) {
      showFloatingWordNotice("💡", "success", noticePoint);
    }
  }
  let status;
  if (shouldBlockSpawn) {
    status = getMixOutcomeMessage(word, word, canonicalResult, "add", isInEncyclopedia, wasDiscovered, {
      newNegativeMixTokens,
      newBanWordTokens,
      newWildcardTokens,
      newPositionTokenRewards,
      newZonesUnlocked,
      completedCategories,
      questResult,
      usedShift: selection.usedShift,
      refundedTagCount: selection.refundedTagCount,
    });
    status.message = `${status.message} ${titleCase(canonicalResult)} is already in your discovered words, so it was not spawned.`;
  } else {
    status = getMixOutcomeMessage(word, word, canonicalResult, "add", isInEncyclopedia, wasDiscovered, {
      newNegativeMixTokens,
      newBanWordTokens,
      newWildcardTokens,
      newPositionTokenRewards,
      newZonesUnlocked,
      completedCategories,
      questResult,
      usedShift: selection.usedShift,
      refundedTagCount: selection.refundedTagCount,
    });
    if (!state.spawnExistingWords && status.stateName === "ok") {
      status.stateName = "success";
    }
  }
  setStatus(vocabularyOverflow?.message || status.message, vocabularyOverflow?.stateName || status.stateName);
}

async function handleMix(firstTile, secondTile, clientPoint = null) {
  let mix;
  try {
    mix = await getAssociation(firstTile.word, secondTile.word, "add");
  } catch (error) {
    if (handleDeadEndMixError(error, [
      { word: firstTile.word, wordKey: getWordKey(firstTile.word), tileId: firstTile.id },
      { word: secondTile.word, wordKey: getWordKey(secondTile.word), tileId: secondTile.id },
    ])) {
      return;
    }
    throw error;
  }
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
    newWildcardTokens,
    newPositionTokenRewards,
    newZonesUnlocked,
    completedCategories,
    questResult,
    vocabularyOverflow,
  } = rememberResult(selectedCandidate.word, selectedCandidate.normalized);
  if (firstTile.word.toLowerCase() === secondTile.word.toLowerCase()) {
    markWordAsSelfMatched(firstTile.word);
  }
  recordMatch(firstTile.word, secondTile.word, canonicalResult, "add", selection.candidates, selectedCandidate.word);
  const shouldBlockSpawn = !state.spawnExistingWords && wasDiscovered;
  if (shouldBlockSpawn) {
    showFloatingWordNotice("❌", "error", clientPoint);
  } else {
    spawnResultTile(canonicalResult, firstTile, secondTile);
    if (!state.spawnExistingWords) {
      showFloatingWordNotice("💡", "success", clientPoint);
    }
  }
  let status;
  if (shouldBlockSpawn) {
    status = getMixOutcomeMessage(
      firstTile.word,
      secondTile.word,
      canonicalResult,
      "add",
      isInEncyclopedia,
      wasDiscovered,
      {
        newNegativeMixTokens,
        newBanWordTokens,
        newWildcardTokens,
        newPositionTokenRewards,
        newZonesUnlocked,
        completedCategories,
        questResult,
        usedShift: selection.usedShift,
        refundedTagCount: selection.refundedTagCount,
      },
    );
    status.message = `${status.message} ${titleCase(canonicalResult)} is already in your discovered words, so it was not spawned.`;
  } else {
    status = getMixOutcomeMessage(
      firstTile.word,
      secondTile.word,
      canonicalResult,
      "add",
      isInEncyclopedia,
      wasDiscovered,
      {
        newNegativeMixTokens,
        newBanWordTokens,
        newWildcardTokens,
        newPositionTokenRewards,
        newZonesUnlocked,
        completedCategories,
        questResult,
        usedShift: selection.usedShift,
        refundedTagCount: selection.refundedTagCount,
      },
    );
    if (!state.spawnExistingWords && status.stateName === "ok") {
      status.stateName = "success";
    }
  }
  setStatus(vocabularyOverflow?.message || status.message, vocabularyOverflow?.stateName || status.stateName);
}

function rememberResult(result, normalized = result) {
  const previousAvailableCount = getAvailableWordEntries().length;
  const previousUnlockedZones = getUnlockedPlayfieldZoneCount();
  const canonicalResult = getCanonicalWord(result, normalized);
  const encyclopediaEntry = getEncyclopediaEntry(canonicalResult, normalized);
  const isInEncyclopedia = Boolean(encyclopediaEntry);
  const discoveryKey = encyclopediaEntry?.word ?? normalized;
  const existing = state.discovered.get(discoveryKey) ?? state.discovered.get(normalized);
  const wasDiscovered = Boolean(existing);
  const canonicalIsStarter = state.starters.includes(canonicalResult);
  let didDiscoverNewWord = false;
  let newNegativeMixTokensFromCompletion = 0;
  let newBanWordTokens = 0;
  let newWildcardTokens = 0;
  const newPositionTokenRewards = createEmptyPositionTokenRewardSummary();
  let completedCategories = [];
  let questResult = null;

  if (!existing && !canonicalIsStarter) {
    state.discovered.set(discoveryKey, canonicalResult);
    trackDiscoveredWord(discoveryKey);
    didDiscoverNewWord = true;
  } else if (existing && existing !== canonicalResult && isPreferredDiscoveredVariant(canonicalResult, existing)) {
    state.discovered.set(discoveryKey, canonicalResult);
  }

  if (discoveryKey !== normalized && state.discovered.has(normalized)) {
    replaceTrackedDiscoveredWordKey(normalized, discoveryKey);
    state.discovered.delete(normalized);
  }

  const unlockedNegativeMixTokenCount = getUnlockedNegativeMixTokenCount();
  const newNegativeMixTokens = Math.max(0, unlockedNegativeMixTokenCount - state.progressNegativeMixTokensAwarded);
  if (newNegativeMixTokens > 0) {
    state.progressNegativeMixTokensAwarded = unlockedNegativeMixTokenCount;
    state.availableNegativeMixTokens += newNegativeMixTokens;
    state.totalNegativeMixTokensEarned += newNegativeMixTokens;
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

    const completionRewards = rewardCompletedEncyclopediaCategories();
    completedCategories = completionRewards.completedCategories;
    newNegativeMixTokensFromCompletion += completionRewards.newNegativeMixTokens;
    newBanWordTokens += completionRewards.newBanWordTokens;
    newPositionTokenRewards[2] += completionRewards.newSecondResultTokens;
  }

  if (didDiscoverNewWord) {
    const randomDiscoveryReward = awardRandomDiscoveryToken();
    newWildcardTokens += randomDiscoveryReward.newWildcardTokens;
    POSITION_TOKEN_RANKS.forEach((rank) => {
      newPositionTokenRewards[rank] += getSafeCount(randomDiscoveryReward.newPositionTokenRewards?.[rank]);
    });
  }

  questResult = advanceQuest(canonicalResult, { didDiscoverNewWord });
  newNegativeMixTokensFromCompletion += questResult.newNegativeMixTokens;
  newBanWordTokens += questResult.newBanWordTokens;
  newWildcardTokens += questResult.newWildcardTokens;
  mergePositionTokenRewardSummary(newPositionTokenRewards, questResult.newPositionTokenRewards);

  const unlockedSecondResultTokenCount = getUnlockedSecondResultTokenCount();
  const guaranteedSecondResultTokens = Math.max(
    0,
    unlockedSecondResultTokenCount - state.progressSecondResultTokensAwarded,
  );
  if (guaranteedSecondResultTokens > 0) {
    state.progressSecondResultTokensAwarded = unlockedSecondResultTokenCount;
    addPositionTokens(2, guaranteedSecondResultTokens);
    state.unseenTokenRewards += guaranteedSecondResultTokens;
    newPositionTokenRewards[2] += guaranteedSecondResultTokens;
  }

  const totalNewNegativeMixTokens = newNegativeMixTokens + newNegativeMixTokensFromCompletion;
  const newZonesUnlocked = Math.max(0, getUnlockedPlayfieldZoneCount() - previousUnlockedZones);
  const totalNewPositionTokens = getPositionTokenRewardCount(newPositionTokenRewards);

  if (totalNewNegativeMixTokens > 0 || newBanWordTokens > 0 || newWildcardTokens > 0 || totalNewPositionTokens > 0) {
    if (state.activeSidebarTab === "tokens") {
      state.unseenTokenRewards = 0;
    }
  }

  const vocabularyOverflow = didDiscoverNewWord
    ? handleAvailableWordOverflow(previousAvailableCount, getAvailableWordEntries().length)
    : null;

  if (didDiscoverNewWord || totalNewNegativeMixTokens > 0 || newBanWordTokens > 0 || newWildcardTokens > 0 || totalNewPositionTokens > 0 || vocabularyOverflow) {
    renderSidebar();
  }

  return {
    canonicalResult,
    isInEncyclopedia,
    wasDiscovered,
    newNegativeMixTokens: totalNewNegativeMixTokens,
    newBanWordTokens,
    newWildcardTokens,
    newPositionTokenRewards,
    newZonesUnlocked,
    completedCategories,
    questResult,
    vocabularyOverflow,
  };
}

async function runNegativeMix(clientPoint = null) {
  if (!(state.negativeMix.a && state.negativeMix.b)) {
    setStatus("Negative mixing needs both A and B.", "error");
    return;
  }

  let mix;
  try {
    mix = await getAssociation(state.negativeMix.a, state.negativeMix.b, "subtract");
  } catch (error) {
    if (handleDeadEndMixError(error, [
      {
        word: state.negativeMix.a,
        wordKey: getWordKey(state.negativeMix.a),
        tileId: state.negativeMixSources.a,
      },
      {
        word: state.negativeMix.b,
        wordKey: getWordKey(state.negativeMix.b),
        tileId: state.negativeMixSources.b,
      },
    ])) {
      return;
    }
    throw error;
  }
  const selection = resolveCandidateSelection(mix.candidates, [
    state.negativeMixSources.a,
    state.negativeMixSources.b,
  ].filter(Boolean));
  if (!selection.candidate) {
    throw new Error(selection.error || "No valid result remained for that mix.");
  }
  setLastMix(`${titleCase(state.negativeMix.a)} - ${titleCase(state.negativeMix.b)}`, "subtract", selection.candidates);
  const selectedCandidate = selection.candidate;
  const existingAvailableResult = getAvailableEntryForWord(selectedCandidate.word, selectedCandidate.normalized);
  const {
    canonicalResult,
    isInEncyclopedia,
    wasDiscovered,
    newNegativeMixTokens,
    newBanWordTokens,
    newWildcardTokens,
    newPositionTokenRewards,
    newZonesUnlocked,
    completedCategories,
    questResult,
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
  const shouldBlockSpawn = !state.spawnExistingWords && wasDiscovered;
  if (shouldBlockSpawn) {
    showFloatingWordNotice("❌", "error", clientPoint);
  } else {
    spawnWordOnField(canonicalResult, getNegativeMixResultSpawnPosition());
    if (!state.spawnExistingWords) {
      showFloatingWordNotice("💡", "success", clientPoint);
    }
  }
  let status;
  if (shouldBlockSpawn) {
    status = getMixOutcomeMessage(
      state.negativeMix.a,
      state.negativeMix.b,
      canonicalResult,
      "subtract",
      isInEncyclopedia,
      wasDiscovered,
      {
        newNegativeMixTokens,
        newBanWordTokens,
        newWildcardTokens,
        newPositionTokenRewards,
        newZonesUnlocked,
        completedCategories,
        questResult,
        usedShift: selection.usedShift,
        refundedTagCount: selection.refundedTagCount,
      },
    );
    status.message = `${status.message} ${titleCase(canonicalResult)} is already in your discovered words, so it was not spawned.`;
  } else {
    status = getMixOutcomeMessage(
      state.negativeMix.a,
      state.negativeMix.b,
      canonicalResult,
      "subtract",
      isInEncyclopedia,
      wasDiscovered,
      {
        newNegativeMixTokens,
        newBanWordTokens,
        newWildcardTokens,
        newPositionTokenRewards,
        newZonesUnlocked,
        completedCategories,
        questResult,
        usedShift: selection.usedShift,
        refundedTagCount: selection.refundedTagCount,
      },
    );
    if (!state.spawnExistingWords && status.stateName === "ok") {
      status.stateName = "success";
    }
  }
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
  if (Number.isFinite(tileId)) {
    removeTile(tileId);
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
  const elements = typeof document.elementsFromPoint === "function"
    ? document.elementsFromPoint(clientX, clientY)
    : [document.elementFromPoint(clientX, clientY)].filter(Boolean);
  return elements.find((element) => element.matches?.("[data-negative-slot]")) || null;
}

function getGarbageBinAtPoint(clientX, clientY) {
  if (!isGarbageBinUnlocked()) {
    return null;
  }
  const elements = typeof document.elementsFromPoint === "function"
    ? document.elementsFromPoint(clientX, clientY)
    : [document.elementFromPoint(clientX, clientY)].filter(Boolean);
  return elements.find((element) => element.matches?.("[data-garbage-bin]")) || null;
}

function startNegativeMixDrag(event) {
  if (event.button !== 0) {
    return;
  }
  if (event.target.closest("button")) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const panelRect = els.negativePanel.getBoundingClientRect();
  const pointerOffsetX = (event.clientX - panelRect.left) / state.playfieldZoom;
  const pointerOffsetY = (event.clientY - panelRect.top) / state.playfieldZoom;
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
      els.negativePanel.dataset.dragging = "true";
    }

    const localPoint = getPlayfieldPointFromClientPoint(moveEvent.clientX, moveEvent.clientY);
    state.negativeMixPosition = clampNegativeMixPosition({
      x: localPoint.x - pointerOffsetX,
      y: localPoint.y - pointerOffsetY,
    });
    els.negativePanel.style.left = `${state.negativeMixPosition.x}px`;
    els.negativePanel.style.top = `${state.negativeMixPosition.y}px`;
  };

  const end = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
    delete els.negativePanel.dataset.dragging;

    if (dragStarted) {
      state.negativeMixPosition = clampNegativeMixPosition(state.negativeMixPosition);
      renderNegativeMix();
      queueProgressSave();
    }
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end, { once: true });
}

function startPlayfieldPan(event) {
  if (event.button !== 0) {
    return;
  }
  if (event.target.closest(".tile, .negative-mix-panel")) {
    return;
  }

  const startClientX = event.clientX;
  const startClientY = event.clientY;
  const startCamera = { ...state.playfieldCamera };
  let panStarted = false;

  const move = (moveEvent) => {
    const deltaX = moveEvent.clientX - startClientX;
    const deltaY = moveEvent.clientY - startClientY;
    const distance = Math.hypot(deltaX, deltaY);

    if (!panStarted) {
      if (distance < DRAG_THRESHOLD) {
        return;
      }
      panStarted = true;
      els.playfield.dataset.panning = "true";
    }

    state.playfieldCamera = clampPlayfieldCamera({
      x: startCamera.x - (deltaX / state.playfieldZoom),
      y: startCamera.y - (deltaY / state.playfieldZoom),
    });
    updatePlayfieldCamera();
  };

  const end = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
    delete els.playfield.dataset.panning;

    if (panStarted) {
      renderTiles();
      queueProgressSave();
    }
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end, { once: true });
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
  event.stopPropagation();

  const tileElement = event.currentTarget;
  tileElement.style.zIndex = String(DRAGGING_TILE_Z_INDEX);
  const tileRect = tileElement.getBoundingClientRect();
  const pointerOffsetX = (event.clientX - tileRect.left) / state.playfieldZoom;
  const pointerOffsetY = (event.clientY - tileRect.top) / state.playfieldZoom;
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
      tileElement.style.zIndex = String(DRAGGING_TILE_Z_INDEX);
    }

    const bounds = getPlayfieldBounds();
    const localPoint = getPlayfieldPointFromClientPoint(moveEvent.clientX, moveEvent.clientY, bounds);
    tile.x = clamp(localPoint.x - pointerOffsetX, bounds.minX, bounds.maxX);
    tile.y = clamp(localPoint.y - pointerOffsetY, bounds.minY, bounds.maxY);
    tileElement.style.left = `${tile.x}px`;
    tileElement.style.top = `${tile.y}px`;
  };

  const end = async (endEvent) => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
    tileElement.classList.remove("dragging");

    if (!dragStarted) {
      tileElement.style.zIndex = String(Math.min(tile.zIndex, NEGATIVE_MIX_Z_INDEX - 1));
      try {
        const bounds = getPlayfieldBounds();
        await handleTileClick(tile.word, {
          x: clamp(tile.x + 28, bounds.minX, bounds.maxX),
          y: clamp(tile.y + 28, bounds.minY, bounds.maxY),
        }, tile.id, {
          x: endEvent.clientX,
          y: endEvent.clientY,
        });
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
  els.playfieldSurface.querySelectorAll(".tile").forEach((tile) => tile.remove());
  els.emptyMessage.hidden = state.tiles.length > 0;
  updatePlayfieldCamera();

  [...state.tiles]
    .sort((a, b) => a.zIndex - b.zIndex)
    .forEach((tile) => {
      const tileElement = document.createElement("div");
      tileElement.className = "tile";
      tileElement.dataset.kind = "discovered";
      tileElement.dataset.tileId = String(tile.id);
      tileElement.dataset.tagged = getTileTagRank(tile) >= 2 ? "true" : "false";
      tileElement.style.left = `${tile.x}px`;
      tileElement.style.top = `${tile.y}px`;
      tileElement.style.zIndex = String(Math.min(tile.zIndex, NEGATIVE_MIX_Z_INDEX - 1));
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
        const resultRank = getPositionTokenRankFromDragType(tokenType);
        if (resultRank >= 2) {
          tagTileWithResultToken(tile.id, resultRank);
          return;
        }
        if (tokenType === "ban-word") {
          banTileWordFromResults(tile.id);
          return;
        }
        if (tokenType === "wildcard") {
          setStatus("Drop a Wildcard token onto the field, not onto a word.", "error");
          return;
        }
        if (tokenType === "minus-mix") {
          activateNegativeMixToken({
            x: tile.x + (TILE_WIDTH / 2),
            y: tile.y + (TILE_HEIGHT / 2),
          });
        }
      });
      tileElement.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        const refundedTagCount = removeTile(tile.id);
        const refundMessage = refundedTagCount > 0
          ? getTaggedTokenRefundMessage(refundedTagCount)
          : "";
        setStatus(`${titleCase(tile.word)} was removed from the field.${refundMessage}`);
      });

      const wordElement = document.createElement("div");
      wordElement.className = "tile-word";
      wordElement.textContent = titleCase(tile.word);

      const tagElement = document.createElement("div");
      tagElement.className = "tile-tag";
      tagElement.textContent = getPositionTokenShortLabel(getTileTagRank(tile));
      tagElement.hidden = getTileTagRank(tile) < 2;

      const metaElement = document.createElement("div");
      metaElement.className = "tile-meta";
      const categoryName = getVisibleCategoryNameForWord(tile.word);
      metaElement.textContent = categoryName;
      metaElement.hidden = !categoryName;

      tileElement.append(tagElement, wordElement, metaElement);
      els.playfieldSurface.append(tileElement);
    });
}

function clearField() {
  const refundedTagCount = releaseTaggedResultTokens(state.tiles.map((tile) => tile.id), { refund: true });
  state.tiles = [];
  clearNegativeMix();
  renderTiles();
  queueProgressSave();
  const refundMessage = getTaggedTokenRefundMessage(refundedTagCount);
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
  renderSettings();
  els.settingsModal.hidden = false;
}

function closeSettings() {
  els.settingsModal.hidden = true;
}

function renderSettings() {
  els.spawnExistingWordsToggle.checked = state.spawnExistingWords;
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
  state.spawnExistingWords = false;
  state.tiles = [];
  state.search = "";
  state.removedResultWords = new Set();
  state.negativeMix.a = null;
  state.negativeMix.b = null;
  state.negativeMixSources.a = null;
  state.negativeMixSources.b = null;
  state.negativeMixPosition = { x: 24, y: 24 };
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
  state.recentDiscoveredWordKeys = [];
  state.googlePickMode = false;
  state.clickTracker.word = null;
  state.clickTracker.time = 0;
  state.availableNegativeMixTokens = 0;
  state.totalNegativeMixTokensEarned = 0;
  state.progressNegativeMixTokensAwarded = 0;
  state.availableBanWordTokens = 0;
  state.totalBanWordTokensEarned = 0;
  state.availableWildcardTokens = 0;
  state.totalWildcardTokensEarned = 0;
  state.availableSecondResultTokens = 0;
  state.totalSecondResultTokensEarned = 0;
  state.availableThirdResultTokens = 0;
  state.totalThirdResultTokensEarned = 0;
  state.availableFourthResultTokens = 0;
  state.totalFourthResultTokensEarned = 0;
  state.availableFifthResultTokens = 0;
  state.totalFifthResultTokensEarned = 0;
  state.progressSecondResultTokensAwarded = 0;
  state.completedEncyclopediaCategories = new Set();
  state.hiddenWordPanelWords = new Set();
  state.garbageWordsSinceReward = 0;
  state.garbageRewardLevel = 0;
  state.hasActiveNegativeMixToken = false;
  state.activeSidebarTab = "words";
  state.unseenTokenRewards = 0;
  state.playfieldZoom = 1;
  state.playfieldCamera = getDefaultPlayfieldCamera(1);
  assignNewQuest({ initial: true });
  state.nextTileId = 1;
  state.nextZIndex = 1;
  els.wordSearch.value = "";

  updatePlayfieldCamera();
  renderSidebar();
  renderTiles();
  renderNegativeMix();
  renderHistory();
  renderSettings();
  clearFloatingWordNotice();

  const bounds = getPlayfieldBounds();
  const centerX = Math.round((bounds.worldWidth / 2) - (TILE_WIDTH / 2));
  const centerY = Math.round((bounds.worldHeight / 2) - (TILE_HEIGHT / 2));
  const starterOffsets = [-120, 120];
  state.starters.forEach((word, index) => {
    const offset = starterOffsets[index] ?? ((index - 1) * 180);
    spawnWordOnField(word, {
      x: clamp(centerX + offset, bounds.minX, bounds.maxX),
      y: clamp(centerY, bounds.minY, bounds.maxY),
    });
  });
  queueProgressSave();

  const starterNames = state.starters.map((word) => titleCase(word));
  const starterSummary = starterNames.length > 1
    ? `${starterNames.slice(0, -1).join(", ")}, and ${starterNames.at(-1)}`
    : starterNames[0];
  setStatus(
    `New game started with ${starterSummary}. Your first quest is ${titleCase(state.quest.targetWord)} and you have ${state.quest.remainingDiscoveries} discoveries to find it.`,
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
      const point = getPlayfieldPointFromClientPoint(event.clientX, event.clientY);
      activateNegativeMixToken(point);
      return;
    }
    if (tokenType === "ban-word") {
      setStatus("Drop a Ban Word token onto a word on the field.", "error");
      return;
    }
    const bounds = getPlayfieldBounds();
    const point = getPlayfieldPointFromClientPoint(event.clientX, event.clientY, bounds);
    const x = clamp(point.x - (TILE_WIDTH / 2), bounds.minX, bounds.maxX);
    const y = clamp(point.y - (TILE_HEIGHT / 2), bounds.minY, bounds.maxY);
    if (tokenType === "wildcard") {
      useWildcardToken({ x, y });
      return;
    }
    const resultRank = getPositionTokenRankFromDragType(tokenType);
    if (resultRank >= 2) {
      setStatus(`Drop a ${getPositionTokenDisplayName(resultRank)} token onto a word on the field.`, "error");
      return;
    }

    const word = event.dataTransfer.getData("text/plain");
    if (!word) {
      return;
    }

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
  els.negativePanel.addEventListener("pointerdown", startNegativeMixDrag);
  els.negativePanel.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    refundNegativeMixToken();
  });
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
  els.zoomOutButton.addEventListener("click", () => {
    adjustPlayfieldZoom(-PLAYFIELD_ZOOM_STEP);
  });
  els.zoomInButton.addEventListener("click", () => {
    adjustPlayfieldZoom(PLAYFIELD_ZOOM_STEP);
  });
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
  els.runNegativeButton.addEventListener("click", async (event) => {
    try {
      await runNegativeMix({
        x: event.clientX,
        y: event.clientY,
      });
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
  els.questTryAgainButton.addEventListener("click", resetRun);
  els.spawnExistingWordsToggle.addEventListener("change", () => {
    state.spawnExistingWords = els.spawnExistingWordsToggle.checked;
    queueProgressSave();
    setStatus(
      state.spawnExistingWords
        ? "Spawn existing words is on."
        : "Spawn existing words is off. Matches will skip words already in Available Words.",
      "ok",
    );
  });
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

  els.playfield.addEventListener("wheel", (event) => {
    event.preventDefault();
    const direction = event.deltaY > 0 ? -1 : 1;
    adjustPlayfieldZoom(direction * PLAYFIELD_ZOOM_STEP);
  }, { passive: false });
  els.playfield.addEventListener("pointerdown", startPlayfieldPan);

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
    clampTilesToPlayfieldBounds();
    updatePlayfieldCamera();
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
