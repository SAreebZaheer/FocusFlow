import http.server
import socketserver
import os
from os import path
import cgi
import traceback  # For detailed error information

# Server configuration
my_host_name = 'localhost'
my_port = 8000
my_html_folder_path = './UI/'  # Folder containing your HTML, CSS, and JS files
my_home_page_file_path = 'index.html'  # Default home page

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def _set_headers(self, content_type='text/html'):
        """
        Set common headers for responses, including CORS headers.
        """
        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')  # Allow all origins (for development)
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def getPath(self):
        """
        Determine the file path based on the request path.
        """
        if self.path == '/':
            # Serve the home page
            content_path = path.join(my_html_folder_path, my_home_page_file_path)
        else:
            # Serve other files (CSS, JS, images, etc.)
            requested_path = str(self.path).split('?')[0][1:]  # Remove leading '/' and query string
            safe_path = os.path.normpath(requested_path)  # Normalize the path
            if safe_path.startswith(".."):  # Prevent directory traversal
                return None
            content_path = path.join(my_html_folder_path, safe_path)
        return content_path

    def getContent(self, content_path):
        """
        Read the content of a file.
        """
        try:
            with open(content_path, 'rb') as f:
                content = f.read()
            return content
        except FileNotFoundError:
            return None

    def do_GET(self):
        """
        Handle GET requests (serve static files).
        """
        print(f"Received GET request for: {self.path}")
        content_path = self.getPath()
        if content_path is None:
            self.send_error(404, "File Not Found")
            return

        if not os.path.exists(content_path):
            self.send_error(404, "File Not Found")
            return

        # Determine content type based on file extension
        file_extension = os.path.splitext(content_path)[1].lower()
        content_type = 'text/html'  # Default content type
        if file_extension == '.css':
            content_type = 'text/css'
        elif file_extension == '.js':
            content_type = 'application/javascript'
        elif file_extension in ['.png', '.jpg', '.jpeg', '.gif', '.bmp']:
            content_type = f'image/{file_extension[1:]}'
        elif file_extension == '.json':
            content_type = 'application/json'

        # Read and serve the file
        content = self.getContent(content_path)
        if content is None:
            self.send_error(404, "File Not Found")
            return

        self._set_headers(content_type)
        print(f"Serving file: {content_path}")
        self.wfile.write(content)

    def do_POST(self):
        """
        Handle POST requests (file uploads).
        """
        print(f"Received POST request for: {self.path}")
        if self.path == '/upload':
            try:
                # Parse the multipart form data
                form = cgi.FieldStorage(
                    fp=self.rfile,
                    headers=self.headers,
                    environ={
                        'REQUEST_METHOD': 'POST',
                        'CONTENT_TYPE': self.headers['Content-Type'],
                    }
                )
                print("Form data parsed successfully")

                # Process each field in the form
                for field in form.list:
                    if field.filename:
                        print(f"Received file: {field.filename}")
                        print(f"Content-Type: {field.content_type}")

                        filename = os.path.basename(field.filename)

                        # Determine subdirectory based on file type
                        if field.content_type.startswith('image/'):
                            subdirectory = 'notes_images'
                        elif field.content_type.startswith('audio/'):
                            subdirectory = 'recordings'
                        else:
                            subdirectory = 'uploads'

                        # Create the subdirectory if it doesn't exist
                        os.makedirs(os.path.join(my_html_folder_path, subdirectory), exist_ok=True)

                        # Save the file
                        filepath = os.path.join(my_html_folder_path, subdirectory, filename)
                        with open(filepath, 'wb') as f:
                            f.write(field.file.read())

                        # Send success response
                        self._set_headers('application/json')
                        response = f'{{"message": "File uploaded successfully", "filename": "{filename}", "subdirectory": "{subdirectory}"}}'
                        self.wfile.write(response.encode('utf-8'))
                        print(f"File '{filename}' uploaded successfully to '{filepath}'")
                        return

                # If no file was uploaded
                self._set_headers('application/json')
                self.wfile.write(b'{"message": "No file uploaded"}')
                self.send_response(400)
                return

            except Exception as e:
                print(f"Error during file upload: {e}")
                traceback.print_exc()  # Print detailed traceback
                self._set_headers('application/json')
                self.wfile.write(f'{{"message": "File upload failed: {str(e)}"}}'.encode('utf-8'))
                self.send_error(500, "Internal Server Error")
                return
        else:
            self.send_error(404, "Not Found")

    def do_OPTIONS(self):
        """
        Handle OPTIONS requests (CORS preflight).
        """
        self._set_headers('application/json')
        self.send_response(200)
        return


# Start the server
with socketserver.TCPServer(("192.168.0.108", my_port), MyHttpRequestHandler) as httpd:
    print(f"Server running at http://192.168.0.108:{my_port}")
    httpd.serve_forever()