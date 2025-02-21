// Sample timetable data for September 2024
const timetableData = {
    "2024": {
        "8": { // September (0-indexed)
            "2": [
                { time: "09:00", subject: "Mathematics", type: "math" },
                { time: "14:00", subject: "Physics", type: "physics" }
            ],
            "4": [
                { time: "10:30", subject: "Chemistry", type: "chem" }
            ],
            "15": [
                { time: "11:00", subject: "Mathematics", type: "math" },
                { time: "15:30", subject: "Physics", type: "physics" }
            ]
        }
    }
};

// Initialize year dropdown
const yearSelect = document.getElementById('yearSelect');
const currentYear = new Date().getFullYear();

// Populate year dropdown with 2023-2025
for (let year = 2023; year <= 2025; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    option.selected = year === 2024;
    yearSelect.appendChild(option);
}

function generateCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    const month = parseInt(document.getElementById('monthSelect').value);
    const year = parseInt(document.getElementById('yearSelect').value);
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add empty days for week alignment
    for (let i = 0; i < firstDay; i++) {
        calendar.appendChild(createDayCell('', true));
    }

    // Create actual days
    for (let day = 1; day <= daysInMonth; day++) {
        calendar.appendChild(createDayCell(day, false, month, year));
    }
}

function createDayCell(dayNumber, isEmpty, month, year) {
    const dayCell = document.createElement('div');
    dayCell.className = `day-cell ${isEmpty ? 'empty-day' : ''}`;
    
    if (!isEmpty) {
        dayCell.innerHTML = `
            <div class="day-number">${dayNumber}</div>
            ${getClassEntries(dayNumber, month, year)}
        `;
    }
    
    return dayCell;
}

function getClassEntries(day, month, year) {
    const yearData = timetableData[year.toString()] || {};
    const monthData = yearData[month.toString()] || {};
    const dayData = monthData[day.toString()] || [];
    
    return dayData.map(c => `
        <div class="class-entry ${c.type}">
            <div class="time">${c.time}</div>
            <div class="subject">${c.subject}</div>
        </div>
    `).join('');
}

// Event listeners
document.getElementById('monthSelect').addEventListener('change', generateCalendar);
document.getElementById('yearSelect').addEventListener('change', generateCalendar);

// Initial generation
generateCalendar();