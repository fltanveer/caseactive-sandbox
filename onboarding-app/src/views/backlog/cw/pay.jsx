/* CW-1 · 3 · Paying an invoice, as a client.

   The invoice beside a payment panel: saved cards with Remove, add a new
   card, the summary and Pay now. On a phone the panel goes under the
   invoice. Every state the ticket lists is a `state` here, and the
   read-only invoice afterwards takes any of the eight invoice statuses. */

import { useState } from 'react';
import StatusPill from '../../../components/StatusPill';
import Notice from '../../../components/Notice';
import { FIRM, SHORT, CLIENT, CLIENT_EMAIL, ATTORNEY, Icon, FirmMark, CasePage, DocBar } from '../ms/parts';

const INV = {
    no: 'INV-1046', title: 'Medical Records & Court Costs', issued: 'Jun 2, 2026', due: 'Jun 30, 2026',
    lines: [
        ['Medical records — Cedars-Sinai', 1, 85],
        ['Medical records — Kim Physical Therapy', 1, 40],
        ['Court filing fee, Superior Court of LA', 1, 435],
        ['Service of process', 2, 85],
    ],
    discountPct: 5, taxPct: 0,
};
const money = (n) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const subtotal = INV.lines.reduce((s, [, q, p]) => s + q * p, 0);
const discount = subtotal * INV.discountPct / 100;
const tax = (subtotal - discount) * INV.taxPct / 100;
const total = subtotal - discount + tax;

const CARDS = [
    { id: 'visa', brand: 'Visa', last4: '4242', exp: '08/29' },
    { id: 'mc', brand: 'Mastercard', last4: '5454', exp: '02/27' },
];

/* The eight statuses, each with the one line a client needs. */
const STATUSES = [
    ['open', `Waiting for payment. Due ${INV.due}.`],
    ['paid', 'Paid Jun 5, 2026 with Visa ending 4242.'],
    ['void', `Cancelled by ${SHORT} on Jun 8, 2026. There's nothing to pay.`],
    ['processing', 'A payment started on Jun 5 and is being confirmed. Please don\'t pay again.'],
    ['uncollectible', `${SHORT} has stopped asking for this payment. Contact them if you have questions.`],
    ['refundPending', `A refund of ${money(total)} to Visa ending 4242 is on its way. It can take 5–10 business days to show.`],
    ['refunded', `${money(total)} was refunded to Visa ending 4242 on Jun 12, 2026.`],
    ['refundFailed', `The refund to Visa ending 4242 didn't go through. Contact ${SHORT} so they can refund you another way.`],
];

const Totals = ({ paid }) => (
    <div className="ms-inv-totals">
        <span>Subtotal</span><span>{money(subtotal)}</span>
        <span>Discount ({INV.discountPct}%)</span><span>−{money(discount)}</span>
        <span>Tax ({INV.taxPct}%)</span><span>{money(tax)}</span>
        <strong>Total</strong><strong>{money(total)}</strong>
        {paid && <><span>Paid Jun 5, 2026</span><span>−{money(total)}</span><strong>Amount due</strong><strong>$0.00</strong></>}
    </div>
);

const Invoice = ({ stamp }) => (
    <div className="ms-paper ms-invoice cw-invoice">
        <div className="ms-inv-head">
            <div className="ms-inv-firm"><FirmMark size={36} /><div><strong>{FIRM}</strong><span>633 W 5th St, Los Angeles, CA 90071</span></div></div>
            <div className="ms-inv-meta"><span className="ms-inv-word">Invoice</span><span>{INV.no}</span></div>
        </div>
        <div className="ms-inv-parties">
            <div><em>Bill to</em><strong>{CLIENT}</strong><span>{CLIENT_EMAIL}</span></div>
            <div><em>Issued</em><span>{INV.issued}</span></div>
            <div><em>Due</em><span>{INV.due}</span></div>
        </div>
        <table className="ms-inv-table">
            <thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead>
            <tbody>{INV.lines.map(([d, q, p]) => <tr key={d}><td>{d}</td><td>{q}</td><td>{money(p)}</td><td>{money(q * p)}</td></tr>)}</tbody>
        </table>
        <Totals paid={stamp === 'paid'} />
        {stamp && <span className={`ms-inv-stamp cw-stamp is-${stamp}`}>{stamp === 'paid' ? 'Paid' : stamp === 'void' ? 'Void' : ''}</span>}
    </div>
);

