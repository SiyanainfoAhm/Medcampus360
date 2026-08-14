/* Deterministic dataset builder for MedCampus 360 (Northbridge University School of Medicine).
   Produces stable, coherent fictional data across every page. No randomness between refreshes. */
import { PROGRAMS, DEPARTMENTS, CLINICAL_SITES, STANDINGS } from '@/mocks/institution';
import { COMPETENCIES } from '@/mocks/competencies';
import { LEARNER_FIRST, LEARNER_LAST, FACULTY_FIRST, FACULTY_LAST, ACADEMIC_TITLES, FACULTY_SPECIALTIES, PHONE_AREA_CODES, BOSTON_ZIPS, STREET_NAMES } from '@/mocks/people';
import { CASE_CATEGORIES, CASE_SETTINGS, AGE_GROUPS, PARTICIPATION_LEVELS, ROTATION_TEMPLATES, PROCEDURE_NAMES, PROCEDURE_LEVELS, CASE_LOG_SEEDS } from '@/mocks/clinical';
import { ATTENDANCE_SOURCES, SESSION_TYPES, ATTENDANCE_STATUSES, EXCEPTION_SEEDS } from '@/mocks/attendance';
import { OSCE_STATIONS } from '@/mocks/assessments';
import { COMPLIANCE_SEEDS, EVIDENCE_SEEDS } from '@/mocks/compliance';
import { SCHEDULE_SEEDS } from '@/mocks/schedule';
import { NOTIFICATION_SEEDS, AUDIT_SEEDS } from '@/mocks/notifications';

/* ---------- seeded PRNG ---------- */
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- date helpers (US MM/DD/YYYY) ---------- */
const BASE = new Date(2026, 7, 13); // Aug 13, 2026
export function d(offset: number): string {
  const dt = new Date(BASE);
  dt.setDate(BASE.getDate() + offset);
  return dt.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
}
export const TODAY = d(0);

/* Match a rotation instance name to its base clerkship name.
   e.g. "Internal Medicine Clerkship - Rotation 3" -> "Internal Medicine Clerkship"
   Seeded case logs carry the base name; generated logs carry the instance name. */
export function baseRotationName(name: string): string {
  return name.replace(/ - Rotation \d+$/, '').trim();
}

/* ---------- types ---------- */
export interface Learner {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  programId: string;
  program: string;
  cohortId: string;
  cohort: string;
  year: number;
  phase: string;
  clinicalSite: string;
  currentRotation: string;
  rotationId: string;
  preceptor: string;
  advisor: string;
  attendanceTheory: number;
  attendanceClinical: number;
  attendanceOverall: number;
  competencyProgress: number;
  competencyAchieved: number;
  competencyTotal: number;
  standing: string;
  status: string;
  risk: boolean;
  interventions: string[];
  email: string;
  phone: string;
  gender: string;
  emergencyContact: string;
  emergencyPhone: string;
  photo: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  department: string;
  specialty: string;
  site: string;
  email: string;
  phone: string;
  pendingReviews: number;
  avgTurnaroundDays: number;
  status: string;
  photo: string;
}

export interface Rotation {
  id: string;
  name: string;
  departmentId: string;
  department: string;
  site: string;
  startDate: string;
  endDate: string;
  learners: string[];
  preceptors: string[];
  capacity: number;
  shift: string;
  objectives: string[];
  status: string;
  requiredCases: number;
  requiredProcedures: number;
}

export interface CaseLog {
  id: string;
  learnerId: string;
  learnerName: string;
  rotation: string;
  encounterDate: string;
  setting: string;
  service: string;
  category: string;
  participation: string;
  summary: string;
  skills: string;
  reflection: string;
  evidence: string;
  status: 'Draft' | 'Submitted' | 'Revision Requested' | 'Approved' | 'Competency Credited';
  competencies: string[];
  preceptor: string;
  feedback?: string;
  feedbackDate?: string;
  submittedAt?: string;
  createdAt: string;
}

export interface ProcedureLog {
  id: string;
  learnerId: string;
  learnerName: string;
  procedure: string;
  date: string;
  site: string;
  level: string;
  attempts: number;
  supervisor: string;
  outcome: string;
  feedback: string;
  validation: 'Pending' | 'Validated' | 'Competency Credited';
}

export interface AttendanceSession {
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
  source: string;
  learnerIds: string[];
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  learnerId: string;
  learnerName: string;
  status: string;
  source: string;
  validation: string;
}

export interface AssessmentItem {
  id: string;
  name: string;
  type: string;
  date: string;
  program: string;
  cohort: string;
  status: string;
  benchmark: number;
  averageScore: number;
  completionRate: number;
  pendingGrading: number;
}

export interface OSCERun {
  id: string;
  name: string;
  date: string;
  cohort: string;
  stations: number;
  status: string;
}

/* ---------- cohort plan ---------- */
interface CohortPlan {
  id: string;
  name: string;
  programId: string;
  phase: string;
  year: number;
  size: number;
}

const PROGRAM_LOOKUP: Record<string, (typeof PROGRAMS)[0]> = {};
PROGRAMS.forEach((p) => (PROGRAM_LOOKUP[p.id] = p));

