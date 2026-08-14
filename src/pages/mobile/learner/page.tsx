import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import StatusBadge from '@/components/base/StatusBadge';
import ProgressBar from '@/components/base/ProgressBar';
import { useAppData } from '@/context/AppDataContext';
import { useRole } from '@/context/RoleContext';
import { OLIVIA_PHOTO } from '@/utils/dataset';

const SCREENS = ['Home', 'Schedule', 'Case Log', 'Competencies', 'Attendance', 'Results', 'Notifications', 'Profile'];

const ICONS: Record<string, string> = {
  Home: 'ri-home-5-line',
  Schedule: 'ri-calendar-2-line',
  'Case Log': 'ri-file-list-3-line',
  Competencies: 'ri-checkbox-multiple-line',
  Attendance: 'ri-calendar-check-line',
  Results: 'ri-bar-chart-box-line',
  Notifications: 'ri-notification-3-line',
  Profile: 'ri-user-3-line',
};

export default function LearnerMobilePage() {
  const navigate = useNavigate();
  const { learners, caseLogs } = useAppData();
  const { currentRole } = useRole();
  const [screen, setScreen] = useState('Home');
  const olivia = learners.find((l) => l.id === 'MED-2026-0147');
  const myLogs = caseLogs.filter((c) => c.learnerId === 'MED-2026-0147');

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Mobile Experience' }, { label: 'Learner App' }]}
        title="Learner Mobile App"
        subtitle="MedCampus 360 learner experience · Olivia Carter · MD Class of 2028"
        actions={<button onClick={() => navigate('/overview')} className="h-10 px-4 text-sm font-medium bg-navy-900 text-white hover:bg-navy-800 rounded-md whitespace-nowrap">Back to Platform</button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible">
          {SCREENS.map((s) => (
            <button key={s} onClick={() => setScreen(s)} className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-md text-[13px] font-medium whitespace-nowrap transition-colors ${screen === s ? 'bg-navy-900 text-white' : 'text-ink-600 hover:bg-canvas-200'}`}>
              <i className={`${ICONS[s]} text-base`} /> {s}
            </button>
          ))}
        </div>

        {/* Phone frame */}
        <div className="flex justify-center">
          <div className="w-[380px] rounded-[36px] border-[10px] border-ink-950 bg-canvas-50 overflow-hidden shadow-pop">
            <div className="bg-white px-5 pt-3 pb-2 flex items-center justify-between text-[11px] text-ink-600 border-b border-line-100">
              <span>9:41</span>
              <span className="w-20 h-4 bg-ink-950 rounded-full" />
              <span className="flex items-center gap-1.5"><i className="ri-signal-wifi-3-line" /><i className="ri-wifi-line" /><i className="ri-battery-fill" /></span>
            </div>
            <div className="h-[600px] overflow-y-auto">
              <MobileScreen screen={screen} olivia={olivia} myLogs={myLogs} onSwitch={setScreen} currentRole={currentRole?.personaName || 'Learner'} />
            </div>
            <div className="bg-white border-t border-line-100 px-3 py-2 flex items-center justify-between">
              {SCREENS.slice(0, 5).map((s) => (
                <button key={s} onClick={() => setScreen(s)} className={`flex flex-col items-center gap-0.5 text-[9px] font-medium ${screen === s ? 'text-clinic-700' : 'text-ink-400'}`}>
                  <i className={`${ICONS[s]} text-lg`} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileScreen({ screen, olivia, myLogs, onSwitch, currentRole }: { screen: string; olivia: ReturnType<typeof useAppData>['learners'][number] | undefined; myLogs: ReturnType<typeof useAppData>['caseLogs']; onSwitch: (s: string) => void; currentRole: string }) {
  if (screen === 'Home') {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <img src={olivia?.photo || OLIVIA_PHOTO} alt="Olivia Carter" className="w-12 h-12 rounded-full object-cover object-top border border-line-200" />
          <div>
            <p className="text-[15px] font-semibold text-ink-900">Olivia Carter</p>
            <p className="text-[11px] text-ink-500">MD Candidate · Class of 2028</p>
          </div>
        </div>
        <div className="bg-navy-900 text-white rounded-2xl p-4">
          <p className="text-[11px] text-navy-300">Today · 08/13/2026</p>
          <p className="text-base font-semibold mt-1">Internal Medicine Ward Rounds</p>
          <p className="text-xs text-navy-300 mt-1">7:00 AM – 9:00 AM · Ward 5 North</p>
          <div className="flex items-center gap-2 mt-3 text-[11px]"><i className="ri-map-pin-line" /> Harborview Community Hospital</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Clinical attendance', '82%', 'below'],
            ['Competency progress', '76%', 'amber'],
            ['Case logs submitted', String(myLogs.length), 'ok'],
            ['Sessions this week', '9', 'ok'],
          ].map(([k, v, tone]) => (
            <div key={k} className="bg-white border border-line-200 rounded-xl p-3">
              <p className={`text-lg font-semibold ${tone === 'below' ? 'text-red-600' : tone === 'amber' ? 'text-amber-600' : 'text-ink-900'}`}>{v}</p>
              <p className="text-[11px] text-ink-500 mt-0.5">{k}</p>
            </div>
          ))}
        </div>
        <div className="bg-white border border-line-200 rounded-xl p-3.5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-semibold text-ink-900">Intervention plan</p>
            <StatusBadge status="Active" tone="red" />
          </div>
          <p className="text-[11px] text-ink-500">Attendance improvement plan in progress. Advisor: Dr. James Whitfield.</p>
        </div>
        <div className="bg-white border border-line-200 rounded-xl p-3.5">
          <p className="text-[13px] font-semibold text-ink-900 mb-2">Quick actions</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: 'ri-file-list-3-line', label: 'New case log', target: 'Case Log' },
              { icon: 'ri-syringe-line', label: 'Log procedure', target: 'Case Log' },
              { icon: 'ri-calendar-check-line', label: 'Attendance', target: 'Attendance' },
              { icon: 'ri-checkbox-multiple-line', label: 'Competencies', target: 'Competencies' },
              { icon: 'ri-bar-chart-box-line', label: 'Results', target: 'Results' },
              { icon: 'ri-notification-3-line', label: 'Alerts', target: 'Notifications' },
            ].map((a) => (
              <button key={a.label} onClick={() => onSwitch(a.target)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-canvas-100 hover:bg-canvas-200 transition-colors">
                <i className={`${a.icon} text-lg text-clinic-700`} />
                <span className="text-[10px] text-ink-600 text-center">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (screen === 'Schedule') {
    return (
      <div className="p-4 space-y-3">
        <p className="text-sm font-semibold text-ink-900">Today's Schedule</p>
        {[
          { t: '7:00 AM', title: 'Internal Medicine Ward Rounds', loc: 'Ward 5 North' },
          { t: '10:00 AM', title: 'Clinical Skills: IV Cannulation', loc: 'Skills Lab A' },
          { t: '12:00 PM', title: 'Case Conference: Infectious Disease', loc: 'Conf Room' },
          { t: '3:30 PM', title: 'Faculty Review: Midpoint', loc: 'Clerkship Conf Room' },
        ].map((e) => (
          <div key={e.title} className="bg-white border border-line-200 rounded-xl p-3.5 flex gap-3">
            <span className="text-[11px] font-semibold text-clinic-700 w-14 shrink-0 pt-0.5">{e.t}</span>
            <div>
              <p className="text-[13px] font-medium text-ink-900">{e.title}</p>
              <p className="text-[11px] text-ink-400 mt-0.5">{e.loc}</p>
            </div>
          </div>
        ))}
        <button onClick={() => onSwitch('Schedule')} className="w-full py-2.5 text-center text-xs font-medium text-clinic-700 bg-clinic-50 border border-clinic-200 rounded-xl">View full week</button>
      </div>
    );
  }
  if (screen === 'Case Log') {
    return (
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-ink-900">Clinical Case Log</p>
          <span className="text-xs text-ink-500">{myLogs.length} logs</span>
        </div>
        {myLogs.map((l) => (
          <div key={l.id} className="bg-white border border-line-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-navy-800">{l.id}</p>
              <StatusBadge status={l.status} />
            </div>
            <p className="text-[11px] text-ink-500 mt-1">{l.category} · {l.setting} · {l.encounterDate}</p>
            <p className="text-[11px] text-ink-600 mt-1.5 line-clamp-2">{l.summary}</p>
            {l.status === 'Revision Requested' && (
              <button onClick={() => onSwitch('Case Log')} className="mt-2 w-full py-2 text-center text-xs font-semibold text-white bg-navy-900 rounded-lg">Update Reflection & Resubmit</button>
            )}
          </div>
        ))}
        <button onClick={() => onSwitch('Case Log')} className="w-full py-3 text-center text-sm font-semibold text-white bg-clinic-700 rounded-xl">+ New Case Log</button>
      </div>
    );
  }
  if (screen === 'Competencies') {
    return (
      <div className="p-4 space-y-4">
        <div className="bg-white border border-line-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-semibold text-ink-900">Overall competency completion</p>
            <span className="text-base font-bold text-ink-900">{olivia?.competencyProgress || 76}%</span>
          </div>
          <ProgressBar value={olivia?.competencyProgress || 76} tone="teal" height={8} />
          <p className="text-[11px] text-ink-400 mt-2">{olivia?.competencyAchieved || 73}/96 competencies credited</p>
        </div>
        {[
          { d: 'Patient Care', pct: 68, tone: 'amber' as const },
          { d: 'Medical Knowledge', pct: 82, tone: 'green' as const },
          { d: 'Clinical Skills', pct: 61, tone: 'amber' as const },
          { d: 'Entrustable Activities', pct: 58, tone: 'red' as const },
          { d: 'Professionalism', pct: 91, tone: 'green' as const },
        ].map((c) => (
          <div key={c.d} className="bg-white border border-line-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[13px] font-medium text-ink-900">{c.d}</p>
              <span className="text-xs font-semibold text-ink-600">{c.pct}%</span>
            </div>
            <ProgressBar value={c.pct} tone={c.tone} height={5} />
          </div>
        ))}
      </div>
    );
  }
  if (screen === 'Attendance') {
    return (
      <div className="p-4 space-y-3">
        <p className="text-sm font-semibold text-ink-900">Attendance</p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-[13px] font-semibold text-red-700">Clinical attendance 82%</p>
          <p className="text-[11px] text-ink-600 mt-1">Below the 85% threshold. Your eligibility may be blocked for upcoming assessments.</p>
        </div>
        {[
          ['Theory', '88%', 'green'],
          ['Clinical', '82%', 'red'],
          ['Simulation & skills', '94%', 'green'],
          ['Overall', '82%', 'red'],
        ].map(([k, v, tone]) => (
          <div key={k} className="bg-white border border-line-200 rounded-xl p-3.5 flex items-center justify-between">
            <p className="text-[13px] text-ink-700">{k}</p>
            <span className={`text-sm font-semibold ${tone === 'red' ? 'text-red-600' : 'text-green-700'}`}>{v}</span>
          </div>
        ))}
        <div className="bg-white border border-line-200 rounded-xl p-3.5">
          <p className="text-[13px] font-medium text-ink-900 mb-1.5">Attendance exceptions</p>
          <p className="text-[11px] text-ink-500">EXC-2301 approved · EXC-2305 pending</p>
        </div>
      </div>
    );
  }
  if (screen === 'Results') {
    return (
      <div className="p-4 space-y-3">
        <p className="text-sm font-semibold text-ink-900">Assessment Results</p>
        {[
          { a: 'Clinical Reasoning Written Exam', s: 'Released', score: '78 · Meets benchmark' },
          { a: 'Foundations Written Examination', s: 'Released', score: '81 · Exceeds benchmark' },
          { a: 'OSCE Clinical Skills (Fall)', s: 'Awaiting Release', score: '—' },
          { a: 'Rotation Evaluation - Internal Medicine', s: 'Pending', score: 'Due 09/05/2026' },
        ].map((r) => (
          <div key={r.a} className="bg-white border border-line-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-ink-900">{r.a}</p>
              <StatusBadge status={r.s} />
            </div>
            <p className="text-[11px] text-ink-500 mt-1">{r.score}</p>
          </div>
        ))}
        <div className="flex items-center gap-2 text-[11px] text-ink-500 bg-canvas-100 border border-line-200 rounded-xl p-3">
          <i className="ri-lock-line text-clinic-700" /> Results are released only after institutional dual confirmation.
        </div>
      </div>
    );
  }
  if (screen === 'Notifications') {
    return (
      <div className="p-4 space-y-3">
        <p className="text-sm font-semibold text-ink-900">Notifications</p>
        {[
          { t: 'Attendance threshold alert', d: 'Your clinical attendance is below 85%', tone: 'red', time: '2 hr' },
          { t: 'Case log submitted', d: 'IM-CASE-1047 is under faculty review', tone: 'amber', time: '5 hr' },
          { t: 'Remediation plan updated', d: 'Dr. James Whitfield added a weekly check-in', tone: 'blue', time: '1 d' },
          { t: 'OSCE scheduled', d: 'Fall OSCE - 08/14/2026, arrive 7:30 AM', tone: 'navy', time: '2 d' },
        ].map((n) => (
          <div key={n.t} className="bg-white border border-line-200 rounded-xl p-3.5 flex gap-3">
            <span className={`mt-1.5 w-2 h-2 rounded-full ${n.tone === 'red' ? 'bg-red-600' : n.tone === 'amber' ? 'bg-amber-500' : n.tone === 'blue' ? 'bg-clinic-600' : 'bg-navy-700'}`} />
            <div>
              <p className="text-[13px] font-medium text-ink-900">{n.t}</p>
              <p className="text-[11px] text-ink-500 mt-0.5">{n.d}</p>
              <p className="text-[10px] text-ink-400 mt-0.5">{n.time} ago</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col items-center bg-white border border-line-200 rounded-xl p-5">
        <img src={olivia?.photo || OLIVIA_PHOTO} alt="Olivia Carter" className="w-20 h-20 rounded-full object-cover object-top border border-line-200" />
        <p className="text-[15px] font-semibold text-ink-900 mt-3">{currentRole}</p>
        <p className="text-[11px] text-ink-500">MED-2026-0147 · Doctor of Medicine</p>
        <div className="flex items-center gap-1.5 mt-2"><StatusBadge status="Intervention Required" tone="red" /><StatusBadge status="Class of 2028" tone="neutral" /></div>
      </div>
      <div className="bg-white border border-line-200 rounded-xl divide-y divide-line-50">
        {[
          ['Email', 'o.carter@northbridge.edu'],
          ['Phone', '(617) 555-0187'],
          ['Advisor', 'Dr. James Whitfield'],
          ['Preceptor', 'Dr. Emily Chen'],
          ['Emergency contact', 'Daniel Carter · (617) 555-0193'],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-3">
            <span className="text-[11px] text-ink-500">{k}</span>
            <span className="text-[12px] font-medium text-ink-800 text-right">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}