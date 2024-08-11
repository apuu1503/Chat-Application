import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chatbot.css';

const socket = io('http://localhost:5000');

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [roomId, setRoomId] = useState('');
    const [currentRoom, setCurrentRoom] = useState('');
    const [userId, setUserId] = useState(''); // User ID for current user

    useEffect(() => {
        // Generate a unique ID for this user
        const id = generateUniqueUserId();
        setUserId(id);

        socket.on('receiveMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    useEffect(() => {
        if (currentRoom) {
            socket.emit('joinRoom', currentRoom, (response) => {
                if (response.status !== 'ok') {
                    alert(response.message);
                }
            });
        }
    }, [currentRoom]);

    const sendMessage = () => {
        if (input.trim() && currentRoom) {
            const newMessage = {
                text: input,
                timestamp: new Date(),
                senderId: userId, // Attach user ID to the message
            };
            socket.emit('sendMessage', currentRoom, newMessage);
            setInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const createRoom = () => {
        socket.emit('createRoom', (newRoomId) => {
            setCurrentRoom(newRoomId);
            setRoomId(newRoomId);
        });
    };

    const joinRoom = () => {
        if (roomId) {
            setCurrentRoom(roomId);
        }
    };

    const copyRoomId = () => {
        navigator.clipboard.writeText(roomId).then(() => {
            alert('Room ID copied to clipboard!');
        });
    };

    const formatTime = (date) => {
        return ` ${date.toLocaleTimeString()}`;
    };

    const formatDate = (date) => {
        return date.toLocaleDateString();
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Chat Interface</h2>
                {!currentRoom && (
                    <div>
                        <button onClick={createRoom}>Create Room</button>
                        <input
                            type="text"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            placeholder="Enter room ID to join"
                        />
                        <button onClick={joinRoom}>Join Room</button>
                    </div>
                )}
                {currentRoom && (
                    <div>
                        <p>Room ID: {roomId}</p>
                        <button onClick={copyRoomId}>Copy Room ID</button>
                    </div>
                )}
            </div>
            <div className="chat-messages">
                {messages.map((msg, index) => {
                    const showDate =
                        index === 0 ||
                        formatDate(new Date(msg.timestamp)) !==
                        formatDate(new Date(messages[index - 1].timestamp));

                    return (
                        <div className='date-chat' key={index} >
                            {showDate && (
                                <div>{formatDate(new Date(msg.timestamp))}</div>
                            )}
                        </div>
                    );
                })}
                {messages.map((msg, index) => {
                   
                    return (
                        <div
                            key={index}
                            className={`chat-message ${msg.senderId === userId ? 'my-message' : 'other-message'}`}
                        >
                            <div className="message-text">{msg.text}</div>
                            <div className="message-timestamp">{formatTime(new Date(msg.timestamp))}</div>
                        </div>
                    );
                })}
            </div>
            {currentRoom && (
                <div className="chat-input">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            )}
        </div>
    );
};

// Utility function to generate a unique user ID
const generateUniqueUserId = () => {
    return 'user_' + Math.random().toString(36).substr(2, 9);
};

export default Chatbot;
