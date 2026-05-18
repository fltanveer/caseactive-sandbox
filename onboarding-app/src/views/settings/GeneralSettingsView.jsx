import { useState } from 'react';

const Toggle = ({ value, onChange }) => (
    <button
        type="button"
        className={`gs-toggle${value ? ' on' : ''}`}
        onClick={() => onChange(!value)}
        aria-pressed={value}
    >
        <span className="gs-toggle-knob" />
    </button>
);

const ColorField = ({ label, value, onChange }) => (
    <div className="gs-field">
        <label className="gs-label">{label}</label>
        <div className="gs-color-row">
            <input className="gs-input gs-color-text" value={value} onChange={e => onChange(e.target.value)} spellCheck={false} />
            <div className="gs-color-swatch-wrap">
                <input
                    type="color"
                    className="gs-color-native"
                    value={value.startsWith('#') ? value : '#000000'}
                    onChange={e => onChange(e.target.value)}
                />
                <span className="gs-color-swatch" style={{ background: value }} />
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
        </div>
    </div>
);

const UploadBox = ({ label, sublabel, icon }) => {
    const [, setFileName] = useState(null);
    return (
        <div className="gs-upload-box">
            <div className="gs-upload-label">{label}</div>
            <div className="gs-upload-area">
                <div className="gs-upload-preview">
                    {icon}
                </div>
                <div className="gs-upload-actions">
                    <label className="gs-upload-btn">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Change file
                        <input type="file" style={{ display: 'none' }} onChange={e => setFileName(e.target.files[0]?.name || null)} />
                    </label>
                    <button type="button" className="gs-upload-delete">Delete {sublabel}</button>
                </div>
            </div>
        </div>
    );
};

const SectionCard = ({ icon, title, children }) => (
    <div className="gs-card">
        <div className="gs-card-header">
            <div className="gs-card-icon">{icon}</div>
            <h2 className="gs-card-title">{title}</h2>
        </div>
        <div className="gs-card-body">{children}</div>
    </div>
);

const GeneralSettingsView = () => {
    const [form, setForm] = useState({
        textColor: '#16b0c5',
        bgColor: '#1296a8',
        firmName: 'Workspace',
        industry: 'healthcare',
        phone: '',
        email: '',
        website: 'https://www.ggolo.com',
        termsUrl: '',
        analyticsKey: '',
    });
    const [allowSignup, setAllowSignup] = useState(true);
    const [allowInquiry, setAllowInquiry] = useState(true);
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const signupLink = 'https://ca-8c1e34cc8eaf81.app.caseactive.com?inquiry=true';

    const handleCopy = () => {
        navigator.clipboard.writeText(signupLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="portal-content">
            <div className="portal-content-title">
                <h1 className="portal-page-title">General</h1>
                <p className="portal-breadcrumb">Settings · General</p>
            </div>

            <div className="gs-layout">

                {/* Design Settings */}
                <SectionCard
                    title="Design Settings"
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><path d="M17 3H7a4 4 0 0 0-4 4v10a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V7a4 4 0 0 0-4-4z"/><path d="m3 15 4-4 4 4 4-4 3 3"/></svg>}
                >
                    <div className="gs-upload-row">
                        <UploadBox
                            label="Logo"
                            sublabel="Logo"
                            icon={
                                <div className="gs-logo-placeholder">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 9 3-3 3 3"/><path d="M9 15h6"/></svg>
                                    <span>CaseActive</span>
                                </div>
                            }
                        />
                        <UploadBox
                            label="Favicon"
                            sublabel="Favicon"
                            icon={
                                <div className="gs-favicon-placeholder">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                </div>
                            }
                        />
                    </div>

                    <div className="gs-divider" />

                    <div className="gs-grid-2">
                        <ColorField label="Text Color" value={form.textColor} onChange={v => set('textColor', v)} />
                        <ColorField label="Background Color" value={form.bgColor} onChange={v => set('bgColor', v)} />
                    </div>
                </SectionCard>

                {/* Firm Info */}
                <SectionCard
                    title="Firm Info"
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                >
                    <div className="gs-grid-2">
                        <div className="gs-field">
                            <label className="gs-label">Name</label>
                            <input className="gs-input" value={form.firmName} onChange={e => set('firmName', e.target.value)} />
                        </div>
                        <div className="gs-field">
                            <label className="gs-label">Industry</label>
                            <div className="gs-select-wrap">
                                <select value={form.industry} onChange={e => set('industry', e.target.value)}>
                                    <option value="healthcare">Healthcare</option>
                                    <option value="legal">Legal</option>
                                    <option value="finance">Finance</option>
                                    <option value="education">Education</option>
                                    <option value="technology">Technology</option>
                                    <option value="other">Other</option>
                                </select>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                            </div>
                        </div>
                        <div className="gs-field">
                            <label className="gs-label">Phone</label>
                            <input className="gs-input" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => set('phone', e.target.value)} />
                        </div>
                        <div className="gs-field">
                            <label className="gs-label">Email</label>
                            <input className="gs-input" type="email" placeholder="contact@yourfirm.com" value={form.email} onChange={e => set('email', e.target.value)} />
                        </div>
                        <div className="gs-field">
                            <label className="gs-label">Website</label>
                            <input className="gs-input" placeholder="https://" value={form.website} onChange={e => set('website', e.target.value)} />
                        </div>
                        <div className="gs-field">
                            <label className="gs-label">Terms of Use URL</label>
                            <input className="gs-input" placeholder="https://" value={form.termsUrl} onChange={e => set('termsUrl', e.target.value)} />
                        </div>
                    </div>
                </SectionCard>

                {/* User Signup & Inquiry */}
                <SectionCard
                    title="User Signup &amp; Inquiry"
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>}
                >
                    <div className="gs-link-row">
                        <div className="gs-link-label">Public User Signup link</div>
                        <div className="gs-link-box">
                            <span className="gs-link-text">{signupLink}</span>
                            <button type="button" className="gs-copy-btn" onClick={handleCopy}>
                                {copied
                                    ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied</>
                                    : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>
                                }
                            </button>
                        </div>
                    </div>

                    <div className="gs-divider" />

                    <div className="gs-toggle-grid">
                        <div className="gs-toggle-row">
                            <div className="gs-toggle-info">
                                <div className="gs-toggle-title">Allow Signup</div>
                                <div className="gs-toggle-desc">Let new users self-register via the public link</div>
                            </div>
                            <Toggle value={allowSignup} onChange={setAllowSignup} />
                        </div>
                        <div className="gs-toggle-row">
                            <div className="gs-toggle-info">
                                <div className="gs-toggle-title">Allow Client to Start Inquiry</div>
                                <div className="gs-toggle-desc">Clients can submit a new inquiry from the portal</div>
                            </div>
                            <Toggle value={allowInquiry} onChange={setAllowInquiry} />
                        </div>
                    </div>
                </SectionCard>

                {/* Google Analytics */}
                <SectionCard
                    title="Google Analytics"
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>}
                >
                    <div style={{ maxWidth: 400 }}>
                        <div className="gs-field">
                            <label className="gs-label">Analytics Key</label>
                            <input className="gs-input" placeholder="G-XXXXXXXXXX" value={form.analyticsKey} onChange={e => set('analyticsKey', e.target.value)} />
                            <span className="gs-field-hint">Paste your Google Analytics Measurement ID to enable tracking.</span>
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
        </div>
    );
};

export default GeneralSettingsView;
