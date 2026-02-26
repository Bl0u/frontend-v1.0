import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

import TagInput from './TagInput';
import SocialLinksManager from './SocialLinksManager';

const TOPICS = [
    { id: 'core', label: 'Core Identity', icon: '👤' },
    { id: 'needs', label: 'Partner Needs', icon: '🤝' },
    { id: 'logistics', label: 'Logistics', icon: '📍' },
    { id: 'availability', label: 'Availability', icon: '⏰' },
    { id: 'style', label: 'Style', icon: '⚡' }
];

const StudentProfileForm = ({ user, initialData, refreshProfile }) => {
    const [activeTopic, setActiveTopic] = useState('core');
    const [formData, setFormData] = useState({
        // 1️⃣ Core Identity
        name: '',
        username: '',
        major: '',
        academicLevel: '',
        university: '',
        bio: '',
        socialLinks: [],
        // 2️⃣ Partner Needs
        partnerType: '',
        matchingGoal: '',
        topics: [],
        neededFromPartner: '',
        // 3️⃣ Location & Logistics
        timezone: '',
        languages: [],
        studyMode: '',
        preferredTools: [],
        // 4️⃣ Availability & Commitment
        availabilityDays: [],
        availabilityTimeRanges: [],
        commitmentLevel: '',
        // 5️⃣ Style & Offsets
        sessionsPerWeek: '',
        sessionLength: '',
        pace: '',
        canOffer: '',
        // Common/Matching
        lookingForPartner: false,
        skills: [],
        interests: []
    });

    const availableDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeRanges = ['Morning', 'Afternoon', 'Evening', 'Night'];

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                username: initialData.username || '',
                major: initialData.major || '',
                academicLevel: initialData.academicLevel || '',
                university: initialData.university || '',
                bio: initialData.bio || initialData.studyNote || '',
                socialLinks: initialData.socialLinks || [],
                partnerType: initialData.partnerType || '',
                matchingGoal: initialData.matchingGoal || initialData.primaryStudyGoal || '',
                topics: initialData.topics || [],
                neededFromPartner: initialData.neededFromPartner || '',
                timezone: initialData.timezone || '',
                languages: initialData.languages || [],
                studyMode: initialData.studyMode || '',
                preferredTools: initialData.preferredTools || [],
                availabilityDays: initialData.availability?.days || [],
                availabilityTimeRanges: initialData.availability?.timeRanges || [],
                commitmentLevel: initialData.commitmentLevel || '',
                sessionsPerWeek: initialData.sessionsPerWeek || '',
                sessionLength: initialData.sessionLength || '',
                pace: initialData.pace || '',
                canOffer: initialData.canOffer || '',
                lookingForPartner: initialData.lookingForPartner || false,
                skills: initialData.skills || [],
                interests: initialData.interests || []
            });
        }
    }, [initialData]);

    const onChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData((prev) => ({ ...prev, [e.target.name]: value }));
    };

    const handleDayToggle = (day) => {
        setFormData(prev => ({
            ...prev,
            availabilityDays: prev.availabilityDays.includes(day)
                ? prev.availabilityDays.filter(d => d !== day)
                : [...prev.availabilityDays, day]
        }));
    };

    const handleTimeToggle = (time) => {
        setFormData(prev => ({
            ...prev,
            availabilityTimeRanges: prev.availabilityTimeRanges.includes(time)
                ? prev.availabilityTimeRanges.filter(t => t !== time)
                : [...prev.availabilityTimeRanges, time]
        }));
    };

    // Tag Handlers
    const setTopics = (tags) => setFormData(prev => ({ ...prev, topics: tags }));
    const setPreferredTools = (tags) => setFormData(prev => ({ ...prev, preferredTools: tags }));
    const setLanguages = (tags) => setFormData(prev => ({ ...prev, languages: tags }));
    const setSkills = (tags) => setFormData(prev => ({ ...prev, skills: tags }));
    const setInterests = (tags) => setFormData(prev => ({ ...prev, interests: tags }));
    const setSocialLinks = (links) => setFormData(prev => ({ ...prev, socialLinks: links }));

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            const payload = {
                ...formData,
                availability: {
                    days: formData.availabilityDays,
                    timeRanges: formData.availabilityTimeRanges
                }
            };

            await axios.put(`${API_BASE_URL}/api/users/profile`, payload, config);
            toast.success('Profile updated successfully!');
            if (refreshProfile) refreshProfile();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    const renderCoreIdentity = () => (
        <div className="space-y-6 animate-fadeIn">
            <h4 className="text-xl font-bold text-blue-800 border-b pb-2">👤 Core Identity</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Display Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={onChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Username</label>
                    <input type="text" name="username" value={formData.username} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-gray-50 cursor-not-allowed" readOnly />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Major / Field *</label>
                    <input type="text" name="major" value={formData.major} onChange={onChange} placeholder="e.g. Computer Science" className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Academic Level *</label>
                    <select name="academicLevel" value={formData.academicLevel} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white" required>
                        <option value="">Select Level</option>
                        <option value="Level 1">Level 1</option>
                        <option value="Level 2">Level 2</option>
                        <option value="Level 3">Level 3</option>
                        <option value="Level 4">Level 4</option>
                        <option value="Graduated">Graduated</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1">University / Faculty *</label>
                    <input type="text" name="university" value={formData.university} onChange={onChange} placeholder="e.g. Cairo University - Faculty of Engineering" className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1">Short Bio (Max 200 chars)</label>
                    <textarea name="bio" value={formData.bio} onChange={onChange} maxLength={200} placeholder="Tell us a bit about yourself..." className="w-full px-3 py-2 border rounded-lg h-24 resize-none" />
                    <p className="text-right text-xs text-gray-500 mt-1">{formData.bio.length}/200</p>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">Social / Professional Links</label>
                    <SocialLinksManager links={formData.socialLinks} onChange={setSocialLinks} />
                </div>
            </div>
        </div>
    );

    const renderPartnerNeeds = () => (
        <div className="space-y-6 animate-fadeIn">
            <h4 className="text-xl font-bold text-indigo-800 border-b pb-2">🤝 Partner Needs</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Partner Type *</label>
                    <select name="partnerType" value={formData.partnerType} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white" required>
                        <option value="">Select Type</option>
                        <option value="peer">Peer (Studying cùng)</option>
                        <option value="project teammate">Project Teammate</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Primary Goal *</label>
                    <input type="text" name="matchingGoal" value={formData.matchingGoal} onChange={onChange} placeholder="e.g. Finish Senior Project" className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1">Topics / Tags (Required) *</label>
                    <TagInput tags={formData.topics} setTags={setTopics} placeholder="Add topics (e.g. Web Dev, Calculus, AI)..." />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1">What do you need from a partner?</label>
                    <textarea name="neededFromPartner" value={formData.neededFromPartner} onChange={onChange} placeholder="Describe specific skills or traits you seek..." className="w-full px-3 py-2 border rounded-lg h-24 resize-none" />
                </div>
            </div>
        </div>
    );

    const renderLogistics = () => (
        <div className="space-y-6 animate-fadeIn">
            <h4 className="text-xl font-bold text-green-800 border-b pb-2">📍 Location & Logistics</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Timezone *</label>
                    <input type="text" name="timezone" value={formData.timezone} onChange={onChange} placeholder="e.g. GMT+2, Cairo Time" className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Languages *</label>
                    <TagInput tags={formData.languages} setTags={setLanguages} placeholder="English, Arabic, etc." />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Study Mode *</label>
                    <select name="studyMode" value={formData.studyMode} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white" required>
                        <option value="">Select Mode</option>
                        <option value="Online">Online</option>
                        <option value="In-person">In-person</option>
                        <option value="Hybrid">Hybrid</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Preferred Tools</label>
                    <TagInput tags={formData.preferredTools} setTags={setPreferredTools} placeholder="Zoom, Discord, Slack..." />
                </div>
            </div>
        </div>
    );

    const renderAvailability = () => (
        <div className="space-y-6 animate-fadeIn">
            <h4 className="text-xl font-bold text-orange-800 border-b pb-2">⏰ Availability & Commitment</h4>
            <div className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Available Days *</label>
                    <div className="flex flex-wrap gap-2">
                        {availableDays.map(day => (
                            <button type="button" key={day} onClick={() => handleDayToggle(day)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${formData.availabilityDays.includes(day) ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'}`}>
                                {day}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Time Ranges *</label>
                    <div className="flex flex-wrap gap-2">
                        {timeRanges.map(time => (
                            <button type="button" key={time} onClick={() => handleTimeToggle(time)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${formData.availabilityTimeRanges.includes(time) ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'}`}>
                                {time}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Commitment Level *</label>
                    <select name="commitmentLevel" value={formData.commitmentLevel} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white" required>
                        <option value="">Select Level</option>
                        <option value="Casual">Casual</option>
                        <option value="Balanced">Balanced</option>
                        <option value="Heavy">Heavy (Intensive)</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const renderStyle = () => (
        <div className="space-y-6 animate-fadeIn">
            <h4 className="text-xl font-bold text-purple-800 border-b pb-2">⚡ Style & Offsets</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Sessions / Week *</label>
                    <input type="number" name="sessionsPerWeek" value={formData.sessionsPerWeek} onChange={onChange} min="1" max="7" className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Session Length *</label>
                    <input type="text" name="sessionLength" value={formData.sessionLength} onChange={onChange} placeholder="e.g. 1-2 hours" className="w-full px-3 py-2 border rounded-lg" required />
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-1">Study Pace</label>
                    <select name="pace" value={formData.pace} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white">
                        <option value="">Select Pace</option>
                        <option value="Slow & deep">Slow & deep</option>
                        <option value="Balanced">Balanced</option>
                        <option value="Fast">Fast & focused</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-1">"I Can Offer" (Skills/Help)</label>
                    <textarea name="canOffer" value={formData.canOffer} onChange={onChange} placeholder="How can you help your partner? (e.g. React help, Math tutoring)..." className="w-full px-3 py-2 border rounded-lg h-24 resize-none" />
                </div>
            </div>
        </div>
    );

    const renderActiveSubForm = () => {
        switch (activeTopic) {
            case 'core': return renderCoreIdentity();
            case 'needs': return renderPartnerNeeds();
            case 'logistics': return renderLogistics();
            case 'availability': return renderAvailability();
            case 'style': return renderStyle();
            default: return renderCoreIdentity();
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            {/* Topic Navigation Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
                {TOPICS.map((topic) => (
                    <button
                        key={topic.id}
                        type="button"
                        onClick={() => setActiveTopic(topic.id)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${activeTopic === topic.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105'
                            : 'bg-white text-gray-600 border-gray-100 hover:border-blue-200 hover:bg-blue-50'
                            }`}
                    >
                        <span className="text-2xl mb-2">{topic.icon}</span>
                        <span className="text-xs font-bold uppercase tracking-wider">{topic.label}</span>
                    </button>
                ))}
            </div>

            {/* Sub-form Content */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[400px]">
                {renderActiveSubForm()}
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 mt-6 border-t">
                <div className="flex items-center gap-3">
                    <input type="checkbox" name="lookingForPartner" checked={formData.lookingForPartner} onChange={onChange} className="w-5 h-5 accent-blue-600" id="lookingForPartner" />
                    <label htmlFor="lookingForPartner" className="text-blue-800 font-bold">Actively seeking a partner</label>
                </div>
                <button type="submit" className="w-full md:w-auto bg-blue-600 text-white font-bold py-3 px-12 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 active:scale-95">
                    Save Changes
                </button>
            </div>
        </form>
    );
};

export default StudentProfileForm;