const COHORT_PLANS: CohortPlan[] = [
  { id: 'CO-2028', name: 'Class of 2028', programId: 'md', phase: 'Clinical Clerkship', year: 3, size: 124 },
  { id: 'CO-2029', name: 'Class of 2029', programId: 'md', phase: 'Foundations of Medicine', year: 2, size: 122 },
  { id: 'CO-2030', name: 'Class of 2030', programId: 'md', phase: 'Foundations of Medicine', year: 1, size: 120 },
  { id: 'res-im-1', name: 'IM Residency PGY-1', programId: 'res-im', phase: 'Residency', year: 1, size: 40 },
  { id: 'res-im-2', name: 'IM Residency PGY-2', programId: 'res-im', phase: 'Residency', year: 2, size: 38 },
  { id: 'res-im-3', name: 'IM Residency PGY-3', programId: 'res-im', phase: 'Residency', year: 3, size: 36 },
  { id: 'res-surg-1', name: 'Surgery Residency PGY-1', programId: 'res-surg', phase: 'Residency', year: 1, size: 34 },
  { id: 'res-surg-2', name: 'Surgery Residency PGY-2', programId: 'res-surg', phase: 'Residency', year: 2, size: 32 },
  { id: 'res-surg-3', name: 'Surgery Residency PGY-3', programId: 'res-surg', phase: 'Residency', year: 3, size: 30 },
  { id: 'res-peds-1', name: 'Pediatrics Residency PGY-1', programId: 'res-peds', phase: 'Residency', year: 1, size: 30 },
  { id: 'res-peds-2', name: 'Pediatrics Residency PGY-2', programId: 'res-peds', phase: 'Residency', year: 2, size: 28 },
  { id: 'res-peds-3', name: 'Pediatrics Residency PGY-3', programId: 'res-peds', phase: 'Residency', year: 3, size: 26 },
  { id: 'res-fm-1', name: 'Family Medicine PGY-1', programId: 'res-fm', phase: 'Residency', year: 1, size: 28 },
  { id: 'res-fm-2', name: 'Family Medicine PGY-2', programId: 'res-fm', phase: 'Residency', year: 2, size: 26 },
  { id: 'res-fm-3', name: 'Family Medicine PGY-3', programId: 'res-fm', phase: 'Residency', year: 3, size: 24 },
  { id: 'res-psych-1', name: 'Psychiatry Residency PGY-1', programId: 'res-psych', phase: 'Residency', year: 1, size: 24 },
  { id: 'res-psych-2', name: 'Psychiatry Residency PGY-2', programId: 'res-psych', phase: 'Residency', year: 2, size: 22 },
  { id: 'res-psych-3', name: 'Psychiatry Residency PGY-3', programId: 'res-psych', phase: 'Residency', year: 3, size: 20 },
  { id: 'res-em-1', name: 'Emergency Medicine PGY-1', programId: 'res-em', phase: 'Residency', year: 1, size: 22 },
  { id: 'res-em-2', name: 'Emergency Medicine PGY-2', programId: 'res-em', phase: 'Residency', year: 2, size: 20 },
  { id: 'res-em-3', name: 'Emergency Medicine PGY-3', programId: 'res-em', phase: 'Residency', year: 3, size: 18 },
  { id: 'gme-1', name: 'GME Track 1', programId: 'gme', phase: 'Graduate Medical Education', year: 1, size: 66 },
  { id: 'fell-cardio-1', name: 'Cardiology Fellowship Y1', programId: 'fell-cardio', phase: 'Fellowship', year: 1, size: 16 },
  { id: 'fell-cardio-2', name: 'Cardiology Fellowship Y2', programId: 'fell-cardio', phase: 'Fellowship', year: 2, size: 14 },
  { id: 'fell-pulm-1', name: 'Pulm/CC Fellowship Y1', programId: 'fell-pulm', phase: 'Fellowship', year: 1, size: 14 },
  { id: 'fell-pulm-2', name: 'Pulm/CC Fellowship Y2', programId: 'fell-pulm', phase: 'Fellowship', year: 2, size: 12 },
  { id: 'fell-hosp-1', name: 'Hospital Medicine Fellowship', programId: 'fell-hosp', phase: 'Fellowship', year: 1, size: 14 },
  { id: 'fell-id-1', name: 'ID Fellowship Y1', programId: 'fell-id', phase: 'Fellowship', year: 1, size: 12 },
  { id: 'fell-id-2', name: 'ID Fellowship Y2', programId: 'fell-id', phase: 'Fellowship', year: 2, size: 10 },
];
// force exact total of 1024 learners (cohorts sum to 1023; Olivia Carter is the 1024th record)
{
  const total = COHORT_PLANS.reduce((s, c) => s + c.size, 0);
  const deficit = 1023 - total;
  if (deficit !== 0) COHORT_PLANS[COHORT_PLANS.length - 1].size += deficit;
}

/* ---------- learner photo ---------- */
export const OLIVIA_PHOTO =
  'https://readdy.ai/api/search-image?query=professional%20headshot%20portrait%20of%20a%20young%20female%20medical%20student%20with%20light%20brown%20hair%2C%20soft%20neutral%20studio%20background%2C%20warm%20natural%20lighting%2C%20navy%20blazer%2C%20photorealistic%2C%20high%20detail%2C%20approachable%20confident%20expression&width=400&height=400&seq=olivia-carter-profile-2026&orientation=squarish';

/* ---------- building blocks ---------- */
function learnerName(rand: () => number, used: Set<string>, genderForOlivia = false): { first: string; last: string; gender: string } {
  let first = '';
  let last = '';
  let name = '';
  for (let i = 0; i < 60; i++) {
    first = LEARNER_FIRST[Math.floor(rand() * LEARNER_FIRST.length)];
    last = LEARNER_LAST[Math.floor(rand() * LEARNER_LAST.length)];
    name = `${first} ${last}`;
    if (!used.has(name)) break;
  }
  used.add(name);
  const gender = ['Male', 'Female', 'Non-binary'][Math.floor(rand() * 3)];
  return { first, last, gender };
}

