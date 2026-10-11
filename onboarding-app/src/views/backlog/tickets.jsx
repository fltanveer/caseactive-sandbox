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
    AccountShell, AdminFrame, CaseFrame, BareFrame, Panel, Table, Modal,
    Btn, ModalField, Input, Select, Toggle, Row, Code, Phone, Change, PinLayer, Patch, New, Proposal,
} from './Shell';
import { usePatched } from './patchContext';
import { AutoOpen } from './Drive';

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
import ImportsView from '../integration/ImportsView';
import PaymentsView from '../PaymentsView';
import CustomFieldsView from '../settings/CustomFieldsView';
import BillingSettingsView from '../settings/BillingSettingsView';
import KeysView from '../integration/KeysView';
import InvoicesView from '../InvoicesView';
import TaskTemplatesView from '../library/TaskTemplatesView';
import FeedTemplatesView from '../library/FeedTemplatesView';
import LobbyView, { CaseRightPanel } from '../LobbyView';

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

/* Settings → Advanced Settings, opened on the Roles tab.
   lockReason is part of the proposal, so Today shows the screen unlocked,
   which is the bug. */
const RealRoles = ({ who, role, lockReason, pins = [], patch, modal, height }) => {
    const on = usePatched();
    const roles = <AdvancedSettingsView initialTab="Roles" />;
    return (
        <AdminFrame
            nav="Settings" sub="Advanced Settings" who={who} role={role} height={height}
            patch={patch} modal={modal} overlay={<PinLayer pins={pins} />}
        >
            <div className="tk-mount">
                {lockReason && on
                    ? <LockedControl reason={lockReason} reasonFirst>{roles}</LockedControl>
                    : roles}
            </div>
        </AdminFrame>
    );
};

/* The Users list. TYPE is host_user_type and ROLE is the hub role, so both
   axes already have a column here. */
const RealUsers = ({ who, role, pins = [], lockReason, patch, modal, height, clicks = [] }) => {
    const on = usePatched();
    const users = <AutoOpen clicks={clicks}><UsersView /></AutoOpen>;
    return (
        <AdminFrame
            nav="Users" sub={null} title="Users" breadcrumb="Users" newBtn
            who={who} role={role} height={height}
            patch={patch} modal={modal} overlay={<PinLayer pins={pins} />}
        >
            <div className="tk-mount">
                {lockReason && on
                    ? <LockedControl reason={lockReason} reasonFirst>{users}</LockedControl>
                    : users}
            </div>
        </AdminFrame>
    );
};

/* The Edit User modal, opened from the pencil on the client row and driven to
   the tab the ticket is about. `tab` is one of the modal's left nav labels. */
