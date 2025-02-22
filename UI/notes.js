const plusButton = document.getElementById('plusButton');
const uploadOptions = document.getElementById('uploadOptions');

uploadOptions.style.display = 'none';

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
    xhr.open('POST', '/upload', true);

    xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100;
            console.log(`Upload progress: ${percentComplete}%`);
        }
    };

    xhr.onload = function() {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            alert('File uploaded successfully!');
        } else {
            alert('Upload failed. Please try again.');
        }
    };

    xhr.onerror = function() {
        alert('Upload failed. Please check your connection.');
    };

    xhr.send(formData);
}

// Handle image upload button click
document.getElementById('uploadImage').addEventListener('click', () => {
    fileInput.click(); // Trigger file selection dialog
});

// Handle file selection
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        if (file.type.startsWith('image/')) {
            uploadFile(file);
        } else {
            alert('Please select an image file.');
        }
    }
});