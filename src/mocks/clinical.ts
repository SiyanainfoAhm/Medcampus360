export const CASE_CATEGORIES = [
  'Cardiovascular',
  'Respiratory',
  'Gastrointestinal',
  'Neurology',
  'Endocrine / Metabolic',
  'Renal / Genitourinary',
  'Infectious Disease',
  'Hematology / Oncology',
  'Musculoskeletal',
  'Psychiatry / Behavioral',
  'Obstetrics / Gynecology',
  'Pediatrics',
  'Dermatology',
  'Surgery / Trauma',
];

export const CASE_SETTINGS = ['Inpatient', 'Outpatient', 'Emergency Department', 'Operating Room', 'Community Clinic', 'Long-Term Care'];

export const AGE_GROUPS = ['Infant <1', 'Child 1-12', 'Adolescent 13-17', 'Adult 18-44', 'Adult 45-64', 'Older Adult 65+'];

export const PARTICIPATION_LEVELS = [
  'Observed only',
  'Assisted',
  'Performed under direct supervision',
  'Performed with indirect supervision',
];

export interface RotationTemplate {
  id: string;
  name: string;
  department: string;
  site: string;
  durationWeeks: number;
  capacity: number;
  shift: string;
  objectives: string[];
  requiredCases: number;
  requiredProcedures: number;
}

export const ROTATION_TEMPLATES: RotationTemplate[] = [
  {
    id: 'rt-im', name: 'Internal Medicine Clerkship', department: 'im', site: 'NUMC', durationWeeks: 8, capacity: 16,
    shift: 'Day (7:00 AM - 6:00 PM)',
    objectives: ['History and physical examination', 'Clinical reasoning and differential diagnosis', 'Inpatient management and care coordination', 'Evidence-based medicine application'],
    requiredCases: 12, requiredProcedures: 4,
  },
  {
    id: 'rt-surg', name: 'General Surgery Clerkship', department: 'surg', site: 'NUMC', durationWeeks: 6, capacity: 14,
    shift: 'Day (6:00 AM - 5:00 PM)',
    objectives: ['Preoperative and postoperative care', 'Surgical asepsis and sterile technique', 'Common surgical presentations', 'Intraoperative assistance'],
    requiredCases: 10, requiredProcedures: 5,
  },
  {
    id: 'rt-peds', name: 'Pediatrics Clerkship', department: 'peds', site: 'BCH', durationWeeks: 6, capacity: 12,
    shift: 'Day (8:00 AM - 5:00 PM)',
    objectives: ['Growth and development assessment', 'Pediatric history and communication', 'Common pediatric conditions', 'Well-child care'],
    requiredCases: 10, requiredProcedures: 3,
  },
  {
    id: 'rt-obgyn', name: 'OB/GYN Clerkship', department: 'obgyn', site: 'SAWHP', durationWeeks: 6, capacity: 12,
    shift: 'Variable (rotating)',
    objectives: ['Prenatal care and antenatal assessment', 'Labor and delivery fundamentals', 'Women\u2019s health screening', 'Gynecologic presentations'],
    requiredCases: 10, requiredProcedures: 4,
  },
  {
    id: 'rt-psych', name: 'Psychiatry Clerkship', department: 'psych', site: 'RBHC', durationWeeks: 4, capacity: 10,
    shift: 'Day (8:00 AM - 5:00 PM)',
    objectives: ['Psychiatric history and mental status exam', 'Risk assessment and safety planning', 'Common psychiatric disorders', 'Behavioral health treatment planning'],
    requiredCases: 8, requiredProcedures: 2,
  },
  {
    id: 'rt-fm', name: 'Family Medicine Clerkship', department: 'fam', site: 'EBCHC', durationWeeks: 4, capacity: 10,
    shift: 'Day (8:30 AM - 5:00 PM)',
    objectives: ['Ambulatory care', 'Preventive medicine', 'Chronic disease management', 'Community health'],
    requiredCases: 8, requiredProcedures: 3,
  },
  {
    id: 'rt-em', name: 'Emergency Medicine Rotation', department: 'em', site: 'HCH', durationWeeks: 4, capacity: 12,
    shift: 'Variable (including nights)',
    objectives: ['Acute care triage and stabilization', 'Emergency procedures', 'Fast-track and urgent care', 'Resuscitation teamwork'],
    requiredCases: 10, requiredProcedures: 6,
  },
  {
    id: 'rt-neuro', name: 'Neurology Clerkship', department: 'neuro', site: 'NUMC', durationWeeks: 4, capacity: 8,
    shift: 'Day (7:00 AM - 5:00 PM)',
    objectives: ['Neurologic history and exam', 'Stroke recognition and management', 'Common neurologic conditions', 'Neuroimaging interpretation'],
    requiredCases: 8, requiredProcedures: 2,
  },
];

export const PROCEDURE_NAMES = [
  'Venipuncture',
  'IV cannulation',
  'Arterial blood gas',
  'Blood cultures (sterile technique)',
  'ECG acquisition and interpretation',
  'Basic suturing',
  'Simple wound closure',
  'Urinary catheter insertion',
  'NG tube placement',
  'Lumbar puncture',
  'Paracentesis',
  'Thoracentesis',
  'Knee arthrocentesis',
  'Bone marrow aspiration (assist)',
  'Central line insertion (assist)',
  'Airway management / BVM',
  'Intubation (assist)',
  'Chest tube insertion (assist)',
  'Skin biopsy',
  'Splinting and casting',
];

