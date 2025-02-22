const plusButton = document.getElementById('plusButton');
const uploadOptions = document.getElementById('uploadOptions');
const externalFormModal = document.getElementById('externalFormModal');
const closeModal = document.querySelector('.close');
const externalFormIframe = document.getElementById('externalFormIframe');

uploadOptions.style.display = 'none';

plusButton.addEventListener('click', () => {
    uploadOptions.style.display = uploadOptions.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('uploadImage').addEventListener('click', () => {
    externalFormIframe.src = './uploadImageForm.html'; // Path to your external HTML file
    externalFormModal.style.display = 'block';
});

document.getElementById('uploadDocument').addEventListener('click', () => {
    externalFormIframe.src = './uploadDocumentForm.html'; // Path to your external HTML file
    externalFormModal.style.display = 'block';
});

document.getElementById('uploadRecording').addEventListener('click', () => {
    externalFormIframe.src = './uploadRecordingForm.html'; // Path to your external HTML file
    externalFormModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    externalFormModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === externalFormModal) {
        externalFormModal.style.display = 'none';
    }
});