import { useMemo, useState } from 'react';
import InfoBanner from '../components/InfoBanner';
import StateBlock from '../components/StateBlock';
import StatusPill from '../components/StatusPill';
import { STATUS } from '../components/statuses';
import DesignationLabel from '../components/DesignationLabel';
import LockedControl from '../components/LockedControl';
import SearchableSelect from '../components/SearchableSelect';
import ManagerJourney from './ManagerJourney';
import './DesignBacklogView.css';

/* Design backlog — the October 2026 tickets, designed as states you can look
   at rather than conditions you have to reproduce in the running app.

   Each item renders inside a replica of the screen region it belongs to, at
   that region's real width, using the same CSS the real screen uses. A state
   shown as a floating fragment reviews well and then does not fit, which is
   the failure this page is built to avoid. */

/* ── Scaffolding ─────────────────────────────────────────────────────── */

const Frame = ({ label, width = 'full', children }) => (
    <div className={`dbk-frame dbk-frame-${width}`}>
        {label && <span className="dbk-frame-label">{label}</span>}
        <div className="dbk-frame-body">{children}</div>
    </div>
);

const Item = ({ id, title, desc, note, children, decision }) => (
    <article className="dbk-item" id={`item-${id}`}>
        <header className="dbk-item-head">
            <span className="dbk-item-no">{id}</span>
            <div className="dbk-item-headings">
                <h3 className="dbk-item-title">{title}</h3>
                <p className="dbk-item-desc">{desc}</p>
            </div>
        </header>
        <div className="dbk-item-body">{children}</div>
        {decision && (
            <p className="dbk-decision"><strong>Recommended:</strong> {decision}</p>
        )}
        {note && (
            <p className="dbk-note"><span className="dbk-note-tag">Dev</span> {note}</p>
        )}
    </article>
);

const Ticket = ({ no, title, children }) => (
    <section className="dbk-ticket" id={`ticket-${no}`}>
        <header className="dbk-ticket-head">
            <span className="dbk-ticket-no">Ticket {no}</span>
            <h2 className="dbk-ticket-title">{title}</h2>
        </header>
        {children}
    </section>
);

/* ── Replica bits, so each state sits in something that looks like the
      screen it belongs to rather than floating on the page. ───────────── */

const MiniTable = ({ cols, rows, align = {} }) => (
    <table className="dbk-table">
        <thead>
            <tr>{cols.map(c => <th key={c} style={align[c] ? { textAlign: align[c] } : undefined}>{c}</th>)}</tr>
        </thead>
        <tbody>
            {rows.map((r, i) => (
                <tr key={i}>
                    {cols.map(c => <td key={c} style={align[c] ? { textAlign: align[c] } : undefined}>{r[c]}</td>)}
                </tr>
            ))}
        </tbody>
    </table>
);

const Panel = ({ title, sub, children, actions }) => (
    <div className="dbk-panel">
        <div className="dbk-panel-head">
            <div>
                <div className="dbk-panel-label">{title}</div>
                {sub && <p className="dbk-panel-sub">{sub}</p>}
            </div>
            {actions}
        </div>
        {children}
    </div>
);

const ModalShell = ({ title, breadcrumb, children, footer, width }) => (
    <div className="dbk-modal" style={width ? { maxWidth: width } : undefined}>
        <div className="dbk-modal-head">
            <div>
                {breadcrumb && <p className="dbk-modal-crumb">{breadcrumb}</p>}
                <h4 className="dbk-modal-title">{title}</h4>
            </div>
            <span className="dbk-modal-x" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </span>
        </div>
        <div className="dbk-modal-body">{children}</div>
        {footer && <div className="dbk-modal-foot">{footer}</div>}
    </div>
);

const Btn = ({ children, kind = 'ghost', ...rest }) => (
    <button type="button" className={`dbk-btn dbk-btn-${kind}`} {...rest}>{children}</button>
);

const Field = ({ label, children, hint }) => (
    <label className="dbk-field">
        <span className="dbk-field-label">{label}</span>
        {children}
        {hint && <span className="dbk-field-hint">{hint}</span>}
    </label>
);

const Toggle = ({ on }) => <span className={`dbk-toggle${on ? ' on' : ''}`}><span /></span>;

/* ── Page ────────────────────────────────────────────────────────────── */

