const UI_STORAGE_KEY = "wordmath-ui-lang";

const MESSAGES = {
  en: {
    "doc.title": "King Minus Man",
    "topbar.brandTitle": "King Minus Man",
    "topbar.purchaseTokens": "Purchase Tokens",
    "topbar.wordBooster": "Word Booster",
    "topbar.newGame": "New Game",
    "topbar.encyclopediaLabel": "Encyclopedia",
    "topbar.themeToggle": "Toggle theme",
    "status.initial": "Drop a word onto the field to start mixing.",
    "tokenDock.label": "Tokens",
    "tokenDock.howLink": "How tokens work",
    "tokenDock.tooltip":
      "Drag onto a word on the field. The 2, 3, 4, and 5 tokens make a mix take the 2nd, 3rd, 4th, or 5th result instead of the 1st. Ban Word removes the first result—so that outcome is not produced. Broad Choice (B) charges a word: while mixing, you see up to ten matches and pick which result to produce. Minus mix (➖) tags a word: if either word has it, the mix is the word under the pointer minus the word you drag (vector subtraction). Only one tag is spent; if both are tagged, the dragged word loses its tag.",
    "playfield.heading": "Mixing Field",
    "playfield.hint":
      "Right-click a word box to remove it. Drag one box onto another to create a new word.",
    "playfield.zoomOut": "Zoom out",
    "playfield.zoomIn": "Zoom in",
    "playfield.clear": "Clear Field",
    "quest.objectiveLabel": "Objective Manuscript",
    "quest.inkLabel": "Ink Remaining",
    "quest.loading": "Loading...",
    "playfield.empty": "Drag a starter or discovered word here.",
    "tile.broadChoiceBadge": "Broad",
    "tile.minusMixBadge": "Minus",
    "garbage.title": "Garbage Bin",
    "garbage.hint": "Drag words here to hide them forever. They can still be mixed.",
    "garbage.binTitle": "Garbage Bin",
    "sidebar.archivesTitle": "Library Archives",
    "sidebar.archivesSubtitle": "Curator's Collection",
    "sidebar.tabDiscovered": "Discovered",
    "sidebar.tabShop": "Shop",
    "sidebar.wordPanelTitle": "Word Panel",
    "sidebar.googleTitle":
      "Click, then pick a word to search Google",
    "sidebar.googleLabel": "Google",
    "sidebar.discoveredHeading": "Discovered Words",
    "sidebar.searchLabel": "Search and select a word",
    "sidebar.searchPlaceholder": "Search a word",
    "sidebar.availableLabel": "Available words",
    "sidebar.shopHeading": "Shop",
    "sidebar.shopHint":
      "Buy tokens above via Purchase Tokens or Word Booster. Field upgrades stay here; add quest ink from the manuscript banner.",
    "sidebar.shopCoinsSuffix": "coins",
    "sidebar.shopLoading": "Loading shop...",
    "modal.encyclopediaTitle": "Encyclopedia",
    "modal.encyclopediaSubtitle": "Eighty hidden words across sixteen categories.",
    "modal.close": "Close",
    "modal.historyTitle": "Match History",
    "modal.historySubtitle":
      "Unique mixes only. Repeating the same match does not add another entry, and only the latest 100 are kept.",
    "modal.historySort": "Sort by Result",
    "modal.broadChoiceTitle": "Broad Choice",
    "modal.broadChoiceSubtitle":
      "Pick which match to produce. Press Esc to take the first option listed.",
    "sidebar.matchHistoryButton": "History",
    "sidebar.genealogyContext": "View genealogy",
    "modal.genealogyTitle": "Genealogy",
    "modal.genealogyShort": "Tree",
    "modal.genealogySubtitleHasTree":
      "Up to four generations (30 ancestor slots). Inbreeding score: {n} (extra repeats among those ancestors).",
    "modal.genealogySubtitleNoTree":
      "No mix parents on file (starter, shop, import, or older save).",
    "modal.genealogyEmptyBody":
      "This word was not created from a tracked mix, so there is no parent tree.",
    "modal.genealogyTierParents": "Parents (1 pair)",
    "modal.genealogyTierGrandparents": "Grandparents (2 pairs)",
    "modal.genealogyTierGreat": "Great-grandparents (4 pairs)",
    "modal.genealogyTierGreatGreat": "Great-great-grandparents (8 pairs)",
    "modal.settingsTitle": "Settings",
    "modal.settingsSubtitle": "Gameplay and debug tools for this run.",
    "modal.settingsLanguageLabel": "Interface language",
    "modal.settingsLanguageEn": "English",
    "modal.settingsLanguageRu": "Russian",
    "modal.settingsLocaleHint":
      "Word data matches the server (English or Russian build). Change interface language anytime.",
    "settings.spawnExistingTitle": "Spawn existing words",
    "settings.spawnExistingHint":
      "When off, matching will not spawn words that are already in Available Words.",
    "settings.spawnWord": "Spawn Word",
    "settings.exportSave": "Debug Export Save JSON",
    "settings.importSave": "Load Saved Game JSON",
    "settings.exportNote":
      "The exported file includes the full game snapshot, including discovered words, so they can be extracted later.",
    "booster.title": "Word Booster",
    "booster.subtitle":
      "Pick 1 of these 10 rolled words to discover it and add it to Available Words.",
    "booster.fold": "Fold",
    "questLoss.title": "You lost!",
    "questLoss.subtitle": "The quest timer ran out before you found the target word.",
    "questLoss.copyPrefix": "You ran out of discoveries before finding",
    "questLoss.tryAgain": "Try Again",
    "categoryZone.title": "Category zone style",
    "categoryZone.subtitle":
      "Radial hue and saturation, brightness, tint strength, and circle radius. Applies to every zone of this category and new drops.",
    "categoryZone.wheelAria": "Pick hue and saturation",
    "categoryZone.wheelHint": "Center is pale; rim is vivid. Angle is hue.",
    "categoryZone.brightness": "Brightness",
    "categoryZone.tintOpacity": "Tint opacity",
    "categoryZone.radius": "Radius (px)",
    "categoryZone.preview": "Preview",
    "categoryZone.apply": "Apply",
    "questWin.title": "You won!",
    "questWin.subtitle": "You cleared every stage and finished the run.",
    "questWin.copy": "All six stages complete. Encyclopedia mastered.",
    "questWin.goAgain": "Go Again",
    "stageAdvance.title": "Stage clear",
    "stageAdvance.bannerLabel": "Stage clear",
    "stageAdvance.subtitle": "",
    "stageAdvance.warnSubtitle": "Before you continue",
    "stageAdvance.pickSubtitle": "Words to carry",
    "stageAdvance.confirmSubtitle": "Ready to start the next stage?",
    "stageAdvance.next": "Next",
    "stageAdvance.back": "Back",
    "stageAdvance.nextPick": "Next: pick words",
    "stageAdvance.nextConfirm": "Next: confirm",
    "stageAdvance.startStage": "Start next stage",
    "stageAdvance.blockedPlay":
      "Finish stage clear first—mixing, wildcards, tokens, and word spawns stay disabled for now.",
    "stageAdvance.blockedBooster": "Finish stage clear before buying Word Booster.",
  },
  ru: {
    "doc.title": "Смешивание слов",
    "topbar.brandTitle": "Смешивание слов",
    "topbar.purchaseTokens": "Купить токены",
    "topbar.wordBooster": "Бустер слов",
    "topbar.newGame": "Новая игра",
    "topbar.encyclopediaLabel": "Энциклопедия",
    "topbar.themeToggle": "Сменить тему",
    "status.initial": "Перетащите слово на поле, чтобы начать смешивание.",
    "tokenDock.label": "Токены",
    "tokenDock.howLink": "Как работают токены",
    "tokenDock.tooltip":
      "Перетащите на слово на поле. Токены 2, 3, 4 и 5 дают 2-й, 3-й, 4-й или 5-й результат вместо 1-го. «Запретить слово» убирает первый результат. «Широкий выбор» (B) заряжает слово: при смешивании видно до 10 вариантов и вы выбираете исход. «Минус-смешение» (➖) помечает слово: если у любого из пары есть метка, смешение — слово под курсором минус перетаскиваемое (векторное вычитание). Тратится одна метка; если оба с меткой, метку теряет перетаскиваемое.",
    "playfield.heading": "Поле смешивания",
    "playfield.hint":
      "ПКМ по слову — удалить. Перетащите одно слово на другое, чтобы создать новое.",
    "playfield.zoomOut": "Уменьшить",
    "playfield.zoomIn": "Увеличить",
    "playfield.clear": "Очистить поле",
    "quest.objectiveLabel": "Цель квеста",
    "quest.inkLabel": "Осталось ходов",
    "quest.loading": "Загрузка...",
    "playfield.empty": "Перетащите стартовое или открытое слово сюда.",
    "tile.broadChoiceBadge": "Широкий",
    "tile.minusMixBadge": "Минус",
    "garbage.title": "Корзина",
    "garbage.hint":
      "Перетащите слово сюда, чтобы скрыть его навсегда. Смешивать всё ещё можно.",
    "garbage.binTitle": "Корзина",
    "sidebar.archivesTitle": "Архив библиотеки",
    "sidebar.archivesSubtitle": "Коллекция куратора",
    "sidebar.tabDiscovered": "Открытые",
    "sidebar.tabShop": "Магазин",
    "sidebar.wordPanelTitle": "Панель слов",
    "sidebar.googleTitle": "Нажмите, затем выберите слово для поиска в Google",
    "sidebar.googleLabel": "Google",
    "sidebar.discoveredHeading": "Открытые слова",
    "sidebar.searchLabel": "Поиск и выбор слова",
    "sidebar.searchPlaceholder": "Поиск слова",
    "sidebar.availableLabel": "Доступные слова",
    "sidebar.shopHeading": "Магазин",
    "sidebar.shopHint":
      "Покупайте токены через «Купить токены» или «Бустер слов». Расширения поля — здесь; чернила квеста — на плашке цели.",
    "sidebar.shopCoinsSuffix": "монет",
    "sidebar.shopLoading": "Загрузка магазина...",
    "modal.encyclopediaTitle": "Энциклопедия",
    "modal.encyclopediaSubtitle": "Восемьдесят скрытых слов в шестнадцати категориях.",
    "modal.close": "Закрыть",
    "modal.historyTitle": "История комбинаций",
    "modal.historySubtitle":
      "Только уникальные комбинации. Повтор не добавляет запись. Хранятся последние 100.",
    "modal.historySort": "Сортировка по результату",
    "modal.broadChoiceTitle": "Широкий выбор",
    "modal.broadChoiceSubtitle":
      "Выберите исход смешивания. Esc — первый вариант из списка.",
    "sidebar.matchHistoryButton": "История",
    "sidebar.genealogyContext": "Родословная",
    "modal.genealogyTitle": "Родословная",
    "modal.genealogyShort": "Дерево",
    "modal.genealogySubtitleHasTree":
      "До четырёх поколений (30 слотов предков). Инбридинг: {n} (лишние повторы среди них).",
    "modal.genealogySubtitleNoTree":
      "Нет родителей от смешивания (старт, магазин, импорт или старое сохранение).",
    "modal.genealogyEmptyBody":
      "Слово не получено из отслеживаемого микса — дерева родителей нет.",
    "modal.genealogyTierParents": "Родители (1 пара)",
    "modal.genealogyTierGrandparents": "Бабушки и дедушки (2 пары)",
    "modal.genealogyTierGreat": "Прародители (4 пары)",
    "modal.genealogyTierGreatGreat": "Прапрародители (8 пар)",
    "modal.settingsTitle": "Настройки",
    "modal.settingsSubtitle": "Игровые и отладочные опции.",
    "modal.settingsLanguageLabel": "Язык интерфейса",
    "modal.settingsLanguageEn": "English",
    "modal.settingsLanguageRu": "Русский",
    "modal.settingsLocaleHint":
      "Слова и смешивание соответствуют серверу (английская или русская сборка). Язык интерфейса можно сменить в любой момент.",
    "settings.spawnExistingTitle": "Создавать уже открытые слова",
    "settings.spawnExistingHint":
      "Если выключено, при смешивании не появятся слова из списка доступных.",
    "settings.spawnWord": "Создать слово",
    "settings.exportSave": "Экспорт сохранения (JSON)",
    "settings.importSave": "Загрузить сохранение (JSON)",
    "settings.exportNote":
      "Экспортируемый файл содержит полный снимок игры, включая открытые слова.",
    "booster.title": "Бустер слов",
    "booster.subtitle":
      "Выберите 1 из 10 выпавших слов, чтобы открыть его и добавить в доступные.",
    "booster.fold": "Свернуть",
    "questLoss.title": "Вы проиграли!",
    "questLoss.subtitle": "Время квеста истекло до того, как вы нашли целевое слово.",
    "questLoss.copyPrefix": "Вы исчерпали попытки до того, как нашли",
    "questLoss.tryAgain": "Попробовать снова",
    "categoryZone.title": "Стиль зоны категории",
    "categoryZone.subtitle":
      "Оттенок и насыщенность по кругу, яркость, сила тона и радиус. Для всех зон этой категории и новых сбросов.",
    "categoryZone.wheelAria": "Выбор оттенка и насыщенности",
    "categoryZone.wheelHint": "В центре бледнее, по краю ярче. Угол — оттенок.",
    "categoryZone.brightness": "Яркость",
    "categoryZone.tintOpacity": "Сила тона",
    "categoryZone.radius": "Радиус (px)",
    "categoryZone.preview": "Предпросмотр",
    "categoryZone.apply": "Применить",
    "questWin.title": "Вы победили!",
    "questWin.subtitle": "Вы прошли все этапы и завершили забег.",
    "questWin.copy": "Все 6 этапов пройдены. Энциклопедия открыта полностью.",
    "questWin.goAgain": "Ещё раз",
    "stageAdvance.title": "Этап пройден",
    "stageAdvance.bannerLabel": "Этап пройден",
    "stageAdvance.subtitle": "",
    "stageAdvance.warnSubtitle": "Перед продолжением",
    "stageAdvance.pickSubtitle": "Слова с собой",
    "stageAdvance.confirmSubtitle": "Начать следующий этап?",
    "stageAdvance.next": "Далее",
    "stageAdvance.back": "Назад",
    "stageAdvance.nextPick": "Далее: выбор слов",
    "stageAdvance.nextConfirm": "Далее: подтверждение",
    "stageAdvance.startStage": "Начать этап",
    "stageAdvance.blockedPlay":
      "Завершите переход этапа: смешивание, вайлдкарды, токены и выкладка слов с панели сейчас отключены.",
    "stageAdvance.blockedBooster": "Сначала завершите переход этапа, затем покупайте бустер слов.",
  },
};

