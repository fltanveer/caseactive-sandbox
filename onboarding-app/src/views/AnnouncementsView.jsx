import { useState } from 'react';
import { PERMISSION_OPTIONS, MultiSelect } from '../components/MultiSelect';

const INITIAL_ANNOUNCEMENTS = [
    {
        id: 'ann-001',
        title: 'Portal maintenance window',
        audience: ['clients'],
        createdOn: 'Jul 1, 11:35 PM',
        expiresOn: 'Jul 23, 12:00 AM',
        deleteDate: '2026-07-23',
        deleteTime: '00:00',
        message: 'The client portal will be under maintenance on July 23 from 12:00 AM to 2:00 AM Eastern. Messages and documents will sync when service resumes.',
    },
    {
        id: 'ann-002',
        title: 'Document upload reminder',
        audience: ['clients'],
        createdOn: 'Jul 1, 9:10 AM',
        expiresOn: 'Jul 15, 5:00 PM',
        deleteDate: '2026-07-15',
        deleteTime: '17:00',
        message: 'Please upload any new medical bills, repair estimates, or wage loss documents before your next case review. Clear photos are acceptable if scans are not available.',
    },
    {
        id: 'ann-003',
        title: 'Staff coverage for holiday week',
        audience: ['staff'],
        createdOn: 'Jun 30, 3:42 PM',
        expiresOn: 'Jul 8, 9:00 AM',
        deleteDate: '2026-07-08',
        deleteTime: '09:00',
        message: 'Coverage assignments for the holiday week have been updated. Check the staff calendar before promising response windows to clients.',
    },
    {
        id: 'ann-004',
        title: 'New intake checklist is live',
        audience: ['clients', 'bots'],
        createdOn: 'Jun 28, 1:18 PM',
        expiresOn: 'Jul 31, 11:59 PM',
        deleteDate: '2026-07-31',
        deleteTime: '23:59',
        message: 'The updated intake checklist is now available in each case portal. Clients will see required tasks first, followed by optional supporting materials.',
    },
];

const formatCreatedOn = () => {
    const now = new Date();
    return now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
};

const formatExpiresOn = (date, time) => {
    if (!date || !time) return 'No expiry';
    const value = new Date(`${date}T${time}`);
    if (Number.isNaN(value.getTime())) return 'No expiry';

    return value.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
};

const initAudience = (audience) => {
    if (!audience) return [];
    return audience
        .map(item => PERMISSION_OPTIONS.find(option => option.toLowerCase() === item.toLowerCase()))
        .filter(Boolean);
};

