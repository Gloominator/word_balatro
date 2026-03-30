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
  rustle: 0.22,
};

const FILES = {
  tileGrab: "tile_grab.wav",
  tileRelease: "tile_release.wav",
  tileRustle: "tile_rustle.wav",
  uiClick: "ui_click.wav",
  mixSuccess: "mix_success.wav",
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

export function playTileGrabSound() {
  playNamed("tileGrab", VOL.tile);
}

export function playTileReleaseSounds() {
  if (!wordmathSoundsEnabled()) {
    return;
  }
  playNamed("tileRelease", VOL.tile);
  window.setTimeout(() => playNamed("tileRustle", VOL.rustle), 40);
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
    playNamed("mixSuccess", VOL.game);
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
