/* StatusPill — one pill for every status in the product.

   The app currently has about twenty-five separate badge classes, so a new
   status means inventing a colour again and the same word can read two ways
   on two screens. Statuses are declared here once and referenced by key.

   tone: neutral | info | success | warning | danger | pending
*/

import { STATUS } from './statuses';
import './StatusPill.css';


const StatusPill = ({ status, label, tone, dot = false, title, className = '' }) => {
    const preset = status ? STATUS[status] : null;
    const text = label ?? preset?.label ?? status ?? '';
    const key = tone ?? preset?.tone ?? 'neutral';

    return (
        <span className={`spill spill-${key} ${className}`} title={title}>
            {dot && <span className="spill-dot" aria-hidden="true" />}
            {text}
        </span>
    );
};

export default StatusPill;
