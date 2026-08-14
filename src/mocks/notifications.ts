export interface NotificationSeed {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'critical' | 'warning' | 'success' | 'info';
  module: string;
  read: boolean;
}

export const NOTIFICATION_SEEDS: NotificationSeed[] = [
  { id: 'N-01', title: 'Attendance threshold alert', description: '27 learners below the 85% clinical attendance threshold.', time: '12 min ago', type: 'critical', module: 'attendance', read: false },
  { id: 'N-02', title: 'Case log awaiting review', description: 'IM-CASE-1047 submitted by Olivia Carter.', time: '28 min ago', type: 'warning', module: 'clinical', read: false },
  { id: 'N-03', title: 'Pending preceptor evaluation', description: '6 rotation evaluations overdue by more than 5 days.', time: '1 hr ago', type: 'warning', module: 'assessments', read: false },
  { id: 'N-04', title: 'Compliance evidence approved', description: 'Clerkship Schedule evidence approved for CMP-001.', time: '2 hr ago', type: 'success', module: 'compliance', read: false },
  { id: 'N-05', title: 'Rotation schedule published', description: 'Fall Term rotations published for Class of 2028.', time: '4 hr ago', type: 'info', module: 'schedule', read: false },
  { id: 'N-06', title: 'Procedure validation required', description: '12 procedure logs awaiting supervisor validation.', time: 'Yesterday', type: 'warning', module: 'clinical', read: true },
];

export const NOTIFICATION_TEMPLATES = [
  { id: 'NT-01', name: 'Attendance threshold alert', subject: 'Attendance threshold alert - {{learner}}', channel: 'Email + Push', event: 'Learner drops below threshold', enabled: true },
  { id: 'NT-02', name: 'Case log review request', subject: 'New case log submitted - {{learner}}', channel: 'Email + Push', event: 'Case log submitted', enabled: true },
  { id: 'NT-03', name: 'Competency credited', subject: 'Competency {{competency}} credited', channel: 'Push', event: 'Competency approved', enabled: true },
  { id: 'NT-04', name: 'Result release notification', subject: 'Assessment results available - {{assessment}}', channel: 'Email', event: 'Results released', enabled: true },
  { id: 'NT-05', name: 'Rotation reminder', subject: 'Rotation {{rotation}} starts {{date}}', channel: 'Email + Push', event: 'Rotation start', enabled: true },
  { id: 'NT-06', name: 'Eligibility block', subject: 'Eligibility block - {{reason}}', channel: 'Email', event: 'Learner ineligible', enabled: true },
];

export interface AuditSeed {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  module: string;
  action: string;
  record: string;
  ipDevice: string;
  outcome: 'Success' | 'Denied' | 'Failed';
}

export const AUDIT_SEEDS: AuditSeed[] = [
  { id: 'A-1001', timestamp: '08/13/2026 9:14:22 AM', user: 'Dr. Margaret Sullivan', role: 'Dean / Executive', module: 'Executive Overview', action: 'Viewed', record: 'Learners at Risk list', ipDevice: '192.168.1.24 · Desktop', outcome: 'Success' },
  { id: 'A-1002', timestamp: '08/13/2026 9:02:10 AM', user: 'Rachel Kim', role: 'Compliance Administrator', module: 'Compliance', action: 'Approved', record: 'Evidence EV-004', ipDevice: '192.168.1.41 · Desktop', outcome: 'Success' },
  { id: 'A-1003', timestamp: '08/13/2026 8:42:05 AM', user: 'Sarah Okafor', role: 'Program Administrator', module: 'Attendance', action: 'Reviewed', record: 'Exception EXC-2301', ipDevice: '192.168.1.18 · Desktop', outcome: 'Success' },
  { id: 'A-1004', timestamp: '08/13/2026 8:31:47 AM', user: 'Olivia Carter', role: 'Learner', module: 'Clinical Education', action: 'Submitted', record: 'Case log IM-CASE-1047', ipDevice: '10.0.4.22 · Mobile', outcome: 'Success' },
  { id: 'A-1005', timestamp: '08/12/2026 6:47:12 PM', user: 'Dr. James Whitfield', role: 'Faculty Preceptor', module: 'Clinical Education', action: 'Approved', record: 'Case log IM-CASE-1042', ipDevice: '192.168.1.67 · Desktop', outcome: 'Success' },
  { id: 'A-1006', timestamp: '08/12/2026 5:21:33 PM', user: 'David Martinez', role: 'Clinical Coordinator', module: 'Schedule', action: 'Created', record: 'Rotation IM-3', ipDevice: '192.168.1.30 · Desktop', outcome: 'Success' },
  { id: 'A-1007', timestamp: '08/12/2026 4:05:09 PM', user: 'Aisha Mohammed', role: 'Program Administrator', module: 'Administration', action: 'Export', record: 'Learner Progress Summary', ipDevice: '192.168.1.12 · Desktop', outcome: 'Success' },
  { id: 'A-1008', timestamp: '08/12/2026 2:33:51 PM', user: 'System', role: 'System', module: 'Security', action: 'Denied', record: 'Access to Users - compliance role', ipDevice: '192.168.1.88 · Desktop', outcome: 'Denied' },
];