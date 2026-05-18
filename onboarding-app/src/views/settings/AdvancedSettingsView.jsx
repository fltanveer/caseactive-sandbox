import { useState } from 'react';

/* ── Reusable Toggle ── */
const Toggle = ({ value, onChange }) => (
    <button
        type="button"
        className={`as-toggle${value ? ' on' : ''}`}
        onClick={() => onChange(!value)}
        aria-pressed={value}
    >
        <span className="as-toggle-knob" />
    </button>
);

/* ── Tab Button ── */
const Tab = ({ label, active, onClick }) => (
    <button className={`as-tab${active ? ' active' : ''}`} onClick={onClick}>
        {label}
    </button>
);

/* ── Modules Tab ── */
const MODULES_DATA = [
    { id: 'case',    label: 'Case',     description: 'Manage case files and workflows', icon: '📁' },
    { id: 'convos',  label: 'Convos',   description: 'Client and team messaging', icon: '💬' },
    { id: 'events',  label: 'Events',   description: 'Calendar and event management', icon: '📅' },
    { id: 'posts',   label: 'Posts',    description: 'Announcements and feed updates', icon: '📝' },
    { id: 'forms',   label: 'Forms',    description: 'Custom intake and data forms', icon: '📋' },
    { id: 'invoices',label: 'Invoices', description: 'Billing and payment tracking', icon: '💳' },
    { id: 'notes',   label: 'Notes',    description: 'Case notes and documentation', icon: '📌' },
    { id: 'esigns',  label: 'E-Signs',  description: 'Electronic signature requests', icon: '✍️' },
    { id: 'tasks',   label: 'Tasks',    description: 'Task assignments and tracking', icon: '✅' },
    { id: 'team',    label: 'Team',     description: 'Team collaboration tools', icon: '👥' },
];

