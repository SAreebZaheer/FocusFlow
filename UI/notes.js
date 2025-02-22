const plusButton = document.getElementById('plusButton');
const uploadOptions = document.getElementById('uploadOptions');

uploadOptions.style.display = 'none'; // Initially hide the upload options

plusButton.addEventListener('click', () => {
    uploadOptions.style.display = uploadOptions.style.display === 'block' ? 'none' : 'block';
});

uploadOptions.addEventListener('click', (event) => {
    const clickedButton = event.target;

    if (clickedButton.tagName === 'BUTTON') {
        const buttonText = clickedButton.textContent;

        let inputElement;

        switch (buttonText) {
            case 'Upload Image':
                inputElement = document.createElement('input');
                inputElement.type = 'file';
                inputElement.accept = 'image/*';
                break;
            case 'Upload Document':
                inputElement = document.createElement('input');
                inputElement.type = 'file';
                inputElement.accept = '.pdf, .docx, .txt, .odt';
                break;
            case 'Upload Recording':
                inputElement = document.createElement('input');
                inputElement.type = 'file';
                inputElement.accept = 'audio/*';
                break;
            default:
                return; // Do nothing if it's not a relevant button
        }

        if (inputElement) {
            inputElement.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const formData = new FormData();
                    formData.append('file', file);

                    fetch('/upload', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('File uploaded successfully:', data);

                        // Handle different file types based on the subdirectory
                        if (data.subdirectory === 'notes_images') {
                            let img = document.createElement('img');
                            img.src = `./${data.subdirectory}/${data.filename}`;
                            document.body.appendChild(img); // Or append to a specific container
                        } else if (data.subdirectory === 'uploads') {
                            // Handle other file types (documents, etc.)
                            // Example: Display a link to the uploaded file
                            let link = document.createElement('a');
                            link.href = `./${data.subdirectory}/${data.filename}`;
                            link.textContent = data.filename;
                            link.target = '_blank'; // Open in new tab
                            document.body.appendChild(link);
                            document.body.appendChild(document.createElement('br')); // Add a line break
                        } else if (data.subdirectory === 'recordings') {
                            let audio = document.createElement('audio');
                            audio.src = `./${data.subdirectory}/${data.filename}`;
                            audio.controls = true;
                            document.body.appendChild(audio);
                        }

                    })
                    .catch(error => {
                        console.error('Error uploading file:', error);
                        // Display an error message to the user
                        alert("File upload failed. Please try again.");
                    });
                }
            });
            inputElement.click();
        }
    }
});

// Hide upload options if clicked outside of plus button or upload options
document.body.addEventListener('click', (event) => {
    if (!plusButton.contains(event.target) && !uploadOptions.contains(event.target)) {
        uploadOptions.style.display = 'none';
    }
});