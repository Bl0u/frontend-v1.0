import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaDownload, FaFileAlt } from 'react-icons/fa';

const Resources = () => {
    const { user } = useContext(AuthContext);
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('discussion');
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchThreads();
    }, []);

    const fetchThreads = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/resources');
            setThreads(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('You must be logged in to post');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('type', type);
        if (file) {
            formData.append('file', file);
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.post('http://localhost:5000/api/resources/thread', formData, config);
            toast.success('Posted successfully');

            // Reset form
            setTitle('');
            setContent('');
            setFile(null);
            // Refresh list
            fetchThreads();
        } catch (error) {
            toast.error('Failed to post');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Resources Hub</h1>

            {/* Create Post Section */}
            {user && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-bold mb-4">Create a New Thread</h2>
                    <form onSubmit={onSubmit}>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <textarea
                                placeholder="Share your thoughts or resources..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                                rows="3"
                                required
                            ></textarea>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <div>
                                <label className="mr-2 font-bold">Type:</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="border rounded px-2 py-1"
                                >
                                    <option value="discussion">Discussion</option>
                                    <option value="resource">Resource</option>
                                </select>
                            </div>
                            <div>
                                <label className="mr-2 font-bold">Attachment:</label>
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="text-sm"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Post
                        </button>
                    </form>
                </div>
            )}

            {/* Threads List */}
            <div className="space-y-6">
                {loading ? (
                    <p>Loading...</p>
                ) : threads.length > 0 ? (
                    threads.map((thread) => (
                        <div
                            key={thread._id}
                            className={`bg-white rounded-lg shadow-md overflow-hidden ${thread.isPaid
                                ? 'border-2 border-amber-300 relative'
                                : 'border-l-4 border-blue-500'
                                }`}
                        >
                            {/* V2.0: Premium Badge for Paid Threads */}
                            {thread.isPaid && (
                                <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 px-6 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">⭐</span>
                                        <span className="font-black text-white text-sm uppercase tracking-wider">Premium Intelligence</span>
                                    </div>
                                    <div className="bg-white/30 backdrop-blur-sm px-4 py-1.5 rounded-full">
                                        <span className="font-black text-white text-lg">{thread.price}</span>
                                        <span className="font-bold text-white/90 text-xs ml-1">STARS</span>
                                    </div>
                                </div>
                            )}

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-2xl font-bold text-gray-800">{thread.title}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${thread.type === 'resource' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {thread.type.toUpperCase()}
                                    </span>
                                </div>

                                <div className="flex items-center text-sm text-gray-600 mb-4">
                                    <img src={thread.author?.avatar || 'https://via.placeholder.com/30'} alt="avatar" className="w-6 h-6 rounded-full mr-2" />
                                    <span className="font-bold mr-2">{thread.author?.name || 'Unknown'}</span>
                                    <span>• {new Date(thread.createdAt).toLocaleDateString()}</span>
                                </div>

                                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{thread.content}</p>

                                {thread.attachments && thread.attachments.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <h4 className="font-bold text-sm mb-2 text-gray-600">Attachments:</h4>
                                        {thread.attachments.map((att, index) => (
                                            <a
                                                key={index}
                                                href={`http://localhost:5000${att}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-blue-600 hover:underline"
                                            >
                                                <FaFileAlt className="mr-2" /> View/Download Attachment
                                            </a>
                                        ))}
                                    </div>
                                )}

                                {/* View Thread Link */}
                                <div className="mt-6 pt-4 border-t">
                                    <a
                                        href={`/thread/${thread._id}`}
                                        className={`inline-block px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${thread.isPaid
                                            ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-white hover:shadow-lg hover:shadow-amber-200'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {thread.isPaid ? '⭐ View Premium Thread' : 'View Thread'}
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No threads found. Be the first to post!</p>
                )}
            </div>
        </div>
    );
};

export default Resources;
