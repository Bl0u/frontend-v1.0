import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import TagInput from './TagInput';
import SocialLinksManager from './SocialLinksManager';

const MENTORSHIP_GOALS = [
    'Academic guidance', 'Study strategy & planning', 'Interview preparation',
    'Internship preparation', 'Field-specific guidance', 'Language learning support'
];

const KEY_ACHIEVEMENTS_OPTIONS = [
    'Scholarships', 'Research participation', 'Competitions', 'Academic awards'
];

const MentorProfileForm = ({ user, initialData, refreshProfile }) => {
    const [formData, setFormData] = useState({
        // 1️⃣ Identity & Academic Background
        name: '',
        username: '',
        major: '', // What they graduated in
        currentField: '', // What they're currently working on
        universityGraduated: '',
        socialLinks: [],
        // 2️⃣ Academic Standing & Credibility
        classRank: '',
        gpa: '',
        achievements: [],
        featuredAchievement: '',
        // 3️⃣ Mentorship Focus
        primaryMentorshipGoal: '',
        secondaryMentorshipGoal: '',
        fieldSpecificGuidanceDetails: '',
        // 4️⃣ Mentorship Style
        mentorshipStyle: '',
        interactionType: '',
        // 5️⃣ Mentorship Approach & Match
        mentoringApproach: '',
        preferredMenteeTraits: [],
        // 6️⃣ Commitment & Availability
        availabilityDays: [],
        availabilityTimeRanges: [],
        sessionFrequency: '',
        maxMentees: '',
        // 6️⃣ Communication & Expectations
        communicationStyle: '',
        expectedMenteeCommitment: '',
        // 7️⃣ Mentorship Mode & Tools
        mentorshipMode: '',
        preferredTools: [],
        // 8️⃣ Language & Accessibility
        languages: [],
        accessibilityPreferences: '',
        // 9️⃣ Mentor Statement
        mentorStatement: '',
        // Matching
        lookingForMentee: false
    });

    const availableDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeRanges = ['Morning', 'Afternoon', 'Evening', 'Night'];

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                username: initialData.username || '',
                major: initialData.major || '',
                currentField: initialData.currentField || '',
                universityGraduated: initialData.universityGraduated || '',
                socialLinks: initialData.socialLinks || [],
                classRank: initialData.classRank || '',
                gpa: initialData.gpa || '',
                achievements: initialData.achievements || [],
                featuredAchievement: initialData.featuredAchievement || '',
                primaryMentorshipGoal: initialData.primaryMentorshipGoal || '',
                secondaryMentorshipGoal: initialData.secondaryMentorshipGoal || '',
                fieldSpecificGuidanceDetails: initialData.fieldSpecificGuidanceDetails || '',
                mentorshipStyle: initialData.mentorshipStyle || '',
                interactionType: initialData.interactionType || '',
                mentoringApproach: initialData.mentoringApproach || '',
                preferredMenteeTraits: initialData.preferredMenteeTraits || [],
                availabilityDays: initialData.availability?.days || [],
                availabilityTimeRanges: initialData.availability?.timeRanges || [],
                sessionFrequency: initialData.sessionFrequency || '',
                maxMentees: initialData.maxMentees || '',
                communicationStyle: initialData.communicationStyle || '',
                expectedMenteeCommitment: initialData.expectedMenteeCommitment || '',
                mentorshipMode: initialData.mentorshipMode || '',
                preferredTools: initialData.preferredTools || [],
                languages: initialData.languages || [],
                accessibilityPreferences: initialData.accessibilityPreferences || '',
                mentorStatement: initialData.mentorStatement || '',
                lookingForMentee: initialData.lookingForMentee || false
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

    const addAchievement = (achievement) => {
        if (!achievement || formData.achievements.length >= 5) return;
        setFormData(prev => ({
            ...prev,
            achievements: [...prev.achievements, achievement]
        }));
    };

    const removeAchievement = (index) => {
        setFormData(prev => {
            const newAchievements = prev.achievements.filter((_, i) => i !== index);
            let newFeatured = prev.featuredAchievement;
            if (prev.featuredAchievement === prev.achievements[index]) {
                newFeatured = '';
            }
            return {
                ...prev,
                achievements: newAchievements,
                featuredAchievement: newFeatured
            };
        });
    };

    const setFeaturedAchievement = (achievement) => {
        setFormData(prev => ({ ...prev, featuredAchievement: achievement }));
    };

    const handleAchievementToggle = (achievement) => {
        setFormData(prev => ({
            ...prev,
            keyAchievements: prev.keyAchievements.includes(achievement)
                ? prev.keyAchievements.filter(a => a !== achievement)
                : [...prev.keyAchievements, achievement]
        }));
    };

    // Tag Handlers
    const setPreferredTools = (tags) => setFormData(prev => ({ ...prev, preferredTools: tags }));
    const setLanguages = (tags) => setFormData(prev => ({ ...prev, languages: tags }));
    const setPreferredMenteeTraits = (tags) => setFormData(prev => ({ ...prev, preferredMenteeTraits: tags }));
    const setSocialLinks = (links) => setFormData(prev => ({ ...prev, socialLinks: links }));

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            const payload = {
                name: formData.name,
                username: formData.username,
                major: formData.major,
                currentField: formData.currentField,
                universityGraduated: formData.universityGraduated,
                socialLinks: formData.socialLinks,
                classRank: formData.classRank || undefined,
                gpa: formData.gpa ? parseFloat(formData.gpa) : undefined,
                achievements: formData.achievements,
                featuredAchievement: formData.featuredAchievement || undefined,
                primaryMentorshipGoal: formData.primaryMentorshipGoal,
                secondaryMentorshipGoal: formData.secondaryMentorshipGoal || undefined,
                fieldSpecificGuidanceDetails: formData.fieldSpecificGuidanceDetails || undefined,
                mentorshipStyle: formData.mentorshipStyle,
                interactionType: formData.interactionType || undefined,
                mentoringApproach: formData.mentoringApproach || undefined,
                preferredMenteeTraits: formData.preferredMenteeTraits,
                availability: {
                    days: formData.availabilityDays,
                    timeRanges: formData.availabilityTimeRanges
                },
                sessionFrequency: formData.sessionFrequency,
                maxMentees: formData.maxMentees ? parseInt(formData.maxMentees) : undefined,
                communicationStyle: formData.communicationStyle,
                expectedMenteeCommitment: formData.expectedMenteeCommitment || undefined,
                mentorshipMode: formData.mentorshipMode,
                preferredTools: formData.preferredTools,
                languages: formData.languages,
                accessibilityPreferences: formData.accessibilityPreferences || undefined,
                mentorStatement: formData.mentorStatement || undefined,
                lookingForMentee: formData.lookingForMentee
            };

            await axios.put('http://localhost:5000/api/users/profile', payload, config);
            toast.success('Mentor profile updated successfully!');
            if (refreshProfile) refreshProfile();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-3">Mentor Profile</h3>

            {/* 1️⃣ Identity & Academic Background */}
            <section className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h4 className="text-lg font-bold text-blue-800 mb-4">1️⃣ Identity & Academic Background</h4>
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
                        <label className="block text-gray-700 font-semibold mb-1">Major (Graduated In) *</label>
                        <input type="text" name="major" value={formData.major} onChange={onChange} placeholder="e.g. Computer Science" className="w-full px-3 py-2 border rounded-lg" required />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Current Field (Working On) *</label>
                        <input type="text" name="currentField" value={formData.currentField} onChange={onChange} placeholder="e.g. Machine Learning, Backend Dev" className="w-full px-3 py-2 border rounded-lg" required />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 font-semibold mb-1">University Graduated From *</label>
                        <input type="text" name="universityGraduated" value={formData.universityGraduated} onChange={onChange} placeholder="e.g. Cairo University" className="w-full px-3 py-2 border rounded-lg" required />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 font-semibold mb-2">Professional Social Links</label>
                        <SocialLinksManager links={formData.socialLinks} onChange={setSocialLinks} />
                    </div>
                </div>
            </section>

            {/* 2️⃣ Academic Standing & Credibility */}
            <section className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                <h4 className="text-lg font-bold text-indigo-800 mb-4">2️⃣ Academic Standing & Credibility (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Class Rank</label>
                        <select name="classRank" value={formData.classRank} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white">
                            <option value="">Not specified</option>
                            <option value="Top 1">Top 1</option>
                            <option value="Top 2">Top 2</option>
                            <option value="Top 3">Top 3</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">GPA</label>
                        <input type="number" step="0.01" min="0" max="4" name="gpa" value={formData.gpa} onChange={onChange} placeholder="e.g. 3.85" className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-gray-700 font-semibold mb-1">Manage Achievements (Max 5)</label>
                    <div className="flex gap-2">
                        <input type="text" id="newAchievement" placeholder="e.g. Dean's List 2023" className="flex-grow px-3 py-2 border rounded-lg" onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addAchievement(e.target.value);
                                e.target.value = '';
                            }
                        }} />
                        <button type="button" onClick={() => {
                            const input = document.getElementById('newAchievement');
                            addAchievement(input.value);
                            input.value = '';
                        }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">Add</button>
                    </div>

                    {formData.achievements.length > 0 && (
                        <div className="space-y-2 mt-4">
                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Select one to feature on your card:</p>
                            {formData.achievements.map((ach, index) => (
                                <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-indigo-100 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="featuredAch" checked={formData.featuredAchievement === ach} onChange={() => setFeaturedAchievement(ach)} className="w-4 h-4 accent-indigo-600" id={`ach-${index}`} />
                                        <label htmlFor={`ach-${index}`} className="text-gray-700">{ach}</label>
                                    </div>
                                    <button type="button" onClick={() => removeAchievement(index)} className="text-red-500 hover:text-red-700 text-sm font-bold">Remove</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* 3️⃣ Mentorship Focus */}
            <section className="bg-green-50 p-6 rounded-xl border border-green-100">
                <h4 className="text-lg font-bold text-green-800 mb-4">3️⃣ Mentorship Focus</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Primary Mentorship Goal *</label>
                        <select name="primaryMentorshipGoal" value={formData.primaryMentorshipGoal} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white" required>
                            <option value="">Select Goal</option>
                            {MENTORSHIP_GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Secondary Mentorship Goal (Optional)</label>
                        <select name="secondaryMentorshipGoal" value={formData.secondaryMentorshipGoal} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white">
                            <option value="">None</option>
                            {MENTORSHIP_GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                    </div>
                </div>
                {/* Conditional: Field-specific guidance details */}
                {(formData.primaryMentorshipGoal === 'Field-specific guidance' || formData.secondaryMentorshipGoal === 'Field-specific guidance') && (
                    <div className="mt-4">
                        <label className="block text-gray-700 font-semibold mb-1">Which topics/fields can you provide guidance on? *</label>
                        <input type="text" name="fieldSpecificGuidanceDetails" value={formData.fieldSpecificGuidanceDetails} onChange={onChange} placeholder="e.g. Distributed Systems, Mobile UX Design, FPGA Programming..." className="w-full px-3 py-2 border rounded-lg" required />
                    </div>
                )}
            </section>

            {/* 4️⃣ Mentorship Style */}
            <section className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                <h4 className="text-lg font-bold text-yellow-800 mb-4">4️⃣ Mentorship Style</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Mentorship Style *</label>
                        <select name="mentorshipStyle" value={formData.mentorshipStyle} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white" required>
                            <option value="">Select Style</option>
                            <option value="Structured (planned sessions)">Structured (planned sessions)</option>
                            <option value="Semi-structured">Semi-structured</option>
                            <option value="On-demand Q&A">On-demand Q&A</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Interaction Type (Optional)</label>
                        <select name="interactionType" value={formData.interactionType} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white">
                            <option value="">Not specified</option>
                            <option value="One-on-one">One-on-one</option>
                            <option value="Small group">Small group</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* 5️⃣ Mentorship Approach & Match */}
            <section className="bg-pink-50 p-6 rounded-xl border border-pink-100">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-bold text-pink-800">5️⃣ Mentorship Approach & Match</h4>
                    <span className="text-xs text-pink-600 bg-pink-100 px-2 py-1 rounded">Compatibility Snapshot</span>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Your Mentoring Approach</label>
                        <textarea name="mentoringApproach" value={formData.mentoringApproach} onChange={onChange} placeholder="Describe how you typically guide students (e.g. focus on hands-on coding, theory-first, active questioning...)" className="w-full px-3 py-2 border rounded-lg h-24 resize-none" />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Preferred Mentee Traits (Who do you work best with?)</label>
                        <TagInput tags={formData.preferredMenteeTraits} setTags={setPreferredMenteeTraits} placeholder="Self-driven, Needs Structure, Fast-learner, Patient, Goal-oriented..." />
                        <p className="text-xs text-gray-500 mt-1">Mention traits that make a mentee successful under your guidance.</p>
                    </div>
                </div>
            </section>

            {/* 6️⃣ Commitment & Availability */}
            <section className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                <h4 className="text-lg font-bold text-orange-800 mb-4">6️⃣ Commitment & Availability</h4>
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
                            <label className="block text-gray-700 font-semibold mb-1">Session Frequency *</label>
                            <select name="sessionFrequency" value={formData.sessionFrequency} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white" required>
                                <option value="">Select Frequency</option>
                                <option value="On-demand">On-demand</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Bi-weekly">Bi-weekly</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Max Mentees (Optional)</label>
                            <input type="number" min="1" max="50" name="maxMentees" value={formData.maxMentees} onChange={onChange} placeholder="e.g. 5" className="w-full px-3 py-2 border rounded-lg" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 6️⃣ Communication & Expectations */}
            <section className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <h4 className="text-lg font-bold text-purple-800 mb-4">6️⃣ Communication & Expectations</h4>
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
                        <label className="block text-gray-700 font-semibold mb-1">Expected Mentee Commitment (Optional)</label>
                        <select name="expectedMenteeCommitment" value={formData.expectedMenteeCommitment} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white">
                            <option value="">Not specified</option>
                            <option value="Casual">Casual</option>
                            <option value="Consistent">Consistent</option>
                            <option value="High commitment">High commitment</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* 7️⃣ Mentorship Mode & Tools */}
            <section className="bg-teal-50 p-6 rounded-xl border border-teal-100">
                <h4 className="text-lg font-bold text-teal-800 mb-4">7️⃣ Mentorship Mode & Tools</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Mentorship Mode *</label>
                        <select name="mentorshipMode" value={formData.mentorshipMode} onChange={onChange} className="w-full px-3 py-2 border rounded-lg bg-white" required>
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
            </section>

            {/* 8️⃣ Language & Accessibility */}
            <section className="bg-cyan-50 p-6 rounded-xl border border-cyan-100">
                <h4 className="text-lg font-bold text-cyan-800 mb-4">8️⃣ Language & Accessibility</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Languages for Mentoring *</label>
                        <TagInput tags={formData.languages} setTags={setLanguages} placeholder="English, Arabic..." />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-1">Accessibility Preferences (Optional)</label>
                        <input type="text" name="accessibilityPreferences" value={formData.accessibilityPreferences} onChange={onChange} placeholder="Any specific needs..." className="w-full px-3 py-2 border rounded-lg" />
                    </div>
                </div>
            </section>

            {/* 9️⃣ Mentor Statement */}
            <section className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="text-lg font-bold text-gray-800 mb-4">9️⃣ Mentor Statement (Optional)</h4>
                <textarea name="mentorStatement" value={formData.mentorStatement} onChange={onChange} maxLength={200} placeholder="e.g. 'I focus on building long-term study systems.' or 'I prefer motivated mentees who come prepared.'" className="w-full px-3 py-2 border rounded-lg h-20 resize-none" />
                <p className="text-xs text-gray-500 mt-1">{formData.mentorStatement.length}/200 characters</p>
            </section>

            {/* Looking for Mentee Toggle */}
            <div className="flex items-center gap-3 p-4 bg-green-100 rounded-lg">
                <input type="checkbox" name="lookingForMentee" checked={formData.lookingForMentee} onChange={onChange} className="w-5 h-5 accent-green-600" id="lookingForMentee" />
                <label htmlFor="lookingForMentee" className="text-green-800 font-bold">I'm actively open for mentorship</label>
            </div>

            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition text-lg">
                Save Mentor Profile
            </button>
        </form >
    );
};

export default MentorProfileForm;
