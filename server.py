from flask import Flask, request, jsonify, send_from_directory
import os
import ai

app = Flask(__name__)

# File to store courses
COURSES_FILE = "courses.txt"

# Ensure the files exist
if not os.path.exists(COURSES_FILE):
    with open(COURSES_FILE, "w") as f:
        f.write("")

# File to store profile information
PROFILE_FILE = "profile.txt"

# Define the directory where uploaded profile photos will be saved
PROFILE_PHOTO_FOLDER = './UI/profile_photos'
if not os.path.exists(PROFILE_PHOTO_FOLDER):
    os.makedirs(PROFILE_PHOTO_FOLDER)

# Define the directory where uploaded notes images will be saved
NOTES_IMAGE_FOLDER = './UI/notes_images'
if not os.path.exists(NOTES_IMAGE_FOLDER):
    os.makedirs(NOTES_IMAGE_FOLDER)

TEXT_FILES_FOLDER = './UI/notes'

# Define the directory where uploaded voice recordings will be saved
VOICE_RECORDINGS_FOLDER = './UI/voice_recordings'
if not os.path.exists(VOICE_RECORDINGS_FOLDER):
    os.makedirs(VOICE_RECORDINGS_FOLDER)

app.config['VOICE_RECORDINGS_FOLDER'] = VOICE_RECORDINGS_FOLDER
app.config['TEXT_FILES_FOLDER'] = TEXT_FILES_FOLDER
app.config['PROFILE_PHOTO_FOLDER'] = PROFILE_PHOTO_FOLDER
app.config['NOTES_IMAGE_FOLDER'] = NOTES_IMAGE_FOLDER

# Serve static files from the ./UI directory
@app.route('/')
def serve_index():
    return send_from_directory('./UI', 'dash.html')

# Serve other HTML files from the ./UI directory
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('./UI', filename)

# Upload notes image
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
        file_path = os.path.join(app.config['NOTES_IMAGE_FOLDER'], file.filename)
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
    course = data.get("course")  # This should be a string in the format "name,totalClasses,minAttendance,absents"

    if not course:
        return jsonify({"error": "Course data is required"}), 400

    with open(COURSES_FILE, "a") as f:
        f.write(f"{course}\n")  # Append the course string to the file

    return jsonify({"message": "Course added successfully"}), 200

# Get all courses
@app.route('/get-courses', methods=['GET'])
def get_courses():
    courses = []
    with open(COURSES_FILE, "r") as f:
        for line in f.readlines():
            if line.strip():  # Ensure the line is not empty
                name, totalClasses, minAttendance, absents = line.strip().split(',')
                courses.append({
                    "name": name,
                    "totalClasses": int(totalClasses),
                    "minAttendance": int(minAttendance),
                    "absents": int(absents)
                })
    return jsonify(courses), 200

# Update absents
@app.route('/update-absents', methods=['POST'])
def update_absents():
    data = request.get_json()
    course_name = data.get("name")
    absents = data.get("absents")

    if not course_name or absents is None:
        return jsonify({"error": "Course name and absents are required"}), 400

    # Read all courses
    with open(COURSES_FILE, "r") as f:
        lines = f.readlines()

    # Update the specific course
    updated = False
    with open(COURSES_FILE, "w") as f:
        for line in lines:
            if line.strip():  # Ensure the line is not empty
                name, totalClasses, minAttendance, _ = line.strip().split(',')
                if name == course_name:
                    f.write(f"{name},{totalClasses},{minAttendance},{absents}\n")
                    updated = True
                else:
                    f.write(line)

    if not updated:
        return jsonify({"error": "Course not found"}), 404

    return jsonify({"message": "Absents updated successfully"}), 200

# Save profile information
@app.route('/save-profile', methods=['POST'])
def save_profile():
    name = request.form.get("name")
    level = request.form.get("level")
    semester = request.form.get("semester")
    photo = request.files.get("photo")

    # Save photo if provided
    photo_path = None
    if photo:
        # Save the photo in the ./UI/profile_photos directory
        photo_filename = photo.filename
        photo_path = os.path.join(app.config['PROFILE_PHOTO_FOLDER'], photo_filename)
        photo.save(photo_path)

        # Save the relative path to the photo for easier access
        relative_photo_path = os.path.join('profile_photos', photo_filename)

    # Save profile information to file
    with open(PROFILE_FILE, "w") as f:
        f.write(f"Name: {name}\n")
        f.write(f"Level: {level}\n")
        f.write(f"Semester: {semester}\n")
        if photo_path:
            f.write(f"Photo: {relative_photo_path}\n")

    return jsonify({"message": "Profile saved successfully"}), 200

# Get profile information
@app.route('/get-profile', methods=['GET'])
def get_profile():
    profile = {}
    if os.path.exists(PROFILE_FILE):
        with open(PROFILE_FILE, "r") as f:
            for line in f.readlines():
                key, value = line.strip().split(": ", 1)
                profile[key.lower()] = value

    return jsonify(profile), 200

@app.route('/get-text-files', methods=['GET'])
def get_text_files():
    text_files = []
    text_files_folder = app.config['TEXT_FILES_FOLDER']
    
    for filename in os.listdir(text_files_folder):
        if filename.endswith('.txt'):
            text_files.append(filename)  # Only return the filename
    
    return jsonify(text_files), 200


@app.route('/get-text-file/<filename>', methods=['GET'])
def get_text_file(filename):
    text_files_folder = app.config['TEXT_FILES_FOLDER']
    file_path = os.path.join(text_files_folder, filename)

    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    with open(file_path, 'r') as f:
        content = f.read()

    return jsonify({
        "filename": filename,
        "content": content
    }), 200
    
@app.route('/notes/<path:filename>')
def serve_text_file(filename):
    return send_from_directory(app.config['TEXT_FILES_FOLDER'], filename)

# Upload document
@app.route('/upload-document', methods=['POST'])
def upload_document():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.lower().endswith(('.pdf', '.doc', '.docx', '.txt')):  # Add more extensions if needed
        file_path = os.path.join(app.config['TEXT_FILES_FOLDER'], file.filename)
        file.save(file_path)

        return jsonify({
            "message": "Document uploaded successfully",
            "file_path": file_path
        }), 200
    else:
        return jsonify({"error": "Invalid file type. Only documents are allowed."}), 400

# Upload voice recording
@app.route('/upload-voice-recording', methods=['POST'])
def upload_voice_recording():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and file.filename.lower().endswith(('.mp3', '.wav', '.ogg')):  # Add more extensions if needed
        file_path = os.path.join(app.config['VOICE_RECORDINGS_FOLDER'], file.filename)
        file.save(file_path)
        
    # Call transcribe() function to extract text from the voice recording
        try:
           text_file_path =  ai.transcribe(file.filename)
           
           return jsonify({
                "message": "Voice Recording uploaded and processed successfully",
                "file_path": file_path,
                "text_file_path": text_file_path,
            }), 200
        except Exception as e:
            return jsonify({"error": f"Error processing file: {str(e)}"}), 500

        return jsonify({
            "message": "Voice recording uploaded successfully",
            "file_path": file_path
        }), 200
    else:
        return jsonify({"error": "Invalid file type. Only audio files are allowed."}), 400

if __name__ == '__main__':
    app.run(host='192.168.0.106', port=8000, debug=True)