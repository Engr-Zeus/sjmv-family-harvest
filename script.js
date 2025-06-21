// Thanksgiving Calendar Application
class ThanksgivingCalendar {
    constructor() {
        this.calendarData = this.loadCalendarData();
        this.currentYear = new Date().getFullYear();
        this.init();
    }

    init() {
        this.generateCalendar();
        this.setupEventListeners();
    }

    // Generate all Sundays from now until December
    generateSundays() {
        const sundays = [];
        const today = new Date();
        const currentYear = today.getFullYear();
        
        // Start from the next Sunday if today is not Sunday
        let startDate = new Date(today);
        if (startDate.getDay() !== 0) { // 0 = Sunday
            const daysUntilSunday = 7 - startDate.getDay();
            startDate.setDate(startDate.getDate() + daysUntilSunday);
        }
        
        // End date is December 31st of current year
        const endDate = new Date(currentYear, 11, 31); // December 31st
        
        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            sundays.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 7); // Next Sunday
        }
        
        return sundays;
    }

    // Generate the calendar HTML
    generateCalendar() {
        const calendarContainer = document.getElementById('calendar');
        const sundays = this.generateSundays();
        
        calendarContainer.innerHTML = '';
        
        sundays.forEach(sunday => {
            const dateKey = this.formatDateKey(sunday);
            const attendees = this.calendarData[dateKey] || [];
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.dataset.date = dateKey;
            
            dayElement.innerHTML = `
                <div class="date">${sunday.getDate()}</div>
                <div class="month">${sunday.toLocaleDateString('en-US', { month: 'short' })}</div>
                <div class="attendees">
                    ${attendees.length > 0 ? 
                        `${attendees.length} attending<span class="attendee-count">${attendees.length}</span>` : 
                        'No one yet'}
                </div>
            `;
            
            calendarContainer.appendChild(dayElement);
        });
    }

    // Format date as key for storage
    formatDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    // Format date for display
    formatDateDisplay(date) {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Calendar day clicks
        document.getElementById('calendar').addEventListener('click', (e) => {
            if (e.target.closest('.calendar-day')) {
                const dayElement = e.target.closest('.calendar-day');
                const dateKey = dayElement.dataset.date;
                this.showDateModal(dateKey);
            }
        });

        // Modal close button
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('dateModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    // Show modal for specific date
    showDateModal(dateKey) {
        const modal = document.getElementById('dateModal');
        const modalContent = document.getElementById('modalContent');
        const date = new Date(dateKey);
        const attendees = this.calendarData[dateKey] || [];
        
        modalContent.innerHTML = `
            <h3>${this.formatDateDisplay(date)}</h3>
            
            <div class="attendees-list">
                <h4>Who's Coming:</h4>
                ${attendees.length > 0 ? 
                    attendees.map(attendee => `
                        <div class="attendee-item">
                            <div class="attendee-name">${attendee.name}</div>
                            <div class="attendee-mass">Mass: ${attendee.mass}</div>
                        </div>
                    `).join('') : 
                    '<div class="no-attendees">No one has signed up yet. Be the first!</div>'
                }
            </div>
            
            <form id="attendeeForm">
                <div class="form-group">
                    <label for="attendeeName">Your Name:</label>
                    <input type="text" id="attendeeName" name="name" required placeholder="Enter your name">
                </div>
                
                <div class="form-group">
                    <label for="attendeePhone">Phone Number:</label>
                    <input type="tel" id="attendeePhone" name="phone" required placeholder="Enter your phone number">
                </div>
                
                <div class="form-group">
                    <label for="attendeeMass">Mass Preference:</label>
                    <select id="attendeeMass" name="mass" required>
                        <option value="">Select a mass</option>
                        <option value="6:00 AM">6:00 AM</option>
                        <option value="8:00 AM">8:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="6:00 PM">6:00 PM</option>
                    </select>
                </div>
                
                <button type="submit" class="btn">Add My Name</button>
            </form>
        `;
        
        // Add form submit handler
        document.getElementById('attendeeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addAttendee(dateKey);
        });
        
        modal.style.display = 'block';
    }

    // Close modal
    closeModal() {
        document.getElementById('dateModal').style.display = 'none';
    }

    // Add attendee to a date
    async addAttendee(dateKey) {
        const nameInput = document.getElementById('attendeeName');
        const phoneInput = document.getElementById('attendeePhone');
        const massSelect = document.getElementById('attendeeMass');
        
        const name = nameInput.value.trim();
        const phone = phoneInput.value;
        const mass = massSelect.value;
        
        if (!name || !phone || !mass) {
            alert('Please fill in all fields.');
            return;
        }

        // BACKEND INTEGRATION COMMENTED OUT FOR NOW
        /*
        // Send data to backend
        try {
            const response = await fetch('/api/attendee', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dateKey, name, phone, mass })
            });
            const result = await response.json();
            if (!response.ok) {
                alert(result.error || 'Failed to add attendee.');
                return;
            }
            // On success, fetch updated data and update UI
            await this.fetchCalendarData();
            this.generateCalendar();
            this.closeModal();
            this.showSuccessMessage(name, dateKey);
        } catch (error) {
            alert('Network error: Could not connect to backend.');
        }
        */

        // LOCAL STORAGE VERSION (WORKING)
        // Check if name already exists for this date
        const attendees = this.calendarData[dateKey] || [];
        if (attendees.some(attendee => attendee.name.toLowerCase() === name.toLowerCase())) {
            alert('Someone with this name has already signed up for this date.');
            return;
        }
        
        // Add new attendee
        if (!this.calendarData[dateKey]) {
            this.calendarData[dateKey] = [];
        }
        
        this.calendarData[dateKey].push({
            name: name,
            phone: phone,
            mass: mass,
            addedAt: new Date().toISOString()
        });
        
        // Save to localStorage
        this.saveCalendarData();
        
        // Update calendar display
        this.generateCalendar();
        
        // Close modal
        this.closeModal();
        
        // Show success message
        this.showSuccessMessage(name, dateKey);
    }

    // Fetch calendar data from backend (COMMENTED OUT)
    /*
    async fetchCalendarData() {
        try {
            const response = await fetch('/api/calendar');
            if (response.ok) {
                this.calendarData = await response.json();
            }
        } catch (error) {
            // Fallback: keep local data
        }
    }
    */

    // Show success message
    showSuccessMessage(name, dateKey) {
        const date = new Date(dateKey);
        const formattedDate = this.formatDateDisplay(date);
        
        // Create a temporary success message
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(145deg, #28a745, #20c997);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        successDiv.innerHTML = `✅ ${name} added to ${formattedDate}!`;
        
        document.body.appendChild(successDiv);
        
        // Remove after 3 seconds
        setTimeout(() => {
            successDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.parentNode.removeChild(successDiv);
                }
            }, 300);
        }, 3000);
    }

    // Load calendar data from localStorage
    loadCalendarData() {
        const saved = localStorage.getItem('thanksgivingCalendar');
        return saved ? JSON.parse(saved) : {};
    }

    // Save calendar data to localStorage
    saveCalendarData() {
        localStorage.setItem('thanksgivingCalendar', JSON.stringify(this.calendarData));
    }

    // Clear all data (for testing)
    clearData() {
        localStorage.removeItem('thanksgivingCalendar');
        this.calendarData = {};
        this.generateCalendar();
    }

    // Get data for backend export (includes all information)
    getBackendData() {
        return this.calendarData;
    }

    // Get public data (name and mass only)
    getPublicData() {
        const publicData = {};
        for (const [dateKey, attendees] of Object.entries(this.calendarData)) {
            publicData[dateKey] = attendees.map(attendee => ({
                name: attendee.name,
                mass: attendee.mass
            }));
        }
        return publicData;
    }

    // Export data for backend (download as JSON file)
    exportBackendData() {
        const data = this.getBackendData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `thanksgiving-calendar-backend-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Export public data (download as JSON file)
    exportPublicData() {
        const data = this.getPublicData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `thanksgiving-calendar-public-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
}

