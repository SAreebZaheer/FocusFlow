const plusButton = document.getElementById('plusButton');
const uploads = document.getElementById('uploads');

uploads.style.display = 'none';

// Define server URL
const SERVER_URL = 'http://192.168.0.106:8000';

// Function to fetch and display text files
function fetchAndDisplayTextFiles() {
    fetch(`${SERVER_URL}/get-text-files`) // You need to add this endpoint in your server
        .then(response => response.json())
        .then(textFiles => {
            const textFilesContainer = document.createElement('div');
            textFilesContainer.id = 'text-files-container';
            textFilesContainer.style.display = 'flex';
            textFilesContainer.style.flexWrap = 'wrap';
            textFilesContainer.style.gap = '20px';
            textFilesContainer.style.marginTop = '20px';

            textFiles.forEach(file => {
                const fileBlock = document.createElement('div');
                fileBlock.style.backgroundColor = '#f0f0f0';
                fileBlock.style.borderRadius = '10px';
                fileBlock.style.padding = '15px';
                fileBlock.style.cursor = 'pointer';
                fileBlock.style.textAlign = 'center';
                fileBlock.style.width = '200px';

                const fileName = document.createElement('h3');
                fileName.textContent = file.name;
                fileName.style.margin = '0';

                fileBlock.appendChild(fileName);
                fileBlock.addEventListener('click', () => {
                    displayTextFileContent(file.path);
                });

                textFilesContainer.appendChild(fileBlock);
            });

            const main = document.querySelector('main');
            main.appendChild(textFilesContainer);
        })
        .catch(error => {
            console.error('Error fetching text files:', error);
        });
}

// Function to display the content of a text file
function displayTextFileContent(filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(text => {
            const textDisplay = document.createElement('div');
            textDisplay.style.backgroundColor = '#fff';
            textDisplay.style.borderRadius = '10px';
            textDisplay.style.padding = '20px';
            textDisplay.style.marginTop = '20px';
            textDisplay.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
            textDisplay.textContent = text;

            const main = document.querySelector('main');
            main.appendChild(textDisplay);
        })
        .catch(error => {
            console.error('Error fetching text file content:', error);
        });
}

// Handle the plus button click to show/hide upload options
plusButton.addEventListener('click', () => {
    uploads.style.display = uploads.style.display === 'flex' ? 'none' : 'flex';
});

// Create a hidden file input element
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

// Function to handle file upload
function uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    fetch(`${SERVER_URL}/upload`, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            console.log('Upload success:', data);
            alert('File uploaded successfully!');
            fetchAndDisplayTextFiles(); // Refresh the list of text files after upload
        })
        .catch(error => {
            console.error('Upload error:', error);
            alert('Upload failed. Please check your connection and ensure the server is running.');
        });
}

// Handle image upload button click
document.querySelector('.uploads button').addEventListener('click', () => {
    fileInput.click();
});

// Handle file selection
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        if (file.type.startsWith('image/')) {
            console.log('Attempting to upload file:', file.name);
            uploadFile(file);
        } else {
            alert('Please select an image file.');
        }
    }
});

// Fetch and display text files when the page loads
fetchAndDisplayTextFiles();