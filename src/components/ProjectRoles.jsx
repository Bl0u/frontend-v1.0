import { useState } from 'react';
import { FaCheckCircle, FaChevronRight, FaInfoCircle, FaUserPlus } from 'react-icons/fa';

const ProjectRoles = ({ roles, onApply, isApplied, currentUserRoles }) => {
    const [selectedRole, setSelectedRole] = useState(null);

    // Filter out already filled roles unless it's the one currently selected (to keep details visible)
    const availableRoles = roles?.filter(r => !r.isFilled) || [];

    if (!roles || roles.length === 0) return null;

    return (
        <div className="mt-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="w-10 h-10 bg-[#001E80] text-white rounded-xl flex items-center justify-center shadow-sm">
                    <FaUserPlus size={18} />
                </div>
                <div>
                    <h3 className="text-lg font-black text-gray-800">Available Roles</h3>
                    <p className="text-xs text-gray-400 font-medium">Select a role to view requirements and apply.</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                {availableRoles.length > 0 ? (
                    availableRoles.map((role) => (
                        <button
                            key={role._id || role.id}
                            onClick={() => setSelectedRole(role)}
                            className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${selectedRole?._id === role._id || selectedRole?.id === role.id
                                ? 'bg-[#001E80] border-[#001E80] text-white shadow-lg'
                                : 'bg-white border-gray-100 text-gray-500 hover:border-[#001E80]/20 hover:text-[#001E80]'
                                }`}
                        >
                            {role.name}
                            {role.roleType === 'mentor' && <span className="opacity-70">🎓</span>}
                        </button>
                    ))
                ) : (
                    <div className="w-full p-6 bg-gray-50 rounded-2xl text-center">
                        <p className="text-sm font-bold text-gray-400">All specialized roles for this mission have been filled.</p>
                    </div>
                )}
            </div>

            {selectedRole && (
                <div className="p-8 bg-[#EAEEFE]/30 rounded-[2.5rem] border border-[#001E80]/5 space-y-4 animate-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#001E80]/40">Role Details</span>
                            <h4 className="text-xl font-black text-gray-800">{selectedRole.name}</h4>
                        </div>
                        {selectedRole.roleType === 'mentor' && (
                            <span className="bg-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-[#001E80] border border-[#001E80]/10">Mission Mentor</span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="text-[10px] font-black uppercase tracking-widest text-[#001E80] flex items-center gap-1">
                            <FaInfoCircle size={10} /> Requirements
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                            {selectedRole.requirements}
                        </p>
                    </div>

                    <div className="pt-4">
                        {selectedRole.roleType === 'mentor' && !currentUserRoles?.includes('mentor') ? (
                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-3 text-amber-700">
                                <FaInfoCircle className="shrink-0" />
                                <p className="text-sm font-bold leading-tight">Only verified Mentors can apply for this position.</p>
                            </div>
                        ) : (
                            <button
                                onClick={() => onApply(selectedRole)}
                                disabled={isApplied}
                                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${isApplied
                                    ? 'bg-green-50 text-green-500 cursor-not-allowed shadow-none'
                                    : 'bg-[#001E80] hover:bg-blue-900 text-white shadow-blue-100 active:scale-[0.98]'
                                    }`}
                            >
                                {isApplied ? <><FaCheckCircle /> Applied</> : 'Apply for this position'}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectRoles;
