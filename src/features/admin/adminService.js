import axios from 'axios';
import { API_BASE_URL } from '../../config';

const getConfig = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

// Overview
const getStats = async (token) => {
    const res = await axios.get(`${API_BASE_URL}/api/admin/stats`, getConfig(token));
    return res.data;
};

// Users
const getUsers = async (token, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await axios.get(`${API_BASE_URL}/api/admin/users?${query}`, getConfig(token));
    return res.data;
};

const getUserDetails = async (token, userId) => {
    const res = await axios.get(`${API_BASE_URL}/api/admin/users/${userId}`, getConfig(token));
    return res.data;
};

const deleteUser = async (token, userId) => {
    const res = await axios.delete(`${API_BASE_URL}/api/admin/users/${userId}`, getConfig(token));
    return res.data;
};

const toggleBan = async (token, userId) => {
    const res = await axios.put(`${API_BASE_URL}/api/admin/users/${userId}/ban`, {}, getConfig(token));
    return res.data;
};

const adjustStars = async (token, userId, amount) => {
    const res = await axios.put(`${API_BASE_URL}/api/admin/users/${userId}/stars`, { amount }, getConfig(token));
    return res.data;
};

// Threads
const getThreads = async (token, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await axios.get(`${API_BASE_URL}/api/admin/threads?${query}`, getConfig(token));
    return res.data;
};

const deleteThread = async (token, threadId) => {
    const res = await axios.delete(`${API_BASE_URL}/api/admin/threads/${threadId}`, getConfig(token));
    return res.data;
};

// Reports
const getReports = async (token, status) => {
    const query = status ? `?status=${status}` : '';
    const res = await axios.get(`${API_BASE_URL}/api/admin/reports${query}`, getConfig(token));
    return res.data;
};

const updateReport = async (token, reportId, data) => {
    const res = await axios.put(`${API_BASE_URL}/api/admin/reports/${reportId}`, data, getConfig(token));
    return res.data;
};

// Payments
const getPayments = async (token, params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await axios.get(`${API_BASE_URL}/api/admin/payments?${query}`, getConfig(token));
    return res.data;
};

// Recruitment
const getRecruitment = async (token, status) => {
    const query = status ? `?status=${status}` : '';
    const res = await axios.get(`${API_BASE_URL}/api/admin/recruitment${query}`, getConfig(token));
    return res.data;
};

const updateRecruitment = async (token, applicationId, status) => {
    const res = await axios.put(`${API_BASE_URL}/api/admin/recruitment/${applicationId}`, { status }, getConfig(token));
    return res.data;
};

const resetDatabase = async (token) => {
    const res = await axios.delete(`${API_BASE_URL}/api/admin/reset`, {
        ...getConfig(token),
        data: { confirmation: 'RESET_EVERYTHING' }
    });
    return res.data;
};

const promoteUser = async (token, userId, data) => {
    const res = await axios.put(`${API_BASE_URL}/api/admin/users/${userId}/promote`, data, getConfig(token));
    return res.data;
};

// Pitch Hub Config
const getPitchConfig = async (token) => {
    const res = await axios.get(`${API_BASE_URL}/api/admin/pitch-config`, getConfig(token));
    return res.data;
};

const updatePitchConfig = async (token, configData) => {
    const res = await axios.put(`${API_BASE_URL}/api/admin/pitch-config`, configData, getConfig(token));
    return res.data;
};

// Pitch Management
const getPitches = async (token) => {
    const res = await axios.get(`${API_BASE_URL}/api/admin/pitches`, getConfig(token));
    return res.data;
};

const deletePitch = async (token, pitchId) => {
    const res = await axios.delete(`${API_BASE_URL}/api/admin/pitches/${pitchId}`, getConfig(token));
    return res.data;
};

// Communities
const getCommunities = async (token) => {
    const res = await axios.get(`${API_BASE_URL}/api/admin/communities`, getConfig(token));
    return res.data;
};

const createCommunity = async (token, data) => {
    const res = await axios.post(`${API_BASE_URL}/api/admin/communities`, data, getConfig(token));
    return res.data;
};

const deleteCommunity = async (token, commId) => {
    const res = await axios.delete(`${API_BASE_URL}/api/admin/communities/${commId}`, getConfig(token));
    return res.data;
};

const updateCommunity = async (token, commId, data) => {
    const res = await axios.put(`${API_BASE_URL}/api/admin/communities/${commId}`, data, getConfig(token));
    return res.data;
};

const updateGroup = async (token, groupId, data) => {
    const res = await axios.put(`${API_BASE_URL}/api/admin/communities/groups/${groupId}`, data, getConfig(token));
    return res.data;
};

const runHubGenerator = async (token) => {
    const res = await axios.post(`${API_BASE_URL}/api/admin/communities/generator`, {}, getConfig(token));
    return res.data;
};

const assignHubMod = async (token, hubId, userId) => {
    const res = await axios.put(`${API_BASE_URL}/api/admin/communities/${hubId}/moderators`, { userId }, getConfig(token));
    return res.data;
};

const assignGroupMod = async (token, groupId, userId) => {
    const res = await axios.put(`${API_BASE_URL}/api/admin/groups/${groupId}/moderators`, { userId }, getConfig(token));
    return res.data;
};

const deleteGroupAsAdmin = async (token, communityId, groupId) => {
    const res = await axios.delete(`${API_BASE_URL}/api/admin/communities/${communityId}/groups/${groupId}`, getConfig(token));
    return res.data;
};

const seedTestPersonnel = async (token) => {
    const res = await axios.post(`${API_BASE_URL}/api/admin/seed`, {}, getConfig(token));
    return res.data;
};

const adminService = {
    getStats,
    getUsers,
    getUserDetails,
    deleteUser,
    toggleBan,
    adjustStars,
    getThreads,
    deleteThread,
    getReports,
    updateReport,
    getPayments,
    getRecruitment,
    updateRecruitment,
    resetDatabase,
    promoteUser,
    getPitchConfig,
    updatePitchConfig,
    getPitches,
    deletePitch,
    getCommunities,
    createCommunity,
    deleteCommunity,
    updateCommunity,
    updateGroup,
    runHubGenerator,
    assignHubMod,
    assignGroupMod,
    deleteGroupAsAdmin,
    seedTestPersonnel
};

export default adminService;
