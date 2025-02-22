const form = document.querySelector("#uploadForm"),
fileInput = document.querySelector(".file-input"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area"),
submitBtn = document.querySelector("#submitBtn");

// Click on form to trigger file input
form.addEventListener("click", (e) => {
  if (e.target !== submitBtn) {
    fileInput.click();
  }
});

// Prevent form submission on enter key
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (fileInput.files.length > 0) {
    uploadFile(fileInput.files[0].name);
  }
});

fileInput.onchange = ({target}) => {
  let file = target.files[0];
  
  if (file) {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      fileInput.value = '';
      submitBtn.style.display = 'none';
      return;
    }

    let fileName = file.name;
    if (fileName.length >= 12) {
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    // Show submit button when valid image is selected
    submitBtn.style.display = 'block';
  }
}

function uploadFile(name) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/upload");
  
  xhr.upload.addEventListener("progress", ({loaded, total}) => {
    // Calculate file size
    let fileTotal = Math.floor(total / 1000);
    let fileSize;
    (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024*1024)).toFixed(2) + " MB";
    
    // Calculate percentage
    let fileLoaded = Math.floor((loaded / total) * 100);
    
    let progressHTML = `<li class="row">
                        <i class="fas fa-file-image"></i>
                        <div class="content">
                          <div class="details">
                            <span class="name">${name} • Uploading</span>
                            <span class="percent">${fileLoaded}%</span>
                          </div>
                          <div class="progress-bar">
                            <div class="progress" style="width: ${fileLoaded}%"></div>
                          </div>
                        </div>
                      </li>`;

    uploadedArea.classList.add("onprogress");
    progressArea.innerHTML = progressHTML;
  });

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      progressArea.innerHTML = "";
      if (xhr.status === 200) {
        let response = JSON.parse(xhr.responseText);
        let fileSize = fileInput.files[0].size;
        if(fileSize < 1024000) {
          fileSize = (fileSize / 1024).toFixed(2) + " KB";
        } else {
          fileSize = (fileSize / (1024*1024)).toFixed(2) + " MB";
        }

        let uploadedHTML = `<li class="row">
                            <div class="content upload">
                              <i class="fas fa-file-image"></i>
                              <div class="details">
                                <span class="name">${name} • Uploaded</span>
                                <span class="size">${fileSize}</span>
                              </div>
                            </div>
                            <i class="fas fa-check"></i>
                          </li>`;

        uploadedArea.classList.remove("onprogress");
        uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
        
        // Reset form and hide submit button
        form.reset();
        submitBtn.style.display = 'none';
      } else {
        alert('Upload failed. Please try again.');
      }
    }
  };

  let formData = new FormData(form);
  xhr.send(formData);
}