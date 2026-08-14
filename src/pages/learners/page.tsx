import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import DataTable from '@/components/base/DataTable';
import Avatar from '@/components/base/Avatar';
import StatusBadge from '@/components/base/StatusBadge';
import ProgressBar from '@/components/base/ProgressBar';
import Modal from '@/components/base/Modal';
import ConfirmDialog from '@/components/base/ConfirmDialog';
import { Field, inputCls, selectCls, btnPrimaryCls, btnSecondaryCls, btnDangerCls } from '@/components/base/Field';
import { useAppData } from '@/context/AppDataContext';
import { useToast } from '@/context/ToastContext';
import { PROGRAMS, COHORTS, DEPARTMENTS, STANDINGS, CLINICAL_SITES } from '@/mocks/institution';
import type { Learner } from '@/utils/dataset';

const filterCls = 'h-9 px-3 text-[13px] border border-line-200 rounded-md bg-white text-ink-700 focus:outline-none focus:ring-2 focus:ring-clinic-500 cursor-pointer';

export default function LearnersPage() {
  const navigate = useNavigate();
  const { learners, rotations, addLearner, removeLearner, updateLearner } = useAppData();
  const { toast } = useToast();

  const deptOf = (l: Learner) => {
    const rot = rotations.find((r) => r.id === l.rotationId);
    return rot ? rot.department : '—';
  };
  const [params, setParams] = useSearchParams();
  const [program, setProgram] = useState('All Programs');
  const [cohort, setCohort] = useState('All Cohorts');
  const [department, setDepartment] = useState('All Departments');
  const [standing, setStanding] = useState(params.get('standing') || 'All Standings');
  const [attRisk, setAttRisk] = useState(params.get('risk') === '1' ? 'At Risk Only' : 'All Learners');
  const [showAdd, setShowAdd] = useState(false);
  const [toDelete, setToDelete] = useState<Learner | null>(null);

  const filtered = useMemo(() => {
    let list = learners;
    if (program !== 'All Programs') list = list.filter((l) => l.program === program);
    if (cohort !== 'All Cohorts') list = list.filter((l) => l.cohort === cohort);
    if (department !== 'All Departments') list = list.filter((l) => deptOf(l) === department);
    if (standing !== 'All Standings') list = list.filter((l) => l.standing === standing);
    if (attRisk === 'At Risk Only') list = list.filter((l) => l.risk);
    return list;
  }, [learners, program, cohort, department, standing, attRisk]);

  const cohortOptions = useMemo(() => {
    const seen = new Set<string>();
    learners.forEach((l) => seen.add(l.cohort));
    return Array.from(seen).sort();
  }, [learners]);

  const confirmDelete = () => {
    if (!toDelete) return;
    removeLearner(toDelete.id);
    toast(`${toDelete.name} removed from the learner directory`);
    setToDelete(null);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Learners' }, { label: 'Learner Directory' }]}
        title="Learner Directory"
        subtitle={`${learners.length.toLocaleString('en-US')} active learners across 12 programs · Northbridge University School of Medicine`}
        actions={
          <button onClick={() => setShowAdd(true)} className={btnPrimaryCls}>
            <i className="ri-user-add-line" />
            Add Learner
          </button>
        }
      />

      {/* Filters */}
      <Card bodyClass="p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Filters</span>
          <select value={program} onChange={(e) => setProgram(e.target.value)} className={filterCls} aria-label="Program">
            <option>All Programs</option>
            {PROGRAMS.map((p) => (
              <option key={p.id}>{p.name}</option>
            ))}
          </select>
          <select value={cohort} onChange={(e) => setCohort(e.target.value)} className={filterCls} aria-label="Cohort">
            <option>All Cohorts</option>
            {cohortOptions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className={filterCls} aria-label="Department">
            <option>All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id}>{d.name}</option>
            ))}
          </select>
          <select value={standing} onChange={(e) => setStanding(e.target.value)} className={filterCls} aria-label="Standing">
            <option>All Standings</option>
            {STANDINGS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select value={attRisk} onChange={(e) => setAttRisk(e.target.value)} className={filterCls} aria-label="Attendance risk">
            <option>All Learners</option>
            <option>At Risk Only</option>
            <option>Below 85% Attendance</option>
          </select>
          <span className="ml-auto text-xs text-ink-500">
            <span className="font-semibold text-ink-800 tabular-nums">{filtered.length.toLocaleString('en-US')}</span> learners match
          </span>
        </div>
      </Card>

      <div className="mt-5">
        <DataTable<Learner>
          data={filtered}
          rowKey={(l) => l.id}
          searchKeys={['name', 'id', 'program', 'cohort']}
          searchPlaceholder="Search by name, learner ID, program, or cohort..."
          pageSize={12}
          onRowClick={(l) => navigate(`/learners/${l.id}`)}
          columns={[
            {
              key: 'learner',
              label: 'Learner',
              sortValue: (l) => l.name,
              render: (l) => (
                <div className="flex items-center gap-3">
                  <Avatar name={l.name} photo={l.photo} size={34} />
                  <div>
                    <p className="text-sm font-medium text-ink-900">{l.name}</p>
                    <p className="text-[11px] text-ink-400">{l.id}</p>
                  </div>
                </div>
              ),
            },
            { key: 'program', label: 'Program', sortValue: (l) => l.program, render: (l) => <span className="text-[13px]">{l.program}</span> },
            { key: 'cohort', label: 'Cohort', sortValue: (l) => l.cohort, render: (l) => <span className="text-[13px]">{l.cohort}</span> },
            { key: 'phase', label: 'Current Year', sortValue: (l) => l.phase, render: (l) => <span className="text-[13px]">{l.phase}</span> },
            { key: 'site', label: 'Clinical Site', sortValue: (l) => l.clinicalSite, render: (l) => <span className="text-[13px] text-ink-600">{l.clinicalSite}</span> },
            {
              key: 'attendance',
              label: 'Attendance',
              sortValue: (l) => l.attendanceOverall,
              render: (l) => (
                <div className="w-28">
                  <ProgressBar value={l.attendanceOverall} tone={l.attendanceOverall >= 85 ? 'green' : l.attendanceOverall >= 75 ? 'amber' : 'red'} height={5} label={`${l.attendanceOverall}%`} />
                </div>
              ),
            },
            {
              key: 'competency',
              label: 'Competency',
              sortValue: (l) => l.competencyProgress,
              render: (l) => (
                <div className="w-28">
                  <ProgressBar value={l.competencyProgress} tone={l.competencyProgress >= 80 ? 'teal' : l.competencyProgress >= 65 ? 'amber' : 'red'} height={5} label={`${l.competencyProgress}%`} />
                </div>
              ),
            },
            { key: 'standing', label: 'Standing', sortValue: (l) => l.standing, render: (l) => <StatusBadge status={l.standing} /> },
            { key: 'status', label: 'Status', render: (l) => <StatusBadge status={l.status} tone="neutral" /> },
            {
              key: 'actions',
              label: '',
              render: (l) => (
                <span className="flex items-center justify-end gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/learners/${l.id}`);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-md text-ink-400 hover:text-clinic-700 hover:bg-clinic-50 transition-colors"
                    title="Open profile"
                  >
                    <i className="ri-eye-line" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setToDelete(l);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-md text-ink-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove learner"
                  >
                    <i className="ri-delete-bin-line" />
                  </button>
                </span>
              ),
            },
          ]}
        />
      </div>

      {showAdd && <AddLearnerModal onClose={() => setShowAdd(false)} onSave={(data) => { addLearner(data); setShowAdd(false); toast(`${data.name} added to the learner directory`); }} />}
      {toDelete && (
        <ConfirmDialog
          title="Remove learner"
          message={`Remove ${toDelete.name} (${toDelete.id}) from the learner directory? This action is recorded in the audit log.`}
          confirmLabel="Remove"
          danger
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}

function AddLearnerModal({ onClose, onSave }: { onClose: () => void; onSave: (l: Learner) => void }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    programId: 'md',
    cohortId: 'CO-2028',
    email: '',
    phone: '',
    gender: 'Female',
  });
  const [error, setError] = useState('');

  const submit = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('First and last name are required.');
      return;
    }
    const prog = PROGRAMS.find((p) => p.id === form.programId)!;
    const cohort = COHORTS.find((c) => c.id === form.cohortId)!;
    const id = `MED-2026-${String(2000 + Math.floor(Math.random() * 900)).padStart(4, '0')}`;
    onSave({
      id,
      name: `${form.firstName} ${form.lastName}`,
      firstName: form.firstName,
      lastName: form.lastName,
      programId: prog.id,
      program: prog.name,
      cohortId: cohort.id,
      cohort: cohort.name,
      year: cohort.year,
      phase: cohort.phase,
      clinicalSite: CLINICAL_SITES[0].name,
      currentRotation: cohort.phase === 'Clinical Clerkship' ? 'Internal Medicine Clerkship' : '',
      rotationId: '',
      preceptor: 'Dr. Emily Chen',
      advisor: 'Dr. James Whitfield',
      attendanceTheory: 92,
      attendanceClinical: 91,
      attendanceOverall: 91.5,
      competencyProgress: 40,
      competencyAchieved: 38,
      competencyTotal: 96,
      standing: 'Good Standing',
      status: 'Active',
      risk: false,
      interventions: [],
      email: form.email || `${form.firstName.toLowerCase()}.${form.lastName.toLowerCase()}@northbridge.edu`,
      phone: form.phone || '(617) 555-0100',
      gender: form.gender,
      emergencyContact: 'On file',
      emergencyPhone: '(617) 555-0199',
      photo: '',
    });
  };

  return (
    <Modal title="Add Learner" subtitle="Register a new learner in the directory" onClose={onClose} size="lg"
      footer={
        <>
          <button onClick={onClose} className={btnSecondaryCls}>Cancel</button>
          <button onClick={submit} className={btnPrimaryCls}>
            <i className="ri-user-add-line" />
            Add Learner
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="First name" required>
          <input className={inputCls} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Olivia" />
        </Field>
        <Field label="Last name" required>
          <input className={inputCls} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Carter" />
        </Field>
        <Field label="Program">
          <select className={selectCls} value={form.programId} onChange={(e) => setForm({ ...form, programId: e.target.value })}>
            {PROGRAMS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Cohort">
          <select className={selectCls} value={form.cohortId} onChange={(e) => setForm({ ...form, cohortId: e.target.value })}>
            {COHORTS.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Email">
          <input className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="learner@northbridge.edu" />
        </Field>
        <Field label="Phone">
          <input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(617) 555-0100" />
        </Field>
        <Field label="Gender">
          <select className={selectCls} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
            <option>Female</option>
            <option>Male</option>
            <option>Non-binary</option>
          </select>
        </Field>
      </div>
      {error && <p className="text-sm text-red-600 mt-4 flex items-center gap-1.5"><i className="ri-error-warning-line" />{error}</p>}
    </Modal>
  );
}