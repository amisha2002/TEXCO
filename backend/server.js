const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow requests from React Native app
app.use(express.json()); // Parse JSON request bodies

// In-memory storage for waitlists
// Structure: { tripId: [{ id, name, email, position, joinedAt }] }
const waitlists = {};

// Helper function to get next ID (simple counter)
let nextId = 1;

/**
 * Join waitlist endpoint
 * POST /api/waitlist/join
 * Body: { tripId, name, email }
 */
app.post('/api/waitlist/join', (req, res) => {
  const { tripId, name, email } = req.body;

  // Validate input
  if (!tripId || !name || !email) {
    return res.status(400).json({ 
      error: 'Missing required fields: tripId, name, email' 
    });
  }

  // Initialize waitlist for this trip if it doesn't exist
  if (!waitlists[tripId]) {
    waitlists[tripId] = [];
  }

  // Check if user is already on the waitlist (by email)
  const existingUser = waitlists[tripId].find(user => user.email === email);
  if (existingUser) {
    return res.json({
      success: true,
      message: 'You are already on the waitlist',
      position: existingUser.position,
      waitlistId: existingUser.id
    });
  }

  // Calculate position (1-indexed, based on current waitlist length)
  const position = waitlists[tripId].length + 1;

  // Add user to waitlist
  const newUser = {
    id: nextId++,
    name,
    email,
    tripId,
    position,
    joinedAt: new Date().toISOString()
  };

  waitlists[tripId].push(newUser);

  // Return success with position
  res.json({
    success: true,
    message: 'Successfully joined waitlist',
    position: position,
    waitlistId: newUser.id
  });
});

/**
 * Check position endpoint
 * GET /api/waitlist/position/:tripId/:email
 */
app.get('/api/waitlist/position/:tripId/:email', (req, res) => {
  const { tripId, email } = req.params;

  // Validate input
  if (!tripId || !email) {
    return res.status(400).json({ 
      error: 'Missing required parameters: tripId, email' 
    });
  }

  // Check if waitlist exists
  if (!waitlists[tripId] || waitlists[tripId].length === 0) {
    return res.status(404).json({ 
      error: 'No waitlist found for this trip' 
    });
  }

  // Find user in waitlist
  const userIndex = waitlists[tripId].findIndex(user => user.email === email);
  
  if (userIndex === -1) {
    return res.status(404).json({ 
      error: 'You are not on the waitlist for this trip' 
    });
  }

  // Recalculate position (in case someone left)
  const position = userIndex + 1;
  const totalInLine = waitlists[tripId].length;

  res.json({
    success: true,
    position: position,
    totalInLine: totalInLine,
    message: `You're #${position} in line`
  });
});

/**
 * Simulate spot opening (removes first person)
 * POST /api/waitlist/spot-opened/:tripId
 */
app.post('/api/waitlist/spot-opened/:tripId', (req, res) => {
  const { tripId } = req.params;

  // Check if waitlist exists
  if (!waitlists[tripId] || waitlists[tripId].length === 0) {
    return res.status(404).json({ 
      error: 'No one on the waitlist for this trip' 
    });
  }

  // Remove first person from waitlist
  const removedUser = waitlists[tripId].shift();

  // Update positions for remaining users (recalculate)
  waitlists[tripId].forEach((user, index) => {
    user.position = index + 1;
  });

  res.json({
    success: true,
    message: 'Spot opened and first person notified',
    notifiedUser: {
      name: removedUser.name,
      email: removedUser.email,
      wasPosition: 1
    },
    remainingInLine: waitlists[tripId].length
  });
});

/**
 * Get all waitlist data (for testing/debugging)
 * GET /api/waitlist/all/:tripId
 */
app.get('/api/waitlist/all/:tripId', (req, res) => {
  const { tripId } = req.params;
  
  if (!waitlists[tripId]) {
    return res.json({ tripId, waitlist: [] });
  }

  res.json({
    tripId,
    waitlist: waitlists[tripId],
    total: waitlists[tripId].length
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Waitlist API is running' });
});

// Start server
// Listen on all network interfaces (0.0.0.0) to allow connections from other devices
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Waitlist API server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📱 To connect from your phone, use your computer's IP address instead of localhost`);
  console.log(`   Find your IP with: ipconfig (Windows) or ifconfig (Mac/Linux)`);
});
