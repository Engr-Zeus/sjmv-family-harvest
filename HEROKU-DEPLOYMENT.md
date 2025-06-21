# 🚀 Heroku Deployment Guide

This guide will walk you through deploying your Family Thanksgiving Calendar to Heroku.

## 📋 Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Heroku Account**: Sign up at [heroku.com](https://heroku.com)
3. **Heroku CLI**: Install from [devcenter.heroku.com](https://devcenter.heroku.com/articles/heroku-cli)

## 🛠️ Step-by-Step Deployment

### 1. Install Heroku CLI
```bash
# Windows (with Chocolatey)
choco install heroku

# Or download from: https://devcenter.heroku.com/articles/heroku-cli
```

### 2. Login to Heroku
```bash
heroku login
```

### 3. Create Heroku App
```bash
# Navigate to your project directory
cd "path/to/your/family-thanksgiving-calendar"

# Create a new Heroku app
heroku create your-app-name
# Example: heroku create family-thanksgiving-2024
```

### 4. Set Up Git Remote
```bash
# Add Heroku remote (if not already added)
git remote add heroku https://git.heroku.com/your-app-name.git

# Or if you already have a remote, update it
git remote set-url heroku https://git.heroku.com/your-app-name.git
```

### 5. Deploy to Heroku
```bash
# Push to Heroku
git push heroku main

# If your branch is called 'master' instead of 'main'
git push heroku master
```

### 6. Open Your App
```bash
heroku open
```

## 🔧 Configuration

### Environment Variables (Optional)
```bash
# Set any environment variables if needed
heroku config:set NODE_ENV=production
```

### Check App Status
```bash
# View app logs
heroku logs --tail

# Check app status
heroku ps
```

## 📊 Your App URLs

After deployment, your app will be available at:
- **Main App**: `https://your-app-name.herokuapp.com`
- **Health Check**: `https://your-app-name.herokuapp.com/health`
- **API**: `https://your-app-name.herokuapp.com/api/calendar`

## 🔍 Troubleshooting

### Common Issues

#### 1. Build Fails
```bash
# Check build logs
heroku logs --tail

# Common fixes:
# - Ensure package.json has correct Node.js version
# - Check that all dependencies are in package.json
# - Verify Procfile exists and is correct
```

#### 2. App Crashes
```bash
# Check runtime logs
heroku logs --tail

# Restart the app
heroku restart
```

#### 3. Port Issues
- Heroku automatically sets the PORT environment variable
- The server.js file should use `process.env.PORT || 3000`

### Debug Commands
```bash
# View recent logs
heroku logs

# View specific number of lines
heroku logs -n 200

# Run app locally with Heroku config
heroku local web

# Check app status
heroku ps
```

## 📱 Testing Your Deployment

### 1. Test the Main App
- Visit your Heroku URL
- Try adding a test attendee
- Check if the calendar displays correctly

### 2. Test API Endpoints
```bash
# Test health check
curl https://your-app-name.herokuapp.com/health

# Test calendar data
curl https://your-app-name.herokuapp.com/api/calendar

# Test adding an attendee
curl -X POST https://your-app-name.herokuapp.com/api/attendee \
  -H "Content-Type: application/json" \
  -d '{"dateKey":"2024-11-24","name":"Test User","phone":"555-123-4567","mass":"8:00 AM"}'
```

### 3. Test CSV Export
```bash
# Download backend CSV
curl https://your-app-name.herokuapp.com/api/csv/backend

# Download public CSV
curl https://your-app-name.herokuapp.com/api/csv/public
```

## 🔄 Updating Your App

### 1. Make Changes Locally
```bash
# Make your code changes
# Test locally first
```

### 2. Commit and Push
```bash
# Commit changes
git add .
git commit -m "Update description"

# Push to GitHub
git push origin main

# Deploy to Heroku
git push heroku main
```

### 3. Verify Deployment
```bash
# Check deployment status
heroku releases

# Open the app
heroku open
```

## 📊 Monitoring

### View Logs
```bash
# Real-time logs
heroku logs --tail

# Recent logs
heroku logs -n 100
```

### App Metrics
```bash
# View app metrics
heroku ps

# Check dyno usage
heroku ps:scale
```

## 🔒 Security Notes

- **HTTPS**: Heroku automatically provides HTTPS
- **Environment Variables**: Use for sensitive data
- **Data Persistence**: CSV files are stored on Heroku's ephemeral filesystem
- **Backup**: Consider backing up your data regularly

## 💰 Heroku Plans

### Free Tier (Discontinued)
- Heroku no longer offers a free tier
- You'll need a paid plan

### Basic Plans
- **Eco Dyno**: $5/month (recommended for this app)
- **Basic Dyno**: $7/month

### Upgrade Commands
```bash
# Upgrade to paid plan
heroku ps:type eco

# Scale dynos
heroku ps:scale web=1
```

## 🎯 Next Steps

After successful deployment:

1. **Share the URL** with your family
2. **Test all features** thoroughly
3. **Monitor logs** for any issues
4. **Set up monitoring** if needed
5. **Consider custom domain** for easier sharing

## 🆘 Support

If you encounter issues:

1. **Check Heroku Status**: [status.heroku.com](https://status.heroku.com)
2. **Heroku Documentation**: [devcenter.heroku.com](https://devcenter.heroku.com)
3. **Community Support**: [stackoverflow.com](https://stackoverflow.com/questions/tagged/heroku)

---

**Your Thanksgiving Calendar is now live on Heroku! 🦃✨** 