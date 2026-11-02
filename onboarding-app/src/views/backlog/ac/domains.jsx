/* AC-1 · 2 · Domains, from the footer link on the account site.

   Kept from today: Active and Pending tabs, New, and a table of domain,
   TXT value with copy, hub, a single sign-on switch, and Edit, Reset and
   Delete; the new domain window; the edit page with manual sign-in,
   left-out emails, hub and the SAML metadata upload. Added: words for
   every state, a title on the edit page, and "Copied" in place of the
   browser alert. */

import { useState } from 'react';
import Notice from '../../../components/Notice';
import ConfirmDelete from '../../../components/DeleteConfirmModal';
import SearchableSelect from '../../../components/SearchableSelect';
import { AccountShell, Phone } from '../Shell';
import { FIRM, Icon, Dialog, Designed } from '../ms/parts';

const HUBS = [FIRM, 'Harlow Mass Tort Group'];

const DOMAINS = {
    active: [
        { host: 'sterlingbrooks.law', txt: 'ca-verify=8f21c0e9b7d4', hub: FIRM, sso: true, metadata: true },
        { host: 'sterlingbrooks.com', txt: 'ca-verify=1a9e44c03f72', hub: FIRM, sso: false, metadata: false },
    ],
    pending: [
        { host: 'harlowtort.com', txt: 'ca-verify=77c2b0d915ae', hub: 'Harlow Mass Tort Group', sso: false, metadata: false },
    ],
};

const Switch = ({ on, disabled, label, onClick }) => (
    <button type="button" className={`gs-toggle${on ? ' on' : ''}`} aria-pressed={on} aria-label={label} disabled={disabled} onClick={onClick}>
        <span className="gs-toggle-knob" />
    </button>
);

const Txt = ({ value }) => {
    const [copied, setCopied] = useState(false);
    return (
        <span className="ac-txt">
            <code>{value}</code>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }} aria-label={`Copy ${value}`} title="Copy">
                <Icon name={copied ? 'check' : 'copy'} size={13} />{copied && 'Copied'}
            </button>
        </span>
    );
};

const Row = ({ d, onDelete, onSwitchOff, onEdit }) => (
    <div className="ac-drow" role="row">
        <span className="ac-dhost" data-label="Domain"><Icon name="globe" size={15} />{d.host}</span>
        <span data-label="TXT value"><Txt value={d.txt} /></span>
        <span className="ms-muted" data-label="Hub">{d.hub}</span>
        <span className="ac-dsso" data-label="Single sign-on">
            <Switch on={d.sso} disabled={!d.metadata} label={`Single sign-on for ${d.host}`} onClick={() => d.sso && onSwitchOff(d)} />
            {!d.metadata && <span className="ac-dsso-why">Upload SAML metadata first</span>}
        </span>
        <span className="ac-dact">
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(d)}>Edit</button>
            <button type="button" className="btn btn-ghost btn-sm">Reset</button>
            <button type="button" className="btn btn-ghost btn-sm ms-danger-text" onClick={() => onDelete(d)}>Delete</button>
        </span>
    </div>
);

const NewDomain = ({ enterprise = true, error }) => (
    <Dialog title="New domain" width={500} onClose={() => {}}
        footer={<>
            <button type="button" className="btn btn-secondary">Cancel</button>
            <button type="button" className="btn btn-primary" disabled={!enterprise}>Add</button>
        </>}>
        {!enterprise && <Notice tone="info">Only Enterprise hubs can add a domain. None of your hubs is on Enterprise.</Notice>}
        <div className="ccm-field">
            <label className="ccm-label" htmlFor="ac-nd-hub">Hub</label>
            <SearchableSelect id="ac-nd-hub" className="ccm-select" defaultValue={FIRM} disabled={!enterprise}>
                <option>{FIRM}</option>
            </SearchableSelect>
            <span className="ccm-hint">Only Enterprise hubs are listed.</span>
        </div>
        <div className="ccm-field">
            <label className="ccm-label" htmlFor="ac-nd-host">Domain</label>
            <input id="ac-nd-host" className={`ccm-input${error ? ' ms-input-error' : ''}`} defaultValue={error ? 'https://sterlingbrooks' : ''} placeholder="yourfirm.com" disabled={!enterprise} />
            {error ? <span className="ms-field-error">Enter the domain on its own, like yourfirm.com.</span> : <span className="ccm-hint">The part after @ in your team&apos;s email addresses.</span>}
        </div>
    </Dialog>
);

