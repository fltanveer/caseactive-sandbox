import { useState } from 'react';
import InfoBanner from '../../components/InfoBanner';
import './BillingSettingsView.css';

const PLANS = [
    { id: 'starter', name: 'Starter', monthly: 49, yearly: 41 },
    { id: 'growth', name: 'Growth', monthly: 149, yearly: 124 },
    { id: 'scale', name: 'Scale', monthly: 399, yearly: 333 },
];

const INVOICES = [
    { id: 'inv-8841', date: 'Jul 12, 2026', desc: 'Growth plan — Monthly', amount: '$149.00', status: 'Paid' },
    { id: 'inv-8622', date: 'Jun 12, 2026', desc: 'Growth plan — Monthly', amount: '$149.00', status: 'Paid' },
    { id: 'inv-8410', date: 'May 12, 2026', desc: 'Growth plan — Monthly', amount: '$149.00', status: 'Paid' },
    { id: 'inv-8199', date: 'Apr 12, 2026', desc: 'Starter plan — Monthly', amount: '$49.00', status: 'Paid' },
];

const TRIAL_DAYS_TOTAL = 14;
const TRIAL_DAYS_LEFT = 11;
const TRIAL_END_DATE = 'Aug 24, 2026';
const RENEW_DATE = 'Sep 12, 2026';
const CYCLE_DAYS_LEFT = 18;
const CYCLE_TOTAL_DAYS = 30;

const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);

const yearlyTotal = (monthlyEquivalentPrice) => monthlyEquivalentPrice * 12;

const downloadInvoice = (inv) => {
    const lines = [
        'Sterling & Brooks Injury Law',
        '',
        `INVOICE — ${inv.status.toUpperCase()}`,
        '',
        `Invoice ID: ${inv.id}`,
        `Date:       ${inv.date}`,
        '',
        '----------------------------------------',
        inv.desc,
        `Amount: ${inv.amount}`,
        '----------------------------------------',
        `Total: ${inv.amount}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${inv.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

const SectionCard = ({ title, children }) => (
    <div className="gs-card">
        <div className="gs-card-header">
            <h2 className="gs-card-title">{title}</h2>
        </div>
        <div className="gs-card-body">{children}</div>
    </div>
);

/* ── Add / Update Card Modal ── */
const CardFormModal = ({ mode, card, onClose, onSave }) => {
    const isUpdate = mode === 'update';
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [zip, setZip] = useState('');

    const canSave = name.trim() && number.trim() && expiry.trim() && cvc.trim() && zip.trim();

    const save = () => {
        if (!canSave) return;
        const digits = number.replace(/\D/g, '');
        const last4 = (digits || number.trim()).slice(-4).padStart(4, '0');
        onSave({ brand: 'VISA', last4, expiry: expiry.trim() });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm afm-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Settings · Billing & Subscription</p>
                        <h2 className="ccm-title">{isUpdate ? 'Update Card' : 'Add a Card'}</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="ccm-body">
                    <p className="bs-modal-note">
                        {isUpdate
                            ? 'Replace the details for this card on file.'
                            : `You're ${TRIAL_DAYS_LEFT} days into your trial. Add a card now so your plan keeps running without interruption.`}
                    </p>

                    {isUpdate && card && (
                        <div className="bs-current-file-strip">
                            <span className="bs-card-brand">{card.brand}</span>
                            <span>Currently on file: •••• {card.last4}, expires {card.expiry}</span>
                        </div>
                    )}

                    <div className="ccm-field">
                        <label className="ccm-label">Name on card</label>
                        <input className="ccm-input" placeholder="Jordan Lee" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="ccm-field">
                        <label className="ccm-label">{isUpdate ? 'New card number' : 'Card number'}</label>
                        <input className="ccm-input" placeholder="1234 1234 1234 1234" value={number} onChange={e => setNumber(e.target.value)} />
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

                    {!isUpdate && (
                        <div className="bs-modal-info">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            You won't be charged today. Billing starts when your trial ends on {TRIAL_END_DATE}.
                        </div>
                    )}
                </div>
                <div className="ccm-footer">
                    <button className="imp-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="imp-save-btn" disabled={!canSave} onClick={save}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                        {isUpdate ? 'Update card' : 'Save card'}
                    </button>
                </div>
                <p className="bs-stripe-note">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    Encrypted and processed by Stripe
                </p>
            </div>
        </div>
    );
};

