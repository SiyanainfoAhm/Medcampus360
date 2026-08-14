export const LEARNER_FIRST = [
  'Olivia', 'Emma', 'Sophia', 'Ava', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
  'Liam', 'Noah', 'Ethan', 'Mason', 'Lucas', 'Aiden', 'James', 'Benjamin', 'Elijah', 'Henry',
  'Maya', 'Priya', 'Aisha', 'Gabriela', 'Chloe', 'Grace', 'Lily', 'Zoey', 'Nora', 'Ruby',
  'Daniel', 'Matthew', 'Alexander', 'Michael', 'Andrew', 'William', 'Julian', 'Owen', 'Caleb', 'Nathan',
  'Sofia', 'Camila', 'Valentina', 'Isla', 'Aria', 'Elena', 'Amara', 'Naomi', 'Riley', 'Samantha',
  'Jackson', 'Sebastian', 'Gabriel', 'Isaac', 'Anthony', 'Ryan', 'David', 'Brandon', 'Tyler', 'Joshua',
];

export const LEARNER_LAST = [
  'Carter', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Okafor', 'Kim', 'Patel', 'Singh', 'Chen', 'Dubois', 'Osei', 'Tanaka', 'Novak', 'Ferreira',
];

export const FACULTY_FIRST = [
  'Margaret', 'Emily', 'James', 'Sarah', 'Robert', 'Linda', 'Michael', 'David', 'Angela', 'Thomas',
  'Kevin', 'Priya', 'Jonathan', 'Nina', 'Samuel', 'Ellen', 'Alicia', 'Daniel', 'Yvonne', 'Brian',
  'Grace', 'William', 'Laura', 'Charles', 'Rebecca', 'Anthony', 'Maria', 'Joseph', 'Sandra', 'Peter',
  'Rachel', 'Victor', 'Julia', 'Frank', 'Carol', 'George', 'Diana', 'Edward', 'Helen', 'Raymond',
];

export const FACULTY_LAST = [
  'Sullivan', 'Chen', 'Whitfield', 'Okonkwo', 'Reyes', 'Park', 'Grant', 'Brooks', 'Osei', 'Shah',
  'Cole', 'Patel', 'Kim', 'Foster', 'Torres', 'White', 'Martin', 'Clark', 'Liu', 'Anderson',
  'Nguyen', 'Diaz', 'Hernandez', 'Carter', 'Walker', 'Young', 'Rivera', 'Mitchell', 'Garcia', 'Lopez',
  'Novak', 'Tanaka', 'Dubois', 'Ferreira', 'Okafor', 'Singh', 'Chen', 'Morgan', 'Stewart', 'Murphy',
];

export const ACADEMIC_TITLES = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Clinical Professor',
  'Clinical Associate Professor',
  'Assistant Professor of Medicine',
  'Professor of Medicine',
  'Director, Medical Education',
  'Vice Chair for Education',
  'Clerkship Director',
];

export const FACULTY_SPECIALTIES: Record<string, string[]> = {
  im: ['General Internal Medicine', 'Hospital Medicine', 'Cardiology Consult', 'Geriatrics', 'Infectious Disease'],
  surg: ['General Surgery', 'Trauma Surgery', 'Minimally Invasive Surgery', 'Surgical Oncology'],
  peds: ['General Pediatrics', 'Neonatology', 'Pediatric Cardiology', 'Adolescent Medicine'],
  fam: ['Family Medicine', 'Community Health', 'Sports Medicine', 'Women\u2019s Health'],
  obgyn: ['Obstetrics', 'Gynecology', 'Maternal-Fetal Medicine', 'Reproductive Health'],
  psych: ['General Psychiatry', 'Child Psychiatry', 'Addiction Medicine', 'Geriatric Psychiatry'],
  em: ['Emergency Medicine', 'Toxicology', 'EMS / Prehospital Care', 'Ultrasound'],
  rad: ['Diagnostic Radiology', 'Interventional Radiology', 'Neuroradiology', 'Breast Imaging'],
  anes: ['Anesthesiology', 'Critical Care', 'Regional Anesthesia', 'Cardiac Anesthesia'],
  neuro: ['Neurology', 'Neurocritical Care', 'Stroke Medicine', 'Epilepsy'],
  path: ['Anatomic Pathology', 'Clinical Pathology', 'Hematopathology', 'Cytopathology'],
  cph: ['Public Health', 'Epidemiology', 'Health Policy', 'Community Medicine'],
  meded: ['Medical Education', 'Curriculum Design', 'Assessment Science', 'Faculty Development'],
  sim: ['Simulation Education', 'Clinical Skills', 'Patient Safety', 'Procedural Skills'],
  ortho: ['Orthopedic Surgery', 'Sports Orthopedics', 'Joint Replacement', 'Trauma Orthopedics'],
  cardio: ['Cardiology', 'Electrophysiology', 'Advanced Heart Failure', 'Preventive Cardiology'],
  hosp: ['Hospital Medicine', 'Nocturnist Medicine', 'Care Transitions', 'Palliative Medicine'],
  research: ['Clinical Research', 'Translational Medicine', 'Biostatistics', 'Quality Improvement'],
};

