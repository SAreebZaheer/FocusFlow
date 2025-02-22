// Initialize variables
let registrationDate = localStorage.getItem('registrationDate');
let courses = JSON.parse(localStorage.getItem('courses')) || [];
let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};

// Initialize the app
function init() {
    if (registrationDate) {
        showMainInterface();
    }
    populateDateSelectors();
    renderCourses();
    generateCalendar();
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

// Populate month/year dropdowns
function populateDateSelectors() {
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    
    const months = ['January','February','March','April','May','June',
                   'July','August','September','October','November','December'];
    const currentYear = new Date().getFullYear();

    // Populate months
    monthSelect.innerHTML = months.map((month, index) => `
        <option value="${index}" ${index === new Date().getMonth() ? 'selected' : ''}>${month}</option>
    `).join('');

    // Populate years
    yearSelect.innerHTML = Array.from({length: 3}, (_, i) => currentYear - 1 + i)
        .map(year => `
            <option value="${year}" ${year === currentYear ? 'selected' : ''}>${year}</option>
        `).join('');
}

// Render courses
function renderCourses() {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = courses.map((course, index) => `
        <div class="course-card">
            <h3>${course.name}</h3>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(course.attended / course.totalClasses) * 100}%"></div>
            </div>
            <div>Attended: ${course.attended} / ${course.totalClasses}</div>
            <button onclick="removeCourse(${index})">Remove Course</button>
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

function removeCourse(index) {
    courses.splice(index, 1);
    saveData();
    renderCourses();
}

// Calendar functionality
function generateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    const month = parseInt(document.getElementById('monthSelect').value);
    const year = parseInt(document.getElementById('yearSelect').value);
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add empty days
    for (let i = 0; i < firstDay; i++) {
        calendar.appendChild(createDayCell('', true));
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        calendar.appendChild(createDayCell(day, false, dateKey));
    }
}

// Create a day cell
function createDayCell(dayNumber, isEmpty, dateKey) {
    const dayCell = document.createElement('div');
    dayCell.className = `day-cell ${isEmpty ? 'empty-day' : ''}`;
    
    if (!isEmpty) {
        const dayName = getDayName(dateKey);
        dayCell.innerHTML = `
            <div class="day-number">${dayNumber}</div>
            <div class="day-name">${dayName}</div>
            ${getAttendanceButtons(dateKey)}
        `;
    }
    
    return dayCell;
}

// Get the day name
function getDayName(dateStr) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateStr);
    return days[date.getDay()];
}

// Get attendance buttons
function getAttendanceButtons(dateKey) {
    const attendance = attendanceData[dateKey] || {};
    return `
        <div class="attendance-buttons">
            <button onclick="markAttendance('${dateKey}', 'present')" ${attendance.status === 'present' ? 'disabled' : ''}>Present</button>
            <button onclick="markAttendance('${dateKey}', 'absent')" ${attendance.status === 'absent' ? 'disabled' : ''}>Absent</button>
        </div>
    `;
}

// Mark attendance
function markAttendance(dateKey, status) {
    attendanceData[dateKey] = { status };
    saveData();
    updateProgress();
    generateCalendar();
}

// Update progress
function updateProgress() {
    courses.forEach(course => {
        course.attended = Object.values(attendanceData).filter(a => a.status === 'present').length;
    });
    saveData();
    renderCourses();
}

// Utility functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function saveData() {
    localStorage.setItem('courses', JSON.stringify(courses));
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
}

// Initialize the app
init();