const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');


dotenv.config({
    path: path.join(__dirname, '.env')
});

const connectDB = require('./config/db');
const emailRoutes = require('./routes/emailRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/emails', emailRoutes);

app.get('/', (req, res) => {
    res.send('BulkMail Backend is Running!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    await connectDB();
});
