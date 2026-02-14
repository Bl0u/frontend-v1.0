import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

import TagInput from './TagInput';
import SocialLinksManager from './SocialLinksManager';

const STUDY_GOALS = [
    'Exam preparation', 'Assignments', 'Concept mastery', 'Catching up',
    'Grade improvement', 'Interview preparation', 'Internship preparation',
    'Field-specific learning', 'Language learning'
];

const StudentProfileForm = ({ user, initialData, refreshProfile }) => {
    const [formData, setFormData] = useState({
        // Identity & Academic Context
        name: '',
        username: '',
        major: '',
        academicLevel: '',
        university: '',
        socialLinks: [],
        // Current Academic Context
        currentCourses: [],
        // Study Intent
        primaryStudyGoal: '',
        secondaryStudyGoal: '',
        fieldSpecificDetails: '',
        // Study Style
        preferredStudyStyle: '',
        studyPacePreference: '',
        // Logistics
        availabilityDays: [],
        availabilityTimeRanges: [],
        studyMode: '',
        preferredTools: [],
        // Communication & Commitment
        communicationStyle: '',
        commitmentLevel: '',
        // Language & Accessibility
        languages: [],
        accessibilityPreferences: '',
        // Learning Compatibility
        learningTraits: [],
        // Study Note
        studyNote: '',
        // Matching
        lookingForPartner: false,
        // Common
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
                socialLinks: initialData.socialLinks || [],
                currentCourses: initialData.currentCourses || [],
                primaryStudyGoal: initialData.primaryStudyGoal || '',
                secondaryStudyGoal: initialData.secondaryStudyGoal || '',
                fieldSpecificDetails: initialData.fieldSpecificDetails || '',
                preferredStudyStyle: initialData.preferredStudyStyle || '',
                studyPacePreference: initialData.studyPacePreference || '',
                availabilityDays: initialData.availability?.days || [],
                availabilityTimeRanges: initialData.availability?.timeRanges || [],
                studyMode: initialData.studyMode || '',
                preferredTools: initialData.preferredTools || [],
                communicationStyle: initialData.communicationStyle || '',
                commitmentLevel: initialData.commitmentLevel || '',
                languages: initialData.languages || [],
                accessibilityPreferences: initialData.accessibilityPreferences || '',
                learningTraits: initialData.learningTraits || [],
                studyNote: initialData.studyNote || '',
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
    const setCurrentCourses = (tags) => setFormData(prev => ({ ...prev, currentCourses: tags }));
    const setPreferredTools = (tags) => setFormData(prev => ({ ...prev, preferredTools: tags }));
    const setLanguages = (tags) => setFormData(prev => ({ ...prev, languages: tags }));
    const setLearningTraits = (tags) => setFormData(prev => ({ ...prev, learningTraits: tags }));
    const setSkills = (tags) => setFormData(prev => ({ ...prev, skills: tags }));
    const setInterests = (tags) => setFormData(prev => ({ ...prev, interests: tags }));
    const setSocialLinks = (links) => setFormData(prev => ({ ...prev, socialLinks: links }));

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            const payload = {
                name: formData.name,
                username: formData.username,
                major: formData.major,
                academicLevel: formData.academicLevel,
                university: formData.university,
                socialLinks: formData.socialLinks,
                currentCourses: formData.currentCourses,
                primaryStudyGoal: formData.primaryStudyGoal,
                secondaryStudyGoal: formData.secondaryStudyGoal,
                fieldSpecificDetails: formData.fieldSpecificDetails,
                preferredStudyStyle: formData.preferredStudyStyle,
                studyPacePreference: formData.studyPacePreference,
                availability: {
                    days: formData.availabilityDays,
                    timeRanges: formData.availabilityTimeRanges
                },
                studyMode: formData.studyMode,
                preferredTools: formData.preferredTools,
                communicationStyle: formData.communicationStyle,
                commitmentLevel: formData.commitmentLevel,
                languages: formData.languages,
                accessibilityPreferences: formData.accessibilityPreferences,
                learningTraits: formData.learningTraits,
                studyNote: formData.studyNote,
                lookingForPartner: formData.lookingForPartner,
                skills: formData.skills,
                interests: formData.interests
            };

            await axios.put(`${API_BASE_URL}/api/users/profile`, payload, config);
            toast.success('Profile updated successfully!');
            if (refreshProfile) refreshProfile();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-3">Student Profile</h3>

            {/* 1️⃣ Identity & Academic Context */}
            <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h4 className="text-lg font-bold text-blue-800 mb-4">1️⃣ Identity & Academic Context</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Display Name *</label>
                        <input type="text" name="name" value={formData.name} onChange={onChange} className="w-full px-3 py-2 border rounded-lg" required />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Username</label>
                        <input type="text" name="username" value={formData.username} onChange={onChange} className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Major *</label>
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
                        <label className="block text-gray-700 font-semibold mb-2">Social / Professional Links</label>
                        <SocialLinksManager links={formData.socialLinks} onChange={setSocialLinks} />
                    </div>
                </div>
            </section>

            {/* 2️⃣ Current Academic Context */}
            <section className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h4 className="text-lg font-bold text-indigo-800 mb-4">2️⃣ Current Courses</h4>
                <TagInput tags={formData.currentCourses} setTags={setCurrentCourses} placeholder="Add course (e.g. CS201, Data Structures)..." />
            </section>

            {/* 3️⃣ Study Intent */}
            <section className="bg-green-50 p-6 rounded-xl border border-green-100">
                <h4 className="text-lg font-bold text-green-800 mb-4">3️⃣ Study Intent</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Primary Study Goal *</label>
                        <select name="primaryStudyGoal" value={formData.primaryStudyGoal} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white" required>
                            <option value="">Select Goal</option>
                            {STUDY_GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Secondary Study Goal (Optional)</label>
                        <select name="secondaryStudyGoal" value={formData.secondaryStudyGoal} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white">
                            <option value="">None</option>
                            {STUDY_GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                </div>
                {/* Conditional: Field-specific details */}
                {(formData.primaryStudyGoal === 'Field-specific learning' || formData.secondaryStudyGoal === 'Field-specific learning') && (
                    <div className="mt-4">
                        <label className="block text-gray-700 font-semibold mb-1">Which field are you focusing on? *</label>
                        <input type="text" name="fieldSpecificDetails" value={formData.fieldSpecificDetails} onChange={onChange} placeholder="e.g. Machine Learning, Web Development, Data Science..." className="w-full px-3 py-2 border rounded-lg" required />
                    </div>
                )}
            </section>

            {/* 4️⃣ Study Style */}
            <section className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                <h4 className="text-lg font-bold text-yellow-800 mb-4">4️⃣ Study Style</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Preferred Study Style *</label>
                        <select name="preferredStudyStyle" value={formData.preferredStudyStyle} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white" required>
                            <option value="">Select Style</option>
                            <option value="Silent co-study">Silent co-study</option>
                            <option value="Discussion-based">Discussion-based</option>
                            <option value="Teaching/explaining">Teaching/explaining</option>
                            <option value="Problem-solving focused">Problem-solving focused</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Study Pace Preference (Optional)</label>
                        <select name="studyPacePreference" value={formData.studyPacePreference} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white">
                            <option value="">Select Pace</option>
                            <option value="Slow & deep">Slow & deep</option>
                            <option value="Balanced">Balanced</option>
                            <option value="Fast & exam-oriented">Fast & exam-oriented</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* 5️⃣ Logistics */}
            <section className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                <h4 className="text-lg font-bold text-orange-800 mb-4">5️⃣ Logistics</h4>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Availability - Days *</label>
                        <div className="flex flex-wrap gap-2">
                            {availableDays.map(day => (
                                <button type="button" key={day} onClick={() => handleDayToggle(day)}
                                    className={`px-3 py-1 rounded-full text-sm font-semibold border transition ${formData.availabilityDays.includes(day) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'}`}>
                                    {day.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Availability - Time Ranges *</label>
                        <div className="flex flex-wrap gap-2">
                            {timeRanges.map(time => (
                                <button type="button" key={time} onClick={() => handleTimeToggle(time)}
                                    className={`px-3 py-1 rounded-full text-sm font-semibold border transition ${formData.availabilityTimeRanges.includes(time) ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-700 border-gray-300 hover:border-orange-400'}`}>
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Study Mode *</label>
                            <select name="studyMode" value={formData.studyMode} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white" required>
                                <option value="">Select Mode</option>
                                <option value="In-person">In-person</option>
                                <option value="Online">Online</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Preferred Tools (Optional)</label>
                            <TagInput tags={formData.preferredTools} setTags={setPreferredTools} placeholder="Zoom, Discord, Google Meet..." />
                        </div>
                    </div>
                </div>
            </section>

            {/* 6️⃣ Communication & Commitment */}
            <section className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <h4 className="text-lg font-bold text-purple-800 mb-4">6️⃣ Communication & Commitment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Communication Style *</label>
                        <select name="communicationStyle" value={formData.communicationStyle} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white" required>
                            <option value="">Select Style</option>
                            <option value="Direct">Direct</option>
                            <option value="Friendly">Friendly</option>
                            <option value="Structured">Structured</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Commitment Level *</label>
                        <select name="commitmentLevel" value={formData.commitmentLevel} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white" required>
                            <option value="">Select Level</option>
                            <option value="Casual">Casual</option>
                            <option value="Weekly sessions">Weekly sessions</option>
                            <option value="Intensive (exam periods)">Intensive (exam periods)</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* 7️⃣ Language & Accessibility */}
            <section className="bg-teal-50 p-6 rounded-xl border border-teal-100">
                <h4 className="text-lg font-bold text-teal-800 mb-4">7️⃣ Language & Accessibility</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Languages Used for Studying *</label>
                        <TagInput tags={formData.languages} setTags={setLanguages} placeholder="English, Arabic..." />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Accessibility Preferences (Optional)</label>
                        <input type="text" name="accessibilityPreferences" value={formData.accessibilityPreferences} onChange={onChange} placeholder="Any specific needs..." className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                </div>
            </section>

            {/* 8️⃣ Learning Compatibility */}
            <section className="bg-pink-50 p-6 rounded-xl border border-pink-100">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-pink-800">8️⃣ Learning Compatibility</h4>
                    <span className="text-xs text-pink-600 bg-pink-100 px-2 py-1 rounded">Focus on "The Fit"</span>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Learning Traits / How you study best</label>
                        <TagInput tags={formData.learningTraits} setTags={setLearningTraits} placeholder="Fast-paced, Visual, Hands-on, Deep-diver, Result-oriented..." />
                        <p className="text-xs text-gray-500 mt-1">Focus on your study character. For your full CV/Resume, please link your LinkedIn below.</p>
                    </div>
                </div>
            </section>

            {/* 9️⃣ Short Study Note */}
            <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="text-lg font-bold text-gray-800 mb-4">8️⃣ Short Study Note (Optional)</h4>
                <textarea name="studyNote" value={formData.studyNote} onChange={onChange} maxLength={200} placeholder="e.g. 'I focus best in evening sessions.' or 'Prefer short, frequent sessions.'" className="w-full px-3 py-2 border rounded-lg h-20 resize-none" />
                <p className="text-xs text-gray-500 mt-1">{formData.studyNote.length}/200 characters</p>
            </section>

            {/* Skills & Interests (Common) */}
            <section className="bg-white p-6 rounded-xl border border-gray-200">
                <h4 className="text-lg font-bold text-gray-800 mb-4">Skills & Interests</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Skills</label>
                        <TagInput tags={formData.skills} setTags={setSkills} placeholder="Python, React, Data Analysis..." />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Interests</label>
                        <TagInput tags={formData.interests} setTags={setInterests} placeholder="AI, Web Dev, Mobile Apps..." />
                    </div>
                </div>
            </section>

            {/* Looking for Partner Toggle */}
            <div className="flex items-center gap-3 p-4 bg-blue-100 rounded-lg">
                <input type="checkbox" name="lookingForPartner" checked={formData.lookingForPartner} onChange={onChange} className="w-5 h-5 accent-blue-600" id="lookingForPartner" />
                <label htmlFor="lookingForPartner" className="text-blue-800 font-bold">I'm actively looking for a study partner</label>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition text-lg">
                Save Student Profile
            </button>
        </form>
    );
};

export default StudentProfileForm;
