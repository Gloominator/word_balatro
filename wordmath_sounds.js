/**
 * Game SFX (placeholders from Kenney CC0 packs via Calinou Godot mirrors).
 * License text: ./sounds/LICENSE.CC0-Kenney.txt
 */

const ENABLED_KEY = "wordmath-sound-enabled";
const VOLUME_KEY = "wordmath-sound-volume";
const DEFAULT_VOLUME_PERCENT = 80;

const VOL = {
  master: 0.52,
  ui: 0.42,
  tile: 0.48,
  game: 0.5,
  token: 0.4,
};

const PAPER_CRUMP_SEGMENT_SEC = 0.5;
const PAPER_CRUMP_URL = new URL("./sounds/paper/crumpingpaper.mp3", import.meta.url).href;
const PAPER_RIP_URL = new URL("./sounds/paper/PAPERRIP.mp3", import.meta.url).href;
const PAPER_SLIDE_URL = new URL("./sounds/paper/PAPERSLIDE.mp3", import.meta.url).href;
const PAPER_CLICK_URL = new URL("./sounds/paper/CLICK.wav", import.meta.url).href;

const FILES = {
  uiClick: "ui_click.wav",
  tokenPickup: "token_pickup.wav",
  encyclopediaEntry: "encyclopedia_entry.wav",
  questComplete: "quest_complete.wav",
  stageComplete: "stage_complete.wav",
};

const baseHref = new URL("./sounds/", import.meta.url).href;

function soundUrl(name) {
  return `${baseHref}${FILES[name]}`;
}

function clampVolumePercent(raw) {
  const n = Math.round(Number(raw));
  if (!Number.isFinite(n)) {
    return DEFAULT_VOLUME_PERCENT;
  }
  return Math.min(100, Math.max(0, n));
}

/**
 * @returns {number} 0–100
 */
