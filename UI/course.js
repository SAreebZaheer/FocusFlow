// Initialize variables
let courses = [];

// Fetch courses from the server
async function fetchCourses() {
    try {
        const response = await fetch('/get-courses');
        const data = await response.json();
        courses = data;
        renderCourses();
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

// Render courses
function renderCourses() {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = courses.map((course, index) => {
        // Calculate allowed absents
        const allowedAbsents = Math.floor(course.totalClasses * ((100 - course.minAttendance) / 100));

        return `
            <div class="course-card">
                <h3>${course.name}</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(course.absents / allowedAbsents) * 100}%"></div>
                    <div class="progress-threshold" style="width: 100%"></div>
                </div>
                <div class="attendance-controls">
                    <button onclick="updateAbsents(${index}, 1)">+</button>
                    <button onclick="updateAbsents(${index}, -1)">-</button>
                </div>
                <p>Absents: ${course.absents} / ${allowedAbsents}</p>
            </div>
        `;
    }).join('');
}

// Add course functionality
async function addCourse() {
    const courseName = document.getElementById('courseName').value;
    const totalClasses = parseInt(document.getElementById('totalClasses').value);
    const minAttendance = parseInt(document.getElementById('minAttendance').value);

    if (!courseName || !totalClasses || !minAttendance) {
        alert("Please fill in all fields.");
        return;
    }

    const course = {
        name: courseName,
        totalClasses: totalClasses,
        minAttendance: minAttendance,
        absents: 0
    };

    try {
        const response = await fetch('/add-course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ course: `${course.name},${course.totalClasses},${course.minAttendance},${course.absents}` }),
        });

        if (response.ok) {
            fetchCourses(); // Refresh the course list
            closeModal('addCourseModal');
        } else {
            alert('Failed to add course.');
        }
    } catch (error) {
        console.error('Error adding course:', error);
    }
}

// Update absents
async function updateAbsents(index, change) {
    const course = courses[index];
    course.absents += change;
    if (course.absents < 0) course.absents = 0;

    // Calculate allowed absents
    const allowedAbsents = Math.floor(course.totalClasses * ((100 - course.minAttendance) / 100));
    if (course.absents > allowedAbsents) course.absents = allowedAbsents;

    try {
        const response = await fetch('/update-absents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: course.name,
                absents: course.absents
            }),
        });

        if (response.ok) {
            fetchCourses(); // Refresh the course list
        } else {
            alert('Failed to update absents.');
        }
    } catch (error) {
        console.error('Error updating absents:', error);
    }
}

// Utility functions
function openAddCourseModal() {
    document.getElementById('addCourseModal').style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Initialize the app
fetchCourses();