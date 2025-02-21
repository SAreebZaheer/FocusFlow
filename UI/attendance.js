let registrationDate = localStorage.getItem('registrationDate');
let attendanceData = JSON.parse(localStorage.getItem('attendanceData')) || {};
let currentProgress = parseInt(localStorage.getItem('progress')) || 75;
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Initialize the app
function init() {
    populateDateSelectors();
    if (registrationDate) {
        showMainInterface();
        updateCalendar();
    }
    updateProgressDisplay();
}

// Registration system (fixed)
function registerUser() {
    // Set registration date to today's midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    registrationDate = today.getTime();
    
    localStorage.setItem('registrationDate', registrationDate);
    showMainInterface();
    updateCalendar();
}

function showMainInterface() {
    document.getElementById('registration').style.display = 'none';
    document.getElementById('main-interface').style.display = 'block';
}

// Date selection
function populateDateSelectors() {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    
    // Populate months
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        option.selected = index === currentMonth;
        monthSelect.appendChild(option);
    });

    // Populate years
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 2; year <= currentYear + 1; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        option.selected = year === currentYear;
        yearSelect.appendChild(option);
    }
}

// Calendar system
function updateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    const month = parseInt(document.getElementById('month-select').value);
    const year = parseInt(document.getElementById('year-select').value);
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    // Create empty days for week start
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day', 'inactive');
        calendar.appendChild(emptyDay);
    }

    // Create actual days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = date.toISOString().split('T')[0];
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = day;

        // Handle date states
        if (date > new Date()) {
            dayElement.classList.add('future');
        } else if (date < new Date(registrationDate)) {
            dayElement.classList.add('inactive');
        } else {
            dayElement.addEventListener('click', () => toggleAttendance(dateString));
            if (attendanceData[dateString]) {
                dayElement.classList.add(attendanceData[dateString]);
            }
        }

        calendar.appendChild(dayElement);
    }
}

// Attendance management
function toggleAttendance(dateString) {
    const currentStatus = attendanceData[dateString] || null;
    const newStatus = 
        currentStatus === null ? 'attended' :
        currentStatus === 'attended' ? 'missed' : null;

    if (newStatus) {
        attendanceData[dateString] = newStatus;
    } else {
        delete attendanceData[dateString];
    }

    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    updateCalendar();
}

// Progress system
function adjustProgress(amount) {
    currentProgress = Math.min(100, Math.max(0, currentProgress + amount));
    localStorage.setItem('progress', currentProgress);
    updateProgressDisplay();
}

function updateProgressDisplay() {
    document.querySelector('.progress-fill').style.width = `${currentProgress}%`;
}

// Initialize the app
init();
updateCalendar();