// Add CSS animations for success message
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the calendar when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    window.calendarApp = new ThanksgivingCalendar();
    
    // BACKEND FETCH COMMENTED OUT FOR NOW
    /*
    // Try to fetch data from backend on load
    if (window.calendarApp.fetchCalendarData) {
        await window.calendarApp.fetchCalendarData();
        window.calendarApp.generateCalendar();
    }
    */
    
    // Add a small debug panel for development (can be removed in production)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const debugPanel = document.createElement('div');
        debugPanel.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-size: 12px;
            z-index: 1000;
            min-width: 200px;
        `;
        debugPanel.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold;">Admin Panel</div>
            <div style="margin-bottom: 8px;">
                <button onclick="localStorage.clear(); location.reload();" style="width: 100%; margin-bottom: 5px; padding: 5px; background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer;">Clear All Data</button>
            </div>
            <div style="margin-bottom: 8px;">
                <button onclick="window.calendarApp.exportBackendData();" style="width: 100%; margin-bottom: 5px; padding: 5px; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer;">Export Backend Data</button>
            </div>
            <div style="margin-bottom: 8px;">
                <button onclick="window.calendarApp.exportPublicData();" style="width: 100%; margin-bottom: 5px; padding: 5px; background: #17a2b8; color: white; border: none; border-radius: 3px; cursor: pointer;">Export Public Data</button>
            </div>
        `;
        document.body.appendChild(debugPanel);
    }
}); 