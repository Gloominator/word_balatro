"""
Build deck candidates from a hand-picked word list.
Reads WORDS_PICKED.txt, keeps the suit from each section header, and writes a
small JSON file ready for final vector enrichment.
"""
import json
import re
from pathlib import Path

from wordfreq import zipf_frequency

SOURCE_PATH = Path("WORDS_PICKED.txt")
CURATION_PATH = Path("deck_candidates.json")


def rarity_to_chips(zipf_freq):
    """
    zipf_frequency scale: 7+ = super common, 2 = rare.
    Invert: rare = more chips. Map zipf 2.5-7.0 → chips 50-5.
    """
    chips = int(50 - (zipf_freq - 2.5) * 10)
    return max(5, min(50, chips))


def normalize_word(text):
    text = text.strip().lower()
    text = text.replace("’", "'")
    return text


def extract_words_from_line(line):
    words = []
    parts = [part.strip() for part in line.split("\t") if part.strip()]
    for part in parts:
        if part.isdigit() or part.lower() == "word" or part == "#":
            continue
        words.append(normalize_word(part))
    return words


def parse_words_picked(path):
    suit_map = {
        "NOUNS": "NOUN",
        "ADJECTIVES": "ADJ",
        "VERBS": "VERB",
        "ADVERBS": "ADV",
    }
    current_suit = None
    picked = []
    seen = set()

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line:
            continue

        heading_match = re.search(r"(NOUNS|ADJECTIVES|VERBS|ADVERBS)", line.upper())
        if heading_match:
            current_suit = suit_map[heading_match.group(1)]
            continue

        if current_suit is None or line.startswith("#"):
            continue

        for word in extract_words_from_line(line):
            if word not in seen:
                seen.add(word)
                picked.append({"text": word, "suit": current_suit})

    return picked


def main():
    if not SOURCE_PATH.exists():
        raise FileNotFoundError(f"Missing {SOURCE_PATH}. Put your picked words there first.")

    picked = parse_words_picked(SOURCE_PATH)
    candidates = []
    for entry in picked:
        freq = round(zipf_frequency(entry["text"], "en"), 2)
        candidates.append({
            "text": entry["text"],
            "freq": freq,
            "chips": rarity_to_chips(freq),
            "suit": entry["suit"],
        })

    candidates.sort(key=lambda c: c["text"])

    print(f"Parsed {len(candidates)} picked words from {SOURCE_PATH}.")
    print(f"Writing to {CURATION_PATH} ...")

    with CURATION_PATH.open("w", encoding="utf-8") as f:
        json.dump(candidates, f, indent=2, ensure_ascii=False)

    print("Done.")
    print("Review deck_candidates.json if you want, then run: python add_vectors_to_deck.py deck_candidates.json")


if __name__ == "__main__":
    main()
