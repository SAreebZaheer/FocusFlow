import http.server
import socketserver
import os
from os import path

my_host_name = 'localhost'
my_port = 8000
my_html_folder_path = './UI/'

my_home_page_file_path = 'index.html'


class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):

    def _set_headers(self, content_type):
        self.send_response(200)
        self.send_header('Content-Type', content_type)
        # No need to send Content-Length for all file types.  Let the browser handle it.
        self.end_headers()

    def getPath(self):
        if self.path == '/':
            content_path = path.join(
                my_html_folder_path, my_home_page_file_path)
        else:
            # Handle URL parameters, but ensure we don't allow path traversal
            requested_path = str(self.path).split('?')[0][1:]
            safe_path = os.path.normpath(requested_path)  # Normalize path
            if safe_path.startswith(".."): # Check if path traversal is attempted
                return None # Return None to indicate invalid path
            content_path = path.join(my_html_folder_path, safe_path)
        return content_path

    def getContent(self, content_path):
        try:
            with open(content_path, 'rb') as f: # Open in binary mode for all files
                content = f.read()
            return content
        except FileNotFoundError:
            return None

    def do_GET(self):
        print(f"Received request for: {self.path}")  # Log the requested path
        content_path = self.getPath()
        if content_path is None:
            self.send_error(404, "File Not Found")
            return
        
        if not os.path.exists(content_path):
            self.send_error(404, "File Not Found")
            return

        file_extension = os.path.splitext(content_path)[1]

        content_type = 'text/html'  # Default
        if file_extension == '.css':
            content_type = 'text/css'
        elif file_extension == '.js':
            content_type = 'application/javascript'
        elif file_extension in ['.png', '.jpg', '.jpeg', '.gif', '.bmp']:  # Add image types
            content_type = f'image/{file_extension[1:]}' # e.g. image/png
        # Add more content types as needed (e.g., for JSON, fonts, etc.)

        content = self.getContent(content_path)

        if content is None:  # Handle cases where the file isn't found
           self.send_error(404, "File Not Found")
           return

        self._set_headers(content_type)
        print(f"Sending response for: {content_path}")  # Log before sending the response
        self.wfile.write(content)
        print(f"Response sent for: {content_path}") # Log after sending the response

my_handler = MyHttpRequestHandler

with socketserver.TCPServer(("172.21.21.189", my_port), my_handler) as httpd:
    print(f"Http Server Serving at http://172.21.21.189:{my_port}")
    httpd.serve_forever()