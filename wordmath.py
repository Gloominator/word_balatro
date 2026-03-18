import argparse
import contextlib
import mimetypes
import os
import re
import socket
import sys
import threading
import webbrowser
from functools import lru_cache
from pathlib import Path

import numpy as np
import spacy
from flask import Flask, jsonify, request, send_from_directory


def get_app_root() -> Path:
    if getattr(sys, "frozen", False):
        bundle_root = getattr(sys, "_MEIPASS", None)
        if bundle_root:
            return Path(bundle_root)
        return Path(sys.executable).resolve().parent
    return Path(__file__).resolve().parent


APP_ROOT = get_app_root()
DEFAULT_SPACY_MODELS = ("en_core_web_lg", "en_core_web_md")

mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("application/javascript", ".mjs")
mimetypes.add_type("application/json", ".json")
mimetypes.add_type("text/css", ".css")


@lru_cache(maxsize=1)
def get_language_resources():
    configured_model = os.environ.get("WORDMATH_SPACY_MODEL", "").strip()
    candidate_models = (configured_model,) if configured_model else DEFAULT_SPACY_MODELS
    last_error = None

    for model_name in candidate_models:
        try:
            print(f"Loading spaCy model '{model_name}' (this may take a moment)...")
            nlp = spacy.load(model_name)
            break
        except OSError as error:
            last_error = error
    else:
        model_list = ", ".join(candidate_models)
        raise RuntimeError(
            f"Could not load a spaCy model. Tried: {model_list}. "
            "Install 'en_core_web_md' or 'en_core_web_lg', or set WORDMATH_SPACY_MODEL."
        ) from last_error

    all_vectors = nlp.vocab.vectors.data
    if all_vectors.size == 0:
        raise RuntimeError(
            "The loaded spaCy model has no word vectors. "
            "Use 'en_core_web_md' or 'en_core_web_lg'."
        )

    row_to_key = [None] * all_vectors.shape[0]
    for key, row in nlp.vocab.vectors.key2row.items():
        if 0 <= row < len(row_to_key):
            row_to_key[row] = key

    norms = np.linalg.norm(all_vectors, axis=1, keepdims=True)
    norms = np.where(norms == 0, 1, norms)
    normalized_vectors = all_vectors / norms

    return nlp, all_vectors, row_to_key, normalized_vectors

PROFANITY_BASE_FORMS = {
    "anal",
    "ass",
    "arse",
    "asshole",
    "bastard",
    "bitch",
    "boob",
    "blowjob",
    "booty",
    "butt",
    "cock",
    "crap",
    "cumshot",
    "damn",
    "dick",
    "dildo",
    "dumbass",
    "fuck",
    "fuckin",
    "fucking",
    "fucker",
    "lick",
    "motherfucker",
    "porn",
    "porno",
    "piss",
    "pussy",
    "sex",
    "shit",
    "slut",
    "suck",
    "tit",
    "cunt",
    "vibrator",
    "whore",
    "handjob",
    "wank",
    "wanker",
    "wanking",
   
}


@lru_cache(maxsize=4096)
def normalize_word(word: str) -> str:
    nlp, _, _, _ = get_language_resources()
    token = nlp(word.strip().lower())[0]
    lemma = token.lemma_.strip().lower()
    return lemma if lemma else token.text.lower()


@lru_cache(maxsize=4096)
def get_word_family_forms(word: str) -> frozenset[str]:
    lowered = word.strip().lower()
    forms = {lowered}

    lemma = normalize_word(lowered)
    if lemma:
        forms.add(lemma)

    if lowered.endswith("ies") and len(lowered) > 3:
        forms.add(lowered[:-3] + "y")
    if lowered.endswith("ing") and len(lowered) > 4:
        stem = lowered[:-3]
        forms.add(stem)
        forms.add(stem + "e")
        if len(stem) >= 2 and stem[-1] == stem[-2]:
            forms.add(stem[:-1])
    if lowered.endswith("es") and len(lowered) > 3:
        forms.add(lowered[:-2])
        forms.add(lowered[:-1])
    if lowered.endswith("s") and len(lowered) > 2 and not lowered.endswith("ss"):
        forms.add(lowered[:-1])

    cleaned = {
        form for form in forms
        if form and form.isalpha() and len(form) >= 2
    }
    return frozenset(cleaned)


