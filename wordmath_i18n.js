const UI_STORAGE_KEY = "wordmath-ui-lang";

/** When true, settings hide the language switch and the UI stays English. Russian copy remains in `MESSAGES.ru` for later. */
const UI_LANG_LOCKED_TO_EN = true;

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
    "status.openHistoryAria": "Open notification history",
    "tokenDock.label": "Tokens",
    "tokenDock.howLink": "How tokens work",
    "tokenDock.tooltip":
      "Tokens help manipulate what result you get by mixing words. Drag tokens onto a word on the field. For synantonym and hypo-hypernym tokens, drag the token onto the field, then mix with other words.",
    "playfield.heading": "Mixing Field",
    "playfield.hint":
      "Right-click a word box to remove it. Drag one box onto another to create a new word.",
    "playfield.zoomOut": "Zoom out",
    "playfield.zoomIn": "Zoom in",
    "playfield.zoomLockedHint": "buy upgrade in shop to unlock a bigger field",
    "playfield.clear": "Clear Field",
    "quest.objectiveLabel": "Word to Find",
    "quest.inkLabel": "Ink Remaining",
    "quest.loading": "Loading...",
    "playfield.empty": "Drag a starter or discovered word here.",
    "tile.broadChoiceBadge": "Broad",
    "tile.minusMixBadge": "Minus",
    "tile.lexiconSynonym": "Synonym",
    "tile.lexiconAntonym": "Antonym",
    "tile.lexiconHyponym": "Hyponym",
    "tile.lexiconHypernym": "Hypernym",
    "tile.lexiconSynantonym": "Synantonym",
    "tile.lexiconHypohypernym": "Hypo-/hypernym",
    "lexicon.previewTitleSynonym": "Synonyms",
    "lexicon.previewTitleAntonym": "Antonyms",
    "lexicon.previewTitleHyponym": "Hyponyms",
    "lexicon.previewTitleHypernym": "Hypernyms",
    "lexicon.previewPlaceholderTitle": "Lexicon (English only)",
    "lexicon.previewPlaceholderBody": "Lexicon lookup is not available in this language build yet.",
    "lexicon.previewSenseLine": "Sense {n} / {total}",
    "lexicon.noAntonyms": "No antonyms",
    "lexicon.noSynonyms": "No synonyms for this sense.",
    "lexicon.noHyponyms": "No hyponyms for this sense.",
    "lexicon.noHypernyms": "No hypernyms for this sense.",
    "lexicon.invalidTokenError": "Invalid lexicon token.",
    "lexicon.twoLexiconError": "Cannot mix two lexicon tokens together.",
    "lexicon.mixAllStruck":
      "Every option for that mix was struck from the result pool (Ban line or garbage).",
    "lexicon.clickHint":
      "Drag this tile onto a word for a relation list. Each hover alternates synonyms/antonyms or hyponyms/hypernyms. Mix to consume the token.",
    "lexicon.noTokensOnLexicon": "Drop other tokens onto normal words, not onto a lexicon tile.",
    "lexicon.noSynonymTokens": "You do not have any synonym tokens in the dock.",
    "lexicon.noAntonymTokens": "You do not have any antonym tokens in the dock.",
    "lexicon.noHyponymTokens": "You do not have any hyponym tokens in the dock.",
    "lexicon.noHypernymTokens": "You do not have any hypernym tokens in the dock.",
    "lexicon.noSynantonymTokens": "You do not have any synantonym tokens in the dock.",
    "lexicon.noHypohypernymTokens": "You do not have any hypo-/hypernym tokens in the dock.",
    "lexicon.spawnedSynonym": "Placed a Synonym tile on the field.",
    "lexicon.spawnedAntonym": "Placed an Antonym tile on the field.",
    "lexicon.spawnedHyponym": "Placed a Hyponym tile on the field.",
    "lexicon.spawnedHypernym": "Placed a Hypernym tile on the field.",
    "lexicon.spawnedSynantonym": "Placed a Synantonym tile on the field.",
    "lexicon.spawnedHypohypernym": "Placed a Hypo-/hypernym tile on the field.",
    "lexicon.removedSynonym": "Removed the Synonym tile; token returned to the dock.",
    "lexicon.removedAntonym": "Removed the Antonym tile; token returned to the dock.",
    "lexicon.removedHyponym": "Removed the Hyponym tile; token returned to the dock.",
    "lexicon.removedHypernym": "Removed the Hypernym tile; token returned to the dock.",
    "lexicon.removedSynantonym": "Removed the Synantonym tile; token returned to the dock.",
    "lexicon.removedHypohypernym": "Removed the Hypo-/hypernym tile; token returned to the dock.",
    "tokenDock.lexiconSynonymTitle": "Synonym",
    "tokenDock.lexiconSynonymHint":
      "Drop on the field to create a Synonym tile. Drag it onto a word for up to five synonyms (meanings fill in order). Mixing consumes the tile (self-mix). No definitions.",
    "tokenDock.lexiconSynonymDragHint": "Drop a Synonym token on an empty spot on the field.",
    "tokenDock.lexiconAntonymTitle": "Antonym",
    "tokenDock.lexiconAntonymHint":
      "Drop on the field to create an Antonym tile. Drag it onto a word for up to five antonyms (direct + indirect, meanings in order). Mixing consumes the tile (self-mix). No definitions.",
    "tokenDock.lexiconAntonymDragHint": "Drop an Antonym token on an empty spot on the field.",
    "tokenDock.lexiconHyponymTitle": "Hyponym",
    "tokenDock.lexiconHyponymHint":
      "Drop on the field to create a Hyponym tile. Drag it onto a word for up to five narrower terms (types or subtypes). Mixing consumes the tile (self-mix). No definitions.",
    "tokenDock.lexiconHyponymDragHint": "Drop a Hyponym token on an empty spot on the field.",
    "tokenDock.lexiconHypernymTitle": "Hypernym",
    "tokenDock.lexiconHypernymHint":
      "Drop on the field to create a Hypernym tile. Drag it onto a word for up to five broader parent terms. Mixing consumes the tile (self-mix). No definitions.",
    "tokenDock.lexiconHypernymDragHint": "Drop a Hypernym token on an empty spot on the field.",
    "tokenDock.lexiconSynantonymTitle": "Synantonym",
    "tokenDock.lexiconSynantonymHint":
      "Drop on the field to create a Synantonym tile. Drag onto a word: each preview alternates synonyms and antonyms. Mix consumes the tile.",
    "tokenDock.lexiconSynantonymDragHint": "Drop a Synantonym token on an empty spot on the field.",
    "tokenDock.lexiconHypohypernymTitle": "Hypo-/hypernym",
    "tokenDock.lexiconHypohypernymHint":
      "Drop on the field to create a Hypo-/hypernym tile. Drag onto a word: each preview alternates narrower hyponyms and broader hypernyms. Mix consumes the tile.",
    "tokenDock.lexiconHypohypernymDragHint": "Drop a Hypo-/hypernym token on an empty spot on the field.",
    "garbage.title": "Recycler",
    "garbage.hint": "Drag words to remove them. Gain tokens as reward",
    "garbage.binTitle": "Recycler",
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
    "sidebar.shopHint": "Buy upgrades that persist through game stages",
    "sidebar.shopCoinsSuffix": "coins",
    "sidebar.shopLoading": "Loading shop...",
    "modal.encyclopediaTitle": "Encyclopedia",
    "modal.close": "Close",
    "modal.historyTitle": "Match History",
    "modal.statusHistoryTitle": "Notification history",
    "modal.statusHistoryHint": "Last 50 messages from the status bar.",
    "modal.statusHistoryEmpty": "No notifications recorded yet.",
    "modal.historySubtractMix": "Subtract mix",
    "modal.historySort": "Sort by Result",
    "modal.broadChoiceTitle": "Broad Choice",
    "modal.broadChoiceSubtitle":
      "Pick which match to produce. Press Esc to take the first option listed.",
    "sidebar.matchHistoryButton": "History",
    "sidebar.genealogyContext": "View genealogy",
    "sidebar.sendToRecycler": "Send to Recycler",
    "sidebar.addCategoryLockedTooltip": "Buy shop upgrade to unlock categories",
    "modal.genealogyTitle": "Genealogy",
    "modal.genealogyShort": "Tree",
    "modal.genealogySubtitleHasTree":
      "Inbreeding score: {n} (extra repeats among those ancestors).",
    "modal.genealogySubtitleNoTree":
      "No mix parents on file (starter, shop, import, or older save).",
    "modal.genealogyEmptyBody":
      "This word was not created from a tracked mix, so there is no parent tree.",
    "modal.genealogyTierParents": "Parents",
    "modal.genealogyTierGrandparents": "Grandparents",
    "modal.genealogyTierGreat": "Great-grandparents",
    "modal.genealogyTierGreatGreat": "Great-great-grandparents",
    "modal.settingsTitle": "Settings",
    "modal.settingsLanguageLabel": "Interface language",
    "modal.settingsLanguageEn": "English",
    "modal.settingsLanguageRu": "Russian",
    "modal.settingsTilePaperLabel": "Field word cards (look)",
    "modal.settingsPlayfieldTextureLabel": "Matching field texture",
    "modal.settingsSoundVolumeLabel": "Sound volume",
    "modal.settingsMusicVolumeLabel": "Music volume",
    "settings.tilePaperVanilla": "Vanilla",
    "settings.tilePaperSticky": "Sticky scrap",
    "settings.tilePaperIndex": "Ruled index",
    "settings.tilePaperReceipt": "Receipt tear-off",
    "settings.tilePaperClip": "Magazine clip",
    "settings.tilePaperKraft": "Kraft scrap",
    "settings.playfieldTextureOption1": "Option 1",
    "settings.playfieldTextureOption2": "Option 2",
    "settings.playfieldTextureOption3": "Option 3",
    "settings.playfieldTextureOption4": "Option 4",
    "settings.spawnWord": "Spawn Word",
    "settings.questSimilarityHeading": "Quest similarity (top matches)",
    "settings.questSimilarityEffects": "Warmth effects",
    "settings.questSimilarityEffectsHint":
      "Color and motion from cosine similarity vs the quest word.",
    "settings.questSimilarityCoefficient": "Show similarity coefficient",
    "settings.questSimilarityCoefficientHint":
      "Append a 0.0–1.0 cosine score (one decimal) next to each top match. Experimental.",
    "settings.questWarmthShowcase": "Preview quest warmth styles",
    "settings.questWarmthShowcaseHint":
      "Sample words by quest-similarity tier. Rows 0.7–1.0 compare four blazing styles (debug).",
    "settings.questWarmthBurnChromatic": "Chromatic bloom",
    "settings.questWarmthBurnShimmer": "Heat shimmer (SVG)",
    "settings.questWarmthBurnSparks": "Ember sparks",
    "settings.questWarmthBurnChunky": "Chunky strips + flicker",
    "settings.exportSave": "Debug Export Save JSON",
    "settings.importSave": "Load Saved Game JSON",
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
    "status.openHistoryAria": "Открыть историю уведомлений",
    "tokenDock.label": "Токены",
    "tokenDock.howLink": "Как работают токены",
    "tokenDock.tooltip":
      "Токены помогают влиять на результат смешивания. Перетащите токен на слово на поле. Для токенов «синантоним» и «гипо-/гипероним» сначала бросьте токен на поле, затем смешивайте с другими словами.",
    "playfield.heading": "Поле смешивания",
    "playfield.hint":
      "ПКМ по слову — удалить. Перетащите одно слово на другое, чтобы создать новое.",
    "playfield.zoomOut": "Уменьшить",
    "playfield.zoomIn": "Увеличить",
    "playfield.zoomLockedHint": "Купите улучшение в магазине, чтобы открыть более большое поле",
    "playfield.clear": "Очистить поле",
    "quest.objectiveLabel": "Искомое слово",
    "quest.inkLabel": "Осталось ходов",
    "quest.loading": "Загрузка...",
    "playfield.empty": "Перетащите стартовое или открытое слово сюда.",
    "tile.broadChoiceBadge": "Широкий",
    "tile.minusMixBadge": "Минус",
    "tile.lexiconSynonym": "Синоним",
    "tile.lexiconAntonym": "Антоним",
    "tile.lexiconHyponym": "Гипоним",
    "tile.lexiconHypernym": "Гипероним",
    "tile.lexiconSynantonym": "Синантоним",
    "tile.lexiconHypohypernym": "Гипо-/гипероним",
    "lexicon.previewTitleSynonym": "Синонимы",
    "lexicon.previewTitleAntonym": "Антонимы",
    "lexicon.previewTitleHyponym": "Гипонимы",
    "lexicon.previewTitleHypernym": "Гиперонимы",
    "lexicon.previewPlaceholderTitle": "Лексикон (пока только EN)",
    "lexicon.previewPlaceholderBody": "В этой языковой сборке лексикон пока недоступен.",
    "lexicon.previewSenseLine": "Значение {n} / {total}",
    "lexicon.noAntonyms": "Нет антонимов",
    "lexicon.noSynonyms": "Нет синонимов для этого значения.",
    "lexicon.noHyponyms": "Нет гипонимов для этого значения.",
    "lexicon.noHypernyms": "Нет гиперонимов для этого значения.",
    "lexicon.invalidTokenError": "Недопустимый лексикон-токен.",
    "lexicon.twoLexiconError": "Нельзя смешивать два лексикон-токена.",
    "lexicon.mixAllStruck":
      "Все варианты для этого смешивания исключены из пула (запрет или корзина).",
    "lexicon.clickHint":
      "Перетащите на слово — список связей. Каждый предпросмотр чередует синонимы/антонимы или гипонимы/гиперонимы. Смешивание тратит токен.",
    "lexicon.noTokensOnLexicon": "Бросайте другие токены на обычные слова, не на лексикон-плитку.",
    "lexicon.noSynonymTokens": "Нет токенов синонимов.",
    "lexicon.noAntonymTokens": "Нет токенов антонимов.",
    "lexicon.noHyponymTokens": "Нет токенов гипонимов.",
    "lexicon.noHypernymTokens": "Нет токенов гиперонимов.",
    "lexicon.noSynantonymTokens": "Нет токенов «синантоним».",
    "lexicon.noHypohypernymTokens": "Нет токенов «гипо-/гипероним».",
    "lexicon.spawnedSynonym": "На поле выставлена плитка «Синоним».",
    "lexicon.spawnedAntonym": "На поле выставлена плитка «Антоним».",
    "lexicon.spawnedHyponym": "На поле выставлена плитка «Гипоним».",
    "lexicon.spawnedHypernym": "На поле выставлена плитка «Гипероним».",
    "lexicon.spawnedSynantonym": "На поле выставлена плитка «Синантоним».",
    "lexicon.spawnedHypohypernym": "На поле выставлена плитка «Гипо-/гипероним».",
    "lexicon.removedSynonym": "Плитка «Синоним» снята; токен возвращён.",
    "lexicon.removedAntonym": "Плитка «Антоним» снята; токен возвращён.",
    "lexicon.removedHyponym": "Плитка «Гипоним» снята; токен возвращён.",
    "lexicon.removedHypernym": "Плитка «Гипероним» снята; токен возвращён.",
    "lexicon.removedSynantonym": "Плитка «Синантоним» снята; токен возвращён.",
    "lexicon.removedHypohypernym": "Плитка «Гипо-/гипероним» снята; токен возвращён.",
    "tokenDock.lexiconSynonymTitle": "Синоним",
    "tokenDock.lexiconSynonymHint":
      "Бросьте на поле — плитка. Наведите на слово: до 5 синонимов по порядку значений. Смешивание — самосмешивание. Без определений.",
    "tokenDock.lexiconSynonymDragHint": "Бросьте токен синонима на свободное место поля.",
    "tokenDock.lexiconAntonymTitle": "Антоним",
    "tokenDock.lexiconAntonymHint":
      "Бросьте на поле — плитка. До 5 антонимов по порядку значений. Смешивание — самосмешивание. Без определений.",
    "tokenDock.lexiconAntonymDragHint": "Бросьте токен антонима на свободное место поля.",
    "tokenDock.lexiconHyponymTitle": "Гипоним",
    "tokenDock.lexiconHyponymHint":
      "Бросьте на поле — плитка. До 5 более узких терминов. Смешивание — самосмешивание. Без определений.",
    "tokenDock.lexiconHyponymDragHint": "Бросьте токен гипонима на свободное место поля.",
    "tokenDock.lexiconHypernymTitle": "Гипероним",
    "tokenDock.lexiconHypernymHint":
      "Бросьте на поле — плитка. До 5 более широких родительских терминов. Смешивание — самосмешивание. Без определений.",
    "tokenDock.lexiconHypernymDragHint": "Бросьте токен гиперонима на свободное место поля.",
    "tokenDock.lexiconSynantonymTitle": "Синантоним",
    "tokenDock.lexiconSynantonymHint":
      "Бросьте на поле — плитка. На слове каждый предпросмотр чередует синонимы и антонимы. Самосмешивание.",
    "tokenDock.lexiconSynantonymDragHint": "Бросьте токен «синантоним» на свободное место поля.",
    "tokenDock.lexiconHypohypernymTitle": "Гипо-/гипероним",
    "tokenDock.lexiconHypohypernymHint":
      "Бросьте на поле — плитка. На слове каждый предпросмотр чередует гипонимы и гиперонимы. Самосмешивание.",
    "tokenDock.lexiconHypohypernymDragHint": "Бросьте токен «гипо-/гипероним» на свободное место поля.",
    "garbage.title": "Переработчик",
    "garbage.hint": "Перетащите слова, чтобы убрать их. Награда — токены",
    "garbage.binTitle": "Переработчик",
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
    "sidebar.shopHint": "Покупайте улучшения, которые сохраняются между этапами игры",
    "sidebar.shopCoinsSuffix": "монет",
    "sidebar.shopLoading": "Загрузка магазина...",
    "modal.encyclopediaTitle": "Энциклопедия",
    "modal.close": "Закрыть",
    "modal.historyTitle": "История комбинаций",
    "modal.statusHistoryTitle": "История уведомлений",
    "modal.statusHistoryHint": "Последние 50 сообщений из строки статуса.",
    "modal.statusHistoryEmpty": "Пока нет записанных уведомлений.",
    "modal.historySubtractMix": "Смешение с вычитанием",
    "modal.historySort": "Сортировка по результату",
    "modal.broadChoiceTitle": "Широкий выбор",
    "modal.broadChoiceSubtitle":
      "Выберите исход смешивания. Esc — первый вариант из списка.",
    "sidebar.matchHistoryButton": "История",
    "sidebar.genealogyContext": "Родословная",
    "sidebar.sendToRecycler": "В переработчик",
    "sidebar.addCategoryLockedTooltip": "Купите улучшение в магазине, чтобы открыть категории",
    "modal.genealogyTitle": "Родословная",
    "modal.genealogyShort": "Дерево",
    "modal.genealogySubtitleHasTree":
      "Инбридинг: {n} (лишние повторы среди них).",
    "modal.genealogySubtitleNoTree":
      "Нет родителей от смешивания (старт, магазин, импорт или старое сохранение).",
    "modal.genealogyEmptyBody":
      "Слово не получено из отслеживаемого микса — дерева родителей нет.",
    "modal.genealogyTierParents": "Родители",
    "modal.genealogyTierGrandparents": "Бабушки и дедушки",
    "modal.genealogyTierGreat": "Прародители",
    "modal.genealogyTierGreatGreat": "Прапрародители",
    "modal.settingsTitle": "Настройки",
    "modal.settingsLanguageLabel": "Язык интерфейса",
    "modal.settingsLanguageEn": "English",
    "modal.settingsLanguageRu": "Русский",
    "modal.settingsTilePaperLabel": "Карточки на поле (оформление)",
    "modal.settingsPlayfieldTextureLabel": "Текстура поля сопоставления",
    "modal.settingsSoundVolumeLabel": "Громкость звука",
    "modal.settingsMusicVolumeLabel": "Громкость музыки",
    "settings.tilePaperVanilla": "Vanilla (без бумаги)",
    "settings.tilePaperSticky": "Стикер",
    "settings.tilePaperIndex": "Карточка с линейкой",
    "settings.tilePaperReceipt": "Чек (перфорация)",
    "settings.tilePaperClip": "Вырезка из журнала",
    "settings.tilePaperKraft": "Крафт-бумага",
    "settings.playfieldTextureOption1": "Вариант 1",
    "settings.playfieldTextureOption2": "Вариант 2",
    "settings.playfieldTextureOption3": "Вариант 3",
    "settings.playfieldTextureOption4": "Вариант 4",
    "settings.spawnWord": "Создать слово",
    "settings.questSimilarityHeading": "Схожесть с квестом (топ-совпадения)",
    "settings.questSimilarityEffects": "Эффекты «тепла»",
    "settings.questSimilarityEffectsHint":
      "Цвет и анимация по косинусной близости к слову квеста.",
    "settings.questSimilarityCoefficient": "Показывать коэффициент",
    "settings.questSimilarityCoefficientHint":
      "Добавлять косинусную близость 0,0–1,0 (один знак) у каждого совпадения. Эксперимент.",
    "settings.questWarmthShowcase": "Показать стили «тепла» квеста",
    "settings.questWarmthShowcaseHint":
      "Примеры по уровням схожести. Строки 0.7–1.0 — четыре варианта «пламени» (отладка).",
    "settings.questWarmthBurnChromatic": "Хроматическое свечение",
    "settings.questWarmthBurnShimmer": "Мерцание (SVG)",
    "settings.questWarmthBurnSparks": "Искры углей",
    "settings.questWarmthBurnChunky": "Полосы + мерцание",
    "settings.exportSave": "Экспорт сохранения (JSON)",
    "settings.importSave": "Загрузить сохранение (JSON)",
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
      description:
        "Roll 10 common words; pick 1 to discover. Free per stage: 1 + each tier of «More free Word Boosters».",
      purchaseDone: (cost) =>
        cost <= 0 ? "Free booster — pick a word." : `Booster (${cost}) — pick a word.`,
      reopen: "Booster pick still open.",
    },
    "shop-match-2": {
      title: "Second Result Token",
      description: "",
      purchaseDone: (cost) => `+1 Second Result (${cost}).`,
    },
    "shop-match-3": {
      title: "Third Result Token",
      description: "",
      purchaseDone: (cost) => `+1 Third Result (${cost}).`,
    },
    "shop-match-4": {
      title: "Fourth Result Token",
      description: "",
      purchaseDone: (cost) => `+1 Fourth Result (${cost}).`,
    },
    "shop-match-5": {
      title: "Fifth Result Token",
      description: "",
      purchaseDone: (cost) => `+1 Fifth Result (${cost}).`,
    },
    "shop-ban-word": {
      title: "Ban Word Token",
      description: "",
      purchaseDone: (cost) => `+1 Ban Word (${cost}).`,
    },
    "shop-broad-choice": {
      title: "Broad Choice Token",
      description: "Charge a field word: up to 10 mix outcomes, pick one.",
      purchaseDone: (cost) => `+1 Broad Choice (${cost}).`,
    },
    "shop-minus-mix": {
      title: "Minus Mix Token",
      description: "Tag a field word: mix = stationary word minus dragged word.",
      purchaseDone: (cost) => `+1 Minus mix (${cost}).`,
    },
    "shop-lexicon-synantonym": {
      title: "Synantonym token",
      description: "Field tile: hover swaps synonym/antonym. Mix uses the tile.",
      purchaseDone: (cost) => `+1 Synantonym (${cost}).`,
    },
    "shop-lexicon-hypohypernym": {
      title: "Hypo-/hypernym token",
      description: "Field tile: hover swaps hyponym/hypernym. Mix uses the tile.",
      purchaseDone: (cost) => `+1 Hypo-/hypernym (${cost}).`,
    },
    "shop-playfield-pan-zoom": {
      title: "Field Pan & Zoom",
      description: "Unlocks a bigger mix field",
      purchaseDone: () => "Pan & zoom on.",
    },
    "shop-playfield-expand": {
      title: "Expand Mixing Field +50%",
      description: "+50% field size (needs pan & zoom).",
      purchaseDone: () => "Field +50%.",
    },
    "shop-playfield-expand-2": {
      title: "Expand Mixing Field +50% (again)",
      description: "Another +50% field size.",
      purchaseDone: () => "Field +50% again.",
    },
    "shop-playfield-upgrade-track": {
      title: "Mixing field & view",
      description: "Pan, zoom, and both +50% expansions.",
      purchaseDone: () => "",
    },
    "shop-run-permanent-random-tokens": {
      title: "1 random token",
      description: "A random extra token at the beginning of a new stage.",
      purchaseDone: (cost, tier) =>
        `Tier ${tier}/5 (${cost}): +${tier} random quest token${tier === 1 ? "" : "s"} per new stage.`,
    },
    "shop-run-permanent-more-ink": {
      title: "More ink",
      description: "Get +1 bonus turn per tier at new stage.",
      purchaseDone: (cost, tier) =>
        `Tier ${tier}/10 (${cost}): +${tier} turn${tier === 1 ? "" : "s"} on first quest each stage.`,
    },
    "shop-run-free-word-booster": {
      title: "More free Word Boosters",
      description: "Each stage +1 free Word Booster per tier of this upgrade.",
      purchaseDone: (cost, tier) => {
        const freePerStage = 1 + tier;
        return `Tier ${tier}/2 (${cost}): ${freePerStage} free Word Booster${
          freePerStage === 1 ? "" : "s"
        } per stage.`;
      },
    },
    "shop-recycling-machine": {
      title: "Buy recycling machine",
      description: "Shred unused words to get tokens",
      purchaseDone: (cost) => `Recycler on (${cost}).`,
    },
    "shop-recycling-machine-owned": {
      title: "Recycling machine",
      description: "Recycler lives under Available words; use the Discovered tab.",
      purchaseDone: () => "",
    },
    "shop-custom-categories-unlock": {
      title: "Custom word categories",
      description: "Unlock word categorising",
      purchaseDone: (cost) => `Categories on (${cost}).`,
    },
    "shop-custom-categories-unlock-owned": {
      title: "Custom categories unlocked",
      description: "+ by Available words adds a category.",
      purchaseDone: () => "",
    },
    "shop-quest-turn": {
      title: "Quest Turn +1",
      description: "+1 turn before you fail the active quest.",
      purchaseDone: (cost, turns) => `+1 turn (${cost}) · out in ${turns}.`,
    },
  },
  ru: {
    "shop-word-booster": {
      title: "Бустер слов",
      description:
        "10 частых слов; оставьте 1. Бесплатно за этап: 1 + каждый уровень «Больше бесплатных бустеров».",
      purchaseDone: (cost) =>
        cost <= 0 ? "Бесплатно — выберите слово." : `Бустер (${cost}) — выберите слово.`,
      reopen: "Бустер всё ещё открыт.",
    },
    "shop-match-2": {
      title: "Токен «Второй результат»",
      description: "",
      purchaseDone: (cost) => `+1 «Второй результат» (${cost}).`,
    },
    "shop-match-3": {
      title: "Токен «Третий результат»",
      description: "",
      purchaseDone: (cost) => `+1 «Третий результат» (${cost}).`,
    },
    "shop-match-4": {
      title: "Токен «Четвёртый результат»",
      description: "",
      purchaseDone: (cost) => `+1 «Четвёртый результат» (${cost}).`,
    },
    "shop-match-5": {
      title: "Токен «Пятый результат»",
      description: "",
      purchaseDone: (cost) => `+1 «Пятый результат» (${cost}).`,
    },
    "shop-ban-word": {
      title: "Токен «Запретить слово»",
      description: "",
      purchaseDone: (cost) => `+1 «Запретить слово» (${cost}).`,
    },
    "shop-broad-choice": {
      title: "Токен «Широкий выбор»",
      description: "Зарядите слово на поле: до 10 исходов смешивания, выберите один.",
      purchaseDone: (cost) => `+1 «Широкий выбор» (${cost}).`,
    },
    "shop-minus-mix": {
      title: "Токен «Минус-смешение»",
      description: "Пометьте слово: смешение = слово под курсором минус перетаскиваемое.",
      purchaseDone: (cost) => `+1 «Минус-смешение» (${cost}).`,
    },
    "shop-lexicon-synantonym": {
      title: "Токен «Синантоним»",
      description: "Плитка: наведение чередует синоним/антоним. Смешение тратит плитку.",
      purchaseDone: (cost) => `+1 «Синантоним» (${cost}).`,
    },
    "shop-lexicon-hypohypernym": {
      title: "Токен «Гипо-/гипероним»",
      description: "Плитка: наведение чередует гипоним/гипероним. Смешение тратит плитку.",
      purchaseDone: (cost) => `+1 «Гипо-/гипероним» (${cost}).`,
    },
    "shop-playfield-pan-zoom": {
      title: "Панорама и масштаб поля",
      description: "Панорама и масштаб всего поля смешивания.",
      purchaseDone: () => "Панорама и масштаб вкл.",
    },
    "shop-playfield-expand": {
      title: "Расширить поле +50%",
      description: "+50% размера поля (нужны панорама и масштаб).",
      purchaseDone: () => "Поле +50%.",
    },
    "shop-playfield-expand-2": {
      title: "Расширить поле ещё +50%",
      description: "Ещё +50% размера поля.",
      purchaseDone: () => "Поле снова +50%.",
    },
    "shop-playfield-upgrade-track": {
      title: "Поле и вид",
      description: "Панорама, масштаб и оба расширения +50%.",
      purchaseDone: () => "",
    },
    "shop-run-permanent-random-tokens": {
      title: "1 случайный токен",
      description: "Каждый новый этап: лишние случайные токены квеста (число = уровень, макс. 5).",
      purchaseDone: (cost, tier) =>
        `Ур. ${tier}/5 (${cost}): +${tier} к токенам квеста на каждый новый этап.`,
    },
    "shop-run-permanent-more-ink": {
      title: "Больше чернил",
      description: "Каждый новый этап: первый квест +1 ход за уровень (макс. +10).",
      purchaseDone: (cost, tier) =>
        `Ур. ${tier}/10 (${cost}): +${tier} к лимиту первого квеста на этап.`,
    },
    "shop-run-free-word-booster": {
      title: "Больше бесплатных бустеров",
      description: "За этап: +1 бесплатный бустер за уровень здесь (вместе с базовым 1).",
      purchaseDone: (cost, tier) => {
        const freePerStage = 1 + tier;
        return `Ур. ${tier}/2 (${cost}): ${freePerStage} бесплатных бустера на этап.`;
      },
    },
    "shop-recycling-machine": {
      title: "Купить машину переработки",
      description: "Переработчик у «Доступных слов»: убирайте слова со списка за токены пула квеста.",
      purchaseDone: (cost) => `Переработчик вкл. (${cost}).`,
    },
    "shop-recycling-machine-owned": {
      title: "Переработка",
      description: "Переработчик у «Доступных слов»; панель «Открытые».",
      purchaseDone: () => "",
    },
    "shop-custom-categories-unlock": {
      title: "Свои категории слов",
      description: "+ у «Доступных слов»: свои категории.",
      purchaseDone: (cost) => `Категории вкл. (${cost}).`,
    },
    "shop-custom-categories-unlock-owned": {
      title: "Свои категории открыты",
      description: "+ у «Доступных слов» добавляет категорию.",
      purchaseDone: () => "",
    },
    "shop-quest-turn": {
      title: "Квест: +1 ход",
      description: "+1 ход до провала текущего квеста.",
      purchaseDone: (cost, turns) => `+1 ход (${cost}) · конец через ${turns}.`,
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
  const c = Math.max(0, Math.floor(Number(itemCost)) || 0);
  if (c === 0) {
    return activeUiLang === "ru" ? "Бесплатно" : "Free";
  }
  if (activeUiLang === "ru") {
    return `Купить за ${c} монет`;
  }
  return `Buy for ${c} coins`;
}

/** Playfield shop card body: fixed line + 1-based tier (next step, or max/ max when complete). */
export function formatPlayfieldUpgradeShopBlurb(tierIndex, tierTotal) {
  const tot = Math.max(1, Math.floor(Number(tierTotal)) || 1);
  const cur = clamp(Math.floor(Number(tierIndex)) || 1, 1, tot);
  if (activeUiLang === "ru") {
    return `Откройте большее поле смешивания. Уровень ${cur}/${tot}.`;
  }
  return `Unlock a bigger mixing field. Tier ${cur}/${tot}.`;
}

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

export function getWordBoosterTopTitle(pending, reason, boosterCost, freeRemaining) {
  if (pending) {
    return activeUiLang === "ru"
      ? "Довыберите бустер."
      : "Finish booster pick.";
  }
  if (reason) {
    return reason;
  }
  const cost = Math.max(0, Math.floor(Number(boosterCost)) || 0);
  if (cost === 0) {
    const n = Math.max(0, Math.floor(Number(freeRemaining)) || 0);
    if (n > 0) {
      return activeUiLang === "ru"
        ? `Бесплатно · ещё ${n}.`
        : `Free · ${n} left.`;
    }
    return activeUiLang === "ru"
      ? "Бесплатный бустер на этапе."
      : "Free booster this stage.";
  }
  return activeUiLang === "ru"
    ? `${cost} монет.`
    : `${cost} coins.`;
}

export function setUiLang(lang) {
  if (lang === "en" || lang === "ru") {
    activeUiLang = lang;
    window.localStorage.setItem(UI_STORAGE_KEY, lang);
  }
}

/** If user never chose, follow server game locale. */
export function resolveUiLang(gameLocale) {
  if (UI_LANG_LOCKED_TO_EN) {
    return "en";
  }
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
