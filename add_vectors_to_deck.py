"""
After you curate deck_candidates.json (set suits, trim to ~500), run this to
add vectors and produce deck.json for the game.
Usage: python add_vectors_to_deck.py [deck_curated.json]
Default input: deck_curated.json  (or edit CURATED_PATH below)
Output: deck.json
"""
import json
import sys
import unicodedata

try:
    import spacy
except ImportError:
    print("Need spaCy. Run: pip install spacy && python -m spacy download en_core_web_lg")
    sys.exit(1)

CURATED_PATH = "deck_curated.json"
OUTPUT_PATH = "deck.json"


def strip_accents(text):
    return "".join(
        char for char in unicodedata.normalize("NFKD", text)
        if not unicodedata.combining(char)
    )


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


def re_split_parts(text):
    parts = []
    for chunk in text.replace("-", " ").replace("_", " ").split():
        chunk = strip_accents(chunk)
        if chunk:
            parts.append(chunk)
    return parts


def main():
    input_path = sys.argv[1] if len(sys.argv) > 1 else CURATED_PATH
    print(f"Reading {input_path} ...")
    with open(input_path, encoding="utf-8") as f:
        curated = json.load(f)

    if not curated:
        print("No entries in file.")
        sys.exit(1)

    print("Loading spaCy model (en_core_web_lg)...")
    nlp = spacy.load("en_core_web_lg")

    deck = []
    missing = []
    for i, entry in enumerate(curated):
        text = entry.get("text") or entry.get("id")
        suit = entry.get("suit")
        chips = entry.get("chips")
        categories = entry.get("categories")
        if not text:
            continue
        if suit is None or suit == "":
            print(f"  Warning: '{text}' has no suit (row ~{i+1}). Using NOUN.")
            suit = "NOUN"
        if not categories:
            categories = ["none"]
        elif isinstance(categories, str):
            categories = [categories]
        vector = get_vector_for_text(nlp, text)
        if vector is None:
            missing.append(text)
            continue
        deck.append({
            "id": text,
            "suit": suit,
            "chips": chips if chips is not None else 25,
            "categories": categories,
            "vector": vector,
        })

    if missing:
        print(f"  Skipped {len(missing)} words with no vector: {missing[:10]}{'...' if len(missing) > 10 else ''}")

    print(f"Writing {len(deck)} cards to {OUTPUT_PATH} ...")
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(deck, f, indent=2, ensure_ascii=False)

    print("Done.")


if __name__ == "__main__":
    main()
