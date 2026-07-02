import React, { useState, useEffect } from 'react';
import './index.css';
import { useDemoMode } from './useDemoMode';
import { isDemoEmail, DEMO_ACCOUNTS } from './demoData';
import DemoBanner from './DemoBanner';
import AdminDashboard from './AdminDashboard';
import StaffDashboard from './StaffDashboard';
import ClientDashboard from './ClientDashboard';
import PortalDashboard from './PortalDashboard';
import DevInspector from './DevInspector';
import SearchableSelect from './components/SearchableSelect';

const App = () => {
    const [step, setStep] = useState(0);
    const [loginRole, setLoginRole] = useState('admin');
    const [mode, setMode] = useState('signup'); // 'signup' | 'signin'
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('admin');
    const [practiceAreas, setPracticeAreas] = useState(['personal-injury', 'mass-tort']);
    const [hubChoice, setHubChoice] = useState('create');
    const [joinMethod, setJoinMethod] = useState('search'); // 'search' | 'invite'

    useEffect(() => {
        if (role !== 'admin' && hubChoice === 'create') {
            setHubChoice('join');
        }
    }, [role]);

    useEffect(() => {
        const handleHash = () => {
            const hash = window.location.hash;
            if (hash === '#/admin') { setLoginRole('admin'); setStep(10); }
            else if (hash === '#/staff') { setLoginRole('staff'); setStep(10); }
            else if (hash === '#/client') { setLoginRole('client'); setStep(10); }
            else { setStep(0); }
        };
        handleHash();
        window.addEventListener('hashchange', handleHash);
        return () => window.removeEventListener('hashchange', handleHash);
    }, []);

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const goToStep = (n) => setStep(n);

    const { isDemoActive, demoRole, demoPrefill, activateDemo, exitDemo } = useDemoMode();

    const handleExitDemo = () => {
        exitDemo();
        window.location.hash = '';
        setEmail('');
        setOtp(['', '', '', '', '', '']);
        setMode('signup');
    };

    const handleVerify = () => {
        const otpCode = otp.join('');
        if (isDemoEmail(email) && otpCode === '123456') {
            const account = DEMO_ACCOUNTS[email.toLowerCase()];
            activateDemo(email);
            if (account.role === 'admin') goToStep(7);
            else if (account.role === 'staff') goToStep(8);
            else if (account.role === 'portal') goToStep(10);
            else goToStep(9);
            return;
        }
        mode === 'signin' ? goToStep(6) : goToStep(3);
    };

    useEffect(() => {
        document.body.style.paddingTop = isDemoActive ? '0px' : '';
        return () => { document.body.style.paddingTop = ''; };
    }, [isDemoActive]);

    useEffect(() => {
        if (step === 2) {
            setOtp(['1', '2', '3', '4', '5', '6']);
        }
    }, [step]);

    const handleOtpChange = (val, i) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...otp];
        next[i] = val;
        setOtp(next);
        if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
    };

    const handleOtpKeyDown = (e, i) => {
        if (e.key === 'Backspace' && !otp[i] && i > 0) {
            document.getElementById(`otp-${i - 1}`)?.focus();
        }
    };

    const handleLoginContinue = () => {
        window.location.hash = `/${loginRole}`;
    };

    // Step Components
    const Step0 = () => (
        <div className="step" id="step-0">
            <main className="main-panel">
                <div className="step-header">
                    <div className="logo dark">
                        <img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 24, width: 'auto' }} />
                    </div>
                </div>
                <div className="step-content">
                    <h1>Welcome back</h1>
                    <p className="step-subtitle">Select your role to continue to your dashboard.</p>

                    <div className="input-group" style={{ marginBottom: 24 }}>
                        <label htmlFor="login-role">Your role</label>
                        <div className="select-wrapper">
                            <SearchableSelect
                                id="login-role"
                                value={loginRole}
                                onChange={(e) => setLoginRole(e.target.value)}
                            >
                                <option value="admin">Admin</option>
                                <option value="staff">Staff</option>
                                <option value="client">Client</option>
                            </SearchableSelect>
                            <svg className="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </div>
                    </div>

                    <button className="primary-btn" onClick={handleLoginContinue}>Continue</button>

                    <div className="signin-footer" style={{ marginTop: 24 }}>
                        <p className="legal">By continuing you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a></p>
                    </div>
                </div>
            </main>
        </div>
    );

    const Step1 = () => (
        <div className="step" id="step-1">
            <aside className="side-panel signin-panel">
                <div className="logo">
                    <img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 24, width: 'auto' }} />
                </div>
                {mode === 'signup' ? (
                    <>
                        <h2>Your clients stay informed. Your firm stays trusted.</h2>
                        <p>Join 500+ personal injury and mass tort firms who reduced client churn by keeping every case transparent.</p>
                        <ul className="feature-list">
                            <li>
                                <span className="feature-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                </span>
                                <div>
                                    <strong>Automated case updates</strong>
                                    <span>Clients get milestones, check-ins, and reminders without you lifting a finger</span>
                                </div>
                            </li>
                            <li>
                                <span className="feature-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                                </span>
                                <div>
                                    <strong>White-labeled Hub</strong>
                                    <span>Your brand, your name — clients see you, not a generic tool</span>
                                </div>
                            </li>
                            <li>
                                <span className="feature-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                </span>
                                <div>
                                    <strong>30% more capacity</strong>
                                    <span>Handle more clients without adding headcount</span>
                                </div>
                            </li>
                        </ul>
                        <div className="signin-stats">
                            <div className="stat"><strong>65%</strong><span>less churn from silence</span></div>
                            <div className="stat"><strong>500+</strong><span>law firms onboard</span></div>
                            <div className="stat"><strong>70+</strong><span>languages supported</span></div>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>Welcome back to CaseActive</h2>
                        <p>Sign in to access your Hub, cases, and client updates.</p>
                        <ul className="feature-list">
                            <li>
                                <span className="feature-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                </span>
                                <div>
                                    <strong>Passwordless &amp; secure</strong>
                                    <span>We'll send a one-time code to your email</span>
                                </div>
                            </li>
                            <li>
                                <span className="feature-icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                                </span>
                                <div>
                                    <strong>Your Hub is waiting</strong>
                                    <span>Pick up right where you left off</span>
                                </div>
                            </li>
                        </ul>
                        <div className="side-note">Need help? Contact your Hub administrator or reach us at support@caseactive.com</div>
                    </>
                )}
            </aside>

            <main className="main-panel">
                <div className="step-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div className="logo dark">
