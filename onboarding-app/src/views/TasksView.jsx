import { useRef, useState } from 'react';
import { MultiSelect } from '../components/MultiSelect';
import SearchableSelect from '../components/SearchableSelect';
import RichTextEditor from '../components/RichTextEditor';
import InfoBanner from '../components/InfoBanner';
import './library/LibraryViews.css';
import './EventsView.css';
import './FormsView.css';
import './TasksView.css';

export const TASKS_DATA = [
    {
        id: 'tsk-001', title: 'Collect medical records', author: 'Ar Tanveer',
        date: '2026-08-26', time: '21:30', repeat: 'Does not repeat',
        notifications: ['When event starts', '15 minutes before'],
        description: '<p>Request complete records from every treating provider, then reconcile against the billing packet.</p>',
        assignees: ['Mike Torres'], status: 'in-progress', attachments: ['provider-list.pdf'],
        subtasks: [
            { id: 'st-1', title: 'Request ER records', status: 'done',        assignee: 'Mike Torres', description: '', attachments: [] },
            { id: 'st-2', title: 'Request chiropractor records', status: 'in-progress', assignee: 'Mike Torres', description: '', attachments: [] },
            { id: 'st-3', title: 'Reconcile billing totals', status: 'todo',  assignee: '',            description: '', attachments: [] },
        ],
        comments: [{ id: 'c1', author: 'Sara Chen', text: 'ER already sent theirs — check the shared drive.', when: '2d ago' }],
        created: 'Aug 1, 3:24 AM', updated: 'Aug 20, 9:10 AM',
    },
    {
        id: 'tsk-002', title: 'Draft demand letter', author: 'Jordan Admin',
        date: '2026-09-04', time: '09:00', repeat: 'Does not repeat',
        notifications: ['1 day before'],
        description: '<p>Full demand package once treatment is complete. Include the wage loss declaration.</p>',
        assignees: ['Sara Chen', 'Ar Tanveer'], status: 'todo', attachments: [],
        subtasks: [
            { id: 'st-4', title: 'Summarise treatment', status: 'todo', assignee: 'Sara Chen', description: '', attachments: [] },
            { id: 'st-5', title: 'Attach wage loss figures', status: 'todo', assignee: '', description: '', attachments: [] },
        ],
        comments: [], created: 'Aug 12, 11:02 AM', updated: 'Aug 12, 11:02 AM',
    },
    {
        id: 'tsk-003', title: 'File the complaint', author: 'Sara Chen',
        date: '2026-07-18', time: '16:00', repeat: 'Does not repeat',
        notifications: [],
        description: '<p>Filed with the Superior Court, service to follow.</p>',
        assignees: ['Jordan Admin'], status: 'done', attachments: ['stamped-complaint.pdf'],
        subtasks: [
            { id: 'st-6', title: 'Pay filing fee', status: 'done', assignee: 'Jordan Admin', description: '', attachments: [] },
            { id: 'st-7', title: 'Arrange service of process', status: 'done', assignee: 'Jordan Admin', description: '', attachments: [] },
        ],
        comments: [], created: 'Jul 2, 8:15 AM', updated: 'Jul 18, 4:40 PM',
    },
    {
        id: 'tsk-004', title: 'Prep client for deposition', author: 'Ar Tanveer',
        date: '2026-05-29', time: '10:00', repeat: 'Does not repeat',
        notifications: ['1 day before'],
        description: '<p>Two-hour prep session the day before. Walk through likely questions.</p>',
        assignees: [], status: 'todo', attachments: [],
        subtasks: [], comments: [], created: 'May 20, 2:00 PM', updated: 'May 20, 2:00 PM',
    },
];

const TASK_TEMPLATES = [
    { id: 'ttpl-1', title: 'Client Intake Checklist', description: 'Everything to collect before the first strategy call.' },
    { id: 'ttpl-2', title: 'Records Collection',      description: 'Request, chase and reconcile provider records.' },
    { id: 'ttpl-3', title: 'Demand Package Prep',     description: 'Assemble the demand letter and its exhibits.' },
    { id: 'ttpl-4', title: 'Litigation Prep',         description: 'Filing, service and discovery deadlines.' },
    { id: 'ttpl-5', title: 'Settlement Closeout',     description: 'Disbursement, lien resolution and file closing.' },
];

