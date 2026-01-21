// API Configuration
// IMPORTANT: When testing on a physical device, you MUST use your computer's IP address instead of localhost
// 
// To find your IP address on Windows:
// 1. Open PowerShell
// 2. Run: ipconfig
// 3. Look for "IPv4 Address" under your Wi-Fi or Ethernet adapter
//    Example: 192.168.1.100
//
// Then replace 'localhost' below with your IP address:
// Example: 'http://192.168.1.100:3000/api'

// SET THIS to 'localhost' for simulator/emulator/web, or your IP address for physical device
const SERVER_HOST = '10.54.97.170'; // Change to your IP (e.g., '192.168.1.100') when testing on phone

export const API_BASE_URL = `http://${SERVER_HOST}:3000/api`;

// Test User Configuration (hardcoded as per requirements)
export const TEST_USER = {
  name: 'John Doe',
  email: 'john@example.com',
};
