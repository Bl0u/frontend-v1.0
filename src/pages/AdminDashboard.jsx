import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import adminService from '../features/admin/adminService';
import { toast } from 'react-toastify';
import '../styles/AdminDashboard.css';
import SearchableDropdown from '../components/SearchableDropdown';
import PitchConfigManager from '../components/PitchConfigManager';
import PitchModuleManager from '../components/PitchModuleManager';
import AdminCommunities from '../components/AdminCommunities';
import PromoteLeadGroupsModal from '../components/PromoteLeadGroupsModal';

// ───────────────────────────────────────
// TAB CONSTANTS
// ───────────────────────────────────────
const TABS = [
    { key: 'overview', label: 'Overview' },
    { key: 'users', label: 'Users' },
    { key: 'threads', label: 'Threads' },
    { key: 'reports', label: 'Reports' },
    { key: 'payments', label: 'Payments' },
    { key: 'recruitment', label: 'Recruitment' },
    { key: 'pitches', label: 'Manage Pitches' },
    { key: 'communities', label: 'Communities' },
    { key: 'hub_setup', label: 'Hub Setup' },
];

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(false);

    // Group Assignment state for new leads
    const [justPromotedLead, setJustPromotedLead] = useState(null); // { userId, username }

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
    const [userDetailsModal, setUserDetailsModal] = useState(null); // Full user object for details
    const [starsModal, setStarsModal] = useState(null); // { userId, username, currentStars }
    const [starsAmount, setStarsAmount] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null); // { type: 'user'|'thread', id, name }
    const [resetModal, setResetModal] = useState(false);
    const [resetConfirmText, setResetConfirmText] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetResult, setResetResult] = useState(null);
    const [promoteModal, setPromoteModal] = useState(null); // { userId, username, currentRole }
    const [promoRole, setPromoRole] = useState('');
    const [promoUni, setPromoUni] = useState('');
    const [promoCollege, setPromoCollege] = useState('');
    const [promoLevel, setPromoLevel] = useState('');

    // Constants for promotion
    const UNIVERSITIES = [
        'Cairo University', 'Alexandria University', 'Ain Shams University', 'Assiut University', 'Mansoura University',
        'Zagazig University', 'Helwan University', 'Suez Canal University', '6th of October University',
        'Misr University for Science and Technology', 'German University in Cairo (GUC)', 'American University in Cairo (AUC)',
        'Al Alamein International University', 'Delta University for Science and Technology', 'British University in Egypt (BUE)',
        'Arab Academy (AASTMT)', 'Nile University', 'E-JUST'
    ];

    const COLLEGES = [
        'Engineering', 'Medicine', 'Pharmacy', 'Commerce', 'Arts', 'Law', 'Science',
        'Computer and Information', 'Agriculture', 'Dentistry', 'Nursing', 'Education',
        'Economics and Political Science', 'Al-Alsun (Languages)', 'Mass Communication',
        'Fine Arts', 'Applied Arts'
    ];

    const LEVELS = ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Graduated'];

    // Guard: redirect if not admin
    useEffect(() => {
        if (user && !user.roles?.includes('admin')) {
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

    // Added: Fetch specifically for Modal to ensure freshness
    const handleOpenDetails = async (userId) => {
        setLoading(true);
        try {
            const data = await adminService.getUserDetails(user.token, userId);
            setUserDetailsModal(data);
        } catch (err) {
            toast.error('Failed to load user details');
        } finally {
            setLoading(false);
        }
    };

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
        if (!user?.token || !user.roles?.includes('admin')) return;
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
    const handleToggleBan = async (userId) => {
        try {
            const data = await adminService.toggleBan(user.token, userId);
            toast.success(data.message);
            fetchUsers(users.page);
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

    const handlePromote = async () => {
        if (!promoteModal) return;
        try {
            const data = await adminService.promoteUser(user.token, promoteModal.userId, {
                roles: Array.isArray(promoRole) ? promoRole : [promoRole],
                university: promoUni,
                college: promoCollege,
                academicLevel: promoLevel
            });
            toast.success(data.message);
            if (promoRole === 'studentLead') {
                setJustPromotedLead({ userId: promoteModal.userId, username: promoteModal.username });
            }
            setPromoteModal(null);
            setPromoRole('');
            setPromoUni('');
            setPromoCollege('');
            setPromoLevel('');
            fetchUsers(users.page);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Promotion failed');
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

    const handleRunGenerator = async () => {
        setLoading(true);
        try {
            const data = await adminService.runHubGenerator(user.token);
            toast.success(data.message);
            toast.info(data.summary);
        } catch (err) {
            toast.error('Generator failed');
        } finally {
            setLoading(false);
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

    if (!user || !user.roles?.includes('admin')) return null;

    // ───────────────────────────────────────
    // RENDER: OVERVIEW
    // ───────────────────────────────────────
    const renderOverview = () => {
        if (!stats) return <div className="admin-loading"><div className="admin-spinner" /> Loading stats...</div>;

        const heroCards = [
            { label: 'Total Users', value: stats.totalUsers },
            { label: 'Total Threads', value: stats.totalThreads },
            { label: 'Total Revenue', value: `${stats.totalRevenue?.toLocaleString()} EGP` },
        ];

        const regularCards = [
            { label: 'Banned Users', value: stats.bannedUsers },
            { label: 'Total Posts', value: stats.totalPosts },
            { label: 'Stars in Circulation', value: stats.starsInCirculation?.toLocaleString() },
            { label: 'Successful Payments', value: stats.totalPayments },
            { label: 'Pending Reports', value: stats.pendingReports },
            { label: 'Total Reports', value: stats.totalReports },
            { label: 'Recruitment Apps', value: stats.totalRecruitment },
            { label: 'Pending Recruitment', value: stats.pendingRecruitment },
        ];

        return (
            <>
                {/* Hero row */}
                <div className="admin-stats-grid" style={{ marginBottom: 16 }}>
                    {heroCards.map((card) => (
                        <div key={card.label} className="admin-stat-card hero">
                            <div className="admin-stat-label">{card.label}</div>
                            <div className="admin-stat-value">{card.value}</div>
                        </div>
                    ))}
                </div>

                {/* Detail row */}
                <div className="admin-stats-grid">
                    {regularCards.map((card) => (
                        <div key={card.label} className="admin-stat-card">
                            <div className="admin-stat-label">{card.label}</div>
                            <div className="admin-stat-value">{card.value}</div>
                        </div>
                    ))}
                </div>

                {/* Danger Zone */}
                <div className="admin-danger-zone">
                    <h3>Danger Zone</h3>
                    <p>
                        Reset the entire database. This will delete <strong>all users, threads, posts, messages, payments, reports, and everything else</strong> — except admin accounts.
                    </p>
                    <button
                        className="admin-btn danger"
                        style={{ padding: '10px 24px' }}
                        onClick={() => { setResetModal(true); setResetResult(null); setResetConfirmText(''); }}
                    >
                        Reset Entire Database
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
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.users.map((u) => (
                                    <tr key={u._id}>
                                        <td>
                                            <div className="admin-user-cell">
                                                <div className="admin-user-avatar">{u.name?.charAt(0) || '?'}</div>
                                                <div className="admin-user-info">
                                                    <div className="admin-user-name">{u.name}</div>
                                                    <div className="admin-user-username">@{u.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="admin-roles-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                {u.roles && u.roles.length > 0 ? u.roles.map(r => (
                                                    <span key={r} className={`admin-badge neutral uppercase`} style={{ fontSize: '9px', fontWeight: 900 }}>
                                                        {r}
                                                    </span>
                                                )) : (
                                                    <span className={`admin-badge neutral uppercase`} style={{ fontSize: '9px', fontWeight: 900 }}>
                                                        {u.role || 'student'}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {u.isBanned
                                                ? <span className="admin-badge danger">Banned</span>
                                                : <span className="admin-badge success">Active</span>
                                            }
                                        </td>
                                        <td>
                                            <div className="admin-actions">
                                                <button className="admin-btn" onClick={() => handleOpenDetails(u._id)}>
                                                    Details
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
                                                    ⭐ Stars
                                                </button>
                                                <button
                                                    className="admin-btn primary"
                                                    style={{ background: '#001E80', color: 'white' }}
                                                    onClick={() => {
                                                        setPromoteModal({ userId: u._id, username: u.username, currentRole: u.role, roles: u.roles });
                                                        setPromoRole(u.roles || [u.role]);
                                                        setPromoUni(u.university || '');
                                                        setPromoCollege(u.college || '');
                                                        setPromoLevel(u.academicLevel || '');
                                                    }}
                                                >
                                                    Manage Roles
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
                                            <span style={{ fontWeight: 700, color: '#1a1a2e', cursor: 'pointer' }}
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
                                <span style={{ color: '#001E80', fontWeight: 700 }}>@{r.reporter?.username || 'Unknown'}</span>
                                <span className="admin-report-arrow">→ reported →</span>
                                <span style={{ color: '#dc2626', fontWeight: 700 }}>@{r.reportedUser?.username || 'Unknown'}</span>
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
                                        Mark Reviewed
                                    </button>
                                    <button className="admin-btn" onClick={() => handleUpdateReport(r._id, 'dismissed')}>
                                        Dismiss
                                    </button>
                                    <button className="admin-btn danger" onClick={() => handleUpdateReport(r._id, 'reviewed', true)}>
                                        Review & Ban
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
                                    <div style={{ fontWeight: 700, color: '#1a1a2e' }}>{app.user?.name || 'Unknown'}</div>
                                    <div className="admin-user-email">@{app.user?.username} · {app.user?.email}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span className="admin-badge info">{app.type?.replace('_', ' ')}</span>
                                <span className={`admin-badge ${app.status === 'pending' ? 'warning' :
                                    app.status === 'accepted' ? 'success' :
                                        app.status === 'rejected' ? 'danger' : 'neutral'
                                    }`}>{app.status}</span>
                            </div>
                        </div>
                        <div className="admin-report-date" style={{ marginBottom: 12 }}>
                            Applied: {formatDate(app.createdAt)}
                        </div>
                        {app.status === 'pending' && (
                            <div className="admin-actions">
                                <button className="admin-btn success" onClick={() => handleUpdateRecruitment(app._id, 'accepted')}>Accept</button>
                                <button className="admin-btn danger" onClick={() => handleUpdateRecruitment(app._id, 'rejected')}>Reject</button>
                                <button className="admin-btn" onClick={() => handleUpdateRecruitment(app._id, 'reviewed')}>Mark Reviewed</button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </>
    );

    const renderCommunities = () => (
        <AdminCommunities user={user} />
    );

    const renderHubSetup = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Base Hub Generator */}
            <div className="admin-danger-zone" style={{ background: '#EAEEFE', borderColor: '#001E80', margin: 0 }}>
                <h3 style={{ color: '#001E80' }}>Institutional Hub Generator</h3>
                <p style={{ color: '#010D3E', fontWeight: 500 }}>
                    Automatically initialize the core university hubs and their academic circles. 
                    This will only create hubs that don't already exist.
                </p>
                
                <div style={{ marginTop: 20, display: 'flex', gap: 16, alignItems: 'center' }}>
                    <button
                        className="admin-btn primary"
                        style={{ padding: '10px 24px', background: '#001E80' }}
                        onClick={handleRunGenerator}
                        disabled={loading}
                    >
                        {loading ? 'Running...' : 'Initialize Base Hubs'}
                    </button>
                    {loading && <div className="admin-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />}
                </div>
            </div>

            {/* Pitch Hub Question Manager */}
            <PitchConfigManager user={user} />
        </div>
    );

    // ───────────────────────────────────────
    // MAIN RENDER
    // ───────────────────────────────────────
    return (
        <div className="admin-dashboard">
            {/* Header */}
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p className="admin-header-sub">Platform overview and management controls</p>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                {TABS.map((tab) => (
                    <button
                        key={tab.key}
                        className={`admin-tab ${activeTab === tab.key ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.key)}
                    >
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
            {activeTab === 'pitches' && <PitchModuleManager token={user.token} />}
            {activeTab === 'communities' && renderCommunities()}
            {activeTab === 'hub_setup' && renderHubSetup()}

            {/* Stars Modal */}
            {starsModal && (
                <div className="admin-modal-overlay" onClick={() => setStarsModal(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Adjust Stars for @{starsModal.username}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(0,0,0,0.45)', marginBottom: 16 }}>
                            Current balance: <strong style={{ color: '#001E80' }}>{starsModal.currentStars} stars</strong>
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
                        <h3 style={{ color: '#dc2626' }}>Reset Entire Database</h3>

                        {resetResult ? (
                            <>
                                <p style={{ fontSize: '0.85rem', color: '#16a34a', marginBottom: 16, fontWeight: 600 }}>
                                    Database has been reset successfully.
                                </p>
                                <div style={{ background: 'rgba(0,0,0,0.02)', borderRadius: 12, padding: 16, marginBottom: 16 }}>
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
                                                    <td style={{ padding: '6px 12px', fontWeight: 700, color: item.deleted > 0 ? '#dc2626' : 'rgba(0,0,0,0.3)' }}>
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
                                <p style={{ fontSize: '0.82rem', color: 'rgba(0,0,0,0.4)', marginBottom: 8 }}>
                                    Type <strong style={{ color: '#dc2626', letterSpacing: 2 }}>RESET</strong> to confirm:
                                </p>
                                <input
                                    type="text"
                                    className="admin-modal-input"
                                    placeholder="Type RESET here..."
                                    value={resetConfirmText}
                                    onChange={(e) => setResetConfirmText(e.target.value.toUpperCase())}
                                    style={{ borderColor: resetConfirmText === 'RESET' ? 'rgba(220, 38, 38, 0.4)' : undefined }}
                                />
                                <div className="admin-modal-actions">
                                    <button className="admin-btn" onClick={() => setResetModal(false)}>Cancel</button>
                                    <button
                                        className="admin-btn danger"
                                        disabled={resetConfirmText !== 'RESET' || resetLoading}
                                        onClick={handleResetDatabase}
                                    >
                                        {resetLoading ? 'Resetting...' : 'Confirm Reset'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Promotion Modal */}
            {promoteModal && (
                <div className="admin-modal-overlay" onClick={() => setPromoteModal(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 450 }}>
                        <h3 className="admin-modal-title">Promote @{promoteModal.username}</h3>
                        <p className="admin-modal-subtitle">Current role: <strong className="text-navy">{promoteModal.currentRole}</strong></p>

                        <div className="space-y-4 my-6">
                            <div className="space-y-2">
                                <label className="admin-label">Assign Roles (Stackable)</label>
                                <div className="admin-role-checkboxes grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
                                    {['student', 'mentor', 'studentLead', 'moderator', 'admin'].map(r => (
                                        <label key={r} className="flex items-center gap-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-[#001E80] focus:ring-[#001E80]"
                                                checked={promoRole === r || (Array.isArray(promoRole) && promoRole.includes(r))}
                                                onChange={(e) => {
                                                    let currentRoles = Array.isArray(promoRole) ? promoRole : [promoRole].filter(Boolean);
                                                    if (e.target.checked) {
                                                        currentRoles = [...new Set([...currentRoles, r])];
                                                    } else {
                                                        currentRoles = currentRoles.filter(role => role !== r);
                                                    }
                                                    setPromoRole(currentRoles);
                                                }}
                                            />
                                            <span className="text-sm font-medium capitalize group-hover:text-[#001E80] transition-colors">
                                                {r}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {(promoRole === 'studentLead' || (Array.isArray(promoRole) && promoRole.includes('studentLead'))) && (
                                <div className="space-y-5 border-t border-gray-50 pt-5 mt-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <SearchableDropdown
                                        label="University"
                                        options={UNIVERSITIES}
                                        value={promoUni}
                                        onChange={(e) => setPromoUni(e.target.value)}
                                        placeholder="Search university..."
                                        name="university"
                                    />
                                    <SearchableDropdown
                                        label="College / Faculty"
                                        options={COLLEGES}
                                        value={promoCollege}
                                        onChange={(e) => setPromoCollege(e.target.value)}
                                        placeholder="Search college..."
                                        name="college"
                                    />
                                    <div className="space-y-1">
                                        <label className="admin-label">Academic Level</label>
                                        <select
                                            className="admin-modal-input"
                                            value={promoLevel}
                                            onChange={(e) => setPromoLevel(e.target.value)}
                                        >
                                            <option value="">Select level...</option>
                                            {LEVELS.map(lvl => (
                                                <option key={lvl} value={lvl}>{lvl}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="admin-modal-actions">
                            <button className="admin-btn" onClick={() => setPromoteModal(null)}>Cancel</button>
                            <button
                                className="admin-btn primary"
                                disabled={!promoRole || (promoRole === 'studentLead' && (!promoUni || !promoCollege || !promoLevel))}
                                onClick={handlePromote}
                            >
                                Confirm Promotion
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* User Details Modal */}
            {userDetailsModal && (
                <div className="admin-modal-overlay" onClick={() => setUserDetailsModal(null)}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 800, width: '90%' }}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="admin-modal-title" style={{ marginBottom: 4 }}>User Information</h3>
                                <p className="admin-modal-subtitle">Full profile details for <strong>@{userDetailsModal.user?.username}</strong></p>
                            </div>
                            <button className="admin-btn neutral" onClick={() => setUserDetailsModal(null)}>Close</button>
                        </div>

                        <div className="admin-detail-grid" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: 10 }}>
                            {/* Account Security */}
                            <div className="admin-detail-section">
                                <h4>Account & Security</h4>
                                <div className="admin-detail-item">
                                    <span className="admin-detail-label">Full Name</span>
                                    <span className="admin-detail-value">{userDetailsModal.user?.name}</span>
                                </div>
                                <div className="admin-detail-item">
                                    <span className="admin-detail-label">Email</span>
                                    <span className="admin-detail-value">{userDetailsModal.user?.email}</span>
                                </div>
                                <div className="admin-detail-item">
                                    <span className="admin-detail-label">User ID</span>
                                    <span className="admin-detail-value" style={{ fontSize: '10px' }}>{userDetailsModal.user?._id}</span>
                                </div>
                                <div className="admin-detail-item">
                                    <span className="admin-detail-label">Role</span>
                                    <span className="admin-badge neutral uppercase" style={{ fontSize: '9px' }}>{userDetailsModal.user?.role}</span>
                                </div>
                                <div className="admin-detail-item">
                                    <span className="admin-detail-label">Joined</span>
                                    <span className="admin-detail-value">{formatDate(userDetailsModal.user?.createdAt)}</span>
                                </div>
                                <div className="admin-detail-item">
                                    <span className="admin-detail-label">Status</span>
                                    {userDetailsModal.user?.isBanned
                                        ? <span className="admin-badge danger">Banned</span>
                                        : <span className="admin-badge success">Active</span>
                                    }
                                </div>
                            </div>

                            {/* Academic Profile */}
                            <div className="admin-detail-section">
                                <h4>Academic Details</h4>
                                <div className="admin-detail-item">
                                    <span className="admin-detail-label">University</span>
                                    <span className="admin-detail-value text-navy font-bold">{userDetailsModal.user?.university || '—'}</span>
                                </div>
                                <div className="admin-detail-item">
                                    <span className="admin-detail-label">College</span>
                                    <span className="admin-detail-value">{userDetailsModal.user?.college || '—'}</span>
                                </div>
                                <div className="admin-detail-item">
                                    <span className="admin-detail-label">Major</span>
                                    <span className="admin-detail-value">{userDetailsModal.user?.major || '—'}</span>
                                </div>
                                <div className="admin-detail-item">
                                    <span className="admin-detail-label">Level</span>
                                    <span className="admin-detail-value">{userDetailsModal.user?.academicLevel || '—'}</span>
                                </div>
                                <div className="admin-detail-item">
                                    <span className="admin-detail-label">City</span>
                                    <span className="admin-detail-value">{userDetailsModal.user?.city || '—'}</span>
                                </div>
                                <div className="admin-detail-item">
                                    <span className="admin-detail-label">Stars Balance</span>
                                    <span className="admin-detail-value" style={{ color: '#001E80', fontWeight: 900 }}>⭐ {userDetailsModal.user?.stars || 0}</span>
                                </div>
                            </div>

                            {/* Activity Metrics */}
                            <div className="admin-detail-section">
                                <h4>Engagement</h4>
                                <div className="admin-detail-item">
                                    <span className="admin-detail-label">Total Threads</span>
                                    <span className="admin-detail-value">{userDetailsModal.threads?.length || 0}</span>
                                </div>
                                <div className="admin-detail-item">
                                    <span className="admin-detail-label">Total Posts</span>
                                    <span className="admin-detail-value">{userDetailsModal.postsCount || 0}</span>
                                </div>
                                <div className="admin-detail-item">
                                    <span className="admin-detail-label">Reports Made</span>
                                    <span className="admin-detail-value">{userDetailsModal.reportsMade || 0}</span>
                                </div>
                                <div className="admin-detail-item">
                                    <span className="admin-detail-label">Reports Received</span>
                                    <span className="admin-detail-value" style={{ color: userDetailsModal.reportsAgainst?.length > 0 ? '#dc2626' : 'inherit' }}>
                                        {userDetailsModal.reportsAgainst?.length || 0}
                                    </span>
                                </div>
                            </div>

                            {/* Threads authored */}
                            <div className="admin-detail-section col-span-1 md:col-span-2">
                                <h4>Authored Threads</h4>
                                <div className="space-y-2 mt-3">
                                    {userDetailsModal.threads?.length > 0 ? userDetailsModal.threads.map(t => (
                                        <div key={t._id} className="admin-thread-mini flex justify-between items-center group p-3 rounded-xl border border-gray-50 hover:border-[#001E80]/20 transition-all">
                                            <div className="flex flex-col">
                                                <span className="admin-thread-title font-bold text-navy truncate max-w-md">{t.title}</span>
                                                <div className="flex gap-2 items-center mt-1">
                                                    <span className="admin-badge neutral" style={{ fontSize: '8px' }}>{t.type}</span>
                                                    <span className="text-[9px] text-gray-400">{formatDate(t.createdAt)}</span>
                                                </div>
                                            </div>
                                            <a
                                                href={`/resources/thread/${t._id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="admin-btn primary"
                                                style={{ padding: '4px 12px', fontSize: '10px' }}
                                            >
                                                View Live ↗
                                            </a>
                                        </div>
                                    )) : <div className="admin-empty-text">User has not created any threads yet.</div>}
                                </div>
                            </div>
                        </div>

                        <div className="admin-modal-actions border-t border-gray-50 pt-6 mt-6">
                            <button className="admin-btn danger" onClick={() => { setUserDetailsModal(null); setConfirmDelete({ type: 'user', id: userDetailsModal.user?._id, name: userDetailsModal.user?.username }); }}>
                                Delete User
                            </button>
                            <div className="flex gap-3">
                                <button className={`admin-btn ${userDetailsModal.user?.isBanned ? 'success' : 'warning'}`} onClick={() => { handleToggleBan(userDetailsModal.user?._id); setUserDetailsModal(null); }}>
                                    {userDetailsModal.user?.isBanned ? 'Unban User' : 'Ban User'}
                                </button>
                                <button className="admin-btn primary" onClick={() => setUserDetailsModal(null)}>Done</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {justPromotedLead && (
                <PromoteLeadGroupsModal
                    isOpen={!!justPromotedLead}
                    onClose={() => setJustPromotedLead(null)}
                    userId={justPromotedLead.userId}
                    username={justPromotedLead.username}
                    userToken={user.token}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
