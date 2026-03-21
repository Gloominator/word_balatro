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
    words: ["wave", "nod", "clap", "bow", "wink"],
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
/** Visual tilt for "tossed" word cards on the field (degrees). */
const TILE_TILT_MIN = -5.5;
const TILE_TILT_MAX = 5.5;
/** Pointer-drop: chance to nudge tilt slightly (short "fall"). */
const TILE_DROP_TILT_NUDGE_CHANCE = 0.3;
/** Max degrees added to current tilt on drop (symmetric small bump). */
const TILE_DROP_TILT_NUDGE_MAX = 1.35;
const tileIdsNeedingPaperSettle = new Set();
const NEGATIVE_MIX_WIDTH = 168;
const NEGATIVE_MIX_HEIGHT = 132;
const NEGATIVE_MIX_Z_INDEX = 5000;
const DRAGGING_TILE_Z_INDEX = 6000;
const DRAG_THRESHOLD = 6;
const DOUBLE_CLICK_MS = 320;
const FLOATING_MATCH_PREVIEW_WIDTH = 190;
const FLOATING_MATCH_PREVIEW_HEIGHT = 152;
const QUEST_COMPLETION_NOTICE_MS = 3600;
const QUEST_COMPLETION_FIREWORK_BURSTS = 5;
const QUEST_COMPLETION_FIREWORK_PARTICLES = 12;
const QUEST_COMPLETION_FIREWORK_COLORS = [
  "#ffd86b",
  "#9af0ad",
  "#7aa4ff",
  "#f5a6ff",
  "#ff9cab",
];
const DEFAULT_CATEGORY_ID = "uncategorized";
const DEFAULT_CATEGORY_ZONE_RADIUS = TILE_WIDTH * 2;
const CATEGORY_ZONE_MIN_RADIUS = 48;
const CATEGORY_ZONE_MAX_RADIUS = 720;
const CATEGORY_ZONE_DEFAULT_COLOR = "#c62828";
const CATEGORY_ZONE_DEFAULT_OPACITY = 0.22;
const CATEGORY_ZONE_WIDGET_BASE_Z = 50;
const MATCH_HISTORY_LIMIT = 100;
const NEGATIVE_MIX_FIRST_UNLOCK_WORDS = 5;
const WORDS_PER_NEGATIVE_MIX_TOKEN = 15;
const SECOND_RESULT_FIRST_UNLOCK_WORDS = 10;
const GARBAGE_BIN_UNLOCK_WORDS = 20;
const GARBAGE_WORDS_PER_TOKEN_BASE = 15;
const RECENT_DISCOVERED_WORD_LIMIT = 25;
const PLAYFIELD_BASE_WORLD_SCALE = 2.2;
const PLAYFIELD_ZONE_SCALE_STEP = 1.1;
const PLAYFIELD_ZOOM_STEP = 0.12;
const MIN_PLAYFIELD_ZOOM = 0.02;
const MAX_PLAYFIELD_ZOOM = 1;
/** Each expand tier (2 and 3) multiplies world scale by this factor after pan/zoom is unlocked. */
const PLAYFIELD_EXPAND_MULTIPLIER = 1.5;
const SHOP_PLAYFIELD_PAN_ZOOM_COST = 450;
const SHOP_PLAYFIELD_EXPAND_COST = 600;
const SHOP_PLAYFIELD_EXPAND_2_COST = 2000;
const STORAGE_KEY = "wordmath-progress-v1";
const DISCOVERY_COIN_BASE_REWARD = 1;
const DISCOVERY_RARITY_MIN_ZIPF = 2;
const DISCOVERY_RARITY_MAX_ZIPF = 6;
const DISCOVERY_TOKEN_DROP_CHANCE = 0.1;
const RANDOM_DISCOVERY_TOKEN_POOL = Object.freeze([3, 4, 5]);
const QUEST_INITIAL_DISCOVERY_TIMER = 60;
const QUEST_COMPLETION_COIN_REWARD = 500;
const QUEST_COMPLETION_REWARD_COUNT = 5;
const QUEST_SPEED_BONUS_TIERS = Object.freeze([
  { maxTurns: 10, coins: 500 },
  { maxTurns: 20, coins: 300 },
  { maxTurns: 30, coins: 100 },
]);
const QUEST_REWARD_TOKEN_POOL = Object.freeze(["minus-mix", "ban-word", 2, 3, 4, 5]);
const POSITION_TOKEN_RANKS = [2, 3, 4, 5];
const POSITION_TOKEN_CONFIG = Object.freeze({
  2: { title: "Second Result", shortLabel: "2nd" },
  3: { title: "Third Result", shortLabel: "3rd" },
  4: { title: "Fourth Result", shortLabel: "4th" },
  5: { title: "Fifth Result", shortLabel: "5th" },
});
const SHOP_WORD_BOOSTER_COST = 70;
const SHOP_WORD_BOOSTER_ROLL_COUNT = 10;
const SHOP_WORD_BOOSTER_SOURCE_PATH = "./mostcommonwords.json";
/** Per completed purchase: token-like shop lines cost +10% over the last paid price (integer, rounded up). */
const SHOP_INCREMENTAL_STANDARD_NUM = 110;
const SHOP_INCREMENTAL_STANDARD_DEN = 100;
/** Word Booster paid rolls: +20% over the last paid price (same scaling pattern, steeper step). */
const SHOP_INCREMENTAL_WORD_BOOSTER_NUM = 120;
const SHOP_INCREMENTAL_WORD_BOOSTER_DEN = 100;
const SHOP_ITEM_IDS_INCREMENTAL_PRICE = new Set([
  "shop-word-booster",
  "shop-match-2",
  "shop-match-3",
  "shop-match-4",
  "shop-match-5",
  "shop-ban-word",
  "shop-minus-mix",
  "shop-quest-turn",
]);
const SHOP_ITEM_DEFINITIONS = Object.freeze([
  {
    id: "shop-word-booster",
    title: "Word Booster",
    cost: SHOP_WORD_BOOSTER_COST,
    description: "Roll 10 random words from the common-word list, then pick 1 to discover.",
    canPurchase: () => !state.shopWordBooster.isLoading,
    purchase: async () => {
      if (hasPendingShopWordBooster()) {
        openShopWordBooster();
        return "Reopened your pending Word Booster.";
      }
      state.shopWordBooster.options = await rollShopWordBoosterOptions();
      openShopWordBooster();
      const cost = getShopItemCost(SHOP_ITEM_BY_ID.get("shop-word-booster"));
      return `Bought a Word Booster for ${cost} coins. Pick 1 rolled word to discover it.`;
    },
  },
  {
    id: "shop-match-2",
    title: "Second Result Token",
    cost: 40,
    description: "",
    canPurchase: () => true,
    purchase: () => {
      addPositionTokens(2, 1);
      const cost = getShopItemCost(SHOP_ITEM_BY_ID.get("shop-match-2"));
      return `Bought 1 Second Result token for ${cost} coins.`;
    },
  },
  {
    id: "shop-match-3",
    title: "Third Result Token",
    cost: 50,
    description: "",
    canPurchase: () => true,
    purchase: () => {
      addPositionTokens(3, 1);
      const cost = getShopItemCost(SHOP_ITEM_BY_ID.get("shop-match-3"));
      return `Bought 1 Third Result token for ${cost} coins.`;
    },
  },
  {
    id: "shop-match-4",
    title: "Fourth Result Token",
    cost: 60,
    description: "",
    canPurchase: () => true,
    purchase: () => {
      addPositionTokens(4, 1);
      const cost = getShopItemCost(SHOP_ITEM_BY_ID.get("shop-match-4"));
      return `Bought 1 Fourth Result token for ${cost} coins.`;
    },
  },
  {
    id: "shop-match-5",
    title: "Fifth Result Token",
    cost: 70,
    description: "",
    canPurchase: () => true,
    purchase: () => {
      addPositionTokens(5, 1);
      const cost = getShopItemCost(SHOP_ITEM_BY_ID.get("shop-match-5"));
      return `Bought 1 Fifth Result token for ${cost} coins.`;
    },
  },
  {
    id: "shop-ban-word",
    title: "Ban Word Token",
    cost: 80,
    description: "",
    canPurchase: () => true,
    purchase: () => {
      state.availableBanWordTokens += 1;
      state.totalBanWordTokensEarned += 1;
      const cost = getShopItemCost(SHOP_ITEM_BY_ID.get("shop-ban-word"));
      return `Bought 1 Ban Word token for ${cost} coins.`;
    },
  },
  {
    id: "shop-minus-mix",
    title: "Minus Mix Token",
    cost: 50,
    description: "",
    canPurchase: () => true,
    purchase: () => {
      state.availableNegativeMixTokens += 1;
      state.totalNegativeMixTokensEarned += 1;
      const cost = getShopItemCost(SHOP_ITEM_BY_ID.get("shop-minus-mix"));
      return `Bought 1 Minus Mix token for ${cost} coins.`;
    },
  },
  {
    id: "shop-playfield-pan-zoom",
    title: "Field Pan & Zoom",
    cost: SHOP_PLAYFIELD_PAN_ZOOM_COST,
    description: "Unlock dragging the view and zooming on the full mixing field. Further size comes from Expand purchases in the Shop.",
    canPurchase: () => getPlayfieldUpgradeTier() < 1,
    purchase: () => {
      state.purchasedUpgrades.playfieldTier = 1;
      return "Unlocked pan and zoom on the mixing field.";
    },
  },
  {
    id: "shop-playfield-expand",
    title: "Expand Mixing Field +50%",
    cost: SHOP_PLAYFIELD_EXPAND_COST,
    description: "Increase playfield size by 50% (requires Field Pan & Zoom).",
    canPurchase: () => getPlayfieldUpgradeTier() === 1,
    purchase: () => {
      state.purchasedUpgrades.playfieldTier = 2;
      return "Mixing field expanded by +50%.";
    },
  },
  {
    id: "shop-playfield-expand-2",
    title: "Expand Mixing Field +50% (again)",
    cost: SHOP_PLAYFIELD_EXPAND_2_COST,
    description: "Grow the playfield by another 50% (after the first expansion).",
    canPurchase: () => getPlayfieldUpgradeTier() === 2,
    purchase: () => {
      state.purchasedUpgrades.playfieldTier = 3;
      return "Mixing field expanded by another +50%.";
    },
  },
  {
    id: "shop-quest-turn",
    title: "Quest Turn +1",
    cost: 100,
    description: "Add 1 turn before you lose the current active quest.",
    canPurchase: () => Boolean(state.quest.targetWord) && !state.quest.isLost,
    purchase: () => {
      state.quest.remainingDiscoveries += 1;
      const cost = getShopItemCost(SHOP_ITEM_BY_ID.get("shop-quest-turn"));
      return `Paid ${cost} coins. Added 1 turn to the active quest. You now lose in ${state.quest.remainingDiscoveries} turns.`;
    },
  },
]);

const SHOP_ITEM_BY_ID = new Map(SHOP_ITEM_DEFINITIONS.map((entry) => [entry.id, entry]));

/** Token purchases only (Purchase Tokens dropdown). Word Booster is the top bar button. */
const SHOP_ITEM_IDS_PURCHASE_TOKENS_MENU = new Set([
  "shop-match-2",
  "shop-match-3",
  "shop-match-4",
  "shop-match-5",
  "shop-ban-word",
  "shop-minus-mix",
]);

/** Cap / quest upgrades stay in the sidebar Shop tab. */
const SHOP_ITEM_IDS_SIDEBAR_SHOP = new Set([
  "shop-playfield-pan-zoom",
  "shop-playfield-expand",
  "shop-playfield-expand-2",
  "shop-quest-turn",
]);

const SHOP_ITEM_IDS_PLAYFIELD_EXPAND_HIDDEN_UNTIL_PAN_ZOOM = new Set([
  "shop-playfield-expand",
  "shop-playfield-expand-2",
]);

function isSidebarShopUpgradeVisible(item) {
  if (SHOP_ITEM_IDS_PLAYFIELD_EXPAND_HIDDEN_UNTIL_PAN_ZOOM.has(item.id)) {
    return getPlayfieldUpgradeTier() >= 1;
  }
  return true;
}

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
  categoryZones: [],
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
  coins: 0,
  totalCoinsEarned: 0,
  purchasedUpgrades: createDefaultPurchasedUpgradeState(),
  shopPurchaseCounts: {},
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
    number: 1,
    targetWord: null,
    remainingDiscoveries: 0,
    turnsTaken: 0,
    isLost: false,
    isWon: false,
  },
  shopWordBooster: {
    isOpen: false,
    isLoading: false,
    options: [],
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
  shopWordBoosterModal: document.querySelector("[data-shop-word-booster-modal]"),
  shopWordBoosterGrid: document.querySelector("[data-shop-word-booster-grid]"),
  closeShopWordBoosterButton: document.querySelector("[data-action='close-shop-word-booster']"),
  resetButton: document.querySelector("[data-action='reset']"),
  clearFieldButton: document.querySelector("[data-action='clear-field']"),
  clearNegativeButton: document.querySelector("[data-action='clear-negative']"),
  runNegativeButton: document.querySelector("[data-action='run-negative']"),
  addCategoryButton: document.querySelector("[data-action='add-category']"),
  categoryZoneStyleModal: document.querySelector("[data-category-zone-style-modal]"),
  categoryZoneStyleTitle: document.querySelector("[data-category-zone-style-title]"),
  categoryZoneWheel: document.querySelector("[data-category-zone-wheel]"),
  categoryZoneValueSlider: document.querySelector("[data-category-zone-value-slider]"),
  categoryZoneOpacitySlider: document.querySelector("[data-category-zone-opacity-slider]"),
  categoryZoneRadiusSlider: document.querySelector("[data-category-zone-radius-slider]"),
  categoryZonePreview: document.querySelector("[data-category-zone-preview]"),
  closeCategoryZoneStyleButton: document.querySelector("[data-action='close-category-zone-style']"),
  saveCategoryZoneStyleButton: document.querySelector("[data-action='save-category-zone-style']"),
  toggleGooglePickButton: document.querySelector("[data-action='toggle-google-pick']"),
  sidebarTitle: document.querySelector("[data-sidebar-title]"),
  openWordTabButton: document.querySelector("[data-action='open-word-tab']"),
  openUpgradesTabButton: document.querySelector("[data-action='open-upgrades-tab']"),
  topbarCoinCount: document.querySelector("[data-topbar-coin-count]"),
  tokenDock: document.querySelector("[data-token-dock]"),
  tokenDockOuter: document.querySelector("[data-token-dock-outer]"),
  upgradeCount: document.querySelector("[data-upgrade-count]"),
  upgradeCoinCount: document.querySelector("[data-upgrade-coin-count]"),
  upgradeList: document.querySelector("[data-upgrade-list]"),
  sidebarPanels: document.querySelectorAll("[data-sidebar-panel]"),
  openHistoryButton: document.querySelector("[data-action='open-history']"),
  closeHistoryButton: document.querySelector("[data-action='close-history']"),
  toggleHistorySortButton: document.querySelector("[data-action='toggle-history-sort']"),
  openEncyclopediaButton: document.querySelector("[data-action='open-encyclopedia']"),
  closeEncyclopediaButton: document.querySelector("[data-action='close-encyclopedia']"),
  openSettingsButton: document.querySelector("[data-action='open-settings']"),
  closeSettingsButton: document.querySelector("[data-action='close-settings']"),
  spawnWordButton: document.querySelector("[data-action='spawn-word']"),
  exportSaveButton: document.querySelector("[data-action='export-save']"),
  importSaveButton: document.querySelector("[data-action='import-save']"),
  settingsModal: document.querySelector("[data-settings-modal]"),
  saveFileInput: document.querySelector("[data-save-file-input]"),
  spawnExistingWordsToggle: document.querySelector("[data-setting='spawn-existing-words']"),
  questStrip: document.querySelector(".quest-strip"),
  questLossModal: document.querySelector("[data-quest-loss-modal]"),
  questLossWord: document.querySelector("[data-quest-loss-word]"),
  questTryAgainButton: document.querySelector("[data-action='quest-try-again']"),
  questWinModal: document.querySelector("[data-quest-win-modal]"),
  questGoAgainButton: document.querySelector("[data-action='quest-go-again']"),
  purchaseTokensRoot: document.querySelector("[data-purchase-tokens-root]"),
  purchaseTokensToggle: document.querySelector("[data-action='toggle-purchase-tokens']"),
  purchaseTokensMenu: document.querySelector("[data-purchase-tokens-menu]"),
  wordBoosterTopButton: document.querySelector("[data-action='buy-word-booster']"),
  wordBoosterCost: document.querySelector("[data-word-booster-cost]"),
};

