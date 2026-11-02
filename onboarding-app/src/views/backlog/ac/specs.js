/* Build notes for AC-1, keyed by item id. Same fields as ../specs.js. */

export const AC_SPECS = {
    '19.1': {
        why: 'One window, and only the tabs the person has. An empty tab they can\'t use costs a click and a question.',
        rules: ['Tabs: Info, Notifications (while the hub has access), Permissions (not for a hub Admin), Calendar (not for a Client).', 'Each tab saves on its own; Close leaves.', 'On a phone the window fills the screen and the tabs scroll sideways.'],
        done: 'Each role sees exactly its tabs, on computer and phone.',
    },
    '19.2': { copy: ['Company ID', 'Company name', 'Website'], done: 'Info shows the three details, read-only.' },
    '19.3': {
        today: 'Notifications has no loader, so the boxes show unticked until they load, and a failed load looks the same.',
        states: [['Loading', 'Shimmering rows.'], ['Couldn\'t load', 'Error notice, Try again, no checkboxes.'], ['Saved', '"Saved" beside Save.']],
        copy: ['Email me when {hub} adds or changes:', 'Posts', 'Forms', 'Signatures', 'Invoices', 'Events', 'Tasks', 'Save', 'Saved', 'Your notification settings couldn\'t be loaded', 'Nothing has changed. Try again in a moment.'],
        done: 'Loading and failure are distinguishable from settings that are off.',
    },
    '19.4': {
        why: 'Removing access is reversible, so one confirmation is enough, and both the confirmation and the result say the hub keeps what it already has.',
        copy: ['What {hub} can see of your information:', 'Remove Access', 'Remove {hub}\'s access?', 'They keep your information as it is now and get no changes to it until you approve access again. You can do that from this tab at any time.', 'Keep access', 'You removed {hub}\'s access', 'Approve Access'],
        rules: ['Staff and Managers only. A Client sees 19.11 instead.', 'After removing, Notifications is hidden until access is approved.', 'Open question for the thread: the exact list of what a hub can see.'],
        done: 'Remove Access asks once, then shows the removed state with Approve Access.',
    },
    '19.11': {
        why: 'A Client can\'t remove or approve a hub\'s access; the firm manages it. What they can do is stop the hub\'s emails, so that is their action, and the list of what the hub sees stays visible and read-only.',
        copy: ['{hub} manages access to your information. Contact them to change it.', 'Unsubscribe', 'Stop getting emails from {hub}. You can still see everything here.', 'Unsubscribe from {hub}\'s emails?', 'Keep emails', 'You\'re unsubscribed from {hub}\'s emails', 'Go to Notifications'],
        rules: ['No Remove Access or Approve Access for a Client.', 'Unsubscribing turns off all six Notifications boxes; ticking any of them turns emails back on.', 'Open question for the thread: does a Client\'s Unsubscribe stop every email, or only the six notification kinds?'],
        done: 'A Client\'s tab shows what the hub sees, with Unsubscribe and its result, and never access controls.',
    },
    '19.5': {
        states: [['Not connected', 'Connect Calendar.'], ['Connected', 'The account, Connected, Disconnect.'], ['No calendar', 'Save pressed with none ticked: red box and "Choose at least one calendar."'], ['Bad hours', 'A day whose Until is not after From turns red with "Until must be later than From."']],
        copy: ['Connect Calendar', 'Disconnect', 'Calendars used for your availability', 'Hours', 'Unavailable', 'Holidays', 'Add date', 'Choose at least one calendar.', 'Until must be later than From.'],
        rules: ['An unticked day reads Unavailable instead of empty times.'],
        done: 'Every calendar state exists with its message.',
    },
    '19.6': {
        today: 'Couldn\'t load looks the same as having no domains, and Copy opens a browser alert.',
        states: [['Loading', 'Shimmering rows.'], ['None', '"No domains yet" with New domain.'], ['Couldn\'t load', 'Its own error with Try again, and a line saying it isn\'t the same as having none.'], ['Switch unavailable', 'Off, greyed, "Upload SAML metadata first" under it.'], ['Delete', 'Shared delete window.'], ['Switch off', '"Turn off single sign-on?" with Keep it on and Turn off.'], ['Copied', 'The Copy button reads "Copied" for a moment.']],
        rules: ['Open question for the thread: what Reset does, so its confirmation can say it.'],
        done: 'Every list state is distinct and none uses a browser alert.',
    },
    '19.7': {
        copy: ['New domain', 'Hub', 'Only Enterprise hubs are listed.', 'Domain', 'The part after @ in your team\'s email addresses.', 'Enter the domain on its own, like yourfirm.com.', 'Only Enterprise hubs can add a domain. None of your hubs is on Enterprise.', 'Add'],
        done: 'Only Enterprise hubs can be picked, and a bad domain says how to fix it.',
    },
    '19.8': {
        today: 'The edit page has no title.',
        copy: ['Allow manual sign-in', 'Emails left out of single sign-on', 'Hub', 'SAML metadata', 'Upload the metadata file from your identity provider', 'We couldn\'t read "{file}". Upload the XML metadata file your identity provider gives you.', 'Single sign-on can be switched on once this is uploaded.'],
        done: 'The page is titled with the domain and handles an unreadable file.',
    },
    '19.9': {
        today: 'The error page has no way back.',
        copy: ['Redirecting to your identity provider…', 'Single sign-on is switched off for {domain}', 'Single sign-on needs the Enterprise plan', 'Back to sign in'],
        done: 'Both pages exist and the error always offers Back to sign in.',
    },
    '19.10': {
        today: 'Nothing is sent until a reason is submitted, though the page already says the person is unsubscribed.',
        why: 'The page says "you will no longer get this email", so that should already be true when it opens. The reason becomes optional feedback.',
        states: [['Unsubscribed', 'On open; reasons optional; Submit sends only the reason.'], ['Thank you', 'After Submit.'], ['Error', 'The unsubscribe itself failed: says they still get the emails, Try again.'], ['Broken link', 'Old or cut-off link: how to turn emails off after signing in.']],
        rules: ['For Welby on the thread: approve unsubscribing on open.'],
        done: 'All four states exist on computer and phone.',
    },
};
