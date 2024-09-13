// Format message with timestamp and username
function formatMessage(username, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${username}: ${message}`;
  }
  
  module.exports = { formatMessage };
  