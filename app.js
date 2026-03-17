import { patternToText, scoreCards } from "./engine.js";
import { HANDS } from "./hands.js";

const ROUND_TARGETS = Array.from({ length: 10 }, (_, index) => 1000 + (index * 500));

const state = {
  allCards: [],
  deck: [],
  categoryPool: [],
  roundDrawPile: [],
  hand: [],
  playZone: [],
  currentBooster: [],
  selectedCategory: "",
  deckViewerOpen: false,
  startingCategories: [],
  roundScore: 0,
  handsRemaining: 4,
  discardsRemaining: 10,
  currentRound: 1,
  roundTarget: ROUND_TARGETS[0],
  roundTransitionPending: false,
  roundEnded: false,
};

const els = {
  status: document.querySelector("[data-status]"),
  deckButton: document.querySelector("[data-action='toggle-deck']"),
  deckCount: document.querySelector("[data-deck-count]"),
  currentRound: document.querySelector("[data-current-round]"),
  roundTarget: document.querySelector("[data-round-target]"),
  roundScore: document.querySelector("[data-round-score]"),
  handsRemaining: document.querySelector("[data-hands-remaining]"),
  discardsRemaining: document.querySelector("[data-discards-remaining]"),
  handCount: document.querySelector("[data-hand-count]"),
  playCount: document.querySelector("[data-play-count]"),
  dealButton: document.querySelector("[data-action='deal']"),
  clearButton: document.querySelector("[data-action='clear']"),
  buyButton: document.querySelector("[data-action='buy-cards']"),
  playHandButton: document.querySelector("[data-action='play-hand']"),
  categorySelect: document.querySelector("[data-category-select]"),
  handArea: document.querySelector("[data-hand-area]"),
  playArea: document.querySelector("[data-play-area]"),
  boosterArea: document.querySelector("[data-booster-area]"),
  deckPanel: document.querySelector("[data-deck-panel]"),
  deckList: document.querySelector("[data-deck-list]"),
  handName: document.querySelector("[data-hand-name]"),
  handMeta: document.querySelector("[data-hand-meta]"),
  handDescription: document.querySelector("[data-hand-description]"),
  handBanner: document.querySelector("[data-hand-banner]"),
  handBannerName: document.querySelector("[data-hand-banner-name]"),
  scoreValue: document.querySelector("[data-score-value]"),
  totalChips: document.querySelector("[data-total-chips]"),
  handMult: document.querySelector("[data-hand-mult]"),
  linkProduct: document.querySelector("[data-link-product]"),
  pattern: document.querySelector("[data-pattern]"),
  links: document.querySelector("[data-links]"),
  handsList: document.querySelector("[data-hands-list]"),
};

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function drawCards(count) {
  return state.roundDrawPile.splice(0, count);
}

function pickRandomBySuit(cards, suit, count, excludedKeys = new Set()) {
  const pool = shuffle(cards.filter((card) => card.suit === suit && !excludedKeys.has(getCardKey(card))));
  return pool.slice(0, count);
}

function sampleBalancedCards(cards, targets, excludedKeys = new Set()) {
  const selected = [];
  const localExcluded = new Set(excludedKeys);

  for (const [suit, count] of targets) {
    const picked = pickRandomBySuit(cards, suit, count, localExcluded);
    if (picked.length < count) {
      return null;
    }
    picked.forEach((card) => {
      selected.push(card);
      localExcluded.add(getCardKey(card));
    });
  }

  return selected;
}

function setStatus(message, isError = false) {
  els.status.textContent = message;
  els.status.dataset.state = isError ? "error" : "ok";
}

function canInteract() {
  return !state.roundTransitionPending && !state.roundEnded;
}

function getCardKey(card) {
  return `${card.id}::${card.suit}`;
}

