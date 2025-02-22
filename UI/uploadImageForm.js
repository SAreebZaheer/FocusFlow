const form = document.querySelector("form"),
    fileInput = document.querySelector(".file-input"),
    progressArea = document.querySelector(".progress-area"),
    uploadedArea = document.querySelector(".uploaded-area"),
    submitButton = document.getElementById("submit-button");

let uploadedFiles =[]; // Array to store uploaded file data

form.addEventListener("click", () => {
    fileInput.click();
});

fileInput.onchange = ({ target }) => {
    let file = target.files;
    if (file && file.type.startsWith("image/")) { // Check if it's an image
        let fileName = file.name;
        if (fileName.length >= 12) {
            let splitName = fileName.split('.');
            fileName = splitName.substring(0, 13) + "...." + splitName;
        }

        let fileData = { // Store file data for later submission
            file: file,
            name: fileName,
            size: file.size,
            uploaded: false // Flag to track upload status
        };
        uploadedFiles.push(fileData);
        uploadFile(fileData);

    } else {
      alert("Please select an image file.")
      fileInput.value = ""; // Clear the input
    }
};

function uploadFile(fileData) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "upload"); // Corrected path for server

    let loaded_prev = 0; // Track previously loaded amount

    xhr.upload.addEventListener("progress", ({ loaded, total }) => {
        // Calculate progress based on ACTUAL bytes transferred
        let progress = 0;
        if (total > 0) { // Avoid division by zero
            progress = Math.round((loaded / total) * 100);
        }

        let chunk_loaded = loaded - loaded_prev; // Bytes loaded in this chunk
        loaded_prev = loaded; // Update for the next chunk

        let fileSize;
        if (total < 1024) {
          fileSize = total + " B"; // Bytes for smaller files
        } else if (total < 1024 * 1024) {
          fileSize = Math.round(total / 1024) + " KB";
        } else {
          fileSize = (total / (1024 * 1024)).toFixed(2) + " MB";
        }

        let progressHTML = `<li class="row">
                            <i class="fas fa-file-alt"></i>
                            <div class="content">
                                <div class="details">
                                    <span class="name">${fileData.name} • Uploading</span>
                                    <span class="percent">${progress}%</span> </div>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${progress}%"></div>
                                </div>
                            </div>
                        </li>`;
        progressArea.innerHTML = progressHTML;

        if (progress == 100) { // Check against progress percentage
            progressArea.innerHTML = "";
            let uploadedHTML = `<li class="row">
                                <div class="content upload">
                                    <i class="fas fa-file-alt"></i>
                                    <div class="details">
                                        <span class="name">${fileData.name} • Uploaded</span>
                                        <span class="size">${fileSize}</span>
                                    </div>
                                </div>
                                <i class="fas fa-check"></i>
                            </li>`;
            uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
            fileData.uploaded = true;
            checkAllUploaded();
        }
    });

    xhr.onload = () => {
        if (xhr.status!== 200) {
            console.error("Upload failed:", xhr.status, xhr.statusText);
            alert("File upload failed. Please try again.");
            // Handle error, e.g., remove from uploadedFiles, display error message
        }
    };


    let formData = new FormData();
    formData.append("file", fileData.file); // Append the actual File object

    xhr.send(formData);
}

function checkAllUploaded() {
    let allUploaded = uploadedFiles.every(file => file.uploaded);
    submitButton.disabled =!allUploaded;
}

submitButton.addEventListener("click", () => {
    if (uploadedFiles.length === 0) return; // No files to submit

    let formData = new FormData();
    uploadedFiles.forEach(fileData => {
        formData.append("files", fileData.file); // Use "files" for multiple files
    });

    fetch('/upload', { // Send to correct path
        method: 'POST',
        body: formData
    })
  .then(response => response.json())
  .then(data => {
        console.log('Success:', data);
        alert("Files submitted successfully!");
        uploadedFiles = []; // Clear the uploaded files array
        uploadedArea.innerHTML = ""; // Clear the displayed files
        submitButton.disabled = true; // Disable the submit button
    })
  .catch(error => {
        console.error('Error:', error);
        alert("File submission failed. Please try again.");
    });
});