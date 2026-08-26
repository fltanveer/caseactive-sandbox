import { useEffect, useState } from 'react';
import FeedView from './FeedView';
import ProfileView from './ProfileView';
import EventsView from './EventsView';
import FormsView from './FormsView';
import ESignsView from './ESignsView';
import InvoicesView from './InvoicesView';
import NotesView from './NotesView';
import TasksView from './TasksView';
import NotificationsPopover, { UNREAD_NOTIFICATION_COUNT } from '../components/NotificationsPopover';
import NotificationsView from './NotificationsView';
import SearchableSelect from '../components/SearchableSelect';

const HUBS = ['Sterling & Brooks Injury Law', 'Hub 2', 'All Hubs'];

const SwitchModeModal = ({ targetMode, onConfirm, onCancel }) => (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-modal-header">
                <h3 className="confirm-modal-title">Switch to {targetMode}</h3>
                <button className="confirm-modal-close" onClick={onCancel}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="confirm-modal-body">
                <p className="confirm-modal-text">Are you sure you want to switch to {targetMode} view?</p>
            </div>
            <div className="confirm-modal-footer">
                <button className="confirm-modal-cancel" onClick={onCancel}>Cancel</button>
                <button className="confirm-modal-confirm" onClick={onConfirm}>Switch</button>
            </div>
        </div>
    </div>
);