function formatCategoryLabel(category) {
  return category
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function createCardElement(card, options = {}) {
  const displaySuit = options.displaySuit || card.suit;
  const cardEl = document.createElement("div");
  cardEl.className = `card suit-${displaySuit.toLowerCase()}`;
  if (options.isDynamicSuit) {
    cardEl.classList.add("card-dynamic-suit");
    cardEl.dataset.dynamicSuit = "true";
  }

  const wordEl = document.createElement("div");
  wordEl.className = "card-word";
  wordEl.textContent = card.id;

  const metaEl = document.createElement("div");
  metaEl.className = "card-meta";
  const categories = Array.isArray(card.categories) ? card.categories : ["none"];
  const categoryText = categories.map(formatCategoryLabel).join(", ");
  metaEl.textContent = `${displaySuit} | ${card.chips} chips | ${categoryText}`;

  cardEl.append(wordEl, metaEl);

  if (options.actions?.length) {
    const actionRow = document.createElement("div");
    actionRow.className = "card-actions";
    actionRow.style.gridTemplateColumns = `repeat(${options.actions.length}, 1fr)`;
    for (const action of options.actions) {
      const actionButton = document.createElement("button");
      actionButton.type = "button";
      actionButton.className = "card-action";
      actionButton.textContent = action.label;
      actionButton.disabled = Boolean(action.disabled);
      actionButton.addEventListener("click", action.onClick);
      actionRow.append(actionButton);
    }
    cardEl.append(actionRow);
  } else if (options.action) {
    const actionButton = document.createElement("button");
    actionButton.type = "button";
    actionButton.className = "card-action";
    actionButton.textContent = options.action.label;
    actionButton.addEventListener("click", options.action.onClick);
    cardEl.append(actionButton);
  }

  if (options.controls) {
    const controls = document.createElement("div");
    controls.className = "card-controls";
    for (const control of options.controls) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = control.label;
      button.disabled = Boolean(control.disabled);
      button.addEventListener("click", control.onClick);
      controls.append(button);
    }
    cardEl.append(controls);
  }

  return cardEl;
}

function renderHand() {
  els.handArea.innerHTML = "";

  if (state.hand.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No cards in hand. Deal a new hand or return cards from the chain.";
    els.handArea.append(empty);
    return;
  }

  state.hand.forEach((card, index) => {
    const cardEl = createCardElement(card, {
      actions: [
        {
          label: "Play",
          onClick: () => playCard(index),
          disabled: !canInteract(),
        },
        {
          label: "Discard",
          onClick: () => discardCard(index),
          disabled: state.discardsRemaining <= 0 || !canInteract(),
        },
      ],
    });
    els.handArea.append(cardEl);
  });
}

function renderPlayZone() {
  els.playArea.innerHTML = "";
  const breakdown = scoreCards(state.playZone);
  const dynamicSuitIndices = new Set(breakdown.dynamicSuitIndices);

  if (state.playZone.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Click cards from your hand to build a chain.";
    els.playArea.append(empty);
    return;
  }

  state.playZone.forEach((card, index) => {
    const controls = [
      {
        label: "Left",
        disabled: index === 0,
        onClick: () => moveCard(index, -1),
      },
      {
        label: "Right",
        disabled: index === state.playZone.length - 1,
        onClick: () => moveCard(index, 1),
      },
      {
        label: "Return",
        onClick: () => returnCard(index),
      },
    ];

    const wrapper = document.createElement("div");
    wrapper.className = "play-slot";
    wrapper.append(createCardElement(card, {
      controls,
      displaySuit: dynamicSuitIndices.has(index) ? "ADJ" : card.suit,
      isDynamicSuit: dynamicSuitIndices.has(index),
    }));

    if (index < state.playZone.length - 1) {
      const arrow = document.createElement("div");
      arrow.className = "play-arrow";
      arrow.textContent = "->";
      wrapper.append(arrow);
    }

    els.playArea.append(wrapper);
  });
}

function renderBooster() {
  els.boosterArea.innerHTML = "";

  if (state.currentBooster.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Choose a category and click Buy Cards to draft a 4-card booster.";
    els.boosterArea.append(empty);
    return;
  }

  state.currentBooster.forEach((card) => {
    const cardEl = createCardElement(card, {
      action: {
        label: "Pick This Card",
        onClick: () => addBoosterCard(card),
      },
    });
    els.boosterArea.append(cardEl);
  });
}

function renderDeckViewer() {
  els.deckPanel.dataset.open = state.deckViewerOpen ? "true" : "false";
  els.deckButton.setAttribute("aria-expanded", state.deckViewerOpen ? "true" : "false");
  els.deckList.innerHTML = "";

  if (!state.deckViewerOpen) {
    return;
  }

  const sortedDeck = [...state.deck].sort((a, b) => {
    if (a.suit !== b.suit) {
      return a.suit.localeCompare(b.suit);
    }
    return a.id.localeCompare(b.id);
  });

  sortedDeck.forEach((card) => {
    els.deckList.append(createCardElement(card));
  });
}

