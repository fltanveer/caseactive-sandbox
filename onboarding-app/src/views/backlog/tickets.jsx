/* eslint-disable react-refresh/only-export-components --
   This is a data module that happens to hold JSX: it exports one array of
   ticket records whose screens are render functions. Splitting the screens
   into component files would scatter each ticket across a dozen files for
   no gain, and nothing here is a component fast refresh could swap. */

/* The twelve October 2026 tickets.

   Each ticket carries the brief as Welby wrote it, the items dev has to
   build, where each one lands in this codebase, and whole screens rendered
   per role. Screens are full pages rather than panels: a state reviewed out
   of its shell reviews well and then does not fit.

   roles: 'admin' | 'manager' | 'staff' | 'client'
   Admin and Manager are account tiers (host_user_type on manage/whoami).
   Staff and Client are case roles carrying a designation. Two axes, which is
   why some tickets list one from each. */

import StateBlock from '../../components/StateBlock';
import StatusPill from '../../components/StatusPill';
import DesignationLabel from '../../components/DesignationLabel';
import LockedControl from '../../components/LockedControl';
import {
    AdminShell, LobbyShell, AccountShell, Panel, Table, Modal,
    Btn, Field, Input, Toggle, Row, Code, Phone, Change,
} from './Shell';

const SETTINGS_SUB = (active) => [
    'Profile', 'General', 'Hubs', 'User Intake', 'Custom Fields', 'Stages', 'Automations',
].map(label => ({ label, active: label === active }));

/* ─────────────────────────────────────────────────────────────────────
   1 · Admin vs Manager permissions
   ───────────────────────────────────────────────────────────────────── */