function attendanceFor(rand: () => number, risk: boolean): { theory: number; clinical: number; overall: number } {
  if (risk) {
    const clinical = Math.round((68 + rand() * 14) * 10) / 10; // 68-82
    const theory = Math.round((72 + rand() * 12) * 10) / 10;
    const overall = Math.round((clinical * 0.6 + theory * 0.4) * 10) / 10;
    return { theory, clinical, overall };
  }
  const theory = Math.round((88 + rand() * 11) * 10) / 10; // 88-99
  const clinical = Math.round((88 + rand() * 11) * 10) / 10;
  const overall = Math.round((clinical * 0.6 + theory * 0.4) * 10) / 10;
  return { theory, clinical, overall };
}

const FACULTY_KEY = [
  { name: 'Dr. Margaret Sullivan', dept: 'meded', title: 'Dean of Medical Education' },
  { name: 'Dr. Emily Chen', dept: 'im', title: 'Faculty Preceptor, Internal Medicine' },
  { name: 'Dr. James Whitfield', dept: 'im', title: 'Faculty Preceptor, Internal Medicine' },
  { name: 'Dr. Sarah Okonkwo', dept: 'im', title: 'Professor of Medicine' },
  { name: 'Dr. Michael Reyes', dept: 'surg', title: 'Clerkship Director, General Surgery' },
  { name: 'Dr. Linda Park', dept: 'peds', title: 'Clerkship Director, Pediatrics' },
  { name: 'Dr. Thomas Grant', dept: 'fam', title: 'Clerkship Director, Family Medicine' },
  { name: 'Dr. Angela Brooks', dept: 'obgyn', title: 'Clerkship Director, OB/GYN' },
  { name: 'Dr. Kevin Osei', dept: 'psych', title: 'Clerkship Director, Psychiatry' },
  { name: 'Dr. Priya Shah', dept: 'em', title: 'Clerkship Director, Emergency Medicine' },
  { name: 'Dr. Jonathan Cole', dept: 'rad', title: 'Vice Chair for Education, Radiology' },
  { name: 'Dr. Nina Patel', dept: 'anes', title: 'Associate Professor, Anesthesiology' },
  { name: 'Dr. Samuel Kim', dept: 'neuro', title: 'Clerkship Director, Neurology' },
  { name: 'Dr. Ellen Foster', dept: 'path', title: 'Associate Professor, Pathology' },
  { name: 'Dr. Robert Diaz', dept: 'cph', title: 'Professor, Community & Public Health' },
  { name: 'Dr. Alicia Torres', dept: 'sim', title: 'Director, Clinical Skills & Simulation' },
  { name: 'Dr. Daniel White', dept: 'ortho', title: 'Clerkship Director, Orthopedics' },
  { name: 'Dr. Yvonne Martin', dept: 'cardio', title: 'Fellowship Director, Cardiology' },
  { name: 'Dr. Brian Clark', dept: 'hosp', title: 'Director, Hospital Medicine' },
  { name: 'Dr. Grace Liu', dept: 'research', title: 'Associate Dean for Research' },
];

export function buildFaculty(): FacultyMember[] {
  const list: FacultyMember[] = [];
  const used = new Set<string>();
  FACULTY_KEY.forEach((f, i) => {
    used.add(f.name);
    const dept = DEPARTMENTS.find((dd) => dd.id === f.dept)!;
    const spec = FACULTY_SPECIALTIES[f.dept][0];
    list.push({
      id: `FAC-${String(i + 1).padStart(3, '0')}`,
      name: f.name,
      title: f.title,
      departmentId: f.dept,
      department: dept.name,
      specialty: spec,
      site: dept.id === 'sim' ? 'CCSC' : i % 2 === 0 ? 'NUMC' : 'HCH',
      email: '',
      phone: '',
      pendingReviews: i === 1 ? 2 : i % 3 === 0 ? Math.floor(Math.random() * 2) + 1 : 0,
      avgTurnaroundDays: Math.round((1.2 + ((i * 7) % 30) / 10) * 10) / 10,
      status: 'Active',
      photo: '',
    });
  });
  const rand = mulberry32(20260813);
  for (let i = FACULTY_KEY.length; i < 138; i++) {
    let name = '';
    for (let k = 0; k < 40; k++) {
      const cand = `Dr. ${FACULTY_FIRST[Math.floor(rand() * FACULTY_FIRST.length)]} ${FACULTY_LAST[Math.floor(rand() * FACULTY_LAST.length)]}`;
      if (!used.has(cand)) {
        name = cand;
        used.add(cand);
        break;
      }
    }
    const dept = DEPARTMENTS[Math.floor(rand() * DEPARTMENTS.length)];
    const specs = FACULTY_SPECIALTIES[dept.id];
    const site = CLINICAL_SITES[Math.floor(rand() * CLINICAL_SITES.length)];
    const area = PHONE_AREA_CODES[Math.floor(rand() * PHONE_AREA_CODES.length)];
    list.push({
      id: `FAC-${String(i + 1).padStart(3, '0')}`,
      name,
      title: `${ACADEMIC_TITLES[Math.floor(rand() * ACADEMIC_TITLES.length)]}, ${dept.name}`,
      departmentId: dept.id,
      department: dept.name,
      specialty: specs[Math.floor(rand() * specs.length)],
      site: site.id,
      email: '',
      phone: `(${area}) ${Math.floor(100 + rand() * 899)}-${Math.floor(1000 + rand() * 8999)}`,
      pendingReviews: rand() > 0.72 ? Math.floor(rand() * 3) + 1 : 0,
      avgTurnaroundDays: Math.round((1 + rand() * 3) * 10) / 10,
      status: rand() > 0.94 ? 'On Leave' : 'Active',
      photo: '',
    });
  }
  // emails
  list.forEach((f) => {
    const parts = f.name.replace('Dr. ', '').split(' ');
    f.email = `${parts[0].charAt(0).toLowerCase()}${parts[parts.length - 1].toLowerCase()}@northbridge.edu`;
  });
  return list;
}

