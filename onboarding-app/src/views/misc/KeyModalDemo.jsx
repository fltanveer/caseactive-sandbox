/* KeyModalDemo — the Edit Key modal, rebuilt on FormField and Notice, used on
   the Misc page to show every message a form modal can carry.

   scenario  'validation' opens with a bad Source CIDR already submitted
             'server'     the first Save fails with a connection error
             'warning'    opens on 0.0.0.0/0 so the field warning shows
             otherwise    a clean form
*/

import { useRef, useState } from 'react';
import FormField from '../../components/FormField';
import Notice from '../../components/Notice';
import ConfirmModal from '../../components/ConfirmModal';
import '../../components/Button.css';
import '../settings/AdvancedSettingsView.css';

const CIDR = /^(\d+)\.(\d+)\.(\d+)\.(\d+)(?:\/(\d+))?$/;

const cidrProblem = (value) => {
    const v = value.trim();
    if (!v) return null;
    const m = v.match(CIDR);
    if (!m) return 'Enter an IPv4 address or range, like 203.0.113.10 or 203.0.113.0/24.';
    if (m.slice(1, 5).some(n => Number(n) > 255)) return 'Each part of the address must be 0 to 255, like 203.0.113.10.';
    if (m[5] !== undefined && Number(m[5]) > 32) return 'The range after the slash must be 0 to 32, like /24.';
    return null;
};

const validate = (form) => ({
    description: form.description.trim() ? null : 'Enter a description so you can tell this key apart.',
    sourceCidr: cidrProblem(form.sourceCidr),
});

const START = {
    validation: { description: 'test cidr', sourceCidr: '203.0.113.1500' },
    server:     { description: 'Production API', sourceCidr: '203.0.113.0/24' },
    warning:    { description: 'Partner sync', sourceCidr: '0.0.0.0/0' },
};

const LABELS = { description: 'Description', sourceCidr: 'Source CIDR' };

const KeyModalDemo = ({ scenario, onClose, onSaved }) => {
    const initial = { description: '', sourceCidr: '', domain: 'manage', active: true, ...START[scenario] };
    const [form, setForm] = useState(initial);
    const [touched, setTouched] = useState({});
    const [submitted, setSubmitted] = useState(scenario === 'validation');
    const [saving, setSaving] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [failNext, setFailNext] = useState(scenario === 'server');
    const [confirm, setConfirm] = useState(null); // 'deactivate' | 'discard'
    const descRef = useRef(null);
    const cidrRef = useRef(null);
    const focusField = (k) => (k === 'description' ? descRef : cidrRef).current?.focus();

    const errors = validate(form);
    const shown = (k) => (submitted || touched[k]) ? errors[k] : null;
    const invalid = Object.keys(errors).filter(k => errors[k]);
    const dirty = JSON.stringify(form) !== JSON.stringify(initial);

    const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setServerError(false); };
    const blur = (k) => setTouched(t => ({ ...t, [k]: true }));

    const save = () => {
        setSubmitted(true);
        if (invalid.length) { focusField(invalid[0]); return; }
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            if (failNext) { setFailNext(false); setServerError(true); return; }
            onSaved?.();
        }, 900);
    };

    const close = () => (dirty && !saving ? setConfirm('discard') : onClose());

    const toggleActive = () => {
        if (form.active) setConfirm('deactivate');
        else set('active', true);
    };

    const cidrWarning = !errors.sourceCidr && form.sourceCidr.trim() === '0.0.0.0/0'
        ? 'Every IPv4 address can use this key. Narrow the range unless the key must be open.'
        : null;

    return (
        <>
            <div className="modal-overlay" onClick={close}>
                <div className="ccm misc-key-modal" role="dialog" aria-modal="true" aria-labelledby="misc-key-title" onClick={e => e.stopPropagation()}>
                    <div className="ccm-header">
                        <div>
                            <h2 className="ccm-title" id="misc-key-title">
                                Edit Key
                            </h2>
                            <p className="ccm-subtitle is-id">key…584a0720341757</p>
                        </div>
                        <button className="ccm-close" onClick={close} aria-label="Close">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>

                    <div className="ccm-body">
                        {serverError && (
                            <Notice tone="error" title="Couldn't save the key" action={{ label: 'Try again', onClick: save }}>
                                The connection dropped before CaseActive replied. Your changes are still here.
                            </Notice>
                        )}
                        {submitted && invalid.length > 0 && (
                            <Notice tone="error" title={invalid.length === 1 ? 'Fix 1 field to save' : `Fix ${invalid.length} fields to save`}>
                                <ul>
                                    {invalid.map(k => (
                                        <li key={k}>
                                            <button type="button" className="ntc-link" onClick={() => focusField(k)}>{LABELS[k]}</button>
                                        </li>
                                    ))}
                                </ul>
                            </Notice>
                        )}

                        <div className="ccm-grid-2 misc-key-grid">
                            <FormField label="Description" required error={shown('description')}>
                                <input
                                    ref={descRef}
                                    className="ccm-input"
                                    value={form.description}
                                    placeholder="e.g. Production API key"
                                    onChange={e => set('description', e.target.value)}
                                    onBlur={() => blur('description')}
                                />
                            </FormField>
                            <FormField
                                label="Source CIDR"
                                optional
                                hint="An IPv4 address or range. Leave empty to allow any address."
                                error={shown('sourceCidr')}
                                warning={cidrWarning}
                            >
                                <input
                                    ref={cidrRef}
                                    className="ccm-input"
                                    value={form.sourceCidr}
                                    placeholder="203.0.113.0/24"
                                    spellCheck={false}
                                    onChange={e => set('sourceCidr', e.target.value)}
                                    onBlur={() => blur('sourceCidr')}
                                />
                            </FormField>
                        </div>

                        <FormField label="Domain" readOnly hint="A key's domain can't be changed. To use another domain, create a new key.">
                            <input className="ccm-input" value={form.domain} />
                        </FormField>

                        <div className="misc-key-active">
                            <span className="ff-label" id="misc-key-active">Active</span>
                            <button
                                type="button"
                                className={`as-toggle${form.active ? ' on' : ''}`}
                                onClick={toggleActive}
                                role="switch" aria-checked={form.active} aria-labelledby="misc-key-active"
                            >
                                <span className="as-toggle-knob" />
                            </button>
                        </div>
                        {!form.active && (
                            <Notice tone="warning" compact>
                                This key is off. Integrations that use it will get an "unauthorised" error until it's turned back on.
                            </Notice>
                        )}
                    </div>

                    <div className="ccm-footer">
                        <button className="btn btn-secondary" onClick={close}>Cancel</button>
                        <button className={`btn btn-primary${saving ? ' is-loading' : ''}`} onClick={save}>Save</button>
                    </div>
                </div>
            </div>

            {confirm === 'deactivate' && (
                <ConfirmModal
                    tone="warning"
                    title="Turn off key"
                    question="Turn off this key?"
                    detail="Integrations using it stop working straight away. You can turn it back on at any time."
                    confirmLabel="Turn off key"
                    onCancel={() => setConfirm(null)}
                    onConfirm={() => { set('active', false); setConfirm(null); }}
                />
            )}
            {confirm === 'discard' && (
                <ConfirmModal
                    tone="warning"
                    title="Unsaved changes"
                    question="Discard your changes?"
                    detail="You edited this key but didn't save. Closing now loses those edits."
                    confirmLabel="Discard changes"
                    cancelLabel="Keep editing"
                    onCancel={() => setConfirm(null)}
                    onConfirm={() => { setConfirm(null); onClose(); }}
                />
            )}
        </>
    );
};

export default KeyModalDemo;