const TICKETS = [
    { no: 1, title: 'Admin vs Manager permissions' },
    { no: 2, title: 'Custom role holders' },
    { no: 3, title: 'Add Inquiry "For" field' },
    { no: 4, title: 'E-sign templates' },
];

const DesignBacklogView = ({ standalone = false }) => {
    const [view, setView] = useState('tickets');
    const [filter, setFilter] = useState('all');
    const [permPattern, setPermPattern] = useState('locked');

    const shown = useMemo(
        () => (filter === 'all' ? TICKETS : TICKETS.filter(t => String(t.no) === filter)),
        [filter],
    );
    const show = (no) => shown.some(t => t.no === no);

    return (
        <div className={standalone ? 'dbk-standalone' : 'portal-content dbk-page'}>
            {standalone && (
                <header className="dbk-topbar">
                    <span className="dbk-brand">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-8"/></svg>
                        CaseActive
                    </span>
                    <span className="dbk-topbar-meta">Internal · Design backlog</span>
                </header>
            )}

            <div className={standalone ? 'dbk-page dbk-page-inner' : ''}>
                <InfoBanner message="Design states for the October 2026 backlog. Nothing here is wired to the live app: every card is a design of a state, rendered at the width of the screen it belongs to, so it can be screenshotted and posted back to its Slack thread." />

                <div className="dbk-viewswitch" role="group" aria-label="View">
                    {[['tickets', 'By ticket'], ['journey', 'Manager journey']].map(([id, label]) => (
                        <button
                            key={id}
                            className={`dbk-view-btn${view === id ? ' active' : ''}`}
                            onClick={() => setView(id)}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {view === 'journey' ? <ManagerJourney /> : <>
                <div className="dbk-hero">
                    <span className="dbk-eyebrow">Design backlog · October 2026</span>
                    <h2 className="dbk-title">12 tickets, 37 items</h2>
                    <p className="dbk-standfirst">
                        Four shared patterns come first, because most of the tickets are the same few problems wearing
                        different labels: something failed to load, something is not yours to change, something has a status
                        nobody has drawn yet. Settling those four once is what stops the twelve tickets becoming twelve
                        dialects.
                    </p>
                </div>

                <div className="dbk-filter" role="group" aria-label="Filter by ticket">
                    <button className={`dbk-chip${filter === 'all' ? ' active' : ''}`} onClick={() => setFilter('all')}>All</button>
                    {TICKETS.map(t => (
                        <button
                            key={t.no}
                            className={`dbk-chip${filter === String(t.no) ? ' active' : ''}`}
                            onClick={() => setFilter(String(t.no))}
                        >
                            {t.no}
                        </button>
                    ))}
                    <span className="dbk-filter-note">Tickets 5 to 12 to follow</span>
                </div>

                {/* ── Phase 1 ─────────────────────────────────────────── */}
                <section className="dbk-ticket" id="phase-1">
                    <header className="dbk-ticket-head">
                        <span className="dbk-ticket-no dbk-ticket-no-phase">Phase 1</span>
                        <h2 className="dbk-ticket-title">Shared foundations</h2>
                    </header>

                    <Item
                        id="A"
                        title="Couldn't load state"
                        desc="Message plus Try again, visually distinct from an empty state. Used in tickets 5, 9 and 12."
                    >
                        <p className="dbk-aside">
                            The two states are the same shape today, which is the bug: a list that failed looks like a list
                            with nothing in it, so people conclude they have no invoices rather than retrying. Empty is grey
                            and calm. Failed is warm, and the retry is the loudest thing in the block.
                        </p>
                        <Frame label="Empty · nothing wrong">
                            <StateBlock tone="empty" title="No invoices yet" message="Invoices you raise for this case will appear here." />
                        </Frame>
                        <Frame label="Couldn't load · a fault, with a way out">
                            <StateBlock
                                tone="error"
                                title="Invoices couldn't be loaded"
                                message="Something went wrong at our end. Nothing has changed."
                                actionLabel="Try again"
                            />
                        </Frame>
                        <Frame label="Compact · inside a narrow panel">
                            <StateBlock compact tone="error" title="Your cases couldn't be loaded." actionLabel="Try again" />
                        </Frame>
                    </Item>

                    <Item
                        id="B"
                        title="Designation label"
                        desc="How Role · Designation displays. Button when editable, plain text otherwise. Used in tickets 5, 10 and 11."
                    >
                        <p className="dbk-aside">
                            Always shown attached to the role. "Lead Attorney" alone does not say what the person can do, and
                            "Staff" alone does not say what they are called. People who cannot change it get plain text, never
                            a disabled button, so a read-only table does not look broken.
                        </p>
                        <Frame label="Editable · hover to see it is a control">
                            <div className="dbk-row-demo">
                                <DesignationLabel role="Staff" designation="Lead Attorney" editable onEdit={() => {}} />
                                <DesignationLabel role="Staff" designation="Case Manager" editable onEdit={() => {}} />
                                <DesignationLabel role="Admin" designation={null} editable onEdit={() => {}} />
                            </div>
                        </Frame>
                        <Frame label="Read only">
                            <div className="dbk-row-demo">
                                <DesignationLabel role="Staff" designation="Paralegal" />
                                <DesignationLabel role="Client" designation={null} />
                            </div>
                        </Frame>
                    </Item>

                    <Item
                        id="C"
                        title="Locked / restricted"
                        desc="How a control looks when the viewer cannot change it, with an inline explanation. Used in tickets 1 and 6."
                        decision="Grey out and explain, rather than hide. See ticket 1.1 for the argument."
                    >
                        <Frame label="A locked setting row">
                            <LockedControl reason="Only an Admin can change this.">
                                <div className="dbk-setting-row">
                                    <div>
                                        <span className="dbk-setting-name">Allow clients to upload documents</span>
                                        <span className="dbk-setting-hint">Clients can add files to their own case.</span>
                                    </div>
                                    <Toggle on />
                                </div>
                            </LockedControl>
                        </Frame>
                        <Frame label="A locked panel, where the whole card is Admin only">
                            <StateBlock
                                tone="locked"
                                title="Managed by an Admin"
                                message="You can see how this hub is set up, but only an Admin can change it."
                            />
                        </Frame>
                    </Item>

                    <Item
                        id="D"
                        title="Status pills"
                        desc="Extend the badge set for Refund pending, Refunded, Refund failed, Needs a document and Access removed."
                        note="Declared once in components/StatusPill.jsx as STATUS. Adding a status is one line there, not a new colour per screen."
                    >
                        <p className="dbk-aside">
                            Tone is chosen by what the status asks of the viewer, not by how it sounds. Pending is cooler than
                            warning on purpose: nothing is wrong, you are only waiting.
                        </p>
                        <Frame label="New in this backlog">
                            <div className="dbk-pill-row">
                                <StatusPill status="refundPending" dot />
                                <StatusPill status="refunded" dot />
                                <StatusPill status="refundFailed" dot />
                                <StatusPill status="needsDocument" dot />
                                <StatusPill status="accessRemoved" dot />
                            </div>
                        </Frame>
                        <Frame label="Existing statuses, same component">
                            <div className="dbk-pill-row">
                                {['active', 'open', 'paid', 'processing', 'draft', 'failed', 'closed'].map(k => (
                                    <StatusPill key={k} status={k} />
                                ))}
                            </div>
                        </Frame>
                    </Item>
                </section>

                {/* ── Ticket 1 ────────────────────────────────────────── */}
                {show(1) && (
                    <Ticket no={1} title="Admin vs Manager permissions">
                        <Item
                            id="1.1"
                            title="One pattern for Admin-only controls"
                            desc="Decide greyed out or hidden, and where the line Only an Admin can change this goes."
                            decision="Grey out and explain. Hiding a control answers nothing: a Manager cannot tell whether the setting is off, missing, or simply not theirs, so they ask an Admin to go and look. Greying it out shows the current value and says who owns it, which is usually the whole question. It also keeps both roles on the same page, so a screenshot from a Manager still matches what an Admin sees."
                        >
                            <p className="dbk-aside">
                                Placement: the line sits directly under the control it explains, not at the top of the page.
                                One line per locked control reads as noise, so where a whole card is Admin only, lock the card
                                and explain once at the card.
                            </p>
                            <div className="dbk-ab">
                                <Frame label="A · Greyed out with a reason (recommended)">
                                    <LockedControl reason="Only an Admin can change this.">
                                        <div className="dbk-setting-row">
                                            <div>
                                                <span className="dbk-setting-name">Two-factor authentication</span>
                                                <span className="dbk-setting-hint">Required for everyone in this hub.</span>
                                            </div>
                                            <Toggle on />
                                        </div>
                                    </LockedControl>
                                </Frame>
                                <Frame label="B · Hidden">
                                    <div className="dbk-hidden-demo">
                                        <p>Nothing renders. The Manager cannot tell the setting exists, so the question moves to Slack.</p>
                                    </div>
                                </Frame>
                            </div>
                            <div className="dbk-toggle-bar" role="group" aria-label="Preview as">
                                <span className="dbk-toggle-bar-label">Preview as</span>
                                <div className="dbk-seg">
                                    {['admin', 'manager'].map(r => (
                                        <button
                                            key={r}
                                            className={`dbk-seg-btn${(permPattern === 'open' ? 'admin' : 'manager') === r ? ' active' : ''}`}
                                            onClick={() => setPermPattern(r === 'admin' ? 'open' : 'locked')}
                                        >
                                            {r === 'admin' ? 'Admin' : 'Manager'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <Frame label="The same panel, both roles">
                                {permPattern === 'open' ? (
                                    <div className="dbk-setting-row">
                                        <div>
                                            <span className="dbk-setting-name">Two-factor authentication</span>
                                            <span className="dbk-setting-hint">Required for everyone in this hub.</span>
                                        </div>
                                        <Toggle on />
                                    </div>
                                ) : (
                                    <LockedControl reason="Only an Admin can change this.">
                                        <div className="dbk-setting-row">
                                            <div>
                                                <span className="dbk-setting-name">Two-factor authentication</span>
                                                <span className="dbk-setting-hint">Required for everyone in this hub.</span>
                                            </div>
                                            <Toggle on />
                                        </div>
                                    </LockedControl>
                                )}
                            </Frame>
                        </Item>

                        <Item
                            id="1.2"
                            title="Applied across every Admin-only screen"
                            desc="Modules, case types, custom fields, roles, billing, API keys, webhooks, Payments, and Support's intake settings."
                            note="Support's intake settings (categories, the intake question, Remove enquiry form) do not exist in this codebase. Designed here from the ticket description only."
                        >
                            <Frame label="Payments Settings · today it spins forever for a Manager">
                                <Panel title="PAYMENT PROVIDER" sub="Connect a provider to collect invoice payments online.">
                                    <LockedControl reason="Only an Admin can connect or change a payment provider.">
                                        <div className="dbk-provider">
                                            <span className="dbk-provider-logo">stripe</span>
                                            <div className="dbk-provider-main">
                                                <span className="dbk-provider-name">Stripe</span>
                                                <span className="dbk-setting-hint">Connected · payouts daily</span>
                                            </div>
                                            <Toggle on />
                                        </div>
                                    </LockedControl>
                                </Panel>
                            </Frame>

                            <Frame label="Invoices · today the Stripe card is simply absent for a Manager">
                                <Panel title="ONLINE PAYMENT">
                                    <LockedControl reason="Only an Admin can change how this invoice is paid.">
                                        <div className="dbk-provider">
                                            <span className="dbk-provider-logo">stripe</span>
                                            <div className="dbk-provider-main">
                                                <span className="dbk-provider-name">Let the client pay this invoice online</span>
                                                <span className="dbk-setting-hint">Card and bank transfer through Stripe.</span>
                                            </div>
                                            <Toggle on />
                                        </div>
                                    </LockedControl>
                                </Panel>
                            </Frame>

                            <Frame label="A locked table · roles, modules, case types, custom fields all take this shape">
                                <Panel
                                    title="ROLES"
                                    sub="Roles decide what each person can open and change."
                                    actions={<Btn kind="primary" disabled>+ Add Role</Btn>}
                                >
                                    <LockedControl reason="Only an Admin can add, rename or delete roles.">
                                        <MiniTable
                                            cols={['Role', 'Users', 'Scope']}
                                            align={{ Users: 'right' }}
                                            rows={[
                                                { Role: 'Administrator', Users: '3', Scope: 'Everything' },
                                                { Role: 'Case Manager', Users: '11', Scope: 'Cases, clients, tasks' },
                                                { Role: 'Paralegal', Users: '8', Scope: 'Cases and documents' },
                                            ]}
                                        />
                                    </LockedControl>
                                </Panel>
                            </Frame>

                            <Frame label="Support intake settings · a refused save shows the server's message">
                                <Panel title="INTAKE QUESTION">
                                    <Field label="Question shown to clients">
                                        <input className="dbk-input" defaultValue="What can we help you with?" />
                                    </Field>
                                    <StateBlock
                                        compact
                                        tone="error"
                                        title="This question is used by an active intake form and cannot be blank."
                                        message="Returned by the server. Today this reads Failed, which tells the user nothing they can act on."
                                    />
                                </Panel>
                            </Frame>
                        </Item>

                        <Item
                            id="1.3"
                            title="Change a Manager to Admin, or an Admin to Manager"
                            desc="On a member's settings. Admins cannot change their own role; Managers never see this control."
                        >
                            <div className="dbk-ab">
                                <Frame label="Admin viewing someone else">
                                    <Panel title="ROLE">
                                        <Field label="Hub role" hint="Admins can change every setting in this hub. Managers can see them but not change them.">
                                            <SearchableSelect className="dbk-input" defaultValue="manager">
                                                <option value="admin">Admin</option>
                                                <option value="manager">Manager</option>
                                            </SearchableSelect>
                                        </Field>
                                    </Panel>
                                </Frame>
                                <Frame label="Admin viewing themselves">
                                    <Panel title="ROLE">
                                        <LockedControl reason="You cannot change your own role. Ask another Admin.">
                                            <Field label="Hub role">
                                                <div className="dbk-input dbk-input-static">Admin</div>
                                            </Field>
                                        </LockedControl>
                                    </Panel>
                                </Frame>
                            </div>
                            <p className="dbk-aside">
                                A Manager sees no Role section at all here. This is the one place hiding beats greying out:
                                the control changes who holds power rather than a setting, so showing a Manager a greyed
                                Admin option invites them to ask for it.
                            </p>
                        </Item>
                    </Ticket>
                )}

                {/* ── Ticket 2 ────────────────────────────────────────── */}
                {show(2) && (
                    <Ticket no={2} title="Custom role holders">
                        <Item
                            id="2.1"
                            title="List of everyone holding a custom role"
                            desc="Opened by clicking the role's Users count. Each row: case title, Tag ID, status, person's name. Clicking a row opens that case. Includes closed cases."
                            note="Role holders are mock data. Needs an endpoint returning holders by role id, including those on closed cases."
                        >
                            <Frame label="The Users count becomes the way in">
                                <Panel title="ROLES">
                                    <MiniTable
                                        cols={['Role', 'Users', 'Scope']}
                                        align={{ Users: 'right' }}
                                        rows={[
                                            { Role: 'Administrator', Users: '3', Scope: 'Everything' },
                                            {
                                                Role: 'Lead Attorney',
                                                Users: <button className="dbk-linkish">12</button>,
                                                Scope: 'Cases and billing',
                                            },
                                            { Role: 'Paralegal', Users: '8', Scope: 'Cases and documents' },
                                        ]}
                                    />
                                </Panel>
                            </Frame>

                            <Frame label="Role holders window">
                                <ModalShell breadcrumb="Settings · Roles" title="Who holds Lead Attorney" width={660}>
                                    <p className="dbk-modal-lede">12 people hold this role. Closed cases are included.</p>
                                    <MiniTable
                                        cols={['Case', 'Tag ID', 'Status', 'Person']}
                                        rows={[
                                            { Case: 'Rear-End Collision, Downtown LA', 'Tag ID': <code className="dbk-code">a1b2c3d4e56789</code>, Status: <StatusPill status="active" />, Person: 'Marcus Bell' },
                                            { Case: 'Slip and Fall, Westwood', 'Tag ID': <code className="dbk-code">b3c4d5e6f78901</code>, Status: <StatusPill status="active" />, Person: 'Elena Ramirez' },
                                            { Case: 'Bicycle Accident, Echo Park', 'Tag ID': <code className="dbk-code">c5d6e7f8091234</code>, Status: <StatusPill status="closed" />, Person: 'Marcus Bell' },
                                        ]}
                                    />
                                    <p className="dbk-aside dbk-aside-tight">Rows are clickable and open the case.</p>
                                </ModalShell>
                            </Frame>
                        </Item>

                        <Item
                            id="2.2"
                            title="Deleting a role refused because people hold it"
                            desc="The message, plus a link to that list."
                        >
                            <Frame label="Delete refused">
                                <ModalShell title="Can't delete Lead Attorney" width={520} footer={<><Btn>Close</Btn></>}>
                                    <StateBlock
                                        tone="error"
                                        title="12 people still hold this role."
                                        message="Move them to another role first, then delete it."
                                        actionLabel="See who holds it"
                                    />
                                </ModalShell>
                            </Frame>
                        </Item>
                    </Ticket>
                )}

                {/* ── Ticket 3 ────────────────────────────────────────── */}
                {show(3) && (
                    <Ticket no={3} title='Add Inquiry "For" field'>
                        <Item
                            id="3.1"
                            title='A "For" field at the top of Add Inquiry'
                            desc="Member search, defaults to Myself."
                        />
                        <Item
                            id="3.2"
                            title="Helper line when someone else is picked"
                            desc="They'll be emailed and replies go to them."
                            note="Member search is mock data. Needs the hub member list, with the signed-in user pinned as Myself."
                        >
                            <div className="dbk-ab">
                                <Frame label="Default · Myself">
                                    <ModalShell title="Add Inquiry" width={460} footer={<><Btn>Cancel</Btn><Btn kind="primary">Send</Btn></>}>
                                        <Field label="For" hint="This inquiry will be raised in your name.">
                                            <SearchableSelect className="dbk-input" defaultValue="me">
                                                <option value="me">Myself</option>
                                                <option value="ar">Alexandra Reyes</option>
                                                <option value="jm">Jordan Miles</option>
                                            </SearchableSelect>
                                        </Field>
                                        <Field label="Subject"><input className="dbk-input" placeholder="What is this about?" /></Field>
                                    </ModalShell>
                                </Frame>
                                <Frame label="Someone else picked">
                                    <ModalShell title="Add Inquiry" width={460} footer={<><Btn>Cancel</Btn><Btn kind="primary">Send</Btn></>}>
                                        <Field label="For">
                                            <SearchableSelect className="dbk-input" defaultValue="ar">
                                                <option value="me">Myself</option>
                                                <option value="ar">Alexandra Reyes</option>
                                                <option value="jm">Jordan Miles</option>
                                            </SearchableSelect>
                                        </Field>
                                        <p className="dbk-helper">
                                            Alexandra Reyes will be emailed about this inquiry, and replies go to her.
                                        </p>
                                        <Field label="Subject"><input className="dbk-input" placeholder="What is this about?" /></Field>
                                    </ModalShell>
                                </Frame>
                            </div>
                        </Item>

                        <Item
                            id="3.3"
                            title="Closed inquiry replaces the reply box"
                            desc="A line telling the user to reopen it to reply."
                        >
                            <Frame label="Closed inquiry">
                                <Panel title="INQUIRY · CLOSED">
                                    <div className="dbk-thread">
                                        <div className="dbk-thread-msg">
                                            <span className="dbk-thread-who">Alexandra Reyes</span>
                                            <p>Thanks, that answers it.</p>
                                        </div>
                                    </div>
                                    <StateBlock
                                        compact
                                        tone="locked"
                                        title="This inquiry is closed."
                                        message="Reopen it to reply."
                                        actionLabel="Reopen"
                                    />
                                </Panel>
                            </Frame>
                        </Item>

                        <Item
                            id="3.4"
                            title="Add Inquiry when the hub's inquiry form has been removed"
                            desc="The state shown when there is no form to fill in."
                        >
                            <Frame label="No inquiry form">
                                <ModalShell title="Add Inquiry" width={460} footer={<><Btn>Close</Btn></>}>
                                    <StateBlock
                                        tone="empty"
                                        title="This hub has no inquiry form."
                                        message="An Admin removed it. Ask them to add one before raising inquiries here."
                                    />
                                </ModalShell>
                            </Frame>
                        </Item>
                    </Ticket>
                )}

                {/* ── Ticket 4 ────────────────────────────────────────── */}
                {show(4) && (
                    <Ticket no={4} title="E-sign templates">
                        <Item
                            id="4.1"
                            title="Signer record on the locked signed copy"
                            desc="Name, signing time and IP address for each signer. The ticket suggests a list above the document; choose the best placement."
                            decision="Above the document, as a closed strip that expands. A signed copy is evidence, so who signed and when has to be on the same screen as the document, not behind a tab. It stays collapsed by default because the document is what people open the page to read, and IP addresses are noise until someone is checking them."
                            note="Signer IP and exact signing time are not captured today. Needs name, ISO timestamp and IP per signer on the signed document record."
                        >
                            <Frame label="Signed copy · strip above the document">
                                <Panel title="SIGNED COPY" actions={<StatusPill status="paid" label="Signed" dot />}>
                                    <div className="dbk-signers">
                                        <div className="dbk-signers-head">
                                            <span className="dbk-signers-title">Signed by 2 people</span>
                                            <button className="dbk-linkish">Hide details</button>
                                        </div>
                                        <MiniTable
                                            cols={['Signer', 'Signed at', 'IP address']}
                                            rows={[
                                                { Signer: 'Alexandra Reyes', 'Signed at': '2 Apr 2026, 14:08 PDT', 'IP address': <code className="dbk-code">203.0.113.41</code> },
                                                { Signer: 'Marcus Bell', 'Signed at': '2 Apr 2026, 16:22 PDT', 'IP address': <code className="dbk-code">198.51.100.7</code> },
                                            ]}
                                        />
                                    </div>
                                    <div className="dbk-doc">
                                        <span>Retainer agreement.pdf</span>
                                        <span className="dbk-doc-lock">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
                                            Locked
                                        </span>
                                    </div>
                                </Panel>
                            </Frame>
                        </Item>

                        <Item
                            id="4.2"
                            title='"Needs a document" status'
                            desc="For templates with no document, replacing Ready."
                        >
                            <Frame label="Templates list">
                                <Panel title="E-SIGN TEMPLATES">
                                    <MiniTable
                                        cols={['Template', 'Participants', 'Status']}
                                        rows={[
                                            { Template: 'Retainer agreement', Participants: 'Client, Attorney', Status: <StatusPill status="ready" dot /> },
                                            { Template: 'Medical release', Participants: 'Client', Status: <StatusPill status="needsDocument" dot /> },
                                            { Template: 'Settlement authority', Participants: 'Client, Attorney', Status: <StatusPill status="draft" dot /> },
                                        ]}
                                    />
                                </Panel>
                            </Frame>
                        </Item>

                        <Item
                            id="4.3"
                            title="Field Logic with no participant picked"
                            desc="Keep Save disabled until a participant is picked, or allow saving and unassign the field with a message."
                            decision="Allow saving, and say what happened. Field Logic is usually edited in the middle of a longer piece of work, and a disabled Save with no explanation is the kind of dead end people screenshot and send to support. Saving keeps their other changes, and an unassigned field is a visible, fixable state rather than a lost afternoon. The template cannot be sent while a field is unassigned, which is where the hard stop belongs."
                        >
                            <div className="dbk-ab">
                                <Frame label="A · Save disabled (not recommended)">
                                    <ModalShell title="Field Logic" width={440} footer={<><Btn>Cancel</Btn><Btn kind="primary" disabled>Save</Btn></>}>
                                        <Field label="Participant">
                                            <SearchableSelect className="dbk-input" defaultValue="">
                                                <option value="">No participant selected</option>
                                                <option value="client">Client</option>
                                            </SearchableSelect>
                                        </Field>
                                        <p className="dbk-helper dbk-helper-muted">Save is off. Nothing says why.</p>
                                    </ModalShell>
                                </Frame>
                                <Frame label="B · Save, unassign, explain (recommended)">
                                    <ModalShell title="Field Logic" width={440} footer={<><Btn>Cancel</Btn><Btn kind="primary">Save</Btn></>}>
                                        <Field label="Participant">
                                            <SearchableSelect className="dbk-input" defaultValue="">
                                                <option value="">No participant selected</option>
                                                <option value="client">Client</option>
                                            </SearchableSelect>
                                        </Field>
                                        <StateBlock
                                            compact
                                            tone="empty"
                                            title="This field will be saved without a participant."
                                            message="It stays on the template but nobody is asked to fill it. You cannot send the template until it has one."
                                        />
                                    </ModalShell>
                                </Frame>
                            </div>
                            <Frame label="How it then reads on the template">
                                <MiniTable
                                    cols={['Field', 'Assigned to', 'Status']}
                                    rows={[
                                        { Field: 'Signature', 'Assigned to': 'Client', Status: <StatusPill status="ready" /> },
                                        { Field: 'Date of injury', 'Assigned to': <span className="dbk-unassigned">Nobody</span>, Status: <StatusPill status="needsDocument" label="Unassigned" tone="warning" /> },
                                    ]}
                                />
                            </Frame>
                        </Item>
                    </Ticket>
                )}

                </>}

                <footer className="dbk-foot">
                    <p>
                        Phase 1 and tickets 1 to 4. Tickets 5 to 12 follow once the card format and the four shared patterns
                        are agreed. {Object.keys(STATUS).length} statuses declared.
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default DesignBacklogView;