export function getWordmathSoundVolumePercent() {
  try {
    const storedVol = window.localStorage.getItem(VOLUME_KEY);
    if (storedVol != null && storedVol !== "") {
      return clampVolumePercent(storedVol);
    }
    const legacy = window.localStorage.getItem(ENABLED_KEY);
    if (legacy === "0" || legacy === "false") {
      return 0;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_VOLUME_PERCENT;
}

/**
 * @param {number} percent 0–100
 */
export function setWordmathSoundVolumePercent(percent) {
  const v = clampVolumePercent(percent);
  try {
    window.localStorage.setItem(VOLUME_KEY, String(v));
    window.localStorage.setItem(ENABLED_KEY, v > 0 ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function wordmathSoundsEnabled() {
  return getWordmathSoundVolumePercent() > 0;
}

export function setWordmathSoundsEnabled(on) {
  try {
    if (on) {
      const cur = getWordmathSoundVolumePercent();
      setWordmathSoundVolumePercent(cur > 0 ? cur : DEFAULT_VOLUME_PERCENT);
      window.localStorage.setItem(ENABLED_KEY, "1");
    } else {
      setWordmathSoundVolumePercent(0);
      window.localStorage.setItem(ENABLED_KEY, "0");
    }
  } catch {
    /* ignore */
  }
}

function playNamed(name, volumeScale = 1) {
  const userMul = getWordmathSoundVolumePercent() / 100;
  if (userMul <= 0) {
    return;
  }
  const audio = new Audio(soundUrl(name));
  audio.volume = Math.min(1, VOL.master * volumeScale * userMul);
  audio.play().catch(() => {});
}

/**
 * Plays one random contiguous segment from crumpingpaper.mp3 (length up to PAPER_CRUMP_SEGMENT_SEC).
 * New Audio() each call so grab/release can overlap.
 */
function playRandomPaperCrumpSegment(volumeScale = VOL.tile) {
  const userMul = getWordmathSoundVolumePercent() / 100;
  if (userMul <= 0) {
    return;
  }

  const audio = new Audio(PAPER_CRUMP_URL);
  audio.volume = Math.min(1, VOL.master * volumeScale * userMul);

  let stopTimer = 0;
  const teardown = () => {
    window.clearTimeout(stopTimer);
    audio.pause();
    audio.src = "";
    audio.load();
  };

  const onMeta = () => {
    const dur = audio.duration;
    if (!Number.isFinite(dur) || dur <= 0) {
      teardown();
      return;
    }
    const win = Math.min(PAPER_CRUMP_SEGMENT_SEC, dur);
    const maxStart = Math.max(0, dur - win);
    const start = maxStart > 0 ? Math.random() * maxStart : 0;

    const startPlayback = () => {
      audio.play().catch(() => teardown());
      stopTimer = window.setTimeout(teardown, win * 1000 + 50);
    };

    const onSeeked = () => {
      audio.removeEventListener("seeked", onSeeked);
      startPlayback();
    };
    audio.addEventListener("seeked", onSeeked);
    audio.currentTime = start;

    if (Math.abs(audio.currentTime - start) < 0.02 && audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      audio.removeEventListener("seeked", onSeeked);
      startPlayback();
    }
  };

  audio.addEventListener("loadedmetadata", onMeta, { once: true });
  audio.addEventListener("error", teardown, { once: true });
  audio.load();
}

export function playTileGrabSound() {
  playRandomPaperCrumpSegment(VOL.tile);
}

export function playTileReleaseSounds() {
  playRandomPaperCrumpSegment(VOL.tile);
}

/** Recycler / garbage bin (full clip). */
export function playPaperRipSound() {
  const userMul = getWordmathSoundVolumePercent() / 100;
  if (userMul <= 0) {
    return;
  }
  const audio = new Audio(PAPER_RIP_URL);
  audio.volume = Math.min(1, VOL.master * VOL.tile * userMul);
  audio.play().catch(() => {});
}

/** Mix-hover preview (word over word) — full clip; ok to overlap if user switches targets quickly. */
export function playPaperSlideSound() {
  const userMul = getWordmathSoundVolumePercent() / 100;
  if (userMul <= 0) {
    return;
  }
  const audio = new Audio(PAPER_SLIDE_URL);
  audio.volume = Math.min(1, VOL.master * VOL.tile * 0.85 * userMul);
  audio.play().catch(() => {});
}

export function playUiClickSound() {
  playNamed("uiClick", VOL.ui);
}

export function playStageCompleteSound() {
  playNamed("stageComplete", VOL.game * 1.05);
}

function countDockTokensFromOutcome(outcome) {
  if (!outcome) {
    return 0;
  }
  let n = 0;
  n += outcome.newBroadChoiceTokens || 0;
  n += outcome.newMinusMixTokens || 0;
  n += outcome.newBanWordTokens || 0;
  n += outcome.newWildcardTokens || 0;
  n += outcome.newLexiconSynantonymTokens || 0;
  n += outcome.newLexiconHypohypernymTokens || 0;
  const pr = outcome.newPositionTokenRewards || {};
  for (const k of Object.keys(pr)) {
    n += pr[k] || 0;
  }
  return n;
}

/** New tile from mix when not using quest-complete or encyclopedia-entry primary SFX. */
function playMixSpawnPaperClickSound() {
  const userMul = getWordmathSoundVolumePercent() / 100;
  if (userMul <= 0) {
    return;
  }
  const audio = new Audio(PAPER_CLICK_URL);
  audio.volume = Math.min(1, VOL.master * VOL.game * userMul);
  audio.play().catch(() => {});
}

/**
 * @param {{ fromMix?: boolean, shouldBlockSpawn?: boolean, outcome?: object }} spec
 */
export function playRememberOutcomeSound(spec) {
  if (!wordmathSoundsEnabled() || !spec?.outcome) {
    return;
  }
  const fromMix = Boolean(spec.fromMix);
  const shouldBlockSpawn = Boolean(spec.shouldBlockSpawn);
  const hadSpawn = !shouldBlockSpawn;
  const o = spec.outcome;
  const questWon = Boolean(o.questResult?.completedQuest);
  const encDing = Boolean(
    o.isInEncyclopedia
    && !o.hiddenEncyclopediaDiscovery
    && (!o.wasDiscovered || o.stageEncoreEncyclopediaReward)
    && !questWon,
  );

  let primary = null;
  if (questWon) {
    primary = "quest";
  } else if (encDing && hadSpawn) {
    primary = "encyclopedia";
  } else if (hadSpawn && fromMix && !encDing) {
    primary = "mix";
  } else if (hadSpawn && !fromMix) {
    primary = "mix";
  }

  const tok = countDockTokensFromOutcome(o);

  if (primary === "quest") {
    playNamed("questComplete", VOL.game);
  } else if (primary === "encyclopedia") {
    playNamed("encyclopediaEntry", VOL.game);
  } else if (primary === "mix") {
    playMixSpawnPaperClickSound();
  }

  if (tok > 0) {
    const delay = primary ? 90 : 0;
    window.setTimeout(() => playNamed("tokenPickup", VOL.token), delay);
  }
}

function shouldPlayUiClick(target) {
  if (!(target instanceof Element)) {
    return false;
  }
  if (target.closest("[data-sound=\"off\"], [data-no-ui-sound]")) {
    return false;
  }
  const btn = target.closest("button, [role=\"button\"], input[type=\"button\"], input[type=\"submit\"], label");
  if (!btn) {
    return false;
  }
  if (btn instanceof HTMLButtonElement && btn.disabled) {
    return false;
  }
  if (btn instanceof HTMLInputElement && btn.disabled) {
    return false;
  }
  return true;
}

export function initWordmathSounds() {
  document.addEventListener(
    "click",
    (event) => {
      if (!shouldPlayUiClick(event.target)) {
        return;
      }
      playUiClickSound();
    },
    true,
  );
}
