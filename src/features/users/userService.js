import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users/';

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

const userService = {
    getUsers,
    getUserById
};

export default userService;
