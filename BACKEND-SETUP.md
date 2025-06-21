# 🚀 Backend Setup Guide

## Quick Start (3 Steps)

### 1. Install Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org/)

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Server
```bash
npm start
```

The server will run on `http://localhost:3000`

---

## 📊 API Endpoints

### Get All Data (with phone numbers)
```
GET http://localhost:3000/api/calendar
```

### Get Public Data (no phone numbers)
```
GET http://localhost:3000/api/calendar/public
```

### Add New Attendee
```
POST http://localhost:3000/api/attendee
Content-Type: application/json

{
  "dateKey": "2024-11-24",
  "name": "John Smith",
  "phone": "555-123-4567",
  "mass": "8:00 AM"
}
```

### Get Attendees for Specific Date
```
GET http://localhost:3000/api/attendees/2024-11-24
```

### Download Backend Data (JSON file)
```
GET http://localhost:3000/api/download/backend
```

### Download Public Data (JSON file)
```
GET http://localhost:3000/api/download/public
```

---

## 🔧 Development

### Start with Auto-Reload
```bash
npm run dev
```

### View Data File
The data is stored in `calendar-data.json` in the project root.

### Access Admin Panel
Visit `http://localhost:3000` and use the Admin Panel in the bottom-left corner.

---

## 📁 File Structure
```
Family Thanksgiving/
├── index.html              # Frontend
├── styles.css              # Frontend styles
├── script.js               # Frontend logic
├── server.js               # Backend server
├── package.json            # Dependencies
├── calendar-data.json      # Data storage (auto-created)
├── sample-backend-data.json # Example data
├── sample-public-data.json # Example public data
└── BACKEND-SETUP.md        # This file
```

---

## 🌐 Deployment Options

### Option 1: Local Network
- Run `npm start`
- Access from other devices on your network using your computer's IP address

### Option 2: Heroku
```bash
# Install Heroku CLI
heroku create your-app-name
git add .
git commit -m "Initial commit"
git push heroku main
```

### Option 3: Vercel
```bash
# Install Vercel CLI
npm i -g vercel
vercel
```

### Option 4: Railway
- Connect your GitHub repo to Railway
- Deploy automatically

---

## 🔒 Security Notes

- Phone numbers are stored in `calendar-data.json`
- Keep this file secure and backed up
- Consider adding authentication for production use
- Use HTTPS in production

---

## 📱 Frontend Integration

The frontend will automatically work with the backend when you:
1. Start the server (`npm start`)
2. Visit `http://localhost:3000`
3. Data will be saved to the server instead of localStorage

---

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Change port in server.js
const PORT = process.env.PORT || 3001;
```

### Data Not Saving
- Check if `calendar-data.json` exists
- Ensure write permissions
- Check server logs

### CORS Issues
- The server includes CORS middleware
- If issues persist, check browser console

---

## 📞 Support

For issues or questions:
1. Check the server logs
2. Verify all dependencies are installed
3. Ensure Node.js version 14+ is installed 