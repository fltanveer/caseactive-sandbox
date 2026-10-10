/* The two axes, written down once.

   Admin and Manager are account tiers: host_user_type on manage/whoami.
   Staff and Client are case roles, each carrying a designation. A person is
   one of the first pair and, separately, one of the second on each case. */

export const ROLE_LABEL = {
    admin: 'Admin',
    manager: 'Manager',
    staff: 'Staff',
    client: 'Client',
};

export const ROLE_NOTE = {
    admin: 'Account tier admin (host_user_type). Changes hub settings, and usually works cases too.',
    manager: 'Account tier manager. Sees hub settings but cannot change them.',
    staff: 'Case role. Works cases and carries a designation. No hub settings access.',
    client: 'Case role. Sees the lobby and their own cases only.',
};
