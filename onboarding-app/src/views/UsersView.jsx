import { useState, useRef } from 'react';
import InfoBanner from '../components/InfoBanner';
import SearchableSelect from '../components/SearchableSelect';
import './EditUserView.css';

const USERS_DATA = [
    { id: 'CU-FE493B85F08789',  name: 'Ar Tanveer',        username: 'ar@caseactive.com',                      createdDate: '04/01/2026', status: 'Active', type: 'admin', role: 'admin' },
    { id: 'CU-B0T8A1E34CC8E',   name: 'Virtual Assistant', username: 'bot+ca-8c1e34cc8eaf81@caseactive.email', createdDate: '04/01/2026', status: 'Active', type: 'bot',   role: 'N/A' },
    { id: 'CU-AR1G0LDR0G3R01',  name: 'Gold Roger',        username: 'ar+1@caseactive.com',                    createdDate: '04/01/2026', status: 'Active', type: 'user',  role: 'client' },
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

const USER_SEARCH_TYPES = ['Email', 'Phone'];
const USER_ROLES        = ['clients', 'staff', 'admin'];

const NOTIF_GROUPS = [
    { label: 'Posts',    items: ['When a comment is added to Feed', 'When a post is added to Feed'] },
    { label: 'Events',   items: ['Event rsvp is requested from me', 'My event rsvp is answered'] },
    { label: 'Forms',    items: ['Form submission is requested from me', 'My form is submitted by someone'] },
    { label: 'Signs',    items: ['Signature submission is requested from me', 'My document is signed by someone'] },
    { label: 'Tasks',    items: ['When a comment is added to subtask', 'When a comment is added to task', 'Subtask is requested from me', 'Task is requested from me', 'My subtask is completed by someone', 'My task is completed by someone'] },
    { label: 'Invoices', items: ['Invoice submission is requested from me', 'My invoice is paid by someone'] },
];

const NAV_TABS = [
    {
        id: 'profile',
        label: 'Profile',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    },
    {
        id: 'custom',
        label: 'Custom Fields',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    },
    {
        id: 'intake',
        label: 'Intake Forms',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    },
];

/* ─── Shared ─── */

const CopyIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
);

const SectionHead = ({ label }) => (
    <div className="eu-section-head">
        <span className="ccm-section-label">{label}</span>
    </div>
);

/* ─── Tab content panels ─── */

