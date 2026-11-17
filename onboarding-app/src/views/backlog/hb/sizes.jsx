/* HB-1 · Minimum logo size, drawn at 1:1 in the header's logo box. */

import StatusPill from '../../../components/StatusPill';
import { BRANDS, textOn } from './brand';

const J = BRANDS['johnsonlaw.com'];
const R = BRANDS['riveralaw.com'];

const Bar = ({ brand, box, h }) => (
    <div className="hbz-bar" style={{ background: brand.bg, height: h + 24, color: textOn(brand.bg) }}>
        <span className="hbz-box" style={{ width: box[0], height: box[1] }}>
            <img src={brand.logo.src} alt={brand.logo.alt} style={{ maxWidth: box[0], height: box[1] }} />
        </span>
        <span className="hbz-dim">{box[0]} × {box[1]} box</span>
    </div>
);

const ROWS = [
    ['Square icon', '64 × 64', '40 × 40', true],
    ['Wordmark, 4:1', '256 × 64', '160 × 40', true],
    ['Wide wordmark, 6:1', '330 × 55', '200 × 33', true, 'Accepted (≥ 320 wide)'],
    ['Any SVG', '—', 'Fits the box', true],
    ['Small icon', '48 × 48', '—', false],
    ['Thin wordmark, 7.5:1', '300 × 40', '—', false],
];

export const LogoSizes = () => (
    <div className="hbz">
        <div className="hbz-head">
            <p className="hbz-big">64 px</p>
            <div>
                <p>At least <strong>64 px tall</strong>. For logos wider than 5:1, at least <strong>320 px wide</strong> instead. SVG always passes.</p>
                <p className="hbz-muted">The hub header shows the logo at up to 40 px tall (32 px on phones). High-density screens draw that with 80 device pixels, so below 64 px it starts to blur. Favicons need at least 32 × 32 px, or the default favicon is used.</p>
            </div>
        </div>
        <div className="hbz-bars">
            <span className="hbz-label">Desktop header · logo box 200 × 40</span>
            <Bar brand={J} box={[200, 40]} h={40} />
            <Bar brand={R} box={[200, 40]} h={40} />
            <span className="hbz-label">Phone header · logo box 160 × 32</span>
            <Bar brand={J} box={[160, 32]} h={32} />
        </div>
        <p className="hbz-muted">Fit rule: scale the logo down until it fits the box, keep its shape, align it left. Never crop, never stretch. Trim empty or transparent margins before measuring.</p>
        <div className="hbz-table" role="table" aria-label="Logo size examples">
            <div className="hbz-row is-head" role="row"><span role="columnheader">Example</span><span role="columnheader">Size</span><span role="columnheader">In the header</span><span role="columnheader">Result</span></div>
            {ROWS.map(([ex, size, shown, ok, label]) => (
                <div key={ex} className="hbz-row" role="row">
                    <span role="cell">{ex}</span><span role="cell">{size}</span><span role="cell">{shown}</span>
                    <span role="cell"><StatusPill label={label || (ok ? 'Accepted' : 'Rejected → default look')} tone={ok ? 'success' : 'danger'} /></span>
                </div>
            ))}
        </div>
    </div>
);
