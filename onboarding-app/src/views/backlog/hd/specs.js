/* Build notes for HD-1, keyed by item id. Same fields as ../specs.js. */

export const HD_SPECS = {
    '15.1': {
        why: 'Every case page has one title bar with the page name on the left and actions on the right. The editor had its own heading, flush against the sidebar, with its label clipped by the top bar and its buttons floating above the line. Using the same bar means opening a document does not move anything the eye already knows. The case path and stage line is dropped here: the sidebar already names the case, and the editor needs the height.',
        anatomy: ['Document name, as the page title', 'Pencil to rename', 'Document status pill: Draft or Published', 'Preview', 'Close'],
        states: [['Draft', 'Unpublished document.'], ['Published'], ['Renaming', 'See 15.2.'], ['Preview', 'See 15.4.']],
        tokens: [
            ['bar', '.case-content-title: #fff, 1px #E2E8F0 bottom, 12px 28px, min-height 64px, one line'],
            ['title', '.portal-page-title: 22px/400 var(--text-primary)'],
            ['status', 'StatusPill, 10px after the pencil, centred on the title'],
            ['buttons', '38px tall, 0 16px, 1px #E2E8F0, 8px radius, 14px/600 #334155, 15px icon, 8px apart'],
        ],
        copy: ['Preview', 'Close', 'Draft', 'Published'],
        rules: [
            'Reuse .case-content-title as the case pages render it in LobbyView. No new bar.',
            'No .case-title-meta line: no case path, no stage pill.',
            'Close leaves for the list the editor was opened from: Forms or E-signs on this case.',
            'Preview and Close are vertically centred on the bar. Nothing sits above the title.',
            'The document\'s status goes beside its name: Draft until it is published.',
        ],
        done: 'Opening a document from Forms or E-signs keeps the title bar in the same place, with the document name where the page name was.',
    },
    '15.2': {
        why: 'Renaming is rare, and an always-open field reads as a form to fill in. A pencil keeps it one click away without making the title look editable all the time.',
        anatomy: ['Input at the title\'s size, in the title\'s place', 'Hint: Enter to save · Esc to cancel'],
        states: [['Idle', 'Title and pencil.'], ['Editing', 'Input with the name selected.'], ['Blank', 'Red outline and "Give it a name." The input keeps focus.'], ['Saving', 'The new name shows at once; on failure it reverts and a toast says why.']],
        tokens: [['input', '34px tall, 22px/400, 1px var(--accent), 3px focus ring at 15%'], ['pencil', '28px square, 14px icon #94A3B8, #F1F5F9 on hover']],
        copy: ['Rename {name}', 'Enter to save · Esc to cancel', 'Give it a name.'],
        rules: [
            'The input sits where the title was, at the same size, so the bar does not change height.',
            'Enter saves. Leaving the field saves when it is not blank. Esc puts the old name back.',
            'Trim spaces. A blank name is never saved.',
            'Focus returns to the pencil afterwards.',
        ],
        done: 'A document can be renamed from the editor without the bar jumping, and never to nothing.',
    },
    '15.3': {
        why: 'The solid teal bar outweighed the title and could not be closed. The app already has a dismissible note for this.',
        copy: ['Click a field, then Field Logic, and choose under Participants who may fill it in.'],
        rules: [
            'Use InfoBanner as it is.',
            'Once dismissed, it stays dismissed for that person on every document. Store it per user, not per document.',
        ],
        done: 'The note can be closed and does not come back.',
    },
    '15.4': {
        why: 'Preview is a mode of the same page, so the bar stays and only says which mode it is in.',
        anatomy: ['Same title and status, no pencil', 'Back to editing', 'Close', 'Note: nothing typed is saved'],
        copy: ['Back to editing', 'This is the document as a participant sees it. Nothing you type here is saved.'],
        rules: ['Preview is a mode, not a status: it never takes a pill.', 'Hide the tools while previewing.', 'No renaming while previewing.', 'Close leaves the editor from either mode.'],
        done: 'It is always clear whether the document is being edited or previewed.',
    },
    '15.5': {
        why: 'Document names are often long, and the buttons are how you leave the page.',
        rules: [
            'The title is one line with an ellipsis and a title attribute holding the full name.',
            'The status pill, the pencil and the buttons do not shrink or wrap. The title gives way first.',
        ],
        done: 'A 90-character name never pushes Preview or Close off the bar.',
    },
    '15.6': {
        why: 'Below 1024px the case bar stacks its actions under the title. In the editor they are the way out, so they stay on the title\'s row and lose their words instead.',
        tokens: [['buttons', '40px square, icon only, aria-label kept'], ['bar', '12px 16px'], ['input', '19px, full width, hint under it']],
        rules: [
            'Keep the actions on the title\'s row at every width.',
            'The tools stay in one row and scroll sideways.',
        ],
        done: 'On a 390px phone the name, Preview and Close all fit, and each button is a 40px target.',
    },
    '15.7': {
        rules: ['published: Published, success.', 'draft already exists.'],
        done: 'The document\'s pill comes from statuses.js.',
    },
    '15.8': {
        why: 'The reminder has to be on every page until the forms are done. Today it is laid over the top of the page and covers whatever is under it: on the editor it hid the document\'s name. In the flow, it takes its own row and every heading stays whole.',
        anatomy: ['Clipboard icon', '{n} onboarding forms still to fill in: names', 'Fill in forms'],
        states: [['Forms left', 'Shown on every page.'], ['None left', 'Gone, and the page moves up.']],
        tokens: [
            ['strip', '#FFFBEB, 1px #FDE68A bottom, 8px 24px, min-height 48px, in the flow under .portal-topbar'],
            ['text', '14px #78350F, count 600'],
            ['Fill in forms', '32px tall, 0 14px, var(--accent), #fff, 8px radius, 13.5px/600'],
        ],
        copy: ['{n} onboarding forms still to fill in: {form} and {form}.', 'Fill in forms'],
        rules: [
            'A sibling of the top bar in the shell\'s column, never position: absolute or fixed. It pushes the page down.',
            'On every page in both Admin and Lobby, the editor included. No dismiss.',
            'Fill in forms goes where today\'s strip links to.',
            'With more than two forms, name the first two and say how many more.',
            'Recount when a form is submitted. At zero the strip is removed.',
        ],
        done: 'The reminder is on every page while forms are left, and no heading is ever covered by it.',
    },
    '15.9': {
        tokens: [['strip', '8px 16px'], ['text', '13.5px']],
        rules: ['At ≤640px drop the form names; keep the count and Fill in forms on one row.'],
        done: 'On a 390px phone the strip is one row.',
    },
};
