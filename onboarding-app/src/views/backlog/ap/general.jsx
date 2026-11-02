/* AP-1 · 2 · Time Zone and Translation, at the bottom of General settings
   with Google Analytics after them.

   Each card saves on its own when changed, so each has its own saving,
   saved and failed sign. A Manager sees both locked with HF-15's line. */

import { useEffect, useRef, useState } from 'react';
import SearchableSelect from '../../../components/SearchableSelect';
import LockedControl from '../../../components/LockedControl';
import GeneralSettingsView from '../../settings/GeneralSettingsView';
import { AdminFrame, Patch, New, Phone } from '../Shell';
import { usePatched } from '../patchContext';
import { Icon, ScrollTo } from '../ms/parts';

const ZONES = [
    ['America/Los_Angeles', 'Pacific Time — Los Angeles'],
    ['America/Denver', 'Mountain Time — Denver'],
    ['America/Chicago', 'Central Time — Chicago'],
    ['America/New_York', 'Eastern Time — New York'],
];
const zoneName = (z) => ZONES.find(([k]) => k === z)[1];

const Sign = ({ state, revertedTo }) => {
    if (state === 'saving') return <span className="ap-sign" role="status"><span className="cw-spin" aria-hidden="true" />Saving…</span>;
    if (state === 'saved') return <span className="ap-sign is-ok" role="status"><Icon name="check" size={13} w={2.8} />Saved</span>;
    if (state === 'failed') return <span className="ap-sign is-err" role="alert"><Icon name="alert" size={13} />Couldn&apos;t save. {revertedTo}</span>;
    return null;
};

/* Saving a card: saving, then saved, or failed and back to the old value. */
const useCardSave = (initial, start) => {
    const [value, setValue] = useState(initial);
    const [state, setState] = useState(start === 'ready' || start === 'loading' ? null : start);
    const t = useRef(null);
    useEffect(() => () => clearTimeout(t.current), []);
    const change = (v, fail = false) => {
        const before = value;
        setValue(v);
        setState('saving');
        clearTimeout(t.current);
        t.current = setTimeout(() => {
            if (fail) { setValue(before); setState('failed'); } else setState('saved');
        }, 900);
    };
    return [value, state, change];
};

const Card = ({ title, sign, children }) => (
    <div className="gs-card">
        <div className="gs-card-header ap-card-head"><h2 className="gs-card-title">{title}</h2>{sign}</div>
        <div className="gs-card-body">{children}</div>
    </div>
);

const Lock = ({ manager, children }) => (manager ? <LockedControl>{children}</LockedControl> : children);

const TimeZoneCard = ({ state, manager }) => {
    const loading = state === 'loading';
    const [zone, sign, change] = useCardSave(state === 'failed' ? 'America/Los_Angeles' : 'America/Los_Angeles', state);
    return (
        <Card title="Time Zone" sign={<Sign state={sign} revertedTo={`Changed back to ${zoneName(zone).split(' — ')[0]}.`} />}>
            <Lock manager={manager}>
                <div className="gs-field ap-tz-field">
                    <label className="gs-label" htmlFor="ap-tz">Hub time zone</label>
                    <SearchableSelect id="ap-tz" className="ccm-select" value={zone} disabled={loading || manager}
                        onChange={e => change(e.target.value, e.target.value === 'America/New_York')}>
                        {ZONES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                    </SearchableSelect>
                    <span className="gs-field-hint">Due dates, reminders and automations use this time. Anyone who hasn&apos;t set their own time zone sees it too.</span>
                </div>
            </Lock>
        </Card>
    );
};

const TranslationCard = ({ state, manager }) => {
    const loading = state === 'loading';
    const [on, sign, change] = useCardSave(true, state);
    return (
        <Card title="Translation" sign={<Sign state={sign} revertedTo={`Switched back ${on ? 'on' : 'off'}.`} />}>
            <Lock manager={manager}>
                <div className="gs-toggle-row ap-toggle-row">
                    <div className="gs-toggle-info">
                        <div className="gs-toggle-title">Translate case updates and comments</div>
                        <div className="gs-toggle-desc">Each reader sees them in their own language. Translation is automatic and may not be exact.</div>
                    </div>
                    <button type="button" className={`gs-toggle${on ? ' on' : ''}`} aria-pressed={on} aria-label="Translate case updates and comments"
                        disabled={loading || manager} onClick={() => change(!on)}>
                        <span className="gs-toggle-knob" />
                    </button>
                </div>
            </Lock>
        </Card>
    );
};

const Cards = ({ state, manager }) => (
    <div className={`ap-gs-stack${state === 'loading' ? ' is-loading' : ''}`} data-ap="tz" aria-busy={state === 'loading' || undefined}>
        <TimeZoneCard state={state} manager={manager} />
        <TranslationCard state={state} manager={manager} />
    </div>
);

/* state: ready | loading | saving | saved | failed */
export const GeneralCards = ({ state = 'ready', role = 'admin', phone = false }) => {
    const on = usePatched();
    const manager = role === 'manager';
    const frame = (
        <AdminFrame
            nav="Settings" sub="General" title="General" breadcrumb="Settings · General" height={phone ? undefined : 820}
            who={manager ? 'Elena Ramirez' : 'Robert Grant'} role={manager ? 'Manager' : 'Administrator'}
            patch={<Patch edits={[
                /* After User Signup, so Google Analytics comes next. Anchored on
                   the card before, which the insert doesn't renumber. */
                { at: '.gs-layout > .gs-card:nth-child(3)', mode: 'after', children: <New><Cards key={state + role} state={state} manager={manager} /></New> },
            ]} />}
        >
            <div className="tk-mount"><GeneralSettingsView /></div>
            {on ? <ScrollTo selector="[data-ap='tz']" /> : <ScrollTo selector=".gs-footer" offset={420} />}
        </AdminFrame>
    );
    return phone ? <Phone>{frame}</Phone> : frame;
};
