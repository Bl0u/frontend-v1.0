import { useNavigate } from 'react-router-dom';
import { FaSearch, FaRegComment, FaRegBell, FaHashtag } from 'react-icons/fa';
import LiquidButton from './LiquidButton';

const HubHeader = ({
    searchTerm,
    setSearchTerm,
    onCreateClick,
    user
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-between gap-6 w-full px-6 py-3 bg-white border-b border-gray-100 sticky top-0 z-50">
            {/* Search Block - Shifted Left */}
            <div className="flex-1 max-w-2xl">
                <div className="relative group bg-gray-50/80 hover:bg-white rounded-xl border border-transparent hover:border-gray-200 focus-within:border-[#001E80]/40 focus-within:bg-white transition-all overflow-hidden h-10 flex items-center shadow-sm">
                    <FaSearch className="absolute left-4 text-gray-400 group-focus-within:text-[#001E80] transition-colors" size={14} />
                    <input
                        type="text"
                        placeholder="Search for intel, threads, tags..."
                        className="w-full bg-transparent border-none py-2 pl-11 pr-4 text-sm font-medium placeholder:text-gray-400 outline-none focus:ring-0 transition-all font-inter"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Actions Block */}
            <div className="flex items-center gap-4">
                <LiquidButton
                    text="CREATE THREAD"
                    onClick={onCreateClick}
                    className="scale-90"
                />

                <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100 h-10">
                    <button className="p-2 text-gray-500 hover:text-[#001E80] hover:bg-white rounded-lg transition-all relative">
                        <FaRegComment size={18} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                    </button>
                    <button className="p-2 text-gray-500 hover:text-[#001E80] hover:bg-white rounded-lg transition-all">
                        <FaRegBell size={18} />
                    </button>
                </div>

                <button
                    onClick={() => navigate('/profile')}
                    className="w-9 h-9 rounded-xl overflow-hidden bg-[#001E80] border-2 border-white shadow-md hover:scale-105 transition-all flex-shrink-0"
                >
                    {user?.avatar ? (
                        <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                    ) : (
                        <div className="w-full h-full text-white flex items-center justify-center text-xs font-black uppercase">
                            {user?.name?.charAt(0) || '?'}
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
};

export default HubHeader;
