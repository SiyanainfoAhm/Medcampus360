import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react';
import {
  buildDataset,
  baselineCompetencyStatus,
  type AppDataset,
  type CaseLog,
  type CompStatus,
  type Learner,
  type ProcedureLog,
} from '@/utils/dataset';
import type { ComplianceIndicator } from '@/mocks/compliance';
import { EVIDENCE_SEEDS } from '@/mocks/compliance';
import { EXCEPTION_SEEDS } from '@/mocks/attendance';
import { SCHEDULE_SEEDS } from '@/mocks/schedule';
import { NOTIFICATION_SEEDS, AUDIT_SEEDS } from '@/mocks/notifications';
import type { NotificationSeed, AuditSeed } from '@/mocks/notifications';

type EvidenceItem = (typeof EVIDENCE_SEEDS)[number] & { id: string; title: string; type: string; uploadedBy: string; uploadedAt: string; size: string; status: string; indicatorId: string };
type AuditItem = (typeof AUDIT_SEEDS)[number] & { id: string; timestamp: string; user: string; role: string; module: string; action: string; record: string; ipDevice: string; outcome: 'Success' | 'Denied' | 'Failed' };
type ExceptionItem = (typeof EXCEPTION_SEEDS)[number] & { id: string; learnerId: string; session: string; date: string; reason: string; status: string; reviewer: string; notes: string; decisionNotes?: string };
type ScheduleItem = (typeof SCHEDULE_SEEDS)[number] & { id: string; title: string; type: string; date: string; start: string; end: string; location: string; department: string; program: string; cohort: string; facilitator: string; learners: number; status: string };

interface AppDataContextType {
  learners: Learner[];
  faculty: AppDataset['faculty'];
  rotations: AppDataset['rotations'];
  caseLogs: CaseLog[];
  procedures: ProcedureLog[];
  sessions: AppDataset['sessions'];
  attendanceRecords: AppDataset['attendanceRecords'];
  assessments: AppDataset['assessments'];
  oscE: AppDataset['oscE'];
  complianceIndicators: ComplianceIndicator[];
  evidence: EvidenceItem[];
  scheduleEvents: ScheduleItem[];
  notifications: NotificationSeed[];
  audit: AuditItem[];
  exceptions: ExceptionItem[];
  competencyOverrides: Record<string, Record<string, CompStatus>>;
  getCompStatus: (learnerId: string, compIndex: number, compCode: string) => CompStatus;
  getLearnerById: (id: string) => Learner | undefined;
  addAudit: (entry: Omit<AuditItem, 'id' | 'timestamp'>) => void;
  addCaseLog: (log: CaseLog) => void;
  updateCaseLog: (id: string, patch: Partial<CaseLog>) => void;
  removeCaseLog: (id: string) => void;
  submitCaseLog: (id: string, reflection: string) => void;
  requestRevision: (id: string, feedback: string) => void;
  approveCaseLog: (id: string) => void;
  addProcedure: (p: ProcedureLog) => void;
  updateProcedure: (id: string, patch: Partial<ProcedureLog>) => void;
  creditCompetency: (learnerId: string, code: string) => void;
  addEvidence: (item: Omit<EvidenceItem, 'id'>) => void;
  updateCompliance: (id: string, patch: Partial<ComplianceIndicator>) => void;
  addCompliance: (item: ComplianceIndicator) => void;
  updateException: (id: string, patch: Partial<ExceptionItem>) => void;
  addException: (item: ExceptionItem) => void;
  updateSchedule: (id: string, patch: Partial<ScheduleItem>) => void;
  addSchedule: (item: ScheduleItem) => void;
  removeSchedule: (id: string) => void;
  updateLearner: (id: string, patch: Partial<Learner>) => void;
  addLearner: (learner: Learner) => void;
  removeLearner: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetAllData: () => void;
}

const AppDataContext = createContext<AppDataContextType | null>(null);

/* Bump DATASET_VERSION whenever the seeded dataset structure changes so stale local demo
   state from earlier builds is cleared automatically on next load. */