function renderScore() {
  const breakdown = scoreCards(state.playZone);
  const { hand, pattern, links, actualPattern, dynamicSuitIndices } = breakdown;

  els.handName.textContent = hand.name;
  els.handMeta.textContent = `${hand.named ? "Named hand" : "Fallback"} | x${breakdown.handMultiplier.toFixed(1)}`;
  els.handDescription.textContent = hand.description;
  els.handName.dataset.named = hand.named ? "true" : "false";
  els.handBanner.dataset.active = hand.named ? "true" : "false";
  els.handBannerName.textContent = hand.named ? `${hand.name} (${patternToText(pattern)})` : "None yet";
  els.scoreValue.textContent = breakdown.finalScore.toLocaleString();
  els.totalChips.textContent = breakdown.countedChips.toString();
  els.handMult.textContent = `x${breakdown.handMultiplier.toFixed(1)}`;
  els.linkProduct.textContent = `x${breakdown.linkProduct.toFixed(2)}`;
  els.pattern.textContent = patternToText(pattern);
  els.playHandButton.disabled = state.playZone.length === 0 || state.handsRemaining <= 0 || !canInteract();
  els.links.innerHTML = "";

  if (links.length === 0) {
    const item = document.createElement("li");
    item.textContent = "Add at least 2 cards to see link scores.";
    els.links.append(item);
    return;
  }

  links.forEach((link) => {
    const item = document.createElement("li");
    item.textContent = `${link.from} -> ${link.to} | sim ${link.similarity.toFixed(3)} | x${link.multiplier.toFixed(2)}`;
    els.links.append(item);
  });

  if (dynamicSuitIndices.length > 0) {
    const item = document.createElement("li");
    item.textContent = `Dynamic suit rule: ${patternToText(actualPattern)} counts as ${patternToText(pattern)} because a noun before a noun can act as an adjective.`;
    els.links.append(item);
  }

  if (!hand.named && breakdown.highestChipCardId) {
    const item = document.createElement("li");
    item.textContent = `Fallback rule: only ${breakdown.highestChipCardId} contributes chips; links still multiply.`;
    els.links.append(item);
  }
}

function renderHandsHelp() {
  els.handsList.innerHTML = "";
  HANDS.forEach((hand) => {
    const item = document.createElement("li");
    item.className = "help-list-item";

    const title = document.createElement("div");
    title.className = "help-hand-title";
    title.textContent = `${hand.name} | ${patternToText(hand.pattern)} | x${hand.baseMult.toFixed(1)}`;

    const description = document.createElement("div");
    description.className = "muted";
    description.textContent = hand.description;

    item.append(title, description);
    els.handsList.append(item);
  });
}

function renderCounts() {
  els.deckCount.textContent = state.deck.length.toString();
  els.currentRound.textContent = state.currentRound.toString();
  els.roundTarget.textContent = state.roundTarget.toLocaleString();
  els.roundScore.textContent = state.roundScore.toLocaleString();
  els.handsRemaining.textContent = state.handsRemaining.toString();
  els.discardsRemaining.textContent = state.discardsRemaining.toString();
  els.handCount.textContent = state.hand.length.toString();
  els.playCount.textContent = state.playZone.length.toString();
}

function render() {
  els.dealButton.disabled = state.roundTransitionPending;
  els.clearButton.disabled = !canInteract();
  els.buyButton.disabled = !canInteract();
  els.categorySelect.disabled = !canInteract();
  renderCounts();
  renderDeckViewer();
  renderHand();
  renderPlayZone();
  renderBooster();
  renderScore();
}

function playCard(index) {
  if (!canInteract()) {
    return;
  }
  const [card] = state.hand.splice(index, 1);
  state.playZone.push(card);
  render();
}

function returnCard(index) {
  if (!canInteract()) {
    return;
  }
  const [card] = state.playZone.splice(index, 1);
  state.hand.push(card);
  render();
}

function moveCard(index, delta) {
  if (!canInteract()) {
    return;
  }
  const target = index + delta;
  if (target < 0 || target >= state.playZone.length) {
    return;
  }

  [state.playZone[index], state.playZone[target]] = [state.playZone[target], state.playZone[index]];
  render();
}

function dealNewHand() {
  state.currentRound = 1;
  state.roundTarget = ROUND_TARGETS[0];
  startNewRound();
  setStatus(`Round 1 started. Target: ${state.roundTarget.toLocaleString()} points.`);
}