const RealEditUser = ({ who, role, tab = 'Settings', pins = [], patch, after }) => (
    <>
        <AdminFrame
            nav="Users" sub={null} title="Users" breadcrumb="Users" newBtn
            who={who} role={role} height={780}
            patch={patch} overlay={<PinLayer pins={pins} />}
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
    pins = [], patch, height, after,
}) => {
    const clicks = [];
    if (tab !== 'Open') clicks.push(`.inq-tabs .inq-tab:nth-child(${['Open', 'Closed', 'Settings'].indexOf(tab) + 1})`);
    if (ticket) clicks.push('.inq-table-row .inq-actions .users-icon-btn');
    return (
        <>
            <AdminFrame
                nav="Home" sub="Inquiries" title="Inquiries" breadcrumb="Home · Inquiries"
                newBtn who={who} role={role} height={height}
                patch={patch} overlay={<PinLayer pins={pins} />}
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

/* The lock icon LockedControl draws, for the places a reason line stands on
   its own rather than wrapping a control. */
const LockIconLine = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
);

/* Payments → Settings for a Manager. Today the Stripe call 403s and the card
   never resolves, so Today is the spinner and the proposal is the locked
   card that replaces it. */
const ManagerPayments = () => {
    const on = usePatched();
    if (!on) {
        return (
            <div className="tk-spinner" role="status">
                <span className="tk-spinner-dot" />
                <span className="tk-spinner-dot" />
                <span className="tk-spinner-dot" />
                <span className="tk-spinner-text">Loading payment settings</span>
            </div>
        );
    }
    return (
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
    );
};

/* The case team as the real rail lists it. Each second line is a designation
   wearing the label role, which is the whole of HF-64 item 11.1. */
const TEAM_ROWS = [
    ['Marcus Bell', 'Lead Attorney'],
    ['Elena Ramirez', 'Case Manager'],
    ['Sarah Lee', 'Paralegal'],
    ['Casey Whitfield', 'Paralegal'],
    ['Danielle Okafor', 'Intake Specialist'],
    ['Nina Patel', 'Case Coordinator'],
    ['Robert Grant', 'Administrator'],
];

/* Items 1.2 to 1.6 are one pattern applied to five pages, so they share one
   screen: the real page, locked for a Manager and untouched on Today. */
const LockedPage = ({ nav, sub, title, breadcrumb, item, reason, newBtn, children }) => {
    const on = usePatched();
    return (
        <AdminFrame
            nav={nav} sub={sub} title={title} breadcrumb={breadcrumb} newBtn={newBtn}
            who="Elena Ramirez" role="Manager"
            overlay={<PinLayer pins={on ? [
                { n: item, at: '.lkc-reason', label: 'One reason line, above the whole page', place: 'tl' },
            ] : []} />}
        >
            <div className="tk-mount">
                {on
                    ? <LockedControl reason={reason} reasonFirst>{children}</LockedControl>
                    : children}
            </div>
        </AdminFrame>
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
            note: 'The real Advanced Settings view. On Today a Manager gets the same editable screen an Admin gets, which is the bug.',
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
                            <ManagerPayments />
                        </Panel>
                    </div>
                </AdminFrame>
            ),
        },
        {
            id: 'customfields', label: 'Settings → Custom Fields', roles: ['manager'],
            note: 'The same locked pattern on a second page. A Manager sees every field and its current settings, and can change none of them.',
            render: () => (
                <LockedPage
                    nav="Settings" sub="Custom Fields" title="Custom Fields" breadcrumb="Settings · Custom Fields"
                    item="1.3" reason="Only an Admin can change custom fields."
                >
                    <CustomFieldsView onOpenStages={() => {}} />
                </LockedPage>
            ),
        },
        {
            id: 'billing', label: 'Settings → Billing & Subscription', roles: ['manager'],
            note: 'Billing is the page where seeing the current value matters most and changing it matters least, which is the case for greying rather than hiding in one screen.',
            render: () => (
                <LockedPage
                    nav="Settings" sub="Billing & Subscription" title="Billing & Subscription"
                    breadcrumb="Settings · Billing & Subscription"
                    item="1.4" reason="Only an Admin can change billing."
                >
                    <BillingSettingsView />
                </LockedPage>
            ),
        },
        {
            id: 'keys', label: 'Integration → Keys', roles: ['manager'],
            note: 'Same pattern again. The key values stay visible, because a Manager debugging an integration needs to read them and never needs to rotate them.',
            render: () => (
                <LockedPage
                    nav="Integration" sub="Keys" title="Keys" breadcrumb="Integration · Keys" newBtn
                    item="1.4" reason="Only an Admin can add or revoke API keys."
                >
                    <KeysView />
                </LockedPage>
            ),
        },
        {
            id: 'invoices', label: 'Case → Invoices · the Stripe card', roles: ['manager'],
            note: 'On Today the Stripe card is simply absent for a Manager, because the call behind it is Admin only. Absent reads as "this hub has no card reader", which is a different and wrong answer.',
            render: () => (
                <CaseFrame
                    caseTitle="Rear-End Collision — Downtown LA" nav="Invoices" height={700}
                    who="Elena Ramirez" role="Manager" newBtn
                    patch={<Patch edits={[
                        {
                            at: '.cfm-table-wrap', mode: 'before', pin: '1.6', className: 'is-sized',
                            children: (
                                <New className="is-block">
                                    <LockedControl reason="Only an Admin can connect or change a payment provider.">
                                        <div className="sh-row">
                                            <span className="tk-stripe">stripe</span>
                                            <div className="sh-row-main">
                                                <span className="sh-row-name">Card payments</span>
                                                <span className="sh-row-hint">Clients can pay these invoices by card</span>
                                            </div>
                                            <Toggle on />
                                        </div>
                                    </LockedControl>
                                </New>
                            ),
                        },
                    ]} />}
                    overlay={<PinLayer pins={[
                        { n: '1.6', at: '[data-patch-pin="1.6"]', label: 'The card is there and dimmed, instead of missing', place: 'tl' },
                    ]} />}
                >
                    <div className="tk-mount"><InvoicesView embedded /></div>
                </CaseFrame>
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
                        pins={[{ n: '1.8', at: '.hubs-table > .users-table-row:nth-child(3) span:nth-child(4)', label: 'A Manager, which TYPE cannot say today', place: 'bl' }]}
                        patch={<Patch edits={[
                            {
                                at: '.hubs-table > .users-table-row:nth-child(3) span[data-label="Type"]',
                                mode: 'replace', as: 'span', pin: '1.8',
                                children: <span className="cases-cell"><New>manager</New></span>,
                            },
                        ]} />}
                    />
                )
            ),
        },
        {
            id: 'edituser', label: 'Edit User modal → Settings', roles: ['admin'],
            note: 'Opened from the pencil on a client row. The tier control already exists here as User Type under HOST USER ATTRIBUTES, offering User, Admin and Staff. The change is its option list.',
            render: () => (
                <RealEditUser
                    who="Robert Grant" role="Administrator" tab="Settings"
                    pins={[{ n: '1.8', at: '.eu-section:nth-child(2) .ccm-field:nth-child(1)', label: 'User Type: the tier lives here already', place: 'tl' }]}
                    patch={<Patch edits={[
                        {
                            at: '.eu-section:nth-child(2) .ccm-field:nth-child(1)',
                            mode: 'replace', pin: '1.8',
                            children: (
                                <div className="ccm-field">
                                    <label className="ccm-label">User Type</label>
                                    <New className="is-block">
                                        <Select value="User" options={['User', 'Manager', 'Admin']} />
                                    </New>
                                    <span className="ccm-hint">
                                        Admins can change every hub setting. Managers see them but cannot change them.
                                    </span>
                                </div>
                            ),
                        },
                    ]} />}
                    after={(
                        <p className="tk-aside">
                            Manager joins the list and Staff comes out, because Staff is a hub role and already has its
                            own Role field two cells away. The hint is new too: the list is three words that look alike
                            and decide quite different things.
                        </p>
                    )}
                />
            ),
        },
        {
            id: 'edituser-self', label: 'Edit User modal → Settings · viewing yourself', roles: ['admin'],
            note: 'Same modal, same field. An Admin cannot demote themselves, so the value shows and the control does not open.',
            render: () => (
                <RealEditUser
                    who="Robert Grant" role="Administrator" tab="Settings"
                    pins={[{ n: '1.8', at: '.eu-section:nth-child(2) .ccm-field:nth-child(1)', label: 'Your own tier is locked', place: 'tl' }]}
                    patch={<Patch edits={[
                        {
                            at: '.eu-section:nth-child(2) .ccm-field:nth-child(1)',
                            mode: 'replace', pin: '1.8',
                            children: (
                                <div className="ccm-field">
                                    <New className="is-block">
                                        <LockedControl reason="You cannot change your own type. Ask another Admin.">
                                            <ModalField label="User Type">
                                                <Select value="Admin" options={['Admin']} disabled />
                                            </ModalField>
                                        </LockedControl>
                                    </New>
                                </div>
                            ),
                        },
                    ]} />}
                />
            ),
        },
        {
            id: 'edituser-manager', label: 'Edit User modal → Settings · as a Manager', roles: ['manager'],
            note: 'The documented exception to 1.1. Everything else on this tab greys out; User Type goes away entirely.',
            render: () => (
                <RealEditUser
                    who="Elena Ramirez" role="Manager" tab="Settings"
                    pins={[{ n: '1.8', at: '.eu-section:nth-child(2)', label: 'HOST USER ATTRIBUTES, minus User Type', place: 'tl' }]}
                    patch={<Patch edits={[
                        /* The field is gone, not dimmed. */
                        { at: '.eu-section:nth-child(2) .ccm-field:nth-child(1)', mode: 'replace', children: null },
                        /* Everything left in the section is a value, so it dims
                           rather than disappears, and keeps showing what it is
                           set to. These are the real fields, marked. */
                        { at: '.eu-section:nth-child(2) .ccm-grid-2', mode: 'mark', addClass: 'patch-dimmed' },
                        {
                            at: '.eu-section:nth-child(2) .ccm-grid-2',
                            mode: 'after', pin: '1.8',
                            children: <p className="lkc-reason"><LockIconLine /> Only an Admin can change these.</p>,
                        },
                    ]} />}
                    after={(
                        <p className="tk-aside">
                            User Type is absent for a Manager, which is the one exception to 1.1: the control grants the
                            tier rather than holding a value, so a dimmed one reads as an invitation to ask for it.
                            Role stays visible and locked, because that is a value.
                        </p>
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
            note: 'The real Roles table. On Today the Users column is plain text on every row; on Proposed a custom role\'s count becomes the way in and a system role\'s stays plain.',
            render: (role) => (
                <RealRoles
                    who={role === 'manager' ? 'Elena Ramirez' : 'Robert Grant'}
                    role={role === 'manager' ? 'Manager' : 'Administrator'}
                    pins={[{ n: '2.1', at: '.as-table tbody tr:nth-child(5) .as-table-num', label: 'Paralegal, a custom role: the count opens the list', place: 'tr' }]}
                    patch={<Patch edits={[
                        {
                            at: '.as-table tbody tr:nth-child(5) .as-table-num',
                            mode: 'replace', as: 'td', className: 'as-table-num', pin: '2.1',
                            children: <New><button className="tk-link">5</button></New>,
                        },
                        {
                            at: '.as-table tbody tr:nth-child(6) .as-table-num',
                            mode: 'replace', as: 'td', className: 'as-table-num',
                            children: <New><button className="tk-link">4</button></New>,
                        },
                    ]} />}
                />
            ),
        },
        {
            id: 'holders', label: 'Holders window', roles: ['admin', 'manager'],
            note: 'Opened from the count, over the Roles screen it came from. There is no such window today, so Today is the screen without it.',
            render: (role) => (
                <RealRoles
                    who={role === 'manager' ? 'Elena Ramirez' : 'Robert Grant'}
                    role={role === 'manager' ? 'Manager' : 'Administrator'}
                    height={820}
                    modal={(
                        <Proposal>
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
                        </Proposal>
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
                        <Proposal>
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
                        </Proposal>
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
                    pins={[{ n: '3.1', at: '[data-patch-pin="3.1"]', label: 'First field in the window', place: 'tr' }]}
                    patch={<Patch edits={[
                        {
                            at: '.inq-modal-body',
                            mode: 'prepend', pin: '3.1',
                            children: (
                                <New className="is-block">
                                    <div className="ccm-field">
                                        <label className="ccm-label">For</label>
                                        <Select value="Myself" options={['Myself', 'Alexandra Reyes', 'Gold Roger']} />
                                        <span className="ccm-hint">This inquiry will be raised in your name.</span>
                                    </div>
                                </New>
                            ),
                        },
                    ]} />}
                    after={(
                        <p className="tk-aside">
                            Staff see this field. A client raising their own inquiry does not, since Myself is the only
                            answer they have.
                        </p>
                    )}
                />
            ),
        },
        {
            id: 'add-other', label: 'Add Inquiry · for someone else', roles: ['staff'],
            note: 'Same window, with someone else picked. One line appears under the field and nothing else changes.',
            render: () => (
                <RealInquiries
                    add height={820}
                    pins={[{ n: '3.2', at: '[data-patch-pin="3.2"]', label: 'The line only appears for someone else', place: 'tr' }]}
                    patch={<Patch edits={[
                        {
                            at: '.inq-modal-body',
                            mode: 'prepend', pin: '3.2',
                            children: (
                                <New className="is-block">
                                    <div className="ccm-field">
                                        <label className="ccm-label">For</label>
                                        <Select value="Alexandra Reyes" options={['Myself', 'Alexandra Reyes', 'Gold Roger']} />
                                        <p className="tk-helper">
                                            Alexandra Reyes will be emailed about this inquiry, and replies go to her.
                                        </p>
                                    </div>
                                </New>
                            ),
                        },
                    ]} />}
                />
            ),
        },
        {
            id: 'closed', label: 'A closed inquiry', roles: ['staff', 'client'],
            note: 'The real ticket window, opened from the Closed tab. On Today the comment box and POST are still there, so a reply can be typed into a thread nobody is watching.',
            render: (role) => (
                <RealInquiries
                    who={role === 'client' ? 'Alexandra Reyes' : 'Marcus Bell'}
                    role={role === 'client' ? 'Client' : 'Staff · Lead Attorney'}
                    tab="Closed" ticket height={820}
                    pins={[{ n: '3.3', at: '[data-patch-pin="3.3"]', label: 'Replaces the box and the POST row', place: 'tl' }]}
                    patch={<Patch edits={[
                        {
                            at: '.inq-comment-box', mode: 'replace', pin: '3.3',
                            children: (
                                <New className="is-block">
                                    <StateBlock compact tone="locked" title="This inquiry is closed." message="Reopen it to reply." actionLabel="Reopen" />
                                </New>
                            ),
                        },
                        /* The button goes with the box it belonged to. */
                        { at: '.inq-post-row', mode: 'replace', children: null },
                    ]} />}
                />
            ),
        },
        {
            id: 'noform', label: 'Add Inquiry · hub has no form', roles: ['staff'],
            note: 'Category is fed by the hub\'s inquiry categories. With none configured the select is empty and Save can never enable, so the window has nothing to say.',
            render: () => (
                <RealInquiries
                    add height={820}
                    pins={[{ n: '3.4', at: '[data-patch-pin="3.4"]', label: 'In place of the fields', place: 'tl' }]}
                    patch={<Patch edits={[
                        {
                            at: '.inq-modal-body', mode: 'replace', pin: '3.4',
                            children: (
                                <div className="ccm-body inq-modal-body">
                                    <New className="is-block">
                                        <StateBlock
                                            tone="empty"
                                            title="This hub has no inquiry form."
                                            message="An Admin removed it. Ask them to add one before raising inquiries here."
                                        />
                                    </New>
                                </div>
                            ),
                        },
                    ]} />}
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
            note: 'A completed e-sign offers a disabled signature button and View Settings, and nothing that opens the signed document. So 4.1 adds the action and the screen behind it.',
            render: (role) => (
                <CaseFrame
                    caseTitle="Rear-End Collision — Downtown LA" nav="E-signs" height={760}
                    who={role === 'client' ? 'Alexandra Reyes' : 'Marcus Bell'}
                    role={role === 'client' ? 'Client' : 'Staff · Lead Attorney'}
                    newBtn
                    patch={<Patch edits={[
                        {
                            at: '.cfm-table-row .ft-action-wrap .ft-icon-btn.sign',
                            mode: 'replace', as: 'span', pin: '4.1',
                            children: (
                                <New>
                                    <button className="ft-icon-btn" title="View signed document" type="button">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    </button>
                                </New>
                            ),
                        },
                    ]} />}
                    modal={(
                        <Proposal>
                            <Modal crumb="E-signs · Release Authorization" title="Signed document" width={760} footer={<Btn kind="link">Close</Btn>}>
                                <Change n="4.1" block label="The record, above the document">
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
                                <div className="fed-pdf-placeholder">
                                    <p className="fed-pdf-placeholder-text">The signed document, read only</p>
                                </div>
                            </Modal>
                        </Proposal>
                    )}
                >
                    <div className="tk-mount">
                        <AutoOpen clicks={['.ev-tabs-bar .ev-tab:nth-child(2)']}>
                            <ESignsView embedded />
                        </AutoOpen>
                    </div>
                </CaseFrame>
            ),
        },
        {
            id: 'templates', label: 'Library → E-sign templates', roles: ['admin', 'staff'],
            note: 'The real templates list. Status is a single .ft-status-badge that says Ready whether or not a document was ever attached.',
            render: (role) => (
                <AdminFrame
                    nav="Library" sub="E-Sign Templates" title="E-Sign Templates"
                    breadcrumb="Library · E-Sign Templates" newBtn
                    who={role === 'staff' ? 'Marcus Bell' : 'Robert Grant'}
                    role={role === 'staff' ? 'Staff · Lead Attorney' : 'Administrator'}
                    patch={<Patch edits={[
                        {
                            at: '.hubs-table > .fot-table-row:nth-child(4) .ft-status-badge',
                            mode: 'replace', as: 'span', pin: '4.2',
                            children: <New><StatusPill status="needsDocument" dot /></New>,
                        },
                    ]} />}
                    overlay={<PinLayer pins={[
                        { n: '4.2', at: '[data-patch-pin="4.2"]', label: 'Needs a document, in the same badge', place: 'tr' },
                    ]} />}
                >
                    <div className="tk-mount"><ESignTemplatesView /></div>
                </AdminFrame>
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
                        <Proposal>
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
                        </Proposal>
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
            note: 'The real list. On Today the second column is headed CASE ID and holds the internal id as plain text, which is why a Tag ID cannot be searched for.',
            render: (role) => (
                <AdminFrame
                    nav="Cases" sub={null} title="Cases" breadcrumb="Cases" newBtn
                    who={role === 'staff' ? 'Marcus Bell' : 'Robert Grant'}
                    role={role === 'staff' ? 'Staff · Lead Attorney' : 'Administrator'}
                    patch={<Patch edits={[
                        {
                            at: '.cases-table-head span:nth-child(2)',
                            mode: 'replace', as: 'span', pin: '5.1',
                            children: <New>TAG ID</New>,
                        },
                        ...[
                            ['64fc9cf315526b', 'cc-64fc9cf315526b', 3],
                            ['a1b2c3d4e56789', 'cc-a1b2c3d4e56789', 4],
                            ['b3c4d5e6f78901', 'cc-b3c4d5e6f78901', 5],
                            ['c5d6e7f8091234', 'cc-c5d6e7f8091234', 6],
                            ['d7e8f9a0123456', 'cc-d7e8f9a0123456', 7],
                            ['e1f2a3b4c5d678', 'cc-e1f2a3b4c5d678', 8],
                        ].map(([tag, internal, nth]) => ({
                            at: `.hubs-table > .cases-table-row:nth-child(${nth}) .cases-id-text`,
                            mode: 'replace', as: 'span',
                            children: (
                                <span className="cases-cell tk-tag">
                                    <Code>{tag}</Code>
                                    <button className="tk-copy" title={`Copy internal id ${internal}`}>copy id</button>
                                </span>
                            ),
                        })),
                    ]} />}
                    overlay={<PinLayer pins={[
                        { n: '5.1', at: '[data-patch-pin="5.1"]', label: 'Tag ID takes the column and the header', place: 'tl' },
                    ]} />}
                >
                    <div className="tk-mount"><CasesView /></div>
                </AdminFrame>
            ),
        },
        {
            id: 'cases-phone', label: 'Cases list · phone', roles: ['admin', 'staff'], phone: true,
            note: 'The real list at phone width, where the table collapses to cards and each cell carries its own label.',
            render: () => (
                <Phone>
                    <AdminFrame
                        nav="Cases" sub={null} title="Cases" breadcrumb="Cases"
                        who="Marcus Bell" role="Staff · Lead Attorney"
                        patch={<Patch edits={[
                            ...[
                                ['a1b2c3d4e56789', 'cc-a1b2c3d4e56789', 3],
                                ['b3c4d5e6f78901', 'cc-b3c4d5e6f78901', 4],
                                ['c5d6e7f8091234', 'cc-c5d6e7f8091234', 5],
                            ].map(([tag, internal, nth], i) => ({
                                at: `.hubs-table > .cases-table-row:nth-child(${nth}) .cases-id-text`,
                                mode: 'replace', as: 'span', pin: i === 0 ? '5.2' : undefined,
                                children: (
                                    <span className="cases-cell tk-tag">
                                        <Code>{tag}</Code>
                                        <button className="tk-copy" title={`Copy internal id ${internal}`}>copy id</button>
                                    </span>
                                ),
                            })),
                        ]} />}
                        overlay={<PinLayer pins={[
                            { n: '5.2', at: '[data-patch-pin="5.2"]', label: 'On a card the copy button has room to be a button', place: 'tl' },
                        ]} />}
                    >
                        <div className="tk-mount"><CasesView /></div>
                    </AdminFrame>
                </Phone>
            ),
        },
        {
            id: 'userslist', label: 'Users list · where View Cases opens from', roles: ['admin', 'staff'],
            note: 'Context, not a change. The folder action on a row opens View Cases, and a bot\'s is disabled because a bot has no cases.',
            render: () => (
                <RealUsers
                    pins={[{ n: '5.3', at: '.hubs-table > .users-table-row:nth-child(5) .users-action-btns', label: 'The folder opens View Cases', place: 'tl' }]}
                />
            ),
        },
        {
            id: 'viewcases', label: 'Users → View Cases', roles: ['admin', 'staff'],
            note: 'On Today the window is titled View Cases rather than the person, lists case ids with no titles, and shows a role with no designation.',
            render: () => (
                <RealUsers
                    height={780}
                    clicks={['.hubs-table > .users-table-row:nth-child(5) .users-action-btns .users-icon-btn:last-child']}
                    patch={<Patch edits={[
                        {
                            at: '.view-cases-modal .ccm-title',
                            mode: 'replace', pin: '5.3',
                            children: <h2 className="ccm-title"><New>Gold Roger</New></h2>,
                        },
                        {
                            at: '.view-cases-table', mode: 'replace',
                            children: (
                                <New className="is-block">
                                    <Table
                                        cols={['Case', 'Tag ID', 'Status', 'Role']}
                                        rows={[
                                            { Case: 'Welcome! Here is a Sample Case', 'Tag ID': <Code>64fc9cf315526b</Code>, Status: <StatusPill status="active" />, Role: <DesignationLabel role="Client" designation="Primary" /> },
                                            { Case: 'Workers Comp — Martinez, Jose', 'Tag ID': <Code>c5d6e7f8091234</Code>, Status: <StatusPill status="pending" />, Role: <DesignationLabel role="Client" designation="Spouse" /> },
                                        ]}
                                    />
                                </New>
                            ),
                        },
                    ]} />}
                    pins={[
                        { n: '5.3', at: '[data-patch-pin="5.3"]', label: 'Headed by the person, case by name, role with its designation', place: 'tr' },
                    ]}
                />
            ),
        },
        {
            id: 'viewcases-error', label: 'View Cases · couldn\'t load', roles: ['admin', 'staff'],
            note: 'On Today the window has one empty state, "No cases assigned.", which it also shows when the request failed.',
            render: () => (
                <RealUsers
                    height={780}
                    clicks={['.hubs-table > .users-table-row:nth-child(5) .users-action-btns .users-icon-btn:last-child']}
                    patch={<Patch edits={[
                        {
                            at: '.view-cases-table', mode: 'replace', pin: '5.4',
                            children: (
                                <New className="is-block">
                                    <StateBlock
                                        tone="error"
                                        title="Couldn't load this person's cases."
                                        message="The list did not come back. Try again."
                                        actionLabel="Try again"
                                    />
                                </New>
                            ),
                        },
                    ]} />}
                    pins={[
                        { n: '5.4', at: '[data-patch-pin="5.4"]', label: 'Distinct from empty, retry is the loudest thing in it', place: 'tr' },
                    ]}
                />
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
            note: 'The real Hubs page. Status is an .sf-chip driven by the subscription, with no value for a hub whose access the firm withdrew. The Rejected tab holds no rows in this build, so the chip is shown on Active where it renders.',
            render: () => (
                <AdminFrame
                    nav="Settings" sub="Hubs" title="Hubs" breadcrumb="Settings · Hubs" newBtn
                    patch={<Patch edits={[
                        {
                            at: '.hubs-table .hubs-table-row .sf-chip',
                            mode: 'replace', as: 'span', pin: '6.3',
                            children: <New><StatusPill status="accessRemoved" dot /></New>,
                        },
                    ]} />}
                    overlay={<PinLayer pins={[
                        { n: '6.3', at: '.hubs-status-row .hubs-status-tab:nth-child(2)', label: 'The tab this lands on', place: 'tr' },
                        { n: '6.3', at: '[data-patch-pin="6.3"]', label: 'A value of its own, so the notice and the list agree', place: 'br' },
                    ]} />}
                >
                    <div className="tk-mount"><HubsPage embedded /></div>
                </AdminFrame>
            ),
        },
        {
            id: 'permissions', label: 'A removed hub → Permissions', roles: ['admin', 'manager'],
            note: 'The real hub settings window carries two tabs, About Hub and Billing Info. There is no Permissions tab, so 6.2 adds a third and the body behind it.',
            render: () => (
                <AdminFrame
                    nav="Settings" sub="Hubs" title="Hubs" breadcrumb="Settings · Hubs" newBtn height={840}
                    patch={<Patch edits={[
                        {
                            at: '.hub-wizard-tabs', mode: 'inside', as: 'span', pin: '6.2',
                            children: (
                                <New>
                                    <button type="button" className="hub-wizard-tab active">Permissions</button>
                                </New>
                            ),
                        },
                        {
                            at: '.ccm-body', mode: 'replace',
                            children: (
                                <div className="ccm-body">
                                    <New className="is-block">
                                        <StateBlock
                                            tone="error"
                                            title="Your access to this hub was removed."
                                            message="The firm keeps your details as they were. Nothing here changes until they approve your access again."
                                        />
                                        <div className="tk-gap">
                                            <LockedControl reason="Approval is the firm's to give. Nothing here can be changed meanwhile.">
                                                <div>
                                                    <Row name="Create cases" control={<Toggle on />} />
                                                    <Row name="Add people to a case" control={<Toggle on />} />
                                                    <Row name="Remove people from a case" control={<Toggle />} />
                                                </div>
                                            </LockedControl>
                                        </div>
                                    </New>
                                </div>
                            ),
                        },
                    ]} />}
                    overlay={<PinLayer pins={[
                        { n: '6.2', at: '[data-patch-pin="6.2"]', label: 'The third tab', place: 'tr' },
                    ]} />}
                >
                    <div className="tk-mount">
                        <AutoOpen clicks={['.hubs-table-row .hubs-action-btn.more']}>
                            <HubsPage embedded />
                        </AutoOpen>
                    </div>
                </AdminFrame>
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
            note: 'The real case shell, on the page someone lands on after leaving the call. On Today there is nothing holding the call: navigating away is the same as hanging up.',
            render: (role) => (
                <>
                    <div className="tk-withbar">
                        <Proposal>
                            <Change n="7.1" block label="Stays while you move around">
                                <div className="tk-callbar">
                                    <span className="tk-callbar-dot" />
                                    <span className="tk-callbar-text"><strong>Call in progress</strong> · Rear-End Collision — Downtown LA · 12:04</span>
                                    <span className="tk-callbar-actions"><Btn>Back to call</Btn><Btn kind="danger">Leave</Btn></span>
                                </div>
                            </Change>
                        </Proposal>
                        <CaseFrame
                            caseTitle="Rear-End Collision — Downtown LA" nav="Feed" height={560}
                            who={role === 'client' ? 'Alexandra Reyes' : 'Marcus Bell'}
                            role={role === 'client' ? 'Client' : 'Staff · Lead Attorney'}
                        >
                            <div className="tk-mount"><FeedView /></div>
                        </CaseFrame>
                    </div>
                    <p className="tk-aside">
                        The bar sits above the case shell rather than inside it, so it survives the view changing
                        underneath. That means call state has to live above the router.
                    </p>
                </>
            ),
        },
        {
            id: 'bar-phone', label: 'Call in progress bar · phone', roles: ['staff', 'client'], phone: true,
            note: 'Required here: phones, Safari and Firefox cannot float the video.',
            render: () => (
                <Phone>
                    <Proposal>
                        <Change n="7.1" block label="Same bar, full width">
                            <div className="tk-callbar is-narrow">
                                <span className="tk-callbar-dot" />
                                <span className="tk-callbar-text"><strong>Call in progress</strong> · 12:04</span>
                                <Btn>Back</Btn>
                            </div>
                        </Change>
                    </Proposal>
                    <CaseFrame caseTitle="Rear-End Collision — Downtown LA" nav="Feed" who="Alexandra Reyes" role="Client">
                        <div className="tk-mount"><FeedView /></div>
                    </CaseFrame>
                </Phone>
            ),
        },
        {
            id: 'blocked', label: 'Camera or microphone blocked', roles: ['staff', 'client'],
            note: 'The real Check devices step, with the camera genuinely refused. On Today the app says so twice, in two places, neither of which can be acted on, and the warning sits below the button it should inform.',
            render: () => (
                <CaseFrame
                    caseTitle="Rear-End Collision — Downtown LA" nav="Convo" height={820}
                    who="Marcus Bell" role="Staff · Lead Attorney"
                    patch={<Patch edits={[
                        /* One notice, above the button it is about. */
                        {
                            at: '.cv-join-btn', mode: 'before', pin: '7.2', className: 'is-sized',
                            children: (
                                <New className="is-block">
                                    <StateBlock
                                        tone="error"
                                        title="Your browser is blocking the camera and microphone."
                                        message="Allow access for this site in your browser settings, then try again. You can also join with both off."
                                        actionLabel="Try again"
                                    />
                                </New>
                            ),
                        },
                        /* The old line under the button goes with it. */
                        { at: '.cv-warn', mode: 'replace', children: null },
                        /* The preview says what the preview is, not what the problem is. */
                        {
                            at: '.cv-preview-off-text', mode: 'replace',
                            children: <p className="cv-preview-off-text">No camera preview</p>,
                        },
                    ]} />}
                    overlay={<PinLayer pins={[
                        { n: '7.2', at: '[data-patch-pin="7.2"]', label: 'One notice, above Join now, with the retry on it', place: 'tl' },
                    ]} />}
                >
                    <div className="tk-mount">
                        <AutoOpen clicks={['.cv-card .imp-save-btn']}>
                            <ConvoView embedded />
                        </AutoOpen>
                    </div>
                </CaseFrame>
            ),
        },
        {
            id: 'ended', label: 'Call has ended', roles: ['staff', 'client'],
            note: 'There is already a Call ended screen, reached by leaving, which offers Start another convo. 7.3 is the other ending: the call closed for everyone, which you did not choose.',
            render: () => (
                <>
                    <CaseFrame
                        caseTitle="Rear-End Collision — Downtown LA" nav="Convo" height={700}
                        who="Marcus Bell" role="Staff · Lead Attorney"
                    >
                        <div className="tk-mount">
                            <Proposal
                                instead={(
                                    <div className="cv-card cv-ended">
                                        <h3 className="cv-card-title">Call ended</h3>
                                        <p className="cv-card-sub">The convo has been logged against this case.</p>
                                        <div className="cv-ended-actions">
                                            <button className="imp-save-btn" type="button">Start another convo</button>
                                        </div>
                                    </div>
                                )}
                            >
                                <div className="cv-card cv-ended">
                                    <Change n="7.3" block label="Ended for everyone">
                                        <StateBlock
                                            tone="empty"
                                            title="The call has ended."
                                            message="It ran for 24 minutes. The recording and summary will appear in the case feed shortly."
                                            actionLabel="Back to the case"
                                        />
                                    </Change>
                                </div>
                            </Proposal>
                        </div>
                    </CaseFrame>
                    <p className="tk-aside">
                        Today offers Start another convo, which reads as a thing you did. The ending you did not choose
                        points back at the case instead.
                    </p>
                </>
            ),
        },
        {
            id: 'notify', label: 'Notify window · someone left out', roles: ['staff'],
            note: 'The real Set up step picks who gets a link. Nothing checks afterwards whether every one of them could be reached.',
            render: () => (
                <CaseFrame
                    caseTitle="Rear-End Collision — Downtown LA" nav="Convo" height={820}
                    who="Marcus Bell" role="Staff · Lead Attorney"
                    patch={<Patch edits={[
                        {
                            at: '.cv-people-grid', mode: 'after', pin: '7.4',
                            children: (
                                <New className="is-block">
                                    <StateBlock
                                        tone="error"
                                        title="2 people were not notified."
                                        message="Danielle Okafor and James Rivera have no email on file, so they did not get the link. Send it to them another way, or add an email and invite them again."
                                        actionLabel="Copy the link"
                                    />
                                </New>
                            ),
                        },
                    ]} />}
                    overlay={<PinLayer pins={[
                        { n: '7.4', at: '[data-patch-pin="7.4"]', label: 'Names them rather than counting them', place: 'tl' },
                    ]} />}
                >
                    <div className="tk-mount"><ConvoView embedded /></div>
                </CaseFrame>
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
        { id: '8.1', what: 'A partly failed status, and split counts, in place of Completed on an import that lost rows.', where: 'Integration → Imports', file: 'src/views/integration/ImportsView.jsx:112 StatusBadge', roles: ['admin'], bug: true },
        { id: '8.2', what: 'Failed rows list with line number and reasons, paginated with a filter.', where: 'Integration → Imports → Import Log', file: 'src/views/integration/ImportsView.jsx:393', roles: ['admin'], stub: 'Failed rows are mock. Needs line number and reason list per failed row.' },
        { id: '8.3', what: 'Download failed rows, and the full download it sits beside. Neither exists today: the window offers Close, and Retry Import only when the whole import failed.', where: 'Integration → Imports → View Import', file: 'src/views/integration/ImportsView.jsx:418', roles: ['admin'] },
        { id: '8.4', what: 'Prompt before Cancel discards unsaved form removals.', where: 'Intake → Mapping window', file: 'Not in this codebase', roles: ['admin'], missing: true },
    ],
    screens: [
        {
            id: 'list', label: 'Imports list', roles: ['admin'],
            note: 'The bug is in the real data: user-bulk-july moved 124 of 125 rows and is marked Completed. StatusBadge knows Queued, Completed and Failed, with nothing in between.',
            render: () => (
                <AdminFrame
                    nav="Integration" sub="Imports" title="Imports" breadcrumb="Integration · Imports" newBtn
                    patch={<Patch edits={[
                        {
                            at: '.imp-table tbody tr:nth-child(2) td:nth-child(5) .imp-stats-cell',
                            mode: 'replace', as: 'span',
                            children: (
                                <span className="tk-summary">
                                    <span className="tk-sum-ok"><strong>124</strong> succeeded</span>
                                    <span className="tk-sum-bad"><strong>1</strong> failed</span>
                                </span>
                            ),
                        },
                        {
                            at: '.imp-table tbody tr:nth-child(2) .imp-status-badge',
                            mode: 'replace', as: 'span', pin: '8.1',
                            children: <New><StatusPill label="Partly failed" tone="warning" dot /></New>,
                        },
                    ]} />}
                    overlay={<PinLayer pins={[
                        { n: '8.1', at: '[data-patch-pin="8.1"]', label: 'A third status, and counts that split', place: 'tr' },
                    ]} />}
                >
                    <div className="tk-mount"><ImportsView /></div>
                </AdminFrame>
            ),
        },
        {
            id: 'partial', label: 'Imports → a partly failed import', roles: ['admin'],
            note: 'The real View Import window for that same import. On Today its log says "All rows processed" over a stat line reading 124 / 125, and the footer offers Close and nothing else.',
            render: () => (
                <AdminFrame
                    nav="Integration" sub="Imports" title="Imports" breadcrumb="Integration · Imports" newBtn height={840}
                    patch={<Patch edits={[
                        {
                            at: '.imp-detail-log-wrap', mode: 'replace', pin: '8.2', className: 'is-sized',
                            children: (
                                <div className="imp-detail-log-wrap">
                                    <div className="imp-log-item success">✓ File validated successfully</div>
                                    <New className="is-block">
                                        <div className="tk-loghead">
                                            <h4 className="as-card-title sh-cardhead">Import log · failed rows</h4>
                                            <input className="sh-select tk-logsearch" placeholder="Filter by reason or line number" readOnly />
                                        </div>
                                        <Table
                                            cols={['Line', 'Reason']}
                                            rows={[
                                                { Line: <Code>14</Code>, Reason: 'Email is not valid. Case type "Autoo" is not a case type in this hub.' },
                                                { Line: <Code>27</Code>, Reason: 'Tag ID already belongs to another case.' },
                                                { Line: <Code>31</Code>, Reason: 'Date opened is not a date.' },
                                            ]}
                                        />
                                        <div className="tk-pager">
                                            <span>1 to 3 of 20</span>
                                            <span className="tk-row-actions"><Btn>Previous</Btn><Btn>Next</Btn></span>
                                        </div>
                                    </New>
                                </div>
                            ),
                        },
                        {
                            at: '.ccm-footer .imp-cancel-btn', mode: 'after', pin: '8.3',
                            children: (
                                <New>
                                    <span className="tk-row-actions">
                                        <Btn>Download all rows</Btn>
                                        <Btn kind="primary">Download failed rows</Btn>
                                    </span>
                                </New>
                            ),
                        },
                    ]} />}
                    overlay={<PinLayer pins={[
                        { n: '8.2', at: '[data-patch-pin="8.2"]', label: 'The failures, by line number, with a filter', place: 'tl' },
                        { n: '8.3', at: '[data-patch-pin="8.3"]', label: 'Neither download exists today', place: 'bl' },
                    ]} />}
                >
                    <div className="tk-mount">
                        <AutoOpen clicks={['.imp-table tbody tr:nth-child(2) .imp-view-btn']}>
                            <ImportsView />
                        </AutoOpen>
                    </div>
                </AdminFrame>
            ),
        },
        {
            id: 'mapping', label: 'Intake Mapping · discard prompt', roles: ['admin'],
            note: 'The intake Mapping window is in Support and not in this codebase, so this is a drawing, shown over Imports because that is the nearest shell it would share.',
            render: () => (
                <AdminFrame
                    nav="Integration" sub="Imports" title="Imports" breadcrumb="Integration · Imports" newBtn height={760}
                    modal={(
                        <Proposal>
                            <Modal title="Discard your changes?" width={480} footer={<><Btn kind="link">Keep editing</Btn><Btn kind="danger">Discard</Btn></>}>
                                <Change n="8.4" block label="Fires only when something would be lost">
                                    <StateBlock
                                        tone="error"
                                        title="You removed 2 forms and have not saved."
                                        message="Closing now puts them back. Save first if you meant to remove them."
                                    />
                                </Change>
                            </Modal>
                        </Proposal>
                    )}
                >
                    <div className="tk-mount"><ImportsView /></div>
                </AdminFrame>
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
        { id: '9.1', what: 'Three refund states, identical in list, preview, both PDFs and the Lobby. The two lists carry different status sets today, so identical means reconciling them first.', where: 'Invoices everywhere', file: 'src/views/InvoicesView.jsx:66 STATUSES, src/views/PaymentsView.jsx:112 StatusBadge, src/views/LobbyView.jsx', roles: ['admin', 'manager', 'staff', 'client'], stub: 'No refund state exists. Needs refund status, date, amount and Stripe reason on the invoice.' },
        { id: '9.2', what: 'Refund date and amount under the total.', where: 'Preview, both PDFs, Lobby invoice', file: 'src/views/InvoicesView.jsx, src/views/LobbyView.jsx', roles: ['admin', 'staff', 'client'], stub: 'No PDF renderer here. Designed as a print layout.' },
        { id: '9.3', what: 'Couldn\'t load state for the invoice list, distinct from No invoices yet.', where: 'Invoices list', file: 'src/views/InvoicesView.jsx', roles: ['admin', 'manager', 'staff'] },
        { id: '9.4', what: 'Refund window notice for invoices paid by hand: records only, no money moves.', where: 'Invoices → Refund', file: 'src/views/InvoicesView.jsx', roles: ['admin', 'staff'] },
        { id: '9.5', what: 'Stripe\'s refusal reason on the Stripe row, switch kept.', where: 'Payments → Settings', file: 'src/views/PaymentsView.jsx', roles: ['admin'] },
    ],
    screens: [
        {
            id: 'list', label: 'Invoices list · the three states', roles: ['admin', 'manager', 'staff'],
            note: 'The real Payments list. On Today status is open, paid or overdue, so a refunded invoice keeps reading paid and so does a failed refund. Only a paid invoice can carry a refund state, and this page holds two, so Refund failed is shown on the preview screen.',
            render: (role) => (
                <AdminFrame
                    nav="Payments" sub={null} title="Payments" breadcrumb="Payments"
                    who={role === 'manager' ? 'Elena Ramirez' : role === 'staff' ? 'Marcus Bell' : 'Robert Grant'}
                    role={role === 'manager' ? 'Manager' : role === 'staff' ? 'Staff · Lead Attorney' : 'Administrator'}
                    patch={<Patch edits={[
                        {
                            at: '.pay-table tbody tr:nth-child(2) .pay-status-badge',
                            mode: 'replace', as: 'span', pin: '9.1',
                            children: <New><StatusPill status="refundPending" dot /></New>,
                        },
                        {
                            at: '.pay-table tbody tr:nth-child(4) .pay-status-badge',
                            mode: 'replace', as: 'span',
                            children: <New><StatusPill status="refunded" dot /></New>,
                        },

                    ]} />}
                    overlay={<PinLayer pins={[
                        { n: '9.1', at: '[data-patch-pin="9.1"]', label: 'Three more states, used identically everywhere', place: 'tr' },
                    ]} />}
                >
                    <div className="tk-mount"><PaymentsView /></div>
                </AdminFrame>
            ),
        },
        {
            id: 'preview', label: 'Invoice preview · refund under the total', roles: ['admin', 'staff'],
            note: 'The real preview, which is also what prints. Its foot is a single Total Due row, so the refund line goes directly under it.',
            render: () => (
                <AdminFrame
                    nav="Payments" sub={null} title="Payments" breadcrumb="Payments" height={840}
                    patch={<Patch edits={[
                        {
                            at: '.pay-preview-table tfoot tr', mode: 'after', as: 'tr', pin: '9.2',
                            children: (
                                <>
                                    <td><New>Refunded 8 Oct 2026</New></td>
                                    <td><New>−$980.00</New></td>
                                </>
                            ),
                        },
                        {
                            at: '.pay-preview-heading', mode: 'inside', as: 'span', pin: '9.1',
                            children: <New><StatusPill status="refunded" dot /></New>,
                        },
                    ]} />}
                    overlay={<PinLayer pins={[
                        { n: '9.2', at: '[data-patch-pin="9.2"]', label: 'In the same column of figures they are already reading', place: 'bl' },
                        { n: '9.1', at: '[data-patch-pin="9.1"]', label: 'The same pill the list shows', place: 'tr' },
                    ]} />}
                >
                    <div className="tk-mount">
                        <AutoOpen clicks={['.pay-table tbody tr:nth-child(2) .users-icon-btn']}>
                            <PaymentsView />
                        </AutoOpen>
                    </div>
                </AdminFrame>
            ),
        },
        {
            id: 'lobby', label: 'Lobby invoice page · what the client sees', roles: ['client'],
            note: 'The real case Invoices view, which is the same component the Lobby renders. It carries its own status set, Open, Paid, Processing, Void and Uncollectable, which is not the Payments list\'s open, paid and overdue. So before the three refund states can look the same in both, the two lists have to agree on what a status is.',
            render: () => (
                <CaseFrame
                    caseTitle="Rear-End Collision — Downtown LA" nav="Invoices" height={720}
                    who="Alexandra Reyes" role="Client" newBtn
                    patch={<Patch edits={[
                        {
                            at: '.inv-table-row .inv-status-wrap, .inv-table-row .inv-status-static',
                            mode: 'replace', as: 'span', pin: '9.1',
                            children: <New><StatusPill status="refunded" dot /></New>,
                        },
                    ]} />}
                    overlay={<PinLayer pins={[
                        { n: '9.1', at: '[data-patch-pin="9.1"]', label: 'Same pill, same words, on the client side', place: 'tr' },
                    ]} />}
                >
                    <div className="tk-mount"><InvoicesView embedded /></div>
                </CaseFrame>
            ),
        },
        {
            id: 'manual', label: 'Refund window · invoice paid by hand', roles: ['admin', 'staff'],
            note: 'There is no refund window today, so this is a drawing, shown over the list it would open from.',
            render: () => (
                <AdminFrame
                    nav="Payments" sub={null} title="Payments" breadcrumb="Payments" height={780}
                    modal={(
                        <Proposal>
                            <Modal title="Record a refund" width={520} footer={<><Btn kind="link">Cancel</Btn><Btn kind="primary">Record refund</Btn></>}>
                                <Change n="9.4" block label="No money moves">
                                    <StateBlock
                                        tone="empty"
                                        title="This invoice was paid by hand, so nothing is sent to Stripe."
                                        message="Recording a refund here notes a refund you have already made outside the portal. No money moves."
                                    />
                                </Change>
                                <ModalField label="Refund amount"><Input value="$980" /></ModalField>
                                <ModalField label="Refund date"><Input value="08/10/2026" /></ModalField>
                            </Modal>
                        </Proposal>
                    )}
                >
                    <div className="tk-mount"><PaymentsView /></div>
                </AdminFrame>
            ),
        },
        {
            id: 'error', label: 'Invoice list · couldn\'t load', roles: ['admin', 'manager', 'staff'],
            note: 'The real list has one empty cell, "No invoices found", which it also shows when the request failed.',
            render: () => (
                <AdminFrame
                    nav="Payments" sub={null} title="Payments" breadcrumb="Payments"
                    patch={<Patch edits={[
                        {
                            at: '.pay-table tbody', mode: 'replace', as: 'tbody', pin: '9.3',
                            children: (
                                <tr>
                                    <td colSpan={8}>
                                        <New className="is-block">
                                            <StateBlock
                                                tone="error"
                                                title="Couldn't load invoices."
                                                message="The list did not come back. Try again."
                                                actionLabel="Try again"
                                            />
                                        </New>
                                    </td>
                                </tr>
                            ),
                        },
                    ]} />}
                    overlay={<PinLayer pins={[
                        { n: '9.3', at: '[data-patch-pin="9.3"]', label: 'Distinct from empty, retry is the loudest thing in it', place: 'tl' },
                    ]} />}
                >
                    <div className="tk-mount"><PaymentsView /></div>
                </AdminFrame>
            ),
        },
        {
            id: 'stripe', label: 'Payments → Stripe refuses', roles: ['admin'],
            note: 'Payments has no settings area in this codebase, so the provider row is a drawing. The rule it carries is the point: a refusal never flips the switch.',
            render: () => (
                <AdminFrame nav="Payments" sub={null} title="Payments" breadcrumb="Payments · Settings">
                    <div className="portal-content sh-body">
                        <Panel label="Payment provider" sub="Connect a provider to collect invoice payments online.">
                            <div className="sh-row">
                                <span className="tk-stripe">stripe</span>
                                <div className="sh-row-main">
                                    <span className="sh-row-name">Stripe</span>
                                    <span className="sh-row-hint">Connected · payouts daily</span>
                                </div>
                                <Toggle on />
                            </div>
                            <Proposal>
                                <Change n="9.5" block label="Stripe's reason, switch kept">
                                    <StateBlock
                                        compact tone="error"
                                        title="Stripe refused the change."
                                        message="Your account cannot accept payouts in this currency yet. Stripe says: &quot;payouts_not_allowed&quot;. The switch is unchanged."
                                        actionLabel="Try again"
                                    />
                                </Change>
                            </Proposal>
                        </Panel>
                    </div>
                </AdminFrame>
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
        { id: '10.1', what: 'Child tasks get their own assignee roles, prefilled from the parent and marked while unchanged. The hardcoded Unassigned badge goes.', where: 'Library → Task templates', file: 'src/views/library/TaskTemplatesView.jsx:271 the badge, :284 the parent select', roles: ['admin', 'staff'] },
        { id: '10.2', what: 'Role and designation mention picker in the feed template editor.', where: 'Library → Feed templates', file: 'src/views/library/FeedTemplatesView.jsx', roles: ['admin', 'staff'] },
        { id: '10.3', what: 'A mention renders as a readable name placeholder in the preview, not the raw code.', where: 'Library → Feed templates → preview', file: 'src/views/library/FeedTemplatesView.jsx', roles: ['admin', 'staff'] },
    ],
    screens: [
        {
            id: 'task', label: 'Task template · child assignees', roles: ['admin', 'staff'],
            note: 'The real task template window. On Today every child row carries a hardcoded Unassigned badge, and the parent control is one select holding Staff, Clients, Bots or Any.',
            render: (role) => (
                <>
                    <AdminFrame
                        nav="Library" sub="Task Templates" title="Task Templates"
                        breadcrumb="Library · Task Templates" newBtn height={820}
                        who={role === 'staff' ? 'Marcus Bell' : 'Robert Grant'}
                        role={role === 'staff' ? 'Staff · Lead Attorney' : 'Administrator'}
                        patch={<Patch edits={[
                            {
                                at: '.vtm-subtask-list .vtm-subtask-row:nth-child(1) .vtm-subtask-badge',
                                mode: 'replace', as: 'span', pin: '10.1',
                                children: (
                                    <New>
                                        <span className="tk-inherit">
                                            <Input as="static" value="Staff · Paralegal" />
                                            <span className="tk-inherit-tag">from parent</span>
                                        </span>
                                    </New>
                                ),
                            },
                            {
                                at: '.vtm-subtask-list .vtm-subtask-row:nth-child(2) .vtm-subtask-badge',
                                mode: 'replace', as: 'span',
                                children: <New><Input as="static" value="Staff · Lead Attorney" /></New>,
                            },
                            {
                                at: '.vtm-right .vtm-select', mode: 'after', as: 'span',
                                children: (
                                    <New className="is-block">
                                        <Select value="Lead Attorney" options={['Any designation', 'Primary', 'Lead Attorney', 'Case Manager', 'Paralegal']} className="vtm-select" />
                                    </New>
                                ),
                            },
                        ]} />}
                        overlay={<PinLayer pins={[
                            { n: '10.1', at: '[data-patch-pin="10.1"]', label: 'Inherited, and visibly so until someone changes it', place: 'tr' },
                        ]} />}
                    >
                        <div className="tk-mount">
                            <AutoOpen clicks={['.tt-table-row .ft-icon-btn[title="View Task"]']}>
                                <TaskTemplatesView />
                            </AutoOpen>
                        </div>
                    </AdminFrame>
                    <p className="tk-aside">
                        A designation on a child needs the parent control to carry one first: today it holds Staff,
                        Clients, Bots or Any and nothing finer, which is the second select added beside it.
                    </p>
                </>
            ),
        },
        {
            id: 'feed', label: 'Feed template · mentions', roles: ['admin', 'staff'],
            note: 'The real post window. Post Message is a plain textarea with no mention support, so the picker and the readable preview are both new.',
            render: (role) => (
                <AdminFrame
                    nav="Library" sub="Feed Templates" title="Feed Templates"
                    breadcrumb="Library · Feed Templates" newBtn height={840}
                    who={role === 'staff' ? 'Marcus Bell' : 'Robert Grant'}
                    role={role === 'staff' ? 'Staff · Lead Attorney' : 'Administrator'}
                    patch={<Patch edits={[
                        {
                            at: '.apm-body textarea', mode: 'after', pin: '10.2', className: 'is-sized',
                            children: (
                                <New className="is-block">
                                    <div className="tk-picker">
                                        <span className="tk-picker-label">Insert a mention</span>
                                        <div className="tk-picker-row">
                                            <Select value="Staff" options={['Staff', 'Clients', 'Bots']} />
                                            <Select value="Lead Attorney" options={['Lead Attorney', 'Paralegal', 'Any designation']} />
                                            <Btn kind="primary">Insert</Btn>
                                        </div>
                                    </div>
                                    <div className="tk-preview" data-patch-pin="10.3">
                                        <h4 className="as-card-title sh-cardhead">Preview</h4>
                                        <p>
                                            Hi <strong>[client&apos;s name]</strong>, your demand letter was sent today. Your attorney{' '}
                                            <strong>[lead attorney&apos;s name]</strong> will update you when the insurer replies.
                                        </p>
                                    </div>
                                </New>
                            ),
                        },
                    ]} />}
                    overlay={<PinLayer pins={[
                        { n: '10.2', at: '[data-patch-pin="10.2"]', label: 'Under the message, so the textarea keeps working as it does', place: 'tl' },
                        { n: '10.3', at: '[data-patch-pin="10.3"]', label: 'A mention reads as the person it stands for, never the code', place: 'tr' },
                    ]} />}
                >
                    <div className="tk-mount">
                        <AutoOpen clicks={['.ft-table-row .ft-icon-btn[title="View Post"]']}>
                            <FeedTemplatesView />
                        </AutoOpen>
                    </div>
                </AdminFrame>
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
        { id: '11.1', what: 'Role · Designation on Your Team. The rail shows the designation already and calls it the role, so the role is what is added. Button when the viewer may change it, plain text otherwise.', where: 'Lobby → case → Your Team', file: 'src/views/LobbyView.jsx:482 .crp-member-role', roles: ['admin', 'staff', 'client'] },
        { id: '11.2', what: 'Same on phone.', where: 'Lobby → case → Your Team, ≤768px', file: 'src/views/LobbyView.jsx', roles: ['staff', 'client'] },
        { id: '11.3', what: 'Change Designation window: the role\'s designations, Save, Cancel.', where: 'New window', file: 'src/views/LobbyView.jsx', roles: ['admin', 'staff'] },
        { id: '11.4', what: 'Designation column in Edit Case\'s Assigned Users, between Role and the remove action.', where: 'Cases → Edit Case → Assigned Users', file: 'src/views/CasesView.jsx:288 .ccm-users-head', roles: ['admin', 'staff'] },
        { id: '11.5', what: 'Same designation select in Assign Users, which is a row inside Edit Case rather than a window.', where: 'Cases → Edit Case → Assign Users', file: 'src/views/CasesView.jsx:270 .ccm-assign-role-field', roles: ['admin', 'staff'] },
    ],
    capability: 'Whether 11.1 is a button is a permission, not a tier. Treat it as its own flag rather than inferring it from Admin.',
    screens: [
        {
            id: 'team', label: 'Your Team', roles: ['admin', 'staff', 'client'],
            note: 'The real right rail. On Today its second line is labelled role in the code and holds Lead Attorney, Case Manager, Paralegal, which are designations. So the designation is already there and the role is the part that is missing.',
            render: (role) => {
                const mayChange = role === 'admin' || role === 'staff';
                return (
                    <>
                        <CaseFrame
                            caseTitle="Rear-End Collision — Downtown LA" nav="Feed" height={700}
                            who={role === 'client' ? 'Alexandra Reyes' : role === 'staff' ? 'Marcus Bell' : 'Robert Grant'}
                            role={role === 'client' ? 'Client' : role === 'staff' ? 'Staff · Lead Attorney' : 'Administrator'}
                            aside={<CaseRightPanel collapsed={false} onToggle={() => {}} />}
                            patch={<Patch edits={TEAM_ROWS.map(([name, designation], i) => ({
                                at: `.crp-team-list .crp-team-member:nth-child(${i + 1}) .crp-member-role`,
                                mode: 'replace', pin: i === 0 ? '11.1' : undefined,
                                children: (
                                    <New className="is-block">
                                        <DesignationLabel
                                            role={name === 'Robert Grant' ? 'Admin' : 'Staff'}
                                            designation={designation}
                                            editable={mayChange}
                                            onEdit={() => {}}
                                        />
                                    </New>
                                ),
                            }))} />}
                            overlay={<PinLayer pins={[
                                {
                                    n: '11.1', at: '[data-patch-pin="11.1"]',
                                    label: mayChange ? 'A button, because this viewer may change it' : 'Plain text, never a disabled button',
                                    place: 'tr',
                                },
                            ]} />}
                        >
                            <div className="tk-mount"><FeedView /></div>
                        </CaseFrame>
                        <p className="tk-aside">
                            Whether it is a button is a permission of its own, not something to infer from being an
                            Admin. Everyone else gets plain text rather than a disabled button, because a rail of
                            disabled buttons reads as a broken screen.
                        </p>
                    </>
                );
            },
        },
        {
            id: 'team-phone', label: 'Your Team · phone', roles: ['staff', 'client'], phone: true,
            note: 'The real rail at phone width. Role and designation wrap under the name rather than squeezing onto one line.',
            render: (role) => (
                <Phone>
                    <CaseFrame
                        caseTitle="Rear-End Collision — Downtown LA" nav="Feed"
                        who={role === 'client' ? 'Alexandra Reyes' : 'Marcus Bell'}
                        role={role === 'client' ? 'Client' : 'Staff · Lead Attorney'}
                        aside={<CaseRightPanel collapsed={false} onToggle={() => {}} />}
                        patch={<Patch edits={TEAM_ROWS.map(([name, designation], i) => ({
                            at: `.crp-team-list .crp-team-member:nth-child(${i + 1}) .crp-member-role`,
                            mode: 'replace', pin: i === 0 ? '11.2' : undefined,
                            children: (
                                <New className="is-block">
                                    <DesignationLabel
                                        role={name === 'Robert Grant' ? 'Admin' : 'Staff'}
                                        designation={designation}
                                        editable={role === 'staff'}
                                        onEdit={() => {}}
                                    />
                                </New>
                            ),
                        }))} />}
                        overlay={<PinLayer pins={[
                            { n: '11.2', at: '[data-patch-pin="11.2"]', label: 'Same row, less width', place: 'tl' },
                        ]} />}
                    >
                        <div className="tk-mount"><FeedView /></div>
                    </CaseFrame>
                </Phone>
            ),
        },
        {
            id: 'change', label: 'Change Designation window', roles: ['admin', 'staff'],
            note: 'Opened from the rail, over the case it belongs to. The options follow the role on the row: staff designations for staff and for any custom role, client designations for clients.',
            render: () => (
                <CaseFrame
                    caseTitle="Rear-End Collision — Downtown LA" nav="Feed" height={720}
                    who="Marcus Bell" role="Staff · Lead Attorney"
                    aside={<CaseRightPanel collapsed={false} onToggle={() => {}} />}
                    modal={(
                        <Proposal>
                            <Modal title="Change designation" width={460} footer={<><Btn kind="link">Cancel</Btn><Btn kind="primary">Save</Btn></>}>
                                <p className="tk-lede">Marcus Bell · Staff on this case</p>
                                <Change n="11.3" block label="The role's designations only">
                                    <ModalField label="Designation" hint="Staff designations. A client on this case would see the client list instead.">
                                        <Select value="Lead Attorney" options={['Primary', 'Lead Attorney', 'Case Manager', 'Paralegal']} />
                                    </ModalField>
                                </Change>
                            </Modal>
                        </Proposal>
                    )}
                >
                    <div className="tk-mount"><FeedView /></div>
                </CaseFrame>
            ),
        },
        {
            id: 'editcase', label: 'Edit Case → members', roles: ['admin', 'staff'],
            note: 'The real Edit Case window. Assigned Users runs ID, Name, Email, Role, remove, with Role as a .ccm-role-select. Designation goes after it.',
            render: () => (
                <AdminFrame
                    nav="Cases" sub={null} title="Cases" breadcrumb="Cases" newBtn height={860}
                    patch={<Patch edits={[
                        {
                            at: '.ccm-users-head span:nth-child(4)', mode: 'after', as: 'span', pin: '11.4',
                            children: <New>Designation</New>,
                        },
                        ...[0, 1, 2].map(i => ({
                            at: `.ccm-users-table .ccm-users-row:nth-of-type(${i + 1}) .ccm-role-select`,
                            mode: 'after', as: 'span',
                            children: (
                                <New className="is-block">
                                    <Select
                                        value={i === 0 ? 'Lead Attorney' : 'Primary'}
                                        options={['Primary', 'Lead Attorney', 'Case Manager', 'Paralegal']}
                                        className="ccm-role-select"
                                    />
                                </New>
                            ),
                        })),
                    ]} />}
                    overlay={<PinLayer pins={[
                        { n: '11.4', at: '[data-patch-pin="11.4"]', label: 'Between Role and the remove action', place: 'tr' },
                    ]} />}
                >
                    <div className="tk-mount">
                        <AutoOpen clicks={['.cases-table-row .cases-icon-btn.edit']}>
                            <CasesView />
                        </AutoOpen>
                    </div>
                </AdminFrame>
            ),
        },
        {
            id: 'assign', label: 'Assign Users', roles: ['admin', 'staff'],
            note: 'Assign Users is the row that opens inside Edit Case, not a window of its own. It already has a Role select; Designation goes next to it.',
            render: () => (
                <AdminFrame
                    nav="Cases" sub={null} title="Cases" breadcrumb="Cases" newBtn height={860}
                    patch={<Patch edits={[
                        {
                            at: '.ccm-assign-role-field', mode: 'after', pin: '11.5',
                            children: (
                                <New className="is-block">
                                    <div className="ccm-assign-role-field">
                                        <label className="ccm-label">Designation</label>
                                        <Select value="Primary" options={['Primary', 'Lead Attorney', 'Case Manager', 'Paralegal']} />
                                    </div>
                                </New>
                            ),
                        },
                    ]} />}
                    overlay={<PinLayer pins={[
                        { n: '11.5', at: '[data-patch-pin="11.5"]', label: 'Defaults to Primary, so assigning never needs a second decision', place: 'tr' },
                    ]} />}
                >
                    <div className="tk-mount">
                        <AutoOpen clicks={['.cases-table-row .cases-icon-btn.edit', '.ccm-assign-btn']}>
                            <CasesView />
                        </AutoOpen>
                    </div>
                </AdminFrame>
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
        { id: '12.2', what: 'Counts render nothing rather than 0 when loading failed. They sit on the Open and Closed pills, not in the section header.', where: 'Lobby → .lobby-tab-count', file: 'src/views/LobbyView.jsx:1107', roles: ['client'] },
        { id: '12.3', what: 'Portal join window, based on the disabled-account window.', where: 'Before joining a portal', file: 'Not in this codebase', roles: ['client'], missing: true },
    ],
    screens: [
        {
            id: 'lobby', label: 'Lobby · a section that failed', roles: ['client'],
            note: 'The real Lobby. Four sections, each a .lobby-card, and the counts are on the Open and Closed pills rather than in the headers. On Today a section that fails shows the same .lobby-empty-msg a section with nothing in it shows.',
            render: () => (
                <>
                    <BareFrame
                        height={820}
                        patch={<Patch edits={[
                            {
                                at: '.lobby-card:nth-of-type(1) .lobby-cases-grid',
                                mode: 'replace', pin: '12.1', className: 'is-sized',
                                children: (
                                    <New className="is-block">
                                        <StateBlock
                                            tone="error"
                                            title="Your cases couldn't be loaded."
                                            message="Something went wrong at our end."
                                            actionLabel="Try again"
                                        />
                                    </New>
                                ),
                            },
                            /* The carousel dots belong to content that is not there. */
                            { at: '.lobby-card:nth-of-type(1) .lobby-location-dots', mode: 'replace', children: null },
                            {
                                at: '.lobby-card:nth-of-type(1) .lobby-tab-pill:nth-child(1) .lobby-tab-count',
                                mode: 'replace', as: 'span', pin: '12.2',
                                children: <New><span className="tk-nocount">—</span></New>,
                            },
                            {
                                at: '.lobby-card:nth-of-type(1) .lobby-tab-pill:nth-child(2) .lobby-tab-count',
                                mode: 'replace', as: 'span',
                                children: <New><span className="tk-nocount">—</span></New>,
                            },
                        ]} />}
                        overlay={<PinLayer pins={[
                            { n: '12.1', at: '[data-patch-pin="12.1"]', label: 'One state, reused by every section, only the noun changes', place: 'tl' },
                            { n: '12.2', at: '[data-patch-pin="12.2"]', label: 'Nothing rather than 0, because 0 is an answer', place: 'tr' },
                        ]} />}
                    >
                        <LobbyView onToggle={() => {}} onHubs={() => {}} />
                    </BareFrame>
                    <p className="tk-aside">
                        Announcements below it is untouched, which is the point: a section that loaded keeps its count
                        and its content. The ticket says six sections; this build has four, Cases, Announcements,
                        Inquiries and Locations, and the other two still need naming.
                    </p>
                </>
            ),
        },
        {
            id: 'join', label: 'Portal join window', roles: ['client'],
            note: 'The join step is not in this codebase, so this is a drawing, shown over the Lobby it leads into.',
            render: () => (
                <BareFrame
                    height={760}
                    modal={(
                        <Proposal>
                            <Modal title="Join this portal" width={500} footer={<><Btn kind="link">Use another account</Btn><Btn kind="primary">Join as a client</Btn></>}>
                                <Change n="12.3" block label="Based on the disabled-account window">
                                    <StateBlock
                                        tone="empty"
                                        title="You're signed in as alexandra@example.com, which isn't a member of this portal yet."
                                        message="Join as a client to see your cases here, or sign in with the account the firm invited."
                                    />
                                </Change>
                            </Modal>
                        </Proposal>
                    )}
                >
                    <LobbyView onToggle={() => {}} onHubs={() => {}} />
                </BareFrame>
            ),
        },
    ],
};

export const TICKETS = [t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12];

