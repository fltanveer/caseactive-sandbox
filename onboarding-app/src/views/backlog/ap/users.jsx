/* AP-1 · 1 · A user's intake forms and signed copy.

   The real Edit User window, on its Intake Forms tab, with the tab's table
   patched in: form, status, signed copy, view and delete. Viewing a form
   opens the CW-1 viewer read-only, full page, and Close goes back to Users. */

import { useState } from 'react';
import StatusPill from '../../../components/StatusPill';
import ConfirmDelete from '../../../components/DeleteConfirmModal';
import UsersView from '../../UsersView';
import { AdminFrame, Patch, New, Phone } from '../Shell';
import { AutoOpen } from '../Drive';
import { usePatched } from '../patchContext';
import { Viewer, Lines } from '../cw/doc';
import { FIRM, Icon } from '../ms/parts';

const USER = 'Gold Roger';

/* Completed, Incomplete and No longer asked are the three the tab has. */
const STATUS = {
    completed: { label: 'Completed', tone: 'success' },
    incomplete: { label: 'Incomplete', tone: 'warning' },
    retired: { label: 'No longer asked', tone: 'neutral' },
};

/* The signed copy cell, in each of its five states. */
const ROWS = [
    { name: 'Client Intake Questionnaire', status: 'completed', copy: { kind: 'signed', on: 'Jun 2, 2026' } },
    { name: 'HIPAA Authorization', status: 'completed', copy: { kind: 'making' } },
    { name: 'Medical Records Release', status: 'completed', copy: { kind: 'failed' } },
    { name: 'Prior Injuries', status: 'incomplete', copy: { kind: 'none' } },
    { name: 'Intake Form (2025)', status: 'retired', copy: { kind: 'earlier', on: 'Mar 3, 2026' } },
];

const CopyCell = ({ copy }) => {
    if (copy.kind === 'none') return <span className="ms-muted">—</span>;
    if (copy.kind === 'making') return <span className="ap-copy is-making"><span className="cw-spin" aria-hidden="true" />A new signed copy is being made</span>;
    if (copy.kind === 'failed') return <span className="ap-copy is-failed"><Icon name="alert" size={13} />Couldn&apos;t be made</span>;
    return (
        <span className="ap-copy">
            <span>{copy.kind === 'earlier' ? `Earlier copy · ${copy.on}` : `Signed ${copy.on}`}</span>
            <button type="button" className="btn btn-link ap-dl"><Icon name="down" size={13} />Download</button>
        </span>
    );
};

const Skeleton = () => (
    <div className="ap-utable" aria-busy="true" aria-label="Loading intake forms">
        <div className="ap-utable-head"><span>Form</span><span>Status</span><span>Signed copy</span><span /></div>
        {[0, 1, 2].map(i => (
            <div key={i} className="ap-utable-row">
                <span className="cw-skel-bar" style={{ width: '70%' }} /><span className="cw-skel-bar" style={{ width: '60%' }} />
                <span className="cw-skel-bar" style={{ width: '80%' }} /><span />
            </div>
        ))}
    </div>
);

/* state: list | loading | empty | delete */
const IntakeTab = ({ state }) => {
    const [rows, setRows] = useState(ROWS);
    const [del, setDel] = useState(state === 'delete' ? ROWS[3] : null);
    if (state === 'loading') return <div className="ap-uint"><Skeleton /></div>;
    if (state === 'empty' || rows.length === 0) {
        return (
            <div className="ap-uint">
                <div className="ap-empty">
                    <span className="ap-empty-ic"><Icon name="file" size={22} /></span>
                    <p className="ap-empty-title">No intake forms yet</p>
                    <p className="ms-p ms-muted">{USER}&apos;s intake forms show here once they&apos;re asked to fill one in.</p>
                </div>
            </div>
        );
    }
    return (
        <div className="ap-uint">
            <div className="ap-utable" role="table" aria-label="Intake forms">
                <div className="ap-utable-head" role="row"><span>Form</span><span>Status</span><span>Signed copy</span><span /></div>
                {rows.map(r => (
                    <div key={r.name} className="ap-utable-row" role="row">
                        <span className="ap-uname" data-label="Form">{r.name}</span>
                        <span data-label="Status"><StatusPill {...STATUS[r.status]} /></span>
                        <span data-label="Signed copy"><CopyCell copy={r.copy} /></span>
                        <span className="ap-uact">
                            <button type="button" className="users-icon-btn" aria-label={`View ${r.name}`} data-tooltip="View"><Icon name="eye" size={14} /></button>
                            <button type="button" className="users-icon-btn eu-intake-delete-btn" aria-label={`Delete ${r.name}`} data-tooltip="Delete" onClick={() => setDel(r)}><Icon name="trash" size={14} /></button>
                        </span>
                    </div>
                ))}
            </div>
            {del && (
                <ConfirmDelete
                    title="Delete intake form" name={`${del.name} for ${USER}`}
                    detail={`${USER}'s answers to this form are removed. This can't be undone.`}
                    confirmLabel="Delete form" cancelLabel="Keep form"
                    onConfirm={() => { setRows(rows.filter(x => x !== del)); setDel(null); }} onCancel={() => setDel(null)}
                />
            )}
        </div>
    );
};

/* state: list | loading | empty | delete */
export const UserIntake = ({ state = 'list', phone = false }) => {
    const on = usePatched();
    const frame = (
        <div className={on && phone ? 'ap-fit' : undefined}>
            <AdminFrame
                nav="Users" title="Users" breadcrumb="Users" newBtn height={phone ? undefined : 820}
                patch={<Patch edits={[{ at: '.eu-intake-grid-wrap', mode: 'replace', children: <New><IntakeTab key={state} state={state} /></New> }]} />}
            >
                <div className="tk-mount">
                    <AutoOpen clicks={['.eu-edit-client-btn', '.eu-left-nav .eu-nav-tab:nth-child(3)']}>
                        <UsersView />
                    </AutoOpen>
                </div>
            </AdminFrame>
        </div>
    );
    return phone ? <Phone>{frame}</Phone> : frame;
};

/* Viewing a form: read-only, full page, Close goes back to Users. */
const ANSWERS = [
    ['Full name', USER], ['Mobile phone', '(213) 555-0148'], ['Date of the accident', 'May 12, 2026'],
    ['Where did it happen?', 'Wilshire Blvd & S Grand Ave, Los Angeles'], ['What happened', 'Stopped at a red light when a delivery truck hit the back of the car.'],
];

export const IntakeView = ({ phone = false }) => {
    const frame = (
        <AdminFrame
            nav="Users" title="Client Intake Questionnaire" breadcrumb={`Users · ${USER} · Intake forms`} height={phone ? undefined : 820}
            actions={<div className="ms-docbar-actions"><StatusPill {...STATUS.completed} /><button type="button" className="btn btn-secondary">Close</button></div>}
        >
            <Viewer pages={1} bar={<span className="cw-save"><Icon name="lock" size={13} />{USER}&apos;s answers · read-only</span>}
                actions={<button type="button" className="btn btn-secondary">Close</button>}>
                <div className="ms-paper cw-page">
                    <p className="ms-paper-heading">{FIRM} · Client Intake Questionnaire</p>
                    <Lines widths={[88, 92, 70]} />
                    {ANSWERS.map(([q, a]) => (
                        <div key={q} className="cw-field is-read">
                            <span className="cw-field-label">{q}</span>
                            <span className="ap-answer">{a}</span>
                        </div>
                    ))}
                </div>
            </Viewer>
        </AdminFrame>
    );
    return phone ? <Phone>{frame}</Phone> : frame;
};
