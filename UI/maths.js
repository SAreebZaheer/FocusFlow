const plusButton = document.getElementById('plusButton');
const uploads = document.getElementById('uploads');

uploads.style.display = 'none';

plusButton.addEventListener('click', () => {
    uploads.style.display = uploads.style.display === 'block' ? 'none' : 'block';
});

uploads.addEventListener('click', (event) => {
    const clickedButton = event.target;

    if (clickedButton.tagName === 'BUTTON') {  // Check if a button was clicked
        const buttonText = clickedButton.textContent;

        let inputElement;

        switch (buttonText) {
            case 'Upload Image':
                inputElement = document.createElement('input');
                inputElement.type = 'file';
                inputElement.accept = 'image/*'; // Accept only image files
                break;
            case 'Upload Document':
                inputElement = document.createElement('input');
                inputElement.type = 'file';
                inputElement.accept = '.pdf, .docx, .txt, .odt'; // Example document types
                break;
            case 'Upload Recording':
                inputElement = document.createElement('input');
                inputElement.type = 'file';
                inputElement.accept = 'audio/*'; // Accept audio files
                break;
            // case 'Record Live Audio': // For live recording, you'll need more complex logic
            //     // Implement live recording functionality here (using the Web Audio API)
            //     break;
            default:
                return; // Do nothing if it's not a relevant button
        }

        if (inputElement) {
            inputElement.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    // Handle the selected file
                    console.log('Selected file:', file);
                    // Here you can implement the upload logic (e.g., using fetch or XMLHttpRequest)
                    // or display a preview of the file, etc.
                    const reader = new FileReader();

                    reader.onload = function(e) {
                      //  e.target.result will contain the contents of the file
                      if (buttonText === 'Upload Image'){
                        let img = document.createElement('img');
                        img.src = e.target.result;
                        document.body.appendChild(img);
                      }
                      else if (buttonText === 'Upload Document'){
                        let text = document.createElement('p');
                        text.textContent = e.target.result;
                        document.body.appendChild(text);
                      }
                      else if (buttonText === 'Upload Recording'){
                        let audio = document.createElement('audio');
                        audio.src = e.target.result;
                        audio.controls = true;
                        document.body.appendChild(audio);
                      }
                    }
                    if (buttonText === 'Upload Image' || buttonText === 'Upload Document'){
                        reader.readAsText(file);
                    }
                    else if (buttonText === 'Upload Recording'){
                        reader.readAsDataURL(file);
                    }

                }
            });
            inputElement.click(); // Programmatically trigger the file selection dialog
        }
    }
});

document.body.addEventListener('click', (event) => {
    if (!plusButton.contains(event.target) && !uploads.contains(event.target)) {
        uploads.style.display = 'none';
    }
});