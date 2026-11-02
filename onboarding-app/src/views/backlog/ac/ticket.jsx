/* AC-1 · Design the missing account site screens: Hub Settings, Domains,
   single sign-on, unsubscribe.

   ca-account is not in this codebase, so every screen draws on
   AccountShell or a bare page. Same rules as CW-1 and AP-1: keep every
   feature, state and message, and raise anything added or dropped on the
   ticket's thread. */

import { HubSettings } from './hub';
import { DomainsList, DomainEdit } from './domains';
import { Sso, Unsubscribe } from './auth';
import './ac.css';

const hub = (key, props = {}) => (role) => <HubSettings key={`${key}-${role}`} role={role} {...props} />;

export const AC_TICKET = {
    no: 19,
    key: 'AC-1',
    ticketName: 'Design the missing account site screens: Hub Settings, Domains, single sign-on, unsubscribe',
    domain: 'ca-account',
    status: 'To Do',
    severity: 'Medium',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0CDSAVTGKV',
    title: 'Account site screens',
    roles: ['staff', 'manager', 'admin', 'client'],
    brief: [
        'Use the sandbox\'s look. Keep every feature, state and message the screen has today. If you would add or drop something, say so in this ticket\'s thread so Welby can decide.',
        'Hub Settings: Info (Company ID, name, website); Notifications (Posts, Forms, Signatures, Invoices, Events, Tasks, Save; only while the hub has access); Permissions (what the hub can see, Remove Access with a confirmation, then "You removed {hub}\'s access" with Approve Access); Calendar (Connect Calendar or the account with Disconnect, calendars for availability, From and Until per weekday, holidays, Save). A hub Admin has no Permissions tab, a Client has no Calendar tab, Managers and Staff see all four. States: loading, notifications couldn\'t load, "Choose at least one calendar", "Until must be later than From", connected, disconnected.',
        'Domains: Active and Pending, New, and a table of domain, TXT value with copy, hub, a single sign-on switch, Edit, Reset, Delete. The new domain window. The edit page: manual sign-in, emails left out, hub, SAML metadata upload; it has no title today. States: loading, none, couldn\'t load (looks like none today), switch off until metadata is uploaded with the reason, delete and switch-off confirmations, unreadable file, copied (a browser alert today). Only Enterprise hubs can add a domain.',
        'Single sign-on: "Redirecting to your identity provider…", and an error with the reason, with Back to sign in.',
        'Unsubscribe: the hub\'s name, "You will no longer get this kind of email from {hub}", how to turn it back on, reasons, Submit and Return. States: choosing, thank you, error, broken or expired link. Today nothing is sent until a reason is submitted; say on the thread how it should work.',
    ],
    alsoKnown: 'These replace MS-1\'s first drafts of the same four. HF-72 item 6.2 drew a removed hub\'s Permissions tab on the sandbox\'s own hub window; this ticket\'s brief gives the live window\'s wording, "You removed {hub}\'s access" with Approve Access, so that is what is drawn here. The Hubs list behind the window is the sandbox\'s HubsPage.',
    decision: 'The Settings window keeps its four tabs and shows only the ones the person has, so a Client never meets an empty Calendar tab. Each tab saves on its own, with Save at its end and "Saved" beside it. Notifications gets a loader and a separate couldn\'t-load error, so a failure no longer looks like every box unticked. Remove Access (Staff and Managers only) asks once and says the hub keeps what it has; a Client can\'t remove or approve access, so their tab is read-only with Unsubscribe from the hub\'s emails instead; afterwards the tab says so and has Approve Access, and Notifications disappears because the hub has no access. The single sign-on switch stays visible but off until metadata is uploaded, with the reason under it. Couldn\'t load and no domains are now different states. "Copied" replaces the browser alert, in place on the button. The edit page is titled with the domain. Unsubscribe is drawn as proposed for the thread: the person is unsubscribed as the page opens, as it already says, and the reason is optional feedback; Submit only sends the reason. Added, for Welby to approve: a hint under each new-domain field; a description line under each thing the hub can see; "Return" and "Try again" on the unsubscribe error.',
    items: [
        { id: '19.1', what: 'Hub Settings window: the four tabs, shown by role (no Permissions for a hub Admin, no Calendar for a Client).', where: 'Account site → Hubs → a hub → Settings', file: 'Not in this codebase (ca-account)', roles: ['staff', 'manager', 'admin', 'client'], missing: true },
        { id: '19.2', what: 'Info: Company ID, name and website.', where: 'Settings → Info', file: 'Not in this codebase (ca-account)', roles: ['staff', 'manager', 'admin', 'client'], missing: true },
        { id: '19.3', what: 'Notifications: six checkboxes and Save; loading; couldn\'t load; saved.', where: 'Settings → Notifications', file: 'Not in this codebase (ca-account)', roles: ['staff', 'manager', 'admin', 'client'], missing: true },
        { id: '19.4', what: 'Permissions: what the hub can see; Remove Access with a confirmation; the access-removed state with Approve Access. Staff and Managers only.', where: 'Settings → Permissions', file: 'Not in this codebase (ca-account)', roles: ['staff', 'manager'], missing: true },
        { id: '19.11', what: 'A Client\'s Permissions: what the hub can see, read-only, and Unsubscribe from the hub\'s emails with a confirmation, instead of Remove or Approve Access.', where: 'Settings → Permissions, as a Client', file: 'Not in this codebase (ca-account)', roles: ['client'], missing: true },
        { id: '19.5', what: 'Calendar: Connect Calendar; connected with Disconnect; calendars for availability; From and Until per weekday; holidays; Save; "Choose at least one calendar" and "Until must be later than From".', where: 'Settings → Calendar', file: 'Not in this codebase (ca-account)', roles: ['staff', 'manager', 'admin'], missing: true },
        { id: '19.6', what: 'Domains list: Active and Pending, New, the table with copy, the single sign-on switch and its reason, Edit, Reset, Delete; loading, none, couldn\'t load; delete and switch-off confirmations; Copied.', where: 'Account site → footer → Domains', file: 'Not in this codebase (ca-account)', roles: ['admin'], missing: true },
        { id: '19.7', what: 'New domain window: hub and domain, Add; Enterprise hubs only.', where: 'Domains → NEW', file: 'Not in this codebase (ca-account)', roles: ['admin'], missing: true },
        { id: '19.8', what: 'Edit domain page, titled: manual sign-in, emails left out, hub, SAML metadata upload; unreadable file.', where: 'Domains → Edit', file: 'Not in this codebase (ca-account)', roles: ['admin'], missing: true },
        { id: '19.9', what: 'Single sign-on: redirecting, and the error with its reason and Back to sign in.', where: 'Sign in with an SSO domain', file: 'Not in this codebase (ca-account)', roles: ['staff', 'admin'], missing: true },
        { id: '19.10', what: 'Unsubscribe: unsubscribed on open, how to turn it back on, an optional reason with Submit and Return; thank you; error; broken link.', where: 'Any notification email → Unsubscribe', file: 'Not in this codebase (ca-account)', roles: ['client'], missing: true },
    ],
    screens: [
        /* ── Hub Settings ── */
        { id: 'info', label: 'Settings → Info', roles: ['staff', 'manager', 'admin', 'client'],
            note: 'Switch the role to see which tabs each person gets: Staff and Manager all four, a hub Admin no Permissions, a Client no Calendar.',
            render: hub('info', { tab: 'Info' }) },
        { id: 'notifications', label: 'Settings → Notifications', roles: ['staff', 'manager', 'admin', 'client'], render: hub('notifications', { tab: 'Notifications' }) },
        { id: 'notifications-loading', label: 'Notifications · loading', roles: ['staff'], render: hub('notifications-loading', { tab: 'Notifications', notif: 'loading' }) },
        { id: 'notifications-failed', label: 'Notifications · couldn\'t load', roles: ['staff'], render: hub('notifications-failed', { tab: 'Notifications', notif: 'failed' }) },
        { id: 'permissions', label: 'Settings → Permissions', roles: ['staff', 'manager', 'client'],
            note: 'Staff and Managers: Remove Access asks once, then the tab turns into the access-removed state and Notifications goes away. As a Client the list is read-only and the action is Unsubscribe.',
            render: hub('permissions', { tab: 'Permissions' }) },
        { id: 'permissions-removed', label: 'Permissions · access removed', roles: ['staff', 'manager'], render: hub('permissions-removed', { tab: 'Permissions', removed: true }) },
        { id: 'permissions-unsubscribed', label: 'Permissions · Client unsubscribed', roles: ['client'], render: hub('permissions-unsubscribed', { tab: 'Permissions', unsubscribed: true }) },
        { id: 'calendar', label: 'Settings → Calendar', roles: ['staff', 'manager', 'admin'], render: hub('calendar', { tab: 'Calendar' }) },
        { id: 'calendar-disconnected', label: 'Calendar · not connected', roles: ['staff', 'manager', 'admin'], render: hub('calendar-disconnected', { tab: 'Calendar', cal: 'disconnected' }) },
        { id: 'calendar-no-calendar', label: 'Calendar · no calendar chosen', roles: ['staff'], render: hub('calendar-no-calendar', { tab: 'Calendar', cal: 'noCalendar' }) },
        { id: 'calendar-bad-hours', label: 'Calendar · Until before From', roles: ['staff'], render: hub('calendar-bad-hours', { tab: 'Calendar', cal: 'badHours' }) },
        { id: 'settings-phone', label: 'Settings · phone', roles: ['staff', 'manager', 'admin', 'client'], phone: true,
            note: 'The window fills the screen and the tabs scroll sideways.',
            render: hub('settings-phone', { tab: 'Info', phone: true }) },
        { id: 'calendar-phone', label: 'Calendar · phone', roles: ['staff', 'manager', 'admin'], phone: true, render: hub('calendar-phone', { tab: 'Calendar', phone: true }) },

        /* ── Domains ── */
        { id: 'domains', label: 'Domains', roles: ['admin'],
            note: 'Copy shows "Copied" on the button. The second domain\'s single sign-on switch is off until its metadata is uploaded, and says so.',
            render: () => <DomainsList key="domains" /> },
        { id: 'domains-pending', label: 'Domains · Pending', roles: ['admin'], render: () => <DomainsList key="domains-pending" tab="Pending" /> },
        { id: 'domains-loading', label: 'Domains · loading', roles: ['admin'], render: () => <DomainsList key="domains-loading" state="loading" /> },
        { id: 'domains-empty', label: 'Domains · none', roles: ['admin'], render: () => <DomainsList key="domains-empty" state="empty" /> },
        { id: 'domains-failed', label: 'Domains · couldn\'t load', roles: ['admin'], render: () => <DomainsList key="domains-failed" state="failed" /> },
        { id: 'domains-delete', label: 'Domains · delete', roles: ['admin'], render: () => <DomainsList key="domains-delete" dialog="delete" /> },
        { id: 'domains-switch-off', label: 'Domains · switch off', roles: ['admin'], render: () => <DomainsList key="domains-switch-off" dialog="switchOff" /> },
        { id: 'domains-new', label: 'New domain', roles: ['admin'], render: () => <DomainsList key="domains-new" dialog="new" /> },
        { id: 'domains-new-error', label: 'New domain · not a domain', roles: ['admin'], render: () => <DomainsList key="domains-new-error" dialog="newError" /> },
        { id: 'domains-not-enterprise', label: 'New domain · not Enterprise', roles: ['admin'], render: () => <DomainsList key="domains-not-enterprise" dialog="notEnterprise" /> },
        { id: 'domain-edit', label: 'Edit domain', roles: ['admin'], render: () => <DomainEdit key="domain-edit" /> },
        { id: 'domain-edit-uploaded', label: 'Edit domain · metadata uploaded', roles: ['admin'], render: () => <DomainEdit key="domain-edit-uploaded" state="uploaded" /> },
        { id: 'domain-edit-unreadable', label: 'Edit domain · unreadable file', roles: ['admin'], render: () => <DomainEdit key="domain-edit-unreadable" state="unreadable" /> },
        { id: 'domains-phone', label: 'Domains · phone', roles: ['admin'], phone: true, render: () => <DomainsList key="domains-phone" phone /> },
        { id: 'domain-edit-phone', label: 'Edit domain · phone', roles: ['admin'], phone: true, render: () => <DomainEdit key="domain-edit-phone" phone /> },

        /* ── Single sign-on ── */
        { id: 'sso', label: 'Single sign-on · redirecting', roles: ['staff', 'admin'], render: () => <Sso key="sso" state="redirecting" /> },
        { id: 'sso-off', label: 'Single sign-on · switched off', roles: ['staff', 'admin'], render: () => <Sso key="sso-off" state="off" /> },
        { id: 'sso-plan', label: 'Single sign-on · not Enterprise', roles: ['staff', 'admin'], render: () => <Sso key="sso-plan" state="plan" /> },

        /* ── Unsubscribe ── */
        { id: 'unsubscribe', label: 'Unsubscribe', roles: ['client'],
            note: 'Drawn as proposed: unsubscribed as the page opens. Pick a reason and Submit for the thank-you.',
            render: () => <Unsubscribe key="unsubscribe" /> },
        { id: 'unsubscribe-thanks', label: 'Unsubscribe · thank you', roles: ['client'], render: () => <Unsubscribe key="unsubscribe-thanks" state="thanks" /> },
        { id: 'unsubscribe-error', label: 'Unsubscribe · error', roles: ['client'], render: () => <Unsubscribe key="unsubscribe-error" state="error" /> },
        { id: 'unsubscribe-broken', label: 'Unsubscribe · broken link', roles: ['client'], render: () => <Unsubscribe key="unsubscribe-broken" state="broken" /> },
    ],
};

