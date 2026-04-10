# Test Credentials & Getting Started

## Quick Start Guide

### Option 1: Guest Mode (No Registration)
1. Click "Continue as Guest" on the login screen
2. Explore demo features with limitations
3. View sample player statistics
4. Cannot save custom games

### Option 2: Create a New Account
1. Click "Register" tab
2. Enter your details:
   - Name: Any name
   - Email: Any valid email format (e.g., user@example.com)
   - Password: Any password
3. Click "Create Account"

### Option 3: Use Demo Account
For testing purposes, you can create a demo account:
- **Email**: demo@basketball.com
- **Password**: demo123
- **Name**: Demo User

## First-Time Experience

When you first load the app, you'll see:
1. Welcome modal explaining features
2. Clean authentication screen
3. Option to login, register, or continue as guest

## Feature Testing Checklist

### Authentication Flow
- [ ] Register a new account
- [ ] Login with existing account
- [ ] Try guest mode
- [ ] View guest limitations
- [ ] Logout from profile

### Game Management
- [ ] Create a new game
- [ ] Add team names
- [ ] Add players to each team
- [ ] Start the game
- [ ] View live game screen

### Live Game Tracking
- [ ] Increment points
- [ ] Decrement points
- [ ] Track rebounds
- [ ] Track assists
- [ ] Track fouls
- [ ] See score update automatically
- [ ] View top player trophy
- [ ] Remove a player
- [ ] Finish the game

### Game History
- [ ] View completed games
- [ ] Expand game details
- [ ] See player statistics
- [ ] Delete a game

### Profile & Stats
- [ ] View profile screen
- [ ] See total games count
- [ ] Check statistics
- [ ] Logout

### Mobile Testing
- [ ] Test on mobile browser
- [ ] Test touch controls
- [ ] Test responsive layout
- [ ] Test smooth scrolling
- [ ] Test landscape mode

## Data Storage

All data is stored in browser localStorage:
- `basketball_user` - Current logged-in user
- `basketball_users` - All registered users
- `basketball_games` - All games data
- `basketball_guest` - Guest mode flag
- `basketball_welcome_seen` - Welcome modal flag

## Clearing Data

To reset the app:
1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Find Local Storage
4. Delete all `basketball_*` entries
5. Refresh the page

## Sample Game Flow

1. **Login** → Create account or continue as guest
2. **Dashboard** → Click "Start New Game"
3. **Game Setup** → 
   - Enter "Lakers" for Team A
   - Enter "Bulls" for Team B
   - Add players: LeBron James, Anthony Davis (Lakers)
   - Add players: DeMar DeRozan, Zach LaVine (Bulls)
   - Click "Start Game"
4. **Live Game** →
   - Click + button next to "Points" for LeBron (repeat 27 times)
   - Add assists and rebounds
   - Track stats for all players
   - Click "Finish" when done
5. **History** → Review the completed game

## Troubleshooting

**Issue**: Can't login
- **Solution**: Make sure you're using the exact email/password you registered with

**Issue**: Data disappeared
- **Solution**: Check if localStorage was cleared. Data only persists in the same browser.

**Issue**: Guest mode not working
- **Solution**: Logout first, then click "Continue as Guest"

**Issue**: Game not saving
- **Solution**: Make sure you're logged in (not in guest mode)

**Issue**: Mobile keyboard blocking input
- **Solution**: Scroll down or rotate to landscape mode

## Browser Compatibility

✅ **Tested & Working**:
- Chrome 120+
- Safari 17+
- Edge 120+
- Firefox 120+
- iOS Safari 17+
- Chrome Mobile 120+

⚠️ **May have issues**:
- Internet Explorer (not supported)
- Very old browser versions

## Privacy Note

This is a demo application that stores all data locally in your browser. No data is sent to any server. Your information stays on your device.
