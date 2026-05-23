// const express = require('express');
// const app = express();
// const cors = require('cors');
// const http = require('http');
// const { Server } = require('socket.io');

// // Models 
// const Message = require('./models/Message');
// const Conversation = require('./models/Conversation');

// const connectDB = require('./config/db');
// const dotenv = require('dotenv');

// dotenv.config();

// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const genAi = new GoogleGenerativeAI("AIzaSyDM_UwrO5pdYUlUVyfL7gmsFrcNEg5uS3A");

// // User Defined Routes
// const authRoutes = require('./routes/authRoutes');
// const itemRoutes = require('./routes/itemRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');
// const chatBotRoutes = require('./routes/chatBotRoutes');
// const {protect} = require('./middleware/authMiddleware');
// // const chatRoutes = require('./routes/chatRoutes');
// // const { model } = require('mongoose');

// // Change before deployment to production URL
// // const url = process.env.FRONTEND_URL;
// const url = process.env.FRONTEND_URL;

// // 2. Connect to local database
// connectDB();

// // 3. Body Parser Middleware

// // Parse JSON bodies
// app.use(express.json());

// // Enables CORS for all routes
// app.use(cors());
// // app.use(cors({
// //   origin: url,
// //   credentials: true
// // }));

// // Parse URL-encoded bodies (form submissions)
// app.use(express.urlencoded({extended: true}));

// app.get('/',(req,res) => {
//     res.json({message: 'Hii'});
// })

// // 4. Define Routes
// app.use('/api/auth',authRoutes);
// app.use('/api/item',protect,itemRoutes);
// app.use('/api/booking',protect,bookingRoutes);
// app.use('/api/ask',chatBotRoutes)
// // app.use('/api/chat', protect, chatRoutes);

// // SOCKET.IO INTRGRATION
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "*",
//         methods: ["GET", "POST"]
//     }
// });

// io.on('connection', (socket) => {
//     console.log('A user connected: ' + socket.id);

//     // Join specific 1-1 chat room
//     socket.on('join_chat', (conversationId) => {
//         socket.join(conversationId);
//         console.log(`User ${socket.id} joined chat ${conversationId}`);
//     })

//     // Handle sending msg
//     socket.on('send_message', async(data) => {
//         const { conversationId, senderId, text } = data;

//         try {
//             const newMessage = await Message.create({
//                 conversationId,
//                 sender: senderId,
//                 text
//             });

//             await Conversation.findByIdAndUpdate(conversationId, {
//                 updatedAt: Date.now()
//             });

//             io.to(conversationId).emit('new_message', newMessage);

//         } catch (error) {
//             console.error('Error sending message:', error);
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected: ' + socket.id);
//     });
// });

// server.listen(process.env.PORT || 3000, ()=>{
//     console.log('🚀 Server is running on port ' + (process.env.PORT || 3000));
// })


const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http'); // 1. Native Node HTTP module
const { Server } = require('socket.io'); // 2. Socket.io Server
const connectDB = require('./config/db');
const dotenv = require('dotenv');

// Load Models (Required for Socket persistence)
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

dotenv.config();

// User Defined Routes
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const chatBotRoutes = require('./routes/chatBotRoutes');
const chatRoutes = require('./routes/chatRoutes'); // 3. Your new 1-1 Chat Routes
const { protect } = require('./middleware/authMiddleware');

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// --- REST API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/item', protect, itemRoutes);
app.use('/api/booking', protect, bookingRoutes);
app.use('/api/ask', chatBotRoutes);
app.use('/api/chat', protect, chatRoutes); // 4. Handshake for 1-1 Chat

app.get('/', (req, res) => {
    res.json({ message: 'CampusLink Protocol Online' });
});

// --- STEP 3: SOCKET.IO INTEGRATION ---

// 5. Create the HTTP Server by wrapping the Express app
const server = http.createServer(app);

// 6. Initialize Socket.io with the HTTP Server
const io = new Server(server, {
    cors: {
        origin: "*", // In production, replace with frontend URL
        methods: ["GET", "POST"]
    }
});

// 7. Socket.io Event Handling
io.on("connection", (socket) => {
    console.log("⚡ New Connection Established:", socket.id);

    // Join a Private Room (Conversation ID)
    socket.on("join_chat", (conversationId) => {
        socket.join(conversationId);
        console.log(`👤 User joined conversation: ${conversationId}`);
    });

    // Handle 1-1 Private Messages
    socket.on("send_message", async (data) => {
        const { conversationId, senderId, text } = data;

        try {
            // A. Save message to MongoDB for history persistence
            const newMessage = await Message.create({
                conversationId,
                sender: senderId,
                text
            });

            // B. Update the conversation timestamp to push it to the top of the inbox
            await Conversation.findByIdAndUpdate(conversationId, { 
                updatedAt: Date.now() 
            });

            // C. Emit the message to everyone in the room (the two participants)
            io.to(conversationId).emit("message_received", newMessage);
            
        } catch (error) {
            console.error("Socket Logic Error:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("❌ User Disconnected");
    });
});

// 8. CRITICAL: Start the SERVER, not the APP
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server & Real-time Protocol running on port ${PORT}`);
});