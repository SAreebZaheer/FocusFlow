const uploadOptions = document.getElementById('uploadOptions');
const uploadModal = document.getElementById('uploadModal');
const closeModal = document.querySelector('.close');
const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');

uploadOptions.style.display = 'none';

plusButton.addEventListener('click', () => {
    uploadOptions.style.display = uploadOptions.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('uploadImage').addEventListener('click', () => {
    fileInput.accept = 'image/*';
    uploadModal.style.display = 'block';
});

document.getElementById('uploadDocument').addEventListener('click', () => {
    fileInput.accept = '.pdf, .docx, .txt, .odt';
    uploadModal.style.display = 'block';
});

document.getElementById('uploadRecording').addEventListener('click', () => {
    fileInput.accept = 'audio/*';
    uploadModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    uploadModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === uploadModal) {
        uploadModal.style.display = 'none';
    }
});

uploadForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const file = fileInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('http://192.168.0.108:8000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(err => { throw new Error(err) });
            }
            return response.json();
        })
        .then(data => {
            console.log('File upload successful:', data);
            uploadModal.style.display = 'none';
            // Handle the uploaded file (e.g., display it on the page)
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            alert("File upload failed: " + error.message);
        });
    }
});