import { FaUserGraduate, FaUsers, FaTimes } from 'react-icons/fa';

const ProjectTeam = ({ team, onClose }) => {
    const { mentor, contributors, owner } = team;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="bg-[#001E80] p-8 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                    >
                        <FaTimes size={18} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <FaUsers size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black">Project Team</h3>
                            <p className="text-white/60 text-sm font-medium">The brilliant minds behind this mission.</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                    {/* Mission Mentor Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mission Mentor</h4>
                            {mentor && <span className="text-[10px] font-black uppercase tracking-widest text-[#001E80] bg-[#EAEEFE] px-2 py-0.5 rounded-full">Assigned</span>}
                        </div>

                        {mentor ? (
                            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
                                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-xl overflow-hidden shrink-0 border-2 border-white shadow-sm">
                                    {mentor.avatar ? <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" /> : <FaUserGraduate className="text-amber-600" />}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 leading-tight">{mentor.name}</p>
                                    <p className="text-xs text-amber-700 font-medium">@{mentor.username}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                                <p className="text-xs text-gray-400 font-medium italic">No mentor assigned yet.</p>
                            </div>
                        )}
                    </div>

                    {/* Team Members Section */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mission Roster</h4>

                        <div className="grid grid-cols-1 gap-4">
                            {/* Project Owner (implicit member) */}
                            <div className="flex items-center gap-4 p-4 bg-[#001E80]/5 rounded-2xl border border-[#001E80]/10 shadow-sm">
                                <div className="w-11 h-11 rounded-xl bg-[#001E80] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg shadow-[#001E80]/10 border-2 border-white">
                                    {owner?.name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{owner?.name}</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#001E80]">Mission Lead</span>
                                        <div className="w-1 h-1 rounded-full bg-[#001E80]/20" />
                                        <span className="text-[9px] font-bold text-gray-400">@{owner?.username}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dynamically Defined Roles */}
                            {team.roles && team.roles.map((role, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${role.isFilled ? 'bg-white border-gray-100' : 'bg-gray-50/30 border-dashed border-gray-200 opacity-60'}`}
                                >
                                    {role.isFilled && role.filledBy ? (
                                        <>
                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-600 shrink-0 overflow-hidden border-2 border-white shadow-sm ring-2 ring-gray-50">
                                                {role.filledBy.avatar ? <img src={role.filledBy.avatar} alt={role.filledBy.name} className="w-full h-full object-cover" /> : role.filledBy.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 leading-tight">{role.filledBy.name}</p>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                                                        {role.name}
                                                    </span>
                                                    <span className="text-[9px] font-medium text-gray-400">@{role.filledBy.username}</span>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-10 h-10 rounded-xl bg-gray-100/50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 font-bold text-xs shrink-0">
                                                ?
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-400 italic">Open Position</p>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                                                    Req: {role.name}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-gray-50/50 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-white border border-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all active:scale-[0.98]"
                    >
                        Close Roster
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectTeam;