export function buildLearners(faculty: FacultyMember[], rotations: Rotation[]): Learner[] {
  const rand = mulberry32(10240147);
  const used = new Set<string>();
  const learners: Learner[] = [];
  const riskIds: string[] = [];
  const advisors = faculty.filter((f) => f.departmentId === 'im' || f.departmentId === 'meded');
  const getAdvisor = (i: number) => advisors[i % advisors.length].name;
  const getPreceptor = (i: number) => (i % 2 === 0 ? 'Dr. Emily Chen' : faculty[Math.floor(rand() * Math.min(faculty.length, 40))].name);

  let idCounter = 0;
  const nextId = () => {
    idCounter += 1;
    if (idCounter === 147) idCounter += 1; // reserve MED-2026-0147 for Olivia Carter
    return `MED-2026-${String(idCounter).padStart(4, '0')}`;
  };

  COHORT_PLANS.forEach((plan, ci) => {
    const prog = PROGRAM_LOOKUP[plan.programId];
    for (let li = 0; li < plan.size; li++) {
      const { first, last, gender } = learnerName(rand, used);
      const risk = false;
      const att = attendanceFor(rand, risk);
      const progress = Math.round((62 + rand() * 36) * 10) / 10;
      const achieved = Math.round((progress / 100) * 96);
      const standing = progress < 70 || att.overall < 86 ? 'Needs Support' : rand() > 0.9 ? 'Needs Support' : 'Good Standing';
      const id = nextId();
      const site = CLINICAL_SITES[Math.floor(rand() * CLINICAL_SITES.length)];
      const area = PHONE_AREA_CODES[Math.floor(rand() * PHONE_AREA_CODES.length)];
      const zip = BOSTON_ZIPS[Math.floor(rand() * BOSTON_ZIPS.length)];
      const street = STREET_NAMES[Math.floor(rand() * STREET_NAMES.length)];
      learners.push({
        id,
        name: `${first} ${last}`,
        firstName: first,
        lastName: last,
        programId: prog.id,
        program: prog.name,
        cohortId: plan.id,
        cohort: plan.name,
        year: plan.year,
        phase: plan.phase,
        clinicalSite: site.name,
        currentRotation: '',
        rotationId: '',
        preceptor: getPreceptor(ci + li),
        advisor: getAdvisor(ci + li),
        attendanceTheory: att.theory,
        attendanceClinical: att.clinical,
        attendanceOverall: att.overall,
        competencyProgress: progress,
        competencyAchieved: achieved,
        competencyTotal: 96,
        standing,
        status: 'Active',
        risk,
        interventions: [],
        email: `${first.toLowerCase()}.${last.toLowerCase()}@northbridge.edu`,
        phone: `(${area}) ${Math.floor(100 + rand() * 899)}-${Math.floor(1000 + rand() * 8999)}`,
        gender,
        emergencyContact: `Mr./Ms. ${last}`,
        emergencyPhone: `(${area}) ${Math.floor(100 + rand() * 899)}-${Math.floor(1000 + rand() * 8999)}`,
        photo: '',
      });
    }
  });

  // Olivia Carter - primary presentation learner
  const olivia: Learner = {
    id: 'MED-2026-0147',
    name: 'Olivia Carter',
    firstName: 'Olivia',
    lastName: 'Carter',
    programId: 'md',
    program: 'Doctor of Medicine',
    cohortId: 'CO-2028',
    cohort: 'Class of 2028',
    year: 3,
    phase: 'Clinical Clerkship',
    clinicalSite: 'Northbridge University Medical Center',
    currentRotation: 'Internal Medicine Clerkship',
    rotationId: 'rot-IM-3',
    preceptor: 'Dr. Emily Chen',
    advisor: 'Dr. James Whitfield',
    attendanceTheory: 88.0,
    attendanceClinical: 82.0,
    attendanceOverall: 82.0,
    competencyProgress: 76.0,
    competencyAchieved: 73,
    competencyTotal: 96,
    standing: 'Intervention Required',
    status: 'Active',
    risk: true,
    interventions: ['Attendance improvement plan (below 85% clinical threshold)', 'Competency acceleration plan - Internal Medicine clerkship'],
    email: 'o.carter@northbridge.edu',
    phone: '(617) 555-0187',
    gender: 'Female',
    emergencyContact: 'Daniel Carter (Father)',
    emergencyPhone: '(617) 555-0193',
    photo: OLIVIA_PHOTO,
  };
  learners.push(olivia);

  // Select 27 learners at risk deterministically (Olivia + 26 spread across the list)
  const total = learners.length;
  riskIds.push(olivia.id);
  for (let i = 0; i < 26; i++) {
    const idx = Math.floor((i * 37 + 11) % (total - 1));
    const l = learners[idx];
    if (l && !l.risk && l.id !== olivia.id && !riskIds.includes(l.id)) {
      l.risk = true;
      l.standing = i % 2 === 0 ? 'Intervention Required' : 'Academic Probation';
      const att = attendanceFor(mulberry32(hashString(l.id) + 7), true);
      l.attendanceClinical = att.clinical;
      l.attendanceOverall = att.overall;
      l.attendanceTheory = att.theory;
      l.competencyProgress = Math.round((55 + (i % 17)) * 10) / 10;
      l.competencyAchieved = Math.round((l.competencyProgress / 100) * 96);
      l.interventions = ['Required intervention plan - see learner record'];
      riskIds.push(l.id);
    }
  }

  // assign rotations to clinical-phase learners
  const clinicalLearners = learners.filter((l) => l.phase === 'Clinical Clerkship' || l.phase === 'Residency' || l.phase === 'Fellowship' || l.phase === 'Graduate Medical Education');
  let ri = 0;
  clinicalLearners.forEach((l) => {
    const rot = rotations[ri % rotations.length];
    l.rotationId = rot.id;
    l.currentRotation = rot.name;
    l.clinicalSite = CLINICAL_SITES.find((s) => s.id === rot.site)?.name || l.clinicalSite;
    rot.learners.push(l.id);
    ri += 1;
  });
  // pin Olivia to the Internal Medicine rotation so her complete storyline stays consistent
  const oliviaRot = rotations.find((r) => r.id === 'rot-IM-3');
  if (oliviaRot) {
    // presentation rotation instance: Internal Medicine Clerkship - Rotation 3 at Harborview Community Hospital
    oliviaRot.site = 'HCH';
    oliviaRot.capacity = 12;
    oliviaRot.status = 'Active';
    oliviaRot.preceptors = ['Dr. Emily Chen', 'Dr. James Whitfield'];
    rotations.forEach((r) => {
      if (r.id !== oliviaRot.id) r.learners = r.learners.filter((x) => x !== olivia.id);
    });
    oliviaRot.learners = oliviaRot.learners.filter((x) => x !== olivia.id);
    oliviaRot.learners.unshift(olivia.id);
    olivia.rotationId = oliviaRot.id;
    olivia.currentRotation = oliviaRot.name;
    olivia.clinicalSite = CLINICAL_SITES.find((s) => s.id === oliviaRot.site)?.name || olivia.clinicalSite;
    // cap assigned learners at exactly 12; move overflow to a sibling Internal Medicine rotation
    if (oliviaRot.learners.length > 12) {
      const overflow = oliviaRot.learners.slice(12);
      oliviaRot.learners = oliviaRot.learners.slice(0, 12);
      const sibling = rotations.find((r) => r.id === 'rot-IM-1');
      overflow.forEach((lid) => {
        const l = learners.find((x) => x.id === lid);
        if (l && sibling) {
          l.rotationId = sibling.id;
          l.currentRotation = sibling.name;
          l.clinicalSite = CLINICAL_SITES.find((s) => s.id === sibling.site)?.name || l.clinicalSite;
          sibling.learners.push(lid);
        }
      });
    }
  }
  return learners;
}

