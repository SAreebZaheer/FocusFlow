from flask import Flask, request, jsonify, send_from_directory
import os
from ai import getText, summarise  # Import functions from ai.py

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

        # Call getText() function to extract text from the image
        try:
            text_file_path = getText(file.filename)
            print(f"Text extracted and saved to: {text_file_path}")

            # Call summarise() function to generate a summary
            summary_file_path = summarise(text_file_path)
            print(f"Summary generated and saved to: {summary_file_path}")

            return jsonify({
                "message": "File uploaded and processed successfully",
                "file_path": file_path,
                "text_file_path": text_file_path,
                "summary_file_path": summary_file_path
            }), 200
        except Exception as e:
            return jsonify({"error": f"Error processing file: {str(e)}"}), 500
    else:
        return jsonify({"error": "Invalid file type. Only images are allowed."}), 400

# New endpoint to save courses to a text file
@app.route('/saveCourses', methods=['POST'])
def save_courses():
    try:
        # Get the courses from the request
        courses = request.json.get('courses')
        if not courses:
            return jsonify({"error": "No courses provided"}), 400

        # Save courses to a text file
        with open('courses.txt', 'w') as file:
            for course in courses:
                file.write(f"{course}\n")

        return jsonify({"message": "Courses saved successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# New endpoint to fetch courses from the text file
@app.route('/getCourses', methods=['GET'])
def get_courses():
    try:
        # Read courses from the text file
        if not os.path.exists('courses.txt'):
            return jsonify({"error": "No courses found"}), 404

        with open('courses.txt', 'r') as file:
            courses = file.read().splitlines()

        return jsonify({"courses": courses}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='192.168.0.108', port=8000, debug=True)