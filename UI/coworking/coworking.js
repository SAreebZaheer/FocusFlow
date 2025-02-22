const userGrid = document.getElementById('userGrid');
const toggleCameraButton = document.getElementById('toggleCamera');
const toggleMicButton = document.getElementById('toggleMic');
const userVideo = document.getElementById('userVideo');

// Sample users for demonstration
const users = [
    { name: 'Ali', image: 'DP3.jpg' },
    { name: 'Fatima', image: 'DP1.jpg' },
    { name: 'Usman', image: 'DP3.jpg' },
    { name: 'Aisha', image: 'DP1.jpg' },
    { name: 'Omar', image: 'DP3.jpg' },
    { name: 'Khadija', image: 'DP1.jpg' },
    { name: 'Ibrahim', image: 'DP3.jpg' },
];

// Populate user cards
users.forEach(user => {
    const userCard = document.createElement('div');
    userCard.className = 'user-card';
    userCard.innerHTML = `
        <div class="default-video">
            <img src="${user.image}" alt="${user.name}" onerror="this.src='https://via.placeholder.com/150/ccc/ffffff?text=No+Image'">
            <p>${user.name}</p>
            <i class="fas fa-microphone-slash mic-icon"></i> <!-- Mic icon for muted status -->
        </div>
    `;
    userGrid.appendChild(userCard);
});

// Toggle camera functionality
// ... (other JavaScript code)

let cameraOn = false;
toggleCameraButton.addEventListener('click', () => {
    cameraOn = !cameraOn;
    if (cameraOn) {
        toggleCameraButton.classList.remove('fa-video-slash');
        toggleCameraButton.classList.add('fa-video');
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                userVideo.srcObject = stream;
            })
            .catch(err => {
                console.error('Error accessing camera: ', err);
                // Important: Show a message to the user if camera access fails
                alert('Camera access failed. Please check your browser permissions.');
                toggleCameraButton.classList.remove('fa-video');
                toggleCameraButton.classList.add('fa-video-slash');
                cameraOn = false; // Revert the toggle state
            });
    } else {
        toggleCameraButton.classList.remove('fa-video');
        toggleCameraButton.classList.add('fa-video-slash');
        userVideo.srcObject = null;
    }
});


// Toggle microphone functionality
let micOn = false;
toggleMicButton.addEventListener('click', () => {
    micOn = !micOn;
    toggleMicButton.classList.toggle('fa-microphone', !micOn);
    toggleMicButton.classList.toggle('fa-microphone-slash', micOn);
    // Logic to mute/unmute audio can be added here
});