/* Build notes for AP-1, keyed by item id. Same fields as ../specs.js. */

export const AP_SPECS = {
    '18.1': {
        today: 'The sandbox tab lists two forms as Incomplete with view and delete icons that do nothing, and no signed copy column.',
        why: 'An Admin opens this tab to see what a client filled in and whether the signed copy exists. The signed copy cell answers that in words, so nobody has to open a form to find out.',
        anatomy: ['Table: Form, Status, Signed copy, and View and Delete icons', 'Status: Completed, Incomplete, No longer asked', 'Signed copy: —; a spinner and "A new signed copy is being made"; "Couldn\'t be made"; "Signed {date}" or "Earlier copy · {date}" with Download'],
        states: [['Loading', 'Three shimmering rows under the real header.'], ['None yet', '"No intake forms yet" and when they appear.'], ['Delete', 'The shared delete window: the form and the person named, what goes, Keep form and Delete form.']],
        copy: ['Completed', 'Incomplete', 'No longer asked', 'A new signed copy is being made', 'Couldn\'t be made', 'Signed {date}', 'Earlier copy · {date}', 'Download', 'No intake forms yet', '{name}\'s intake forms show here once they\'re asked to fill one in.', 'Delete {form} for {name}?', '{name}\'s answers to this form are removed. This can\'t be undone.'],
        rules: ['Only "Signed" and "Earlier copy" offer Download.', 'Open question for the thread: does deleting a form also remove its signed copy?'],
        done: 'Every status and signed copy state shows in the table, with loading, empty and delete.',
    },
    '18.2': {
        why: 'Answers are a record, so they show in the same read-only viewer clients fill them in (CW-1), with the person\'s name on it.',
        anatomy: ['Admin title bar: form name, Users · {name} · Intake forms; top right "{name}\'s answers · read-only", Completed, Close', 'The viewer, read-only, with no bar under it'],
        rules: ['Close goes back to Users, not to the Edit User window.'],
        done: 'Viewing a form shows the answers read-only and Close returns to Users.',
    },
    '18.3': {
        why: 'Four tabs in a side menu leave no room for the content on a phone. A two-by-two grid keeps the tab names whole and costs one row.',
        rules: ['At ≤640px the window has no margin or radius and fills the screen.', 'The table drops its header; each row puts the actions top right and the signed copy on its own line.'],
        done: 'On a phone the window is full screen with the tabs as a grid.',
    },
    '18.4': {
        why: 'The setting saves on change, so the card says it did, or didn\'t, right where the change was made.',
        states: [['Loading', 'The dropdown is disabled and the card dims.'], ['Saving', 'Spinner and "Saving…" in the card header.'], ['Saved', 'Green check and "Saved".'], ['Failed', '"Couldn\'t save. Changed back to {zone}." and the dropdown shows the old value.']],
        copy: ['Time Zone', 'Hub time zone', 'Due dates, reminders and automations use this time. Anyone who hasn\'t set their own time zone sees it too.', 'Saving…', 'Saved', 'Couldn\'t save. Changed back to {zone}.'],
        rules: ['Placed after User Signup & Inquiry, so Google Analytics comes after both cards.'],
        done: 'Changing the zone shows saving and saved, and a failure puts the old zone back and says so.',
    },
    '18.5': {
        copy: ['Translation', 'Translate case updates and comments', 'Each reader sees them in their own language. Translation is automatic and may not be exact.', 'Couldn\'t save. Switched back {on|off}.'],
        states: [['Loading, saving, saved, failed', 'As 18.4, with the switch going back on a failure.']],
        done: 'The switch saves on change with the same four states.',
    },
    '18.6': {
        why: 'HF-15 decided that a Manager sees Admin-only controls greyed with one line, rather than hidden.',
        rules: ['Both cards wrap their control in LockedControl with its default line.', 'The save sign never shows for a Manager.'],
        done: 'A Manager sees both values, cannot change them, and reads "Only an Admin can change this."',
    },
    '18.7': {
        today: 'The sandbox window has Blank page and From Upload, and nothing after a file is picked.',
        states: [['Choose', 'Blank page or From Upload (PDF or Word).'], ['Preparing', 'The file, a progress bar, "Preparing your document…".'], ['Failed', '"This document couldn\'t be converted" with what to try, and Choose another file.']],
        copy: ['Add a new page', 'Blank page', 'From Upload', 'A PDF or Word document.', 'Preparing your document…', 'It opens in the editor when it\'s ready. Large files can take a minute.', 'This document couldn\'t be converted', 'Check that it opens on your computer, then try again. If it\'s a Word file, saving it as a PDF first usually works.', 'Choose another file'],
        done: 'Picking a file shows preparing, and a failed conversion says what to do next.',
    },
    '18.8': {
        why: 'The header follows HD-1: the name is the page title with a rename pencil. Save state sits beside Preview/Edit so it is read right after a change.',
        anatomy: ['Title: template name and pencil', 'All changes saved, or Couldn\'t save with Retry', 'Edit | Preview', 'Close', 'Toolbar: Undo, Redo | Align ▾, Pages | Add field ▾', 'The page with fields; the selected field shows a bar with Field Logic and Duplicate'],
        rules: ['For an uploaded document, Pages is disabled with "Pages can\'t be added, moved or removed on an uploaded document" and a note at the toolbar\'s end.', 'Preview hides the toolbar and shows fields as a participant sees them.'],
        done: 'The editor has its header, toolbar and field bar, with page tools off for an upload.',
    },
    '18.9': {
        why: 'Ticket 4.3 decided a field with no participant can be saved; the warning says what that means and that sending is what waits.',
        copy: ['Field Logic', 'Prefill data', 'Filled in from the case when the {form|e-sign} is sent. The person can still change it.', 'Participant', 'Choose who fills it in', 'No participant is set, so nobody can fill in this field. You can save now and choose one later; the template can\'t be sent until every field has one.'],
        done: 'Field Logic shows prefill on both kinds and the participant with its warning on e-signs.',
    },
    '18.10': {
        states: [['All changes saved', 'Green check in the header.'], ['Couldn\'t save', 'Header turns red with Retry; an error above the page says everything before it is saved.'], ['Leaving unsaved', '"Leave without saving?" with Retry and Leave anyway.'], ['Participants', 'Amber, dashed fields marked "No participant" and a count above the page.'], ['Published', 'Published pill, no toolbar, no Edit/Preview, fields can\'t be selected, "This template is published, so it\'s read-only."']],
        done: 'Every editor state exists for both form and e-sign templates.',
    },
    '18.11': {
        today: 'An unnamed template is titled "Create New Doc Form Builder".',
        why: 'The title should say what the thing is and that it has no name yet. Grey italic with the pencil reads as a placeholder and invites naming it.',
        copy: ['Untitled form template', 'Untitled e-sign template', 'Name this template'],
        done: 'A new template without a name shows the placeholder title.',
    },
};