/* state: ready | loading | empty | failed */
export const DomainsList = ({ state = 'ready', tab: startTab = 'Active', dialog, phone = false }) => {
    const [tab, setTab] = useState(startTab);
    const [rows, setRows] = useState(DOMAINS);
    const [del, setDel] = useState(dialog === 'delete' ? DOMAINS.active[1] : null);
    const [off, setOff] = useState(dialog === 'switchOff' ? DOMAINS.active[0] : null);
    const list = rows[tab.toLowerCase()];

    let body;
    if (state === 'loading') {
        body = <div className="ac-dtable" aria-busy="true">{[0, 1, 2].map(i => <div key={i} className="ac-drow"><span className="cw-skel-bar" style={{ width: '70%' }} /><span className="cw-skel-bar" /><span className="cw-skel-bar" style={{ width: '60%' }} /><span /><span /></div>)}</div>;
    } else if (state === 'failed') {
        body = (
            <div className="ac-state is-err">
                <span className="ac-state-ic"><Icon name="alert" size={22} /></span>
                <p className="ac-state-title">Your domains couldn&apos;t be loaded</p>
                <p className="ms-p ms-muted">This isn&apos;t the same as having none. Try again in a moment.</p>
                <button type="button" className="btn btn-secondary"><Icon name="refresh" size={14} />Try again</button>
            </div>
        );
    } else if (state === 'empty' || !list.length) {
        body = (
            <div className="ac-state">
                <span className="ac-state-ic"><Icon name="globe" size={22} /></span>
                <p className="ac-state-title">{tab === 'Pending' ? 'No domains waiting to be verified' : 'No domains yet'}</p>
                <p className="ms-p ms-muted">Add your firm&apos;s email domain to turn on single sign-on for everyone who uses it.</p>
                <button type="button" className="btn btn-primary"><Icon name="plus" size={14} w={2.6} />New domain</button>
            </div>
        );
    } else {
        body = (
            <div className="ac-dtable" role="table" aria-label={`${tab} domains`}>
                <div className="ac-drow is-head" role="row"><span>Domain</span><span>TXT value</span><span>Hub</span><span>Single sign-on</span><span /></div>
                {list.map(d => <Row key={d.host} d={d} onDelete={setDel} onSwitchOff={setOff} onEdit={() => {}} />)}
            </div>
        );
    }

    const frame = (
        <div className="ms-acct ac-acct">
            <AccountShell narrow={phone}>
                <div className="ms-acct-page">
                    <div className="ms-acct-head">
                        <div>
                            <h1 className="ms-acct-title">Domains</h1>
                            <p className="ms-muted">Your firm&apos;s email domains, for single sign-on.</p>
                        </div>
                        <button type="button" className="hubs-new-btn"><Icon name="plus" size={13} w={2.5} />NEW</button>
                    </div>
                    <div className="hubs-status-row ac-tabs" role="tablist">
                        {['Active', 'Pending'].map(t => (
                            <button key={t} type="button" role="tab" aria-selected={tab === t} className={`hubs-status-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>
                        ))}
                    </div>
                    {body}
                    <footer className="ms-acct-foot">
                        <span>© 2026 CaseActive</span>
                        <a href="#privacy" onClick={e => e.preventDefault()}>Privacy</a>
                        <a href="#terms" onClick={e => e.preventDefault()}>Terms</a>
                        <a href="#domains" className="is-on" onClick={e => e.preventDefault()}>Domains</a>
                    </footer>
                </div>
            </AccountShell>
            {(dialog === 'new' || dialog === 'newError' || dialog === 'notEnterprise') && <NewDomain enterprise={dialog !== 'notEnterprise'} error={dialog === 'newError'} />}
            {del && (
                <ConfirmDelete title="Delete domain" name={del.host}
                    detail="People with this email domain go back to signing in the usual way. This can't be undone."
                    confirmLabel="Delete domain" cancelLabel="Keep domain"
                    onConfirm={() => { setRows({ ...rows, active: rows.active.filter(x => x !== del) }); setDel(null); }} onCancel={() => setDel(null)} />
            )}
            {off && (
                <Dialog title="Turn off single sign-on?" width={480} onClose={() => setOff(null)}
                    footer={<>
                        <button type="button" className="btn btn-secondary" onClick={() => setOff(null)}>Keep it on</button>
                        <button type="button" className="btn btn-warning" onClick={() => { setRows({ ...rows, active: rows.active.map(x => (x === off ? { ...x, sso: false } : x)) }); setOff(null); }}>Turn off</button>
                    </>}>
                    <p className="ms-p">Everyone at <strong>{off.host}</strong> signs in the usual way instead, starting now. You can turn it back on at any time.</p>
                </Dialog>
            )}
        </div>
    );
    return <Designed what="Domains page" today="ca-account isn't in this codebase.">{phone ? <Phone>{frame}</Phone> : frame}</Designed>;
};

/* The edit page, which has no title today. state: ready | uploaded | unreadable */
export const DomainEdit = ({ state = 'ready', phone = false }) => {
    const [manual, setManual] = useState(true);
    const [left, setLeft] = useState(['it-admin@sterlingbrooks.law']);
    const frame = (
        <div className="ms-acct ac-acct">
            <AccountShell narrow={phone}>
                <div className="ms-acct-page ac-edit">
                    <button type="button" className="ms-back"><Icon name="arrowL" size={14} />Domains</button>
                    <div className="ms-acct-head">
                        <div>
                            <h1 className="ms-acct-title">sterlingbrooks.com</h1>
                            <p className="ms-muted">Single sign-on settings for this domain</p>
                        </div>
                    </div>
                    <div className="ac-card">
                        <div className="gs-toggle-row">
                            <div className="gs-toggle-info">
                                <div className="gs-toggle-title">Allow manual sign-in</div>
                                <div className="gs-toggle-desc">People at this domain can still sign in the usual way when single sign-on is on.</div>
                            </div>
                            <Switch on={manual} label="Allow manual sign-in" onClick={() => setManual(!manual)} />
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">Emails left out of single sign-on</label>
                            <div className="ms-chips">
                                {left.map(e => <span key={e} className="ms-chip">{e}<button type="button" aria-label={`Remove ${e}`} onClick={() => setLeft(left.filter(x => x !== e))}><Icon name="x" size={11} w={2.6} /></button></span>)}
                                <input className="ccm-input ac-chip-input" placeholder="Add an email" />
                            </div>
                            <span className="ccm-hint">These people always sign in the usual way, even when single sign-on is on.</span>
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label" htmlFor="ac-ed-hub">Hub</label>
                            <SearchableSelect id="ac-ed-hub" className="ccm-select" defaultValue={FIRM}>{HUBS.slice(0, 1).map(h => <option key={h}>{h}</option>)}</SearchableSelect>
                        </div>
                        <div className="ccm-field">
                            <label className="ccm-label">SAML metadata</label>
                            {state === 'uploaded' ? (
                                <div className="ap-up-file">
                                    <span className="ap-up-file-ic"><Icon name="file" size={20} /></span>
                                    <div><p className="ap-up-file-name">sterlingbrooks-okta-metadata.xml</p><p className="ms-muted ms-small">Okta · uploaded just now</p></div>
                                    <button type="button" className="btn btn-ghost btn-sm ac-push">Replace</button>
                                </div>
                            ) : (
                                <div className={`ac-drop${state === 'unreadable' ? ' is-error' : ''}`}>
                                    <Icon name="upload" size={20} />
                                    <span><strong>Upload the metadata file</strong> from your identity provider</span>
                                    <span className="ms-muted ms-small">An .xml file</span>
                                </div>
                            )}
                            {state === 'unreadable'
                                ? <span className="ms-field-error">We couldn&apos;t read “metadata.txt”. Upload the XML metadata file your identity provider gives you.</span>
                                : state !== 'uploaded' && <span className="ccm-hint">Single sign-on can be switched on once this is uploaded.</span>}
                        </div>
                    </div>
                    <div className="ac-foot">
                        <button type="button" className="btn btn-secondary">Cancel</button>
                        <button type="button" className="btn btn-primary">Save</button>
                    </div>
                </div>
            </AccountShell>
        </div>
    );
    return <Designed what="titled edit page" today="ca-account isn't in this codebase. Live, the edit page has no title.">{phone ? <Phone>{frame}</Phone> : frame}</Designed>;
};