const DATASET_VERSION = 'mc360-dataset-v2';
function ensureDatasetVersion() {
  try {
    if (localStorage.getItem('mc360_dataset_version') !== DATASET_VERSION) {
      [
        'mc360_caseLogs',
        'mc360_procedures',
        'mc360_evidence',
        'mc360_exceptions',
        'mc360_schedule',
        'mc360_notifications',
        'mc360_audit',
        'mc360_compliance',
        'mc360_assessments',
        'mc360_rotations',
        'mc360_comp_overrides',
        'mc360_learner_deltas',
        'mc360_learners_created',
        'mc360_learners_deleted',
      ].forEach((k) => localStorage.removeItem(k));
      localStorage.setItem('mc360_dataset_version', DATASET_VERSION);
    }
  } catch {
    /* ignore */
  }
}
ensureDatasetVersion();

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    /* ignore */
  }
  return fallback;
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota */
  }
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  const base = useMemo(() => buildDataset(), []);

  const [caseLogs, setCaseLogs] = useState<CaseLog[]>(() => load('mc360_caseLogs', base.caseLogs));
  const [procedures, setProcedures] = useState<ProcedureLog[]>(() => load('mc360_procedures', base.procedures));
  const [evidence, setEvidence] = useState<EvidenceItem[]>(() => load('mc360_evidence', base.evidence as EvidenceItem[]));
  const [exceptions, setExceptions] = useState<ExceptionItem[]>(() => load('mc360_exceptions', base.exceptions as ExceptionItem[]));
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleItem[]>(() => load('mc360_schedule', base.scheduleEvents as ScheduleItem[]));
  const [notifications, setNotifications] = useState<NotificationSeed[]>(() => load('mc360_notifications', base.notifications));
  const [audit, setAudit] = useState<AuditItem[]>(() => load('mc360_audit', base.audit as AuditItem[]));
  const [complianceIndicators, setComplianceIndicators] = useState<ComplianceIndicator[]>(() => load('mc360_compliance', base.complianceIndicators));
  const [assessments, setAssessments] = useState<AppDataset['assessments']>(() => load('mc360_assessments', base.assessments));
  const [rotations, setRotations] = useState<AppDataset['rotations']>(() => load('mc360_rotations', base.rotations));
  const [competencyOverrides, setCompetencyOverrides] = useState<Record<string, Record<string, CompStatus>>>(() => load('mc360_comp_overrides', {}));
  const [learners, setLearners] = useState<Learner[]>(() => {
    const deltas = load<Record<string, Partial<Learner>>>('mc360_learner_deltas', {});
    const created = load<Learner[]>('mc360_learners_created', []);
    const deleted = load<string[]>('mc360_learners_deleted', []);
    const baseLearners = base.learners.map((l) => (deltas[l.id] ? { ...l, ...deltas[l.id] } : l));
    const all = [...baseLearners, ...created].filter((l) => !deleted.includes(l.id));
    return all;
  });

  useEffect(() => save('mc360_caseLogs', caseLogs), [caseLogs]);
  useEffect(() => save('mc360_procedures', procedures), [procedures]);
  useEffect(() => save('mc360_evidence', evidence), [evidence]);
  useEffect(() => save('mc360_exceptions', exceptions), [exceptions]);
  useEffect(() => save('mc360_schedule', scheduleEvents), [scheduleEvents]);
  useEffect(() => save('mc360_notifications', notifications), [notifications]);
  useEffect(() => save('mc360_audit', audit), [audit]);
  useEffect(() => save('mc360_compliance', complianceIndicators), [complianceIndicators]);
  useEffect(() => save('mc360_assessments', assessments), [assessments]);
  useEffect(() => save('mc360_rotations', rotations), [rotations]);
  useEffect(() => save('mc360_comp_overrides', competencyOverrides), [competencyOverrides]);

  const persistLearners = useCallback((next: Learner[]) => {
    setLearners(next);
    const baseLearners = buildDataset().learners;
    const created = next.filter((l) => !baseLearners.some((b) => b.id === l.id));
    const deltas: Record<string, Partial<Learner>> = {};
    next.forEach((l) => {
      const baseL = baseLearners.find((b) => b.id === l.id);
      if (baseL) {
        const diff: Partial<Learner> = {};
        (Object.keys(l) as (keyof Learner)[]).forEach((k) => {
          if (JSON.stringify(baseL[k]) !== JSON.stringify(l[k])) (diff as Record<string, unknown>)[k] = l[k];
        });
        if (Object.keys(diff).length) deltas[l.id] = diff;
      }
    });
    save('mc360_learner_deltas', deltas);
    save('mc360_learners_created', created);
  }, []);

  const getLearnerById = useCallback((id: string) => learners.find((l) => l.id === id), [learners]);

  const addAudit = useCallback(
    (entry: Omit<AuditItem, 'id' | 'timestamp'>) => {
      const now = new Date();
      const ts = now.toLocaleDateString('en-US') + ' ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
      setAudit((prev) => [{ ...entry, id: `A-${Date.now()}`, timestamp: ts } as AuditItem, ...prev]);
    },
    []
  );

  const getCompStatus = useCallback(
    (learnerId: string, compIndex: number, compCode: string): CompStatus => {
      const override = competencyOverrides[learnerId]?.[compCode];
      return override || baselineCompetencyStatus(learnerId, compIndex);
    },
    [competencyOverrides]
  );

  const creditCompetency = useCallback(
    (learnerId: string, code: string) => {
      setCompetencyOverrides((prev) => ({
        ...prev,
        [learnerId]: { ...(prev[learnerId] || {}), [code]: 'Achieved' },
      }));
      persistLearners(
        learners.map((l) =>
          l.id === learnerId
            ? {
                ...l,
                competencyAchieved: Math.min(l.competencyTotal, l.competencyAchieved + 1),
                competencyProgress: Math.round(((l.competencyAchieved + 1) / l.competencyTotal) * 1000) / 10,
              }
            : l
        )
      );
    },
    [learners, persistLearners]
  );

  const addCaseLog = useCallback((log: CaseLog) => setCaseLogs((prev) => [log, ...prev]), []);
  const updateCaseLog = useCallback((id: string, patch: Partial<CaseLog>) => setCaseLogs((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))), []);
  const removeCaseLog = useCallback((id: string) => setCaseLogs((prev) => prev.filter((c) => c.id !== id)), []);

  const submitCaseLog = useCallback(
    (id: string, reflection: string) => {
      updateCaseLog(id, { status: 'Submitted', reflection, submittedAt: new Date().toLocaleDateString('en-US') + ' ' + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) });
      const log = caseLogs.find((c) => c.id === id);
      if (log) {
        addAudit({ user: 'Olivia Carter', role: 'Learner', module: 'Clinical Education', action: 'Resubmitted', record: `Case log ${id}`, ipDevice: '10.0.4.22 · Mobile', outcome: 'Success' });
      }
    },
    [caseLogs, updateCaseLog, addAudit]
  );

  const requestRevision = useCallback(
    (id: string, feedback: string) => {
      updateCaseLog(id, { status: 'Revision Requested', feedback });
      const log = caseLogs.find((c) => c.id === id);
      if (log && log.competencies[0]) {
        setCompetencyOverrides((prev) => ({
          ...prev,
          [log.learnerId]: { ...(prev[log.learnerId] || {}), [log.competencies[0]]: 'Needs Review' },
        }));
      }
      if (log) {
        addAudit({ user: 'Dr. Emily Chen', role: 'Faculty Preceptor', module: 'Clinical Education', action: 'Requested Revision', record: `Case log ${id}`, ipDevice: '192.168.1.67 · Desktop', outcome: 'Success' });
      }
    },
    [caseLogs, updateCaseLog, addAudit]
  );

  const approveCaseLog = useCallback(
    (id: string) => {
      const log = caseLogs.find((c) => c.id === id);
      if (!log) return;
      const today = new Date().toLocaleDateString('en-US');
      updateCaseLog(id, { status: 'Competency Credited', feedback: log.feedback || 'Submission approved. Competency credited.', feedbackDate: today });
      if (log.competencies[0]) {
        creditCompetency(log.learnerId, log.competencies[0]);
      }
      // evidence record appears in institutional evidence store
      setEvidence((prev) => [
        {
          id: `EV-${Date.now()}`,
          indicatorId: 'CMP-007',
          title: `Competency ${log.competencies[0]} credited - ${log.learnerName}`,
          type: 'System Record',
          uploadedBy: 'Dr. Emily Chen',
          uploadedAt: today,
          size: '—',
          status: 'Approved',
        },
        ...prev,
      ]);
      // keep the linked indicator's evidence count consistent with the evidence store
      setComplianceIndicators((prev) =>
        prev.map((c) => (c.id === 'CMP-007' ? { ...c, evidenceCount: c.evidenceCount + 1 } : c))
      );
      addAudit({ user: 'Dr. Emily Chen', role: 'Faculty Preceptor', module: 'Clinical Education', action: 'Approved', record: `Case log ${id}`, ipDevice: '192.168.1.67 · Desktop', outcome: 'Success' });
    },
    [caseLogs, updateCaseLog, creditCompetency, addAudit]
  );

  const addProcedure = useCallback((p: ProcedureLog) => setProcedures((prev) => [p, ...prev]), []);
  const updateProcedure = useCallback((id: string, patch: Partial<ProcedureLog>) => setProcedures((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))), []);

  const addEvidence = useCallback(
    (item: Omit<EvidenceItem, 'id'>) => setEvidence((prev) => [{ ...item, id: `EV-${Date.now()}` } as EvidenceItem, ...prev]),
    []
  );
  const updateCompliance = useCallback((id: string, patch: Partial<ComplianceIndicator>) => setComplianceIndicators((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c))), []);
  const addCompliance = useCallback((item: ComplianceIndicator) => setComplianceIndicators((prev) => [item, ...prev]), []);
  const updateException = useCallback((id: string, patch: Partial<ExceptionItem>) => setExceptions((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e))), []);
  const addException = useCallback((item: ExceptionItem) => setExceptions((prev) => [item, ...prev]), []);
  const updateSchedule = useCallback((id: string, patch: Partial<ScheduleItem>) => setScheduleEvents((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s))), []);
  const addSchedule = useCallback((item: ScheduleItem) => setScheduleEvents((prev) => [item, ...prev]), []);
  const removeSchedule = useCallback((id: string) => setScheduleEvents((prev) => prev.filter((s) => s.id !== id)), []);
  const updateLearner = useCallback(
    (id: string, patch: Partial<Learner>) => persistLearners(learners.map((l) => (l.id === id ? { ...l, ...patch } : l))),
    [learners, persistLearners]
  );
  const addLearner = useCallback((learner: Learner) => persistLearners([learner, ...learners]), [learners, persistLearners]);
  const removeLearner = useCallback(
    (id: string) => {
      persistLearners(learners.filter((l) => l.id !== id));
      const deleted = load<string[]>('mc360_learners_deleted', []);
      save('mc360_learners_deleted', [...deleted, id]);
    },
    [learners, persistLearners]
  );
  const markAllNotificationsRead = useCallback(() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))), []);

  const resetAllData = useCallback(() => {
    const keys = [
      'mc360_caseLogs',
      'mc360_procedures',
      'mc360_evidence',
      'mc360_exceptions',
      'mc360_schedule',
      'mc360_notifications',
      'mc360_audit',
      'mc360_compliance',
      'mc360_assessments',
      'mc360_rotations',
      'mc360_comp_overrides',
      'mc360_learner_deltas',
      'mc360_learners_created',
      'mc360_learners_deleted',
    ];
    keys.forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  }, []);

  const value: AppDataContextType = {
    learners,
    faculty: base.faculty,
    rotations,
    caseLogs,
    procedures,
    sessions: base.sessions,
    attendanceRecords: base.attendanceRecords,
    assessments,
    oscE: base.oscE,
    complianceIndicators,
    evidence,
    scheduleEvents,
    notifications,
    audit,
    exceptions,
    competencyOverrides,
    getCompStatus,
    getLearnerById,
    addAudit,
    addCaseLog,
    updateCaseLog,
    removeCaseLog,
    submitCaseLog,
    requestRevision,
    approveCaseLog,
    addProcedure,
    updateProcedure,
    creditCompetency,
    addEvidence,
    updateCompliance,
    addCompliance,
    updateException,
    addException,
    updateSchedule,
    addSchedule,
    removeSchedule,
    updateLearner,
    addLearner,
    removeLearner,
    markAllNotificationsRead,
    resetAllData,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider');
  return ctx;
}