function drawUpToHandSize(targetSize = 7) {
  const missing = Math.max(0, targetSize - state.hand.length);
  if (missing === 0) {
    return;
  }
  state.hand.push(...drawCards(missing));
}

function startNewRound() {
  state.roundDrawPile = shuffle([...state.deck]);
  state.hand = [];
  state.playZone = [];
  state.roundScore = 0;
  state.handsRemaining = 4;
  state.discardsRemaining = 10;
  state.roundTransitionPending = false;
  state.roundEnded = false;
  drawUpToHandSize(7);
  render();
}

function discardCard(index) {
  if (!canInteract()) {
    return;
  }
  if (state.discardsRemaining <= 0) {
    setStatus("No discards left this round.", true);
    return;
  }

  const [card] = state.hand.splice(index, 1);
  state.discardsRemaining -= 1;
  drawUpToHandSize(7);
  render();
  setStatus(`Discarded ${card.id}.`);
}

function playCurrentHand() {
  if (!canInteract()) {
    return;
  }
  if (state.playZone.length === 0) {
    setStatus("Build a chain before playing a hand.", true);
    return;
  }
  if (state.handsRemaining <= 0) {
    setStatus("No hands left this round.", true);
    return;
  }

  const breakdown = scoreCards(state.playZone);
  state.roundScore += breakdown.finalScore;
  state.handsRemaining -= 1;
  state.playZone = [];
  drawUpToHandSize(7);
  render();
  setStatus(`Played for ${breakdown.finalScore.toLocaleString()} points. Round total: ${state.roundScore.toLocaleString()} / ${state.roundTarget.toLocaleString()}.`);
  checkRoundState();
}

function scheduleNextRound() {
  state.roundTransitionPending = true;
  render();

  window.setTimeout(() => {
    if (state.currentRound >= ROUND_TARGETS.length) {
      setStatus("You cleared round 10. Click Deal 7 Cards to start over.");
      state.roundTransitionPending = false;
      render();
      return;
    }

    state.currentRound += 1;
    state.roundTarget = ROUND_TARGETS[state.currentRound - 1];
    startNewRound();
    setStatus(`Round ${state.currentRound} started. Target: ${state.roundTarget.toLocaleString()} points.`);
  }, 2200);
}

function checkRoundState() {
  if (state.roundScore >= state.roundTarget) {
    setStatus(`Round ${state.currentRound} cleared. ${state.roundScore.toLocaleString()} points scored! Next round starting...`);
    scheduleNextRound();
    return;
  }

  if (state.handsRemaining <= 0) {
    state.roundEnded = true;
    render();
    setStatus(`Round ${state.currentRound} failed. Need ${state.roundTarget.toLocaleString()}, but scored ${state.roundScore.toLocaleString()}. Click Deal 7 Cards to restart from round 1.`, true);
  }
}

function buildStartingDeck() {
  const targets = [
    ["NOUN", 4],
    ["VERB", 2],
    ["ADJ", 2],
    ["ADV", 2],
  ];
  const excludedKeys = new Set();
  const chosen = [];

  const categories = shuffle(getAvailableCategories()).filter((category) => {
    const pool = state.categoryPool.filter((card) => card.categories.includes(category));
    return sampleBalancedCards(pool, targets) !== null;
  });

  if (categories.length < 2) {
    throw new Error("Not enough categories to build the starting deck.");
  }

  const categoryA = categories[0];
  const categoryB = categories[1];

  const fromCategoryA = sampleBalancedCards(
    state.categoryPool.filter((card) => card.categories.includes(categoryA)),
    targets,
    excludedKeys,
  );
  if (!fromCategoryA) {
    throw new Error(`Could not build starting pack from ${categoryA}.`);
  }
  fromCategoryA.forEach((card) => {
    chosen.push(card);
    excludedKeys.add(getCardKey(card));
  });

  const fromCategoryB = sampleBalancedCards(
    state.categoryPool.filter((card) => card.categories.includes(categoryB)),
    targets,
    excludedKeys,
  );
  if (!fromCategoryB) {
    throw new Error(`Could not build starting pack from ${categoryB}.`);
  }
  fromCategoryB.forEach((card) => {
    chosen.push(card);
    excludedKeys.add(getCardKey(card));
  });

  const nonePool = state.allCards.filter((card) => card.categories.includes("none"));
  const fromNone = sampleBalancedCards(nonePool, targets, excludedKeys);
  if (!fromNone) {
    throw new Error("Not enough no-category cards to build the starting deck.");
  }
  fromNone.forEach((card) => {
    chosen.push(card);
    excludedKeys.add(getCardKey(card));
  });

  state.startingCategories = [categoryA, categoryB];
  return chosen;
}

