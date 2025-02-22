// Fetch user data and courses from localStorage
const user = JSON.parse(localStorage.getItem('user')) || {
    name: "John Doe",
    email: "john.doe@example.com",
    profilePicture: "https://via.placeholder.com/150"
};

const courses = JSON.parse(localStorage.getItem('courses')) || [];

// Populate user info
document.querySelector('.user-details h2').textContent = user.name;
document.querySelector('.user-details p').textContent = `Email: ${user.email}`;
document.querySelector('.profile-picture img').src = user.profilePicture;

// Populate course info
function renderCourses() {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = courses.map((course, index) => `
        <div class="course-card">
            <h3>${course.name}</h3>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(course.attended / course.totalClasses) * 100}%"></div>
                <div class="progress-threshold"></div>
            </div>
            <div class="course-info">
                Attended: ${course.attended} / ${course.totalClasses}
            </div>
        </div>
    `).join('');
}

// Logout functionality
function logout() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('user');
        window.location.href = "login.html"; // Redirect to login page
    }
}

// Initialize the page
renderCourses();