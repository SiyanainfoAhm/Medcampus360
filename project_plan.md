# MedCampus 360 - Project Plan (US Medical Education Platform)

## 1. Project Description
MedCampus 360 is a US-market medical education and clinical learning management platform for
**Northbridge University School of Medicine, Boston, Massachusetts (Academic Year 2026-2027)**.
It connects learners, faculty preceptors, clinical coordinators, program administrators, and institutional
leadership across rotations, competencies, attendance, assessments, and accreditation evidence.

**Positioning:** Enterprise medical-education SaaS in the class of MedHub / New Innovations / Workday Student.
Fictional institutional data only. No NMC wording, no INR, no Indian payment references, no fake client claims,
no patient-identifying information, no "demo/sample/prototype/tender" language.

## 2. Product Scope (selected ~55-60%)
1. **Executive Overview** - command centre with KPI drill-downs, trends, intervention lists, alerts
2. **Learner Management** - directory (search/sort/filter/paginate) + Learner 360 profile (8 tabs)
3. **Academic Schedule** - day/week/month calendar, rotation planner, conflict panel, reschedule + faculty substitution
4. **Clinical Education** (flagship) - dashboard, rotation detail, de-identified case logs, procedure log, faculty review workflow with competency assessment
5. **Competency Management** - dashboard, 8-domain / 96-competency framework, live matrix, assessment form
6. **Attendance & Eligibility** - dashboard, session register, exception workflow, eligibility determination
7. **Assessments** - dashboard, OSCE evaluation, results approval with dual confirmation
8. **Compliance & Accreditation** - readiness command centre, indicator detail, evidence pack export
9. **Reports** - 12-report catalogue with preview, CSV/PDF export, scheduling
10. **Administration & Security** - users, roles/permissions, programs, sites, security settings, integrations, audit log
11. **Mobile experiences** - Learner app (8 screens) + Faculty app (7 screens)

**Excluded:** online admissions, fees/payments, hostel, library, transport, alumni, visitor management,
HR/payroll, leave, full LMS, proctoring, EHR/billing, certificates/DigiLocker/NAD.

## 3. Architecture
- **Shell:** fixed left sidebar (role-aware, collapsible) + top bar (global learner search, academic year + program
  selectors, notifications, help, role switcher, profile). 6 presentation roles with persona data.
- **Shared live data store** (`AppDataContext`): deterministic dataset (1,024 learners, 138 faculty, 42 rotations,
  96 competencies, 350 case logs, 180 procedures, 24 assessments, compliance indicators, audit) seeded from
  `src/utils/dataset.ts`; mutations persist to localStorage and update the same record everywhere.
- **Design system:** navy `#17324D`, clinical blue `#2563A6`, teal `#148A8A`, green/amber/red status semantics,
  canvas `#F5F7FA`, ink text scale, Inter typeface; subtle borders over shadows; 24px horizontal / 32px top spacing.
- **Key flows:** case log submitted -> faculty review -> revision requested -> learner resubmits -> faculty approves
  -> competency credited -> matrix + eligibility + compliance evidence update automatically.

## 4. Routes
`/overview` `/learners` `/learners/:id` `/schedule` `/clinical` `/clinical/rotations/:id` `/clinical/case-logs`
`/clinical/procedures` `/clinical/reviews` `/competencies` `/competencies/matrix` `/attendance`
`/attendance/register` `/eligibility` `/assessments` `/assessments/osce` `/assessments/results`
`/compliance` `/compliance/:id` `/reports` `/administration` `/administration/audit`
`/mobile/learner` `/mobile/faculty` `/design-tokens` `/sitemap` `/login`

## 5. Data Backend
No backend connected. All data is deterministic mock data with localStorage persistence for user-created records.
When needed, connect **Readdy Backend or SaaS Supabase** for auth, durable multi-user data, and edge functions.