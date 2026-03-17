import argparse
import contextlib
import json
import mimetypes
import os
import socket
import threading
import urllib.parse
import webbrowser
from functools import lru_cache
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import numpy as np
import spacy


print("Loading spaCy model (this may take a moment)...")
NLP = spacy.load("en_core_web_lg")
ALL_VECTORS = NLP.vocab.vectors.data

ROW_TO_KEY = [None] * ALL_VECTORS.shape[0]
for key, row in NLP.vocab.vectors.key2row.items():
    if 0 <= row < len(ROW_TO_KEY):
        ROW_TO_KEY[row] = key

NORMS = np.linalg.norm(ALL_VECTORS, axis=1, keepdims=True)
NORMS = np.where(NORMS == 0, 1, NORMS)
NORMALIZED_VECTORS = ALL_VECTORS / NORMS

PROFANITY_BASE_FORMS = {
    "ass",
    "arse",
    "asshole",
    "bastard",
    "bitch",
    "boob",
    "booty",
    "butt",
    "cock",
    "crap",
    "damn",
    "dick",
    "dumbass",
    "fuck",
    "fuckin",
    "fucking",
    "fucker",
    "motherfucker",
    "piss",
    "pussy",
    "shit",
    "slut",
    "suck",
    "tit",
    "cunt",
    "whore",
}


@lru_cache(maxsize=4096)
def normalize_word(word: str) -> str:
    token = NLP(word.strip().lower())[0]
    lemma = token.lemma_.strip().lower()
    return lemma if lemma else token.text.lower()


def is_same_word_family(candidate: str, input_forms: set[str]) -> bool:
    return normalize_word(candidate) in input_forms


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
    words = [word_a.strip().lower(), word_b.strip().lower()]
    if not all(words):
        raise ValueError("Both words are required.")
    if operation not in {"add", "subtract"}:
        raise ValueError("Operation must be 'add' or 'subtract'.")

    input_words = set()
    input_word_forms = set()
    result_vector = np.zeros(NLP.vocab.vectors.shape[1], dtype=np.float32)

    for index, word in enumerate(words):
        lexeme = NLP.vocab[word]
        if not lexeme.has_vector:
            raise ValueError(f"'{word}' has no vector in this model.")
        sign = -1 if operation == "subtract" and index == 1 else 1
        result_vector += sign * lexeme.vector
        input_words.add(word)
        input_word_forms.add(normalize_word(word))

    result_norm = np.linalg.norm(result_vector)
    if result_norm == 0:
        raise ValueError("Result vector is zero.")

    result_normalized = result_vector / result_norm
    similarities = NORMALIZED_VECTORS @ result_normalized
    best_indices = np.argsort(similarities)[::-1]

    filter_profanity_results = any(is_profanity_like(word) for word in words)
    candidates = []
    seen_candidate_forms = set()

    for idx in best_indices:
        word_key = ROW_TO_KEY[idx]
        if word_key is None:
            continue

        lexeme = NLP.vocab[word_key]
        candidate = lexeme.text.lower()
        candidate_form = normalize_word(candidate)
        if candidate in input_words:
            continue
        if candidate_form in input_word_forms:
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


class WordMathRequestHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".js": "application/javascript",
        ".mjs": "application/javascript",
        ".json": "application/json",
        ".css": "text/css",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def send_json(self, payload, status=HTTPStatus.OK):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/mix":
            params = urllib.parse.parse_qs(parsed.query)
            word_a = params.get("wordA", [""])[0]
            word_b = params.get("wordB", [""])[0]
            operation = params.get("operation", ["add"])[0]

            try:
                top_result, candidates = get_top_association(word_a, word_b, operation=operation)
            except ValueError as error:
                self.send_json(
                    {
                        "ok": False,
                        "error": str(error),
                    },
                    status=HTTPStatus.BAD_REQUEST,
                )
                return
            except Exception as error:
                self.send_json(
                    {
                        "ok": False,
                        "error": f"Unexpected mix error: {error}",
                    },
                    status=HTTPStatus.INTERNAL_SERVER_ERROR,
                )
                return

            self.send_json(
                {
                    "ok": True,
                    "result": top_result["word"],
                    "normalized": top_result["normalized"],
                    "similarity": top_result["similarity"],
                    "operation": operation,
                    "candidates": candidates,
                },
            )
            return

        self.path = parsed.path
        super().do_GET()


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
    return parser.parse_args()


def main():
    args = parse_args()
    script_dir = Path(__file__).resolve().parent
    os.chdir(script_dir)

    mimetypes.add_type("application/javascript", ".js")
    mimetypes.add_type("application/javascript", ".mjs")
    mimetypes.add_type("application/json", ".json")

    port = args.port if args.port is not None else find_open_port()
    server = ThreadingHTTPServer(("127.0.0.1", port), WordMathRequestHandler)
    url = f"http://127.0.0.1:{port}/wordmath.html"

    print(f"Serving WordMath at {url}")
    print("Press Ctrl+C to stop.")

    if not args.no_browser:
        threading.Timer(0.5, lambda: webbrowser.open(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()