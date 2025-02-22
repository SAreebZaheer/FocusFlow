document.getElementById("course-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const courseName = document.getElementById("course-name").value.trim();

    if (!courseName) {
        alert("Please enter a course name.");
        return;
    }

    // Send course data to the server
    try {
        const response = await fetch("/add-course", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ course: courseName }),
        });

        if (response.ok) {
            // Refresh the course list
            loadCourses();
            document.getElementById("course-name").value = ""; // Clear input
        } else {
            alert("Failed to add course.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while adding the course.");
    }
});

// Function to load and display courses
async function loadCourses() {
    try {
        const response = await fetch("/get-courses");
        const courses = await response.json();

        const courseList = document.getElementById("course-list");
        courseList.innerHTML = ""; // Clear existing list

        courses.forEach((course) => {
            const li = document.createElement("li");
            li.textContent = course;

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", async () => {
                await fetch("/remove-course", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ course }),
                });
                loadCourses(); // Refresh the list
            });

            li.appendChild(removeButton);
            courseList.appendChild(li);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

// Load courses when the page loads
loadCourses();