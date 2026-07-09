import { useState, useRef } from 'react';
import InfoBanner from '../components/InfoBanner';
import SearchableSelect from '../components/SearchableSelect';

const CASES_DATA = [
    { title: 'Welcome! Here is a Sample Case',     id: 'cc-64fc9cf315526b', createdOn: '04/01/2026', status: 'Active',  type: 'General',        team: ['J', 'S'] },
    { title: 'Rear-End Collision — Downtown LA',   id: 'cc-a1b2c3d4e56789', createdOn: '04/01/2026', status: 'Active',  type: 'Auto Accident',  team: ['J'] },
    { title: 'Slip and Fall — Westfield Mall',     id: 'cc-b3c4d5e6f78901', createdOn: '03/22/2026', status: 'Active',  type: 'Personal Injury', team: ['S', 'M'] },
    { title: 'Workers Comp — Martinez, Jose',      id: 'cc-c5d6e7f8091234', createdOn: '03/15/2026', status: 'Active',  type: 'Workers Comp',   team: ['M'] },
    { title: 'Medical Malpractice — Dr. Kim Clinic', id: 'cc-d7e8f9a0123456', createdOn: '03/10/2026', status: 'Active', type: 'Malpractice',   team: ['J', 'S', 'M'] },
];

const SEARCH_TYPES = ['Email', 'Phone', 'Host Default Role', 'Given name', 'Family name'];

const ASSIGNABLE_USERS = [
    { id: 'u-001', name: 'Jordan Admin',  email: 'jordan@firm.com',  role: 'Attorney'  },
    { id: 'u-002', name: 'Sara Chen',     email: 'sara@firm.com',    role: 'Paralegal' },
    { id: 'u-003', name: 'Mike Torres',   email: 'mike@firm.com',    role: 'Associate' },
    { id: 'u-004', name: 'Priya Kapoor',  email: 'priya@firm.com',   role: 'Attorney'  },
    { id: 'u-005', name: 'Chris Lee',     email: 'chris@firm.com',   role: 'Paralegal' },
];

const CASE_TYPES = ['General', 'Auto Accident', 'Personal Injury', 'Workers Comp', 'Malpractice'];
const CASE_STATUSES = ['Active', 'Pending', 'Closed'];

