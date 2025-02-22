let timetableData = JSON.parse(localStorage.getItem('timetableData')) || {};

// Initialize calendar
function init() {
    populateDateSelectors();
    generateCalendar();
}

// Populate month/year dropdowns
function populateDateSelectors() {
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');
    
    const months = ['January','February','March','April','May','June',
                   'July','August','September','October','November','December'];
    const currentYear = new Date().getFullYear();

    // Populate months
    monthSelect.innerHTML = months.map((month, index) => `
        <option value="${index}" ${index === new Date().getMonth() ? 'selected' : ''}>${month}</option>
    `).join('');

    // Populate years
    yearSelect.innerHTML = Array.from({length: 3}, (_, i) => currentYear - 1 + i)
        .map(year => `
            <option value="${year}" ${year === currentYear ? 'selected' : ''}>${year}</option>
        `).join('');
}

// Generate calendar
function generateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    const month = parseInt(document.getElementById('monthSelect').value);
    const year = parseInt(document.getElementById('yearSelect').value);
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add empty days
    for (let i = 0; i < firstDay; i++) {
        calendar.appendChild(createDayCell('', true));
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        calendar.appendChild(createDayCell(day, false, dateKey));
    }
}

// Create a day cell
function createDayCell(dayNumber, isEmpty, dateKey) {
    const dayCell = document.createElement('div');
    dayCell.className = `day-cell ${isEmpty ? 'empty-day' : ''}`;
    
    if (!isEmpty) {
        const dayName = getDayName(dateKey);
        dayCell.innerHTML = `
            <div class="day-number">${dayNumber}</div>
            <div class="day-name">${dayName}</div>
            ${getClassEntries(dateKey)}
        `;
    }
    
    return dayCell;
}

// Get the day name
function getDayName(dateStr) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateStr);
    return days[date.getDay()];
}

// Get class entries for a specific day
function getClassEntries(dateKey) {
    const classes = timetableData[dateKey] || [];
    return classes.map(c => `
        <div class="class-entry ${c.type}">
            <div class="time">${c.time}</div>
            <div class="subject">${c.subject}</div>
        </div>
    `).join('');
}

// Add class functionality
function openAddClassModal() {
    document.getElementById('addClassModal').style.display = 'flex';
}

function addClass() {
    const classType = document.getElementById('classType').value;
    const classTime = document.getElementById('classTime').value;
    const frequency = document.querySelector('input[name="addFrequency"]:checked').value;
    const classDate = document.getElementById('classDate').value;

    if (!classDate) {
        alert("Please select a date.");
        return;
    }

    const classEntry = {
        time: classTime,
        subject: classType.charAt(0).toUpperCase() + classType.slice(1),
        type: classType
    };

    if (frequency === 'once') {
        addSingleClass(classDate, classEntry);
    } else {
        addWeeklyClass(classDate, classEntry);
    }

    closeModal('addClassModal');
    generateCalendar();
}

function addSingleClass(date, classEntry) {
    if (!timetableData[date]) timetableData[date] = [];
    timetableData[date].push(classEntry);
    saveData();
}

function addWeeklyClass(startDate, classEntry) {
    const start = new Date(startDate);
    const end = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
        const dateStr = d.toISOString().split('T')[0];
        addSingleClass(dateStr, classEntry);
    }
}

// Remove class functionality
function openRemoveClassModal() {
    document.getElementById('removeClassModal').style.display = 'flex';
}

function removeClass() {
    const classType = document.getElementById('removeClassType').value;
    const removeDate = document.getElementById('removeClassDate').value;
    const frequency = document.querySelector('input[name="removeFrequency"]:checked').value;

    if (!removeDate) {
        alert("Please select a date.");
        return;
    }

    if (frequency === 'once') {
        removeSingleClass(removeDate, classType);
    } else {
        removeWeeklyClass(removeDate, classType);
    }

    closeModal('removeClassModal');
    generateCalendar();
}

function removeSingleClass(date, classType) {
    if (timetableData[date]) {
        timetableData[date] = timetableData[date].filter(c => c.type !== classType);
        if (timetableData[date].length === 0) delete timetableData[date];
        saveData();
    }
}

function removeWeeklyClass(startDate, classType) {
    const start = new Date(startDate);
    const end = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate());

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
        const dateStr = d.toISOString().split('T')[0];
        removeSingleClass(dateStr, classType);
    }
}

// Utility functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function saveData() {
    localStorage.setItem('timetableData', JSON.stringify(timetableData));
}

// Initialize the app
init();