/* CW-1 · 4 · Event details, over the case's real Events list.

   In the ticket's order: a map or date tile, the name, Attending (invited
   people only), Add to calendar, organiser, place or call link, date and
   repeat, duration, who is attending, maybe or not, and the description.
   A section with no data is left out rather than shown empty. */

import { useState } from 'react';
import EventsView from '../../EventsView';
import { usePatched } from '../patchContext';
import { CLIENT, ATTORNEY, Icon, CasePage, Dialog } from '../ms/parts';

const PLACE = {
    title: 'Deposition — Rear-End Collision', color: '#8B5CF6',
    when: 'Fri, May 30, 2026 · 2:00 PM PT', repeat: 'Does not repeat', duration: '2 hr 30 min',
    place: { name: 'Downtown LA Courthouse, Room 4B', address: '111 N Hill St, Los Angeles, CA 90012' },
    description: 'Defense deposition of the plaintiff. Bring the exhibit binder and the ER records.',
    yes: [ATTORNEY, 'Sara Chen', 'Elena Ramirez', 'Jordan Admin', 'Dr. Lena Kim', 'Tom Hale'],
    maybe: ['Nina Patel'],
    no: ['Sarah Lee'],
};

const CALL = {
    title: 'Weekly check-in with your legal team', color: '#149EB1',
    when: 'Tue, Jun 2, 2026 · 4:00 PM PT', repeat: 'Every Tuesday', duration: '30 min',
    call: 'meet.caseactive.com/sb-reyes-weekly',
    yes: [ATTORNEY], maybe: [], no: [],
};

const initials = (n) => n.replace('Dr. ', '').split(' ').map(w => w[0]).join('').slice(0, 2);

/* Three faces and "+N more", then the names on demand. */
const People = ({ label, names }) => {
    const [all, setAll] = useState(false);
    if (!names.length) return null;
    const shown = all ? names : names.slice(0, 3);
    return (
        <div className="cw-ev-people">
            <span className="cw-ev-people-label">{label} <em>{names.length}</em></span>
            <ul>
                {shown.map(n => <li key={n}><span className="ms-avatar is-sm">{initials(n)}</span>{n}</li>)}
                {!all && names.length > 3 && <li><button type="button" className="btn btn-link" onClick={() => setAll(true)}>+{names.length - 3} more</button></li>}
            </ul>
        </div>
    );
};

const MapTile = () => (
    <div className="cw-ev-map" aria-label="Map of Downtown LA Courthouse">
        <svg viewBox="0 0 600 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect width="600" height="150" fill="#EEF2F6" />
            <path d="M0 40h600M0 105h600M90 0v150M260 0v150M430 0v150M520 0v150" stroke="#fff" strokeWidth="14" />
            <path d="M0 150L600 10" stroke="#fff" strokeWidth="20" />
            <rect x="290" y="55" width="110" height="40" rx="4" fill="#DDE5EE" />
            <rect x="110" y="60" width="130" height="30" rx="4" fill="#E2F0E6" />
        </svg>
        <span className="cw-ev-pin"><Icon name="pin" size={22} w={2.2} /></span>
    </div>
);

const DateTile = ({ ev }) => (
    <div className="cw-ev-date" style={{ '--c': ev.color }}>
        <span className="cw-ev-date-day">{ev.when.slice(0, 3)}</span>
        <span className="cw-ev-date-num">{ev.when.match(/\d+/)[0]}</span>
        <span className="cw-ev-date-mon">{ev.when.split(' ')[1]}</span>
    </div>
);

const EventDialog = ({ ev, invited, closed }) => {
    const [answer, setAnswer] = useState(null);
    const [cal, setCal] = useState(false);
    const yes = answer === 'yes' ? [CLIENT, ...ev.yes] : ev.yes;
    const maybe = answer === 'maybe' ? [CLIENT, ...ev.maybe] : ev.maybe;
    const no = answer === 'no' ? [CLIENT, ...ev.no] : ev.no;
    return (
        <Dialog title="Event details" width={600} onClose={() => {}} className="cw-ev"
            footer={<button type="button" className="btn btn-secondary">Close</button>}>
            {ev.place ? <MapTile /> : <DateTile ev={ev} />}
            <h3 className="cw-ev-title"><span className="cw-ev-swatch" style={{ background: ev.color }} />{ev.title}</h3>

            <div className="cw-ev-actions">
                {invited && !closed && (
                    <div className="ms-rsvp" role="group" aria-label="Attending">
                        <span>Attending</span>
                        {[['yes', 'Yes'], ['no', 'No'], ['maybe', 'Maybe']].map(([k, l]) => (
                            <button key={k} type="button" className={`ms-rsvp-btn${answer === k ? ' is-on' : ''}`} aria-pressed={answer === k} onClick={() => setAnswer(k)}>{l}</button>
                        ))}
                    </div>
                )}
                <div className="ms-addcal">
                    <button type="button" className="btn btn-secondary btn-sm" disabled={closed} aria-expanded={cal}
                        title={closed ? 'This case is closed' : undefined} onClick={() => setCal(o => !o)}>
                        <Icon name="cal" size={14} />Add to calendar<Icon name="caret" size={12} />
                    </button>
                    {cal && (
                        <div className="ms-menu">
                            <button type="button">Google Calendar</button><button type="button">Outlook</button><button type="button">Apple Calendar (.ics)</button>
                        </div>
                    )}
                </div>
            </div>
            {closed && <p className="ms-small ms-muted cw-ev-closed"><Icon name="lock" size={12} />This case is closed. The event can be viewed but not added to a calendar.</p>}

            <dl className="ms-event-rows cw-ev-rows">
                <dt><Icon name="user" /></dt>
                <dd><span className="cw-ev-k">Organiser</span><strong>{ATTORNEY}</strong></dd>
                {ev.place && (<>
                    <dt><Icon name="pin" /></dt>
                    <dd><span className="cw-ev-k">Place</span><strong>{ev.place.name}</strong><span>{ev.place.address}</span></dd>
                </>)}
                {ev.call && (<>
                    <dt><Icon name="video" /></dt>
                    <dd><span className="cw-ev-k">Call link</span><a href="#call" onClick={e => e.preventDefault()}>{ev.call}</a></dd>
                </>)}
                <dt><Icon name="cal" /></dt>
                <dd><span className="cw-ev-k">Date</span><strong>{ev.when}</strong><span>{ev.repeat}</span></dd>
                <dt><Icon name="clock" /></dt>
                <dd><span className="cw-ev-k">Duration</span><strong>{ev.duration}</strong></dd>
            </dl>

            {(yes.length + maybe.length + no.length) > 0 && (
                <div className="cw-ev-guests">
                    <People label="Attending" names={yes} />
                    <People label="Maybe" names={maybe} />
                    <People label="Not attending" names={no} />
                </div>
            )}
            {ev.description && (
                <div className="ms-event-desc">
                    <span className="ms-event-cap">Description</span>
                    <p>{ev.description}</p>
                </div>
            )}
        </Dialog>
    );
};

/* kind: place | call */
export const EventDetails = ({ role = 'client', phone = false, kind = 'place', invited = true, closed = false }) => {
    const on = usePatched();
    return (
        <CasePage role={role} nav="Events" phone={phone} height={phone ? undefined : 880}
            modal={on && <EventDialog ev={kind === 'call' ? CALL : PLACE} invited={invited} closed={closed} />}>
            <div className="tk-mount"><EventsView embedded /></div>
        </CasePage>
    );
};
