/* The shared status vocabulary, kept out of the component file so fast
   refresh stays happy and so a status can be referenced without importing
   the pill. A status is a claim the viewer has to act on, so the tone is
   chosen by what it asks of them, not by how it sounds. */

export const STATUS = {
    // existing, carried over so screens can migrate onto this component
    active:          { label: 'Active',           tone: 'success' },
    closed:          { label: 'Closed',           tone: 'neutral' },
    draft:           { label: 'Draft',            tone: 'neutral' },
    published:       { label: 'Published',        tone: 'success' },
    ready:           { label: 'Ready',            tone: 'success' },
    open:            { label: 'Open',             tone: 'info'    },
    paid:            { label: 'Paid',             tone: 'success' },
    processing:      { label: 'Processing',       tone: 'pending' },
    failed:          { label: 'Failed',           tone: 'danger'  },

    // ticket 9 — refunds
    refundPending:   { label: 'Refund pending',   tone: 'pending' },
    refunded:        { label: 'Refunded',         tone: 'info'    },
    refundFailed:    { label: 'Refund failed',    tone: 'danger'  },

    // ticket 4 — e-sign templates with no document attached
    needsDocument:   { label: 'Needs a document', tone: 'warning' },

    // ticket 6 — a hub whose access was taken away
    accessRemoved:   { label: 'Access removed',   tone: 'danger'  },

    // EX-1 — a deleted hub inside its 30-day restore window. Warning, not
    // danger: it can still be undone.
    pendingDeletion: { label: 'Pending deletion', tone: 'warning' },

    // NPS-1 — a client's post-settlement survey. Scheduled is waiting on the
    // 10am send; Sent is waiting on the client.
    surveyScheduled: { label: 'Scheduled',        tone: 'pending' },
    surveySent:      { label: 'Sent',             tone: 'info'    },
    surveyAnswered:  { label: 'Answered',         tone: 'success' },
    surveyExpired:   { label: 'Expired',          tone: 'neutral' },

    // NPS-1 — score bands. Staff screens only: the client never sees a band
    // or its colour, or the scale would tell them which answer is wanted.
    promoter:        { label: 'Promoter',         tone: 'success' },
    passive:         { label: 'Passive',          tone: 'neutral' },
    detractor:       { label: 'Detractor',        tone: 'danger'  },
};