const NewAnnouncementModal = ({ announcement, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="ccm lobby-announce-modal" onClick={e => e.stopPropagation()}>
            <div className="ccm-header">
                <div>
                    <p className="ccm-breadcrumb">Lobby · Announcements</p>
                    <h2 className="ccm-title">New Announcement</h2>
                </div>
                <button className="ccm-close" onClick={onClose}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="ccm-body">
                <div className="lobby-announce-modal-card">
                    <div className="lobby-announce-modal-body">
                        <span className="lobby-announce-modal-title">{announcement.title}</span>
                        <span className="lobby-announce-modal-date">{announcement.postedOn}</span>
                        <p className="lobby-announce-modal-text">{announcement.text}</p>
                    </div>
                </div>
            </div>
            <div className="ccm-footer">
                <button className="imp-cancel-btn" onClick={onClose}>Dismiss</button>
                <button className="imp-save-btn" onClick={onClose}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Got it
                </button>
            </div>
        </div>
    </div>
);

const ROLE_COLORS = { client: '#149EB1', staff: '#64748B', admin: '#6366F1' };

const CASE_TODOS = [
    {
        title: 'Upload signed medical release',
        due: 'Due today, 3:30 PM',
        by: 'Alexandra Reyes',
        status: 'Client action',
    },
    {
        title: 'Complete your medical history questionnaire',
        due: 'Due Apr 6, 5:00 PM',
        by: 'Alexandra Reyes',
        status: 'Form',
    },
    {
        title: 'Sign the wage loss authorization form',
        due: 'Due Apr 8, 12:00 PM',
        by: 'Alexandra Reyes',
        status: 'Signature',
    },
    {
        title: 'Upload photos of your vehicle repairs',
        due: 'Due Apr 9, 5:00 PM',
        by: 'Alexandra Reyes',
        status: 'Client action',
    },
    {
        title: 'Confirm your IME appointment on Apr 14',
        due: 'Due Apr 11, 2:00 PM',
        by: 'Alexandra Reyes',
        status: 'Scheduling',
    },
];

const CASE_TEAM = [
    { name: 'Marcus Bell', role: 'Lead Attorney', initials: 'MB' },
    { name: 'Elena Ramirez', role: 'Case Manager', initials: 'ER' },
    { name: 'Sarah Lee', role: 'Paralegal', initials: 'SL' },
    { name: 'Casey Whitfield', role: 'Paralegal', initials: 'CW' },
    { name: 'Danielle Okafor', role: 'Intake Specialist', initials: 'DO' },
    { name: 'Nina Patel', role: 'Case Coordinator', initials: 'NP' },
    { name: 'Robert Grant', role: 'Administrator (Admin View only)', initials: 'RG' },
];

const AddCaseMemberModal = ({ onClose, onSave }) => {
    const [lookupType, setLookupType] = useState('Email');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [notify, setNotify] = useState(false);
    const canSave = email.trim() && role;

    const handleSave = () => {
        if (!canSave) return;

        const emailName = email.split('@')[0] || 'New Member';
        const name = emailName
            .split(/[._-]/)
            .filter(Boolean)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ') || 'New Member';
        const initials = name
            .split(' ')
            .map(part => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

        onSave({ name, role, initials, email: email.trim(), notify });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm ccm-case-member-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <h2 className="ccm-title">Add Case Member</h2>
                    <button className="ccm-close" onClick={onClose} aria-label="Close add case member modal">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div className="ccm-body cmm-body">
                    <div className="ccm-field">
                        <label className="ccm-label">User<span className="ccm-req">*</span></label>
                        <div className="cmm-user-input-group">
                            <SearchableSelect className="cmm-type-select" value={lookupType} onChange={e => setLookupType(e.target.value)}>
                                <option>Email</option>
                                <option>Username</option>
                            </SearchableSelect>
                            <input className="cmm-user-input" type="email" placeholder={`Type User ${lookupType.toLowerCase()}`} value={email} onChange={e => setEmail(e.target.value)} autoFocus />
                        </div>
                    </div>

                    <div className="ccm-field">
                        <label className="ccm-label">Role<span className="ccm-req">*</span></label>
                        <SearchableSelect className="ccm-select" value={role} onChange={e => setRole(e.target.value)}>
                            <option value="">No role selected</option>
                            <option>Lead Attorney</option>
                            <option>Case Manager</option>
                            <option>Paralegal</option>
                            <option>Intake Specialist</option>
                            <option>Records Coordinator</option>
                            <option>Litigation Support</option>
                        </SearchableSelect>
                    </div>

                    <label className="cmm-checkbox-row">
                        <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} />
                        <span>Email user about case assignment</span>
                    </label>
                </div>
                <div className="ccm-footer">
                    <button className="ccm-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="ccm-save-btn" disabled={!canSave} onClick={handleSave}>SAVE</button>
                </div>
            </div>
        </div>
    );
};

const CaseRightPanel = ({ collapsed, onToggle }) => {
    const [todoSearchOpen, setTodoSearchOpen] = useState(false);
    const [teamSearchOpen, setTeamSearchOpen] = useState(false);
    const [todoSearch, setTodoSearch] = useState('');
    const [teamSearch, setTeamSearch] = useState('');
    const [caseMembers, setCaseMembers] = useState(CASE_TEAM);
    const [addMemberOpen, setAddMemberOpen] = useState(false);

    const todoQuery = todoSearch.trim().toLowerCase();
    const teamQuery = teamSearch.trim().toLowerCase();
    const filteredTodos = CASE_TODOS.filter(t => (
        `${t.title} ${t.due} ${t.by} ${t.status}`.toLowerCase().includes(todoQuery)
    ));
    const filteredTeam = caseMembers.filter(m => (
        `${m.name} ${m.role} ${m.initials}`.toLowerCase().includes(teamQuery)
    ));

    const handleSaveMember = member => {
        setCaseMembers(prev => [...prev, member]);
        setAddMemberOpen(false);
        setTeamSearchOpen(false);
        setTeamSearch('');
    };

    return (
        <aside className={`case-right-panel${collapsed ? ' case-right-panel--collapsed' : ''}`}>
            <div className="crp-collapse-row">
                <button className="case-collapse-btn" onClick={onToggle} aria-label={collapsed ? 'Expand right sidebar' : 'Collapse right sidebar'} title={collapsed ? 'Expand panel' : 'Collapse panel'}>
                    {collapsed ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    )}
                </button>
            </div>
            {collapsed && (
                <div className="crp-collapsed-summary" aria-label="Collapsed panel summary">
                    <button className="crp-rail-stat" onClick={onToggle} title={`${CASE_TODOS.length} to do items`}>
                        <span className="crp-rail-icon">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                        </span>
                        <span className="crp-rail-count">{CASE_TODOS.length}</span>
                        <span className="crp-rail-label">To Do</span>
                    </button>
                    <button className="crp-rail-stat" onClick={onToggle} title={`${caseMembers.length} team members`}>
                        <span className="crp-rail-icon">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </span>
                        <span className="crp-rail-count">{caseMembers.length}</span>
                        <span className="crp-rail-label">Team</span>
                    </button>
                </div>
            )}
            <div className="crp-section crp-section--todo">
                <div className="crp-section-header">
                    <span className="crp-section-title">
                        <span className="crp-section-title-icon">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                        </span>
                        <span className="crp-section-label">To Do</span>
                    </span>
                    <button className={`crp-icon-btn${todoSearchOpen ? ' active' : ''}`} title="Search To Do" onClick={() => setTodoSearchOpen(p => !p)}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </button>
                </div>
                {todoSearchOpen && (
                    <div className="crp-search-wrap">
                        <input className="crp-search-input" value={todoSearch} onChange={e => setTodoSearch(e.target.value)} placeholder="Search tasks" autoFocus />
                        {todoSearch && <button className="crp-search-clear" onClick={() => setTodoSearch('')} aria-label="Clear To Do search">Clear</button>}
                    </div>
                )}
                <div className="crp-todo-list">
                    {filteredTodos.length > 0 ? filteredTodos.map((t, i) => (
                        <div key={i} className="crp-todo-item">
                            <div className="crp-todo-topline">
                                <span className="crp-todo-status">{t.status}</span>
                                <span className="crp-todo-dot" />
                            </div>
                            <div className="crp-todo-title">{t.title}</div>
                            <div className="crp-todo-meta">
                                <span>{t.due}</span>
                                <span>Assigned to {t.by}</span>
                            </div>
                            <button className="crp-subtask-btn">Open Task</button>
                        </div>
                    )) : <p className="crp-empty-search">No tasks found.</p>}
                </div>
            </div>

            <div className="crp-section crp-section--team">
                <div className="crp-section-header">
                    <span className="crp-section-title">
                        <span className="crp-section-title-icon">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </span>
                        <span className="crp-section-label">Your Team</span>
                    </span>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <button className="crp-icon-btn" title="Add member" onClick={() => setAddMemberOpen(true)}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        </button>
                        <button className={`crp-icon-btn${teamSearchOpen ? ' active' : ''}`} title="Search Team" onClick={() => setTeamSearchOpen(p => !p)}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        </button>
                    </div>
                </div>
                {teamSearchOpen && (
                    <div className="crp-search-wrap">
                        <input className="crp-search-input" value={teamSearch} onChange={e => setTeamSearch(e.target.value)} placeholder="Search team" autoFocus />
                        {teamSearch && <button className="crp-search-clear" onClick={() => setTeamSearch('')} aria-label="Clear Team search">Clear</button>}
                    </div>
                )}
                <div className="crp-team-list">
                    {filteredTeam.length > 0 ? filteredTeam.map((m, i) => (
                        <div key={i} className="crp-team-member">
                            <div className="crp-member-avatar">{m.initials}</div>
                            <div>
                                <div className="crp-member-name">{m.name}</div>
                                <div className="crp-member-role">{m.role}</div>
                            </div>
                        </div>
                    )) : <p className="crp-empty-search">No team members found.</p>}
                </div>
            </div>
            {addMemberOpen && <AddCaseMemberModal onClose={() => setAddMemberOpen(false)} onSave={handleSaveMember} />}
        </aside>
    );
};

