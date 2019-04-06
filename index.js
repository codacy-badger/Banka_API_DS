// import export
const express = require('express');

// Initialize the app
const app = express();

// Setup server port
const PORT = process.env.PORT || 8080;

// Launch app to listen to a specific port
app.listen(PORT, () => {
  console.log(`Running Banka on port ${PORT}`);
});
