import { useState } from 'react';
import InfoBanner from '../components/InfoBanner';
import SearchableSelect from '../components/SearchableSelect';
import './ProfileView.css';

const SelectField = ({ value, onChange, children, placeholder }) => (
    <div className="pv3-select-wrap">
        <SearchableSelect value={value} onChange={onChange}>
            {placeholder && <option value="">{placeholder}</option>}
            {children}
        </SearchableSelect>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
);

const Field = ({ label, children }) => (
    <div className="pv3-field">
        <label className="pv3-label">{label}</label>
        {children}
    </div>
);

const NOTIF_GROUPS = [
    { label: 'Posts', items: ['When a comment is added to Feed', 'When a post is added to Feed'] },
    { label: 'Events', items: ['Event rsvp is requested from me', 'My event rsvp is answered'] },
    { label: 'Forms', items: ['Form submission is requested from me', 'My form is submitted by someone'] },
    { label: 'Signs', items: ['Signature submission is requested from me', 'My document is signed by someone'] },
    { label: 'Tasks', items: [
        'When a comment is added to subtask', 'When a comment is added to task',
        'Subtask is requested from me', 'Task is requested from me',
        'My subtask is completed by someone', 'My task is completed by someone',
    ]},
    { label: 'Invoices', items: ['Invoice submission is requested from me', 'My invoice is paid by someone'] },
];

const initNotifs = () => {
    const obj = {};
    NOTIF_GROUPS.forEach(g => g.items.forEach(item => { obj[item] = true; }));
    return obj;
};

const TABS = ['Personal', 'Location', 'Notifications'];

