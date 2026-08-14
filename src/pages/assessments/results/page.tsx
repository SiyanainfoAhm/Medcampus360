import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import StatusBadge from '@/components/base/StatusBadge';
import Modal from '@/components/base/Modal';
import { btnPrimaryCls, btnSecondaryCls } from '@/components/base/Field';
import { useAppData } from '@/context/AppDataContext';
import { useToast } from '@/context/ToastContext';

interface ResultBatch {
  id: string;
  name: string;
  type: string;
  cohort: string;
  records: number;
  status: 'Grading' | 'Awaiting Release' | 'Released';
  average: number;
}

const BATCHES: ResultBatch[] = [
  { id: 'R-2401', name: 'OSCE Clinical Skills Assessment - Fall', type: 'OSCE', cohort: 'Class of 2028', records: 24, status: 'Awaiting Release', average: 81.4 },
  { id: 'R-2402', name: 'Clinical Reasoning Written Exam', type: 'Written Assessment', cohort: 'Class of 2028', records: 118, status: 'Grading', average: 76.8 },
  { id: 'R-2403', name: 'Foundations Written Examination 1', type: 'Written Assessment', cohort: 'Class of 2029', records: 116, status: 'Grading', average: 79.2 },
  { id: 'R-2404', name: 'Simulation: Acute Care', type: 'Simulation Assessment', cohort: 'Class of 2028', records: 24, status: 'Released', average: 84.6 },
  { id: 'R-2405', name: 'IM Residency In-Training Exam', type: 'Written Assessment', cohort: 'PGY-1', records: 40, status: 'Released', average: 72.1 },
];

const GRADE_ROWS = [
  { learner: 'Olivia Carter', id: 'MED-2026-0147', total: 78, stationScores: 'S1:82 S2:75 S3:88 S4:79 S5:74 S6:81 S7:77 S8:69 S9:80 S10:76 S11:83 S12:72', status: 'Meets Benchmark' },
  { learner: 'Sophia Williams', id: 'MED-2026-0152', total: 86, stationScores: 'S1:88 S2:84 S3:90 S4:85 S5:82 S6:87 S7:83 S8:80 S9:86 S10:85 S11:89 S12:84', status: 'Exceeds Benchmark' },
  { learner: 'Liam Johnson', id: 'MED-2026-0161', total: 71, stationScores: 'S1:75 S2:68 S3:80 S4:72 S5:66 S6:74 S7:70 S8:64 S9:73 S10:69 S11:77 S12:70', status: 'Below Benchmark' },
  { learner: 'Ava Martinez', id: 'MED-2026-0174', total: 83, stationScores: 'S1:85 S2:80 S3:87 S4:82 S5:79 S6:84 S7:81 S8:78 S9:85 S10:82 S11:86 S12:81', status: 'Meets Benchmark' },
  { learner: 'Maya Okafor', id: 'MED-2026-0184', total: 74, stationScores: 'S1:76 S2:71 S3:82 S4:73 S5:70 S6:76 S7:72 S8:67 S9:75 S10:71 S11:79 S12:72', status: 'Below Benchmark' },
];

