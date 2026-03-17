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

const state = {
  starters: [],
  discovered: new Set(),
  tiles: [],
  search: "",
  negativeMix: {
    a: null,
    b: null,
  },
  nextTileId: 1,
  nextZIndex: 1,
};

const els = {
  status: document.querySelector("[data-status]"),
  encyclopediaCount: document.querySelector("[data-encyclopedia-count]"),
  starterCount: document.querySelector("[data-starter-count]"),
  discoveredCount: document.querySelector("[data-discovered-count]"),
  availableCount: document.querySelector("[data-available-count]"),
  starterChips: document.querySelector("[data-starter-chips]"),
  wordSearch: document.querySelector("[data-word-search]"),
  wordList: document.querySelector("[data-word-list]"),
  playfield: document.querySelector("[data-playfield]"),
  emptyMessage: document.querySelector("[data-empty-message]"),
  negativePanel: document.querySelector("[data-negative-panel]"),
  negativeSlots: document.querySelectorAll("[data-negative-slot]"),
  negativeWordA: document.querySelector("[data-negative-word-a]"),
  negativeWordB: document.querySelector("[data-negative-word-b]"),
  encyclopediaModal: document.querySelector("[data-encyclopedia-modal]"),
  encyclopediaGrid: document.querySelector("[data-encyclopedia-grid]"),
  resetButton: document.querySelector("[data-action='reset']"),
  clearFieldButton: document.querySelector("[data-action='clear-field']"),
  clearNegativeButton: document.querySelector("[data-action='clear-negative']"),
  runNegativeButton: document.querySelector("[data-action='run-negative']"),
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

function getWordKind(word) {
  return state.starters.includes(word) ? "starter" : "discovered";
}

function getAvailableWords() {
  return [...new Set([...state.starters, ...state.discovered])].sort((a, b) =>
    a.localeCompare(b),
  );
}

function getEncyclopediaDiscoveryCount() {
  return [...state.discovered].filter((word) => ENCYCLOPEDIA_LOOKUP.has(word)).length;
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
  els.starterCount.textContent = state.starters.length.toString();
  els.discoveredCount.textContent = state.discovered.size.toString();
  els.availableCount.textContent = getAvailableWords().length.toString();
  els.encyclopediaCount.textContent = `${getEncyclopediaDiscoveryCount()} / ${ENCYCLOPEDIA_WORDS.length}`;
}

function buildSourceButton(word) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "source-word";
  button.dataset.kind = getWordKind(word);
  button.textContent = titleCase(word);
  button.draggable = true;
  button.addEventListener("click", () => {
    spawnWordOnField(word);
    setStatus(`${titleCase(word)} was added to the field.`);
  });
  button.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", word);
    event.dataTransfer.effectAllowed = "copy";
  });
  return button;
}

function renderStarters() {
  els.starterChips.innerHTML = "";
  state.starters.forEach((word) => {
    els.starterChips.append(buildSourceButton(word));
  });
}

function renderWordList() {
  const availableWords = getAvailableWords().filter((word) =>
    word.includes(state.search.trim().toLowerCase()),
  );

  els.wordList.innerHTML = "";
  if (availableWords.length === 0) {
    const empty = document.createElement("p");
    empty.className = "source-word-empty";
    empty.textContent = "No available words match that search.";
    els.wordList.append(empty);
    return;
  }

  availableWords.forEach((word) => {
    els.wordList.append(buildSourceButton(word));
  });
}

function renderEncyclopedia() {
  els.encyclopediaGrid.innerHTML = "";

  ENCYCLOPEDIA_CATEGORIES.forEach((category) => {
    const discoveredInCategory = category.words.filter((word) => state.discovered.has(word));

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
      const isDiscovered = state.discovered.has(word);
      entry.className = "encyclopedia-entry";
      entry.dataset.discovered = isDiscovered ? "true" : "false";
      entry.textContent = titleCase(word);
      list.append(entry);
    });

    card.append(titleRow, list);
    els.encyclopediaGrid.append(card);
  });
}

function renderSidebar() {
  updateCounts();
  renderStarters();
  renderWordList();
  renderEncyclopedia();
}

