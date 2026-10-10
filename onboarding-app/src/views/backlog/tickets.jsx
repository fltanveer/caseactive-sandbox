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
    AdminShell, LobbyShell, AccountShell, AdminFrame, CaseFrame, LobbyFrame, Panel, Table, Modal,
    Btn, Field, ModalField, Input, Select, Toggle, Row, Code, Phone, Change, PinLayer,
} from './Shell';
import { AutoOpen, Proposed, Today } from './Drive';

/* The app's own views, rendered as the screens they are. */
import AdvancedSettingsView from '../settings/AdvancedSettingsView';
import UsersView from '../UsersView';
import InquiriesView from '../InquiriesView';
import ESignsView from '../ESignsView';
import ESignTemplatesView from '../library/ESignTemplatesView';
import CasesView from '../CasesView';
import HubsPage from '../HubsPage';
import ConvoView from '../ConvoView';
import FeedView from '../FeedView';

const SETTINGS_SUB = (active) => [
    'Profile', 'General', 'Hubs', 'User Intake', 'Custom Fields', 'Stages', 'Automations', 'Advanced Settings',
].map(label => ({ label, active: label === active }));

/* ── The real screens ────────────────────────────────────────────────────
   These mount the app's own view components. The earlier version of this file
   drew look-alikes of them from screenshots, which is how a design ends up
   specified against a 9px panel radius the app does not have. Mounting the
   real thing also keeps the spec honest about what is already built: the
   tier field, for one, already exists as User Type under HOST USER
   ATTRIBUTES in the Edit User modal's Settings tab. */

/* Settings → Advanced Settings, opened on the Roles tab. */
const RealRoles = ({ who, role, lockReason, pins = [], modal, height }) => {
    const roles = <AdvancedSettingsView initialTab="Roles" />;
    return (
        <AdminFrame
            nav="Settings" sub="Advanced Settings" who={who} role={role} height={height}
            modal={modal} overlay={<PinLayer pins={pins} />}
        >
            <div className="tk-mount">
                {lockReason
                    ? <LockedControl reason={lockReason}>{roles}</LockedControl>
                    : roles}
            </div>
        </AdminFrame>
    );
};

/* The Users list. TYPE is host_user_type and ROLE is the hub role, so both
   axes already have a column here. */
const RealUsers = ({ who, role, pins = [], lockReason, modal, height, clicks = [] }) => {
    const users = <AutoOpen clicks={clicks}><UsersView /></AutoOpen>;
    return (
        <AdminFrame
            nav="Users" sub={null} title="Users" breadcrumb="Users" newBtn
            who={who} role={role} height={height}
            modal={modal} overlay={<PinLayer pins={pins} />}
        >
            <div className="tk-mount">
                {lockReason
                    ? <LockedControl reason={lockReason}>{users}</LockedControl>
                    : users}
            </div>
        </AdminFrame>
    );
};

/* The Edit User modal, opened from the pencil on the client row and driven to
   the tab the ticket is about. `tab` is one of the modal's left nav labels. */
const RealEditUser = ({ who, role, tab = 'Settings', pins = [], after }) => (
    <>
        <AdminFrame
            nav="Users" sub={null} title="Users" breadcrumb="Users" newBtn
            who={who} role={role} height={780}
            overlay={<PinLayer pins={pins} />}
        >
            <div className="tk-mount">
                <AutoOpen clicks={[
                    '.users-icon-btn.eu-edit-client-btn',
                    `.eu-left-nav .eu-nav-tab:nth-child(${['Profile', 'Custom Fields', 'Intake Forms', 'Settings'].indexOf(tab) + 1})`,
                ]}>
                    <UsersView />
                </AutoOpen>
            </div>
        </AdminFrame>
        {after}
    </>
);

/* Home → Inquiries. `open` is Add Inquiry; `ticket` opens a row's ticket
   window, optionally from the Closed tab. */
const RealInquiries = ({
    who = 'Marcus Bell', role = 'Staff · Lead Attorney',
    add = false, tab = 'Open', ticket = false,
    pins = [], height, after,
}) => {
    const clicks = [];
    if (tab !== 'Open') clicks.push(`.inq-tabs .inq-tab:nth-child(${['Open', 'Closed', 'Settings'].indexOf(tab) + 1})`);
    if (ticket) clicks.push('.inq-table-row .inq-actions .users-icon-btn');
    return (
        <>
            <AdminFrame
                nav="Home" sub="Inquiries" title="Inquiries" breadcrumb="Home · Inquiries"
                newBtn who={who} role={role} height={height}
                overlay={<PinLayer pins={pins} />}
            >
                <div className="tk-mount">
                    <AutoOpen clicks={clicks}>
                        <InquiriesView addOpen={add} onCloseAdd={() => {}} />
                    </AutoOpen>
                </div>
            </AdminFrame>
            {after}
        </>
    );
};

/* ─────────────────────────────────────────────────────────────────────
   1 · Admin vs Manager permissions
   ───────────────────────────────────────────────────────────────────── */
