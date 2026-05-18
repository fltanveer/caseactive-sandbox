import { useState, useRef } from 'react';

const USERS_DATA = [
    { id: 'CU-FE493B85F08789', name: 'Ar Tanveer',         username: 'ar@caseactive.com',                         createdDate: '04/01/2026', status: 'Active', type: 'admin', role: 'admin' },
    { id: 'CU-B0T8A1E34CC8E', name: 'Virtual Assistant',  username: 'bot+ca-8c1e34cc8eaf81@caseactive.email',    createdDate: '04/01/2026', status: 'Active', type: 'bot',   role: 'N/A' },
    { id: 'CU-AR1G0LDR0G3R01', name: 'Gold Roger',         username: 'ar+1@caseactive.com',                       createdDate: '04/01/2026', status: 'Active', type: 'user',  role: 'client' },
];

const USER_CASES = {
    'CU-FE493B85F08789': [
        { caseId: 'cc-64fc9cf315526b', status: 'Active',  role: 'staff' },
        { caseId: 'cc-a1b2c3d4e56789', status: 'Active',  role: 'admin' },
        { caseId: 'cc-b3c4d5e6f78901', status: 'Closed',  role: 'staff' },
    ],
    'CU-AR1G0LDR0G3R01': [
        { caseId: 'cc-64fc9cf315526b', status: 'Active',  role: 'client' },
        { caseId: 'cc-c5d6e7f8091234', status: 'Pending', role: 'client' },
    ],
};

const ASSIGNABLE_USERS = [
    { id: 'u-001', name: 'Jordan Admin',  email: 'jordan@firm.com',  role: 'Attorney'  },
    { id: 'u-002', name: 'Sara Chen',     email: 'sara@firm.com',    role: 'Paralegal' },
    { id: 'u-003', name: 'Mike Torres',   email: 'mike@firm.com',    role: 'Associate' },
    { id: 'u-004', name: 'Priya Kapoor',  email: 'priya@firm.com',   role: 'Attorney'  },
    { id: 'u-005', name: 'Chris Lee',     email: 'chris@firm.com',   role: 'Paralegal' },
];

const USER_SEARCH_TYPES = ['Email', 'Phone'];
const USER_ROLES = ['clients', 'staff', 'admin'];

const CopyIcon = ({ className }) => (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
);

