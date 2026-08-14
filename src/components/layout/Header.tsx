import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/context/RoleContext';
import { useAppData } from '@/context/AppDataContext';
import { useToast } from '@/context/ToastContext';
import { ROLES } from '@/mocks/users';
import { ACADEMIC_YEARS, PROGRAMS } from '@/mocks/institution';
import { INSTITUTION } from '@/mocks/institution';
import Avatar from '@/components/base/Avatar';
import { toneFor } from '@/components/base/StatusBadge';
import ConfirmDialog from '@/components/base/ConfirmDialog';

export default function Header() {
  const { currentRole, setRole, logout } = useRole();
  const { learners, notifications, markAllNotificationsRead, getLearnerById, resetAllData } = useAppData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [academicYear, setAcademicYear] = useState(INSTITUTION.academicYear);
  const [program, setProgram] = useState('All Programs');
  const searchRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return learners
      .filter((l) => l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q))
      .slice(0, 8);
  }, [search, learners]);

  const unread = notifications.filter((n) => !n.read).length;

  const roleMenuItems = useMemo(
    () => (currentRole ? ROLE_MENU_ITEMS.filter((m) => currentRole.modules.includes(m.module)) : []),
    [currentRole]
  );

  const switchRole = (roleId: string) => {
    setRole(roleId);
    setShowRoleMenu(false);
    const target = roleId === 'learner' ? '/learners/MED-2026-0147' : roleId === 'faculty' ? '/clinical/reviews' : roleId === 'compliance' ? '/compliance' : '/overview';
    toast(`Signed in as ${getRoleLabel(roleId)}`);
    navigate(target);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openLearner = (id: string) => {
    setSearch('');
    setShowSearch(false);
    navigate(`/learners/${id}`);
  };

  return (
    <header className="h-16 bg-white border-b border-line-200 flex items-center gap-4 px-5 sticky top-0 z-40">
      {/* Global learner search */}
      <div className="relative flex-1 max-w-md" ref={searchRef}>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-ink-400">
            <i className="ri-search-line text-sm" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSearch(true);
            }}
            onFocus={() => setShowSearch(true)}
            placeholder="Search learners by name or ID..."
            className="w-full h-10 pl-9 pr-3 text-sm bg-canvas-100 border border-line-200 rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-500 focus:bg-white"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-ink-400 hover:text-ink-600" aria-label="Clear search">
              <i className="ri-close-circle-line" />
            </button>
          )}
        </div>
        {showSearch && search.trim() && (
          <div className="absolute left-0 right-0 top-12 bg-white border border-line-200 rounded-lg shadow-pop z-50 overflow-hidden">
            <div className="px-4 py-2 border-b border-line-100 text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Learners</div>
            <div className="max-h-80 overflow-y-auto">
              {results.map((l) => (
                <button key={l.id} onClick={() => openLearner(l.id)} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-canvas-50 text-left transition-colors">
                  <Avatar name={l.name} photo={l.photo} size={30} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">{l.name}</p>
                    <p className="text-[11px] text-ink-400 truncate">{l.id} · {l.program} · {l.cohort}</p>
                  </div>
                  <i className="ri-arrow-right-s-line text-ink-300" />
                </button>
              ))}
              {results.length === 0 && <div className="px-4 py-8 text-center text-sm text-ink-400">No learners match &ldquo;{search}&rdquo;</div>}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Academic year selector */}
      <select
        value={academicYear}
        onChange={(e) => setAcademicYear(e.target.value)}
        className="h-10 px-3 text-[13px] font-medium border border-line-200 rounded-md bg-white text-ink-700 focus:outline-none focus:ring-2 focus:ring-clinic-500 cursor-pointer"
        aria-label="Academic year"
      >
        {ACADEMIC_YEARS.map((y) => (
          <option key={y}>{y}</option>
        ))}
      </select>

      {/* Program selector */}
      <select
        value={program}
        onChange={(e) => setProgram(e.target.value)}
        className="h-10 px-3 text-[13px] font-medium border border-line-200 rounded-md bg-white text-ink-700 focus:outline-none focus:ring-2 focus:ring-clinic-500 cursor-pointer hidden lg:block"
        aria-label="Program"
      >
        <option>All Programs</option>
        {PROGRAMS.map((p) => (
          <option key={p.id}>{p.name}</option>
        ))}
      </select>

      {/* Help */}
      <div className="relative">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-canvas-100 text-ink-500 transition-colors"
          aria-label="Help"
        >
          <i className="ri-question-line text-lg" />
        </button>
        {showHelp && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowHelp(false)} />
            <div className="absolute right-0 top-12 w-64 bg-white border border-line-200 rounded-lg shadow-pop z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-line-100">
                <p className="text-sm font-semibold text-ink-900">Help Center</p>
                <p className="text-[11px] text-ink-400 mt-0.5">MedCampus 360 support resources</p>
              </div>
              <div className="py-1">
                {[
                  { icon: 'ri-book-open-line', label: 'Documentation' },
                  { icon: 'ri-graduation-cap-line', label: 'Learner guide' },
                  { icon: 'ri-video-line', label: 'Video tutorials' },
                  { icon: 'ri-mail-send-line', label: 'Contact support' },
                  { icon: 'ri-keyboard-line', label: 'Keyboard shortcuts' },
                ].map((h) => (
                  <button
                    key={h.label}
                    onClick={() => {
                      setShowHelp(false);
                      toast(`${h.label} - opening help resource`);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-ink-700 hover:bg-canvas-50 transition-colors"
                  >
                    <i className={`${h.icon} text-ink-400`} />
                    {h.label}
                  </button>
                ))}
              </div>
              <div className="border-t border-line-100 py-1">
                <button
                  onClick={() => {
                    setShowHelp(false);
                    setShowReset(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <i className="ri-refresh-line text-ink-400" />
                  Reset presentation data
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => {
            setShowNotif(!showNotif);
            if (!showNotif) markAllNotificationsRead();
          }}
          className="relative w-10 h-10 flex items-center justify-center rounded-md hover:bg-canvas-100 text-ink-500 transition-colors"
          aria-label="Notifications"
        >
          <i className="ri-notification-3-line text-lg" />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>
        {showNotif && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
            <div className="absolute right-0 top-12 w-[340px] bg-white border border-line-200 rounded-lg shadow-pop z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-line-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-ink-900">Notifications</h3>
                <button
                  onClick={() => {
                    markAllNotificationsRead();
                    toast('All notifications marked as read');
                  }}
                  className="text-xs text-clinic-700 hover:text-clinic-800 font-medium"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => {
                  const tone = toneFor(n.type === 'critical' ? 'critical' : n.type === 'warning' ? 'warning' : n.type === 'success' ? 'success' : 'neutral');
                  return (
                    <button
                      key={n.id}
                      onClick={() => {
                        setShowNotif(false);
                        navigate(n.module === 'clinical' ? '/clinical/case-logs' : n.module === 'attendance' ? '/eligibility' : n.module === 'compliance' ? '/compliance' : n.module === 'assessments' ? '/assessments' : n.module === 'schedule' ? '/schedule' : '/overview');
                      }}
                      className={`w-full flex items-start gap-3 px-4 py-3 border-b border-line-50 hover:bg-canvas-50 text-left transition-colors ${!n.read ? 'bg-clinic-50/40' : ''}`}
                    >
                      <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${tone === 'green' ? 'bg-green-500' : tone === 'red' ? 'bg-red-600' : tone === 'amber' ? 'bg-amber-500' : 'bg-ink-400'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-900">{n.title}</p>
                        <p className="text-xs text-ink-500 mt-0.5">{n.description}</p>
                        <p className="text-[10px] text-ink-400 mt-1">{n.time}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Role switcher / profile */}
      <div className="relative">
        <button
          onClick={() => setShowRoleMenu(!showRoleMenu)}
          className="flex items-center gap-2.5 pl-1 pr-2.5 py-1 rounded-md hover:bg-canvas-100 transition-colors"
        >
          <Avatar name={currentRole?.personaName || 'Guest'} size={32} />
          <div className="hidden xl:block text-left">
            <p className="text-[13px] font-medium text-ink-900 leading-tight">{currentRole?.personaName || 'Guest'}</p>
            <p className="text-[11px] text-ink-500 leading-tight">{currentRole?.label || ''}</p>
          </div>
          <span className="w-4 h-4 flex items-center justify-center text-ink-400">
            <i className="ri-arrow-down-s-line" />
          </span>
        </button>
        {showRoleMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowRoleMenu(false)} />
            <div className="absolute right-0 top-12 w-[340px] bg-white border border-line-200 rounded-lg shadow-pop z-50 overflow-hidden">
              {/* Current role header */}
              <div className="px-4 py-3 border-b border-line-100 flex items-center gap-3">
                <Avatar name={currentRole?.personaName || 'Guest'} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink-900 truncate">{currentRole?.personaName || 'Guest'}</p>
                  <p className="text-[11px] text-ink-500 truncate">{currentRole?.label} · {currentRole?.personaTitle}</p>
                </div>
              </div>

              {/* Role menu showcase */}
              <div className="px-3 py-3 border-b border-line-100">
                <div className="flex items-center justify-between px-1 mb-2">
                  <p className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Role menu</p>
                  <span className="text-[10px] font-semibold text-clinic-700 bg-clinic-50 border border-clinic-200 rounded-full px-2 py-0.5">
                    {currentRole?.modules.length || 0} modules
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {roleMenuItems.map((m) => (
                    <button
                      key={m.module}
                      onClick={() => {
                        setShowRoleMenu(false);
                        navigate(m.path);
                      }}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-md text-left bg-canvas-50 hover:bg-clinic-50 transition-colors"
                    >
                      <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-clinic-700">
                        <i className={`${m.icon} text-sm`} />
                      </span>
                      <span className="text-xs font-medium text-ink-700 truncate">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Switch role */}
              <div>
                <p className="px-4 pt-3 text-xs font-semibold text-ink-500 uppercase tracking-wide">Switch Role</p>
                <p className="px-4 text-[11px] text-ink-400 mt-0.5">Presentation personas · each role sees its own module set</p>
                <div className="max-h-48 overflow-y-auto py-1">
                  {ROLES.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => switchRole(role.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${currentRole?.id === role.id ? 'bg-clinic-50' : 'hover:bg-canvas-50'}`}
                    >
                      <span className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${currentRole?.id === role.id ? 'bg-clinic-700 text-white' : 'bg-canvas-100 text-ink-500'}`}>
                        <i className={`${role.icon} text-sm`} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-ink-900">{role.label}</p>
                        <p className="text-[11px] text-ink-500 truncate">{role.personaName}</p>
                      </div>
                      {currentRole?.id === role.id && <i className="ri-check-line text-clinic-700" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-line-100 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-ink-500">
                  <i className="ri-shield-check-line text-green-600" />
                  HIPAA-aligned privacy controls
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  <i className="ri-logout-box-r-line" />
                  Sign out
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showReset && (
        <ConfirmDialog
          title="Reset presentation data"
          message="Clear all locally stored records (case logs, competency credits, evidence, audit entries, attendance exceptions, schedule changes) and reload a clean Academic Year 2026-27 dataset? Your current sign-in role is kept."
          confirmLabel="Reset Data"
          danger
          onConfirm={() => resetAllData()}
          onCancel={() => setShowReset(false)}
        />
      )}
    </header>
  );
}

function getRoleLabel(id: string) {
  return ROLES.find((r) => r.id === id)?.label || id;
}

const ROLE_MENU_ITEMS = [
  { module: 'overview', label: 'Executive Overview', icon: 'ri-dashboard-3-line', path: '/overview' },
  { module: 'learners', label: 'Learner Directory', icon: 'ri-team-line', path: '/learners' },
  { module: 'schedule', label: 'Academic Schedule', icon: 'ri-calendar-2-line', path: '/schedule' },
  { module: 'clinical', label: 'Clinical Education', icon: 'ri-stethoscope-line', path: '/clinical' },
  { module: 'competencies', label: 'Competencies', icon: 'ri-checkbox-multiple-line', path: '/competencies' },
  { module: 'attendance', label: 'Attendance & Eligibility', icon: 'ri-calendar-check-line', path: '/attendance' },
  { module: 'assessments', label: 'Assessments', icon: 'ri-bar-chart-box-line', path: '/assessments' },
  { module: 'compliance', label: 'Compliance', icon: 'ri-shield-check-line', path: '/compliance' },
  { module: 'reports', label: 'Reports', icon: 'ri-file-chart-line', path: '/reports' },
  { module: 'admin', label: 'Administration', icon: 'ri-settings-3-line', path: '/administration' },
  { module: 'mobile', label: 'Mobile Experience', icon: 'ri-smartphone-line', path: '/mobile/learner' },
];