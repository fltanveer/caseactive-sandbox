/* AP-1 · Design the missing Admin Panel screens: a user's intake forms,
   Time Zone and Translation, template editor.

   Same rules as CW-1: the sandbox's look, every feature, state and message
   the screen has today, and anything added or dropped raised on the
   ticket's thread for Welby. */

import { UserIntake, IntakeView } from './users';
import { GeneralCards } from './general';
import { TemplateUpload, TemplateEditor } from './editor';
import './ap.css';

export const AP_TICKET = {
    no: 18,
    key: 'AP-1',
    ticketName: 'Design the missing Admin Panel screens: a user\'s intake forms, Time Zone and Translation, template editor',
    domain: 'ca-manage',
    status: 'To Do',
    severity: 'Medium',
    link: 'https://caseactive.slack.com/lists/TJQSXGPJB/F09M1DLSBC6?record_id=Rec0CDYC631GA',
    title: 'Admin Panel screens',
    roles: ['admin', 'manager'],
    brief: [
        'Use the sandbox\'s look. Keep every feature, state and message the screen has today. If you would add or drop something, say so in this ticket\'s thread so Welby can decide.',
        'A user\'s intake forms: a table of form, status (Completed, Incomplete, No longer asked), signed copy, view and delete. The signed copy cell: none; a new copy being made; couldn\'t be made; signed on a date, or an earlier copy, with Download. States: loading, none yet, delete confirmation. Viewing opens the form read-only and Close goes back to Users. On a phone the window fills the screen and its side menu becomes a grid.',
        'Time Zone and Translation, near the bottom of General with Google Analytics after them: a hub time zone with a hint, and a switch to translate case updates and comments with a note that it may not be exact. States: loading, saving, saved, failed with the value going back. A Manager sees both disabled with "Only an Admin can change this."',
        'Template editor: the upload window (Blank page or From Upload, preparing, conversion failed); the header with Preview/Edit and Close; the toolbar (undo, redo, align, page editor, add field) with page tools off for an upload; Field Logic and Duplicate on a field; Properties with prefill data and, on e-signs, the participant with a warning when none is set. States: all changes saved; couldn\'t save with Retry; leaving with unsaved changes; the participants warning; a published template, read-only. A proper placeholder title for an unnamed template.',
    ],
    alsoKnown: 'These replace MS-1\'s first drafts of the same three. The Manager lock is HF-15\'s pattern (1.1) and its line. The e-sign participant warning follows 4.3: saving is allowed and the field stays unassigned, and sending is what\'s blocked. The read-only form viewer is CW-1\'s.',
    decision: 'The intake table keeps its view and delete and gains nothing else: the signed copy cell says which of its five states it\'s in, and only the two with a file offer Download. On a phone the Edit User window fills the screen and its four tabs become a two-by-two grid, so the tab names stay readable. Time Zone and Translation save the moment they change, so each card carries its own Saving, Saved or "Couldn\'t save" in its header, and a failure says what the value went back to. The editor\'s header keeps Preview/Edit and Close and adds the save state beside them, where the person looks after a change. The page editor stays in the toolbar for an upload but is greyed with its reason, rather than vanishing. Clicking a field shows a small bar with Field Logic and Duplicate; Field Logic opens Properties. An unnamed template reads "Untitled form template" or "Untitled e-sign template" in grey italic with the rename pencil, instead of "Create New Doc Form Builder". Added, for Welby to approve: a one-line description under Blank page and From Upload; "Choose another file" after a failed conversion; the participants warning above the page as well as in Field Logic.',
    items: [
        { id: '18.1', what: 'Intake Forms tab: form, status, signed copy, view and delete; the five signed copy states; loading, none yet and delete confirmation.', where: 'Admin → Users → edit a user → Intake Forms', file: 'src/views/UsersView.jsx (IntakeFormsTab)', roles: ['admin'] },
        { id: '18.2', what: 'Viewing an intake form: read-only with the user\'s answers, Close back to Users.', where: 'Intake Forms → View', file: 'Not in this codebase (ca-manage form viewer)', roles: ['admin'], missing: true },
        { id: '18.3', what: 'Edit User on a phone: full screen, the side menu as a grid.', where: 'Admin → Users → edit a user, ≤640px', file: 'src/views/EditUserView.css', roles: ['admin'] },
        { id: '18.4', what: 'Time Zone card: hub time zone with a hint; loading, saving, saved, failed and back to the old value.', where: 'Admin → Settings → General', file: 'src/views/settings/GeneralSettingsView.jsx', roles: ['admin', 'manager'] },
        { id: '18.5', what: 'Translation card: translate case updates and comments, may not be exact; the same four states.', where: 'Admin → Settings → General', file: 'src/views/settings/GeneralSettingsView.jsx', roles: ['admin', 'manager'] },
        { id: '18.6', what: 'Manager view of both cards: disabled with "Only an Admin can change this."', where: 'Admin → Settings → General', file: 'src/components/LockedControl.jsx', roles: ['manager'] },
        { id: '18.7', what: 'Upload window: Blank page or From Upload (PDF or Word), preparing your document, conversion failed.', where: 'Library → Form or E-Sign Templates → NEW', file: 'src/views/library/FormTemplatesView.jsx (AddPageModal), ESignTemplatesView.jsx', roles: ['admin'] },
        { id: '18.8', what: 'Editor: header with the template name, save state, Preview/Edit and Close; toolbar with undo, redo, align, page editor and add field, page tools off for an upload; Field Logic and Duplicate on a field.', where: 'Template editor', file: 'Not in this codebase (ca-manage template editor)', roles: ['admin'], missing: true },
        { id: '18.9', what: 'Field Logic (Properties): prefill data; on e-signs the participant, with a warning when none is set.', where: 'Template editor → a field → Field Logic', file: 'Not in this codebase (ca-manage template editor)', roles: ['admin'], missing: true },
        { id: '18.10', what: 'Editor states: all changes saved; couldn\'t save with Retry; leaving with unsaved changes (Retry, Leave anyway); participants warning; published and read-only.', where: 'Template editor', file: 'Not in this codebase (ca-manage template editor)', roles: ['admin'], missing: true },
        { id: '18.11', what: 'Placeholder title for an unnamed template: "Untitled form template" or "Untitled e-sign template".', where: 'Template editor header', file: 'Not in this codebase (ca-manage template editor)', roles: ['admin'], missing: true },
    ],
    screens: [
        /* ── Intake forms ── */
        { id: 'intake', label: 'Intake forms', roles: ['admin'],
            note: 'The real Edit User window, Intake Forms tab. The signed copy column shows all five of its states, one per row. Delete asks first.',
            render: () => <UserIntake key="intake" /> },
        { id: 'intake-loading', label: 'Intake forms · loading', roles: ['admin'], render: () => <UserIntake key="intake-loading" state="loading" /> },
        { id: 'intake-empty', label: 'Intake forms · none yet', roles: ['admin'], render: () => <UserIntake key="intake-empty" state="empty" /> },
        { id: 'intake-delete', label: 'Intake forms · delete', roles: ['admin'], render: () => <UserIntake key="intake-delete" state="delete" /> },
        { id: 'intake-view', label: 'Intake form · viewing', roles: ['admin'],
            note: 'Read-only, full page. Close goes back to Users.',
            render: () => <IntakeView key="intake-view" /> },
        { id: 'intake-phone', label: 'Intake forms · phone', roles: ['admin'], phone: true,
            note: 'The window fills the screen; Profile, Custom Fields, Intake Forms and Settings become a grid.',
            render: () => <UserIntake key="intake-phone" phone /> },
        { id: 'intake-view-phone', label: 'Intake form · viewing · phone', roles: ['admin'], phone: true, render: () => <IntakeView key="intake-view-phone" phone /> },

        /* ── General ── */
        { id: 'general', label: 'Time Zone & Translation', roles: ['admin', 'manager'],
            note: 'Above Google Analytics. Change either to see Saving then Saved. Pick Eastern Time to see a failed save put the value back.',
            render: (role) => <GeneralCards key={`general-${role}`} role={role} /> },
        { id: 'general-loading', label: 'General · loading', roles: ['admin'], render: () => <GeneralCards key="general-loading" state="loading" /> },
        { id: 'general-saving', label: 'General · saving', roles: ['admin'], render: () => <GeneralCards key="general-saving" state="saving" /> },
        { id: 'general-saved', label: 'General · saved', roles: ['admin'], render: () => <GeneralCards key="general-saved" state="saved" /> },
        { id: 'general-failed', label: 'General · couldn\'t save', roles: ['admin'], render: () => <GeneralCards key="general-failed" state="failed" /> },
        { id: 'general-manager', label: 'General · Manager', roles: ['manager'],
            note: 'Both cards locked with HF-15\'s line.',
            render: () => <GeneralCards key="general-manager" role="manager" /> },
        { id: 'general-phone', label: 'General · phone', roles: ['admin', 'manager'], phone: true,
            render: (role) => <GeneralCards key={`general-phone-${role}`} role={role} phone /> },

        /* ── Template editor ── */
        { id: 'upload', label: 'Upload · choose', roles: ['admin'], render: () => <TemplateUpload key="upload" /> },
        { id: 'upload-preparing', label: 'Upload · preparing', roles: ['admin'], render: () => <TemplateUpload key="upload-preparing" state="preparing" /> },
        { id: 'upload-failed', label: 'Upload · conversion failed', roles: ['admin'], render: () => <TemplateUpload key="upload-failed" kind="esign" state="failed" /> },
        { id: 'editor-form', label: 'Form editor', roles: ['admin'],
            note: 'An uploaded form. Page tools are greyed with their reason. Click any field for Field Logic and Duplicate; Preview shows it as it will be filled.',
            render: () => <TemplateEditor key="editor-form" kind="form" /> },
        { id: 'editor-esign', label: 'E-sign editor', roles: ['admin'],
            note: 'Two fields have no participant: amber, dashed, and counted above the page.',
            render: () => <TemplateEditor key="editor-esign" kind="esign" /> },
        { id: 'logic-form', label: 'Field Logic · form', roles: ['admin'], render: () => <TemplateEditor key="logic-form" kind="form" state="logic" /> },
        { id: 'logic-esign', label: 'Field Logic · e-sign, no participant', roles: ['admin'],
            note: 'Following 4.3: Save works, and the warning says sending is what waits for a participant.',
            render: () => <TemplateEditor key="logic-esign" kind="esign" state="logic" /> },
        { id: 'editor-failed', label: 'Editor · couldn\'t save', roles: ['admin'], render: () => <TemplateEditor key="editor-failed" kind="form" state="failed" /> },
        { id: 'editor-leaving', label: 'Editor · leaving unsaved', roles: ['admin'], render: () => <TemplateEditor key="editor-leaving" kind="form" state="leaving" /> },
        { id: 'editor-untitled', label: 'Editor · untitled', roles: ['admin'],
            note: 'Today an unnamed template is titled "Create New Doc Form Builder".',
            render: () => <TemplateEditor key="editor-untitled" kind="form" untitled /> },
        { id: 'published-form', label: 'Form · published', roles: ['admin'], render: () => <TemplateEditor key="published-form" kind="form" state="published" /> },
        { id: 'published-esign', label: 'E-sign · published', roles: ['admin'], render: () => <TemplateEditor key="published-esign" kind="esign" state="published" /> },
        { id: 'editor-phone', label: 'Editor · phone', roles: ['admin'], phone: true,
            note: 'The toolbar scrolls sideways; the page fits the width.',
            render: () => <TemplateEditor key="editor-phone" kind="esign" phone /> },
    ],
};
