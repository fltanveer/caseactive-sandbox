import { useState } from 'react';
import InfoBanner from '../components/InfoBanner';
import SearchableSelect from '../components/SearchableSelect';
import './EventsView.css';

const EVENTS = [
    {
        id: 'ev-001', title: 'Client Intake — Johnson v. City Transit',
        dow: 'TUE', day: 27, month: 'MAY', year: 2026,
        timeLabel: 'Tue, 27 May 2026 · 10:00 – 11:00 AM',
        location: 'CaseActive Convo (Virtual)', organizer: 'Jordan Admin',
        repeat: 'none', status: 'upcoming', accentColor: '#149EB1',
    },
    {
        id: 'ev-002', title: 'Deposition — Rear-End Collision',
        dow: 'FRI', day: 30, month: 'MAY', year: 2026,
        timeLabel: 'Fri, 30 May 2026 · 2:00 – 4:30 PM',
        location: 'Downtown LA Courthouse, Room 4B', organizer: 'Jordan Admin',
        repeat: 'none', status: 'upcoming', accentColor: '#8B5CF6',
    },
    {
        id: 'ev-003', title: 'Weekly Team Sync',
        dow: 'TUE', day: 27, month: 'MAY', year: 2026,
        timeLabel: 'Every Tuesday · 4:00 – 4:30 PM',
        location: 'CaseActive Convo', organizer: 'Ar Tanveer',
        repeat: 'weekly', status: 'upcoming', accentColor: '#F59E0B',
    },
    {
        id: 'ev-004', title: 'Settlement Conference — Martinez',
        dow: 'WED', day: 20, month: 'MAY', year: 2026,
        timeLabel: 'Wed, 20 May 2026 · 9:00 AM – 12:00 PM',
        location: 'SF Mediation Center', organizer: 'Sara Chen',
        repeat: 'none', status: 'past', accentColor: '#94A3B8',
    },
    {
        id: 'ev-005', title: 'Medical Record Review — Kim Clinic',
        dow: 'THU', day: 15, month: 'MAY', year: 2026,
        timeLabel: 'Thu, 15 May 2026 · 1:00 – 2:00 PM',
        location: 'Internal — Office', organizer: 'Mike Torres',
        repeat: 'none', status: 'past', accentColor: '#94A3B8',
    },
];

const REPEAT_LABELS = { none: null, daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };

const CalBlock = ({ dow, day, color }) => (
    <div className="ev-cal" style={{ '--ev-color': color }}>
        <span className="ev-cal-dow">{dow}</span>
        <span className="ev-cal-day">{day}</span>
    </div>
);

const StatusBadge = ({ status, repeat }) => {
    if (repeat !== 'none') return <span className="ev-badge ev-badge-repeat">{REPEAT_LABELS[repeat]}</span>;
    if (status === 'upcoming') return <span className="ev-badge ev-badge-upcoming">Upcoming</span>;
    return <span className="ev-badge ev-badge-past">Past</span>;
};