export function buildRotations(faculty: FacultyMember[]): Rotation[] {
  const rotations: Rotation[] = [];
  const rand = mulberry32(42);
  let idx = 0;
  ROTATION_TEMPLATES.forEach((tpl) => {
    const groups = idx === 0 ? 5 : idx === 3 ? 5 : 4;
    for (let g = 0; g < groups; g++) {
      idx += 1;
      const startOff = (g % 2) * 28 - 21;
      const dept = DEPARTMENTS.find((dd) => dd.id === tpl.department)!;
      const preceptors = faculty.filter((f) => f.departmentId === tpl.department).slice(0, 2).map((f) => f.name);
      rotations.push({
        id: `rot-${tpl.department.toUpperCase()}-${g + 1}`,
        name: `${tpl.name} - Rotation ${g + 1}`,
        departmentId: tpl.department,
        department: dept.name,
        site: tpl.site,
        startDate: d(startOff),
        endDate: d(startOff + tpl.durationWeeks * 7 - 1),
        learners: [],
        preceptors: preceptors.length ? preceptors : ['Dr. Emily Chen'],
        capacity: tpl.capacity,
        shift: tpl.shift,
        objectives: tpl.objectives,
        status: g % 3 === 2 ? 'Upcoming' : 'Active',
        requiredCases: tpl.requiredCases,
        requiredProcedures: tpl.requiredProcedures,
      });
    }
  });
  // ensure exactly 42 rotations
  while (rotations.length < 42) {
    idx += 1;
    const dept = DEPARTMENTS[idx % DEPARTMENTS.length];
    rotations.push({
      id: `rot-${dept.id.toUpperCase()}-X${idx}`,
      name: `${dept.name} Clinical Elective`,
      departmentId: dept.id,
      department: dept.name,
      site: CLINICAL_SITES[idx % CLINICAL_SITES.length].id,
      startDate: d(-7),
      endDate: d(28),
      learners: [],
      preceptors: faculty.slice(0, 2).map((f) => f.name),
      capacity: 8,
      shift: 'Day (8:00 AM - 5:00 PM)',
      objectives: ['Clinical exposure', 'History and examination', 'Case presentation'],
      status: 'Active',
      requiredCases: 6,
      requiredProcedures: 2,
    });
  }
  return rotations;
}

