/* HB-1 · Signup: the create-hub step (step 4) and the done step (step 5).

   Drawn on the signup's own classes (.onboarding-card, .side-panel,
   .main-panel, .input-group, .choice-card), so Today is the screen as it is
   and Proposed changes only what the ticket asks: the left panel becomes
   the hub preview, the website field comes first, and the done screen shows
   the branded hub with the reworded card.

   On a phone the left panel is hidden, as today, so the preview moves under
   the website field, where the result appears. */

import { useState } from 'react';
import SearchableSelect from '../../../components/SearchableSelect';
import { Phone, Proposal } from '../Shell';
import { HubPreview, StatusCard } from './preview';
import { useBranding } from './useBranding';

const Ico = ({ children, size = 16, w = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const Check = ({ size = 14 }) => <Ico size={size} w={2.5}><polyline points="20 6 9 17 4 12" /></Ico>;
const Back = () => <Ico><polyline points="15 18 9 12 15 6" /></Ico>;
const Logo = () => <div className="logo"><img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 24, width: 'auto' }} /></div>;

const Page = ({ wide, children }) => (
    <div className="hb-page">
        <div className={`onboarding-wrapper${wide ? ' hb-wide' : ''}`}>
            <div className="onboarding-card">{children}</div>
        </div>
    </div>
);

const Header = ({ pct }) => (
    <div className="step-header">
        <button type="button" className="back-btn"><Back />Back</button>
        <div className="progress-bar"><div className="progress-fill" style={{ width: pct }} /></div>
    </div>
);

const Choices = () => (
    <div className="choice-grid">
        <div className="choice-card selected">
            <div className="choice-icon"><Ico size={24} w={1.5}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></Ico></div>
            <div className="choice-text"><strong>Create new Hub</strong><span>Start fresh for your firm</span></div>
        </div>
        <div className="choice-card">
            <div className="choice-icon"><Ico size={24} w={1.5}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></Ico></div>
            <div className="choice-text"><strong>Join existing Hub</strong><span>Request access to team Hub</span></div>
        </div>
    </div>
);

const TeamSize = () => (
    <div className="input-group">
        <label htmlFor="hb-team">Your team size</label>
        <div className="select-wrapper">
            <SearchableSelect id="hb-team">
                <option value="solo">Just me</option>
                <option value="2-5">2–5 people</option>
                <option value="6-15">6–15 people</option>
                <option value="16-50">16–50 people</option>
                <option value="51+">51+ people</option>
            </SearchableSelect>
        </div>
    </div>
);

/* ── Step 4 today ──────────────────────────────────────────────────────── */

const CreateToday = () => (
    <Page>
        <div className="step">
            <aside className="side-panel">
                <Logo />
                <h2>You&apos;re almost set up</h2>
                <p>Here&apos;s what happens next when you finish setup.</p>
                <ul className="feature-list checklist">
                    {['Your branded Hub goes live immediately', 'Invite your first client in under 2 minutes', 'Automated updates start the moment you add a case'].map(t => (
                        <li key={t}><span className="check-icon"><Check /></span><span>{t}</span></li>
                    ))}
                </ul>
            </aside>
            <main className="main-panel">
                <Header pct="75%" />
                <div className="step-content">
                    <h1>Last step — choose your Hub</h1>
                    <p className="step-subtitle">Join an existing firm Hub or create a new one for your team.</p>
                    <Choices />
                    <form className="setup-form" onSubmit={e => e.preventDefault()}>
                        <div className="input-group">
                            <label htmlFor="hb-firm-today">Firm name</label>
                            <input type="text" id="hb-firm-today" placeholder="e.g. Johnson & Associates" />
                        </div>
                        <TeamSize />
                        <button type="submit" className="primary-btn launch-btn">Launch my Hub</button>
                        <p className="help-text center">Free for 14 days · No credit card · Cancel anytime</p>
                    </form>
                </div>
            </main>
        </div>
    </Page>
);

/* ── Step 4 proposed ───────────────────────────────────────────────────── */

