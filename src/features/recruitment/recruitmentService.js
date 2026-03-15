import axios from 'axios';
import { API_BASE_URL } from '../../config';

const API_URL = `${API_BASE_URL}/api/recruitment`;

// Submit application
const submitApplication = async (applicationData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.post(API_URL, applicationData, config);
    return response.data;
};

// Get my applications
const getMyApplications = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const response = await axios.get(`${API_URL}/me`, config);
    return response.data;
};

const recruitmentService = {
    submitApplication,
    getMyApplications
};

export default recruitmentService;
