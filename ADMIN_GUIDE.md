# Basketball Stats Tracker - Admin Panel Guide

## 🔐 Admin Access

The admin panel is completely hidden from regular users and can only be accessed via a specific URL.

### Access Details

- **URL**: `/admin`
- **Email**: `mark.pogi@gmail.com`
- **Password**: `pogiparin2026`

**Important**: The admin panel is not linked anywhere in the main application interface. Regular users cannot discover or access it.

## 🎨 Features Overview

### 1. Branding & Interface Control (UI Settings)

The admin has full control over the visual appearance of the entire application for all users.

#### Theme Color Control
- **Primary Color**: Changes the main accent color throughout the app
- **Team A Color**: Sets the default color for Team A across all games
- **Team B Color**: Sets the default color for Team B across all games

All colors can be selected using a color picker or entered as hex values. Changes apply instantly to all users when saved.

#### Logo Upload
- Upload a custom league or team logo
- Supported formats: PNG, JPG (max 2MB)
- Logo appears on the dashboard and other key screens
- Can be removed and replaced at any time

#### Announcement Banner
- Create messages that appear at the top of all users' dashboards
- Perfect for announcements like "Game 2 starts at 5 PM!"
- Banner is dismissible by users but reappears when message is updated
- Leave empty to hide the banner

### 2. System Overrides ("God Mode")

#### Force Sync / Override Scores
- View all games in the system
- Manually adjust scores if a scorer's system hangs or has issues
- Click "Override" on any game to edit scores
- Changes are saved instantly and sync across all users

#### Export Data
Two export options available:

**Export as PDF**
- Professional formatted report
- Includes all game data: teams, scores, status, dates
- Perfect for submitting to commissioners or record-keeping
- Auto-downloads with timestamp

**Export as CSV (Excel)**
- Excel-compatible format
- All game statistics in a spreadsheet
- Easy to import into other tools
- Great for data analysis

## 🚀 How to Use

### Logging In
1. Navigate to `/admin` in your browser
2. Enter admin credentials
3. Click "Access Admin Panel"

### Changing Branding
1. Go to "Branding & Interface" tab
2. Adjust colors using color pickers or hex inputs
3. Upload a logo if desired
4. Add an announcement message
5. Click "Save All Settings"
6. Changes apply immediately to all users

### Overriding Game Scores
1. Go to "System Overrides" tab
2. Scroll to "Force Sync / Override Scores" section
3. Find the game you want to modify
4. Click "Override"
5. Enter new scores
6. Click "Save"

### Exporting Data
1. Go to "System Overrides" tab
2. Click either "Export as PDF" or "Export as CSV"
3. File downloads automatically

## 📊 Demo Data

The app automatically seeds demo games for testing on localhost:
- 3 sample games with realistic data
- Mix of finished and live games
- Sample NBA players and statistics
- Perfect for testing admin features

## 🔒 Security Notes

**Current Implementation (Development)**
- Admin credentials are stored client-side
- Session is stored in localStorage
- Suitable for internal tools and development

**For Production**
- Move credentials to a secure backend
- Implement proper authentication (JWT, OAuth, etc.)
- Add session expiration
- Implement audit logging
- Use HTTPS only

## 💡 Tips

1. **Theme Colors**: Use your league's official colors for a professional look
2. **Logo Size**: Keep logos under 500KB for best performance
3. **Announcements**: Keep messages short and clear
4. **Export Regularly**: Download backups of game data periodically
5. **Force Sync**: Only use when absolutely necessary to avoid data conflicts

## 🆘 Troubleshooting

**Can't log in?**
- Verify you're using the correct email and password
- Check that you're at `/admin` (not `/admin/dashboard`)
- Clear browser cache and try again

**Settings not saving?**
- Check browser console for errors
- Verify localStorage is enabled
- Try a different browser

**Export not working?**
- Ensure you have games in the system
- Check that pop-up blockers aren't blocking downloads
- Try a different export format

## 📱 Mobile Support

The admin panel is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile phones (portrait and landscape)

For best experience, use a desktop browser when managing multiple settings.

---

**Version**: 1.0  
**Last Updated**: March 22, 2026  
**Support**: Internal Use Only
