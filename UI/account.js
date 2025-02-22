// Fetch user data from localStorage
const user = JSON.parse(localStorage.getItem('user')) || {
    name: "John Doe",
    email: "john.doe@example.com",
    profilePicture: "https://via.placeholder.com/150"
};

// Populate user info
document.getElementById('userName').textContent = user.name;
document.getElementById('userEmail').textContent = `Email: ${user.email}`;
document.getElementById('profilePicture').src = user.profilePicture;

// Handle profile picture upload
document.getElementById('profilePictureInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const profilePicture = document.getElementById('profilePicture');
            profilePicture.src = e.target.result;

            // Save the new profile picture to localStorage
            user.profilePicture = e.target.result;
            localStorage.setItem('user', JSON.stringify(user));
        };
        reader.readAsDataURL(file);
    }
});

// Fetch and display courses from courses.txt
function fetchCourses() {
    fetch('courses.txt')
        .then(response => response.text())
        .then(data => {
            const courseList = document.getElementById('courseList');
            const courses = data.split('\n').filter(line => line.trim() !== '');
            courseList.innerHTML = courses.map(course => `
                <div class="course-card">
                    <h3>${course.split(':')[0]}</h3>
                    <div class="course-info">
                        ${course.split(':')[1]}
                    </div>
                </div>
            `).join('');
        })
        .catch(error => console.error('Error fetching courses:', error));
}

// Logout functionality
function logout() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('user');
        window.location.href = "login.html"; // Redirect to login page
    }
}

// Initialize the page
fetchCourses();