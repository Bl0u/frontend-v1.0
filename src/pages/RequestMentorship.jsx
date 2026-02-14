import { useState, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const RequestMentorship = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        projectTitle: '',
        description: '',
        isPublic: true,
    });

    const { projectTitle, description, isPublic } = formData;

    const onChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!projectTitle || !description) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.post(`${API_BASE_URL}/api/mentorship`, formData, config);
            toast.success('Mentorship request submitted!');
            navigate('/');
        } catch (error) {
            toast.error('Failed to submit request');
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Request Mentorship</h1>
            <p className="mb-6 text-gray-600">
                Describe your project and what kind of help you need. Mentors will review your request.
            </p>

            <form onSubmit={onSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Project Title</label>
                    <input
                        type="text"
                        name="projectTitle"
                        value={projectTitle}
                        onChange={onChange}
                        className="w-full px-3 py-2 border rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="e.g., AI-Powered Recycling App"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Description & Needs</label>
                    <textarea
                        name="description"
                        value={description}
                        onChange={onChange}
                        rows="6"
                        className="w-full px-3 py-2 border rounded-lg focus:border-blue-500 focus:outline-none"
                        placeholder="Detailed description of your project and what you need mentorship for..."
                    ></textarea>
                </div>
                <div className="mb-6 flex items-center">
                    <input
                        type="checkbox"
                        name="isPublic"
                        checked={isPublic}
                        onChange={onChange}
                        className="w-5 h-5 text-blue-600"
                    />
                    <label className="ml-2 text-gray-700">Allow mentors to find this request publicly</label>
                </div>
                <button
                    type="submit"
                    className="bg-purple-600 text-white font-bold py-2 px-6 rounded hover:bg-purple-700 transition"
                >
                    Submit Request
                </button>
            </form>
        </div>
    );
};

export default RequestMentorship;
