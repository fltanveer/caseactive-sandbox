/* AC-1 · 1 · The Hub Settings window on the account site: a member's own
   settings for one hub they belong to.

   Four tabs, and who sees which: a hub Admin has no Permissions tab, a
   Client has no Calendar tab, Managers and Staff see all four. Notifications
   only shows while the hub has access. Drawn over the sandbox's own Hubs
   list on AccountShell, since ca-account is not in this codebase. */

import { useState } from 'react';
import Notice from '../../../components/Notice';
import StatusPill from '../../../components/StatusPill';
import SearchableSelect from '../../../components/SearchableSelect';
import HubsPage from '../../HubsPage';
import { AccountShell, Phone, Proposal } from '../Shell';
import { FIRM, Icon, Dialog, NotBuilt } from '../ms/parts';

const HUB = { id: 'ca-1f07d2a9b3c4e5', name: FIRM, website: 'https://sterlingbrooks.law' };

const tabsFor = (role, removed) => [
    'Info',
    !removed && 'Notifications',
    role !== 'admin' && 'Permissions',
    role !== 'client' && 'Calendar',
].filter(Boolean);

/* ── Info ── */
const Info = () => (
    <dl className="ac-kv">
        <div><dt>Company ID</dt><dd><code className="ms-code">{HUB.id}</code></dd></div>
        <div><dt>Company name</dt><dd>{HUB.name}</dd></div>
        <div><dt>Website</dt><dd><a href="#site" onClick={e => e.preventDefault()}>{HUB.website.replace('https://', '')}</a></dd></div>
    </dl>
);

/* ── Notifications ── */
const KINDS = ['Posts', 'Forms', 'Signatures', 'Invoices', 'Events', 'Tasks'];

const Notifications = ({ state = 'ready' }) => {
    const [on, setOn] = useState(['Posts', 'Forms', 'Signatures', 'Invoices', 'Events']);
    const [saved, setSaved] = useState(false);
    if (state === 'loading') {
        return (
            <div className="ac-pane" aria-busy="true" aria-label="Loading notification settings">
                {KINDS.map(k => <span key={k} className="cw-skel-bar ac-skel-row" />)}
            </div>
        );
    }
    if (state === 'failed') {
        return (
            <div className="ac-pane">
                <Notice tone="error" title="Your notification settings couldn't be loaded">Nothing has changed. Try again in a moment.</Notice>
                <button type="button" className="btn btn-secondary ac-self-start"><Icon name="refresh" size={14} />Try again</button>
            </div>
        );
    }
    return (
        <div className="ac-pane">
            <p className="ms-p ms-muted">Email me when {HUB.name} adds or changes:</p>
            <div className="ac-checks">
                {KINDS.map(k => (
                    <label key={k} className="ac-check">
                        <input type="checkbox" checked={on.includes(k)} onChange={() => { setSaved(false); setOn(on.includes(k) ? on.filter(x => x !== k) : [...on, k]); }} />
                        {k}
                    </label>
                ))}
            </div>
            <div className="ac-foot">
                {saved && <span className="ap-sign is-ok" role="status"><Icon name="check" size={13} w={2.8} />Saved</span>}
                <button type="button" className="btn btn-primary" onClick={() => setSaved(true)}>Save</button>
            </div>
        </div>
    );
};

/* ── Permissions ── */
const SHARED = [
    ['Your name and profile photo', 'Shown on your cases and messages'],
    ['Your email address and phone number', 'So the firm can reach you'],
    ['Your time zone and language', 'So times and messages read right for you'],
];

const Permissions = ({ removed: start, onRemove }) => {
    const [removed, setRemoved] = useState(start);
    const [confirm, setConfirm] = useState(false);
    if (removed) {
        return (
            <div className="ac-pane">
                <div className="ac-removed">
                    <span className="ac-removed-ic"><Icon name="lock" size={20} /></span>
                    <div>
                        <p className="ac-removed-title">You removed {HUB.name}&apos;s access</p>
                        <p className="ms-p ms-muted">They keep your information as it was, and get no changes to it until you approve access again.</p>
                    </div>
                </div>
                <button type="button" className="btn btn-primary ac-self-start" onClick={() => { setRemoved(false); onRemove?.(false); }}>Approve Access</button>
            </div>
        );
    }
    return (
        <div className="ac-pane">
            <p className="ms-p ms-muted">What {HUB.name} can see of your information:</p>
            <ul className="ac-shared">
                {SHARED.map(([t, d]) => <li key={t}><span className="ms-perm-ic"><Icon name="check" size={13} w={2.8} /></span><span><strong>{t}</strong><em>{d}</em></span></li>)}
            </ul>
            <div className="ac-danger">
                <div><strong>Remove access</strong><span>{HUB.name} stops seeing changes to your information.</span></div>
                <button type="button" className="btn btn-secondary ms-danger-outline" onClick={() => setConfirm(true)}>Remove Access</button>
            </div>
            {confirm && (
                <Dialog title={`Remove ${HUB.name}'s access?`} width={480} onClose={() => setConfirm(false)} className="ac-nested"
                    footer={<>
                        <button type="button" className="btn btn-secondary" onClick={() => setConfirm(false)}>Keep access</button>
                        <button type="button" className="btn btn-danger" onClick={() => { setConfirm(false); setRemoved(true); onRemove?.(true); }}>Remove Access</button>
                    </>}>
                    <p className="ms-p">They keep your information as it is now and get no changes to it until you approve access again. You can do that from this tab at any time.</p>
                </Dialog>
            )}
        </div>
    );
};