export const PROCEDURE_LEVELS = ['Observed', 'Performed under direct supervision', 'Performed with indirect supervision', 'Performed independently'];

export interface CaseLogSeed {
  id: string;
  learnerId: string;
  rotation: string;
  encounterDate: string;
  setting: string;
  service: string;
  category: string;
  participation: string;
  summary: string;
  reflection: string;
  status: 'Draft' | 'Submitted' | 'Revision Requested' | 'Approved' | 'Competency Credited';
  competencies: string[];
  preceptor: string;
  feedback?: string;
  feedbackDate?: string;
}

export const CASE_LOG_SEEDS: CaseLogSeed[] = [
  {
    id: 'IM-CASE-1047',
    learnerId: 'MED-2026-0147',
    rotation: 'Internal Medicine Clerkship',
    encounterDate: '08/11/2026',
    setting: 'Inpatient',
    service: 'Internal Medicine',
    category: 'Cardiovascular',
    participation: 'Performed under direct supervision',
    summary: 'Adult 45-64, presented with acute onset chest pressure and diaphoresis. Initial vitals and ECG reviewed; STEMI pathway activated with cardiology. Learned approach to urgent cardiovascular triage and serial biomarker interpretation. Skills observed: focused cardiovascular exam, ECG interpretation, initial management plan.',
    reflection: 'This encounter strengthened my confidence in recognizing acute coronary presentations. I would benefit from more practice interpreting evolving ECG changes and leading the initial discussion with the patient and family.',
    status: 'Submitted',
    competencies: ['EPA-01', 'PC-09', 'CS-06'],
    preceptor: 'Dr. Emily Chen',
  },
  {
    id: 'IM-CASE-1042',
    learnerId: 'MED-2026-0147',
    rotation: 'Internal Medicine Clerkship',
    encounterDate: '08/08/2026',
    setting: 'Inpatient',
    service: 'Internal Medicine',
    category: 'Respiratory',
    participation: 'Assisted',
    summary: 'Older Adult 65+, admitted with dyspnea and hypoxia. Evaluated for heart failure exacerbation vs pneumonia. Reviewed chest imaging and initiated oxygen and diuretics with team. Skills observed: respiratory exam, oxygen titration, care coordination.',
    reflection: 'The distinction between cardiogenic and infectious causes of dyspnea was clearer after this case. I want to improve my approach to initial diuretic dosing and monitoring.',
    status: 'Approved',
    competencies: ['EPA-01', 'PC-04'],
    preceptor: 'Dr. Emily Chen',
    feedback: 'Good systematic approach. Continue to verbalize your differential and rationale at the bedside.',
    feedbackDate: '08/09/2026',
  },
  {
    id: 'IM-CASE-1039',
    learnerId: 'MED-2026-0147',
    rotation: 'Internal Medicine Clerkship',
    encounterDate: '08/05/2026',
    setting: 'Outpatient',
    service: 'Internal Medicine',
    category: 'Endocrine / Metabolic',
    participation: 'Performed under direct supervision',
    summary: 'Adult 45-64, follow-up for poorly controlled type 2 diabetes. Reviewed glucose log, adjusted insulin regimen with preceptor, and reinforced dietary counseling. Skills observed: medication reconciliation, patient education, shared decision making.',
    reflection: 'This case helped me understand how social factors affect glycemic control. I plan to incorporate health literacy screening in future counseling.',
    status: 'Approved',
    competencies: ['ICS-07', 'PC-12'],
    preceptor: 'Dr. Emily Chen',
    feedback: 'Excellent counseling. Your use of teach-back was effective.',
    feedbackDate: '08/06/2026',
  },
  {
    id: 'IM-CASE-1051',
    learnerId: 'MED-2026-0184',
    rotation: 'Internal Medicine Clerkship',
    encounterDate: '08/12/2026',
    setting: 'Inpatient',
    service: 'Internal Medicine',
    category: 'Infectious Disease',
    participation: 'Performed under direct supervision',
    summary: 'Adult 18-44, presented with fever and productive cough. Evaluated for community-acquired pneumonia; initiated empiric antibiotics after blood cultures. Skills observed: focused respiratory exam, blood culture technique, antimicrobial stewardship discussion.',
    reflection: 'I learned the importance of timing blood cultures before antibiotics and the value of reviewing local antibiograms.',
    status: 'Submitted',
    competencies: ['EPA-01', 'MK-04', 'CS-10'],
    preceptor: 'Dr. Emily Chen',
  },
  {
    id: 'IM-CASE-1048',
    learnerId: 'MED-2026-0210',
    rotation: 'Hospital Medicine Rotation',
    encounterDate: '08/12/2026',
    setting: 'Inpatient',
    service: 'Hospital Medicine',
    category: 'Neurology',
    participation: 'Assisted',
    summary: 'Older Adult 65+, acute confusion and focal weakness. Stroke code activated; imaging completed and tPA administered under supervision. Skills observed: NIHSS assessment, stroke pathway activation, family communication.',
    reflection: 'Time-critical care highlighted the importance of parallel processes and clear team roles during emergencies.',
    status: 'Submitted',
    competencies: ['EPA-10', 'PC-09'],
    preceptor: 'Dr. James Whitfield',
  },
];

export const CASE_LOG_FIELDS = [
  'Case-log ID',
  'Encounter date',
  'Clinical setting',
  'Service / department',
  'Case category',
  'Learner participation level',
  'De-identified case summary',
  'Skills observed or performed',
  'Learning reflection',
  'Supporting evidence',
  'Submission status',
  'Preceptor feedback',
];