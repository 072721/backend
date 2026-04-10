# Basketball Stats Tracker

A modern, mobile-first basketball statistics tracking web application.

## Features

### 🏀 Core Features
- **Live Game Tracking** - Track player statistics in real-time during games
- **Player Management** - Add/remove players for each team
- **Statistical Recording** - Track Points, Rebounds, Assists, and Fouls
- **Game History** - Review past games with detailed statistics
- **User Accounts** - Create an account to save your data
- **Guest Mode** - Try the app without registration

### 📱 Screens (7 Total)

1. **Authentication Screen** - Login/Register with elegant form design
2. **Guest Mode Dashboard** - Explore features without an account
3. **Dashboard** - Overview of games and quick stats
4. **Game Setup** - Configure teams and add players
5. **Live Game Tracker** - Real-time stat tracking interface
6. **Game History** - Browse and review completed games
7. **Profile** - User stats and account management

### 🎨 Design Features
- Mobile-first responsive design
- Clean, modern UI with rounded corners and soft shadows
- Color-coded teams (Blue vs Red)
- Touch-optimized controls
- Real-time score updates
- Top player indicators

## How to Use

### Getting Started

1. **Create an Account** or **Continue as Guest**
2. **Start New Game** from the Dashboard
3. **Setup Teams** - Enter team names (e.g., Lakers vs Bulls)
4. **Add Players** - Add players to each team
5. **Track Stats** - Use +/- buttons to record stats in real-time
6. **Finish Game** - Complete and save to history

### Data Storage

- **Registered Users**: Data stored in Firebase Firestore
- **Guest Mode**: Limited features, data resets on logout

## Technology Stack

### Frontend
- **React** - UI framework
- **React Router** - Navigation and routing
- **Tailwind CSS** - Styling and responsive design
- **Axios** - API client
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Backend
- **Firebase** - Authentication & Database
- **Firestore** - NoSQL cloud database
- **Firebase Auth** - User authentication

## Project Structure

```
mobile-basketball-stats/
├── frontend/          # React app (this folder)
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Express API server
│   ├── src/
│   ├── prisma/
│   └── package.json
└── README.md
```

## Deployment

### Frontend Deployment
Deploy the entire project to:
- **Firebase Hosting**: `firebase deploy` (includes hosting + database)
- **Vercel**: `npm run build` then deploy `dist/`
- **Netlify**: `npm run build` then deploy `dist/`

### Firebase Configuration
Your Firebase project is already configured with:
- Authentication (Email/Password)
- Firestore Database
- Hosting (optional)

### Security Rules
Add these Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameId} {
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## Mobile Optimization

- Touch-friendly interface with 44px minimum tap targets
- Prevents zoom on input focus (iOS)
- Safe area support for notched devices
- Smooth scrolling and animations
- Responsive grid layouts

## Quote

> "Every play matters. Every stat counts."
