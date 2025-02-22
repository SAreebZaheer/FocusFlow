from flask import Flask, request, jsonify, send_from_directory
import os
import ai
app = Flask(__name__)

# File to store courses
COURSES_FILE = "courses.txt"

# Ensure the courses file exists
if not os.path.exists(COURSES_FILE):
    with open(COURSES_FILE, "w") as f:
        f.write("")
        
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
            text_file_path = ai.getText(file.filename)
            print(f"Text extracted and saved to: {text_file_path}")

            # Call summarise() function to generate a summary
            summary_file_path = ai.summarise(text_file_path)
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

# Add a course
@app.route('/add-course', methods=['POST'])
def add_course():
    data = request.get_json()
    course = data.get("course")

    if not course:
        return jsonify({"error": "Course name is required"}), 400

    with open(COURSES_FILE, "a") as f:
        f.write(f"{course}\n")

    return jsonify({"message": "Course added successfully"}), 200

# Remove a course
@app.route('/remove-course', methods=['POST'])
def remove_course():
    data = request.get_json()
    course_to_remove = data.get("course")

    if not course_to_remove:
        return jsonify({"error": "Course name is required"}), 400

    with open(COURSES_FILE, "r") as f:
        courses = f.readlines()

    with open(COURSES_FILE, "w") as f:
        for course in courses:
            if course.strip() != course_to_remove:
                f.write(course)

    return jsonify({"message": "Course removed successfully"}), 200

# Get all courses
@app.route('/get-courses', methods=['GET'])
def get_courses():
    with open(COURSES_FILE, "r") as f:
        courses = [line.strip() for line in f.readlines() if line.strip()]
    return jsonify(courses), 200

if __name__ == '__main__':
    app.run(host='192.168.0.108', port=8000, debug=True)