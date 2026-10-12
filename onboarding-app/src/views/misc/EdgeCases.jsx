/* Edge cases for the Misc component reference — the states that only show
   up once real firms and real clients use CaseActive: slow networks, two
   staff on one case, sign-in codes that expire, client SSNs, text messages
   that run long, deadlines that matter.

   Each export is one Misc section, built from the shared components. */

import { useEffect, useState } from 'react';
import FormField from '../../components/FormField';
import Notice from '../../components/Notice';
import StatusPill from '../../components/StatusPill';
import ToneIcon from '../../components/ToneIcon';
import { Section, Sub, Specimen } from './parts';
import '../../components/Button.css';
import './EdgeCases.css';

/* ── Loading ─────────────────────────────────────────────── */

const SkeletonRows = ({ rows = 4 }) => (
    <div className="ec-skel-table" aria-busy="true" aria-label="Loading cases">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="ec-skel-row">
                <span className="ec-skel" style={{ width: '34%' }} />
                <span className="ec-skel" style={{ width: '18%' }} />
                <span className="ec-skel ec-skel-pill" />
            </div>
        ))}
    </div>
);

const SaveStatus = ({ state, onRetry }) => (
    <span className={`ec-save ec-save-${state}`} role="status">
        {state === 'saving' && <><span className="ec-spinner" aria-hidden="true" />Saving…</>}
        {state === 'saved' && <><ToneIcon tone="success" size={14} />Saved</>}
        {state === 'failed' && <><ToneIcon tone="error" size={14} />Couldn't save. <button type="button" className="ec-inline-link" onClick={onRetry}>Retry</button></>}
        {state === 'offline' && <><ToneIcon tone="warning" size={14} />Offline. Saved on this device.</>}
    </span>
);

export const LoadingSection = () => {
    const [save, setSave] = useState('saved');
    const cycle = () => {
        setSave('saving');
        setTimeout(() => setSave('failed'), 1100);
    };
    return (
        <Section id="loading" title="Loading"
            desc="What shows while data is on its way. The page keeps its shape so nothing jumps when the data arrives.">
            <Sub title="First load of a list" note="Skeleton rows in the table's own layout. No spinner in the middle of an empty page.">
                <SkeletonRows />
            </Sub>
            <Sub title="Slow load" note="After 8 seconds, say so, and offer a way out. After 30, treat it as failed.">
                <Notice tone="neutral" compact>Still loading cases. This is taking longer than usual.</Notice>
            </Sub>
            <Sub title="Autosave (notes, case updates)" note="Quiet text next to the title, never a snackbar per keystroke. Failure stays until it's fixed.">
                <div className="misc-row">
                    <Specimen label="Saving"><SaveStatus state="saving" /></Specimen>
                    <Specimen label="Saved"><SaveStatus state="saved" /></Specimen>
                    <Specimen label="Failed"><SaveStatus state="failed" onRetry={() => {}} /></Specimen>
                    <Specimen label="Offline"><SaveStatus state="offline" /></Specimen>
                </div>
                <div className="misc-row">
                    <span className="ec-live-label">Live:</span>
                    <SaveStatus state={save} onRetry={cycle} />
                    <button className="btn btn-link misc-restore" onClick={cycle}>Simulate a save</button>
                </div>
            </Sub>
        </Section>
    );
};

/* ── Page states ─────────────────────────────────────────── */

const PageState = ({ tone, icon, title, children, actions, reference }) => (
    <div className={`ec-page ec-page-${tone}`}>
        <span className="ec-page-icon">{icon}</span>
        <p className="ec-page-title">{title}</p>
        <p className="ec-page-text">{children}</p>
        {actions && <div className="ec-page-actions">{actions}</div>}
        {reference && <p className="ec-page-ref">Reference {reference}. Share it with support if this keeps happening.</p>}
    </div>
);

const I = {
    search: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    lock: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>,
    file: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>,
    alert: <ToneIcon tone="error" size={22} />,
};

export const PageStatesSection = () => (
    <Section id="page-states" title="Page states"
        desc="When a whole page can't show what was asked for. Each one says why and gives one way forward. A link from an old email is the usual way people land here.">
        <div className="ec-page-grid">
            <PageState tone="neutral" icon={I.search} title="No cases match &quot;smth&quot;"
                actions={<button className="btn btn-secondary btn-sm">Clear search</button>}>
                Check the spelling, or search by case number or client email.
            </PageState>
            <PageState tone="neutral" icon={I.file} title="This case was closed"
                actions={<button className="btn btn-secondary btn-sm">Back to cases</button>}>
                Smith v. Jordan Trucking was closed on Sep 30. Ask your firm if you need a copy of anything.
            </PageState>
            <PageState tone="neutral" icon={I.lock} title="You don't have access to this case"
                actions={<button className="btn btn-secondary btn-sm">Request access</button>}>
                It belongs to another team at Sterling &amp; Brooks. An admin can add you.
            </PageState>
            <PageState tone="error" icon={I.alert} title="This page couldn't load" reference="CA-7F3K-21"
                actions={<button className="btn btn-primary btn-sm">Try again</button>}>
                Something went wrong on our side. Nothing you entered was lost.
            </PageState>
        </div>
        <Sub title="Empty list vs. no results" note="Different causes, different fixes. Only a filtered list offers Clear filters.">
            <div className="misc-dodont">
                <div className="ec-mini"><p className="ec-mini-title">No invoices yet</p><p className="ec-mini-text">Invoices you send to this client show up here.</p><button className="btn btn-primary btn-sm">New invoice</button></div>
                <div className="ec-mini"><p className="ec-mini-title">No invoices match these filters</p><p className="ec-mini-text">3 filters on: Unpaid, Over $5,000, Last 30 days.</p><button className="btn btn-secondary btn-sm">Clear filters</button></div>
            </div>
        </Sub>
    </Section>
);

/* ── Field edge cases ────────────────────────────────────── */

const SMS_LIMIT = 160;

export const FieldEdgeSection = () => {
    const [sms, setSms] = useState('Hi Jordan, your deposition is confirmed for Oct 21 at 10:00 AM at our Main St office. Bring photo ID and any new medical bills. Reply STOP to opt out.');
    const [ssnShown, setSsnShown] = useState(false);
    const over = sms.length - SMS_LIMIT;
    const smsMsg = over > 0
        ? { error: `${over} character${over === 1 ? '' : 's'} over. Texts longer than ${SMS_LIMIT} split into two and may arrive out of order.` }
        : sms.length >= SMS_LIMIT - 20
            ? { warning: `${SMS_LIMIT - sms.length} characters left.` }
            : { hint: `${SMS_LIMIT - sms.length} characters left.` };

    return (
        <Section id="field-edge" title="Field edge cases"
            desc="The cases a happy-path form misses. All of these use FormField; only the message changes.">
            <div className="misc-field-grid">
                <FormField label="Email (checked by the server)" required error="jordan@smithlaw.com is already on this hub. Invite them from Users instead.">
                    <input className="ccm-input" defaultValue="jordan@smithlaw.com" />
                </FormField>
                <FormField label="Client name" required success="Accepted. Names keep their apostrophes, hyphens and accents."
                    >
                    <input className="ccm-input" defaultValue="Siobhán O'Brien-Núñez" />
                </FormField>
                <FormField label="Date of incident" required error="Enter a date on or before today. The incident can't be in the future.">
                    <input className="ccm-input" defaultValue="Nov 3, 2026" />
                </FormField>
                <FormField label="Statute of limitations" warning="11 days left. Cases past this date usually can't be filed.">
                    <input className="ccm-input" defaultValue="Oct 23, 2026" />
                </FormField>
                <FormField label="Social Security number" readOnly hint="Only admins can see the full number. Every reveal is logged.">
                    <div className="ec-mask">
                        <input className="ccm-input" value={ssnShown ? '412-55-0193' : '•••-••-0193'} readOnly />
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSsnShown(v => !v)}>{ssnShown ? 'Hide' : 'Reveal'}</button>
                    </div>
                </FormField>
                <FormField label="Phone" hint="Any format. We store it as +1 (312) 555-0148.">
                    <input className="ccm-input" defaultValue="312.555.0148" />
                </FormField>
                <FormField label="Settlement amount" warning="That's 10× the case's usual range. Check the decimal point.">
                    <input className="ccm-input" defaultValue="$4,500,000.00" />
                </FormField>
                <FormField label="Card" error="The bank declined this card. Try another card, or ask your bank why.">
                    <input className="ccm-input" defaultValue="Visa •••• 4242" />
                </FormField>
            </div>
            <Sub title="Text message with a limit" note="Counter is grey, turns amber 20 characters out, red once over. The counter is the message.">
                <FormField label="Case update by text" {...smsMsg}>
                    <textarea className="ccm-textarea" value={sms} onChange={e => setSms(e.target.value)} />
                </FormField>
            </Sub>
            <Sub title="Rules">
                <ul className="misc-rules">
                    <li><strong>Server errors land on the field</strong> they're about, the same way as a typed-in mistake.</li>
                    <li><strong>One message per field.</strong> If two rules fail, show the one to fix first.</li>
                    <li><strong>Never reject real names.</strong> Apostrophes, hyphens, accents, one-word names, long names.</li>
                    <li><strong>Sensitive values are masked</strong> by default (SSN, date of birth, policy numbers). Reveal is per field and logged.</li>
                    <li><strong>Pasted values are trimmed</strong> before checking. A trailing space is not an error.</li>
                </ul>
            </Sub>
        </Section>
    );
};