const ProfileTab = ({ user }) => {
    const parts = user.name.split(' ');
    const [firstName, setFirstName] = useState(parts[0] || '');
    const [lastName,  setLastName]  = useState(parts.slice(1).join(' ') || '');
    const [dob,       setDob]       = useState('');
    const [gender,    setGender]    = useState('');
    const [phone,     setPhone]     = useState('');
    const [company,   setCompany]   = useState('');
    const [title,     setTitle]     = useState('');
    const [address,   setAddress]   = useState('');
    const [address2,  setAddress2]  = useState('');
    const [city,      setCity]      = useState('');
    const [stateVal,  setStateVal]  = useState('');
    const [country,   setCountry]   = useState('');
    const [zip,       setZip]       = useState('');
    const [language,  setLanguage]  = useState('English');
    const [timezone,  setTimezone]  = useState('Atlantic/Canary');
    const [toast,     setToast]     = useState(null);

    const copyId = async () => {
        try { await navigator.clipboard.writeText(user.id); } catch {}
        setToast('Copied!');
        setTimeout(() => setToast(null), 2000);
    };

    return (
        <>
            {toast && <div className="copy-toast">{toast}</div>}
            <div className="eu-note-banner">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Note: User can edit their account information from their account
            </div>

            <div className="eu-id-row">
                <span className="eu-user-id">{user.id}</span>
                <button className="eu-copy-btn" onClick={copyId} title="Copy ID"><CopyIcon /></button>
                <span className="eu-id-sep">|</span>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>User ID</span>
            </div>

            <div className="eu-sections">
                <div className="eu-section">
                    <SectionHead label="BASIC" />
                    <div className="ccm-grid-2">
                        <div className="ccm-field">
                            <label className="ccm-label">First Name</label>
                            <input className="ccm-input" value={firstName} onChange={e => setFirstName(e.target.value)} />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Last Name</label>
                            <input className="ccm-input" value={lastName} onChange={e => setLastName(e.target.value)} />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Date of Birth</label>
                            <input type="date" className="ccm-input" value={dob} onChange={e => setDob(e.target.value)} />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Gender</label>
                            <SearchableSelect className="ccm-select" value={gender} onChange={e => setGender(e.target.value)}>
                                <option value="">--</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer_not">Prefer not to say</option>
                            </SearchableSelect>
                        </div>
                    </div>
                </div>

                <div className="eu-section">
                    <SectionHead label="CONTACT" />
                    <div className="ccm-grid-2">
                        <div className="ccm-field">
                            <label className="ccm-label">Email</label>
                            <input className="ccm-input" value={user.username} readOnly />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Phone number</label>
                            <input className="ccm-input" value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="eu-section">
                    <SectionHead label="OCCUPATION" />
                    <div className="ccm-grid-2">
                        <div className="ccm-field">
                            <label className="ccm-label">Company Name</label>
                            <input className="ccm-input" value={company} onChange={e => setCompany(e.target.value)} />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Company Title</label>
                            <input className="ccm-input" value={title} onChange={e => setTitle(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="eu-section">
                    <SectionHead label="LOCATION" />
                    <div className="ccm-grid-3">
                        <div className="ccm-field">
                            <label className="ccm-label">Address</label>
                            <input className="ccm-input" value={address} onChange={e => setAddress(e.target.value)} />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Address 2</label>
                            <input className="ccm-input" value={address2} onChange={e => setAddress2(e.target.value)} />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">City/Locality</label>
                            <input className="ccm-input" value={city} onChange={e => setCity(e.target.value)} />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">State/Region</label>
                            <input className="ccm-input" value={stateVal} onChange={e => setStateVal(e.target.value)} />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Country</label>
                            <SearchableSelect className="ccm-select" value={country} onChange={e => setCountry(e.target.value)}>
                                <option value="">--</option>
                                <option value="us">United States</option>
                                <option value="ca">Canada</option>
                                <option value="gb">United Kingdom</option>
                                <option value="au">Australia</option>
                                <option value="in">India</option>
                                <option value="bd">Bangladesh</option>
                                <option value="de">Germany</option>
                                <option value="fr">France</option>
                            </SearchableSelect>
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Zip Postal Code</label>
                            <input className="ccm-input" value={zip} onChange={e => setZip(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="eu-section">
                    <SectionHead label="LANGUAGE & REGION" />
                    <div className="ccm-grid-2">
                        <div className="ccm-field">
                            <label className="ccm-label">Language</label>
                            <SearchableSelect className="ccm-select" value={language} onChange={e => setLanguage(e.target.value)}>
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>German</option>
                                <option>Portuguese</option>
                                <option>Arabic</option>
                                <option>Chinese (Simplified)</option>
                                <option>Japanese</option>
                            </SearchableSelect>
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Timezone</label>
                            <SearchableSelect className="ccm-select" value={timezone} onChange={e => setTimezone(e.target.value)}>
                                <option>Atlantic/Canary</option>
                                <option>America/New_York</option>
                                <option>America/Chicago</option>
                                <option>America/Denver</option>
                                <option>America/Los_Angeles</option>
                                <option>Europe/London</option>
                                <option>Europe/Paris</option>
                                <option>Asia/Tokyo</option>
                                <option>Asia/Dubai</option>
                                <option>Australia/Sydney</option>
                            </SearchableSelect>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

const CustomFieldsTab = () => {
    const [fieldValue, setFieldValue] = useState('Test 1');
    return (
        <>
            <div className="eu-sections">
                <div className="eu-section">
                    <SectionHead label="HUB ONLY CUSTOM FIELDS" />
                    <div className="ccm-field" style={{ maxWidth: 340 }}>
                        <label className="ccm-label">New form for user<span className="ccm-req"> *</span></label>
                        <SearchableSelect className="ccm-select" value={fieldValue} onChange={e => setFieldValue(e.target.value)}>
                            <option>Test 1</option>
                            <option>Test 2</option>
                        </SearchableSelect>
                    </div>
                </div>
            </div>
        </>
    );
};

const INTAKE_FORMS = [
    { name: 'Intake Form A', status: 'Incomplete' },
    { name: 'Intake Form B', status: 'Incomplete' },
];

const IntakeFormsTab = () => (
    <div className="eu-intake-grid-wrap">
        <div className="eu-intake-table-head">
            <span>NAME</span>
            <span>STATUS</span>
            <span>ACTION</span>
        </div>
        {INTAKE_FORMS.map((f, i) => (
            <div key={i} className="eu-intake-table-row">
                <span className="eu-intake-name">{f.name}</span>
                <span className={`eu-intake-status eu-intake-status--${f.status.toLowerCase()}`}>{f.status}</span>
                <div className="users-action-btns">
                    <button className="users-icon-btn" data-tooltip="View form">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button className="users-icon-btn eu-intake-delete-btn" data-tooltip="Delete form">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                </div>
            </div>
        ))}
    </div>
);

const SettingsTab = ({ user }) => {
    const [canCreate,  setCanCreate]  = useState('No');
    const [canAddAs,   setCanAddAs]   = useState('');
    const [canRemove,  setCanRemove]  = useState('No');
    const [userType,   setUserType]   = useState('User');
    const [userStatus, setUserStatus] = useState('Active');
    const [role,       setRole]       = useState(user.role === 'client' ? 'clients' : user.role);
    const [refId,      setRefId]      = useState('');
    const [notifs,     setNotifs]     = useState(
        NOTIF_GROUPS.flatMap(g => g.items).reduce((acc, item) => { acc[item] = true; return acc; }, {})
    );
    const toggleNotif = item => setNotifs(prev => ({ ...prev, [item]: !prev[item] }));

    return (
        <>
            <div className="eu-sections">
                <div className="eu-section">
                    <SectionHead label="CASE CREATION & PERMISSIONS" />
                    <div className="ccm-grid-3">
                        <div className="ccm-field">
                            <label className="ccm-label">Can create a case</label>
                            <SearchableSelect className="ccm-select" value={canCreate} onChange={e => setCanCreate(e.target.value)}>
                                <option>No</option><option>Yes</option>
                            </SearchableSelect>
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Can add a case user as</label>
                            <SearchableSelect className="ccm-select" value={canAddAs} onChange={e => setCanAddAs(e.target.value)}>
                                <option value="">--</option><option>Client</option><option>Staff</option>
                            </SearchableSelect>
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Can remove a case user</label>
                            <SearchableSelect className="ccm-select" value={canRemove} onChange={e => setCanRemove(e.target.value)}>
                                <option>No</option><option>Yes</option>
                            </SearchableSelect>
                        </div>
                    </div>
                </div>

                <div className="eu-section">
                    <SectionHead label="HOST USER ATTRIBUTES" />
                    <div className="ccm-grid-2">
                        <div className="ccm-field">
                            <label className="ccm-label">User Type</label>
                            <SearchableSelect className="ccm-select" value={userType} onChange={e => setUserType(e.target.value)}>
                                <option>User</option><option>Admin</option><option>Staff</option>
                            </SearchableSelect>
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">User Status</label>
                            <SearchableSelect className="ccm-select" value={userStatus} onChange={e => setUserStatus(e.target.value)}>
                                <option>Active</option><option>Inactive</option><option>Pending</option>
                            </SearchableSelect>
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Role</label>
                            <SearchableSelect className="ccm-select" value={role} onChange={e => setRole(e.target.value)}>
                                {USER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </SearchableSelect>
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Reference ID</label>
                            <input className="ccm-input" value={refId} onChange={e => setRefId(e.target.value)} />
                            <span className="ccm-hint">A permanent label to easily find a user. (a-z, 0-9, -, /) are allowed</span>
                        </div>
                    </div>
                </div>

                <div className="eu-section">
                    <SectionHead label="NOTIFICATIONS" />
                    <div className="eu-notif-groups">
                        {NOTIF_GROUPS.map(g => (
                            <div key={g.label} className="eu-notif-group">
                                <span className="eu-notif-group-label">{g.label}</span>
                                <div className="eu-notif-grid">
                                    {g.items.map(item => (
                                        <label key={item} className="eu-notif-item">
                                            <input type="checkbox" className="eu-notif-check" checked={notifs[item]} onChange={() => toggleNotif(item)} />
                                            <span>{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>
    );
};

/* ─── Edit User modal ─── */

const EditUserModal = ({ user, onClose }) => {
    const [tab, setTab] = useState('profile');

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm" style={{ maxWidth: 860, height: '86vh' }} onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Users › Edit User</p>
                        <h2 className="ccm-title">{user.name}</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>

                <div className="eu-modal-split">
                    {/* Left nav */}
                    <nav className="eu-left-nav">
                        {NAV_TABS.map(t => (
                            <button
                                key={t.id}
                                className={`eu-nav-tab${tab === t.id ? ' active' : ''}`}
                                onClick={() => setTab(t.id)}
                            >
                                {t.icon}
                                {t.label}
                            </button>
                        ))}
                    </nav>

                    {/* Right content */}
                    <div className="eu-right-content">
                        {tab === 'profile'  && <ProfileTab  user={user} />}
                        {tab === 'custom'   && <CustomFieldsTab />}
                        {tab === 'intake'   && <IntakeFormsTab />}
                        {tab === 'settings' && <SettingsTab user={user} />}
                    </div>
                </div>

                {/* Unified sticky footer */}
                <div className="eu-tab-footer">
                    <button className="ccm-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="ccm-save-btn">SAVE</button>
                </div>
            </div>
        </div>
    );
};

/* ─── Add User modal ─── */

const CreateUserModal = ({ onClose }) => {
    const [searchType, setSearchType]  = useState('Email');
    const [typeOpen,   setTypeOpen]    = useState(false);
    const [searchValue,setSearchValue] = useState('');
    const [firstName,  setFirstName]   = useState('');
    const [lastName,   setLastName]    = useState('');
    const [role,       setRole]        = useState('clients');
    const typeWrapRef = useRef(null);
    const [dropUp, setDropUp] = useState(false);

    const toggleTypeDropdown = () => {
        if (typeWrapRef.current) {
            const rect = typeWrapRef.current.getBoundingClientRect();
            setDropUp(window.innerHeight - rect.bottom < 220);
        }
        setTypeOpen(p => !p);
    };

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
                            <input type="text" className="ccm-assign-text-input" placeholder="Search value..."
                                value={searchValue} onChange={e => setSearchValue(e.target.value)} />
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
                        <SearchableSelect className="ccm-select" value={role} onChange={e => setRole(e.target.value)}>
                            {USER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </SearchableSelect>
                    </div>
                </div>
                <div className="ccm-footer">
                    <button className="ccm-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="ccm-save-btn" disabled={!searchValue.trim()}>SAVE</button>
                </div>
                <div className="ccm-user-bottom">
                    Have many users? <button className="ccm-link">Import users</button> or <button className="ccm-link">Send them a signup link.</button>
                </div>
            </div>
        </div>
    );
};

/* ─── Confirm status modal ─── */

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

/* ─── View Cases modal ─── */

const ViewCasesModal = ({ user, onClose }) => {
    const [cases, setCases] = useState(USER_CASES[user.id] || []);
    const [toast, setToast] = useState(null);

    const copyToClipboard = async (text) => {
        try { await navigator.clipboard.writeText(text); } catch {}
        setToast('Copied to clipboard');
        setTimeout(() => setToast(null), 2000);
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
                        <span>CASE ID</span><span>STATUS</span><span>ROLE</span><span>ACTION</span>
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
                            <button className="view-cases-delete" onClick={() => setCases(prev => prev.filter((_, j) => j !== i))}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ─── Main UsersView ─── */

const UsersView = ({ createOpen = false, onCloseCreate }) => {
    const [userStatuses, setUserStatuses] = useState(USERS_DATA.map(u => u.status));
    const [confirmUser,  setConfirmUser]  = useState(null);
    const [viewCasesUser,setViewCasesUser]= useState(null);
    const [editingUser,  setEditingUser]  = useState(null);

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
            {createOpen && <CreateUserModal onClose={onCloseCreate} />}
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
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                />
            )}

            <InfoBanner message="Users are the people who have access to your Hub. Invite clients, team members, and collaborators, and assign them roles and permissions." />

            <div className="hubs-table">
                <div className="hubs-toolbar">
                    <div className="hubs-search">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="text" className="hubs-search-input" placeholder="Search users..." />
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
                            <div className="eu-avatar-wrap">
                                <div className={`users-avatar${u.role === 'client' ? ' eu-avatar-client' : ''}`}>{u.name[0]}</div>
                            </div>
                            <span className="cases-cell cases-title-cell">{u.name}</span>
                        </div>
                        <span className="cases-cell-muted">{u.username}</span>
                        <span className="cases-cell-muted">{u.createdDate}</span>
                        <span className="cases-cell">{u.type}</span>
                        <span className="cases-cell">{u.role}</span>
                        <div className="users-action-btns">
                            {u.role === 'client' ? (
                                <button className="users-icon-btn eu-edit-client-btn" data-tooltip="Edit client profile" onClick={() => setEditingUser(u)}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                </button>
                            ) : (
                                <div style={{ width: 30 }} />
                            )}
                            <button className="users-icon-btn" disabled={u.type === 'bot'} data-tooltip="View Cases" onClick={() => setViewCasesUser(i)}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                            </button>
                        </div>
                        <div>
                            <label className={`user-switch${u.type === 'bot' ? ' disabled' : ''}`}>
                                <input type="checkbox" checked={userStatuses[i] === 'Active'} disabled={u.type === 'bot'} onChange={() => setConfirmUser(i)} />
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