const t1 = {
    no: 1,
    title: 'Admin vs Manager permissions',
    roles: ['admin', 'manager'],
    brief: [
        'One pattern for Admin-only controls when a Manager views them: greyed out or hidden, and where the line "Only an Admin can change this" goes.',
        'That pattern applied to the screens Managers can\'t change, such as modules, case types, custom fields, roles, billing, API keys, webhooks, Payments and Support\'s intake settings.',
        'A control on a member\'s settings to make a Manager an Admin, or an Admin a Manager. Admins can\'t change themselves, and Managers don\'t see it.',
    ],
    alsoKnown: 'Payments is not locked for Managers today: the Stripe calls are Admin-only, so on Invoices the Stripe card is simply missing and Settings spins forever. Support\'s intake settings can still be edited, and a refused save says "Failed" rather than the server\'s sentence (support.component.ts lines 375, 395, 424).',
    decision: 'Grey out and explain, rather than hide. Hiding answers nothing: a Manager cannot tell whether a setting is off, missing, or simply not theirs, so the question moves to an Admin anyway. Greying it shows the current value and names the owner, which is usually the whole question, and keeps both tiers looking at the same page. One exception, item 1.3: the control that grants the tier is hidden, because it hands over power rather than holding a value.',
    items: [
        { id: '1.1', what: 'Locked pattern: control dimmed and inert, one reason line directly under it.', where: 'New shared component', file: 'src/components/LockedControl.jsx', roles: ['manager'] },
        { id: '1.2', what: 'Applied to Modules and Roles.', where: 'Settings → Advanced', file: 'src/views/settings/AdvancedSettingsView.jsx', roles: ['manager'] },
        { id: '1.3', what: 'Applied to Custom Fields.', where: 'Settings → Custom Fields', file: 'src/views/settings/CustomFieldsView.jsx', roles: ['manager'] },
        { id: '1.4', what: 'Applied to Billing, API keys, Webhooks.', where: 'Settings → Billing, Integration', file: 'src/views/settings/BillingSettingsView.jsx, src/views/integration/KeysView.jsx, src/views/integration/WebhooksView.jsx', roles: ['manager'] },
        { id: '1.5', what: 'Payments Settings: locked card replaces the forever spinner.', where: 'Payments → Settings', file: 'src/views/PaymentsView.jsx', roles: ['manager'], bug: true },
        { id: '1.6', what: 'Invoices: locked Stripe card replaces the card being absent.', where: 'Case → Invoices', file: 'src/views/InvoicesView.jsx', roles: ['manager'], bug: true },
        { id: '1.7', what: 'Support intake settings locked, and a refused save shows the server sentence instead of "Failed".', where: 'Support → intake settings', file: 'Not in this codebase', roles: ['manager'], bug: true, missing: true },
        { id: '1.8', what: 'Hub role select on a member. Hidden from Managers; locked when an Admin views themselves.', where: 'Users → member settings', file: 'src/views/UsersView.jsx', roles: ['admin'] },
    ],
    screens: [
        {
            id: 'roles', label: 'Settings → Roles', roles: ['admin', 'manager'],
            render: (role) => {
                const table = (
                    <Table
                        cols={['Role', 'Users', 'Scope']} align={{ Users: 'right' }}
                        rows={[
                            { Role: 'Administrator', Users: '3', Scope: 'Everything' },
                            { Role: 'Lead Attorney', Users: '12', Scope: 'Cases and billing' },
                            { Role: 'Paralegal', Users: '8', Scope: 'Cases and documents' },
                        ]}
                    />
                );
                return (
                    <AdminShell
                        nav="Settings" sub={SETTINGS_SUB()} title="Advanced" breadcrumb="Settings · Advanced"
                        who={role === 'manager' ? 'Elena Ramirez' : 'Robert Grant'}
                        role={role === 'manager' ? 'Manager' : 'Administrator'}
                        actions={role === 'manager'
                            ? <Btn kind="primary" disabled>+ Add Role</Btn>
                            : <Btn kind="primary">+ Add Role</Btn>}
                    >
                        <Panel label="ROLES" sub="Roles decide what each person can open and change.">
                            {role === 'manager'
                                ? <Change n="1.2" block label="Locked table"><LockedControl reason="Only an Admin can change this.">{table}</LockedControl></Change>
                                : table}
                        </Panel>
                        <Panel label="MODULES">
                            {role === 'manager' ? (
                                <Change n="1.2" block label="Locked switches, one reason for the card">
                                    <LockedControl reason="Only an Admin can change this.">
                                        <div>
                                            <Row name="E-signatures" hint="Send documents for signing from a case." control={<Toggle on />} />
                                            <Row name="Invoices" hint="Raise and collect invoices in the portal." control={<Toggle on />} />
                                            <Row name="Video calls" hint="Start a call from a case." control={<Toggle />} />
                                        </div>
                                    </LockedControl>
                                </Change>
                            ) : (
                                <div>
                                    <Row name="E-signatures" hint="Send documents for signing from a case." control={<Toggle on />} />
                                    <Row name="Invoices" hint="Raise and collect invoices in the portal." control={<Toggle on />} />
                                    <Row name="Video calls" hint="Start a call from a case." control={<Toggle />} />
                                </div>
                            )}
                        </Panel>
                    </AdminShell>
                );
            },
        },
        {
            id: 'payments', label: 'Payments → Settings', roles: ['manager'],
            note: 'Today this spins forever: the Stripe call 403s and the screen never resolves.',
            render: () => (
                <AdminShell nav="Payments" title="Payments" breadcrumb="Payments · Settings" who="Elena Ramirez" role="Manager">
                    <Panel label="PAYMENT PROVIDER" sub="Connect a provider to collect invoice payments online.">
                        <Change n="1.5" block label="Locked card replaces the spinner">
                            <LockedControl reason="Only an Admin can connect or change a payment provider.">
                                <div className="sh-row">
                                    <span className="tk-stripe">stripe</span>
                                    <div className="sh-row-main">
                                        <span className="sh-row-name">Stripe</span>
                                        <span className="sh-row-hint">Connected · payouts daily</span>
                                    </div>
                                    <Toggle on />
                                </div>
                            </LockedControl>
                        </Change>
                    </Panel>
                </AdminShell>
            ),
        },
        {
            id: 'member', label: 'Users → member settings', roles: ['admin', 'manager'],
            render: (role) => (
                <AdminShell nav="Users" title="Elena Ramirez" breadcrumb="Users · Elena Ramirez"
                    who={role === 'manager' ? 'Elena Ramirez' : 'Robert Grant'}
                    role={role === 'manager' ? 'Manager' : 'Administrator'}>
                    <Panel label="PROFILE">
                        <Field label="Name"><Input as="static" value="Elena Ramirez" /></Field>
                    </Panel>
                    {role === 'admin' ? (
                        <Panel label="ROLE">
                            <Change n="1.8" block label="Hub role select">
                                <Field label="Hub role" hint="Admins can change every setting in this hub. Managers can see them but not change them.">
                                    <select className="sh-input" defaultValue="manager">
                                        <option value="admin">Admin</option>
                                        <option value="manager">Manager</option>
                                    </select>
                                </Field>
                            </Change>
                        </Panel>
                    ) : (
                        <div className="tk-absent">
                            <Change n="1.8" block ring={false} label="No Role section renders">
                                No Role section renders at all for a Manager. This is the one place hiding beats greying
                                out: the control grants power rather than holding a value, so showing it dimmed reads as
                                an invitation to ask for it.
                            </Change>
                        </div>
                    )}
                </AdminShell>
            ),
        },
        {
            id: 'self', label: 'Users → an Admin viewing themselves', roles: ['admin'],
            render: () => (
                <AdminShell nav="Users" title="Robert Grant" breadcrumb="Users · Robert Grant">
                    <Panel label="ROLE">
                        <Change n="1.8" block label="Own role locked">
                            <LockedControl reason="You cannot change your own role. Ask another Admin.">
                                <Field label="Hub role"><Input as="static" value="Admin" /></Field>
                            </LockedControl>
                        </Change>
                    </Panel>
                </AdminShell>
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   2 · Custom role holders
   ───────────────────────────────────────────────────────────────────── */
const t2 = {
    no: 2,
    title: 'Custom role holders',
    roles: ['admin', 'manager'],
    brief: [
        'A list of everyone holding a custom role, opened by clicking the role\'s Users count. Each row shows case title, Tag ID, status and the person\'s name, and opens that case. Closed cases are included.',
        'When deleting a role is refused because people hold it, the message and a link to that list.',
    ],
    items: [
        { id: '2.1', what: 'Users count becomes a link that opens the holders window.', where: 'Settings → Advanced → Roles', file: 'src/views/settings/AdvancedSettingsView.jsx', roles: ['admin', 'manager'] },
        { id: '2.2', what: 'Holders window: case title, Tag ID, status, person. Rows open the case. Closed cases included.', where: 'New window', file: 'src/views/settings/AdvancedSettingsView.jsx', roles: ['admin', 'manager'], stub: 'Holders are mock. Needs an endpoint returning holders by role id, including closed cases.' },
        { id: '2.3', what: 'Delete refused while people hold the role, with a link into the list.', where: 'Settings → Advanced → Roles', file: 'src/views/settings/AdvancedSettingsView.jsx', roles: ['admin'] },
    ],
    screens: [
        {
            id: 'roles', label: 'Settings → Roles, with the count linked', roles: ['admin', 'manager'],
            render: (role) => (
                <AdminShell nav="Settings" sub={SETTINGS_SUB()} title="Advanced" breadcrumb="Settings · Advanced"
                    who={role === 'manager' ? 'Elena Ramirez' : 'Robert Grant'}
                    role={role === 'manager' ? 'Manager' : 'Administrator'}>
                    <Panel label="ROLES">
                        <Table
                            cols={['Role', 'Users', 'Scope']} align={{ Users: 'right' }}
                            rows={[
                                { Role: 'Administrator', Users: '3', Scope: 'Everything' },
                                { Role: 'Lead Attorney', Users: <Change n="2.1" label="Count opens the list"><button className="tk-link">12</button></Change>, Scope: 'Cases and billing' },
                                { Role: 'Paralegal', Users: <button className="tk-link">8</button>, Scope: 'Cases and documents' },
                            ]}
                        />
                    </Panel>
                </AdminShell>
            ),
        },
        {
            id: 'holders', label: 'Holders window', roles: ['admin', 'manager'],
            render: () => (
                <Modal crumb="Settings · Roles" title="Who holds Lead Attorney" width={640} footer={<Btn>Close</Btn>}>
                    <p className="tk-lede">12 people hold this role. Closed cases are included.</p>
                    <Change n="2.2" block label="Holders table">
                        <Table
                            cols={['Case', 'Tag ID', 'Status', 'Person']}
                            rows={[
                                { Case: 'Rear-End Collision, Downtown LA', 'Tag ID': <Code>a1b2c3d4e56789</Code>, Status: <StatusPill status="active" />, Person: 'Marcus Bell' },
                                { Case: 'Slip and Fall, Westwood', 'Tag ID': <Code>b3c4d5e6f78901</Code>, Status: <StatusPill status="active" />, Person: 'Elena Ramirez' },
                                { Case: 'Bicycle Accident, Echo Park', 'Tag ID': <Code>c5d6e7f8091234</Code>, Status: <StatusPill status="closed" />, Person: 'Marcus Bell' },
                            ]}
                        />
                    </Change>
                    <p className="tk-aside">Rows are clickable and open the case.</p>
                </Modal>
            ),
        },
        {
            id: 'delete', label: 'Delete refused', roles: ['admin'],
            render: () => (
                <Modal title="Can't delete Lead Attorney" width={520} footer={<Btn>Close</Btn>}>
                    <Change n="2.3" block label="Refusal with a way into the list">
                        <StateBlock
                            tone="error"
                            title="12 people still hold this role."
                            message="Move them to another role first, then delete it."
                            actionLabel="See who holds it"
                        />
                    </Change>
                </Modal>
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   3 · Add Inquiry "For" field
   ───────────────────────────────────────────────────────────────────── */
const t3 = {
    no: 3,
    title: 'Add Inquiry "For" field',
    roles: ['staff', 'client'],
    brief: [
        'A "For" field at the top of Add Inquiry: a member search that defaults to "Myself".',
        'The line under For when someone else is picked, saying they\'ll be emailed and replies go to them.',
        'On a closed inquiry, the line that replaces the reply box, saying to reopen it to reply.',
        'Add Inquiry when the hub\'s inquiry form has been removed.',
    ],
    items: [
        { id: '3.1', what: 'For field at the top of Add Inquiry, member search, defaults to Myself.', where: 'Inquiries → Add Inquiry', file: 'src/views/InquiriesView.jsx', roles: ['staff'], stub: 'Member search is mock. Needs the hub member list with the signed-in user pinned as Myself.' },
        { id: '3.2', what: 'Helper line when someone else is picked.', where: 'Inquiries → Add Inquiry', file: 'src/views/InquiriesView.jsx', roles: ['staff'] },
        { id: '3.3', what: 'Closed inquiry: a line replaces the reply box.', where: 'Inquiries → an inquiry', file: 'src/views/InquiriesView.jsx', roles: ['staff', 'client'] },
        { id: '3.4', what: 'Add Inquiry when the hub has no inquiry form.', where: 'Inquiries → Add Inquiry', file: 'src/views/InquiriesView.jsx', roles: ['staff'] },
    ],
    screens: [
        {
            id: 'add', label: 'Add Inquiry · default', roles: ['staff'],
            render: () => (
                <Modal title="Add Inquiry" width={480} footer={<><Btn>Cancel</Btn><Btn kind="primary">Send</Btn></>}>
                    <Change n="3.1" block label="For field">
                        <Field label="For" hint="This inquiry will be raised in your name.">
                            <select className="sh-input" defaultValue="me">
                                <option value="me">Myself</option>
                                <option value="ar">Alexandra Reyes</option>
                            </select>
                        </Field>
                    </Change>
                    <Field label="Subject"><Input placeholder="What is this about?" /></Field>
                    <Field label="Message"><div className="tk-textarea">Type your message…</div></Field>
                </Modal>
            ),
        },
        {
            id: 'add-other', label: 'Add Inquiry · for someone else', roles: ['staff'],
            render: () => (
                <Modal title="Add Inquiry" width={480} footer={<><Btn>Cancel</Btn><Btn kind="primary">Send</Btn></>}>
                    <Field label="For">
                        <select className="sh-input" defaultValue="ar">
                            <option value="me">Myself</option>
                            <option value="ar">Alexandra Reyes</option>
                        </select>
                    </Field>
                    <Change n="3.2" block label="Helper line">
                        <p className="tk-helper">Alexandra Reyes will be emailed about this inquiry, and replies go to her.</p>
                    </Change>
                    <Field label="Subject"><Input placeholder="What is this about?" /></Field>
                </Modal>
            ),
        },
        {
            id: 'closed', label: 'A closed inquiry', roles: ['staff', 'client'],
            render: (role) => (
                <LobbyShell who={role === 'client' ? 'Alexandra Reyes' : 'Marcus Bell'} role={role === 'client' ? 'Client' : 'Staff · Lead Attorney'}
                    title="Inquiries" breadcrumb="Sterling &amp; Brooks · Inquiries">
                    <Panel label="BILLING QUESTION" actions={<StatusPill status="closed" dot />}>
                        <div className="tk-msg"><strong>Alexandra Reyes</strong><p>Can you explain the last invoice?</p></div>
                        <div className="tk-msg"><strong>Marcus Bell</strong><p>Of course. The line item covers the filing fee.</p></div>
                        <Change n="3.3" block label="Replaces the reply box">
                            <StateBlock compact tone="locked" title="This inquiry is closed." message="Reopen it to reply." actionLabel="Reopen" />
                        </Change>
                    </Panel>
                </LobbyShell>
            ),
        },
        {
            id: 'noform', label: 'Add Inquiry · hub has no form', roles: ['staff'],
            render: () => (
                <Modal title="Add Inquiry" width={480} footer={<Btn>Close</Btn>}>
                    <Change n="3.4" block label="No inquiry form">
                        <StateBlock
                            tone="empty"
                            title="This hub has no inquiry form."
                            message="An Admin removed it. Ask them to add one before raising inquiries here."
                        />
                    </Change>
                </Modal>
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   4 · E-sign templates
   ───────────────────────────────────────────────────────────────────── */
const t4 = {
    no: 4,
    title: 'E-sign templates',
    roles: ['admin', 'staff'],
    brief: [
        'On the locked signed copy, a record of each signer: name, signing time and IP address. The ticket suggests a list above the document; placement is yours.',
        'On the templates list, a "needs a document" status for a template with no document, in place of Ready.',
        'In Field Logic, recommend one: keep Save disabled until a participant is picked, or allow saving and unassign the field with a message.',
    ],
    decision: 'Item 4.3: allow the save and unassign the field. Field Logic is edited in the middle of a longer piece of work, and a disabled Save with nothing saying why is the kind of dead end people screenshot and send to support. Saving keeps their other changes, and an unassigned field is a visible, fixable state. The hard stop belongs at send, not at save, since that is the only point where an unassigned field actually breaks something.',
    items: [
        { id: '4.1', what: 'Signer record above the signed document: name, signing time, IP. Collapsed by default.', where: 'Case → E-signs → a signed copy', file: 'src/views/ESignsView.jsx', roles: ['staff', 'client'], stub: 'Signer IP and exact signing time are not captured. Needs name, ISO timestamp and IP per signer on the signed document record.' },
        { id: '4.2', what: '"Needs a document" status replaces Ready for templates with no document.', where: 'Library → E-sign templates', file: 'src/views/library/ESignTemplatesView.jsx', roles: ['admin', 'staff'] },
        { id: '4.3', what: 'Field Logic saves with no participant, unassigns the field, and says so. Send is blocked instead.', where: 'Library → E-sign templates → Field Logic', file: 'src/views/library/ESignTemplatesView.jsx', roles: ['admin', 'staff'] },
    ],
    screens: [
        {
            id: 'signed', label: 'Case → E-signs → signed copy', roles: ['staff', 'client'],
            render: (role) => (
                <LobbyShell caseTitle="Rear-End Collision, Downtown LA" nav="E-signs" title="E-signs"
                    breadcrumb="Rear-End Collision, Downtown LA · E-signs"
                    who={role === 'client' ? 'Alexandra Reyes' : 'Marcus Bell'}
                    role={role === 'client' ? 'Client' : 'Staff · Lead Attorney'}>
                    <Panel label="RETAINER AGREEMENT" actions={<StatusPill label="Signed" tone="success" dot />}>
                        <Change n="4.1" block label="Signer record, above the document">
                            <div className="tk-signers">
                                <div className="tk-signers-head">
                                    <span className="tk-signers-title">Signed by 2 people</span>
                                    <button className="tk-link">Hide details</button>
                                </div>
                                <Table
                                    cols={['Signer', 'Signed at', 'IP address']}
                                    rows={[
                                        { Signer: 'Alexandra Reyes', 'Signed at': '2 Apr 2026, 14:08 PDT', 'IP address': <Code>203.0.113.41</Code> },
                                        { Signer: 'Marcus Bell', 'Signed at': '2 Apr 2026, 16:22 PDT', 'IP address': <Code>198.51.100.7</Code> },
                                    ]}
                                />
                            </div>
                        </Change>
                        <div className="tk-doc">
                            <span>Retainer agreement.pdf</span>
                            <span className="tk-doc-lock">Locked</span>
                        </div>
                    </Panel>
                </LobbyShell>
            ),
        },
        {
            id: 'templates', label: 'Library → E-sign templates', roles: ['admin', 'staff'],
            render: (role) => (
                <AdminShell nav="Library" title="E-sign Templates" breadcrumb="Library · E-sign Templates"
                    who={role === 'staff' ? 'Marcus Bell' : 'Robert Grant'}
                    role={role === 'staff' ? 'Staff · Lead Attorney' : 'Administrator'}
                    actions={<Btn kind="primary">+ New Template</Btn>}>
                    <Panel label="TEMPLATES">
                        <Table
                            cols={['Template', 'Participants', 'Status']}
                            rows={[
                                { Template: 'Retainer agreement', Participants: 'Client, Attorney', Status: <StatusPill status="ready" dot /> },
                                { Template: 'Medical release', Participants: 'Client', Status: <Change n="4.2" label="Needs a document"><StatusPill status="needsDocument" dot /></Change> },
                                { Template: 'Settlement authority', Participants: 'Client, Attorney', Status: <StatusPill status="draft" dot /> },
                            ]}
                        />
                    </Panel>
                </AdminShell>
            ),
        },
        {
            id: 'fieldlogic', label: 'Field Logic · no participant', roles: ['admin', 'staff'],
            render: () => (
                <Modal title="Field Logic" width={470} footer={<><Btn>Cancel</Btn><Btn kind="primary">Save</Btn></>}>
                    <Field label="Field"><Input as="static" value="Date of injury" /></Field>
                    <Field label="Participant">
                        <select className="sh-input" defaultValue="">
                            <option value="">No participant selected</option>
                            <option value="client">Client</option>
                        </select>
                    </Field>
                    <Change n="4.3" block label="Saves, unassigns, explains">
                        <StateBlock
                            compact tone="empty"
                            title="This field will be saved without a participant."
                            message="It stays on the template but nobody is asked to fill it. You cannot send the template until it has one."
                        />
                    </Change>
                </Modal>
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   5 · Case list Tag ID and View Cases
   ───────────────────────────────────────────────────────────────────── */
const t5 = {
    no: 5,
    title: 'Case list Tag ID and View Cases',
    roles: ['admin', 'staff'],
    brief: [
        'The case list, on computer and phone: the Tag ID beside or instead of Case ID. The internal id must stay reachable, since integrations need it.',
        'The View Cases window: headed by the person\'s name, each case by title and Tag ID with its status, role and designation, and a "couldn\'t load" state.',
    ],
    decision: 'Tag ID replaces Case ID in the column, and the internal id moves behind the copy button on the same cell. Showing both as text doubles the width of the widest column to serve the rarer need: people read Tag IDs, integrations paste internal ids, and a paste does not need to be legible first.',
    items: [
        { id: '5.1', what: 'Tag ID column replaces Case ID. Internal id stays reachable via copy.', where: 'Cases list', file: 'src/views/CasesView.jsx', roles: ['admin', 'staff'] },
        { id: '5.2', what: 'Same on phone: Tag ID on the card, internal id behind copy.', where: 'Cases list, ≤768px', file: 'src/views/CasesView.jsx', roles: ['admin', 'staff'] },
        { id: '5.3', what: 'View Cases window headed by the person, each case with title, Tag ID, status, role and designation.', where: 'Users → View Cases', file: 'src/views/UsersView.jsx:557', roles: ['admin', 'staff'] },
        { id: '5.4', what: 'Couldn\'t load state for the window, distinct from "No cases assigned".', where: 'Users → View Cases', file: 'src/views/UsersView.jsx:593', roles: ['admin', 'staff'] },
    ],
    screens: [
        {
            id: 'cases', label: 'Cases list · computer', roles: ['admin', 'staff'],
            render: (role) => (
                <AdminShell nav="Cases" title="Cases" breadcrumb="Cases"
                    who={role === 'staff' ? 'Marcus Bell' : 'Robert Grant'}
                    role={role === 'staff' ? 'Staff · Lead Attorney' : 'Administrator'}
                    actions={<Btn kind="primary">+ New</Btn>}>
                    <Panel>
                        <Table
                            cols={['Title', 'Tag ID', 'Created on', 'Status', 'Stage']}
                            rows={[
                                {
                                    Title: 'Rear-End Collision, Downtown LA',
                                    'Tag ID': <Change n="5.1" label="Tag ID replaces Case ID"><span className="tk-tag"><Code>a1b2c3d4e56789</Code><button className="tk-copy" title="Copy internal id cc-a1b2c3d4e56789">copy id</button></span></Change>,
                                    'Created on': '04/01/2026', Status: <StatusPill status="active" />, Stage: 'Demand sent',
                                },
                                {
                                    Title: 'Slip and Fall, Westwood',
                                    'Tag ID': <span className="tk-tag"><Code>b3c4d5e6f78901</Code><button className="tk-copy">copy id</button></span>,
                                    'Created on': '03/22/2026', Status: <StatusPill status="active" />, Stage: 'Negotiation',
                                },
                            ]}
                        />
                    </Panel>
                </AdminShell>
            ),
        },
        {
            id: 'cases-phone', label: 'Cases list · phone', roles: ['admin', 'staff'], phone: true,
            render: () => (
                <Phone>
                    <AdminShell nav="Cases" title="Cases" breadcrumb="Cases" who="Marcus Bell" role="Staff">
                        <Change n="5.2" block label="Tag ID on the card">
                            <div className="tk-mcard">
                                <span className="tk-mcard-title">Rear-End Collision, Downtown LA</span>
                                <span className="tk-mcard-row"><Code>a1b2c3d4e56789</Code><button className="tk-copy">copy id</button></span>
                                <span className="tk-mcard-row"><StatusPill status="active" /><span className="tk-muted">Demand sent</span></span>
                            </div>
                        </Change>
                        <div className="tk-mcard">
                            <span className="tk-mcard-title">Slip and Fall, Westwood</span>
                            <span className="tk-mcard-row"><Code>b3c4d5e6f78901</Code><button className="tk-copy">copy id</button></span>
                            <span className="tk-mcard-row"><StatusPill status="active" /><span className="tk-muted">Negotiation</span></span>
                        </div>
                    </AdminShell>
                </Phone>
            ),
        },
        {
            id: 'viewcases', label: 'Users → View Cases', roles: ['admin', 'staff'],
            render: () => (
                <Modal crumb="Users · View Cases" title="Marcus Bell" width={660} footer={<Btn>Close</Btn>}>
                    <Change n="5.3" block label="Headed by the person, role and designation per case">
                        <Table
                            cols={['Case', 'Tag ID', 'Status', 'Role']}
                            rows={[
                                { Case: 'Rear-End Collision, Downtown LA', 'Tag ID': <Code>a1b2c3d4e56789</Code>, Status: <StatusPill status="active" />, Role: <DesignationLabel role="Staff" designation="Lead Attorney" /> },
                                { Case: 'Bicycle Accident, Echo Park', 'Tag ID': <Code>c5d6e7f8091234</Code>, Status: <StatusPill status="closed" />, Role: <DesignationLabel role="Staff" designation="Paralegal" /> },
                            ]}
                        />
                    </Change>
                </Modal>
            ),
        },
        {
            id: 'viewcases-error', label: 'View Cases · couldn\'t load', roles: ['admin', 'staff'],
            render: () => (
                <Modal crumb="Users · View Cases" title="Marcus Bell" width={660} footer={<Btn>Close</Btn>}>
                    <Change n="5.4" block label="Distinct from No cases assigned">
                        <StateBlock tone="error" title="Marcus Bell's cases couldn't be loaded" message="Something went wrong at our end." actionLabel="Try again" />
                    </Change>
                    <p className="tk-aside">For contrast, the empty state stays as it was:</p>
                    <StateBlock tone="empty" title="No cases assigned" message="Cases this person is added to will appear here." />
                </Modal>
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   6 · Account site header and removed hubs
   ───────────────────────────────────────────────────────────────────── */
const t6 = {
    no: 6,
    title: 'Account site header and removed hubs',
    roles: ['admin', 'manager'],
    brief: [
        'The account site\'s header on phones. The Hubs and Profile links are hidden at every width today and need to show everywhere. HF-71 adds a menu item to this header too, so design them together.',
        'A removed hub\'s Permissions tab: a notice that access was removed, the firm keeps the details as they were, and it gets no changes until access is approved again.',
        'The "access removed" status on the Rejected tab.',
    ],
    decision: 'Three items fit at 360px without a menu, so they stay visible rather than collapsing into a burger. A burger costs a tap on every visit to save nothing, and collapsing is what produced the current bug. The HF-71 slot is marked so that ticket lands in a decided place instead of reopening this one.',
    items: [
        { id: '6.1', what: 'Hubs and Profile visible at all widths, plus a marked slot for HF-71.', where: 'Account site header', file: 'src/PortalDashboard.css:2992 hides .portal-hub-wrap', roles: ['admin', 'manager'], bug: true },
        { id: '6.2', what: 'Removed hub Permissions tab: notice, values kept, no changes until re-approved.', where: 'Hubs → a removed hub → Permissions', file: 'src/views/HubsPage.jsx', roles: ['admin', 'manager'] },
        { id: '6.3', what: '"Access removed" status on the Rejected tab.', where: 'Hubs → Rejected', file: 'src/views/HubsPage.jsx:511', roles: ['admin', 'manager'] },
    ],
    screens: [
        {
            id: 'header', label: 'Account site header · computer', roles: ['admin', 'manager'],
            render: () => (
                <AccountShell headerPin={<Change n="6.1" ring={false} label="Links visible at all widths"><span /></Change>}>
                    <Panel label="HUBS"><Table cols={['Company name', 'Type', 'Status']} rows={[{ 'Company name': 'Sterling & Brooks Injury Law', Type: 'Law firm', Status: <StatusPill status="active" dot /> }]} /></Panel>
                </AccountShell>
            ),
        },
        {
            id: 'header-phone', label: 'Account site header · phone', roles: ['admin', 'manager'], phone: true,
            note: 'Hidden at every width today, which makes the account site unusable on a phone.',
            render: () => (
                <Phone>
                    <Change n="6.1" block label="All three stay, nothing collapses">
                        <AccountShell narrow>
                            <Panel label="HUBS"><div className="tk-mcard"><span className="tk-mcard-title">Sterling &amp; Brooks Injury Law</span><span className="tk-mcard-row"><StatusPill status="active" dot /></span></div></Panel>
                        </AccountShell>
                    </Change>
                </Phone>
            ),
        },
        {
            id: 'rejected', label: 'Hubs → Rejected tab', roles: ['admin', 'manager'],
            render: () => (
                <AccountShell>
                    <Panel>
                        <div className="tk-tabs"><span className="tk-tab">Active</span><span className="tk-tab is-active">Rejected</span><span className="tk-tab">Disabled</span></div>
                        <Table
                            cols={['Company name', 'Type', 'Status']}
                            rows={[
                                { 'Company name': 'Sterling & Brooks Injury Law', Type: 'Law firm', Status: <Change n="6.3" label="Access removed"><StatusPill status="accessRemoved" dot /></Change> },
                                { 'Company name': 'Halvorsen Legal Group', Type: 'Law firm', Status: <StatusPill label="Rejected" tone="neutral" dot /> },
                            ]}
                        />
                    </Panel>
                </AccountShell>
            ),
        },
        {
            id: 'permissions', label: 'A removed hub → Permissions', roles: ['admin', 'manager'],
            render: () => (
                <AccountShell>
                    <Panel label="PERMISSIONS">
                        <Change n="6.2" block label="Notice, then the values as they were">
                            <StateBlock
                                tone="error"
                                title="Your access to this hub was removed."
                                message="The firm keeps your details as they were. Nothing here changes until they approve your access again."
                            />
                        </Change>
                        <div className="tk-gap">
                            <LockedControl reason="Approval is the firm's to give. Nothing here can be changed meanwhile.">
                                <div>
                                    <Row name="Create cases" control={<Toggle on />} />
                                    <Row name="Add people to a case" control={<Toggle on />} />
                                    <Row name="Remove people from a case" control={<Toggle />} />
                                </div>
                            </LockedControl>
                        </div>
                    </Panel>
                </AccountShell>
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   7 · Video calls
   ───────────────────────────────────────────────────────────────────── */
const t7 = {
    no: 7,
    title: 'Video calls',
    roles: ['staff', 'client'],
    brief: [
        'A "call in progress" bar that stays on screen after someone leaves the call page, with a way back to the call. Needed on phones, Safari and Firefox, which can\'t float the video.',
        'A notice when the camera or microphone is blocked.',
        'A "call has ended" state, for when the call closes for everyone.',
        'A notice in the Notify window naming who was left out.',
    ],
    items: [
        { id: '7.1', what: 'Call in progress bar, persistent across navigation, with a way back.', where: 'App shell, above the page', file: 'src/views/ConvoView.jsx + shell', roles: ['staff', 'client'], stub: 'Needs call state lifted above the view so it survives navigation.' },
        { id: '7.2', what: 'Camera or microphone blocked notice.', where: 'Convo → device step', file: 'src/views/ConvoView.jsx', roles: ['staff', 'client'] },
        { id: '7.3', what: 'Call has ended state.', where: 'Convo → in call', file: 'src/views/ConvoView.jsx', roles: ['staff', 'client'] },
        { id: '7.4', what: 'Notify window names who was left out.', where: 'Convo → Notify', file: 'src/views/ConvoView.jsx', roles: ['staff'] },
    ],
    screens: [
        {
            id: 'bar', label: 'Call in progress bar · computer', roles: ['staff', 'client'],
            render: (role) => (
                <div className="tk-withbar">
                    <Change n="7.1" block label="Stays while you move around">
                        <div className="tk-callbar">
                            <span className="tk-callbar-dot" />
                            <span className="tk-callbar-text"><strong>Call in progress</strong> · Rear-End Collision, Downtown LA · 12:04</span>
                            <span className="tk-callbar-actions"><Btn>Back to call</Btn><Btn kind="danger">Leave</Btn></span>
                        </div>
                    </Change>
                    <LobbyShell caseTitle="Rear-End Collision, Downtown LA" nav="Feed" title="Feed"
                        breadcrumb="Rear-End Collision, Downtown LA · Feed"
                        who={role === 'client' ? 'Alexandra Reyes' : 'Marcus Bell'}
                        role={role === 'client' ? 'Client' : 'Staff · Lead Attorney'}>
                        <Panel><p className="tk-muted">The person has left the call page and is reading the feed. The bar keeps the call reachable.</p></Panel>
                    </LobbyShell>
                </div>
            ),
        },
        {
            id: 'bar-phone', label: 'Call in progress bar · phone', roles: ['staff', 'client'], phone: true,
            note: 'Required here: phones, Safari and Firefox cannot float the video.',
            render: () => (
                <Phone>
                    <Change n="7.1" block label="Same bar, full width">
                        <div className="tk-callbar is-narrow">
                            <span className="tk-callbar-dot" />
                            <span className="tk-callbar-text"><strong>Call in progress</strong> · 12:04</span>
                            <Btn>Back</Btn>
                        </div>
                    </Change>
                    <LobbyShell nav="Feed" title="Feed" who="Alexandra Reyes" role="Client">
                        <Panel><p className="tk-muted">Feed continues underneath.</p></Panel>
                    </LobbyShell>
                </Phone>
            ),
        },
        {
            id: 'blocked', label: 'Camera or microphone blocked', roles: ['staff', 'client'],
            render: () => (
                <Modal title="Start a Convo call" width={520} footer={<><Btn>Back</Btn><Btn kind="primary" disabled>Join</Btn></>}>
                    <div className="tk-preview-dead">Camera preview unavailable</div>
                    <Change n="7.2" block label="Blocked device notice">
                        <StateBlock
                            tone="error"
                            title="Your browser is blocking the camera and microphone."
                            message="Allow access for this site in your browser settings, then try again. You can also join with both off."
                            actionLabel="Try again"
                        />
                    </Change>
                    <p className="tk-aside">Joining with both off stays available, so a blocked device never blocks the call.</p>
                </Modal>
            ),
        },
        {
            id: 'ended', label: 'Call has ended', roles: ['staff', 'client'],
            render: () => (
                <Modal title="Convo" width={520} footer={<Btn kind="primary">Back to the case</Btn>}>
                    <Change n="7.3" block label="Ended for everyone">
                        <StateBlock tone="empty" title="The call has ended." message="It ran for 24 minutes. The recording and summary will appear in the case feed shortly." />
                    </Change>
                </Modal>
            ),
        },
        {
            id: 'notify', label: 'Notify window · someone left out', roles: ['staff'],
            render: () => (
                <Modal title="Notify" width={500} footer={<><Btn>Cancel</Btn><Btn kind="primary">Notify 3 people</Btn></>}>
                    <Field label="Who to notify"><Input as="static" value="Everyone on this case" /></Field>
                    <Change n="7.4" block label="Names who was left out">
                        <StateBlock
                            compact tone="empty"
                            title="2 people will not be notified."
                            message="Jordan Miles and Nina Patel have notifications muted for this case. Tell them another way if they need to join."
                        />
                    </Change>
                </Modal>
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   8 · Import failures and intake mapping
   ───────────────────────────────────────────────────────────────────── */
const t8 = {
    no: 8,
    title: 'Import failures and intake mapping',
    roles: ['admin'],
    brief: [
        'A summary for a partly failed import, such as "280 succeeded, 20 failed", in place of the success ticks.',
        'A failed-rows list under Import Log: each row\'s line number in the file and its reasons. It must stay usable at thousands of rows.',
        'A "Download failed rows" option beside the existing full download.',
        'In the intake Mapping window, how to make clear that removing forms only saves with Save, or a prompt before Cancel throws it away.',
    ],
    decision: 'Item 8.4: a prompt before Cancel discards, rather than a line of explanatory text. Text explaining that removals are not saved yet is read once and then never again, while the mistake it guards against happens at the end of the task when attention is lowest. The prompt fires only when something would actually be lost, so it costs nothing on an untouched window.',
    items: [
        { id: '8.1', what: 'Partly failed summary replaces the success ticks.', where: 'Integration → Imports → an import', file: 'src/views/integration/ImportsView.jsx', roles: ['admin'] },
        { id: '8.2', what: 'Failed rows list with line number and reasons, paginated with a filter.', where: 'Integration → Imports → Import Log', file: 'src/views/integration/ImportsView.jsx:393', roles: ['admin'], stub: 'Failed rows are mock. Needs line number and reason list per failed row.' },
        { id: '8.3', what: '"Download failed rows" beside the full download.', where: 'Integration → Imports', file: 'src/views/integration/ImportsView.jsx', roles: ['admin'] },
        { id: '8.4', what: 'Prompt before Cancel discards unsaved form removals.', where: 'Intake → Mapping window', file: 'Not in this codebase', roles: ['admin'], missing: true },
    ],
    screens: [
        {
            id: 'partial', label: 'Imports → a partly failed import', roles: ['admin'],
            render: () => (
                <AdminShell nav="Integration" title="Imports" breadcrumb="Integration · Imports">
                    <Panel label="CASES-Q3" actions={<span className="tk-row-actions"><Btn>Download all rows</Btn><Change n="8.3" label="New option"><Btn>Download failed rows</Btn></Change></span>}>
                        <Change n="8.1" block label="Summary replaces the ticks">
                            <div className="tk-summary">
                                <span className="tk-sum-ok"><strong>280</strong> succeeded</span>
                                <span className="tk-sum-bad"><strong>20</strong> failed</span>
                                <span className="tk-sum-bar"><span style={{ width: '93%' }} /></span>
                            </div>
                        </Change>
                        <div className="tk-gap">
                            <div className="tk-loghead">
                                <span className="sh-panel-label">IMPORT LOG · FAILED ROWS</span>
                                <input className="sh-input tk-logsearch" placeholder="Filter by reason or line number" readOnly />
                            </div>
                            <Change n="8.2" block label="Line number and reasons, paginated">
                                <Table
                                    cols={['Line', 'Reason']}
                                    rows={[
                                        { Line: <Code>14</Code>, Reason: 'Email is not valid. Case type "Autoo" is not a case type in this hub.' },
                                        { Line: <Code>27</Code>, Reason: 'Tag ID already belongs to another case.' },
                                        { Line: <Code>31</Code>, Reason: 'Date opened is not a date.' },
                                    ]}
                                />
                            </Change>
                            <div className="tk-pager"><span>1 to 3 of 20</span><span className="tk-row-actions"><Btn>Previous</Btn><Btn>Next</Btn></span></div>
                        </div>
                    </Panel>
                </AdminShell>
            ),
        },
        {
            id: 'mapping', label: 'Intake Mapping · discard prompt', roles: ['admin'],
            render: () => (
                <Modal title="Discard your changes?" width={460} footer={<><Btn>Keep editing</Btn><Btn kind="danger">Discard</Btn></>}>
                    <Change n="8.4" block label="Fires only when something would be lost">
                        <StateBlock
                            tone="error"
                            title="You removed 2 forms and have not saved."
                            message="Closing now puts them back. Save first if you meant to remove them."
                        />
                    </Change>
                </Modal>
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   9 · Invoice refunds
   ───────────────────────────────────────────────────────────────────── */
const t9 = {
    no: 9,
    title: 'Invoice refunds',
    roles: ['admin', 'manager', 'staff', 'client'],
    brief: [
        'Refund states: Refund pending, Refunded, and Refund failed with Stripe\'s reason. They must look the same in the invoice list, the preview, both PDFs and the Lobby\'s invoice page.',
        'Where the refund\'s date and amount go in the preview, both PDFs and the Lobby\'s invoice page.',
        'A "couldn\'t load" state for the invoice list, distinct from "No invoices yet".',
        'A notice in the refund window for invoices paid by hand: it only records a refund made outside the portal, and no money moves.',
        'Stripe\'s reason on the Stripe row when Stripe refuses, with the switch kept.',
    ],
    alsoKnown: 'Items 1 to 4 of the original ticket ship without waiting on design. This covers the design-dependent part only.',
    decision: 'The refund line sits directly under the total, not in a separate block. A refund changes what the client actually owes or is owed, so it belongs in the same column of figures they are already reading. Putting it elsewhere means the total and the truth disagree on the same page.',
    items: [
        { id: '9.1', what: 'Three refund states, identical in list, preview, both PDFs and the Lobby.', where: 'Invoices everywhere', file: 'src/views/InvoicesView.jsx, src/views/PaymentsView.jsx, src/views/LobbyView.jsx', roles: ['admin', 'manager', 'staff', 'client'], stub: 'No refund state exists. Needs refund status, date, amount and Stripe reason on the invoice.' },
        { id: '9.2', what: 'Refund date and amount under the total.', where: 'Preview, both PDFs, Lobby invoice', file: 'src/views/InvoicesView.jsx, src/views/LobbyView.jsx', roles: ['admin', 'staff', 'client'], stub: 'No PDF renderer here. Designed as a print layout.' },
        { id: '9.3', what: 'Couldn\'t load state for the invoice list, distinct from No invoices yet.', where: 'Invoices list', file: 'src/views/InvoicesView.jsx', roles: ['admin', 'manager', 'staff'] },
        { id: '9.4', what: 'Refund window notice for invoices paid by hand: records only, no money moves.', where: 'Invoices → Refund', file: 'src/views/InvoicesView.jsx', roles: ['admin', 'staff'] },
        { id: '9.5', what: 'Stripe\'s refusal reason on the Stripe row, switch kept.', where: 'Payments → Settings', file: 'src/views/PaymentsView.jsx', roles: ['admin'] },
    ],
    screens: [
        {
            id: 'list', label: 'Invoices list · the three states', roles: ['admin', 'manager', 'staff'],
            render: (role) => (
                <AdminShell nav="Payments" title="Invoices" breadcrumb="Payments · Invoices"
                    who={role === 'manager' ? 'Elena Ramirez' : role === 'staff' ? 'Marcus Bell' : 'Robert Grant'}
                    role={role === 'manager' ? 'Manager' : role === 'staff' ? 'Staff · Lead Attorney' : 'Administrator'}>
                    <Panel label="INVOICES">
                        <Table
                            cols={['Invoice', 'Client', 'Amount', 'Status']} align={{ Amount: 'right' }}
                            rows={[
                                { Invoice: 'INV-1042', Client: 'Alexandra Reyes', Amount: '$1,200', Status: <StatusPill status="paid" dot /> },
                                { Invoice: 'INV-1038', Client: 'Jordan Miles', Amount: '$450', Status: <Change n="9.1" label="Refund pending"><StatusPill status="refundPending" dot /></Change> },
                                { Invoice: 'INV-1031', Client: 'Nina Patel', Amount: '$980', Status: <StatusPill status="refunded" dot /> },
                                { Invoice: 'INV-1024', Client: 'Casey Whitfield', Amount: '$300', Status: <StatusPill status="refundFailed" dot title="Stripe: the charge has already been refunded" /> },
                            ]}
                        />
                    </Panel>
                </AdminShell>
            ),
        },
        {
            id: 'preview', label: 'Invoice preview · refund under the total', roles: ['admin', 'staff'],
            render: () => (
                <AdminShell nav="Payments" title="INV-1031" breadcrumb="Payments · Invoices · INV-1031">
                    <Panel label="INVOICE">
                        <Table cols={['Item', 'Amount']} align={{ Amount: 'right' }} rows={[
                            { Item: 'Filing fee', Amount: '$400' },
                            { Item: 'Records retrieval', Amount: '$580' },
                        ]} />
                        <div className="tk-totals">
                            <div className="tk-total-row"><span>Total</span><strong>$980</strong></div>
                            <Change n="9.2" block label="Refund line, under the total">
                                <div className="tk-total-row is-refund">
                                    <span>Refunded 8 Oct 2026</span><strong>−$980</strong>
                                </div>
                            </Change>
                            <div className="tk-total-row is-final"><span>Balance</span><strong>$0</strong></div>
                        </div>
                    </Panel>
                </AdminShell>
            ),
        },
        {
            id: 'lobby', label: 'Lobby invoice page · what the client sees', roles: ['client'],
            render: () => (
                <LobbyShell caseTitle="Rear-End Collision, Downtown LA" nav="Invoices" title="Invoices"
                    breadcrumb="Rear-End Collision, Downtown LA · Invoices" who="Alexandra Reyes" role="Client">
                    <Panel label="INV-1031" actions={<Change n="9.1" label="Same pill, same words"><StatusPill status="refunded" dot /></Change>}>
                        <div className="tk-totals">
                            <div className="tk-total-row"><span>Total</span><strong>$980</strong></div>
                            <div className="tk-total-row is-refund"><span>Refunded 8 Oct 2026</span><strong>−$980</strong></div>
                            <div className="tk-total-row is-final"><span>Balance</span><strong>$0</strong></div>
                        </div>
                    </Panel>
                </LobbyShell>
            ),
        },
        {
            id: 'manual', label: 'Refund window · invoice paid by hand', roles: ['admin', 'staff'],
            render: () => (
                <Modal title="Record a refund" width={500} footer={<><Btn>Cancel</Btn><Btn kind="primary">Record refund</Btn></>}>
                    <Change n="9.4" block label="No money moves">
                        <StateBlock
                            tone="empty"
                            title="This invoice was paid by hand, so nothing is sent to Stripe."
                            message="Recording a refund here notes a refund you have already made outside the portal. No money moves."
                        />
                    </Change>
                    <Field label="Refund amount"><Input value="$980" /></Field>
                    <Field label="Refund date"><Input value="8 Oct 2026" /></Field>
                </Modal>
            ),
        },
        {
            id: 'error', label: 'Invoice list · couldn\'t load', roles: ['admin', 'manager', 'staff'],
            render: () => (
                <AdminShell nav="Payments" title="Invoices" breadcrumb="Payments · Invoices">
                    <Panel label="INVOICES">
                        <Change n="9.3" block label="Distinct from No invoices yet">
                            <StateBlock tone="error" title="Invoices couldn't be loaded" message="Something went wrong at our end. Nothing has changed." actionLabel="Try again" />
                        </Change>
                    </Panel>
                    <Panel label="FOR CONTRAST · EMPTY">
                        <StateBlock tone="empty" title="No invoices yet" message="Invoices raised for this case will appear here." />
                    </Panel>
                </AdminShell>
            ),
        },
        {
            id: 'stripe', label: 'Payments → Stripe refuses', roles: ['admin'],
            render: () => (
                <AdminShell nav="Payments" title="Payments" breadcrumb="Payments · Settings">
                    <Panel label="PAYMENT PROVIDER">
                        <div className="sh-row">
                            <span className="tk-stripe">stripe</span>
                            <div className="sh-row-main">
                                <span className="sh-row-name">Let clients pay invoices online</span>
                                <span className="sh-row-hint">Card and bank transfer through Stripe.</span>
                            </div>
                            <Change n="9.5" label="Switch kept"><Toggle /></Change>
                        </div>
                        <div className="tk-gap">
                            <StateBlock
                                compact tone="error"
                                title="Stripe could not enable online payment."
                                message="Your Stripe account cannot accept charges yet: business details are incomplete."
                                actionLabel="Try again"
                            />
                        </div>
                    </Panel>
                </AdminShell>
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   10 · Task and feed templates
   ───────────────────────────────────────────────────────────────────── */
const t10 = {
    no: 10,
    title: 'Task and feed templates',
    roles: ['admin', 'staff'],
    brief: [
        'In the task template window, how a child task gets its own assignee roles, filled in from the main task\'s by default. Child rows have no assignee control today.',
        'In the feed template window, a picker for role and designation mentions, and how a mention looks in the preview: a name placeholder, not the code.',
    ],
    items: [
        { id: '10.1', what: 'Child tasks get their own assignee roles, prefilled from the parent and marked while unchanged.', where: 'Library → Task templates', file: 'src/views/library/TaskTemplatesView.jsx', roles: ['admin', 'staff'] },
        { id: '10.2', what: 'Role and designation mention picker in the feed template editor.', where: 'Library → Feed templates', file: 'src/views/library/FeedTemplatesView.jsx', roles: ['admin', 'staff'] },
        { id: '10.3', what: 'A mention renders as a readable name placeholder in the preview, not the raw code.', where: 'Library → Feed templates → preview', file: 'src/views/library/FeedTemplatesView.jsx', roles: ['admin', 'staff'] },
    ],
    screens: [
        {
            id: 'task', label: 'Task template · child assignees', roles: ['admin', 'staff'],
            render: () => (
                <Modal title="Task template" crumb="Library · Task templates" width={640} footer={<><Btn>Cancel</Btn><Btn kind="primary">Save</Btn></>}>
                    <Field label="Task"><Input value="Prepare the demand package" /></Field>
                    <Field label="Assignee roles"><Input as="static" value="Staff · Lead Attorney, Staff · Paralegal" /></Field>
                    <Change n="10.1" block label="Child rows gain their own assignee">
                        <Table
                            cols={['Child task', 'Assignee roles']}
                            rows={[
                                { 'Child task': 'Collect medical records', 'Assignee roles': <span className="tk-inherit"><Input as="static" value="Staff · Paralegal" /><span className="tk-inherit-tag">from parent</span></span> },
                                { 'Child task': 'Draft the letter', 'Assignee roles': <Input as="static" value="Staff · Lead Attorney" /> },
                            ]}
                        />
                    </Change>
                    <p className="tk-aside">
                        A child shows "from parent" until someone changes it, so the inherited value is visibly inherited
                        rather than looking like a choice already made.
                    </p>
                </Modal>
            ),
        },
        {
            id: 'feed', label: 'Feed template · mentions', roles: ['admin', 'staff'],
            render: () => (
                <Modal title="Feed template" crumb="Library · Feed templates" width={640} footer={<><Btn>Cancel</Btn><Btn kind="primary">Save</Btn></>}>
                    <Field label="Message">
                        <div className="tk-editor">
                            Hi <span className="tk-mention">Client · Primary</span>, your demand letter was sent today.
                            Your attorney <span className="tk-mention">Staff · Lead Attorney</span> will update you when the
                            insurer replies.
                        </div>
                    </Field>
                    <Change n="10.2" block label="Role and designation picker">
                        <div className="tk-picker">
                            <span className="tk-picker-label">Insert a mention</span>
                            <div className="tk-picker-row">
                                <select className="sh-input" defaultValue="staff"><option value="staff">Staff</option><option value="client">Client</option></select>
                                <select className="sh-input" defaultValue="lead"><option value="lead">Lead Attorney</option><option value="para">Paralegal</option><option value="any">Any designation</option></select>
                                <Btn kind="primary">Insert</Btn>
                            </div>
                        </div>
                    </Change>
                    <Change n="10.3" block label="Preview uses a readable placeholder">
                        <div className="tk-preview">
                            <span className="sh-panel-label">PREVIEW</span>
                            <p>
                                Hi <strong>[client's name]</strong>, your demand letter was sent today. Your attorney{' '}
                                <strong>[lead attorney's name]</strong> will update you when the insurer replies.
                            </p>
                        </div>
                    </Change>
                </Modal>
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   11 · Designations
   ───────────────────────────────────────────────────────────────────── */
const t11 = {
    no: 11,
    title: 'Designations',
    roles: ['admin', 'staff', 'client'],
    brief: [
        'On Your Team, the designation after the role, such as "Staff · Lead Attorney". For people allowed to change it, it\'s a button; everyone else sees plain text. Computer and phone.',
        'The Change Designation window it opens: the role\'s designations, Save and Cancel.',
        'A Designation column in Edit Case\'s member table, between Role and Action, and the same select in Assign Users.',
    ],
    alsoKnown: 'From the API thread: the field is staff_designation or client_designation depending on the role. Any custom role or staff sees the staff options; clients see the client options. Default for each is Primary.',
    items: [
        { id: '11.1', what: 'Role · Designation on Your Team. Button when the viewer may change it, plain text otherwise.', where: 'Lobby → case → Your Team', file: 'src/views/LobbyView.jsx', roles: ['admin', 'staff', 'client'] },
        { id: '11.2', what: 'Same on phone.', where: 'Lobby → case → Your Team, ≤768px', file: 'src/views/LobbyView.jsx', roles: ['staff', 'client'] },
        { id: '11.3', what: 'Change Designation window: the role\'s designations, Save, Cancel.', where: 'New window', file: 'src/views/LobbyView.jsx', roles: ['admin', 'staff'] },
        { id: '11.4', what: 'Designation column in Edit Case members, between Role and Action.', where: 'Cases → Edit Case', file: 'src/views/CasesView.jsx', roles: ['admin', 'staff'] },
        { id: '11.5', what: 'Same designation select in Assign Users.', where: 'Users → Assign Users', file: 'src/views/UsersView.jsx', roles: ['admin', 'staff'] },
    ],
    capability: 'Whether 11.1 is a button is a permission, not a tier. Treat it as its own flag rather than inferring it from Admin.',
    screens: [
        {
            id: 'team', label: 'Your Team', roles: ['admin', 'staff', 'client'],
            render: (role) => {
                const mayChange = role === 'admin' || role === 'staff';
                return (
                    <LobbyShell caseTitle="Rear-End Collision, Downtown LA" nav="Feed" title="Feed"
                        breadcrumb="Rear-End Collision, Downtown LA · Feed"
                        who={role === 'client' ? 'Alexandra Reyes' : role === 'staff' ? 'Marcus Bell' : 'Robert Grant'}
                        role={role === 'client' ? 'Client' : role === 'staff' ? 'Staff · Lead Attorney' : 'Administrator'}
                        aside={
                            <>
                                <span className="sh-panel-label">YOUR TEAM</span>
                                <Change n="11.1" block label={mayChange ? 'Button' : 'Plain text'}>
                                    <div className="tk-team">
                                        {[['MB', 'Marcus Bell', 'Lead Attorney'], ['ER', 'Elena Ramirez', 'Case Manager'], ['SL', 'Sarah Lee', 'Paralegal']].map(([ini, name, desig]) => (
                                            <div className="tk-team-row" key={name}>
                                                <span className="sh-avatar">{ini}</span>
                                                <div className="tk-team-main">
                                                    <span className="tk-team-name">{name}</span>
                                                    <DesignationLabel role="Staff" designation={desig} editable={mayChange} onEdit={() => {}} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Change>
                            </>
                        }>
                        <Panel><p className="tk-muted">The feed continues here. Your Team sits in the right rail on every case page.</p></Panel>
                    </LobbyShell>
                );
            },
        },
        {
            id: 'team-phone', label: 'Your Team · phone', roles: ['staff', 'client'], phone: true,
            render: (role) => (
                <Phone>
                    <LobbyShell nav="Feed" title="Your Team" who={role === 'client' ? 'Alexandra Reyes' : 'Marcus Bell'} role={role === 'client' ? 'Client' : 'Staff'}>
                        <Change n="11.2" block label="Wraps under the name">
                            <Panel>
                                {[['MB', 'Marcus Bell', 'Lead Attorney'], ['SL', 'Sarah Lee', 'Paralegal']].map(([ini, name, desig]) => (
                                    <div className="tk-team-row" key={name}>
                                        <span className="sh-avatar">{ini}</span>
                                        <div className="tk-team-main">
                                            <span className="tk-team-name">{name}</span>
                                            <DesignationLabel role="Staff" designation={desig} editable={role === 'staff'} onEdit={() => {}} />
                                        </div>
                                    </div>
                                ))}
                            </Panel>
                        </Change>
                    </LobbyShell>
                </Phone>
            ),
        },
        {
            id: 'change', label: 'Change Designation window', roles: ['admin', 'staff'],
            render: () => (
                <Modal title="Change designation" width={440} footer={<><Btn>Cancel</Btn><Btn kind="primary">Save</Btn></>}>
                    <p className="tk-lede">Marcus Bell · Staff on this case</p>
                    <Change n="11.3" block label="The role's designations only">
                        <Field label="Designation" hint="Staff designations. A client on this case would see the client list instead.">
                            <select className="sh-input" defaultValue="lead">
                                <option value="primary">Primary</option>
                                <option value="lead">Lead Attorney</option>
                                <option value="case">Case Manager</option>
                                <option value="para">Paralegal</option>
                            </select>
                        </Field>
                    </Change>
                </Modal>
            ),
        },
        {
            id: 'editcase', label: 'Edit Case → members', roles: ['admin', 'staff'],
            render: () => (
                <Modal title="Edit Case" crumb="Cases · Rear-End Collision, Downtown LA" width={680} footer={<><Btn>Cancel</Btn><Btn kind="primary">Save</Btn></>}>
                    <Field label="Title"><Input value="Rear-End Collision, Downtown LA" /></Field>
                    <Change n="11.4" block label="Designation between Role and Action">
                        <Table
                            cols={['Member', 'Role', 'Designation', 'Action']}
                            rows={[
                                { Member: 'Marcus Bell', Role: 'Staff', Designation: <select className="sh-input" defaultValue="lead"><option value="primary">Primary</option><option value="lead">Lead Attorney</option></select>, Action: <Btn kind="danger">Remove</Btn> },
                                { Member: 'Alexandra Reyes', Role: 'Client', Designation: <select className="sh-input" defaultValue="primary"><option value="primary">Primary</option><option value="spouse">Spouse</option></select>, Action: <Btn kind="danger">Remove</Btn> },
                            ]}
                        />
                    </Change>
                    <p className="tk-aside">The options follow the role on the row: staff designations for staff and any custom role, client designations for clients.</p>
                </Modal>
            ),
        },
        {
            id: 'assign', label: 'Assign Users', roles: ['admin', 'staff'],
            render: () => (
                <Modal title="Assign users to cases" width={560} footer={<><Btn>Cancel</Btn><Btn kind="primary">Assign</Btn></>}>
                    <Field label="People"><Input as="static" value="Marcus Bell, Sarah Lee" /></Field>
                    <div className="tk-two">
                        <Field label="Role">
                            <select className="sh-input" defaultValue="staff"><option value="staff">Staff</option><option value="client">Client</option></select>
                        </Field>
                        <Change n="11.5" block label="Same select as Edit Case">
                            <Field label="Designation">
                                <select className="sh-input" defaultValue="primary"><option value="primary">Primary</option><option value="lead">Lead Attorney</option></select>
                            </Field>
                        </Change>
                    </div>
                </Modal>
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   12 · Lobby and portal join
   ───────────────────────────────────────────────────────────────────── */
const t12 = {
    no: 12,
    title: 'Lobby and portal join',
    roles: ['client'],
    brief: [
        'A "couldn\'t load" state for a Lobby section, such as "Your cases couldn\'t be loaded." with Try again, in place of the empty message. Counts show nothing rather than 0. One design, reused by all six sections.',
        'The window shown before joining a portal: "You\'re signed in as [their email], which isn\'t a member of this portal yet." with "Join as a client" and "Use another account". Base it on the existing disabled-account window.',
    ],
    alsoKnown: 'The ticket says six Lobby sections. This codebase has four: Cases, Announcements, Inquiries and Locations. The remaining two need naming before the design is complete.',
    items: [
        { id: '12.1', what: 'One couldn\'t-load state, reused by every Lobby section.', where: 'Lobby sections', file: 'src/views/LobbyView.jsx', roles: ['client'] },
        { id: '12.2', what: 'Counts render nothing rather than 0 when loading failed.', where: 'Lobby section headers', file: 'src/views/LobbyView.jsx', roles: ['client'] },
        { id: '12.3', what: 'Portal join window, based on the disabled-account window.', where: 'Before joining a portal', file: 'Not in this codebase', roles: ['client'], missing: true },
    ],
    screens: [
        {
            id: 'lobby', label: 'Lobby · a section that failed', roles: ['client'],
            render: () => (
                <LobbyShell title="Sterling &amp; Brooks Injury Law" breadcrumb="Client Lobby" who="Alexandra Reyes" role="Client">
                    <Panel label={<span>CASES <Change n="12.2" label="No count while failed"><span className="tk-nocount">—</span></Change></span>}>
                        <Change n="12.1" block label="One state, all sections">
                            <StateBlock tone="error" title="Your cases couldn't be loaded." message="Something went wrong at our end." actionLabel="Try again" />
                        </Change>
                    </Panel>
                    <Panel label={<span>ANNOUNCEMENTS <span className="tk-count">4</span></span>}>
                        <p className="tk-muted">A section that loaded keeps its count and its content.</p>
                    </Panel>
                    <Panel label={<span>INQUIRIES <span className="tk-nocount">—</span></span>}>
                        <StateBlock compact tone="error" title="Your inquiries couldn't be loaded." actionLabel="Try again" />
                    </Panel>
                </LobbyShell>
            ),
        },
        {
            id: 'join', label: 'Portal join window', roles: ['client'],
            render: () => (
                <Modal title="Join this portal" width={480} footer={<><Btn>Use another account</Btn><Btn kind="primary">Join as a client</Btn></>}>
                    <Change n="12.3" block label="Based on the disabled-account window">
                        <StateBlock
                            tone="empty"
                            title="You're signed in as alexandra@example.com, which isn't a member of this portal yet."
                            message="Join as a client to see your cases here, or sign in with the account the firm invited."
                        />
                    </Change>
                </Modal>
            ),
        },
    ],
};

export const TICKETS = [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12];

