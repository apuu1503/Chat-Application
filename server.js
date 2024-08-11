const io = require('socket.io')(5000, {
    cors: {
        origin: "http://localhost:3000", // Replace with your frontend URL
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
const { v4: uuidv4 } = require('uuid');

// Function to generate a unique user ID
const generateUniqueUserId = () => {
    return uuidv4(); // Generates a unique ID
};

// Function to generate a unique room ID
const generateUniqueRoomId = () => {
    return uuidv4(); // Generates a unique ID for the room
};

const users = {}; // Store user IDs

io.on('connection', (socket) => {
    const userId = generateUniqueUserId(); // Generate unique user ID for each connection
    users[socket.id] = userId;

    socket.on('createRoom', (callback) => {
        const roomId = generateUniqueRoomId(); // Generate unique room ID
        socket.join(roomId);
        callback(roomId);
    });

    socket.on('joinRoom', (roomId, callback) => {
        if (io.sockets.adapter.rooms.get(roomId)) {
            socket.join(roomId);
            callback({ status: 'ok' });
        } else {
            callback({ status: 'error', message: 'Room does not exist' });
        }
    });

    socket.on('sendMessage', (roomId, message) => {
        message.senderId = users[socket.id]; // Attach user ID to the message
        console.log('Server Sending Message:', message); // Log message on the server
        io.to(roomId).emit('receiveMessage', message);
    });


    socket.on('disconnect', () => {
        delete users[socket.id]; // Clean up on disconnect
    });
});
