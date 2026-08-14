import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import Avatar from '@/components/base/Avatar';
import StatusBadge from '@/components/base/StatusBadge';
import Modal from '@/components/base/Modal';
import { Field, inputCls, selectCls, btnPrimaryCls, btnSecondaryCls } from '@/components/base/Field';
import { useAppData } from '@/context/AppDataContext';
import { useToast } from '@/context/ToastContext';
import { ATTENDANCE_SOURCES, EXCEPTION_REASONS, SESSION_TYPES } from '@/mocks/attendance';
import { TODAY } from '@/utils/dataset';

const filterCls = 'h-9 px-3 text-[13px] border border-line-200 rounded-md bg-white text-ink-700 focus:outline-none focus:ring-2 focus:ring-clinic-500 cursor-pointer';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { sessions, attendanceRecords, exceptions, learners, updateException, addException, addAudit } = useAppData();
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState<string | null>(sessions[sessions.length - 1]?.id || null);
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [showException, setShowException] = useState(false);

  const session = sessions.find((s) => s.id === selectedSession);
  const records = useMemo(
    () =>
      attendanceRecords.filter((r) => r.sessionId === selectedSession).filter((r) => sourceFilter === 'All Sources' || r.source === sourceFilter).filter((r) => statusFilter === 'All Statuses' || r.status === statusFilter),
    [attendanceRecords, selectedSession, sourceFilter, statusFilter]
  );

  const presentCount = attendanceRecords.filter((r) => r.sessionId === selectedSession && r.status === 'Present').length;
  const totalCount = attendanceRecords.filter((r) => r.sessionId === selectedSession).length;

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Attendance', path: '/attendance' }, { label: 'Attendance Register' }]}
        title="Attendance Register"
        subtitle="Session-level attendance records with capture source and validation status"
        actions={
          <button onClick={() => setShowException(true)} className={btnPrimaryCls}><i className="ri-add-line" /> Exception Request</button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <Card title="Sessions" subtitle={`${sessions.length} recent sessions`} bodyClass="p-0">
            <div className="divide-y divide-line-50 max-h-[560px] overflow-y-auto">
              {sessions.slice(-20).reverse().map((s) => (
                <button key={s.id} onClick={() => setSelectedSession(s.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${selectedSession === s.id ? 'bg-clinic-50' : 'hover:bg-canvas-50'}`}>
                  <span className="w-8 h-8 rounded-md bg-clinic-50 text-clinic-700 flex items-center justify-center flex-shrink-0"><i className="ri-calendar-check-line" /></span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-ink-900 truncate">{s.title}</p>
                    <p className="text-[11px] text-ink-400">{s.date} · {s.start} · {s.source}</p>
                  </div>
                  <span className="text-[11px] text-ink-500 tabular-nums">{s.learnerIds.length}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <Card title={session ? session.title : 'Session'} subtitle={session ? `${session.date} · ${session.start}–${session.end} · ${session.location} · ${session.cohort}` : ''}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="border border-line-200 rounded-lg p-3"><p className="text-[11px] text-ink-400">Present</p><p className="text-lg font-semibold text-green-700 tabular-nums">{presentCount}</p></div>
              <div className="border border-line-200 rounded-lg p-3"><p className="text-[11px] text-ink-400">Late</p><p className="text-lg font-semibold text-amber-600 tabular-nums">{totalCount ? attendanceRecords.filter((r) => r.sessionId === selectedSession && r.status === 'Late').length : 0}</p></div>
              <div className="border border-line-200 rounded-lg p-3"><p className="text-[11px] text-ink-400">Absent</p><p className="text-lg font-semibold text-red-600 tabular-nums">{totalCount ? attendanceRecords.filter((r) => r.sessionId === selectedSession && r.status === 'Absent').length : 0}</p></div>
              <div className="border border-line-200 rounded-lg p-3"><p className="text-[11px] text-ink-400">Excused</p><p className="text-lg font-semibold text-navy-800 tabular-nums">{totalCount ? attendanceRecords.filter((r) => r.sessionId === selectedSession && r.status === 'Excused').length : 0}</p></div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className={filterCls} aria-label="Source">
                <option>All Sources</option>
                {ATTENDANCE_SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={filterCls} aria-label="Status">
                <option>All Statuses</option>
                <option>Present</option>
                <option>Late</option>
                <option>Absent</option>
                <option>Excused</option>
              </select>
              <span className="ml-auto text-xs text-ink-500"><span className="font-semibold text-ink-800">{records.length}</span> records</span>
            </div>
          </Card>

          <Card title="Attendance Records" bodyClass="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ minWidth: 720 }}>
                <thead>
                  <tr className="border-b border-line-100">
                    {['Learner', 'Session', 'Date / time', 'Location', 'Source', 'Status', 'Validation'].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => {
                    const learner = learners.find((l) => l.id === r.learnerId);
                    return (
                      <tr key={r.id} className="border-b border-line-50 last:border-0 hover:bg-canvas-50 transition-colors cursor-pointer" onClick={() => navigate(`/learners/${r.learnerId}`)}>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={r.learnerName} photo={learner?.photo} size={28} />
                            <span className="text-[13px] font-medium text-ink-900">{r.learnerName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-[13px] text-ink-600">{session?.title}</td>
                        <td className="px-4 py-2.5 text-[13px] text-ink-600">{session?.date} {session?.start}</td>
                        <td className="px-4 py-2.5 text-[13px] text-ink-600">{session?.location}</td>
                        <td className="px-4 py-2.5 text-[13px] text-ink-600">{r.source}</td>
                        <td className="px-4 py-2.5"><StatusBadge status={r.status} tone={r.status === 'Present' ? 'green' : r.status === 'Late' ? 'amber' : r.status === 'Excused' ? 'blue' : 'red'} /></td>
                        <td className="px-4 py-2.5"><StatusBadge status={r.validation} tone={r.validation === 'Validated' ? 'green' : r.validation === 'Needs Review' ? 'amber' : 'blue'} /></td>
                      </tr>
                    );
                  })}
                  {records.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-ink-400">No records match the current filters.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Exception Requests" subtitle="Approval workflow for excusals" bodyClass="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line-100">
                  {['Request', 'Learner', 'Session', 'Reason', 'Status', 'Decision'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exceptions.slice(0, 6).map((e) => (
                  <tr key={e.id} className="border-b border-line-50 last:border-0">
                    <td className="px-4 py-2.5 text-xs font-semibold text-navy-800">{e.id}</td>
                    <td className="px-4 py-2.5 text-[13px] text-ink-800">{learners.find((l) => l.id === e.learnerId)?.name || e.learnerId}</td>
                    <td className="px-4 py-2.5 text-[13px] text-ink-600">{e.session}</td>
                    <td className="px-4 py-2.5 text-[13px] text-ink-600">{e.reason}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={e.status} /></td>
                    <td className="px-4 py-2.5">
                      {e.status === 'Pending' ? (
                        <div className="flex gap-1.5">
                          <button onClick={() => { updateException(e.id, { status: 'Approved', reviewer: 'Sarah Okafor', decisionNotes: 'Approved with documentation.' }); addAudit({ user: 'Sarah Okafor', role: 'Program Administrator', module: 'Attendance', action: 'Approved', record: e.id, ipDevice: '192.168.1.18 · Desktop', outcome: 'Success' }); toast(`${e.id} approved`); }} className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md px-2 py-1 hover:bg-green-100">Approve</button>
                          <button onClick={() => { updateException(e.id, { status: 'Denied', reviewer: 'Sarah Okafor', decisionNotes: 'Denied - insufficient documentation.' }); toast(`${e.id} denied`); }} className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md px-2 py-1 hover:bg-red-100">Deny</button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-ink-400">{e.decisionNotes}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>

      {showException && (
        <ExceptionModal
          learners={learners.map((l) => ({ id: l.id, name: l.name }))}
          sessions={sessions.map((s) => s.title)}
          onClose={() => setShowException(false)}
          onSave={(item) => {
            addException(item);
            toast('Exception request submitted');
            setShowException(false);
          }}
        />
      )}
    </div>
  );
}

function ExceptionModal({ learners, sessions, onClose, onSave }: { learners: { id: string; name: string }[]; sessions: string[]; onClose: () => void; onSave: (item: (typeof import('@/mocks/attendance'))['EXCEPTION_SEEDS'][number]) => void }) {
  const [form, setForm] = useState({ learnerId: 'MED-2026-0147', session: sessions[0] || '', reason: EXCEPTION_REASONS[0], date: TODAY, notes: '' });
  return (
    <Modal title="Attendance Exception Request" subtitle="Request an excusal for a missed or upcoming session" onClose={onClose} size="lg"
      footer={
        <>
          <button onClick={onClose} className={btnSecondaryCls}>Cancel</button>
          <button
            onClick={() => {
              if (!form.notes.trim()) {
                return;
              }
              onSave({ id: `EXC-${Math.floor(3000 + Math.random() * 999)}`, learnerId: form.learnerId, session: form.session, date: form.date, reason: form.reason, status: 'Pending', reviewer: 'Sarah Okafor', notes: form.notes });
            }}
            className={btnPrimaryCls}
          >
            <i className="ri-send-plane-line" /> Submit Request
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Learner" required>
          <select className={selectCls} value={form.learnerId} onChange={(e) => setForm({ ...form, learnerId: e.target.value })}>
            {learners.slice(0, 40).map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </Field>
        <Field label="Session" required>
          <select className={selectCls} value={form.session} onChange={(e) => setForm({ ...form, session: e.target.value })}>
            {sessions.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Reason" required>
          <select className={selectCls} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}>
            {EXCEPTION_REASONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Date">
          <input type="date" className={inputCls} value={form.date.split('/').reverse().join('-')} onChange={(e) => {
            const [y, m, d] = e.target.value.split('-');
            setForm({ ...form, date: `${m}/${d}/${y}` });
          }} />
        </Field>
        <Field label="Supporting documentation" required className="md:col-span-2">
          <textarea className="w-full h-24 px-3 py-2 text-sm border border-line-200 rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-500" maxLength={500} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Describe the reason and reference any supporting document (e.g., urgent care note #...)" />
        </Field>
      </div>
    </Modal>
  );
}