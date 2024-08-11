// // routes/rooms.js
// const express = require('express');
// const Room = require('../models/Room');
// const User = require('../models/User');

// const router = express.Router();

// router.post('/create', async (req, res) => {
//     const { participantIds } = req.body;
//     const room = new Room({ participants: participantIds });
//     await room.save();
//     res.json({ roomId: room._id });
// });

// router.get('/search', async (req, res) => {
//     const { query } = req.query;
//     const users = await User.find({ $or: [{ name: new RegExp(query, 'i') }, { username: new RegExp(query, 'i') }] });
//     res.json(users);
// });

// module.exports = router;
