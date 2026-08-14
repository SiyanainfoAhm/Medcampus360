import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import DataTable from '@/components/base/DataTable';
import StatusBadge from '@/components/base/StatusBadge';
import Modal from '@/components/base/Modal';
import { Field, inputCls, selectCls, btnPrimaryCls, btnSecondaryCls } from '@/components/base/Field';
import { useAppData } from '@/context/AppDataContext';
import { useToast } from '@/context/ToastContext';
import { PROCEDURE_NAMES, PROCEDURE_LEVELS } from '@/mocks/clinical';
import type { ProcedureLog } from '@/utils/dataset';
import { TODAY } from '@/utils/dataset';

const filterCls = 'h-9 px-3 text-[13px] border border-line-200 rounded-md bg-white text-ink-700 focus:outline-none focus:ring-2 focus:ring-clinic-500 cursor-pointer';

export default function ProceduresPage() {
  const navigate = useNavigate();
  const { procedures, learners, addProcedure, updateProcedure, addAudit } = useAppData();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState('All Validations');
  const [showNew, setShowNew] = useState(false);

  const filtered = useMemo(() => {
    let list = procedures;
    if (statusFilter !== 'All Validations') list = list.filter((p) => p.validation === statusFilter);
    return list;
  }, [procedures, statusFilter]);

  const counts = useMemo(() => ({
    total: procedures.length,
    validated: procedures.filter((p) => p.validation === 'Validated').length,
    credited: procedures.filter((p) => p.validation === 'Competency Credited').length,
    pending: procedures.filter((p) => p.validation === 'Pending').length,
  }), [procedures]);

  const validate = (p: ProcedureLog) => {
    updateProcedure(p.id, { validation: 'Validated', feedback: 'Validated by supervisor.' });
    addAudit({ user: 'Dr. Emily Chen', role: 'Faculty Preceptor', module: 'Clinical Education', action: 'Validated', record: `Procedure ${p.id}`, ipDevice: '192.168.1.67 · Desktop', outcome: 'Success' });
    toast(`Procedure ${p.id} validated`);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Clinical Education', path: '/clinical' }, { label: 'Procedure Log' }]}
        title="Procedure Log"
        subtitle={`${counts.total.toLocaleString('en-US')} procedure records · performance level, supervisor validation, and competency credit`}
        actions={
          <button onClick={() => setShowNew(true)} className={btnPrimaryCls}>
            <i className="ri-syringe-line" /> Log Procedure
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total procedures', value: counts.total, tone: 'text-navy-800 bg-navy-50' },
          { label: 'Validated', value: counts.validated, tone: 'text-green-700 bg-green-50' },
          { label: 'Competency credited', value: counts.credited, tone: 'text-teal-700 bg-teal-50' },
          { label: 'Awaiting validation', value: counts.pending, tone: 'text-amber-600 bg-amber-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-line-200 rounded-lg p-4">
            <p className={`text-2xl font-semibold tabular-nums ${s.tone.split(' ')[0]}`}>{s.value}</p>
            <p className="text-[13px] text-ink-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <Card bodyClass="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Filters</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={filterCls} aria-label="Validation status">
            <option>All Validations</option>
            <option>Pending</option>
            <option>Validated</option>
            <option>Competency Credited</option>
          </select>
          <span className="ml-auto text-xs text-ink-500"><span className="font-semibold text-ink-800 tabular-nums">{filtered.length}</span> records</span>
        </div>
      </Card>

      <div className="mt-5">
        <DataTable<ProcedureLog>
          data={filtered}
          rowKey={(p) => p.id}
          searchKeys={['id', 'learnerName', 'procedure', 'supervisor']}
          searchPlaceholder="Search by procedure, learner, or supervisor..."
          pageSize={12}
          columns={[
            { key: 'id', label: 'Record', sortValue: (p) => p.id, render: (p) => <span className="text-xs font-semibold text-navy-800">{p.id}</span> },
            { key: 'procedure', label: 'Procedure', sortValue: (p) => p.procedure, render: (p) => <span className="text-sm font-medium text-ink-900">{p.procedure}</span> },
            { key: 'learnerName', label: 'Learner', sortValue: (p) => p.learnerName, render: (p) => (
              <button onClick={() => navigate(`/learners/${p.learnerId}`)} className="text-[13px] text-clinic-700 hover:text-clinic-800">{p.learnerName}</button>
            ) },
            { key: 'date', label: 'Date', sortValue: (p) => p.date, render: (p) => <span className="text-[13px] text-ink-600">{p.date}</span> },
            { key: 'site', label: 'Site', render: (p) => <span className="text-[13px] text-ink-600">{p.site}</span> },
            { key: 'level', label: 'Performance', sortValue: (p) => p.level, render: (p) => <span className="text-[13px] text-ink-600">{p.level}</span> },
            { key: 'attempts', label: 'Attempts', sortValue: (p) => p.attempts, render: (p) => <span className="text-[13px] tabular-nums">{p.attempts}</span> },
            { key: 'supervisor', label: 'Supervisor', render: (p) => <span className="text-[13px] text-ink-600">{p.supervisor}</span> },
            { key: 'outcome', label: 'Outcome', render: (p) => <span className="text-[13px] text-ink-600">{p.outcome}</span> },
            { key: 'validation', label: 'Validation', sortValue: (p) => p.validation, render: (p) => <StatusBadge status={p.validation} /> },
            {
              key: 'actions',
              label: '',
              render: (p) =>
                p.validation === 'Pending' ? (
                  <button onClick={() => validate(p)} className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md px-2.5 py-1.5 hover:bg-green-100 whitespace-nowrap">
                    Validate
                  </button>
                ) : (
                  <span className="text-[11px] text-ink-400">{p.feedback}</span>
                ),
            },
          ]}
        />
      </div>

      {showNew && (
        <NewProcedureModal
          learners={learners.map((l) => ({ id: l.id, name: l.name }))}
          onClose={() => setShowNew(false)}
          onSave={(p) => {
            addProcedure(p);
            toast('Procedure logged and submitted for validation');
            setShowNew(false);
          }}
        />
      )}
    </div>
  );
}

function NewProcedureModal({ learners, onClose, onSave }: { learners: { id: string; name: string }[]; onClose: () => void; onSave: (p: ProcedureLog) => void }) {
  const [form, setForm] = useState({
    learnerId: 'MED-2026-0147',
    procedure: PROCEDURE_NAMES[0],
    date: TODAY,
    level: PROCEDURE_LEVELS[1],
    attempts: 1,
    supervisor: 'Dr. Emily Chen',
    outcome: 'Successful',
  });
  const submit = () => {
    const learner = learners.find((l) => l.id === form.learnerId);
    onSave({
      id: `PRC-${Math.floor(2000 + Math.random() * 7000)}`,
      learnerId: form.learnerId,
      learnerName: learner?.name || form.learnerId,
      procedure: form.procedure,
      date: form.date,
      site: 'Northbridge University Medical Center',
      level: form.level,
      attempts: form.attempts,
      supervisor: form.supervisor,
      outcome: form.outcome,
      feedback: 'Awaiting supervisor validation.',
      validation: 'Pending',
    });
  };
  return (
    <Modal title="Log Procedure" subtitle="Record a procedure with performance level and supervisor" onClose={onClose} size="lg"
      footer={
        <>
          <button onClick={onClose} className={btnSecondaryCls}>Cancel</button>
          <button onClick={submit} className={btnPrimaryCls}><i className="ri-syringe-line" /> Log Procedure</button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Learner" required>
          <select className={selectCls} value={form.learnerId} onChange={(e) => setForm({ ...form, learnerId: e.target.value })}>
            {learners.slice(0, 60).map((l) => <option key={l.id} value={l.id}>{l.name} ({l.id})</option>)}
          </select>
        </Field>
        <Field label="Procedure" required>
          <select className={selectCls} value={form.procedure} onChange={(e) => setForm({ ...form, procedure: e.target.value })}>
            {PROCEDURE_NAMES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Date">
          <input type="date" className={inputCls} value={form.date.split('/').reverse().join('-')} onChange={(e) => {
            const [y, m, d] = e.target.value.split('-');
            setForm({ ...form, date: `${m}/${d}/${y}` });
          }} />
        </Field>
        <Field label="Performance level">
          <select className={selectCls} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
            {PROCEDURE_LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </Field>
        <Field label="Number of attempts">
          <input type="number" min={1} max={10} className={inputCls} value={form.attempts} onChange={(e) => setForm({ ...form, attempts: Number(e.target.value) })} />
        </Field>
        <Field label="Outcome">
          <select className={selectCls} value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })}>
            <option>Successful</option>
            <option>Successful with assistance</option>
            <option>Repeat required</option>
          </select>
        </Field>
        <Field label="Supervisor" className="md:col-span-2">
          <select className={selectCls} value={form.supervisor} onChange={(e) => setForm({ ...form, supervisor: e.target.value })}>
            {['Dr. Emily Chen', 'Dr. James Whitfield', 'Dr. Alicia Torres', 'Dr. Sarah Okonkwo', 'Dr. Michael Reyes'].map((f) => <option key={f}>{f}</option>)}
          </select>
        </Field>
      </div>
    </Modal>
  );
}