const SHOP_MESSAGES = {
  en: {
    "shop-word-booster": {
      title: "Word Booster",
      description: "Roll 10 random words from the common-word list, then pick 1 to discover.",
      purchaseDone: (cost) =>
        `Bought a Word Booster for ${cost} coins. Pick 1 rolled word to discover it.`,
      reopen: "Reopened your pending Word Booster.",
    },
    "shop-match-2": {
      title: "Second Result Token",
      description: "",
      purchaseDone: (cost) => `Bought 1 Second Result token for ${cost} coins.`,
    },
    "shop-match-3": {
      title: "Third Result Token",
      description: "",
      purchaseDone: (cost) => `Bought 1 Third Result token for ${cost} coins.`,
    },
    "shop-match-4": {
      title: "Fourth Result Token",
      description: "",
      purchaseDone: (cost) => `Bought 1 Fourth Result token for ${cost} coins.`,
    },
    "shop-match-5": {
      title: "Fifth Result Token",
      description: "",
      purchaseDone: (cost) => `Bought 1 Fifth Result token for ${cost} coins.`,
    },
    "shop-ban-word": {
      title: "Ban Word Token",
      description: "",
      purchaseDone: (cost) => `Bought 1 Ban Word token for ${cost} coins.`,
    },
    "shop-broad-choice": {
      title: "Broad Choice Token",
      description: "Charge a field word to see up to ten mix matches and pick the result.",
      purchaseDone: (cost) => `Bought 1 Broad Choice token for ${cost} coins.`,
    },
    "shop-minus-mix": {
      title: "Minus Mix Token",
      description: "Tag a field word so mixes use subtraction: stationary word minus dragged word.",
      purchaseDone: (cost) => `Bought 1 Minus mix token for ${cost} coins.`,
    },
    "shop-playfield-pan-zoom": {
      title: "Field Pan & Zoom",
      description:
        "Unlock dragging the view and zooming on the full mixing field. Further size comes from Expand purchases in the Shop.",
      purchaseDone: () => "Unlocked pan and zoom on the mixing field.",
    },
    "shop-playfield-expand": {
      title: "Expand Mixing Field +50%",
      description: "Increase playfield size by 50% (requires Field Pan & Zoom).",
      purchaseDone: () => "Mixing field expanded by +50%.",
    },
    "shop-playfield-expand-2": {
      title: "Expand Mixing Field +50% (again)",
      description: "Grow the playfield by another 50% (after the first expansion).",
      purchaseDone: () => "Mixing field expanded by another +50%.",
    },
    "shop-quest-turn": {
      title: "Quest Turn +1",
      description: "Add 1 turn before you lose the current active quest.",
      purchaseDone: (cost, turns) =>
        `Paid ${cost} coins. Added 1 turn to the active quest. You now lose in ${turns} turns.`,
    },
  },
  ru: {
    "shop-word-booster": {
      title: "Бустер слов",
      description: "10 случайных слов из частотного списка — выберите 1, чтобы открыть.",
      purchaseDone: (cost) =>
        `Куплен бустер слов за ${cost} монет. Выберите 1 из выпавших слов.`,
      reopen: "Снова открыт незавершённый бустер слов.",
    },
    "shop-match-2": {
      title: "Токен «Второй результат»",
      description: "",
      purchaseDone: (cost) => `Куплен 1 токен «Второй результат» за ${cost} монет.`,
    },
    "shop-match-3": {
      title: "Токен «Третий результат»",
      description: "",
      purchaseDone: (cost) => `Куплен 1 токен «Третий результат» за ${cost} монет.`,
    },
    "shop-match-4": {
      title: "Токен «Четвёртый результат»",
      description: "",
      purchaseDone: (cost) => `Куплен 1 токен «Четвёртый результат» за ${cost} монет.`,
    },
    "shop-match-5": {
      title: "Токен «Пятый результат»",
      description: "",
      purchaseDone: (cost) => `Куплен 1 токен «Пятый результат» за ${cost} монет.`,
    },
    "shop-ban-word": {
      title: "Токен «Запретить слово»",
      description: "",
      purchaseDone: (cost) => `Куплен 1 токен «Запретить слово» за ${cost} монет.`,
    },
    "shop-broad-choice": {
      title: "Токен «Широкий выбор»",
      description: "Зарядите слово на поле: до 10 вариантов смешивания и выбор исхода.",
      purchaseDone: (cost) => `Куплен 1 токен «Широкий выбор» за ${cost} монет.`,
    },
    "shop-minus-mix": {
      title: "Токен «Минус-смешение»",
      description: "Пометьте слово: смешение — слово под курсором минус перетаскиваемое.",
      purchaseDone: (cost) => `Куплен 1 токен «Минус-смешение» за ${cost} монет.`,
    },
    "shop-playfield-pan-zoom": {
      title: "Панорама и масштаб поля",
      description:
        "Включить перетаскивание вида и масштаб на всём поле. Размер дальше — покупки «Расширить» в магазине.",
      purchaseDone: () => "Включены панорама и масштаб поля смешивания.",
    },
    "shop-playfield-expand": {
      title: "Расширить поле +50%",
      description: "Увеличить поле на 50% (нужны панорама и масштаб).",
      purchaseDone: () => "Поле смешивания расширено на +50%.",
    },
    "shop-playfield-expand-2": {
      title: "Расширить поле ещё +50%",
      description: "Ещё +50% размера поля (после первого расширения).",
      purchaseDone: () => "Поле смешивания снова расширено на +50%.",
    },
    "shop-quest-turn": {
      title: "Квест: +1 ход",
      description: "Добавить 1 ход до проигрыша по текущему квесту.",
      purchaseDone: (cost, turns) =>
        `Потрачено ${cost} монет. +1 ход к квесту. Проигрыш через ${turns} ходов.`,
    },
  },
};

