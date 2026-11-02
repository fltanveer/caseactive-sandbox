/* MS-1 · Missing screens, now an index.

   Webly listed every screen with no new design. The first pass drew them
   all here; each group then got its own ticket with the full brief from
   Slack (CW-1, AP-1, AC-1, ER-1), so this record only points to them. */

export const MS_TICKET = {
    no: 16,
    key: 'MS-1',
    ticketName: 'Missing screens: every screen Webly couldn\'t find a design for',
    domain: 'ca-app, ca-manage, ca-account',
    status: 'In Review',
    severity: 'Medium',
    title: 'Missing screens (index)',
    roles: ['client', 'staff', 'admin'],
    brief: [
        'Case workspace: filling in a form, signing an e-sign, paying an invoice, event details, the intake form on sign-up, and the signed copy. Designed on CW-1.',
        'Admin Panel: a user\'s intake forms and signed copy, Time Zone and Translation, and the template editor. Designed on AP-1.',
        'Account site: Hub Settings, Domains, single sign-on and Unsubscribe. Designed on AC-1.',
        'Everywhere: Page not found, Access denied and the error pop-ups. Designed on ER-1.',
    ],
    alsoKnown: 'This was the first pass at Webly\'s list. Each group now has its own ticket with the full brief from Slack, so this one only points to them.',
    items: [],
    screens: [],
};
