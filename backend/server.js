const express = require('express');

const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');

const app = express();

app.set('trust proxy', true); // Important for correct client IP detection behind proxies/load balancers

const cors = require('cors');
const http = require('http'); // 1. Native Node HTTP module
const { Server } = require('socket.io'); // 2. Socket.io Server
const connectDB = require('./config/db');
const dotenv = require('dotenv');


// Load Models (Required for Socket persistence)
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');

dotenv.config();

// Import Rate Limiter Middleware
const { rateLimit } = require('./middleware/rateLimitor');
const redisClient = require('./config/redis');

// User Defined Routes
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const chatBotRoutes = require('./routes/chatBotRoutes');
const chatRoutes = require('./routes/chatRoutes'); // 3. new 1-1 Chat Routes
const { protect } = require('./middleware/authMiddleware');

const { notificationQueue } = require('./queues/emailQueue');

const { schedulePickupAndReturnTasks } = require('./jobs/cronSchedulers');


require('./workers/emailWorker'); // Start the email worker when the server starts

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// --- TOKEN BUCKET RATE LIMITING ---
app.use(rateLimit({
   capacity: 10,
   refillRate: 1 // 1 token per second
}));

schedulePickupAndReturnTasks();

// --- BULL BOARD SETUP ---
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
    queues: [new BullMQAdapter(notificationQueue)],
    serverAdapter: serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());

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

        // A. RATE LIMITING LOGIC (Bucket-based using Redis)
        try {

            const userId = socket.id;

            const key = `socket_bucket:${userId}`;

            const currentTime =
                Math.floor(Date.now() / 1000);

            let bucket =
                await redisClient.get(key);

            bucket = bucket
                ? JSON.parse(bucket)
                : {
                    tokens: 5,
                    lastRefill: currentTime
                };

            const elapsedTime =
                currentTime - bucket.lastRefill;

            // Refill 1 token/sec
            const refill = elapsedTime * 1;

            bucket.tokens = Math.min(
                5,
                bucket.tokens + refill
            );

            bucket.lastRefill = currentTime;

            // No tokens left
            if (bucket.tokens < 1) {

                socket.emit('rate_limit', {
                    message: 'Too many messages. Slow down.'
                });

                return;
            }

            // Consume token
            bucket.tokens -= 1;

            await redisClient.set(
                key,
                JSON.stringify(bucket),
                {
                    EX: 10
                }
            );

            // Send message
            io.to(data.roomId)
              .emit('receive_message', data);

        } catch (error) {

            console.error(error);
        }

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