const plusButton = document.getElementById('plusButton');
const uploadOptions = document.getElementById('uploadOptions');

uploadOptions.style.display = 'none';

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
                return;
        }

        if (inputElement) {
            inputElement.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const formData = new FormData();
                    formData.append('file', file);

                    console.log("FormData:", formData); // Log FormData for debugging

                    fetch('http://192.168.0.108:8000/upload', {  // Ensure the correct server URL
                        method: 'POST',
                        body: formData
                    })
                    .then(response => {
                        console.log("Response status:", response.status);
                        console.log("Response headers:", response.headers);
                        if (!response.ok) {
                            return response.text().then(err => {throw new Error(err)}); // Get error message from server
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('File upload successful:', data);

                        if (data.subdirectory === 'notes_images') {
                            let img = document.createElement('img');
                            img.src = `./${data.subdirectory}/${data.filename}`;
                            document.body.appendChild(img);
                        } else if (data.subdirectory === 'uploads') {
                            let link = document.createElement('a');
                            link.href = `./${data.subdirectory}/${data.filename}`;
                            link.textContent = data.filename;
                            link.target = '_blank';
                            document.body.appendChild(link);
                            document.body.appendChild(document.createElement('br'));
                        } else if (data.subdirectory === 'recordings') {
                            let audio = document.createElement('audio');
                            audio.src = `./${data.subdirectory}/${data.filename}`;
                            audio.controls = true;
                            document.body.appendChild(audio);
                        }

                    })
                    .catch(error => {
                        console.error('Error uploading file:', error);
                        alert("File upload failed: " + error.message); // Show detailed error message
                    });
                }
            });
            inputElement.click();
        }
    }
});

document.body.addEventListener('click', (event) => {
    if (!plusButton.contains(event.target) && !uploadOptions.contains(event.target)) {
        uploadOptions.style.display = 'none';
    }
});