import { NavLink, useLocation } from 'react-router-dom';
import { useRole } from '@/context/RoleContext';

interface NavItem {
  key: string;
  label: string;
  icon: string;
  path: string;
  module: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ key: 'overview', label: 'Executive Overview', icon: 'ri-dashboard-3-line', path: '/overview', module: 'overview' }],
  },
  {
    label: 'Learners',
    items: [{ key: 'learners', label: 'Learner Directory', icon: 'ri-team-line', path: '/learners', module: 'learners' }],
  },
  {
    label: 'Academic Schedule',
    items: [{ key: 'schedule', label: 'Academic Schedule', icon: 'ri-calendar-2-line', path: '/schedule', module: 'schedule' }],
  },
  {
    label: 'Clinical Education',
    items: [
      { key: 'clinical', label: 'Clinical Dashboard', icon: 'ri-stethoscope-line', path: '/clinical', module: 'clinical' },
      { key: 'case-logs', label: 'Case Logs', icon: 'ri-file-list-3-line', path: '/clinical/case-logs', module: 'clinical' },
      { key: 'procedures', label: 'Procedure Log', icon: 'ri-syringe-line', path: '/clinical/procedures', module: 'clinical' },
      { key: 'reviews', label: 'Faculty Reviews', icon: 'ri-chat-check-line', path: '/clinical/reviews', module: 'clinical' },
    ],
  },
  {
    label: 'Competencies',
    items: [
      { key: 'competencies', label: 'Competency Dashboard', icon: 'ri-checkbox-multiple-line', path: '/competencies', module: 'competencies' },
      { key: 'matrix', label: 'Competency Matrix', icon: 'ri-grid-line', path: '/competencies/matrix', module: 'competencies' },
    ],
  },
  {
    label: 'Attendance',
    items: [
      { key: 'attendance', label: 'Attendance Dashboard', icon: 'ri-calendar-check-line', path: '/attendance', module: 'attendance' },
      { key: 'register', label: 'Attendance Register', icon: 'ri-clipboard-line', path: '/attendance/register', module: 'attendance' },
      { key: 'eligibility', label: 'Eligibility Review', icon: 'ri-user-star-line', path: '/eligibility', module: 'attendance' },
    ],
  },
  {
    label: 'Assessments',
    items: [
      { key: 'assessments', label: 'Assessment Dashboard', icon: 'ri-bar-chart-box-line', path: '/assessments', module: 'assessments' },
      { key: 'osce', label: 'OSCE Evaluations', icon: 'ri-user-3-line', path: '/assessments/osce', module: 'assessments' },
      { key: 'results', label: 'Results Approval', icon: 'ri-check-double-line', path: '/assessments/results', module: 'assessments' },
    ],
  },
  {
    label: 'Compliance',
    items: [{ key: 'compliance', label: 'Compliance Readiness', icon: 'ri-shield-check-line', path: '/compliance', module: 'compliance' }],
  },
  {
    label: 'Reports',
    items: [{ key: 'reports', label: 'Report Catalogue', icon: 'ri-file-chart-line', path: '/reports', module: 'reports' }],
  },
  {
    label: 'Administration',
    items: [
      { key: 'admin', label: 'Administration', icon: 'ri-settings-3-line', path: '/administration', module: 'admin' },
      { key: 'audit', label: 'Audit Log', icon: 'ri-file-search-line', path: '/administration/audit', module: 'admin' },
    ],
  },
  {
    label: 'Mobile Experience',
    items: [
      { key: 'mlearner', label: 'Learner App', icon: 'ri-smartphone-line', path: '/mobile/learner', module: 'mobile' },
      { key: 'mfaculty', label: 'Faculty App', icon: 'ri-smartphone-line', path: '/mobile/faculty', module: 'mobile' },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const { canAccessModule, currentRole } = useRole();
  const location = useLocation();

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-navy-950 text-white flex flex-col transition-all duration-200 z-50 ${collapsed ? 'w-[64px]' : 'w-[260px]'}`}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-navy-800/70 flex-shrink-0">
        <span className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0">
          <i className="ri-hospital-line text-white text-lg" />
        </span>
        {!collapsed && (
          <div className="overflow-hidden min-w-0">
            <h1 className="text-sm font-semibold text-white whitespace-nowrap">MedCampus 360</h1>
            <p className="text-[10px] text-navy-300 whitespace-nowrap truncate">Northbridge University SOM</p>
          </div>
        )}
      </div>

      {/* Current role */}
      {currentRole && !collapsed && (
        <div className="px-4 py-3 border-b border-navy-800/70">
          <p className="text-[10px] uppercase tracking-wider text-navy-400 mb-1.5">Signed in as</p>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-clinic-700 flex items-center justify-center flex-shrink-0">
              <i className={`${currentRole.icon} text-white text-xs`} />
            </span>
            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-medium text-white truncate">{currentRole.personaName}</p>
              <p className="text-[10px] text-navy-300 truncate">{currentRole.personaTitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV_GROUPS.map((group) => {
          const visible = group.items.filter((item) => canAccessModule(item.module));
          if (visible.length === 0) return null;
          return (
            <div key={group.label} className="mb-4">
              {!collapsed && <p className="px-2 mb-1 text-[10px] font-semibold uppercase tracking-wider text-navy-400">{group.label}</p>}
              {visible.map((item) => {
                const active = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                return (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-2.5 py-2 my-0.5 rounded-md text-[13px] transition-colors ${
                      active ? 'bg-teal-600/15 text-teal-300 font-medium' : 'text-navy-200 hover:bg-navy-900 hover:text-white'
                    }`}
                  >
                    <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <i className={`${item.icon} text-[15px]`} />
                    </span>
                    {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Collapse */}
      <button
        onClick={() => onCollapse(!collapsed)}
        className="flex items-center justify-center h-11 border-t border-navy-800/70 text-navy-300 hover:text-white transition-colors"
        aria-label="Toggle sidebar"
      >
        <span className="w-5 h-5 flex items-center justify-center">
          <i className={`${collapsed ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'} text-lg`} />
        </span>
      </button>
    </aside>
  );
}