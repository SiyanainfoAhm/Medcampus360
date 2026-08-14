import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

const NotFound = lazy(() => import('../pages/NotFound'));
const Home = lazy(() => import('../pages/home/page'));
const LoginPage = lazy(() => import('../pages/login/page'));
const OverviewPage = lazy(() => import('../pages/overview/page'));
const LearnersPage = lazy(() => import('../pages/learners/page'));
const LearnerDetailPage = lazy(() => import('../pages/learners/detail/page'));
const SchedulePage = lazy(() => import('../pages/schedule/page'));
const ClinicalPage = lazy(() => import('../pages/clinical/page'));
const RotationDetailPage = lazy(() => import('../pages/clinical/rotation-detail/page'));
const CaseLogsPage = lazy(() => import('../pages/clinical/case-logs/page'));
const ProceduresPage = lazy(() => import('../pages/clinical/procedures/page'));
const ReviewsPage = lazy(() => import('../pages/clinical/reviews/page'));
const CompetenciesPage = lazy(() => import('../pages/competencies/page'));
const MatrixPage = lazy(() => import('../pages/competencies/matrix/page'));
const AttendancePage = lazy(() => import('../pages/attendance/page'));
const RegisterPage = lazy(() => import('../pages/attendance/register/page'));
const EligibilityPage = lazy(() => import('../pages/eligibility/page'));
const AssessmentsPage = lazy(() => import('../pages/assessments/page'));
const OSCEPage = lazy(() => import('../pages/assessments/osce/page'));
const ResultsPage = lazy(() => import('../pages/assessments/results/page'));
const CompliancePage = lazy(() => import('../pages/compliance/page'));
const ComplianceDetailPage = lazy(() => import('../pages/compliance/detail/page'));
const ReportsPage = lazy(() => import('../pages/reports/page'));
const AdministrationPage = lazy(() => import('../pages/administration/page'));
const AuditLogPage = lazy(() => import('../pages/administration/audit/page'));
const DesignTokensPage = lazy(() => import('../pages/design-tokens/page'));
const SitemapPage = lazy(() => import('../pages/sitemap/page'));
const LearnerMobilePage = lazy(() => import('../pages/mobile/learner/page'));
const FacultyMobilePage = lazy(() => import('../pages/mobile/faculty/page'));

const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/login', element: <LoginPage /> },
  {
    element: <AppLayout />,
    children: [
      { path: '/overview', element: <OverviewPage /> },
      { path: '/learners', element: <LearnersPage /> },
      { path: '/learners/:id', element: <LearnerDetailPage /> },
      { path: '/schedule', element: <SchedulePage /> },
      { path: '/clinical', element: <ClinicalPage /> },
      { path: '/clinical/rotations/:id', element: <RotationDetailPage /> },
      { path: '/clinical/case-logs', element: <CaseLogsPage /> },
      { path: '/clinical/procedures', element: <ProceduresPage /> },
      { path: '/clinical/reviews', element: <ReviewsPage /> },
      { path: '/competencies', element: <CompetenciesPage /> },
      { path: '/competencies/matrix', element: <MatrixPage /> },
      { path: '/attendance', element: <AttendancePage /> },
      { path: '/attendance/register', element: <RegisterPage /> },
      { path: '/eligibility', element: <EligibilityPage /> },
      { path: '/assessments', element: <AssessmentsPage /> },
      { path: '/assessments/osce', element: <OSCEPage /> },
      { path: '/assessments/results', element: <ResultsPage /> },
      { path: '/compliance', element: <CompliancePage /> },
      { path: '/compliance/:id', element: <ComplianceDetailPage /> },
      { path: '/reports', element: <ReportsPage /> },
      { path: '/administration', element: <AdministrationPage /> },
      { path: '/administration/audit', element: <AuditLogPage /> },
      { path: '/design-tokens', element: <DesignTokensPage /> },
      { path: '/sitemap', element: <SitemapPage /> },
      { path: '/mobile/learner', element: <LearnerMobilePage /> },
      { path: '/mobile/faculty', element: <FacultyMobilePage /> },
    ],
  },
  { path: '*', element: <NotFound /> },
];

export default routes;