const EditCaseModal = ({ caseData, onClose, onSave }) => {
    const truncateId = (id) => {
        if (!id || id.length <= 8) return id;
        return id.slice(0, 2) + '...' + id.slice(-2);
    };

    const makeInitialAssigned = () => caseData.team.map((initial, index) => {
        const user = ASSIGNABLE_USERS.find(u => u.name[0].toUpperCase() === initial);
        return user
            ? { ...user, assignedRole: index === 0 ? 'Staff' : 'Client' }
            : { id: `team-${caseData.id}-${initial}-${index}`, name: `${initial} Team Member`, email: `${initial.toLowerCase()}@firm.com`, role: 'Staff', assignedRole: 'Staff' };
    });

    const [title, setTitle] = useState(caseData.title);
    const [tagId, setTagId] = useState(caseData.id.replace(/^cc-/, ''));
    const [description, setDescription] = useState(caseData.description || '');
    const [createdOn, setCreatedOn] = useState(caseData.createdOn);
    const [status, setStatus] = useState(caseData.status);
    const [type, setType] = useState(caseData.type);
    const [assigned, setAssigned] = useState(makeInitialAssigned);
    const [assignOpen, setAssignOpen] = useState(false);
    const [searchType, setSearchType] = useState('Email');
    const [typeOpen, setTypeOpen] = useState(false);
    const [dropUp, setDropUp] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [suggestOpen, setSuggestOpen] = useState(false);
    const [pendingUser, setPendingUser] = useState(null);
    const [pendingRole, setPendingRole] = useState('');
    const typeWrapRef = useRef(null);

    const suggestions = ASSIGNABLE_USERS.filter(u =>
        !assigned.find(a => a.id === u.id) && emailInput.length > 0 && (
            searchType === 'Email'        ? u.email.toLowerCase().includes(emailInput.toLowerCase()) :
            searchType === 'Given name'   ? u.name.split(' ')[0].toLowerCase().includes(emailInput.toLowerCase()) :
            searchType === 'Family name'  ? (u.name.split(' ')[1] || '').toLowerCase().includes(emailInput.toLowerCase()) :
            u.name.toLowerCase().includes(emailInput.toLowerCase())
        )
    );

    const toggleTypeDropdown = () => {
        if (typeWrapRef.current) {
            const rect = typeWrapRef.current.getBoundingClientRect();
            setDropUp(window.innerHeight - rect.bottom < 220);
        }
        setTypeOpen(p => !p);
    };

    const canConfirm = (pendingUser || emailInput.trim().length > 0) && pendingRole;
    const canSave = title.trim() && tagId.trim() && createdOn.trim() && status && type;

    const confirmAdd = () => {
        if (!canConfirm) return;
        const user = pendingUser || { id: `u-${Date.now()}`, name: emailInput, email: emailInput, role: pendingRole };
        setAssigned(prev => [...prev, { ...user, assignedRole: pendingRole }]);
        setEmailInput('');
        setPendingUser(null);
        setPendingRole('');
    };

    const removeUser = (id) => setAssigned(prev => prev.filter(u => u.id !== id));
    const updateRole = (id, role) => setAssigned(prev => prev.map(u => u.id === id ? { ...u, assignedRole: role } : u));

    const save = () => {
        if (!canSave) return;
        onSave({
            ...caseData,
            title: title.trim(),
            id: `cc-${tagId.trim().replace(/^cc-/, '')}`,
            createdOn: createdOn.trim(),
            status,
            type,
            team: assigned.map(user => user.name[0].toUpperCase()),
            description: description.trim(),
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Cases &gt; Edit Case</p>
                        <h2 className="ccm-title">Edit Case</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose} aria-label="Close edit case modal">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="ccm-import-hint">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    Update case details, status, type, and assigned users from one place.
                </div>

                <div className="ccm-body">
                    <div className="ccm-section-label">Case Information</div>

                    <div className="ccm-grid-2">
                        <div className="ccm-field">
                            <label className="ccm-label">Case Title <span className="ccm-req">*</span></label>
                            <input type="text" className="ccm-input" value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Tag ID <span className="ccm-req">*</span></label>
                            <input type="text" className="ccm-input" value={tagId} onChange={e => setTagId(e.target.value)} />
                            <span className="ccm-hint">Permanent label. (a-z, 0-9, -, /) allowed.</span>
                        </div>
                    </div>

                    <div className="ccm-field">
                        <label className="ccm-label">Description</label>
                        <textarea
                            className="ccm-textarea"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Brief description of the case, parties involved, and key facts..."
                        />
                    </div>

                    <div className="ccm-grid-3">
                        <div className="ccm-field">
                            <label className="ccm-label">Date Opened <span className="ccm-req">*</span></label>
                            <input type="text" className="ccm-input" value={createdOn} onChange={e => setCreatedOn(e.target.value)} placeholder="MM/DD/YYYY" />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Case Status <span className="ccm-req">*</span></label>
                            <SearchableSelect className="ccm-select" value={status} onChange={e => setStatus(e.target.value)}>
                                {CASE_STATUSES.map(option => <option key={option}>{option}</option>)}
                            </SearchableSelect>
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Case Type <span className="ccm-req">*</span></label>
                            <SearchableSelect className="ccm-select" value={type} onChange={e => setType(e.target.value)}>
                                {CASE_TYPES.map(option => <option key={option}>{option}</option>)}
                            </SearchableSelect>
                        </div>
                    </div>

                    <div className="ccm-divider" />
                    <div className="ccm-assign-header">
                        <div className="ccm-section-label">Assigned Users</div>
                        <button className="ccm-assign-btn" onClick={() => setAssignOpen(p => !p)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Assign Users
                        </button>
                    </div>

                    {assignOpen && (
                        <div className="ccm-assign-form">
                            <div className="ccm-assign-row">
                                <div className="ccm-assign-user-field">
                                    <label className="ccm-label">User <span className="ccm-req">*</span></label>
                                    <div className="ccm-assign-input-wrap">
                                        <div className="ccm-search-type-wrap" ref={typeWrapRef}>
                                            <button className="ccm-search-type-btn" onClick={toggleTypeDropdown}>
                                                {searchType}
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                                            </button>
                                            {typeOpen && (
                                                <div className={`ccm-type-dropdown${dropUp ? ' drop-up' : ''}`}>
                                                    {SEARCH_TYPES.map(t => (
                                                        <button key={t} className={`ccm-type-option${searchType === t ? ' active' : ''}`}
                                                            onClick={() => { setSearchType(t); setTypeOpen(false); setEmailInput(''); setPendingUser(null); }}>
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
                                                placeholder={`Type user ${searchType.toLowerCase()}...`}
                                                value={emailInput}
                                                onChange={e => { setEmailInput(e.target.value); setSuggestOpen(true); setPendingUser(null); }}
                                                onFocus={() => setSuggestOpen(true)}
                                                onBlur={() => setTimeout(() => setSuggestOpen(false), 150)}
                                            />
                                            {suggestOpen && suggestions.length > 0 && (
                                                <div className="ccm-suggest-dropdown">
                                                    {suggestions.map(u => (
                                                        <button key={u.id} className="ccm-user-option" onMouseDown={() => { setPendingUser(u); setEmailInput(u.email); setSuggestOpen(false); }}>
                                                            <div className="ccm-user-option-avatar">{u.name[0]}</div>
                                                            <div className="ccm-user-option-info">
                                                                <span className="ccm-user-option-name">{u.name}</span>
                                                                <span className="ccm-user-option-email">{u.email}</span>
                                                            </div>
                                                            <span className="ccm-user-option-role">{u.role}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="ccm-assign-role-field">
                                    <label className="ccm-label">Role <span className="ccm-req">*</span></label>
                                    <SearchableSelect className="ccm-select" value={pendingRole} onChange={e => setPendingRole(e.target.value)}>
                                        <option value="">Select role</option>
                                        <option>Client</option>
                                        <option>Staff</option>
                                    </SearchableSelect>
                                </div>
                                <div className="ccm-confirm-wrap">
                                    <label className="ccm-label">&nbsp;</label>
                                    <button className="ccm-confirm-btn" disabled={!canConfirm} onClick={confirmAdd}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="ccm-users-table">
                        <div className="ccm-users-head">
                            <span>User ID</span>
                            <span>Name</span>
                            <span>Email</span>
                            <span>Role</span>
                            <span>Action</span>
                        </div>
                        {assigned.length === 0 ? (
                            <div className="ccm-users-empty">No users assigned yet. Search above to add.</div>
                        ) : assigned.map(u => (
                            <div key={u.id} className="ccm-users-row">
                                <span className="ccm-user-id">{truncateId(u.id)}</span>
                                <span className="ccm-user-name">{u.name}</span>
                                <span className="ccm-user-email">{u.email}</span>
                                <SearchableSelect className="ccm-role-select" value={u.assignedRole} onChange={e => updateRole(u.id, e.target.value)}>
                                    <option value="">Select role</option>
                                    <option>Client</option>
                                    <option>Staff</option>
                                </SearchableSelect>
                                <button className="ccm-remove-btn" onClick={() => removeUser(u.id)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="ccm-footer">
                    <button className="ccm-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="ccm-save-btn" disabled={!canSave} onClick={save}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

const CreateCaseModal = ({ onClose }) => {
    const truncateId = (id) => {
        if (!id || id.length <= 8) return id;
        return id.slice(0, 2) + '...' + id.slice(-2);
    };

    const [assigned, setAssigned]       = useState([]);
    const [assignOpen, setAssignOpen]   = useState(false);
    const [searchType, setSearchType]   = useState('Email');
    const [typeOpen, setTypeOpen]       = useState(false);
    const [dropUp, setDropUp]           = useState(false);
    const [emailInput, setEmailInput]   = useState('');
    const [suggestOpen, setSuggestOpen] = useState(false);
    const [pendingUser, setPendingUser] = useState(null);
    const [pendingRole, setPendingRole] = useState('');
    const typeWrapRef = useRef(null);

    const suggestions = ASSIGNABLE_USERS.filter(u =>
        !assigned.find(a => a.id === u.id) && emailInput.length > 0 && (
            searchType === 'Email'        ? u.email.toLowerCase().includes(emailInput.toLowerCase()) :
            searchType === 'Given name'   ? u.name.split(' ')[0].toLowerCase().includes(emailInput.toLowerCase()) :
            searchType === 'Family name'  ? (u.name.split(' ')[1] || '').toLowerCase().includes(emailInput.toLowerCase()) :
            u.name.toLowerCase().includes(emailInput.toLowerCase())
        )
    );

    const toggleTypeDropdown = () => {
        if (typeWrapRef.current) {
            const rect = typeWrapRef.current.getBoundingClientRect();
            setDropUp(window.innerHeight - rect.bottom < 220);
        }
        setTypeOpen(p => !p);
    };

    const canConfirm = (pendingUser || emailInput.trim().length > 0) && pendingRole;

    const confirmAdd = () => {
        if (!canConfirm) return;
        const user = pendingUser || { id: `u-${Date.now()}`, name: emailInput, email: emailInput, role: pendingRole };
        setAssigned(prev => [...prev, { ...user, assignedRole: pendingRole }]);
        setEmailInput(''); setPendingUser(null); setPendingRole('');
    };
    const removeUser = (id) => setAssigned(prev => prev.filter(u => u.id !== id));
    const updateRole = (id, role) => setAssigned(prev => prev.map(u => u.id === id ? { ...u, assignedRole: role } : u));

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Cases &gt; Create Case</p>
                        <h2 className="ccm-title">Create New Case</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="ccm-import-hint">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Have many cases?&nbsp;<button className="ccm-link">Click here to import cases.</button>
                </div>

                <div className="ccm-body">
                    <div className="ccm-section-label">Case Information</div>

                    <div className="ccm-grid-2">
                        <div className="ccm-field">
                            <label className="ccm-label">Case Title <span className="ccm-req">*</span></label>
                            <input type="text" className="ccm-input" placeholder="Enter case title" />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Tag ID <span className="ccm-req">*</span></label>
                            <input type="text" className="ccm-input" placeholder="e.g. rear-end-2026" />
                            <span className="ccm-hint">Permanent label. (a–z, 0–9, -, /) allowed.</span>
                        </div>
                    </div>

                    <div className="ccm-field">
                        <label className="ccm-label">Description</label>
                        <textarea className="ccm-textarea" placeholder="Brief description of the case, parties involved, and key facts..." />
                    </div>

                    <div className="ccm-grid-3">
                        <div className="ccm-field">
                            <label className="ccm-label">Date Opened <span className="ccm-req">*</span></label>
                            <input type="date" className="ccm-input" defaultValue="2026-05-03" />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Case Status <span className="ccm-req">*</span></label>
                            <SearchableSelect className="ccm-select">
                                <option value="">Select status</option>
                                <option>Active</option>
                                <option>Pending</option>
                                <option>Closed</option>
                            </SearchableSelect>
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Case Type <span className="ccm-req">*</span></label>
                            <SearchableSelect className="ccm-select">
                                <option value="">Select type</option>
                                <option>General</option>
                                <option>Auto Accident</option>
                                <option>Personal Injury</option>
                                <option>Workers Comp</option>
                                <option>Malpractice</option>
                            </SearchableSelect>
                        </div>
                    </div>

                    <div className="ccm-divider" />
                    <div className="ccm-assign-header">
                        <div className="ccm-section-label">Assigned Users</div>
                        <button className="ccm-assign-btn" onClick={() => setAssignOpen(p => !p)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Assign Users
                        </button>
                    </div>

                    {assignOpen && (
                        <div className="ccm-assign-form">
                            <div className="ccm-assign-row">
                                <div className="ccm-assign-user-field">
                                    <label className="ccm-label">User <span className="ccm-req">*</span></label>
                                    <div className="ccm-assign-input-wrap">
                                        <div className="ccm-search-type-wrap" ref={typeWrapRef}>
                                            <button className="ccm-search-type-btn" onClick={toggleTypeDropdown}>
                                                {searchType}
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                                            </button>
                                            {typeOpen && (
                                                <div className={`ccm-type-dropdown${dropUp ? ' drop-up' : ''}`}>
                                                    {SEARCH_TYPES.map(t => (
                                                        <button key={t} className={`ccm-type-option${searchType === t ? ' active' : ''}`}
                                                            onClick={() => { setSearchType(t); setTypeOpen(false); setEmailInput(''); setPendingUser(null); }}>
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
                                                placeholder={`Type user ${searchType.toLowerCase()}...`}
                                                value={emailInput}
                                                onChange={e => { setEmailInput(e.target.value); setSuggestOpen(true); setPendingUser(null); }}
                                                onFocus={() => setSuggestOpen(true)}
                                                onBlur={() => setTimeout(() => setSuggestOpen(false), 150)}
                                            />
                                            {suggestOpen && suggestions.length > 0 && (
                                                <div className="ccm-suggest-dropdown">
                                                    {suggestions.map(u => (
                                                        <button key={u.id} className="ccm-user-option" onMouseDown={() => { setPendingUser(u); setEmailInput(u.email); setSuggestOpen(false); }}>
                                                            <div className="ccm-user-option-avatar">{u.name[0]}</div>
                                                            <div className="ccm-user-option-info">
                                                                <span className="ccm-user-option-name">{u.name}</span>
                                                                <span className="ccm-user-option-email">{u.email}</span>
                                                            </div>
                                                            <span className="ccm-user-option-role">{u.role}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="ccm-assign-role-field">
                                    <label className="ccm-label">Role <span className="ccm-req">*</span></label>
                                    <SearchableSelect className="ccm-select" value={pendingRole} onChange={e => setPendingRole(e.target.value)}>
                                        <option value="">Select role</option>
                                        <option>Client</option>
                                        <option>Staff</option>
                                    </SearchableSelect>
                                </div>
                                <div className="ccm-confirm-wrap">
                                    <label className="ccm-label">&nbsp;</label>
                                    <button className="ccm-confirm-btn" disabled={!canConfirm} onClick={confirmAdd}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="ccm-users-table">
                        <div className="ccm-users-head">
                            <span>User ID</span>
                            <span>Name</span>
                            <span>Email</span>
                            <span>Role</span>
                            <span>Action</span>
                        </div>
                        {assigned.length === 0 ? (
                            <div className="ccm-users-empty">No users assigned yet. Search above to add.</div>
                        ) : assigned.map(u => (
                            <div key={u.id} className="ccm-users-row">
                                <span className="ccm-user-id">{truncateId(u.id)}</span>
                                <span className="ccm-user-name">{u.name}</span>
                                <span className="ccm-user-email">{u.email}</span>
                                <SearchableSelect
                                    className="ccm-role-select"
                                    value={u.assignedRole}
                                    onChange={e => updateRole(u.id, e.target.value)}
                                >
                                    <option value="">Select role</option>
                                    <option>Client</option>
                                    <option>Staff</option>
                                </SearchableSelect>
                                <button className="ccm-remove-btn" onClick={() => removeUser(u.id)}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="ccm-footer">
                    <button className="ccm-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="ccm-save-btn">Save Case</button>
                </div>
            </div>
        </div>
    );
};

const DeleteCaseModal = ({ caseData, onCancel, onConfirm }) => (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="case-delete-modal" onClick={e => e.stopPropagation()}>
            <div className="case-delete-header">
                <h2>Delete Case</h2>
                <button className="case-delete-close" onClick={onCancel} aria-label="Close delete case modal">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="case-delete-body">
                <p>
                    You are about to delete this case. It may take some time before the same reference ID
                    can be reused. Are you sure you want to proceed?
                </p>
                <div className="case-delete-meta">
                    <span>{caseData.title}</span>
                    <strong>{caseData.id}</strong>
                </div>
            </div>
            <div className="case-delete-footer">
                <button className="case-delete-cancel" onClick={onCancel}>Cancel</button>
                <button className="case-delete-confirm" onClick={onConfirm}>YES</button>
            </div>
        </div>
    </div>
);

const CloseCaseModal = ({ caseData, onCancel, onConfirm }) => (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="case-delete-modal" onClick={e => e.stopPropagation()}>
            <div className="case-delete-header">
                <h2>Close Case</h2>
                <button className="case-delete-close" onClick={onCancel} aria-label="Close close case modal">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="case-delete-body">
                <p>
                    You are about to close this case. Clients and team members will see this case
                    as closed after you confirm. Are you sure you want to proceed?
                </p>
                <div className="case-delete-meta">
                    <span>{caseData.title}</span>
                    <strong>{caseData.id}</strong>
                </div>
            </div>
            <div className="case-delete-footer">
                <button className="case-delete-cancel" onClick={onCancel}>Cancel</button>
                <button className="case-delete-confirm" onClick={onConfirm}>YES</button>
            </div>
        </div>
    </div>
);

const CasesView = ({ createOpen = false, onCloseCreate }) => {
    const [openTab, setOpenTab] = useState('Active');
    const [popoverIdx, setPopoverIdx] = useState(null);
    const [cases, setCases] = useState(CASES_DATA);
    const [editingCase, setEditingCase] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [closeTarget, setCloseTarget] = useState(null);

    const updateCase = (updatedCase) => {
        setCases(prev => prev.map(item => item.id === updatedCase.id ? updatedCase : item));
    };

    const deleteCase = () => {
        if (!deleteTarget) return;
        setCases(prev => prev.filter(item => item.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    const closeCase = () => {
        if (!closeTarget) return;
        setCases(prev => prev.map(item => item.id === closeTarget.id ? { ...item, status: 'Closed' } : item));
        setCloseTarget(null);
    };

    return (
        <div className="cases-view">
            {createOpen && <CreateCaseModal onClose={onCloseCreate} />}
            {editingCase && (
                <EditCaseModal
                    caseData={editingCase}
                    onClose={() => setEditingCase(null)}
                    onSave={updateCase}
                />
            )}
            {deleteTarget && (
                <DeleteCaseModal
                    caseData={deleteTarget}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={deleteCase}
                />
            )}
            {closeTarget && (
                <CloseCaseModal
                    caseData={closeTarget}
                    onCancel={() => setCloseTarget(null)}
                    onConfirm={closeCase}
                />
            )}
            <InfoBanner message="Cases let you organize and track legal matters for your clients. Each case contains documents, tasks, timeline events, and communication history." />
            <div className="cases-top-tabs">
                {['Active', 'Closed'].map(t => (
                    <button key={t} className={`cases-top-tab${openTab === t ? ' active' : ''}`} onClick={() => setOpenTab(t)}>{t}</button>
                ))}
            </div>
            <div className="hubs-table">
                <div className="hubs-toolbar">
                    <div className="hubs-search">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="text" className="hubs-search-input" placeholder="Search cases..."/>
                    </div>
                </div>
                <div className="cases-table-head">
                    <span>TITLE</span>
                    <span>CASE ID</span>
                    <span>TEAM</span>
                    <span>CREATED ON</span>
                    <span>CASE STATUS</span>
                    <span>CASE TYPE</span>
                    <span>ACTION</span>
                </div>
                {cases.map((c, i) => (
                    <div key={i} className="cases-table-row">
                        <span className="cases-cell cases-title-cell" data-label="Title">{c.title}</span>
                        <span className="cases-cell-muted cases-id-text" data-label="Case ID">{c.id}</span>
                        <span data-label="Team">
                            <div className="cases-team-cell">
                                {c.team.map((initial, ti) => (
                                    <div key={ti} className="cases-team-pip" style={{ zIndex: c.team.length - ti }}>{initial}</div>
                                ))}
                            </div>
                        </span>
                        <span className="cases-cell-muted" data-label="Created On">{c.createdOn}</span>
                        <span className="cases-cell" data-label="Status">{c.status}</span>
                        <span className="cases-cell" data-label="Type">{c.type}</span>
                        <span data-label="Action">
                            <div className="cases-action-group">
                                <button className="cases-icon-btn edit" title="Edit" onClick={() => setEditingCase(c)}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                                <button className="cases-icon-btn delete" title="Delete" onClick={() => setDeleteTarget(c)}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                </button>
                                <div className="cases-more-wrap">
                                    <button className="cases-icon-btn more" title="More" onClick={() => setPopoverIdx(popoverIdx === i ? null : i)}>
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>
                                    </button>
                                    {popoverIdx === i && (
                                        <div className="cases-popover">
                                            <button className="cases-popover-item" onClick={() => setPopoverIdx(null)}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                                Clone Case
                                            </button>
                                            <button className="cases-popover-item danger" onClick={() => { setCloseTarget(c); setPopoverIdx(null); }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                                                Close Case
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CasesView;