const TOKEN_RANK_LABELS = {
  en: {
    2: { title: "Second Result", shortLabel: "2nd" },
    3: { title: "Third Result", shortLabel: "3rd" },
    4: { title: "Fourth Result", shortLabel: "4th" },
    5: { title: "Fifth Result", shortLabel: "5th" },
  },
  ru: {
    2: { title: "Второй результат", shortLabel: "2-й" },
    3: { title: "Третий результат", shortLabel: "3-й" },
    4: { title: "Четвёртый результат", shortLabel: "4-й" },
    5: { title: "Пятый результат", shortLabel: "5-й" },
  },
};

let activeUiLang = "en";

export function getUiLang() {
  return activeUiLang;
}

export function t(key) {
  const pack = MESSAGES[activeUiLang] || MESSAGES.en;
  return pack[key] ?? MESSAGES.en[key] ?? key;
}

export function formatCoinsCount(count) {
  const c = Math.max(0, Math.floor(Number(count)) || 0);
  if (activeUiLang === "ru") {
    return `${c} монет`;
  }
  return `${c} coin${c === 1 ? "" : "s"}`;
}

export function formatShopBuyLine(itemCost) {
  if (activeUiLang === "ru") {
    return `Купить за ${itemCost} монет`;
  }
  return `Buy for ${itemCost} coins`;
}

