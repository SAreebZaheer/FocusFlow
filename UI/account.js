document.getElementById("level").addEventListener("change", (e) => {
    const semesterGroup = document.getElementById("semester-group");
    semesterGroup.style.display = e.target.value === "university" ? "block" : "none";
});

document.getElementById("profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const level = document.getElementById("level").value;
    const semester = level === "university" ? document.getElementById("semester").value : null;
    const photoFile = document.getElementById("profile-photo").files[0];

    if (!name) {
        alert("Please enter your name.");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("level", level);
    if (semester) formData.append("semester", semester);
    if (photoFile) formData.append("photo", photoFile);

    try {
        const response = await fetch("/save-profile", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            alert("Profile saved successfully!");
            loadProfile();
        } else {
            alert("Failed to save profile.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while saving the profile.");
    }
});

// Function to load and display profile
async function loadProfile() {
    try {
        const response = await fetch("/get-profile");
        const profile = await response.json();

        document.getElementById("display-name").textContent = profile.name || "Not set";
        document.getElementById("display-level").textContent = profile.level || "Not set";
        document.getElementById("display-semester").textContent = profile.semester || "Not applicable";

        const photoDisplay = document.getElementById("display-photo");
        if (profile.photo) {
            photoDisplay.src = profile.photo;
            photoDisplay.style.display = "block";
        } else {
            photoDisplay.style.display = "none";
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

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

// Load profile and courses when the page loads
loadProfile();
loadCourses();