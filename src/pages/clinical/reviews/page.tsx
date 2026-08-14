import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import Avatar from '@/components/base/Avatar';
import StatusBadge from '@/components/base/StatusBadge';
import Modal from '@/components/base/Modal';
import { Field, inputCls, selectCls, btnPrimaryCls, btnSecondaryCls } from '@/components/base/Field';
import { useAppData } from '@/context/AppDataContext';
import { useRole } from '@/context/RoleContext';
import { useToast } from '@/context/ToastContext';
import { COMPETENCIES } from '@/mocks/competencies';
import { ENTRUSTMENT_LEVELS, RUBRIC_LEVELS } from '@/mocks/assessments';
import type { CaseLog } from '@/utils/dataset';

export default function ReviewsPage() {
  const navigate = useNavigate();
  const { caseLogs, faculty, learners, requestRevision, approveCaseLog } = useAppData();
  const { currentRole } = useRole();
  const { toast } = useToast();
  const [selected, setSelected] = useState<CaseLog | null>(null);
  const [tab, setTab] = useState<'pending' | 'completed'>('pending');

  const pending = useMemo(
    () =>
      caseLogs
        .filter((c) => c.status === 'Submitted' || c.status === 'Revision Requested')
        .filter((c) => (currentRole?.id === 'faculty' ? c.preceptor === currentRole.personaName : true))
        .sort((a, b) => b.encounterDate.localeCompare(a.encounterDate)),
    [caseLogs, currentRole]
  );

  const completed = useMemo(
    () =>
      caseLogs
        .filter((c) => c.status === 'Approved' || c.status === 'Competency Credited')
        .filter((c) => (currentRole?.id === 'faculty' ? c.preceptor === currentRole.personaName : true))
        .slice(0, 12),
    [caseLogs, currentRole]
  );

  const queueByFaculty = useMemo(() => {
    const map = new Map<string, CaseLog[]>();
    pending.forEach((c) => map.set(c.preceptor, [...(map.get(c.preceptor) || []), c]));
    return Array.from(map.entries()).map(([name, logs]) => ({ name, logs }));
  }, [pending]);

  const tabCls = (active: boolean) => `px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-colors ${active ? 'bg-navy-900 text-white' : 'text-ink-600 hover:bg-canvas-200'}`;

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Clinical Education', path: '/clinical' }, { label: 'Faculty Reviews' }]}
        title="Faculty Review Queue"
        subtitle={`${pending.length} submissions awaiting preceptor review · ${currentRole?.id === 'faculty' ? `reviewing as ${currentRole.personaName}` : 'all preceptors'}`}
        actions={
          <>
            <button onClick={() => setTab('pending')} className={tabCls(tab === 'pending')}>Pending ({pending.length})</button>
            <button onClick={() => setTab('completed')} className={tabCls(tab === 'completed')}>Completed</button>
          </>
        }
      />

      {tab === 'pending' && (
        <div className="space-y-6">
          {queueByFaculty.map(({ name, logs }) => (
            <Card
              key={name}
              title={`${name} · ${logs.length} pending`}
              subtitle={faculty.find((f) => f.name === name)?.department || 'Faculty Preceptor'}
              actions={<Avatar name={name} size={34} />}
              bodyClass="p-0"
            >
              <div className="divide-y divide-line-50">
                {logs.map((c) => {
                  const learner = learners.find((l) => l.id === c.learnerId);
                  return (
                    <div key={c.id} className="flex items-center gap-4 px-4 py-3 hover:bg-canvas-50 transition-colors">
                      <div className="w-32 shrink-0">
                        <p className="text-xs font-semibold text-navy-800">{c.id}</p>
                        <p className="text-[11px] text-ink-400 mt-0.5">{c.encounterDate}</p>
                      </div>
                      <Avatar name={c.learnerName} photo={learner?.photo} size={32} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-900">{c.learnerName}</p>
                        <p className="text-[11px] text-ink-500 truncate">{c.rotation} · {c.category} · {c.setting}</p>
                      </div>
                      <span className="hidden lg:block max-w-[220px] text-[11px] text-ink-500 truncate">{c.summary}</span>
                      <StatusBadge status={c.status} />
                      <button onClick={() => setSelected(c)} className={`${btnPrimaryCls} !h-9 !px-3 text-xs`}>
                        Review
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
          {queueByFaculty.length === 0 && (
            <Card title="Review queue is clear" subtitle="No submissions currently awaiting review for this role.">
              <div className="py-10 text-center">
                <span className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-3"><i className="ri-check-double-line text-xl" /></span>
                <p className="text-sm text-ink-600">All case logs have been reviewed.</p>
                <button onClick={() => navigate('/clinical/case-logs')} className="mt-4 text-xs font-medium text-clinic-700 hover:text-clinic-800">Open case log console</button>
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === 'completed' && (
        <Card title="Recently Completed Reviews" bodyClass="p-0">
          <div className="divide-y divide-line-50">
            {completed.map((c) => (
              <div key={c.id} className="flex items-center gap-4 px-4 py-3">
                <p className="w-32 text-xs font-semibold text-navy-800 shrink-0">{c.id}</p>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink-900">{c.learnerName}</p>
                  <p className="text-[11px] text-ink-500 truncate">{c.category} · {c.competencies.join(', ')}</p>
                </div>
                {c.feedback && <p className="hidden lg:block max-w-[240px] text-[11px] text-ink-500 truncate">{c.feedback}</p>}
                <StatusBadge status={c.status} />
                <button onClick={() => setSelected(c)} className="text-xs font-medium text-clinic-700 hover:text-clinic-800">View</button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {selected && (
        <ReviewModal
          log={selected}
          onClose={() => setSelected(null)}
          onRequestRevision={(feedback) => {
            requestRevision(selected.id, feedback);
            toast('Revision requested — feedback sent to learner');
            setSelected(null);
          }}
          onApprove={() => {
            approveCaseLog(selected.id);
            toast('Submission approved — competency credited and evidence recorded');
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}

function ReviewModal({ log, onClose, onRequestRevision, onApprove }: { log: CaseLog; onClose: () => void; onRequestRevision: (f: string) => void; onApprove: () => void }) {
  const { learners } = useAppData();
  const { currentRole } = useRole();
  const learner = learners.find((l) => l.id === log.learnerId);
  const [entrustment, setEntrustment] = useState(3);
  const [rating, setRating] = useState(4);
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [feedback, setFeedback] = useState('');
  const [action, setAction] = useState('Continue building independent practice');
  const [followUp, setFollowUp] = useState('09/01/2026');
  const [ack, setAck] = useState(false);

  return (
    <Modal
      title={`Review ${log.id}`}
      subtitle={`${log.learnerName} · ${log.rotation} · submitted by learner`}
      onClose={onClose}
      size="2xl"
      footer={
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              if (!ack) {
                onRequestRevision('Please address the improvement areas and expand your reflection before resubmission.');
                return;
              }
              onRequestRevision(feedback || 'Please address the improvement areas noted in the assessment and resubmit your reflection.');
            }}
            className="inline-flex items-center gap-1.5 h-10 px-4 text-sm font-medium text-amber-800 bg-amber-50 border border-amber-300 hover:bg-amber-100 rounded-md whitespace-nowrap"
          >
            <i className="ri-arrow-go-back-line" /> Request Revision
          </button>
          <button
            onClick={() => {
              if (!ack) {
                onApprove();
                return;
              }
              onApprove();
            }}
            disabled={!ack}
            className={`${btnPrimaryCls} disabled:opacity-50 disabled:cursor-not-allowed`}
            title={!ack ? 'Acknowledge assessment before approving' : 'Approve and credit competency'}
          >
            <i className="ri-check-double-line" /> Approve & Credit Competency
          </button>
        </div>
      }
    >
      {/* Case log summary */}
      <div className="bg-canvas-100 border border-line-200 rounded-lg p-4 mb-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div><p className="text-[11px] font-semibold text-ink-400 uppercase">Learner</p><p className="font-medium text-ink-800 mt-0.5">{log.learnerName}</p></div>
          <div><p className="text-[11px] font-semibold text-ink-400 uppercase">Encounter</p><p className="font-medium text-ink-800 mt-0.5">{log.encounterDate} · {log.setting}</p></div>
          <div><p className="text-[11px] font-semibold text-ink-400 uppercase">Category</p><p className="font-medium text-ink-800 mt-0.5">{log.category}</p></div>
          <div><p className="text-[11px] font-semibold text-ink-400 uppercase">Participation</p><p className="font-medium text-ink-800 mt-0.5">{log.participation}</p></div>
        </div>
        <p className="text-[13px] text-ink-700 leading-relaxed mt-3">{log.summary}</p>
        <p className="text-[11px] text-ink-400 mt-2">Attendance {learner?.attendanceClinical || 82}% · Competency progress {learner?.competencyProgress || 76}%</p>
      </div>

      {/* Competency assessment */}
      <h4 className="text-sm font-semibold text-ink-900 mb-1">Competency Assessment</h4>
      <p className="text-xs text-ink-500 mb-4">Complete the assessment for the competency linked to this submission. {currentRole?.personaName} · electronic acknowledgement required before approval.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Competency">
          <select className={selectCls} defaultValue={log.competencies[0] || 'EPA-01'}>
            {COMPETENCIES.filter((c) => c.code === log.competencies[0] || c.domain === 'Entrustable Professional Activities').map((c) => (
              <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Clinical context">
          <input className={inputCls} defaultValue={`${log.setting} - ${log.category}`} />
        </Field>

        <Field label="Entrustment level" hint="Level of supervision at which the learner performed">
          <div className="space-y-1.5">
            {ENTRUSTMENT_LEVELS.map((l) => (
              <label key={l.level} className={`flex items-start gap-2.5 p-2.5 rounded-md border cursor-pointer transition-colors ${entrustment === l.level ? 'border-clinic-400 bg-clinic-50' : 'border-line-200 hover:border-line-300'}`}>
                <input type="radio" checked={entrustment === l.level} onChange={() => setEntrustment(l.level)} className="mt-1 accent-clinic-700" />
                <span>
                  <span className="text-[13px] font-medium text-ink-800 block">Level {l.level} · {l.label}</span>
                  <span className="text-[11px] text-ink-500 block mt-0.5">{l.anchor}</span>
                </span>
              </label>
            ))}
          </div>
        </Field>

        <div className="space-y-4">
          <Field label="Rating" hint="Overall performance on this activity">
            <div className="space-y-1.5">
              {RUBRIC_LEVELS.map((l) => (
                <label key={l.level} className={`flex items-start gap-2.5 p-2.5 rounded-md border cursor-pointer transition-colors ${rating === l.level ? 'border-clinic-400 bg-clinic-50' : 'border-line-200 hover:border-line-300'}`}>
                  <input type="radio" checked={rating === l.level} onChange={() => setRating(l.level)} className="mt-1 accent-clinic-700" />
                  <span>
                    <span className="text-[13px] font-medium text-ink-800 block">Level {l.level} · {l.label}</span>
                    <span className="text-[11px] text-ink-500 block mt-0.5">{l.anchor}</span>
                  </span>
                </label>
              ))}
            </div>
          </Field>
        </div>

        <Field label="Strengths" className="md:col-span-2">
          <textarea className="w-full h-20 px-3 py-2 text-sm border border-line-200 rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-500" maxLength={500} value={strengths} onChange={(e) => setStrengths(e.target.value)} placeholder="Behavioral anchors observed - what the learner did well..." />
        </Field>
        <Field label="Improvement areas" className="md:col-span-2">
          <textarea className="w-full h-20 px-3 py-2 text-sm border border-line-200 rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-500" maxLength={500} value={improvements} onChange={(e) => setImprovements(e.target.value)} placeholder="Specific areas for the learner to develop..." />
        </Field>

        <Field label="Recommended action">
          <select className={selectCls} value={action} onChange={(e) => setAction(e.target.value)}>
            <option>Continue building independent practice</option>
            <option>Additional direct observation required</option>
            <option>Repeat simulation session</option>
            <option>Competency achieved - credit</option>
          </select>
        </Field>
        <Field label="Follow-up date">
          <input type="date" className={inputCls} value={followUp.split('/').reverse().join('-')} onChange={(e) => {
            const [y, m, d] = e.target.value.split('-');
            setFollowUp(`${m}/${d}/${y}`);
          }} />
        </Field>

        <Field label="Feedback to learner" className="md:col-span-2">
          <textarea className="w-full h-20 px-3 py-2 text-sm border border-line-200 rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-500" maxLength={500} value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Your feedback will be shared with the learner..." />
        </Field>

        <label className="md:col-span-2 flex items-start gap-2.5 p-3 rounded-md border border-line-200 cursor-pointer hover:border-clinic-300 transition-colors">
          <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-0.5 accent-clinic-700" />
          <span className="text-[13px] text-ink-700">
            I acknowledge that this assessment reflects direct observation of this learner&apos;s performance, and I accept accountability for the entrustment decision recorded above.
          </span>
        </label>
      </div>
    </Modal>
  );
}