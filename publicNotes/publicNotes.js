const semesterSelect = document.getElementById('semesterSelect');
const userCheckboxes = document.getElementById('userCheckboxes');
const noteInput = document.getElementById('noteInput');
const pdfInput = document.getElementById('pdfInput');
const shareNoteButton = document.getElementById('shareNoteButton');
const notesDisplay = document.getElementById('notesDisplay');
const pdfStatus = document.getElementById('pdfStatus');

// Sample users for each semester with Pakistani names
const usersBySemester = {
    semester1: ['Ali', 'Fatima', 'Usman', 'Aisha', 'Omar', 'Khadija', 'Ibrahim'],
    semester2: ['Hassan', 'Zainab', 'Tariq', 'Sana', 'Imran', 'Anika', 'Bilal'],
    semester3: ['Umar', 'Ayesha', 'Hamza', 'Maria', 'Junaid', 'Sara', 'Asad'],
    semester4: ['Ahmed', 'Sidra', 'Harun', 'Nadia', 'Kamran', 'Fariha', 'Yusuf'],
    semester5: ['Abdullah', 'Amna', 'Zubair', 'Hira', 'Salman', 'Alia', 'Rafay'],
    semester6: ['Osman', 'Kainat', 'Saad', 'Maha', 'Ishaq', 'Esha', 'Daniyal'],
    semester7: ['Ilyas', 'Kinza', 'Arslan', 'Anum', 'Waqas', 'Laiba', 'Zaid'],
    semester8: ['Yahya', 'Minal', 'Affan', 'Hareem', 'Ehtisham', 'Nayab', 'Rayyan']
};

// Function to populate user checkboxes
function populateUsers(semester) {
    userCheckboxes.innerHTML = ''; // Clear previous checkboxes
    const users = usersBySemester[semester] || [];
    users.forEach(user => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = user;
        checkbox.name = 'user';
        checkbox.value = user;
        checkbox.checked = true; // Select by default
        checkbox.classList.add('user-checkbox');

        const label = document.createElement('label');
        label.htmlFor = user;
        label.textContent = user;
        label.classList.add('user-label');

        const div = document.createElement('div');
        div.classList.add('user-entry');
        div.appendChild(checkbox);
        div.appendChild(label);
        userCheckboxes.appendChild(div);
    });
}

// Event listener for semester selection
semesterSelect.addEventListener('change', () => {
    const selectedSemester = semesterSelect.value;
    populateUsers(selectedSemester);
});

// PDF upload status update
pdfInput.addEventListener('change', () => {
    if (pdfInput.files.length > 0) {
        pdfStatus.textContent = pdfInput.files[0].name; // Show the name of the uploaded file
    } else {
        pdfStatus.textContent = 'No file chosen'; // Reset status if no file is chosen
    }
});

// Share Note button functionality
shareNoteButton.addEventListener('click', () => {
    const selectedUsers = Array.from(document.querySelectorAll('input[name="user"]:checked'))
        .map(checkbox => checkbox.value);

    const noteText = noteInput.value.trim(); // Trim whitespace
    const pdfFile = pdfInput.files[0];

    if (noteText !== "") { // Check if noteText is not empty
        shareNote(selectedUsers, noteText);
        noteInput.value = ""; // Clear note input after sharing
    }

    if (pdfFile) {
        sharePdf(selectedUsers, pdfFile);
        pdfInput.value = ""; // Reset PDF input
        pdfStatus.textContent = 'No file chosen'; // Update status
    }

    if (noteText === "" && !pdfFile) {
        alert("Please write a note or select a PDF file to share.");
    }
});

// Function to share a note
function shareNote(selectedUsers, noteText) {
    // Logic to share the note
    console.log('Selected Users:', selectedUsers);
    console.log('Note Text:', noteText);

    const newNote = document.createElement('div');
    newNote.classList.add('note');
    const noteContent = document.createElement('p');
    noteContent.textContent = noteText;
    newNote.appendChild(noteContent);
    notesDisplay.appendChild(newNote);
}

// Function to share a PDF
function sharePdf(selectedUsers, pdfFile) {
    // Logic to share the PDF
    console.log('Selected Users:', selectedUsers);
    console.log('PDF File:', pdfFile);

    const newNote = document.createElement('div');
    newNote.classList.add('note');
    const pdfLink = document.createElement('a');
    pdfLink.href = URL.createObjectURL(pdfFile); // Create a temporary URL
    pdfLink.textContent = pdfFile.name;
    pdfLink.target = '_blank'; // Open in a new tab
    newNote.appendChild(pdfLink);
    notesDisplay.appendChild(newNote);
}

// Initial user population (e.g., for the default selected semester)
populateUsers(semesterSelect.value);
