import axios from 'axios';

import { API_BASE_URL } from '../../config';

const API_URL = `${API_BASE_URL}/api/resources/`;


// Get all threads
const getThreads = async (params = {}) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
};

// Create a thread
const createThread = async (threadData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        },
    };
    const response = await axios.post(API_URL + 'thread', threadData, config);
    return response.data;
};

// Get thread detail
const getThreadDetail = async (id, token = null) => {
    const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
    } : {};
    const response = await axios.get(API_URL + `thread/${id}`, config);
    return response.data;
};

// Add post
const addPost = async (threadId, postData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        },
    };
    const response = await axios.post(API_URL + `thread/${threadId}/post`, postData, config);
    return response.data;
};

// Toggle upvote
const toggleUpvote = async (postId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.put(API_URL + `post/${postId}/upvote`, {}, config);
    return response.data;
};

// Update thread
const updateThread = async (id, threadData, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.put(API_URL + `thread/${id}`, threadData, config);
    return response.data;
};

// Delete thread
const deleteThread = async (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.delete(API_URL + `thread/${id}`, config);
    return response.data;
};

// Add moderator
const addModerator = async (id, username, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(API_URL + `thread/${id}/moderator`, { username }, config);
    return response.data;
};

// Delete post
const deletePost = async (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.delete(API_URL + `post/${id}`, config);
    return response.data;
};

// Toggle GUIDE vote
const toggleGuideVote = async (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.put(API_URL + `thread/${id}/guide`, {}, config);
    return response.data;
};

// Acknowledge instructions
const acknowledgeInstructions = async (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(API_URL + `thread/${id}/acknowledge`, {}, config);
    return response.data;
};

const updateInstructions = async (id, instructions, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.put(API_URL + `thread/${id}/instructions`, { instructions }, config);
    return response.data;
};


// Request review
const requestReview = async (postId, notes, alertTargets, specificUsername, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(API_URL + `post/${postId}/review`, { notes, alertTargets, specificUsername }, config);
    return response.data;
};

const removeModerator = async (id, userId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.delete(API_URL + `thread/${id}/moderator/${userId}`, config);
    return response.data;
};

// V2.0: Purchase Thread
const purchaseThread = async (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(API_URL + `thread/${id}/purchase`, {}, config);
    return response.data;
};

// V2.0: Update Thread Price
const updateThreadPrice = async (id, priceData, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.put(API_URL + `thread/${id}/price`, priceData, config);
    return response.data;
};

const resourceService = {
    getThreads,
    createThread,
    getThreadDetail,
    updateThread,
    deleteThread,
    addModerator,
    removeModerator,
    deletePost,
    toggleUpvote,
    addPost,
    toggleGuideVote,
    requestReview,
    acknowledgeInstructions,
    updateInstructions,
    purchaseThread, // V2.0
    updateThreadPrice, // V2.0
};

export default resourceService;
