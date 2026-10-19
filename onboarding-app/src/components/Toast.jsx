/* Toast — a short confirmation after something finished, top right, above
   any open modal. Closes itself after `duration` ms, or with its close
   button. Same tones and look as the snackbars on the Misc page.

   tone     success | info | warning | error
   message  one sentence: "Invitation sent to jordan@firm.com."
*/

import { useEffect } from 'react';
import ToneIcon from './ToneIcon';
import './Toast.css';

const Toast = ({ message, tone = 'success', duration = 4000, onClose }) => {
    useEffect(() => {
        if (!duration) return undefined;
        const t = setTimeout(onClose, duration);
        return () => clearTimeout(t);
    }, [message, duration, onClose]);

    return (
        <div className={`toast toast-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
            <span className="toast-icon"><ToneIcon tone={tone} size={17} /></span>
            <span className="toast-msg">{message}</span>
            <button type="button" className="toast-close" onClick={onClose} aria-label="Dismiss">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
    );
};

export default Toast;
