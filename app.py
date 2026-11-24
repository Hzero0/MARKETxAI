import http.server
import socketserver
import os

# Serve built static web application from dist directory
dist_dir = os.path.join(os.path.dirname(__file__), "dist")
if os.path.exists(dist_dir):
    os.chdir(dist_dir)

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Support single page application routing (fallback to index.html for client routes)
        req_path = self.translate_path(self.path)
        if not os.path.exists(req_path) and "." not in self.path.split("/")[-1]:
            self.path = "/index.html"
        return super().do_GET()

PORT = 7860
print(f"MARKETxAI server starting on port {PORT}...")

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("0.0.0.0", PORT), SPAHandler) as httpd:
    httpd.serve_forever()
