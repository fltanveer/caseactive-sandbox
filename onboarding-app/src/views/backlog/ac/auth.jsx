/* AC-1 · 3 and 4 · Single sign-on and Unsubscribe: the account site's bare
   pages, with no app chrome, on computer and phone side by side.

   Unsubscribe is drawn the way the thread is asked to approve: the person
   is unsubscribed when the page opens, as the page already says, and the
   reason is optional feedback rather than the step that does it. */

import { useState } from 'react';
import Notice from '../../../components/Notice';
import { FIRM, ACCOUNT, Icon, FirmMark, Pair, Designed } from '../ms/parts';

/* ══ Single sign-on ═════════════════════════════════════════════════════ */

const REASONS = {
    off: ['Single sign-on is switched off for sterlingbrooks.com', 'An admin at your firm turned it off. Sign in the usual way instead, or ask them to switch it back on.'],
    plan: ['Single sign-on needs the Enterprise plan', `${FIRM} isn't on Enterprise, so its domain can't use single sign-on. Sign in the usual way instead.`],
};

const SsoPage = ({ state = 'redirecting' }) => (
    <div className="ms-auth">
        <div className="ms-auth-card ac-sso">
            <img src="/assets/images/logo.svg" alt="CaseActive" className="ms-auth-logo" />
            {state === 'redirecting' ? (
                <div className="ac-sso-wait" role="status">
                    <span className="cw-spin is-lg" aria-hidden="true" />
                    <h1 className="ms-auth-title">Redirecting to your identity provider…</h1>
                    <p className="ms-p ms-muted">marcus.bell@sterlingbrooks.law</p>
                </div>
            ) : (
                <>
                    <span className="ms-auth-err"><Icon name="alert" size={22} /></span>
                    <h1 className="ms-auth-title">{REASONS[state][0]}</h1>
                    <p className="ms-p">{REASONS[state][1]}</p>
                    <button type="button" className="btn btn-primary ms-block"><Icon name="arrowL" size={14} />Back to sign in</button>
                </>
            )}
        </div>
    </div>
);

export const Sso = ({ state }) => (
    <Designed what="single sign-on page" today="ca-account isn't in this codebase. Live, the error has no way back.">
        <Pair url={`${ACCOUNT}/sso`} height={560}><SsoPage state={state} /></Pair>
    </Designed>
);

/* ══ Unsubscribe ════════════════════════════════════════════════════════ */

const WHY = ['I get too many emails', 'These emails aren\'t useful to me', 'I didn\'t ask for these emails', 'My case is finished', 'Something else'];

/* state: choosing | thanks | error | broken */
const UnsubPage = ({ state: start = 'choosing' }) => {
    const [state, setState] = useState(start);
    const [why, setWhy] = useState(null);

    const brand = <span className="ms-unsub-brand"><FirmMark size={34} /><strong>{FIRM}</strong></span>;

    if (state === 'broken') {
        return (
            <div className="ms-auth">
                <div className="ms-auth-card is-wide">
                    <img src="/assets/images/logo.svg" alt="CaseActive" className="ms-auth-logo" />
                    <span className="ms-auth-err"><Icon name="alert" size={22} /></span>
                    <h1 className="ms-auth-title">This link doesn&apos;t work anymore</h1>
                    <p className="ms-p">It may be old, or only part of it was copied. You can still turn off emails after signing in, in Hubs → Settings → Notifications.</p>
                    <button type="button" className="btn btn-primary ms-block">Sign in</button>
                </div>
            </div>
        );
    }
    return (
        <div className="ms-auth">
            <div className="ms-auth-card is-wide">
                {brand}
                {state === 'error' ? (
                    <>
                        <h1 className="ms-auth-title">We couldn&apos;t unsubscribe you</h1>
                        <Notice tone="error">Something went wrong on our side, so you&apos;ll still get these emails for now. Try again in a moment.</Notice>
                        <div className="ac-unsub-actions">
                            <button type="button" className="btn btn-secondary">Return</button>
                            <button type="button" className="btn btn-primary" onClick={() => setState('choosing')}><Icon name="refresh" size={14} />Try again</button>
                        </div>
                    </>
                ) : state === 'thanks' ? (
                    <>
                        <h1 className="ms-auth-title">Thanks for telling us</h1>
                        <p className="ms-p">You&apos;re still unsubscribed from invoice emails from {FIRM}.</p>
                        <div className="ac-unsub-actions"><button type="button" className="btn btn-secondary">Return</button></div>
                    </>
                ) : (
                    <>
                        <h1 className="ms-auth-title">You&apos;re unsubscribed</h1>
                        <p className="ms-p">You will no longer get invoice emails from {FIRM}.</p>
                        <p className="ms-p ms-muted">To get them again, sign in and turn Invoices back on in Hubs → Settings → Notifications.</p>
                        <fieldset className="ac-fieldset">
                            <legend>Tell us why <span className="ms-muted">(optional)</span></legend>
                            <div className="ac-why" role="radiogroup">
                                {WHY.map(w => (
                                    <label key={w} className={`ac-why-opt${why === w ? ' is-on' : ''}`}>
                                        <input type="radio" name="ac-why" checked={why === w} onChange={() => setWhy(w)} />{w}
                                    </label>
                                ))}
                            </div>
                            {why === 'Something else' && <textarea className="ccm-input ms-textarea" rows={3} placeholder="What could we do better?" />}
                        </fieldset>
                        <div className="ac-unsub-actions">
                            <button type="button" className="btn btn-secondary">Return</button>
                            <button type="button" className="btn btn-primary" disabled={!why} onClick={() => setState('thanks')}>Submit</button>
                        </div>
                    </>
                )}
            </div>
            <p className="ms-auth-foot">Sent by CaseActive for {FIRM}</p>
        </div>
    );
};

export const Unsubscribe = ({ state }) => (
    <Designed what="unsubscribe page" today="ca-account isn't in this codebase. Live, nothing is sent until a reason is picked, though the page already says you're unsubscribed.">
        <Pair url={`${ACCOUNT}/unsubscribe?t=Qm81x`} height={680}><UnsubPage state={state} /></Pair>
    </Designed>
);
