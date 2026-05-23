const User = require('../models/User'); 
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// 1. Handshake: Get or Create a 1-1 Chat
const accessChat = async (req, res) => {
    const { userId } = req.body; 
    
    if (!userId) return res.status(400).send("User ID param not sent with request");
    console.log("Accessing chat with user ID:", userId);

    try {
        console.log("Logged-in User (from middleware):", req.user ? req.user._id : "UNDEFINED");
        // Look for a chat where BOTH current user and target user exist
        let chat = await Conversation.findOne({
            participants: { $all: [req.user._id, userId] }
        })
        .populate("participants", "name email hostel") // Get user details
        .populate("lastMessage");

        console.log("Checkpoint 3: Query finished. Chat found?", !!chat);

        if (chat) {
            res.status(200).send(chat);
        } else {
            console.log("Checkpoint 4: No chat found. Creating new conversation...");
            // Create a brand new private channel
            const newChat = await Conversation.create({
                participants: [req.user._id, userId]
            });

            console.log("Checkpoint 5: New Chat Created ID:", newChat._id);

            const fullChat = await Conversation.findOne({ _id: newChat._id })
                .populate("participants", "name email hostel");

            console.log("Checkpoint 6: Full Chat with Participants:", fullChat);
            
            res.status(200).send(fullChat);
        }
    } catch (error) {
        console.error("❌ CRITICAL ERROR IN ACCESSCHAT:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// 2. Fetch all Conversations for the Sidebar (The WhatsApp List)
const getConversations = async (req, res) => {
    try {
        // Find all chats where the logged-in user is a participant
        const chats = await Conversation.find({
            participants: { $in: [req.user._id] }
        })
        .populate("participants", "name email hostel")
        .populate("lastMessage")
        .sort({ updatedAt: -1 }); // Show most recent chats at the top

        // console.log(`Fetched ${chats}`);

        res.status(200).send(chats);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch inbox archives." });
    }
};

// 3. Fetch Message History for a specific chat
const getMessages = async (req, res) => {
    try {
        // DEBUG LOG: Check what the backend is actually receiving
        console.log("Fetching history for Room ID:", req.params.conversationId);

        if (!req.params.conversationId) {
            return res.status(400).json({ message: "Error: No conversation ID provided." });
        }

        const messages = await Message.find({ 
            conversationId: req.params.conversationId 
        })
        .populate("sender", "name email")
        .sort({ createdAt: 1 });

        // DEBUG LOG: How many messages did it find?
        console.log(`Found ${messages.length} messages in database.`);

        res.status(200).json(messages);
    } catch (error) {
        console.error("History Fetch Error:", error);
        res.status(500).json({ message: "Protocol history corrupted." });
    }
};

module.exports = {
    accessChat,
    getConversations,
    getMessages
}