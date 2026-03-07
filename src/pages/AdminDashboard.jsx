import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import adminService from '../features/admin/adminService';
import { toast } from 'react-toastify';
import '../styles/AdminDashboard.css';

// ───────────────────────────────────────
// TAB CONSTANTS
// ───────────────────────────────────────
const TABS = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'users', label: 'Users', icon: '👥' },
    { key: 'threads', label: 'Threads', icon: '📝' },
    { key: 'reports', label: 'Reports', icon: '🚩' },
    { key: 'payments', label: 'Payments', icon: '💳' },
    { key: 'recruitment', label: 'Recruitment', icon: '📋' },
];

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);

    // — Data state —
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState({ users: [], total: 0, page: 1, totalPages: 1 });
    const [threads, setThreads] = useState({ threads: [], total: 0, page: 1, totalPages: 1 });
    const [reports, setReports] = useState([]);
    const [payments, setPayments] = useState({ payments: [], total: 0, page: 1, totalPages: 1 });
    const [recruitment, setRecruitment] = useState([]);

    // — UI state —
    const [userSearch, setUserSearch] = useState('');
    const [threadSearch, setThreadSearch] = useState('');
    const [reportFilter, setReportFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('');
    const [recruitmentFilter, setRecruitmentFilter] = useState('');
    const [expandedUser, setExpandedUser] = useState(null);
    const [expandedUserData, setExpandedUserData] = useState(null);
    const [starsModal, setStarsModal] = useState(null); // { userId, username, currentStars }
    const [starsAmount, setStarsAmount] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null); // { type: 'user'|'thread', id, name }
    const [resetModal, setResetModal] = useState(false);
    const [resetConfirmText, setResetConfirmText] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetResult, setResetResult] = useState(null);

    // Guard: redirect if not admin
    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/home');
            toast.error('Access denied');
        }
    }, [user, navigate]);

    // ───────────────────────────────────────
    // DATA FETCHING
    // ───────────────────────────────────────
    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.getStats(user.token);
            setStats(data);
        } catch (err) {
            toast.error('Failed to load stats');
        } finally {
            setLoading(false);
        }
    }, [user?.token]);

    const fetchUsers = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const data = await adminService.getUsers(user.token, { search: userSearch, page, limit: 15 });
            setUsers(data);
        } catch (err) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    }, [user?.token, userSearch]);

    const fetchThreads = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const data = await adminService.getThreads(user.token, { search: threadSearch, page, limit: 15 });
            setThreads(data);
        } catch (err) {
            toast.error('Failed to load threads');
        } finally {
            setLoading(false);
        }
    }, [user?.token, threadSearch]);

    const fetchReports = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.getReports(user.token, reportFilter || undefined);
            setReports(data);
        } catch (err) {
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    }, [user?.token, reportFilter]);

    const fetchPayments = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const data = await adminService.getPayments(user.token, { status: paymentFilter || undefined, page, limit: 15 });
            setPayments(data);
        } catch (err) {
            toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    }, [user?.token, paymentFilter]);

    const fetchRecruitment = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.getRecruitment(user.token, recruitmentFilter || undefined);
            setRecruitment(data);
        } catch (err) {
            toast.error('Failed to load recruitment');
        } finally {
            setLoading(false);
        }
    }, [user?.token, recruitmentFilter]);

    // Fetch data when tab changes
    useEffect(() => {
        if (!user?.token || user.role !== 'admin') return;
        switch (activeTab) {
            case 'overview': fetchStats(); break;
            case 'users': fetchUsers(); break;
            case 'threads': fetchThreads(); break;
            case 'reports': fetchReports(); break;
            case 'payments': fetchPayments(); break;
            case 'recruitment': fetchRecruitment(); break;
        }
    }, [activeTab, user?.token]);

    // ───────────────────────────────────────
    // ACTIONS
    // ───────────────────────────────────────
    const handleExpandUser = async (userId) => {
        if (expandedUser === userId) {
            setExpandedUser(null);
            setExpandedUserData(null);
            return;
        }
        try {
            const data = await adminService.getUserDetails(user.token, userId);
            setExpandedUser(userId);
            setExpandedUserData(data);
        } catch (err) {
            toast.error('Failed to load user details');
        }
    };

    const handleToggleBan = async (userId) => {
        try {
            const data = await adminService.toggleBan(user.token, userId);
            toast.success(data.message);
            fetchUsers(users.page);
            if (expandedUser === userId) setExpandedUser(null);
        } catch (err) {
            toast.error('Failed to toggle ban');
        }
    };

    const handleAdjustStars = async () => {
        if (!starsModal || !starsAmount) return;
        try {
            const data = await adminService.adjustStars(user.token, starsModal.userId, parseInt(starsAmount));
            toast.success(data.message);
            setStarsModal(null);
            setStarsAmount('');
            fetchUsers(users.page);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to adjust stars');
        }
    };

    const handleConfirmDelete = async () => {
        if (!confirmDelete) return;
        try {
            if (confirmDelete.type === 'user') {
                const data = await adminService.deleteUser(user.token, confirmDelete.id);
                toast.success(data.message);
                fetchUsers(users.page);
            } else if (confirmDelete.type === 'thread') {
                const data = await adminService.deleteThread(user.token, confirmDelete.id);
                toast.success(data.message);
                fetchThreads(threads.page);
            }
            setConfirmDelete(null);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed');
        }
    };

    const handleUpdateReport = async (reportId, status, banUser = false) => {
        try {
            const data = await adminService.updateReport(user.token, reportId, { status, banUser });
            toast.success(data.message);
            fetchReports();
        } catch (err) {
            toast.error('Failed to update report');
        }
    };

    const handleUpdateRecruitment = async (appId, status) => {
        try {
            const data = await adminService.updateRecruitment(user.token, appId, status);
            toast.success(data.message);
            fetchRecruitment();
        } catch (err) {
            toast.error('Failed to update application');
        }
    };

    const handleResetDatabase = async () => {
        if (resetConfirmText !== 'RESET') return;
        setResetLoading(true);
        try {
            const data = await adminService.resetDatabase(user.token);
            toast.success(data.message);
            setResetResult(data.summary);
            setResetConfirmText('');
            // Refresh stats
            fetchStats();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Reset failed');
        } finally {
            setResetLoading(false);
        }
    };

    // ───────────────────────────────────────
    // HELPERS
    // ───────────────────────────────────────
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const pendingReportsCount = stats?.pendingReports || 0;
    const pendingRecruitmentCount = stats?.pendingRecruitment || 0;

    if (!user || user.role !== 'admin') return null;

    // ───────────────────────────────────────
    // RENDER: OVERVIEW
    // ───────────────────────────────────────
    const renderOverview = () => {
        if (!stats) return <div className="admin-loading"><div className="admin-spinner" /> Loading stats...</div>;

        const statCards = [
            { label: 'Total Users', value: stats.totalUsers, icon: '👥', accent: '#818cf8' },
            { label: 'Banned Users', value: stats.bannedUsers, icon: '🚫', accent: '#ef4444' },
            { label: 'Total Threads', value: stats.totalThreads, icon: '📝', accent: '#a78bfa' },
            { label: 'Total Posts', value: stats.totalPosts, icon: '💬', accent: '#38bdf8' },
            { label: 'Stars in Circulation', value: stats.starsInCirculation, icon: '⭐', accent: '#fbbf24' },
            { label: 'Successful Payments', value: stats.totalPayments, icon: '✅', accent: '#4ade80' },
            { label: 'Total Revenue (EGP)', value: `${stats.totalRevenue?.toLocaleString()}`, icon: '💰', accent: '#22d3ee' },
            { label: 'Pending Reports', value: stats.pendingReports, icon: '🚩', accent: '#f87171' },
            { label: 'Total Reports', value: stats.totalReports, icon: '📋', accent: '#fb923c' },
            { label: 'Recruitment Apps', value: stats.totalRecruitment, icon: '📨', accent: '#c084fc' },
            { label: 'Pending Recruitment', value: stats.pendingRecruitment, icon: '⏳', accent: '#e879f9' },
        ];

        return (
            <>
                <div className="admin-stats-grid">
                    {statCards.map((card) => (
                        <div key={card.label} className="admin-stat-card" style={{ '--card-accent': card.accent }}>
                            <div className="admin-stat-icon">{card.icon}</div>
                            <div className="admin-stat-label">{card.label}</div>
                            <div className="admin-stat-value">{card.value}</div>
                        </div>
                    ))}
                </div>

                {/* Danger Zone */}
                <div style={{
                    marginTop: 40,
                    padding: 24,
                    background: 'rgba(239, 68, 68, 0.04)',
                    border: '1px solid rgba(239, 68, 68, 0.15)',
                    borderRadius: 16
                }}>
                    <h3 style={{ color: '#f87171', fontSize: '0.9rem', fontWeight: 700, marginBottom: 8 }}>⚠️ Danger Zone</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.82rem', marginBottom: 16 }}>
                        Reset the entire database. This will delete <strong style={{ color: '#f87171' }}>all users, threads, posts, messages, payments, reports, and everything else</strong> — except admin accounts.
                    </p>
                    <button
                        className="admin-btn danger"
                        style={{ padding: '10px 24px', fontSize: '0.85rem' }}
                        onClick={() => { setResetModal(true); setResetResult(null); setResetConfirmText(''); }}
                    >
                        🔴 Reset Entire Database
                    </button>
                </div>
            </>
        );
    };

    // ───────────────────────────────────────
    // RENDER: USERS
    // ───────────────────────────────────────
    const renderUsers = () => (
        <>
            <div className="admin-search-bar">
                <input
                    className="admin-search-input"
                    placeholder="Search by name, username, or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                />
                <button className="admin-btn primary" onClick={() => fetchUsers()}>Search</button>
            </div>

            {loading ? (
                <div className="admin-loading"><div className="admin-spinner" /> Loading users...</div>
            ) : users.users.length === 0 ? (
                <div className="admin-empty">
                    <div className="admin-empty-icon">👥</div>
                    <div className="admin-empty-text">No users found</div>
                </div>
            ) : (
                <>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>University</th>
                                    <th>Stars</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.users.map((u) => (
                                    <>
                                        <tr key={u._id}>
                                            <td>
                                                <div className="admin-user-cell">
                                                    <div className="admin-user-avatar">{u.name?.charAt(0) || '?'}</div>
                                                    <div className="admin-user-info">
                                                        <div className="admin-user-name">{u.name}</div>
                                                        <div className="admin-user-email">@{u.username} · {u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{u.university || '—'}</td>
                                            <td>⭐ {u.stars || 0}</td>
                                            <td>
                                                {u.isBanned
                                                    ? <span className="admin-badge danger">Banned</span>
                                                    : <span className="admin-badge success">Active</span>
                                                }
                                            </td>
                                            <td>{formatDate(u.createdAt)}</td>
                                            <td>
                                                <div className="admin-actions">
                                                    <button className="admin-btn" onClick={() => handleExpandUser(u._id)}>
                                                        {expandedUser === u._id ? '▲ Close' : '▼ Details'}
                                                    </button>
                                                    <button
                                                        className={`admin-btn ${u.isBanned ? 'success' : 'warning'}`}
                                                        onClick={() => handleToggleBan(u._id)}
                                                    >
                                                        {u.isBanned ? 'Unban' : 'Ban'}
                                                    </button>
                                                    <button
                                                        className="admin-btn primary"
                                                        onClick={() => setStarsModal({ userId: u._id, username: u.username, currentStars: u.stars || 0 })}
                                                    >
                                                        ⭐ Adjust
                                                    </button>
                                                    <button
                                                        className="admin-btn danger"
                                                        onClick={() => setConfirmDelete({ type: 'user', id: u._id, name: u.username })}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedUser === u._id && expandedUserData && (
                                            <tr key={`${u._id}-expanded`} className="admin-user-expanded">
                                                <td colSpan="6">
                                                    <div className="admin-detail-grid">
                                                        {/* Profile Info */}
                                                        <div className="admin-detail-section">
                                                            <h4>Profile</h4>
                                                            <div className="admin-detail-item">
                                                                <span className="admin-detail-label">Role</span>
                                                                <span className="admin-detail-value">{expandedUserData.user?.role}</span>
                                                            </div>
                                                            <div className="admin-detail-item">
                                                                <span className="admin-detail-label">Major</span>
                                                                <span className="admin-detail-value">{expandedUserData.user?.major || '—'}</span>
                                                            </div>
                                                            <div className="admin-detail-item">
                                                                <span className="admin-detail-label">Level</span>
                                                                <span className="admin-detail-value">{expandedUserData.user?.academicLevel || '—'}</span>
                                                            </div>
                                                            <div className="admin-detail-item">
                                                                <span className="admin-detail-label">City</span>
                                                                <span className="admin-detail-value">{expandedUserData.user?.city || '—'}</span>
                                                            </div>
                                                            <div className="admin-detail-item">
                                                                <span className="admin-detail-label">Posts</span>
                                                                <span className="admin-detail-value">{expandedUserData.postsCount}</span>
                                                            </div>
                                                            <div className="admin-detail-item">
                                                                <span className="admin-detail-label">Reports Made</span>
                                                                <span className="admin-detail-value">{expandedUserData.reportsMade}</span>
                                                            </div>
                                                        </div>

                                                        {/* Threads */}
                                                        <div className="admin-detail-section">
                                                            <h4>Threads ({expandedUserData.threads?.length || 0})</h4>
                                                            {expandedUserData.threads?.length > 0 ? expandedUserData.threads.slice(0, 8).map(t => (
                                                                <div key={t._id} className="admin-thread-mini">
                                                                    <span className="admin-thread-title">{t.title}</span>
                                                                    <span className="admin-badge neutral">{t.type}</span>
                                                                </div>
                                                            )) : <div className="admin-empty-text" style={{ fontSize: '0.8rem', padding: '10px 0' }}>No threads</div>}
                                                        </div>

                                                        {/* Reports Against */}
                                                        <div className="admin-detail-section">
                                                            <h4>Reports Against ({expandedUserData.reportsAgainst?.length || 0})</h4>
                                                            {expandedUserData.reportsAgainst?.length > 0 ? expandedUserData.reportsAgainst.slice(0, 5).map(r => (
                                                                <div key={r._id} className="admin-detail-item">
                                                                    <span className="admin-detail-label">
                                                                        {r.reporter?.username || 'Unknown'}: {r.reason}
                                                                    </span>
                                                                    <span className={`admin-badge ${r.status === 'pending' ? 'warning' : r.status === 'reviewed' ? 'success' : 'neutral'}`}>
                                                                        {r.status}
                                                                    </span>
                                                                </div>
                                                            )) : <div className="admin-empty-text" style={{ fontSize: '0.8rem', padding: '10px 0' }}>No reports</div>}
                                                        </div>

                                                        {/* Payments */}
                                                        <div className="admin-detail-section">
                                                            <h4>Payments ({expandedUserData.payments?.length || 0})</h4>
                                                            {expandedUserData.payments?.length > 0 ? expandedUserData.payments.slice(0, 5).map(p => (
                                                                <div key={p._id} className="admin-detail-item">
                                                                    <span className="admin-detail-label">{p.amount} EGP → {p.stars} ⭐</span>
                                                                    <span className={`admin-badge ${p.status === 'success' ? 'success' : p.status === 'pending' ? 'warning' : 'danger'}`}>
                                                                        {p.status}
                                                                    </span>
                                                                </div>
                                                            )) : <div className="admin-empty-text" style={{ fontSize: '0.8rem', padding: '10px 0' }}>No payments</div>}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.totalPages > 1 && (
                        <div className="admin-pagination">
                            <button
                                className="admin-page-btn"
                                disabled={users.page <= 1}
                                onClick={() => fetchUsers(users.page - 1)}
                            >← Prev</button>
                            <span className="admin-page-info">
                                Page {users.page} of {users.totalPages} · {users.total} users
                            </span>
                            <button
                                className="admin-page-btn"
                                disabled={users.page >= users.totalPages}
                                onClick={() => fetchUsers(users.page + 1)}
                            >Next →</button>
                        </div>
                    )}
                </>
            )}
        </>
    );

    // ───────────────────────────────────────
    // RENDER: THREADS
    // ───────────────────────────────────────
    const renderThreads = () => (
        <>
            <div className="admin-search-bar">
                <input
                    className="admin-search-input"
                    placeholder="Search threads by title..."
                    value={threadSearch}
                    onChange={(e) => setThreadSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchThreads()}
                />
                <button className="admin-btn primary" onClick={() => fetchThreads()}>Search</button>
            </div>

            {loading ? (
                <div className="admin-loading"><div className="admin-spinner" /> Loading threads...</div>
            ) : threads.threads.length === 0 ? (
                <div className="admin-empty">
                    <div className="admin-empty-icon">📝</div>
                    <div className="admin-empty-text">No threads found</div>
                </div>
            ) : (
                <>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Type</th>
                                    <th>Views</th>
                                    <th>Votes</th>
                                    <th>Paid</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {threads.threads.map((t) => (
                                    <tr key={t._id}>
                                        <td>
                                            <span style={{ fontWeight: 600, color: '#f1f5f9', cursor: 'pointer' }}
                                                onClick={() => navigate(`/resources/thread/${t._id}`)}>
                                                {t.title?.length > 40 ? t.title.substring(0, 40) + '...' : t.title}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-user-cell">
                                                <div className="admin-user-avatar" style={{ width: 28, height: 28, fontSize: '0.7rem' }}>
                                                    {t.author?.name?.charAt(0) || '?'}
                                                </div>
                                                <span>{t.author?.username || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td><span className="admin-badge info">{t.type}</span></td>
                                        <td>{t.views || 0}</td>
                                        <td>{(t.upvotes?.length || 0)}</td>
                                        <td>
                                            {t.isPaid
                                                ? <span className="admin-badge warning">{t.price} ⭐</span>
                                                : <span className="admin-badge neutral">Free</span>
                                            }
                                        </td>
                                        <td>{formatDate(t.createdAt)}</td>
                                        <td>
                                            <div className="admin-actions">
                                                <button className="admin-btn" onClick={() => navigate(`/resources/thread/${t._id}`)}>View</button>
                                                <button
                                                    className="admin-btn danger"
                                                    onClick={() => setConfirmDelete({ type: 'thread', id: t._id, name: t.title })}
                                                >Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {threads.totalPages > 1 && (
                        <div className="admin-pagination">
                            <button className="admin-page-btn" disabled={threads.page <= 1} onClick={() => fetchThreads(threads.page - 1)}>← Prev</button>
                            <span className="admin-page-info">Page {threads.page} of {threads.totalPages} · {threads.total} threads</span>
                            <button className="admin-page-btn" disabled={threads.page >= threads.totalPages} onClick={() => fetchThreads(threads.page + 1)}>Next →</button>
                        </div>
                    )}
                </>
            )}
        </>
    );

    // ───────────────────────────────────────
    // RENDER: REPORTS
    // ───────────────────────────────────────
    const renderReports = () => (
        <>
            <div className="admin-search-bar">
                <select className="admin-filter-select" value={reportFilter} onChange={(e) => { setReportFilter(e.target.value); }}>
                    <option value="">All Reports</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="dismissed">Dismissed</option>
                </select>
                <button className="admin-btn primary" onClick={() => fetchReports()}>Filter</button>
            </div>

            {loading ? (
                <div className="admin-loading"><div className="admin-spinner" /> Loading reports...</div>
            ) : reports.length === 0 ? (
                <div className="admin-empty">
                    <div className="admin-empty-icon">🚩</div>
                    <div className="admin-empty-text">No reports found</div>
                </div>
            ) : (
                reports.map((r) => (
                    <div key={r._id} className="admin-report-card">
                        <div className="admin-report-header">
                            <div className="admin-report-users">
                                <span style={{ color: '#a5b4fc', fontWeight: 600 }}>@{r.reporter?.username || 'Unknown'}</span>
                                <span className="admin-report-arrow">→ reported →</span>
                                <span style={{ color: '#f87171', fontWeight: 600 }}>@{r.reportedUser?.username || 'Unknown'}</span>
                                {r.reportedUser?.isBanned && <span className="admin-badge danger" style={{ marginLeft: 4 }}>Banned</span>}
                            </div>
                            <span className={`admin-badge ${r.status === 'pending' ? 'warning' : r.status === 'reviewed' ? 'success' : 'neutral'}`}>
                                {r.status}
                            </span>
                        </div>
                        <div className="admin-report-reason">Reason: {r.reason}</div>
                        {r.details && <div className="admin-report-details">{r.details}</div>}
                        <div className="admin-report-meta">
                            <span className="admin-report-date">{formatDate(r.createdAt)}</span>
                            {r.status === 'pending' && (
                                <div className="admin-actions">
                                    <button className="admin-btn success" onClick={() => handleUpdateReport(r._id, 'reviewed')}>
                                        ✓ Mark Reviewed
                                    </button>
                                    <button className="admin-btn" onClick={() => handleUpdateReport(r._id, 'dismissed')}>
                                        ✕ Dismiss
                                    </button>
                                    <button className="admin-btn danger" onClick={() => handleUpdateReport(r._id, 'reviewed', true)}>
                                        🚫 Review & Ban User
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </>
    );

    // ───────────────────────────────────────
    // RENDER: PAYMENTS
    // ───────────────────────────────────────
    const renderPayments = () => (
        <>
            <div className="admin-search-bar">
                <select className="admin-filter-select" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                </select>
                <button className="admin-btn primary" onClick={() => fetchPayments()}>Filter</button>
            </div>

            {loading ? (
                <div className="admin-loading"><div className="admin-spinner" /> Loading payments...</div>
            ) : payments.payments.length === 0 ? (
                <div className="admin-empty">
                    <div className="admin-empty-icon">💳</div>
                    <div className="admin-empty-text">No payments found</div>
                </div>
            ) : (
                <>
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Amount (EGP)</th>
                                    <th>Stars</th>
                                    <th>Method</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.payments.map((p) => (
                                    <tr key={p._id}>
                                        <td>
                                            <div className="admin-user-cell">
                                                <div className="admin-user-avatar" style={{ width: 28, height: 28, fontSize: '0.7rem' }}>
                                                    {p.user?.name?.charAt(0) || '?'}
                                                </div>
                                                <div className="admin-user-info">
                                                    <div className="admin-user-name">{p.user?.name || 'Unknown'}</div>
                                                    <div className="admin-user-email">{p.user?.email || ''}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 700 }}>{p.amount?.toLocaleString()} EGP</td>
                                        <td>⭐ {p.stars}</td>
                                        <td>{p.paymentMethod || 'wallet'}</td>
                                        <td>
                                            <span className={`admin-badge ${p.status === 'success' ? 'success' :
                                                p.status === 'pending' ? 'warning' :
                                                    p.status === 'refunded' ? 'info' : 'danger'
                                                }`}>{p.status}</span>
                                        </td>
                                        <td>{formatDate(p.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {payments.totalPages > 1 && (
                        <div className="admin-pagination">
                            <button className="admin-page-btn" disabled={payments.page <= 1} onClick={() => fetchPayments(payments.page - 1)}>← Prev</button>
                            <span className="admin-page-info">Page {payments.page} of {payments.totalPages} · {payments.total} payments</span>
                            <button className="admin-page-btn" disabled={payments.page >= payments.totalPages} onClick={() => fetchPayments(payments.page + 1)}>Next →</button>
                        </div>
                    )}
                </>
            )}
        </>
    );

    // ───────────────────────────────────────
    // RENDER: RECRUITMENT
    // ───────────────────────────────────────
    const renderRecruitment = () => (
        <>
            <div className="admin-search-bar">
                <select className="admin-filter-select" value={recruitmentFilter} onChange={(e) => setRecruitmentFilter(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                </select>
                <button className="admin-btn primary" onClick={() => fetchRecruitment()}>Filter</button>
            </div>

            {loading ? (
                <div className="admin-loading"><div className="admin-spinner" /> Loading applications...</div>
            ) : recruitment.length === 0 ? (
                <div className="admin-empty">
                    <div className="admin-empty-icon">📋</div>
                    <div className="admin-empty-text">No recruitment applications</div>
                </div>
            ) : (
                recruitment.map((app) => (
                    <div key={app._id} className="admin-recruitment-card">
                        <div className="admin-recruitment-header">
                            <div className="admin-recruitment-user">
                                <div className="admin-user-avatar" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>
                                    {app.user?.name?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{app.user?.name || 'Unknown'}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>@{app.user?.username} · {app.user?.email}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span className="admin-recruitment-type admin-badge info">{app.type?.replace('_', ' ')}</span>
                                <span className={`admin-badge ${app.status === 'pending' ? 'warning' :
                                    app.status === 'accepted' ? 'success' :
                                        app.status === 'rejected' ? 'danger' : 'neutral'
                                    }`}>{app.status}</span>
                            </div>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 12 }}>
                            Applied: {formatDate(app.createdAt)}
                        </div>
                        {app.status === 'pending' && (
                            <div className="admin-actions">
                                <button className="admin-btn success" onClick={() => handleUpdateRecruitment(app._id, 'accepted')}>✓ Accept</button>
                                <button className="admin-btn danger" onClick={() => handleUpdateRecruitment(app._id, 'rejected')}>✕ Reject</button>
                                <button className="admin-btn" onClick={() => handleUpdateRecruitment(app._id, 'reviewed')}>Mark Reviewed</button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </>
    );

    // ───────────────────────────────────────
    // MAIN RENDER
    // ───────────────────────────────────────
    return (
        <div className="admin-dashboard">
            {/* Header */}
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <span className="admin-header-badge">v1.0</span>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                        {tab.key === 'reports' && pendingReportsCount > 0 && (
                            <span className="admin-tab-badge">{pendingReportsCount}</span>
                        )}
                        {tab.key === 'recruitment' && pendingRecruitmentCount > 0 && (
                            <span className="admin-tab-badge">{pendingRecruitmentCount}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'threads' && renderThreads()}
            {activeTab === 'reports' && renderReports()}
            {activeTab === 'payments' && renderPayments()}
            {activeTab === 'recruitment' && renderRecruitment()}

            {/* Stars Modal */}
            {starsModal && (
                <div className="admin-modal-overlay" onClick={() => setStarsModal(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Adjust Stars for @{starsModal.username}</h3>
                        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: 16 }}>
                            Current balance: <strong style={{ color: '#fbbf24' }}>⭐ {starsModal.currentStars}</strong>
                        </p>
                        <input
                            type="number"
                            className="admin-modal-input"
                            placeholder="Enter amount (+50 to add, -20 to deduct)"
                            value={starsAmount}
                            onChange={(e) => setStarsAmount(e.target.value)}
                        />
                        <div className="admin-modal-actions">
                            <button className="admin-btn" onClick={() => setStarsModal(null)}>Cancel</button>
                            <button className="admin-btn primary" onClick={handleAdjustStars}>Apply</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {confirmDelete && (
                <div className="admin-modal-overlay" onClick={() => setConfirmDelete(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Confirm Delete</h3>
                        <div className="admin-confirm-text">
                            Are you sure you want to permanently delete {confirmDelete.type} <strong>{confirmDelete.name}</strong>?
                            {confirmDelete.type === 'user' && ' This will also delete all their threads, posts, messages, and associated data.'}
                            {' '}This action cannot be undone.
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-btn" onClick={() => setConfirmDelete(null)}>Cancel</button>
                            <button className="admin-btn danger" onClick={handleConfirmDelete}>Delete Permanently</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Database Modal */}
            {resetModal && (
                <div className="admin-modal-overlay" onClick={() => setResetModal(false)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
                        <h3 style={{ color: '#f87171' }}>🔴 Reset Entire Database</h3>

                        {resetResult ? (
                            <>
                                <p style={{ fontSize: '0.85rem', color: '#4ade80', marginBottom: 16, fontWeight: 600 }}>
                                    ✅ Database has been reset successfully!
                                </p>
                                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
                                    <table className="admin-table" style={{ minWidth: 'unset' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ padding: '8px 12px' }}>Collection</th>
                                                <th style={{ padding: '8px 12px' }}>Deleted</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {resetResult.map((item, i) => (
                                                <tr key={i}>
                                                    <td style={{ padding: '6px 12px' }}>{item.collection}</td>
                                                    <td style={{ padding: '6px 12px', fontWeight: 700, color: item.deleted > 0 ? '#f87171' : '#64748b' }}>
                                                        {item.deleted}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="admin-modal-actions">
                                    <button className="admin-btn primary" onClick={() => setResetModal(false)}>Close</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="admin-confirm-text">
                                    This will <strong>permanently delete</strong> all data from every collection in the database.
                                    Only admin accounts will be preserved. This action <strong>cannot be undone</strong>.
                                </div>
                                <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: 8 }}>
                                    Type <strong style={{ color: '#f87171', letterSpacing: 2 }}>RESET</strong> to confirm:
                                </p>
                                <input
                                    type="text"
                                    className="admin-modal-input"
                                    placeholder="Type RESET here..."
                                    value={resetConfirmText}
                                    onChange={(e) => setResetConfirmText(e.target.value.toUpperCase())}
                                    style={{ borderColor: resetConfirmText === 'RESET' ? 'rgba(239, 68, 68, 0.5)' : undefined }}
                                />
                                <div className="admin-modal-actions">
                                    <button className="admin-btn" onClick={() => setResetModal(false)}>Cancel</button>
                                    <button
                                        className="admin-btn danger"
                                        disabled={resetConfirmText !== 'RESET' || resetLoading}
                                        onClick={handleResetDatabase}
                                        style={{ opacity: resetConfirmText !== 'RESET' ? 0.4 : 1 }}
                                    >
                                        {resetLoading ? 'Resetting...' : '🔴 Confirm Reset'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
