/* Build notes for ER-1, keyed by item id. Same fields as ../specs.js. */

export const ER_SPECS = {
    '20.1': {
        today: 'Only the heading "Page Not Found 404": no picture, link or button.',
        why: 'Someone who lands on a wrong address needs to know it isn\'t their fault and how to carry on. Showing the address lets them spot a typo.',
        anatomy: ['Picture', '404, small', 'Page not found', 'One line on why', 'The address that failed', 'Go to the Lobby (case workspace) or Go to the Dashboard (Admin Panel)'],
        rules: ['The app\'s top bar or menu stays, so it is also a way out.', 'The account site keeps sending wrong addresses to Hubs.'],
        done: 'Both apps show it with a way back, on computer and phone.',
    },
    '20.2': {
        today: 'One window titled "Access Denied" for every reason.',
        states: [
            ['Not on the case', '"You don\'t have access to this case", picture, Close.'],
            ['Removed', '"You were removed from this case", picture, Close.'],
            ['Account turned off', '"Your account is turned off", text only, Close.'],
            ['Wrong account type', '"This account can\'t open this page", text only, Close.'],
            ['Sign-in expired', '"Your sign-in has expired", text only, Close and Sign in again.'],
        ],
        rules: ['Open question for the thread: the exact wrong-type case (which account, which page) so the line can name both.'],
        done: 'Each reason has its own title and keeps Close.',
    },
    '20.3': {
        copy: ['You do not have access to this account', 'Use another account', 'The Admin Panel is only for this hub\'s Admins and Managers', 'Your cases, documents and messages are in the Lobby.', 'Go to the Lobby'],
        done: 'Both versions exist, each with one way forward.',
    },
    '20.4': {
        copy: ['Join this portal?', 'You\'re signed in as {email}, which isn\'t part of {firm}\'s portal yet.', 'Join as a client', 'Use another account', '{firm} only adds people by invitation, so this account can\'t join on its own.'],
        rules: ['When joining isn\'t allowed, Use another account becomes the main button.'],
        done: 'Both versions exist on computer and phone.',
    },
    '20.5': {
        states: [['Server error', '"Something went wrong", that it\'s on our side, Close.'], ['Out of date', '"A new version of CaseActive is ready", Later and Refresh.'], ['Billing', '"Add a payment method", Add Payment.']],
        rules: ['Check the server error against Welby\'s screenshot before building.'],
        done: 'All three windows exist in the new look.',
    },
    '20.6': {
        why: 'Amber, not red: nothing is lost. It sits above the page so nothing is covered.',
        copy: ['This hub is read-only because its subscription ended on {date}.', 'Renew it to make changes again. Everything is still here.', 'You can still see everything. Ask an Admin to renew it.', 'Renew subscription'],
        done: 'The banner shows on every page while it applies, with Renew for Admins only.',
    },
    '20.7': {
        today: 'One line, gone after 3 seconds, with an X, and no icons.',
        states: [['Success', 'Green, check icon, closes after 3 seconds.'], ['Error', 'Red, alert icon, closes after 3 seconds.'], ['In progress', 'Spinner, no X, stays until the work ends, then becomes success or error.']],
        rules: ['Uses src/components/Toast.jsx; set duration to 3000 for these.', 'Top right on a computer. On a phone they sit along the bottom, 16px up and 12px in from each side, newest nearest the edge, sliding up into place.'],
        done: 'All three versions exist with icons.',
    },
};
