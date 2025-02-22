const plusButton = document.getElementById('plusButton');
const uploads = document.getElementById('uploads');

uploads.style.display = 'none';

// Define server URL
const SERVER_URL = 'http://192.168.0.106:8000';

// Function to fetch and display text files
function fetchAndDisplayTextFiles() {
    fetch(`${SERVER_URL}/get-text-files`)
        .then(response => response.json())
        .then(textFiles => {
            const textFilesContainer = document.createElement('div');
            textFilesContainer.id = 'text-files-container';
            textFilesContainer.style.display = 'flex';
            textFilesContainer.style.flexWrap = 'wrap';
            textFilesContainer.style.gap = '20px';
            textFilesContainer.style.marginTop = '20px';

            textFiles.forEach(filename => {
                const fileBlock = document.createElement('div');
                fileBlock.style.backgroundColor = '#f0f0f0';
                fileBlock.style.borderRadius = '10px';
                fileBlock.style.padding = '15px';
                fileBlock.style.cursor = 'pointer';
                fileBlock.style.textAlign = 'center';
                fileBlock.style.width = '200px';

                const fileName = document.createElement('h3');
                fileName.textContent = filename;
                fileName.style.margin = '0';

                fileBlock.appendChild(fileName);

                // Add a container for the text content
                const textContentContainer = document.createElement('div');
                textContentContainer.style.display = 'none'; // Initially hidden
                textContentContainer.style.marginTop = '10px';

                fileBlock.appendChild(textContentContainer);

                fileBlock.addEventListener('click', () => {
                    // Toggle visibility of the text content
                    if (textContentContainer.style.display === 'none') {
                        // If hidden, fetch and display the content
                        fetchTextFileContent(filename, textContentContainer);
                    } else {
                        // If visible, hide the content
                        textContentContainer.style.display = 'none';
                    }
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

// Function to fetch and display the content of a text file
function fetchTextFileContent(filename, container) {
    fetch(`${SERVER_URL}/get-text-file/${filename}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }

            // Clear previous content
            container.innerHTML = '';

            // Create a paragraph for the text content
            const textContent = document.createElement('p');
            textContent.textContent = data.content;

            // Append the text content to the container
            container.appendChild(textContent);

            // Show the container
            container.style.display = 'block';
        })
        .catch(error => {
            console.error('Error fetching text file content:', error);
            alert(`Error: ${error.message}`);
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