export default function ResultsPage() {
  const navigate = useNavigate();
  const { addAudit } = useAppData();
  const { toast } = useToast();
  const [batches, setBatches] = useState(BATCHES);
  const [confirm, setConfirm] = useState<ResultBatch | null>(null);
  const [confirmStep, setConfirmStep] = useState(1);

  const openConfirm = (b: ResultBatch) => {
    setConfirm(b);
    setConfirmStep(1);
  };

  const confirmRelease = () => {
    if (!confirm) return;
    if (confirmStep === 1) {
      setConfirmStep(2);
      return;
    }
    setBatches((prev) => prev.map((b) => (b.id === confirm.id ? { ...b, status: 'Released' } : b)));
    addAudit({ user: 'Dr. Margaret Sullivan', role: 'Dean / Executive', module: 'Assessments', action: 'Released', record: confirm.name, ipDevice: '192.168.1.24 · Desktop', outcome: 'Success' });
    toast(`${confirm.name} results released to learners`);
    setConfirm(null);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Assessments', path: '/assessments' }, { label: 'Results Approval' }]}
        title="Results Approval"
        subtitle="Dual confirmation required before any assessment results are released to learners"
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card title="Result Batches" subtitle="Dual confirmation workflow" className="xl:col-span-2" bodyClass="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line-100">
                {['Batch', 'Type', 'Cohort', 'Records', 'Average', 'Status', 'Action'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id} className="border-b border-line-50 last:border-0 hover:bg-canvas-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-ink-900 max-w-[260px] truncate">{b.name}</td>
                  <td className="px-4 py-3 text-[13px] text-ink-600">{b.type}</td>
                  <td className="px-4 py-3 text-[13px] text-ink-600">{b.cohort}</td>
                  <td className="px-4 py-3 text-[13px] tabular-nums">{b.records}</td>
                  <td className="px-4 py-3 text-[13px] tabular-nums">{b.average}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    {b.status !== 'Released' ? (
                      <button onClick={() => openConfirm(b)} className="text-xs font-medium text-clinic-700 bg-clinic-50 border border-clinic-200 rounded-md px-2.5 py-1.5 hover:bg-clinic-100 whitespace-nowrap">Review & Release</button>
                    ) : (
                      <span className="text-[11px] text-green-700 flex items-center gap-1"><i className="ri-check-double-line" /> Released</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Validation Checks" subtitle="Passed before results can be released">
          <div className="space-y-2.5">
            {[
              { label: 'All scores entered and locked', ok: true },
              { label: 'Critical-failure items reviewed', ok: true },
              { label: 'Grading exceptions resolved', ok: true },
              { label: 'Benchmark flags validated', ok: true },
              { label: 'Examiner comments complete', ok: false },
            ].map((c) => (
              <div key={c.label} className={`flex items-center gap-2.5 p-3 rounded-lg border text-[13px] ${c.ok ? 'border-green-200 bg-green-50/50 text-ink-700' : 'border-amber-200 bg-amber-50/50 text-ink-700'}`}>
                <i className={`${c.ok ? 'ri-checkbox-circle-line text-green-600' : 'ri-time-line text-amber-600'}`} />
                {c.label}
                {!c.ok && <StatusBadge status="Pending" tone="amber" />}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Grade-Entry Grid" subtitle="OSCE Clinical Skills Assessment - Fall · Class of 2028 (sample)" bodyClass="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line-100">
                {['Learner', 'ID', 'Total Score', 'Benchmark', 'Station Breakdown'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GRADE_ROWS.map((g) => (
                <tr key={g.id} className="border-b border-line-50 last:border-0 hover:bg-canvas-50 transition-colors cursor-pointer" onClick={() => navigate(`/learners/${g.id}`)}>
                  <td className="px-4 py-3 text-sm font-medium text-ink-900">{g.learner}</td>
                  <td className="px-4 py-3 text-xs text-ink-500">{g.id}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-ink-900 tabular-nums">{g.total}</td>
                  <td className="px-4 py-3"><StatusBadge status={g.status} tone={g.status === 'Exceeds Benchmark' ? 'green' : g.status === 'Meets Benchmark' ? 'blue' : 'red'} /></td>
                  <td className="px-4 py-3 text-[11px] text-ink-500 truncate max-w-[260px]">{g.stationScores}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {confirm && (
        <Modal
          title={`Release Results · ${confirm.name}`}
          subtitle={confirmStep === 1 ? 'Step 1 of 2 - Confirm result accuracy' : 'Step 2 of 2 - Final confirmation required'}
          onClose={() => setConfirm(null)}
          size="md"
          footer={
            <>
              {confirmStep === 2 && <button onClick={() => setConfirmStep(1)} className={btnSecondaryCls}>Back</button>}
              <button onClick={confirmRelease} className={btnPrimaryCls}>
                {confirmStep === 1 ? 'Continue to Confirmation' : 'Release Results'}
              </button>
            </>
          }
        >
          {confirmStep === 1 ? (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-line-200 rounded-lg p-3"><p className="text-[11px] text-ink-400">Records</p><p className="font-semibold text-ink-900 text-lg">{confirm.records}</p></div>
                <div className="border border-line-200 rounded-lg p-3"><p className="text-[11px] text-ink-400">Average</p><p className="font-semibold text-ink-900 text-lg">{confirm.average}</p></div>
              </div>
              <div className="flex items-start gap-2 text-xs text-ink-600 bg-canvas-100 border border-line-200 rounded-lg p-3">
                <i className="ri-information-line mt-0.5 text-clinic-700" />
                You are reviewing the finalized score set. Confirm that grading is complete and validation checks pass before proceeding.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg border border-red-200 bg-red-50/50">
                <i className="ri-error-warning-line text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-700">Final confirmation required</p>
                  <p className="text-[13px] text-ink-700 mt-1">Releasing results is a sensitive action. This decision is recorded in the audit log with your identity, role, and device.</p>
                </div>
              </div>
              <label className="flex items-start gap-2.5 p-3 rounded-md border border-line-200 cursor-pointer hover:border-clinic-300">
                <input type="checkbox" className="mt-0.5 accent-clinic-700" onChange={(e) => {}} defaultChecked={false} />
                <span className="text-[13px] text-ink-700">I confirm the scores are accurate and authorize release to all learners in this batch.</span>
              </label>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}