const CreateUserModal = ({ onClose }) => {
    const [searchType, setSearchType]   = useState('Email');
    const [typeOpen, setTypeOpen]       = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [firstName, setFirstName]     = useState('');
    const [lastName, setLastName]       = useState('');
    const [role, setRole]               = useState('clients');
    const typeWrapRef = useRef(null);
    const [dropUp, setDropUp] = useState(false);

    const toggleTypeDropdown = () => {
        if (typeWrapRef.current) {
            const rect = typeWrapRef.current.getBoundingClientRect();
            setDropUp(window.innerHeight - rect.bottom < 220);
        }
        setTypeOpen(p => !p);
    };

    const canSave = searchValue.trim().length > 0;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm ccm-narrow" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <h2 className="ccm-title">Add User</h2>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="ccm-body ccm-user-body">
                    <p className="ccm-user-hint">Let's start by entering the email or phone number</p>

                    <div className="ccm-assign-input-wrap">
                        <div className="ccm-search-type-wrap" ref={typeWrapRef}>
                            <button className="ccm-search-type-btn" onClick={toggleTypeDropdown}>
                                {searchType}
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                            </button>
                            {typeOpen && (
                                <div className={`ccm-type-dropdown${dropUp ? ' drop-up' : ''}`}>
                                    {USER_SEARCH_TYPES.map(t => (
                                        <button key={t} className={`ccm-type-option${searchType === t ? ' active' : ''}`}
                                            onClick={() => { setSearchType(t); setTypeOpen(false); setSearchValue(''); }}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="ccm-assign-divider" />
                        <div className="ccm-assign-input-right">
                            <input
                                type="text"
                                className="ccm-assign-text-input"
                                placeholder="Search value..."
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="ccm-grid-2">
                        <div className="ccm-field">
                            <input type="text" className="ccm-input" placeholder="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                        </div>
                        <div className="ccm-field">
                            <input type="text" className="ccm-input" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} />
                        </div>
                    </div>

                    <div className="ccm-field">
                        <label className="ccm-label">Role:</label>
                        <select className="ccm-select" value={role} onChange={e => setRole(e.target.value)}>
                            {USER_ROLES.map(r => (
                                <option key={r} value={r}>{r}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="ccm-footer">
                    <button className="ccm-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="ccm-save-btn" disabled={!canSave}>SAVE</button>
                </div>

                <div className="ccm-user-bottom">
                    Have many users? <button className="ccm-link">Import users</button> or <button className="ccm-link">Send them a signup link.</button>
                </div>
            </div>
        </div>
    );
};

const ConfirmStatusModal = ({ user, currentStatus, onConfirm, onCancel }) => {
    const action = currentStatus === 'Active' ? 'disable' : 'enable';
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="confirm-modal" onClick={e => e.stopPropagation()}>
                <div className="confirm-modal-header">
                    <h3 className="confirm-modal-title">Confirm Status Change</h3>
                    <button className="confirm-modal-close" onClick={onCancel}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div className="confirm-modal-body">
                    <p className="confirm-modal-text">
                        Are you sure you want to <strong>{action}</strong> <strong>{user.name}</strong>?
                    </p>
                </div>
                <div className="confirm-modal-footer">
                    <button className="confirm-modal-cancel" onClick={onCancel}>Cancel</button>
                    <button className="confirm-modal-confirm" onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

const ViewCasesModal = ({ user, onClose }) => {
    const [cases, setCases] = useState(USER_CASES[user.id] || []);
    const [toast, setToast] = useState(null);

    const removeCase = (idx) => {
        setCases(prev => prev.filter((_, i) => i !== idx));
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setToast('Copied to clipboard');
            setTimeout(() => setToast(null), 2000);
        } catch {
            setToast('Copied to clipboard');
            setTimeout(() => setToast(null), 2000);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            {toast && <div className="copy-toast">{toast}</div>}
            <div className="view-cases-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Users &gt; View Cases</p>
                        <h2 className="ccm-title">View Cases</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div className="view-cases-user-banner">
                    <span className="view-cases-user-id">{user.id}</span>
                    <button className="view-cases-copy-btn" onClick={() => copyToClipboard(user.id)} title="Copy user ID">
                        <CopyIcon />
                    </button>
                </div>
                <div className="view-cases-table">
                    <div className="view-cases-table-head">
                        <span>CASE ID</span>
                        <span>STATUS</span>
                        <span>ROLE</span>
                        <span>ACTION</span>
                    </div>
                    {cases.length === 0 ? (
                        <div className="view-cases-empty">No cases assigned.</div>
                    ) : cases.map((c, i) => (
                        <div key={i} className="view-cases-table-row">
                            <div className="view-cases-id-cell">
                                <span className="view-cases-id">{c.caseId}</span>
                                <button className="view-cases-copy-btn" onClick={() => copyToClipboard(c.caseId)} title="Copy case ID">
                                    <CopyIcon />
                                </button>
                            </div>
                            <span className="view-cases-status">{c.status}</span>
                            <span className="view-cases-role">{c.role}</span>
                            <button className="view-cases-delete" onClick={() => removeCase(i)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const UsersView = () => {
    const [createOpen, setCreateOpen] = useState(false);
    const [userStatuses, setUserStatuses] = useState(
        USERS_DATA.map(u => u.status)
    );
    const [confirmUser, setConfirmUser] = useState(null);
    const [viewCasesUser, setViewCasesUser] = useState(null);

    const toggleStatus = (index) => {
        setUserStatuses(prev => {
            const next = [...prev];
            next[index] = next[index] === 'Active' ? 'Inactive' : 'Active';
            return next;
        });
        setConfirmUser(null);
    };

    return (
        <div className="cases-view">
            {createOpen && <CreateUserModal onClose={() => setCreateOpen(false)} />}
            {confirmUser !== null && (
                <ConfirmStatusModal
                    user={USERS_DATA[confirmUser]}
                    currentStatus={userStatuses[confirmUser]}
                    onConfirm={() => toggleStatus(confirmUser)}
                    onCancel={() => setConfirmUser(null)}
                />
            )}
            {viewCasesUser !== null && (
                <ViewCasesModal
                    user={USERS_DATA[viewCasesUser]}
                    onClose={() => setViewCasesUser(null)}
                />
            )}
            <div className="cases-page-header">
                <h1 className="cases-title">Users</h1>
                <button className="hubs-new-btn" onClick={() => setCreateOpen(true)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    NEW
                </button>
            </div>
            <div className="hubs-table">
                <div className="hubs-toolbar">
                    <div className="hubs-search">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="text" className="hubs-search-input" placeholder="Search users..."/>
                    </div>
                </div>
                <div className="users-table-head">
                    <span>NAME</span>
                    <span>USERNAME</span>
                    <span>CREATED DATE</span>
                    <span>TYPE</span>
                    <span>ROLE</span>
                    <span>ACTION</span>
                    <span>STATUS</span>
                </div>
                {USERS_DATA.map((u, i) => (
                    <div key={i} className="users-table-row">
                        <div className="users-name-cell">
                            <div className="users-avatar">{u.name[0]}</div>
                            <span className="cases-cell cases-title-cell">{u.name}</span>
                        </div>
                        <span className="cases-cell-muted">{u.username}</span>
                        <span className="cases-cell-muted">{u.createdDate}</span>
                        <span className="cases-cell">{u.type}</span>
                        <span className="cases-cell">{u.role}</span>
                        <div>
                            <button className="users-view-cases-btn" disabled={u.type === 'bot'} onClick={() => setViewCasesUser(i)}>View Cases</button>
                        </div>
                        <div>
                            <label className={`user-switch${u.type === 'bot' ? ' disabled' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={userStatuses[i] === 'Active'}
                                    disabled={u.type === 'bot'}
                                    onChange={() => setConfirmUser(i)}
                                />
                                <span className="user-switch-slider" />
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersView;
