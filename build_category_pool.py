import json
import re
import sys
import unicodedata
from pathlib import Path

try:
    import spacy
except ImportError:
    print("Need spaCy. Run: pip install spacy && python -m spacy download en_core_web_lg")
    sys.exit(1)

from wordfreq import zipf_frequency

WORDS_PICKED_PATH = Path("WORDS_PICKED.txt")
DECK_PATH = Path("deck.json")
POOL_PATH = Path("category_pool.json")

SUIT_MAP = {
    "nouns": "NOUN",
    "verbs": "VERB",
    "adjectives": "ADJ",
    "adverbs": "ADV",
}


def strip_accents(text):
    return "".join(
        char for char in unicodedata.normalize("NFKD", text)
        if not unicodedata.combining(char)
    )


def normalize_category_name(text):
    cleaned = re.sub(r"^[^\w]+", "", text.strip(), flags=re.UNICODE)
    cleaned = re.sub(r"\s+", " ", cleaned)
    return cleaned.lower().replace(" ", "_")


def rarity_to_chips(zipf_freq):
    chips = int(50 - (zipf_freq - 2.5) * 10)
    return max(5, min(50, chips))


def re_split_parts(text):
    parts = []
    for chunk in text.replace("-", " ").replace("_", " ").split():
        chunk = strip_accents(chunk)
        if chunk:
            parts.append(chunk)
    return parts


def get_vector_for_text(nlp, text):
    candidates = []
    lowered = text.lower()
    ascii_text = strip_accents(lowered)
    candidates.extend([text, lowered, ascii_text])

    for candidate in candidates:
        lex = nlp.vocab[candidate]
        if lex.has_vector:
            return lex.vector.tolist()

    split_parts = re_split_parts(lowered)
    part_vectors = []
    for part in split_parts:
        lex = nlp.vocab[part]
        if lex.has_vector:
            part_vectors.append(lex.vector)
    if part_vectors:
        avg = part_vectors[0].copy()
        for vec in part_vectors[1:]:
            avg += vec
        avg = avg / len(part_vectors)
        return avg.tolist()

    return None


def parse_words_picked(path):
    current_category = None
    entries = {}

    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line:
            continue

        if ":" not in line:
            current_category = normalize_category_name(line)
            continue

        if current_category is None:
            continue

        suit_match = re.match(r"^(Nouns|Verbs|Adjectives|Adverbs)\s*\(\d+\):\s*(.+)$", line, flags=re.IGNORECASE)
        if not suit_match:
            continue

        suit = SUIT_MAP[suit_match.group(1).lower()]
        words = [word.strip().lower() for word in suit_match.group(2).split(",") if word.strip()]
        for word in words:
            key = f"{word}::{suit}"
            if key not in entries:
                entries[key] = {
                    "id": word,
                    "suit": suit,
                    "categories": [current_category],
                }
            elif current_category not in entries[key]["categories"]:
                entries[key]["categories"].append(current_category)

    return list(entries.values())


def normalize_existing_deck():
    if not DECK_PATH.exists():
        return

    with DECK_PATH.open(encoding="utf-8") as f:
        deck = json.load(f)

    changed = False
    for card in deck:
        categories = card.get("categories")
        if not categories:
            card["categories"] = ["none"]
            changed = True
        elif isinstance(categories, str):
            card["categories"] = [categories]
            changed = True

    if changed:
        with DECK_PATH.open("w", encoding="utf-8") as f:
            json.dump(deck, f, indent=2, ensure_ascii=False)
        print(f"Updated {DECK_PATH} with categories.")


def main():
    if not WORDS_PICKED_PATH.exists():
        raise FileNotFoundError(f"Missing {WORDS_PICKED_PATH}")

    normalize_existing_deck()

    print("Loading spaCy model (en_core_web_lg)...")
    nlp = spacy.load("en_core_web_lg")

    picked_entries = parse_words_picked(WORDS_PICKED_PATH)
    pool = []
    missing = []

    for entry in picked_entries:
        vector = get_vector_for_text(nlp, entry["id"])
        if vector is None:
            missing.append(entry["id"])
            continue

        freq = round(zipf_frequency(entry["id"], "en"), 2)
        pool.append({
            "id": entry["id"],
            "suit": entry["suit"],
            "chips": rarity_to_chips(freq),
            "categories": entry["categories"],
            "vector": vector,
        })

    pool.sort(key=lambda card: (card["categories"][0], card["suit"], card["id"]))

    with POOL_PATH.open("w", encoding="utf-8") as f:
        json.dump(pool, f, indent=2, ensure_ascii=False)

    print(f"Wrote {len(pool)} cards to {POOL_PATH}.")
    if missing:
        print(f"Skipped {len(missing)} words with no vector: {missing[:10]}{'...' if len(missing) > 10 else ''}")


if __name__ == "__main__":
    main()
