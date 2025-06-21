const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files

// Data file path
const DATA_FILE = 'calendar-data.json';

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

// Helper function to convert JSON to CSV
function jsonToCSV(data, includePhone = true) {
    const csvRows = [];
    
    // Add header row
    if (includePhone) {
        csvRows.push('Date,Name,Phone,Mass,Added At');
    } else {
        csvRows.push('Date,Name,Mass');
    }
    
    // Add data rows
    for (const [dateKey, attendees] of Object.entries(data)) {
        for (const attendee of attendees) {
            const date = new Date(dateKey).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            if (includePhone) {
                csvRows.push(`"${date}","${attendee.name}","${attendee.phone}","${attendee.mass}","${attendee.addedAt}"`);
            } else {
                csvRows.push(`"${date}","${attendee.name}","${attendee.mass}"`);
            }
        }
    }
    
    return csvRows.join('\n');
}

// Helper function to write CSV to file
function writeCSVToFile(data, filename, includePhone = true) {
    const csvContent = jsonToCSV(data, includePhone);
    const filePath = path.join(__dirname, filename);
    fs.writeFileSync(filePath, csvContent);
    return filePath;
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Get all calendar data
app.get('/api/calendar', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read calendar data' });
    }
});

// Get public calendar data (no phone numbers)
app.get('/api/calendar/public', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const publicData = {};
        
        for (const [dateKey, attendees] of Object.entries(data)) {
            publicData[dateKey] = attendees.map(attendee => ({
                name: attendee.name,
                mass: attendee.mass
            }));
        }
        
        res.json(publicData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to read public calendar data' });
    }
});

// Add new attendee
app.post('/api/attendee', (req, res) => {
    try {
        const { dateKey, name, phone, mass } = req.body;
        
        if (!dateKey || !name || !phone || !mass) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        
        if (!data[dateKey]) {
            data[dateKey] = [];
        }
        
        // Check for duplicate names
        if (data[dateKey].some(attendee => attendee.name.toLowerCase() === name.toLowerCase())) {
            return res.status(400).json({ error: 'Name already exists for this date' });
        }
        
        data[dateKey].push({
            name,
            phone,
            mass,
            addedAt: new Date().toISOString()
        });
        
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        
        // Auto-generate CSV files when new data is added
        const today = new Date().toISOString().split('T')[0];
        writeCSVToFile(data, `thanksgiving-calendar-backend-${today}.csv`, true);
        writeCSVToFile(data, `thanksgiving-calendar-public-${today}.csv`, false);
        
        res.json({ success: true, message: 'Attendee added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add attendee' });
    }
});

// Get attendees for a specific date
app.get('/api/attendees/:dateKey', (req, res) => {
    try {
        const { dateKey } = req.params;
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        
        const attendees = data[dateKey] || [];
        res.json(attendees);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get attendees' });
    }
});

// Download backend data as JSON
app.get('/api/download/backend', (req, res) => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="thanksgiving-calendar-backend-${new Date().toISOString().split('T')[0]}.json"`);
        res.send(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to download data' });
    }
});

// Download public data as JSON
app.get('/api/download/public', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const publicData = {};
        
        for (const [dateKey, attendees] of Object.entries(data)) {
            publicData[dateKey] = attendees.map(attendee => ({
                name: attendee.name,
                mass: attendee.mass
            }));
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="thanksgiving-calendar-public-${new Date().toISOString().split('T')[0]}.json"`);
        res.send(JSON.stringify(publicData, null, 2));
    } catch (error) {
        res.status(500).json({ error: 'Failed to download public data' });
    }
});

// Generate and download backend CSV (with phone numbers)
app.get('/api/csv/backend', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const csvContent = jsonToCSV(data, true);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="thanksgiving-calendar-backend-${new Date().toISOString().split('T')[0]}.csv"`);
        res.send(csvContent);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate CSV' });
    }
});

// Generate and download public CSV (no phone numbers)
app.get('/api/csv/public', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const csvContent = jsonToCSV(data, false);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="thanksgiving-calendar-public-${new Date().toISOString().split('T')[0]}.csv"`);
        res.send(csvContent);
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate CSV' });
    }
});

// Write CSV files to server (backend data with phone numbers)
app.post('/api/csv/write/backend', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const today = new Date().toISOString().split('T')[0];
        const filename = `thanksgiving-calendar-backend-${today}.csv`;
        const filePath = writeCSVToFile(data, filename, true);
        
        res.json({ 
            success: true, 
            message: 'Backend CSV file written successfully',
            filename: filename,
            filePath: filePath
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to write CSV file' });
    }
});

// Write CSV files to server (public data without phone numbers)
app.post('/api/csv/write/public', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        const today = new Date().toISOString().split('T')[0];
        const filename = `thanksgiving-calendar-public-${today}.csv`;
        const filePath = writeCSVToFile(data, filename, false);
        
        res.json({ 
            success: true, 
            message: 'Public CSV file written successfully',
            filename: filename,
            filePath: filePath
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to write CSV file' });
    }
});

// List all CSV files on server
app.get('/api/csv/files', (req, res) => {
    try {
        const files = fs.readdirSync(__dirname)
            .filter(file => file.endsWith('.csv'))
            .map(file => {
                const stats = fs.statSync(path.join(__dirname, file));
                return {
                    filename: file,
                    size: stats.size,
                    created: stats.birthtime,
                    modified: stats.mtime
                };
            })
            .sort((a, b) => b.modified - a.modified); // Sort by most recent
        
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: 'Failed to list CSV files' });
    }
});

// Download specific CSV file from server
app.get('/api/csv/download/:filename', (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.sendFile(filePath);
    } catch (error) {
        res.status(500).json({ error: 'Failed to download CSV file' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Thanksgiving Calendar Server running on http://localhost:${PORT}`);
    console.log(`📊 API Endpoints:`);
    console.log(`   GET  /api/calendar - Get all data`);
    console.log(`   GET  /api/calendar/public - Get public data (no phones)`);
    console.log(`   POST /api/attendee - Add new attendee`);
    console.log(`   GET  /api/attendees/:dateKey - Get attendees for date`);
    console.log(`   GET  /api/download/backend - Download backend JSON`);
    console.log(`   GET  /api/download/public - Download public JSON`);
    console.log(`   GET  /api/csv/backend - Download backend CSV`);
    console.log(`   GET  /api/csv/public - Download public CSV`);
    console.log(`   POST /api/csv/write/backend - Write backend CSV to server`);
    console.log(`   POST /api/csv/write/public - Write public CSV to server`);
    console.log(`   GET  /api/csv/files - List all CSV files`);
    console.log(`   GET  /api/csv/download/:filename - Download specific CSV file`);
}); 