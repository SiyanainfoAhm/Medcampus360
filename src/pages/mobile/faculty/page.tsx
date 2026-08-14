import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import StatusBadge from '@/components/base/StatusBadge';
import { useAppData } from '@/context/AppDataContext';

const SCREENS = ['Today', 'Learners', 'Reviews', 'Assess', 'Attendance', 'Notifications', 'Profile'];

const ICONS: Record<string, string> = {
  Today: 'ri-calendar-2-line',
  Learners: 'ri-team-line',
  Reviews: 'ri-chat-check-line',
  Assess: 'ri-checkbox-multiple-line',
  Attendance: 'ri-calendar-check-line',
  Notifications: 'ri-notification-3-line',
  Profile: 'ri-user-star-line',
};

export default function FacultyMobilePage() {
  const navigate = useNavigate();
  const { caseLogs, learners } = useAppData();
  const [screen, setScreen] = useState('Today');
  const pending = caseLogs.filter((c) => (c.status === 'Submitted' || c.status === 'Revision Requested') && c.preceptor === 'Dr. Emily Chen');
  const assigned = learners.filter((l) => l.preceptor === 'Dr. Emily Chen').slice(0, 6);

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Mobile Experience' }, { label: 'Faculty App' }]}
        title="Faculty Mobile App"
        subtitle="MedCampus 360 preceptor experience · Dr. Emily Chen · Faculty Preceptor, Internal Medicine"
        actions={<button onClick={() => navigate('/overview')} className="h-10 px-4 text-sm font-medium bg-navy-900 text-white hover:bg-navy-800 rounded-md whitespace-nowrap">Back to Platform</button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible">
          {SCREENS.map((s) => (
            <button key={s} onClick={() => setScreen(s)} className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-md text-[13px] font-medium whitespace-nowrap transition-colors ${screen === s ? 'bg-navy-900 text-white' : 'text-ink-600 hover:bg-canvas-200'}`}>
              <i className={`${ICONS[s]} text-base`} /> {s}
              {s === 'Reviews' && pending.length > 0 && <span className="bg-red-600 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5">{pending.length}</span>}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <div className="w-[380px] rounded-[36px] border-[10px] border-ink-950 bg-canvas-50 overflow-hidden shadow-pop">
            <div className="bg-white px-5 pt-3 pb-2 flex items-center justify-between text-[11px] text-ink-600 border-b border-line-100">
              <span>9:41</span>
              <span className="w-20 h-4 bg-ink-950 rounded-full" />
              <span className="flex items-center gap-1.5"><i className="ri-signal-wifi-3-line" /><i className="ri-wifi-line" /><i className="ri-battery-fill" /></span>
            </div>
            <div className="h-[600px] overflow-y-auto">
              <FacultyScreen screen={screen} pending={pending} assigned={assigned} onSwitch={setScreen} />
            </div>
            <div className="bg-white border-t border-line-100 px-3 py-2 flex items-center justify-between">
              {SCREENS.slice(0, 5).map((s) => (
                <button key={s} onClick={() => setScreen(s)} className={`relative flex flex-col items-center gap-0.5 text-[9px] font-medium ${screen === s ? 'text-clinic-700' : 'text-ink-400'}`}>
                  <i className={`${ICONS[s]} text-lg`} />
                  {s}
                  {s === 'Reviews' && pending.length > 0 && <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[8px] font-bold rounded-full px-1">{pending.length}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FacultyScreen({ screen, pending, assigned, onSwitch }: { screen: string; pending: ReturnType<typeof useAppData>['caseLogs']; assigned: ReturnType<typeof useAppData>['learners']; onSwitch: (s: string) => void }) {
  if (screen === 'Today') {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-full bg-clinic-700 text-white flex items-center justify-center text-sm font-bold">EC</span>
          <div>
            <p className="text-[15px] font-semibold text-ink-900">Dr. Emily Chen</p>
            <p className="text-[11px] text-ink-500">Faculty Preceptor · Internal Medicine</p>
          </div>
        </div>
        <div className="bg-navy-900 text-white rounded-2xl p-4">
          <p className="text-[11px] text-navy-300">Today · 08/13/2026</p>
          <p className="text-base font-semibold mt-1">IM Ward Rounds · 7:00 AM</p>
          <p className="text-xs text-navy-300 mt-1">Ward 5 North · 12 learners</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Pending reviews', String(pending.length), 'amber'],
            ['Assigned learners', String(assigned.length), 'navy'],
            ['Validations due', '4', 'amber'],
            ['Midpoint evals', '2', 'blue'],
          ].map(([k, v, tone]) => (
            <div key={k} className="bg-white border border-line-200 rounded-xl p-3">
              <p className={`text-lg font-semibold ${tone === 'amber' ? 'text-amber-600' : tone === 'navy' ? 'text-navy-900' : 'text-clinic-700'}`}>{v}</p>
              <p className="text-[11px] text-ink-500 mt-0.5">{k}</p>
            </div>
          ))}
        </div>
        <div className="bg-white border border-line-200 rounded-xl p-3.5">
          <p className="text-[13px] font-semibold text-ink-900 mb-2">Next sessions</p>
          <div className="space-y-2">
            {['7:00 AM · IM Ward Rounds · Ward 5 North', '12:00 PM · Case Conference · Conf Room', '3:30 PM · Faculty Review · Clerkship Conf'].map((s) => (
              <p key={s} className="text-[11px] text-ink-600 flex items-center gap-2"><i className="ri-time-line text-clinic-700" />{s}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (screen === 'Learners') {
    return (
      <div className="p-4 space-y-3">
        <p className="text-sm font-semibold text-ink-900">Assigned Learners</p>
        {assigned.map((l) => (
          <button key={l.id} onClick={() => onSwitch('Assess')} className="w-full bg-white border border-line-200 rounded-xl p-3.5 flex items-center gap-3 text-left">
            <span className="w-9 h-9 rounded-full bg-clinic-50 text-clinic-700 flex items-center justify-center text-xs font-bold">{l.name.split(' ').map((p) => p[0]).join('')}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-ink-900 truncate">{l.name}</p>
              <p className="text-[11px] text-ink-400">{l.id} · {l.currentRotation || 'Foundations'}</p>
            </div>
            <StatusBadge status={l.standing} tone={l.risk ? 'red' : 'green'} />
          </button>
        ))}
      </div>
    );
  }
  if (screen === 'Reviews') {
    return (
      <div className="p-4 space-y-3">
        <p className="text-sm font-semibold text-ink-900">Pending Case-Log Reviews</p>
        {pending.map((c) => (
          <button key={c.id} onClick={() => onSwitch('Assess')} className="w-full bg-white border border-line-200 rounded-xl p-3.5 text-left">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-navy-800">{c.id}</p>
              <StatusBadge status={c.status} />
            </div>
            <p className="text-[13px] text-ink-800 mt-1">{c.learnerName}</p>
            <p className="text-[11px] text-ink-500 mt-0.5">{c.category} · {c.encounterDate}</p>
            <p className="text-[11px] text-ink-600 mt-1 line-clamp-2">{c.summary}</p>
            <div className="mt-2.5 flex gap-2">
              <span className="flex-1 py-2 text-center text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-300 rounded-lg">Request revision</span>
              <span className="flex-1 py-2 text-center text-xs font-semibold text-white bg-navy-900 rounded-lg">Approve</span>
            </div>
          </button>
        ))}
        {pending.length === 0 && <p className="text-sm text-ink-400 text-center py-8">No pending reviews.</p>}
      </div>
    );
  }
  if (screen === 'Assess') {
    return (
      <div className="p-4 space-y-4">
        <p className="text-sm font-semibold text-ink-900">Competency Assessment</p>
        <div className="bg-white border border-line-200 rounded-xl p-4">
          <p className="text-[13px] font-medium text-ink-900">EPA-01 · Gather history and perform exam</p>
          <p className="text-[11px] text-ink-500 mt-0.5">Olivia Carter · MED-2026-0147</p>
          <div className="mt-3 space-y-2">
            {[
              ['Level 1', 'Observation only'],
              ['Level 2', 'Direct supervision'],
              ['Level 3', 'Indirect - immediately available'],
              ['Level 4', 'Indirect - preceptor on site'],
              ['Level 5', 'Entrusted without supervision'],
            ].map(([l, d], i) => (
              <label key={l} className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer ${i === 2 ? 'border-clinic-400 bg-clinic-50' : 'border-line-200'}`}>
                <input type="radio" defaultChecked={i === 2} className="accent-clinic-700" />
                <span className="text-[12px] text-ink-700"><span className="font-semibold">{l}</span> · {d}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="bg-white border border-line-200 rounded-xl p-3.5">
          <p className="text-[13px] font-medium text-ink-900 mb-2">Strengths & improvement areas</p>
          <textarea className="w-full h-20 px-3 py-2 text-sm border border-line-200 rounded-lg" maxLength={500} placeholder="Behavioral anchors observed..." />
        </div>
        <button onClick={() => onSwitch('Reviews')} className="w-full py-3 text-center text-sm font-semibold text-white bg-navy-900 rounded-xl">Submit Assessment</button>
      </div>
    );
  }
  if (screen === 'Attendance') {
    return (
      <div className="p-4 space-y-3">
        <p className="text-sm font-semibold text-ink-900">Attendance Validation</p>
        {[
          { l: 'Olivia Carter', s: 'Present · QR check-in', ok: true },
          { l: 'Sophia Williams', s: 'Late · badge/RFID', ok: true },
          { l: 'Liam Johnson', s: 'Absent · needs review', ok: false },
          { l: 'Maya Okafor', s: 'Excused · exception pending', ok: false },
        ].map((r) => (
          <div key={r.l} className="bg-white border border-line-200 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-ink-900">{r.l}</p>
              <p className="text-[11px] text-ink-500 mt-0.5">{r.s}</p>
            </div>
            <button className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${r.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
              {r.ok ? 'Validated' : 'Review'}
            </button>
          </div>
        ))}
      </div>
    );
  }
  if (screen === 'Notifications') {
    return (
      <div className="p-4 space-y-3">
        <p className="text-sm font-semibold text-ink-900">Notifications</p>
        {[
          { t: 'Case log awaiting review', d: 'IM-CASE-1047 · Olivia Carter', tone: 'amber' },
          { t: 'Midpoint evaluations due', d: '2 learners pending this week', tone: 'blue' },
          { t: 'Procedure validation', d: 'IV cannulation · 4 records', tone: 'amber' },
          { t: 'Rotation schedule updated', d: 'IM-3 ward rounds times changed', tone: 'navy' },
        ].map((n) => (
          <div key={n.t} className="bg-white border border-line-200 rounded-xl p-3.5 flex gap-3">
            <span className={`mt-1.5 w-2 h-2 rounded-full ${n.tone === 'amber' ? 'bg-amber-500' : n.tone === 'blue' ? 'bg-clinic-600' : 'bg-navy-700'}`} />
            <div>
              <p className="text-[13px] font-medium text-ink-900">{n.t}</p>
              <p className="text-[11px] text-ink-500 mt-0.5">{n.d}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col items-center bg-white border border-line-200 rounded-xl p-5">
        <span className="w-20 h-20 rounded-full bg-clinic-700 text-white flex items-center justify-center text-xl font-bold">EC</span>
        <p className="text-[15px] font-semibold text-ink-900 mt-3">Dr. Emily Chen</p>
        <p className="text-[11px] text-ink-500">Faculty Preceptor · Internal Medicine</p>
        <div className="flex items-center gap-1.5 mt-2"><StatusBadge status="Active" tone="green" /><StatusBadge status="NUMC" tone="neutral" /></div>
      </div>
      <div className="bg-white border border-line-200 rounded-xl divide-y divide-line-50">
        {[
          ['Department', 'Internal Medicine'],
          ['Clinical site', 'Harborview Community Hospital'],
          ['Specialty', 'General Internal Medicine'],
          ['Pending reviews', String(pending.length)],
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