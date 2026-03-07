import axios from 'axios';
import { API_BASE_URL } from '../../config';

const API_URL = `${API_BASE_URL}/api/testimonials/`;

// Get all approved testimonials
const getTestimonials = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Add a testimonial
const addTestimonial = async (testimonialData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, testimonialData, config);
    return response.data;
};

const testimonialService = {
    getTestimonials,
    addTestimonial,
};

export default testimonialService;
