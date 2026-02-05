import axios from 'axios';

const API_URL = 'http://localhost:5000/api/plans';

// Create a new plan
const createPlan = async (menteeId, data, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.post(API_URL, { menteeId, ...data }, config);
    return response.data;
};

// Add a new version to existing plan
const addVersion = async (planId, data, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.put(`${API_URL}/${planId}/version`, data, config);
    return response.data;
};

// Get plan by ID
const getPlan = async (planId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(`${API_URL}/${planId}`, config);
    return response.data;
};

// Get plan by mentor-mentee pair
const getPlanByPair = async (menteeId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.get(`${API_URL}/pair/${menteeId}`, config);
    return response.data;
};

// Add comment to a version
const addComment = async (planId, versionIdx, data, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.post(`${API_URL}/${planId}/version/${versionIdx}/comment`, data, config);
    return response.data;
};

// Edit an existing version
const editVersion = async (planId, versionIdx, data, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.put(`${API_URL}/${planId}/version/${versionIdx}`, data, config);
    return response.data;
};

// Delete a version
const deleteVersion = async (planId, versionIdx, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    };
    const response = await axios.delete(`${API_URL}/${planId}/version/${versionIdx}`, config);
    return response.data;
};

const planService = {
    createPlan,
    addVersion,
    getPlan,
    getPlanByPair,
    addComment,
    editVersion,
    deleteVersion
};

export default planService;