export function getWordBoosterTopTitle(pending, reason, boosterCost) {
  if (pending) {
    return activeUiLang === "ru"
      ? "Откройте невыбранный бустер слов."
      : "Open your pending Word Booster picks.";
  }
  if (reason) {
    return reason;
  }
  return activeUiLang === "ru"
    ? `Купить за ${boosterCost} монет.`
    : `Buy for ${boosterCost} coins.`;
}

export function setUiLang(lang) {
  if (lang === "en" || lang === "ru") {
    activeUiLang = lang;
    window.localStorage.setItem(UI_STORAGE_KEY, lang);
  }
}

/** If user never chose, follow server game locale. */
export function resolveUiLang(gameLocale) {
  const saved = window.localStorage.getItem(UI_STORAGE_KEY);
  if (saved === "en" || saved === "ru") {
    return saved;
  }
  return gameLocale === "ru" ? "ru" : "en";
}

export function applyDocumentI18n(lang) {
  activeUiLang = lang;
  document.documentElement.lang = lang === "ru" ? "ru" : "en";
  const table = MESSAGES[lang] || MESSAGES.en;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && table[key] != null) {
      el.textContent = table[key];
    }
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key && table[key] != null) {
      el.setAttribute("placeholder", table[key]);
    }
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    if (key && table[key] != null) {
      el.setAttribute("aria-label", table[key]);
    }
  });
  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    if (key && table[key] != null) {
      el.setAttribute("title", table[key]);
    }
  });
  const titleEl = document.querySelector("title");
  if (titleEl && table["doc.title"]) {
    titleEl.textContent = table["doc.title"];
  }
}