<img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 24, width: 'auto' }} />
                </div>
                        <button className="back-btn" onClick={() => window.location.href = '/'}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                            Exit
                        </button>
                    </div>
                </div>
                <div className="step-content">
                    <div className="auth-toggle">
                        <button
                            className={`auth-toggle-btn ${mode === 'signup' ? 'active' : ''}`}
                            onClick={() => setMode('signup')}
                        >Sign up</button>
                        <button
                            className={`auth-toggle-btn ${mode === 'signin' ? 'active' : ''}`}
                            onClick={() => setMode('signin')}
                        >Sign in</button>
                    </div>

                    <h1>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
                    <p className="step-subtitle">
                        {mode === 'signup'
                            ? 'Start your free 14-day trial. No credit card required.'
                            : 'Enter your email to receive a sign-in code.'}
                    </p>

                    <div className="social-grid">
                        <button className="social-btn" onClick={() => goToStep(2)}>
                            <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" width="20" height="20" />
                            <span>{mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}</span>
                        </button>
                        <button className="social-btn" onClick={() => goToStep(2)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                            <span>Magic link via email</span>
                        </button>
                    </div>

                    <div className="divider"><span>or use your work email</span></div>

                    <form className="signin-form" onSubmit={(e) => { e.preventDefault(); goToStep(2); }}>
                        <div className="input-group">
                            <label htmlFor="work-email">Work email</label>
                            <input
                                type="email"
                                id="work-email"
                                placeholder="you@yourfirm.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {mode === 'signin' && (
                        <div className="demo-pills-section">
                            <span className="demo-pills-label">Try a demo account:</span>
                            <div className="demo-pills">
                                <button type="button" className="demo-pill pill-admin" onClick={() => setEmail('admin@demo.com')}>Admin</button>
                                <button type="button" className="demo-pill pill-staff" onClick={() => setEmail('staff@demo.com')}>Staff</button>
                                <button type="button" className="demo-pill pill-client" onClick={() => setEmail('client@demo.com')}>Client</button>
                                <button type="button" className="demo-pill pill-portal" onClick={() => setEmail('portal@demo.com')}>Portal</button>
                            </div>
                        </div>
                        )}
                        <button type="submit" className="primary-btn">Continue with email</button>
                    </form>

                    <div className="signin-footer">
                        {mode === 'signup' ? (
                            <>
                                <p>No credit card required · Free 14-day trial</p>
                                <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setMode('signin'); }}>Sign in</a></p>
                            </>
                        ) : (
                            <>
                                <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setMode('signup'); }}>Sign up free</a></p>
                            </>
                        )}
                        <p className="legal">By continuing you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a></p>
                    </div>
                </div>
            </main>
        </div>
    );

    const Step2 = () => (
        <div className="step" id="step-2">
            <aside className="side-panel">
                <div className="logo">
<img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 24, width: 'auto' }} />
                </div>
                <h2>Check your inbox</h2>
                <p>We sent a 6-digit code to your email. It expires in 10 minutes.</p>
                <ul className="feature-list">
                    <li>
                        <span className="feature-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        </span>
                        <div>
                            <strong>No password needed</strong>
                            <span>Passwordless login keeps your account secure</span>
                        </div>
                    </li>
                    <li>
                        <span className="feature-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        </span>
                        <div>
                            <strong>Expires in 10 min</strong>
                            <span>Check your spam folder if you don't see it</span>
                        </div>
                    </li>
                </ul>
                <div className="side-note">Prefer a password? You can set one in settings after signing in.</div>
            </aside>

            <main className="main-panel">
                <div className="step-header">
                    <button className="back-btn" onClick={() => goToStep(1)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        Back
                    </button>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '25%' }}></div>
                    </div>
                </div>

                <div className="step-content">
                    <h1>Enter your code</h1>
                    <p className="step-subtitle">Sent to <strong>{email || 'your email'}</strong></p>

                    {isDemoEmail(email) && (
                        <div className="demo-otp-hint">
                            <span className="demo-otp-badge">Demo</span>
                            Use code <strong>123456</strong> to continue
                        </div>
                    )}

                    <div className="otp-grid">
                        {otp.map((digit, i) => (
                            <input 
                                key={i}
                                id={`otp-${i}`}
                                className={`otp-input ${digit ? 'filled' : ''}`}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(e.target.value, i)}
                                onKeyDown={(e) => handleOtpKeyDown(e, i)}
                                aria-label={`Digit ${i + 1}`}
                            />
                        ))}
                    </div>

                    <button className="primary-btn" id="verify-btn" onClick={handleVerify}>Verify &amp; continue</button>

                    <p className="help-text">Didn't get it? <a href="#" onClick={(e) => { e.preventDefault(); }}>Resend code</a> · <a href="#">Try a different method</a></p>

                    <div className="info-box">
                        Also check your spam or promotions folder. Some firm email servers may delay delivery by up to 2 minutes.
                    </div>
                </div>
            </main>
        </div>
    );

    const Step3 = () => (
        <div className="step" id="step-3">
            <aside className="side-panel">
                <div className="logo">
<img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 24, width: 'auto' }} />
                </div>
                <h2>Built for everyone at your firm</h2>
                <p>CaseActive works for attorneys, paralegals, and intake staff — each with the right access level.</p>
                <ul className="feature-list">
                    <li>
                        <span className="feature-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        </span>
                        <div>
                            <strong>Role-based access</strong>
                            <span>Attorneys see everything. Clients see only their own case.</span>
                        </div>
                    </li>
                    <li>
                        <span className="feature-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                        </span>
                        <div>
                            <strong>HIPAA-aligned</strong>
                            <span>Data stays secure and access-controlled at every level</span>
                        </div>
                    </li>
                </ul>
            </aside>

            <main className="main-panel">
                <div className="step-header">
                    <button className="back-btn" onClick={() => goToStep(2)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        Back
                    </button>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '50%' }}></div>
                    </div>
                </div>

                <div className="step-content">
                    <h1>What's your role?</h1>
                    <p className="step-subtitle">We'll set up the right workspace for you.</p>

                    <div className="role-grid">
                        <button className={`role-card ${role === 'admin' ? 'selected' : ''}`} onClick={() => setRole('admin')}>
                            <strong>Admin</strong>
                            <span>Manage hub, team &amp; cases</span>
                        </button>
                        <button className={`role-card ${role === 'staff' ? 'selected' : ''}`} onClick={() => setRole('staff')}>
                            <strong>Staff</strong>
                            <span>Support admin &amp; track tasks</span>
                        </button>
                        <button className={`role-card ${role === 'client' ? 'selected' : ''}`} onClick={() => setRole('client')}>
                            <strong>Client</strong>
                            <span>View my case updates</span>
                        </button>
                    </div>

                    {role === 'admin' && (
                        <div className="practice-areas-section">
                            <label className="section-label">What practice areas does your firm handle? <span className="optional">(optional)</span></label>
                            <div className="tag-grid">
                                {['personal-injury', 'mass-tort', 'workers-comp', 'medical-mal', 'other'].map(tag => (
                                    <button 
                                        key={tag}
                                        className={`tag ${practiceAreas.includes(tag) ? 'selected' : ''}`}
                                        onClick={() => toggleTag(tag)}
                                    >
                                        {tag.replace('-', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button className="primary-btn" onClick={() => goToStep(4)}>Continue</button>
                </div>
            </main>
        </div>
    );

    const Step4 = () => (
        <div className="step" id="step-4">
            <aside className="side-panel">
                <div className="logo">
<img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 24, width: 'auto' }} />
                </div>
                <h2>You're almost set up</h2>
                <p>Here's what happens next when you finish setup.</p>
                <ul className="feature-list checklist">
                    <li>
                        <span className="check-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                        <span>Your branded Hub goes live immediately</span>
                    </li>
                    <li>
                        <span className="check-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                        <span>Invite your first client in under 2 minutes</span>
                    </li>
                    <li>
                        <span className="check-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                        <span>Automated updates start the moment you add a case</span>
                    </li>
                </ul>
            </aside>

            <main className="main-panel">
                <div className="step-header">
                    <button className="back-btn" onClick={() => goToStep(3)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        Back
                    </button>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '75%' }}></div>
                    </div>
                </div>

                <div className="step-content">
                    <h1>Last step — choose your Hub</h1>
                    <p className="step-subtitle">Join an existing firm Hub or create a new one for your team.</p>

                    <div className="choice-grid">
                        <div 
                            className={`choice-card ${hubChoice === 'create' ? 'selected' : ''} ${role !== 'admin' ? 'disabled' : ''}`} 
                            onClick={() => role === 'admin' && setHubChoice('create')}
                            style={role !== 'admin' ? { opacity: 0.5, cursor: 'not-allowed', grayscale: '100%' } : {}}
                        >
                            <div className="choice-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                            </div>
                            <div className="choice-text">
                                <strong>Create new Hub</strong>
                                <span>Start fresh for your firm</span>
                            </div>
                        </div>
                        <div className={`choice-card ${hubChoice === 'join' ? 'selected' : ''}`} onClick={() => setHubChoice('join')}>
                            <div className="choice-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                            </div>
                            <div className="choice-text">
                                <strong>Join existing Hub</strong>
                                <span>Request access to team Hub</span>
                            </div>
                        </div>
                    </div>

                    <form className="setup-form" onSubmit={(e) => { e.preventDefault(); goToStep(5); }}>
                        {hubChoice === 'create' ? (
                            <div id="create-hub-fields">
                                <div className="input-group">
                                    <label htmlFor="firm-name">Firm name</label>
                                    <input type="text" id="firm-name" placeholder="e.g. Johnson &amp; Associates" />
                                </div>
                                <div className="input-group" style={{ marginTop: '18px' }}>
                                    <label htmlFor="team-size">Your team size</label>
                                    <div className="select-wrapper">
                                        <SearchableSelect id="team-size">
                                            <option value="solo">Just me</option>
                                            <option value="2-5">2–5 people</option>
                                            <option value="6-15">6–15 people</option>
                                            <option value="16-50">16–50 people</option>
                                            <option value="51+">51+ people</option>
                                        </SearchableSelect>
                                        <svg className="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                                    </div>
                                </div>
                                <button type="submit" className="primary-btn launch-btn">Launch my Hub</button>
                                <p className="help-text center">Free for 14 days · No credit card · Cancel anytime</p>
                            </div>
                        ) : (
                            <div id="join-hub-fields">
                                <div className="join-tabs">
                                    <button type="button" className={`join-tab${joinMethod === 'search' ? ' active' : ''}`} onClick={() => setJoinMethod('search')}>Request to join</button>
                                    <button type="button" className={`join-tab${joinMethod === 'invite' ? ' active' : ''}`} onClick={() => setJoinMethod('invite')}>Invitation link</button>
                                </div>
                                {joinMethod === 'search' ? (
                                    <>
                                        <div className="input-group">
                                            <label htmlFor="hub-search">Search for your firm</label>
                                            <div className="search-input-wrapper">
                                                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                                                <input type="text" id="hub-search" placeholder="Enter firm name or Hub ID" className="search-input" />
                                            </div>
                                        </div>
                                        <p className="help-text" style={{ textAlign: 'left', marginTop: '8px' }}>Your firm administrator will need to approve your join request.</p>
                                        <button type="submit" className="primary-btn launch-btn">Request to join</button>
                                    </>
                                ) : (
                                    <>
                                        <div className="input-group">
                                            <label htmlFor="invite-link">Paste your invitation link</label>
                                            <input type="text" id="invite-link" placeholder="https://hub.caseactive.com/invite/..." />
                                        </div>
                                        <p className="help-text" style={{ textAlign: 'left', marginTop: '8px' }}>Ask your Hub administrator for an invitation link.</p>
                                        <button type="submit" className="primary-btn launch-btn">Join with invitation</button>
                                    </>
                                )}
                            </div>
                        )}
                    </form>
                </div>
            </main>
        </div>
    );

    const Step5 = () => (
        <div className="step" id="step-5">
            <aside className="side-panel success-panel">
                <div className="logo">
<img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 24, width: 'auto' }} />
                </div>
                <div className="success-badge">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2>You're all set!</h2>
                <p>Your Hub is live. Start by inviting your first client or adding a case.</p>
                <ul className="feature-list checklist">
                    <li><span className="check-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Hub ready</span></li>
                    <li><span className="check-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Role configured</span></li>
                    {role === 'admin' && <li><span className="check-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Practice areas saved</span></li>}
                </ul>
            </aside>

            <main className="main-panel">
                <div className="step-header">
                    <button className="back-btn" onClick={() => goToStep(4)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        Back
                    </button>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '100%' }}></div>
                    </div>
                </div>

                <div className="step-content success-content">
                    <div className="success-icon-large">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <h1>{hubChoice === 'create' ? 'Hub launched 🎉' : role === 'staff' ? 'Welcome to your Hub! 🎉' : 'Request sent! 📨'}</h1>
                    <p className="step-subtitle">
                        {hubChoice === 'create' 
                            ? 'Your Hub is ready at app.caseactive.com/dashboard' 
                            : role === 'staff' 
                                ? 'You\'ve joined Johnson & Associates Hub'
                                : 'We notified your firm administrator. You\'ll be redirected once approved.'}
                    </p>

                    <div className="success-actions">
                        <button className="primary-btn" onClick={() => {
                            activateDemo(email);
                            if (role === 'admin') goToStep(7);
                            else if (role === 'staff') goToStep(8);
                            else goToStep(9);
                        }}>Go to dashboard</button>
                        {role !== 'client' && <button className="secondary-btn">Invite first client</button>}
                    </div>

                    {role !== 'client' && <div className="next-steps-grid">
                        <div className="next-step-card">
                            <span className="ns-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
                            </span>
                            <strong>Invite a client</strong>
                            <span>Send a secure link in seconds</span>
                        </div>
                        <div className="next-step-card">
                            <span className="ns-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                            </span>
                            <strong>Explore dashboard</strong>
                            <span>Add your first case</span>
                        </div>
                        <div className="next-step-card">
                            <span className="ns-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M21 12h-3M3 12H6M12 3V6M12 18v3"/></svg>
                            </span>
                            <strong>Customize Hub</strong>
                            <span>Add your firm's logo &amp; colors</span>
                        </div>
                    </div>}
                </div>
            </main>
        </div>
    );

    const Step6 = () => (
        <div className="step" id="step-6">
            <aside className="side-panel success-panel">
                <div className="logo">
<img src="/assets/images/logo.svg" alt="CaseActive" style={{ height: 24, width: 'auto' }} />
                </div>
                <div className="success-badge">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2>You're signed in!</h2>
                <p>Your Hub is ready. Everything is right where you left it.</p>
                <ul className="feature-list checklist">
                    <li><span className="check-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Identity verified</span></li>
                    <li><span className="check-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Session started</span></li>
                    <li><span className="check-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Hub loaded</span></li>
                </ul>
            </aside>

            <main className="main-panel">
                <div className="step-header">
                    <button className="back-btn" onClick={() => goToStep(2)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                        Back
                    </button>
                </div>

                <div className="step-content success-content">
                    <div className="success-icon-large">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <h1>Signed in 👋</h1>
                    <p className="step-subtitle">Welcome back. Your dashboard is ready.</p>

                    <div className="success-actions">
                        <button className="primary-btn" onClick={() => {
                            activateDemo(email);
                            if (role === 'admin') goToStep(7);
                            else if (role === 'staff') goToStep(8);
                            else goToStep(9);
                        }}>Go to dashboard</button>
                    </div>

                    <div className="next-steps-grid">
                        <div className="next-step-card">
                            <span className="ns-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
                            </span>
                            <strong>View clients</strong>
                            <span>See all active cases</span>
                        </div>
                        <div className="next-step-card">
                            <span className="ns-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                            </span>
                            <strong>Dashboard</strong>
                            <span>Overview &amp; activity</span>
                        </div>
                        <div className="next-step-card">
                            <span className="ns-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M21 12h-3M3 12H6M12 3V6M12 18v3"/></svg>
                            </span>
                            <strong>Settings</strong>
                            <span>Hub &amp; profile</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );

    if (step === 10) return (
        <>
            {isDemoActive && <DemoBanner demoRole={demoRole} onExit={handleExitDemo} />}
            <PortalDashboard prefill={demoPrefill} onExit={handleExitDemo} initialView={loginRole === 'client' ? 'lobby' : 'admin'} />
            <DevInspector />
        </>
    );

    return (
        <>
            {isDemoActive && <DemoBanner demoRole={demoRole} onExit={handleExitDemo} />}
            <DevInspector />
            <div className="onboarding-wrapper">
                <div className="onboarding-card">
                    {step === 0 && <Step0 />}
                    {step === 1 && <Step1 />}
                    {step === 2 && <Step2 />}
                    {step === 3 && <Step3 />}
                    {step === 4 && <Step4 />}
                    {step === 5 && <Step5 />}
                    {step === 6 && <Step6 />}
                    {step === 7 && <AdminDashboard  prefill={demoPrefill} onExit={handleExitDemo} />}
                    {step === 8 && <StaffDashboard  prefill={demoPrefill} onExit={handleExitDemo} />}
                    {step === 9 && <ClientDashboard prefill={demoPrefill} onExit={handleExitDemo} />}
                </div>
            </div>
        </>
    );
};

export default App;
