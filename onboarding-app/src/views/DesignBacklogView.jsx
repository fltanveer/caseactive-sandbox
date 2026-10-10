import { useEffect } from 'react';
import InfoBanner from '../components/InfoBanner';
import DevInspector from '../DevInspector';
import Browser from './backlog/Browser';
import './DesignBacklogView.css';

/* Design backlog — the October 2026 tickets, designed as states you can look
   at rather than conditions you have to reproduce in the running app.

   One view only. There were three for a while: a pattern gallery and a
   Manager journey alongside this. Both were written before the tickets had
   their real HF numbers, so they showed the same designs under a second,
   invented numbering, which is the one thing a reference page must not do.
   The patterns they documented are visible in context on the screens, and
   every change's build notes name the component it uses. */

const DesignBacklogView = ({ standalone = false }) => {
    /* index.css centres the body with flex, which sizes this page to its
       content instead of the window. Opt out while the standalone page is
       mounted rather than changing the rule for the whole app, where the
       onboarding screens rely on that centring. */
    useEffect(() => {
        if (!standalone) return undefined;
        document.body.classList.add('ca-fullbleed');
        return () => document.body.classList.remove('ca-fullbleed');
    }, [standalone]);

    return (
        <div className={standalone ? 'dbk-standalone' : 'portal-content dbk-page'}>
            {standalone && (
                <header className="dbk-topbar">
                    <span className="dbk-brand">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-8"/></svg>
                        CaseActive
                    </span>
                    <span className="dbk-topbar-meta">Internal · Design backlog</span>
                </header>
            )}

            <div className={standalone ? 'dbk-page dbk-page-inner is-wide' : ''}>
                <InfoBanner message="Design states for the October 2026 backlog. Screens mount the app's own views inside the app's own shell, so what you measure here is what you will build. Nothing writes back to the live app. Pick a ticket, click a numbered pin for its build notes, and use the inspector for measurements." />

                <Browser />

                {/* The app's own inspector, which the standalone routes miss
                    because App returns before mounting it. Devs take values
                    off these screens, so it belongs here more than anywhere. */}
                {standalone && <DevInspector />}
            </div>
        </div>
    );
};

export default DesignBacklogView;
