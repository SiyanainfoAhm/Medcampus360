import type { RouteObject } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import Home from '../pages/home/page';
import LoginPage from '../pages/login/page';
import AppLayout from '../components/layout/AppLayout';
import OverviewPage from '../pages/overview/page';
import LearnersPage from '../pages/learners/page';
import LearnerDetailPage from '../pages/learners/detail/page';
import SchedulePage from '../pages/schedule/page';
import ClinicalPage from '../pages/clinical/page';
import RotationDetailPage from '../pages/clinical/rotation-detail/page';
import CaseLogsPage from '../pages/clinical/case-logs/page';
import ProceduresPage from '../pages/clinical/procedures/page';
import ReviewsPage from '../pages/clinical/reviews/page';
import CompetenciesPage from '../pages/competencies/page';
import MatrixPage from '../pages/competencies/matrix/page';
import AttendancePage from '../pages/attendance/page';
import RegisterPage from '../pages/attendance/register/page';
import EligibilityPage from '../pages/eligibility/page';
import AssessmentsPage from '../pages/assessments/page';
import OSCEPage from '../pages/assessments/osce/page';
import ResultsPage from '../pages/assessments/results/page';
import CompliancePage from '../pages/compliance/page';
import ComplianceDetailPage from '../pages/compliance/detail/page';
import ReportsPage from '../pages/reports/page';
import AdministrationPage from '../pages/administration/page';
import AuditLogPage from '../pages/administration/audit/page';
import DesignTokensPage from '../pages/design-tokens/page';
import SitemapPage from '../pages/sitemap/page';
import LearnerMobilePage from '../pages/mobile/learner/page';
import FacultyMobilePage from '../pages/mobile/faculty/page';

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