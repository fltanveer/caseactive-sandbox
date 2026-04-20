export const DEMO_ACCOUNTS = {
    'admin@demo.com': {
        role: 'admin',
        otp: '123456',
        prefill: {
            fullName: 'Jordan Admin',
            firmName: 'Demo Law Firm',
            teamSize: '6-15',
            portalName: 'Demo Law Portal',
        },
    },
    'staff@demo.com': {
        role: 'staff',
        otp: '123456',
        prefill: {
            fullName: 'Casey Staff',
            firmName: 'Demo Law Firm',
            staffRole: 'Paralegal',
        },
    },
    'client@demo.com': {
        role: 'client',
        otp: '123456',
        prefill: {
            fullName: 'Alex Demo',
            firmName: 'Demo Law Firm',
            caseName: 'Johnson v. City Transit',
        },
    },
};

export const isDemoEmail = (email) => !!DEMO_ACCOUNTS[email?.toLowerCase()];
