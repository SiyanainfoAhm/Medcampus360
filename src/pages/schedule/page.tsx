import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import StatusBadge from '@/components/base/StatusBadge';
import Modal from '@/components/base/Modal';
import { Field, inputCls, selectCls, btnPrimaryCls, btnSecondaryCls, btnDangerCls } from '@/components/base/Field';
import { useAppData } from '@/context/AppDataContext';
import { useToast } from '@/context/ToastContext';
import { EVENT_TYPES, ROOMS, CONFLICT_SEEDS, type ScheduleEventSeed } from '@/mocks/schedule';
import { DEPARTMENTS } from '@/mocks/institution';
import { TODAY } from '@/utils/dataset';

type ViewMode = 'Day' | 'Week' | 'Month';

const viewCls = (active: boolean) =>
  `px-3.5 py-1.5 text-[13px] font-medium rounded-full transition-colors ${active ? 'bg-navy-900 text-white' : 'text-ink-600 hover:bg-canvas-200'}`;

const TYPE_TONES: Record<string, string> = {
  Lecture: 'bg-navy-50 border-navy-200 text-navy-800',
  Laboratory: 'bg-teal-50 border-teal-200 text-teal-800',
  'Simulation Session': 'bg-clinic-50 border-clinic-200 text-clinic-800',
  'Clinical Clerkship': 'bg-green-50 border-green-200 text-green-800',
  'Ward Rounds': 'bg-amber-50 border-amber-200 text-amber-800',
  'Outpatient Clinic': 'bg-green-50 border-green-200 text-green-800',
  Assessment: 'bg-red-50 border-red-200 text-red-700',
  'Faculty Review': 'bg-navy-50 border-navy-200 text-navy-800',
  'Case Conference': 'bg-clinic-50 border-clinic-200 text-clinic-800',
};

function eventTone(type: string) {
  return TYPE_TONES[type] || 'bg-canvas-100 border-line-200 text-ink-600';
}

