# 🔗 GitHub Integration Setup

This guide will help you set up automatic CSV file writing to your GitHub repository whenever someone fills out the Thanksgiving calendar form.

## 🎯 What This Does

- **Automatic Updates**: Every time someone adds their name, CSV files are automatically written to your GitHub repository
- **Version Control**: Each update creates a commit with a descriptive message
- **Two Files**: Creates both backend (with phone numbers) and public (without phone numbers) CSV files
- **Persistent Storage**: Files are stored in your GitHub repository and won't be lost when Heroku restarts

## 🔧 Setup Steps

### 1. Create GitHub Personal Access Token

1. **Go to GitHub Settings**:
   - Visit [github.com/settings/tokens](https://github.com/settings/tokens)
   - Click "Generate new token (classic)"

2. **Configure Token**:
   - **Note**: `Thanksgiving Calendar CSV Export`
   - **Expiration**: Choose appropriate expiration (90 days recommended)
   - **Scopes**: Select `repo` (Full control of private repositories)

3. **Generate Token**:
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

### 2. Set Heroku Environment Variables

```bash
# Set GitHub token
heroku config:set GITHUB_TOKEN=your_github_token_here

# Set repository name (replace with your actual repo)
heroku config:set GITHUB_REPO=your-username/your-repo-name

# Set branch (optional, defaults to 'main')
heroku config:set GITHUB_BRANCH=main
```

### 3. Verify Configuration

```bash
# Check your Heroku config
heroku config

# Test the health endpoint
curl https://your-app-name.herokuapp.com/health
```

You should see:
```json
{
  "status": "OK",
  "timestamp": "2024-11-15T10:30:00.000Z",
  "github_configured": true,
  "github_repo": "your-username/your-repo-name"
}
```

## 📁 File Structure in GitHub

After setup, your repository will contain:

```
your-repo/
├── index.html
├── styles.css
├── script.js
├── server.js
├── package.json
├── README.md
├── thanksgiving-calendar-backend-2024-11-15.csv  ← Auto-generated
├── thanksgiving-calendar-public-2024-11-15.csv   ← Auto-generated
└── ... (other files)
```

## 🔄 How It Works

### When Someone Fills the Form:

1. **Data Saved**: Attendee data is saved to the server
2. **CSV Generated**: Two CSV files are created:
   - `thanksgiving-calendar-backend-YYYY-MM-DD.csv` (with phone numbers)
   - `thanksgiving-calendar-public-YYYY-MM-DD.csv` (without phone numbers)
3. **GitHub Update**: Files are automatically committed to your repository
4. **Commit Message**: Descriptive commit like "Update backend CSV: John Smith added to 2024-11-24"

### Example Commit History:

```
Update backend CSV: Mary Johnson added to 2024-11-24
Update public CSV: Mary Johnson added to 2024-11-24
Update backend CSV: John Smith added to 2024-11-24
Update public CSV: John Smith added to 2024-11-24
Initial commit
```

## 🛠️ Troubleshooting

### Token Issues

**Error**: "GitHub token not configured"
```bash
# Check if token is set
heroku config | grep GITHUB_TOKEN

# Set token if missing
heroku config:set GITHUB_TOKEN=your_token_here
```

**Error**: "Bad credentials"
- Token may be expired or invalid
- Generate a new token and update Heroku config

### Repository Issues

**Error**: "Repository not found"
```bash
# Check repository name
heroku config | grep GITHUB_REPO

# Update repository name
heroku config:set GITHUB_REPO=your-username/your-repo-name
```

**Error**: "Branch not found"
```bash
# Check branch name
heroku config | grep GITHUB_BRANCH

# Update branch name
heroku config:set GITHUB_BRANCH=main
```

### Permission Issues

**Error**: "Not found" or "Forbidden"
- Ensure the token has `repo` scope
- Check that the repository exists and is accessible
- Verify the repository name is correct

## 📊 Monitoring

### Check GitHub Integration Status

```bash
# Health check
curl https://your-app-name.herokuapp.com/health

# View logs
heroku logs --tail
```

### View GitHub Activity

- Go to your GitHub repository
- Check the "Commits" tab
- You should see automatic commits when forms are submitted

## 🔒 Security Notes

- **Token Security**: Keep your GitHub token secure
- **Repository Access**: The token has full repository access
- **Token Rotation**: Consider rotating tokens periodically
- **Environment Variables**: Tokens are stored securely in Heroku

## 🎯 Testing

### Test the Integration

1. **Fill out a test form** on your live app
2. **Check GitHub repository** for new CSV files
3. **Verify commit messages** are descriptive
4. **Download CSV files** to verify content

### Manual CSV Export

You can also manually trigger CSV exports:

```bash
# Export backend CSV
curl -X POST https://your-app-name.herokuapp.com/api/csv/write/backend

# Export public CSV
curl -X POST https://your-app-name.herokuapp.com/api/csv/write/public
```

## 📈 Benefits

- ✅ **Persistent Storage**: Files survive Heroku restarts
- ✅ **Version Control**: Complete history of all changes
- ✅ **Easy Access**: Files available in your GitHub repository
- ✅ **Backup**: Automatic backup of all data
- ✅ **Transparency**: Clear commit history of all additions

---

**Your CSV files will now automatically update in your GitHub repository! 🎉** 