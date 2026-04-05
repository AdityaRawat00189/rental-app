const express = require('express');
const app = express();
const cors = require('cors');

const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

// User Defined Routes
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const {protect} = require('./middleware/authMiddleware');

// Change before deployment to production URL
// const url = process.env.FRONTEND_URL;
const url = process.env.FRONTEND_URL;

// 2. Connect to local database
connectDB();

// 3. Body Parser Middleware

// Parse JSON bodies
app.use(express.json());

// Enables CORS for all routes
app.use(cors({
  origin: url,
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