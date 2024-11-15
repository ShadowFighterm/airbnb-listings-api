// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = 3000;
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));
// Routes
const listingRoutes = require('./routes/listings');
app.use('/api', listingRoutes);
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});