function getAvailableCategories() {
  const categories = new Set();
  state.categoryPool.forEach((card) => {
    (card.categories || []).forEach((category) => {
      if (category !== "none") {
        categories.add(category);
      }
    });
  });
  return [...categories].sort();
}

function renderCategoryOptions() {
  const categories = getAvailableCategories();
  els.categorySelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choose category";
  els.categorySelect.append(placeholder);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = formatCategoryLabel(category);
    els.categorySelect.append(option);
  });

  els.categorySelect.value = state.selectedCategory && categories.includes(state.selectedCategory)
    ? state.selectedCategory
    : "";
}

function draftBooster() {
  if (!canInteract()) {
    return;
  }
  if (state.currentBooster.length > 0) {
    setStatus("Pick 1 card from the current booster before buying another.", true);
    return;
  }

  const category = els.categorySelect.value;
  if (!category) {
    setStatus("Choose a category before buying cards.", true);
    return;
  }

  state.selectedCategory = category;
  const ownedKeys = new Set(state.deck.map(getCardKey));
  const pool = shuffle(
    state.categoryPool.filter(
      (card) => card.categories.includes(category) && !ownedKeys.has(getCardKey(card)),
    ),
  );

  state.currentBooster = pool.slice(0, 4);
  render();

  if (state.currentBooster.length === 0) {
    setStatus(`No cards left in ${formatCategoryLabel(category)}.`, true);
    return;
  }

  setStatus(`Drafted ${state.currentBooster.length} cards from ${formatCategoryLabel(category)}.`);
}

function addBoosterCard(cardToAdd) {
  if (!canInteract()) {
    return;
  }
  const key = getCardKey(cardToAdd);
  if (state.deck.some((card) => getCardKey(card) === key)) {
    setStatus(`${cardToAdd.id} is already in your deck.`, true);
    return;
  }

  state.deck.push(cardToAdd);
  state.categoryPool = state.categoryPool.filter((card) => getCardKey(card) !== key);
  state.currentBooster = [];
  renderCategoryOptions();
  render();
  setStatus(`Added ${cardToAdd.id} to your deck. The other booster cards stay in the category pool.`);
}

async function loadDeck() {
  const response = await fetch("./deck.json");
  if (!response.ok) {
    throw new Error(`Could not load deck.json (${response.status})`);
  }

  const deck = await response.json();
  return deck.map((card) => ({
    ...card,
    chips: Number(card.chips),
    categories: Array.isArray(card.categories) ? card.categories : ["none"],
  }));
}

async function loadCategoryPool() {
  const response = await fetch("./category_pool.json");
  if (!response.ok) {
    throw new Error(`Could not load category_pool.json (${response.status})`);
  }

  const pool = await response.json();
  return pool.map((card) => ({
    ...card,
    chips: Number(card.chips),
    categories: Array.isArray(card.categories) ? card.categories : ["none"],
  }));
}

async function init() {
  els.deckButton.addEventListener("click", () => {
    state.deckViewerOpen = !state.deckViewerOpen;
    render();
  });
  els.dealButton.addEventListener("click", dealNewHand);
  els.clearButton.addEventListener("click", () => {
    state.hand.push(...state.playZone);
    state.playZone = [];
    render();
  });
  els.playHandButton.addEventListener("click", playCurrentHand);
  els.buyButton.addEventListener("click", draftBooster);
  renderHandsHelp();

  try {
    setStatus("Loading deck...");
    state.allCards = await loadDeck();
    state.categoryPool = await loadCategoryPool();
    state.deck = buildStartingDeck();
    renderCategoryOptions();
    startNewRound();
    setStatus(
      `Started round with 30 cards: 10 from ${formatCategoryLabel(state.startingCategories[0])}, 10 from ${formatCategoryLabel(state.startingCategories[1])}, and 10 from No Category.`,
    );
  } catch (error) {
    console.error(error);
    setStatus(
      "Could not load deck files. Start a local server with: python run_mvp.py",
      true,
    );
  }
}

init();
