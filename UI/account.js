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

// Fetch and display courses from the Flask server
function fetchCourses() {
    fetch('http://192.168.0.108:8000/getCourses')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }

            const courseList = document.getElementById('courseList');
            courseList.innerHTML = data.courses.map(course => `
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