const PEOPLE = ['Ar Tanveer', 'Jordan Admin', 'Sara Chen', 'Mike Torres'];
const REPEAT_OPTIONS = ['Does not repeat', 'Daily', 'Weekly', 'Monthly'];
const NOTIFICATION_OPTIONS = [
    'When event starts', '15 minutes before', '30 minutes before',
    '1 hour before', '1 day before',
];

const STATUSES = [
    { id: 'todo',        label: 'To Do'       },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'done',        label: 'Done'        },
];
const statusLabel = (id) => STATUSES.find(s => s.id === id)?.label || 'To Do';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* Parse as local time — `new Date('2026-08-26')` is UTC and can slip a day. */
const parseDate = (iso) => {
    const [y, m, d] = (iso || '').split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
};

const dueLabel = ({ date, time }) => {
    const d = parseDate(date);
    const [h, min] = time.split(':').map(Number);
    const ampm = h < 12 ? 'AM' : 'PM';
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${h % 12 || 12}:${String(min).padStart(2, '0')} ${ampm}`;
};

/* A finished task can't be late, however far past its date it sits */
const isOverdue = (row) => {
    if (row.status === 'done') return false;
    const d = parseDate(row.date);
    const [h, min] = row.time.split(':').map(Number);
    d.setHours(h, min);
    return d < new Date();
};

const progressOf = (row) => {
    if (!row.subtasks.length) return row.status === 'done' ? 100 : 0;
    return Math.round((row.subtasks.filter(s => s.status === 'done').length / row.subtasks.length) * 100);
};

const initials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const BLANK_TASK = {
    title: '', time: '09:00', repeat: 'Does not repeat',
    notifications: ['When event starts', '15 minutes before'], description: '',
    assignees: [], status: 'todo', subtasks: [], attachments: [], comments: [],
};

/* ── Add / Edit Settings — the scheduling half of a task ── */
const TaskSettingsModal = ({ row, mode = 'edit', onClose, onSave }) => {
    const isAdd = mode === 'add';
    const [source, setSource]        = useState('new');
    const [title, setTitle]          = useState(row.title);
    const [date, setDate]            = useState(row.date);
    const [time, setTime]            = useState(row.time);
    const [repeat, setRepeat]        = useState(row.repeat);
    const [notifications, setNotifs] = useState(row.notifications);
    const [description, setDesc]     = useState(row.description);
    const [notifOpen, setNotifOpen]  = useState(false);

    const canSave = !!title.trim();

    const useTemplate = (t) => {
        setTitle(t.title);
        setDesc(`<p>${t.description}</p>`);
        setSource('new');
    };

    const addNotif = (val) => {
        if (!notifications.includes(val)) setNotifs(prev => [...prev, val]);
        setNotifOpen(false);
    };
    const removeNotif = (val) => setNotifs(prev => prev.filter(n => n !== val));

    const save = () => {
        if (!canSave) return;
        onSave({ ...row, title: title.trim(), date, time, repeat, notifications, description });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm afm-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Tasks · {isAdd ? 'New' : row.title}</p>
                        <h2 className="ccm-title">{isAdd ? 'Add Task' : 'Edit Settings'}</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="ccm-body">
                    {isAdd && (
                        <div className="ev-tabs-bar cfm-source-tabs">
                            <button className={`ev-tab${source === 'new' ? ' active' : ''}`} onClick={() => setSource('new')}>New</button>
                            <button className={`ev-tab${source === 'templates' ? ' active' : ''}`} onClick={() => setSource('templates')}>Templates</button>
                        </div>
                    )}

                    {isAdd && source === 'templates' ? (
                        <div className="cfm-template-list">
                            {TASK_TEMPLATES.map(t => (
                                <button key={t.id} className="cfm-template-card" onClick={() => useTemplate(t)}>
                                    <span className="cfm-template-icon">
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                                    </span>
                                    <span className="cfm-template-text">
                                        <span className="cfm-template-title">{t.title}</span>
                                        <span className="cfm-template-desc">{t.description}</span>
                                    </span>
                                    <svg className="cfm-template-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="ccm-field">
                                <label className="ccm-label">Title <span className="ccm-req">*</span></label>
                                <input className="ccm-input" placeholder="e.g. Collect medical records" value={title} onChange={e => setTitle(e.target.value)} autoFocus />
                            </div>

                            <div className="cfm-due-grid">
                                <div className="ccm-field">
                                    <label className="ccm-label">Due Date <span className="ccm-req">*</span></label>
                                    <input type="date" className="ccm-input" value={date} onChange={e => setDate(e.target.value)} />
                                </div>
                                <div className="ccm-field">
                                    <label className="ccm-label">Due Time <span className="ccm-req">*</span></label>
                                    <input type="time" className="ccm-input" value={time} onChange={e => setTime(e.target.value)} />
                                </div>
                                <div className="ccm-field">
                                    <label className="ccm-label">Repeat</label>
                                    <SearchableSelect value={repeat} onChange={e => setRepeat(e.target.value)}>
                                        {REPEAT_OPTIONS.map(o => <option key={o}>{o}</option>)}
                                    </SearchableSelect>
                                </div>
                            </div>

                            <div className="ccm-field">
                                <label className="ccm-label">Notifications</label>
                                <div className="afm-notif-box">
                                    {notifications.map(n => (
                                        <span key={n} className="afm-notif-chip">
                                            <button className="afm-chip-remove" onClick={() => removeNotif(n)}>
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                            </button>
                                            {n}
                                        </span>
                                    ))}
                                    <div className="afm-notif-add-wrap">
                                        <button className="afm-notif-add-btn" onClick={() => setNotifOpen(o => !o)}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                        </button>
                                        {notifOpen && (
                                            <div className="afm-notif-dropdown">
                                                {NOTIFICATION_OPTIONS.filter(o => !notifications.includes(o)).map(o => (
                                                    <button key={o} className="afm-notif-opt" onClick={() => addNotif(o)}>{o}</button>
                                                ))}
                                                {NOTIFICATION_OPTIONS.every(o => notifications.includes(o)) && (
                                                    <span className="afm-notif-opt" style={{ color: '#9CA3AF', cursor: 'default' }}>All added</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="ccm-field">
                                <label className="ccm-label">Description</label>
                                <RichTextEditor value={description} onChange={setDesc} placeholder="What does this task involve?" />
                            </div>
                        </>
                    )}
                </div>

                <div className="ccm-footer">
                    <button className="imp-cancel-btn" onClick={onClose}>Cancel</button>
                    {!(isAdd && source === 'templates') && (
                        <button className="imp-save-btn" disabled={!canSave} onClick={save}>
                            {isAdd ? (
                                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Create Task</>
                            ) : (
                                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Changes</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Edit Task — the working surface: description, child tasks, activity ── */
const TaskEditorModal = ({ row, onClose, onSave }) => {
    const [title, setTitle]             = useState(row.title);
    const [description, setDesc]        = useState(row.description);
    const [assignees, setAssignees]     = useState(row.assignees);
    const [status, setStatus]           = useState(row.status);
    const [subtasks, setSubtasks]       = useState(row.subtasks);
    const [attachments, setAttachments] = useState(row.attachments);
    const [comments, setComments]       = useState(row.comments);
    const [draft, setDraft]             = useState('');
    const [expanded, setExpanded]       = useState(new Set());
    const fileInputRef = useRef(null);
    const subtaskFileRefs = useRef({});

    const done = subtasks.filter(s => s.status === 'done').length;
    const pct = subtasks.length ? Math.round((done / subtasks.length) * 100) : (status === 'done' ? 100 : 0);

    const toggleExpand = (id) => setExpanded(prev => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    const addSubtask = () => {
        const id = `st-${Date.now()}`;
        setSubtasks(prev => [...prev, { id, title: '', status: 'todo', assignee: '', description: '', attachments: [] }]);
        setExpanded(prev => new Set(prev).add(id));
    };
    const setSub = (id, patch) => setSubtasks(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)));
    const removeSubtask = (id) => setSubtasks(prev => prev.filter(s => s.id !== id));

    const handleAttach = (e) => {
        setAttachments(prev => [...prev, ...Array.from(e.target.files || []).map(f => f.name)]);
        e.target.value = '';
    };
    const removeAttachment = (idx) => setAttachments(prev => prev.filter((_, i) => i !== idx));

    const handleSubtaskAttach = (id, e) => {
        const names = Array.from(e.target.files || []).map(f => f.name);
        setSubtasks(prev => prev.map(s => (s.id === id ? { ...s, attachments: [...s.attachments, ...names] } : s)));
        e.target.value = '';
    };
    const removeSubtaskAttachment = (id, idx) =>
        setSubtasks(prev => prev.map(s => (s.id === id ? { ...s, attachments: s.attachments.filter((_, i) => i !== idx) } : s)));

    const postComment = () => {
        if (!draft.trim()) return;
        setComments(prev => [...prev, { id: `c-${Date.now()}`, author: 'Ar Tanveer', text: draft.trim(), when: 'Just now' }]);
        setDraft('');
    };

    const save = () => {
        onSave({
            ...row,
            title: title.trim() || 'Untitled task',
            description, assignees, status, attachments, comments,
            subtasks: subtasks.filter(s => s.title.trim()),
            updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="vtm-modal" onClick={e => e.stopPropagation()}>
                <div className="vtm-header">
                    <div className="vtm-header-left">
                        <span className="vtm-breadcrumb">Tasks · Edit Task</span>
                        <input className="vtm-title-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title" />
                    </div>
                    <button className="ccm-close" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="vtm-body">
                    {/* Left column */}
                    <div className="vtm-left">
                        <div className="vtm-toolbar">
                            <button className="vtm-toolbar-btn" onClick={() => fileInputRef.current?.click()}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                Attach File
                            </button>
                            <button className="vtm-toolbar-btn" onClick={addSubtask}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                Add Child Task
                            </button>
                            <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} onChange={handleAttach} />
                        </div>

                        {attachments.length > 0 && (
                            <div className="vtm-attachment-list">
                                {attachments.map((name, idx) => (
                                    <div className="vtm-attachment-chip" key={idx}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                        <span className="vtm-attachment-name">{name}</span>
                                        <button className="vtm-attachment-remove" onClick={() => removeAttachment(idx)}>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="vtm-section">
                            <p className="vtm-section-label">Description</p>
                            <RichTextEditor value={description} onChange={setDesc} placeholder="Describe what this task involves..." />
                        </div>

                        <div className="vtm-section">
                            <div className="vtm-subtask-header">
                                <p className="vtm-section-label">Child Tasks</p>
                                <span className="vtm-subtask-count">{subtasks.length}</span>
                                <span className="ct-progress-wrap">
                                    <span className="ct-progress-track"><span className="ct-progress-fill" style={{ width: `${pct}%` }} /></span>
                                    <span className="ct-progress-label">{pct}% Done</span>
                                </span>
                            </div>

                            {subtasks.length > 0 ? (
                                <div className="vtm-subtask-list">
                                    {subtasks.map((st, i) => {
                                        const isOpen = expanded.has(st.id);
                                        return (
                                            <div className="vtm-subtask-card" key={st.id}>
                                                <div className="vtm-subtask-row">
                                                    <button className={`vtm-subtask-expand${isOpen ? ' open' : ''}`} onClick={() => toggleExpand(st.id)} title={isOpen ? 'Collapse' : 'Expand'}>
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                                                    </button>
                                                    <span className="vtm-subtask-num">{i + 1}</span>
                                                    <input
                                                        className="vtm-subtask-input"
                                                        value={st.title}
                                                        placeholder="New child task"
                                                        onChange={e => setSub(st.id, { title: e.target.value })}
                                                    />
                                                    {st.attachments.length > 0 && (
                                                        <span className="vtm-subtask-attach-badge">
                                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                                            {st.attachments.length}
                                                        </span>
                                                    )}
                                                    <span className={`ct-status-wrap ct-status-${st.status}`}>
                                                        <SearchableSelect className="ct-status-select" value={st.status} onChange={e => setSub(st.id, { status: e.target.value })}>
                                                            {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                                        </SearchableSelect>
                                                    </span>
                                                    <span className="ct-sub-assignee">
                                                        {st.assignee
                                                            ? <span className="ct-avatar" title={st.assignee}>{initials(st.assignee)}</span>
                                                            : <span className="ct-unassigned">Unassigned</span>}
                                                    </span>
                                                    <button className="vtm-subtask-remove" onClick={() => removeSubtask(st.id)}>
                                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                                    </button>
                                                </div>

                                                {isOpen && (
                                                    <div className="vtm-subtask-detail">
                                                        <div className="vtm-subtask-detail-field">
                                                            <label className="vtm-subtask-detail-label">Assignee</label>
                                                            <SearchableSelect value={st.assignee} onChange={e => setSub(st.id, { assignee: e.target.value })}>
                                                                <option value="">Unassigned</option>
                                                                {PEOPLE.map(p => <option key={p}>{p}</option>)}
                                                            </SearchableSelect>
                                                        </div>
                                                        <div className="vtm-subtask-detail-field">
                                                            <label className="vtm-subtask-detail-label">Description</label>
                                                            <RichTextEditor
                                                                value={st.description}
                                                                onChange={val => setSub(st.id, { description: val })}
                                                                placeholder="Describe this child task..."
                                                                minHeight={64}
                                                            />
                                                        </div>
                                                        <div className="vtm-subtask-detail-field">
                                                            <label className="vtm-subtask-detail-label">Attachments</label>
                                                            <button className="vtm-toolbar-btn small" onClick={() => subtaskFileRefs.current[st.id]?.click()}>
                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                                                                Attach File
                                                            </button>
                                                            <input
                                                                ref={el => (subtaskFileRefs.current[st.id] = el)}
                                                                type="file" multiple style={{ display: 'none' }}
                                                                onChange={e => handleSubtaskAttach(st.id, e)}
                                                            />
                                                            {st.attachments.length > 0 && (
                                                                <div className="vtm-attachment-list">
                                                                    {st.attachments.map((name, idx) => (
                                                                        <div className="vtm-attachment-chip" key={idx}>
                                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                                                            <span className="vtm-attachment-name">{name}</span>
                                                                            <button className="vtm-attachment-remove" onClick={() => removeSubtaskAttachment(st.id, idx)}>
                                                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="vtm-empty">No child tasks yet.</p>
                            )}
                        </div>

                        <div className="vtm-section">
                            <p className="vtm-section-label">Activity</p>
                            {comments.length > 0 && (
                                <div className="ct-comment-list">
                                    {comments.map(c => (
                                        <div className="ct-comment" key={c.id}>
                                            <span className="ct-avatar">{initials(c.author)}</span>
                                            <div className="ct-comment-body">
                                                <div className="ct-comment-top">
                                                    <span className="ct-comment-author">{c.author}</span>
                                                    <span className="ct-comment-when">{c.when}</span>
                                                </div>
                                                <p className="ct-comment-text">{c.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="ct-comment-compose">
                                <span className="ct-avatar">AR</span>
                                <input
                                    className="ccm-input"
                                    placeholder="Add a comment..."
                                    value={draft}
                                    onChange={e => setDraft(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') postComment(); }}
                                />
                                <button className="imp-save-btn ct-comment-post" disabled={!draft.trim()} onClick={postComment}>Post</button>
                            </div>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="vtm-right">
                        <div className="vtm-section">
                            <p className="vtm-section-label">Status</p>
                            <span className={`ct-status-wrap ct-status-${status} ct-status-block`}>
                                <SearchableSelect className="ct-status-select" value={status} onChange={e => setStatus(e.target.value)}>
                                    {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                </SearchableSelect>
                            </span>
                        </div>

                        <div className="vtm-section">
                            <p className="vtm-section-label">Assignees</p>
                            <MultiSelect options={PEOPLE} value={assignees} onChange={setAssignees} placeholder="Unassigned" />
                        </div>

                        <div className="vtm-meta-card">
                            <div className="vtm-meta-row">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <span className="vtm-meta-label">Reporter</span>
                                <span className="vtm-meta-value">{row.author}</span>
                            </div>
                            <div className="vtm-meta-row">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                <span className="vtm-meta-label">Due</span>
                                <span className="vtm-meta-value">{dueLabel(row)}</span>
                            </div>
                            <div className="vtm-meta-row">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                <span className="vtm-meta-label">Created</span>
                                <span className="vtm-meta-value">{row.created}</span>
                            </div>
                            <div className="vtm-meta-row">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                                <span className="vtm-meta-label">Updated</span>
                                <span className="vtm-meta-value">{row.updated}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="vtm-footer">
                    <button className="imp-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="imp-save-btn" onClick={save}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const DeleteConfirmModal = ({ title, onConfirm, onCancel }) => (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-modal-header">
                <h3 className="confirm-modal-title">Delete Task</h3>
                <button className="confirm-modal-close" onClick={onCancel}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="confirm-modal-body">
                <p className="confirm-modal-text">Are you sure you want to delete <strong>"{title}"</strong>? Its child tasks and attachments go with it. This action cannot be undone.</p>
            </div>
            <div className="confirm-modal-footer">
                <button className="confirm-modal-cancel" onClick={onCancel}>Cancel</button>
                <button className="confirm-modal-confirm" style={{ background: '#DC2626', borderColor: '#DC2626' }} onClick={onConfirm}>Delete</button>
            </div>
        </div>
    </div>
);

const TABS = [
    { id: 'uncompleted', label: 'Your Uncompleted Tasks' },
    { id: 'completed',   label: 'Your Completed Tasks'   },
    { id: 'all',         label: 'All Tasks'              },
];

const TasksView = ({ embedded = false, createOpen = false, onCloseCreate }) => {
    const [tab, setTab]                 = useState('uncompleted');
    const [rows, setRows]               = useState(TASKS_DATA);
    const [settingsTarget, setSettings] = useState(null);
    const [editorTarget, setEditor]     = useState(null);
    const [deleteTarget, setDelete]     = useState(null);
    const [search, setSearch]           = useState('');
    const [localAddOpen, setLocalAddOpen] = useState(false);

    /* Embedded in the case view the NEW button sits in the page header, so the
       open flag is owned there; standalone, this view owns it. */
    const addOpen  = embedded ? createOpen : localAddOpen;
    const closeAdd = embedded ? onCloseCreate : () => setLocalAddOpen(false);

    const matchesTab = (r, id) => (id === 'all' ? true : id === 'completed' ? r.status === 'done' : r.status !== 'done');

    const filtered = rows
        .filter(r => matchesTab(r, tab))
        .filter(r => r.title.toLowerCase().includes(search.trim().toLowerCase()));

    const updateRow = (data) => setRows(prev => prev.map(r => (r.id === data.id ? data : r)));
    const addRow = (data) => setRows(prev => [
        {
            ...data, id: `tsk-${Date.now()}`, author: 'Ar Tanveer',
            created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
            updated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
        },
        ...prev,
    ]);
    const duplicateRow = (id) => setRows(prev => {
        const idx = prev.findIndex(r => r.id === id);
        /* A copy is fresh work — carrying the original's progress and comments
           over would claim child tasks were finished that nobody has touched. */
        const copy = {
            ...prev[idx], id: `tsk-${Date.now()}`, title: `${prev[idx].title} (copy)`,
            status: 'todo', comments: [],
            subtasks: prev[idx].subtasks.map(s => ({ ...s, id: `st-${Date.now()}-${s.id}`, status: 'todo' })),
        };
        const next = [...prev];
        next.splice(idx + 1, 0, copy);
        return next;
    });
    const removeRow = (id) => setRows(prev => prev.filter(r => r.id !== id));

    return (
        <div className="forms-page">
            {settingsTarget && (
                <TaskSettingsModal row={settingsTarget} mode="edit" onClose={() => setSettings(null)} onSave={updateRow} />
            )}
            {addOpen && (
                <TaskSettingsModal
                    mode="add"
                    row={{ ...BLANK_TASK, date: new Date().toISOString().slice(0, 10) }}
                    onClose={closeAdd}
                    onSave={addRow}
                />
            )}
            {editorTarget && <TaskEditorModal row={editorTarget} onClose={() => setEditor(null)} onSave={updateRow} />}
            {deleteTarget && (
                <DeleteConfirmModal
                    title={deleteTarget.title}
                    onCancel={() => setDelete(null)}
                    onConfirm={() => { removeRow(deleteTarget.id); setDelete(null); }}
                />
            )}

            <InfoBanner message="Tasks track the work on this case. Break one into child tasks to follow progress, and assign each piece to the person doing it." />

            <div className="ev-tabs-outer-embedded">
                <div className="ev-tabs-bar">
                    {TABS.map(t => (
                        <button key={t.id} className={`ev-tab${tab === t.id ? ' active' : ''}`} onClick={() => setTab(t.id)}>
                            {t.label}
                            <span className="cfm-tab-count">{rows.filter(r => matchesTab(r, t.id)).length}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="forms-view">
            <div className="hubs-table">
                <div className="hubs-toolbar">
                    <div className="hubs-search">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input type="text" className="hubs-search-input" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="cfm-table-wrap">
                    <div className="cfm-table-head ct-table-head">
                        <span>TITLE</span>
                        <span>AUTHOR</span>
                        <span>DUE DATE</span>
                        <span>SUBTASK</span>
                        <span>ASSIGNEES</span>
                        <span>STATUS</span>
                        <span>ACTION</span>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="cfm-empty">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                            <p>No tasks found.</p>
                        </div>
                    ) : filtered.map(r => (
                        <div key={r.id} className="cfm-table-row ct-table-row">
                            <span className="cases-title-cell" data-label="Title">{r.title}</span>
                            <span className="cases-cell-muted" data-label="Author">{r.author}</span>
                            <span data-label="Due Date">
                                <span className={`cfm-due${isOverdue(r) ? ' overdue' : ''}`}>
                                    {dueLabel(r)}
                                    {r.repeat !== 'Does not repeat' && <span className="cfm-repeat-tag">{r.repeat}</span>}
                                </span>
                            </span>
                            <span data-label="Subtask">
                                {r.subtasks.length ? (
                                    <span className="ct-sub-cell">
                                        <span className="ct-sub-count">
                                            {r.subtasks.filter(s => s.status === 'done').length}/{r.subtasks.length}
                                        </span>
                                        <span className="ct-progress-track sm">
                                            <span className="ct-progress-fill" style={{ width: `${progressOf(r)}%` }} />
                                        </span>
                                    </span>
                                ) : <span className="ct-sub-none">0</span>}
                            </span>
                            <span data-label="Assignees">
                                {r.assignees.length ? (
                                    <span className="ct-avatar-stack">
                                        {r.assignees.slice(0, 3).map(a => (
                                            <span className="ct-avatar" key={a} title={a}>{initials(a)}</span>
                                        ))}
                                        {r.assignees.length > 3 && <span className="ct-avatar more">+{r.assignees.length - 3}</span>}
                                    </span>
                                ) : <span className="ct-unassigned">Unassigned</span>}
                            </span>
                            <span data-label="Status">
                                <span className={`ct-status-badge ct-badge-${r.status}`}>{statusLabel(r.status)}</span>
                            </span>
                            <span data-label="Action">
                                <span className="ft-action-wrap">
                                    <button className="ft-icon-btn" title="Edit Settings" onClick={() => setSettings(r)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                    </button>
                                    <button className="ft-icon-btn" title="Edit Task" onClick={() => setEditor(r)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                    </button>
                                    <button className="ft-icon-btn" title="Duplicate Task" onClick={() => duplicateRow(r.id)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                    </button>
                                    <button className="ft-icon-btn delete" title="Delete Task" onClick={() => setDelete(r)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                    </button>
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            </div>{/* /forms-view */}
        </div>
    );
};

export default TasksView;
