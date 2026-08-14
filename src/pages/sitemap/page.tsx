import { Link } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';

const SITEMAP = [
  { group: 'Application Shell', icon: 'ri-layout-3-line', items: [{ label: 'Sign In (role selection)', path: '/login', desc: '6 presentation roles' }, { label: 'Design Tokens', path: '/design-tokens', desc: 'Palette, type, spacing' }] },
  { group: 'Overview', icon: 'ri-dashboard-3-line', items: [{ label: 'Executive Overview', path: '/overview', desc: 'Command centre with KPI drill-downs' }] },
  { group: 'Learners', icon: 'ri-team-line', items: [{ label: 'Learner Directory', path: '/learners', desc: 'Search, filter, sort, paginate' }, { label: 'Learner 360 Profile', path: '/learners/MED-2026-0147', desc: 'Olivia Carter - 8 profile tabs' }] },
  { group: 'Academic Schedule', icon: 'ri-calendar-2-line', items: [{ label: 'Academic Schedule', path: '/schedule', desc: 'Day / Week / Month + conflict panel' }] },
  { group: 'Clinical Education', icon: 'ri-stethoscope-line', items: [{ label: 'Clinical Dashboard', path: '/clinical', desc: 'Rotations, reviews, utilization' }, { label: 'Rotation Detail', path: '/clinical/rotations/rot-IM-3', desc: 'Internal Medicine Clerkship' }, { label: 'Case Logs', path: '/clinical/case-logs', desc: 'De-identified encounter records' }, { label: 'Procedure Log', path: '/clinical/procedures', desc: 'Performance + validation' }, { label: 'Faculty Reviews', path: '/clinical/reviews', desc: 'Review queue + assessment form' }] },
  { group: 'Competencies', icon: 'ri-checkbox-multiple-line', items: [{ label: 'Competency Dashboard', path: '/competencies', desc: '8 domains, 96 competencies' }, { label: 'Competency Matrix', path: '/competencies/matrix', desc: 'Live status by learner' }] },
  { group: 'Attendance & Eligibility', icon: 'ri-calendar-check-line', items: [{ label: 'Attendance Dashboard', path: '/attendance', desc: 'Trends, sources, exceptions' }, { label: 'Attendance Register', path: '/attendance/register', desc: 'Session records + exceptions' }, { label: 'Eligibility Review', path: '/eligibility', desc: 'Blocks and remediation' }] },
  { group: 'Assessments', icon: 'ri-bar-chart-box-line', items: [{ label: 'Assessment Dashboard', path: '/assessments', desc: '24 scheduled assessments' }, { label: 'OSCE Evaluations', path: '/assessments/osce', desc: '12 stations + evaluation form' }, { label: 'Results Approval', path: '/assessments/results', desc: 'Dual confirmation release' }] },
  { group: 'Compliance', icon: 'ri-shield-check-line', items: [{ label: 'Compliance Readiness', path: '/compliance', desc: 'Evidence status command centre' }, { label: 'Indicator Detail', path: '/compliance/CMP-001', desc: 'Evidence + approval history' }] },
  { group: 'Reports', icon: 'ri-file-chart-line', items: [{ label: 'Report Catalogue', path: '/reports', desc: '12 reports + export' }] },
  { group: 'Administration', icon: 'ri-settings-3-line', items: [{ label: 'Administration', path: '/administration', desc: 'Users, roles, sites, security' }, { label: 'Audit Log', path: '/administration/audit', desc: 'Immutable activity record' }] },
  { group: 'Mobile Experience', icon: 'ri-smartphone-line', items: [{ label: 'Learner App', path: '/mobile/learner', desc: '8 learner screens' }, { label: 'Faculty App', path: '/mobile/faculty', desc: '7 faculty screens' }] },
];

export default function SitemapPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Administration', path: '/administration' }, { label: 'Sitemap' }]}
        title="Complete Sitemap"
        subtitle="All modules and screens in MedCampus 360 · Northbridge University School of Medicine · AY 2026-27"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {SITEMAP.map((g) => (
          <Card key={g.group} bodyClass="p-4">
            <p className="text-sm font-semibold text-ink-900 flex items-center gap-2 mb-3"><i className={`${g.icon} text-clinic-700`} /> {g.group}</p>
            <div className="space-y-2">
              {g.items.map((it) => (
                <Link key={it.path} to={it.path} className="block border border-line-200 rounded-lg p-3 hover:border-navy-300 hover:bg-canvas-50 transition-colors">
                  <p className="text-[13px] font-medium text-clinic-700">{it.label}</p>
                  <p className="text-[11px] text-ink-400 mt-0.5">{it.desc}</p>
                  <p className="text-[10px] text-ink-300 mt-0.5 tabular-nums">{it.path}</p>
                </Link>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 bg-white border border-line-200 rounded-lg p-4 text-xs text-ink-500 flex items-center gap-2">
        <i className="ri-map-2-line text-clinic-700" />
        End-to-end presentation flow: Sign in as Dean → Executive Overview → Learners at Risk → Olivia Carter → Internal Medicine rotation → case log review → Faculty preceptor assessment (revision) → Learner resubmit → Faculty approve → Competency Matrix update → Eligibility block → Compliance evidence → Learner Progress Summary export.
      </div>
    </div>
  );
}