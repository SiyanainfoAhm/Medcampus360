export const ATTENDANCE_SOURCES = ['QR Check-in', 'Badge / RFID', 'Approved Manual', 'Clinical Supervisor Validation'];

export const SESSION_TYPES = [
  'Lecture',
  'Laboratory',
  'Simulation Session',
  'Clinical Clerkship',
  'Ward Rounds',
  'Outpatient Clinic',
  'Assessment',
  'Faculty Review',
  'Case Conference',
];

export const ATTENDANCE_STATUSES = ['Present', 'Absent', 'Late', 'Excused'];

export const EXCEPTION_REASONS = [
  'Illness / Medical',
  'Family Emergency',
  'Approved Academic Conflict',
  'Clinical Duty Conflict',
  'Travel / Commute',
  'Approved Leave',
  'Other',
];

export const ATTENDANCE_THRESHOLD = 85;
export const THEORY_THRESHOLD = 75;
export const CLINICAL_THRESHOLD = 85;

export interface ExceptionSeed {
  id: string;
  learnerId: string;
  session: string;
  date: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Denied';
  reviewer: string;
  notes: string;
  decisionNotes?: string;
}

export const EXCEPTION_SEEDS: ExceptionSeed[] = [
  { id: 'EXC-2301', learnerId: 'MED-2026-0147', session: 'Internal Medicine Ward Rounds', date: '08/07/2026', reason: 'Illness / Medical', status: 'Approved', reviewer: 'Dr. Emily Chen', notes: 'Urgent care visit; note submitted.', decisionNotes: 'Approved with documentation. Excused.' },
  { id: 'EXC-2302', learnerId: 'MED-2026-0147', session: 'Cardiology Lecture', date: '08/04/2026', reason: 'Family Emergency', status: 'Approved', reviewer: 'Sarah Okafor', notes: 'Family emergency; communicated same day.', decisionNotes: 'Approved. Please ensure make-up reading.' },
  { id: 'EXC-2303', learnerId: 'MED-2026-0184', session: 'Internal Medicine Case Conference', date: '08/10/2026', reason: 'Approved Academic Conflict', status: 'Pending', reviewer: 'Sarah Okafor', notes: 'Conflict with simulation session; requesting excusal.' },
  { id: 'EXC-2304', learnerId: 'MED-2026-0210', session: 'Hospital Medicine Rounds', date: '08/11/2026', reason: 'Clinical Duty Conflict', status: 'Denied', reviewer: 'Dr. James Whitfield', notes: 'Overlap with required night float.', decisionNotes: 'Denied - schedule conflict resolvable. Contact coordinator.' },
  { id: 'EXC-2305', learnerId: 'MED-2026-0147', session: 'Simulation: Code Blue', date: '08/13/2026', reason: 'Approved Leave', status: 'Pending', reviewer: 'Sarah Okafor', notes: 'Pre-approved personal leave; simulation rescheduled.' },
];