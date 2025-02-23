document.addEventListener('DOMContentLoaded', function () {
    const courseGrid = document.querySelector('.course-grid');

    // Fetch courses from the server
    fetch('/get-courses')
        .then(response => response.json())
        .then(courses => {
            // Clear existing course buttons
            courseGrid.innerHTML = '';

            // Create and append course buttons for each course
            courses.forEach(course => {
                const courseButton = document.createElement('a');
                courseButton.href = `./${course.name.toLowerCase().replace(/\s+/g, '-')}.html`; // Dynamically generate the href
                courseButton.classList.add('course-button');
                courseButton.textContent = course.name;

                // Append the course button to the course grid
                courseGrid.appendChild(courseButton);
            });
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
        });})