export default function SchedulePage() {
  const navigate = useNavigate();
  const { scheduleEvents, rotations, faculty, updateSchedule, addSchedule, removeSchedule, addAudit } = useAppData();
  const { toast } = useToast();
  const [view, setView] = useState<ViewMode>('Week');
  const [selectedDate, setSelectedDate] = useState(TODAY);
  const [filterType, setFilterType] = useState('All Types');
  const [showConflict, setShowConflict] = useState(true);
  const [editEvent, setEditEvent] = useState<(typeof scheduleEvents)[number] | null>(null);
  const [substitute, setSubstitute] = useState<(typeof scheduleEvents)[number] | null>(null);
  const [newEvent, setNewEvent] = useState(false);

  const weekDates = useMemo(() => {
    const base = new Date(2026, 7, 13);
    const sel = new Date(base);
    const parts = selectedDate.split('/');
    sel.setMonth(Number(parts[0]) - 1, Number(parts[1]));
    const day = sel.getDay();
    const monday = new Date(sel);
    monday.setDate(sel.getDate() - ((day + 6) % 7));
    return Array.from({ length: 7 }, (_, i) => {
      const dt = new Date(monday);
      dt.setDate(monday.getDate() + i);
      return dt.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    });
  }, [selectedDate]);

  const monthDates = useMemo(() => {
    const parts = selectedDate.split('/');
    const year = Number(parts[2]);
    const month = Number(parts[0]) - 1;
    const first = new Date(year, month, 1);
    const startPad = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (string | null)[] = [];
    for (let i = 0; i < startPad; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }));
    return cells;
  }, [selectedDate]);

  const visibleEvents = useMemo(() => {
    let list = scheduleEvents;
    if (filterType !== 'All Types') list = list.filter((e) => e.type === filterType);
    if (view === 'Day') list = list.filter((e) => e.date === selectedDate);
    if (view === 'Week') list = list.filter((e) => weekDates.includes(e.date));
    return list.sort((a, b) => a.start.localeCompare(b.start));
  }, [scheduleEvents, filterType, view, selectedDate, weekDates]);

  const moveDate = (dir: number) => {
    const parts = selectedDate.split('/');
    const dt = new Date(2026, Number(parts[0]) - 1, Number(parts[1]));
    dt.setDate(dt.getDate() + (view === 'Month' ? dir * 28 : view === 'Week' ? dir * 7 : dir));
    setSelectedDate(dt.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }));
  };

  const saveEvent = (patch: Partial<(typeof scheduleEvents)[number]>) => {
    if (!editEvent) return;
    updateSchedule(editEvent.id, patch);
    addAudit({ user: 'David Martinez', role: 'Clinical Coordinator', module: 'Schedule', action: 'Rescheduled', record: editEvent.title, ipDevice: '192.168.1.30 · Desktop', outcome: 'Success' });
    toast('Schedule updated');
    setEditEvent(null);
  };

  const saveSubstitution = (facilitator: string) => {
    if (!substitute) return;
    updateSchedule(substitute.id, { facilitator, status: 'Rescheduled' });
    addAudit({ user: 'David Martinez', role: 'Clinical Coordinator', module: 'Schedule', action: 'Faculty Substitution', record: substitute.title, ipDevice: '192.168.1.30 · Desktop', outcome: 'Success' });
    toast(`Facilitator updated to ${facilitator}`);
    setSubstitute(null);
  };

  const conflictCount = CONFLICT_SEEDS.filter((c) => c.date === selectedDate).length || CONFLICT_SEEDS.length;

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Academic Schedule' }]}
        title="Academic & Clinical Schedule"
        subtitle={`Weekly calendar with lectures, laboratories, simulations, clerkships, and clinical activities · ${TODAY}`}
        actions={
          <>
            <button onClick={() => setNewEvent(true)} className={btnPrimaryCls}>
              <i className="ri-calendar-event-line" />
              Schedule Activity
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Toolbar */}
          <Card bodyClass="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-canvas-100 border border-line-200 rounded-full p-1">
                {(['Day', 'Week', 'Month'] as ViewMode[]).map((v) => (
                  <button key={v} onClick={() => setView(v)} className={viewCls(view === v)}>{v}</button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => moveDate(-1)} className="w-8 h-8 flex items-center justify-center rounded-md border border-line-200 text-ink-600 hover:bg-canvas-50" aria-label="Previous"><i className="ri-arrow-left-s-line" /></button>
                <button onClick={() => setSelectedDate(TODAY)} className="h-8 px-3 text-[13px] font-medium border border-line-200 rounded-md text-ink-700 hover:bg-canvas-50">Today</button>
                <button onClick={() => moveDate(1)} className="w-8 h-8 flex items-center justify-center rounded-md border border-line-200 text-ink-600 hover:bg-canvas-50" aria-label="Next"><i className="ri-arrow-right-s-line" /></button>
                <span className="ml-2 text-sm font-semibold text-ink-900">{selectedDate}</span>
              </div>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className={selectCls + ' !w-auto'} aria-label="Event type">
                <option>All Types</option>
                {EVENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <span className="ml-auto text-xs text-ink-500"><span className="font-semibold text-ink-800">{visibleEvents.length}</span> activities</span>
            </div>
          </Card>

          {/* Calendar */}
          {view === 'Day' && (
            <Card title={`Day view · ${selectedDate}`} bodyClass="p-0">
              <div className="divide-y divide-line-50">
                {visibleEvents.map((e) => (
                  <EventRow key={e.id} e={e} onEdit={() => setEditEvent(e)} onSubstitute={() => setSubstitute(e)} tone={eventTone(e.type)} />
                ))}
                {visibleEvents.length === 0 && <div className="px-4 py-14 text-center text-sm text-ink-400">No activities scheduled for this day.</div>}
              </div>
            </Card>
          )}

          {view === 'Week' && (
            <Card title={`Week view · ${weekDates[0]} – ${weekDates[6]}`} bodyClass="p-0">
              <div className="grid grid-cols-7 border-b border-line-100">
                {weekDates.map((d, i) => (
                  <div key={d} className={`px-2 py-2 text-center text-xs font-semibold border-r border-line-50 last:border-0 ${d === TODAY ? 'text-clinic-700' : 'text-ink-500'}`}>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]} {d.slice(0, 5)}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {weekDates.map((d) => {
                  const events = visibleEvents.filter((e) => e.date === d);
                  return (
                    <div key={d} className="min-h-[300px] border-r border-line-50 last:border-0 p-2 space-y-1.5">
                      {events.map((e) => (
                        <button
                          key={e.id}
                          onClick={() => setEditEvent(e)}
                          className={`w-full text-left rounded-md border px-2 py-1.5 text-[11px] leading-snug hover:brightness-95 transition-all ${eventTone(e.type)}`}
                        >
                          <p className="font-semibold truncate">{e.start}</p>
                          <p className="font-medium truncate">{e.title}</p>
                          <p className="opacity-70 truncate">{e.location}</p>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {view === 'Month' && (
            <Card title={`Month view · ${selectedDate.slice(0, 2)}/2026`} bodyClass="p-0">
              <div className="grid grid-cols-7 border-b border-line-100">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                  <div key={d} className="px-2 py-2 text-center text-xs font-semibold text-ink-500">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {monthDates.map((d, i) => {
                  if (!d) return <div key={`e-${i}`} className="min-h-[96px] bg-canvas-50/60 border-r border-b border-line-50" />;
                  const events = scheduleEvents.filter((e) => e.date === d);
                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`min-h-[96px] p-1.5 border-r border-b border-line-50 text-left align-top hover:bg-canvas-50 transition-colors ${d === selectedDate ? 'bg-clinic-50/50' : ''}`}
                    >
                      <span className={`text-[11px] font-semibold ${d === TODAY ? 'text-clinic-700' : 'text-ink-500'}`}>{Number(d.slice(3, 5))}</span>
                      <div className="mt-1 space-y-0.5">
                        {events.slice(0, 3).map((e) => (
                          <span key={e.id} className={`block w-full h-1.5 rounded-full ${e.type === 'Assessment' ? 'bg-red-400' : e.type === 'Simulation Session' ? 'bg-clinic-400' : 'bg-navy-300'}`} />
                        ))}
                        {events.length > 3 && <span className="block text-[10px] text-ink-400">+{events.length - 3} more</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Rotation planner */}
          <Card
            title="Clinical Rotation Planner"
            subtitle="42 active rotations · capacity, learners, preceptors, and objectives"
            actions={<button onClick={() => navigate('/clinical')} className="text-xs text-clinic-700 hover:text-clinic-800 font-medium">Open Clinical Education</button>}
            bodyClass="p-0"
          >
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line-100">
                  {['Rotation', 'Department', 'Site', 'Dates', 'Learners', 'Preceptors', 'Capacity', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rotations.slice(0, 8).map((r) => (
                  <tr key={r.id} className="border-b border-line-50 last:border-0 cursor-pointer hover:bg-canvas-50 transition-colors" onClick={() => navigate(`/clinical/rotations/${r.id}`)}>
                    <td className="px-4 py-3 text-sm font-medium text-clinic-700">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-ink-700">{r.department}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{r.site}</td>
                    <td className="px-4 py-3 text-sm text-ink-600 whitespace-nowrap">{r.startDate} – {r.endDate}</td>
                    <td className="px-4 py-3 text-sm tabular-nums">{r.learners.length}/{r.capacity}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{r.preceptors.join(', ')}</td>
                    <td className="px-4 py-3 text-sm">{r.shift.split('(')[0].trim()}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Conflict panel */}
        <div className="space-y-6">
          <Card
            title="Schedule Conflicts"
            subtitle={`${conflictCount} conflicts requiring corrective action`}
            actions={
              <button onClick={() => setShowConflict(!showConflict)} className="text-xs text-clinic-700 hover:text-clinic-800 font-medium">
                {showConflict ? 'Hide' : 'Show'}
              </button>
            }
          >
            {showConflict && (
              <div className="space-y-3">
                {CONFLICT_SEEDS.map((c) => (
                  <div key={c.id} className="border border-line-200 rounded-lg p-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-ink-900 flex items-center gap-1.5">
                        <i className={`${c.severity === 'High' ? 'ri-error-warning-line text-red-600' : 'ri-alert-line text-amber-500'}`} />
                        {c.type}
                      </span>
                      <StatusBadge status={c.severity === 'High' ? 'High' : 'Medium'} tone={c.severity === 'High' ? 'red' : 'amber'} />
                    </div>
                    <p className="text-xs text-ink-600 leading-relaxed">{c.detail}</p>
                    <p className="text-[11px] text-ink-400 mt-1">Required: {c.action}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          const ev = scheduleEvents.find((e) => e.date === c.date);
                          if (ev) {
                            setEditEvent(ev);
                            toast(`Reschedule ${ev.title}`);
                          } else {
                            toast(`Conflict resolved - ${c.action}`);
                          }
                        }}
                        className={`${btnSecondaryCls} !h-8 !px-2.5 text-xs`}
                      >
                        <i className="ri-calendar-event-line" /> Reschedule
                      </button>
                      <button
                        onClick={() => {
                          const ev = scheduleEvents.find((e) => e.date === c.date);
                          if (ev) setSubstitute(ev);
                          else toast(`Substitution arranged for ${c.action}`);
                        }}
                        className={`${btnSecondaryCls} !h-8 !px-2.5 text-xs`}
                      >
                        <i className="ri-user-star-line" /> Substitute faculty
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Learner Schedule" subtitle="Sample learner calendar - Olivia Carter">
            <div className="space-y-2">
              {scheduleEvents.filter((e) => e.cohort === 'Class of 2028').slice(0, 6).map((e) => (
                <button key={e.id} onClick={() => setEditEvent(e)} className={`w-full text-left rounded-md border px-3 py-2.5 ${eventTone(e.type)}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium">{e.title}</p>
                    <span className="text-[11px] font-semibold">{e.start}</span>
                  </div>
                  <p className="text-[11px] opacity-75 mt-0.5">{e.location} · {e.facilitator}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card title="Faculty Schedule" subtitle="Preceptor availability - Dr. Emily Chen">
            <div className="space-y-2">
              {scheduleEvents.filter((e) => e.facilitator === 'Dr. Emily Chen').slice(0, 6).map((e) => (
                <button key={e.id} onClick={() => setEditEvent(e)} className={`w-full text-left rounded-md border px-3 py-2.5 ${eventTone(e.type)}`}>
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium">{e.title}</p>
                    <span className="text-[11px] font-semibold">{e.start}</span>
                  </div>
                  <p className="text-[11px] opacity-75 mt-0.5">{e.date} · {e.location}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Reschedule modal */}
      {editEvent && (
        <RescheduleModal
          event={editEvent}
          onClose={() => setEditEvent(null)}
          onSave={(patch) => saveEvent(patch)}
        />
      )}

      {/* Substitution modal */}
      {substitute && (
        <Modal title="Faculty Substitution" subtitle={`${substitute.title} · ${substitute.date}`} onClose={() => setSubstitute(null)} size="md"
          footer={
            <>
              <button onClick={() => setSubstitute(null)} className={btnSecondaryCls}>Cancel</button>
            </>
          }
        >
          <div className="space-y-3">
            <p className="text-sm text-ink-600">Select a substitute facilitator for this session:</p>
            {faculty.filter((f) => f.departmentId === 'im' || f.departmentId === 'sim').slice(0, 8).map((f) => (
              <button key={f.id} onClick={() => saveSubstitution(f.name)} className="w-full flex items-center gap-3 p-3 border border-line-200 rounded-lg hover:border-navy-300 hover:bg-canvas-50 transition-colors text-left">
                <span className="w-8 h-8 rounded-full bg-clinic-700 text-white flex items-center justify-center text-xs font-semibold">{f.name.replace('Dr. ', '').split(' ').map((p) => p[0]).join('')}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink-900">{f.name}</p>
                  <p className="text-[11px] text-ink-500">{f.specialty} · {f.department}</p>
                </div>
                <i className="ri-arrow-right-s-line text-ink-300" />
              </button>
            ))}
          </div>
        </Modal>
      )}

      {/* New event modal */}
      {newEvent && (
        <NewEventModal
          onClose={() => setNewEvent(false)}
          onSave={(ev) => {
            addSchedule(ev);
            addAudit({ user: 'David Martinez', role: 'Clinical Coordinator', module: 'Schedule', action: 'Created', record: ev.title, ipDevice: '192.168.1.30 · Desktop', outcome: 'Success' });
            toast('Activity scheduled');
            setNewEvent(false);
          }}
        />
      )}
    </div>
  );
}

function EventRow({ e, onEdit, onSubstitute, tone }: { e: ScheduleEventSeed; onEdit: () => void; onSubstitute: () => void; tone: string }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-canvas-50 transition-colors">
      <div className="w-20 shrink-0">
        <p className="text-sm font-semibold text-ink-900">{e.start}</p>
        <p className="text-[11px] text-ink-400">{e.end}</p>
      </div>
      <span className={`px-2.5 py-1 rounded-full border text-xs font-medium whitespace-nowrap ${tone}`}>{e.type}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink-900 truncate">{e.title}</p>
        <p className="text-[11px] text-ink-500 truncate">{e.location} · {e.facilitator} · {e.cohort}</p>
      </div>
      <StatusBadge status={e.status} />
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={onEdit} className="w-8 h-8 flex items-center justify-center rounded-md text-ink-400 hover:text-clinic-700 hover:bg-clinic-50" title="Reschedule"><i className="ri-calendar-event-line" /></button>
        <button onClick={onSubstitute} className="w-8 h-8 flex items-center justify-center rounded-md text-ink-400 hover:text-teal-700 hover:bg-teal-50" title="Substitute faculty"><i className="ri-user-star-line" /></button>
      </div>
    </div>
  );
}

function RescheduleModal({ event, onClose, onSave }: { event: ScheduleEventSeed; onClose: () => void; onSave: (patch: { date: string; start: string; end: string; location: string }) => void }) {
  const [form, setForm] = useState({ date: event.date, start: event.start, end: event.end, location: event.location });
  return (
    <Modal title="Reschedule Activity" subtitle={`${event.title} · current: ${event.date} ${event.start}–${event.end}`} onClose={onClose} size="md"
      footer={
        <>
          <button onClick={onClose} className={btnSecondaryCls}>Cancel</button>
          <button onClick={() => onSave(form)} className={btnPrimaryCls}><i className="ri-calendar-check-line" /> Save schedule</button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Date" required>
          <input type="date" className={inputCls} value={form.date.split('/').reverse().join('-')} onChange={(e) => {
            const [y, m, d] = e.target.value.split('-');
            setForm({ ...form, date: `${m}/${d}/${y}` });
          }} />
        </Field>
        <Field label="Location">
          <select className={selectCls} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
            {ROOMS.map((r) => <option key={r}>{r}</option>)}
            <option>East Boston Community Health Center</option>
            <option>Beacon Children&apos;s Hospital</option>
            <option>St. Anne Women&apos;s Health Pavilion</option>
          </select>
        </Field>
        <Field label="Start time">
          <input type="time" className={inputCls} value={form.start} onChange={(e) => {
            const [h, m] = e.target.value.split(':');
            const hh = Number(h);
            const suffix = hh >= 12 ? 'PM' : 'AM';
            const h12 = hh % 12 === 0 ? 12 : hh % 12;
            setForm({ ...form, start: `${h12}:${m} ${suffix}` });
          }} />
        </Field>
        <Field label="End time">
          <input type="time" className={inputCls} value={form.end} onChange={(e) => {
            const [h, m] = e.target.value.split(':');
            const hh = Number(h);
            const suffix = hh >= 12 ? 'PM' : 'AM';
            const h12 = hh % 12 === 0 ? 12 : hh % 12;
            setForm({ ...form, end: `${h12}:${m} ${suffix}` });
          }} />
        </Field>
      </div>
      <div className="mt-4 flex items-start gap-2 text-xs text-ink-500 bg-canvas-100 border border-line-200 rounded-lg p-3">
        <i className="ri-information-line mt-0.5 text-clinic-700" />
        Rescheduling re-runs the conflict check. Any new conflicts will appear in the Schedule Conflicts panel with the required corrective action.
      </div>
    </Modal>
  );
}

function NewEventModal({ onClose, onSave }: { onClose: () => void; onSave: (ev: ScheduleEventSeed) => void }) {
  const [form, setForm] = useState({
    title: '',
    type: 'Lecture',
    date: TODAY,
    start: '9:00 AM',
    end: '10:00 AM',
    location: 'Longwood Lecture Hall',
    department: 'im',
    program: 'Doctor of Medicine',
    cohort: 'Class of 2028',
    facilitator: 'Dr. Emily Chen',
    learners: 20,
  });
  const [error, setError] = useState('');
  const submit = () => {
    if (!form.title.trim()) {
      setError('Activity title is required.');
      return;
    }
    onSave({
      id: `EV-${Date.now()}`,
      title: form.title,
      type: form.type,
      date: form.date,
      start: form.start,
      end: form.end,
      location: form.location,
      department: form.department,
      program: form.program,
      cohort: form.cohort,
      facilitator: form.facilitator,
      learners: form.learners,
      status: 'Scheduled',
    });
  };
  return (
    <Modal title="Schedule Activity" subtitle="Add a session to the academic calendar" onClose={onClose} size="lg"
      footer={
        <>
          <button onClick={onClose} className={btnSecondaryCls}>Cancel</button>
          <button onClick={submit} className={btnPrimaryCls}><i className="ri-calendar-event-line" /> Schedule</button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Activity title" required className="md:col-span-2">
          <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Cardiology: Valvular Disease Lecture" />
        </Field>
        <Field label="Type">
          <select className={selectCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Date">
          <input type="date" className={inputCls} value={form.date.split('/').reverse().join('-')} onChange={(e) => {
            const [y, m, d] = e.target.value.split('-');
            setForm({ ...form, date: `${m}/${d}/${y}` });
          }} />
        </Field>
        <Field label="Location">
          <select className={selectCls} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
            {ROOMS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Department">
          <select className={selectCls} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
            {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </Field>
        <Field label="Facilitator">
          <select className={selectCls} value={form.facilitator} onChange={(e) => setForm({ ...form, facilitator: e.target.value })}>
            {['Dr. Emily Chen', 'Dr. James Whitfield', 'Dr. Alicia Torres', 'Dr. Sarah Okonkwo', 'Dr. Linda Park', 'Dr. Michael Reyes'].map((f) => <option key={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Expected learners">
          <input type="number" min={1} max={200} className={inputCls} value={form.learners} onChange={(e) => setForm({ ...form, learners: Number(e.target.value) })} />
        </Field>
      </div>
      {error && <p className="text-sm text-red-600 mt-4 flex items-center gap-1.5"><i className="ri-error-warning-line" />{error}</p>}
    </Modal>
  );
}