def get_preferred_root(word: str) -> str:
    nlp, _, _, _ = get_language_resources()
    forms = get_word_family_forms(word)
    candidates = []
    for form in forms:
        lexeme = nlp.vocab[form]
        has_vector = 1 if lexeme.has_vector else 0
        suffix_penalty = 0
        if form.endswith("ing"):
            suffix_penalty += 2
        if form.endswith("s"):
            suffix_penalty += 1
        candidates.append((
            has_vector,
            -suffix_penalty,
            lexeme.prob,
            -len(form),
            form,
        ))

    candidates.sort(reverse=True)
    return candidates[0][-1] if candidates else word.strip().lower()


def is_same_word_family(candidate: str, input_forms: set[str]) -> bool:
    return bool(get_word_family_forms(candidate) & input_forms)


def is_profanity_like(word: str) -> bool:
    base = normalize_word(word)
    lowered = word.strip().lower()
    if base in PROFANITY_BASE_FORMS or lowered in PROFANITY_BASE_FORMS:
        return True

    candidate_forms = {
        lowered,
        lowered.rstrip("s"),
        lowered.rstrip("es"),
        lowered.rstrip("ed"),
        lowered.rstrip("ing"),
    }
    return any(form in PROFANITY_BASE_FORMS for form in candidate_forms if form)


def get_top_association(word_a: str, word_b: str, top_n: int = 20, operation: str = "add"):
    nlp, all_vectors, row_to_key, normalized_vectors = get_language_resources()
    words = [word_a.strip().lower(), word_b.strip().lower()]
    if not all(words):
        raise ValueError("Both words are required.")
    if operation not in {"add", "subtract"}:
        raise ValueError("Operation must be 'add' or 'subtract'.")

    input_words = set()
    input_word_forms = set()
    result_vector = np.zeros(all_vectors.shape[1], dtype=np.float32)

    for index, word in enumerate(words):
        lexeme = nlp.vocab[word]
        if not lexeme.has_vector:
            raise ValueError(f"'{word}' has no vector in this model.")
        sign = -1 if operation == "subtract" and index == 1 else 1
        result_vector += sign * lexeme.vector
        input_words.add(word)
        input_word_forms.update(get_word_family_forms(word))

    result_norm = np.linalg.norm(result_vector)
    if result_norm == 0:
        raise ValueError("Result vector is zero.")

    result_normalized = result_vector / result_norm
    similarities = normalized_vectors @ result_normalized
    best_indices = np.argsort(similarities)[::-1]

    filter_profanity_results = any(is_profanity_like(word) for word in words)
    candidates = []
    seen_candidate_forms = set()

    for idx in best_indices:
        word_key = row_to_key[idx]
        if word_key is None:
            continue

        lexeme = nlp.vocab[word_key]
        candidate = lexeme.text.lower()
        candidate_form = get_preferred_root(candidate)
        if candidate in input_words:
            continue
        if is_same_word_family(candidate, input_word_forms):
            continue
        if not candidate.isalpha():
            continue
        if filter_profanity_results and is_profanity_like(candidate):
            continue
        if candidate_form in seen_candidate_forms:
            continue

        candidates.append({
            "word": candidate,
            "normalized": candidate_form,
            "similarity": float(similarities[idx]),
        })
        seen_candidate_forms.add(candidate_form)
        if len(candidates) >= top_n:
            break

    if not candidates:
        raise ValueError("No suitable association found.")

    return candidates[0], candidates


def get_random_word_candidate() -> dict[str, str]:
    """Pick a random point in embedding space, return the closest vocabulary word."""
    nlp, _, row_to_key, normalized_vectors = get_language_resources()
    dim = normalized_vectors.shape[1]

    for _ in range(50):  # Retry if we hit invalid words
        random_vector = np.random.randn(dim).astype(np.float32)
        norm = np.linalg.norm(random_vector)
        if norm < 1e-8:
            continue
        random_vector /= norm
        similarities = normalized_vectors @ random_vector
        best_indices = np.argsort(similarities)[::-1]

        for idx in best_indices[:500]:
            word_key = row_to_key[idx]
            if word_key is None:
                continue
            lexeme = nlp.vocab[word_key]
            candidate = lexeme.text.lower()
            if not candidate.isalpha() or len(candidate) < 2:
                continue
            if is_profanity_like(candidate):
                continue
            candidate_form = get_preferred_root(candidate)
            return {"word": candidate, "normalized": candidate_form}

    raise ValueError("No suitable random words found.")


