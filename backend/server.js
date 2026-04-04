const express = require('express');
const app = express();
const cors = require('cors');

const connectDB = require('./config/db');
require('dotenv').config();


// User Defined Routes
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const {protect} = require('./middleware/authMiddleware');

// 1. Load environment variables (Not setup )
// dotenv.config();

// 2. Connect to local database
connectDB();

// 3. Body Parser Middleware

// Parse JSON bodies
app.use(express.json());

// Enables CORS for all routes
app.use(cors({
  origin: 'https://mycampuslink.vercel.app',
  credentials: true
}));

// Parse URL-encoded bodies (form submissions)
app.use(express.urlencoded({extended: true}));

app.get('/',(req,res) => {
    res.json({message: 'Hii'});
})

// 4. Define Routes
app.use('/api/auth',authRoutes);
app.use('/api/item',protect,itemRoutes);
app.use('/api/booking',protect,bookingRoutes);

app.listen(process.env.PORT || 3000, ()=>{
    console.log('🚀 Server is running on port ' + (process.env.PORT || 3000));
})