/* ---------- case log generation ---------- */
const PRESENTATIONS: Record<string, string[]> = {
  Cardiovascular: ['acute chest pressure with diaphoresis', 'palpitations and lightheadedness', 'exertional dyspnea with leg swelling', 'syncope after exertion'],
  Respiratory: ['fever, cough, and hypoxia', 'wheezing with shortness of breath', 'pleuritic chest pain', 'chronic cough with weight loss'],
  Gastrointestinal: ['abdominal pain with nausea', 'hematemesis and melena', 'jaundice with right upper quadrant pain', 'chronic diarrhea with weight loss'],
  Neurology: ['acute confusion with focal weakness', 'sudden severe headache', 'progressive gait difficulty', 'new-onset seizure'],
  'Endocrine / Metabolic': ['uncontrolled hyperglycemia', 'fatigue with unintentional weight loss', 'recurrent hypoglycemia', 'hypercalcemia on screening labs'],
  'Renal / Genitourinary': ['acute flank pain with hematuria', 'oliguria with rising creatinine', 'dysuria with fever', 'proteinuria on screening'],
  'Infectious Disease': ['fever with productive cough', 'cellulitis with bacteremia', 'persistent fever of unknown origin', 'septic arthritis'],
  'Hematology / Oncology': ['fatigue with progressive anemia', 'lymphadenopathy with night sweats', 'incidental thrombocytopenia', 'new breast mass'],
  Musculoskeletal: ['atraumatic joint pain and swelling', 'low back pain with radiculopathy', 'acute knee injury', 'shoulder pain with limited motion'],
  'Psychiatry / Behavioral': ['worsening low mood and anhedonia', 'acute anxiety with panic symptoms', 'new-onset insomnia', 'behavioral change in older adult'],
  'Obstetrics / Gynecology': ['vaginal bleeding in early pregnancy', 'pelvic pain with discharge', 'third-trimester hypertension', 'postpartum fever'],
  Pediatrics: ['infant with fever and poor feeding', 'child with cough and wheeze', 'adolescent with abdominal pain', 'toddler with acute limp'],
  Dermatology: ['widespread pruritic rash', 'painful vesicular eruption', 'non-healing leg ulcer', 'changing pigmented lesion'],
  'Surgery / Trauma': ['acute right lower quadrant pain', 'traumatic hip fracture', 'bowel obstruction with distension', 'acute limb ischemia'],
};

const SKILLS_POOL = ['history taking', 'focused physical examination', 'clinical reasoning', 'differential diagnosis', 'documentation', 'medication reconciliation', 'patient education', 'evidence-based decision making', 'interprofessional communication', 'handover communication', 'interpretation of diagnostic studies', 'care coordination'];

const REFLECTION_POOL = [
  'I felt more confident managing this presentation and would benefit from additional independent practice with this clinical scenario.',
  'The case reinforced the importance of a structured approach. I plan to review the relevant guideline before my next similar encounter.',
  'This encounter highlighted the value of interprofessional communication. I will continue to involve nursing and pharmacy early.',
  'I identified a gap in my knowledge of this condition and have set a learning goal to review the topic this week.',
  'The preceptor\u2019s feedback on my presentation style was helpful; I will incorporate structured summaries going forward.',
];

function caseIdPrefix(rotationName: string): string {
  const n = rotationName.toLowerCase();
  if (n.includes('emergency')) return 'EM-CASE';
  if (n.includes('surgery') || n.includes('orthopedic')) return 'SURG-CASE';
  if (n.includes('pediatric')) return 'PEDS-CASE';
  if (n.includes('ob/gyn') || n.includes('obstetrics')) return 'OB-CASE';
  if (n.includes('psychiatry') || n.includes('behavioral')) return 'PSY-CASE';
  if (n.includes('family')) return 'FM-CASE';
  if (n.includes('neurology')) return 'NEURO-CASE';
  if (n.includes('hospital medicine')) return 'HOSP-CASE';
  if (n.includes('internal medicine')) return 'IM-CASE';
  return 'CL-CASE';
}

