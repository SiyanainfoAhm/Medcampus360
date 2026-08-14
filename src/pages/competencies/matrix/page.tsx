import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import Avatar from '@/components/base/Avatar';
import Modal from '@/components/base/Modal';
import { btnPrimaryCls, btnSecondaryCls, selectCls } from '@/components/base/Field';
import { useAppData } from '@/context/AppDataContext';
import { useToast } from '@/context/ToastContext';
import { useRole } from '@/context/RoleContext';
import { COMPETENCIES, COMPETENCY_DOMAINS } from '@/mocks/competencies';
import type { CompStatus } from '@/utils/dataset';

const CELL: Record<CompStatus, { label: string; cls: string; dot: string }> = {
  'Not Started': { label: 'NS', cls: 'bg-canvas-100 text-ink-400 border-line-200', dot: 'bg-ink-300' },
  'In Progress': { label: 'IP', cls: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  'Needs Review': { label: 'NR', cls: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-600' },
  Achieved: { label: 'A', cls: 'bg-green-50 text-green-800 border-green-200', dot: 'bg-green-600' },
  'Exceeds Expectation': { label: 'EE', cls: 'bg-navy-50 text-navy-800 border-navy-200', dot: 'bg-navy-700' },
};

export default function MatrixPage() {
  const navigate = useNavigate();
  const { learners, getCompStatus, creditCompetency, addAudit, getLearnerById } = useAppData();
  const { toast } = useToast();
  const { currentRole } = useRole();
  const [params, setParams] = useSearchParams();
  const [domain, setDomain] = useState(
    params.get('domain') || (params.get('learner') ? 'Entrustable Professional Activities' : COMPETENCY_DOMAINS[0].name)
  );
  const [cohort, setCohort] = useState('Class of 2028');
  const [assessTarget, setAssessTarget] = useState<{ learnerId: string; compCode: string; compName: string; compIndex: number; current: CompStatus } | null>(null);
  const [newStatus, setNewStatus] = useState<CompStatus>('Achieved');

  const domainComps = useMemo(() => COMPETENCIES.filter((c) => c.domain === domain), [domain]);

  const rows = useMemo(() => {
    let list = learners.filter((l) => l.cohort === cohort || cohort === 'All Cohorts');
    const focused = params.get('learner');
    if (focused) list = learners.filter((l) => l.id === focused);
    return list.slice(0, 16);
  }, [learners, cohort, params]);

  const canAssess = currentRole?.permissions.includes('Approve') || currentRole?.id === 'learner';

  const statusFor = (learnerId: string, compIndex: number, code: string) => getCompStatus(learnerId, compIndex, code);

  const applyStatus = () => {
    if (!assessTarget) return;
    if (newStatus === 'Achieved' || newStatus === 'Exceeds Expectation') {
      creditCompetency(assessTarget.learnerId, assessTarget.compCode);
      addAudit({ user: currentRole?.personaName || 'Faculty Preceptor', role: currentRole?.label || 'Faculty Preceptor', module: 'Competencies', action: 'Credited', record: `${assessTarget.compCode} - ${assessTarget.learnerId}`, ipDevice: '192.168.1.67 · Desktop', outcome: 'Success' });
      toast(`${assessTarget.compCode} marked ${newStatus} — matrix updated`);
    } else {
      addAudit({ user: currentRole?.personaName || 'Faculty Preceptor', role: currentRole?.label || 'Faculty Preceptor', module: 'Competencies', action: 'Updated', record: `${assessTarget.compCode} - ${assessTarget.learnerId}`, ipDevice: '192.168.1.67 · Desktop', outcome: 'Success' });
      toast(`${assessTarget.compCode} marked ${newStatus}`);
    }
    setAssessTarget(null);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Competencies', path: '/competencies' }, { label: 'Competency Matrix' }]}
        title="Competency Matrix"
        subtitle="Learner progress across competencies · status updates from assessments appear here automatically"
        actions={
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs">
              {Object.entries(CELL).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1.5 text-ink-500">
                  <span className={`w-2 h-2 rounded-full ${v.dot}`} /> {k}
                </span>
              ))}
            </div>
          </div>
        }
      />

      <Card bodyClass="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <select value={domain} onChange={(e) => setDomain(e.target.value)} className={selectCls + ' !w-72'} aria-label="Domain">
            {COMPETENCY_DOMAINS.map((d) => <option key={d.id}>{d.name}</option>)}
          </select>
          <select value={cohort} onChange={(e) => setCohort(e.target.value)} className={selectCls + ' !w-44'} aria-label="Cohort">
            <option>All Cohorts</option>
            {['Class of 2028', 'Class of 2029', 'Class of 2030', 'IM Residency PGY-1', 'Fellowship Year 1'].map((c) => <option key={c}>{c}</option>)}
          </select>
          {params.get('learner') && (
            <span className="text-xs font-medium text-clinic-700 bg-clinic-50 border border-clinic-200 rounded-full px-2.5 py-1">
              Focused: {getLearnerById(params.get('learner')!)?.name} · <button className="underline" onClick={() => setParams({})}>clear</button>
            </span>
          )}
          <span className="ml-auto text-xs text-ink-500">Click a cell to assess or review status</span>
        </div>
      </Card>

      <div className="mt-5 bg-white border border-line-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ minWidth: 1100 }}>
            <thead>
              <tr className="border-b border-line-100">
                <th className="sticky left-0 bg-white px-4 py-3 text-[11px] font-semibold text-ink-500 uppercase tracking-wide">Learner</th>
                {domainComps.map((c) => (
                  <th key={c.code} className="px-2 py-3 text-center text-[10px] font-semibold text-ink-500 uppercase tracking-wide min-w-[84px]">
                    {c.code}
                    <span className="block text-[9px] font-normal normal-case text-ink-400 mt-0.5">{c.name.split(':')[0]}</span>
                  </th>
                ))}
                <th className="px-3 py-3 text-[11px] font-semibold text-ink-500 uppercase tracking-wide">Progress</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l) => {
                const achieved = domainComps.filter((c, i) => ['Achieved', 'Exceeds Expectation'].includes(getCompStatus(l.id, COMPETENCIES.indexOf(c), c.code))).length;
                return (
                  <tr key={l.id} className="border-b border-line-50 last:border-0 hover:bg-canvas-50 transition-colors">
                    <td className="sticky left-0 bg-white px-4 py-2.5">
                      <button onClick={() => navigate(`/learners/${l.id}`)} className="flex items-center gap-2.5 hover:text-clinic-700 transition-colors">
                        <Avatar name={l.name} photo={l.photo} size={28} />
                        <div className="text-left">
                          <p className="text-[13px] font-medium text-ink-900">{l.name}</p>
                          <p className="text-[10px] text-ink-400">{l.id}</p>
                        </div>
                      </button>
                    </td>
                    {domainComps.map((c) => {
                      const st = statusFor(l.id, COMPETENCIES.indexOf(c), c.code);
                      const cell = CELL[st];
                      return (
                        <td key={c.code} className="px-2 py-2 text-center">
                          <button
                            onClick={() => setAssessTarget({ learnerId: l.id, compCode: c.code, compName: c.name, compIndex: COMPETENCIES.indexOf(c), current: st })}
                            className={`w-11 h-8 inline-flex items-center justify-center rounded-md border text-[11px] font-bold transition-transform hover:scale-110 ${cell.cls}`}
                            title={`${l.name} · ${c.code} · ${st}`}
                          >
                            {cell.label}
                          </button>
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-right">
                      <span className={`text-xs font-semibold tabular-nums ${achieved >= domainComps.length * 0.8 ? 'text-green-700' : achieved >= domainComps.length * 0.5 ? 'text-amber-600' : 'text-red-600'}`}>
                        {achieved}/{domainComps.length}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {assessTarget && (
        <Modal
          title={`Assess ${assessTarget.compCode} · ${assessTarget.compName}`}
          subtitle={`${getLearnerById(assessTarget.learnerId)?.name || assessTarget.learnerId} · current status: ${assessTarget.current}`}
          onClose={() => setAssessTarget(null)}
          size="md"
          footer={
            <>
              <button onClick={() => setAssessTarget(null)} className={btnSecondaryCls}>Cancel</button>
              <button onClick={applyStatus} disabled={!canAssess} className={btnPrimaryCls + ' disabled:opacity-50'}><i className="ri-check-line" /> Update Status</button>
            </>
          }
        >
          {canAssess ? (
            <div className="space-y-4">
              <p className="text-sm text-ink-600">Set the learner's status for this competency. Approved assessments automatically credit the competency and update progress.</p>
              <div className="space-y-2">
                {(Object.keys(CELL) as CompStatus[]).map((s) => (
                  <label key={s} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${newStatus === s ? 'border-clinic-400 bg-clinic-50' : 'border-line-200 hover:border-line-300'}`}>
                    <input type="radio" checked={newStatus === s} onChange={() => setNewStatus(s)} className="accent-clinic-700" />
                    <span className={`w-2.5 h-2.5 rounded-full ${CELL[s].dot}`} />
                    <span className="text-[13px] font-medium text-ink-800">{s}</span>
                  </label>
                ))}
              </div>
              <div className="text-xs text-ink-500 bg-canvas-100 border border-line-200 rounded-lg p-3">
                Changing status to <strong>Achieved</strong> credits the competency: learner progress and the institutional competency evidence record update automatically.
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-600">Your current role cannot update competency status. Switch to a Faculty Preceptor or Dean role to assess.</p>
          )}
        </Modal>
      )}
    </div>
  );
}