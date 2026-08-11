// This file acts as the entry point for Hostinger Node.js Web Apps & Phusion Passenger.
// It loads and executes the compiled production bundle of the Express server.

try {
  require('./dist/server.cjs');
} catch (err) {
  console.error("Error loading compiled production server from ./dist/server.cjs:", err);
  console.log("Attempting to run development server as fallback...");
  try {
    const { spawn } = require('child_process');
    spawn('npx', ['tsx', 'server.ts'], { stdio: 'inherit', shell: true });
  } catch (fallbackErr) {
    console.error("Fallback execution failed:", fallbackErr);
  }
}
