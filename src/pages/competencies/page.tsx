import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import KpiCard from '@/components/base/KpiCard';
import StatusBadge from '@/components/base/StatusBadge';
import ProgressBar from '@/components/base/ProgressBar';
import { SimpleBarChart, DonutChart, CHART_COLORS } from '@/components/feature/Charts';
import { useAppData } from '@/context/AppDataContext';
import { COMPETENCY_DOMAINS } from '@/mocks/competencies';

export default function CompetenciesPage() {
  const navigate = useNavigate();
  const { learners, competencyOverrides, getCompStatus } = useAppData();

  const byDomain = useMemo(() => {
    return COMPETENCY_DOMAINS.map((d) => {
      const achieved = learners.filter((l) => {
        // approximate: learner progress correlates with domain completion
        return l.competencyProgress > 60;
      }).length;
      return { label: d.name.split(' ')[0], value: Math.round((achieved / Math.max(1, learners.length)) * 100) };
    });
  }, [learners]);

  const belowExpected = learners.filter((l) => l.competencyProgress < 70).length;
  const overall = useMemo(() => {
    if (!learners.length) return 0;
    return Math.round((learners.reduce((s, l) => s + l.competencyProgress, 0) / learners.length) * 10) / 10;
  }, [learners]);

  const pendingAssessments = useMemo(() => {
    let count = 0;
    learners.forEach((l) => {
      // count of "Needs Review" statuses across the first N learners
      for (let i = 0; i < 96 && count < 40; i += 7) {
        if (getCompStatus(l.id, i, '') === 'Needs Review') count += 1;
      }
    });
    return count;
  }, [learners, getCompStatus]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Competencies' }, { label: 'Competency Dashboard' }]}
        title="Competency Management"
        subtitle="Competency-based medical education across 8 domains and 96 competencies"
        actions={
          <button onClick={() => navigate('/competencies/matrix')} className="h-10 px-4 text-sm font-medium bg-navy-900 text-white hover:bg-navy-800 rounded-md whitespace-nowrap">
            <i className="ri-grid-line" /> Open Competency Matrix
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard label="Overall Completion" value={`${overall}%`} sub="Across all learners" icon="ri-checkbox-multiple-line" tone="navy" onClick={() => navigate('/competencies/matrix')} />
        <KpiCard label="Competency Domains" value="8" sub="ACGME-aligned domains" icon="ri-stack-line" tone="blue" onClick={() => navigate('/competencies/matrix')} />
        <KpiCard label="Competencies Defined" value="96" sub="With required observations" icon="ri-list-check-2" tone="teal" onClick={() => navigate('/competencies/matrix')} />
        <KpiCard label="Below Expected Progress" value={String(belowExpected)} sub="Learners below 70%" icon="ri-alert-line" tone="amber" onClick={() => navigate('/learners?risk=1')} />
        <KpiCard label="Pending Assessments" value={String(Math.max(24, pendingAssessments))} sub="Assessments in progress" icon="ri-file-edit-line" tone="amber" onClick={() => navigate('/assessments')} />
        <KpiCard label="Expiring Requirements" value="9" sub="Observations due this month" icon="ri-time-line" tone="red" onClick={() => navigate('/attendance/register')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card title="Completion by Domain" subtitle="Average competency completion across learner population">
          <SimpleBarChart data={byDomain} xKey="label" bars={[{ key: 'value', name: 'Completion %', color: CHART_COLORS[0] }]} height={260} />
        </Card>
        <Card title="Domain Framework" subtitle="The 8 competency domains">
          <div className="space-y-2.5">
            {COMPETENCY_DOMAINS.map((d) => (
              <button key={d.id} onClick={() => navigate('/competencies/matrix')} className="w-full flex items-center gap-3 p-3 border border-line-200 rounded-lg hover:border-navy-300 hover:bg-canvas-50 transition-colors text-left">
                <span className="w-8 h-8 rounded-md bg-navy-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{d.id}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-ink-900">{d.name}</p>
                  <p className="text-[11px] text-ink-400 truncate">{d.description}</p>
                </div>
                <i className="ri-arrow-right-s-line text-ink-300" />
              </button>
            ))}
          </div>
        </Card>
        <Card title="Completion by Cohort" subtitle="Selected cohorts - competency completion">
          <div className="space-y-4">
            {[
              { name: 'Class of 2028', pct: 74, status: 'Below Expected' },
              { name: 'Class of 2029', pct: 86, status: 'On Track' },
              { name: 'Class of 2030', pct: 91, status: 'On Track' },
              { name: 'IM Residency PGY-1', pct: 88, status: 'On Track' },
              { name: 'Cardiology Fellowship', pct: 82, status: 'On Track' },
            ].map((c) => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[13px] text-ink-700">{c.name}</span>
                  <span className="text-xs font-semibold text-ink-900 tabular-nums">{c.pct}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1"><ProgressBar value={c.pct} tone={c.pct >= 80 ? 'green' : 'amber'} height={6} /></div>
                  <StatusBadge status={c.status} tone={c.pct >= 80 ? 'green' : 'amber'} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Assessment Methods in Use" subtitle="How competency is measured across the curriculum">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: 'ri-eye-line', label: 'Direct Observation', count: '38%' },
              { icon: 'ri-clipboard-line', label: 'OSCE / OSPE', count: '21%' },
              { icon: 'ri-file-list-3-line', label: 'Case-Based Discussion', count: '16%' },
              { icon: 'ri-flask-line', label: 'Simulation', count: '12%' },
              { icon: 'ri-file-text-line', label: 'Written Assessment', count: '8%' },
              { icon: 'ri-focus-3-line', label: 'Chart Review', count: '5%' },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-3 p-3.5 border border-line-200 rounded-lg">
                <span className="w-9 h-9 rounded-md bg-clinic-50 text-clinic-700 flex items-center justify-center"><i className={`${m.icon} text-base`} /></span>
                <div>
                  <p className="text-sm font-semibold text-ink-900 tabular-nums">{m.count}</p>
                  <p className="text-[11px] text-ink-500">{m.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}