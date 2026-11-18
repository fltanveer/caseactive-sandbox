/* HB-1 · Account site → Hubs → NEW → Create a Hub.

   The same window as today (About Hub and Billing Info, Cancel and Next),
   with the website moved to the top, starting empty and marked Optional.
   The window is small, so the result is one line with a thumbnail: the
   logo on its own background colour, which is enough to catch a wrong or
   unreadable logo. No logo upload here: the only choice is Use default,
   and the logo itself is changed later in Design Settings. */

import { useState } from 'react';
import SearchableSelect from '../../../components/SearchableSelect';
import HubsPage from '../../HubsPage';
import { AccountShell, BareFrame, Phone, Proposal } from '../Shell';
import { AutoOpen } from '../Drive';
import { useBranding } from './useBranding';

const Ico = ({ children, size = 16, w = 2 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);

/* One line under the website: what the lookup found and what to do next. */
const lineFor = (b) => {
    const d = b.domain;
    return {
        looking: ['spin', `Looking up ${d}…`, 'Finding the logo and colours.', []],
        found: ['thumb', 'Logo found', `Colours from ${d}`, ['default']],
        notfound: ['info', `Nothing found on ${d}`, 'The Hub will use the default look.', []],
        unreachable: ['info', `Couldn't reach ${d}`, 'The Hub will use the default look.', []],
        siteSmall: ['info', `The logo on ${d} is too small`, 'The Hub will use the default look.', []],
        default: ['info', 'Using the default look', 'Branding can be added later in Design Settings.', b.hadBrand ? ['brand'] : []],
    }[b.status];
};

const LookupLine = ({ b }) => {
    const row = lineFor(b);
    if (!row) return null;
    const [kind, title, sub, actions] = row;
    const label = { default: 'Use default', brand: `Use ${b.domain} branding` };
    const run = { default: b.useDefault, brand: b.useBrand };
    const logo = b.appearance.logo;
    const bg = b.appearance.bg || '#FFFFFF';

    /* The thumbnail is the logo on the header's white, as it will show;
       the brand colour is the swatch beside the colours line. */
    return (
        <div className={`hbw-line is-${kind}`} role="status">
            {kind === 'thumb' ? (
                <span className="hbw-thumb">{logo && <img src={logo.src} alt={logo.alt} />}</span>
            ) : (
                <span className="hbw-ic">
                    {kind === 'spin' ? <span className="hbs-spin" aria-hidden="true" />
                        : <Ico size={18}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></Ico>}
                </span>
            )}
            <span className="hbw-text">
                <strong>{title}</strong>
                <span>
                    {kind === 'thumb' && b.appearance.bg && <i className="hbs-chip" style={{ background: bg }} aria-hidden="true" />}
                    {sub}
                </span>
            </span>
            {actions.length > 0 && (
                <span className="hbw-actions">
                    {actions.map(a => <button key={a} type="button" className="hbs-btn is-quiet" onClick={run[a]}>{label[a]}</button>)}
                </span>
            )}
        </div>
    );
};

const CloseIcon = () => <Ico><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Ico>;

const HubWindow = ({ init }) => {
    const b = useBranding(init);
    const [industry, setIndustry] = useState('legal');
    return (
        <div className="modal-overlay">
            <div className="ccm hub-wizard-modal hbw" role="dialog" aria-label="Create a Hub">
                <div className="ccm-header">
                    <div>
                        <h2 className="ccm-title">Create a Hub</h2>
                        <p className="ccm-subtitle">Set up another Hub — for a new office, or a demo for a prospect.</p>
                    </div>
                    <button type="button" className="ccm-close" aria-label="Close"><CloseIcon /></button>
                </div>
                <div className="hub-wizard-tabs">
                    <button type="button" className="hub-wizard-tab active">About Hub</button>
                    <button type="button" className="hub-wizard-tab">Billing Info</button>
                </div>
                <div className="ccm-body">
                    <div className="ccm-field">
                        <label className="ccm-label" htmlFor="hbw-site">Your Company Website <span className="hbw-opt">Optional</span></label>
                        <input id="hbw-site" className={`ccm-input${b.invalid ? ' hbw-invalid' : ''}`} inputMode="url" spellCheck={false}
                            placeholder="theirfirm.com" value={b.site} onChange={e => b.setSite(e.target.value)} onBlur={b.blurSite}
                            aria-invalid={b.invalid || undefined} />
                        {b.invalid
                            ? <span className="hb-err">Enter a website like riveralaw.com</span>
                            : <span className="ccm-hint hbw-hint">We&apos;ll use it to set up the logo and colours. Leave it empty for the default look.</span>}
                        <LookupLine b={b} />
                    </div>
                    <div className="ccm-field">
                        <label className="ccm-label" htmlFor="hbw-name">Your Company Name <span className="ccm-req">*</span></label>
                        <input id="hbw-name" className="ccm-input" placeholder="e.g. Rivera Injury Law" value={b.firm} onChange={e => b.setFirm(e.target.value)} />
                        {b.firmAuto && b.firm && b.brand && <span className="hb-hint is-ok"><Ico size={13} w={2.5}><polyline points="20 6 9 17 4 12" /></Ico>Filled in from {b.domain}</span>}
                    </div>
                    <div className="ccm-field">
                        <label className="ccm-label">Your Company Industry</label>
                        <div className="gs-select-wrap">
                            <SearchableSelect value={industry} onChange={e => setIndustry(e.target.value)}>
                                <option value="legal">Legal</option>
                                <option value="healthcare">Healthcare</option>
                                <option value="finance">Finance</option>
                                <option value="education">Education</option>
                                <option value="technology">Technology</option>
                                <option value="other">Other</option>
                            </SearchableSelect>
                        </div>
                    </div>
                </div>
                <div className="ccm-footer">
                    <button type="button" className="imp-cancel-btn">Cancel</button>
                    <button type="button" className="imp-save-btn">Next</button>
                </div>
            </div>
        </div>
    );
};

/* Today: NEW opens "Select an option" first; Create a new Hub for my
   business opens the real window, so the screen clicks through to it. */
const TodayWindow = () => {
    const [chooser, setChooser] = useState(true);
    return (
        <AutoOpen clicks={['.hub-modal-options .hub-modal-card:nth-child(2)']}>
            <HubsPage embedded newModalOpen={chooser} onCloseNew={() => setChooser(false)} />
        </AutoOpen>
    );
};

export const WindowScreen = ({ init, phone = false }) => {
    const frame = (
        <BareFrame height={phone ? undefined : 900}>
            <div className="hbw-stage">
                <AccountShell narrow={phone}>
                    <div className="tk-mount">
                        <Proposal instead={<TodayWindow />}>
                            <HubsPage embedded />
                        </Proposal>
                    </div>
                </AccountShell>
                <Proposal><HubWindow init={init} /></Proposal>
            </div>
        </BareFrame>
    );
    return phone ? <Phone height={844}>{frame}</Phone> : frame;
};
