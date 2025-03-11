const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./models/db'); // Import DB connection
const videoRoutes = require('./routes/Routes'); // Import routes

dotenv.config();
const app = express();

app.use(cors());

// Connect to MongoDB and set up GridFSBucket
connectDB().then((gridFSBucket) => {
    app.locals.bucket = gridFSBucket; // Store bucket in app.locals
    console.log('GridFSBucket initialized');
}).catch((err) => {
    console.error('Failed to initialize GridFSBucket:', err);
});

app.use('/video', videoRoutes); // Use Routes

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