let pendingProgressSave = null;
let editingCategoryZoneStyleCategoryId = null;
let activeFloatingCandidatePreview = null;
let activeFloatingCandidatePreviewTimeout = null;
let activeFloatingWordNotice = null;
let activeFloatingWordNoticeTimeout = null;
let activeQuestCompletionNotice = null;
let activeQuestCompletionNoticeTimeout = null;
let activeQuestStripCelebrationTimeout = null;
let cachedShopWordBoosterPool = null;
let shopWordBoosterPoolPromise = null;
const associationPreviewCache = new Map();
const dragMixPreviewState = {
  pairKey: null,
  clientPoint: null,
  requestId: 0,
};

function getSafeCount(value, fallback = 0) {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : fallback;
}

function normalizeZipfFrequency(value, fallback = DISCOVERY_RARITY_MAX_ZIPF) {
  return Number.isFinite(value) ? clamp(value, 0, 8) : fallback;
}

function createDefaultPurchasedUpgradeState() {
  return {};
}

function normalizeSavedPurchasedUpgrades(value) {
  return value && typeof value === "object" ? value : createDefaultPurchasedUpgradeState();
}

function getPlayfieldUpgradeTier() {
  return clamp(getSafeCount(state.purchasedUpgrades.playfieldTier, 0), 0, 3);
}

function getMaximumPlayfieldZoom() {
  return getPlayfieldUpgradeTier() < 1 ? 1 : MAX_PLAYFIELD_ZOOM;
}

function normalizeSavedShopPurchaseCounts(value) {
  const out = {};
  if (!value || typeof value !== "object") {
    return out;
  }
  SHOP_ITEM_IDS_INCREMENTAL_PRICE.forEach((id) => {
    const n = getSafeCount(value[id], 0);
    if (n > 0) {
      out[id] = n;
    }
  });
  return out;
}

function getShopPurchaseCount(itemId) {
  return getSafeCount(state.shopPurchaseCounts[itemId], 0);
}

function getIncrementalShopPrice(baseCost, completedPurchases, itemId) {
  const isBooster = itemId === "shop-word-booster";
  const num = isBooster ? SHOP_INCREMENTAL_WORD_BOOSTER_NUM : SHOP_INCREMENTAL_STANDARD_NUM;
  const den = isBooster ? SHOP_INCREMENTAL_WORD_BOOSTER_DEN : SHOP_INCREMENTAL_STANDARD_DEN;
  let price = baseCost;
  for (let i = 0; i < completedPurchases; i += 1) {
    price = Math.ceil((price * num) / den);
  }
  return price;
}

function recordIncrementalShopPurchase(itemId) {
  if (!SHOP_ITEM_IDS_INCREMENTAL_PRICE.has(itemId)) {
    return;
  }
  state.shopPurchaseCounts[itemId] = getShopPurchaseCount(itemId) + 1;
}

function getShopItemCost(item) {
  if (!item) {
    return 0;
  }
  if (SHOP_ITEM_IDS_INCREMENTAL_PRICE.has(item.id)) {
    return getIncrementalShopPrice(item.cost, getShopPurchaseCount(item.id), item.id);
  }
  return item.cost;
}

function getShopItemDescription(item) {
  return item.description;
}

function getAffordableSidebarShopItemCount() {
  return SHOP_ITEM_DEFINITIONS.filter(
    (item) => SHOP_ITEM_IDS_SIDEBAR_SHOP.has(item.id)
      && isSidebarShopUpgradeVisible(item)
      && state.coins >= getShopItemCost(item)
      && item.canPurchase(),
  ).length;
}

function getDiscoveryRarityLabel(zipf) {
  const safeZipf = normalizeZipfFrequency(zipf);
  if (safeZipf >= 6) {
    return "common";
  }
  if (safeZipf >= 5) {
    return "familiar";
  }
  if (safeZipf >= 4) {
    return "uncommon";
  }
  if (safeZipf >= 3) {
    return "rare";
  }
  if (safeZipf >= 2) {
    return "very rare";
  }
  return "extremely rare";
}

function isRareDiscoveryZipf(zipf) {
  return normalizeZipfFrequency(zipf) < 4;
}

function isCommonDiscoveryZipf(zipf) {
  return normalizeZipfFrequency(zipf) >= 6;
}

function getDiscoveryCoinBaseMultiplier(zipf) {
  const safeZipf = clamp(normalizeZipfFrequency(zipf), DISCOVERY_RARITY_MIN_ZIPF, DISCOVERY_RARITY_MAX_ZIPF);
  const progress = (DISCOVERY_RARITY_MAX_ZIPF - safeZipf) / (DISCOVERY_RARITY_MAX_ZIPF - DISCOVERY_RARITY_MIN_ZIPF);
  return 1 + (Math.pow(progress, 2) * 99);
}

function getDiscoveryCoinReward({ zipf, isInEncyclopedia = false } = {}) {
  const safeZipf = normalizeZipfFrequency(zipf);
  const baseMultiplier = getDiscoveryCoinBaseMultiplier(safeZipf);
  let coins = Math.max(1, Math.round(DISCOVERY_COIN_BASE_REWARD * baseMultiplier));

  return {
    coins,
    zipf: safeZipf,
    multiplier: Math.round(baseMultiplier * 10) / 10,
    rarityLabel: getDiscoveryRarityLabel(safeZipf),
  };
}

function awardDiscoveryCoins(options = {}) {
  const reward = getDiscoveryCoinReward(options);
  state.coins += reward.coins;
  state.totalCoinsEarned += reward.coins;
  return reward;
}

function getCoinRewardText(coinReward) {
  if (!coinReward || coinReward.coins <= 0) {
    return "";
  }

  const coinSuffix = coinReward.coins === 1 ? "coin" : "coins";
  return `You earned ${coinReward.coins} ${coinSuffix} for discovering a ${coinReward.rarityLabel} word.`;
}

function getStringList(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

function parseShopWordBoosterEntries(rawText) {
  const seen = new Set();
  return rawText
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(".");
      const rawWord = separatorIndex >= 0 ? line.slice(separatorIndex + 1).trim() : line;
      const normalized = rawWord.toLowerCase();
      if (!normalized || seen.has(normalized)) {
        return null;
      }
      seen.add(normalized);
      return {
        word: normalized,
        normalized,
        zipf: null,
      };
    })
    .filter(Boolean);
}

async function loadShopWordBoosterPool() {
  if (cachedShopWordBoosterPool) {
    return cachedShopWordBoosterPool;
  }
  if (!shopWordBoosterPoolPromise) {
    shopWordBoosterPoolPromise = (async () => {
      const response = await fetch(SHOP_WORD_BOOSTER_SOURCE_PATH);
      if (!response.ok) {
        throw new Error(`Could not load ${SHOP_WORD_BOOSTER_SOURCE_PATH}.`);
      }
      const rawText = await response.text();
      const entries = parseShopWordBoosterEntries(rawText);
      if (!entries.length) {
        throw new Error("The Word Booster list was empty.");
      }
      cachedShopWordBoosterPool = entries;
      return entries;
    })().catch((error) => {
      shopWordBoosterPoolPromise = null;
      throw error;
    });
  }
  return shopWordBoosterPoolPromise;
}

function sampleRandomEntries(entries, count) {
  const pool = [...entries];
  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }
  return pool.slice(0, Math.min(count, pool.length));
}

async function rollShopWordBoosterOptions() {
  const pool = await loadShopWordBoosterPool();
  const unavailableWords = new Set([
    ...state.starters,
    ...state.discovered.keys(),
    ...state.discovered.values(),
  ].map((word) => word.toLowerCase()));
  const undiscoveredPool = pool.filter((entry) => !unavailableWords.has(entry.normalized));
  const candidatePool = undiscoveredPool.length > 0 ? undiscoveredPool : pool;
  const options = sampleRandomEntries(candidatePool, SHOP_WORD_BOOSTER_ROLL_COUNT);
  if (!options.length) {
    throw new Error("No Word Booster choices were available.");
  }
  return options;
}

