export const COMPLIANCE_CATEGORIES = [
  'Curriculum Coverage',
  'Faculty Qualifications',
  'Clinical Exposure',
  'Competency Completion',
  'Attendance',
  'Assessment Quality',
  'Learner Support',
  'Institutional Policies',
  'Data Security',
  'Training Records',
];

export const COMPLIANCE_STATUSES = ['Ready', 'Attention Required', 'Evidence Missing', 'Under Review'];

export interface ComplianceIndicator {
  id: string;
  code: string;
  name: string;
  category: string;
  owner: string;
  reportingPeriod: string;
  status: string;
  dataSource: string;
  evidenceCount: number;
  lastReviewed: string;
  nextReview: string;
  correctiveAction: string;
  requirement: string;
}

export const COMPLIANCE_SEEDS: ComplianceIndicator[] = [
  { id: 'CMP-001', code: 'CUR-01', name: 'Core clerkship curriculum coverage', category: 'Curriculum Coverage', owner: 'Dr. Margaret Sullivan', reportingPeriod: 'AY 2026-27', status: 'Ready', dataSource: 'Rotation scheduler', evidenceCount: 12, lastReviewed: '08/01/2026', nextReview: '09/01/2026', correctiveAction: 'None - on track', requirement: 'All required clerkships offered with documented objectives and assessments.' },
  { id: 'CMP-002', code: 'CUR-02', name: 'Foundational science integration', category: 'Curriculum Coverage', owner: 'Dr. Robert Diaz', reportingPeriod: 'AY 2026-27', status: 'Under Review', dataSource: 'Curriculum map', evidenceCount: 7, lastReviewed: '07/25/2026', nextReview: '09/15/2026', correctiveAction: 'Update phase 1 integration map by mid-term.', requirement: 'Preclinical content integrated with clinical application across phases.' },
  { id: 'CMP-003', code: 'FAC-01', name: 'Faculty appointment documentation', category: 'Faculty Qualifications', owner: 'Dr. Grace Liu', reportingPeriod: 'AY 2026-27', status: 'Attention Required', dataSource: 'HR / appointment records', evidenceCount: 9, lastReviewed: '08/05/2026', nextReview: '09/05/2026', correctiveAction: 'Collect CVs for 3 adjunct preceptors.', requirement: 'All teaching faculty have documented appointments and qualifications on file.' },
  { id: 'CMP-004', code: 'FAC-02', name: 'Preceptor orientation completion', category: 'Faculty Qualifications', owner: 'Dr. Alicia Torres', reportingPeriod: 'AY 2026-27', status: 'Ready', dataSource: 'Faculty development LMS', evidenceCount: 11, lastReviewed: '08/08/2026', nextReview: '10/01/2026', correctiveAction: 'None - on track', requirement: 'All new preceptors complete orientation before learner assignment.' },
  { id: 'CMP-005', code: 'CLN-01', name: 'Clinical site agreements', category: 'Clinical Exposure', owner: 'David Martinez', reportingPeriod: 'AY 2026-27', status: 'Ready', dataSource: 'Legal / contracts', evidenceCount: 8, lastReviewed: '08/10/2026', nextReview: '11/01/2026', correctiveAction: 'None - on track', requirement: 'Active affiliation agreements for all 8 clinical sites.' },
  { id: 'CMP-006', code: 'CLN-02', name: 'Required case exposure compliance', category: 'Clinical Exposure', owner: 'Dr. Emily Chen', reportingPeriod: 'Fall Term', status: 'Attention Required', dataSource: 'Case log system', evidenceCount: 5, lastReviewed: '08/11/2026', nextReview: '09/01/2026', correctiveAction: 'Monitor 27 at-risk learners; assign make-up clinics.', requirement: 'Learners meet minimum required case counts per clerkship.' },
  { id: 'CMP-007', code: 'COM-01', name: 'Competency completion milestones', category: 'Competency Completion', owner: 'Dr. Margaret Sullivan', reportingPeriod: 'Fall Term', status: 'Attention Required', dataSource: 'Competency matrix', evidenceCount: 8, lastReviewed: '08/11/2026', nextReview: '09/08/2026', correctiveAction: 'Accelerate assessments for learners below expected progress.', requirement: 'Learner competency completion aligns with phase milestones.' },
  { id: 'CMP-008', code: 'ATT-01', name: 'Attendance threshold compliance', category: 'Attendance', owner: 'Sarah Okafor', reportingPeriod: 'Fall Term', status: 'Attention Required', dataSource: 'Attendance register', evidenceCount: 6, lastReviewed: '08/12/2026', nextReview: '09/01/2026', correctiveAction: 'Run exception review for 27 below-threshold learners.', requirement: 'Learners maintain required attendance across theory and clinical sessions.' },
  { id: 'CMP-009', code: 'ASS-01', name: 'Assessment blueprint validity', category: 'Assessment Quality', owner: 'Dr. Alicia Torres', reportingPeriod: 'AY 2026-27', status: 'Ready', dataSource: 'Assessment builder', evidenceCount: 14, lastReviewed: '08/06/2026', nextReview: '12/01/2026', correctiveAction: 'None - on track', requirement: 'Assessments map to competencies with documented blueprints.' },
  { id: 'CMP-010', code: 'ASS-02', name: 'Result release dual confirmation', category: 'Assessment Quality', owner: 'Dr. Priya Shah', reportingPeriod: 'Fall Term', status: 'Ready', dataSource: 'Results approval workflow', evidenceCount: 10, lastReviewed: '08/09/2026', nextReview: '09/20/2026', correctiveAction: 'None - on track', requirement: 'All published results pass dual confirmation before release.' },
  { id: 'CMP-011', code: 'SUP-01', name: 'Learner support and advising', category: 'Learner Support', owner: 'Dr. James Whitfield', reportingPeriod: 'AY 2026-27', status: 'Ready', dataSource: 'Advising records', evidenceCount: 9, lastReviewed: '08/07/2026', nextReview: '10/15/2026', correctiveAction: 'None - on track', requirement: 'Every learner assigned an advisor; intervention plans documented.' },
  { id: 'CMP-012', code: 'SUP-02', name: 'Intervention plan completion', category: 'Learner Support', owner: 'Sarah Okafor', reportingPeriod: 'Fall Term', status: 'Evidence Missing', dataSource: 'Intervention tracker', evidenceCount: 3, lastReviewed: '08/03/2026', nextReview: '09/10/2026', correctiveAction: 'Upload signed intervention plans for 9 learners.', requirement: 'At-risk learners have active, documented intervention plans.' },
  { id: 'CMP-013', code: 'POL-01', name: 'Grievance and appeals policy', category: 'Institutional Policies', owner: 'Rachel Kim', reportingPeriod: 'AY 2026-27', status: 'Ready', dataSource: 'Policy library', evidenceCount: 6, lastReviewed: '07/30/2026', nextReview: '01/15/2027', correctiveAction: 'None - on track', requirement: 'Policies published, reviewed, and accessible to all stakeholders.' },
  { id: 'CMP-014', code: 'DAT-01', name: 'Data security and privacy controls', category: 'Data Security', owner: 'Rachel Kim', reportingPeriod: 'AY 2026-27', status: 'Under Review', dataSource: 'Security configuration', evidenceCount: 8, lastReviewed: '08/12/2026', nextReview: '09/12/2026', correctiveAction: 'Complete annual access review for admin roles.', requirement: 'HIPAA-aligned privacy controls with role-based access and audit logging.' },
  { id: 'CMP-015', code: 'TRN-01', name: 'Learner training records', category: 'Training Records', owner: 'David Martinez', reportingPeriod: 'AY 2026-27', status: 'Attention Required', dataSource: 'Training tracker', evidenceCount: 5, lastReviewed: '08/04/2026', nextReview: '09/04/2026', correctiveAction: 'Close 14 outstanding BLS/OSHA training records.', requirement: 'All learners complete required safety and clinical training.' },
  { id: 'CMP-016', code: 'TRN-02', name: 'Faculty training records', category: 'Training Records', owner: 'Dr. Alicia Torres', reportingPeriod: 'AY 2026-27', status: 'Ready', dataSource: 'Faculty development records', evidenceCount: 7, lastReviewed: '08/02/2026', nextReview: '11/15/2026', correctiveAction: 'None - on track', requirement: 'Faculty maintain current training and credentials documentation.' },
];

export const EVIDENCE_SEEDS = [
  { id: 'EV-001', indicatorId: 'CMP-001', title: 'AY 2026-27 Clerkship Schedule', type: 'PDF', uploadedBy: 'Sarah Okafor', uploadedAt: '08/01/2026', size: '2.4 MB', status: 'Approved' },
  { id: 'EV-002', indicatorId: 'CMP-001', title: 'Clerkship Objectives Manual', type: 'PDF', uploadedBy: 'Dr. Margaret Sullivan', uploadedAt: '08/01/2026', size: '1.1 MB', status: 'Approved' },
  { id: 'EV-003', indicatorId: 'CMP-008', title: 'Fall Attendance Exception Report', type: 'CSV', uploadedBy: 'Sarah Okafor', uploadedAt: '08/12/2026', size: '340 KB', status: 'Under Review' },
  { id: 'EV-004', indicatorId: 'CMP-014', title: 'Access Control Policy v4.2', type: 'PDF', uploadedBy: 'Rachel Kim', uploadedAt: '08/10/2026', size: '820 KB', status: 'Approved' },
];