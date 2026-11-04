// Import Mongoose to connect to MongoDB.
const mongoose = require("mongoose");

// Connect to the Timeline database.
function connectDB() {
  const dbURI = process.env.MONGODB_URI;

  return mongoose.connect(dbURI, { dbName: "the-timeline" });
}

// Export the connection function for server.js.
module.exports = connectDB;