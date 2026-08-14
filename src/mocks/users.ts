export interface Role {
  id: string;
  label: string;
  icon: string;
  modules: string[];
  personaName: string;
  personaTitle: string;
  description: string;
  permissions: string[];
}

export const MODULES = [
  'overview',
  'learners',
  'schedule',
  'clinical',
  'competencies',
  'attendance',
  'assessments',
  'compliance',
  'reports',
  'admin',
  'mobile',
];

export const PERMISSIONS = ['View', 'Create', 'Edit', 'Approve', 'Export', 'Administer'];

export const ROLES: Role[] = [
  {
    id: 'dean',
    label: 'Dean / Executive',
    icon: 'ri-shield-keyhole-line',
    modules: MODULES,
    personaName: 'Dr. Margaret Sullivan',
    personaTitle: 'Dean of Medical Education',
    description: 'Institutional oversight across programs, clinical training, and accreditation readiness.',
    permissions: PERMISSIONS,
  },
  {
    id: 'program-admin',
    label: 'Program Administrator',
    icon: 'ri-calendar-check-line',
    modules: ['overview', 'learners', 'schedule', 'clinical', 'competencies', 'attendance', 'assessments', 'compliance', 'reports'],
    personaName: 'Sarah Okafor',
    personaTitle: 'Program Administrator, MD Program',
    description: 'Day-to-day management of curriculum, schedules, and learner records.',
    permissions: ['View', 'Create', 'Edit', 'Approve', 'Export'],
  },
  {
    id: 'clinical-coordinator',
    label: 'Clinical Coordinator',
    icon: 'ri-clipboard-line',
    modules: ['overview', 'learners', 'schedule', 'clinical', 'competencies', 'attendance', 'reports'],
    personaName: 'David Martinez',
    personaTitle: 'Clinical Coordinator',
    description: 'Coordinates clinical rotations, site capacity, and preceptor assignment.',
    permissions: ['View', 'Create', 'Edit', 'Export'],
  },
  {
    id: 'faculty',
    label: 'Faculty Preceptor',
    icon: 'ri-user-star-line',
    modules: ['overview', 'learners', 'clinical', 'competencies', 'attendance', 'assessments'],
    personaName: 'Dr. Emily Chen',
    personaTitle: 'Faculty Preceptor, Internal Medicine',
    description: 'Reviews case logs, validates procedures, and assesses competency.',
    permissions: ['View', 'Create', 'Edit', 'Approve', 'Export'],
  },
  {
    id: 'learner',
    label: 'Learner',
    icon: 'ri-graduation-cap-line',
    modules: ['learners', 'schedule', 'clinical', 'competencies', 'attendance', 'assessments', 'mobile'],
    personaName: 'Olivia Carter',
    personaTitle: 'MD Candidate, Class of 2028',
    description: 'Personal schedule, case log, competency progress, and results.',
    permissions: ['View'],
  },
  {
    id: 'compliance',
    label: 'Compliance Administrator',
    icon: 'ri-shield-check-line',
    modules: ['overview', 'compliance', 'reports', 'admin'],
    personaName: 'Rachel Kim',
    personaTitle: 'Accreditation & Compliance',
    description: 'Manages accreditation evidence, policy readiness, and institutional records.',
    permissions: ['View', 'Create', 'Edit', 'Approve', 'Export', 'Administer'],
  },
];

export function getRoleById(id: string): Role | undefined {
  return ROLES.find((r) => r.id === id);
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  mfa: boolean;
  lastActive: string;
}

export const USER_ACCOUNTS: UserAccount[] = [
  { id: 'u-01', name: 'Dr. Margaret Sullivan', email: 'm.sullivan@northbridge.edu', role: 'Dean / Executive', status: 'Active', mfa: true, lastActive: '08/13/2026 9:14 AM' },
  { id: 'u-02', name: 'Sarah Okafor', email: 's.okafor@northbridge.edu', role: 'Program Administrator', status: 'Active', mfa: true, lastActive: '08/13/2026 8:42 AM' },
  { id: 'u-03', name: 'Dr. Emily Chen', email: 'e.chen@northbridge.edu', role: 'Faculty Preceptor', status: 'Active', mfa: true, lastActive: '08/13/2026 7:58 AM' },
  { id: 'u-04', name: 'David Martinez', email: 'd.martinez@northbridge.edu', role: 'Clinical Coordinator', status: 'Active', mfa: false, lastActive: '08/12/2026 5:21 PM' },
  { id: 'u-05', name: 'Rachel Kim', email: 'r.kim@northbridge.edu', role: 'Compliance Administrator', status: 'Active', mfa: true, lastActive: '08/13/2026 9:02 AM' },
  { id: 'u-06', name: 'Olivia Carter', email: 'o.carter@northbridge.edu', role: 'Learner', status: 'Active', mfa: true, lastActive: '08/13/2026 8:31 AM' },
  { id: 'u-07', name: 'Dr. James Whitfield', email: 'j.whitfield@northbridge.edu', role: 'Faculty Preceptor', status: 'Active', mfa: true, lastActive: '08/12/2026 6:47 PM' },
  { id: 'u-08', name: 'Aisha Mohammed', email: 'a.mohammed@northbridge.edu', role: 'Program Administrator', status: 'Active', mfa: false, lastActive: '08/12/2026 4:05 PM' },
  { id: 'u-09', name: 'Dr. Robert Tanaka', email: 'r.tanaka@northbridge.edu', role: 'Faculty Preceptor', status: 'Inactive', mfa: false, lastActive: '07/28/2026 2:12 PM' },
];