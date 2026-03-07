import axios from 'axios';

import { API_BASE_URL } from '../../config';

const API_URL = `${API_BASE_URL}/api/users/`;


// Get all users (supports filters like role, search=username)
const getUsers = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await axios.get(API_URL + '?' + params);
    return response.data;
};

// Get user by ID
const getUserById = async (userId) => {
    const response = await axios.get(API_URL + userId);
    return response.data;
};

// Block User
const blockUser = async (userId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(API_URL + `block/${userId}`, {}, config);
    return response.data;
};

// Unblock User
const unblockUser = async (userId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.delete(API_URL + `block/${userId}`, config);
    return response.data;
};

const getUniquePartnerFilters = async () => {
    const response = await axios.get(`${API_BASE_URL}/api/users/filters`);
    return response.data;
};

const userService = {
    getUsers,
    getUserById,
    blockUser,
    unblockUser,
    getUniquePartnerFilters
};

export default userService;
