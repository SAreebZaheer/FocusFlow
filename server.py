from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__)

# Define the directory where uploaded images will be saved
UPLOAD_FOLDER = './UI/notes_images'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Serve static files from the ./UI directory
@app.route('/')
def serve_index():
    return send_from_directory('./UI', 'index.html')

# Serve other HTML files from the ./UI directory
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('./UI', filename)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        return jsonify({"message": "File uploaded successfully", "file_path": file_path}), 200
    else:
        return jsonify({"error": "Invalid file type. Only images are allowed."}), 400

if __name__ == '__main__':
    app.run(host='192.168.0.108', port=8000, debug=True)