const ModulesTab = () => {
    const [modules, setModules] = useState(() => {
        const initial = {};
        MODULES_DATA.forEach(m => initial[m.id] = true);
        return initial;
    });
    const [saved, setSaved] = useState(false);

    const toggle = (id) => {
        setModules(prev => ({ ...prev, [id]: !prev[id] }));
        setSaved(false);
    };

    const allEnabled = Object.values(modules).every(Boolean);
    const toggleAll = () => {
        const next = {};
        MODULES_DATA.forEach(m => next[m.id] = !allEnabled);
        setModules(next);
        setSaved(false);
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const enabledCount = Object.values(modules).filter(Boolean).length;

    return (
        <div className="as-tab-panel">
            <div className="as-panel-header">
                <div className="as-panel-title-wrap">
                    <h2 className="as-panel-title">Modules</h2>
                    <p className="as-panel-subtitle">{enabledCount} of {MODULES_DATA.length} modules enabled</p>
                </div>
                <button className="as-text-btn" onClick={toggleAll}>
                    {allEnabled ? 'Disable All' : 'Enable All'}
                </button>
            </div>

            <div className="as-modules-grid">
                {MODULES_DATA.map(m => (
                    <div key={m.id} className={`as-module-card${modules[m.id] ? ' enabled' : ''}`}>
                        <div className="as-module-card-top">
                            <span className="as-module-icon">{m.icon}</span>
                            <Toggle value={modules[m.id]} onChange={() => toggle(m.id)} />
                        </div>
                        <div className="as-module-card-body">
                            <h3 className="as-module-name">{m.label}</h3>
                            <p className="as-module-desc">{m.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="as-panel-footer">
                <button className="as-primary-btn" onClick={handleSave}>
                    {saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

/* ── Roles Tab ── */
const ROLES_DATA = [
    { id: 1, name: 'Bots',   type: 'System', users: 2,  color: '#6366F1' },
    { id: 2, name: 'Clients',type: 'System', users: 48, color: '#10B981' },
    { id: 3, name: 'Staff',  type: 'System', users: 12, color: '#F59E0B' },
    { id: 4, name: 'Admin',  type: 'System', users: 3,  color: '#EF4444' },
    { id: 5, name: 'Paralegal', type: 'Custom', users: 5, color: '#8B5CF6' },
    { id: 6, name: 'Associate', type: 'Custom', users: 4, color: '#EC4899' },
];

const RolesTab = () => {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [openMenu, setOpenMenu] = useState(null);

    const filtered = ROLES_DATA.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'All' || r.type === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="as-tab-panel">
            <div className="as-panel-header">
                <div className="as-panel-title-wrap">
                    <h2 className="as-panel-title">Roles</h2>
                    <p className="as-panel-subtitle">Manage permissions and access levels</p>
                </div>
                <button className="as-primary-btn as-btn-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    New Role
                </button>
            </div>

            <div className="as-toolbar">
                <div className="as-search-wrap">
                    <svg className="as-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input
                        className="as-search-input"
                        placeholder="Search roles..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="as-filter-pills">
                    {['All', 'System', 'Custom'].map(f => (
                        <button key={f} className={`as-filter-pill${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="as-table-wrap">
                <table className="as-table">
                    <thead>
                        <tr>
                            <th>Role</th>
                            <th>Type</th>
                            <th>Users</th>
                            <th style={{ width: 48 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(r => (
                            <tr key={r.id}>
                                <td>
                                    <div className="as-role-cell">
                                        <span className="as-role-dot" style={{ background: r.color }} />
                                        <span className="as-role-name">{r.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`as-badge${r.type === 'System' ? ' system' : ' custom'}`}>{r.type}</span>
                                </td>
                                <td className="as-table-num">{r.users}</td>
                                <td>
                                    <div className="as-action-menu-wrap">
                                        <button className="as-action-btn" onClick={() => setOpenMenu(openMenu === r.id ? null : r.id)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                                        </button>
                                        {openMenu === r.id && (
                                            <div className="as-action-dropdown">
                                                <button onClick={() => setOpenMenu(null)}>Edit</button>
                                                <button onClick={() => setOpenMenu(null)}>Duplicate</button>
                                                <button className="danger" onClick={() => setOpenMenu(null)}>Delete</button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

/* ── Locations Tab ── */
const LocationsTab = () => {
    const [locations, setLocations] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [form, setForm] = useState({ name: '', address: '', city: '', state: '', zip: '' });

    const addLocation = () => {
        if (!form.name.trim()) return;
        setLocations([...locations, { ...form, id: Date.now() }]);
        setForm({ name: '', address: '', city: '', state: '', zip: '' });
        setShowAdd(false);
    };

    return (
        <div className="as-tab-panel">
            <div className="as-panel-header">
                <div className="as-panel-title-wrap">
                    <h2 className="as-panel-title">Office Locations</h2>
                    <p className="as-panel-subtitle">Manage your firm&apos;s physical offices</p>
                </div>
                <button className="as-primary-btn as-btn-sm" onClick={() => setShowAdd(true)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Add Location
                </button>
            </div>

            {showAdd && (
                <div className="as-card as-form-card">
                    <h3 className="as-card-title">New Location</h3>
                    <div className="as-form-grid">
                        <div className="as-form-field">
                            <label>Location Name</label>
                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Downtown Office" />
                        </div>
                        <div className="as-form-field">
                            <label>Street Address</label>
                            <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="123 Main St" />
                        </div>
                        <div className="as-form-field">
                            <label>City</label>
                            <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="New York" />
                        </div>
                        <div className="as-form-field">
                            <label>State</label>
                            <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="NY" />
                        </div>
                        <div className="as-form-field">
                            <label>ZIP Code</label>
                            <input value={form.zip} onChange={e => setForm({ ...form, zip: e.target.value })} placeholder="10001" />
                        </div>
                    </div>
                    <div className="as-form-actions">
                        <button className="as-text-btn" onClick={() => setShowAdd(false)}>Cancel</button>
                        <button className="as-primary-btn as-btn-sm" onClick={addLocation}>Add Location</button>
                    </div>
                </div>
            )}

            {locations.length === 0 ? (
                <div className="as-empty-state">
                    <div className="as-empty-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <h3 className="as-empty-title">No locations yet</h3>
                    <p className="as-empty-desc">Add your first office location to get started.</p>
                    <button className="as-primary-btn as-btn-sm" onClick={() => setShowAdd(true)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Add Location
                    </button>
                </div>
            ) : (
                <div className="as-locations-grid">
                    {locations.map(loc => (
                        <div key={loc.id} className="as-location-card">
                            <div className="as-location-card-top">
                                <h4 className="as-location-name">{loc.name}</h4>
                                <button className="as-action-btn" onClick={() => setLocations(locations.filter(l => l.id !== loc.id))}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                </button>
                            </div>
                            <p className="as-location-address">{loc.address}</p>
                            <p className="as-location-city">{loc.city}, {loc.state} {loc.zip}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ── Profile Information Tab ── */
const PROFILE_FIELDS = [
    { id: 'lastName',      label: 'Last Name',        group: 'Identity',      defaultOn: true },
    { id: 'firstName',     label: 'First Name',       group: 'Identity',      defaultOn: true },
    { id: 'email',         label: 'Email Address',    group: 'Contact',       defaultOn: true },
    { id: 'phone',         label: 'Phone Number',     group: 'Contact',       defaultOn: false },
    { id: 'language',      label: 'Preferred Language',group: 'Preferences',  defaultOn: true },
    { id: 'timezone',      label: 'Timezone',         group: 'Preferences',   defaultOn: true },
    { id: 'street',        label: 'Street Address',   group: 'Address',       defaultOn: false },
    { id: 'apt',           label: 'Apt / Unit #',     group: 'Address',       defaultOn: false },
    { id: 'city',          label: 'City or Locality', group: 'Address',       defaultOn: false },
    { id: 'state',         label: 'State or Region',  group: 'Address',       defaultOn: false },
    { id: 'zip',           label: 'Postal or Zip Code',group: 'Address',      defaultOn: false },
    { id: 'country',       label: 'Country',          group: 'Address',       defaultOn: false },
    { id: 'birthdate',     label: 'Birthdate',        group: 'Personal',      defaultOn: false },
    { id: 'gender',        label: 'Gender',           group: 'Personal',      defaultOn: false },
    { id: 'company',       label: 'Company',          group: 'Professional',  defaultOn: false },
    { id: 'title',         label: 'Name Title',       group: 'Professional',  defaultOn: false },
];

const ProfileTab = () => {
    const [fields, setFields] = useState(() => {
        const initial = {};
        PROFILE_FIELDS.forEach(f => initial[f.id] = f.defaultOn);
        return initial;
    });
    const [saved, setSaved] = useState(false);

    const toggle = (id) => {
        setFields(prev => ({ ...prev, [id]: !prev[id] }));
        setSaved(false);
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const groups = {};
    PROFILE_FIELDS.forEach(f => {
        if (!groups[f.group]) groups[f.group] = [];
        groups[f.group].push(f);
    });

    const enabledCount = Object.values(fields).filter(Boolean).length;

    return (
        <div className="as-tab-panel">
            <div className="as-panel-header">
                <div className="as-panel-title-wrap">
                    <h2 className="as-panel-title">Profile Information</h2>
                    <p className="as-panel-subtitle">{enabledCount} fields visible to users during onboarding</p>
                </div>
            </div>

            <div className="as-profile-wrap">
                {Object.entries(groups).map(([groupName, groupFields]) => (
                    <div key={groupName} className="as-profile-group">
                        <h3 className="as-profile-group-title">{groupName}</h3>
                        <div className="as-profile-fields">
                            {groupFields.map(f => (
                                <div key={f.id} className={`as-profile-row${fields[f.id] ? ' enabled' : ''}`}>
                                    <div className="as-profile-info">
                                        <span className="as-profile-label">{f.label}</span>
                                        {fields[f.id] && <span className="as-profile-tag">Visible</span>}
                                    </div>
                                    <Toggle value={fields[f.id]} onChange={() => toggle(f.id)} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="as-panel-footer">
                <button className="as-primary-btn" onClick={handleSave}>
                    {saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

/* ── Main View ── */
const AdvancedSettingsView = () => {
    const [activeTab, setActiveTab] = useState('Modules');

    const tabs = ['Modules', 'Roles', 'Locations', 'Profile Information'];

    return (
        <div className="portal-content">
            <div className="portal-content-title">
                <h1 className="portal-page-title">Advanced Settings</h1>
                <p className="portal-breadcrumb">Settings &middot; Advanced Settings</p>
            </div>

            <div className="as-tabs-bar">
                {tabs.map(t => (
                    <Tab key={t} label={t} active={activeTab === t} onClick={() => setActiveTab(t)} />
                ))}
            </div>

            {activeTab === 'Modules' && <ModulesTab />}
            {activeTab === 'Roles' && <RolesTab />}
            {activeTab === 'Locations' && <LocationsTab />}
            {activeTab === 'Profile Information' && <ProfileTab />}
        </div>
    );
};

export default AdvancedSettingsView;
