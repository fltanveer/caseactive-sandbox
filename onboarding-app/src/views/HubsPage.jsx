import { useState } from 'react';
import InfoBanner from '../components/InfoBanner';
import SearchableSelect from '../components/SearchableSelect';
import {
    CancelSubscriptionFlow, ResumeSubscriptionModal, SubscriptionStatusBanner,
    PLANS, RENEW_DATE, statusChip,
} from '../components/SubscriptionFlow';

/* Each hub carries its own subscription — a hub cannot run without one, so
   the two are edited in the same place. */
const HUBS_DATA = [
    {
        name: 'Hub 1', type: 'admin', status: 'active',
        industry: 'legal', website: 'https://sterlingbrooks.law',
        planId: 'growth', interval: 'monthly', sub: 'active', discount: null, pausedUntil: null,
        card: { name: 'Jordan Lee', number: '4242 4242 4242 4242', expiry: '08 / 29', cvc: '123', zip: '90014' },
        cases: 128, documents: 964, clients: 87, automations: 12,
    },
    {
        name: 'Hub 2', type: 'admin', status: 'active',
        industry: 'legal', website: '',
        planId: 'starter', interval: 'yearly', sub: 'trial', discount: null, pausedUntil: null,
        card: null,
        cases: 9, documents: 41, clients: 6, automations: 2,
    },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthsFromNow = (n) => {
    const d = new Date();
    d.setMonth(d.getMonth() + n);
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

const WIZARD_PLANS = [
    { id: 'starter', name: 'Starter', monthly: 49, yearly: 41 },
    { id: 'growth', name: 'Growth', monthly: 149, yearly: 124 },
    { id: 'scale', name: 'Scale', monthly: 399, yearly: 333 },
];
const yearlyTotal = (monthlyEquivalentPrice) => monthlyEquivalentPrice * 12;
const TRIAL_DAYS_TOTAL = 14;
const TRIAL_DAYS_LEFT = 11;
const TRIAL_END_DATE = 'Aug 24, 2026';

const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);

/* ── Create a Hub Wizard ── */
const CreateHubModal = ({ onClose, onCreate }) => {
    const [tab, setTab] = useState('about'); // 'about' | 'billing'
    const [companyName, setCompanyName] = useState('');
    const [industry, setIndustry] = useState('legal');
    const [website, setWebsite] = useState('');
    const [interval_, setInterval_] = useState('monthly');
    const [selectedPlan, setSelectedPlan] = useState('growth');
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [zip, setZip] = useState('');

    const canSubmit = cardName.trim() && cardNumber.trim() && expiry.trim() && cvc.trim() && zip.trim();
    const plan = WIZARD_PLANS.find(p => p.id === selectedPlan);

    const submit = () => {
        if (!canSubmit) return;
        onCreate({ name: companyName.trim(), industry, website: website.trim(), plan: plan.name, interval: interval_ });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm hub-wizard-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Hubs</p>
                        <h2 className="ccm-title">Create a Hub</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
                </div>

                <div className="hub-wizard-tabs">
                    <button type="button" className={`hub-wizard-tab${tab === 'about' ? ' active' : ''}`} onClick={() => setTab('about')}>About Hub</button>
                    <button type="button" className={`hub-wizard-tab${tab === 'billing' ? ' active' : ''}`} onClick={() => setTab('billing')}>Billing Info</button>
                </div>

                <div className="ccm-body">
                    {tab === 'about' ? (
                        <>
                            <div className="ccm-field">
                                <label className="ccm-label">Your Company Name <span className="ccm-req">*</span></label>
                                <input className="ccm-input" placeholder="e.g. Sterling & Brooks Injury Law" value={companyName} onChange={e => setCompanyName(e.target.value)} autoFocus />
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
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                                </div>
                            </div>
                            <div className="ccm-field">
                                <label className="ccm-label">Your Company Website</label>
                                <input className="ccm-input" placeholder="https://" value={website} onChange={e => setWebsite(e.target.value)} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bs-status-banner trial">
                                <span className="bs-trial-icon">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                </span>
                                <div className="bs-trial-body">
                                    <div className="bs-trial-title">{TRIAL_DAYS_LEFT} days left in your trial</div>
                                    <div className="bs-trial-desc">Add a card now so your {plan.name} plan keeps running after your trial ends on {TRIAL_END_DATE}.</div>
                                    <div className="bs-trial-progress"><div className="bs-trial-progress-fill" style={{ width: `${100 - (TRIAL_DAYS_LEFT / TRIAL_DAYS_TOTAL) * 100}%` }} /></div>
                                </div>
                            </div>

                            <div className="ccm-field">
                                <label className="ccm-label">Payment Plan</label>
                                <div className="bs-segmented">
                                    <button type="button" className={`bs-segmented-btn${interval_ === 'monthly' ? ' active' : ''}`} onClick={() => setInterval_('monthly')}>Monthly</button>
                                    <button type="button" className={`bs-segmented-btn${interval_ === 'yearly' ? ' active' : ''}`} onClick={() => setInterval_('yearly')}>
                                        Yearly <span className="bs-save-badge">2 months free</span>
                                    </button>
                                </div>
                                <div className="bs-plan-grid">
                                    {WIZARD_PLANS.map(p => (
                                        <button
                                            type="button"
                                            key={p.id}
                                            className={`bs-plan-card${selectedPlan === p.id ? ' selected' : ''}`}
                                            onClick={() => setSelectedPlan(p.id)}
                                        >
                                            <div className="bs-plan-card-top">
                                                <span className="bs-plan-card-name">{p.name}</span>
                                            </div>
                                            <div className="bs-plan-card-price">${interval_ === 'monthly' ? p.monthly : p.yearly}/mo</div>
                                            {interval_ === 'yearly' && <div className="bs-plan-card-total">${yearlyTotal(p.yearly).toLocaleString()}/yr billed annually</div>}
                                        </button>
                                    ))}
                                </div>
                                <a className="bs-pricing-link" href="https://www.caseactive.com/pricing" target="_blank" rel="noopener noreferrer">
                                    See full feature comparison &amp; plan details
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                </a>
                            </div>

                            <div className="gs-divider" />

                            <div className="ccm-field">
                                <label className="ccm-label">Name on card</label>
                                <input className="ccm-input" placeholder="Jordan Lee" value={cardName} onChange={e => setCardName(e.target.value)} />
                            </div>
                            <div className="ccm-field">
                                <label className="ccm-label">Card number</label>
                                <input className="ccm-input" placeholder="1234 1234 1234 1234" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
                            </div>
                            <div className="bs-modal-grid-2">
                                <div className="ccm-field">
                                    <label className="ccm-label">Expiry</label>
                                    <input className="ccm-input" placeholder="MM / YY" value={expiry} onChange={e => setExpiry(e.target.value)} />
                                </div>
                                <div className="ccm-field">
                                    <label className="ccm-label">CVC</label>
                                    <input className="ccm-input" placeholder="123" value={cvc} onChange={e => setCvc(e.target.value)} />
                                </div>
                            </div>
                            <div className="ccm-field">
                                <label className="ccm-label">Billing ZIP / postal code</label>
                                <input className="ccm-input" placeholder="10001" value={zip} onChange={e => setZip(e.target.value)} />
                            </div>
                        </>
                    )}
                </div>

                <div className="ccm-footer">
                    {tab === 'about' ? (
                        <>
                            <button className="imp-cancel-btn" onClick={onClose}>Cancel</button>
                            <button className="imp-save-btn" onClick={() => setTab('billing')}>Next</button>
                        </>
                    ) : (
                        <>
                            <button className="imp-cancel-btn hub-wizard-back-btn" onClick={() => setTab('about')}>Back</button>
                            <button type="button" className="hub-wizard-later-btn" onClick={onClose}>Finish Later</button>
                            <button className="imp-save-btn" disabled={!canSubmit} onClick={submit}>Create Hub</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

/* ── Hub Settings ─────────────────────────────────────────────────────────
   Same shell and same two tabs as Create a Hub, filled in from the hub's
   record — creating and editing a hub should not feel like two products.
   Billing gains what only an existing hub has: a live plan, a card on file,
   the subscription state and the danger zone. */
const HubSettingsModal = ({ hub, onClose, onSave, onDelete, onCancelSub, onResumeSub, onPauseSub, onDiscount, onDowngrade }) => {
    const [tab, setTab] = useState('about');
    const [companyName, setCompanyName] = useState(hub.name);
    const [industry, setIndustry] = useState(hub.industry);
    const [website, setWebsite] = useState(hub.website);
    const [interval_, setInterval_] = useState(hub.interval);
    const [selectedPlan, setSelectedPlan] = useState(hub.planId);
    const [cancelOpen, setCancelOpen] = useState(false);
    const [resumeOpen, setResumeOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const plan = PLANS.find(p => p.id === selectedPlan);
    const activePlan = PLANS.find(p => p.id === hub.planId);
    const price = interval_ === 'monthly' ? plan.monthly : plan.yearly;
    const planChanged = selectedPlan !== hub.planId || interval_ !== hub.interval;
    const live = hub.sub === 'active' || hub.sub === 'trial';

    const save = () => {
        onSave({ ...hub, name: companyName.trim() || hub.name, industry, website: website.trim(), planId: selectedPlan, interval: interval_ });
        onClose();
    };

    return (
        <>
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm hub-wizard-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Hubs · {hub.name}</p>
                        <h2 className="ccm-title">Hub Settings</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
                </div>

                <div className="hub-wizard-tabs">
                    <button type="button" className={`hub-wizard-tab${tab === 'about' ? ' active' : ''}`} onClick={() => setTab('about')}>About Hub</button>
                    <button type="button" className={`hub-wizard-tab${tab === 'billing' ? ' active' : ''}`} onClick={() => setTab('billing')}>
                        Billing Info
                        {hub.sub === 'canceled' && <span className="hub-tab-dot" />}
                    </button>
                </div>

                <div className="ccm-body">
                    {tab === 'about' ? (
                        <>
                            <div className="ccm-field">
                                <label className="ccm-label">Your Company Name <span className="ccm-req">*</span></label>
                                <input className="ccm-input" value={companyName} onChange={e => setCompanyName(e.target.value)} />
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
                            <div className="ccm-field">
                                <label className="ccm-label">Your Company Website</label>
                                <input className="ccm-input" placeholder="https://" value={website} onChange={e => setWebsite(e.target.value)} />
                            </div>

                            <div className="gs-divider" />

                            <div className="hs-danger">
                                <div className="hs-danger-body">
                                    <div className="hs-danger-title">Delete this hub</div>
                                    <p className="hs-danger-text">
                                        Removes {hub.cases} cases, {hub.documents} documents and access for {hub.clients} clients. This cannot be undone.
                                    </p>
                                </div>
                                <button className="imp-cancel-btn hs-danger-btn" onClick={() => setDeleteOpen(true)}>Delete hub</button>
                            </div>
                        </>
                    ) : (
                        <>
                            <SubscriptionStatusBanner
                                status={hub.sub}
                                plan={activePlan}
                                discount={hub.discount}
                                pausedUntil={hub.pausedUntil}
                                daysLeft={11}
                                onResume={() => setResumeOpen(true)}
                                onAddCard={hub.sub === 'trial' ? () => setTab('billing') : undefined}
                            />

                            <div className="hs-current">
                                <div className="hs-current-top">
                                    <div>
                                        <span className="hs-current-label">Current plan</span>
                                        <div className="hs-current-plan">{activePlan.name} · ${hub.interval === 'monthly' ? activePlan.monthly : activePlan.yearly}/mo</div>
                                    </div>
                                    <span className={`sf-chip sf-chip-${statusChip(hub.sub).tone}`}>{statusChip(hub.sub).label}</span>
                                </div>
                                <div className="hs-current-meta">
                                    {hub.sub === 'canceled'
                                        ? `Access ends ${RENEW_DATE}`
                                        : hub.sub === 'paused'
                                            ? `Paused until ${hub.pausedUntil}`
                                            : `Renews ${RENEW_DATE} · billed ${hub.interval}`}
                                </div>
                            </div>

                            <div className="ccm-field">
                                <label className="ccm-label">Change plan</label>
                                <div className="bs-segmented">
                                    <button type="button" className={`bs-segmented-btn${interval_ === 'monthly' ? ' active' : ''}`} onClick={() => setInterval_('monthly')}>Monthly</button>
                                    <button type="button" className={`bs-segmented-btn${interval_ === 'yearly' ? ' active' : ''}`} onClick={() => setInterval_('yearly')}>
                                        Yearly <span className="bs-save-badge">2 months free</span>
                                    </button>
                                </div>
                                <div className="bs-plan-grid">
                                    {PLANS.map(p => (
                                        <button type="button" key={p.id}
                                            className={`bs-plan-card${selectedPlan === p.id ? ' selected' : ''}`}
                                            onClick={() => setSelectedPlan(p.id)}>
                                            <div className="bs-plan-card-top">
                                                <span className="bs-plan-card-name">{p.name}</span>
                                                {p.id === hub.planId && <span className="hs-current-tag">Current</span>}
                                            </div>
                                            <div className="bs-plan-card-price">${interval_ === 'monthly' ? p.monthly : p.yearly}/mo</div>
                                            {interval_ === 'yearly' && <div className="bs-plan-card-total">${yearlyTotal(p.yearly).toLocaleString()}/yr billed annually</div>}
                                        </button>
                                    ))}
                                </div>
                                {planChanged && <p className="hs-prorate">Changing to {plan.name} costs ${price}/mo. We prorate the difference for the rest of this cycle.</p>}
                            </div>

                            <div className="gs-divider" />

                            <div className="ccm-field">
                                <label className="ccm-label">Payment method</label>
                                {hub.card ? (
                                    <div className="hs-card">
                                        <span className="hs-card-brand">VISA</span>
                                        <span className="hs-card-num">•••• {hub.card.number.slice(-4)}</span>
                                        <span className="hs-card-exp">Expires {hub.card.expiry}</span>
                                        <span className="sf-chip sf-chip-ok">Default</span>
                                    </div>
                                ) : (
                                    <div className="hs-card hs-card-empty">
                                        No card on file — this hub stops when the trial ends.
                                    </div>
                                )}
                            </div>

                            <div className="gs-divider" />

                            <div className="hs-danger">
                                <div className="hs-danger-body">
                                    <div className="hs-danger-title">{live ? 'Cancel subscription' : 'Subscription not running'}</div>
                                    <p className="hs-danger-text">
                                        {live
                                            ? `Keeps working until ${RENEW_DATE}. A hub cannot run without a plan, so it becomes read-only after that.`
                                            : 'Resume any time — your cases, documents and settings are still here.'}
                                    </p>
                                </div>
                                {live
                                    ? <button className="imp-cancel-btn hs-danger-btn" onClick={() => setCancelOpen(true)}>Cancel subscription</button>
                                    : <button className="imp-save-btn" onClick={() => setResumeOpen(true)}>Resume</button>}
                            </div>
                        </>
                    )}
                </div>

                <div className="ccm-footer">
                    <button className="imp-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="imp-save-btn" onClick={save}>Save changes</button>
                </div>
            </div>
        </div>

        {cancelOpen && (
            <CancelSubscriptionFlow
                hub={hub} plan={activePlan} interval={hub.interval}
                breadcrumb={`Hubs · ${hub.name}`}
                onClose={() => setCancelOpen(false)}
                onCancel={(data) => { onCancelSub(hub, data); setCancelOpen(false); onClose(); }}
                onPause={(months) => { onPauseSub(hub, months); setCancelOpen(false); onClose(); }}
                onDiscount={(d) => { onDiscount(hub, d); setCancelOpen(false); onClose(); }}
                onDowngrade={(p) => { onDowngrade(hub, p); setCancelOpen(false); onClose(); }}
            />
        )}
        {resumeOpen && (
            <ResumeSubscriptionModal
                plan={activePlan} interval={hub.interval} paused={hub.sub === 'paused'}
                breadcrumb={`Hubs · ${hub.name}`}
                onClose={() => setResumeOpen(false)}
                onConfirm={() => { onResumeSub(hub); setResumeOpen(false); }}
            />
        )}
        {deleteOpen && (
            <DeleteHubModal hub={hub} onClose={() => setDeleteOpen(false)}
                onCancelInstead={() => { setDeleteOpen(false); setCancelOpen(true); }}
                onConfirm={() => { onDelete(hub); setDeleteOpen(false); onClose(); }} />
        )}
        </>
    );
};

/* Deleting is not the same as cancelling, and people reach for it meaning the
   other. The cheaper, reversible option is offered first. */
const DeleteHubModal = ({ hub, onClose, onConfirm, onCancelInstead }) => {
    const [typed, setTyped] = useState('');
    const live = hub.sub === 'active' || hub.sub === 'trial';
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm sf-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Hubs · {hub.name}</p>
                        <h2 className="ccm-title">Delete hub</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="ccm-body sf-body">
                    {live && (
                        <div className="sf-tl-item stop" style={{ borderRadius: 10 }}>
                            <span className="sf-tl-icon">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                            </span>
                            <div>
                                <div className="sf-tl-title">You have paid through {RENEW_DATE}</div>
                                <div className="sf-tl-desc">
                                    Deleting now ends billing immediately and the remaining time is not refunded.
                                    Cancelling instead keeps the hub usable until then, and everything is recoverable.
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="sf-loss">
                        <span className="sf-section-label">Deleted permanently</span>
                        <ul className="sf-loss-list">
                            <li><span className="sf-loss-x"><CloseIcon /></span><span className="sf-loss-body"><span className="sf-loss-label">{hub.cases} cases and every document</span><span className="sf-loss-detail">No export is possible afterwards</span></span></li>
                            <li><span className="sf-loss-x"><CloseIcon /></span><span className="sf-loss-body"><span className="sf-loss-label">{hub.clients} client portal accounts</span><span className="sf-loss-detail">Clients lose access at once</span></span></li>
                            <li><span className="sf-loss-x"><CloseIcon /></span><span className="sf-loss-body"><span className="sf-loss-label">Invoices, notes and call recordings</span><span className="sf-loss-detail">Not kept for the 90-day recovery window</span></span></li>
                        </ul>
                    </div>
                    <div className="ccm-field">
                        <label className="ccm-label">Type <strong>{hub.name}</strong> to confirm</label>
                        <input className="ccm-input" value={typed} onChange={e => setTyped(e.target.value)} placeholder={hub.name} />
                    </div>
                </div>
                <div className="ccm-footer sf-footer">
                    {live && <button className="imp-cancel-btn" onClick={onCancelInstead}>Cancel subscription instead</button>}
                    <button className="sf-plain-btn" onClick={onClose}>Keep hub</button>
                    <button className="imp-save-btn sf-danger-btn" disabled={typed !== hub.name} onClick={onConfirm}>Delete hub</button>
                </div>
            </div>
        </div>
    );
};

const HubsBody = ({ onAdmin, onLobby, newModalOpen = false, onCloseNew }) => {
    const [statusTab, setStatusTab] = useState('Active');
    const [hubs, setHubs] = useState(HUBS_DATA);
    const [wizardOpen, setWizardOpen] = useState(false);
    const [settingsHub, setSettingsHub] = useState(null);

    const addHub = ({ name, industry, website, planId = 'growth', interval = 'monthly' }) => {
        setHubs(prev => [...prev, {
            name, type: 'admin', status: 'active',
            industry: industry || 'legal', website: website || '',
            planId, interval, sub: 'active', discount: null, pausedUntil: null,
            card: null, cases: 0, documents: 0, clients: 0, automations: 0,
        }]);
    };

    const patchHub = (target, patch) => setHubs(prev => prev.map(h => (h.name === target.name ? { ...h, ...patch } : h)));

    const saveHub = (updated) => setHubs(prev => prev.map(h => (h.name === settingsHub.name ? updated : h)));
    const deleteHub = (target) => setHubs(prev => prev.filter(h => h.name !== target.name));

    /* A cancelled hub keeps running to the end of the paid cycle — the row
       says so rather than flipping straight to disabled. */
    const cancelSub  = (hub) => patchHub(hub, { sub: 'canceled', discount: null });
    const resumeSub  = (hub) => patchHub(hub, { sub: 'active', pausedUntil: null });
    const pauseSub   = (hub, months) => patchHub(hub, { sub: 'paused', pausedUntil: monthsFromNow(months) });
    const applyOffer = (hub, discount) => patchHub(hub, { sub: 'active', discount });
    const downgrade  = (hub, plan) => patchHub(hub, { sub: 'active', planId: plan.id });

    return (
        <>
            <InfoBanner message="A Hub in CaseActive is a workspace where you can manage all your cases. You can create a single workspace for all your clients or multiple workspaces according to your clients, depending on your preferences." />
            <div className="hubs-content">
                <div className="hubs-table">
                    <div className="hubs-toolbar">
                        <div className="hubs-search">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            <input type="text" className="hubs-search-input" placeholder="Search hubs..."/>
                        </div>
                        <div className="hubs-status-row">
                            {['Active', 'Rejected', 'Disabled'].map(tab => (
                                <button key={tab} className={`hubs-status-tab${statusTab === tab ? ' active' : ''}`} onClick={() => setStatusTab(tab)}>{tab}</button>
                            ))}
                        </div>
                    </div>
                    <div className="hubs-table-head">
                        <span>Company Name</span>
                        <span>Type</span>
                        <span>Status</span>
                        <span/>
                    </div>
                    {hubs.map((hub, i) => (
                        <div key={i} className="hubs-table-row">
                            <span data-label="Company Name">
                                <div className="hubs-row-name">
                                    <div className="hubs-row-icon">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                                    </div>
                                    <span>{hub.name}</span>
                                </div>
                            </span>
                            <span className="hubs-row-cell" data-label="Type">{hub.type}</span>
                            <span data-label="Status">
                                <span className={`sf-chip sf-chip-${statusChip(hub.sub).tone}`}>{statusChip(hub.sub).label}</span>
                            </span>
                            <span data-label="Action">
                                <div className="hubs-row-actions">
                                    <button className="hubs-text-btn lobby" onClick={onLobby}>Lobby</button>
                                    <button className="hubs-text-btn admin" onClick={onAdmin}>Admin</button>
                                    <button className="hubs-action-btn more" title="Hub settings" onClick={() => setSettingsHub(hub)}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                    </button>
                                </div>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {newModalOpen && (
                <div className="hub-modal-overlay" onClick={onCloseNew}>
                    <div className="hub-modal" onClick={e => e.stopPropagation()}>
                        <div className="hub-modal-header">
                            <h2 className="hub-modal-title">Select an option</h2>
                            <button className="hub-modal-close" onClick={onCloseNew}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                            </button>
                        </div>
                        <div className="hub-modal-divider"/>
                        <div className="hub-modal-options">
                            <button className="hub-modal-card">
                                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#149EB1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <span>Join an existing Hub as a client</span>
                            </button>
                            <button className="hub-modal-card" onClick={() => { onCloseNew(); setWizardOpen(true); }}>
                                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#149EB1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
                                <span>Create a new Hub for my business</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {wizardOpen && (
                <CreateHubModal onClose={() => setWizardOpen(false)} onCreate={addHub} />
            )}

            {settingsHub && (
                <HubSettingsModal
                    hub={hubs.find(h => h.name === settingsHub.name) || settingsHub}
                    onClose={() => setSettingsHub(null)}
                    onSave={saveHub}
                    onDelete={deleteHub}
                    onCancelSub={cancelSub}
                    onResumeSub={resumeSub}
                    onPauseSub={pauseSub}
                    onDiscount={applyOffer}
                    onDowngrade={downgrade}
                />
            )}
        </>
    );
};

const HubsPage = ({ onAdmin, onLobby, embedded = false, newModalOpen = false, onCloseNew }) => {
    const [profileOpen, setProfileOpen] = useState(false);

    if (embedded) {
        return (
            <div className="hubs-view">
                <HubsBody onAdmin={onAdmin} onLobby={onLobby} newModalOpen={newModalOpen} onCloseNew={onCloseNew} />
            </div>
        );
    }

    return (
        <div className="hubs-shell">
            <div className="portal-topbar">
                <div className="portal-logo">
                    <img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 28, width: 'auto' }} />
                </div>
                <div className="portal-profile-wrap">
                    <div className="portal-topbar-profile" onClick={() => setProfileOpen(p => !p)}>
                        <div className="portal-avatar">J</div>
                        <div className="portal-topbar-profile-info">
                            <div className="portal-user-name">Jordan Admin</div>
                            <div className="portal-user-role">Administrator</div>
                        </div>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#94A3B8', marginLeft: '2px', flexShrink: 0 }}><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                    {profileOpen && (
                        <div className="portal-profile-dropdown">
                            <button className="portal-profile-option" onClick={() => setProfileOpen(false)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                Settings
                            </button>
                            <button className="portal-profile-option danger" onClick={() => setProfileOpen(false)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <HubsBody onAdmin={onAdmin} onLobby={onLobby} />
        </div>
    );
};

export default HubsPage;