const Summary = () => (
    <dl className="cw-pay-sum">
        <dt>Subtotal</dt><dd>{money(subtotal)}</dd>
        <dt>Discount</dt><dd>−{money(discount)}</dd>
        <dt>Tax</dt><dd>{money(tax)}</dd>
        <dt className="is-total">Amount due</dt><dd className="is-total">{money(total)}</dd>
    </dl>
);

const CardForm = () => (
    <div className="cw-newcard">
        <div className="ccm-field"><label className="ccm-label">Card number</label><input className="ccm-input" placeholder="1234 1234 1234 1234" /></div>
        <div className="ms-grid-3">
            <div className="ccm-field"><label className="ccm-label">Expiry</label><input className="ccm-input" placeholder="MM / YY" /></div>
            <div className="ccm-field"><label className="ccm-label">CVC</label><input className="ccm-input" placeholder="123" /></div>
            <div className="ccm-field"><label className="ccm-label">ZIP</label><input className="ccm-input" placeholder="90014" /></div>
        </div>
    </div>
);

/* state: choose | nocard | paying | declined | unconfirmed | notSetUp */
const PayPanel = ({ state: start, onPaid }) => {
    const [state, setState] = useState(start);
    const [cards, setCards] = useState(start === 'nocard' ? [] : CARDS);
    const [pick, setPick] = useState(start === 'declined' || start === 'paying' ? 'visa' : null);
    const [adding, setAdding] = useState(start === 'nocard');
    const [removing, setRemoving] = useState(null);
    const [tried, setTried] = useState(false);

    if (state === 'notSetUp') {
        return (
            <section className="cw-pay" aria-label="Payment">
                <span className="cw-pay-cap">Amount due</span>
                <p className="ms-pay-amount">{money(total)}</p>
                <div className="cw-pay-off">
                    <span className="cw-pay-off-ic"><Icon name="card" size={20} /></span>
                    <p className="cw-pay-off-title">You can&apos;t pay online yet</p>
                    <p className="ms-p ms-muted">{SHORT} hasn&apos;t finished setting up online payments. Ask {ATTORNEY} how to pay this invoice, or check back later.</p>
                </div>
            </section>
        );
    }
    if (state === 'unconfirmed') {
        return (
            <section className="cw-pay" aria-label="Payment">
                <Notice tone="warning" title="Your card may have been charged, but we couldn't confirm it">
                    Please don&apos;t pay again. This invoice updates as soon as the payment is confirmed. If it hasn&apos;t by tomorrow, contact {SHORT}.
                </Notice>
                <Summary />
            </section>
        );
    }

    const paying = state === 'paying';
    const pay = () => {
        if (!pick && !adding) { setTried(true); return; }
        setState('paying');
        setTimeout(onPaid, 1400);
    };

    return (
        <section className="cw-pay" aria-label="Payment">
            {state === 'declined' && <Notice tone="error" title="Your card was declined">Nothing was charged. Try another card, or add a new one.</Notice>}
            <p className="cw-pay-cap">Pay with</p>
            {cards.length > 0 && (
                <ul className={`cw-cards${tried && !pick && !adding ? ' is-error' : ''}`} role="radiogroup" aria-label="Saved cards">
                    {cards.map(c => (
                        <li key={c.id} className={pick === c.id && !adding ? 'is-on' : ''}>
                            {removing === c.id ? (
                                <div className="cw-card-confirm">
                                    <span>Remove {c.brand} ending {c.last4}?</span>
                                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setRemoving(null)}>Keep</button>
                                    <button type="button" className="btn btn-ghost btn-sm ms-danger-text" onClick={() => { setCards(cards.filter(x => x.id !== c.id)); if (pick === c.id) setPick(null); setRemoving(null); }}>Remove</button>
                                </div>
                            ) : (
                                <>
                                    <label className="cw-card">
                                        <input type="radio" name="cw-card" checked={pick === c.id && !adding} disabled={paying}
                                            onChange={() => { setPick(c.id); setAdding(false); setTried(false); }} />
                                        <span className={`cw-brand is-${c.id}`}>{c.brand === 'Visa' ? 'VISA' : 'MC'}</span>
                                        <span className="cw-card-body"><strong>{c.brand} ending {c.last4}</strong><span>Expires {c.exp}</span></span>
                                    </label>
                                    <button type="button" className="btn btn-link cw-card-remove" disabled={paying} onClick={() => setRemoving(c.id)}>Remove</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}
            {tried && !pick && !adding && <p className="ms-field-error">Choose a card, or add a new one.</p>}
            {cards.length > 0 && !adding && (
                <button type="button" className="cw-addcard" disabled={paying} onClick={() => { setAdding(true); setTried(false); }}><Icon name="plus" size={14} w={2.6} />Add a new card</button>
            )}
            {adding && (
                <>
                    {cards.length > 0 && <div className="cw-newcard-head"><span>New card</span><button type="button" className="btn btn-link" onClick={() => setAdding(false)}>Use a saved card</button></div>}
                    <CardForm />
                </>
            )}
            <Summary />
            <button type="button" className={`btn btn-primary ms-block${paying ? ' is-loading' : ''}`} onClick={pay}>Pay now</button>
            {paying
                ? <p className="ms-pay-secure" role="status">Paying {money(total)}. Keep this page open.</p>
                : <p className="ms-pay-secure"><Icon name="lock" size={12} />Card details go straight to the payment provider. {SHORT} never sees your card number.</p>}
        </section>
    );
};

const StatusPanel = ({ status }) => {
    const line = STATUSES.find(([k]) => k === status)[1];
    return (
        <section className="cw-pay" aria-label="Invoice status">
            <p className="cw-pay-cap">Status</p>
            <StatusPill status={status} />
            <p className="ms-p">{line}</p>
            {status === 'paid' && <button type="button" className="btn btn-secondary ms-block"><Icon name="down" />Download receipt</button>}
        </section>
    );
};

/* state: choose | nocard | paying | declined | unconfirmed | notSetUp | <invoice status> */
export const PayInvoice = ({ phone = false, state = 'choose', switcher = false }) => {
    const statusView = STATUSES.some(([k]) => k === state);
    const [status, setStatus] = useState(statusView ? state : null);
    const shown = status || (state === 'unconfirmed' ? 'processing' : 'open');
    return (
        <CasePage nav="Invoices" phone={phone} height={phone ? undefined : 880}
            head={<DocBar title={`${INV.no} · ${INV.title}`} status={shown}
                actions={<button type="button" className="btn btn-secondary"><Icon name="down" /><span className="cw-hide-phone">Download</span></button>} />}>
            {switcher && (
                <div className="cw-chips" role="group" aria-label="Show the invoice as">
                    {STATUSES.map(([k]) => (
                        <button key={k} type="button" aria-pressed={status === k} className={`cw-chip${status === k ? ' is-on' : ''}`} onClick={() => setStatus(k)}>
                            <StatusPill status={k} />
                        </button>
                    ))}
                </div>
            )}
            <div className="cw-paylayout">
                <div className="cw-paylayout-doc"><Invoice stamp={shown === 'paid' || shown === 'void' ? shown : null} /></div>
                {status ? <StatusPanel status={status} /> : <PayPanel state={state} onPaid={() => setStatus('paid')} />}
            </div>
        </CasePage>
    );
};