const EventCard = ({ event, onEdit, onDelete, popoverOpen, onPopover }) => (
    <div className={`ev-card${event.status === 'past' ? ' ev-card-past' : ''}`}>
        <CalBlock dow={event.dow} day={event.day} color={event.accentColor} />
        <div className="ev-card-body">
            <div className="ev-card-top">
                <h3 className="ev-card-title">{event.title}</h3>
                <div className="ev-card-actions">
                    <StatusBadge status={event.status} repeat={event.repeat} />
                    <button className="ev-icon-btn ev-edit" title="Edit" onClick={onEdit}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button className="ev-icon-btn ev-delete" title="Delete" onClick={onDelete}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                    <div className="ev-more-wrap">
                        <button className="ev-icon-btn ev-more" onClick={onPopover}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>
                        </button>
                        {popoverOpen && (
                            <div className="ev-popover">
                                <button className="ev-popover-item">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                    Duplicate
                                </button>
                                <button className="ev-popover-item">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                                    Share
                                </button>
                                <div className="ev-popover-divider" />
                                <button className="ev-popover-item danger">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                                    Cancel Event
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="ev-card-meta">
                <span className="ev-meta-row">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {event.timeLabel}
                </span>
                <span className="ev-meta-row">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {event.location}
                </span>
                <span className="ev-meta-row">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Event by <strong style={{ marginLeft: 3, fontWeight: 600 }}>{event.organizer}</strong>
                </span>
            </div>
        </div>
    </div>
);

const HOURS_24 = Array.from({ length: 24 }, (_, i) => {
    const h = i % 12 || 12;
    const ampm = i < 12 ? 'AM' : 'PM';
    return { label: `${h.toString().padStart(2, '0')}:00 ${ampm}`, h: i };
});


const NOTIF_OPTIONS = ['5 minutes before', '10 minutes before', '15 minutes before', '30 minutes before', '1 hour before'];

const TimeGrid = ({ startH, endH }) => {
    const now = new Date();
    const nowPx = (now.getHours() * 60 + now.getMinutes()) * (56 / 60);

    return (
        <div className="ev-timegrid-scroll">
            <div className="ev-timegrid" style={{ position: 'relative' }}>
                {HOURS_24.map(({ label, h }) => (
                    <div key={h} className="ev-timeslot">
                        <span className="ev-timeslot-label">{label}</span>
                        <div className={`ev-timeslot-block${h >= startH && h < endH ? ' ev-selected-slot' : ''}`} />
                    </div>
                ))}
                <div className="ev-now-line" style={{ top: nowPx }}>
                    <span className="ev-now-dot" />
                </div>
            </div>
        </div>
    );
};

const CreateEventModal = ({ onClose }) => {
    const today = new Date().toISOString().slice(0, 10);
    const [title, setTitle]       = useState('');
    const [date, setDate]         = useState(today);
    const [startTime, setStartTime] = useState('17:30');
    const [endTime, setEndTime]   = useState('18:00');
    const [repeat, setRepeat]     = useState('Does not repeat');
    const [location, setLocation] = useState('');
    const [description, setDesc]  = useState('');
    const [notifBefore, setNotifBefore] = useState('15 minutes before');
    const [attendees, setAttendees] = useState('');

    const startH = parseInt(startTime.split(':')[0], 10);
    const endH   = parseInt(endTime.split(':')[0], 10);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ev-create-modal" onClick={e => e.stopPropagation()}>

                {/* ── Full-width header ── */}
                <div className="ev-modal-header">
                    <div>
                        <p className="ev-modal-breadcrumb">Events › Create Event</p>
                        <h2 className="ev-modal-title">Create New Event</h2>
                    </div>
                    <button className="ev-modal-close" onClick={onClose}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                {/* ── Two-panel row ── */}
                <div className="ev-modal-panels">

                {/* Left: form */}
                <div className="ev-modal-form">
                    <div className="ev-modal-body">
                        {/* Title */}
                        <div className="ev-mfield">
                            <label className="ev-mlabel">Title <span className="ccm-req">*</span></label>
                            <input className="ev-minput" value={title} onChange={e => setTitle(e.target.value)} placeholder="" />
                        </div>

                        {/* Attendees */}
                        <div className="ev-mfield">
                            <label className="ev-mlabel">Attendees <span className="ccm-req">*</span></label>
                            <div className="ev-mselect-wrap">
                                <SearchableSelect className="ev-mselect" value={attendees} onChange={e => setAttendees(e.target.value)}>
                                    <option value=""></option>
                                    <option>Jordan Admin</option>
                                    <option>Sara Chen</option>
                                    <option>Mike Torres</option>
                                    <option>Ar Tanveer</option>
                                </SearchableSelect>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                        </div>

                        {/* Duration row */}
                        <div className="ev-mfield">
                            <label className="ev-mlabel">Duration <span className="ccm-req">*</span></label>
                            <div className="ev-duration-row">
                                <input type="date" className="ev-minput ev-date-input" value={date} onChange={e => setDate(e.target.value)} />
                                <span className="ev-duration-sep">from</span>
                                <input type="time" className="ev-minput ev-time-input" value={startTime} onChange={e => setStartTime(e.target.value)} />
                                <span className="ev-duration-sep">to</span>
                                <input type="time" className="ev-minput ev-time-input" value={endTime} onChange={e => setEndTime(e.target.value)} />
                            </div>
                        </div>

                        {/* Repeat */}
                        <div className="ev-mfield">
                            <label className="ev-mlabel">Repeat</label>
                            <div className="ev-mselect-wrap">
                                <SearchableSelect className="ev-mselect" value={repeat} onChange={e => setRepeat(e.target.value)}>
                                    <option>Does not repeat</option>
                                    <option>Daily</option>
                                    <option>Weekly</option>
                                    <option>Monthly</option>
                                </SearchableSelect>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="ev-mfield">
                            <label className="ev-mlabel">Notifications</label>
                            <div className="ev-notif-box">
                                <span className="ev-notif-pill">
                                    <button className="ev-notif-x" aria-label="Remove">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                    When event starts
                                </span>
                                <span className="ev-notif-pill ev-notif-pill-select">
                                    <button className="ev-notif-x" aria-label="Remove">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                    <SearchableSelect className="ev-notif-select" value={notifBefore} onChange={e => setNotifBefore(e.target.value)}>
                                        {NOTIF_OPTIONS.map(o => <option key={o}>{o}</option>)}
                                    </SearchableSelect>
                                    <svg className="ev-notif-chevron" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                                </span>
                                <button className="ev-notif-add-btn" aria-label="Add notification">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                </button>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="ev-mfield">
                            <label className="ev-mlabel">Event Location</label>
                            <div className="ev-mselect-wrap">
                                <SearchableSelect className="ev-mselect" value={location} onChange={e => setLocation(e.target.value)}>
                                    <option value="">No Location</option>
                                    <option>CaseActive Convo (Virtual)</option>
                                    <option>In-Person — Office</option>
                                    <option>Google Meet</option>
                                    <option>Zoom</option>
                                    <option>Custom…</option>
                                </SearchableSelect>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="ev-mfield">
                            <label className="ev-mlabel">Description</label>
                            <textarea className="ev-mtextarea" value={description} onChange={e => setDesc(e.target.value)} rows={4} />
                        </div>
                    </div>
                </div>{/* /ev-modal-form */}

                {/* Right: time grid */}
                <div className="ev-modal-calendar">
                    <TimeGrid startH={startH} endH={endH} />
                </div>

                </div>{/* /ev-modal-panels */}

                {/* ── Full-width footer ── */}
                <div className="ev-modal-footer">
                    <button className="ev-modal-close-btn" onClick={onClose}>Close</button>
                    <button className="ev-modal-save-btn">Create Event</button>
                </div>

            </div>{/* /ev-create-modal */}
        </div>
    );
};

const TABS = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past',     label: 'Past'     },
    { id: 'all',      label: 'All Events' },
];

