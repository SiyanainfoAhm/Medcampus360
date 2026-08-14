export const INSTITUTION = {
  name: 'MedCampus 360',
  tagline: 'Medical Education & Clinical Learning Platform',
  school: 'Northbridge University School of Medicine',
  location: 'Boston, Massachusetts',
  academicYear: '2026-2027',
  academicYearShort: 'AY 2026-27',
  term: 'Fall Term',
  cycle: 'Academic Year 2026-2027',
};

export const ACADEMIC_YEARS = ['2024-2025', '2025-2026', '2026-2027'];

export interface Program {
  id: string;
  name: string;
  short: string;
  type: 'Undergraduate Medical' | 'Graduate Medical' | 'Residency' | 'Fellowship';
}

export const PROGRAMS: Program[] = [
  { id: 'md', name: 'Doctor of Medicine', short: 'MD', type: 'Undergraduate Medical' },
  { id: 'gme', name: 'Graduate Medical Education', short: 'GME', type: 'Graduate Medical' },
  { id: 'res-im', name: 'Internal Medicine Residency', short: 'IM Residency', type: 'Residency' },
  { id: 'res-surg', name: 'General Surgery Residency', short: 'Surgery Residency', type: 'Residency' },
  { id: 'res-peds', name: 'Pediatrics Residency', short: 'Pediatrics Residency', type: 'Residency' },
  { id: 'res-fm', name: 'Family Medicine Residency', short: 'FM Residency', type: 'Residency' },
  { id: 'res-psych', name: 'Psychiatry Residency', short: 'Psychiatry Residency', type: 'Residency' },
  { id: 'res-em', name: 'Emergency Medicine Residency', short: 'EM Residency', type: 'Residency' },
  { id: 'fell-cardio', name: 'Cardiology Fellowship', short: 'Cardiology Fellowship', type: 'Fellowship' },
  { id: 'fell-pulm', name: 'Pulmonary & Critical Care Fellowship', short: 'Pulm/CC Fellowship', type: 'Fellowship' },
  { id: 'fell-hosp', name: 'Hospital Medicine Fellowship', short: 'Hospital Medicine Fellowship', type: 'Fellowship' },
  { id: 'fell-id', name: 'Infectious Disease Fellowship', short: 'ID Fellowship', type: 'Fellowship' },
];

export interface Department {
  id: string;
  name: string;
  short: string;
  chair: string;
}

export const DEPARTMENTS: Department[] = [
  { id: 'im', name: 'Internal Medicine', short: 'IM', chair: 'Dr. Sarah Okonkwo' },
  { id: 'surg', name: 'General Surgery', short: 'Surgery', chair: 'Dr. Michael Reyes' },
  { id: 'peds', name: 'Pediatrics', short: 'Pediatrics', chair: 'Dr. Linda Park' },
  { id: 'fam', name: 'Family Medicine', short: 'FM', chair: 'Dr. Thomas Grant' },
  { id: 'obgyn', name: 'Obstetrics & Gynecology', short: 'OB/GYN', chair: 'Dr. Angela Brooks' },
  { id: 'psych', name: 'Psychiatry', short: 'Psychiatry', chair: 'Dr. Kevin Osei' },
  { id: 'em', name: 'Emergency Medicine', short: 'EM', chair: 'Dr. Priya Shah' },
  { id: 'rad', name: 'Radiology', short: 'Radiology', chair: 'Dr. Jonathan Cole' },
  { id: 'anes', name: 'Anesthesiology', short: 'Anesthesia', chair: 'Dr. Nina Patel' },
  { id: 'neuro', name: 'Neurology', short: 'Neurology', chair: 'Dr. Samuel Kim' },
  { id: 'path', name: 'Pathology & Laboratory Medicine', short: 'Pathology', chair: 'Dr. Ellen Foster' },
  { id: 'cph', name: 'Community & Public Health', short: 'Public Health', chair: 'Dr. Robert Diaz' },
  { id: 'meded', name: 'Medical Education', short: 'Med Ed', chair: 'Dr. Margaret Sullivan' },
  { id: 'sim', name: 'Simulation & Clinical Skills', short: 'Simulation', chair: 'Dr. Alicia Torres' },
  { id: 'ortho', name: 'Orthopedic Surgery', short: 'Orthopedics', chair: 'Dr. Daniel White' },
  { id: 'cardio', name: 'Cardiology', short: 'Cardiology', chair: 'Dr. Yvonne Martin' },
  { id: 'hosp', name: 'Hospital Medicine', short: 'Hospital Med', chair: 'Dr. Brian Clark' },
  { id: 'research', name: 'Clinical Research', short: 'Research', chair: 'Dr. Grace Liu' },
];

export interface ClinicalSite {
  id: string;
  name: string;
  type: string;
  city: string;
  capacity: number;
}

export const CLINICAL_SITES: ClinicalSite[] = [
  { id: 'NUMC', name: 'Northbridge University Medical Center', type: 'Academic Medical Center', city: 'Boston', capacity: 120 },
  { id: 'HCH', name: 'Harborview Community Hospital', type: 'Community Hospital', city: 'Cambridge', capacity: 60 },
  { id: 'BCH', name: "Beacon Children's Hospital", type: "Children's Hospital", city: 'Boston', capacity: 48 },
  { id: 'RBHC', name: 'Riverside Behavioral Health Center', type: 'Behavioral Health Center', city: 'Somerville', capacity: 32 },
  { id: 'NCVMC', name: 'North County Veterans Medical Center', type: 'Veterans Medical Center', city: 'Revere', capacity: 55 },
  { id: 'EBCHC', name: 'East Boston Community Health Center', type: 'Community Health Center', city: 'East Boston', capacity: 40 },
  { id: 'SAWHP', name: "St. Anne Women's Health Pavilion", type: "Women's Health Pavilion", city: 'Brookline', capacity: 35 },
  { id: 'CCSC', name: 'Cambridge Clinical Simulation Center', type: 'Simulation Center', city: 'Cambridge', capacity: 30 },
];

export interface Cohort {
  id: string;
  name: string;
  program: string;
  year: number;
  phase: string;
  size: number;
}

export const COHORTS: Cohort[] = [
  { id: 'CO-2028', name: 'Class of 2028', program: 'md', year: 3, phase: 'Clinical Clerkship', size: 120 },
  { id: 'CO-2029', name: 'Class of 2029', program: 'md', year: 2, phase: 'Foundations of Medicine', size: 118 },
  { id: 'CO-2030', name: 'Class of 2030', program: 'md', year: 1, phase: 'Foundations of Medicine', size: 116 },
  { id: 'PGY1', name: 'PGY-1', program: 'res-im', year: 1, phase: 'Intern Year', size: 92 },
  { id: 'PGY2', name: 'PGY-2', program: 'res-im', year: 2, phase: 'Residency', size: 88 },
  { id: 'PGY3', name: 'PGY-3', program: 'res-im', year: 3, phase: 'Residency', size: 86 },
  { id: 'FELLOW1', name: 'Fellowship Year 1', program: 'fell-cardio', year: 1, phase: 'Fellowship', size: 68 },
  { id: 'FELLOW2', name: 'Fellowship Year 2', program: 'fell-cardio', year: 2, phase: 'Fellowship', size: 64 },
];

export const STANDINGS = [
  'Good Standing',
  'On Track',
  'Needs Support',
  'Intervention Required',
  'Academic Probation',
];