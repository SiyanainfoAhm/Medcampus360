import { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import Avatar from '@/components/base/Avatar';
import StatusBadge from '@/components/base/StatusBadge';
import ProgressBar from '@/components/base/ProgressBar';
import Modal from '@/components/base/Modal';
import { Field, inputCls, btnPrimaryCls, btnSecondaryCls } from '@/components/base/Field';
import { EmptyState } from '@/components/base/States';
import { useAppData } from '@/context/AppDataContext';
import { useToast } from '@/context/ToastContext';
import { COMPETENCIES } from '@/mocks/competencies';
import { useRole } from '@/context/RoleContext';

const TABS = ['Overview', 'Academic Progress', 'Clinical Rotations', 'Competencies', 'Attendance', 'Assessments', 'Documents', 'Activity History'];

const tabCls = (active: boolean) =>
  `px-3.5 py-2 text-[13px] font-medium rounded-full whitespace-nowrap transition-colors ${active ? 'bg-navy-900 text-white' : 'text-ink-600 hover:bg-canvas-200'}`;

export default function LearnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLearnerById, rotations, caseLogs, exceptions, getCompStatus, audit } = useAppData();
  const { toast } = useToast();
  const { currentRole } = useRole();
  const [tab, setTab] = useState('Overview');
  const [showContact, setShowContact] = useState(false);

  const learner = getLearnerById(id || '');

  const rotation = useMemo(() => rotations.find((r) => r.id === learner?.rotationId), [rotations, learner]);
  const learnerLogs = useMemo(() => caseLogs.filter((c) => c.learnerId === learner?.id).sort((a, b) => b.encounterDate.localeCompare(a.encounterDate)), [caseLogs, learner]);
  const learnerExceptions = useMemo(() => exceptions.filter((e) => e.learnerId === learner?.id), [exceptions, learner]);

  const competencyStats = useMemo(() => {
    const counts = { 'Not Started': 0, 'In Progress': 0, 'Needs Review': 0, Achieved: 0, 'Exceeds Expectation': 0 };
    if (learner) {
      COMPETENCIES.forEach((c, i) => {
        const s = getCompStatus(learner.id, i, c.code);
        counts[s] += 1;
      });
    }
    return counts;
  }, [learner, getCompStatus]);

  if (!learner) {
    return (
      <div className="animate-fade-in">
        <PageHeader crumbs={[{ label: 'Learners', path: '/learners' }, { label: 'Learner Profile' }]} title="Learner not found" />
        <EmptyState title="No learner matches this ID" message="The learner record may have been removed." action={{ label: 'Back to directory', onClick: () => navigate('/learners') }} />
      </div>
    );
  }

  const eligible = learner.attendanceOverall >= 85 && !learner.risk;
  const blocking: string[] = [];
  if (learner.attendanceOverall < 85) blocking.push('Clinical attendance below the 85% threshold');
  if (learner.standing === 'Intervention Required') blocking.push('Active intervention plan required');
  if (learner.standing === 'Academic Probation') blocking.push('Academic probation standing');

  const docs = [
    { name: 'Application & matriculation record', type: 'PDF', date: '08/01/2024', status: 'Verified' },
    { name: 'Immunization & health clearance', type: 'PDF', date: '07/15/2026', status: 'Verified' },
    { name: 'BLS / CPR certification', type: 'PDF', date: '06/20/2026', status: 'Verified' },
    { name: 'HIPAA training completion', type: 'PDF', date: '07/22/2026', status: 'Verified' },
    { name: 'Background check (2026)', type: 'PDF', date: '06/28/2026', status: 'Verified' },
    { name: 'Clinical site onboarding - HCH', type: 'PDF', date: '07/30/2026', status: 'Pending' },
  ];

  const timeline = [
    { date: '08/13/2026', title: 'Attendance exception approved', detail: 'EXC-2301 approved by Dr. Emily Chen', icon: 'ri-calendar-check-line', tone: 'text-green-600 bg-green-50' },
    { date: '08/12/2026 8:31 AM', title: 'Case log submitted', detail: 'IM-CASE-1047 submitted for faculty review', icon: 'ri-file-list-3-line', tone: 'text-amber-600 bg-amber-50' },
    { date: '08/09/2026', title: 'Case log approved', detail: 'IM-CASE-1042 approved with feedback', icon: 'ri-check-double-line', tone: 'text-green-600 bg-green-50' },
    { date: '08/07/2026', title: 'Attendance exception filed', detail: 'EXC-2301 - Illness, urgent care visit', icon: 'ri-close-circle-line', tone: 'text-red-600 bg-red-50' },
    { date: '08/04/2026', title: 'Intervention plan created', detail: 'Attendance improvement plan - below 85% clinical threshold', icon: 'ri-alert-line', tone: 'text-red-600 bg-red-50' },
    { date: '07/30/2026', title: 'Rotation started', detail: 'Internal Medicine Clerkship at Harborview Community Hospital', icon: 'ri-stethoscope-line', tone: 'text-clinic-700 bg-clinic-50' },
    { date: '06/01/2026', title: 'Advisor meeting completed', detail: 'Quarterly advising with Dr. James Whitfield', icon: 'ri-user-star-line', tone: 'text-teal-700 bg-teal-50' },
    { date: '08/12/2024', title: 'Matriculated', detail: 'Doctor of Medicine · Class of 2028', icon: 'ri-graduation-cap-line', tone: 'text-navy-800 bg-navy-50' },
  ];

  const recentAudit = audit.filter((a) => a.record.includes(learner.id) || a.record.includes(learner.name)).slice(0, 4);

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Learners', path: '/learners' }, { label: learner.name }]}
        title="Learner 360 Profile"
        subtitle="Complete learner record across academics, clinical education, competencies, and compliance"
        actions={
          <>
            <button onClick={() => setShowContact(true)} className={btnSecondaryCls}>
              <i className="ri-contacts-book-line" />
              Contact & Emergency
            </button>
            {learner.currentRotation && (
              <button onClick={() => navigate(`/clinical/rotations/${learner.rotationId}`)} className={btnPrimaryCls}>
                <i className="ri-stethoscope-line" />
                Open Rotation
              </button>
            )}
          </>
        }
      />

      {/* Summary header */}
      <Card bodyClass="p-5">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex items-start gap-4 lg:w-[320px] shrink-0">
            <Avatar name={learner.name} photo={learner.photo} size={84} />
            <div>
              <h2 className="text-lg font-semibold text-ink-900">{learner.name}</h2>
              <p className="text-[13px] text-ink-500 mt-0.5">{learner.id}</p>
              <p className="text-[13px] text-ink-500">{learner.program} · {learner.cohort}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <StatusBadge status={learner.standing} />
                <StatusBadge status={learner.status} tone="neutral" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 flex-1">
            <div>
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Phase</p>
              <p className="text-[13px] font-medium text-ink-800 mt-1">{learner.phase}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Current Rotation</p>
              <Link to={`/clinical/rotations/${learner.rotationId}`} className="text-[13px] font-medium text-clinic-700 hover:text-clinic-800 mt-1 block">{learner.currentRotation || 'Not assigned'}</Link>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Faculty Advisor</p>
              <p className="text-[13px] font-medium text-ink-800 mt-1">{learner.advisor}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Preceptor</p>
              <p className="text-[13px] font-medium text-ink-800 mt-1">{learner.preceptor}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Clinical Site</p>
              <p className="text-[13px] font-medium text-ink-800 mt-1">{learner.clinicalSite}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Attendance</p>
              <div className="mt-1.5 w-24"><ProgressBar value={learner.attendanceOverall} tone={learner.attendanceOverall >= 85 ? 'green' : 'red'} label={`${learner.attendanceOverall}%`} /></div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Competency</p>
              <div className="mt-1.5 w-24"><ProgressBar value={learner.competencyProgress} tone={learner.competencyProgress >= 80 ? 'teal' : 'amber'} label={`${learner.competencyProgress}%`} /></div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Interventions</p>
              <p className="text-lg font-semibold mt-0.5 tabular-nums">{learner.interventions.length}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Email</p>
              <p className="text-[13px] font-medium text-ink-800 mt-1 truncate">{learner.email}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">Phone</p>
              <p className="text-[13px] font-medium text-ink-800 mt-1">{learner.phone}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={tabCls(tab === t)}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'Overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-5">
          <Card title="Key Metrics" className="xl:col-span-2">
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-ink-800">Overall attendance <span className="text-ink-400 font-normal">({learner.attendanceOverall}%)</span></p>
                  <StatusBadge status={learner.attendanceOverall >= 85 ? 'Meets threshold' : 'Below threshold'} tone={learner.attendanceOverall >= 85 ? 'green' : 'red'} />
                </div>
                <ProgressBar value={learner.attendanceOverall} tone={learner.attendanceOverall >= 85 ? 'green' : 'red'} height={8} />
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="border border-line-200 rounded-lg p-3">
                    <p className="text-[11px] text-ink-400">Theory</p>
                    <p className="text-base font-semibold text-ink-900 tabular-nums">{learner.attendanceTheory}%</p>
                  </div>
                  <div className="border border-line-200 rounded-lg p-3">
                    <p className="text-[11px] text-ink-400">Clinical</p>
                    <p className="text-base font-semibold text-ink-900 tabular-nums">{learner.attendanceClinical}%</p>
                  </div>
                  <div className="border border-line-200 rounded-lg p-3 bg-red-50/60 border-red-100">
                    <p className="text-[11px] text-red-600">Clinical threshold</p>
                    <p className="text-base font-semibold text-red-700 tabular-nums">85%</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-medium text-ink-800">Competency completion <span className="text-ink-400 font-normal">({learner.competencyAchieved}/96 credits)</span></p>
                  <StatusBadge status={learner.competencyProgress >= 80 ? 'On track' : 'Below expected progress'} tone={learner.competencyProgress >= 80 ? 'teal' : 'amber'} />
                </div>
                <ProgressBar value={learner.competencyProgress} tone={learner.competencyProgress >= 80 ? 'teal' : 'amber'} height={8} />
                <div className="flex flex-wrap gap-2 mt-3">
                  {Object.entries(competencyStats).map(([k, v]) => (
                    <span key={k} className="text-xs px-2.5 py-1 rounded-full bg-canvas-100 text-ink-600 border border-line-200">
                      {k}: <span className="font-semibold text-ink-900">{v}</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setTab('Competencies')} className="text-xs font-medium text-clinic-700 hover:text-clinic-800 flex items-center gap-1">
                  <i className="ri-checkbox-multiple-line" /> View competency matrix
                </button>
                <button onClick={() => navigate(`/competencies/matrix?learner=${learner.id}`)} className="text-xs font-medium text-clinic-700 hover:text-clinic-800 flex items-center gap-1">
                  <i className="ri-grid-line" /> Open in matrix
                </button>
              </div>
            </div>
          </Card>

          <Card title="Required Interventions" subtitle="Active intervention plan">
            <div className="space-y-3">
              {learner.interventions.length === 0 && <p className="text-sm text-ink-400">No active interventions. Learner is on track.</p>}
              {learner.interventions.map((inv, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-red-200 bg-red-50/50">
                  <span className="w-7 h-7 rounded-md bg-red-600 text-white flex items-center justify-center flex-shrink-0"><i className="ri-alert-line" /></span>
                  <div>
                    <p className="text-[13px] font-medium text-ink-900">{inv}</p>
                    <p className="text-[11px] text-ink-500 mt-0.5">Owner: {learner.advisor} · Due review 09/01/2026</p>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  toast('Intervention plan opened for review');
                }}
                className={`w-full ${btnPrimaryCls} justify-center`}
              >
                <i className="ri-file-edit-line" />
                Review intervention plan
              </button>
              <div className="text-[11px] text-ink-400 pt-1">
                Eligibility status: <span className={eligible ? 'text-green-700 font-medium' : 'text-red-600 font-medium'}>{eligible ? 'Eligible' : 'Not Eligible'}</span> ·{' '}
                <Link to="/eligibility?learner=MED-2026-0147" className="text-clinic-700 hover:text-clinic-800 underline underline-offset-2">Open eligibility review</Link>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Academic Progress */}
      {tab === 'Academic Progress' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-5">
          <Card title="Program Snapshot" className="xl:col-span-1">
            <div className="space-y-3 text-sm">
              {[
                ['Program', learner.program],
                ['Cohort', learner.cohort],
                ['Year', `Year ${learner.year}`],
                ['Phase', learner.phase],
                ['Advisor', learner.advisor],
                ['Standing', learner.standing],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-line-50 pb-2">
                  <span className="text-ink-500">{k}</span>
                  <span className="font-medium text-ink-900 text-right">{v}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Milestone Progress" subtitle="Phase-based milestones for the Doctor of Medicine program" className="xl:col-span-2">
            <div className="space-y-5">
              {[
                { label: 'Foundations of Medicine (Year 1)', pct: 100, tone: 'green' as const },
                { label: 'Foundations of Medicine (Year 2)', pct: 100, tone: 'green' as const },
                { label: 'Clinical Clerkship - Year 3', pct: 42, tone: 'clinic' as const },
                { label: 'USMLE Step 1 preparation', pct: 30, tone: 'amber' as const },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[13px] font-medium text-ink-800">{m.label}</p>
                    <span className="text-xs font-semibold text-ink-600 tabular-nums">{m.pct}%</span>
                  </div>
                  <ProgressBar value={m.pct} tone={m.tone} height={7} />
                </div>
              ))}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {[
                  { label: 'Clerkships completed', value: '2 / 8' },
                  { label: 'Case logs submitted', value: String(learnerLogs.length) },
                  { label: 'Procedures logged', value: '9' },
                ].map((s) => (
                  <div key={s.label} className="border border-line-200 rounded-lg p-3 text-center">
                    <p className="text-lg font-semibold text-ink-900 tabular-nums">{s.value}</p>
                    <p className="text-[11px] text-ink-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Clinical Rotations */}
      {tab === 'Clinical Rotations' && (
        <div className="mt-5">
          <Card title="Clinical Rotation History" subtitle="Rotation assignments across the current academic year" bodyClass="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line-100">
                  {['Rotation', 'Department', 'Site', 'Dates', 'Preceptor', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rotations.filter((r) => r.learners.includes(learner.id)).map((r) => (
                  <tr key={r.id} className="border-b border-line-50 last:border-0 cursor-pointer hover:bg-canvas-50 transition-colors" onClick={() => navigate(`/clinical/rotations/${r.id}`)}>
                    <td className="px-4 py-3 text-sm font-medium text-clinic-700">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-ink-700">{r.department}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{r.site}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{r.startDate} – {r.endDate}</td>
                    <td className="px-4 py-3 text-sm text-ink-700">{r.preceptors[0]}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
                {rotation && !rotations.some((r) => r.learners.includes(learner.id)) && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-ink-400">
                      No rotation assignments found. <button onClick={() => navigate(`/clinical/rotations/${learner.rotationId}`)} className="text-clinic-700 font-medium">Open current rotation</button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Competencies */}
      {tab === 'Competencies' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-5">
          <Card title="Competency Distribution" subtitle="Status across all 96 competencies">
            <div className="space-y-3">
              {Object.entries(competencyStats).map(([k, v]) => (
                <div key={k}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-ink-600">{k}</span>
                    <span className="text-xs font-semibold text-ink-900 tabular-nums">{v}</span>
                  </div>
                  <ProgressBar value={(v / 96) * 100} tone={k === 'Achieved' || k === 'Exceeds Expectation' ? 'green' : k === 'Needs Review' ? 'red' : k === 'In Progress' ? 'amber' : 'clinic'} height={5} />
                </div>
              ))}
              <div className="pt-2 flex gap-2">
                <button onClick={() => navigate(`/competencies/matrix?learner=${learner.id}`)} className={`${btnSecondaryCls} flex-1 justify-center`}>
                  <i className="ri-grid-line" /> Open matrix
                </button>
              </div>
            </div>
          </Card>
          <Card title="Pending Competency Work" subtitle="Competencies needing review or assessment" className="xl:col-span-2" bodyClass="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line-100">
                  {['Code', 'Competency', 'Domain', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPETENCIES.filter((c, i) => { const s = getCompStatus(learner.id, i, c.code); return s === 'Needs Review' || s === 'In Progress'; }).slice(0, 12).map((c, i) => {
                  const status = getCompStatus(learner.id, COMPETENCIES.indexOf(c), c.code);
                  return (
                    <tr key={c.code} className="border-b border-line-50 last:border-0 hover:bg-canvas-50 transition-colors cursor-pointer" onClick={() => navigate('/competencies/matrix')}>
                      <td className="px-4 py-3 text-xs font-semibold text-navy-800">{c.code}</td>
                      <td className="px-4 py-3 text-sm text-ink-800">{c.name}</td>
                      <td className="px-4 py-3 text-sm text-ink-500">{c.domain}</td>
                      <td className="px-4 py-3"><StatusBadge status={status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="px-4 py-2 text-[11px] text-ink-400">Showing competencies requiring attention. {competencyStats['Achieved'] + competencyStats['Exceeds Expectation']} of 96 are complete.</p>
          </Card>
        </div>
      )}

      {/* Attendance */}
      {tab === 'Attendance' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-5">
          <Card title="Attendance by Source" subtitle="Current term attendance">
            <div className="space-y-4">
              {[
                ['Theory attendance', learner.attendanceTheory, 75],
                ['Clinical attendance', learner.attendanceClinical, 85],
                ['Simulation & skills', 94, 85],
                ['Overall', learner.attendanceOverall, 85],
              ].map(([label, val, thr]) => (
                <div key={String(label)}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-ink-600">{label}</span>
                    <span className={`text-xs font-semibold tabular-nums ${Number(val) >= Number(thr) ? 'text-green-700' : 'text-red-600'}`}>{val}%</span>
                  </div>
                  <ProgressBar value={Number(val)} tone={Number(val) >= Number(thr) ? 'green' : 'red'} height={6} />
                </div>
              ))}
              <div className="pt-1 border-t border-line-100">
                <p className="text-xs text-ink-500">Attendance sources: QR check-in, badge/RFID, approved manual, clinical supervisor validation.</p>
              </div>
            </div>
          </Card>
          <Card title="Attendance Exceptions" subtitle="Excusal and exception requests" className="xl:col-span-2" bodyClass="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line-100">
                  {['Request', 'Session', 'Date', 'Reason', 'Status', 'Reviewer'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {learnerExceptions.map((e) => (
                  <tr key={e.id} className="border-b border-line-50 last:border-0 hover:bg-canvas-50 transition-colors">
                    <td className="px-4 py-3 text-xs font-semibold text-navy-800">{e.id}</td>
                    <td className="px-4 py-3 text-sm text-ink-800">{e.session}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{e.date}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{e.reason}</td>
                    <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                    <td className="px-4 py-3 text-sm text-ink-600">{e.reviewer}</td>
                  </tr>
                ))}
                <tr><td colSpan={6} className="px-4 py-3 text-[11px] text-ink-400">Request review: clinical attendance remains below threshold until additional sessions are credited.</td></tr>
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Assessments */}
      {tab === 'Assessments' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-5">
          <Card title="Assessment Summary">
            <div className="space-y-4">
              {[
                { label: 'Written assessments taken', value: '4', note: 'Avg score 78.5 / benchmark 75' },
                { label: 'OSCE stations completed', value: '12 / 12', note: 'Fall OSCE scheduled 08/14/2026' },
                { label: 'Direct observations', value: '3 / 6', note: 'Required per clerkship' },
                { label: 'Rotation evaluations due', value: '2', note: 'Internal Medicine midpoint' },
              ].map((s) => (
                <div key={s.label} className="border border-line-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] text-ink-600">{s.label}</p>
                    <p className="text-base font-semibold text-ink-900 tabular-nums">{s.value}</p>
                  </div>
                  <p className="text-[11px] text-ink-400 mt-1">{s.note}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Scheduled Assessments" subtitle="Upcoming assessments for the current term" className="xl:col-span-2" bodyClass="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line-100">
                  {['Assessment', 'Type', 'Date', 'Status', 'Action'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'ASM-1005', name: 'OSCE Clinical Skills Assessment', type: 'OSCE', date: '08/14/2026', status: 'Scheduled' },
                  { id: 'ASM-1001', name: 'Clinical Reasoning Written Exam', type: 'Written Assessment', date: '08/21/2026', status: 'Scheduled' },
                  { id: 'ASM-1012', name: 'Rotation Evaluation - Internal Medicine', type: 'Rotation Evaluation', date: '09/05/2026', status: 'Scheduled' },
                  { id: 'ASM-1008', name: 'Direct Observation: History & Exam', type: 'Direct Observation', date: '09/10/2026', status: 'Scheduled' },
                ].map((a) => (
                  <tr key={a.id} className="border-b border-line-50 last:border-0 hover:bg-canvas-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-ink-900">{a.name}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{a.type}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{a.date}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => { toast(`${a.name} opened`); navigate('/assessments'); }} className="text-xs font-medium text-clinic-700 hover:text-clinic-800">Open</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Documents */}
      {tab === 'Documents' && (
        <div className="mt-5">
          <Card title="Learner Documents" subtitle="Verified records and pending items" bodyClass="p-0">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line-100">
                  {['Document', 'Type', 'Updated', 'Status', 'Action'].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.name} className="border-b border-line-50 last:border-0 hover:bg-canvas-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-ink-900">{d.name}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{d.type}</td>
                    <td className="px-4 py-3 text-sm text-ink-600">{d.date}</td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} tone={d.status === 'Verified' ? 'green' : 'amber'} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => toast(`${d.name} downloaded`)} className="text-xs font-medium text-clinic-700 hover:text-clinic-800 flex items-center gap-1">
                        <i className="ri-download-line" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Activity History */}
      {tab === 'Activity History' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-5">
          <Card title="Learner Activity Timeline" className="xl:col-span-2">
            <div className="space-y-0">
              {timeline.map((t, i) => (
                <div key={i} className="flex gap-4 relative pb-5 last:pb-0">
                  {i < timeline.length - 1 && <span className="absolute left-[15px] top-8 bottom-0 w-px bg-line-200" />}
                  <span className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 z-10 ${t.tone}`}>
                    <i className={`${t.icon} text-sm`} />
                  </span>
                  <div className="pt-0.5">
                    <p className="text-[13px] font-medium text-ink-900">{t.title}</p>
                    <p className="text-xs text-ink-500 mt-0.5">{t.detail}</p>
                    <p className="text-[11px] text-ink-400 mt-0.5">{t.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Audit Trail" subtitle="System actions recorded for this learner">
            <div className="space-y-2.5">
              {recentAudit.length === 0 && <p className="text-sm text-ink-400">No system audit entries for this learner in the visible window.</p>}
              {recentAudit.map((a) => (
                <div key={a.id} className="border border-line-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-ink-900">{a.action} · {a.record}</p>
                    <StatusBadge status={a.outcome} tone={a.outcome === 'Success' ? 'green' : 'red'} />
                  </div>
                  <p className="text-[11px] text-ink-400 mt-1">{a.user} · {a.module}</p>
                  <p className="text-[11px] text-ink-400 mt-0.5">{a.timestamp}</p>
                </div>
              ))}
              <button onClick={() => navigate('/administration/audit')} className="text-xs font-medium text-clinic-700 hover:text-clinic-800 flex items-center gap-1">
                <i className="ri-file-search-line" /> View full audit log
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Contact modal */}
      {showContact && (
        <Modal title="Contact & Emergency Information" subtitle="HIPAA-aligned privacy controls apply to all contact data" onClose={() => setShowContact(false)} size="md"
          footer={<button onClick={() => setShowContact(false)} className={btnPrimaryCls}>Close</button>}
        >
          <div className="space-y-4 text-sm">
            {[
              ['Email', learner.email],
              ['Phone', learner.phone],
              ['Emergency contact', learner.emergencyContact],
              ['Emergency phone', learner.emergencyPhone],
              ['Advisor', learner.advisor],
              ['Preceptor', learner.preceptor],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between border-b border-line-50 pb-2">
                <span className="text-ink-500">{k}</span>
                <span className="font-medium text-ink-900">{v}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
              <i className="ri-shield-check-line" />
              Contact and emergency information is restricted to authorized faculty and administrators.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}