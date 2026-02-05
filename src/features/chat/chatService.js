import axios from 'axios';

const API_URL = 'http://localhost:5000/api/chat/';

// Get recent chats
const getRecentChats = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(API_URL + 'recent', config);
    return response.data;
};

// Get messages history
const getMessages = async (targetUserId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(API_URL + targetUserId, config);
    return response.data;
};

// Send message
const sendMessage = async (receiverId, content, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(API_URL, { receiverId, content }, config);
    return response.data;
};

// Get unread count
const getUnreadCount = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(API_URL + 'unread', config);
    return response.data;
};

const chatService = {
    getRecentChats,
    getMessages,
    sendMessage,
    getUnreadCount
};

export default chatService;
