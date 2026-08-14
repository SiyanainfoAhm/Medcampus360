import { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import Avatar from '@/components/base/Avatar';
import StatusBadge from '@/components/base/StatusBadge';
import ProgressBar from '@/components/base/ProgressBar';
import Modal from '@/components/base/Modal';
import { Field, inputCls, selectCls, btnPrimaryCls, btnSecondaryCls } from '@/components/base/Field';
import { EmptyState } from '@/components/base/States';
import { useAppData } from '@/context/AppDataContext';
import { useToast } from '@/context/ToastContext';
import { CLINICAL_SITES } from '@/mocks/institution';
import { baseRotationName } from '@/utils/dataset';

export default function RotationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { rotations, learners, caseLogs, procedures, updateRotation, addAudit } = useAppData();
  const { toast } = useToast();
  const [showEdit, setShowEdit] = useState(false);

  const rotation = rotations.find((r) => r.id === id);
  const site = rotation ? CLINICAL_SITES.find((s) => s.id === rotation.site) : undefined;
  const assignedLearners = useMemo(
    () => learners.filter((l) => rotation?.learners.includes(l.id)),
    [learners, rotation]
  );
  const rotLogs = useMemo(
    () =>
      caseLogs.filter(
        (c) => c.rotation === rotation?.name || (rotation ? c.rotation === baseRotationName(rotation.name) : false)
      ),
    [caseLogs, rotation]
  );
  const submittedLogs = rotLogs.filter((c) => c.status === 'Submitted' || c.status === 'Revision Requested');

  if (!rotation) {
    return (
      <div className="animate-fade-in">
        <PageHeader crumbs={[{ label: 'Clinical Education', path: '/clinical' }, { label: 'Rotation Detail' }]} title="Rotation not found" />
        <EmptyState title="No rotation matches this ID" action={{ label: 'Back to clinical dashboard', onClick: () => navigate('/clinical') }} />
      </div>
    );
  }

  const docs = [
    { name: 'Rotation objectives & syllabus', type: 'PDF', status: 'Published' },
    { name: 'Case log requirements', type: 'PDF', status: 'Published' },
    { name: 'Preceptor evaluation form', type: 'PDF', status: 'Published' },
    { name: 'Required procedure list', type: 'PDF', status: 'Published' },
    { name: 'Clinical site orientation - NUMC', type: 'PDF', status: 'Verified' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Clinical Education', path: '/clinical' }, { label: 'Rotation Detail' }]}
        title={rotation.name}
        subtitle={`${rotation.department} · ${site?.name || rotation.site} · ${rotation.startDate} – ${rotation.endDate}`}
        actions={
          <>
            <button onClick={() => navigate('/clinical')} className={btnSecondaryCls}>Back to Clinical</button>
            <button onClick={() => setShowEdit(true)} className={btnPrimaryCls}><i className="ri-edit-line" /> Edit Rotation</button>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Overview */}
          <Card title="Rotation Overview" subtitle="Clerkship structure and current status">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                ['Shift', rotation.shift],
                ['Assigned learners', String(rotation.learners.length)],
                ['Capacity', String(rotation.capacity)],
                ['Status', rotation.status],
              ].map(([k, v]) => (
                <div key={k} className="border border-line-200 rounded-lg p-3">
                  <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">{k}</p>
                  <p className="text-[13px] font-medium text-ink-900 mt-1">{v}</p>
                </div>
              ))}
            </div>
            <h4 className="text-sm font-semibold text-ink-900 mb-2">Learning objectives</h4>
            <ul className="space-y-1.5 mb-5">
              {rotation.objectives.map((o, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                  <span className="w-5 h-5 rounded-full bg-clinic-50 text-clinic-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                  {o}
                </li>
              ))}
            </ul>
            <h4 className="text-sm font-semibold text-ink-900 mb-2">Required clinical exposure</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-line-200 rounded-lg p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[13px] text-ink-600">Required case exposure</p>
                  <span className="text-sm font-semibold text-ink-900 tabular-nums">{Math.min(rotation.requiredCases, rotLogs.length)}/{rotation.requiredCases}</span>
                </div>
                <ProgressBar value={Math.min(100, (rotLogs.length / Math.max(1, rotation.requiredCases)) * 100)} tone="clinic" height={6} />
              </div>
              <div className="border border-line-200 rounded-lg p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[13px] text-ink-600">Required procedures</p>
                  <span className="text-sm font-semibold text-ink-900 tabular-nums">{Math.min(rotation.requiredProcedures, procedures.length)}/{rotation.requiredProcedures}</span>
                </div>
                <ProgressBar value={Math.min(100, (procedures.length / Math.max(1, rotation.requiredProcedures * 6)) * 100)} tone="teal" height={6} />
              </div>
            </div>
          </Card>

          {/* Assigned learners */}
          <Card title="Assigned Learners" subtitle={`${assignedLearners.length} learners currently assigned`} bodyClass="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line-100">
                  {['Learner', 'ID', 'Cohort', 'Attendance', 'Competency', 'Standing'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assignedLearners.slice(0, 10).map((l) => (
                  <tr key={l.id} className="border-b border-line-50 last:border-0 cursor-pointer hover:bg-canvas-50 transition-colors" onClick={() => navigate(`/learners/${l.id}`)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={l.name} photo={l.photo} size={30} />
                        <span className="text-sm font-medium text-ink-900">{l.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-500">{l.id}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{l.cohort}</td>
                    <td className="px-4 py-3"><div className="w-24"><ProgressBar value={l.attendanceOverall} tone={l.attendanceOverall >= 85 ? 'green' : 'red'} height={5} label={`${l.attendanceOverall}%`} /></div></td>
                    <td className="px-4 py-3"><div className="w-24"><ProgressBar value={l.competencyProgress} tone={l.competencyProgress >= 80 ? 'teal' : 'amber'} height={5} label={`${l.competencyProgress}%`} /></div></td>
                    <td className="px-4 py-3"><StatusBadge status={l.standing} /></td>
                  </tr>
                ))}
                {assignedLearners.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-ink-400">No learners assigned yet.</td></tr>
                )}
              </tbody>
            </table>
          </Card>

          {/* Case logs */}
          <Card
            title="Case Logs"
            subtitle={`${rotLogs.length} logs · ${submittedLogs.length} awaiting review`}
            bodyClass="p-0"
            actions={<Link to={`/clinical/case-logs?rotation=${encodeURIComponent(rotation.name)}`} className="text-xs text-clinic-700 hover:text-clinic-800 font-medium">Open case log console</Link>}
          >
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line-100">
                  {['Case-log ID', 'Learner', 'Encounter', 'Category', 'Participation', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rotLogs.slice(0, 8).map((c) => (
                  <tr key={c.id} className="border-b border-line-50 last:border-0 cursor-pointer hover:bg-canvas-50 transition-colors" onClick={() => navigate(`/clinical/case-logs?learner=${c.learnerId}`)}>
                    <td className="px-4 py-3 text-xs font-semibold text-navy-800">{c.id}</td>
                    <td className="px-4 py-3 text-sm text-ink-800">{c.learnerName}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{c.encounterDate}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{c.category}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{c.participation}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
                {rotLogs.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-ink-400">No case logs recorded for this rotation.</td></tr>}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card title="Preceptors">
            <div className="space-y-3">
              {rotation.preceptors.map((p) => (
                <div key={p} className="flex items-center gap-3 p-2.5 border border-line-200 rounded-lg">
                  <Avatar name={p} size={36} />
                  <div>
                    <p className="text-sm font-medium text-ink-900">{p}</p>
                    <p className="text-[11px] text-ink-500">Faculty Preceptor</p>
                  </div>
                  <i className="ri-check-double-line ml-auto text-green-600" />
                </div>
              ))}
              <button onClick={() => toast('New preceptor assignment form opened')} className={`${btnSecondaryCls} w-full justify-center`}>
                <i className="ri-user-add-line" /> Assign preceptor
              </button>
            </div>
          </Card>

          <Card title="Evaluations" subtitle="Rotation evaluation status">
            <div className="space-y-2.5">
              {[
                { label: 'Midpoint evaluations', value: '5 / 12', status: 'In Progress' },
                { label: 'Final evaluations', value: '0 / 12', status: 'Scheduled' },
                { label: 'Preceptor evaluations', value: '6 overdue', status: 'Overdue' },
              ].map((e) => (
                <div key={e.label} className="flex items-center justify-between border border-line-200 rounded-lg p-3">
                  <div>
                    <p className="text-[13px] text-ink-700">{e.label}</p>
                    <p className="text-[11px] text-ink-400 mt-0.5">{e.value}</p>
                  </div>
                  <StatusBadge status={e.status} tone={e.status === 'Overdue' ? 'red' : e.status === 'In Progress' ? 'amber' : 'blue'} />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Attendance" subtitle="Rotation attendance summary">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-ink-600">Rotation attendance</p>
                <span className="text-sm font-semibold text-ink-900 tabular-nums">89.4%</span>
              </div>
              <ProgressBar value={89.4} tone="green" height={7} />
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-ink-600">Learners below 85% threshold</p>
                <span className="text-sm font-semibold text-red-600 tabular-nums">3</span>
              </div>
              <button onClick={() => navigate('/attendance/register')} className="text-xs font-medium text-clinic-700 hover:text-clinic-800 flex items-center gap-1">
                <i className="ri-calendar-check-line" /> Open attendance register
              </button>
            </div>
          </Card>

          <Card title="Documents" subtitle="Rotation materials and records">
            <div className="space-y-2">
              {docs.map((d) => (
                <button key={d.name} onClick={() => toast(`${d.name} downloaded`)} className="w-full flex items-center gap-3 p-2.5 border border-line-200 rounded-lg hover:bg-canvas-50 transition-colors text-left">
                  <span className="w-8 h-8 rounded-md bg-clinic-50 text-clinic-700 flex items-center justify-center flex-shrink-0"><i className="ri-file-pdf-2-line" /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-ink-900 truncate">{d.name}</p>
                    <p className="text-[11px] text-ink-400">{d.type} · {d.status}</p>
                  </div>
                  <i className="ri-download-line text-ink-300" />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {showEdit && (
        <Modal title="Edit Rotation" subtitle={rotation.name} onClose={() => setShowEdit(false)} size="lg"
          footer={
            <>
              <button onClick={() => setShowEdit(false)} className={btnSecondaryCls}>Cancel</button>
              <button
                onClick={() => {
                  updateRotation(rotation.id, { status: 'Active' });
                  addAudit({ user: 'David Martinez', role: 'Clinical Coordinator', module: 'Clinical Education', action: 'Updated', record: rotation.name, ipDevice: '192.168.1.30 · Desktop', outcome: 'Success' });
                  toast('Rotation updated');
                  setShowEdit(false);
                }}
                className={btnPrimaryCls}
              >
                <i className="ri-check-line" /> Save Changes
              </button>
            </>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Rotation name"><input className={inputCls} defaultValue={rotation.name} /></Field>
            <Field label="Clinical site">
              <select className={selectCls} defaultValue={rotation.site}>
                {CLINICAL_SITES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
            <Field label="Capacity"><input type="number" className={inputCls} defaultValue={rotation.capacity} /></Field>
            <Field label="Status">
              <select className={selectCls} defaultValue={rotation.status}>
                <option>Active</option>
                <option>Upcoming</option>
                <option>Completed</option>
              </select>
            </Field>
          </div>
          <div className="mt-4 text-xs text-ink-500 bg-canvas-100 border border-line-200 rounded-lg p-3 flex items-start gap-2">
            <i className="ri-information-line mt-0.5 text-clinic-700" />
            Changes to rotation capacity or site re-run the utilization and conflict checks.
          </div>
        </Modal>
      )}
    </div>
  );
}