const ProfileView = ({ onBack, backLabel = 'Back', userPrefill }) => {
    const [form, setForm] = useState({
        firstName: userPrefill?.firstName ?? 'Jordan',
        lastName:  userPrefill?.lastName  ?? 'Admin',
        dob: '', gender: '',
        company: '', companyTitle: '',
        address: '', address2: '', city: '', stateRegion: '', country: 'US', zip: '',
        email: userPrefill?.email ?? 'jordan.admin@hubfirm.com',
        phone: userPrefill?.phone ?? '201-555-0123',
        language: 'en', timezone: 'America/New_York',
    });
    const roleLabel    = userPrefill?.role        ?? 'Administrator';
    const memberSince  = userPrefill?.memberSince ?? 'Jan 2024';
    const [notifs, setNotifs] = useState(initNotifs());
    const [activeTab, setActiveTab] = useState('Personal');
    const [saved, setSaved] = useState(false);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
    const toggleNotif = (key) => setNotifs(n => ({ ...n, [key]: !n[key] }));

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const initials = (form.firstName[0] || '') + (form.lastName[0] || '');

    return (
        <div className="portal-content">

            <InfoBanner message="Your profile contains your personal information, contact details, and notification preferences. Keep it up to date to ensure smooth communication." />

            <div className="pv3-layout">
            {/* Profile hero sidebar */}
            <div className="pv3-hero">
                <div className="pv3-hero-avatar">
                    <div className="pv3-avatar">{initials.toUpperCase()}</div>
                    <button className="pv3-change-photo">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                        Change photo
                    </button>
                </div>
                <div className="pv3-hero-info">
                    <div className="pv3-hero-name">{form.firstName} {form.lastName}</div>
                    <div className="pv3-hero-role">{roleLabel}</div>
                    <div className="pv3-hero-email">{form.email}</div>
                </div>
                <div className="pv3-hero-meta">
                    <div className="pv3-hero-meta-item">
                        <span className="pv3-hero-meta-label">Member since</span>
                        <span className="pv3-hero-meta-value">{memberSince}</span>
                    </div>
                    <div className="pv3-hero-meta-item">
                        <span className="pv3-hero-meta-label">Timezone</span>
                        <span className="pv3-hero-meta-value">Eastern (ET)</span>
                    </div>
                    <div className="pv3-hero-meta-item">
                        <span className="pv3-hero-meta-label">Language</span>
                        <span className="pv3-hero-meta-value">English</span>
                    </div>
                </div>
            </div>

            {/* Tabs + content */}
            <div className="pv3-card">
                <div className="pv3-tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            className={`pv3-tab${activeTab === tab ? ' active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="pv3-body">
                    {activeTab === 'Personal' && (
                        <>
                            <div className="pv3-group">
                                <div className="pv3-group-title">Basic</div>
                                <div className="pv3-grid-2">
                                    <Field label="First Name">
                                        <input className="pv3-input" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                                    </Field>
                                    <Field label="Last Name">
                                        <input className="pv3-input" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                                    </Field>
                                    <Field label="Date of Birth">
                                        <input className="pv3-input" type="date" value={form.dob} onChange={e => set('dob', e.target.value)} />
                                    </Field>
                                    <Field label="Gender">
                                        <SelectField value={form.gender} onChange={e => set('gender', e.target.value)} placeholder="No gender selected">
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="nonbinary">Non-binary</option>
                                            <option value="prefer_not">Prefer not to say</option>
                                        </SelectField>
                                    </Field>
                                </div>
                            </div>

                            <div className="pv3-divider" />

                            <div className="pv3-group">
                                <div className="pv3-group-title">Occupation</div>
                                <div className="pv3-grid-2">
                                    <Field label="Company Name">
                                        <input className="pv3-input" placeholder="Company Name" value={form.company} onChange={e => set('company', e.target.value)} />
                                    </Field>
                                    <Field label="Company Title">
                                        <input className="pv3-input" placeholder="Company Title" value={form.companyTitle} onChange={e => set('companyTitle', e.target.value)} />
                                    </Field>
                                </div>
                            </div>

                            <div className="pv3-divider" />

                            <div className="pv3-group">
                                <div className="pv3-group-title">Contact</div>
                                <div className="pv3-grid-2">
                                    <Field label="Email">
                                        <input className="pv3-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
                                    </Field>
                                    <Field label="Phone Number">
                                        <div className="pv3-phone-wrap">
                                            <span className="pv3-phone-prefix">🇺🇸 +1</span>
                                            <input className="pv3-phone-input" placeholder="201-555-0123" value={form.phone} onChange={e => set('phone', e.target.value)} />
                                        </div>
                                    </Field>
                                </div>
                            </div>

                            <div className="pv3-divider" />

                            <div className="pv3-group">
                                <div className="pv3-group-title">Language &amp; Region</div>
                                <div className="pv3-grid-2">
                                    <Field label="Language">
                                        <SelectField value={form.language} onChange={e => set('language', e.target.value)}>
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                            <option value="de">German</option>
                                            <option value="bn">Bengali</option>
                                        </SelectField>
                                    </Field>
                                    <Field label="Timezone">
                                        <SelectField value={form.timezone} onChange={e => set('timezone', e.target.value)}>
                                            <option value="America/New_York">Eastern Time (ET)</option>
                                            <option value="America/Chicago">Central Time (CT)</option>
                                            <option value="America/Denver">Mountain Time (MT)</option>
                                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                            <option value="Asia/Dhaka">Asia / Dhaka</option>
                                            <option value="UTC">UTC</option>
                                        </SelectField>
                                    </Field>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'Location' && (
                        <div className="pv3-group">
                            <div className="pv3-group-title">Address</div>
                            <div className="pv3-grid-2" style={{ marginBottom: 16 }}>
                                <Field label="Address">
                                    <input className="pv3-input" placeholder="Street address" value={form.address} onChange={e => set('address', e.target.value)} />
                                </Field>
                                <Field label="Address 2">
                                    <input className="pv3-input" placeholder="Apt, suite, unit…" value={form.address2} onChange={e => set('address2', e.target.value)} />
                                </Field>
                            </div>
                            <div className="pv3-grid-3">
                                <Field label="City / Locality">
                                    <input className="pv3-input" placeholder="City" value={form.city} onChange={e => set('city', e.target.value)} />
                                </Field>
                                <Field label="State / Region">
                                    <input className="pv3-input" placeholder="State" value={form.stateRegion} onChange={e => set('stateRegion', e.target.value)} />
                                </Field>
                                <Field label="Zip / Postal Code">
                                    <input className="pv3-input" placeholder="00000" value={form.zip} onChange={e => set('zip', e.target.value)} />
                                </Field>
                            </div>
                            <div style={{ marginTop: 16 }}>
                                <Field label="Country">
                                    <div style={{ maxWidth: 280 }}>
                                        <SelectField value={form.country} onChange={e => set('country', e.target.value)}>
                                            <option value="US">United States</option>
                                            <option value="BD">Bangladesh</option>
                                            <option value="GB">United Kingdom</option>
                                            <option value="CA">Canada</option>
                                            <option value="AU">Australia</option>
                                            <option value="IN">India</option>
                                        </SelectField>
                                    </div>
                                </Field>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Notifications' && (
                        <div className="pv3-group">
                            <div className="pv3-group-title">Email Notifications</div>
                            <p className="pv3-notif-desc">Choose which emails you'd like to receive.</p>
                            <div className="pv3-notif-list">
                                {NOTIF_GROUPS.map((group) => (
                                    <div key={group.label} className="pv3-notif-group">
                                        <div className="pv3-notif-group-label">{group.label}</div>
                                        <div className="pv3-notif-grid">
                                            {group.items.map(item => (
                                                <label key={item} className="pv3-notif-item">
                                                    <span className={`pv3-checkbox${notifs[item] ? ' checked' : ''}`} onClick={() => toggleNotif(item)}>
                                                        {notifs[item] && (
                                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                        )}
                                                    </span>
                                                    <input type="checkbox" checked={notifs[item]} onChange={() => toggleNotif(item)} style={{ display: 'none' }} />
                                                    <span className="pv3-notif-text">{item}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="pv3-footer">
                    <button className="pv3-btn-cancel" onClick={onBack}>Cancel</button>
                    <button className="pv3-btn-save" onClick={handleSave}>
                        {saved
                            ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Saved</>
                            : 'Save changes'
                        }
                    </button>
                </div>
            </div>
            </div>{/* pv3-layout */}
        </div>
    );
};

export default ProfileView;
