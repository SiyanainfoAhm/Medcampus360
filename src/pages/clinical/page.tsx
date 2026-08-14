import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import KpiCard from '@/components/base/KpiCard';
import StatusBadge from '@/components/base/StatusBadge';
import ProgressBar from '@/components/base/ProgressBar';
import { SimpleBarChart, DonutChart, CHART_COLORS } from '@/components/feature/Charts';
import { useAppData } from '@/context/AppDataContext';
import { CLINICAL_SITES } from '@/mocks/institution';
import { baseRotationName } from '@/utils/dataset';

export default function ClinicalPage() {
  const navigate = useNavigate();
  const { rotations, caseLogs, procedures, learners } = useAppData();

  const activeRotations = rotations.filter((r) => r.status === 'Active');
  const pendingReviews = caseLogs.filter((c) => c.status === 'Submitted').length;
  const pendingValidation = procedures.filter((p) => p.validation === 'Pending').length;
  const belowExposure = learners.filter((l) => l.risk).length;
  const approvedLogs = caseLogs.filter((c) => c.status === 'Approved' || c.status === 'Competency Credited').length;
  const completionRate = caseLogs.length ? Math.round((approvedLogs / caseLogs.length) * 100) : 0;

  const siteUtil = useMemo(() => {
    return CLINICAL_SITES.map((s) => {
      const rot = rotations.filter((r) => r.site === s.id);
      const assigned = rot.reduce((sum, r) => sum + r.learners.length, 0);
      const capacity = rot.reduce((sum, r) => sum + r.capacity, 0);
      return { label: s.name.split(' ')[0], value: capacity ? Math.round((assigned / capacity) * 100) : 0, site: s.name };
    });
  }, [rotations]);

  const categoryDist = useMemo(() => {
    const map = new Map<string, number>();
    caseLogs.forEach((c) => map.set(c.category, (map.get(c.category) || 0) + 1));
    return Array.from(map.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [caseLogs]);

  const statusDist = useMemo(() => {
    const colors: Record<string, string> = {
      Draft: '#8D9BA9',
      Submitted: '#C58322',
      'Revision Requested': '#C2414B',
      Approved: '#2563A6',
      'Competency Credited': '#23865B',
    };
    return (['Draft', 'Submitted', 'Revision Requested', 'Approved', 'Competency Credited'] as const).map((s) => ({
      name: s,
      value: caseLogs.filter((c) => c.status === s).length,
      color: colors[s],
    }));
  }, [caseLogs]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Clinical Education' }, { label: 'Clinical Dashboard' }]}
        title="Clinical Education"
        subtitle="Rotations, case logs, procedure validation, and preceptor reviews across 8 clinical training sites"
        actions={
          <>
            <button onClick={() => navigate('/clinical/case-logs')} className="h-10 px-4 text-sm font-medium bg-white border border-line-200 text-ink-700 hover:bg-canvas-50 rounded-md whitespace-nowrap">
              <i className="ri-file-list-3-line" /> Case Logs
            </button>
            <button onClick={() => navigate('/clinical/procedures')} className="h-10 px-4 text-sm font-medium bg-white border border-line-200 text-ink-700 hover:bg-canvas-50 rounded-md whitespace-nowrap">
              <i className="ri-syringe-line" /> Procedure Log
            </button>
            <button onClick={() => navigate('/clinical/reviews')} className="h-10 px-4 text-sm font-medium bg-navy-900 text-white hover:bg-navy-800 rounded-md whitespace-nowrap">
              <i className="ri-chat-check-line" /> Review Queue {pendingReviews > 0 && <span className="ml-1 bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{pendingReviews}</span>}
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-4 mb-6">
        <KpiCard label="Active Rotations" value={String(activeRotations.length)} sub="8 clinical sites" icon="ri-stethoscope-line" tone="navy" onClick={() => navigate('/schedule')} />
        <KpiCard label="Pending Case-Log Reviews" value={String(pendingReviews)} sub="Awaiting preceptor" icon="ri-file-list-3-line" tone="amber" onClick={() => navigate('/clinical/reviews')} />
        <KpiCard label="Procedures Awaiting Validation" value={String(pendingValidation)} sub="Supervisor sign-off" icon="ri-syringe-line" tone="amber" onClick={() => navigate('/clinical/procedures')} />
        <KpiCard label="Overdue Preceptor Evaluations" value="6" sub="Rotation evaluations" icon="ri-user-star-line" tone="blue" onClick={() => navigate('/assessments')} />
        <KpiCard label="Learners Below Exposure" value={String(belowExposure)} sub="Required case counts" icon="ri-alert-line" tone="red" onClick={() => navigate('/learners?risk=1')} />
        <KpiCard label="Site Utilization" value={`${Math.round(siteUtil.reduce((s, x) => s + x.value, 0) / Math.max(1, siteUtil.length))}%`} sub="Across 8 sites" icon="ri-building-line" tone="teal" onClick={() => navigate('/schedule')} />
        <KpiCard label="Rotation Completion" value={`${completionRate}%`} sub="Case log approvals" icon="ri-check-double-line" tone="green" onClick={() => navigate('/clinical/case-logs')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <Card title="Case Log Status" subtitle={`${caseLogs.length.toLocaleString('en-US')} clinical case logs this term`}>
          <DonutChart data={statusDist} centerValue={String(caseLogs.length)} centerLabel="case logs" />
        </Card>
        <Card title="Clinical-Site Utilization" subtitle="Learner load vs rotation capacity by site">
          <SimpleBarChart data={siteUtil} xKey="label" bars={[{ key: 'value', name: 'Utilization %', color: CHART_COLORS[1] }]} height={240} />
        </Card>
        <Card title="Case Categories" subtitle="Distribution across clinical case categories">
          <SimpleBarChart data={categoryDist} xKey="label" bars={[{ key: 'value', name: 'Case logs', color: CHART_COLORS[2] }]} height={240} />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active rotations */}
        <Card
          title="Active Clinical Rotations"
          subtitle="Tap a rotation to open its full detail"
          className="xl:col-span-2"
          bodyClass="p-0"
          actions={<button onClick={() => navigate('/schedule')} className="text-xs text-clinic-700 hover:text-clinic-800 font-medium">Planner</button>}
        >
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line-100">
                {['Rotation', 'Department', 'Site', 'Learners', 'Preceptors', 'Completion', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeRotations.slice(0, 7).map((r) => {
                const rotLogs = caseLogs.filter((c) => c.rotation === r.name || c.rotation === baseRotationName(r.name));
                const approved = rotLogs.filter((c) => c.status === 'Approved' || c.status === 'Competency Credited').length;
                const pct = r.requiredCases ? Math.min(100, Math.round((approved / Math.max(1, r.requiredCases * (r.learners.length || 1))) * 100)) : 0;
                return (
                  <tr key={r.id} className="border-b border-line-50 last:border-0 cursor-pointer hover:bg-canvas-50 transition-colors" onClick={() => navigate(`/clinical/rotations/${r.id}`)}>
                    <td className="px-4 py-3 text-sm font-medium text-clinic-700">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-ink-700">{r.department}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{r.site}</td>
                    <td className="px-4 py-3 text-sm tabular-nums">{r.learners.length}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{r.preceptors.join(', ')}</td>
                    <td className="px-4 py-3"><ProgressBar value={pct} tone="teal" height={5} label={`${pct}%`} /></td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Recent case logs */}
        <Card title="Recent Case Log Submissions" subtitle="Latest activity across clerkships">
          <div className="space-y-2.5">
            {caseLogs.slice(0, 6).map((c) => {
              const learner = learners.find((l) => l.id === c.learnerId);
              return (
                <button key={c.id} onClick={() => navigate(`/clinical/case-logs?learner=${c.learnerId}`)} className="w-full text-left border border-line-200 rounded-lg p-3 hover:border-navy-300 hover:bg-canvas-50 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium text-ink-900 truncate">{c.id}</p>
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-xs text-ink-600 mt-1 line-clamp-1">{c.summary}</p>
                  <p className="text-[11px] text-ink-400 mt-1">{c.learnerName} · {c.encounterDate} · {c.category}</p>
                </button>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}