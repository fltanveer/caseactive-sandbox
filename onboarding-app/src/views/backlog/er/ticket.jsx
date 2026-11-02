/* ER-1 · Design Page not found, Access denied and the error pop-ups.

   These appear in every app. Same rules as CW-1, AP-1 and AC-1: keep every
   feature, state and message, and raise anything added or dropped on the
   ticket's thread. */

import { NotFoundApp, NotFoundAdmin, DeniedApp, DeniedAdmin, Join, Popup, ReadOnly, Notices } from './screens';
import './er.css';

export const ER_TICKET = {
    no: 20,
    key: 'ER-1',
    ticketName: 'Design Page not found, Access denied and the error pop-ups',
    domain: 'ca-account, ca-manage, ca-app',
    status: 'To Do',
    severity: 'Medium',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0CDYC6R2JE',
    title: 'Not found, access denied and errors',
    roles: ['client', 'staff', 'admin'],
    brief: [
        'Use the sandbox\'s look. Keep every feature, state and message the screen has today. If you would add or drop something, say so in this ticket\'s thread so Welby can decide.',
        'Page not found: today only the heading "Page Not Found 404". Add a way back, such as Go to the Lobby. The case workspace and the Admin Panel show it; on the account site a wrong address goes to Hubs.',
        'Access denied: in the case workspace "You don\'t have access to this case." with a picture and Close, also when someone is removed from a case; the same window, text only, for a disabled account, a wrong user type and a broken sign-in session, all titled "Access Denied" today, so give each a fitting title. In the Admin Panel "You do not have access to this account"; a Client gets "The Admin Panel is only for this hub\'s Admins and Managers." with Go to the Lobby. "Join this portal?": Join as a client or Use another account, and a longer explanation when joining isn\'t allowed.',
        'Error pop-ups: the server error ("Oops, Something went wrong." with a picture and Close); app out of date ("Press refresh" with Refresh and Later); Admin Panel billing ("Please enter valid payment information" with Add Payment); the read-only hub banner; and the corner notices (one line, gone after 3 seconds, with an X, no icons today) in success, error and in-progress versions.',
    ],
    alsoKnown: 'These replace MS-1\'s first drafts of Page not found, Access denied and the error pop-up. The live server error only appears when the server fails, so its current look is to be checked against Welby\'s screenshot. The corner notices use the app\'s Toast component, which already has success and error tones with icons; in-progress is drawn here.',
    decision: 'Every message keeps its meaning and its button; what changes is the title, which now says what happened instead of "Access Denied", and a way forward wherever there wasn\'t one. Page not found keeps the app\'s top bar or menu, shows the address that failed so a typo can be spotted, and offers Go to the Lobby or Go to the Dashboard. The two case reasons keep their picture; the account reasons stay text only, as today. The Admin Panel\'s no-access states are a page, not a window, since there is nothing behind them to go back to. The read-only banner is amber, sits above the page rather than over it, and offers Renew only to an Admin. Corner notices get the Toast\'s icons and colours: success and error close themselves after 3 seconds and have an X; in-progress has a spinner and stays until the work ends, then turns into success or error. Added, for Welby to approve: Sign in again on the expired-session window; "Use another account" on the Admin Panel no-access page; the failed address shown on Page not found; Renew subscription on the banner for Admins.',
    items: [
        { id: '20.1', what: 'Page not found in the case workspace and the Admin Panel, desktop and phone: picture, 404, the address that failed, Go to the Lobby or Go to the Dashboard.', where: 'Any wrong address', file: 'Not in this codebase (ca-app, ca-manage routers)', roles: ['client', 'staff', 'admin'], missing: true },
        { id: '20.2', what: 'Access denied window in the case workspace, titled by reason: not on the case, removed from it, account turned off, wrong account type, sign-in expired.', where: 'Open a case you\'re not a member of', file: 'Not in this codebase (ca-app)', roles: ['client', 'staff'], missing: true },
        { id: '20.3', what: 'Admin Panel no access: "You do not have access to this account" with Use another account; a Client\'s version with Go to the Lobby.', where: 'Open the Admin Panel without access', file: 'Not in this codebase (ca-manage)', roles: ['client', 'staff'], missing: true },
        { id: '20.4', what: 'Join this portal?: Join as a client or Use another account; the longer version when joining isn\'t allowed.', where: 'Sign in with an account that isn\'t a member', file: 'Not in this codebase (ca-app)', roles: ['client'], missing: true },
        { id: '20.5', what: 'Server error, app out of date and billing windows.', where: 'Everywhere; billing in the Admin Panel', file: 'Not in this codebase (app shells)', roles: ['client', 'staff', 'admin'], missing: true },
        { id: '20.6', what: 'Read-only hub banner, with Renew for Admins.', where: 'Top of every page while the subscription has ended', file: 'Not in this codebase (app shells)', roles: ['client', 'staff', 'admin'], missing: true },
        { id: '20.7', what: 'Corner notices: success, error and in-progress, with icons and an X.', where: 'Top right, any page', file: 'src/components/Toast.jsx', roles: ['client', 'staff', 'admin'] },
    ],
    screens: [
        { id: 'not-found', label: 'Page not found · case workspace', roles: ['client', 'staff'],
            note: 'The Lobby\'s top bar stays. Today: only the heading.',
            render: () => <NotFoundApp key="not-found" /> },
        { id: 'not-found-admin', label: 'Page not found · Admin Panel', roles: ['staff', 'admin'], render: () => <NotFoundAdmin key="not-found-admin" /> },
        { id: 'not-found-phone', label: 'Page not found · phone', roles: ['client', 'staff'], phone: true, render: () => <NotFoundApp key="not-found-phone" phone /> },
        { id: 'not-found-admin-phone', label: 'Page not found · Admin Panel · phone', roles: ['staff', 'admin'], phone: true, render: () => <NotFoundAdmin key="not-found-admin-phone" phone /> },

        { id: 'denied', label: 'Access denied · not on the case', roles: ['client', 'staff'], render: () => <DeniedApp key="denied" /> },
        { id: 'denied-removed', label: 'Access denied · removed', roles: ['client', 'staff'], render: () => <DeniedApp key="denied-removed" reason="removed" /> },
        { id: 'denied-disabled', label: 'Access denied · account turned off', roles: ['client', 'staff'], render: () => <DeniedApp key="denied-disabled" reason="disabled" /> },
        { id: 'denied-type', label: 'Access denied · wrong account type', roles: ['client', 'staff'], render: () => <DeniedApp key="denied-type" reason="wrongType" /> },
        { id: 'denied-session', label: 'Access denied · sign-in expired', roles: ['client', 'staff'], render: () => <DeniedApp key="denied-session" reason="session" /> },
        { id: 'denied-phone', label: 'Access denied · phone', roles: ['client', 'staff'], phone: true, render: () => <DeniedApp key="denied-phone" phone /> },
        { id: 'denied-admin', label: 'Admin Panel · no access', roles: ['staff'], render: () => <DeniedAdmin key="denied-admin" /> },
        { id: 'denied-admin-client', label: 'Admin Panel · a Client', roles: ['client'], render: () => <DeniedAdmin key="denied-admin-client" client /> },

        { id: 'join', label: 'Join this portal?', roles: ['client'], render: () => <Join key="join" /> },
        { id: 'join-not-allowed', label: 'Join this portal? · not allowed', roles: ['client'], render: () => <Join key="join-not-allowed" allowed={false} /> },

        { id: 'server-error', label: 'Server error', roles: ['staff', 'admin'],
            note: 'Ask Welby for a screenshot of today\'s window to compare.',
            render: () => <Popup key="server-error" /> },
        { id: 'server-error-app', label: 'Server error · case workspace', roles: ['client', 'staff'], render: () => <Popup key="server-error-app" where="app" /> },
        { id: 'out-of-date', label: 'App out of date', roles: ['client', 'staff', 'admin'], render: () => <Popup key="out-of-date" kind="outdated" /> },
        { id: 'billing', label: 'Billing', roles: ['admin'], render: () => <Popup key="billing" kind="billing" /> },
        { id: 'read-only', label: 'Read-only banner · Admin', roles: ['admin'], render: () => <ReadOnly key="read-only" /> },
        { id: 'read-only-app', label: 'Read-only banner · case workspace', roles: ['client', 'staff'], render: () => <ReadOnly key="read-only-app" where="app" /> },
        { id: 'read-only-phone', label: 'Read-only banner · phone', roles: ['admin'], phone: true, render: () => <ReadOnly key="read-only-phone" phone /> },

        { id: 'notices', label: 'Corner notices', roles: ['client', 'staff', 'admin'],
            note: 'Success, error and in-progress, stacked to show all three. Each one closes with its X. Today is drawn from the brief: one line and an X, no icon.',
            render: () => <Notices key="notices" /> },
        { id: 'notices-phone', label: 'Corner notices · phone', roles: ['client', 'staff', 'admin'], phone: true, render: () => <Notices key="notices-phone" phone /> },
    ],
};