const EventsView = ({ embedded = false }) => {
    const [tab, setTab]               = useState('upcoming');
    const [createOpen, setCreateOpen] = useState(false);
    const [popoverIdx, setPopoverIdx] = useState(null);

    const filtered = EVENTS.filter(e => tab === 'all' || e.status === tab);

    return (
        <div className={`events-view${embedded ? ' events-view-embedded' : ''}`}>
            {createOpen && <CreateEventModal onClose={() => setCreateOpen(false)} />}

            {!embedded && <InfoBanner message="Events let you schedule and track meetings, depositions, hearings, and deadlines across your cases." />}

            <div className={embedded ? 'ev-tabs-outer-embedded' : 'ev-tabs-outer'}>
                <div className="ev-tabs-bar">
                    {TABS.map(t => (
                        <button key={t.id} className={`ev-tab${tab === t.id ? ' active' : ''}`} onClick={() => { setTab(t.id); setPopoverIdx(null); }}>
                            {t.label}
                        </button>
                    ))}
                </div>
                {embedded && (
                    <button className="hubs-new-btn" onClick={() => setCreateOpen(true)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        NEW
                    </button>
                )}
            </div>

            {!embedded && (
                <div className="cases-page-header">
                    <h1 className="cases-title">Events &gt; {TABS.find(t => t.id === tab)?.label}</h1>
                    <button className="hubs-new-btn" onClick={() => setCreateOpen(true)}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        NEW
                    </button>
                </div>
            )}

            <div className={embedded ? '' : 'hubs-table'}>
                {filtered.length === 0 ? (
                    <div className="ev-empty">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <p>No {tab === 'all' ? '' : tab} events found.</p>
                    </div>
                ) : (
                    <div className={embedded ? 'ev-grid ev-grid-single' : 'ev-grid'}>
                        {filtered.map((event, i) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onEdit={() => setPopoverIdx(null)}
                                onDelete={() => setPopoverIdx(null)}
                                popoverOpen={popoverIdx === i}
                                onPopover={() => setPopoverIdx(popoverIdx === i ? null : i)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsView;