const t1 = {
    no: 1,
    key: 'HF-15',
    ticketName: 'The Admin Panel can\'t tell Admins from Managers',
    domain: 'ca-account, ca-manage',
    status: 'Back Log',
    severity: 'Medium',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0C5WFDKBEU',
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
        { id: '1.8', what: 'User Type gains a Manager value. Hidden from Managers; locked when an Admin views themselves.', where: 'Users → Edit User → Settings → Host User Attributes', file: 'src/views/UsersView.jsx', roles: ['admin'] },
    ],
    screens: [
        {
            id: 'roles', label: 'Settings → Advanced Settings → Roles', roles: ['admin', 'manager'],
            note: 'The real Advanced Settings view. Roles is one of its four tabs.',
            render: (role) => (role === 'manager'
                ? (
                    <RealRoles
                        who="Elena Ramirez" role="Manager"
                        lockReason="Only an Admin can change roles."
                        pins={[
                            { n: '1.2', at: '.as-tab-panel', label: 'The whole panel dims, with one reason line', place: 'tl' },
                            { n: '1.1', at: '.lkc-reason', label: 'The reason line, from LockedControl', place: 'bl' },
                        ]}
                    />
                )
                : (
                    <RealRoles
                        who="Robert Grant" role="Administrator"
                        pins={[{ n: '1.2', at: '.as-primary-btn', label: 'An Admin keeps New Role' }]}
                    />
                )
            ),
        },
        {
            id: 'payments', label: 'Payments → Settings', roles: ['manager'],
            note: 'Today this spins forever: the Stripe call 403s and the screen never resolves.',
            render: () => (
                <AdminFrame
                    nav="Payments" sub={null} title="Payments" breadcrumb="Payments · Settings"
                    who="Elena Ramirez" role="Manager"
                >
                    <div className="portal-content sh-body">
                        <Panel label="Payment provider" sub="Connect a provider to collect invoice payments online.">
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
                    </div>
                </AdminFrame>
            ),
        },
        {
            id: 'users', label: 'Users list', roles: ['admin', 'manager'],
            note: 'The real Users list. TYPE is host_user_type and ROLE is the hub role, so both axes already have a column. TYPE is the one that cannot say manager.',
            render: (role) => (role === 'manager'
                ? (
                    <RealUsers
                        who="Elena Ramirez" role="Manager"
                        lockReason="Only an Admin can add or change users."
                        pins={[{ n: '1.8', at: '.users-table-head span:nth-child(4)', label: 'TYPE must be able to say manager', place: 'tr' }]}
                    />
                )
                : (
                    <RealUsers
                        who="Robert Grant" role="Administrator"
                        pins={[
                            { n: '1.8', at: '.users-table-head span:nth-child(4)', label: 'TYPE must be able to say manager', place: 'tr' },
                            { n: '1.8', at: '.hubs-table > .users-table-row:nth-child(3) span:nth-child(4)', label: 'Today: admin, user or bot. Never manager.', place: 'br' },
                        ]}
                    />
                )
            ),
        },
        {
            id: 'edituser', label: 'Edit User modal → Settings', roles: ['admin'],
            note: 'Opened from the pencil on a client row. The tier control already exists here as User Type under HOST USER ATTRIBUTES. The change is its option list, not a new field.',
            render: () => (
                <RealEditUser
                    who="Robert Grant" role="Administrator" tab="Settings"
                    pins={[{ n: '1.8', at: '.eu-section:nth-child(2) .ccm-field:nth-child(1)', label: 'User Type: the tier lives here already', place: 'tl' }]}
                    after={(
                        <div className="tk-after">
                            <Today note="The select offers Staff, which the TYPE column never shows, and cannot offer bot, which it does.">
                                <ModalField label="User Type">
                                    <Select value="User" options={['User', 'Admin', 'Staff']} />
                                </ModalField>
                            </Today>
                            <Proposed note="Manager joins the list. Staff comes out, because it is a hub role and already has its own Role field two cells away.">
                                <ModalField
                                    label="User Type"
                                    hint="Admins can change every hub setting. Managers see them but cannot change them."
                                >
                                    <Select value="User" options={['User', 'Manager', 'Admin']} />
                                </ModalField>
                            </Proposed>
                        </div>
                    )}
                />
            ),
        },
        {
            id: 'edituser-self', label: 'Edit User modal → Settings · viewing yourself', roles: ['admin'],
            note: 'Same modal, same field. Only the Type control changes, so only the Type control is drawn.',
            render: () => (
                <RealEditUser
                    who="Robert Grant" role="Administrator" tab="Settings"
                    pins={[{ n: '1.8', at: '.eu-section:nth-child(2) .ccm-field:nth-child(1)', label: 'Your own tier is locked', place: 'tl' }]}
                    after={(
                        <div className="tk-after">
                            <Proposed label="Proposed · yourself" note="An Admin cannot demote themselves, so the value shows and the control does not open.">
                                <LockedControl reason="You cannot change your own type. Ask another Admin.">
                                    <ModalField label="User Type"><Select value="Admin" options={['Admin']} disabled /></ModalField>
                                </LockedControl>
                            </Proposed>
                        </div>
                    )}
                />
            ),
        },
        {
            id: 'edituser-manager', label: 'Edit User modal → Settings · as a Manager', roles: ['manager'],
            note: 'The documented exception to 1.1. Everything else on this tab greys out; User Type goes away.',
            render: () => (
                <RealEditUser
                    who="Elena Ramirez" role="Manager" tab="Settings"
                    pins={[{ n: '1.8', at: '.eu-section:nth-child(2)', label: 'HOST USER ATTRIBUTES, minus User Type', place: 'tl' }]}
                    after={(
                        <div className="tk-after">
                            <Proposed label="Proposed · as a Manager" note="The field does not render at all.">
                                <div className="tk-absent">
                                    User Type is absent for a Manager. This is the one exception to 1.1: the control
                                    grants the tier rather than holding a value, so a dimmed one reads as an invitation
                                    to ask for it. Role stays visible and locked, because that is a value.
                                </div>
                                <LockedControl reason="Only an Admin can change this.">
                                    <ModalField label="Role"><Select value="clients" options={['clients']} disabled /></ModalField>
                                </LockedControl>
                            </Proposed>
                        </div>
                    )}
                />
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   2 · Custom role holders
   ───────────────────────────────────────────────────────────────────── */
const t2 = {
    no: 2,
    key: 'HF-52',
    ticketName: 'Roles and custom fields: blank case details, broken field keys, and an instant Duplicate',
    domain: 'ca-manage',
    status: 'Back Log',
    severity: 'Medium',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0C830E69M4',
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
            id: 'roles', label: 'Advanced Settings → Roles, count linked', roles: ['admin', 'manager'],
            note: 'The real Roles table. The Users column is plain text today; on a custom role it becomes the way in.',
            render: (role) => (
                <RealRoles
                    who={role === 'manager' ? 'Elena Ramirez' : 'Robert Grant'}
                    role={role === 'manager' ? 'Manager' : 'Administrator'}
                    pins={[
                        { n: '2.1', at: '.as-table tbody tr:nth-child(5) .as-table-num', label: 'Paralegal, a custom role: the count opens the list', place: 'tr' },
                        { n: '2.1', at: '.as-table tbody tr:nth-child(1) .as-table-num', label: 'A system role keeps a plain count', place: 'br' },
                    ]}
                />
            ),
        },
        {
            id: 'holders', label: 'Holders window', roles: ['admin', 'manager'],
            note: 'Opened from the count, over the Roles screen it came from.',
            render: (role) => (
                <RealRoles
                    who={role === 'manager' ? 'Elena Ramirez' : 'Robert Grant'}
                    role={role === 'manager' ? 'Manager' : 'Administrator'}
                    height={820}
                    modal={(
                        <Modal crumb="Settings · Roles" title="Who holds Paralegal" width={720} footer={<Btn kind="link">Close</Btn>}>
                            <p className="tk-lede">5 people hold this role. Closed cases are included.</p>
                            <Change n="2.2" block label="Holders table">
                                <Table
                                    cols={['Case', 'Tag ID', 'Status', 'Person']}
                                    rows={[
                                        { Case: 'Rear-End Collision — Downtown LA', 'Tag ID': <Code>a1b2c3d4e56789</Code>, Status: <StatusPill status="active" />, Person: 'Marcus Bell' },
                                        { Case: 'Slip and Fall — Westfield Mall', 'Tag ID': <Code>b3c4d5e6f78901</Code>, Status: <StatusPill status="active" />, Person: 'Elena Ramirez' },
                                        { Case: 'Medical Malpractice — Dr. Kim Clinic', 'Tag ID': <Code>d7e8f9a0123456</Code>, Status: <StatusPill status="closed" />, Person: 'Marcus Bell' },
                                    ]}
                                />
                            </Change>
                            <p className="tk-aside">Rows are clickable and open the case.</p>
                        </Modal>
                    )}
                />
            ),
        },
        {
            id: 'delete', label: 'Delete refused', roles: ['admin'],
            note: 'The refusal lands where the delete was attempted, with a way into the list it is talking about.',
            render: () => (
                <RealRoles
                    who="Robert Grant" role="Administrator" height={820}
                    modal={(
                        <Modal title="Can't delete Paralegal" width={520} footer={<Btn kind="link">Close</Btn>}>
                            <Change n="2.3" block label="Refusal with a way into the list">
                                <StateBlock
                                    tone="error"
                                    title="5 people still hold this role."
                                    message="Move them to another role first, then delete it."
                                    actionLabel="See who holds it"
                                />
                            </Change>
                        </Modal>
                    )}
                />
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   3 · Add Inquiry "For" field
   ───────────────────────────────────────────────────────────────────── */
const t3 = {
    no: 3,
    key: 'HF-54',
    ticketName: 'Inquiries: search fails, a refused inquiry looks sent, and staff can\'t log one for a client',
    domain: 'ca-manage, ca-app',
    status: 'Back Log',
    severity: 'Medium',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0C830LMK5L',
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
            note: 'The real Add Inquiry window. It asks for a number, a category and a message; For goes above all three.',
            render: () => (
                <RealInquiries
                    add height={820}
                    pins={[{ n: '3.1', at: '.inq-modal-body .ccm-field:nth-child(1)', label: 'For goes above this field', place: 'tl' }]}
                    after={(
                        <div className="tk-after">
                            <Proposed note="First field in the window, defaulting to Myself. Staff see it; a client raising their own inquiry does not.">
                                <ModalField label="For" hint="This inquiry will be raised in your name.">
                                    <Select value="Myself" options={['Myself', 'Alexandra Reyes', 'Gold Roger']} />
                                </ModalField>
                            </Proposed>
                        </div>
                    )}
                />
            ),
        },
        {
            id: 'add-other', label: 'Add Inquiry · for someone else', roles: ['staff'],
            note: 'Same window. Picking a member adds one line under the field and changes nothing else.',
            render: () => (
                <RealInquiries
                    add height={820}
                    pins={[{ n: '3.2', at: '.inq-modal-body .ccm-field:nth-child(1)', label: 'The helper line lands here', place: 'tl' }]}
                    after={(
                        <div className="tk-after">
                            <Proposed note="The line only appears when For is someone other than you.">
                                <ModalField label="For">
                                    <Select value="Alexandra Reyes" options={['Myself', 'Alexandra Reyes', 'Gold Roger']} />
                                </ModalField>
                                <Change n="3.2" block label="Helper line">
                                    <p className="tk-helper">Alexandra Reyes will be emailed about this inquiry, and replies go to her.</p>
                                </Change>
                            </Proposed>
                        </div>
                    )}
                />
            ),
        },
        {
            id: 'closed', label: 'A closed inquiry', roles: ['staff', 'client'],
            note: 'The real ticket window, opened from the Closed tab. Today the comment box and POST are still there on a closed ticket.',
            render: (role) => (
                <RealInquiries
                    who={role === 'client' ? 'Alexandra Reyes' : 'Marcus Bell'}
                    role={role === 'client' ? 'Client' : 'Staff · Lead Attorney'}
                    tab="Closed" ticket height={820}
                    pins={[{ n: '3.3', at: '.inq-comment-box', label: 'This box and the POST row are what gets replaced', place: 'tl' }]}
                    after={(
                        <div className="tk-after">
                            <Today note="A closed ticket still offers a comment box, so a reply can be typed and posted into a thread nobody is watching.">
                                <div className="tk-textarea">Write a comment....</div>
                            </Today>
                            <Proposed note="The box and the POST button both go. Reopen is the only way back in.">
                                <StateBlock compact tone="locked" title="This inquiry is closed." message="Reopen it to reply." actionLabel="Reopen" />
                            </Proposed>
                        </div>
                    )}
                />
            ),
        },
        {
            id: 'noform', label: 'Add Inquiry · hub has no form', roles: ['staff'],
            note: 'Category is fed by the hub\'s inquiry categories. With none configured the select is empty and Save can never enable, so the window has nothing to say.',
            render: () => (
                <RealInquiries
                    add height={820}
                    pins={[{ n: '3.4', at: '.inq-modal-body', label: 'The whole body is replaced', place: 'tl' }]}
                    after={(
                        <div className="tk-after">
                            <Proposed note="In place of the fields, so nobody fills in a window that cannot be sent.">
                                <StateBlock
                                    tone="empty"
                                    title="This hub has no inquiry form."
                                    message="An Admin removed it. Ask them to add one before raising inquiries here."
                                />
                            </Proposed>
                        </div>
                    )}
                />
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   4 · E-sign templates
   ───────────────────────────────────────────────────────────────────── */
const t4 = {
    no: 4,
    key: 'HF-42',
    ticketName: 'E-signs: Repeat gets them refused, unassigned fields still publish, and Bots can sign',
    domain: 'ca-manage, ca-app',
    status: 'Back Log',
    severity: 'Medium',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0C7ZJVL0E9',
    title: 'E-sign templates',
    roles: ['admin', 'staff'],
    brief: [
        'On the locked signed copy, a record of each signer: name, signing time and IP address. The ticket suggests a list above the document; placement is yours.',
        'On the templates list, a "needs a document" status for a template with no document, in place of Ready.',
        'In Field Logic, recommend one: keep Save disabled until a participant is picked, or allow saving and unassign the field with a message.',
    ],
    decision: 'Item 4.3: allow the save and unassign the field. Field Logic is edited in the middle of a longer piece of work, and a disabled Save with nothing saying why is the kind of dead end people screenshot and send to support. Saving keeps their other changes, and an unassigned field is a visible, fixable state. The hard stop belongs at send, not at save, since that is the only point where an unassigned field actually breaks something.',
    items: [
        { id: '4.1', what: 'A completed e-sign opens its signed document read only, with the signer record above it: name, signing time, IP. Collapsed by default.', where: 'Case → E-signs → a completed row', file: 'src/views/ESignsView.jsx', roles: ['staff', 'client'], stub: 'There is no signed copy screen today, so this builds one. Signer IP and exact signing time are not captured either: needs name, ISO timestamp and IP per signer on the signed document record.' },
        { id: '4.2', what: '"Needs a document" status replaces Ready for templates with no document.', where: 'Library → E-sign templates', file: 'src/views/library/ESignTemplatesView.jsx', roles: ['admin', 'staff'] },
        { id: '4.3', what: 'Field Logic saves with no participant, unassigns the field, and says so. Send is blocked instead.', where: 'Library → E-sign templates → Field Logic', file: 'src/views/library/ESignTemplatesView.jsx', roles: ['admin', 'staff'] },
    ],
    screens: [
        {
            id: 'signed', label: 'Case → E-signs → a completed e-sign', roles: ['staff', 'client'],
            note: 'Mounting the real view turned up the gap: a completed e-sign offers a disabled sign button and View Settings, and nothing that opens the signed document. There is no signed copy screen to put the record on yet, so 4.1 has to build one.',
            render: (role) => (
                <>
                    <CaseFrame
                        caseTitle="Rear-End Collision — Downtown LA" nav="E-signs" height={760}
                        who={role === 'client' ? 'Alexandra Reyes' : 'Marcus Bell'}
                        role={role === 'client' ? 'Client' : 'Staff · Lead Attorney'}
                        newBtn
                        overlay={<PinLayer pins={[
                            { n: '4.1', at: '.cfm-table-row .ft-action-wrap', label: 'No action here opens the signed document', place: 'tl' },
                        ]} />}
                    >
                        <div className="tk-mount">
                            <AutoOpen clicks={['.ev-tabs-bar .ev-tab:nth-child(2)']}>
                                <ESignsView embedded />
                            </AutoOpen>
                        </div>
                    </CaseFrame>
                    <div className="tk-after">
                        <Today note="A signed e-sign shows 2 of 2 and then offers a greyed signature button and View Settings. The document itself is not reachable, so neither is any record of who signed it.">
                            <p className="tk-helper">Sign (disabled) · View Settings · Duplicate · Delete</p>
                        </Today>
                        <Proposed note="A view action on a completed row opens the document read only, with the record above it, collapsed to one line. It belongs to the document rather than the case, so it travels with the downloaded copy too.">
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
                        </Proposed>
                    </div>
                </>
            ),
        },
        {
            id: 'templates', label: 'Library → E-sign templates', roles: ['admin', 'staff'],
            note: 'The real templates list. Status is a single .ft-status-badge that says Ready whether or not a document was ever attached.',
            render: (role) => (
                <>
                    <AdminFrame
                        nav="Library" sub="E-Sign Templates" title="E-Sign Templates"
                        breadcrumb="Library · E-Sign Templates" newBtn
                        who={role === 'staff' ? 'Marcus Bell' : 'Robert Grant'}
                        role={role === 'staff' ? 'Staff · Lead Attorney' : 'Administrator'}
                        overlay={<PinLayer pins={[
                            { n: '4.2', at: '.hubs-table > .fot-table-row:nth-child(4) .ft-status-badge', label: 'Ready today, with no document behind it', place: 'tr' },
                        ]} />}
                    >
                        <div className="tk-mount"><ESignTemplatesView /></div>
                    </AdminFrame>
                    <div className="tk-after">
                        <Today note="One badge, one word, whatever the template is actually missing.">
                            <span className="ft-status-badge">Ready</span>
                        </Today>
                        <Proposed note="A third value, in the same badge. Not an error: the template is fine, it is just not sendable yet.">
                            <Change n="4.2" label="Needs a document"><StatusPill status="needsDocument" dot /></Change>
                        </Proposed>
                    </div>
                </>
            ),
        },
        {
            id: 'fieldlogic', label: 'Field Logic · no participant', roles: ['admin', 'staff'],
            note: 'Opened from a template, over the list. The recommendation is to let the save through rather than disable it.',
            render: () => (
                <AdminFrame
                    nav="Library" sub="E-Sign Templates" title="E-Sign Templates"
                    breadcrumb="Library · E-Sign Templates" newBtn height={820}
                    modal={(
                        <Modal title="Field Logic" width={520} footer={<><Btn kind="link">Cancel</Btn><Btn kind="primary">Save</Btn></>}>
                            <ModalField label="Field"><Input as="static" value="Date of injury" /></ModalField>
                            <ModalField label="Participant">
                                <Select value="No participant selected" options={['No participant selected', 'Client', 'Attorney']} />
                            </ModalField>
                            <Change n="4.3" block label="Saves, unassigns, explains">
                                <StateBlock
                                    compact tone="empty"
                                    title="This field will be saved without a participant."
                                    message="It stays on the template but nobody is asked to fill it. You cannot send the template until it has one."
                                />
                            </Change>
                        </Modal>
                    )}
                >
                    <div className="tk-mount"><ESignTemplatesView /></div>
                </AdminFrame>
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   5 · Case list Tag ID and View Cases
   ───────────────────────────────────────────────────────────────────── */
const t5 = {
    no: 5,
    key: 'HF-70',
    ticketName: 'Admin Panel cases: the list can\'t find a case by its Tag ID, deleting says too little, and cleared fields come back',
    domain: 'ca-manage',
    status: 'Back Log',
    severity: 'Medium',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0C7YN7MRD1',
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
            note: 'The real list. The second column is CASE ID and holds the internal id as plain text, with no copy control, which is why a Tag ID cannot be searched for.',
            render: (role) => (
                <>
                    <AdminFrame
                        nav="Cases" sub={null} title="Cases" breadcrumb="Cases" newBtn
                        who={role === 'staff' ? 'Marcus Bell' : 'Robert Grant'}
                        role={role === 'staff' ? 'Staff · Lead Attorney' : 'Administrator'}
                        overlay={<PinLayer pins={[
                            { n: '5.1', at: '.cases-table-head span:nth-child(2)', label: 'This column changes', place: 'tr' },
                            { n: '5.1', at: '.hubs-table > .cases-table-row:nth-child(4) .cases-id-text', label: 'Internal id as plain text today', place: 'br' },
                        ]} />}
                    >
                        <div className="tk-mount"><CasesView /></div>
                    </AdminFrame>
                    <div className="tk-after">
                        <Today note="The internal id, unreadable and uncopyable, in the column people scan.">
                            <span className="cases-cell-muted cases-id-text">cc-a1b2c3d4e56789</span>
                        </Today>
                        <Proposed note="Tag ID takes the column and the header. The internal id moves behind the copy button on the same cell, so integrations keep it without it taking the width.">
                            <span className="tk-tag">
                                <Code>a1b2c3d4e56789</Code>
                                <button className="tk-copy" title="Copy internal id cc-a1b2c3d4e56789">copy id</button>
                            </span>
                        </Proposed>
                    </div>
                </>
            ),
        },
        {
            id: 'cases-phone', label: 'Cases list · phone', roles: ['admin', 'staff'], phone: true,
            note: 'The real list at phone width, where the table collapses to cards and each cell carries its own label.',
            render: () => (
                <>
                    <Phone>
                        <AdminFrame
                            nav="Cases" sub={null} title="Cases" breadcrumb="Cases"
                            who="Marcus Bell" role="Staff · Lead Attorney"
                            overlay={<PinLayer pins={[
                                { n: '5.2', at: '.hubs-table > .cases-table-row:nth-child(3) span[data-label="Case ID"]', label: 'The id row on the card', place: 'tl' },
                            ]} />}
                        >
                            <div className="tk-mount"><CasesView /></div>
                        </AdminFrame>
                    </Phone>
                    <div className="tk-after">
                        <Proposed note="Same change, same cell. On a card the copy button has room to be a button rather than an icon.">
                            <div className="tk-mcard">
                                <span className="tk-mcard-title">Rear-End Collision — Downtown LA</span>
                                <span className="tk-mcard-row"><Code>a1b2c3d4e56789</Code><button className="tk-copy">copy id</button></span>
                            </div>
                        </Proposed>
                    </div>
                </>
            ),
        },
        {
            id: 'userslist', label: 'Users list · where View Cases opens from', roles: ['admin', 'staff'],
            note: 'The folder action on a row opens View Cases. Bots have no cases, so theirs is disabled.',
            render: () => (
                <RealUsers
                    pins={[{ n: '5.3', at: '.hubs-table > .users-table-row:nth-child(5) .users-action-btns', label: 'The folder opens View Cases', place: 'tl' }]}
                />
            ),
        },
        {
            id: 'viewcases', label: 'Users → View Cases', roles: ['admin', 'staff'],
            note: 'The real window. It is titled View Cases rather than the person, lists case ids with no titles, and shows a role with no designation.',
            render: () => (
                <>
                    <RealUsers
                        height={780}
                        clicks={['.hubs-table > .users-table-row:nth-child(5) .users-action-btns .users-icon-btn:last-child']}
                        pins={[
                            { n: '5.3', at: '.view-cases-modal .ccm-title', label: 'Titled View Cases, not the person', place: 'tr' },
                            { n: '5.3', at: '.view-cases-table-head', label: 'No case title, no designation', place: 'tl' },
                        ]}
                    />
                    <div className="tk-after">
                        <Proposed note="The person at the top, the case by name, the Tag ID beside it, and the role carrying its designation.">
                            <Change n="5.3" block label="Headed by the person, role and designation per case">
                                <Table
                                    cols={['Case', 'Tag ID', 'Status', 'Role']}
                                    rows={[
                                        { Case: 'Rear-End Collision — Downtown LA', 'Tag ID': <Code>a1b2c3d4e56789</Code>, Status: <StatusPill status="active" />, Role: <DesignationLabel role="Staff" designation="Lead Attorney" /> },
                                        { Case: 'Medical Malpractice — Dr. Kim Clinic', 'Tag ID': <Code>d7e8f9a0123456</Code>, Status: <StatusPill status="closed" />, Role: <DesignationLabel role="Staff" designation="Paralegal" /> },
                                    ]}
                                />
                            </Change>
                        </Proposed>
                    </div>
                </>
            ),
        },
        {
            id: 'viewcases-error', label: 'View Cases · couldn\'t load', roles: ['admin', 'staff'],
            note: 'Today the window has one empty state, "No cases assigned.", which it also shows when the request failed.',
            render: () => (
                <>
                    <RealUsers
                        height={780}
                        clicks={['.hubs-table > .users-table-row:nth-child(5) .users-action-btns .users-icon-btn:last-child']}
                        pins={[{ n: '5.4', at: '.view-cases-table', label: 'Where the state lands', place: 'tl' }]}
                    />
                    <div className="tk-after">
                        <Today note="A failed request and a person with no cases produce the same sentence, so nobody retries.">
                            <div className="view-cases-empty">No cases assigned.</div>
                        </Today>
                        <Proposed note="Distinct from empty, and the retry is the loudest thing in it.">
                            <Change n="5.4" block label="Couldn't load">
                                <StateBlock
                                    tone="error"
                                    title="Couldn't load this person's cases."
                                    message="The list did not come back. Try again."
                                    actionLabel="Try again"
                                />
                            </Change>
                        </Proposed>
                    </div>
                </>
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   6 · Account site header and removed hubs
   ───────────────────────────────────────────────────────────────────── */
const t6 = {
    no: 6,
    key: 'HF-72',
    ticketName: 'Hubs: removing a firm\'s access hides Lobby, and the Settings window loses notification choices',
    domain: 'ca-account',
    status: 'Back Log',
    severity: 'Medium',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0C7ZLK7MPX',
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
        { id: '6.2', what: 'A third tab on hub settings, Permissions: notice, values kept, no changes until re-approved.', where: 'Hubs → a hub → settings', file: 'src/views/HubsPage.jsx:245 has only About Hub and Billing Info', roles: ['admin', 'manager'] },
        { id: '6.3', what: '"Access removed" status on the Rejected tab.', where: 'Hubs → Rejected', file: 'src/views/HubsPage.jsx:511', roles: ['admin', 'manager'] },
    ],
    screens: [
        {
            id: 'header', label: 'Account site header · computer', roles: ['admin', 'manager'],
            note: 'The account site is ca-account and is not in this codebase, so this header is the one drawing here with no original to mount. It borrows the admin topbar\'s values so the two sites do not look like different products.',
            render: () => (
                <AccountShell headerPin={<Change n="6.1" ring={false} label="Links visible at all widths"><span /></Change>}>
                    <Panel label="Hubs">
                        <Table
                            cols={['Company name', 'Type', 'Status']}
                            rows={[{ 'Company name': 'Sterling & Brooks Injury Law', Type: 'Law firm', Status: <StatusPill status="active" dot /> }]}
                        />
                    </Panel>
                </AccountShell>
            ),
        },
        {
            id: 'header-phone', label: 'Account site header · phone', roles: ['admin', 'manager'], phone: true,
            note: 'Hidden at every width today, which makes the account site unusable on a phone. Three items fit at 360px, so nothing collapses.',
            render: () => (
                <Phone>
                    <Change n="6.1" block label="All three stay, nothing collapses">
                        <AccountShell narrow>
                            <Panel label="Hubs">
                                <div className="tk-mcard">
                                    <span className="tk-mcard-title">Sterling &amp; Brooks Injury Law</span>
                                    <span className="tk-mcard-row"><StatusPill status="active" dot /></span>
                                </div>
                            </Panel>
                        </AccountShell>
                    </Change>
                </Phone>
            ),
        },
        {
            id: 'rejected', label: 'Hubs → Rejected tab', roles: ['admin', 'manager'],
            note: 'The real Hubs page. Status is an .sf-chip driven by the subscription, with no value for a hub whose access the firm withdrew. The Rejected tab holds no rows in this build, so the chip is pinned on Active where it renders.',
            render: () => (
                <>
                    <AdminFrame
                        nav="Settings" sub="Hubs" title="Hubs" breadcrumb="Settings · Hubs" newBtn
                        overlay={<PinLayer pins={[
                            { n: '6.3', at: '.hubs-status-row .hubs-status-tab:nth-child(2)', label: 'The tab this lands on', place: 'tr' },
                            { n: '6.3', at: '.hubs-table .hubs-table-row .sf-chip', label: 'The chip that needs a new value', place: 'br' },
                        ]} />}
                    >
                        <div className="tk-mount"><HubsPage embedded /></div>
                    </AdminFrame>
                    <div className="tk-after">
                        <Today note="Rejected and access removed read the same, so a firm that approved you once and changed its mind looks like one that never answered.">
                            <span className="sf-chip sf-chip-neutral">Rejected</span>
                        </Today>
                        <Proposed note="A separate value, so the Permissions notice and the list agree with each other.">
                            <Change n="6.3" label="Access removed"><StatusPill status="accessRemoved" dot /></Change>
                        </Proposed>
                    </div>
                </>
            ),
        },
        {
            id: 'permissions', label: 'A removed hub → Permissions', roles: ['admin', 'manager'],
            note: 'The real hub settings window carries two tabs, About Hub and Billing Info. There is no Permissions tab, so 6.2 adds one.',
            render: () => (
                <>
                    <AdminFrame
                        nav="Settings" sub="Hubs" title="Hubs" breadcrumb="Settings · Hubs" newBtn height={820}
                        overlay={<PinLayer pins={[
                            { n: '6.2', at: '.hub-wizard-tabs', label: 'Two tabs today. Permissions is the third.', place: 'tl' },
                        ]} />}
                    >
                        <div className="tk-mount">
                            <AutoOpen clicks={['.hubs-table-row .hubs-action-btn.more']}>
                                <HubsPage embedded />
                            </AutoOpen>
                        </div>
                    </AdminFrame>
                    <div className="tk-after">
                        <Proposed note="The notice first, then the firm's values exactly as they were, dimmed. Showing them is the point: the firm needs to see what it will get back.">
                            <Change n="6.2" block label="Notice, then the values as they were">
                                <StateBlock
                                    tone="error"
                                    title="Your access to this hub was removed."
                                    message="The firm keeps your details as they were. Nothing here changes until they approve your access again."
                                />
                            </Change>
                            <LockedControl reason="Approval is the firm's to give. Nothing here can be changed meanwhile.">
                                <div>
                                    <Row name="Create cases" control={<Toggle on />} />
                                    <Row name="Add people to a case" control={<Toggle on />} />
                                    <Row name="Remove people from a case" control={<Toggle />} />
                                </div>
                            </LockedControl>
                        </Proposed>
                    </div>
                </>
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   7 · Video calls
   ───────────────────────────────────────────────────────────────────── */
const t7 = {
    no: 7,
    key: 'HF-62',
    ticketName: 'Events and calls: the date line misreads repeats, Add to calendar drifts an hour, calls fail silently',
    domain: 'ca-app',
    status: 'Back Log',
    severity: 'Medium',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0C7ZJJPX0V',
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
        { id: '7.2', what: 'One blocked-device notice, above Join now, with a retry. Replaces the two separate lines.', where: 'Convo → Check devices', file: 'src/views/ConvoView.jsx:352 .cv-warn, and :216 the preview caption', roles: ['staff', 'client'] },
        { id: '7.3', what: 'Call has ended state.', where: 'Convo → in call', file: 'src/views/ConvoView.jsx', roles: ['staff', 'client'] },
        { id: '7.4', what: 'Notify window names who was left out.', where: 'Convo → Notify', file: 'src/views/ConvoView.jsx', roles: ['staff'] },
    ],
    screens: [
        {
            id: 'bar', label: 'Call in progress bar · computer', roles: ['staff', 'client'],
            note: 'The real case shell, on the page someone lands on after leaving the call. There is nothing holding the call today: navigating away is the same as hanging up.',
            render: (role) => (
                <>
                    <div className="tk-withbar">
                        <Change n="7.1" block label="Stays while you move around">
                            <div className="tk-callbar">
                                <span className="tk-callbar-dot" />
                                <span className="tk-callbar-text"><strong>Call in progress</strong> · Rear-End Collision — Downtown LA · 12:04</span>
                                <span className="tk-callbar-actions"><Btn>Back to call</Btn><Btn kind="danger">Leave</Btn></span>
                            </div>
                        </Change>
                        <CaseFrame
                            caseTitle="Rear-End Collision — Downtown LA" nav="Feed" height={560}
                            who={role === 'client' ? 'Alexandra Reyes' : 'Marcus Bell'}
                            role={role === 'client' ? 'Client' : 'Staff · Lead Attorney'}
                        >
                            <div className="tk-mount"><FeedView /></div>
                        </CaseFrame>
                    </div>
                    <p className="tk-aside">
                        The bar sits above the case shell, not inside it, so it survives the view changing underneath.
                        That means call state has to live above the router.
                    </p>
                </>
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
                    <CaseFrame caseTitle="Rear-End Collision — Downtown LA" nav="Feed" who="Alexandra Reyes" role="Client">
                        <div className="tk-mount"><FeedView /></div>
                    </CaseFrame>
                </Phone>
            ),
        },
        {
            id: 'blocked', label: 'Camera or microphone blocked', roles: ['staff', 'client'],
            note: 'The real Check devices step, with the camera genuinely refused. There is already a notice here, under Join now, and it is right: the change is that it sits below the button it is about, carries no action, and leaves the preview saying something different from the warning.',
            render: () => (
                <>
                    <CaseFrame
                        caseTitle="Rear-End Collision — Downtown LA" nav="Convo" height={820}
                        who="Marcus Bell" role="Staff · Lead Attorney"
                        overlay={<PinLayer pins={[
                            { n: '7.2', at: '.cv-preview-off-text', label: 'The preview says one thing', place: 'bl' },
                            { n: '7.2', at: '.cv-warn', label: 'The warning says another, under the button', place: 'bl' },
                        ]} />}
                    >
                        <div className="tk-mount">
                            <AutoOpen clicks={['.cv-card .imp-save-btn']}>
                                <ConvoView embedded />
                            </AutoOpen>
                        </div>
                    </CaseFrame>
                    <div className="tk-after">
                        <Today note="Two sentences about one problem, in two places, neither of which can be acted on. The warning is also below Join now, so it is read after the decision it should inform.">
                            <p className="cv-preview-off-text">Camera blocked by the browser</p>
                            <p className="cv-warn">Your browser blocked the camera or microphone. Allow access in the address bar, or join without them.</p>
                        </Today>
                        <Proposed note="One notice, above Join now, with the retry on it. Joining with both off stays available, so a blocked device never blocks the call.">
                            <Change n="7.2" block label="Blocked device notice">
                                <StateBlock
                                    tone="error"
                                    title="Your browser is blocking the camera and microphone."
                                    message="Allow access for this site in your browser settings, then try again. You can also join with both off."
                                    actionLabel="Try again"
                                />
                            </Change>
                        </Proposed>
                    </div>
                </>
            ),
        },
        {
            id: 'ended', label: 'Call has ended', roles: ['staff', 'client'],
            note: 'There is already a Call ended screen, for when you leave. 7.3 is the other ending: the call closed for everyone, which you did not choose.',
            render: () => (
                <>
                    <CaseFrame
                        caseTitle="Rear-End Collision — Downtown LA" nav="Convo" height={760}
                        who="Marcus Bell" role="Staff · Lead Attorney"
                    >
                        <div className="tk-mount"><ConvoView embedded /></div>
                    </CaseFrame>
                    <div className="tk-after">
                        <Today note="Reached by leaving, and offers Start another convo. It reads as a thing you did.">
                            <p className="tk-helper">Call ended · The convo has been logged against this case.</p>
                        </Today>
                        <Proposed note="Reached without choosing it, so it says what happened and points back at the case rather than at another call.">
                            <Change n="7.3" block label="Ended for everyone">
                                <StateBlock
                                    tone="empty"
                                    title="The call has ended."
                                    message="It ran for 24 minutes. The recording and summary will appear in the case feed shortly."
                                    actionLabel="Back to the case"
                                />
                            </Change>
                        </Proposed>
                    </div>
                </>
            ),
        },
        {
            id: 'notify', label: 'Notify window · someone left out', roles: ['staff'],
            note: 'The real Set up step picks who gets a link. Nothing checks afterwards whether every one of them could actually be reached.',
            render: () => (
                <>
                    <CaseFrame
                        caseTitle="Rear-End Collision — Downtown LA" nav="Convo" height={820}
                        who="Marcus Bell" role="Staff · Lead Attorney"
                        overlay={<PinLayer pins={[
                            { n: '7.4', at: '.cv-people-grid', label: 'Picked here, and then nobody checks', place: 'tl' },
                        ]} />}
                    >
                        <div className="tk-mount"><ConvoView embedded /></div>
                    </CaseFrame>
                    <div className="tk-after">
                        <Proposed note="Names them rather than counting them, because the next thing you do is reach that person another way.">
                            <Change n="7.4" block label="Who was left out">
                                <StateBlock
                                    tone="error"
                                    title="2 people were not notified."
                                    message="Danielle Okafor and James Rivera have no email on file, so they did not get the link. Send it to them another way, or add an email and invite them again."
                                    actionLabel="Copy the link"
                                />
                            </Change>
                        </Proposed>
                    </div>
                </>
            ),
        },
    ],
};

/* ─────────────────────────────────────────────────────────────────────
   8 · Import failures and intake mapping
   ───────────────────────────────────────────────────────────────────── */
const t8 = {
    no: 8,
    key: 'HF-58',
    ticketName: 'Admin Panel: imports hide which rows failed and why, and intake Mapping resets switches',
    domain: 'ca-manage',
    status: 'Back Log',
    severity: 'Medium',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0C7ZLN9S3X',
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
                                <h4 className="as-card-title sh-cardhead">Import log · failed rows</h4>
                                <input className="sh-select tk-logsearch" placeholder="Filter by reason or line number" readOnly />
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
    key: 'HF-37',
    ticketName: 'Payments: Stripe buttons open nothing, search sees one page, refunds always read Refunded',
    domain: 'ca-manage, ca-app',
    status: 'To Do',
    severity: 'High',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0C84JP74E6',
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
                    <Panel label="Invoices">
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
                    <Panel label="Invoice">
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
                    <Panel label="Invoices">
                        <Change n="9.3" block label="Distinct from No invoices yet">
                            <StateBlock tone="error" title="Invoices couldn't be loaded" message="Something went wrong at our end. Nothing has changed." actionLabel="Try again" />
                        </Change>
                    </Panel>
                    <Panel label="For contrast: empty">
                        <StateBlock tone="empty" title="No invoices yet" message="Invoices raised for this case will appear here." />
                    </Panel>
                </AdminShell>
            ),
        },
        {
            id: 'stripe', label: 'Payments → Stripe refuses', roles: ['admin'],
            render: () => (
                <AdminShell nav="Payments" title="Payments" breadcrumb="Payments · Settings">
                    <Panel label="Payment provider">
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
    key: 'HF-29',
    ticketName: 'Template windows: note attachments, child task assignees, the feed hint and mentions',
    domain: 'ca-manage, ca-app',
    status: 'Back Log',
    severity: 'Low',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0C4WVADUMT',
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
                                <select className="sh-select" defaultValue="staff"><option value="staff">Staff</option><option value="client">Client</option></select>
                                <select className="sh-select" defaultValue="lead"><option value="lead">Lead Attorney</option><option value="para">Paralegal</option><option value="any">Any designation</option></select>
                                <Btn kind="primary">Insert</Btn>
                            </div>
                        </div>
                    </Change>
                    <Change n="10.3" block label="Preview uses a readable placeholder">
                        <div className="tk-preview">
                            <h4 className="as-card-title sh-cardhead">Preview</h4>
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
    key: 'HF-64',
    ticketName: 'Case members: designations shown and changed in place, and two small fixes',
    domain: 'ca-manage, ca-app',
    status: 'Back Log',
    severity: 'Medium',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0C7PGPGH7Z',
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
                                <h4 className="as-card-title sh-cardhead">Your team</h4>
                                <Change n="11.1" block label={mayChange ? 'Button' : 'Plain text'}>
                                    <div className="tk-team">
                                        {[['MB', 'Marcus Bell', 'Lead Attorney'], ['ER', 'Elena Ramirez', 'Case Manager'], ['SL', 'Sarah Lee', 'Paralegal']].map(([ini, name, desig]) => (
                                            <div className="tk-team-row" key={name}>
                                                <span className="portal-avatar sh-avatar-sm">{ini}</span>
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
                                        <span className="portal-avatar sh-avatar-sm">{ini}</span>
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
                            <select className="sh-select" defaultValue="lead">
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
                                { Member: 'Marcus Bell', Role: 'Staff', Designation: <select className="sh-select" defaultValue="lead"><option value="primary">Primary</option><option value="lead">Lead Attorney</option></select>, Action: <Btn kind="danger">Remove</Btn> },
                                { Member: 'Alexandra Reyes', Role: 'Client', Designation: <select className="sh-select" defaultValue="primary"><option value="primary">Primary</option><option value="spouse">Spouse</option></select>, Action: <Btn kind="danger">Remove</Btn> },
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
                            <select className="sh-select" defaultValue="staff"><option value="staff">Staff</option><option value="client">Client</option></select>
                        </Field>
                        <Change n="11.5" block label="Same select as Edit Case">
                            <Field label="Designation">
                                <select className="sh-select" defaultValue="primary"><option value="primary">Primary</option><option value="lead">Lead Attorney</option></select>
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
    key: 'HF-47',
    ticketName: 'Lobby: joining without asking, failed sections shown as empty, and no hub switching on phones',
    domain: 'ca-manage, ca-app',
    status: 'Back Log',
    severity: 'Medium',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0C7PH4BS15',
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

