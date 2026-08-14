import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import KpiCard from '@/components/base/KpiCard';
import StatusBadge from '@/components/base/StatusBadge';
import { TrendChart, DonutChart, CHART_COLORS } from '@/components/feature/Charts';
import { useAppData } from '@/context/AppDataContext';
import { ATTENDANCE_SOURCES, ATTENDANCE_THRESHOLD } from '@/mocks/attendance';

export default function AttendancePage() {
  const navigate = useNavigate();
  const { learners, attendanceRecords, exceptions, sessions } = useAppData();

  const overall = useMemo(() => (learners.length ? Math.round((learners.reduce((s, l) => s + l.attendanceOverall, 0) / learners.length) * 10) / 10 : 0), [learners]);
  const belowThreshold = useMemo(() => learners.filter((l) => l.attendanceOverall < ATTENDANCE_THRESHOLD).length, [learners]);
  const pendingExceptions = exceptions.filter((e) => e.status === 'Pending').length;

  const trend = useMemo(() => {
    const base = overall;
    const offs = [-0.8, -0.3, 0.4, 0.2, -0.5, 0.6, 0.1, 0.7, -0.2, 0.5, 0.3, 0];
    return offs.map((o, i) => ({ label: `W${i + 1}`, value: Math.round((base + o) * 10) / 10 }));
  }, [overall]);

  const sourceDist = useMemo(() => {
    const colors = ['#17324D', '#2563A6', '#148A8A', '#C58322'];
    return ATTENDANCE_SOURCES.map((s, i) => ({ name: s, value: attendanceRecords.filter((r) => r.source === s).length || 20 + i * 5, color: colors[i] }));
  }, [attendanceRecords]);

  const recentSessions = sessions.slice(-8).reverse();

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Attendance' }, { label: 'Attendance Dashboard' }]}
        title="Attendance & Eligibility"
        subtitle="Session attendance, exception workflow, and assessment eligibility across the learner population"
        actions={
          <>
            <button onClick={() => navigate('/attendance/register')} className="h-10 px-4 text-sm font-medium bg-white border border-line-200 text-ink-700 hover:bg-canvas-50 rounded-md whitespace-nowrap"><i className="ri-clipboard-line" /> Attendance Register</button>
            <button onClick={() => navigate('/eligibility')} className="h-10 px-4 text-sm font-medium bg-navy-900 text-white hover:bg-navy-800 rounded-md whitespace-nowrap"><i className="ri-user-star-line" /> Eligibility Review</button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard label="Overall Attendance" value={`${overall}%`} sub={`${ATTENDANCE_THRESHOLD}% threshold`} icon="ri-calendar-check-line" tone="green" onClick={() => navigate('/attendance/register')} />
        <KpiCard label="Theory Attendance" value="93.1%" sub="Lectures & seminars" icon="ri-book-line" tone="blue" onClick={() => navigate('/attendance/register')} />
        <KpiCard label="Simulation Attendance" value="95.4%" sub="Simulation sessions" icon="ri-flask-line" tone="teal" onClick={() => navigate('/attendance/register')} />
        <KpiCard label="Clinical Attendance" value="90.2%" sub="Clerkships & clinics" icon="ri-stethoscope-line" tone="navy" onClick={() => navigate('/attendance/register')} />
        <KpiCard label="Learners Below Threshold" value={String(belowThreshold)} sub="Below 85% overall" icon="ri-alert-line" tone="red" onClick={() => navigate('/learners?risk=1')} />
        <KpiCard label="Unresolved Exceptions" value={String(pendingExceptions)} sub="Awaiting decision" icon="ri-file-list-3-line" tone="amber" onClick={() => navigate('/attendance/register')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <Card title="Attendance Compliance Trend" subtitle="Institutional overall attendance · 12 weeks">
          <TrendChart data={trend} lines={[{ key: 'value', name: 'Attendance %', color: CHART_COLORS[2] }]} height={240} yDomain={[80, 100]} />
        </Card>
        <Card title="Attendance Sources" subtitle="How attendance is captured">
          <DonutChart data={sourceDist} centerValue={String(attendanceRecords.length)} centerLabel="records" />
        </Card>
        <Card title="Attendance by Program" subtitle="Overall attendance by program">
          <div className="space-y-3.5">
            {[
              ['Doctor of Medicine', 92.4, 'green'],
              ['Internal Medicine Residency', 94.1, 'green'],
              ['General Surgery Residency', 90.6, 'green'],
              ['Psychiatry Residency', 88.2, 'amber'],
              ['Cardiology Fellowship', 91.8, 'green'],
            ].map(([p, v, tone]) => (
              <div key={String(p)}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] text-ink-700">{p}</span>
                  <span className="text-xs font-semibold text-ink-900 tabular-nums">{v}%</span>
                </div>
                <div className="w-full h-1.5 bg-canvas-200 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${tone === 'green' ? 'bg-green-600' : 'bg-amber-500'}`} style={{ width: `${v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card title="Recent Sessions" subtitle="Latest attendance capture" className="xl:col-span-2" bodyClass="p-0">
          <div className="divide-y divide-line-50">
            {recentSessions.map((s) => (
              <div key={s.id} className="flex items-center gap-4 px-4 py-3 hover:bg-canvas-50 transition-colors cursor-pointer" onClick={() => navigate('/attendance/register')}>
                <span className="w-9 h-9 rounded-md bg-clinic-50 text-clinic-700 flex items-center justify-center flex-shrink-0"><i className="ri-calendar-check-line" /></span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-ink-900 truncate">{s.title}</p>
                  <p className="text-[11px] text-ink-400">{s.date} · {s.start} · {s.location} · {s.source}</p>
                </div>
                <span className="text-xs text-ink-500 tabular-nums">{s.learnerIds.length} recorded</span>
                <StatusBadge status={s.source === 'Clinical Supervisor Validation' ? 'Validated' : 'Auto-Validated'} tone="green" />
              </div>
            ))}
          </div>
        </Card>

        <Card title="Exception Workflow" subtitle="Pending attendance exceptions" bodyClass="p-0">
          <div className="divide-y divide-line-50">
            {exceptions.filter((e) => e.status === 'Pending').slice(0, 5).map((e) => (
              <div key={e.id} className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-ink-900">{e.id}</p>
                  <StatusBadge status={e.status} />
                </div>
                <p className="text-[11px] text-ink-500 mt-0.5">{e.session} · {e.date}</p>
                <p className="text-[11px] text-ink-400 mt-0.5">Reason: {e.reason}</p>
              </div>
            ))}
            <button onClick={() => navigate('/attendance/register')} className="w-full px-4 py-2.5 text-xs font-medium text-clinic-700 hover:text-clinic-800">Open exception queue →</button>
          </div>
        </Card>
      </div>
    </div>
  );
}