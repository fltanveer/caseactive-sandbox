import { useState } from 'react';
import './SubscriptionFlow.css';

/* One subscription journey, shared by Settings › Billing and the Hub Settings
   modal, so cancelling means the same thing and says the same thing wherever
   it is reached. */

export const PLANS = [
    { id: 'starter', name: 'Starter', monthly: 49,  yearly: 41  },
    { id: 'growth',  name: 'Growth',  monthly: 149, yearly: 124 },
    { id: 'scale',   name: 'Scale',   monthly: 399, yearly: 333 },
];

export const RENEW_DATE = 'Sep 12, 2026';
export const READ_ONLY_DAYS = 30;
export const DELETE_AFTER_DAYS = 90;
export const WIN_BACK_PERCENT = 40;
export const WIN_BACK_MONTHS = 3;

const I = {
    close:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    check:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    lock:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    keep:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>,
    clock:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    pause:  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>,
    tag:    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41 12 22l-9-9V3h10l7.59 7.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    down:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
    call:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.95 3.59 2 2 0 0 1 3.92 1.4h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    warn:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

/* The reason decides which offer is worth making. A discount does nothing for
   someone whose case load simply ended. */
export const CANCEL_REASONS = [
    { id: 'expensive', label: 'Too expensive for what we use',     offer: 'discount' },
    { id: 'features',  label: 'Missing a feature we need',          offer: 'talk'     },
    { id: 'unused',    label: 'We are not using it enough',         offer: 'pause'    },
    { id: 'seasonal',  label: 'Our case load has ended for now',    offer: 'pause'    },
    { id: 'switching', label: 'Moving to another tool',             offer: 'discount' },
    { id: 'hard',      label: 'Too hard to set up or use',          offer: 'talk'     },
    { id: 'other',     label: 'Something else',                     offer: 'discount' },
];

const PAUSE_LENGTHS = [1, 2, 3];

/* What actually stops working. Written from the hub's own record so it reads
   as this firm's loss, not a generic feature list. */
const lossList = (hub) => ([
    { label: `${hub.cases} cases and their full history`,        detail: 'Read-only, then removed' },
    { label: `${hub.documents} documents, forms and e-signs`,    detail: 'No new signatures collected' },
    { label: `${hub.clients} clients lose portal access`,        detail: 'Lobby links stop working' },
    { label: `${hub.automations} automations stop running`,      detail: 'Reminders and intake routing' },
    { label: 'Convo calls, transcripts and AI summaries',        detail: 'No new calls can start' },
]);

const Modal = ({ title, breadcrumb, wide, onClose, children, footer }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className={`ccm sf-modal${wide ? ' sf-modal-wide' : ''}`} onClick={e => e.stopPropagation()}>
            <div className="ccm-header">
                <div>
                    <p className="ccm-breadcrumb">{breadcrumb}</p>
                    <h2 className="ccm-title">{title}</h2>
                </div>
                <button className="ccm-close" onClick={onClose}>{I.close}</button>
            </div>
            {children}
            <div className="ccm-footer sf-footer">{footer}</div>
        </div>
    </div>
);

/* ── The cancel journey ───────────────────────────────────────────────────
   reason → what you lose → an offer worth their while → confirm.
   "Cancel anyway" is present and plainly labelled on every step: the offer
   is a reason to stay, not a maze. */
export const CancelSubscriptionFlow = ({ hub, plan, interval, breadcrumb, onClose, onCancel, onPause, onDiscount, onDowngrade }) => {
    const [step, setStep] = useState(1);
    const [reason, setReason] = useState('');
    const [note, setNote] = useState('');
    const [pauseMonths, setPauseMonths] = useState(2);
    const [understood, setUnderstood] = useState(false);

    const price = interval === 'monthly' ? plan.monthly : plan.yearly;
    const offerKind = CANCEL_REASONS.find(r => r.id === reason)?.offer || 'discount';
    const cheaper = PLANS[Math.max(0, PLANS.findIndex(p => p.id === plan.id) - 1)];
    const canDowngrade = cheaper.id !== plan.id;
    const discounted = Math.round(price * (1 - WIN_BACK_PERCENT / 100));

    const steps = ['Reason', 'What changes', 'Options', 'Confirm'];

    const Rail = () => (
        <ol className="sf-steps">
            {steps.map((s, i) => (
                <li key={s} className={`sf-step${i + 1 === step ? ' current' : ''}${i + 1 < step ? ' done' : ''}`}>
                    <span className="sf-step-dot">{i + 1 < step ? I.check : i + 1}</span>
                    <span className="sf-step-label">{s}</span>
                </li>
            ))}
        </ol>
    );

    /* Step 1 — why */
    if (step === 1) {
        return (
            <Modal
                breadcrumb={breadcrumb} title="Cancel subscription" onClose={onClose}
                footer={<>
                    <button className="imp-cancel-btn" onClick={onClose}>Keep my subscription</button>
                    <button className="imp-save-btn" disabled={!reason} onClick={() => setStep(2)}>Continue</button>
                </>}
            >
                <div className="ccm-body sf-body">
                    <Rail />
                    <p className="sf-lede">Tell us what went wrong and we will show you the options that actually help. One question.</p>
                    <div className="sf-reasons">
                        {CANCEL_REASONS.map(r => (
                            <button key={r.id} className={`sf-reason${reason === r.id ? ' active' : ''}`} onClick={() => setReason(r.id)}>
                                <span className="sf-radio">{reason === r.id && <span className="sf-radio-dot" />}</span>
                                {r.label}
                            </button>
                        ))}
                    </div>
                    {reason && (
                        <div className="ccm-field">
                            <label className="ccm-label">Anything more? <span className="sf-optional">Optional</span></label>
                            <textarea className="ccm-textarea" placeholder="What would have kept you here?" value={note} onChange={e => setNote(e.target.value)} />
                        </div>
                    )}
                </div>
            </Modal>
        );
    }

    /* Step 2 — the honest part */
    if (step === 2) {
        return (
            <Modal
                breadcrumb={breadcrumb} title="What changes if you cancel" wide onClose={onClose}
                footer={<>
                    <button className="imp-cancel-btn" onClick={() => setStep(1)}>Back</button>
                    <button className="imp-save-btn" onClick={() => setStep(3)}>See my options</button>
                </>}
            >
                <div className="ccm-body sf-body">
                    <Rail />

                    <div className="sf-timeline">
                        <div className="sf-tl-item keep">
                            <span className="sf-tl-icon">{I.keep}</span>
                            <div>
                                <div className="sf-tl-title">Nothing changes until {RENEW_DATE}</div>
                                <div className="sf-tl-desc">You keep every {plan.name} feature for the rest of the cycle you have already paid for. No refund is needed and no further charge is made.</div>
                            </div>
                        </div>
                        <div className="sf-tl-item stop">
                            <span className="sf-tl-icon">{I.lock}</span>
                            <div>
                                <div className="sf-tl-title">From {RENEW_DATE} the hub is paused</div>
                                <div className="sf-tl-desc">A hub needs an active plan to run. Staff can sign in, but the workspace is read-only.</div>
                            </div>
                        </div>
                        <div className="sf-tl-item wait">
                            <span className="sf-tl-icon">{I.clock}</span>
                            <div>
                                <div className="sf-tl-title">Your data is kept for {DELETE_AFTER_DAYS} days</div>
                                <div className="sf-tl-desc">Read-only for {READ_ONLY_DAYS} days, exportable the whole time. Resume within {DELETE_AFTER_DAYS} days and everything comes back exactly as it was.</div>
                            </div>
                        </div>
                    </div>

                    <div className="sf-loss">
                        <span className="sf-section-label">What stops working</span>
                        <ul className="sf-loss-list">
                            {lossList(hub).map(l => (
                                <li key={l.label}>
                                    <span className="sf-loss-x">{I.close}</span>
                                    <span className="sf-loss-body">
                                        <span className="sf-loss-label">{l.label}</span>
                                        <span className="sf-loss-detail">{l.detail}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className="sf-note">Export everything first — Settings › Advanced › Export takes a full copy of cases, documents and contacts.</p>
                </div>
            </Modal>
        );
    }

    /* Step 3 — the offer that fits the reason given */
    if (step === 3) {
        const offers = [];
        if (offerKind === 'pause') {
            offers.push({
                id: 'pause', icon: I.pause, tone: 'primary',
                title: `Pause for ${pauseMonths} month${pauseMonths > 1 ? 's' : ''} instead`,
                body: 'Billing stops. Your cases, documents and settings stay exactly as they are, and the hub switches back on the day you return.',
                cta: 'Pause my subscription',
                action: () => onPause(pauseMonths),
                extra: (
                    <div className="sf-pause-picker">
                        {PAUSE_LENGTHS.map(m => (
                            <button key={m} className={`sf-pause-btn${pauseMonths === m ? ' active' : ''}`} onClick={() => setPauseMonths(m)}>{m} mo</button>
                        ))}
                    </div>
                ),
            });
        }
        if (offerKind === 'discount' || offerKind === 'pause') {
            offers.push({
                id: 'discount', icon: I.tag, tone: offerKind === 'discount' ? 'primary' : '',
                title: `${WIN_BACK_PERCENT}% off for ${WIN_BACK_MONTHS} months`,
                body: `Your ${plan.name} plan drops from $${price}/mo to $${discounted}/mo until the discount ends. Nothing else changes, and you can still cancel any time.`,
                cta: `Apply ${WIN_BACK_PERCENT}% off`,
                action: () => onDiscount({ percent: WIN_BACK_PERCENT, months: WIN_BACK_MONTHS }),
            });
        }
        if (offerKind === 'talk') {
            offers.push({
                id: 'talk', icon: I.call, tone: 'primary',
                title: 'Fifteen minutes with our team',
                body: 'Most of what people leave for is either already built or on the way. Book a call and we will set it up with you — the cancellation waits here until you decide.',
                cta: 'Book a call',
                action: () => window.open('https://www.caseactive.com/contact', '_blank', 'noopener'),
                secondary: true,
            });
            offers.push({
                id: 'discount', icon: I.tag,
                title: `${WIN_BACK_PERCENT}% off for ${WIN_BACK_MONTHS} months`,
                body: `While you decide, take $${discounted}/mo instead of $${price}/mo on ${plan.name}.`,
                cta: `Apply ${WIN_BACK_PERCENT}% off`,
                action: () => onDiscount({ percent: WIN_BACK_PERCENT, months: WIN_BACK_MONTHS }),
            });
        }
        if (canDowngrade) {
            offers.push({
                id: 'downgrade', icon: I.down,
                title: `Move down to ${cheaper.name} — $${interval === 'monthly' ? cheaper.monthly : cheaper.yearly}/mo`,
                body: `Keeps the hub open and your data live at a lower price. You can move back up to ${plan.name} whenever the work picks up.`,
                cta: `Switch to ${cheaper.name}`,
                action: () => onDowngrade(cheaper),
            });
        }

        return (
            <Modal
                breadcrumb={breadcrumb} title="Before you go" wide onClose={onClose}
                footer={<>
                    <button className="imp-cancel-btn" onClick={() => setStep(2)}>Back</button>
                    <button className="sf-plain-btn" onClick={() => setStep(4)}>No thanks, cancel anyway</button>
                </>}
            >
                <div className="ccm-body sf-body">
                    <Rail />
                    <p className="sf-lede">Based on what you told us, these are worth a look. Every one of them keeps your data live.</p>
                    <div className="sf-offers">
                        {offers.map(o => (
                            <div key={o.id} className={`sf-offer${o.tone === 'primary' ? ' primary' : ''}`}>
                                <span className="sf-offer-icon">{o.icon}</span>
                                <div className="sf-offer-body">
                                    <div className="sf-offer-title">{o.title}</div>
                                    <p className="sf-offer-text">{o.body}</p>
                                    {o.extra}
                                </div>
                                <button className={o.tone === 'primary' ? 'imp-save-btn sf-offer-cta' : 'imp-cancel-btn sf-offer-cta'} onClick={o.action}>{o.cta}</button>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        );
    }

    /* Step 4 — confirm, with the date said out loud one more time */
    return (
        <Modal
            breadcrumb={breadcrumb} title="Confirm cancellation" onClose={onClose}
            footer={<>
                <button className="imp-cancel-btn" onClick={() => setStep(3)}>Back</button>
                <button className="imp-save-btn sf-danger-btn" disabled={!understood} onClick={() => onCancel({ reason, note })}>
                    Cancel subscription
                </button>
            </>}
        >
            <div className="ccm-body sf-body">
                <Rail />
                <div className="sf-confirm-card">
                    <div className="sf-confirm-row"><span>Plan ending</span><strong>{plan.name} · ${price}/mo</strong></div>
                    <div className="sf-confirm-row"><span>Access until</span><strong>{RENEW_DATE}</strong></div>
                    <div className="sf-confirm-row"><span>Charged after that</span><strong>Nothing</strong></div>
                    <div className="sf-confirm-row"><span>Data kept until</span><strong>{DELETE_AFTER_DAYS} days after {RENEW_DATE}</strong></div>
                </div>
                <p className="sf-note sf-note-good">You can resume in one click any time before your data is removed — the hub comes back exactly as you left it.</p>
                <label className="sf-check">
                    <input type="checkbox" checked={understood} onChange={e => setUnderstood(e.target.checked)} />
                    <span>I understand the hub becomes read-only on {RENEW_DATE} and my team loses access to it.</span>
                </label>
            </div>
        </Modal>
    );
};

/* ── Resume ── */
export const ResumeSubscriptionModal = ({ plan, interval, breadcrumb, paused, onClose, onConfirm }) => {
    const price = interval === 'monthly' ? plan.monthly : plan.yearly;
    return (
        <Modal
            breadcrumb={breadcrumb} title={paused ? 'Resume from pause' : 'Resume subscription'} onClose={onClose}
            footer={<>
                <button className="imp-cancel-btn" onClick={onClose}>Not yet</button>
                <button className="imp-save-btn" onClick={onConfirm}>Resume {plan.name}</button>
            </>}
        >
            <div className="ccm-body sf-body">
                <p className="sf-lede">Your hub switches back on straight away and everything is where you left it.</p>
                <div className="sf-confirm-card">
                    <div className="sf-confirm-row"><span>Plan</span><strong>{plan.name} · ${price}/mo</strong></div>
                    <div className="sf-confirm-row"><span>Billing restarts</span><strong>{paused ? 'Today' : RENEW_DATE}</strong></div>
                    <div className="sf-confirm-row"><span>Your data</span><strong>Restored in full</strong></div>
                </div>
            </div>
        </Modal>
    );
};

/* ── One banner for every subscription state ──────────────────────────── */
export const SubscriptionStatusBanner = ({ status, plan, discount, pausedUntil, daysLeft, onResume, onAddCard }) => {
    if (status === 'canceled') {
        return (
            <div className="bs-status-banner canceled">
                <span className="bs-trial-icon canceled">{I.warn}</span>
                <div className="bs-trial-body">
                    <div className="bs-trial-title canceled">Subscription canceled</div>
                    <div className="bs-trial-desc canceled">
                        Your {plan.name} plan runs until {RENEW_DATE}, then the hub becomes read-only.
                        Resume before then and nothing is interrupted.
                    </div>
                </div>
                <button type="button" className="bs-trial-btn" onClick={onResume}>Resume subscription</button>
            </div>
        );
    }
    if (status === 'paused') {
        return (
            <div className="bs-status-banner info">
                <span className="bs-trial-icon">{I.pause}</span>
                <div className="bs-trial-body">
                    <div className="bs-trial-title">Subscription paused until {pausedUntil}</div>
                    <div className="bs-trial-desc">Billing is stopped and your data is safe. The hub is read-only until you come back.</div>
                </div>
                <button type="button" className="bs-trial-btn" onClick={onResume}>Resume now</button>
            </div>
        );
    }
    /* A discount taken during a trial still has to be visible — otherwise the
       offer looks like it did nothing. */
    if (discount && status !== 'canceled' && status !== 'paused') {
        return (
            <div className="bs-status-banner info">
                <span className="bs-trial-icon">{I.tag}</span>
                <div className="bs-trial-body">
                    <div className="bs-trial-title">{discount.percent}% off applied</div>
                    <div className="bs-trial-desc">Your next {discount.months} invoices on {plan.name} are discounted. Normal pricing returns after that — we will remind you first.</div>
                </div>
            </div>
        );
    }
    if (status === 'trial' && onAddCard) {
        return (
            <div className="bs-status-banner trial">
                <span className="bs-trial-icon">{I.clock}</span>
                <div className="bs-trial-body">
                    <div className="bs-trial-title">{daysLeft} days left in your trial</div>
                    <div className="bs-trial-desc">A hub needs an active plan to keep running. Add a card so nothing stops.</div>
                </div>
                <button type="button" className="bs-trial-btn" onClick={onAddCard}>Add payment method</button>
            </div>
        );
    }
    return null;
};

export const statusChip = (status) => {
    if (status === 'canceled') return { label: `Ends ${RENEW_DATE}`, tone: 'danger' };
    if (status === 'paused')   return { label: 'Paused',             tone: 'warn'   };
    if (status === 'trial')    return { label: 'Trial',              tone: 'warn'   };
    return { label: 'Active', tone: 'ok' };
};