/* ── Confirm Plan Change Modal ── */
const ConfirmPlanModal = ({ currentPlan, currentInterval, newPlan, newInterval, onClose, onConfirm }) => {
    const currentPrice = currentInterval === 'monthly' ? currentPlan.monthly : currentPlan.yearly;
    const newPrice = newInterval === 'monthly' ? newPlan.monthly : newPlan.yearly;
    const isUpgrade = newPrice >= currentPrice;
    const fraction = CYCLE_DAYS_LEFT / CYCLE_TOTAL_DAYS;
    // Credit is always based on the unused portion of the current monthly cycle.
    const credit = currentPrice * fraction;
    // A switch to yearly billing charges the full annual price (a new, full-length period),
    // not a 30-day-scaled fraction of the monthly-equivalent rate — only a same-cycle
    // (monthly → monthly) switch prorates the new charge itself.
    const newCharge = newInterval === 'yearly' ? yearlyTotal(newPrice) : newPrice * fraction;
    const dueToday = newCharge - credit;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="ccm afm-modal" onClick={e => e.stopPropagation()}>
                <div className="ccm-header">
                    <div>
                        <p className="ccm-breadcrumb">Settings · Billing & Subscription</p>
                        <h2 className="ccm-title">Confirm {isUpgrade ? 'Upgrade' : 'Downgrade'}</h2>
                    </div>
                    <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
                </div>
                <div className="ccm-body">
                    <p className="bs-modal-note">
                        You'll get immediate access to {newPlan.name} features. We'll prorate the difference for the rest of this cycle.
                    </p>

                    <div className="bs-plan-compare">
                        <div className="bs-compare-box">
                            <span className="bs-compare-label">Current</span>
                            <div className="bs-compare-name">{currentPlan.name}</div>
                            <div className="bs-compare-price"><span className="bs-compare-amount">${currentPrice}</span><span className="bs-compare-per">/mo</span></div>
                            <div className="bs-compare-interval">Billed {currentInterval}</div>
                            {currentInterval === 'yearly' && <div className="bs-compare-total">${yearlyTotal(currentPrice).toLocaleString()}/yr total</div>}
                        </div>
                        <span className="bs-compare-arrow-wrap">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="bs-compare-arrow"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </span>
                        <div className="bs-compare-box new">
                            <span className="bs-compare-label">New</span>
                            <div className="bs-compare-name">{newPlan.name}</div>
                            <div className="bs-compare-price"><span className="bs-compare-amount">${newPrice}</span><span className="bs-compare-per">/mo</span></div>
                            <div className="bs-compare-interval">Billed {newInterval}</div>
                            {newInterval === 'yearly' && <div className="bs-compare-total">${yearlyTotal(newPrice).toLocaleString()}/yr total</div>}
                        </div>
                    </div>

                    <div className="bs-breakdown">
                        <div className="bs-breakdown-row">
                            <span>Days left in current cycle</span>
                            <span>{CYCLE_DAYS_LEFT} of {CYCLE_TOTAL_DAYS}</span>
                        </div>
                        <div className="bs-breakdown-row">
                            <span>Credit for unused time on current plan</span>
                            <span>−${credit.toFixed(2)}</span>
                        </div>
                        <div className="bs-breakdown-row">
                            <span>{newInterval === 'yearly' ? 'Full charge for new plan (billed yearly)' : 'Prorated charge for new plan'}</span>
                            <span>${newCharge.toFixed(2)}</span>
                        </div>
                        <div className="bs-breakdown-row total">
                            <span>Due today</span>
                            <span>${Math.max(dueToday, 0).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div className="ccm-footer">
                    <button className="imp-cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="imp-save-btn" onClick={onConfirm}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Confirm {isUpgrade ? 'Upgrade' : 'Downgrade'}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ── Cancel Subscription Modal ── */
const CancelModal = ({ plan, onClose, onConfirm }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="ccm afm-modal" onClick={e => e.stopPropagation()}>
            <div className="ccm-header">
                <div>
                    <p className="ccm-breadcrumb">Settings · Billing & Subscription</p>
                    <h2 className="ccm-title">Cancel Subscription</h2>
                </div>
                <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
            </div>
            <div className="ccm-body">
                <p className="bs-modal-note">
                    You'll keep {plan.name} access until <strong>{RENEW_DATE}</strong>. After that, this hub will be paused
                    and no further charges will be made. You can resume anytime before then.
                </p>
            </div>
            <div className="ccm-footer">
                <button className="imp-cancel-btn" onClick={onClose}>Keep subscription</button>
                <button className="imp-save-btn bs-danger-btn" onClick={onConfirm}>Cancel subscription</button>
            </div>
        </div>
    </div>
);

/* ── Remove Card Modal ── */
const RemoveCardModal = ({ card, onClose, onConfirm }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="ccm afm-modal" onClick={e => e.stopPropagation()}>
            <div className="ccm-header">
                <div>
                    <p className="ccm-breadcrumb">Settings · Billing & Subscription</p>
                    <h2 className="ccm-title">Remove Card</h2>
                </div>
                <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
            </div>
            <div className="ccm-body">
                <p className="bs-modal-note">
                    Remove the {card.brand} card ending in <strong>{card.last4}</strong>? This can't be undone.
                    {card.isDefault && ' Since this is your default card, another card on file will become the default.'}
                </p>
            </div>
            <div className="ccm-footer">
                <button className="imp-cancel-btn" onClick={onClose}>Keep card</button>
                <button className="imp-save-btn bs-danger-btn" onClick={onConfirm}>Remove card</button>
            </div>
        </div>
    </div>
);

/* ── Invoices Modal ── */
const InvoicesModal = ({ onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="ccm afm-modal" onClick={e => e.stopPropagation()}>
            <div className="ccm-header">
                <div>
                    <p className="ccm-breadcrumb">Settings · Billing & Subscription</p>
                    <h2 className="ccm-title">Invoices</h2>
                </div>
                <button className="ccm-close" onClick={onClose}><CloseIcon /></button>
            </div>
            <div className="ccm-body">
                <div className="bs-invoice-list">
                    {INVOICES.map(inv => (
                        <div className="bs-invoice-row" key={inv.id}>
                            <div className="bs-invoice-info">
                                <div className="bs-invoice-desc">{inv.desc}</div>
                                <div className="bs-invoice-date">{inv.date} · {inv.id}</div>
                            </div>
                            <span className="bs-invoice-badge">{inv.status}</span>
                            <span className="bs-invoice-amount">{inv.amount}</span>
                            <button className="users-icon-btn" data-tooltip="Download" onClick={() => downloadInvoice(inv)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div className="ccm-footer">
                <button className="imp-cancel-btn" onClick={onClose}>Close</button>
            </div>
        </div>
    </div>
);

const BillingSettingsView = () => {
    const [browseInterval, setBrowseInterval] = useState('monthly');
    const [activeInterval, setActiveInterval] = useState('monthly');
    const [activePlanId, setActivePlanId] = useState('growth');
    const [selectedPlan, setSelectedPlan] = useState('growth');
    const [billingEmail, setBillingEmail] = useState('welby@caseactive.com');
    const [saved, setSaved] = useState(false);
    const [status, setStatus] = useState('trial'); // 'trial' | 'active' | 'canceled'
    const [cards, setCards] = useState([]);
    const [addCardOpen, setAddCardOpen] = useState(false);
    const [updateCardTarget, setUpdateCardTarget] = useState(null);
    const [removeCardTarget, setRemoveCardTarget] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);
    const [invoicesOpen, setInvoicesOpen] = useState(false);

    const activePlan = PLANS.find(p => p.id === activePlanId);
    const newPlan = PLANS.find(p => p.id === selectedPlan);
    const activePrice = activeInterval === 'monthly' ? activePlan.monthly : activePlan.yearly;
    const hasUsableCard = cards.some(c => !c.disabled);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const addCard = (data) => {
        setCards(prev => [...prev, { ...data, id: `card-${Date.now()}`, isDefault: prev.length === 0, disabled: false }]);
    };

    const updateCard = (id, data) => {
        setCards(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    };

    const removeCard = (id) => {
        setCards(prev => {
            const removed = prev.find(c => c.id === id);
            const next = prev.filter(c => c.id !== id);
            if (removed?.isDefault && next.length > 0 && !next.some(c => c.isDefault)) {
                next[0] = { ...next[0], isDefault: true };
            }
            return next;
        });
        setRemoveCardTarget(null);
    };

    const makeDefault = (id) => {
        setCards(prev => prev.map(c => ({ ...c, isDefault: c.id === id })));
    };

    const toggleDisabled = (id) => {
        setCards(prev => {
            const target = prev.find(c => c.id === id);
            if (!target) return prev;
            const willDisable = !target.disabled;
            let next = prev.map(c => c.id === id ? { ...c, disabled: willDisable, isDefault: willDisable ? false : c.isDefault } : c);
            if (willDisable && target.isDefault) {
                const fallback = next.find(c => c.id !== id && !c.disabled);
                if (fallback) next = next.map(c => c.id === fallback.id ? { ...c, isDefault: true } : c);
            }
            return next;
        });
    };

    const confirmPlanChange = () => {
        setActivePlanId(selectedPlan);
        setActiveInterval(browseInterval);
        setConfirmOpen(false);
    };

    const confirmCancel = () => {
        setStatus('canceled');
        setCancelOpen(false);
    };

    const resumeSubscription = () => setStatus(hasUsableCard ? 'active' : 'trial');

    return (
        <div className="portal-content">

            <InfoBanner message="Billing & Subscription lets you manage your plan, payment method, and billing contact for this Hub." />

            <div className="gs-layout">

                {/* Status banner — only shown when there's something to act on */}
                {status === 'canceled' && (
                    <div className="bs-status-banner canceled">
                        <span className="bs-trial-icon canceled">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        </span>
                        <div className="bs-trial-body">
                            <div className="bs-trial-title canceled">Subscription canceled</div>
                            <div className="bs-trial-desc canceled">Your {activePlan.name} plan ends on {RENEW_DATE}. You can resume anytime before then.</div>
                        </div>
                        <button type="button" className="bs-trial-btn" onClick={resumeSubscription}>Resume subscription</button>
                    </div>
                )}

                {status === 'trial' && !hasUsableCard && (
                    <div className="bs-status-banner trial">
                        <span className="bs-trial-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </span>
                        <div className="bs-trial-body">
                            <div className="bs-trial-title">{TRIAL_DAYS_LEFT} days left in your trial</div>
                            <div className="bs-trial-desc">No card on file — add one before {TRIAL_END_DATE} to keep {activePlan.name} active.</div>
                            <div className="bs-trial-progress"><div className="bs-trial-progress-fill" style={{ width: `${100 - (TRIAL_DAYS_LEFT / TRIAL_DAYS_TOTAL) * 100}%` }} /></div>
                        </div>
                        <button type="button" className="bs-trial-btn" onClick={() => setAddCardOpen(true)}>Add a card</button>
                    </div>
                )}

                {status === 'trial' && hasUsableCard && (
                    <div className="bs-status-banner info">
                        <span className="bs-trial-icon info">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </span>
                        <div className="bs-trial-body">
                            <div className="bs-trial-title info">{TRIAL_DAYS_LEFT} days left in your trial</div>
                            <div className="bs-trial-desc info">Your card is on file — {activePlan.name} will continue automatically on {TRIAL_END_DATE}.</div>
                        </div>
                    </div>
                )}

                {/* Your Plan — current plan summary + change plan, in one flow */}
                <SectionCard title="Your Plan">
                    <div className="bs-current-plan-row">
                        <span className="bs-plan-avatar">{activePlan.name[0]}</span>
                        <div className="bs-current-plan-info">
                            <div className="bs-current-plan-name">
                                {activePlan.name} plan
                                <span className={`bs-status-pill ${status}`}>
                                    {status === 'trial' ? 'Trial' : status === 'canceled' ? 'Canceled' : 'Active'}
                                </span>
                            </div>
                            <div className="bs-current-plan-price">
                                <span className="bs-current-plan-amount">${activePrice}</span><span className="bs-current-plan-per">/mo</span>
                                {activeInterval === 'yearly' && <span className="bs-current-plan-yearly">(${yearlyTotal(activePrice).toLocaleString()}/yr)</span>}
                            </div>
                            <div className="bs-current-plan-meta">
                                Billed {activeInterval} · {status === 'canceled' ? `ends ${RENEW_DATE}` : `renews ${RENEW_DATE}`}
                            </div>
                        </div>
                        <div className="bs-current-plan-actions">
                            <button type="button" className="imp-cancel-btn" onClick={() => setInvoicesOpen(true)}>View invoices</button>
                        </div>
                    </div>

                    <div className="gs-divider" />

                    <p className="bs-change-plan-label">Change plan</p>

                    <div className="bs-segmented">
                        <button type="button" className={`bs-segmented-btn${browseInterval === 'monthly' ? ' active' : ''}`} onClick={() => setBrowseInterval('monthly')}>Monthly</button>
                        <button type="button" className={`bs-segmented-btn${browseInterval === 'yearly' ? ' active' : ''}`} onClick={() => setBrowseInterval('yearly')}>
                            Yearly <span className="bs-save-badge">2 months free</span>
                        </button>
                    </div>

                    <div className="bs-plan-grid">
                        {PLANS.map(p => (
                            <button
                                type="button"
                                key={p.id}
                                className={`bs-plan-card${selectedPlan === p.id ? ' selected' : ''}`}
                                onClick={() => setSelectedPlan(p.id)}
                            >
                                <div className="bs-plan-card-top">
                                    <span className="bs-plan-card-name">{p.name}</span>
                                    {p.id === activePlanId && <span className="bs-current-badge">Current</span>}
                                </div>
                                <div className="bs-plan-card-price">${browseInterval === 'monthly' ? p.monthly : p.yearly}/mo</div>
                                {browseInterval === 'yearly' && <div className="bs-plan-card-total">${yearlyTotal(p.yearly).toLocaleString()}/yr billed annually</div>}
                            </button>
                        ))}
                    </div>

                    <a className="bs-pricing-link" href="https://www.caseactive.com/pricing" target="_blank" rel="noopener noreferrer">
                        See full feature comparison &amp; plan details
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>

                    {(selectedPlan !== activePlanId || browseInterval !== activeInterval) && (
                        <div className="bs-review-bar">
                            <span>Switch to <strong>{newPlan.name}</strong>, billed {browseInterval}</span>
                            <div className="bs-review-actions">
                                <button type="button" className="bs-review-cancel" onClick={() => { setSelectedPlan(activePlanId); setBrowseInterval(activeInterval); }}>Cancel</button>
                                <button type="button" className="imp-save-btn" onClick={() => setConfirmOpen(true)}>Review change</button>
                            </div>
                        </div>
                    )}

                    {status !== 'canceled' && (
                        <button type="button" className="bs-cancel-link" onClick={() => setCancelOpen(true)}>Cancel subscription</button>
                    )}
                </SectionCard>

                {/* Payment Method */}
                <SectionCard title="Payment Method">
                    {cards.length > 0 ? (
                        <div className="bs-card-list">
                            {cards.map(c => (
                                <div className={`bs-card-list-row${c.disabled ? ' disabled' : ''}`} key={c.id}>
                                    <span className="bs-card-brand">{c.brand}</span>
                                    <div className="bs-card-info">
                                        <div className="bs-card-number">
                                            •••• •••• •••• {c.last4}
                                            {c.isDefault && <span className="bs-card-badge default">Default</span>}
                                            {c.disabled && <span className="bs-card-badge disabled">Disabled</span>}
                                        </div>
                                        <div className="bs-card-expiry">Expires {c.expiry}</div>
                                    </div>
                                    <div className="bs-card-actions">
                                        {!c.isDefault && !c.disabled && (
                                            <button type="button" className="bs-card-text-btn" onClick={() => makeDefault(c.id)}>Make default</button>
                                        )}
                                        <button type="button" className="users-icon-btn" data-tooltip="Edit" onClick={() => setUpdateCardTarget(c)}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                        </button>
                                        <button type="button" className="users-icon-btn" data-tooltip={c.disabled ? 'Enable' : 'Disable'} onClick={() => toggleDisabled(c.id)}>
                                            {c.disabled ? (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                            ) : (
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.9" y1="4.9" x2="19.1" y2="19.1"/></svg>
                                            )}
                                        </button>
                                        <button type="button" className="users-icon-btn delete" data-tooltip="Remove" onClick={() => setRemoveCardTarget(c)}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button type="button" className="bs-add-card-btn" onClick={() => setAddCardOpen(true)}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                Add another card
                            </button>
                        </div>
                    ) : (
                        <div className="bs-card-empty">
                            <div className="bs-card-empty-text">
                                <div className="bs-card-empty-title">No payment method on file</div>
                                <div className="bs-card-empty-desc">Add a card so your plan continues without interruption.</div>
                            </div>
                            <button type="button" className="imp-save-btn" onClick={() => setAddCardOpen(true)}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                Add a card
                            </button>
                        </div>
                    )}
                </SectionCard>

                {/* Billing Email */}
                <SectionCard title="Billing Email">
                    <div style={{ maxWidth: 420 }}>
                        <div className="gs-field">
                            <label className="gs-label">Invoices &amp; receipts go to</label>
                            <input className="gs-input" type="email" value={billingEmail} onChange={e => setBillingEmail(e.target.value)} />
                            <span className="gs-field-hint">Defaults to whoever created this hub. Update this if someone else handles your firm's invoices.</span>
                        </div>
                    </div>
                </SectionCard>

                {/* Save footer */}
                <div className="gs-footer">
                    <button type="button" className="gs-btn-save" onClick={handleSave}>
                        {saved
                            ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Saved</>
                            : 'Save changes'
                        }
                    </button>
                </div>

            </div>

            {addCardOpen && (
                <CardFormModal mode="add" onClose={() => setAddCardOpen(false)} onSave={addCard} />
            )}
            {updateCardTarget && (
                <CardFormModal
                    mode="update"
                    card={updateCardTarget}
                    onClose={() => setUpdateCardTarget(null)}
                    onSave={(data) => updateCard(updateCardTarget.id, data)}
                />
            )}
            {removeCardTarget && (
                <RemoveCardModal
                    card={removeCardTarget}
                    onClose={() => setRemoveCardTarget(null)}
                    onConfirm={() => removeCard(removeCardTarget.id)}
                />
            )}
            {confirmOpen && (
                <ConfirmPlanModal
                    currentPlan={activePlan}
                    currentInterval={activeInterval}
                    newPlan={newPlan}
                    newInterval={browseInterval}
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={confirmPlanChange}
                />
            )}
            {cancelOpen && (
                <CancelModal plan={activePlan} onClose={() => setCancelOpen(false)} onConfirm={confirmCancel} />
            )}
            {invoicesOpen && <InvoicesModal onClose={() => setInvoicesOpen(false)} />}
        </div>
    );
};

export default BillingSettingsView;