export function getShopItemTitle(itemId) {
  const pack = SHOP_MESSAGES[activeUiLang] || SHOP_MESSAGES.en;
  return pack[itemId]?.title ?? SHOP_MESSAGES.en[itemId]?.title ?? itemId;
}

export function getShopItemDescription(itemId) {
  const pack = SHOP_MESSAGES[activeUiLang] || SHOP_MESSAGES.en;
  return pack[itemId]?.description ?? SHOP_MESSAGES.en[itemId]?.description ?? "";
}

export function formatShopPurchaseMessage(itemId, args = []) {
  const pack = SHOP_MESSAGES[activeUiLang] || SHOP_MESSAGES.en;
  const entry = pack[itemId] || SHOP_MESSAGES.en[itemId];
  if (!entry?.purchaseDone) {
    return "";
  }
  return entry.purchaseDone(...args);
}

export function getWordBoosterReopenMessage() {
  const pack = SHOP_MESSAGES[activeUiLang] || SHOP_MESSAGES.en;
  return pack["shop-word-booster"]?.reopen ?? SHOP_MESSAGES.en["shop-word-booster"].reopen;
}

export function getTokenPositionLabels(rank) {
  const pack = TOKEN_RANK_LABELS[activeUiLang] || TOKEN_RANK_LABELS.en;
  return pack[rank] || TOKEN_RANK_LABELS.en[rank];
}
