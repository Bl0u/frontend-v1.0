import { useState, useEffect, useRef, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import chatService from '../features/chat/chatService';
import userService from '../features/users/userService';
import { FaSearch, FaPaperPlane, FaUserCircle, FaArrowLeft, FaUsers, FaPlus, FaBullhorn } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Chat = () => {
    const { user } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialTargetId = searchParams.get('u');
    const initialType = searchParams.get('type') || 'individual';

    const [recentChats, setRecentChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [groupName, setGroupName] = useState('');

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const isLeadOrMentor = user && ['studentLead', 'mentor', 'admin', 'moderator'].some(r => user.roles?.includes(r));

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const loadContent = async () => {
            try {
                const recents = await chatService.getRecentChats(user.token);
                setRecentChats(recents);

                if (initialTargetId) {
                    if (initialType === 'group') {
                        let foundGroup = recents.find(c => c._id === initialTargetId && c.chatType === 'group');
                        if (foundGroup) {
                            setSelectedChat(foundGroup);
                        } else {
                            // Minimal placeholder for the selected chat until messages load or it appears
                            setSelectedChat({ _id: initialTargetId, chatType: 'group', name: 'Loading Unit...' });
                        }
                    } else {
                        const target = await userService.getUserById(initialTargetId);
                        setSelectedChat({ ...target, chatType: 'individual' });
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        loadContent();
    }, [user, initialTargetId, initialType]);

    useEffect(() => {
        if (selectedChat) {
            const fetchMessages = async () => {
                try {
                    const history = await chatService.getMessages(
                        selectedChat._id,
                        user.token,
                        selectedChat.chatType
                    );
                    setMessages(history);
                } catch (error) {
                    toast.error('Failed to load chat history');
                }
            };
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedChat, user]);

    useEffect(scrollToBottom, [messages]);

    const handleSearch = async (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term.length > 2) {
            const results = await userService.getUsers({ search: term });
            setSearchResults(results.filter(u => u._id !== user._id));
        } else {
            setSearchResults([]);
        }
    };

    const onSendMessage = async (e, forceAnnouncement = false) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        try {
            const payload = {
                content: newMessage,
                isAnnouncement: forceAnnouncement
            };

            if (selectedChat.chatType === 'group') {
                payload.groupId = selectedChat._id;
            } else {
                payload.receiverId = selectedChat._id;
            }

            const sent = await chatService.sendMessage(payload, user.token);
            setMessages([...messages, sent]);
            setNewMessage('');

            const recents = await chatService.getRecentChats(user.token);
            setRecentChats(recents);
        } catch (error) {
            toast.error('Message failed to send');
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) return;
        try {
            const newGroup = await chatService.createGroup({
                name: groupName,
                userIds: [] // Initially empty, can add later
            }, user.token);
            setRecentChats([{ ...newGroup, chatType: 'group' }, ...recentChats]);
            setSelectedChat({ ...newGroup, chatType: 'group' });
            setIsGroupModalOpen(false);
            setGroupName('');
            toast.success('Unit established.');
        } catch (error) {
            toast.error('Failed to create group');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading Mission Chat...</div>;

    const individuals = recentChats.filter(c => c.chatType === 'individual');
    const groups = recentChats.filter(c => c.chatType === 'group');

    return (
        <div className="max-w-6xl mx-auto h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex transform transition-all">
            {/* Sidebar */}
            <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col bg-gray-50/50 ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl text-[#001E80] tracking-widest flex items-center gap-2" style={{ fontFamily: 'Zuume-Bold' }}>
                            💬 Mission Comms
                        </h2>
                        {isLeadOrMentor && (
                            <button
                                onClick={() => setIsGroupModalOpen(true)}
                                className="w-8 h-8 rounded-lg bg-[#001E80]/10 text-[#001E80] flex items-center justify-center hover:bg-[#001E80] hover:text-white transition-all"
                                title="Create Unit"
                            >
                                <FaPlus size={12} />
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search operatives..."
                            className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold shadow-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-6">
                    {searchTerm.length > 2 ? (
                        <div>
                            <p className="px-2 text-[10px] font-black text-[#001E80] uppercase tracking-widest mb-4">Network Results</p>
                            {searchResults.map(u => (
                                <div
                                    key={u._id}
                                    onClick={() => { setSelectedChat({ ...u, chatType: 'individual' }); setSearchTerm(''); setSearchResults([]); }}
                                    className="flex items-center gap-3 p-4 bg-white rounded-2xl cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-[#EAEEFE] group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#EAEEFE] flex items-center justify-center text-[#001E80] font-bold overflow-hidden">
                                        {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : u.name?.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-black text-gray-900">{u.name}</div>
                                        <div className="text-[10px] font-bold text-[#001E80] transition-colors">@{u.username}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {groups.length > 0 && (
                                <div>
                                    <p className="px-2 text-[10px] font-black text-[#001E80] uppercase tracking-widest mb-4">Official Units</p>
                                    <div className="space-y-2">
                                        {groups.map(chat => (
                                            <div
                                                key={chat._id}
                                                onClick={() => setSelectedChat(chat)}
                                                className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border ${selectedChat?._id === chat._id ? 'bg-white border-[#EAEEFE] shadow-lg' : 'bg-transparent border-transparent hover:bg-white/60'}`}
                                            >
                                                <div className="w-12 h-12 rounded-2xl bg-[#EAEEFE] flex items-center justify-center text-[#001E80] font-black overflow-hidden border-2 border-white shadow-sm">
                                                    {chat.avatar ? <img src={chat.avatar} alt="" className="w-full h-full object-cover" /> : <FaUsers />}
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="flex justify-between items-center mb-0.5">
                                                        <div className="text-xs font-black text-gray-900 uppercase">{chat.name}</div>
                                                        <div className="text-[9px] font-bold text-gray-400">{new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                    </div>
                                                    <div className="text-[10px] font-medium text-[#001E80]/60 truncate italic">
                                                        {chat.lastMessage}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <p className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Operative Logs</p>
                                <div className="space-y-2">
                                    {individuals.map(chat => (
                                        <div
                                            key={chat._id}
                                            onClick={() => setSelectedChat(chat)}
                                            className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border ${selectedChat?._id === chat._id ? 'bg-white border-[#EAEEFE] shadow-lg' : 'bg-transparent border-transparent hover:bg-white/60'}`}
                                        >
                                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold overflow-hidden border-2 border-white shadow-sm">
                                                {chat.avatar ? <img src={chat.avatar} alt="" className="w-full h-full object-cover" /> : chat.name?.charAt(0)}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <div className="text-xs font-black text-gray-900">{chat.name}</div>
                                                    <div className="text-[9px] font-bold text-gray-400">{new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                </div>
                                                <div className="text-[10px] font-medium text-gray-500 truncate italic">
                                                    {chat.lastMessage}
                                                </div>
                                            </div>
                                            {chat.unread && <div className="w-2 h-2 bg-[#001E80] rounded-full"></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col bg-white ${!selectedChat ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
                {selectedChat ? (
                    <>
                        {/* Current Chat Header */}
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedChat(null)} className="md:hidden text-gray-400 hover:text-gray-600">
                                    <FaArrowLeft />
                                </button>
                                <div className={`w-12 h-12 ${selectedChat.chatType === 'group' ? 'rounded-2xl bg-[#001E80]' : 'rounded-full bg-indigo-50'} flex items-center justify-center text-white font-black shadow-lg overflow-hidden`}>
                                    {selectedChat.avatar ? <img src={selectedChat.avatar} alt="" className="w-full h-full object-cover" /> : (selectedChat.chatType === 'group' ? <FaUsers /> : selectedChat.name?.charAt(0))}
                                </div>
                                <div>
                                    <div className="text-sm font-black text-gray-900 uppercase tracking-wider">{selectedChat.name}</div>
                                    <div className="text-[10px] font-bold text-[#001E80] uppercase tracking-widest">
                                        {selectedChat.chatType === 'group' ? 'Active Unit' : 'Secure Connection'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30">
                            {messages.map((msg, i) => {
                                const isMe = msg.sender._id === user._id;
                                const isAnnouncement = msg.isAnnouncement;

                                return (
                                    <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        {selectedChat.chatType === 'group' && !isMe && !isAnnouncement && (
                                            <span className="text-[9px] font-black text-[#001E80] uppercase mb-1 ml-4 tracking-widest">{msg.sender.name}</span>
                                        )}

                                        <div className={`
                                            relative max-w-[80%] p-4 rounded-3xl text-sm font-medium transition-all hover:shadow-lg
                                            ${isAnnouncement ? 'bg-gradient-to-br from-indigo-900 to-[#001E80] text-white rounded-xl border-2 border-indigo-400 shadow-xl w-full scale-[1.02] my-4' :
                                                isMe ? 'bg-[#001E80] text-white rounded-tr-none' : 'bg-[#EAEEFE] text-[#001E80] rounded-tl-none border border-[#EAEEFE]'}
                                        `}>
                                            {isAnnouncement && (
                                                <div className="flex items-center gap-2 mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300">
                                                    <FaBullhorn /> Official Broadcast
                                                </div>
                                            )}
                                            {msg.content}
                                            <div className={`text-[9px] mt-2 font-bold ${isMe || isAnnouncement ? 'text-white/60' : 'text-gray-500'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-8 bg-white border-t border-gray-50">
                            <form onSubmit={(e) => onSendMessage(e)} className="flex gap-4 items-center bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-inner">
                                <input
                                    type="text"
                                    placeholder="Draft mission update..."
                                    className="flex-1 bg-transparent border-none py-3 px-4 text-xs font-bold outline-none placeholder-gray-400"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />

                                {isLeadOrMentor && selectedChat.chatType === 'group' && (
                                    <button
                                        type="button"
                                        onClick={() => onSendMessage(null, true)}
                                        className="px-4 h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-100 transition-all active:scale-95"
                                        title="Send Broadcast"
                                    >
                                        <FaBullhorn /> <span className="hidden lg:inline">Broadcast</span>
                                    </button>
                                )}

                                <button
                                    type="submit"
                                    className="w-12 h-12 rounded-xl bg-[#001E80] hover:bg-blue-800 text-white flex items-center justify-center shadow-lg shadow-blue-100 transition-all active:scale-95"
                                >
                                    <FaPaperPlane size={16} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-6 opacity-40">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-[#EAEEFE] flex items-center justify-center text-[#001E80]">
                            <FaUserCircle size={64} />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Select an Operative</h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">Awaiting mission communication link...</p>
                    </div>
                )}
            </div>

            {/* Create Group Modal */}
            {isGroupModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 shadow-2xl space-y-8">
                        <div>
                            <h2 className="text-3xl font-black text-[#010D3E] uppercase" style={{ fontFamily: 'Zuume-Bold' }}>Establish Unit</h2>
                            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Create a tactical group chat</p>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-[#001E80] uppercase tracking-[0.2em]">Unit Designation</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs font-bold outline-none ring-2 ring-transparent focus:ring-indigo-100 transition-all"
                                placeholder="Group Name..."
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsGroupModalOpen(false)}
                                className="flex-1 py-4 text-xs font-black uppercase text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                Abort
                            </button>
                            <button
                                onClick={handleCreateGroup}
                                className="flex-1 py-4 rounded-xl bg-[#001E80] text-white text-xs font-black uppercase shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Initialize
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chat;
