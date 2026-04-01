"""Generate spanishmostcommon.json (ranked lemma list) using wordfreq + es_core_news_lg POS filter."""
import unicodedata
from pathlib import Path

import wordfreq
import spacy

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "spanishmostcommon.json"
MODEL = "es_core_news_lg"
TARGET = 2000
KEEP_POS = frozenset({"NOUN", "VERB", "ADJ", "ADV"})
MIN_ZIPF = 3.5
MIN_LEN = 3


def nfc_lower(s: str) -> str:
    return unicodedata.normalize("NFC", (s or "").strip().lower())


def strict_lemma(tok) -> str:
    lem = (tok.lemma_ or "").strip().lower()
    if lem and lem != "-pron-" and all(ch.isalpha() for ch in lem):
        return unicodedata.normalize("NFC", lem)
    norm = (tok.norm_ or "").strip().lower()
    if norm and all(ch.isalpha() for ch in norm):
        return unicodedata.normalize("NFC", norm)
    return nfc_lower(tok.text)


def main():
    print(f"Loading {MODEL}...")
    nlp = spacy.load(MODEL)
    seen = set()
    lines = []
    rank = 0
    for w in wordfreq.iter_wordlist("es", wordlist="best"):
        if len(lines) >= TARGET:
            break
        z = wordfreq.zipf_frequency(w, "es")
        if z < MIN_ZIPF:
            continue
        surf = nfc_lower(w)
        if not surf or not surf.isalpha():
            continue
        doc = nlp(surf)
        if len(doc) != 1:
            continue
        tok = doc[0]
        if tok.pos_ not in KEEP_POS:
            continue
        lemma = strict_lemma(tok)
        if (
            not lemma
            or not lemma.isalpha()
            or len(lemma) < MIN_LEN
            or " " in lemma
            or "-" in lemma
        ):
            continue
        if lemma in seen:
            continue
        seen.add(lemma)
        rank += 1
        lines.append(f"{rank}.{lemma}")
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"Wrote {len(lines)} lemmas to {OUT}")


if __name__ == "__main__":
    main()
