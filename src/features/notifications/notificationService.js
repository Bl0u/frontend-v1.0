import axios from 'axios';
import { API_BASE_URL } from '../../config';

const API_URL = `${API_BASE_URL}/api/notifications/`;

const getNotifications = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const markAsRead = async (id, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}${id}/read`, {}, config);
    return response.data;
};

const notificationService = {
    getNotifications,
    markAsRead
};

export default notificationService;
