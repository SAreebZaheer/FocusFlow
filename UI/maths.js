const plusButton = document.getElementById('plusButton');
const uploadOptions = document.getElementById('uploads');

uploadOptions.style.display = 'none';

// Define server URL
const SERVER_URL = 'http://192.168.0.108:8000';

plusButton.addEventListener('click', () => {
    uploadOptions.style.display = uploadOptions.style.display === 'block' ? 'none' : 'block';
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

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${SERVER_URL}/upload`, true);

    xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            console.log(`Upload progress: ${percentComplete}%`);
        }
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const response = JSON.parse(xhr.responseText);
                console.log('Upload success:', response);
                alert('File uploaded successfully!');
            } catch (error) {
                console.error('Error parsing response:', error);
                alert('Upload completed but received unexpected response');
            }
        } else {
            console.error('Upload failed with status:', xhr.status);
            console.error('Response:', xhr.responseText);
            alert(`Upload failed with status ${xhr.status}. Please try again.`);
        }
    };

    xhr.onerror = function(e) {
        console.error('Upload error:', e);
        alert('Upload failed. Please check your connection and ensure the server is running.');
    };

    // Add better error handling
    try {
        xhr.send(formData);
    } catch (error) {
        console.error('Error sending request:', error);
        alert('Error sending request. Please try again.');
    }
}

// Handle image upload button click
document.getElementById('uploadImage').addEventListener('click', () => {
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