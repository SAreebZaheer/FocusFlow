document.addEventListener('DOMContentLoaded', function () {
    // Load user profile
    loadProfile();

    // Fetch and display course attendance
    fetchCourses();

    // Fetch and display recent notes
    fetchRecentNotes();

    // Update timer status
    updateTimerStatus();

    // Initialize the calendar
    init(); // Call the init function from timetable.js
});

// Function to load and display user profile
async function loadProfile() {
    try {
        const response = await fetch('/get-profile');
        const profile = await response.json();

        if (profile.name) {
            document.getElementById('user-name').textContent = profile.name;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Function to fetch and display course attendance
async function fetchCourses() {
    try {
        const response = await fetch('/get-courses');
        const courses = await response.json();

        const attendanceSection = document.getElementById('course-attendance');
        attendanceSection.innerHTML = courses.map(course => {
            // Calculate allowed absents using the formula
            const allowedAbsents = Math.floor(course.totalClasses * ((100 - course.minAttendance) / 100));

            // Calculate the percentage of absents relative to allowed absents
            const absentsPercentage = (course.absents / allowedAbsents) * 100;

            return `
                <div class="course-progress">
                    <h3>${course.name}</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${absentsPercentage}%"></div>
                    </div>
                    <p>Absents: ${course.absents} / ${allowedAbsents}</p>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

// Function to fetch and display recent notes
async function fetchRecentNotes() {
    try {
        const response = await fetch('/get-text-files');
        const textFiles = await response.json();

        const notesSection = document.getElementById('recent-notes');
        notesSection.innerHTML = textFiles.map(file => `
            <div class="note">
                <h3>${file}</h3>
                <p>Content will be displayed here...</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error fetching recent notes:', error);
    }
}

// Function to update timer status
function updateTimerStatus() {
    const countdownElement = document.getElementById('countdown');
    const pomodorosCountElement = document.getElementById('pomodorosCount');

    // Update the timer display every second
    setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        pomodorosCountElement.textContent = pomodorosCount;
    }, 1000);
}