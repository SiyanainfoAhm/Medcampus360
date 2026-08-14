import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import KpiCard from '@/components/base/KpiCard';
import StatusBadge from '@/components/base/StatusBadge';
import { SimpleBarChart, CHART_COLORS } from '@/components/feature/Charts';
import { useAppData } from '@/context/AppDataContext';
import { ASSESSMENT_TYPES } from '@/mocks/assessments';

export default function AssessmentsPage() {
  const navigate = useNavigate();
  const { assessments } = useAppData();

  const byType = ASSESSMENT_TYPES.map((t) => ({ label: t.split(' ')[0], value: assessments.filter((a) => a.type === t).length }));

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Assessments' }, { label: 'Assessment Dashboard' }]}
        title="Assessments & Evaluations"
        subtitle="Written assessments, OSCEs, simulation, direct observation, and rotation evaluations"
        actions={
          <>
            <button onClick={() => navigate('/assessments/osce')} className="h-10 px-4 text-sm font-medium bg-white border border-line-200 text-ink-700 hover:bg-canvas-50 rounded-md whitespace-nowrap"><i className="ri-user-3-line" /> OSCE Evaluations</button>
            <button onClick={() => navigate('/assessments/results')} className="h-10 px-4 text-sm font-medium bg-navy-900 text-white hover:bg-navy-800 rounded-md whitespace-nowrap"><i className="ri-check-double-line" /> Results Approval</button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard label="Scheduled Assessments" value={String(assessments.filter((a) => a.status === 'Scheduled').length)} sub="Upcoming" icon="ri-calendar-line" tone="navy" onClick={() => navigate('/assessments')} />
        <KpiCard label="Completion Rate" value="88.4%" sub="Average across cohorts" icon="ri-checkbox-circle-line" tone="green" onClick={() => navigate('/assessments')} />
        <KpiCard label="Pending Grading" value={String(assessments.reduce((s, a) => s + a.pendingGrading, 0))} sub="Scores to grade" icon="ri-file-edit-line" tone="amber" onClick={() => navigate('/assessments/results')} />
        <KpiCard label="Results Awaiting Release" value="3" sub="Require dual confirmation" icon="ri-time-line" tone="amber" onClick={() => navigate('/assessments/results')} />
        <KpiCard label="Below Benchmark" value="42" sub="Learners flagged" icon="ri-alert-line" tone="red" onClick={() => navigate('/learners?risk=1')} />
        <KpiCard label="Faculty Eval Overdue" value="6" sub="Rotation evaluations" icon="ri-user-star-line" tone="blue" onClick={() => navigate('/assessments')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card title="Assessment Types" subtitle="Distribution of the 24 scheduled assessments">
          <SimpleBarChart data={byType} xKey="label" bars={[{ key: 'value', name: 'Assessments', color: CHART_COLORS[1] }]} height={240} />
        </Card>
        <Card title="Assessment Register" subtitle="All scheduled assessments for AY 2026-27" className="xl:col-span-2" bodyClass="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line-100">
                {['Assessment', 'Type', 'Cohort', 'Date', 'Avg Score', 'Completion', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assessments.slice(0, 10).map((a) => (
                <tr key={a.id} className="border-b border-line-50 last:border-0 cursor-pointer hover:bg-canvas-50 transition-colors" onClick={() => navigate(a.type === 'OSCE' ? '/assessments/osce' : a.status === 'Grading' || a.status === 'Awaiting Release' ? '/assessments/results' : undefined)}>
                  <td className="px-4 py-3 text-sm font-medium text-ink-900 max-w-[240px] truncate">{a.name}</td>
                  <td className="px-4 py-3 text-[13px] text-ink-600">{a.type}</td>
                  <td className="px-4 py-3 text-[13px] text-ink-600">{a.cohort}</td>
                  <td className="px-4 py-3 text-[13px] text-ink-600 whitespace-nowrap">{a.date}</td>
                  <td className="px-4 py-3 text-[13px] tabular-nums">{a.averageScore}</td>
                  <td className="px-4 py-3 text-[13px] tabular-nums">{a.completionRate}%</td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}