import http.server
import socketserver
import os
from os import path
import cgi

my_host_name = 'localhost'
my_port = 8000
my_html_folder_path = './UI/'

my_home_page_file_path = 'index.html'


class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):

    def _set_headers(self, content_type):
        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.end_headers()

    def getPath(self):
        if self.path == '/':
            content_path = path.join(my_html_folder_path, my_home_page_file_path)
        else:
            requested_path = str(self.path).split('?')[0][1:]
            safe_path = os.path.normpath(requested_path)
            if safe_path.startswith(".."):
                return None
            content_path = path.join(my_html_folder_path, safe_path)
        return content_path

    def getContent(self, content_path):
        try:
            with open(content_path, 'rb') as f:
                content = f.read()
            return content
        except FileNotFoundError:
            return None

    def do_GET(self):
        print(f"Received request for: {self.path}")
        content_path = self.getPath()
        if content_path is None:
            self.send_error(404, "File Not Found")
            return

        if not os.path.exists(content_path):
            self.send_error(404, "File Not Found")
            return

        file_extension = os.path.splitext(content_path)[1]

        content_type = 'text/html'
        if file_extension == '.css':
            content_type = 'text/css'
        elif file_extension == '.js':
            content_type = 'application/javascript'
        elif file_extension in ['.png', '.jpg', '.jpeg', '.gif', '.bmp']:
            content_type = f'image/{file_extension[1:]}'

        content = self.getContent(content_path)

        if content is None:
            self.send_error(404, "File Not Found")
            return

        self._set_headers(content_type)
        print(f"Sending response for: {content_path}")
        self.wfile.write(content)
        print(f"Response sent for: {content_path}")

    def do_POST(self):
        if self.path == '/upload':
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={'REQUEST_METHOD': 'POST'}
            )

            try:
                for field in form.list:
                    if field.filename:
                        filename = field.filename
                        filename = os.path.basename(filename)
                        
                        # Determine the correct subdirectory based on file type
                        if field.content_type.startswith('image/'):
                            subdirectory = 'notes_images'
                        elif field.content_type.startswith('audio/'):
                            subdirectory = 'recordings' # or another appropriate name
                        else:  # Default to 'uploads' for other file types
                            subdirectory = 'uploads'

                        filepath = os.path.join(my_html_folder_path, subdirectory, filename)

                        os.makedirs(os.path.join(my_html_folder_path, subdirectory), exist_ok=True)  # Create subdir

                        with open(filepath, 'wb') as f:
                            f.write(field.file.read())

                        self._set_headers('application/json')
                        self.wfile.write(bytes(f'{{"message": "File uploaded successfully", "filename": "{filename}", "subdirectory": "{subdirectory}"}}', 'utf-8')) # include subdirectory in response

                        print(f"File '{filename}' uploaded successfully to '{filepath}'")
                        return

                self._set_headers('application/json')
                self.wfile.write(bytes('{"message": "No file uploaded"}', 'utf-8'))
                self.send_response(400)
                return

            except Exception as e:
                print(f"Error during file upload: {e}")
                self._set_headers('application/json')
                self.wfile.write(bytes(f'{{"message": "File upload failed: {e}"}}', 'utf-8'))
                self.send_error(500, "Internal Server Error")
                return

        else:
            self.send_error(404, "Not Found")


my_handler = MyHttpRequestHandler

with socketserver.TCPServer(("192.168.0.108", my_port), my_handler) as httpd:
    print(f"Http Server Serving at http://192.168.0.108:{my_port}")
    httpd.serve_forever()