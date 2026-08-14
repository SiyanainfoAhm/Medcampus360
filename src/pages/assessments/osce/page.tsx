import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import Avatar from '@/components/base/Avatar';
import StatusBadge from '@/components/base/StatusBadge';
import Modal from '@/components/base/Modal';
import { btnPrimaryCls, btnSecondaryCls, selectCls } from '@/components/base/Field';
import { useAppData } from '@/context/AppDataContext';
import { useToast } from '@/context/ToastContext';
import { OSCE_STATIONS } from '@/mocks/assessments';

export default function OSCEPage() {
  const navigate = useNavigate();
  const { learners, oscE, addAudit } = useAppData();
  const { toast } = useToast();
  const [station, setStation] = useState(OSCE_STATIONS[0]);
  const [activeLearner, setActiveLearner] = useState<string>('MED-2026-0147');
  const [showEval, setShowEval] = useState(false);

  const candidates = useMemo(() => learners.filter((l) => l.cohortId === 'CO-2028').slice(0, 12), [learners]);

  const scores = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    candidates.forEach((l, li) => {
      map[l.id] = {};
      OSCE_STATIONS.forEach((s, si) => {
        map[l.id][s.id] = Math.min(100, 55 + ((li * 7 + si * 11 + 13) % 46));
      });
    });
    return map;
  }, [candidates]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Assessments', path: '/assessments' }, { label: 'OSCE Evaluations' }]}
        title="OSCE Clinical Skills Assessment"
        subtitle={`${oscE.name} · ${oscE.date} · ${oscE.cohort} · 12 stations`}
        actions={
          <button onClick={() => { toast('OSCE schedule published to learners'); }} className={btnPrimaryCls}><i className="ri-send-plane-line" /> Publish Schedule</button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Card title="Station Map" subtitle="Select a station to review its checklist and critical items" bodyClass="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line-100">
              {OSCE_STATIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStation(s)}
                  className={`p-4 bg-white text-left transition-colors ${station?.id === s.id ? 'bg-clinic-50' : 'hover:bg-canvas-50'}`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-ink-900">{s.station}</p>
                    <span className="text-[11px] text-ink-400">{s.duration}</span>
                  </div>
                  <p className="text-[13px] text-ink-600 mt-0.5">{s.skill}</p>
                  <p className="text-[11px] text-ink-400 mt-0.5">Examiner: {s.examiner}</p>
                </button>
              ))}
            </div>
          </Card>

          {station && (
            <Card title={`${station.station} · ${station.skill}`} subtitle={`Examiner ${station.examiner}`} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-2">Checklist items</p>
                  <ul className="space-y-1.5">
                    {station.checklist.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-ink-700">
                        <span className="w-4 h-4 rounded border border-line-300 flex items-center justify-center text-[9px] text-transparent mt-0.5" />{c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-red-600 uppercase tracking-wide mb-2">Critical-failure items</p>
                  <ul className="space-y-1.5">
                    {station.criticalItems.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-ink-700">
                        <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[9px] mt-0.5"><i className="ri-close-line" /></span>{c}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center gap-2 text-xs text-ink-500 bg-canvas-100 border border-line-200 rounded-lg p-3">
                    <i className="ri-information-line text-clinic-700" /> Failing a critical item marks the station as not passed regardless of total score.
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card title="Learner Scores" subtitle="Station scores · Class of 2028" bodyClass="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-line-100">
                    <th className="px-3 py-2.5 text-[11px] font-semibold text-ink-500 uppercase">Learner</th>
                    <th className="px-3 py-2.5 text-[11px] font-semibold text-ink-500 uppercase text-right">Score</th>
                    <th className="px-3 py-2.5 text-[11px] font-semibold text-ink-500 uppercase text-center">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((l) => {
                    const avg = Math.round(OSCE_STATIONS.reduce((s, st) => s + (scores[l.id]?.[st.id] || 0), 0) / OSCE_STATIONS.length);
                    return (
                      <tr key={l.id} className="border-b border-line-50 last:border-0 hover:bg-canvas-50 transition-colors cursor-pointer" onClick={() => setActiveLearner(l.id)}>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <Avatar name={l.name} photo={l.photo} size={26} />
                            <span className="text-[12px] font-medium text-ink-900 truncate max-w-[120px]">{l.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-[13px] tabular-nums text-right">{avg}</td>
                        <td className="px-3 py-2.5 text-center"><StatusBadge status={avg >= 75 ? 'Passed' : 'Review'} tone={avg >= 75 ? 'green' : 'red'} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Evaluation" subtitle="Grade a learner at the selected station">
            <button onClick={() => setShowEval(true)} className={btnPrimaryCls + ' w-full justify-center'}>
              <i className="ri-edit-line" /> Open Evaluation Form
            </button>
          </Card>
        </div>
      </div>

      {showEval && (
        <Modal
          title="OSCE Station Evaluation"
          subtitle={`${station.station} · ${station.skill} · Learner ${learners.find((l) => l.id === activeLearner)?.name || activeLearner}`}
          onClose={() => setShowEval(false)}
          size="lg"
          footer={
            <>
              <button onClick={() => setShowEval(false)} className={btnSecondaryCls}>Save Draft</button>
              <button
                onClick={() => {
                  addAudit({ user: 'Dr. Alicia Torres', role: 'Faculty Preceptor', module: 'Assessments', action: 'Scored', record: `OSCE ${station.station}`, ipDevice: '192.168.1.41 · Desktop', outcome: 'Success' });
                  toast('Evaluation submitted and locked for grading review');
                  setShowEval(false);
                }}
                className={btnPrimaryCls}
              >
                <i className="ri-check-line" /> Submit Score
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-canvas-100 border border-line-200 rounded-lg p-3">
              <p className="text-sm font-medium text-ink-800">Station score</p>
              <input type="number" min={0} max={100} defaultValue={82} className="w-24 h-10 px-3 text-sm border border-line-200 rounded-md" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-2">Checklist</p>
              <div className="space-y-1.5">
                {station.checklist.map((c, i) => (
                  <label key={i} className="flex items-center gap-2.5 text-[13px] text-ink-700 p-2 rounded-md border border-line-200 cursor-pointer hover:bg-canvas-50">
                    <input type="checkbox" defaultChecked={i % 3 !== 0} className="accent-clinic-700" /> {c}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-red-600 uppercase tracking-wide mb-2">Critical-failure items</p>
              <div className="space-y-1.5">
                {station.criticalItems.map((c, i) => (
                  <label key={i} className="flex items-center gap-2.5 text-[13px] text-ink-700 p-2 rounded-md border border-red-200 cursor-pointer hover:bg-red-50">
                    <input type="checkbox" className="accent-red-600" /> {c}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide mb-1.5">Examiner comments</p>
              <textarea className="w-full h-20 px-3 py-2 text-sm border border-line-200 rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-500" maxLength={500} placeholder="Comments on performance..." />
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-500 bg-canvas-100 border border-line-200 rounded-lg p-3">
              <i className="ri-lock-line text-clinic-700" /> Scores are locked at submission and released only after results approval.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}