const WebsiteField = ({ b }) => (
    <div className="input-group hb-site">
        <label htmlFor="hb-website">Firm website</label>
        {b.mode === 'field' ? (
            <>
                <div className={`search-input-wrapper hb-site-row${b.invalid ? ' is-error' : ''}`}>
                    <span className="search-icon"><Ico size={18} w={1.8}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></Ico></span>
                    <input id="hb-website" type="text" inputMode="url" autoComplete="url" spellCheck={false}
                        className="search-input" placeholder="yourfirm.com" value={b.site}
                        onChange={e => b.setSite(e.target.value)} onBlur={b.blurSite}
                        aria-describedby="hb-website-hint" aria-invalid={b.invalid || undefined} />
                    {b.status === 'looking' && <span className="hb-site-end"><span className="hbs-spin" role="img" aria-label="Looking up" /></span>}
                    {b.status === 'found' && <span className="hb-site-end is-ok" role="img" aria-label="Found"><Check size={16} /></span>}
                </div>
                {b.invalid && <p className="hb-err">Enter a website like johnsonlaw.com</p>}
                <div className="hb-site-foot">
                    <span id="hb-website-hint" className="hb-hint">We&apos;ll use it to set up your logo and colours</span>
                    <button type="button" className="hb-link" onClick={b.noWebsite}>We don&apos;t have a website</button>
                </div>
            </>
        ) : (
            <div className="hb-nosite">
                <span>No website — your Hub will use the default look.</span>
                <button type="button" className="hb-link" onClick={b.addWebsite}>Add a website</button>
            </div>
        )}
    </div>
);

const FirmName = ({ b }) => (
    <div className="input-group">
        <label htmlFor="hb-firm">Firm name</label>
        <input type="text" id="hb-firm" autoComplete="organization" placeholder="e.g. Johnson & Associates" value={b.firm} onChange={e => b.setFirm(e.target.value)} />
        {b.firmAuto && b.firm && b.brand && <span className="hb-hint is-ok"><Check size={13} />Filled in from {b.domain}</span>}
        {b.status === 'looking' && !b.firm && <span className="hb-hint">We&apos;ll fill this in from your website — or type it now.</span>}
    </div>
);

export const CreateHub = ({ init = {}, launching = false }) => {
    const b = useBranding(init);
    const [busy, setBusy] = useState(launching);
    const launch = (e) => { e.preventDefault(); if (b.status === 'looking') setBusy(true); };

    return (
        <Page wide>
            <div className="step hb-step">
                <aside className="side-panel hb-side">
                    <Logo />
                    <div>
                        <h2>Here&apos;s your Hub</h2>
                        <p className="hb-side-sub">This is what your clients see when they log in.</p>
                    </div>
                    <HubPreview look={b.appearance} firm={b.firm} />
                    <StatusCard b={b} />
                </aside>
                <main className="main-panel">
                    <Header pct="75%" />
                    <div className="step-content">
                        <h1>Last step — choose your Hub</h1>
                        <p className="step-subtitle">Join an existing firm Hub or create a new one for your team.</p>
                        <Choices />
                        <form className="setup-form" onSubmit={launch}>
                            <WebsiteField b={b} />
                            <div className="hb-inline">
                                <span className="hb-inline-label">Your Hub preview</span>
                                <HubPreview look={b.appearance} firm={b.firm} phone />
                                <StatusCard b={b} />
                            </div>
                            <FirmName b={b} />
                            <TeamSize />
                            <button type="submit" className={`primary-btn launch-btn${busy ? ' hb-busy' : ''}`} aria-busy={busy || undefined}>
                                {busy ? <><span className="hbs-spin is-light" aria-hidden="true" />Creating your Hub…</> : 'Launch my Hub'}
                            </button>
                            <p className="help-text center">Free for 14 days · No credit card · Cancel anytime</p>
                        </form>
                    </div>
                </main>
            </div>
        </Page>
    );
};

/* ── Step 5 ────────────────────────────────────────────────────────────── */

