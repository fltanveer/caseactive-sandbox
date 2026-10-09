/* DesignationLabel — "Staff · Lead Attorney".

   A designation is a job title inside a role, so it is always shown attached
   to the role rather than on its own: "Lead Attorney" alone does not say what
   the person can do, and the role alone does not say what they are called.

   Editable renders a button, because a designation that can be changed should
   look changeable in the row it sits in, without a separate edit affordance.
   Everyone else gets plain text, never a disabled button.
*/

import './DesignationLabel.css';

const DesignationLabel = ({
    role,
    designation,
    editable = false,
    onEdit,
    placeholder = 'No designation',
    className = '',
}) => {
    const has = Boolean(designation);
    const inner = (
        <>
            <span className="dsg-role">{role}</span>
            <span className="dsg-sep" aria-hidden="true">·</span>
            <span className={`dsg-name${has ? '' : ' is-empty'}`}>{has ? designation : placeholder}</span>
        </>
    );

    if (!editable) {
        return <span className={`dsg ${className}`}>{inner}</span>;
    }

    return (
        <button
            type="button"
            className={`dsg dsg-btn ${className}`}
            onClick={onEdit}
            aria-label={`Change designation for ${role}. Currently ${has ? designation : placeholder}.`}
        >
            {inner}
            <svg className="dsg-caret" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
    );
};

export default DesignationLabel;