/* A Client can't remove or approve a hub's access; the firm manages that.
   What a Client can do is stop the hub's emails, so that is the action on
   their tab, and Notifications is where they come back on. */
const ClientPermissions = ({ unsubscribed: start, onNotifications }) => {
    const [out, setOut] = useState(Boolean(start));
    const [confirm, setConfirm] = useState(false);
    return (
        <div className="ac-pane">
            <p className="ms-p ms-muted">What {HUB.name} can see of your information:</p>
            <ul className="ac-shared">
                {SHARED.map(([t, d]) => <li key={t}><span className="ms-perm-ic"><Icon name="check" size={13} w={2.8} /></span><span><strong>{t}</strong><em>{d}</em></span></li>)}
            </ul>
            <p className="ms-small ms-muted ac-note"><Icon name="lock" size={12} />{HUB.name} manages access to your information. Contact them to change it.</p>
            {out ? (
                <div className="ac-removed">
                    <span className="ac-removed-ic"><Icon name="mail" size={20} /></span>
                    <div>
                        <p className="ac-removed-title">You&apos;re unsubscribed from {HUB.name}&apos;s emails</p>
                        <p className="ms-p ms-muted">You can still see everything here. Turn emails back on in Notifications.</p>
                        <button type="button" className="btn btn-link ac-self-start" onClick={onNotifications}>Go to Notifications</button>
                    </div>
                </div>
            ) : (
                <div className="ac-danger is-soft">
                    <div><strong>Unsubscribe</strong><span>Stop getting emails from {HUB.name}. You can still see everything here.</span></div>
                    <button type="button" className="btn btn-secondary" onClick={() => setConfirm(true)}>Unsubscribe</button>
                </div>
            )}
            {confirm && (
                <Dialog title={`Unsubscribe from ${HUB.name}'s emails?`} width={480} onClose={() => setConfirm(false)}
                    footer={<>
                        <button type="button" className="btn btn-secondary" onClick={() => setConfirm(false)}>Keep emails</button>
                        <button type="button" className="btn btn-primary" onClick={() => { setConfirm(false); setOut(true); }}>Unsubscribe</button>
                    </>}>
                    <p className="ms-p">You&apos;ll stop getting emails about your case. Everything is still here when you sign in, and you can turn emails back on in Notifications.</p>
                </Dialog>
            )}
        </div>
    );
};

/* ── Calendar ── */
const DAYS = [['Monday', true, '09:00', '17:00'], ['Tuesday', true, '09:00', '17:00'], ['Wednesday', true, '09:00', '17:00'],
    ['Thursday', true, '09:00', '17:00'], ['Friday', true, '09:00', '15:00'], ['Saturday', false, '', ''], ['Sunday', false, '', '']];
const TIMES = ['08:00', '09:00', '10:00', '12:00', '13:00', '15:00', '17:00', '18:00'];
const label12 = (t) => { const [h] = t.split(':').map(Number); return `${((h + 11) % 12) + 1}:00 ${h < 12 ? 'AM' : 'PM'}`; };

