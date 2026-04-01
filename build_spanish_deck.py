"""Build deck.es.json from deck.json + deck_es_id_map.json using es_core_news_lg vectors."""
import json
import sys
import unicodedata
from pathlib import Path

import numpy as np

try:
    import spacy
except ImportError:
    print("Need spaCy. Run: pip install spacy && python -m spacy download es_core_news_lg")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent
DECK_EN = ROOT / "deck.json"
MAP_PATH = ROOT / "deck_es_id_map.json"
OUTPUT = ROOT / "deck.es.json"
MODEL = "es_core_news_lg"


def strip_accents(text: str) -> str:
    return "".join(
        ch for ch in unicodedata.normalize("NFKD", text) if not unicodedata.combining(ch)
    )


def vector_for_spanish(nlp, text: str):
    lowered = text.lower()
    nfc = unicodedata.normalize("NFC", lowered)
    ascii_s = strip_accents(lowered)
    for candidate in (text, lowered, nfc, ascii_s):
        lex = nlp.vocab[str(candidate)]
        if lex.has_vector:
            return lex.vector.tolist()
    parts = []
    for chunk in lowered.replace("-", " ").replace("_", " ").split():
        c = strip_accents(chunk)
        if c:
            parts.append(c)
    if parts:
        vecs = []
        for p in parts:
            lx = nlp.vocab[p]
            if lx.has_vector:
                vecs.append(lx.vector)
        if vecs:
            avg = vecs[0].copy()
            for v in vecs[1:]:
                avg += v
            avg /= len(vecs)
            return avg.tolist()
    doc = nlp(text)
    t_vecs = [t.vector for t in doc if np.linalg.norm(t.vector) > 0]
    if t_vecs:
        avg = t_vecs[0].copy().astype("float64")
        for tv in t_vecs[1:]:
            avg += tv
        avg /= len(t_vecs)
        return avg.astype("float32").tolist()
    return None


def main():
    deck = json.loads(DECK_EN.read_text(encoding="utf-8"))
    id_map = json.loads(MAP_PATH.read_text(encoding="utf-8"))
    print(f"Loading {MODEL}...")
    nlp = spacy.load(MODEL)
    out = []
    missing = []
    for entry in deck:
        en_id = entry["id"]
        es_id = id_map.get(en_id)
        if not es_id:
            missing.append(en_id)
            continue
        vec = vector_for_spanish(nlp, es_id)
        if vec is None:
            vec = entry.get("vector")
        if vec is None:
            missing.append(f"{en_id} -> {es_id}")
            continue
        new_e = {**entry, "id": es_id}
        new_e["vector"] = vec
        out.append(new_e)
    if missing:
        tail = " ..." if len(missing) > 12 else ""
        print(f"Missing vectors or map ({len(missing)}): see script output" + tail)
    print(f"Writing {len(out)} cards to {OUTPUT}")
    OUTPUT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