function hasPendingShopWordBooster() {
  return Array.isArray(state.shopWordBooster.options) && state.shopWordBooster.options.length > 0;
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

function getUndiscoveredEncyclopediaWords() {
  const discoveredWords = getDiscoveredEncyclopediaWords();
  return ENCYCLOPEDIA_WORDS
    .map((entry) => entry.word)
    .filter((word) => !discoveredWords.has(word));
}

function sampleQuestWord(previousWord = null) {
  const undiscoveredWords = getUndiscoveredEncyclopediaWords();
  if (!undiscoveredWords.length) {
    return null;
  }
  const pool = previousWord
    ? undiscoveredWords.filter((word) => word !== previousWord)
    : undiscoveredWords;
  const fallbackPool = pool.length > 0 ? pool : undiscoveredWords;
  return fallbackPool[Math.floor(Math.random() * fallbackPool.length)] ?? null;
}

function setQuestVictoryState({ questNumber = state.quest.number } = {}) {
  state.quest.number = Math.max(1, getSafeCount(questNumber, 1));
  state.quest.targetWord = null;
  state.quest.remainingDiscoveries = 0;
  state.quest.turnsTaken = 0;
  state.quest.isLost = false;
  state.quest.isWon = true;
  return {
    number: state.quest.number,
    targetWord: null,
    remainingDiscoveries: 0,
    turnsTaken: 0,
    isWon: true,
  };
}

function getQuestDiscoveryTimerForQuestNumber(questNumber = state.quest.number) {
  const safeQuestNumber = Math.max(1, getSafeCount(questNumber, 1));
  if (safeQuestNumber === 1) {
    return 40;
  }
  if (safeQuestNumber === 2) {
    return 20;
  }
  return 10;
}

function assignNewQuest({ initial = false, previousTargetWord = null, carryOverTurns = 0 } = {}) {
  state.quest.number = initial ? 1 : Math.max(2, getSafeCount(state.quest.number, 1) + 1);
  state.quest.targetWord = sampleQuestWord(previousTargetWord);
  if (!state.quest.targetWord) {
    return setQuestVictoryState({ questNumber: state.quest.number });
  }
  const baseTurns = getQuestDiscoveryTimerForQuestNumber(state.quest.number);
  state.quest.remainingDiscoveries = baseTurns + getSafeCount(carryOverTurns);
  state.quest.turnsTaken = 0;
  state.quest.isLost = false;
  state.quest.isWon = false;
  return {
    number: state.quest.number,
    targetWord: state.quest.targetWord,
    remainingDiscoveries: state.quest.remainingDiscoveries,
    turnsTaken: state.quest.turnsTaken,
    isWon: false,
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

function getQuestSpeedBonusCoins(turnsTaken = state.quest.turnsTaken) {
  const safeTurnsTaken = Math.max(0, getSafeCount(turnsTaken));
  const matchedTier = QUEST_SPEED_BONUS_TIERS.find((tier) => safeTurnsTaken < tier.maxTurns);
  return matchedTier?.coins ?? 0;
}

function awardQuestCompletionCoins(turnsTaken = state.quest.turnsTaken) {
  const safeTurnsTaken = Math.max(0, getSafeCount(turnsTaken));
  const speedBonusCoins = getQuestSpeedBonusCoins(safeTurnsTaken);
  const totalCoins = QUEST_COMPLETION_COIN_REWARD + speedBonusCoins;
  state.coins += totalCoins;
  state.totalCoinsEarned += totalCoins;
  return {
    baseCoins: QUEST_COMPLETION_COIN_REWARD,
    speedBonusCoins,
    totalCoins,
    turnsTaken: safeTurnsTaken,
  };
}

function advanceQuest(canonicalResult, {
  didDiscoverNewWord = false,
  questMatchedWord = canonicalResult,
  countQuestDiscoveryTurn = true,
} = {}) {
  const questResult = {
    completedQuest: false,
    failedQuest: false,
    completedEncyclopedia: false,
    completedTargetWord: state.quest.targetWord,
    nextTargetWord: state.quest.targetWord,
    remainingDiscoveries: state.quest.remainingDiscoveries,
    newNegativeMixTokens: 0,
    newBanWordTokens: 0,
    newWildcardTokens: 0,
    newPositionTokenRewards: createEmptyPositionTokenRewardSummary(),
    turnsTaken: state.quest.turnsTaken,
    questBaseCoins: 0,
    questSpeedBonusCoins: 0,
    questTotalCoins: 0,
  };
  if (!state.quest.targetWord || state.quest.isLost || state.quest.isWon) {
    return questResult;
  }

  if (didDiscoverNewWord && countQuestDiscoveryTurn) {
    state.quest.remainingDiscoveries = Math.max(0, state.quest.remainingDiscoveries - 1);
    state.quest.turnsTaken += 1;
    questResult.turnsTaken = state.quest.turnsTaken;
  }

  if (questMatchedWord === state.quest.targetWord) {
    const coinReward = awardQuestCompletionCoins(state.quest.turnsTaken);
    const rewardSummary = awardQuestCompletionTokens();
    const completedTargetWord = state.quest.targetWord;
    const carryOverTurns = state.quest.remainingDiscoveries;
    const nextQuest = assignNewQuest({
      initial: false,
      previousTargetWord: completedTargetWord,
      carryOverTurns,
    });
    questResult.completedQuest = true;
    questResult.completedEncyclopedia = Boolean(nextQuest.isWon);
    questResult.completedTargetWord = completedTargetWord;
    questResult.nextTargetWord = nextQuest.targetWord;
    questResult.remainingDiscoveries = nextQuest.remainingDiscoveries;
    questResult.turnsTaken = coinReward.turnsTaken;
    questResult.questBaseCoins = coinReward.baseCoins;
    questResult.questSpeedBonusCoins = coinReward.speedBonusCoins;
    questResult.questTotalCoins = coinReward.totalCoins;
    questResult.newNegativeMixTokens = rewardSummary.newNegativeMixTokens;
    questResult.newBanWordTokens = rewardSummary.newBanWordTokens;
    questResult.newWildcardTokens = rewardSummary.newWildcardTokens;
    mergePositionTokenRewardSummary(questResult.newPositionTokenRewards, rewardSummary.newPositionTokenRewards);
    return questResult;
  }

  questResult.remainingDiscoveries = state.quest.remainingDiscoveries;
  if (didDiscoverNewWord && countQuestDiscoveryTurn && state.quest.remainingDiscoveries <= 0) {
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
    version: 5,
    starters: [...state.starters],
    discovered: [...state.discovered.entries()],
    selfMatchedWords: [...state.selfMatchedWords],
    spawnExistingWords: state.spawnExistingWords,
    tiles: state.tiles.map((tile) => ({
      id: tile.id,
      word: tile.word,
      secondResultTagged: getTileTagRank(tile) === 2,
      resultTagRank: getTileTagRank(tile),
      pendingBan: Boolean(tile.pendingBan),
      x: tile.x,
      y: tile.y,
      zIndex: tile.zIndex,
      tiltDeg: clampStoredTileTiltDeg(tile.tiltDeg),
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
      zoneColor: typeof category.zoneColor === "string" ? category.zoneColor : undefined,
      zoneOpacity: Number.isFinite(category.zoneOpacity) ? category.zoneOpacity : undefined,
      zoneRadius: Number.isFinite(category.zoneRadius) ? category.zoneRadius : undefined,
    })),
    wordAssignments: [...state.wordAssignments.entries()].map(([key, value]) => [
      key,
      value instanceof Set ? [...value] : [],
    ]),
    categoryZones: state.categoryZones.map((zone) => ({
      id: zone.id,
      categoryId: zone.categoryId,
      x: zone.x,
      y: zone.y,
      radius: zone.radius,
      color: zone.color,
      opacity: zone.opacity,
      createdAt: zone.createdAt,
    })),
    recentDiscoveredWordKeys: [...state.recentDiscoveredWordKeys],
    removedResultWords: [...state.removedResultWords],
    hiddenWordPanelWords: [...state.hiddenWordPanelWords],
    garbageWordsSinceReward: state.garbageWordsSinceReward,
    garbageRewardLevel: state.garbageRewardLevel,
    availableNegativeMixTokens: state.availableNegativeMixTokens,
    totalNegativeMixTokensEarned: state.totalNegativeMixTokensEarned,
    progressNegativeMixTokensAwarded: state.progressNegativeMixTokensAwarded,
    coins: state.coins,
    totalCoinsEarned: state.totalCoinsEarned,
    purchasedUpgrades: { ...state.purchasedUpgrades },
    shopPurchaseCounts: { ...state.shopPurchaseCounts },
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
      number: state.quest.number,
      targetWord: state.quest.targetWord,
      remainingDiscoveries: state.quest.remainingDiscoveries,
      turnsTaken: state.quest.turnsTaken,
      isLost: state.quest.isLost,
      isWon: state.quest.isWon,
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
      pendingBan: Boolean(tile.pendingBan),
      x: Number.isFinite(tile.x) ? tile.x : 0,
      y: Number.isFinite(tile.y) ? tile.y : 0,
      zIndex: getSafeCount(tile.zIndex, 1),
      tiltDeg: Number.isFinite(tile.tiltDeg) ? normalizeTileTiltDeg(tile.tiltDeg) : randomTileTiltDeg(),
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
        zoneColor: typeof category.zoneColor === "string" ? category.zoneColor : undefined,
        zoneOpacity: Number.isFinite(category.zoneOpacity)
          ? clamp(category.zoneOpacity, 0, 1)
          : undefined,
        zoneRadius: Number.isFinite(category.zoneRadius) ? category.zoneRadius : undefined,
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

function normalizeSavedCategoryZones(value, validCategoryIds) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((zone) => zone && typeof zone.id === "string" && typeof zone.categoryId === "string"
      && validCategoryIds.has(zone.categoryId))
    .map((zone) => ({
      id: zone.id,
      categoryId: zone.categoryId,
      x: Number.isFinite(zone.x) ? zone.x : 0,
      y: Number.isFinite(zone.y) ? zone.y : 0,
      radius: Number.isFinite(zone.radius)
        ? clamp(zone.radius, CATEGORY_ZONE_MIN_RADIUS, CATEGORY_ZONE_MAX_RADIUS)
        : DEFAULT_CATEGORY_ZONE_RADIUS,
      color: typeof zone.color === "string" ? zone.color : CATEGORY_ZONE_DEFAULT_COLOR,
      opacity: Number.isFinite(zone.opacity)
        ? clamp(zone.opacity, 0, 1)
        : CATEGORY_ZONE_DEFAULT_OPACITY,
      createdAt: Number.isFinite(zone.createdAt) ? zone.createdAt : 0,
    }));
}

function normalizeSavedWordAssignments(value, validCategoryIds) {
  const map = new Map();
  if (!Array.isArray(value)) {
    return map;
  }
  value.forEach((entry) => {
    if (!Array.isArray(entry) || typeof entry[0] !== "string") {
      return;
    }
    const wordKey = entry[0];
    const raw = entry[1];
    const set = new Set();
    if (Array.isArray(raw)) {
      raw.forEach((id) => {
        if (typeof id === "string" && id !== DEFAULT_CATEGORY_ID && validCategoryIds.has(id)) {
          set.add(id);
        }
      });
    } else if (typeof raw === "string" && raw !== DEFAULT_CATEGORY_ID && validCategoryIds.has(raw)) {
      set.add(raw);
    }
    map.set(wordKey, set);
  });
  return map;
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
  const wordAssignments = normalizeSavedWordAssignments(snapshot.wordAssignments, validCategoryIds);
  const categoryZones = normalizeSavedCategoryZones(snapshot.categoryZones, validCategoryIds);
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
  state.categoryZones = categoryZones;
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
  state.coins = getSafeCount(snapshot.coins);
  state.totalCoinsEarned = Math.max(state.coins, getSafeCount(snapshot.totalCoinsEarned, state.coins));
  const loadedPurchases = normalizeSavedPurchasedUpgrades(snapshot.purchasedUpgrades);
  const snapshotVersion = getSafeCount(snapshot.version, 0);
  if (snapshotVersion < 4 && loadedPurchases.playfieldTier === undefined) {
    loadedPurchases.playfieldTier = 2;
  }
  state.purchasedUpgrades = loadedPurchases;
  state.shopPurchaseCounts = normalizeSavedShopPurchaseCounts(snapshot.shopPurchaseCounts);
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
  if (snapshot.activeSidebarTab === "upgrades") {
    state.activeSidebarTab = "upgrades";
  } else {
    state.activeSidebarTab = "words";
  }
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
  const savedQuestNumber = Math.max(1, getSafeCount(snapshot.quest?.number, 1));
  const savedQuestRemaining = getSafeCount(snapshot.quest?.remainingDiscoveries);
  const savedQuestTurnsTaken = Math.max(0, getSafeCount(snapshot.quest?.turnsTaken));
  const savedQuestLost = Boolean(snapshot.quest?.isLost);
  const savedQuestWon = Boolean(snapshot.quest?.isWon);
  const discoveredEncyclopediaWords = getDiscoveredEncyclopediaWords();
  if (getUndiscoveredEncyclopediaWords().length === 0 || savedQuestWon) {
    setQuestVictoryState({ questNumber: savedQuestNumber });
  } else if (savedQuestTarget && !discoveredEncyclopediaWords.has(savedQuestTarget) && (savedQuestRemaining > 0 || savedQuestLost)) {
    state.quest.number = savedQuestNumber;
    state.quest.targetWord = savedQuestTarget;
    state.quest.remainingDiscoveries = savedQuestRemaining;
    state.quest.turnsTaken = savedQuestTurnsTaken;
    state.quest.isLost = savedQuestLost;
    state.quest.isWon = false;
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

function randomTileTiltDeg() {
  return TILE_TILT_MIN + Math.random() * (TILE_TILT_MAX - TILE_TILT_MIN);
}

function normalizeTileTiltDeg(value) {
  if (!Number.isFinite(value)) {
    return randomTileTiltDeg();
  }
  return clamp(value, TILE_TILT_MIN, TILE_TILT_MAX);
}

/** Stable tilt for display / save (never re-rolls random). */
function clampStoredTileTiltDeg(value) {
  return clamp(Number.isFinite(value) ? value : 0, TILE_TILT_MIN, TILE_TILT_MAX);
}

function requestTilePaperSettle(tileId) {
  if (Number.isFinite(tileId)) {
    tileIdsNeedingPaperSettle.add(tileId);
  }
}

/** Slight tilt change on drag-drop, as if the card landed from a small height (does not re-roll full tilt). */
function maybeNudgeTileTiltAfterPointerDrop(tile) {
  if (!tile || Math.random() >= TILE_DROP_TILT_NUDGE_CHANCE) {
    return;
  }
  const base = clampStoredTileTiltDeg(tile.tiltDeg);
  const delta = (Math.random() * 2 - 1) * TILE_DROP_TILT_NUDGE_MAX;
  tile.tiltDeg = clamp(base + delta, TILE_TILT_MIN, TILE_TILT_MAX);
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
  return 1;
}

function getMaxWorldScaleForZoneCount(zoneCount) {
  return PLAYFIELD_BASE_WORLD_SCALE + ((Math.max(1, zoneCount) - 1) * PLAYFIELD_ZONE_SCALE_STEP);
}

function getMinimumUnlockedZoom() {
  if (getPlayfieldUpgradeTier() < 1) {
    return 1;
  }
  const zoneCount = Math.max(1, getUnlockedPlayfieldZoneCount());
  const frontierMin = Math.max(MIN_PLAYFIELD_ZOOM, 1 / zoneCount);
  const { width: vw, height: vh } = getPlayfieldViewportSize();
  const { width: ww, height: wh } = getPlayfieldWorldSize();
  if (!vw || !vh || !ww || !wh) {
    return frontierMin;
  }
  const fitWholeFieldZoom = Math.min(vw / ww, vh / wh);
  return Math.max(MIN_PLAYFIELD_ZOOM, Math.min(frontierMin, fitWholeFieldZoom));
}

function getNormalizedPlayfieldZoom(value) {
  const fallback = 1;
  const parsed = Number.isFinite(value) ? value : fallback;
  return clamp(roundTo(parsed), getMinimumUnlockedZoom(), getMaximumPlayfieldZoom());
}

function getPlayfieldWorldSize() {
  const { width, height } = getPlayfieldViewportSize();
  if (getPlayfieldUpgradeTier() < 1) {
    return { width, height };
  }
  let unlockedScale = getMaxWorldScaleForZoneCount(getUnlockedPlayfieldZoneCount());
  if (getPlayfieldUpgradeTier() >= 2) {
    unlockedScale *= PLAYFIELD_EXPAND_MULTIPLIER;
  }
  if (getPlayfieldUpgradeTier() >= 3) {
    unlockedScale *= PLAYFIELD_EXPAND_MULTIPLIER;
  }
  return {
    width: Math.max(width, Math.round(width * unlockedScale)),
    height: Math.max(height, Math.round(height * unlockedScale)),
  };
}

function appendNewPlayfieldZonesNotice(message, newZonesUnlocked) {
  if (newZonesUnlocked <= 0) {
    return message;
  }
  if (getPlayfieldUpgradeTier() >= 1) {
    const zoneSuffix = newZonesUnlocked === 1 ? "zone" : "zones";
    return `${message} Your kingdom expanded with ${newZonesUnlocked} new field ${zoneSuffix}.`;
  }
  return `${message} New field tiers will appear after you buy Field Pan & Zoom in the Shop.`;
}

function getPlayfieldVisibleWorldSize(zoom = state.playfieldZoom) {
  const { width, height } = getPlayfieldViewportSize();
  const maxZ = getMaximumPlayfieldZoom();
  const safeZoom = clamp(zoom, MIN_PLAYFIELD_ZOOM, maxZ);
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
  renderTiles({ skipWordListRefresh: true });
  if (queueSave) {
    queueProgressSave();
  }
}

function getActivePlayfieldZoneCount(zoom = state.playfieldZoom) {
  const visibleScale = 1 / clamp(zoom, MIN_PLAYFIELD_ZOOM, getMaximumPlayfieldZoom());
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

function getPlayfieldWorldPointFromClient(clientX, clientY) {
  const playfieldRect = els.playfield.getBoundingClientRect();
  const world = getPlayfieldWorldSize();
  const rawX = state.playfieldCamera.x + ((clientX - playfieldRect.left) / state.playfieldZoom);
  const rawY = state.playfieldCamera.y + ((clientY - playfieldRect.top) / state.playfieldZoom);
  return {
    x: clamp(rawX, 0, world.width),
    y: clamp(rawY, 0, world.height),
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

  const tier = getPlayfieldUpgradeTier();
  if (els.playfield) {
    els.playfield.dataset.panLocked = tier < 1 ? "true" : "false";
  }

  const maxZ = getMaximumPlayfieldZoom();

  if (tier < 1) {
    els.playfieldZoomValue.textContent = "Locked";
  } else {
    els.playfieldZoomValue.textContent = `${Math.round(state.playfieldZoom * 100)}%`;
  }
  els.zoomOutButton.disabled = tier < 1 || state.playfieldZoom <= getMinimumUnlockedZoom() + 0.001;
  els.zoomInButton.disabled = tier < 1 || state.playfieldZoom >= maxZ - 0.001;
}

function setPlayfieldZoom(nextZoom, { silent = false } = {}) {
  const minZoom = getMinimumUnlockedZoom();
  const maxZoom = getMaximumPlayfieldZoom();
  const clampedZoom = clamp(roundTo(nextZoom), minZoom, maxZoom);
  const hitLockedFrontier = nextZoom < minZoom - 0.001;
  if (Math.abs(clampedZoom - state.playfieldZoom) < 0.001) {
    if (hitLockedFrontier && !silent) {
      if (getPlayfieldUpgradeTier() < 1) {
        setStatus("Pan and zoom unlock in the Shop: Field Pan & Zoom.", "error");
      } else if (getPlayfieldUpgradeTier() >= 3) {
        setStatus("You're at minimum zoom for this field.", "error");
      } else {
        setStatus("Zoom frontier reached. Buy Expand Mixing Field in the Shop for a larger field and more zoom-out.", "error");
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
  renderTiles({ skipWordListRefresh: true });
  queueProgressSave();

  if (hitLockedFrontier && !silent) {
    if (getPlayfieldUpgradeTier() < 1) {
      setStatus("Pan and zoom unlock in the Shop: Field Pan & Zoom.", "error");
    } else if (getPlayfieldUpgradeTier() >= 3) {
      setStatus("You're at minimum zoom for this field.", "error");
    } else {
      setStatus("Zoom frontier reached. Buy Expand Mixing Field in the Shop for a larger field and more zoom-out.", "error");
    }
  }

  return true;
}

function refreshPlayfieldAfterTierUpgrade() {
  state.playfieldZoom = getNormalizedPlayfieldZoom(state.playfieldZoom);
  state.playfieldCamera = clampPlayfieldCamera(getDefaultPlayfieldCamera(state.playfieldZoom));
  clampTilesToPlayfieldBounds();
  updatePlayfieldCamera();
  renderTiles({ skipWordListRefresh: true });
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
  const exactEntry = ENCYCLOPEDIA_LOOKUP.get(normalized) || ENCYCLOPEDIA_LOOKUP.get(word.toLowerCase());
  if (exactEntry) {
    return exactEntry;
  }

  const candidateForms = new Set([
    ...getWordFamilyForms(normalized),
    ...getWordFamilyForms(word),
  ]);
  for (const form of candidateForms) {
    const entry = ENCYCLOPEDIA_LOOKUP.get(form);
    if (entry) {
      return entry;
    }
  }
  return null;
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

function shouldFlashTokenDock() {
  return state.unseenTokenRewards > 0 && getTotalUsableTokenCount() > 0;
}

function markTokenRewardsSeen() {
  if (state.unseenTokenRewards <= 0) {
    return;
  }
  state.unseenTokenRewards = 0;
  queueProgressSave();
  els.tokenDockOuter?.classList.remove("token-dock-flashing");
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

/** Adds canonicalResult to the global removed-result pool (idempotent). */
function applyAutoBanForNewMixDiscovery(canonicalResult) {
  const removalKeys = getRemovalKeysForWord(canonicalResult);
  if (removalKeys.size === 0) {
    return false;
  }
  const hadAll = [...removalKeys].every((key) => state.removedResultWords.has(key));
  removalKeys.forEach((key) => state.removedResultWords.add(key));
  if (state.lastMix?.candidates?.length) {
    state.lastMix.candidates = filterRemovedCandidates(state.lastMix.candidates);
  }
  queueProgressSave();
  return !hadAll;
}

function resolvePendingBanMixIfNeeded({
  firstTile = null,
  secondTile = null,
  operation,
  leftWord,
  rightWord,
  selection,
  clientPoint = null,
}) {
  const tiles = [firstTile, secondTile].filter(Boolean);
  if (!tiles.some((t) => t.pendingBan)) {
    return false;
  }
  const selectedCandidate = selection.candidate;
  if (!selectedCandidate) {
    return false;
  }
  const canonicalResult = getCanonicalWord(selectedCandidate.word, selectedCandidate.normalized);
  const newlyStruck = applyAutoBanForNewMixDiscovery(canonicalResult);
  const chargedTile = tiles.find((t) => t.pendingBan);
  if (chargedTile) {
    chargedTile.pendingBan = false;
  }
  renderTiles();
  renderSidebar();
  if (clientPoint) {
    showFloatingWordNotice(newlyStruck ? "🚫" : "✓", newlyStruck ? "reward" : "ok", clientPoint);
  }
  const op = operation === "subtract" ? "-" : "+";
  const strikeNote = newlyStruck
    ? `${titleCase(canonicalResult)} was struck from future mix results (nothing spawned or discovered).`
    : `${titleCase(canonicalResult)} was already struck from results; your Ban line was cleared anyway.`;
  applyOutcomeStatus({
    message: `${titleCase(leftWord)} ${op} ${titleCase(rightWord)} consumed a Ban line. ${strikeNote}`,
    stateName: "reward",
  }, {});
  return true;
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

function resolveCandidateSelection(candidates, tileIds = [], { applyTagEffects = true } = {}) {
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
    const refundedTagCount = applyTagEffects && taggedTiles.length > 0
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
  const refundedTagCount = applyTagEffects && desiredShift > 0 && !canUseShiftedCandidate
    ? releaseTaggedResultTokens(tileIds, { refund: true })
    : 0;

  if (applyTagEffects && desiredShift > 0 && canUseShiftedCandidate) {
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

function clearQuestCompletionNotice() {
  if (activeQuestCompletionNoticeTimeout !== null) {
    window.clearTimeout(activeQuestCompletionNoticeTimeout);
    activeQuestCompletionNoticeTimeout = null;
  }
  if (activeQuestCompletionNotice) {
    activeQuestCompletionNotice.remove();
    activeQuestCompletionNotice = null;
  }
}

function triggerQuestStripCelebration() {
  if (!els.questStrip) {
    return;
  }
  if (activeQuestStripCelebrationTimeout !== null) {
    window.clearTimeout(activeQuestStripCelebrationTimeout);
    activeQuestStripCelebrationTimeout = null;
  }
  els.questStrip.classList.remove("quest-strip-celebrating");
  void els.questStrip.offsetWidth;
  els.questStrip.classList.add("quest-strip-celebrating");
  activeQuestStripCelebrationTimeout = window.setTimeout(() => {
    els.questStrip?.classList.remove("quest-strip-celebrating");
    activeQuestStripCelebrationTimeout = null;
  }, 1200);
}

function showQuestCompletionNotice(questResult, overflowMessage = "") {
  if (!questResult?.completedQuest) {
    return;
  }

  clearQuestCompletionNotice();

  const notice = document.createElement("section");
  notice.className = "quest-complete-toast";
  notice.setAttribute("role", "status");
  notice.setAttribute("aria-live", "polite");

  const title = document.createElement("div");
  title.className = "quest-complete-toast-title";
  title.textContent = "Quest Complete!";

  const body = document.createElement("div");
  body.className = "quest-complete-toast-body";
  body.textContent = `${titleCase(questResult.completedTargetWord)} found. +${questResult.questTotalCoins} coins.`;

  const next = document.createElement("div");
  next.className = "quest-complete-toast-next";
  next.textContent = questResult.completedEncyclopedia
    ? "Encyclopedia complete. Run finished."
    : `Next target: ${titleCase(questResult.nextTargetWord)}.`;

  notice.append(title, body, next);

  if (overflowMessage) {
    const extra = document.createElement("div");
    extra.className = "quest-complete-toast-extra";
    extra.textContent = overflowMessage;
    notice.append(extra);
  }

  document.body.append(notice);
  activeQuestCompletionNotice = notice;
  window.requestAnimationFrame(() => {
    notice.dataset.visible = "true";
  });
  activeQuestCompletionNoticeTimeout = window.setTimeout(() => {
    clearQuestCompletionNotice();
  }, QUEST_COMPLETION_NOTICE_MS);
}

function showQuestCompletionFireworks() {
  const layer = document.createElement("div");
  layer.className = "quest-fireworks-layer";

  for (let burstIndex = 0; burstIndex < QUEST_COMPLETION_FIREWORK_BURSTS; burstIndex += 1) {
    const burst = document.createElement("div");
    burst.className = "quest-firework-burst";
    burst.style.left = `${16 + (burstIndex * 17) + ((Math.random() * 6) - 3)}%`;
    burst.style.top = `${18 + (((burstIndex + 1) % 2) * 10) + (Math.random() * 7)}%`;
    burst.style.setProperty("--particle-delay", `${burstIndex * 90}ms`);

    for (let particleIndex = 0; particleIndex < QUEST_COMPLETION_FIREWORK_PARTICLES; particleIndex += 1) {
      const particle = document.createElement("span");
      particle.className = "quest-firework-particle";
      particle.style.setProperty(
        "--angle",
        `${((360 / QUEST_COMPLETION_FIREWORK_PARTICLES) * particleIndex) + ((Math.random() * 12) - 6)}deg`,
      );
      particle.style.setProperty("--distance", `${54 + Math.random() * 34}px`);
      particle.style.setProperty("--particle-delay", `${burstIndex * 90}ms`);
      particle.style.setProperty("--particle-duration", `${760 + Math.random() * 240}ms`);
      particle.style.setProperty(
        "--particle-color",
        QUEST_COMPLETION_FIREWORK_COLORS[(particleIndex + burstIndex) % QUEST_COMPLETION_FIREWORK_COLORS.length],
      );
      burst.append(particle);
    }

    layer.append(burst);
  }

  document.body.append(layer);
  window.setTimeout(() => {
    layer.remove();
  }, 1800);
}

function resolveOutcomeStatus(status, { vocabularyOverflow = null, questResult = null } = {}) {
  if (!vocabularyOverflow) {
    return {
      message: status.message,
      stateName: status.stateName,
      overflowMessage: "",
    };
  }

  if (questResult?.completedQuest) {
    return {
      message: `${status.message} ${vocabularyOverflow.message}`.trim(),
      stateName: "reward",
      overflowMessage: vocabularyOverflow.message,
    };
  }

  return {
    message: vocabularyOverflow.message,
    stateName: vocabularyOverflow.stateName || status.stateName,
    overflowMessage: "",
  };
}

function applyOutcomeStatus(status, { vocabularyOverflow = null, questResult = null } = {}) {
  const resolvedStatus = resolveOutcomeStatus(status, {
    vocabularyOverflow,
    questResult,
  });
  setStatus(resolvedStatus.message, resolvedStatus.stateName);

  if (questResult?.completedQuest) {
    triggerQuestStripCelebration();
    showQuestCompletionNotice(questResult, resolvedStatus.overflowMessage);
    showQuestCompletionFireworks();
  }
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

function setFloatingCandidatePreviewPosition(preview, clientPoint = null) {
  if (!preview) {
    return;
  }

  const playfieldRect = els.playfield.getBoundingClientRect();
  const bounds = getPlayfieldBounds();
  const localX = clientPoint
    ? clientPoint.x - playfieldRect.left
    : bounds.width / 2;
  const localY = clientPoint
    ? clientPoint.y - playfieldRect.top
    : bounds.height / 2;
  const x = clamp(
    localX - (FLOATING_MATCH_PREVIEW_WIDTH / 2),
    12,
    Math.max(12, bounds.width - FLOATING_MATCH_PREVIEW_WIDTH - 12),
  );
  const y = clamp(
    localY - FLOATING_MATCH_PREVIEW_HEIGHT - 26,
    12,
    Math.max(12, bounds.height - FLOATING_MATCH_PREVIEW_HEIGHT - 12),
  );
  preview.style.left = `${x}px`;
  preview.style.top = `${y}px`;
}

function updateFloatingCandidatePreviewPosition(clientPoint = null) {
  setFloatingCandidatePreviewPosition(activeFloatingCandidatePreview, clientPoint);
}

function clearDragMixPreview() {
  dragMixPreviewState.pairKey = null;
  dragMixPreviewState.clientPoint = null;
  dragMixPreviewState.requestId += 1;
  clearFloatingCandidatePreview();
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

function showFloatingCandidatePreview(candidates, clientPoint = null, { persistent = false } = {}) {
  if (!Array.isArray(candidates) || candidates.length === 0) {
    clearFloatingCandidatePreview();
    return;
  }

  clearFloatingCandidatePreview();

  const preview = document.createElement("div");
  preview.className = "floating-match-preview";
  preview.dataset.persistent = persistent ? "true" : "false";

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

  setFloatingCandidatePreviewPosition(preview, clientPoint);

  els.playfield.append(preview);
  activeFloatingCandidatePreview = preview;
  if (!persistent) {
    activeFloatingCandidatePreviewTimeout = window.setTimeout(() => {
      clearFloatingCandidatePreview();
    }, 2500);
  }
}

function getAssociationCacheKey(wordA, wordB, operation = "add") {
  return `${operation}:${getWordKey(wordA)}:${getWordKey(wordB)}`;
}

async function getAssociationCached(wordA, wordB, operation = "add") {
  const cacheKey = getAssociationCacheKey(wordA, wordB, operation);
  if (!associationPreviewCache.has(cacheKey)) {
    const request = getAssociation(wordA, wordB, operation)
      .catch((error) => {
        associationPreviewCache.delete(cacheKey);
        throw error;
      });
    associationPreviewCache.set(cacheKey, request);
  }
  return associationPreviewCache.get(cacheKey);
}

async function updateDragMixPreview(sourceTile, targetTile, clientPoint) {
  if (!sourceTile || !targetTile) {
    clearDragMixPreview();
    return;
  }

  const pairKey = `${sourceTile.id}:${targetTile.id}`;
  dragMixPreviewState.clientPoint = clientPoint;

  if (dragMixPreviewState.pairKey === pairKey) {
    updateFloatingCandidatePreviewPosition(clientPoint);
    return;
  }

  dragMixPreviewState.pairKey = pairKey;
  const requestId = dragMixPreviewState.requestId + 1;
  dragMixPreviewState.requestId = requestId;
  clearFloatingCandidatePreview();

  try {
    const mix = await getAssociationCached(sourceTile.word, targetTile.word, "add");
    if (
      dragMixPreviewState.pairKey !== pairKey
      || dragMixPreviewState.requestId !== requestId
    ) {
      return;
    }

    const selection = resolveCandidateSelection(mix.candidates, [sourceTile.id, targetTile.id], {
      applyTagEffects: false,
    });
    if (!selection.candidate) {
      clearFloatingCandidatePreview();
      return;
    }

    showFloatingCandidatePreview(selection.candidates, dragMixPreviewState.clientPoint, {
      persistent: true,
    });
  } catch (error) {
    if (
      dragMixPreviewState.pairKey === pairKey
      && dragMixPreviewState.requestId === requestId
    ) {
      clearFloatingCandidatePreview();
    }
  }
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

  return {
    word,
    normalized,
    zipf: Number.isFinite(payload.zipf) ? payload.zipf : null,
  };
}

async function getSpawnWordCandidate(word) {
  const query = new URLSearchParams({ word });
  const response = await fetch(`./api/spawn-word?${query.toString()}`);
  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    throw new Error(payload.error || "Could not spawn that word.");
  }

  const spawnedWord = typeof payload.word === "string" ? payload.word.trim().toLowerCase() : "";
  const normalized = typeof payload.normalized === "string" ? payload.normalized.trim().toLowerCase() : "";
  if (!spawnedWord || !normalized) {
    throw new Error("Spawn word payload was incomplete.");
  }

  return {
    word: spawnedWord,
    normalized,
    zipf: Number.isFinite(payload.zipf) ? payload.zipf : null,
  };
}

function updateCounts() {
  els.discoveredCount.textContent = state.discovered.size.toString();
  els.availableCount.textContent = getAvailableWordEntries().length.toString();
  els.encyclopediaCount.textContent = `${getEncyclopediaDiscoveryCount()} / ${ENCYCLOPEDIA_WORDS.length}`;
  if (els.historyCount) {
    els.historyCount.textContent = state.matchHistory.length.toString();
  }
  if (els.topbarCoinCount) {
    els.topbarCoinCount.textContent = state.coins.toString();
  }
  els.upgradeCount.textContent = getAffordableSidebarShopItemCount().toString();
  els.upgradeCoinCount.textContent = `${state.coins} coin${state.coins === 1 ? "" : "s"}`;
}

function renderQuest() {
  const targetWord = state.quest.isWon
    ? "Encyclopedia complete"
    : (state.quest.targetWord ? titleCase(state.quest.targetWord) : "None");
  const countdown = state.quest.isWon ? "0" : state.quest.remainingDiscoveries;
  let questState = "active";
  if (state.quest.isWon) {
    questState = "active";
  } else if (state.quest.isLost) {
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
  els.questWinModal.hidden = !state.quest.isWon;
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
  state.categoryZones = state.categoryZones.filter((zone) => zone.categoryId !== categoryId);
  state.wordAssignments.forEach((set, wordKey) => {
    const next = getCategoryAssignmentSet(wordKey);
    next.delete(categoryId);
  });

  renderTiles();
  queueProgressSave();
  setStatus(`${category.name} was deleted. Its words moved to Uncategorized.`);
}

function ensureWordAssignments(entries) {
  const validCategoryIds = new Set(state.wordCategories.map((category) => category.id));
  entries.forEach((entry) => {
    const set = getCategoryAssignmentSet(entry.key);
    [...set].forEach((id) => {
      if (!validCategoryIds.has(id)) {
        set.delete(id);
      }
    });
  });
}

function getCategoryAssignmentSet(wordKey) {
  let set = state.wordAssignments.get(wordKey);
  if (!(set instanceof Set)) {
    set = new Set();
    const legacy = state.wordAssignments.get(wordKey);
    if (typeof legacy === "string" && legacy !== DEFAULT_CATEGORY_ID) {
      set.add(legacy);
    }
    state.wordAssignments.set(wordKey, set);
  }
  return set;
}

function getCategoryIdsForWord(key) {
  const set = state.wordAssignments.get(key);
  if (set instanceof Set) {
    return new Set(set);
  }
  if (typeof set === "string" && set !== DEFAULT_CATEGORY_ID) {
    return new Set([set]);
  }
  return new Set();
}

function wordBelongsToCategory(wordKey, categoryId) {
  if (categoryId === DEFAULT_CATEGORY_ID) {
    return getCategoryIdsForWord(wordKey).size === 0;
  }
  return getCategoryIdsForWord(wordKey).has(categoryId);
}

function getTileCenter(tile) {
  return {
    x: tile.x + (TILE_WIDTH / 2),
    y: tile.y + (TILE_HEIGHT / 2),
  };
}

function getZonesContainingPoint(px, py) {
  return state.categoryZones
    .filter((zone) => {
      const dx = px - zone.x;
      const dy = py - zone.y;
      return Math.hypot(dx, dy) <= zone.radius;
    })
    .sort((a, b) => a.createdAt - b.createdAt);
}

function getOldestZoneContainingPoint(px, py) {
  const list = getZonesContainingPoint(px, py);
  return list.length ? list[0] : null;
}

function getZoneCategoryIdsForTileCenter(px, py) {
  const oldest = getOldestZoneContainingPoint(px, py);
  return oldest ? [oldest.categoryId] : [];
}

function syncWordAssignmentsFromCategoryZones() {
  const validCategoryIds = new Set(state.wordCategories.map((category) => category.id));
  const keysOnField = new Set(state.tiles.map((tile) => getWordKey(tile.word)));

  keysOnField.forEach((wordKey) => {
    const categorySet = new Set();
    state.tiles.forEach((tile) => {
      if (getWordKey(tile.word) !== wordKey) {
        return;
      }
      const { x, y } = getTileCenter(tile);
      getZoneCategoryIdsForTileCenter(x, y).forEach((id) => {
        if (validCategoryIds.has(id)) {
          categorySet.add(id);
        }
      });
    });
    state.wordAssignments.set(wordKey, categorySet);
  });
}

function getCategoryZoneTintForTile(tile) {
  const { x, y } = getTileCenter(tile);
  const zone = getOldestZoneContainingPoint(x, y);
  if (!zone) {
    return null;
  }
  const category = getCategoryById(zone.categoryId);
  return {
    zone,
    categoryName: category?.name || "",
    color: zone.color,
    opacity: zone.opacity,
  };
}

function ensureCategoryZonesLayer() {
  let layer = els.playfieldSurface.querySelector(".category-zones-layer");
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "category-zones-layer";
    els.playfieldSurface.prepend(layer);
  }
  return layer;
}

function removeCategoryZone(zoneId) {
  state.categoryZones = state.categoryZones.filter((zone) => zone.id !== zoneId);
  syncWordAssignmentsFromCategoryZones();
  renderTiles();
  queueProgressSave();
}

function renderCategoryZones() {
  if (!els.playfieldSurface) {
    return;
  }
  const layer = ensureCategoryZonesLayer();
  layer.innerHTML = "";

  const sorted = [...state.categoryZones].sort((a, b) => a.createdAt - b.createdAt);
  sorted.forEach((zone, index) => {
    const category = getCategoryById(zone.categoryId);
    const widget = document.createElement("div");
    widget.className = "category-zone-widget";
    widget.dataset.zoneId = zone.id;
    widget.style.zIndex = String(CATEGORY_ZONE_WIDGET_BASE_Z + index);
    widget.style.left = `${zone.x - zone.radius}px`;
    widget.style.top = `${zone.y - zone.radius}px`;
    widget.style.width = `${zone.radius * 2}px`;
    widget.style.height = `${zone.radius * 2}px`;

    const ring = document.createElement("div");
    ring.className = "category-zone-ring";
    ring.style.width = `${zone.radius * 2}px`;
    ring.style.height = `${zone.radius * 2}px`;
    const rgb = hexToRgbTuple(zone.color);
    const fillAlpha = clamp(zone.opacity * 0.35, 0, 0.55);
    ring.style.background = rgb
      ? `radial-gradient(circle, rgba(${rgb.r},${rgb.g},${rgb.b},${fillAlpha}) 0%, rgba(${rgb.r},${rgb.g},${rgb.b},${fillAlpha * 0.35}) 55%, transparent 72%)`
      : "transparent";
    ring.style.borderColor = rgb ? `rgba(${rgb.r},${rgb.g},${rgb.b},0.85)` : "var(--border-strong)";

    const chip = document.createElement("div");
    chip.className = "category-zone-chip";

    const label = document.createElement("span");
    label.className = "category-zone-chip-label";
    label.textContent = category?.name || "Category";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "category-zone-remove";
    removeButton.textContent = "Remove zone";
    removeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      removeCategoryZone(zone.id);
      setStatus("Category zone removed from the field.");
    });

    chip.append(label, removeButton);
    widget.append(ring, chip);

    widget.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || event.target.closest("button")) {
        return;
      }
      startCategoryZoneDrag(event, zone.id);
    });

    layer.append(widget);
  });
}

function startCategoryZoneDrag(event, zoneId) {
  const zone = state.categoryZones.find((z) => z.id === zoneId);
  if (!zone) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const widget = event.currentTarget;
  const startWorld = getPlayfieldPointFromClientPoint(event.clientX, event.clientY);
  const pointerOffsetX = startWorld.x - zone.x;
  const pointerOffsetY = startWorld.y - zone.y;
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
      widget.dataset.dragging = "true";
    }

    const lp = getPlayfieldPointFromClientPoint(moveEvent.clientX, moveEvent.clientY);
    zone.x = lp.x - pointerOffsetX;
    zone.y = lp.y - pointerOffsetY;
    const world = getPlayfieldWorldSize();
    zone.x = clamp(zone.x, zone.radius, Math.max(zone.radius, world.width - zone.radius));
    zone.y = clamp(zone.y, zone.radius, Math.max(zone.radius, world.height - zone.radius));

    widget.style.left = `${zone.x - zone.radius}px`;
    widget.style.top = `${zone.y - zone.radius}px`;
    syncWordAssignmentsFromCategoryZones();
    renderTiles({ skipCategoryZoneRender: true, skipWordListRefresh: true });
  };

  const end = () => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
    delete widget.dataset.dragging;
    if (dragStarted) {
      queueProgressSave();
    }
    renderTiles();
    renderWordList();
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end, { once: true });
}

function hsvToRgb(h, s, v) {
  const hh = ((h % 360) + 360) % 360 / 60;
  const c = v * s;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hh < 1) {
    r = c; g = x;
  } else if (hh < 2) {
    r = x; g = c;
  } else if (hh < 3) {
    g = c; b = x;
  } else if (hh < 4) {
    g = x; b = c;
  } else if (hh < 5) {
    r = x; b = c;
  } else {
    r = c; b = x;
  }
  const m = v - c;
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function rgbToHex(r, g, b) {
  const to = (n) => n.toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

function hexToRgbTuple(hex) {
  if (typeof hex !== "string" || !/^#([0-9a-f]{6})$/i.test(hex)) {
    return null;
  }
  const n = parseInt(hex.slice(1), 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

function hexToHsv(hex) {
  const t = hexToRgbTuple(hex);
  if (!t) {
    return { h: 0, s: 1, v: 0.85 };
  }
  const r = t.r / 255;
  const g = t.g / 255;
  const b = t.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d > 1e-6) {
    if (max === r) {
      h = 60 * (((g - b) / d) % 6);
    } else if (max === g) {
      h = 60 * (((b - r) / d) + 2);
    } else {
      h = 60 * (((r - g) / d) + 4);
    }
  }
  if (h < 0) {
    h += 360;
  }
  const s = max <= 1e-6 ? 0 : d / max;
  const v = max;
  return { h, s, v };
}

function drawCategoryZoneColorWheel(canvas, valueBrightness) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.min(w, h) / 2 - 4;
  const image = ctx.createImageData(w, h);
  const data = image.data;
  const v = clamp(valueBrightness, 0, 1);
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);
      const i = (y * w + x) * 4;
      if (dist > R) {
        data[i + 3] = 0;
        continue;
      }
      const sat = R <= 1e-6 ? 0 : Math.min(1, dist / R);
      const hue = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
      const { r, g, b } = hsvToRgb(hue, sat, v);
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
}

function pickHsFromCategoryZoneWheel(canvas, clientX, clientY, valueBrightness) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const R = Math.min(canvas.width, canvas.height) / 2 - 4;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.hypot(dx, dy);
  if (dist > R) {
    return null;
  }
  const sat = R <= 1e-6 ? 0 : Math.min(1, dist / R);
  const hue = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
  const v = clamp(valueBrightness, 0, 1);
  return { h: hue, s: sat, v };
}

function getDefaultCategoryZoneStyle(category) {
  const radius = Number.isFinite(category?.zoneRadius)
    ? clamp(category.zoneRadius, CATEGORY_ZONE_MIN_RADIUS, CATEGORY_ZONE_MAX_RADIUS)
    : DEFAULT_CATEGORY_ZONE_RADIUS;
  const opacity = Number.isFinite(category?.zoneOpacity)
    ? clamp(category.zoneOpacity, 0, 1)
    : CATEGORY_ZONE_DEFAULT_OPACITY;
  const color = typeof category?.zoneColor === "string" && /^#([0-9a-f]{6})$/i.test(category.zoneColor)
    ? category.zoneColor
    : CATEGORY_ZONE_DEFAULT_COLOR;
  return { radius, opacity, color };
}

function addCategoryZoneAtPoint(categoryId, point) {
  const category = getCategoryById(categoryId);
  if (!category || categoryId === DEFAULT_CATEGORY_ID) {
    return;
  }
  const style = getDefaultCategoryZoneStyle(category);
  const world = getPlayfieldWorldSize();
  const x = clamp(point.x, style.radius, Math.max(style.radius, world.width - style.radius));
  const y = clamp(point.y, style.radius, Math.max(style.radius, world.height - style.radius));
  const createdAt = Date.now() + Math.random();
  state.categoryZones.push({
    id: `cz-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    categoryId,
    x,
    y,
    radius: style.radius,
    color: style.color,
    opacity: style.opacity,
    createdAt,
  });
  syncWordAssignmentsFromCategoryZones();
  renderTiles();
  queueProgressSave();
  setStatus(`Dropped ${category.name} zone onto the field.`);
}

function openCategoryZoneStyleEditor(categoryId) {
  const category = getCategoryById(categoryId);
  if (!category || categoryId === DEFAULT_CATEGORY_ID || !els.categoryZoneStyleModal) {
    return;
  }
  editingCategoryZoneStyleCategoryId = categoryId;
  els.categoryZoneStyleTitle.textContent = `Zone style — ${category.name}`;

  const zones = state.categoryZones.filter((z) => z.categoryId === categoryId);
  const fromZone = zones[0];
  const hex = fromZone?.color || category.zoneColor || CATEGORY_ZONE_DEFAULT_COLOR;
  const hsv = hexToHsv(hex);

  els.categoryZoneValueSlider.value = String(Math.round(hsv.v * 100));
  els.categoryZoneOpacitySlider.value = String(Math.round(
    (fromZone?.opacity ?? category.zoneOpacity ?? CATEGORY_ZONE_DEFAULT_OPACITY) * 100,
  ));
  const r = fromZone?.radius
    ?? category.zoneRadius
    ?? DEFAULT_CATEGORY_ZONE_RADIUS;
  els.categoryZoneRadiusSlider.value = String(Math.round(clamp(
    r,
    CATEGORY_ZONE_MIN_RADIUS,
    CATEGORY_ZONE_MAX_RADIUS,
  )));

  if (els.categoryZoneWheel) {
    drawCategoryZoneColorWheel(els.categoryZoneWheel, hsv.v);
    els.categoryZoneWheel.dataset.hue = String(hsv.h);
    els.categoryZoneWheel.dataset.sat = String(hsv.s);
    els.categoryZoneWheel.dataset.val = String(hsv.v);
  }
  updateCategoryZoneStylePreview();
  els.categoryZoneStyleModal.hidden = false;
}

function updateCategoryZoneStylePreview() {
  if (!els.categoryZonePreview || !els.categoryZoneWheel) {
    return;
  }
  const h = Number.isFinite(Number(els.categoryZoneWheel.dataset.hue))
    ? Number(els.categoryZoneWheel.dataset.hue)
    : 0;
  const s = Number.isFinite(Number(els.categoryZoneWheel.dataset.sat))
    ? Number(els.categoryZoneWheel.dataset.sat)
    : 1;
  const v = clamp(Number(els.categoryZoneValueSlider?.value) / 100, 0, 1);
  const { r, g, b } = hsvToRgb(h, s, v);
  const opacity = clamp(Number(els.categoryZoneOpacitySlider?.value) / 100, 0, 1);
  els.categoryZonePreview.style.background = `rgba(${r},${g},${b},${opacity})`;
}

function applyCategoryZoneStyleFromEditor() {
  const categoryId = editingCategoryZoneStyleCategoryId;
  const category = getCategoryById(categoryId);
  if (!category || !els.categoryZoneWheel) {
    return;
  }
  const h = Number(els.categoryZoneWheel.dataset.hue) || 0;
  const s = Number.isFinite(Number(els.categoryZoneWheel.dataset.sat))
    ? Number(els.categoryZoneWheel.dataset.sat)
    : 1;
  const v = clamp(Number(els.categoryZoneValueSlider.value) / 100, 0, 1);
  const opacity = clamp(Number(els.categoryZoneOpacitySlider.value) / 100, 0, 1);
  const radius = clamp(
    Number(els.categoryZoneRadiusSlider.value) || DEFAULT_CATEGORY_ZONE_RADIUS,
    CATEGORY_ZONE_MIN_RADIUS,
    CATEGORY_ZONE_MAX_RADIUS,
  );
  const { r, g, b } = hsvToRgb(h, s, v);
  const color = rgbToHex(r, g, b);

  category.zoneColor = color;
  category.zoneOpacity = opacity;
  category.zoneRadius = radius;

  state.categoryZones.forEach((zone) => {
    if (zone.categoryId === categoryId) {
      zone.color = color;
      zone.opacity = opacity;
      zone.radius = radius;
      const world = getPlayfieldWorldSize();
      zone.x = clamp(zone.x, zone.radius, Math.max(zone.radius, world.width - zone.radius));
      zone.y = clamp(zone.y, zone.radius, Math.max(zone.radius, world.height - zone.radius));
    }
  });

  syncWordAssignmentsFromCategoryZones();
  renderTiles();
  queueProgressSave();
  closeCategoryZoneStyleEditor();
  setStatus(`Updated zone style for ${category.name}.`);
}

function closeCategoryZoneStyleEditor() {
  editingCategoryZoneStyleCategoryId = null;
  if (els.categoryZoneStyleModal) {
    els.categoryZoneStyleModal.hidden = true;
  }
}

function initCategoryZoneStyleEditor() {
  const canvas = els.categoryZoneWheel;
  if (!canvas || !els.categoryZoneValueSlider) {
    return;
  }

  const redrawWheel = () => {
    const v = clamp(Number(els.categoryZoneValueSlider.value) / 100, 0, 1);
    drawCategoryZoneColorWheel(canvas, v);
    updateCategoryZoneStylePreview();
  };

  els.categoryZoneValueSlider.addEventListener("input", redrawWheel);

  els.categoryZoneOpacitySlider.addEventListener("input", () => {
    updateCategoryZoneStylePreview();
  });

  els.categoryZoneRadiusSlider.addEventListener("input", () => {});

  const applyPick = (clientX, clientY) => {
    const v = clamp(Number(els.categoryZoneValueSlider.value) / 100, 0, 1);
    const picked = pickHsFromCategoryZoneWheel(canvas, clientX, clientY, v);
    if (!picked) {
      return;
    }
    canvas.dataset.hue = String(picked.h);
    canvas.dataset.sat = String(picked.s);
    canvas.dataset.val = String(picked.v);
    updateCategoryZoneStylePreview();
  };

  canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    applyPick(event.clientX, event.clientY);
    const move = (e) => {
      applyPick(e.clientX, e.clientY);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  });

  els.saveCategoryZoneStyleButton?.addEventListener("click", () => {
    applyCategoryZoneStyleFromEditor();
  });
  els.closeCategoryZoneStyleButton?.addEventListener("click", () => {
    closeCategoryZoneStyleEditor();
  });
  els.categoryZoneStyleModal?.addEventListener("click", (event) => {
    if (event.target === els.categoryZoneStyleModal) {
      closeCategoryZoneStyleEditor();
    }
  });
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
    const entries = filteredEntries.filter((entry) => wordBelongsToCategory(entry.key, category.id));

    const section = document.createElement("section");
    section.className = "word-category";
    section.dataset.categoryId = category.id;

    const header = document.createElement("div");
    header.className = "word-category-header";

    if (category.id !== DEFAULT_CATEGORY_ID) {
      const zoneHandle = document.createElement("span");
      zoneHandle.className = "word-category-zone-handle";
      zoneHandle.draggable = true;
      zoneHandle.title = "Drag onto the mixing field to place a circular category zone";
      zoneHandle.textContent = "◎";
      zoneHandle.setAttribute("role", "button");
      zoneHandle.tabIndex = 0;
      zoneHandle.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setStatus("Drag the ◎ handle onto the field to place a zone.", "ok");
        }
      });
      zoneHandle.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("application/x-category-zone-category-id", category.id);
        event.dataTransfer.effectAllowed = "copy";
      });
      header.append(zoneHandle);
    }

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
      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "ghost-button word-category-edit";
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => {
        openCategoryZoneStyleEditor(category.id);
      });
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "ghost-button word-category-delete";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        deleteCategory(category.id);
      });
      actions.append(editButton, deleteButton);
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
      const set = getCategoryAssignmentSet(wordKey);
      if (category.id === DEFAULT_CATEGORY_ID) {
        set.clear();
      } else {
        set.add(category.id);
      }
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
  if (tab === "tokens") {
    tab = "words";
    markTokenRewardsSeen();
  }
  state.activeSidebarTab = tab;
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
  if (tile.pendingBan) {
    setStatus(`${titleCase(tile.word)} already has a Ban line. Mix with it to strike the result from the pool.`, "ok");
    return;
  }
  if (state.availableBanWordTokens <= 0) {
    setStatus("You do not have any ban-word tokens yet.", "error");
    return;
  }

  state.availableBanWordTokens -= 1;
  tile.pendingBan = true;
  renderSidebar();
  renderTiles();
  queueProgressSave();
  setStatus(`${titleCase(tile.word)} is charged with a Ban line: the next mix using it strikes the mix result from the pool (no spawn, no discovery).`, "reward");
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
    coinReward,
    newNegativeMixTokens,
    newBanWordTokens,
    newWildcardTokens,
    newPositionTokenRewards,
    newZonesUnlocked,
    completedCategories,
    questResult,
    vocabularyOverflow,
  } = rememberResult(randomWord.word, randomWord.normalized, { zipf: randomWord.zipf });
  spawnWordOnField(canonicalResult, position);
  const status = getWildcardOutcomeMessage(
    canonicalResult,
    isInEncyclopedia,
    wasDiscovered,
    {
      coinReward,
      newNegativeMixTokens,
      newBanWordTokens,
      newWildcardTokens,
      newPositionTokenRewards,
      newZonesUnlocked,
      completedCategories,
      questResult,
    },
  );
  applyOutcomeStatus(status, { vocabularyOverflow, questResult });
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

function getTokenDockEmoji(dragType) {
  if (dragType === "minus-mix") {
    return "➖";
  }
  if (dragType === "ban-word") {
    return "🚫";
  }
  if (dragType === "wildcard") {
    return "🃏";
  }
  const rank = getPositionTokenRankFromDragType(dragType);
  if (rank === 2) {
    return "2️⃣";
  }
  if (rank === 3) {
    return "3️⃣";
  }
  if (rank === 4) {
    return "4️⃣";
  }
  if (rank === 5) {
    return "5️⃣";
  }
  return "●";
}

function buildTokenDockPill({
  title,
  description,
  count,
  dragType = null,
  onClick = null,
}) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "token-dock-pill";
  button.draggable = Boolean(dragType);
  button.title = `${title}: ${description}`;
  button.setAttribute("aria-label", `${title}, ${count} remaining. ${description}`);
  const emoji = getTokenDockEmoji(dragType);
  button.innerHTML = `
    <span class="token-dock-pill-emoji" aria-hidden="true">${emoji}</span>
    <span class="token-dock-pill-count">×${count}</span>
  `;

  if (onClick) {
    button.addEventListener("click", () => {
      markTokenRewardsSeen();
      onClick();
    });
  } else {
    button.addEventListener("click", () => {
      markTokenRewardsSeen();
    });
  }

  if (dragType) {
    button.addEventListener("dragstart", (event) => {
      markTokenRewardsSeen();
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
  if (!els.tokenDock || !els.tokenDockOuter) {
    return;
  }

  els.tokenDock.innerHTML = "";
  const tokensUnlocked = hasUnlockedAnyTokenType();
  els.tokenDockOuter.hidden = !tokensUnlocked;

  if (!tokensUnlocked) {
    return;
  }

  if (getTotalUsableTokenCount() <= 0) {
    const empty = document.createElement("p");
    empty.className = "token-dock-empty";
    empty.textContent = "No unused tokens right now.";
    els.tokenDock.append(empty);
    return;
  }

  if (state.availableNegativeMixTokens > 0) {
    els.tokenDock.append(buildTokenDockPill({
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
    els.tokenDock.append(buildTokenDockPill({
      title: "Ban Word",
      description: "Drag onto a field word to charge a Ban line. Your next mix using that word strikes the result from the pool (no tile, no discovery).",
      count: state.availableBanWordTokens,
      dragType: "ban-word",
      onClick: () => {
        setStatus("Drag a Ban Word token onto a field word to charge a Ban line.", "ok");
      },
    }));
  }

  if (state.availableWildcardTokens > 0) {
    els.tokenDock.append(buildTokenDockPill({
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

    els.tokenDock.append(buildTokenDockPill({
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

function getShopItemPurchaseState(item) {
  if (item.id === "shop-word-booster" && hasPendingShopWordBooster()) {
    return {
      canBuy: !state.shopWordBooster.isLoading,
      reason: state.shopWordBooster.isLoading ? "Rolling words..." : "",
    };
  }
  const itemCost = getShopItemCost(item);
  if (state.coins < itemCost) {
    return {
      canBuy: false,
      reason: `Need ${itemCost - state.coins} more coins.`,
    };
  }
  if (!item.canPurchase()) {
    if (item.id === "shop-word-booster") {
      return {
        canBuy: false,
        reason: "Rolling words...",
      };
    }
    if (item.id === "shop-quest-turn") {
      return {
        canBuy: false,
        reason: state.quest.isLost ? "Quest already failed." : "No active quest.",
      };
    }
    if (item.id === "shop-playfield-pan-zoom") {
      return {
        canBuy: false,
        reason: getPlayfieldUpgradeTier() >= 1 ? "Already unlocked." : "Unavailable right now.",
      };
    }
    if (item.id === "shop-playfield-expand") {
      const tier = getPlayfieldUpgradeTier();
      if (tier < 1) {
        return { canBuy: false, reason: "Buy Field Pan & Zoom first." };
      }
      if (tier >= 2) {
        return { canBuy: false, reason: "Already purchased." };
      }
      return { canBuy: false, reason: "Unavailable right now." };
    }
    if (item.id === "shop-playfield-expand-2") {
      const tier = getPlayfieldUpgradeTier();
      if (tier < 1) {
        return { canBuy: false, reason: "Buy Field Pan & Zoom first." };
      }
      if (tier < 2) {
        return { canBuy: false, reason: "Buy the first +50% expansion first." };
      }
      if (tier >= 3) {
        return { canBuy: false, reason: "Already purchased." };
      }
      return { canBuy: false, reason: "Unavailable right now." };
    }
    return {
      canBuy: false,
      reason: "Unavailable right now.",
    };
  }
  return {
    canBuy: true,
    reason: "",
  };
}

async function purchaseShopItem(itemId) {
  const item = SHOP_ITEM_DEFINITIONS.find((entry) => entry.id === itemId);
  if (!item) {
    return;
  }

  const purchaseState = getShopItemPurchaseState(item);
  if (!purchaseState.canBuy) {
    setStatus(purchaseState.reason, "error");
    return;
  }
  const itemCost = getShopItemCost(item);

  const isWordBooster = item.id === "shop-word-booster";
  if (isWordBooster) {
    const willRollNewBooster = !hasPendingShopWordBooster();
    state.shopWordBooster.isLoading = true;
    renderSidebar();
    try {
      const message = await item.purchase();
      if (willRollNewBooster) {
        state.coins -= itemCost;
        recordIncrementalShopPurchase(item.id);
      }
      renderSidebar();
      queueProgressSave();
      setStatus(message, "reward");
    } catch (error) {
      setStatus(error.message || "Could not buy that shop item.", "error");
    } finally {
      state.shopWordBooster.isLoading = false;
      renderSidebar();
    }
    return;
  }

  try {
    const message = await item.purchase();
    state.coins -= itemCost;
    recordIncrementalShopPurchase(item.id);
    if (item.id === "shop-playfield-pan-zoom"
      || item.id === "shop-playfield-expand"
      || item.id === "shop-playfield-expand-2") {
      refreshPlayfieldAfterTierUpgrade();
    }
    renderSidebar();
    queueProgressSave();
    setStatus(message, "reward");
  } catch (error) {
    setStatus(error.message || "Could not buy that shop item.", "error");
  }
}

function closePurchaseTokensMenu() {
  if (els.purchaseTokensMenu) {
    els.purchaseTokensMenu.hidden = true;
  }
  if (els.purchaseTokensRoot) {
    els.purchaseTokensRoot.classList.remove("is-open");
  }
  if (els.purchaseTokensToggle) {
    els.purchaseTokensToggle.setAttribute("aria-expanded", "false");
  }
}

function openPurchaseTokensMenu() {
  if (els.purchaseTokensMenu) {
    els.purchaseTokensMenu.hidden = false;
  }
  if (els.purchaseTokensRoot) {
    els.purchaseTokensRoot.classList.add("is-open");
  }
  if (els.purchaseTokensToggle) {
    els.purchaseTokensToggle.setAttribute("aria-expanded", "true");
  }
}

function togglePurchaseTokensMenu() {
  if (!els.purchaseTokensMenu) {
    return;
  }
  if (els.purchaseTokensMenu.hidden) {
    openPurchaseTokensMenu();
  } else {
    closePurchaseTokensMenu();
  }
}

function renderTopBarShop() {
  if (!els.purchaseTokensMenu || !els.wordBoosterTopButton) {
    return;
  }

  els.purchaseTokensMenu.innerHTML = "";
  SHOP_ITEM_DEFINITIONS.filter((item) => SHOP_ITEM_IDS_PURCHASE_TOKENS_MENU.has(item.id)).forEach((item) => {
    const purchaseState = getShopItemPurchaseState(item);
    const itemCost = getShopItemCost(item);
    const row = document.createElement("button");
    row.type = "button";
    row.className = "purchase-tokens-menu-item";
    row.setAttribute("role", "option");
    row.disabled = !purchaseState.canBuy;
    const desc = getShopItemDescription(item);
    const hint = [desc, purchaseState.reason].filter(Boolean).join(" ");
    row.title = hint;
    const titleSpan = document.createElement("span");
    titleSpan.className = "purchase-tokens-menu-item-title";
    titleSpan.textContent = item.title;
    const costSpan = document.createElement("span");
    costSpan.className = "purchase-tokens-menu-item-cost";
    costSpan.textContent = `${itemCost}G`;
    row.append(titleSpan, costSpan);
    row.addEventListener("click", async () => {
      if (row.disabled) {
        return;
      }
      closePurchaseTokensMenu();
      await purchaseShopItem(item.id);
    });
    els.purchaseTokensMenu.append(row);
  });

  const booster = SHOP_ITEM_DEFINITIONS.find((entry) => entry.id === "shop-word-booster");
  if (booster) {
    const boosterState = getShopItemPurchaseState(booster);
    const boosterCost = getShopItemCost(booster);
    if (els.wordBoosterCost) {
      els.wordBoosterCost.textContent = boosterCost.toString();
    }
    els.wordBoosterTopButton.disabled = !boosterState.canBuy;
    const pending = hasPendingShopWordBooster();
    els.wordBoosterTopButton.title = pending
      ? "Open your pending Word Booster picks."
      : (boosterState.reason || `Buy for ${boosterCost} coins.`);
  }
}

function renderUpgradePanel() {
  els.upgradeList.innerHTML = "";

  SHOP_ITEM_DEFINITIONS.filter(
    (item) => SHOP_ITEM_IDS_SIDEBAR_SHOP.has(item.id) && isSidebarShopUpgradeVisible(item),
  ).forEach((item) => {
    const purchaseState = getShopItemPurchaseState(item);
    const itemCost = getShopItemCost(item);

    const card = document.createElement("article");
    card.className = "upgrade-card";

    const head = document.createElement("div");
    head.className = "upgrade-card-head";

    const titleWrap = document.createElement("div");
    titleWrap.className = "upgrade-card-title";

    const title = document.createElement("div");
    title.className = "upgrade-card-name";
    title.textContent = item.title;

    titleWrap.append(title);
    head.append(titleWrap);

    const price = document.createElement("div");
    price.className = "upgrade-cost";
    price.textContent = itemCost.toString();
    head.append(price);

    const blurb = document.createElement("p");
    blurb.className = "upgrade-card-text";
    blurb.textContent = getShopItemDescription(item);

    const effect = document.createElement("p");
    effect.className = "upgrade-card-effect";
    effect.textContent = purchaseState.reason;
    effect.hidden = !purchaseState.reason;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "upgrade-buy-button";
    button.disabled = !purchaseState.canBuy;
    button.textContent = `Buy for ${itemCost} coins`;
    button.addEventListener("click", () => {
      purchaseShopItem(item.id);
    });

    card.append(head, blurb, effect, button);
    els.upgradeList.append(card);
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
  const isWordTabActive = state.activeSidebarTab === "words";
  const isUpgradeTabActive = state.activeSidebarTab === "upgrades";
  els.sidebarTitle.textContent = isUpgradeTabActive ? "Shop" : "Word Panel";
  els.openWordTabButton.setAttribute("aria-selected", isWordTabActive ? "true" : "false");
  els.openUpgradesTabButton.setAttribute("aria-selected", isUpgradeTabActive ? "true" : "false");
  els.sidebarPanels.forEach((panel) => {
    panel.hidden = panel.dataset.sidebarPanel !== state.activeSidebarTab;
  });
  els.toggleGooglePickButton.hidden = !isWordTabActive;
  els.toggleGooglePickButton.setAttribute("aria-pressed", state.googlePickMode ? "true" : "false");
  renderTopBarShop();
  renderWordList();
  renderTokenPanel();
  els.tokenDockOuter?.classList.toggle("token-dock-flashing", shouldFlashTokenDock());
  renderUpgradePanel();
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
    coinReward = null,
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
    message = `${message} ${getQuestCompletionMessage(questResult)}`;
    stateName = "reward";
  }

  const coinRewardText = getCoinRewardText(coinReward);
  if (coinRewardText) {
    message = `${message} ${coinRewardText}`;
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
    message = appendNewPlayfieldZonesNotice(message, newZonesUnlocked);
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

function getQuestCompletionMessage(questResult) {
  if (!questResult?.completedQuest) {
    return "";
  }

  let rewardText = `${questResult.questTotalCoins} coins`;
  if (questResult.questSpeedBonusCoins > 0) {
    rewardText = `${rewardText}, including a ${questResult.questSpeedBonusCoins}-coin speed bonus for finishing in ${questResult.turnsTaken} turns`;
  }

  if (questResult.completedEncyclopedia) {
    return `Quest complete: you found ${titleCase(questResult.completedTargetWord)} and earned ${rewardText}. Encyclopedia complete. Run finished.`;
  }

  return `Quest complete: you found ${titleCase(questResult.completedTargetWord)} and earned ${rewardText}. Your next quest is ${titleCase(questResult.nextTargetWord)} and you lose in ${questResult.remainingDiscoveries} turns.`;
}

function getWildcardOutcomeMessage(
  canonicalResult,
  isInEncyclopedia,
  wasDiscovered,
  {
    coinReward = null,
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
    message = `${message} ${getQuestCompletionMessage(questResult)}`;
    stateName = "reward";
  }

  const coinRewardText = getCoinRewardText(coinReward);
  if (coinRewardText) {
    message = `${message} ${coinRewardText}`;
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
    message = appendNewPlayfieldZonesNotice(message, newZonesUnlocked);
    stateName = "reward";
  }

  if (questResult?.failedQuest) {
    message = `${message} The quest timer hit 0 before you found ${titleCase(questResult.completedTargetWord)}.`;
    stateName = "error";
  }

  return { message, stateName };
}

function getSpawnWordOutcomeMessage(
  canonicalResult,
  isInEncyclopedia,
  wasDiscovered,
  {
    coinReward = null,
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

  if (wasDiscovered) {
    message = `Spawned ${titleCase(canonicalResult)} onto the field. It was already in your discovered words.`;
    stateName = "ok";
  } else if (isInEncyclopedia) {
    message = `Spawned ${titleCase(canonicalResult)} onto the field and added it to the encyclopedia.`;
    stateName = "success";
  } else {
    message = `Spawned ${titleCase(canonicalResult)} onto the field and added it to your discovered words.`;
    stateName = "success";
  }

  if (completedCategories.length > 0) {
    const categoryLabel = completedCategories.join(" and ");
    const categorySuffix = completedCategories.length === 1 ? "category" : "categories";
    message = `${message} You completed the ${categoryLabel} encyclopedia ${categorySuffix}.`;
    stateName = "reward";
  }

  if (questResult?.completedQuest) {
    message = `${message} ${getQuestCompletionMessage(questResult)}`;
    stateName = "reward";
  }

  const coinRewardText = getCoinRewardText(coinReward);
  if (coinRewardText) {
    message = `${message} ${coinRewardText}`;
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
    message = appendNewPlayfieldZonesNotice(message, newZonesUnlocked);
    stateName = "reward";
  }

  if (questResult?.failedQuest) {
    message = `${message} The quest timer hit 0 before you found ${titleCase(questResult.completedTargetWord)}.`;
    stateName = "error";
  }

  return { message, stateName };
}

function getShopWordBoosterOutcomeMessage(
  canonicalResult,
  isInEncyclopedia,
  wasDiscovered,
  {
    coinReward = null,
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

  if (wasDiscovered) {
    message = `Word Booster revealed ${titleCase(canonicalResult)}, but it was already discovered.`;
    stateName = "ok";
  } else if (isInEncyclopedia) {
    message = `Word Booster discovered ${titleCase(canonicalResult)} and added it to the encyclopedia.`;
    stateName = "success";
  } else {
    message = `Word Booster discovered ${titleCase(canonicalResult)} and added it to your available words.`;
    stateName = "success";
  }

  if (completedCategories.length > 0) {
    const categoryLabel = completedCategories.join(" and ");
    const categorySuffix = completedCategories.length === 1 ? "category" : "categories";
    message = `${message} You completed the ${categoryLabel} encyclopedia ${categorySuffix}.`;
    stateName = "reward";
  }

  if (questResult?.completedQuest) {
    message = `${message} ${getQuestCompletionMessage(questResult)}`;
    stateName = "reward";
  }

  const coinRewardText = getCoinRewardText(coinReward);
  if (coinRewardText) {
    message = `${message} ${coinRewardText}`;
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
    message = appendNewPlayfieldZonesNotice(message, newZonesUnlocked);
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
    pendingBan: false,
    x: clamp(x, bounds.minX, bounds.maxX),
    y: clamp(y, bounds.minY, bounds.maxY),
    zIndex: state.nextZIndex,
    tiltDeg: randomTileTiltDeg(),
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
  requestTilePaperSettle(newTile.id);
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
  const noticePoint = clientPoint || getClientPointForWorldPosition(position);
  const selfTile = tileId ? getTileById(tileId) : state.tiles.find((t) => t.word.toLowerCase() === word.toLowerCase()) || null;
  if (resolvePendingBanMixIfNeeded({
    firstTile: selfTile,
    secondTile: selfTile,
    operation: "add",
    leftWord: word,
    rightWord: word,
    selection,
    clientPoint: noticePoint,
  })) {
    return;
  }
  const {
    canonicalResult,
    isInEncyclopedia,
    wasDiscovered,
    coinReward,
    newNegativeMixTokens,
    newBanWordTokens,
    newWildcardTokens,
    newPositionTokenRewards,
    newZonesUnlocked,
    completedCategories,
    questResult,
    vocabularyOverflow,
  } = rememberResult(selectedCandidate.word, selectedCandidate.normalized, {
    zipf: selectedCandidate.zipf,
    fromMix: true,
  });
  markWordAsSelfMatched(word);
  recordMatch(word, word, canonicalResult, "add", selection.candidates, selectedCandidate.word);
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
      coinReward,
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
      coinReward,
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
  applyOutcomeStatus(status, { vocabularyOverflow, questResult });
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
  if (resolvePendingBanMixIfNeeded({
    firstTile,
    secondTile,
    operation: "add",
    leftWord: firstTile.word,
    rightWord: secondTile.word,
    selection,
    clientPoint,
  })) {
    return;
  }
  const {
    canonicalResult,
    isInEncyclopedia,
    wasDiscovered,
    coinReward,
    newNegativeMixTokens,
    newBanWordTokens,
    newWildcardTokens,
    newPositionTokenRewards,
    newZonesUnlocked,
    completedCategories,
    questResult,
    vocabularyOverflow,
  } = rememberResult(selectedCandidate.word, selectedCandidate.normalized, {
    zipf: selectedCandidate.zipf,
    fromMix: true,
  });
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
        coinReward,
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
        coinReward,
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
  applyOutcomeStatus(status, { vocabularyOverflow, questResult });
}

function rememberResult(result, normalized = result, metadata = {}) {
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
  let coinReward = null;
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

  if (didDiscoverNewWord && metadata.fromMix) {
    applyAutoBanForNewMixDiscovery(canonicalResult);
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
    coinReward = awardDiscoveryCoins({
      zipf: metadata?.zipf,
      isInEncyclopedia,
    });
    const randomDiscoveryReward = awardRandomDiscoveryToken();
    newWildcardTokens += randomDiscoveryReward.newWildcardTokens;
    POSITION_TOKEN_RANKS.forEach((rank) => {
      newPositionTokenRewards[rank] += getSafeCount(randomDiscoveryReward.newPositionTokenRewards?.[rank]);
    });
  }

  questResult = advanceQuest(canonicalResult, {
    didDiscoverNewWord,
    questMatchedWord: discoveryKey,
    countQuestDiscoveryTurn: metadata.countQuestDiscoveryTurn !== false,
  });
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


  const vocabularyOverflow = null;

  if (didDiscoverNewWord || coinReward || totalNewNegativeMixTokens > 0 || newBanWordTokens > 0 || newWildcardTokens > 0 || totalNewPositionTokens > 0) {
    renderSidebar();
  }

  return {
    canonicalResult,
    isInEncyclopedia,
    wasDiscovered,
    coinReward,
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
  const negTileA = Number.isFinite(state.negativeMixSources.a) ? getTileById(state.negativeMixSources.a) : null;
  const negTileB = Number.isFinite(state.negativeMixSources.b) ? getTileById(state.negativeMixSources.b) : null;
  if (resolvePendingBanMixIfNeeded({
    firstTile: negTileA,
    secondTile: negTileB,
    operation: "subtract",
    leftWord: state.negativeMix.a,
    rightWord: state.negativeMix.b,
    selection,
    clientPoint,
  })) {
    hideNegativeMixAfterUse();
    return;
  }
  const {
    canonicalResult,
    isInEncyclopedia,
    wasDiscovered,
    coinReward,
    newNegativeMixTokens,
    newBanWordTokens,
    newWildcardTokens,
    newPositionTokenRewards,
    newZonesUnlocked,
    completedCategories,
    questResult,
    vocabularyOverflow,
  } = rememberResult(selectedCandidate.word, selectedCandidate.normalized, {
    zipf: selectedCandidate.zipf,
    fromMix: true,
    countQuestDiscoveryTurn: false,
  });
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
        coinReward,
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
        coinReward,
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
  applyOutcomeStatus(status, { vocabularyOverflow, questResult });
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
  if (getPlayfieldUpgradeTier() < 1) {
    return;
  }
  if (event.target.closest(".tile, .negative-mix-panel, .category-zone-widget")) {
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
      renderTiles({ skipWordListRefresh: true });
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
      clearDragMixPreview();
    }

    const bounds = getPlayfieldBounds();
    const localPoint = getPlayfieldPointFromClientPoint(moveEvent.clientX, moveEvent.clientY, bounds);
    tile.x = clamp(localPoint.x - pointerOffsetX, bounds.minX, bounds.maxX);
    tile.y = clamp(localPoint.y - pointerOffsetY, bounds.minY, bounds.maxY);
    tileElement.style.left = `${tile.x}px`;
    tileElement.style.top = `${tile.y}px`;

    const targetTile = findMixTarget(tile);
    if (targetTile) {
      void updateDragMixPreview(tile, targetTile, {
        x: moveEvent.clientX,
        y: moveEvent.clientY,
      });
    } else {
      clearDragMixPreview();
    }
  };

  const end = async (endEvent) => {
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerup", end);
    tileElement.classList.remove("dragging");
    clearDragMixPreview();

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

    maybeNudgeTileTiltAfterPointerDrop(tile);
    requestTilePaperSettle(tile.id);
    renderTiles();
  };

  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", end, { once: true });
}

function renderTiles(options = {}) {
  const skipCategoryZoneRender = Boolean(options.skipCategoryZoneRender);
  const skipWordListRefresh = Boolean(options.skipWordListRefresh);

  els.playfieldSurface.querySelectorAll(".tile").forEach((tile) => tile.remove());
  syncWordAssignmentsFromCategoryZones();
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
      tileElement.dataset.pendingBan = tile.pendingBan ? "true" : "false";
      tileElement.style.left = `${tile.x}px`;
      tileElement.style.top = `${tile.y}px`;
      tileElement.style.zIndex = String(Math.min(tile.zIndex, NEGATIVE_MIX_Z_INDEX - 1));
      tileElement.style.setProperty("--tile-tilt", `${clampStoredTileTiltDeg(tile.tiltDeg).toFixed(2)}deg`);

      const tint = getCategoryZoneTintForTile(tile);
      if (tint?.color) {
        const rgb = hexToRgbTuple(tint.color);
        if (rgb) {
          tileElement.dataset.zoneTint = "true";
          tileElement.style.setProperty(
            "--tile-zone-overlay",
            `rgba(${rgb.r},${rgb.g},${rgb.b},${clamp(tint.opacity, 0, 1)})`,
          );
        }
      } else {
        delete tileElement.dataset.zoneTint;
        tileElement.style.removeProperty("--tile-zone-overlay");
      }
      if (tileIdsNeedingPaperSettle.has(tile.id)) {
        tileIdsNeedingPaperSettle.delete(tile.id);
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          tileElement.classList.add("tile--paper-settle");
          tileElement.addEventListener("animationend", (event) => {
            if (event.target === tileElement && event.animationName === "tile-paper-settle") {
              tileElement.classList.remove("tile--paper-settle");
            }
          }, { once: true });
        }
      }
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

      const banLineElement = document.createElement("div");
      banLineElement.className = "tile-ban-line";
      banLineElement.textContent = "Ban line";
      banLineElement.hidden = !tile.pendingBan;

      const metaElement = document.createElement("div");
      metaElement.className = "tile-meta";
      const tintLabel = tint?.categoryName || "";
      metaElement.textContent = tintLabel;
      metaElement.hidden = !tintLabel;

      tileElement.append(tagElement, banLineElement, wordElement, metaElement);
      els.playfieldSurface.append(tileElement);
    });

  if (!skipCategoryZoneRender) {
    renderCategoryZones();
  }
  if (!skipWordListRefresh) {
    renderWordList();
  }
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

function renderShopWordBooster() {
  els.shopWordBoosterGrid.innerHTML = "";
  state.shopWordBooster.options.forEach((entry) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "shop-word-booster-option";
    button.textContent = titleCase(entry.word);
    button.addEventListener("click", () => {
      const {
        canonicalResult,
        isInEncyclopedia,
        wasDiscovered,
        coinReward,
        newNegativeMixTokens,
        newBanWordTokens,
        newWildcardTokens,
        newPositionTokenRewards,
        newZonesUnlocked,
        completedCategories,
        questResult,
        vocabularyOverflow,
      } = rememberResult(entry.word, entry.normalized, { zipf: entry.zipf });
      state.shopWordBooster.options = [];
      state.shopWordBooster.isOpen = false;
      state.activeSidebarTab = "words";
      els.shopWordBoosterModal.hidden = true;
      renderSidebar();
      queueProgressSave();
      const status = getShopWordBoosterOutcomeMessage(canonicalResult, isInEncyclopedia, wasDiscovered, {
        coinReward,
        newNegativeMixTokens,
        newBanWordTokens,
        newWildcardTokens,
        newPositionTokenRewards,
        newZonesUnlocked,
        completedCategories,
        questResult,
      });
      applyOutcomeStatus(status, { vocabularyOverflow, questResult });
    });
    els.shopWordBoosterGrid.append(button);
  });
}

function openShopWordBooster() {
  state.shopWordBooster.isOpen = true;
  renderShopWordBooster();
  els.shopWordBoosterModal.hidden = false;
}

function closeShopWordBooster() {
  state.shopWordBooster.isOpen = false;
  els.shopWordBoosterModal.hidden = true;
  renderSidebar();
  queueProgressSave();
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

async function promptSpawnWord() {
  const requestedWord = window.prompt("Spawn which word?");
  if (requestedWord === null) {
    return;
  }

  const trimmedWord = requestedWord.trim().toLowerCase();
  if (!trimmedWord) {
    setStatus("Enter a word to spawn.", "error");
    return;
  }

  const candidate = await getSpawnWordCandidate(trimmedWord);
  const {
    canonicalResult,
    isInEncyclopedia,
    wasDiscovered,
    coinReward,
    newNegativeMixTokens,
    newBanWordTokens,
    newWildcardTokens,
    newPositionTokenRewards,
    newZonesUnlocked,
    completedCategories,
    questResult,
    vocabularyOverflow,
  } = rememberResult(candidate.word, candidate.normalized, { zipf: candidate.zipf });

  spawnWordOnField(canonicalResult);
  closeSettings();

  const status = getSpawnWordOutcomeMessage(canonicalResult, isInEncyclopedia, wasDiscovered, {
    coinReward,
    newNegativeMixTokens,
    newBanWordTokens,
    newWildcardTokens,
    newPositionTokenRewards,
    newZonesUnlocked,
    completedCategories,
    questResult,
  });
  applyOutcomeStatus(status, { vocabularyOverflow, questResult });
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
  state.starters.forEach((word) => {
    getRemovalKeysForWord(word).forEach((key) => state.removedResultWords.add(key));
  });
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
  state.wordAssignments = new Map(state.starters.map((word) => [word, new Set()]));
  state.categoryZones = [];
  state.recentDiscoveredWordKeys = [];
  state.googlePickMode = false;
  state.clickTracker.word = null;
  state.clickTracker.time = 0;
  state.availableNegativeMixTokens = 0;
  state.totalNegativeMixTokensEarned = 0;
  state.progressNegativeMixTokensAwarded = 0;
  state.coins = 0;
  state.totalCoinsEarned = 0;
  state.purchasedUpgrades = createDefaultPurchasedUpgradeState();
  state.shopPurchaseCounts = {};
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
  state.quest.number = 1;
  state.quest.isWon = false;
  state.shopWordBooster.isOpen = false;
  state.shopWordBooster.isLoading = false;
  state.shopWordBooster.options = [];
  assignNewQuest({ initial: true });
  state.nextTileId = 1;
  state.nextZIndex = 1;
  els.wordSearch.value = "";
  els.shopWordBoosterModal.hidden = true;
  els.questWinModal.hidden = true;

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
    `New game started with ${starterSummary}. Those starters are struck from the mix-result pool. Your first quest is ${titleCase(state.quest.targetWord)} and you lose in ${state.quest.remainingDiscoveries} turns if you do not find it.`,
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
      setStatus("Drop a Ban Word token onto a word on the field to charge a Ban line.", "error");
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

    const zoneCategoryId = event.dataTransfer.getData("application/x-category-zone-category-id");
    if (zoneCategoryId && getCategoryById(zoneCategoryId)) {
      const worldPoint = getPlayfieldWorldPointFromClient(event.clientX, event.clientY);
      addCategoryZoneAtPoint(zoneCategoryId, worldPoint);
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
  if (els.purchaseTokensToggle) {
    els.purchaseTokensToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      togglePurchaseTokensMenu();
    });
  }
  document.addEventListener("click", (event) => {
    if (els.purchaseTokensRoot && !els.purchaseTokensRoot.contains(event.target)) {
      closePurchaseTokensMenu();
    }
  }, true);
  if (els.wordBoosterTopButton) {
    els.wordBoosterTopButton.addEventListener("click", () => {
      purchaseShopItem("shop-word-booster");
    });
  }

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
  els.openUpgradesTabButton.addEventListener("click", () => {
    setActiveSidebarTab("upgrades");
  });
  if (els.tokenDockOuter) {
    els.tokenDockOuter.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".token-tooltip-bubble")) {
        return;
      }
      markTokenRewardsSeen();
    });
  }
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
  if (els.openHistoryButton) {
    els.openHistoryButton.addEventListener("click", openHistory);
  }
  els.closeHistoryButton.addEventListener("click", closeHistory);
  els.openSettingsButton.addEventListener("click", openSettings);
  els.closeSettingsButton.addEventListener("click", closeSettings);
  els.closeShopWordBoosterButton.addEventListener("click", closeShopWordBooster);
  els.spawnWordButton.addEventListener("click", async () => {
    try {
      await promptSpawnWord();
    } catch (error) {
      setStatus(error.message, "error");
    }
  });
  els.exportSaveButton.addEventListener("click", exportSaveSnapshot);
  els.importSaveButton.addEventListener("click", promptSaveImport);
  els.questTryAgainButton.addEventListener("click", resetRun);
  els.questGoAgainButton.addEventListener("click", resetRun);
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
  els.shopWordBoosterModal.addEventListener("click", (event) => {
    if (event.target === els.shopWordBoosterModal) {
      closeShopWordBooster();
    }
  });

  els.playfield.addEventListener("wheel", (event) => {
    if (getPlayfieldUpgradeTier() < 1) {
      return;
    }
    event.preventDefault();
    const direction = event.deltaY > 0 ? -1 : 1;
    adjustPlayfieldZoom(direction * PLAYFIELD_ZOOM_STEP);
  }, { passive: false });
  els.playfield.addEventListener("pointerdown", startPlayfieldPan);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && els.purchaseTokensRoot && els.purchaseTokensRoot.classList.contains("is-open")) {
      closePurchaseTokensMenu();
    }
    if (event.key === "Escape" && !els.historyModal.hidden) {
      closeHistory();
    }
    if (event.key === "Escape" && !els.encyclopediaModal.hidden) {
      closeEncyclopedia();
    }
    if (event.key === "Escape" && !els.settingsModal.hidden) {
      closeSettings();
    }
    if (event.key === "Escape" && !els.shopWordBoosterModal.hidden) {
      closeShopWordBooster();
    }
    if (event.key === "Escape" && els.categoryZoneStyleModal && !els.categoryZoneStyleModal.hidden) {
      closeCategoryZoneStyleEditor();
    }
  });

  window.addEventListener("resize", () => {
    clampTilesToPlayfieldBounds();
    updatePlayfieldCamera();
    renderTiles({ skipWordListRefresh: true });
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
  initCategoryZoneStyleEditor();
}

function init() {
  initEvents();
  if (!loadProgress()) {
    resetRun();
  }
}

init();
