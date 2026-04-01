/**
 * Game SFX (placeholders from Kenney CC0 packs via Calinou Godot mirrors).
 * License text: ./sounds/LICENSE.CC0-Kenney.txt
 */

const ENABLED_KEY = "wordmath-sound-enabled";
const VOLUME_KEY = "wordmath-sound-volume";
const DEFAULT_VOLUME_PERCENT = 80;
const MUSIC_VOLUME_KEY = "wordmath-music-volume";
const DEFAULT_MUSIC_VOLUME_PERCENT = 50;
/** Upper cap so BGM stays under SFX when both sliders are at 100%. */
const MUSIC_LINEAR_CAP = 0.4;

const MUSIC_URL = new URL("./sounds/music/soundtrack.mp3", import.meta.url).href;

const VOL = {
  master: 0.52,
  ui: 0.42,
  tile: 0.48,
  game: 0.5,
  token: 0.4,
};

const PAPER_CRUMP_SEGMENT_SEC = 0.5;
const PAPER_CRUMP_URL = new URL("./sounds/paper/CRUMPINGPAPER.mp3", import.meta.url).href;
const PAPER_RIP_URL = new URL("./sounds/paper/PAPERRIP.mp3", import.meta.url).href;
const PAPER_SLIDE_URL = new URL("./sounds/paper/PAPERSLIDE.mp3", import.meta.url).href;

const MIX_PUNCHER_URLS = [1, 2, 3, 4, 5].map(
  (n) => new URL(`./sounds/puncher${n}.mp3`, import.meta.url).href,
);

const FILES = {
  uiClick: "ui_click.wav",
  tokenPickup: "token_pickupnew.mp3",
  questComplete: "FANFARE.mp3",
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

function clampMusicVolumePercent(raw) {
  const n = Math.round(Number(raw));
  if (!Number.isFinite(n)) {
    return DEFAULT_MUSIC_VOLUME_PERCENT;
  }
  return Math.min(100, Math.max(0, n));
}

/**
 * @returns {number} 0–100
 */
export function getWordmathMusicVolumePercent() {
  try {
    const stored = window.localStorage.getItem(MUSIC_VOLUME_KEY);
    if (stored != null && stored !== "") {
      return clampMusicVolumePercent(stored);
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_MUSIC_VOLUME_PERCENT;
}

/**
 * @param {number} percent 0–100
 */
export function setWordmathMusicVolumePercent(percent) {
  const v = clampMusicVolumePercent(percent);
  try {
    window.localStorage.setItem(MUSIC_VOLUME_KEY, String(v));
  } catch {
    /* ignore */
  }
  applyWordmathMusicVolumeLive();
}

/** @type {HTMLAudioElement | null} */
let musicAudio = null;
let musicStarted = false;

function computeMusicLinearVolume() {
  const p = getWordmathMusicVolumePercent() / 100;
  return Math.min(1, MUSIC_LINEAR_CAP * p);
}

function destroyCurrentMusicAudio() {
  if (!musicAudio) {
    return;
  }
  musicAudio.pause();
  musicAudio.removeAttribute("src");
  musicAudio.load();
  musicAudio = null;
}

function playSoundtrack() {
  if (getWordmathMusicVolumePercent() <= 0) {
    return;
  }
  destroyCurrentMusicAudio();
  const audio = new Audio(MUSIC_URL);
  musicAudio = audio;
  audio.loop = true;
  audio.volume = computeMusicLinearVolume();
  audio.play().catch(() => {});
}

function startWordmathBackgroundMusicAfterGesture() {
  if (musicStarted) {
    return;
  }
  musicStarted = true;
  if (getWordmathMusicVolumePercent() <= 0) {
    return;
  }
  playSoundtrack();
}

/**
 * Call after music volume changes (slider or storage) to pause/resume/update gain.
 */
export function applyWordmathMusicVolumeLive() {
  const v = getWordmathMusicVolumePercent();
  if (v <= 0) {
    if (musicAudio && !musicAudio.ended) {
      musicAudio.pause();
    }
    return;
  }
  if (!musicStarted) {
    return;
  }
  if (musicAudio) {
    musicAudio.volume = computeMusicLinearVolume();
    if (musicAudio.paused) {
      musicAudio.play().catch(() => {});
    }
    return;
  }
  playSoundtrack();
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

/** Dock / field token acquired (shop buy or stacked after mix outcome). */
export function playTokenPickupSound() {
  playNamed("tokenPickup", VOL.token);
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
  // ~50% softer than other tile/paper SFX so frequent top-match pops stay in the background.
  audio.volume = Math.min(1, VOL.master * VOL.tile * 0.85 * 0.5 * userMul);
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

/** New tile spawn from the field (mix, booster, wildcard, encyclopedia, etc.) when quest did not just complete. */
function playMixSpawnRandomPuncherSound() {
  const userMul = getWordmathSoundVolumePercent() / 100;
  if (userMul <= 0) {
    return;
  }
  const url = MIX_PUNCHER_URLS[Math.floor(Math.random() * MIX_PUNCHER_URLS.length)];
  const audio = new Audio(url);
  audio.volume = Math.min(1, VOL.master * VOL.game * userMul);
  audio.play().catch(() => {});
}

/**
 * @param {{ shouldBlockSpawn?: boolean, outcome?: object }} spec
 */
export function playRememberOutcomeSound(spec) {
  if (!wordmathSoundsEnabled() || !spec?.outcome) {
    return;
  }
  const shouldBlockSpawn = Boolean(spec.shouldBlockSpawn);
  const hadSpawn = !shouldBlockSpawn;
  const o = spec.outcome;
  const questWon = Boolean(o.questResult?.completedQuest);

  let primary = null;
  if (questWon) {
    primary = "quest";
  } else if (hadSpawn) {
    primary = "mix";
  }

  const tok = countDockTokensFromOutcome(o);

  if (primary === "quest") {
    playNamed("questComplete", VOL.game);
  } else if (primary === "mix") {
    playMixSpawnRandomPuncherSound();
  }

  if (tok > 0) {
    const delay = primary ? 90 : 0;
    window.setTimeout(() => playTokenPickupSound(), delay);
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
  document.addEventListener("pointerdown", startWordmathBackgroundMusicAfterGesture, { capture: true, once: true });
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
