import contextlib
import mimetypes
import socket
import threading
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class MvpRequestHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".js": "application/javascript",
        ".mjs": "application/javascript",
        ".json": "application/json",
        ".wasm": "application/wasm",
        ".css": "text/css",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def find_open_port(start=8000, end=8100):
    for port in range(start, end + 1):
        with contextlib.closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
            if sock.connect_ex(("127.0.0.1", port)) != 0:
                return port
    raise RuntimeError("No open port found in 8000-8100")


def main():
    mimetypes.add_type("application/javascript", ".js")
    mimetypes.add_type("application/javascript", ".mjs")
    mimetypes.add_type("application/json", ".json")

    port = find_open_port()
    server = ThreadingHTTPServer(("127.0.0.1", port), MvpRequestHandler)
    url = f"http://127.0.0.1:{port}/index.html"

    print(f"Serving WORD BALATRO MVP at {url}")
    print("Press Ctrl+C to stop.")

    threading.Timer(0.5, lambda: webbrowser.open(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