export function buildCaseLogs(learners: Learner[], faculty: FacultyMember[]): CaseLog[] {
  const logs: CaseLog[] = [];
  const rand = mulberry32(350);
  // seeds (including Olivia's IM-CASE-1047)
  CASE_LOG_SEEDS.forEach((s) => {
    const learner = learners.find((l) => l.id === s.learnerId);
    logs.push({
      id: s.id,
      learnerId: s.learnerId,
      learnerName: learner ? learner.name : s.learnerId,
      rotation: s.rotation,
      encounterDate: s.encounterDate,
      setting: s.setting,
      service: s.service,
      category: s.category,
      participation: s.participation,
      summary: s.summary,
      skills: s.competencies.join(', '),
      reflection: s.reflection,
      evidence: 'De-identified encounter notes',
      status: s.status,
      competencies: s.competencies,
      preceptor: s.preceptor,
      feedback: s.feedback,
      feedbackDate: s.feedbackDate,
      submittedAt: s.status === 'Submitted' ? '08/12/2026 8:31 AM' : undefined,
      createdAt: s.encounterDate,
    });
  });
  const candidates = learners.filter((l) => l.phase !== 'Foundations of Medicine');
  const target = 350;
  let n = 1;
  while (logs.length < target) {
    const learner = candidates[Math.floor(rand() * candidates.length)];
    const cat = CASE_CATEGORIES[Math.floor(rand() * CASE_CATEGORIES.length)];
    const settings = CASE_SETTINGS[Math.floor(rand() * CASE_SETTINGS.length)];
    const age = AGE_GROUPS[Math.floor(rand() * AGE_GROUPS.length)];
    const participation = PARTICIPATION_LEVELS[Math.floor(rand() * PARTICIPATION_LEVELS.length)];
    const summary = `${age} presented with ${PRESENTATIONS[cat][Math.floor(rand() * PRESENTATIONS[cat].length)]}. ${['Evaluated with history and exam; imaging and labs reviewed.', 'Reviewed prior records and performed focused exam; plan discussed with team.', 'Stabilized initially and diagnostic workup initiated.', 'Admitted under team care; daily assessment and plan.'][Math.floor(rand() * 4)]}`;
    const statusPick = rand();
    const status: CaseLog['status'] = statusPick < 0.2 ? 'Draft' : statusPick < 0.5 ? 'Submitted' : statusPick < 0.6 ? 'Revision Requested' : statusPick < 0.95 ? 'Approved' : 'Competency Credited';
    const compCount = 1 + Math.floor(rand() * 3);
    const comps: string[] = [];
    for (let c = 0; c < compCount; c++) {
      const cidx = Math.floor(rand() * COMPETENCIES.length);
      if (!comps.includes(COMPETENCIES[cidx].code)) comps.push(COMPETENCIES[cidx].code);
    }
    logs.push({
      id: `${caseIdPrefix(learner.currentRotation)}-${1050 + n}`,
      learnerId: learner.id,
      learnerName: learner.name,
      rotation: learner.currentRotation || 'Clinical Rotation',
      encounterDate: d(-Math.floor(rand() * 30)),
      setting: settings,
      service: 'Internal Medicine',
      category: cat,
      participation,
      summary,
      skills: comps.join(', '),
      reflection: REFLECTION_POOL[Math.floor(rand() * REFLECTION_POOL.length)],
      evidence: 'De-identified encounter notes',
      status,
      competencies: comps,
      preceptor: learner.preceptor,
      feedback: status === 'Approved' || status === 'Competency Credited' ? 'Well documented. Continue building independent practice.' : undefined,
      feedbackDate: status === 'Approved' || status === 'Competency Credited' ? d(-1) : undefined,
      submittedAt: status === 'Submitted' ? d(-Math.floor(rand() * 3)) : undefined,
      createdAt: d(-Math.floor(rand() * 30)),
    });
    n += 1;
  }
  return logs;
}

export function buildProcedures(learners: Learner[]): ProcedureLog[] {
  const logs: ProcedureLog[] = [];
  const rand = mulberry32(180);
  const candidates = learners.filter((l) => l.phase !== 'Foundations of Medicine');
  for (let i = 0; i < 180; i++) {
    const learner = candidates[Math.floor(rand() * candidates.length)];
    const proc = PROCEDURE_NAMES[Math.floor(rand() * PROCEDURE_NAMES.length)];
    const levelPick = rand();
    const level = levelPick < 0.25 ? 'Observed' : levelPick < 0.6 ? 'Performed under direct supervision' : levelPick < 0.85 ? 'Performed with indirect supervision' : 'Performed independently';
    const validPick = rand();
    const validation: ProcedureLog['validation'] = validPick < 0.15 ? 'Pending' : validPick < 0.75 ? 'Validated' : 'Competency Credited';
    logs.push({
      id: `PRC-${String(1800 + i + 1)}`,
      learnerId: learner.id,
      learnerName: learner.name,
      procedure: proc,
      date: d(-Math.floor(rand() * 40)),
      site: CLINICAL_SITES[Math.floor(rand() * CLINICAL_SITES.length)].name,
      level,
      attempts: 1 + Math.floor(rand() * 3),
      supervisor: learner.preceptor,
      outcome: rand() < 0.85 ? 'Successful' : rand() < 0.5 ? 'Successful with assistance' : 'Repeat required',
      feedback: validation === 'Pending' ? 'Awaiting supervisor validation.' : 'Technique satisfactory; continue building volume.',
      validation,
    });
  }
  return logs;
}

export function buildAssessments(): AssessmentItem[] {
  const list: AssessmentItem[] = [];
  const rand = mulberry32(24);
  const cohorts = ['Class of 2028', 'Class of 2029', 'PGY-1', 'Fellowship Year 1'];
  const names = ['Foundations Written Examination 1', 'Clinical Reasoning Written Exam', 'OSCE Clinical Skills Assessment', 'Simulation: Acute Care', 'Direct Observation: History & Exam', 'Rotation Evaluation - Internal Medicine', 'Faculty Feedback Review', 'Objective Structured Assessment'];
  for (let i = 0; i < 24; i++) {
    const typeIdx = i % 7;
    const cohort = cohorts[i % 4];
    const statusPick = rand();
    const status = statusPick < 0.2 ? 'Scheduled' : statusPick < 0.4 ? 'In Progress' : statusPick < 0.55 ? 'Grading' : statusPick < 0.7 ? 'Awaiting Release' : statusPick < 0.9 ? 'Released' : 'Closed';
    list.push({
      id: `ASM-${String(1001 + i)}`,
      name: `${ASSESSMENT_TYPES_ARR[typeIdx]}: ${names[i % names.length]}`,
      type: ASSESSMENT_TYPES_ARR[typeIdx],
      date: d(Math.floor(rand() * 20) - 8),
      program: i % 2 === 0 ? 'Doctor of Medicine' : 'Internal Medicine Residency',
      cohort,
      status,
      benchmark: 75,
      averageScore: Math.round((68 + rand() * 24) * 10) / 10,
      completionRate: Math.round((72 + rand() * 26) * 10) / 10,
      pendingGrading: status === 'Grading' ? Math.floor(rand() * 30) + 10 : 0,
    });
  }
  return list;
}
const ASSESSMENT_TYPES_ARR = ['Written Assessment', 'Clinical Skills Assessment', 'OSCE', 'Simulation Assessment', 'Direct Observation', 'Rotation Evaluation', 'Faculty Feedback'];

