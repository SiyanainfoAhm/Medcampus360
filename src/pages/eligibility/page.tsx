import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import Avatar from '@/components/base/Avatar';
import StatusBadge from '@/components/base/StatusBadge';
import ProgressBar from '@/components/base/ProgressBar';
import Modal from '@/components/base/Modal';
import { btnPrimaryCls, btnSecondaryCls, selectCls } from '@/components/base/Field';
import { useAppData } from '@/context/AppDataContext';
import { useToast } from '@/context/ToastContext';
import { ATTENDANCE_THRESHOLD } from '@/mocks/attendance';

type Eligibility = 'Eligible' | 'Conditionally Eligible' | 'Not Eligible' | 'Review Required';

export default function EligibilityPage() {
  const navigate = useNavigate();
  const { learners, caseLogs, getCompStatus } = useAppData();
  const { toast } = useToast();
  const [params, setParams] = useSearchParams();
  const learnerId = params.get('learner') || 'MED-2026-0147';
  const learner = learners.find((l) => l.id === learnerId);
  const [showReview, setShowReview] = useState(false);

  const blockedList = useMemo(
    () => learners.filter((l) => l.attendanceOverall < ATTENDANCE_THRESHOLD || l.risk).slice(0, 12),
    [learners]
  );

  if (!learner) {
    return (
      <div className="animate-fade-in">
        <PageHeader crumbs={[{ label: 'Attendance', path: '/attendance' }, { label: 'Eligibility Review' }]} title="Learner not found" />
      </div>
    );
  }

  const approvedLogs = caseLogs.filter((c) => c.learnerId === learner.id && (c.status === 'Approved' || c.status === 'Competency Credited')).length;
  const requiredCompetencies = 6; // per current clerkship
  const competencyMet = learner.competencyAchieved >= 73;
  const assessmentComplete = true;
  const balanceOutstanding = false;

  const blocking: string[] = [];
  if (learner.attendanceOverall < ATTENDANCE_THRESHOLD) blocking.push(`Clinical attendance ${learner.attendanceClinical}% is below the ${ATTENDANCE_THRESHOLD}% requirement`);
  if (learner.standing === 'Intervention Required') blocking.push('Active intervention plan — standing review required before eligibility can be granted');
  if (learner.standing === 'Academic Probation') blocking.push('Academic probation standing');

  const eligibility: Eligibility = blocking.length === 0 ? 'Eligible' : learner.standing === 'Intervention Required' ? 'Not Eligible' : 'Review Required';

  const requirementRows = [
    { label: 'Attendance requirement', detail: `Minimum ${ATTENDANCE_THRESHOLD}% overall attendance`, current: `${learner.attendanceOverall}%`, met: learner.attendanceOverall >= ATTENDANCE_THRESHOLD },
    { label: 'Clinical attendance', detail: `Minimum ${ATTENDANCE_THRESHOLD}% clinical attendance`, current: `${learner.attendanceClinical}%`, met: learner.attendanceClinical >= ATTENDANCE_THRESHOLD },
    { label: 'Required competencies', detail: `Core clerkship competencies credited (${requiredCompetencies} required)`, current: `${Math.min(requiredCompetencies, Math.max(1, Math.round((learner.competencyAchieved / 96) * requiredCompetencies)))}/${requiredCompetencies}`, met: competencyMet },
    { label: 'Assessment completion', detail: 'OSCE and written assessments completed', current: 'Complete', met: assessmentComplete },
    { label: 'Outstanding balance', detail: 'No outstanding institutional balance', current: balanceOutstanding ? 'Outstanding' : 'None', met: !balanceOutstanding },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Attendance' }, { label: 'Eligibility Review' }]}
        title="Assessment Eligibility"
        subtitle="Eligibility determination for scheduled assessments and clinical activities"
        actions={
          <select className={selectCls + ' !w-64'} value={learner.id} onChange={(e) => setParams(e.target.value ? { learner: e.target.value } : {})} aria-label="Select learner">
            {learners.slice(0, 40).map((l) => <option key={l.id} value={l.id}>{l.name} · {l.id}</option>)}
          </select>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card title="Eligibility Determination" subtitle={`${learner.name} · ${learner.id} · ${learner.program}`}>
            <div className="flex items-center gap-5 pb-5 border-b border-line-100 mb-5">
              <Avatar name={learner.name} photo={learner.photo} size={56} />
              <div className="flex-1">
                <p className="text-base font-semibold text-ink-900">{learner.name}</p>
                <p className="text-[13px] text-ink-500">{learner.cohort} · {learner.phase}</p>
              </div>
              <StatusBadge
                status={eligibility}
                tone={eligibility === 'Eligible' ? 'green' : eligibility === 'Conditionally Eligible' ? 'blue' : eligibility === 'Not Eligible' ? 'red' : 'amber'}
              />
            </div>

            <div className="space-y-4">
              {requirementRows.map((r) => (
                <div key={r.label} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-medium text-ink-800">{r.label}</p>
                      <p className={`text-xs font-semibold tabular-nums ${r.met ? 'text-green-700' : 'text-red-600'}`}>{r.current}</p>
                    </div>
                    <p className="text-[11px] text-ink-400 mt-0.5">{r.detail}</p>
                  </div>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${r.met ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    <i className={`${r.met ? 'ri-check-line' : 'ri-close-line'} text-sm`} />
                  </span>
                </div>
              ))}
            </div>

            {blocking.length > 0 && (
              <div className="mt-5 border border-red-200 bg-red-50/50 rounded-lg p-4">
                <p className="text-sm font-semibold text-red-700 flex items-center gap-2"><i className="ri-close-circle-line" /> Blocking reasons ({blocking.length})</p>
                <ul className="mt-2 space-y-1.5">
                  {blocking.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-ink-700"><span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-1.5 flex-shrink-0" />{b}</li>
                  ))}
                </ul>
              </div>
            )}
            {blocking.length === 0 && (
              <div className="mt-5 border border-green-200 bg-green-50/50 rounded-lg p-4 flex items-center gap-2 text-sm text-green-800">
                <i className="ri-check-double-line" /> All eligibility requirements are satisfied.
              </div>
            )}
          </Card>

          <Card title="Remediation Path" subtitle="Actions to restore eligibility">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {blocking.length > 0 ? (
                blocking.map((b, i) => (
                  <div key={i} className="border border-line-200 rounded-lg p-4">
                    <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Block {i + 1}</p>
                    <p className="text-[13px] text-ink-700 mt-1">{b}</p>
                    <button
                      onClick={() => {
                        toast('Remediation plan initiated — advisor notified');
                        setShowReview(true);
                      }}
                      className="mt-3 text-xs font-medium text-clinic-700 hover:text-clinic-800 flex items-center gap-1"
                    >
                      <i className="ri-file-edit-line" /> Open remediation plan
                    </button>
                  </div>
                ))
              ) : (
                <div className="md:col-span-3 py-6 text-center text-sm text-ink-400">No remediation required — learner is eligible.</div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Learners Not Eligible" subtitle="Below threshold or requiring review">
            <div className="space-y-1.5">
              {blockedList.map((l) => (
                <button key={l.id} onClick={() => setParams({ learner: l.id })} className={`w-full flex items-center gap-3 p-2.5 rounded-md hover:bg-canvas-50 transition-colors text-left ${l.id === learner.id ? 'bg-clinic-50 border border-clinic-200' : ''}`}>
                  <Avatar name={l.name} photo={l.photo} size={30} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-ink-900 truncate">{l.name}</p>
                    <p className="text-[11px] text-ink-400">{l.id} · {l.attendanceOverall}% attendance</p>
                  </div>
                  <StatusBadge status={l.standing === 'Intervention Required' ? 'Not Eligible' : 'Review Required'} tone={l.standing === 'Intervention Required' ? 'red' : 'amber'} />
                </button>
              ))}
            </div>
          </Card>

          <Card title="Eligibility Labels" subtitle="How results are categorized">
            <div className="space-y-2.5">
              {[
                { s: 'Eligible', d: 'All requirements met', t: 'green' as const },
                { s: 'Conditionally Eligible', d: 'Minor exceptions approved', t: 'blue' as const },
                { s: 'Review Required', d: 'Documentation pending', t: 'amber' as const },
                { s: 'Not Eligible', d: 'Blocking reasons active', t: 'red' as const },
              ].map((e) => (
                <div key={e.s} className="flex items-center justify-between border border-line-200 rounded-lg p-3">
                  <div>
                    <StatusBadge status={e.s} tone={e.t} />
                    <p className="text-[11px] text-ink-400 mt-1">{e.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {showReview && (
        <Modal title="Remediation Plan" subtitle={`${learner.name} · ${learner.id}`} onClose={() => setShowReview(false)} size="md"
          footer={
            <>
              <button onClick={() => setShowReview(false)} className={btnSecondaryCls}>Cancel</button>
              <button
                onClick={() => {
                  toast('Remediation plan approved — learner and advisor notified');
                  setShowReview(false);
                }}
                className={btnPrimaryCls}
              >
                <i className="ri-check-line" /> Approve Plan
              </button>
            </>
          }
        >
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-2 text-ink-600 bg-canvas-100 border border-line-200 rounded-lg p-3">
              <i className="ri-information-line mt-0.5 text-clinic-700" />
              <div>
                <p className="font-medium text-ink-800">Recommended actions</p>
                <ul className="mt-2 space-y-1.5">
                  <li>• Attend 4 additional clinical sessions to raise clinical attendance to the 85% threshold</li>
                  <li>• Complete competency EPA-01 assessment during Internal Medicine ward rounds</li>
                  <li>• Weekly check-in with advisor Dr. James Whitfield for 4 weeks</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center justify-between border-b border-line-50 pb-2">
              <span className="text-ink-500">Plan owner</span><span className="font-medium text-ink-900">{learner.advisor}</span>
            </div>
            <div className="flex items-center justify-between border-b border-line-50 pb-2">
              <span className="text-ink-500">Review date</span><span className="font-medium text-ink-900">09/01/2026</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}