export const LEARNER_PROGRAMS: Record<string, string[]> = {
  md: ['Class of 2028', 'Class of 2029', 'Class of 2030'],
  'res-im': ['PGY-1', 'PGY-2', 'PGY-3'],
  'res-surg': ['PGY-1', 'PGY-2', 'PGY-3'],
  'res-peds': ['PGY-1', 'PGY-2', 'PGY-3'],
  'res-fm': ['PGY-1', 'PGY-2', 'PGY-3'],
  'res-psych': ['PGY-1', 'PGY-2', 'PGY-3'],
  'res-em': ['PGY-1', 'PGY-2', 'PGY-3'],
  'fell-cardio': ['Fellowship Year 1', 'Fellowship Year 2'],
  'fell-pulm': ['Fellowship Year 1', 'Fellowship Year 2'],
  'fell-hosp': ['Fellowship Year 1'],
  'fell-id': ['Fellowship Year 1', 'Fellowship Year 2'],
  gme: ['GME Track 1', 'GME Track 2'],
};

export const ROTATION_NAMES: Record<string, string[]> = {
  im: ['Internal Medicine Clerkship', 'Hospital Medicine Rotation', 'Cardiology Clerkship', 'Inpatient Medicine'],
  surg: ['General Surgery Clerkship', 'Surgical Subspecialties', 'Trauma Surgery Rotation'],
  peds: ['Pediatrics Clerkship', 'Pediatric ER Rotation', 'Neonatology Rotation'],
  fam: ['Family Medicine Clerkship', 'Ambulatory Medicine', 'Community Medicine Rotation'],
  obgyn: ['OB/GYN Clerkship', 'Women\u2019s Health Rotation', 'Labor & Delivery'],
  psych: ['Psychiatry Clerkship', 'Behavioral Health Rotation', 'Consult-Liaison Psychiatry'],
  em: ['Emergency Medicine Rotation', 'Urgent Care Rotation', 'EMS Field Rotation'],
  rad: ['Radiology Rotation', 'Diagnostic Imaging', 'Breast Imaging Elective'],
  anes: ['Anesthesiology Rotation', 'Perioperative Medicine', 'Regional Anesthesia Elective'],
  neuro: ['Neurology Clerkship', 'Stroke Service Rotation', 'Neurocritical Care'],
  path: ['Pathology Rotation', 'Autopsy & Surgical Pathology', 'Clinical Pathology'],
  cph: ['Community & Public Health', 'Population Health Rotation', 'Health Policy Elective'],
  sim: ['Simulation Bootcamp', 'Procedural Skills', 'Code Blue Simulation'],
  ortho: ['Orthopedics Clerkship', 'Sports Medicine Rotation', 'Musculoskeletal Rotation'],
  cardio: ['Cardiology Consult', 'Advanced Cardiac Imaging', 'Heart Failure Service'],
  hosp: ['Hospital Medicine', 'Night Float Medicine', 'Palliative Care'],
  research: ['Clinical Research Rotation', 'Quality Improvement', 'Research Elective'],
  meded: ['Teaching Assistant Rotation', 'MedEd Elective'],
};

export const PHONE_AREA_CODES = ['617', '781', '857', '339', '978'];
export const BOSTON_ZIPS = ['02115', '02116', '02118', '02120', '02215', '02114', '02129', '02135', '02138', '02140', '02143', '02144'];
export const STREET_NAMES = ['Huntington Ave', 'Beacon Street', 'Commonwealth Ave', 'Mass Ave', 'Boylston Street', 'Newbury Street', 'Cambridge Street', 'Brookline Ave', 'Tremont Street', 'Longwood Ave'];