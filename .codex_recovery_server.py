from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from urllib.parse import parse_qs

ROOT = Path(__file__).resolve().parent / ".codex_recovered_prod"
ROOT.mkdir(exist_ok=True)

PAGE = b'''<!doctype html><html><meta charset="utf-8"><title>Local source recovery</title><form method="post"><label>Path <input name="path"></label><label>Content <textarea name="content"></textarea></label><button type="submit">Save</button></form></html>'''


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.end_headers()
        self.wfile.write(PAGE)

    def do_POST(self):
        size = int(self.headers.get("Content-Length", "0"))
        if size > 5_000_000:
            self.send_error(413)
            return
        values = parse_qs(self.rfile.read(size).decode("utf-8"), keep_blank_values=True)
        name = values.get("path", [""])[0].replace("\\", "/")
        if not name or name.startswith("/") or ".." in Path(name).parts:
            self.send_error(400)
            return
        dest = (ROOT / name).resolve()
        if not dest.is_relative_to(ROOT):
            self.send_error(400)
            return
        dest.parent.mkdir(parents=True, exist_ok=True)
        content = values.get("content", [""])[0]
        dest.write_text(content, encoding="utf-8")
        message = f"Saved {name}: {len(content)} characters".encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.end_headers()
        self.wfile.write(message)


HTTPServer(("127.0.0.1", 43821), Handler).serve_forever()