NO_VECTOR_ERROR_PATTERN = re.compile(r"^'(?P<word>.+)' has no vector in this model\.$")


def extract_dead_end_word(error_message: str) -> str | None:
    match = NO_VECTOR_ERROR_PATTERN.match(error_message.strip())
    if not match:
        return None
    return match.group("word").strip().lower() or None


app = Flask(__name__, static_folder=None)


@app.after_request
def add_cache_headers(response):
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


@app.route("/")
def serve_index():
    return send_from_directory(APP_ROOT, "wordmath.html")


@app.route("/api/mix")
def mix_words():
    word_a = request.args.get("wordA", "")
    word_b = request.args.get("wordB", "")
    operation = request.args.get("operation", "add")

    try:
        top_result, candidates = get_top_association(word_a, word_b, operation=operation)
    except ValueError as error:
        dead_end_word = extract_dead_end_word(str(error))
        return jsonify({
            "ok": False,
            "error": str(error),
            "deadEndWord": dead_end_word,
        }), 400
    except Exception as error:
        return jsonify({
            "ok": False,
            "error": f"Unexpected mix error: {error}",
        }), 500

    return jsonify({
        "ok": True,
        "result": top_result["word"],
        "normalized": top_result["normalized"],
        "similarity": top_result["similarity"],
        "operation": operation,
        "candidates": candidates,
    })


@app.route("/api/random-word")
def random_word():
    try:
        candidate = get_random_word_candidate()
    except ValueError as error:
        return jsonify({
            "ok": False,
            "error": str(error),
        }), 400
    except Exception as error:
        return jsonify({
            "ok": False,
            "error": f"Unexpected random word error: {error}",
        }), 500

    return jsonify({
        "ok": True,
        "word": candidate["word"],
        "normalized": candidate["normalized"],
    })


@app.route("/<path:filename>")
def serve_static_asset(filename):
    if filename == "api/random-word":
        return random_word()
    if filename.startswith("api/"):
        return jsonify({
            "ok": False,
            "error": "Not found.",
        }), 404

    return send_from_directory(APP_ROOT, filename)


def find_open_port(start=8100, end=8199):
    for port in range(start, end + 1):
        with contextlib.closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
            if sock.connect_ex(("127.0.0.1", port)) != 0:
                return port
    raise RuntimeError(f"No open port found in {start}-{end}")


def parse_args():
    parser = argparse.ArgumentParser(
        description="Launch the browser-based WordMath mixing game.",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=None,
        help="Optional port to use. If omitted, the script picks an open port automatically.",
    )
    parser.add_argument(
        "--no-browser",
        action="store_true",
        help="Serve the game without opening a browser tab automatically.",
    )
    parser.add_argument(
        "--export-random-words",
        action="store_true",
        help="Export random word pool to random_words.json and exit.",
    )
    return parser.parse_args()


def export_random_words():
    """Write random_words.json for client-side wildcard (no API needed)."""
    import json
    os.chdir(APP_ROOT)
    candidates = get_random_word_candidates()
    out = [{"word": c["word"], "normalized": c["normalized"]} for c in candidates]
    path = APP_ROOT / "random_words.json"
    with open(path, "w", encoding="utf-8") as f:
        json.dump(out, f, separators=(",", ":"))
    print(f"Exported {len(out)} words to {path}")


def main():
    args = parse_args()
    os.chdir(APP_ROOT)

    if args.export_random_words:
        export_random_words()
        return

    port = args.port if args.port is not None else find_open_port()
    url = f"http://127.0.0.1:{port}/"

    print(f"Serving WordMath at {url}")
    print("Press Ctrl+C to stop.")

    if not args.no_browser:
        threading.Timer(0.5, lambda: webbrowser.open(url)).start()

    try:
        app.run(host="127.0.0.1", port=port, debug=False, use_reloader=False)
    except KeyboardInterrupt:
        print("\nStopping server...")


if __name__ == "__main__":
    main()