const NEXT = (branded) => [
    { t: 'Invite a client', s: 'Send a secure link in seconds', i: <><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></> },
    { t: 'Explore dashboard', s: 'Add your first case', i: <><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></> },
    branded === undefined
        ? { t: 'Customize Hub', s: 'Add your firm\'s logo & colors', i: <><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M21 12h-3M3 12H6M12 3V6M12 18v3" /></> }
        : branded
            ? { t: 'Adjust your branding', s: 'Fine-tune your logo and colours in Design Settings', i: <><line x1="21" y1="4" x2="14" y2="4" /><line x1="10" y1="4" x2="3" y2="4" /><line x1="21" y1="12" x2="12" y2="12" /><line x1="8" y1="12" x2="3" y2="12" /><line x1="21" y1="20" x2="16" y2="20" /><line x1="12" y1="20" x2="3" y2="20" /><line x1="14" y1="2" x2="14" y2="6" /><line x1="8" y1="10" x2="8" y2="14" /><line x1="16" y1="18" x2="16" y2="22" /></> }
            : { t: 'Add your branding', s: 'Add your logo and colours in Design Settings', i: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" /></> },
];

const DoneMain = ({ branded }) => (
    <main className="main-panel">
        <Header pct="100%" />
        <div className="step-content success-content">
            <div className="success-icon-large"><Ico size={36}><polyline points="20 6 9 17 4 12" /></Ico></div>
            <h1>Hub launched 🎉</h1>
            <p className="step-subtitle">Your Hub is ready at app.caseactive.com/dashboard</p>
            <div className="success-actions">
                <button type="button" className="primary-btn">Go to dashboard</button>
                <button type="button" className="secondary-btn">Invite first client</button>
            </div>
            <div className="next-steps-grid">
                {NEXT(branded).map((c, i) => (
                    <div key={c.t} className={`next-step-card${branded !== undefined && i === 2 ? ' hb-card-new' : ''}`}>
                        <span className="ns-icon"><Ico size={18} w={1.5}>{c.i}</Ico></span>
                        <strong>{c.t}</strong>
                        <span>{c.s}</span>
                    </div>
                ))}
            </div>
        </div>
    </main>
);

const DoneToday = () => (
    <Page>
        <div className="step">
            <aside className="side-panel success-panel">
                <Logo />
                <div className="success-badge"><Ico size={28}><polyline points="20 6 9 17 4 12" /></Ico></div>
                <h2>You&apos;re all set!</h2>
                <p>Your Hub is live. Start by inviting your first client or adding a case.</p>
                <ul className="feature-list checklist">
                    {['Hub ready', 'Role configured', 'Practice areas saved'].map(t => <li key={t}><span className="check-icon"><Check /></span><span>{t}</span></li>)}
                </ul>
            </aside>
            <DoneMain />
        </div>
    </Page>
);

const DoneProposed = ({ look, firm }) => (
    <Page wide>
        <div className="step hb-step hb-done">
            <aside className="side-panel success-panel hb-side">
                <Logo />
                <div>
                    <span className="hb-live"><i aria-hidden="true" />Live now</span>
                    <h2>Your Hub is live</h2>
                    <p className="hb-side-sub">Here&apos;s what your clients see when they log in.</p>
                </div>
                <HubPreview look={look} firm={firm} />
            </aside>
            <DoneMain branded={!!look.bg || !!look.logo} />
        </div>
    </Page>
);

/* ── Screens ───────────────────────────────────────────────────────────── */

const framed = (node, phone) => (phone ? <Phone height={844}>{node}</Phone> : <div className="hb-frame">{node}</div>);

export const CreateScreen = ({ init, launching, phone = false }) => framed(
    <Proposal instead={<CreateToday />}><CreateHub init={init} launching={launching} /></Proposal>, phone,
);

export const DoneScreen = ({ look, firm, phone = false }) => framed(
    <Proposal instead={<DoneToday />}><DoneProposed look={look} firm={firm} /></Proposal>, phone,
);
