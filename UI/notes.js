const plusButton = document.getElementById('plusButton');
const uploadOptions = document.getElementById('uploadOptions');

uploadOptions.style.display = 'none';

plusButton.addEventListener('click', () => {
    uploadOptions.style.display = uploadOptions.style.display === 'block' ? 'none' : 'block';
});

document.body.addEventListener('click', (event) => {
    if (!plusButton.contains(event.target) && !uploadOptions.contains(event.target)) {
        uploadOptions.style.display = 'none';
    }
});