const CaseMembers = ({ members }) => {
    const visible = members.slice(0, 3);
    const extra = members.length - visible.length;
    return (
        <div className="lc-members">
            {visible.map((m, i) => (
                <div
                    key={i}
                    className="lc-avatar"
                    style={{ background: ROLE_COLORS[m.role] || '#94A3B8', zIndex: visible.length - i }}
                    title={`${m.name} (${m.role})`}
                >
                    {m.name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
            ))}
            {extra > 0 && (
                <div className="lc-avatar lc-avatar-more" style={{ zIndex: 0 }}>+{extra}</div>
            )}
        </div>
    );
};

const LOBBY_CASES = [
    {
        title: 'Rear-End Collision, Downtown LA',
        updated: 'yesterday',
        members: [
            { name: 'Jordan Ross',  role: 'client' },
            { name: 'Katie Wong',   role: 'admin'  },
            { name: 'Chris Walsh',  role: 'staff'  },
            { name: 'Nina Patel',   role: 'admin'  },
        ],
    },
    {
        title: 'Property Damage Claim, Downtown LA',
        updated: '2 days ago',
        members: [
            { name: 'Jordan Ross',  role: 'client' },
            { name: 'Nina Patel',   role: 'admin'  },
            { name: 'Chris Walsh',  role: 'staff'  },
        ],
    },
    {
        title: 'Shopping Mall Incident, Glendale',
        updated: '5 days ago',
        members: [
            { name: 'Nina Patel',   role: 'admin'  },
            { name: 'Katie Wong',   role: 'admin'  },
            { name: 'Jordan Ross',  role: 'client' },
            { name: 'Chris Walsh',  role: 'staff'  },
            { name: 'Priya Kapoor', role: 'staff'  },
        ],
    },
    {
        title: 'Rideshare Collision, Silver Lake',
        updated: 'Mar 28',
        members: [
            { name: 'Jordan Ross',  role: 'client' },
            { name: 'Chris Walsh',  role: 'staff'  },
        ],
    },
    {
        title: 'Warehouse Injury, Vernon',
        updated: '1 week ago',
        members: [
            { name: 'Jordan Ross',  role: 'client' },
            { name: 'Nina Patel',   role: 'admin'  },
            { name: 'Chris Walsh',  role: 'staff'  },
        ],
    },
    {
        title: 'Construction Site Fall, Culver City',
        updated: '9 days ago',
        members: [
            { name: 'Jordan Ross',  role: 'client' },
            { name: 'Katie Wong',   role: 'admin'  },
        ],
    },
    {
        title: 'Motorcycle Collision, Pasadena',
        updated: '2 weeks ago',
        members: [
            { name: 'Jordan Ross',  role: 'client' },
            { name: 'Chris Walsh',  role: 'staff'  },
            { name: 'Katie Wong',   role: 'admin'  },
        ],
    },
    {
        title: 'Bus Accident, Long Beach',
        updated: '3 weeks ago',
        members: [
            { name: 'Jordan Ross',  role: 'client' },
            { name: 'Nina Patel',   role: 'admin'  },
        ],
    },
];

const LOBBY_CLOSED_CASES = [
    {
        title: 'Bicycle Accident, Echo Park',
        updated: 'settled Feb 14',
        members: [
            { name: 'Jordan Ross',  role: 'client' },
            { name: 'Chris Walsh',  role: 'staff'  },
        ],
    },
    {
        title: 'Dog Bite Incident, Los Feliz',
        updated: 'settled Jan 30',
        members: [
            { name: 'Jordan Ross',  role: 'client' },
            { name: 'Nina Patel',   role: 'admin'  },
        ],
    },
    {
        title: 'Parking Garage Fall, Hollywood',
        updated: 'settled Dec 12',
        members: [
            { name: 'Jordan Ross',  role: 'client' },
            { name: 'Katie Wong',   role: 'admin'  },
        ],
    },
    {
        title: 'Pedestrian Collision, Koreatown',
        updated: 'settled Nov 3',
        members: [
            { name: 'Jordan Ross',  role: 'client' },
            { name: 'Chris Walsh',  role: 'staff'  },
        ],
    },
];

const LOBBY_INQUIRIES = [
    {
        id: 'inq-001',
        name: 'Alexandra Reyes',
        message: "I was rear-ended on Flower Street this morning. The other driver's insurance is already calling me and I don't know what to say to them.",
        createdOn: 'Jul 2, 12:54 AM',
        status: 'Open',
    },
    {
        id: 'inq-002',
        name: 'Alexandra Reyes',
        message: "My neighbour's dog bit my son at the park last weekend. He needed stitches. Is this something your firm handles?",
        createdOn: 'Jun 28, 4:32 PM',
        status: 'Open',
    },
    {
        id: 'inq-003',
        name: 'Alexandra Reyes',
        message: 'I slipped on a wet floor at the Westfield mall and hurt my wrist. There was no warning sign out. Can someone call me?',
        createdOn: 'Jun 26, 2:47 PM',
        status: 'Open',
    },
    {
        id: 'inq-004',
        name: 'Alexandra Reyes',
        message: 'Can you confirm the mediation date has been moved to next Tuesday?',
        createdOn: 'Jun 24, 9:10 AM',
        status: 'Open',
    },
    {
        id: 'inq-005',
        name: 'Alexandra Reyes',
        message: 'I received a medical bill from Regional Health. Should I pay it now or wait?',
        createdOn: 'Jun 20, 2:15 PM',
        status: 'Closed',
    },
    {
        id: 'inq-006',
        name: 'Alexandra Reyes',
        message: 'Can I add my husband as a contact so he can help me track messages?',
        createdOn: 'Jun 18, 11:05 AM',
        status: 'Closed',
    },
    {
        id: 'inq-007',
        name: 'Alexandra Reyes',
        message: 'Do I need to bring the original medical records or will copies work?',
        createdOn: 'Jun 12, 8:02 AM',
        status: 'Closed',
    },
];

const InquiryAvatar = ({ name }) => {
    const initial = name.trim().charAt(0).toUpperCase();
    return <div className="lobby-inquiry-avatar">{initial}</div>;
};

const LOBBY_LOCATIONS = [
    {
        id: 'loc-001',
        title: 'Downtown LA Office',
        address: '700 South Flower Street, Suite 1200, Los Angeles, CA 90017',
        hours: 'Mon to Fri, 8:30am to 6:00pm',
        phone: '(213) 555-0142',
        isMain: true,
        lat: 34.0478,
        lon: -118.2588,
    },
    {
        id: 'loc-002',
        title: 'Santa Monica Satellite Office',
        address: '1230 Wilshire Blvd, Santa Monica, CA 90403',
        hours: 'Mon to Fri, 9:00am to 5:00pm',
        phone: '(310) 555-0188',
        isMain: false,
        lat: 34.0195,
        lon: -118.4912,
    },
    {
        id: 'loc-003',
        title: 'Pasadena Branch Office',
        address: '155 N Lake Ave, Pasadena, CA 91101',
        hours: 'Mon to Fri, 9:00am to 5:00pm',
        phone: '(626) 555-0173',
        isMain: false,
        lat: 34.1478,
        lon: -118.1445,
    },
];

const mapEmbedUrl = (lat, lon, delta = 0.012) => {
    const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
};

const LOBBY_ANNOUNCEMENTS = [
    {
        id: 'ann-001',
        title: 'New Case Coordinator Joining Our Team',
        text: "Nina Patel has joined Sterling & Brooks as a case coordinator. She'll be reaching out to clients directly with case updates and scheduling.",
        postedOn: 'Jul 27, 9:00 AM',
    },
    {
        id: 'ann-002',
        title: 'Downtown LA Office Has Moved',
        text: "As of July 15th we're at 700 South Flower Street, Suite 1200. Parking is validated in the building garage on Hope Street.",
        postedOn: 'Jul 15, 10:00 AM',
    },
    {
        id: 'ann-003',
        title: 'Holiday Office Closure: July 4th',
        text: 'Our offices will be closed Friday, July 4th, and reopen Monday, July 7th. You can still message your team through your case at any time.',
        postedOn: 'Jul 1, 9:00 AM',
    },
    {
        id: 'ann-004',
        title: 'Read Your Case Updates in Spanish',
        text: 'Set your preferred language in your profile and every update from us arrives translated. Ahora disponible en español.',
        postedOn: 'Jun 24, 2:30 PM',
    },
    {
        id: 'ann-005',
        title: 'New Client Portal Features',
        text: 'You can now upload documents directly from your phone camera.',
        postedOn: 'Jun 18, 8:45 AM',
    },
    {
        id: 'ann-006',
        title: 'Payment Reminder',
        text: 'Please review outstanding invoices before the end of the month.',
        postedOn: 'Jun 10, 11:00 AM',
    },
    {
        id: 'ann-007',
        title: 'New Document Checklist',
        text: 'We added a printable checklist to help you gather documents before your next appointment.',
        postedOn: 'Jun 3, 2:30 PM',
    },
    {
        id: 'ann-008',
        title: 'Text Message Reminders Now Available',
        text: 'Opt in from your profile to receive appointment and deadline reminders by text.',
        postedOn: 'May 22, 9:15 AM',
    },
];

const ANNOUNCEMENT_PAGE_SIZE = 4;
const ANNOUNCEMENT_PAGES = Math.ceil(LOBBY_ANNOUNCEMENTS.length / ANNOUNCEMENT_PAGE_SIZE);

const CASE_PAGE_SIZE = 4;
const CASE_PAGES = Math.ceil(LOBBY_CASES.length / CASE_PAGE_SIZE);

const CASE_NAV = [
    { label: 'Feed',     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg> },
    { label: 'Events',   icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { label: 'Forms',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="m9 12 2 2 4-4"/><line x1="9" y1="17" x2="15" y2="17"/></svg> },
    { label: 'E-signs',  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
    { label: 'Invoices', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2H6a1 1 0 0 0-1 1v18l3-2 2 2 2-2 2 2 2-2 3 2V3a1 1 0 0 0-1-1z"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="12" y2="17"/></svg> },
    { label: 'Notes',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
    { label: 'Tasks',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
    { label: 'Convo',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.95 3.59 2 2 0 0 1 3.92 1.4h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> },
    { label: 'Info',     icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
];

/* Case categories whose header carries the NEW button */
const CASE_CREATE_NAVS = ['Events', 'Forms', 'E-signs', 'Invoices', 'Notes', 'Tasks'];

const LobbyView = ({ onToggle, onHubs }) => {
    const [caseTab, setCaseTab] = useState('open');
    const [inquiryTab, setInquiryTab] = useState('open');
    const [inquiries, setInquiries] = useState(LOBBY_INQUIRIES);
    const [locationIndex, setLocationIndex] = useState(0);
    const [announcementIndex, setAnnouncementIndex] = useState(0);
    const [caseIndex, setCaseIndex] = useState(0);
    const [activeAnnouncement, setActiveAnnouncement] = useState(null);
    const [hubOpen, setHubOpen] = useState(false);
    const [selectedHub, setSelectedHub] = useState('Sterling & Brooks Injury Law');
    const [selectedCase, setSelectedCase] = useState(null);
    const [activeCaseNav, setActiveCaseNav] = useState('Feed');
    const [caseCreateOpen, setCaseCreateOpen] = useState(false);
    const [caseSwitchOpen, setCaseSwitchOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [switchModalOpen, setSwitchModalOpen] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [navOpen, setNavOpen] = useState(false);
    const [titleSwitchOpen, setTitleSwitchOpen] = useState(false);
    const [rightPanelCollapsed, setRightPanelCollapsed] = useState(() => (
        typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
    ));

    useEffect(() => {
        const media = window.matchMedia('(max-width: 768px)');
        const handleMobileChange = event => {
            if (event.matches) setRightPanelCollapsed(true);
        };

        media.addEventListener('change', handleMobileChange);
        return () => media.removeEventListener('change', handleMobileChange);
    }, []);

    const topbar = (
        <div className="portal-topbar">
            <div className="portal-topbar-left">
                <button className="portal-hamburger" onClick={() => setNavOpen(p => !p)} aria-label="Toggle navigation">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                </button>
                <div className="portal-logo">
                    <img src="/assets/images/logo.svg" alt="CaseActive" className="portal-logo-full" style={{ height: 28, width: 'auto' }} />
                    <img src="/assets/images/logo-sm.svg" alt="CaseActive" className="portal-logo-sm" style={{ height: 28, width: 'auto', display: 'none' }} />
                </div>
            </div>
            <div className="portal-topbar-right">
                <div className="portal-hub-wrap">
                    <button className="portal-hub-btn" onClick={() => setHubOpen(p => !p)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        <span className="portal-hub-label">{selectedHub}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </button>
                    {hubOpen && (
                        <div className="portal-hub-dropdown">
                            {HUBS.map(h => (
                                <button key={h} className={`portal-hub-option${selectedHub === h ? ' active' : ''}`} onClick={() => { if (h === 'All Hubs') { setHubOpen(false); onHubs(); } else { setSelectedHub(h); setHubOpen(false); } }}>{h}</button>
                            ))}
                            <div className="portal-hub-divider"/>
                            <button className="portal-hub-join" onClick={() => setHubOpen(false)}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                Join / Add Hub
                            </button>
                        </div>
                    )}
                </div>
                <div className="portal-mode-toggle">
                    <button className="portal-mode-btn" onClick={() => setSwitchModalOpen(true)}>Admin</button>
                    <button className="portal-mode-btn active">Lobby</button>
                </div>
                <div className="portal-notif-wrap">
                    <button className="portal-notif-btn" onClick={() => setNotifOpen(p => !p)} aria-label="Notifications">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                        <span className="portal-notif-badge">{UNREAD_NOTIFICATION_COUNT}</span>
                    </button>
                    {notifOpen && (
                        <NotificationsPopover
                            onClose={() => setNotifOpen(false)}
                            onViewAll={() => { setSelectedCase(null); setShowProfile(false); setShowNotifications(true); }}
                        />
                    )}
                </div>
                <div className="portal-profile-wrap">
                    <div className="portal-topbar-profile" onClick={() => setProfileOpen(p => !p)}>
                        <div className="portal-avatar">AR</div>
                        <div className="portal-topbar-profile-info">
                            <div className="portal-user-name">Alexandra Reyes</div>
                            <div className="portal-user-role">Client</div>
                        </div>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#94A3B8', marginLeft: '2px', flexShrink: 0 }}><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    {profileOpen && (
                        <div className="portal-profile-dropdown">
                            <button className="portal-profile-option" onClick={() => { setProfileOpen(false); setShowProfile(true); }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                Profile
                            </button>
                            <button className="portal-profile-option danger" onClick={() => { setProfileOpen(false); window.location.hash = ''; }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (showNotifications) return (
        <div className="lobby-shell">
            {topbar}
            <div className="lobby-content-title">
                <div>
                    <h1 className="portal-page-title">Notifications</h1>
                    <p className="portal-breadcrumb">Lobby · Notifications</p>
                </div>
                <button className="fed-back-btn" onClick={() => setShowNotifications(false)}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                    Back to Lobby
                </button>
            </div>
            <div className="lobby-notifications-body">
                <NotificationsView embedded />
            </div>
        </div>
    );

    if (showProfile) return (
        <div className="lobby-shell">
            {topbar}
            <div className="lobby-content-title">
                <div>
                    <h1 className="portal-page-title">Profile</h1>
                    <p className="portal-breadcrumb">Lobby · Profile</p>
                </div>
            </div>
            <ProfileView onBack={() => setShowProfile(false)} backLabel="Back to Lobby" />
        </div>
    );

    return (
        <div className="lobby-shell">
            {topbar}

            {/* Hub bar — mobile only */}
            <div className="portal-hub-bar" onClick={() => setHubOpen(p => !p)}>
                <div className="portal-hub-bar-left">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <span>Current Hub: <span className="portal-hub-bar-name">{selectedHub}</span></span>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                {hubOpen && (
                    <div className="portal-hub-dropdown portal-hub-bar-dropdown" onClick={e => e.stopPropagation()}>
                        {HUBS.map(h => (
                            <button key={h} className={`portal-hub-option${selectedHub === h ? ' active' : ''}`} onClick={() => { if (h === 'All Hubs') { setHubOpen(false); onHubs(); } else { setSelectedHub(h); setHubOpen(false); } }}>{h}</button>
                        ))}
                        <div className="portal-hub-divider"/>
                        <button className="portal-hub-join" onClick={() => setHubOpen(false)}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Join / Add Hub
                        </button>
                    </div>
                )}
            </div>

            {selectedCase ? (
                /* Case Detail View */
                <div className="case-view-layout">
                        {navOpen && <div className="portal-nav-overlay active" onClick={() => setNavOpen(false)} />}
                        <aside className={`case-sidebar${navOpen ? ' case-sidebar--open' : ''}`}>
                            <div className="case-sidebar-logo-header">
                                <img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 28, width: 'auto' }} />
                                <button className="case-sidebar-close-btn" onClick={() => setNavOpen(false)} aria-label="Close sidebar">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                </button>
                            </div>
                            <div className="case-sidebar-back">
                                <button className="case-back-btn" onClick={() => { setSelectedCase(null); setNavOpen(false); }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                                    Cases
                                </button>
                                <div className="case-switcher-wrap">
                                    <button className="case-switcher-btn" onClick={() => setCaseSwitchOpen(p => !p)}>
                                        <span className="case-switcher-name">{selectedCase.title}</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="6 9 12 15 18 9"/></svg>
                                    </button>
                                    {caseSwitchOpen && (
                                        <div className="case-switcher-dropdown">
                                            {LOBBY_CASES.map((c, i) => (
                                                <button key={i} className={`case-switcher-option${selectedCase.title === c.title ? ' active' : ''}`} onClick={() => { setSelectedCase(c); setCaseSwitchOpen(false); }}>
                                                    {c.title}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <p className="case-sidebar-label">Case Categories</p>
                            {CASE_NAV.map(item => (
                                <button key={item.label} className={`case-nav-item${activeCaseNav === item.label ? ' active' : ''}`} onClick={() => { setActiveCaseNav(item.label); setCaseCreateOpen(false); setNavOpen(false); }}>
                                    <span className="case-nav-icon">{item.icon}</span>
                                    <span>{item.label}</span>
                                    {item.hasSub && <svg style={{marginLeft:'auto'}} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>}
                                </button>
                            ))}
                            <div className="sidebar-bottom-img">
                                <img
                                    src="/assets/images/left-sidebar.svg"
                                    alt=""
                                />
                            </div>
                        </aside>
                        <main className="case-main">
                            <div className="case-content-title">
                                <div className="case-title-mobile-nav">
                                    <button className="case-back-btn" onClick={() => { setSelectedCase(null); setNavOpen(false); }}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                                        Cases
                                    </button>
                                    <span style={{ color: '#D1D5DB', fontSize: 12 }}>/</span>
                                    <div className="case-switcher-wrap" style={{ width: 'auto' }}>
                                        <button className="case-title-switcher-btn" onClick={() => setTitleSwitchOpen(p => !p)}>
                                            <span className="case-switcher-name" style={{ maxWidth: 200 }}>{selectedCase.title}</span>
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polyline points="6 9 12 15 18 9"/></svg>
                                        </button>
                                        {titleSwitchOpen && (
                                            <div className="case-switcher-dropdown">
                                                {LOBBY_CASES.map((c, i) => (
                                                    <button key={i} className={`case-switcher-option${selectedCase.title === c.title ? ' active' : ''}`} onClick={() => { setSelectedCase(c); setTitleSwitchOpen(false); }}>
                                                        {c.title}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="portal-page-title">{activeCaseNav}</h2>
                                    <p className="portal-breadcrumb">{selectedCase.title} · {activeCaseNav}</p>
                                </div>
                                {CASE_CREATE_NAVS.includes(activeCaseNav) && (
                                    <button className="hubs-new-btn" onClick={() => setCaseCreateOpen(true)}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                        NEW
                                    </button>
                                )}
                            </div>
                            <div className="case-content-body">
                                {activeCaseNav === 'Feed' ? (
                                    <FeedView />
                                ) : activeCaseNav === 'Events' ? (
                                    <EventsView embedded createOpen={caseCreateOpen} onCloseCreate={() => setCaseCreateOpen(false)} />
                                ) : activeCaseNav === 'Forms' ? (
                                    <FormsView embedded createOpen={caseCreateOpen} onCloseCreate={() => setCaseCreateOpen(false)} />
                                ) : activeCaseNav === 'E-signs' ? (
                                    <ESignsView embedded createOpen={caseCreateOpen} onCloseCreate={() => setCaseCreateOpen(false)} />
                                ) : activeCaseNav === 'Invoices' ? (
                                    <InvoicesView embedded createOpen={caseCreateOpen} onCloseCreate={() => setCaseCreateOpen(false)} />
                                ) : activeCaseNav === 'Notes' ? (
                                    <NotesView embedded createOpen={caseCreateOpen} onCloseCreate={() => setCaseCreateOpen(false)} />
                                ) : activeCaseNav === 'Tasks' ? (
                                    <TasksView embedded createOpen={caseCreateOpen} onCloseCreate={() => setCaseCreateOpen(false)} />
                                ) : (
                                    <div className="case-feed-empty-card">No {activeCaseNav.toLowerCase()} yet.</div>
                                )}
                            </div>
                        </main>
                        <CaseRightPanel collapsed={rightPanelCollapsed} onToggle={() => setRightPanelCollapsed(p => !p)} />
                    </div>
            ) : (
                /* Lobby content — full width */
                <>
                <div className="lobby-content-title">
                    <div>
                        <h1 className="portal-page-title">{selectedHub}</h1>
                        <p className="portal-breadcrumb">{selectedHub} · Client Lobby</p>
                    </div>
                </div>
                <div className="lobby-content">
                    {/* Cases */}
                    <div className="lobby-card">
                        <div className="lobby-section-header">
                            <h2 className="lobby-section-title">Cases</h2>
                            <div className="lobby-section-actions">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                {caseTab === 'open' && CASE_PAGES > 1 && (
                                    <>
                                        <button
                                            className="lobby-nav-btn"
                                            onClick={() => setCaseIndex(i => (i - 1 + CASE_PAGES) % CASE_PAGES)}
                                            aria-label="Previous page"
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                                        </button>
                                        <button
                                            className="lobby-nav-btn"
                                            onClick={() => setCaseIndex(i => (i + 1) % CASE_PAGES)}
                                            aria-label="Next page"
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="lobby-tabs-row">
                            <button className={`lobby-tab-pill${caseTab === 'open' ? ' active' : ''}`} onClick={() => setCaseTab('open')}>Open <span className="lobby-tab-count">{LOBBY_CASES.length}</span></button>
                            <button className={`lobby-tab-pill${caseTab === 'closed' ? ' active' : ''}`} onClick={() => setCaseTab('closed')}>Closed <span className="lobby-tab-count">{LOBBY_CLOSED_CASES.length}</span></button>
                            <button className="lobby-add-btn">+</button>
                        </div>
                        {(() => {
                            const source = caseTab === 'open' ? LOBBY_CASES : LOBBY_CLOSED_CASES;
                            const pages = caseTab === 'open' ? CASE_PAGES : Math.ceil(LOBBY_CLOSED_CASES.length / CASE_PAGE_SIZE);
                            const page = caseIndex % pages;
                            const shown = source.slice(page * CASE_PAGE_SIZE, page * CASE_PAGE_SIZE + CASE_PAGE_SIZE);
                            return (
                                <>
                                    <div className="lobby-cases-grid">
                                        {shown.map((c, i) => (
                                            <div key={i} className="lobby-case-card" onClick={() => { setSelectedCase(c); setActiveCaseNav('Feed'); }}>
                                                <div className="lobby-case-title">{c.title}</div>
                                                <span className="lobby-case-updated">Updated {c.updated}</span>
                                                <CaseMembers members={c.members} />
                                                <div className="lobby-case-corner"/>
                                            </div>
                                        ))}
                                    </div>
                                    {CASE_PAGES > 1 && (
                                        <div className="lobby-location-dots lobby-announcement-dots">
                                            {Array.from({ length: CASE_PAGES }).map((_, i) => (
                                                <button
                                                    key={i}
                                                    className={`lobby-location-dot${i === page ? ' active' : ''}`}
                                                    onClick={() => setCaseIndex(i)}
                                                    aria-label={`Go to page ${i + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>

                    {/* Announcements */}
                    <div className="lobby-card">
                        <div className="lobby-section-header">
                            <h2 className="lobby-section-title">Announcements</h2>
                            <div className="lobby-section-actions">
                                <button
                                    className="lobby-nav-btn"
                                    onClick={() => setAnnouncementIndex(i => (i - 1 + ANNOUNCEMENT_PAGES) % ANNOUNCEMENT_PAGES)}
                                    aria-label="Previous page"
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                                </button>
                                <button
                                    className="lobby-nav-btn"
                                    onClick={() => setAnnouncementIndex(i => (i + 1) % ANNOUNCEMENT_PAGES)}
                                    aria-label="Next page"
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                                </button>
                            </div>
                        </div>
                        {(() => {
                            const page = announcementIndex % ANNOUNCEMENT_PAGES;
                            const shown = LOBBY_ANNOUNCEMENTS.slice(page * ANNOUNCEMENT_PAGE_SIZE, page * ANNOUNCEMENT_PAGE_SIZE + ANNOUNCEMENT_PAGE_SIZE);
                            return (
                                <>
                                    <div className="lobby-announcement-grid">
                                        {shown.map(a => (
                                            <div key={a.id} className="lobby-announcement-card">
                                                <div className="lobby-announcement-title">{a.title}</div>
                                                <p className="lobby-announcement-text">{a.text}</p>
                                                <button className="lobby-announcement-link" onClick={() => setActiveAnnouncement(a)}>View</button>
                                            </div>
                                        ))}
                                    </div>
                                    {ANNOUNCEMENT_PAGES > 1 && (
                                        <div className="lobby-location-dots lobby-announcement-dots">
                                            {Array.from({ length: ANNOUNCEMENT_PAGES }).map((_, i) => (
                                                <button
                                                    key={i}
                                                    className={`lobby-location-dot${i === page ? ' active' : ''}`}
                                                    onClick={() => setAnnouncementIndex(i)}
                                                    aria-label={`Go to page ${i + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>

                    {/* Inquiries + Locations */}
                    <div className="lobby-bottom-grid">
                        <div className="lobby-card">
                            <div className="lobby-section-header">
                                <h2 className="lobby-section-title">Inquiries</h2>
                            </div>
                            <div className="lobby-tabs-row">
                                <button className={`lobby-tab-pill${inquiryTab === 'open' ? ' active' : ''}`} onClick={() => setInquiryTab('open')}>
                                    Open <span className="lobby-tab-count">{inquiries.filter(i => i.status === 'Open').length}</span>
                                </button>
                                <button className={`lobby-tab-pill${inquiryTab === 'closed' ? ' active' : ''}`} onClick={() => setInquiryTab('closed')}>
                                    Closed <span className="lobby-tab-count">{inquiries.filter(i => i.status === 'Closed').length}</span>
                                </button>
                                <button className="lobby-add-btn">+</button>
                            </div>
                            {(() => {
                                const shown = inquiries.filter(i => i.status === (inquiryTab === 'open' ? 'Open' : 'Closed'));
                                if (shown.length === 0) {
                                    return <p className="lobby-empty-msg">You currently have no {inquiryTab} tickets.</p>;
                                }
                                return (
                                    <div className="lobby-inquiry-list">
                                        {shown.map(inq => (
                                            <div key={inq.id} className="lobby-inquiry-row">
                                                <InquiryAvatar name={inq.name} />
                                                <div className="lobby-inquiry-body">
                                                    <div className="lobby-inquiry-top">
                                                        <span className="lobby-inquiry-name">{inq.name}</span>
                                                        <span className={`lobby-inquiry-badge${inq.status === 'Open' ? ' open' : ' closed'}`}>{inq.status === 'Open' ? 'Awaiting review' : 'Closed'}</span>
                                                    </div>
                                                    <span className="lobby-inquiry-msg">{inq.message}</span>
                                                    <div className="lobby-inquiry-footer">
                                                        <span className="lobby-inquiry-date">{inq.createdOn}</span>
                                                        <div className="lobby-inquiry-actions">
                                                            <button className="users-icon-btn" data-tooltip="View">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                                            </button>
                                                            <button
                                                                className={`users-icon-btn${inq.status === 'Open' ? ' lobby-close-btn' : ' lobby-reopen-btn'}`}
                                                                data-tooltip={inq.status === 'Open' ? 'Close Ticket' : 'Open Ticket'}
                                                                onClick={() => setInquiries(prev => prev.map(item => item.id === inq.id ? { ...item, status: item.status === 'Open' ? 'Closed' : 'Open' } : item))}
                                                            >
                                                                {inq.status === 'Open' ? (
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                                                                ) : (
                                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="m12 8 4 4-4 4"/></svg>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                        <div className="lobby-card">
                            <div className="lobby-section-header">
                                <h2 className="lobby-section-title">Locations</h2>
                                <div className="lobby-section-actions">
                                    <button
                                        className="lobby-nav-btn"
                                        onClick={() => setLocationIndex(i => (i - 1 + LOBBY_LOCATIONS.length) % LOBBY_LOCATIONS.length)}
                                        aria-label="Previous location"
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                                    </button>
                                    <button
                                        className="lobby-nav-btn"
                                        onClick={() => setLocationIndex(i => (i + 1) % LOBBY_LOCATIONS.length)}
                                        aria-label="Next location"
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                                    </button>
                                </div>
                            </div>
                            {(() => {
                                const loc = LOBBY_LOCATIONS[locationIndex];
                                return (
                                    <div className="lobby-location-card">
                                        <div className="lobby-location-map">
                                            <iframe
                                                title={loc.title}
                                                src={mapEmbedUrl(loc.lat, loc.lon)}
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="lobby-location-body">
                                            <div className="lobby-location-top">
                                                <span className="lobby-location-title">{loc.title}</span>
                                                {loc.isMain && <span className="lobby-location-badge">Main Office</span>}
                                            </div>
                                            <span className="lobby-location-address">{loc.address}</span>
                                            <span className="lobby-location-hours">{loc.hours} · {loc.phone}</span>
                                        </div>
                                        <div className="lobby-location-footer">
                                            <div className="lobby-location-dots">
                                                {LOBBY_LOCATIONS.map((l, i) => (
                                                    <button
                                                        key={l.id}
                                                        className={`lobby-location-dot${i === locationIndex ? ' active' : ''}`}
                                                        onClick={() => setLocationIndex(i)}
                                                        aria-label={`Go to ${l.title}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
                </>
            )}
            {switchModalOpen && (
                <SwitchModeModal
                    targetMode="Admin"
                    onConfirm={() => { setSwitchModalOpen(false); onToggle(); }}
                    onCancel={() => setSwitchModalOpen(false)}
                />
            )}
            {activeAnnouncement && (
                <NewAnnouncementModal
                    announcement={activeAnnouncement}
                    onClose={() => setActiveAnnouncement(null)}
                />
            )}
        </div>
    );
};

export default LobbyView;
