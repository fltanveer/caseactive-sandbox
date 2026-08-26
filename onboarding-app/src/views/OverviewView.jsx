import { useState } from 'react';
import InfoBanner from '../components/InfoBanner';
import { EVENTS } from './EventsView';
import { FORMS_DATA } from './FormsView';
import { ESIGNS_DATA } from './ESignsView';
import { INVOICES_DATA, totalsFor } from './InvoicesView';
import { NOTES_DATA } from './NotesView';
import { TASKS_DATA } from './TasksView';
import './EventsView.css';
import './FormsView.css';
import './OverviewView.css';

const ICONS = {
    copy:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
    check: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    task:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    event: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    note:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
};

/* Local-time parse — `new Date('2026-08-26')` is UTC and can slip a day. */
const parseDate = iso => {
    const [y, m, d] = String(iso).split('-').map(Number);
    return new Date(y, m - 1, d);
};
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = iso => {
    const d = parseDate(iso);
    return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};
const TODAY = (() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); })();
const daysFromToday = iso => Math.round((parseDate(iso) - TODAY) / 86400000);
const money = n => `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;

/* The two identifiers and the case type the old Info page carried. */
const CASE_FILE = {
    hubId: 'ca-8c1e34cc8eaf81',
    caseId: 'cc-af7b8c3e9d11a9',
    type: 'General',
    opened: '2026-07-11',
};

const CopyValue = ({ value }) => {
    const [done, setDone] = useState(false);
    const copy = () => {
        navigator.clipboard?.writeText(value).catch(() => {});
        setDone(true);
        setTimeout(() => setDone(false), 1600);
    };
    return (
        <span className="ov-copy-row">
            <span className="ov-mono">{value}</span>
            <button className="ov-copy-btn" title="Copy" onClick={copy}>{done ? ICONS.check : ICONS.copy}</button>
        </span>
    );
};

const Fact = ({ label, children }) => (
    <div className="ov-fact">
        <span className="ov-fact-label">{label}</span>
        <span className="ov-fact-value">{children}</span>
    </div>
);

const Count = ({ value, label, hint, tone }) => (
    <div className={`ov-count${tone ? ` ov-count-${tone}` : ''}`}>
        <span className="ov-count-value">{value}</span>
        <span className="ov-count-label">{label}</span>
        <span className="ov-count-hint">{hint}</span>
    </div>
);

const OverviewView = ({ embedded = false, caseTitle = 'Case', caseUpdated = '', members = [] }) => {
    /* Everything below is counted from the same arrays the other case tabs
       render, so the page cannot claim work that does not exist. */
    const tasksDone = TASKS_DATA.filter(t => t.status === 'done');
    const tasksOpen = TASKS_DATA.filter(t => t.status !== 'done');
    const tasksOverdue = tasksOpen.filter(t => daysFromToday(t.date) < 0);
    const subAll = TASKS_DATA.flatMap(t => t.subtasks);
    const subDone = subAll.filter(s => s.status === 'done');

    const eventsUpcoming = EVENTS.filter(e => e.status === 'upcoming');
    const soonestEvent = [...eventsUpcoming].sort((a, b) => parseDate(a.date) - parseDate(b.date))[0];
    const formsOpen = FORMS_DATA.filter(f => !f.completed);
    const formsPublished = FORMS_DATA.filter(f => f.published);
    const signsAwaiting = ESIGNS_DATA.filter(e => e.published && !e.completed);
    const signsDraft = ESIGNS_DATA.filter(e => !e.published);

    const invoiceTotal = INVOICES_DATA.reduce((sum, r) => sum + totalsFor(r).total, 0);
    const invoicesPaid = INVOICES_DATA.filter(r => r.status === 'paid');
    const invoicesOutstanding = INVOICES_DATA.filter(r => r.status !== 'paid');
    const paidTotal = invoicesPaid.reduce((sum, r) => sum + totalsFor(r).total, 0);
    const outstandingTotal = invoicesOutstanding.reduce((sum, r) => sum + totalsFor(r).total, 0);
    const invoiceDrafts = INVOICES_DATA.filter(r => !r.published);

    const notesForClient = NOTES_DATA.filter(n => n.visibility === 'clients' || n.visibility === 'everyone');

    /* One timeline out of the dated things that actually exist. */
    const timeline = [
        ...tasksOpen.map(t => ({ key: `t-${t.id}`, kind: 'Task', label: t.title, date: t.date, meta: t.assignees.length ? t.assignees.join(', ') : 'Unassigned', icon: ICONS.task })),
        ...eventsUpcoming.map(e => ({ key: `e-${e.id}`, kind: 'Event', label: e.title, date: e.date, meta: e.timeLabel || '', icon: ICONS.event })),
        ...formsOpen.filter(f => f.published).map(f => ({ key: `f-${f.id}`, kind: 'Form', label: f.title, date: f.date, meta: `${f.submitted}/${f.total} submitted`, icon: ICONS.note })),
        ...signsAwaiting.map(s => ({ key: `s-${s.id}`, kind: 'E-sign', label: s.title, date: s.date, meta: `${s.submitted}/${s.total} signed`, icon: ICONS.note })),
    ].sort((a, b) => parseDate(a.date) - parseDate(b.date));

    const nextUp = timeline.find(i => daysFromToday(i.date) >= 0) || timeline[0];

    /* Names the case record actually uses, rather than a separate roster. */
    const contributors = [...new Set([
        ...TASKS_DATA.flatMap(t => [t.author, ...t.assignees]),
        ...NOTES_DATA.map(n => n.author),
        ...INVOICES_DATA.map(r => r.author),
    ])].filter(Boolean);
    const initials = name => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div className={`forms-page ov-page${embedded ? ' ov-page-embedded' : ''}`}>
            <InfoBanner message="Every figure on this page is counted live from the case's own tabs — tasks, events, forms, e-signs, invoices and notes." />

            {/* ── Hero ── */}
            <div className="ov-hero">
                <div className="ov-hero-top">
                    <div className="ov-hero-title">
                        <h2 className="ov-title">{caseTitle}</h2>
                        <div className="ov-badges">
                            <span className="ov-badge ov-badge-active">Open</span>
                            <span className="ov-badge">{CASE_FILE.type}</span>
                            <span className="ov-badge ov-badge-muted">{members.length} members</span>
                            {caseUpdated && <span className="ov-badge ov-badge-muted">Updated {caseUpdated}</span>}
                        </div>
                    </div>
                    <div className="ov-hero-meta">
                        <span className="ov-hero-meta-label">Opened</span>
                        <span className="ov-hero-meta-value">{fmt(CASE_FILE.opened)}</span>
                        <span className="ov-hero-meta-sub">{Math.max(0, -daysFromToday(CASE_FILE.opened))} days ago</span>
                    </div>
                </div>

                {/* Progress is the task list, not a stage anyone has to maintain. */}
                <div className="ov-progress">
                    <div className="ov-progress-head">
                        <span className="ov-progress-label">Task progress</span>
                        <span className="ov-progress-value">{tasksDone.length} of {TASKS_DATA.length} tasks done · {subDone.length}/{subAll.length} child tasks</span>
                    </div>
                    <span className="ov-progress-track">
                        <span className="ov-progress-fill" style={{ width: `${TASKS_DATA.length ? (tasksDone.length / TASKS_DATA.length) * 100 : 0}%` }} />
                    </span>
                </div>

                {nextUp && (
                    <div className="ov-alerts">
                        <div className={`ov-alert${daysFromToday(nextUp.date) < 0 ? ' ov-alert-danger' : daysFromToday(nextUp.date) <= 7 ? ' ov-alert-warn' : ''}`}>
                            {nextUp.icon}
                            <span>
                                <strong>Next up</strong> {nextUp.kind.toLowerCase()} “{nextUp.label}” · {fmt(nextUp.date)}
                                {daysFromToday(nextUp.date) < 0 ? ` (${Math.abs(daysFromToday(nextUp.date))} days late)` : ` (in ${daysFromToday(nextUp.date)} days)`}
                            </span>
                        </div>
                        {tasksOverdue.length > 0 && (
                            <div className="ov-alert ov-alert-danger">
                                {ICONS.task}
                                <span><strong>{tasksOverdue.length} overdue {tasksOverdue.length === 1 ? 'task' : 'tasks'}</strong> {tasksOverdue.map(t => t.title).join(', ')}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="ov-columns">
                <div className="ov-col">
                    {/* ── Counters ── */}
                    <section className="ov-card">
                        <div className="ov-card-head"><h3 className="ov-card-title">At a glance</h3></div>
                        <div className="ov-count-grid ov-count-grid-wide">
                            <Count value={tasksOpen.length} label="Open tasks"
                                hint={tasksOverdue.length ? `${tasksOverdue.length} overdue` : 'None overdue'}
                                tone={tasksOverdue.length ? 'warn' : ''} />
                            {/* Counted off the same `status` flag the Events tab filters on, so
                                the two screens can never disagree. */}
                            <Count value={eventsUpcoming.length} label="Upcoming events"
                                hint={eventsUpcoming.length ? `Earliest ${fmt(soonestEvent.date)}` : 'Nothing scheduled'} />
                            <Count value={formsOpen.length} label="Forms outstanding"
                                hint={`${formsPublished.length} of ${FORMS_DATA.length} published`} />
                            <Count value={signsAwaiting.length} label="Awaiting signature"
                                hint={signsDraft.length ? `${signsDraft.length} still draft` : 'No drafts'} />
                            <Count value={invoicesOutstanding.length} label="Unpaid invoices"
                                hint={money(outstandingTotal)} tone={invoicesOutstanding.length ? 'warn' : ''} />
                            <Count value={NOTES_DATA.length} label="Case notes"
                                hint={`${notesForClient.length} visible to the client`} />
                        </div>
                    </section>

                    {/* ── Timeline ── */}
                    <section className="ov-card">
                        <div className="ov-card-head">
                            <h3 className="ov-card-title">What is due</h3>
                            <span className="ov-card-note">Tasks, events, published forms and e-signs</span>
                        </div>
                        {timeline.length === 0 ? (
                            <p className="ov-empty">Nothing outstanding on this case.</p>
                        ) : (
                            <div className="ov-deadlines">
                                {timeline.map(item => {
                                    const left = daysFromToday(item.date);
                                    return (
                                        <div key={item.key} className="ov-deadline">
                                            <span className={`ov-days${left < 0 ? ' late' : left <= 14 ? ' soon' : ''}`}>
                                                {left < 0 ? `${Math.abs(left)}d late` : left === 0 ? 'today' : `${left}d`}
                                            </span>
                                            <span className="ov-deadline-body">
                                                <span className="ov-deadline-label">{item.label}</span>
                                                <span className="ov-deadline-meta">{fmt(item.date)}{item.meta ? ` · ${item.meta}` : ''}</span>
                                            </span>
                                            <span className="ov-chip">{item.kind}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* ── Money ── */}
                    <section className="ov-card">
                        <div className="ov-card-head">
                            <h3 className="ov-card-title">Costs and invoices</h3>
                            <span className="ov-card-note">{INVOICES_DATA.length} invoices on this case</span>
                        </div>
                        <div className="ov-money-grid">
                            <div className="ov-money">
                                <span className="ov-money-value">{money(invoiceTotal)}</span>
                                <span className="ov-money-label">Billed to date</span>
                                <span className="ov-money-hint">Across every invoice</span>
                            </div>
                            <div className="ov-money">
                                <span className="ov-money-value">{money(paidTotal)}</span>
                                <span className="ov-money-label">Paid</span>
                                <span className="ov-money-hint">{invoicesPaid.length} settled</span>
                            </div>
                            <div className={`ov-money${outstandingTotal ? ' ov-money-warn' : ''}`}>
                                <span className="ov-money-value">{money(outstandingTotal)}</span>
                                <span className="ov-money-label">Outstanding</span>
                                <span className="ov-money-hint">{invoicesOutstanding.map(r => r.status).join(', ') || 'Nothing owing'}</span>
                            </div>
                            <div className="ov-money">
                                <span className="ov-money-value">{invoiceDrafts.length}</span>
                                <span className="ov-money-label">Unpublished</span>
                                <span className="ov-money-hint">Not yet sent to the client</span>
                            </div>
                        </div>
                        <div className="ov-provider-head">
                            <span>INVOICE</span><span>NUMBER</span><span>AMOUNT</span><span>STATUS</span>
                        </div>
                        {INVOICES_DATA.map(r => (
                            <div key={r.id} className="ov-provider-row">
                                <span className="ov-provider-name" data-label="Invoice">{r.title}</span>
                                <span className="cases-cell-muted" data-label="Number">{r.invoiceNo || '—'}</span>
                                <span className="ov-provider-billed" data-label="Amount">{money(totalsFor(r).total)}</span>
                                <span data-label="Status">
                                    <span className={`ov-chip${r.status === 'paid' ? ' ov-chip-done' : r.status === 'open' ? ' ov-chip-live' : ''}`}>{r.status}</span>
                                </span>
                            </div>
                        ))}
                    </section>

                    {/* ── Recent notes ── */}
                    <section className="ov-card">
                        <div className="ov-card-head">
                            <h3 className="ov-card-title">Latest notes</h3>
                            <span className="ov-card-note">{NOTES_DATA.length} on file</span>
                        </div>
                        <div className="ov-note-list">
                            {NOTES_DATA.slice(0, 4).map(n => (
                                <div key={n.id} className="ov-note">
                                    <span className="ov-note-body">
                                        <span className="ov-note-title">{n.title}</span>
                                        <span className="ov-note-meta">{n.author} · {n.updated}{n.media.length ? ` · ${n.media.length} attachment${n.media.length > 1 ? 's' : ''}` : ''}</span>
                                    </span>
                                    <span className={`nt-vis-badge nt-vis-${n.visibility}`}>{n.visibility}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="ov-col ov-col-side">
                    {/* ── Members ── */}
                    <section className="ov-card">
                        <div className="ov-card-head"><h3 className="ov-card-title">Case members</h3></div>
                        {members.length === 0 ? (
                            <p className="ov-empty">No members on this case.</p>
                        ) : (
                            <div className="ov-team">
                                {members.map(m => (
                                    <div key={m.name} className="ov-member">
                                        <span className="ov-avatar">{initials(m.name)}</span>
                                        <span className="ov-member-body">
                                            <span className="ov-member-name">{m.name}</span>
                                            <span className="ov-member-role">{m.role}</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* ── People doing the work ── */}
                    <section className="ov-card">
                        <div className="ov-card-head">
                            <h3 className="ov-card-title">Working on this case</h3>
                            <span className="ov-card-note">From tasks, notes and invoices</span>
                        </div>
                        <div className="ov-team">
                            {contributors.map(name => {
                                const assigned = TASKS_DATA.filter(t => t.assignees.includes(name) && t.status !== 'done').length;
                                return (
                                    <div key={name} className="ov-member">
                                        <span className="ov-avatar">{initials(name)}</span>
                                        <span className="ov-member-body">
                                            <span className="ov-member-name">{name}</span>
                                            <span className="ov-member-role">{assigned ? `${assigned} open task${assigned > 1 ? 's' : ''}` : 'No open tasks'}</span>
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* ── Identifiers — carried over from the old Info page ── */}
                    <section className="ov-card ov-ids">
                        <div className="ov-card-head"><h3 className="ov-card-title">Identifiers</h3></div>
                        <div className="ov-fact-grid ov-fact-grid-1">
                            <Fact label="Hub ID"><CopyValue value={CASE_FILE.hubId} /></Fact>
                            <Fact label="Case ID"><CopyValue value={CASE_FILE.caseId} /></Fact>
                            <Fact label="Case type">{CASE_FILE.type}</Fact>
                            <Fact label="Date opened">{fmt(CASE_FILE.opened)}</Fact>
                            <Fact label="Title">{caseTitle}</Fact>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default OverviewView;
