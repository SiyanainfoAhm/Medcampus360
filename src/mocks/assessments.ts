export const ASSESSMENT_TYPES = [
  'Written Assessment',
  'Clinical Skills Assessment',
  'OSCE',
  'Simulation Assessment',
  'Direct Observation',
  'Rotation Evaluation',
  'Faculty Feedback',
];

export const ASSESSMENT_STATUSES = ['Scheduled', 'In Progress', 'Grading', 'Awaiting Release', 'Released', 'Closed'];

export interface OSCEStation {
  id: string;
  skill: string;
  duration: string;
  station: string;
  examiner: string;
  checklist: string[];
  criticalItems: string[];
}

export const OSCE_STATIONS: OSCEStation[] = [
  {
    id: 'OSCE-S1', skill: 'Cardiovascular examination', duration: '8 min', station: 'Station 1', examiner: 'Dr. Emily Chen',
    checklist: ['Washes hands and introduces self', 'Inspects and exposes appropriately', 'Percusses cardiac borders', 'Auscultates in correct order', 'Identifies murmurs and extra sounds', 'Summarizes findings'],
    criticalItems: ['Correct auscultation sequence', 'Identifies S3/S4'],
  },
  {
    id: 'OSCE-S2', skill: 'History: acute chest pain', duration: '8 min', station: 'Station 2', examiner: 'Dr. James Whitfield',
    checklist: ['Open-ended questions', 'Character, onset, duration', 'Radiation and aggravating factors', 'Risk factor screening', 'Summary and next steps'],
    criticalItems: ['Screens for red flags', 'Asks about cardiac risk factors'],
  },
  {
    id: 'OSCE-S3', skill: 'Communication: delivering difficult news', duration: '10 min', station: 'Station 3', examiner: 'Dr. Alicia Torres',
    checklist: ['Prepares setting', 'Uses empathetic statements', 'Provides information in small chunks', 'Allows silence and questions', 'Offers support resources'],
    criticalItems: ['No medical jargon', 'Demonstrates empathy'],
  },
  {
    id: 'OSCE-S4', skill: 'Respiratory examination', duration: '8 min', station: 'Station 4', examiner: 'Dr. Robert Diaz',
    checklist: ['Inspection of chest', 'Palpation for tactile fremitus', 'Percussion technique', 'Auscultation of all zones', 'Interpretation of findings'],
    criticalItems: ['Correct lung zone coverage'],
  },
  {
    id: 'OSCE-S5', skill: 'ECG interpretation', duration: '6 min', station: 'Station 5', examiner: 'Dr. Yvonne Martin',
    checklist: ['Rate and rhythm assessment', 'Axis evaluation', 'ST segment analysis', 'Identifies acute ischemia', 'Formulates management'],
    criticalItems: ['Recognizes STEMI criteria'],
  },
  {
    id: 'OSCE-S6', skill: 'Informed consent counseling', duration: '8 min', station: 'Station 6', examiner: 'Dr. Michael Reyes',
    checklist: ['Explains procedure in plain language', 'Discusses risks and benefits', 'Confirms understanding', 'Obtains signature appropriately', 'Documents conversation'],
    criticalItems: ['Assesses capacity', 'Confirms understanding'],
  },
  {
    id: 'OSCE-S7', skill: 'Abdominal examination', duration: '8 min', station: 'Station 7', examiner: 'Dr. Linda Park',
    checklist: ['Inspection', 'Auscultation before palpation', 'Light and deep palpation', 'Liver and spleen assessment', 'Rebound and guarding assessment'],
    criticalItems: ['Auscultation before palpation'],
  },
  {
    id: 'OSCE-S8', skill: 'Simulation: code blue response', duration: '12 min', station: 'Station 8', examiner: 'Dr. Alicia Torres',
    checklist: ['Recognizes arrest', 'Calls for help / activates team', 'Starts high-quality compressions', 'Directs airway management', 'Uses defibrillator correctly', 'Team communication'],
    criticalItems: ['Early defibrillation for shockable rhythm'],
  },
  {
    id: 'OSCE-S9', skill: 'Handover (SBAR)', duration: '6 min', station: 'Station 9', examiner: 'Dr. Brian Clark',
    checklist: ['Situation', 'Background', 'Assessment', 'Recommendation', 'Closes loop on questions'],
    criticalItems: ['Includes code status and pending tasks'],
  },
  {
    id: 'OSCE-S10', skill: 'Neurologic examination', duration: '10 min', station: 'Station 10', examiner: 'Dr. Samuel Kim',
    checklist: ['Mental status', 'Cranial nerves', 'Motor and sensory exam', 'Coordination and gait', 'Localization of lesion'],
    criticalItems: ['Cranial nerve completeness'],
  },
  {
    id: 'OSCE-S11', skill: 'Venipuncture and blood culture', duration: '8 min', station: 'Station 11', examiner: 'Dr. Ellen Foster',
    checklist: ['Identifies patient', 'Sterile hand hygiene', 'Selects appropriate site', 'Uses sterile technique', 'Labels and processes specimen'],
    criticalItems: ['Sterile technique throughout'],
  },
  {
    id: 'OSCE-S12', skill: 'Patient education: diabetes', duration: '8 min', station: 'Station 12', examiner: 'Dr. Thomas Grant',
    checklist: ['Assesses baseline knowledge', 'Explains glucose monitoring', 'Discusses diet and activity', 'Uses teach-back', 'Sets a follow-up plan'],
    criticalItems: ['Uses teach-back method'],
  },
];

export const RESULT_LEVELS = ['Below Benchmark', 'Meets Benchmark', 'Exceeds Benchmark'];

export const RUBRIC_LEVELS = [
  { level: 1, label: 'Unable to perform', anchor: 'Did not demonstrate the skill; requires direct instruction.' },
  { level: 2, label: 'Performs with prompting', anchor: 'Performs the skill with significant prompting and correction.' },
  { level: 3, label: 'Performs with minimal prompting', anchor: 'Performs the skill with minimal prompting; occasional errors.' },
  { level: 4, label: 'Performs independently', anchor: 'Performs the skill independently and accurately.' },
  { level: 5, label: 'Performs at teaching level', anchor: 'Performs the skill and teaches it to others.' },
];

export const ENTRUSTMENT_LEVELS = [
  { level: 1, label: 'Observation only', anchor: 'Learner observes, no active role.' },
  { level: 2, label: 'Direct supervision, active in room', anchor: 'Preceptor physically present and directing.' },
  { level: 3, label: 'Indirect supervision, immediately available', anchor: 'Preceptor available within minutes; learner manages with backup.' },
  { level: 4, label: 'Indirect supervision, preceptor nearby', anchor: 'Learner manages independently with preceptor on site.' },
  { level: 5, label: 'Entrusted to act without supervision', anchor: 'Learner operates autonomously for this activity.' },
];