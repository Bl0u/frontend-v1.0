import { useState, useEffect, useRef, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import chatService from '../features/chat/chatService';
import userService from '../features/users/userService';
import { FaSearch, FaPaperPlane, FaUserCircle, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Chat = () => {
    const { user } = useContext(AuthContext);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialTargetId = searchParams.get('u');

    const [recentChats, setRecentChats] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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
                    const target = await userService.getUserById(initialTargetId);
                    setSelectedUser(target);
                } else if (recents.length > 0) {
                    // Auto-select most recent if no param
                    // setSelectedUser(recents[0]); // Optional: WhatsApp doesn't auto-select on mobile, but does on desktop
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        loadContent();
    }, [user, initialTargetId]);

    useEffect(() => {
        if (selectedUser) {
            const fetchMessages = async () => {
                try {
                    const history = await chatService.getMessages(selectedUser._id, user.token);
                    setMessages(history);
                } catch (error) {
                    toast.error('Failed to load chat history');
                }
            };
            fetchMessages();
            // Poll for new messages every 5 seconds (simplified for v1.2)
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [selectedUser, user]);

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

    const onSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        try {
            const sent = await chatService.sendMessage(selectedUser._id, newMessage, user.token);
            setMessages([...messages, sent]);
            setNewMessage('');
            
            // Refresh recents to show latest message
            const recents = await chatService.getRecentChats(user.token);
            setRecentChats(recents);
        } catch (error) {
            toast.error('Message failed to send');
        }
    };

    if (loading) return <div className="text-center mt-10">Loading Mission Chat...</div>;

    return (
        <div className="max-w-6xl mx-auto h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex transform transition-all">
            {/* Sidebar */}
            <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col bg-gray-50/50 ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6">
                    <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-widest flex items-center gap-2">
                        💬 Mission Comms
                    </h2>
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

                <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
                    {searchTerm.length > 2 ? (
                        <div>
                            <p className="px-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Network Results</p>
                            {searchResults.map(u => (
                                <div
                                    key={u._id}
                                    onClick={() => { setSelectedUser(u); setSearchTerm(''); setSearchResults([]); }}
                                    className="flex items-center gap-3 p-4 bg-white rounded-2xl cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-indigo-50 group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold overflow-hidden">
                                        {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : u.name?.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-black text-gray-900">{u.name}</div>
                                        <div className="text-[10px] font-bold text-gray-400 group-hover:text-indigo-400 transition-colors">@{u.username}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>
                            <p className="px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Recent Logs</p>
                            {recentChats.map(chat => (
                                <div
                                    key={chat._id}
                                    onClick={() => setSelectedUser(chat)}
                                    className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border ${selectedUser?._id === chat._id ? 'bg-white border-indigo-100 shadow-lg' : 'bg-transparent border-transparent hover:bg-white/60'}`}
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
                                    {chat.unread && <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex flex-col bg-white ${!selectedUser ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
                {selectedUser ? (
                    <>
                        {/* Current Chat Header */}
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setSelectedUser(null)} className="md:hidden text-gray-400 hover:text-gray-600">
                                    <FaArrowLeft />
                                </button>
                                <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100 overflow-hidden">
                                    {selectedUser.avatar ? <img src={selectedUser.avatar} alt="" className="w-full h-full object-cover" /> : selectedUser.name?.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-black text-gray-900 uppercase tracking-wider">{selectedUser.name}</div>
                                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Active Connection</div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30">
                            {messages.map((msg, i) => {
                                const isMe = msg.sender === user._id;
                                return (
                                    <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] p-4 rounded-3xl text-sm font-medium shadow-sm transition-all hover:shadow-md ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'}`}>
                                            {msg.content}
                                            <div className={`text-[9px] mt-2 font-bold ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
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
                            <form onSubmit={onSendMessage} className="flex gap-4 items-center bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-inner">
                                <input
                                    type="text"
                                    placeholder="Draft mission update..."
                                    className="flex-1 bg-transparent border-none py-3 px-4 text-xs font-bold outline-none placeholder-gray-400"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="w-12 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-100 transition-all active:scale-95"
                                >
                                    <FaPaperPlane size={16} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-6 opacity-40">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-50 flex items-center justify-center text-indigo-200">
                             <FaUserCircle size={64} />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Select an Operative</h3>
                        <p className="text-[10px] font-bold text-gray-500 uppercase">Awaiting mission communication link...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
