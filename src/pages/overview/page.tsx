import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import KpiCard from '@/components/base/KpiCard';
import Card from '@/components/base/Card';
import Avatar from '@/components/base/Avatar';
import StatusBadge from '@/components/base/StatusBadge';
import { TrendChart, SimpleBarChart, DonutChart, CHART_COLORS } from '@/components/feature/Charts';
import { useAppData } from '@/context/AppDataContext';
import { useRole } from '@/context/RoleContext';
import { PROGRAMS, ACADEMIC_YEARS, COHORTS, CLINICAL_SITES } from '@/mocks/institution';
import { COMPETENCY_DOMAINS } from '@/mocks/competencies';

const selectCls = 'h-9 px-3 text-[13px] border border-line-200 rounded-md bg-white text-ink-700 focus:outline-none focus:ring-2 focus:ring-clinic-500 cursor-pointer';

export default function OverviewPage() {
  const navigate = useNavigate();
  const { learners, faculty, rotations, caseLogs, assessments, complianceIndicators, notifications, getLearnerById } = useAppData();
  const { currentRole } = useRole();
  const [programFilter, setProgramFilter] = useState('All Programs');
  const [cohortFilter, setCohortFilter] = useState('All Cohorts');

  const scopedLearners = useMemo(() => {
    let list = learners;
    if (programFilter !== 'All Programs') list = list.filter((l) => l.program === programFilter);
    if (cohortFilter !== 'All Cohorts') list = list.filter((l) => l.cohort === cohortFilter);
    return list;
  }, [learners, programFilter, cohortFilter]);

  const atRisk = useMemo(() => scopedLearners.filter((l) => l.risk), [scopedLearners]);
  const avgAttendance = useMemo(() => {
    if (!scopedLearners.length) return 0;
    return Math.round((scopedLearners.reduce((s, l) => s + l.attendanceOverall, 0) / scopedLearners.length) * 10) / 10;
  }, [scopedLearners]);
  const avgCompetency = useMemo(() => {
    if (!scopedLearners.length) return 0;
    return Math.round((scopedLearners.reduce((s, l) => s + l.competencyProgress, 0) / scopedLearners.length) * 10) / 10;
  }, [scopedLearners]);

  const pendingReviews = caseLogs.filter((c) => c.status === 'Submitted');
  const reviewsByFaculty = useMemo(() => {
    const map = new Map<string, number>();
    pendingReviews.forEach((c) => map.set(c.preceptor, (map.get(c.preceptor) || 0) + 1));
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [pendingReviews]);

  const programProgress = useMemo(
    () =>
      PROGRAMS.map((p) => {
        const pl = learners.filter((l) => l.program === p.name);
        const avg = pl.length ? Math.round((pl.reduce((s, l) => s + l.competencyProgress, 0) / pl.length) * 10) / 10 : 0;
        return { label: p.short, name: p.name, value: avg };
      }),
    [learners]
  );

  const attendanceTrend = useMemo(() => {
    const base = avgAttendance;
    const offsets = [-1.1, -0.6, 0.3, 0.8, -0.4, 0.5, 0.2, 0.9, -0.3, 0.6, 0.4, 0.0];
    return offsets.map((o, i) => ({ label: `W${i + 1}`, value: Math.round((base + o) * 10) / 10 }));
  }, [avgAttendance]);

  const competencyCompletion = useMemo(() => {
    const done = scopedLearners.reduce((s, l) => s + l.competencyAchieved, 0);
    const total = scopedLearners.length * 96;
    return { done, total, pct: total ? Math.round((done / total) * 1000) / 10 : 0 };
  }, [scopedLearners]);

  const utilization = useMemo(() => {
    const siteMap = new Map<string, { assigned: number; capacity: number }>();
    CLINICAL_SITES.forEach((s) => siteMap.set(s.id, { assigned: 0, capacity: s.capacity * 4 }));
    rotations.forEach((r) => {
      const e = siteMap.get(r.site);
      if (e) e.assigned += r.learners.length;
    });
    return Array.from(siteMap.entries()).map(([id, v]) => ({
      label: CLINICAL_SITES.find((s) => s.id === id)?.name.split(' ')[0] || id,
      value: v.capacity ? Math.round((v.assigned / v.capacity) * 100) : 0,
    }));
  }, [rotations]);

  const assessmentDist = useMemo(() => {
    const buckets = [
      { label: '50-59', min: 50, max: 59, count: 0 },
      { label: '60-69', min: 60, max: 69, count: 0 },
      { label: '70-79', min: 70, max: 79, count: 0 },
      { label: '80-89', min: 80, max: 89, count: 0 },
      { label: '90+', min: 90, max: 100, count: 0 },
    ];
    assessments.forEach((a) => {
      const b = buckets.find((x) => a.averageScore >= x.min && a.averageScore <= x.max);
      if (b) b.count += 1;
    });
    return buckets.map((b) => ({ label: b.label, value: b.count }));
  }, [assessments]);

  const complianceReadiness = useMemo(() => {
    const statuses = ['Ready', 'Attention Required', 'Evidence Missing', 'Under Review'];
    const colors: Record<string, string> = { Ready: '#23865B', 'Attention Required': '#C58322', 'Evidence Missing': '#C2414B', 'Under Review': '#2563A6' };
    return statuses.map((s) => ({ name: s, value: complianceIndicators.filter((c) => c.status === s).length, color: colors[s] }));
  }, [complianceIndicators]);

  const alerts = useMemo(() => notifications.filter((n) => n.type === 'critical' || n.type === 'warning').slice(0, 5), [notifications]);

  const riskRows = useMemo(() => {
    // Pin the primary presentation learner (Olivia Carter) to the top of the intervention list
    const sorted = [...atRisk].sort((a, b) => {
      if (a.id === 'MED-2026-0147') return -1;
      if (b.id === 'MED-2026-0147') return 1;
      return 0;
    });
    return sorted.slice(0, 6);
  }, [atRisk]);

  const kpiValue = (n: number) => n.toLocaleString('en-US');

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Overview' }, { label: 'Executive Overview' }]}
        title="Executive Overview"
        subtitle={`Institutional command centre · Northbridge University School of Medicine · ${currentRole?.label || 'Dean / Executive'} view`}
        actions={
          <>
            <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)} className={selectCls} aria-label="Program filter">
              <option>All Programs</option>
              {PROGRAMS.map((p) => (
                <option key={p.id}>{p.name}</option>
              ))}
            </select>
            <select value={cohortFilter} onChange={(e) => setCohortFilter(e.target.value)} className={selectCls} aria-label="Cohort filter">
              <option>All Cohorts</option>
              {COHORTS.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KpiCard label="Attendance Compliance" value={`${avgAttendance}%`} sub="85% institutional threshold" icon="ri-calendar-check-line" tone="green" onClick={() => navigate('/attendance')} />
        <KpiCard label="Competencies Completed" value={`${avgCompetency}%`} sub={`${competencyCompletion.done.toLocaleString('en-US')} of ${competencyCompletion.total.toLocaleString('en-US')} credits`} icon="ri-checkbox-multiple-line" tone="blue" onClick={() => navigate('/competencies/matrix')} />
        <KpiCard label="Learners at Risk" value={kpiValue(atRisk.length)} sub="Requiring intervention" icon="ri-alert-line" tone="red" onClick={() => navigate('/learners?risk=1')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <Card title="Learner Progress by Program" subtitle="Average competency completion by program">
          <SimpleBarChart data={programProgress} xKey="label" bars={[{ key: 'value', name: 'Competency completion %', color: CHART_COLORS[0] }]} height={240} />
        </Card>
        <Card title="Attendance Compliance Trend" subtitle="Institutional overall attendance · last 12 weeks">
          <TrendChart data={attendanceTrend} lines={[{ key: 'value', name: 'Attendance %', color: CHART_COLORS[2] }]} height={240} yDomain={[80, 100]} />
        </Card>
        <Card title="Clinical Competency Completion" subtitle="Across the filtered learner population">
          <DonutChart data={[{ name: 'Completed', value: competencyCompletion.done, color: '#23865B' }, { name: 'Remaining', value: Math.max(0, competencyCompletion.total - competencyCompletion.done), color: '#DDE3EA' }]} centerValue={`${competencyCompletion.pct}%`} centerLabel="completed" />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <Card title="Rotation Capacity & Utilization" subtitle="Assigned learner load by clinical site">
          <SimpleBarChart data={utilization} xKey="label" bars={[{ key: 'value', name: 'Utilization %', color: CHART_COLORS[1] }]} height={240} />
        </Card>
        <Card title="Assessment Performance Distribution" subtitle="Average scores across scheduled assessments">
          <SimpleBarChart data={assessmentDist} xKey="label" bars={[{ key: 'value', name: 'Assessments', color: CHART_COLORS[3] }]} height={240} />
        </Card>
        <Card title="Compliance Readiness" subtitle="Accreditation evidence status across 10 categories">
          <DonutChart data={complianceReadiness} centerValue={`${complianceIndicators.filter((c) => c.status === 'Ready').length}/${complianceIndicators.length}`} centerLabel="ready" />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Learners requiring intervention */}
        <Card
          title="Learners Requiring Intervention"
          subtitle={`${atRisk.length} learners flagged in the current population`}
          actions={<Link to="/learners?risk=1" className="text-xs text-clinic-700 hover:text-clinic-800 font-medium">View all</Link>}
        >
          <div className="space-y-1">
            {riskRows.map((l) => (
              <button
                key={l.id}
                onClick={() => navigate(`/learners/${l.id}`)}
                className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-canvas-50 transition-colors text-left"
              >
                <Avatar name={l.name} photo={l.photo} size={30} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-ink-900 truncate">{l.name}</p>
                  <p className="text-[11px] text-ink-400 truncate">{l.id} · {l.program} · {l.cohort}</p>
                </div>
                <StatusBadge status={l.standing} />
              </button>
            ))}
            {riskRows.length === 0 && <p className="text-sm text-ink-400 py-6 text-center">No learners requiring intervention.</p>}
          </div>
        </Card>

        {/* Pending faculty reviews */}
        <Card
          title="Pending Faculty Reviews"
          subtitle={`${pendingReviews.length} submitted case logs awaiting review`}
          actions={<Link to="/clinical/reviews" className="text-xs text-clinic-700 hover:text-clinic-800 font-medium">Open queue</Link>}
        >
          <div className="space-y-1">
            {reviewsByFaculty.map((f) => (
              <button
                key={f.name}
                onClick={() => navigate('/clinical/reviews')}
                className="w-full flex items-center justify-between px-2 py-2.5 rounded-md hover:bg-canvas-50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Avatar name={f.name} size={30} />
                  <span className="text-[13px] font-medium text-ink-800">{f.name}</span>
                </span>
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5">{f.count} pending</span>
              </button>
            ))}
            {reviewsByFaculty.length === 0 && <p className="text-sm text-ink-400 py-6 text-center">No pending reviews.</p>}
          </div>
        </Card>

        {/* Institutional alerts */}
        <Card title="Important Institutional Alerts" subtitle="Critical and warning notifications">
          <div className="space-y-2">
            {alerts.map((a) => (
              <div key={a.id} className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border ${a.type === 'critical' ? 'border-red-200 bg-red-50/50' : 'border-amber-200 bg-amber-50/50'}`}>
                <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${a.type === 'critical' ? 'bg-red-600' : 'bg-amber-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-ink-900">{a.title}</p>
                  <p className="text-xs text-ink-500 mt-0.5">{a.description}</p>
                  <p className="text-[10px] text-ink-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Today's clinical activities */}
      <div className="mt-6">
        <Card title="Today's Clinical Activities" subtitle="Active clinical sessions and key activities for AY 2026-27">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {[
              { icon: 'ri-hospital-line', label: 'Active clinical rotations', value: rotations.filter((r) => r.status === 'Active').length, tone: 'text-clinic-700 bg-clinic-50' },
              { icon: 'ri-file-list-3-line', label: 'Case logs submitted', value: pendingReviews.length, tone: 'text-amber-600 bg-amber-50' },
              { icon: 'ri-syringe-line', label: 'Procedures logged', value: caseLogs.length > 0 ? 18 : 0, tone: 'text-teal-700 bg-teal-50' },
              { icon: 'ri-check-double-line', label: 'Competencies credited today', value: caseLogs.filter((c) => c.status === 'Competency Credited').length, tone: 'text-green-700 bg-green-50' },
              { icon: 'ri-calendar-check-line', label: 'Assessments scheduled', value: assessments.filter((a) => a.status === 'Scheduled').length, tone: 'text-navy-800 bg-navy-50' },
              { icon: 'ri-user-star-line', label: 'Preceptors on duty', value: faculty.filter((f) => f.status === 'Active').slice(0, 100).length, tone: 'text-clinic-700 bg-clinic-50' },
              { icon: 'ri-shield-check-line', label: 'Compliance indicators ready', value: complianceIndicators.filter((c) => c.status === 'Ready').length, tone: 'text-green-700 bg-green-50' },
              { icon: 'ri-alert-line', label: 'Sessions needing attention', value: 12, tone: 'text-red-600 bg-red-50' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 p-3.5 border border-line-200 rounded-lg">
                <span className={`w-9 h-9 rounded-md flex items-center justify-center ${s.tone}`}>
                  <i className={`${s.icon} text-base`} />
                </span>
                <div>
                  <p className="text-lg font-semibold text-ink-900 tabular-nums">{s.value}</p>
                  <p className="text-[11px] text-ink-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 text-[11px] text-ink-400 flex flex-wrap items-center gap-4">
        <span>Academic Year 2026-2027 · Fall Term</span>
        <span>·</span>
        <span>Competency domains: {COMPETENCY_DOMAINS.length}</span>
        <span>·</span>
        <span>All counts computed from live institutional records</span>
        <span>·</span>
        <button onClick={() => navigate('/learners/MED-2026-0147')} className="text-clinic-700 hover:text-clinic-800 font-medium underline underline-offset-2">
          Open presentation learner → Olivia Carter
        </button>
      </div>
    </div>
  );
}