const Calendar = ({ state = 'connected' }) => {
    const [connected, setConnected] = useState(state !== 'disconnected');
    const [cals, setCals] = useState(state === 'noCalendar' ? [] : ['Work']);
    const [days, setDays] = useState(state === 'badHours' ? DAYS.map((d, i) => (i === 2 ? [d[0], true, '17:00', '09:00'] : d)) : DAYS);
    const [holidays, setHolidays] = useState(['Jul 3, 2026', 'Nov 26, 2026']);
    const [tried, setTried] = useState(state === 'noCalendar' || state === 'badHours');
    const bad = (d) => d[1] && d[2] && d[3] && d[3] <= d[2];

    if (!connected) {
        return (
            <div className="ac-pane ac-cal-empty">
                <span className="ac-removed-ic is-cal"><Icon name="cal" size={20} /></span>
                <p className="ac-removed-title">No calendar connected</p>
                <p className="ms-p ms-muted">Connect your calendar so {HUB.name} only offers times you&apos;re free.</p>
                <button type="button" className="btn btn-primary" onClick={() => setConnected(true)}>Connect Calendar</button>
            </div>
        );
    }
    const setDay = (i, k, v) => setDays(days.map((d, j) => (j === i ? Object.assign([...d], { [k]: v }) : d)));
    return (
        <div className="ac-pane">
            <div className="ac-cal-conn">
                <span className="ms-cal-logo is-g">G</span>
                <div><strong>marcus.bell@sterlingbrooks.law</strong><span className="ms-muted">Google Calendar</span></div>
                <StatusPill status="connected" />
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConnected(false)}>Disconnect</button>
            </div>

            <fieldset className="ac-fieldset">
                <legend>Calendars used for your availability</legend>
                <div className={`ac-checks is-col${tried && !cals.length ? ' is-error' : ''}`}>
                    {['Work', 'Personal', 'Holidays in United States'].map(c => (
                        <label key={c} className="ac-check">
                            <input type="checkbox" checked={cals.includes(c)} onChange={() => setCals(cals.includes(c) ? cals.filter(x => x !== c) : [...cals, c])} />{c}
                        </label>
                    ))}
                </div>
                {tried && !cals.length && <p className="ms-field-error">Choose at least one calendar.</p>}
            </fieldset>

            <fieldset className="ac-fieldset">
                <legend>Hours</legend>
                <div className="ac-hours">
                    {days.map((d, i) => (
                        <div key={d[0]} className={`ac-day${tried && bad(d) ? ' is-error' : ''}`}>
                            <label className="ac-check ac-day-name">
                                <input type="checkbox" checked={d[1]} onChange={() => setDay(i, 1, !d[1])} />{d[0]}
                            </label>
                            {d[1] ? (
                                <>
                                    <SearchableSelect className="ccm-select ac-time" value={d[2] || '09:00'} aria-label={`${d[0]} from`} onChange={e => setDay(i, 2, e.target.value)}>
                                        {TIMES.map(t => <option key={t} value={t}>{label12(t)}</option>)}
                                    </SearchableSelect>
                                    <span className="ms-muted">to</span>
                                    <SearchableSelect className="ccm-select ac-time" value={d[3] || '17:00'} aria-label={`${d[0]} until`} onChange={e => setDay(i, 3, e.target.value)}>
                                        {TIMES.map(t => <option key={t} value={t}>{label12(t)}</option>)}
                                    </SearchableSelect>
                                </>
                            ) : <span className="ms-muted ac-day-off">Unavailable</span>}
                            {tried && bad(d) && <p className="ms-field-error ac-day-err">Until must be later than From.</p>}
                        </div>
                    ))}
                </div>
            </fieldset>

            <fieldset className="ac-fieldset">
                <legend>Holidays</legend>
                <div className="ms-chips">
                    {holidays.map(h => (
                        <span key={h} className="ms-chip">{h}<button type="button" aria-label={`Remove ${h}`} onClick={() => setHolidays(holidays.filter(x => x !== h))}><Icon name="x" size={11} w={2.6} /></button></span>
                    ))}
                    <button type="button" className="ms-chip is-add"><Icon name="plus" size={12} w={2.6} />Add date</button>
                </div>
            </fieldset>

            <div className="ac-foot">
                <button type="button" className="btn btn-primary" onClick={() => setTried(true)}>Save</button>
            </div>
        </div>
    );
};

const HubSettingsDialog = ({ role, tab: start, removed: startRemoved, unsubscribed, notif, cal }) => {
    const client = role === 'client';
    const [removed, setRemoved] = useState(Boolean(startRemoved) && !client);
    const tabs = tabsFor(role, removed);
    const [tab, setTab] = useState(tabs.includes(start) ? start : tabs[0]);
    const shown = tabs.includes(tab) ? tab : 'Info';
    return (
        <Dialog title="Settings" sub={HUB.name} width={680} onClose={() => {}} className="ms-hs ac-hs"
            footer={<button type="button" className="btn btn-secondary">Close</button>}>
            <div className="ms-tabs" role="tablist">
                {tabs.map(t => (
                    <button key={t} type="button" role="tab" aria-selected={shown === t} className={`ms-tab${shown === t ? ' is-on' : ''}`} onClick={() => setTab(t)}>{t}</button>
                ))}
            </div>
            <div className="ms-hs-body">
                {shown === 'Info' && <Info />}
                {shown === 'Notifications' && <Notifications state={notif} />}
                {shown === 'Permissions' && (client
                    ? <ClientPermissions unsubscribed={unsubscribed} onNotifications={() => setTab('Notifications')} />
                    : <Permissions removed={removed} onRemove={setRemoved} />)}
                {shown === 'Calendar' && <Calendar state={cal} />}
            </div>
        </Dialog>
    );
};

/* role: admin | manager | staff | client */
export const HubSettings = ({ role = 'staff', tab = 'Info', removed, unsubscribed, notif, cal, phone = false }) => {
    const frame = (
        <div className="ms-acct ac-acct">
            <AccountShell narrow={phone}>
                <div className="tk-mount"><HubsPage embedded /></div>
            </AccountShell>
            <Proposal instead={<div className="ms-acct-today"><NotBuilt what="Hub Settings window" today="ca-account isn't in this codebase. EX-1 has a drawing of the live Info tab only." /></div>}>
                <HubSettingsDialog key={`${role}-${tab}-${removed}-${unsubscribed}-${notif}-${cal}`} role={role} tab={tab} removed={removed} unsubscribed={unsubscribed} notif={notif} cal={cal} />
            </Proposal>
        </div>
    );
    return phone ? <Phone>{frame}</Phone> : frame;
};
