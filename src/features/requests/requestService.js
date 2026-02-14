import axios from 'axios';

import { API_BASE_URL } from '../../config';

const API_URL = `${API_BASE_URL}/api/requests/`;


// Send Request (Book or Match or Public Pitch)
const sendRequest = async (receiverId, type, message, token, pitch = null, isPublic = false) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(API_URL, { receiverId, type, message, pitch, isPublic }, config);
    return response.data;
};

// Get Received Requests (Private)
const getReceivedRequests = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(API_URL + 'received', config);
    return response.data;
};

// Get Sent Requests (Private)
const getSentRequests = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(API_URL + 'sent', config);
    return response.data;
};

// Get Public Pitches (Pitch Hub)
const getPublicPitches = async () => {
    const response = await axios.get(API_URL + 'public');
    return response.data;
};

// Claim a Public Pitch
const claimPublicPitch = async (pitchId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.put(API_URL + `${pitchId}/claim`, {}, config);
    return response.data;
};

// Respond to Request
const respondToRequest = async (requestId, status, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.put(API_URL + `${requestId}/respond`, { status }, config);
    return response.data;
};

// Cancel/Delete Request
const cancelRequest = async (requestId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.delete(API_URL + requestId, config);
    return response.data;
};

// End Relationship (Mentorship or Partner)
const endRelationship = async (targetUserId, type, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.put(API_URL + 'relationship/end', { targetUserId, type }, config);
    return response.data;
};

// Mark Notification as Read
const markAsRead = async (requestId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.delete(API_URL + `${requestId}/read`, config);
    return response.data;
};

// Check Connection
const checkConnection = async (userId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(API_URL + `check/${userId}`, config);
    return response.data;
};

const requestService = {
    sendRequest,
    getReceivedRequests,
    getSentRequests,
    getPublicPitches,
    claimPublicPitch,
    respondToRequest,
    cancelRequest,
    markAsRead,
    endRelationship,
    checkConnection
};

export default requestService;
