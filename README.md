# Trip Waitlist Feature

A simple trip waitlist feature for a travel app, consisting of a Node.js/Express backend API and a React Native mobile app.

## Features

- ✅ Join a waitlist for a sold-out trip
- ✅ Check your current position in the waitlist
- ✅ Simulate spot opening (removes first person from waitlist)
- ✅ Simple, functional UI

## Project Structure

```
TEXCO/
├── backend/          # Node.js/Express API
│   ├── server.js    # Main server file
│   └── package.json # Backend dependencies
├── mobile/          # React Native app (Expo)
│   ├── App.js       # Main app component
│   └── package.json # Mobile app dependencies
└── README.md        # This file
```

## Prerequisites

Before you begin, you'll need to install:

1. **Node.js** (v14 or higher)
   - Download from: https://nodejs.org/
   - Choose the LTS version for Windows
   - During installation, make sure to check "Add to PATH"

2. **npm** (comes with Node.js)
   - Verify installation: `node --version` and `npm --version`

3. **Expo CLI** (for React Native)
   - Will be installed globally in setup steps below

## Setup Instructions

### Step 1: Install Node.js

1. Download Node.js from https://nodejs.org/ (choose Windows Installer .msi)
2. Run the installer
3. Check "Add to PATH" during installation
4. Complete the installation
5. Open PowerShell and verify:
   ```powershell
   node --version
   npm --version
   ```

### Step 2: Set Up Backend

1. Open PowerShell or Command Prompt
2. Navigate to the backend folder:
   ```powershell
   cd C:\Users\ASUS\Desktop\TEXCO\backend
   ```
3. Install dependencies:
   ```powershell
   npm install
   ```
   This will install `express` and `cors` packages.

4. Start the backend server:
   ```powershell
   npm start
   ```
   You should see: `🚀 Waitlist API server running on http://localhost:3000`

5. **Keep this terminal window open** - the server needs to keep running!

### Step 3: Set Up Mobile App

1. Open a **new** PowerShell or Command Prompt window
2. Install Expo CLI globally (one-time setup):
   ```powershell
   npm install -g expo-cli
   ```
   Note: If you get permission errors, you may need to run PowerShell as Administrator.

3. Navigate to the mobile folder:
   ```powershell
   cd C:\Users\ASUS\Desktop\TEXCO\mobile
   ```

4. Install dependencies:
   ```powershell
   npm install
   ```
   This may take a few minutes as it downloads React Native and Expo packages.

5. Start the Expo development server:
   ```powershell
   npm start
   ```
   Or:
   ```powershell
   expo start
   ```

6. You'll see a QR code and options. Choose one:
   - **Option A**: Install "Expo Go" app on your phone (iOS/Android) and scan the QR code
   - **Option B**: Press `w` to open in web browser (easiest for testing)
   - **Option C**: Press `a` for Android emulator (requires Android Studio setup)

### Step 4: Test the Connection

1. Make sure backend is running (should show server running on port 3000)
2. Make sure mobile app is running (Expo server)
3. In the mobile app:
   - Enter a Trip ID (e.g., "trip-123")
   - Click "Join Waitlist"
   - You should see your position (#1)
   - Click "Refresh Position" to check again

## API Endpoints

The backend provides these endpoints:

### Join Waitlist
```
POST http://localhost:3000/api/waitlist/join
Body: {
  "tripId": "trip-123",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Check Position
```
GET http://localhost:3000/api/waitlist/position/:tripId/:email
Example: http://localhost:3000/api/waitlist/position/trip-123/john@example.com
```

### Simulate Spot Opening
```
POST http://localhost:3000/api/waitlist/spot-opened/:tripId
Example: http://localhost:3000/api/waitlist/spot-opened/trip-123
```

### Health Check
```
GET http://localhost:3000/api/health
```

## Troubleshooting

### Backend Issues

**Problem**: `npm install` fails
- **Solution**: Make sure Node.js is installed correctly. Try: `node --version`

**Problem**: Port 3000 is already in use
- **Solution**: Change the port in `backend/server.js` (line 4) to something else like `3001`, then update `mobile/App.js` (line 7) to match.

**Problem**: "Cannot find module 'express'"
- **Solution**: Run `npm install` again in the backend folder

### Mobile App Issues

**Problem**: "TurboModuleRegistry.getEnforcing 'PlatformConstants' not found"
- **Solution**: This is a common Expo 53 error. Run these commands in the `mobile` folder:
  ```powershell
  # Delete old dependencies
  Remove-Item -Recurse -Force node_modules
  Remove-Item package-lock.json -ErrorAction SilentlyContinue
  
  # Reinstall with Expo's fix command
  npm install
  npx expo install --fix
  
  # Start with cleared cache
  npx expo start --clear
  ```
  Or use the provided fix script: `.\fix-expo-error.ps1`

**Problem**: "Cannot connect to server"
- **Solution**: 
  - Make sure backend is running
  - If testing on a real phone, replace `localhost` with your computer's IP address in `mobile/App.js` (line 7)
  - To find your IP: Run `ipconfig` in PowerShell and look for "IPv4 Address"

**Problem**: Expo CLI not found
- **Solution**: Install it globally: `npm install -g expo-cli`

**Problem**: App doesn't load on phone
- **Solution**: 
  - Make sure phone and computer are on the same WiFi network
  - Try using the web browser option instead (press `w` in Expo)

**Problem**: "Network request failed" on Android emulator
- **Solution**: Use `10.0.2.2` instead of `localhost` in `App.js` for Android emulator

### Windows-Specific Issues

**Problem**: Script execution is disabled
- **Solution**: Run PowerShell as Administrator and execute:
  ```powershell
  Set-ExecutionPolicy RemoteSigned
  ```

**Problem**: Permission denied for npm global install
- **Solution**: Run PowerShell as Administrator, or use `npm install -g expo-cli --force`

## Testing with Multiple Users

To test the waitlist with multiple positions:

1. Join the waitlist from the app (you're #1)
2. Manually test by calling the API from a tool like Postman or curl:
   ```powershell
   # In another PowerShell window
   Invoke-RestMethod -Uri "http://localhost:3000/api/waitlist/join" -Method POST -ContentType "application/json" -Body '{"tripId":"trip-123","name":"Jane Doe","email":"jane@example.com"}'
   ```
3. Refresh position in the app to see you're still #1, and Jane is #2

## Concurrency Handling

See `CONCURRENCY_NOTES.md` for detailed explanation of how concurrent requests are handled and production-ready solutions.

**Current Implementation**: Uses in-memory storage with Node.js's single-threaded nature for basic protection. Sufficient for demo/prototype purposes.

**Production Recommendation**: Use a database (PostgreSQL, MongoDB) with ACID transactions and row-level locking.

## Development Notes

- No authentication required (hardcoded test user)
- In-memory storage (data resets when server restarts)
- Simple, functional UI (not production-designed)
- Test user: John Doe (john@example.com)

## Next Steps for Production

1. Add database persistence
2. Implement proper authentication
3. Add push notifications for spot openings
4. Add proper error handling and logging
5. Add input validation and sanitization
6. Implement rate limiting
7. Add unit and integration tests
8. Set up CI/CD pipeline

## License

ISC