function renderNegativeMix() {
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

async function handleMix(firstTile, secondTile) {
  const mix = await getAssociation(firstTile.word, secondTile.word, "add");
  const result = mix.result;
  const isInEncyclopedia = ENCYCLOPEDIA_LOOKUP.has(result);
  const wasDiscovered = state.discovered.has(result);

  if (!wasDiscovered) {
    state.discovered.add(result);
    renderSidebar();
  }

  if (isInEncyclopedia && !wasDiscovered) {
    setStatus(
      `${titleCase(firstTile.word)} + ${titleCase(secondTile.word)} created ${titleCase(result)}. It was added to the encyclopedia.`,
      "success",
    );
  } else if (isInEncyclopedia) {
    setStatus(
      `${titleCase(firstTile.word)} + ${titleCase(secondTile.word)} created ${titleCase(result)}. It was already in the encyclopedia, so it only appeared on the field.`,
      "ok",
    );
  } else {
    setStatus(
      `${titleCase(firstTile.word)} + ${titleCase(secondTile.word)} created ${titleCase(result)}. It is not one of the 40 encyclopedia words, so it only appeared on the field.`,
      "ok",
    );
  }

  spawnResultTile(result, firstTile, secondTile);
}

function rememberResult(result) {
  const isInEncyclopedia = ENCYCLOPEDIA_LOOKUP.has(result);
  const wasDiscovered = state.discovered.has(result);

  if (!wasDiscovered) {
    state.discovered.add(result);
    renderSidebar();
  }

  return { isInEncyclopedia, wasDiscovered };
}

async function runNegativeMix() {
  if (!(state.negativeMix.a && state.negativeMix.b)) {
    setStatus("Negative mixing needs both A and B.", "error");
    return;
  }

  const mix = await getAssociation(state.negativeMix.a, state.negativeMix.b, "subtract");
  const result = mix.result;
  const { isInEncyclopedia, wasDiscovered } = rememberResult(result);
  spawnWordOnField(result, { x: 340, y: 48 });

  if (isInEncyclopedia && !wasDiscovered) {
    setStatus(
      `${titleCase(state.negativeMix.a)} - ${titleCase(state.negativeMix.b)} created ${titleCase(result)}. It was added to the encyclopedia.`,
      "success",
    );
  } else if (isInEncyclopedia) {
    setStatus(
      `${titleCase(state.negativeMix.a)} - ${titleCase(state.negativeMix.b)} created ${titleCase(result)}. It was already in the encyclopedia, so it only appeared on the field.`,
      "ok",
    );
  } else {
    setStatus(
      `${titleCase(state.negativeMix.a)} - ${titleCase(state.negativeMix.b)} created ${titleCase(result)}. It is not one of the 40 encyclopedia words, so it only appeared on the field.`,
      "ok",
    );
  }
}

function clearNegativeMix() {
  state.negativeMix.a = null;
  state.negativeMix.b = null;
  renderNegativeMix();
}

function assignNegativeSlot(slot, word) {
  state.negativeMix[slot] = word;
  renderNegativeMix();
}

function getNegativeSlotAtPoint(clientX, clientY) {
  const element = document.elementFromPoint(clientX, clientY);
  return element ? element.closest("[data-negative-slot]") : null;
}

function startTileDrag(event, tileId) {
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

  state.nextZIndex += 1;
  tile.zIndex = state.nextZIndex;
  tileElement.classList.add("dragging");
  tileElement.style.zIndex = String(tile.zIndex);

  const move = (moveEvent) => {
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
      tileElement.dataset.kind = getWordKind(tile.word);
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
      metaElement.textContent = getWordKind(tile.word) === "starter" ? "Starter object" : (
        ENCYCLOPEDIA_LOOKUP.get(tile.word)?.category || "Discovered word"
      );

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

function resetRun() {
  state.starters = sampleStarters();
  state.discovered = new Set();
  state.tiles = [];
  state.search = "";
  state.negativeMix.a = null;
  state.negativeMix.b = null;
  state.nextTileId = 1;
  state.nextZIndex = 1;
  els.wordSearch.value = "";

  renderSidebar();
  renderTiles();
  renderNegativeMix();

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

  els.resetButton.addEventListener("click", resetRun);
  els.clearFieldButton.addEventListener("click", clearField);
  els.clearNegativeButton.addEventListener("click", clearNegativeMix);
  els.runNegativeButton.addEventListener("click", async () => {
    try {
      await runNegativeMix();
    } catch (error) {
      setStatus(error.message, "error");
    }
  });
  els.openEncyclopediaButton.addEventListener("click", openEncyclopedia);
  els.closeEncyclopediaButton.addEventListener("click", closeEncyclopedia);

  els.encyclopediaModal.addEventListener("click", (event) => {
    if (event.target === els.encyclopediaModal) {
      closeEncyclopedia();
    }
  });

  window.addEventListener("keydown", (event) => {
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
  resetRun();
}

init();
