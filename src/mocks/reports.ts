export interface ReportDef {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: string[];
  defaultFilters: string[];
  icon: string;
}

export const REPORT_CATALOGUE: ReportDef[] = [
  { id: 'RPT-01', name: 'Learner Progress Summary', description: 'Overall progress, attendance, and competency completion for all learners in the selected program and cohort.', category: 'Learner Progress', fields: ['Learner', 'Program', 'Cohort', 'Attendance', 'Competency Progress', 'Standing'], defaultFilters: ['Program', 'Cohort'], icon: 'ri-progress-7-line' },
  { id: 'RPT-02', name: 'Clinical Rotation Completion', description: 'Rotation status, completion rate, and remaining requirements by rotation.', category: 'Clinical Education', fields: ['Rotation', 'Department', 'Site', 'Assigned', 'Completion', 'Status'], defaultFilters: ['Department', 'Site'], icon: 'ri-stethoscope-line' },
  { id: 'RPT-03', name: 'Competency Attainment', description: 'Competency completion across domains by cohort and program.', category: 'Competencies', fields: ['Learner', 'Domain', 'Achieved', 'In Progress', 'Not Started'], defaultFilters: ['Program', 'Domain'], icon: 'ri-checkbox-multiple-line' },
  { id: 'RPT-04', name: 'Procedure Exposure', description: 'Procedure counts, performance levels, and validation status.', category: 'Clinical Education', fields: ['Learner', 'Procedure', 'Level', 'Attempts', 'Validation'], defaultFilters: ['Site', 'Status'], icon: 'ri-syringe-line' },
  { id: 'RPT-05', name: 'Attendance Compliance', description: 'Attendance rates by source with below-threshold learner exceptions.', category: 'Attendance', fields: ['Learner', 'Theory %', 'Clinical %', 'Overall %', 'Status'], defaultFilters: ['Cohort', 'Source'], icon: 'ri-calendar-check-line' },
  { id: 'RPT-06', name: 'Learner Eligibility', description: 'Eligibility status and blocking reasons for upcoming assessments.', category: 'Assessments', fields: ['Learner', 'Attendance', 'Competencies', 'Eligibility', 'Blocking Reason'], defaultFilters: ['Assessment', 'Cohort'], icon: 'ri-user-star-line' },
  { id: 'RPT-07', name: 'Assessment Performance', description: 'Score distributions and benchmark comparisons across assessments.', category: 'Assessments', fields: ['Assessment', 'Type', 'Average', 'Benchmark', 'Pass Rate'], defaultFilters: ['Type', 'Cohort'], icon: 'ri-bar-chart-box-line' },
  { id: 'RPT-08', name: 'At-Risk Learners', description: 'Learners requiring intervention with active standing and blocking reasons.', category: 'Learner Progress', fields: ['Learner', 'Attendance', 'Competency', 'Standing', 'Intervention'], defaultFilters: ['Cohort', 'Department'], icon: 'ri-alert-line' },
  { id: 'RPT-09', name: 'Faculty Review Turnaround', description: 'Case log and assessment review volumes with average turnaround time.', category: 'Clinical Education', fields: ['Faculty', 'Pending', 'Approved', 'Avg Turnaround'], defaultFilters: ['Department', 'Period'], icon: 'ri-time-line' },
  { id: 'RPT-10', name: 'Clinical-Site Utilization', description: 'Capacity utilization and learner load by clinical site.', category: 'Clinical Education', fields: ['Site', 'Capacity', 'Assigned', 'Utilization %'], defaultFilters: ['Period'], icon: 'ri-building-line' },
  { id: 'RPT-11', name: 'Compliance Readiness', description: 'Indicator status across accreditation categories with evidence counts.', category: 'Compliance', fields: ['Indicator', 'Category', 'Owner', 'Status', 'Evidence'], defaultFilters: ['Category', 'Status'], icon: 'ri-shield-check-line' },
  { id: 'RPT-12', name: 'Audit Activity', description: 'System activity by module, user, and outcome within a date range.', category: 'Administration', fields: ['Timestamp', 'User', 'Module', 'Action', 'Outcome'], defaultFilters: ['Module', 'Date Range'], icon: 'ri-file-list-3-line' },
];

export const REPORT_CATEGORIES = ['Learner Progress', 'Clinical Education', 'Competencies', 'Attendance', 'Assessments', 'Compliance', 'Administration'];