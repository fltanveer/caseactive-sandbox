import { useSyncExternalStore } from 'react';

/* Case stages — one shared, in-memory store so the Stages page, Cases,
   Automations and the client Lobby all read the same list. There is no
   backend yet; everything resets on reload. */

export const MAX_STAGES = 30;

export const CASE_TYPES = ['General', 'Auto Accident', 'Personal Injury', 'Workers Comp', 'Malpractice'];

const DEFAULT_STAGES = [
    { id: 'stg-4b1e07', name: 'Intake',        description: 'We are gathering your details and documents to open your case.' },
    { id: 'stg-9c2a51', name: 'Investigation', description: 'Our team is collecting records, reports and evidence about what happened.' },
    { id: 'stg-1f7d3c', name: 'Demand sent',   description: 'We have sent a demand letter to the insurance company and are waiting for their reply.' },
    { id: 'stg-62e8a4', name: 'Negotiation',   description: 'We are negotiating with the insurance company to reach a fair settlement.' },
    { id: 'stg-d03b96', name: 'Litigation',    description: 'Your case has been filed in court. We will keep you updated on each step.' },
    { id: 'stg-a85f12', name: 'Resolved',      description: 'Your case is resolved. We will contact you about any final paperwork.' },
];

/* caseId → stageId. Admin and Lobby use the same case ids, so a stage set
   in Admin shows up for the client. */
const DEFAULT_CASE_STAGES = {
    'cc-64fc9cf315526b': 'stg-4b1e07',
    'cc-a1b2c3d4e56789': 'stg-1f7d3c',
    'cc-b3c4d5e6f78901': 'stg-62e8a4',
    'cc-c5d6e7f8091234': 'stg-9c2a51',
    'cc-d7e8f9a0123456': null,
    'cc-e1f2a3b4c5d678': 'stg-9c2a51',
    'cc-f2a3b4c5d6e789': 'stg-62e8a4',
    'cc-0a1b2c3d4e5f60': 'stg-4b1e07',
    'cc-1b2c3d4e5f6a71': 'stg-d03b96',
    'cc-2c3d4e5f6a7b82': null,
    'cc-3d4e5f6a7b8c93': 'stg-9c2a51',
    'cc-4e5f6a7b8c9da4': 'stg-1f7d3c',
};

const DEFAULT_MILESTONES = [
    { id: 'ms-1', stageId: 'stg-1f7d3c', caseType: 'all', template: 'Your Demand Letter Was Sent' },
    { id: 'ms-2', stageId: 'stg-a85f12', caseType: 'all', template: 'Your Case Is Resolved' },
];

let state = {
    stages: DEFAULT_STAGES,
    caseStages: DEFAULT_CASE_STAGES,
    milestones: DEFAULT_MILESTONES,
};

const listeners = new Set();
const emit = () => listeners.forEach(l => l());
const set = (patch) => { state = { ...state, ...patch }; emit(); };
const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };

export const useStages = () => useSyncExternalStore(subscribe, () => state);

const newId = (prefix) => `${prefix}-${Math.random().toString(16).slice(2, 8)}`;

export const stageActions = {
    add: ({ name, description }) => {
        if (state.stages.length >= MAX_STAGES) return;
        set({ stages: [...state.stages, { id: newId('stg'), name, description }] });
    },
    update: (id, patch) => set({ stages: state.stages.map(s => s.id === id ? { ...s, ...patch } : s) }),
    move: (from, to) => {
        const next = [...state.stages];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        set({ stages: next });
    },
    remove: (id) => set({ stages: state.stages.filter(s => s.id !== id) }),
    setCaseStage: (caseId, stageId) => set({ caseStages: { ...state.caseStages, [caseId]: stageId || null } }),
    saveMilestone: (rule) => set({
        milestones: rule.id && state.milestones.some(m => m.id === rule.id)
            ? state.milestones.map(m => m.id === rule.id ? rule : m)
            : [...state.milestones, { ...rule, id: newId('ms') }],
    }),
    removeMilestone: (id) => set({ milestones: state.milestones.filter(m => m.id !== id) }),

    /* Prototype helpers so reviewers can see the 30-stage limit state. */
    fillDemo: () => {
        const extra = DEMO_FILLER.slice(0, MAX_STAGES - state.stages.length)
            .map(name => ({ id: newId('stg'), name, description: '' }));
        set({ stages: [...state.stages, ...extra] });
    },
    resetDemo: () => {
        const used = new Set([...Object.values(state.caseStages), ...state.milestones.map(m => m.stageId)]);
        const kept = state.stages.filter(s => DEFAULT_STAGES.some(d => d.id === s.id) || used.has(s.id));
        set({ stages: kept });
    },
};

const DEMO_FILLER = [
    'Medical treatment', 'Records requested', 'Records received', 'Bills requested', 'Liens review',
    'Policy limits request', 'Demand drafting', 'Offer received', 'Counteroffer sent', 'Mediation scheduled',
    'Mediation', 'Complaint filed', 'Discovery', 'Depositions', 'Expert review', 'Trial preparation',
    'Trial', 'Settlement reached', 'Release signed', 'Funds received', 'Disbursement', 'Appeal',
    'On hold', 'Investigation', 'Negotiation', 'Closing review', 'Archived', 'Follow-up',
];

export const findStage = (stages, id) => stages.find(s => s.id === id) || null;

/* Names can repeat, so pickers label each stage with its position. */
export const stageOptionLabel = (stages, stage) => {
    const dupes = stages.filter(s => s.name.trim().toLowerCase() === stage.name.trim().toLowerCase()).length > 1;
    return dupes ? `${stage.name} (#${stages.indexOf(stage) + 1})` : stage.name;
};
