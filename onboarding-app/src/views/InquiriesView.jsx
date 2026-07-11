import { useState } from 'react';
import InfoBanner from '../components/InfoBanner';
import SearchableSelect from '../components/SearchableSelect';

const CATEGORY_OPTIONS = ['General', 'Case update', 'Documents', 'Billing', 'Appointments'];

const INITIAL_INQUIRIES = [
    {
        id: 'inq-001',
        name: 'Ar Tanveer',
        username: 'ar@caseactive.com',
        category: 'General',
        phone: '+8801842761087',
        createdOn: 'Jul 2, 12:54 AM',
        status: 'Open',
        commentCount: 2,
        message: 'I need help understanding what information is still missing from my intake packet before the next review.',
        comments: [
            { text: 'Thanks for reaching out. We are checking the missing intake fields now.', createdOn: 'Jul 2, 1:08 AM' },
            { text: 'The medical authorization form still needs a signature. We sent a fresh copy to your portal.', createdOn: 'Jul 2, 1:19 AM' },
        ],
    },
    {
        id: 'inq-002',
        name: 'Maya Rodriguez',
        username: 'maya.rodriguez@email.com',
        category: 'Case update',
        phone: '+12125501984',
        createdOn: 'Jul 2, 9:18 AM',
        status: 'Open',
        commentCount: 1,
        message: 'Has there been any update from the insurance adjuster? I uploaded the repair estimate yesterday.',
        comments: [
            { text: 'The estimate was received. Casey Staff is reviewing it with the demand package.', createdOn: 'Jul 2, 9:42 AM' },
        ],
    },
    {
        id: 'inq-003',
        name: 'James Wilson',
        username: 'james.w@email.com',
        category: 'Documents',
        phone: '+13105501462',
        createdOn: 'Jul 2, 10:36 AM',
        status: 'Open',
        commentCount: 0,
        message: 'I cannot find the wage loss form in my portal. Can someone resend it?',
        comments: [],
    },
    {
        id: 'inq-004',
        name: 'Emily Martinez',
        username: 'emily.m@email.com',
        category: 'Appointments',
        phone: '+14155501733',
        createdOn: 'Jul 1, 4:22 PM',
        status: 'Open',
        commentCount: 3,
        message: 'I need to reschedule my call because my physical therapy appointment moved to the same time.',
        comments: [
            { text: 'No problem. What time windows work for you tomorrow?', createdOn: 'Jul 1, 4:31 PM' },
            { text: 'Any time after 2 PM works for me.', createdOn: 'Jul 1, 4:44 PM' },
            { text: 'We moved the call to 2:30 PM and sent a calendar invite.', createdOn: 'Jul 1, 5:02 PM' },
        ],
    },
    {
        id: 'inq-005',
        name: 'Lisa Chen',
        username: 'lisa.chen@email.com',
        category: 'Billing',
        phone: '+16465501820',
        createdOn: 'Jun 30, 2:15 PM',
        status: 'Closed',
        commentCount: 2,
        message: 'I received a medical bill from Regional Health. Should I pay it now or upload it to the case?',
        comments: [
            { text: 'Please upload the bill to your portal and do not pay it until the team reviews the lien status.', createdOn: 'Jun 30, 2:28 PM' },
            { text: 'Uploaded. Thank you for the quick answer.', createdOn: 'Jun 30, 2:47 PM' },
        ],
    },
    {
        id: 'inq-006',
        name: 'Robert Taylor',
        username: 'robert.t@email.com',
        category: 'General',
        phone: '+17185501745',
        createdOn: 'Jun 29, 11:05 AM',
        status: 'Closed',
        commentCount: 1,
        message: 'Can I add my spouse as a contact so they can help me track messages?',
        comments: [
            { text: 'Yes. We added them as an authorized contact and sent portal access instructions.', createdOn: 'Jun 29, 11:37 AM' },
        ],
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

const AvatarIcon = () => (
    <span className="inq-avatar" aria-hidden="true">A</span>
);

const AddInquiryModal = ({ categories, onClose, onSave }) => {
    const [phone, setPhone] = useState('');
    const [category, setCategory] = useState('');
    const [message, setMessage] = useState('');

    const canSave = category && message.trim();

    const save = () => {
        if (!canSave) return;
        onSave({
            phone: phone.trim() || '+1',
            category,
            message: message.trim(),
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm inq-modal" onClick={event => event.stopPropagation()}>
                <div className="ccm-header inq-modal-header">
                    <h2 className="ccm-title">Add Inquiry</h2>
                    <button className="ccm-close" onClick={onClose} aria-label="Close inquiry modal">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="ccm-body inq-modal-body">
                    <div className="ccm-field">
                        <label className="ccm-label">Number you can be reached</label>
                        <div className="inq-phone-input">
                            <span className="inq-country">🇺🇸</span>
                            <span className="inq-prefix">+1</span>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                            <input
                                value={phone}
                                onChange={event => setPhone(event.target.value)}
                                aria-label="Phone number"
                            />
                        </div>
                    </div>

                    <div className="ccm-field">
                        <label className="ccm-label">Category<span className="ccm-req">*</span></label>
                        <SearchableSelect className="ccm-select" value={category} onChange={event => setCategory(event.target.value)}>
                            <option value=""></option>
                            {categories.map(option => <option key={option} value={option}>{option}</option>)}
                        </SearchableSelect>
                    </div>

                    <div className="ccm-field">
                        <label className="ccm-label">Tell us more about your inquiry<span className="ccm-req">*</span></label>
                        <textarea
                            className="ccm-textarea inq-message-input"
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

const ViewTicketModal = ({ inquiry, onClose, onPostComment }) => {
    const [comment, setComment] = useState('');
    const canPost = comment.trim();

    const post = () => {
        if (!canPost) return;
        onPostComment(inquiry.id, comment.trim());
        setComment('');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm inq-ticket-modal" onClick={event => event.stopPropagation()}>
                <div className="inq-ticket-header">
                    <AvatarIcon />
                    <div className="inq-ticket-head-copy">
                        <h2 className="inq-ticket-name">{inquiry.name}</h2>
                        <div className="inq-ticket-date">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>
                            {inquiry.createdOn}
                        </div>
                    </div>
                    <button className="ccm-close inq-ticket-close" onClick={onClose} aria-label="Close ticket modal">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="inq-ticket-body">
                    <p className="inq-ticket-message">{inquiry.message}</p>

                    {inquiry.comments.length > 0 && (
                        <div className="inq-comments">
                            {inquiry.comments.map((item, index) => (
                                <div key={`${item.createdOn}-${index}`} className="inq-comment">
                                    <div className="inq-comment-meta">Jordan Admin · {item.createdOn}</div>
                                    <p>{item.text}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="inq-comment-box">
                        <textarea
                            value={comment}
                            onChange={event => setComment(event.target.value)}
                            placeholder="Write a comment...."
                            aria-label="Write a ticket comment"
                        />
                    </div>
                    <div className="inq-post-row">
                        <button className="ccm-save-btn inq-post-btn" disabled={!canPost} onClick={post}>POST</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ConfirmTicketModal = ({ inquiry, nextStatus, onCancel, onConfirm }) => {
    const action = nextStatus === 'Closed' ? 'close' : 'open';

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="confirm-modal" onClick={event => event.stopPropagation()}>
                <div className="confirm-modal-header">
                    <h3 className="confirm-modal-title">{nextStatus === 'Closed' ? 'Close Ticket' : 'Open Ticket'}</h3>
                    <button className="confirm-modal-close" onClick={onCancel} aria-label="Close ticket confirmation">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
                <div className="confirm-modal-body">
                    <p className="confirm-modal-text">
                        Are you sure you want to <strong>{action}</strong> <strong>{inquiry.name}</strong>'s ticket?
                    </p>
                </div>
                <div className="confirm-modal-footer">
                    <button className="confirm-modal-cancel" onClick={onCancel}>Cancel</button>
                    <button className="confirm-modal-confirm" onClick={onConfirm}>{nextStatus === 'Closed' ? 'Close Ticket' : 'Open Ticket'}</button>
                </div>
            </div>
        </div>
    );
};

const TicketActions = ({ inquiry, onView, onStatusChange }) => (
    <div className="inq-actions">
        <button className="users-icon-btn" data-tooltip="View Ticket" onClick={onView} aria-label={`View ticket for ${inquiry.name}`}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
        <button
            className={`users-icon-btn ${inquiry.status === 'Open' ? 'inq-close-ticket-btn' : 'inq-open-ticket-btn'}`}
            data-tooltip={inquiry.status === 'Open' ? 'Close Ticket' : 'Open Ticket'}
            onClick={() => onStatusChange(inquiry, inquiry.status === 'Open' ? 'Closed' : 'Open')}
            aria-label={`${inquiry.status === 'Open' ? 'Close' : 'Open'} ticket for ${inquiry.name}`}
        >
            {inquiry.status === 'Open' ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
            ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>
            )}
        </button>
    </div>
);

const InquiriesSettings = ({ categories, inquiries, onAddCategory, onRemoveCategory }) => {
    const [newCategory, setNewCategory] = useState('');
    const [question, setQuestion] = useState('Tell us more about your inquiry');
    const [allowNew, setAllowNew] = useState(true);
    const [requirePhone, setRequirePhone] = useState(true);

    const addCategory = () => {
        const trimmed = newCategory.trim();
        if (!trimmed || categories.some(category => category.toLowerCase() === trimmed.toLowerCase())) return;
        onAddCategory(trimmed);
        setNewCategory('');
    };

    return (
        <div className="inq-settings">
            <div className="inq-settings-main">
                <section className="inq-settings-card">
                    <div className="inq-settings-card-head">
                        <div>
                            <h2>Categories</h2>
                            <p>Organize tickets so staff can scan and route incoming questions faster.</p>
                        </div>
                        <span className="inq-settings-count">{categories.length}</span>
                    </div>

                    <div className="inq-category-add">
                        <input
                            value={newCategory}
                            onChange={event => setNewCategory(event.target.value)}
                            onKeyDown={event => { if (event.key === 'Enter') addCategory(); }}
                            placeholder="Add category..."
                        />
                        <button onClick={addCategory} disabled={!newCategory.trim()}>Add</button>
                    </div>

                    <div className="inq-category-list">
                        {categories.map(category => {
                            const count = inquiries.filter(inquiry => inquiry.category === category).length;
                            return (
                                <div key={category} className="inq-category-item">
                                    <div>
                                        <span className="inq-category-name">{category}</span>
                                        <span className="inq-category-meta">{count} ticket{count === 1 ? '' : 's'}</span>
                                    </div>
                                    <button
                                        className="inq-category-remove"
                                        onClick={() => onRemoveCategory(category)}
                                        disabled={categories.length <= 1 || count > 0}
                                        aria-label={`Remove ${category}`}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="inq-settings-card">
                    <div className="inq-settings-card-head">
                        <div>
                            <h2>Intake question</h2>
                            <p>This prompt appears in the Add Inquiry form and client-facing inquiry entry point.</p>
                        </div>
                    </div>
                    <div className="ccm-field">
                        <label className="ccm-label">Question</label>
                        <textarea
                            className="ccm-textarea inq-settings-question"
                            value={question}
                            onChange={event => setQuestion(event.target.value)}
                        />
                    </div>
                    <div className="inq-question-preview">
                        <span>Preview</span>
                        <p>{question || 'Tell us more about your inquiry'}</p>
                    </div>
                </section>
            </div>

            <aside className="inq-settings-side">
                <section className="inq-settings-card">
                    <h2>Intake controls</h2>
                    <div className="inq-setting-row">
                        <div>
                            <span>Accept new inquiries</span>
                            <p>Show the inquiry entry point to clients.</p>
                        </div>
                        <label className="user-switch">
                            <input type="checkbox" checked={allowNew} onChange={() => setAllowNew(value => !value)} />
                            <span className="user-switch-slider" />
                        </label>
                    </div>
                    <div className="inq-setting-row">
                        <div>
                            <span>Require phone number</span>
                            <p>Ask clients for a callback number.</p>
                        </div>
                        <label className="user-switch">
                            <input type="checkbox" checked={requirePhone} onChange={() => setRequirePhone(value => !value)} />
                            <span className="user-switch-slider" />
                        </label>
                    </div>
                </section>
            </aside>
        </div>
    );
};

const InquiriesView = ({ addOpen = false, onCloseAdd }) => {
    const [inquiries, setInquiries] = useState(INITIAL_INQUIRIES);
    const [activeTab, setActiveTab] = useState('Open');
    const [searchValue, setSearchValue] = useState('');
    const [viewTicket, setViewTicket] = useState(null);
    const [statusTarget, setStatusTarget] = useState(null);
    const [categories, setCategories] = useState(CATEGORY_OPTIONS);

    const filteredInquiries = inquiries.filter(inquiry => {
        if (inquiry.status !== activeTab) return false;
        if (!searchValue.trim()) return true;
        const query = searchValue.trim().toLowerCase();
        return [inquiry.name, inquiry.username, inquiry.category, inquiry.phone, inquiry.createdOn, inquiry.status]
            .some(value => value.toLowerCase().includes(query));
    });

    const addInquiry = ({ phone, category, message }) => {
        setInquiries(prev => [
            ...prev,
            {
                id: `inq-${Date.now()}`,
                name: 'Ar Tanveer',
                username: 'ar@caseactive.com',
                category,
                phone,
                createdOn: formatCreatedOn(),
                status: 'Open',
                commentCount: 0,
                message,
                comments: [],
            },
        ]);
        setActiveTab('Open');
    };

    const updateStatus = () => {
        if (!statusTarget) return;
        setInquiries(prev => prev.map(inquiry => (
            inquiry.id === statusTarget.inquiry.id
                ? { ...inquiry, status: statusTarget.nextStatus }
                : inquiry
        )));
        if (viewTicket?.id === statusTarget.inquiry.id) {
            setViewTicket(prev => prev ? { ...prev, status: statusTarget.nextStatus } : prev);
        }
        setStatusTarget(null);
    };

    const postComment = (id, text) => {
        const comment = { text, createdOn: formatCreatedOn() };
        setInquiries(prev => prev.map(inquiry => (
            inquiry.id === id
                ? { ...inquiry, comments: [...inquiry.comments, comment], commentCount: inquiry.commentCount + 1 }
                : inquiry
        )));
        setViewTicket(prev => (
            prev?.id === id
                ? { ...prev, comments: [...prev.comments, comment], commentCount: prev.commentCount + 1 }
                : prev
        ));
    };

    return (
        <div className="inq-view">
            {addOpen && <AddInquiryModal categories={categories} onClose={onCloseAdd} onSave={addInquiry} />}
            {viewTicket && <ViewTicketModal inquiry={viewTicket} onClose={() => setViewTicket(null)} onPostComment={postComment} />}
            {statusTarget && (
                <ConfirmTicketModal
                    inquiry={statusTarget.inquiry}
                    nextStatus={statusTarget.nextStatus}
                    onCancel={() => setStatusTarget(null)}
                    onConfirm={updateStatus}
                />
            )}

            <InfoBanner message="Inquiries are tickets submitted by clients and visitors. Review requests, add comments, and move tickets between open and closed states." />

            <div className="inq-tabs">
                {['Open', 'Closed', 'Settings'].map(tab => (
                    <button
                        key={tab}
                        className={`inq-tab${activeTab === tab ? ' active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'Settings' ? (
                <InquiriesSettings
                    categories={categories}
                    inquiries={inquiries}
                    onAddCategory={(category) => setCategories(prev => [...prev, category])}
                    onRemoveCategory={(category) => setCategories(prev => prev.filter(item => item !== category))}
                />
            ) : (
            <div className="hubs-table inq-table">
                <div className="hubs-toolbar">
                    <div className="hubs-search">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        <input
                            className="hubs-search-input"
                            value={searchValue}
                            onChange={event => setSearchValue(event.target.value)}
                            placeholder="Search inquiries..."
                            aria-label="Search inquiries"
                        />
                    </div>
                </div>

                <div className="inq-table-head">
                    <span>Name</span>
                    <span>Username</span>
                    <span>Category</span>
                    <span>Phone</span>
                    <span>Created On</span>
                    <span>Status</span>
                    <span>Comment Ct</span>
                    <span>Action</span>
                </div>

                {filteredInquiries.map(inquiry => (
                    <div key={inquiry.id} className="inq-table-row">
                        <span className="inq-name-cell" data-label="Name">
                            <AvatarIcon />
                            <span>{inquiry.name}</span>
                        </span>
                        <span className="cases-cell-muted" data-label="Username">{inquiry.username}</span>
                        <span className="cases-cell-muted" data-label="Category">{inquiry.category}</span>
                        <span className="cases-cell-muted" data-label="Phone">{inquiry.phone}</span>
                        <span className="cases-cell-muted" data-label="Created On">{inquiry.createdOn}</span>
                        <span className="cases-cell-muted" data-label="Status">{inquiry.status}</span>
                        <span className="cases-cell-muted" data-label="Comments">{inquiry.commentCount}</span>
                        <span data-label="Action">
                            <TicketActions
                                inquiry={inquiry}
                                onView={() => setViewTicket(inquiry)}
                                onStatusChange={(target, nextStatus) => {
                                    setStatusTarget({ inquiry: target, nextStatus });
                                }}
                            />
                        </span>
                    </div>
                ))}

                {filteredInquiries.length === 0 && (
                    <div className="inq-empty">No {activeTab.toLowerCase()} inquiries found.</div>
                )}
            </div>
            )}
        </div>
    );
};

export default InquiriesView;
