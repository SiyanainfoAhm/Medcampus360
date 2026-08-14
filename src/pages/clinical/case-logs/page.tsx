import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import DataTable from '@/components/base/DataTable';
import StatusBadge from '@/components/base/StatusBadge';
import Modal from '@/components/base/Modal';
import ConfirmDialog from '@/components/base/ConfirmDialog';
import { Field, inputCls, selectCls, btnPrimaryCls, btnSecondaryCls, btnDangerCls } from '@/components/base/Field';
import { useAppData } from '@/context/AppDataContext';
import { useRole } from '@/context/RoleContext';
import { useToast } from '@/context/ToastContext';
import { CASE_CATEGORIES, CASE_SETTINGS, AGE_GROUPS, PARTICIPATION_LEVELS, CASE_LOG_FIELDS } from '@/mocks/clinical';
import { COMPETENCIES } from '@/mocks/competencies';
import { printHtml, LETTERHEAD } from '@/utils/print';
import type { CaseLog } from '@/utils/dataset';
import { TODAY, baseRotationName } from '@/utils/dataset';

const filterCls = 'h-9 px-3 text-[13px] border border-line-200 rounded-md bg-white text-ink-700 focus:outline-none focus:ring-2 focus:ring-clinic-500 cursor-pointer';

export default function CaseLogsPage() {
  const navigate = useNavigate();
  const { caseLogs, learners, addCaseLog, removeCaseLog, submitCaseLog, requestRevision, approveCaseLog, getLearnerById } = useAppData();
  const { currentRole } = useRole();
  const { toast } = useToast();
  const [params] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<CaseLog | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [toDelete, setToDelete] = useState<CaseLog | null>(null);
  const [revisionText, setRevisionText] = useState('');
  const [resubmitText, setResubmitText] = useState('');
  const [submitting, setSubmitting] = useState<string | null>(null);

  const learnerFilter = params.get('learner');
  const rotationFilter = params.get('rotation');

  const filtered = useMemo(() => {
    let list = caseLogs;
    if (statusFilter !== 'All Statuses') list = list.filter((c) => c.status === statusFilter);
    if (categoryFilter !== 'All Categories') list = list.filter((c) => c.category === categoryFilter);
    if (learnerFilter) list = list.filter((c) => c.learnerId === learnerFilter);
    if (rotationFilter) {
      const base = baseRotationName(rotationFilter);
      list = list.filter((c) => c.rotation === rotationFilter || c.rotation === base);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.id.toLowerCase().includes(q) || c.learnerName.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q));
    }
    return list;
  }, [caseLogs, statusFilter, categoryFilter, learnerFilter, rotationFilter, search]);

  const canReview = currentRole?.permissions.includes('Approve') && (currentRole?.id === 'faculty' || currentRole?.id === 'dean' || currentRole?.id === 'program-admin');
  const isLearner = currentRole?.id === 'learner';

  const runAction = async (fn: () => void, key: string, message: string) => {
    setSubmitting(key);
    setTimeout(() => {
      fn();
      setSubmitting(null);
      toast(message);
      setSelected(null);
    }, 500);
  };

  const printLog = (log: CaseLog) => {
    const learner = getLearnerById(log.learnerId);
    printHtml(
      `Case Log ${log.id}`,
      `${LETTERHEAD}
      <div class="doc-title">Clinical Case Log - ${log.id}</div>
      <div class="meta">
        <div class="item"><div class="label">Learner</div><div class="value">${log.learnerName}</div></div>
        <div class="item"><div class="label">Learner ID</div><div class="value">${log.learnerId}</div></div>
        <div class="item"><div class="label">Program</div><div class="value">${learner?.program || ''}</div></div>
        <div class="item"><div class="label">Rotation</div><div class="value">${log.rotation}</div></div>
      </div>
      <table>
        <tr><th style="width:30%">Encounter date</th><td>${log.encounterDate}</td></tr>
        <tr><th>Clinical setting</th><td>${log.setting}</td></tr>
        <tr><th>Service / department</th><td>${log.service}</td></tr>
        <tr><th>Case category</th><td>${log.category}</td></tr>
        <tr><th>Learner participation level</th><td>${log.participation}</td></tr>
        <tr><th>Competencies</th><td>${log.competencies.join(', ')}</td></tr>
        <tr><th>Submission status</th><td>${log.status}</td></tr>
      </table>
      <div class="section">De-identified case summary</div>
      <p style="font-size:13px; line-height:1.6;">${log.summary}</p>
      <div class="section">Learning reflection</div>
      <p style="font-size:13px; line-height:1.6;">${log.reflection}</p>
      <div class="section">Preceptor feedback</div>
      <p style="font-size:13px; line-height:1.6;">${log.feedback || 'Pending review.'}</p>
      <div class="sign">
        <div class="block">Learner signature<div class="line">${log.learnerName}</div></div>
        <div class="block">Preceptor signature<div class="line">${log.preceptor}</div></div>
      </div>
      <div class="footer">Northbridge University School of Medicine · MedCampus 360 · De-identified clinical education record · No patient-identifying information is stored.</div>`
    );
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Clinical Education', path: '/clinical' }, { label: 'Case Logs' }]}
        title="Clinical Case Logs"
        subtitle={`${caseLogs.length.toLocaleString('en-US')} de-identified case logs · submitted by learners and reviewed by faculty preceptors`}
        actions={
          <button onClick={() => setShowNew(true)} className={btnPrimaryCls}>
            <i className="ri-add-line" /> New Case Log
          </button>
        }
      />

      <Card bodyClass="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Filters</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={filterCls} aria-label="Status">
            <option>All Statuses</option>
            <option>Draft</option>
            <option>Submitted</option>
            <option>Revision Requested</option>
            <option>Approved</option>
            <option>Competency Credited</option>
          </select>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={filterCls} aria-label="Category">
            <option>All Categories</option>
            {CASE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          {learnerFilter && <span className="text-xs font-medium text-clinic-700 bg-clinic-50 border border-clinic-200 rounded-full px-2.5 py-1">Filtered to learner {learnerFilter} · <button className="underline" onClick={() => navigate('/clinical/case-logs')}>clear</button></span>}
          <span className="ml-auto text-xs text-ink-500"><span className="font-semibold text-ink-800 tabular-nums">{filtered.length.toLocaleString('en-US')}</span> logs</span>
        </div>
      </Card>

      <div className="mt-5">
        <DataTable<CaseLog>
          data={filtered}
          rowKey={(c) => c.id}
          searchKeys={['id', 'learnerName', 'category']}
          searchPlaceholder="Search case logs by ID, learner, or category..."
          pageSize={12}
          onRowClick={(c) => setSelected(c)}
          columns={[
            { key: 'id', label: 'Case-log ID', sortValue: (c) => c.id, render: (c) => <span className="text-xs font-semibold text-navy-800">{c.id}</span> },
            { key: 'learnerName', label: 'Learner', sortValue: (c) => c.learnerName, render: (c) => <span className="text-sm font-medium text-ink-900">{c.learnerName}</span> },
            { key: 'encounterDate', label: 'Encounter Date', sortValue: (c) => c.encounterDate, render: (c) => <span className="text-[13px] text-ink-600">{c.encounterDate}</span> },
            { key: 'setting', label: 'Setting', render: (c) => <span className="text-[13px] text-ink-600">{c.setting}</span> },
            { key: 'category', label: 'Category', sortValue: (c) => c.category, render: (c) => <span className="text-[13px] text-ink-600">{c.category}</span> },
            { key: 'participation', label: 'Participation', render: (c) => <span className="text-[13px] text-ink-600">{c.participation}</span> },
            { key: 'status', label: 'Status', sortValue: (c) => c.status, render: (c) => <StatusBadge status={c.status} /> },
          ]}
        />
      </div>

      {/* Detail modal */}
      {selected && (
        <Modal
          title={`Case Log ${selected.id}`}
          subtitle={`${selected.learnerName} · ${selected.learnerId} · ${selected.rotation}`}
          onClose={() => setSelected(null)}
          size="2xl"
          footer={
            <div className="flex items-center gap-2 flex-wrap">
              {isLearner && selected.status === 'Revision Requested' && (
                <button
                  onClick={() => runAction(() => submitCaseLog(selected.id, resubmitText || selected.reflection), 'resubmit', 'Case log resubmitted for faculty review')}
                  className={btnPrimaryCls}
                  disabled={submitting !== null}
                >
                  {submitting === 'resubmit' ? 'Submitting...' : 'Update Reflection & Resubmit'}
                </button>
              )}
              {canReview && (selected.status === 'Submitted' || selected.status === 'Revision Requested') && (
                <>
                  <button
                    onClick={() => runAction(() => requestRevision(selected.id, revisionText || 'Please expand the reflection and re-attach supporting evidence.'), 'revision', 'Revision requested — feedback sent to learner')}
                    className="inline-flex items-center gap-1.5 h-10 px-4 text-sm font-medium text-amber-800 bg-amber-50 border border-amber-300 hover:bg-amber-100 rounded-md whitespace-nowrap"
                    disabled={submitting !== null}
                  >
                    {submitting === 'revision' ? 'Requesting...' : 'Request Revision'}
                  </button>
                  <button
                    onClick={() => runAction(() => approveCaseLog(selected.id), 'approve', 'Submission approved — competency credited and evidence recorded')}
                    className={btnPrimaryCls}
                    disabled={submitting !== null}
                  >
                    {submitting === 'approve' ? 'Approving...' : 'Approve & Credit Competency'}
                  </button>
                </>
              )}
              <button onClick={() => printLog(selected)} className={btnSecondaryCls}><i className="ri-printer-line" /> Print</button>
              <button onClick={() => setToDelete(selected)} className={btnDangerCls}><i className="ri-delete-bin-line" /> Delete</button>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {[
              ['Case-log ID', selected.id],
              ['Encounter date', selected.encounterDate],
              ['Clinical setting', selected.setting],
              ['Service / department', selected.service],
              ['Case category', selected.category],
              ['Participation level', selected.participation],
              ['Competencies', selected.competencies.join(', ')],
              ['Submission status', selected.status],
            ].map(([k, v]) => (
              <div key={k} className="border-b border-line-50 pb-2">
                <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">{k}</p>
                <p className="text-[13px] font-medium text-ink-800 mt-0.5">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">De-identified case summary</p>
            <p className="text-sm text-ink-700 leading-relaxed mt-1.5">{selected.summary}</p>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Skills observed or performed</p>
            <p className="text-sm text-ink-700 mt-1.5">{selected.skills}</p>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Learning reflection</p>
            {isLearner && selected.status === 'Revision Requested' ? (
              <textarea
                className="mt-1.5 w-full h-28 px-3 py-2 text-sm border border-line-200 rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-500"
                placeholder="Update your reflection based on preceptor feedback..."
                value={resubmitText}
                onChange={(e) => setResubmitText(e.target.value)}
                maxLength={500}
              />
            ) : (
              <p className="text-sm text-ink-700 mt-1.5 leading-relaxed">{selected.reflection}</p>
            )}
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Supporting evidence</p>
            <p className="text-sm text-ink-700 mt-1.5">{selected.evidence}</p>
          </div>

          <div className="mt-5 bg-canvas-100 border border-line-200 rounded-lg p-4">
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Preceptor feedback · {selected.preceptor}</p>
            {canReview && (selected.status === 'Submitted' || selected.status === 'Revision Requested') ? (
              <textarea
                className="mt-2 w-full h-24 px-3 py-2 text-sm border border-line-200 rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-500 bg-white"
                placeholder="Write feedback for the learner, or leave the default note..."
                value={revisionText}
                onChange={(e) => setRevisionText(e.target.value)}
                maxLength={500}
              />
            ) : (
              <p className="text-sm text-ink-700 mt-2">{selected.feedback || 'Pending review.'}</p>
            )}
            {selected.feedbackDate && <p className="text-[11px] text-ink-400 mt-1.5">Reviewed on {selected.feedbackDate}</p>}
          </div>
          <p className="text-[11px] text-ink-400 mt-3 flex items-center gap-1.5">
            <i className="ri-lock-line" /> De-identified record. No patient-identifying information is stored.
          </p>
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete case log"
          message={`Delete ${toDelete.id}? This action is recorded in the audit log and cannot be undone.`}
          confirmLabel="Delete"
          danger
          onConfirm={() => {
            removeCaseLog(toDelete.id);
            toast('Case log deleted');
            setToDelete(null);
            setSelected(null);
          }}
          onCancel={() => setToDelete(null)}
        />
      )}

      {showNew && (
        <NewCaseLogModal
          learners={learners}
          onClose={() => setShowNew(false)}
          onSave={(log) => {
            addCaseLog(log);
            toast('Case log created and submitted for review');
            setShowNew(false);
          }}
        />
      )}
    </div>
  );
}

function NewCaseLogModal({ learners, onClose, onSave }: { learners: { id: string; name: string }[]; onClose: () => void; onSave: (log: CaseLog) => void }) {
  const [form, setForm] = useState({
    learnerId: 'MED-2026-0147',
    encounterDate: TODAY,
    setting: CASE_SETTINGS[0],
    category: CASE_CATEGORIES[0],
    participation: PARTICIPATION_LEVELS[2],
    service: 'Internal Medicine',
    summary: '',
    reflection: '',
    competency: 'EPA-01',
    rotation: 'Internal Medicine Clerkship',
  });
  const [error, setError] = useState('');

  const submit = () => {
    if (!form.summary.trim() || !form.reflection.trim()) {
      setError('Case summary and learning reflection are required.');
      return;
    }
    const learner = learners.find((l) => l.id === form.learnerId);
    onSave({
      id: `IM-CASE-${Math.floor(1000 + Math.random() * 8999)}`,
      learnerId: form.learnerId,
      learnerName: learner?.name || form.learnerId,
      rotation: form.rotation,
      encounterDate: form.encounterDate,
      setting: form.setting,
      service: form.service,
      category: form.category,
      participation: form.participation,
      summary: form.summary,
      skills: form.competency,
      reflection: form.reflection,
      evidence: 'De-identified encounter notes',
      status: 'Submitted',
      competencies: [form.competency],
      preceptor: 'Dr. Emily Chen',
      submittedAt: new Date().toLocaleDateString('en-US'),
      createdAt: form.encounterDate,
    });
  };

  return (
    <Modal title="New Case Log" subtitle="Create a de-identified clinical case log" onClose={onClose} size="2xl"
      footer={
        <>
          <button onClick={onClose} className={btnSecondaryCls}>Cancel</button>
          <button onClick={submit} className={btnPrimaryCls}><i className="ri-send-plane-line" /> Submit for Review</button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Learner" required>
          <select className={selectCls} value={form.learnerId} onChange={(e) => setForm({ ...form, learnerId: e.target.value })}>
            {learners.slice(0, 60).map((l) => <option key={l.id} value={l.id}>{l.name} ({l.id})</option>)}
          </select>
        </Field>
        <Field label="Encounter date" required>
          <input type="date" className={inputCls} value={form.encounterDate.split('/').reverse().join('-')} onChange={(e) => {
            const [y, m, d] = e.target.value.split('-');
            setForm({ ...form, encounterDate: `${m}/${d}/${y}` });
          }} />
        </Field>
        <Field label="Clinical setting">
          <select className={selectCls} value={form.setting} onChange={(e) => setForm({ ...form, setting: e.target.value })}>
            {CASE_SETTINGS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Case category">
          <select className={selectCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CASE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Participation level">
          <select className={selectCls} value={form.participation} onChange={(e) => setForm({ ...form, participation: e.target.value })}>
            {PARTICIPATION_LEVELS.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Primary competency">
          <select className={selectCls} value={form.competency} onChange={(e) => setForm({ ...form, competency: e.target.value })}>
            {COMPETENCIES.slice(0, 24).map((c) => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
          </select>
        </Field>
        <Field label="De-identified case summary" required className="md:col-span-2">
          <textarea className="w-full h-24 px-3 py-2 text-sm border border-line-200 rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-500" maxLength={500} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Age group, setting, presentation, evaluation, and skills observed — no patient identifiers." />
        </Field>
        <Field label="Learning reflection" required className="md:col-span-2">
          <textarea className="w-full h-20 px-3 py-2 text-sm border border-line-200 rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-500" maxLength={500} value={form.reflection} onChange={(e) => setForm({ ...form, reflection: e.target.value })} placeholder="What did you learn? What will you do differently next time?" />
        </Field>
      </div>
      {error && <p className="text-sm text-red-600 mt-4 flex items-center gap-1.5"><i className="ri-error-warning-line" />{error}</p>}
    </Modal>
  );
}