export function buildOSCERun(): OSCERun {
  return {
    id: 'OSCE-2026-F2',
    name: 'OSCE Clinical Skills Assessment - Fall Term',
    date: '08/14/2026',
    cohort: 'Class of 2028',
    stations: OSCE_STATIONS.length,
    status: 'Scheduled',
  };
}

export function buildAttendance(learners: Learner[]): { sessions: AttendanceSession[]; records: AttendanceRecord[] } {
  const sessions: AttendanceSession[] = [];
  const records: AttendanceRecord[] = [];
  const rand = mulberry32(91);
  const all = learners;
  let sess = 100;
  for (let i = 0; i < 56; i++) {
    sess += 1;
    const type = SESSION_TYPES[i % SESSION_TYPES.length];
    const program = i % 2 === 0 ? 'Doctor of Medicine' : 'Internal Medicine Residency';
    const cohort = i % 2 === 0 ? 'Class of 2028' : 'PGY-1';
    const learnersIn = all.filter((l) => (i % 2 === 0 ? l.cohortId === 'CO-2028' : l.cohortId === 'res-im-1')).slice(0, 22);
    const source = ATTENDANCE_SOURCES[i % ATTENDANCE_SOURCES.length];
    const id = `SES-${sess}`;
    const startH = 7 + (i % 9);
    sessions.push({
      id,
      title: `${type}${type === 'Lecture' ? ' - ' + ['Cardiology', 'Pulmonology', 'Neurology', 'Endocrinology'][i % 4] : ''}`,
      type,
      date: d(-Math.floor(rand() * 12)),
      start: `${startH}:00 AM`,
      end: `${startH + 1}:30 AM`,
      location: ['Longwood Lecture Hall', 'Clinical Skills Lab A', 'Ward 5 North', 'Huntington Auditorium', 'Simulation Center - Bay 1'][i % 5],
      department: ['im', 'sim', 'neuro', 'peds'][i % 4],
      program,
      cohort,
      facilitator: i % 2 === 0 ? 'Dr. Emily Chen' : 'Dr. James Whitfield',
      source,
      learnerIds: learnersIn.map((l) => l.id),
    });
    learnersIn.forEach((l, li) => {
      const roll = rand();
      const status = roll < 0.8 ? 'Present' : roll < 0.87 ? 'Late' : roll < 0.93 ? 'Excused' : 'Absent';
      records.push({
        id: `REC-${sess}-${li}`,
        sessionId: id,
        learnerId: l.id,
        learnerName: l.name,
        status,
        source,
        validation: source === 'Clinical Supervisor Validation' ? 'Validated' : status === 'Present' ? 'Auto-Validated' : 'Needs Review',
      });
    });
  }
  return { sessions, records };
}

export interface AppDataset {
  learners: Learner[];
  faculty: FacultyMember[];
  rotations: Rotation[];
  caseLogs: CaseLog[];
  procedures: ProcedureLog[];
  sessions: AttendanceSession[];
  attendanceRecords: AttendanceRecord[];
  assessments: AssessmentItem[];
  oscE: OSCERun;
  competencies: typeof COMPETENCIES;
  complianceIndicators: typeof COMPLIANCE_SEEDS;
  evidence: typeof EVIDENCE_SEEDS;
  scheduleEvents: typeof SCHEDULE_SEEDS;
  notifications: typeof NOTIFICATION_SEEDS;
  audit: typeof AUDIT_SEEDS;
  exceptions: typeof EXCEPTION_SEEDS;
}

export function buildDataset(): AppDataset {
  const faculty = buildFaculty();
  const rotations = buildRotations(faculty);
  const learners = buildLearners(faculty, rotations);
  const { sessions, records } = buildAttendance(learners);
  return {
    learners,
    faculty,
    rotations,
    caseLogs: buildCaseLogs(learners, faculty),
    procedures: buildProcedures(learners),
    sessions,
    attendanceRecords: records,
    assessments: buildAssessments(),
    oscE: buildOSCERun(),
    competencies: COMPETENCIES,
    complianceIndicators: COMPLIANCE_SEEDS,
    evidence: EVIDENCE_SEEDS,
    scheduleEvents: SCHEDULE_SEEDS,
    notifications: NOTIFICATION_SEEDS,
    audit: AUDIT_SEEDS,
    exceptions: EXCEPTION_SEEDS,
  };
}

/* Deterministic per-learner competency status baseline (not persisted; overrides applied on top) */
export type CompStatus = 'Not Started' | 'In Progress' | 'Needs Review' | 'Achieved' | 'Exceeds Expectation';

export function baselineCompetencyStatus(learnerId: string, compIndex: number): CompStatus {
  const rand = mulberry32(hashString(`${learnerId}:${compIndex}`) + 7);
  const r = rand();
  if (learnerId === 'MED-2026-0147') {
    // Olivia's Internal Medicine competencies: EPA-01 / PC-09 / CS-06 not yet achieved
    const pending = ['EPA-01', 'PC-09', 'CS-06'];
    if (compIndex < 96 && COMPETENCIES[compIndex].code === 'EPA-01') return 'Needs Review';
    if (COMPETENCIES[compIndex].code === 'PC-09' || COMPETENCIES[compIndex].code === 'CS-06') return 'In Progress';
  }
  if (r < 0.42) return 'Not Started';
  if (r < 0.72) return 'In Progress';
  if (r < 0.78) return 'Needs Review';
  if (r < 0.97) return 'Achieved';
  return 'Exceeds Expectation';
}