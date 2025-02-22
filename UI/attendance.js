// Initialize variables
let registrationDate = localStorage.getItem('registrationDate');
let courses = JSON.parse(localStorage.getItem('courses')) || [];

// Initialize the app
function init() {
    if (registrationDate) {
        showMainInterface();
    }
    renderCourses();
}

// Registration system
function registerUser() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    registrationDate = today.getTime();
    localStorage.setItem('registrationDate', registrationDate);
    showMainInterface();
}

function showMainInterface() {
    document.getElementById('registration').style.display = 'none';
    document.getElementById('main-interface').style.display = 'block';
}

// Render courses
function renderCourses() {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = courses.map((course, index) => `
        <div class="course-card" data-attendance="Attended: ${course.attended} / ${course.totalClasses}">
            <h3>${course.name}</h3>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(course.attended / course.totalClasses) * 100}%"></div>
                <div class="progress-threshold"></div>
            </div>
            <div class="attendance-controls">
                <button onclick="updateAttendance(${index}, 1)">+</button>
                <button onclick="updateAttendance(${index}, -1)">-</button>
            </div>
        </div>
    `).join('');
}

// Add course functionality
function openAddCourseModal() {
    document.getElementById('addCourseModal').style.display = 'flex';
}

function addCourse() {
    const courseName = document.getElementById('courseName').value;
    const totalClasses = parseInt(document.getElementById('totalClasses').value);

    if (!courseName || !totalClasses) {
        alert("Please fill in all fields.");
        return;
    }

    courses.push({
        name: courseName,
        totalClasses: totalClasses,
        attended: 0
    });

    saveData();
    renderCourses();
    closeModal('addCourseModal');
}

// Update attendance
function updateAttendance(index, change) {
    const course = courses[index];
    course.attended += change;
    if (course.attended < 0) course.attended = 0;
    if (course.attended > course.totalClasses) course.attended = course.totalClasses;
    saveData();
    renderCourses();
}

// Utility functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function saveData() {
    localStorage.setItem('courses', JSON.stringify(courses));
}

// Initialize the app
init();