const AddAnnouncementModal = ({ initialData = null, onClose, onSave }) => {
    const [title, setTitle] = useState(initialData?.title || '');
    const [audience, setAudience] = useState(initAudience(initialData?.audience));
    const [deleteDate, setDeleteDate] = useState(initialData?.deleteDate || '2026-07-01');
    const [deleteTime, setDeleteTime] = useState(initialData?.deleteTime || '12:00');
    const [message, setMessage] = useState(initialData?.message || '');

    const canSave = title.trim() && audience.length > 0 && message.trim();
    const isEdit = !!initialData;

    const save = () => {
        if (!canSave) return;
        onSave({
            title: title.trim(),
            audience: audience.map(item => item.toLowerCase()),
            deleteDate,
            deleteTime,
            message: message.trim(),
            expiresOn: formatExpiresOn(deleteDate, deleteTime),
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm ann-modal" onClick={event => event.stopPropagation()}>
                <div className="ccm-header ann-modal-header">
                    <h2 className="ccm-title">{isEdit ? 'Edit Announcement' : 'Add Announcement'}</h2>
                    <button className="ccm-close" onClick={onClose} aria-label="Close announcement modal">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="ccm-body ann-modal-body">
                    <div className="ccm-field">
                        <label className="ccm-label">Title<span className="ccm-req">*</span></label>
                        <input
                            className="ccm-input"
                            value={title}
                            onChange={event => setTitle(event.target.value)}
                        />
                    </div>

                    <div className="ccm-field">
                        <label className="ccm-label">Who can use this template?<span className="ccm-req">*</span></label>
                        <MultiSelect
                            options={PERMISSION_OPTIONS}
                            value={audience}
                            onChange={setAudience}
                            placeholder=""
                            allValue="All"
                        />
                    </div>

                    <div className="ccm-grid-2">
                        <div className="ccm-field">
                            <label className="ccm-label">Delete Date</label>
                            <input
                                className="ccm-input"
                                type="date"
                                value={deleteDate}
                                onChange={event => setDeleteDate(event.target.value)}
                            />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Delete Time</label>
                            <input
                                className="ccm-input"
                                type="time"
                                value={deleteTime}
                                onChange={event => setDeleteTime(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="ccm-field">
                        <label className="ccm-label">Message<span className="ccm-req">*</span></label>
                        <textarea
                            className="ccm-textarea ann-message-input"
                            value={message}
                            onChange={event => setMessage(event.target.value)}
                        />
                    </div>
                </div>

                <div className="ccm-footer">
                    <button className="ccm-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="ccm-save-btn" disabled={!canSave} onClick={save}>SAVE</button>
                </div>
            </div>
        </div>
    );
};

const DeleteAnnouncementModal = ({ announcement, onCancel, onConfirm }) => (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="confirm-modal" onClick={event => event.stopPropagation()}>
            <div className="confirm-modal-header">
                <h3 className="confirm-modal-title">Delete Announcement</h3>
                <button className="confirm-modal-close" onClick={onCancel} aria-label="Close delete confirmation">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div className="confirm-modal-body">
                <p className="confirm-modal-text">
                    Are you sure you want to delete <strong>{announcement.title}</strong>? This cannot be undone.
                </p>
            </div>
            <div className="confirm-modal-footer">
                <button className="confirm-modal-cancel" onClick={onCancel}>Cancel</button>
                <button className="confirm-modal-confirm" onClick={onConfirm}>Delete</button>
            </div>
        </div>
    </div>
);

const AnnouncementsView = ({ addOpen = false, onCloseAdd }) => {
    const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
    const [editTarget, setEditTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const addAnnouncement = (data) => {
        setAnnouncements(prev => [
            ...prev,
            {
                id: `ann-${Date.now()}`,
                createdOn: formatCreatedOn(),
                ...data,
            },
        ]);
    };

    const updateAnnouncement = (id, data) => {
        setAnnouncements(prev => prev.map(item => (
            item.id === id ? { ...item, ...data } : item
        )));
    };

    const deleteAnnouncement = (id) => {
        setAnnouncements(prev => prev.filter(item => item.id !== id));
        setDeleteTarget(null);
    };

    return (
        <div className="ann-view">
            {addOpen && <AddAnnouncementModal onClose={onCloseAdd} onSave={addAnnouncement} />}
            {editTarget && (
                <AddAnnouncementModal
                    initialData={editTarget}
                    onClose={() => setEditTarget(null)}
                    onSave={(data) => updateAnnouncement(editTarget.id, data)}
                />
            )}
            {deleteTarget && (
                <DeleteAnnouncementModal
                    announcement={deleteTarget}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={() => deleteAnnouncement(deleteTarget.id)}
                />
            )}

            <div className="ann-table">
                <div className="ann-table-head">
                    <span>Title</span>
                    <span>Created On</span>
                    <span>Expires On</span>
                    <span>Action</span>
                </div>

                {announcements.map(announcement => (
                    <div key={announcement.id} className="ann-table-row">
                        <span className="ann-title-cell">{announcement.title}</span>
                        <span className="cases-cell-muted">{announcement.createdOn}</span>
                        <span className="cases-cell-muted">{announcement.expiresOn}</span>
                        <span className="ann-actions">
                            <button className="users-icon-btn" data-tooltip="Edit" onClick={() => setEditTarget(announcement)}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>
                            </button>
                            <button className="users-icon-btn ann-delete-btn" data-tooltip="Delete" onClick={() => setDeleteTarget(announcement)}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                            </button>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnnouncementsView;
