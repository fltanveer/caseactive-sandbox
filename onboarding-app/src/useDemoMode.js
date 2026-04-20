import { useState, useCallback } from 'react';
import { DEMO_ACCOUNTS } from './demoData';

export const useDemoMode = () => {
    const [demoState, setDemoState] = useState(null);

    const activateDemo = useCallback((email) => {
        const account = DEMO_ACCOUNTS[email?.toLowerCase()];
        if (!account) return false;
        setDemoState({ email: email.toLowerCase(), role: account.role, prefill: account.prefill });
        return true;
    }, []);

    const exitDemo = useCallback(() => {
        setDemoState(null);
    }, []);

    return {
        isDemoActive: !!demoState,
        demoRole: demoState?.role ?? null,
        demoEmail: demoState?.email ?? null,
        demoPrefill: demoState?.prefill ?? null,
        activateDemo,
        exitDemo,
    };
};
