export const EVENT_TYPES = [
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

export const ROOMS = [
  'Simmons Hall 101',
  'Simmons Hall 204',
  'Simmons Hall 310',
  'Longwood Lecture Hall',
  'Huntington Auditorium',
  'Clinical Skills Lab A',
  'Clinical Skills Lab B',
  'Simulation Center - Bay 1',
  'Simulation Center - Bay 2',
  'Clerkship Conference Room',
  'Ward 5 North - Conf Room',
  'ER Conference Room',
];

export interface ScheduleEventSeed {
  id: string;
  title: string;
  type: string;
  date: string;
  start: string;
  end: string;
  location: string;
  department: string;
  program: string;
  cohort: string;
  facilitator: string;
  learners: number;
  status: 'Scheduled' | 'Rescheduled' | 'Cancelled';
}

export const SCHEDULE_SEEDS: ScheduleEventSeed[] = [
  { id: 'EV-1001', title: 'Cardiology: Acute Coronary Syndromes', type: 'Lecture', date: '08/13/2026', start: '8:00 AM', end: '9:30 AM', location: 'Longwood Lecture Hall', department: 'im', program: 'Doctor of Medicine', cohort: 'Class of 2028', facilitator: 'Dr. Emily Chen', learners: 118, status: 'Scheduled' },
  { id: 'EV-1002', title: 'Clinical Skills: IV Cannulation Practice', type: 'Laboratory', date: '08/13/2026', start: '10:00 AM', end: '12:00 PM', location: 'Clinical Skills Lab A', department: 'sim', program: 'Doctor of Medicine', cohort: 'Class of 2028', facilitator: 'Dr. Alicia Torres', learners: 24, status: 'Scheduled' },
  { id: 'EV-1003', title: 'Internal Medicine Ward Rounds', type: 'Ward Rounds', date: '08/13/2026', start: '7:00 AM', end: '9:00 AM', location: 'Ward 5 North', department: 'im', program: 'Doctor of Medicine', cohort: 'Class of 2028', facilitator: 'Dr. Emily Chen', learners: 12, status: 'Scheduled' },
  { id: 'EV-1004', title: 'Outpatient Clinic: Family Medicine', type: 'Outpatient Clinic', date: '08/13/2026', start: '1:00 PM', end: '5:00 PM', location: 'East Boston Community Health Center', department: 'fam', program: 'Doctor of Medicine', cohort: 'Class of 2028', facilitator: 'Dr. Thomas Grant', learners: 8, status: 'Scheduled' },
  { id: 'EV-1005', title: 'Simulation: Code Blue Response', type: 'Simulation Session', date: '08/13/2026', start: '1:00 PM', end: '3:00 PM', location: 'Simulation Center - Bay 1', department: 'sim', program: 'Doctor of Medicine', cohort: 'Class of 2029', facilitator: 'Dr. Alicia Torres', learners: 20, status: 'Scheduled' },
  { id: 'EV-1006', title: 'Case Conference: Infectious Disease', type: 'Case Conference', date: '08/13/2026', start: '12:00 PM', end: '1:00 PM', location: 'Clerkship Conference Room', department: 'im', program: 'Doctor of Medicine', cohort: 'Class of 2028', facilitator: 'Dr. Sarah Okonkwo', learners: 16, status: 'Scheduled' },
  { id: 'EV-1007', title: 'Faculty Review: Clerkship Midpoint', type: 'Faculty Review', date: '08/13/2026', start: '3:30 PM', end: '4:30 PM', location: 'Clerkship Conference Room', department: 'im', program: 'Doctor of Medicine', cohort: 'Class of 2028', facilitator: 'Dr. Emily Chen', learners: 6, status: 'Scheduled' },
  { id: 'EV-1008', title: 'OSCE: Clinical Skills Assessment', type: 'Assessment', date: '08/14/2026', start: '8:00 AM', end: '5:00 PM', location: 'Clinical Skills Lab A', department: 'sim', program: 'Doctor of Medicine', cohort: 'Class of 2028', facilitator: 'Dr. Alicia Torres', learners: 24, status: 'Scheduled' },
  { id: 'EV-1009', title: 'Anesthesia: Airway Workshop', type: 'Laboratory', date: '08/14/2026', start: '9:00 AM', end: '11:00 AM', location: 'Simulation Center - Bay 2', department: 'anes', program: 'Doctor of Medicine', cohort: 'Class of 2029', facilitator: 'Dr. Nina Patel', learners: 18, status: 'Scheduled' },
  { id: 'EV-1010', title: 'Psychiatry: Risk Assessment Seminar', type: 'Lecture', date: '08/14/2026', start: '10:00 AM', end: '11:30 AM', location: 'Huntington Auditorium', department: 'psych', program: 'Doctor of Medicine', cohort: 'Class of 2028', facilitator: 'Dr. Kevin Osei', learners: 116, status: 'Scheduled' },
  { id: 'EV-1011', title: 'Pediatrics Ward Rounds', type: 'Ward Rounds', date: '08/14/2026', start: '7:30 AM', end: '9:00 AM', location: 'Beacon Children\u2019s Hospital', department: 'peds', program: 'Doctor of Medicine', cohort: 'Class of 2028', facilitator: 'Dr. Linda Park', learners: 10, status: 'Scheduled' },
  { id: 'EV-1012', title: 'Surgery: Suture Lab', type: 'Laboratory', date: '08/15/2026', start: '9:00 AM', end: '11:30 AM', location: 'Clinical Skills Lab B', department: 'surg', program: 'Doctor of Medicine', cohort: 'Class of 2028', facilitator: 'Dr. Michael Reyes', learners: 22, status: 'Scheduled' },
  { id: 'EV-1013', title: 'Neurology: Stroke Simulation', type: 'Simulation Session', date: '08/15/2026', start: '1:00 PM', end: '4:00 PM', location: 'Simulation Center - Bay 2', department: 'neuro', program: 'Doctor of Medicine', cohort: 'Class of 2029', facilitator: 'Dr. Samuel Kim', learners: 16, status: 'Scheduled' },
  { id: 'EV-1014', title: 'IM Clerkship Orientation', type: 'Lecture', date: '08/10/2026', start: '9:00 AM', end: '11:00 AM', location: 'Longwood Lecture Hall', department: 'im', program: 'Doctor of Medicine', cohort: 'Class of 2028', facilitator: 'Dr. Emily Chen', learners: 24, status: 'Rescheduled' },
  { id: 'EV-1015', title: 'Evidence-Based Medicine Journal Club', type: 'Case Conference', date: '08/15/2026', start: '12:00 PM', end: '1:00 PM', location: 'Clerkship Conference Room', department: 'im', program: 'Doctor of Medicine', cohort: 'Class of 2028', facilitator: 'Dr. James Whitfield', learners: 16, status: 'Scheduled' },
  { id: 'EV-1016', title: 'GME: Morning Report', type: 'Case Conference', date: '08/13/2026', start: '7:30 AM', end: '8:30 AM', location: 'Ward 5 North - Conf Room', department: 'im', program: 'Internal Medicine Residency', cohort: 'PGY-1', facilitator: 'Dr. Sarah Okonkwo', learners: 14, status: 'Scheduled' },
  { id: 'EV-1017', title: 'GME: Cardiology Fellowship Conference', type: 'Lecture', date: '08/14/2026', start: '8:00 AM', end: '9:00 AM', location: 'Clerkship Conference Room', department: 'cardio', program: 'Cardiology Fellowship', cohort: 'Fellowship Year 1', facilitator: 'Dr. Yvonne Martin', learners: 12, status: 'Scheduled' },
  { id: 'EV-1018', title: 'Outpatient Clinic: Women\u2019s Health', type: 'Outpatient Clinic', date: '08/14/2026', start: '1:00 PM', end: '5:00 PM', location: "St. Anne Women's Health Pavilion", department: 'obgyn', program: 'Doctor of Medicine', cohort: 'Class of 2028', facilitator: 'Dr. Angela Brooks', learners: 8, status: 'Scheduled' },
];

export const CONFLICT_SEEDS = [
  { id: 'CF-01', type: 'Faculty Conflict', detail: 'Dr. Emily Chen is double-booked at Ward Rounds and Case Conference on 08/13/2026.', severity: 'High', action: 'Reassign case conference facilitator', date: '08/13/2026' },
  { id: 'CF-02', type: 'Learner Conflict', detail: '3 learners are scheduled for Simulation and Outpatient Clinic simultaneously.', severity: 'High', action: 'Split cohort into alternate simulation slots', date: '08/13/2026' },
  { id: 'CF-03', type: 'Clinical-site Capacity Conflict', detail: 'East Boston Community Health Center over capacity (10/8) on 08/13/2026.', severity: 'Medium', action: 'Move 2 learners to Cambridge site', date: '08/13/2026' },
  { id: 'CF-04', type: 'Room Conflict', detail: 'Clinical Skills Lab A double-booked on 08/14/2026 (OSCE + Airway Workshop).', severity: 'High', action: 'Relocate Airway Workshop to Bay 2', date: '08/14/2026' },
];