/* ── Sign-in code & uploads ──────────────────────────────── */

const OtpRow = ({ digits = '      ', state, label }) => (
    <div className={`ec-otp ec-otp-${state}`} aria-label={label}>
        {digits.split('').map((d, i) => <span key={i} className="ec-otp-box">{d.trim()}</span>)}
    </div>
);

const ResendCountdown = () => {
    const [left, setLeft] = useState(30);
    useEffect(() => {
        if (left <= 0) return;
        const t = setTimeout(() => setLeft(l => l - 1), 1000);
        return () => clearTimeout(t);
    }, [left]);
    return left > 0
        ? <span className="ec-resend">Resend code in 0:{String(left).padStart(2, '0')}</span>
        : <button type="button" className="btn btn-link" onClick={() => setLeft(30)}>Resend code</button>;
};

const UploadRow = ({ name, size, state, progress, message, onRetry }) => (
    <div className={`ec-up ec-up-${state}`}>
        <span className="ec-up-icon">{state === 'done' ? <ToneIcon tone="success" size={16} /> : state === 'error' ? <ToneIcon tone="error" size={16} /> : I.file}</span>
        <div className="ec-up-body">
            <p className="ec-up-name"><span className="ec-trunc" title={name}>{name}</span><span className="ec-up-size">{size}</span></p>
            {state === 'uploading' && <div className="ec-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progress}%` }} /></div>}
            {message && <p className="ec-up-msg">{message}</p>}
        </div>
        {state === 'error' && onRetry && <button className="btn btn-secondary btn-sm" onClick={onRetry}>Retry</button>}
    </div>
);

export const FlowsSection = () => (
    <Section id="flows" title="Sign-in code & uploads"
        desc="Two flows clients hit on their own, often on a phone. Today the code screen has no error state at all, and a wrong code is never shown.">
        <Sub title="6-digit sign-in code">
            <div className="ec-otp-grid">
                <div className="ec-otp-case">
                    <OtpRow digits="12345 " state="default" label="Entering" />
                    <p className="ec-otp-msg is-hint">Sent to j•••@smithlaw.com. <ResendCountdown /></p>
                </div>
                <div className="ec-otp-case">
                    <OtpRow digits="123465" state="error" label="Wrong code" />
                    <p className="ec-otp-msg is-error"><ToneIcon tone="error" size={14} /><span>That code doesn't match. 4 tries left.</span></p>
                </div>
                <div className="ec-otp-case">
                    <OtpRow digits="123456" state="error" label="Expired" />
                    <p className="ec-otp-msg is-error"><ToneIcon tone="error" size={14} /><span>This code expired after 10 minutes. <button type="button" className="btn btn-link">Send a new code</button></span></p>
                </div>
                <div className="ec-otp-case">
                    <OtpRow state="locked" label="Locked" />
                    <p className="ec-otp-msg is-warning"><ToneIcon tone="warning" size={14} /><span>Too many tries. You can try again in 15 minutes, or call your firm.</span></p>
                </div>
            </div>
            <ul className="misc-rules">
                <li><strong>Clear the boxes and focus the first one</strong> after a wrong code, so the next try is one paste.</li>
                <li><strong>Pasting all six digits</strong> into any box fills the row.</li>
                <li><strong>Never say whether the email exists.</strong> "If that email is on a hub, a code is on its way."</li>
            </ul>
        </Sub>
        <Sub title="Document upload (medical records, police reports)">
            <div className="misc-stack">
                <UploadRow name="St-Marys-ER-records-2026-09-14-full-chart-and-imaging-summary.pdf" size="4.2 MB" state="uploading" progress={62} />
                <UploadRow name="Police report 26-118402.pdf" size="1.1 MB" state="done" message="Uploaded. Visible to staff only." />
                <UploadRow name="MRI-lumbar-series.dcm" size="214 MB" state="error" message="Too big. Files can be up to 50 MB; ask your firm for a secure link for imaging." />
                <UploadRow name="Pharmacy receipt.heic" size="2.8 MB" state="error" message="The connection dropped at 71%." onRetry={() => {}} />
                <UploadRow name="intake-notes.exe" size="88 KB" state="error" message="This file type isn't allowed. Use PDF, Word, JPG, PNG or HEIC." />
            </div>
        </Sub>
    </Section>
);

/* ── System messages ─────────────────────────────────────── */

export const SystemSection = () => (
    <Section id="system" title="System & team situations"
        desc="Messages caused by something other than the person in front of the screen: the network, the session, a colleague, a batch job.">
        <div className="misc-stack">
            <Notice variant="banner" tone="warning" title="You're offline">
                Changes are kept on this device and sent when you're back. Sending messages and e-signs waits until then.
            </Notice>
            <Notice tone="warning" title="Riley Chen changed this case 2 minutes ago" action={{ label: 'See changes', onClick: () => {} }}>
                Their update to Stage and Next court date came in while you were editing. Saving now would replace it.
            </Notice>
            <Notice tone="warning" title="18 of 20 clients were notified">
                2 clients have no email address: Avery Smithson, Sam Goldsmith. <button type="button" className="ntc-link">Add emails</button>
            </Notice>
            <Notice tone="error" title="Import stopped at row 412" action={{ label: 'Download error rows', onClick: () => {} }}>
                411 contacts were added. Row 412 has a date the importer can't read ("31/09/2026"). Nothing after it was imported.
            </Notice>
            <Notice tone="info" title="Payments are in test mode">
                Cards aren't charged. Switch to live mode in Payments → Settings when you're ready.
            </Notice>
            <Notice tone="neutral" title="Viewing as Jordan Smith (client)" action={{ label: 'Stop viewing as client', onClick: () => {} }}>
                This is exactly what Jordan sees in their portal. Nothing you click here is sent.
            </Notice>
        </div>
        <Sub title="Clients and staff read different words" note="Same failure, two audiences. Clients never see codes, field names or blame.">
            <div className="misc-dodont">
                <div className="ec-mini"><p className="ec-mini-tag">Staff</p><Notice tone="error" compact>E-sign "Release Authorization" failed to send: client email bounced (mailbox full).</Notice></div>
                <div className="ec-mini"><p className="ec-mini-tag">Client</p><Notice tone="warning" compact>We couldn't send you a document to sign. Your firm has been told and will be in touch.</Notice></div>
            </div>
        </Sub>
    </Section>
);

/* ── Content & overflow ──────────────────────────────────── */

export const ContentSection = () => (
    <Section id="content" title="Long content & numbers"
        desc="Real case names, emails and amounts break layouts that were drawn with “John Doe”.">
        <div className="misc-field-grid">
            <Sub title="Long names" note="Truncate in tables and pills with the full text on hover. Wrap in headings and detail views.">
                <table className="misc-hl-table ec-fixed">
                    <tbody>
                        <tr><td><span className="ec-trunc" title="In re: Midwest Rideshare Passenger Injury Litigation (MDL No. 3184) — Bellwether Group B">In re: Midwest Rideshare Passenger Injury Litigation (MDL No. 3184) — Bellwether Group B</span></td><td><StatusPill status="open" /></td></tr>
                        <tr><td><span className="ec-trunc" title="maria.delossantos-villareal@gmail.com">maria.delossantos-villareal@gmail.com</span></td><td><StatusPill tone="neutral" label="Client" /></td></tr>
                    </tbody>
                </table>
            </Sub>
            <Sub title="Money" note="Always 2 decimals and a currency sign. Refunds and credits are negative and say so.">
                <ul className="ec-money">
                    <li><span>Settlement</span><strong>$1,250,000.00</strong></li>
                    <li><span>Filing fee</span><strong>$405.00</strong></li>
                    <li><span>Refund</span><strong className="is-neg">−$75.00</strong></li>
                    <li><span>Balance</span><strong className="is-zero">$0.00 <StatusPill status="paid" /></strong></li>
                </ul>
            </Sub>
            <Sub title="Deadlines" note="Overdue is red. Within 7 days is amber. Show the date, not only “in 3 days”.">
                <div className="ec-deadlines">
                    <p><StatusPill tone="danger" label="Overdue 2 days" /> <span>Discovery responses · Oct 10</span></p>
                    <p><StatusPill tone="warning" label="Due today" /> <span>Medical authorization · Oct 12</span></p>
                    <p><StatusPill tone="warning" label="In 3 days" /> <span>Mediation brief · Oct 15</span></p>
                    <p><StatusPill tone="neutral" label="Oct 30" /> <span>Expert disclosure</span></p>
                </div>
            </Sub>
            <Sub title="Counts and dates" note="Spell out singular, cap big counts, and show time zones for anything scheduled.">
                <ul className="ec-money">
                    <li><span>1 document</span><span className="ec-muted">not “1 documents”</span></li>
                    <li><span className="hl-count">99+</span><span className="ec-muted">over 99 unread</span></li>
                    <li><span>Hearing Oct 21, 10:00 AM CT</span><span className="ec-muted">client may be elsewhere</span></li>
                    <li><span>—</span><span className="ec-muted">empty cell, not “null” or “N/A”</span></li>
                </ul>
            </Sub>
        </div>
    </Section>
);

/* ── Checklist ───────────────────────────────────────────── */

const CHECKLIST = [
    ['Every form', ['Empty submit', 'Wrong format', 'Server rejects a valid-looking value', 'Save fails (offline, timeout)', 'Double-click on Save sends once', 'Close with unsaved edits']],
    ['Every list', ['Loading', 'Empty', 'No results for a search or filter', 'Failed to load', 'One item / hundreds of items', 'Very long names']],
    ['Every action', ['No permission (hide or explain)', 'Read-only hub (trial ended)', 'Someone else changed it first', 'Partly succeeded', 'Can it be undone? If not, confirm']],
    ['Client portal', ['First visit, nothing yet', 'Case closed', 'Access removed', 'Phone only, slow network', 'Plain words, no codes']],
];

export const ChecklistSection = () => {
    const [done, setDone] = useState({});
    return (
        <Section id="checklist" title="Edge-case checklist"
            desc="Before a screen is called done, walk it through these. Ticks are only for this page view.">
            <div className="ec-check-grid">
                {CHECKLIST.map(([group, items]) => (
                    <div key={group} className="ec-check-group">
                        <p className="ec-check-title">{group}</p>
                        {items.map(it => {
                            const k = group + it;
                            return (
                                <label key={k} className="misc-check">
                                    <input type="checkbox" checked={!!done[k]} onChange={() => setDone(d => ({ ...d, [k]: !d[k] }))} />
                                    {it}
                                </label>
                            );
                        })}
                    </div>
                ))}
            </div>
        </Section>
    );
};
