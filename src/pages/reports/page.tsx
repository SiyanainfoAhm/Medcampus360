import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import StatusBadge from '@/components/base/StatusBadge';
import Modal from '@/components/base/Modal';
import DataTable from '@/components/base/DataTable';
import { btnPrimaryCls, btnSecondaryCls, selectCls, inputCls, Field } from '@/components/base/Field';
import { useAppData } from '@/context/AppDataContext';
import { useToast } from '@/context/ToastContext';
import { REPORT_CATALOGUE, REPORT_CATEGORIES, type ReportDef } from '@/mocks/reports';
import { printHtml, LETTERHEAD } from '@/utils/print';
import { PROGRAMS } from '@/mocks/institution';
import type { Learner } from '@/utils/dataset';

export default function ReportsPage() {
  const navigate = useNavigate();
  const { learners, caseLogs, complianceIndicators, addAudit } = useAppData();
  const { toast } = useToast();
  const [params] = useSearchParams();
  const [category, setCategory] = useState('All Categories');
  const [preview, setPreview] = useState<ReportDef | null>(null);
  const [cohortFilter, setCohortFilter] = useState('Class of 2028');
  const [showSchedule, setShowSchedule] = useState<ReportDef | null>(null);

  const filtered = useMemo(() => {
    let list = REPORT_CATALOGUE;
    if (category !== 'All Categories') list = list.filter((r) => r.category === category);
    return list;
  }, [category]);

  const exportCSV = (r: ReportDef) => {
    if (r.id === 'RPT-01') {
      const rows = learners.filter((l) => l.cohort === cohortFilter).slice(0, 100);
      const csv = ['Learner,ID,Program,Cohort,Attendance,Competency,Standing']
        .concat(rows.map((l) => `${l.name},${l.id},${l.program},${l.cohort},${l.attendanceOverall}%,${l.competencyProgress}%,${l.standing}`))
        .join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'learner-progress-summary.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const csv = `${r.name}\nGenerated for MedCampus 360\n`;
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${r.id}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
    addAudit({ user: 'Dr. Margaret Sullivan', role: 'Dean / Executive', module: 'Reports', action: 'Export', record: `${r.name} (CSV)`, ipDevice: '192.168.1.24 · Desktop', outcome: 'Success' });
    toast(`${r.name} exported as CSV`);
  };

  const exportPDF = (r: ReportDef) => {
    if (r.id === 'RPT-01') {
      const rows = learners.filter((l) => l.cohort === cohortFilter).slice(0, 60);
      const table = rows
        .map(
          (l) =>
            `<tr><td>${l.name}</td><td>${l.id}</td><td>${l.program}</td><td>${l.cohort}</td><td>${l.attendanceOverall}%</td><td>${l.competencyProgress}%</td><td><span class="badge ${l.risk ? 'r' : 'g'}">${l.standing}</span></td></tr>`
        )
        .join('');
      printHtml(
        'Learner Progress Summary',
        `${LETTERHEAD}
        <div class="doc-title">Learner Progress Summary</div>
        <div class="meta">
          <div class="item"><div class="label">Cohort</div><div class="value">${cohortFilter}</div></div>
          <div class="item"><div class="label">Academic year</div><div class="value">2026-2027</div></div>
          <div class="item"><div class="label">Records</div><div class="value">${rows.length}</div></div>
        </div>
        <table>
          <tr><th>Learner</th><th>ID</th><th>Program</th><th>Cohort</th><th>Attendance</th><th>Competency</th><th>Standing</th></tr>
          ${table}
        </table>
        <div class="sign">
          <div class="block">Prepared by<div class="line">MedCampus 360</div></div>
          <div class="block">Dean of Medical Education<div class="line">Dr. Margaret Sullivan</div></div>
        </div>
        <div class="footer">Northbridge University School of Medicine · Boston, MA · Confidential institutional report</div>`
      );
    } else {
      printHtml(r.name, `${LETTERHEAD}<div class="doc-title">${r.name}</div><p style="font-size:13px;">${r.description}</p><table><tr>${r.fields.map((f) => `<th>${f}</th>`).join('')}</tr><tr>${r.fields.map(() => '<td>—</td>').join('')}</tr></table><div class="footer">Northbridge University School of Medicine · MedCampus 360</div>`);
    }
    addAudit({ user: 'Dr. Margaret Sullivan', role: 'Dean / Executive', module: 'Reports', action: 'Export', record: `${r.name} (PDF)`, ipDevice: '192.168.1.24 · Desktop', outcome: 'Success' });
    toast(`${r.name} exported as PDF`);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Reports' }, { label: 'Report Catalogue' }]}
        title="Report Catalogue"
        subtitle="Standard institutional reports with preview, filtering, export, and scheduling"
        actions={
          <div className="flex items-center gap-3">
            <select value={cohortFilter} onChange={(e) => setCohortFilter(e.target.value)} className={selectCls + ' !w-44'} aria-label="Cohort">
              {['Class of 2028', 'Class of 2029', 'Class of 2030', 'IM Residency PGY-1', 'All Cohorts'].map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectCls + ' !w-52'} aria-label="Category">
              <option>All Categories</option>
              {REPORT_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <Card key={r.id} bodyClass="p-4">
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-md bg-navy-900 text-white flex items-center justify-center flex-shrink-0"><i className={`${r.icon} text-lg`} /></span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900">{r.name}</p>
                <p className="text-xs text-ink-400 mt-0.5">{r.id} · {r.category}</p>
              </div>
            </div>
            <p className="text-xs text-ink-600 leading-relaxed mt-3 line-clamp-2">{r.description}</p>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <button onClick={() => setPreview(r)} className={btnSecondaryCls + ' !h-8 !px-2.5 text-xs'}><i className="ri-eye-line" /> Preview</button>
              <button onClick={() => exportPDF(r)} className={btnSecondaryCls + ' !h-8 !px-2.5 text-xs'}><i className="ri-file-pdf-line" /> PDF</button>
              <button onClick={() => exportCSV(r)} className={btnSecondaryCls + ' !h-8 !px-2.5 text-xs'}><i className="ri-file-excel-line" /> CSV</button>
              <button onClick={() => setShowSchedule(r)} className="w-8 h-8 flex items-center justify-center rounded-md text-ink-400 hover:text-clinic-700 hover:bg-clinic-50" title="Schedule report"><i className="ri-time-line" /></button>
              <button
                onClick={() => {
                  addAudit({ user: 'Dr. Margaret Sullivan', role: 'Dean / Executive', module: 'Reports', action: 'Shared', record: r.name, ipDevice: '192.168.1.24 · Desktop', outcome: 'Success' });
                  toast(`${r.name} shared with authorized users`);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-md text-ink-400 hover:text-teal-700 hover:bg-teal-50"
                title="Share"
              >
                <i className="ri-share-line" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {preview && <ReportPreview report={preview} cohortFilter={cohortFilter} onClose={() => setPreview(null)} onExport={() => exportPDF(preview)} onCSV={() => exportCSV(preview)} />}

      {showSchedule && (
        <Modal title="Schedule Report" subtitle={`${showSchedule.name} · recurring delivery`} onClose={() => setShowSchedule(null)} size="md"
          footer={
            <>
              <button onClick={() => setShowSchedule(null)} className={btnSecondaryCls}>Cancel</button>
              <button
                onClick={() => {
                  addAudit({ user: 'Dr. Margaret Sullivan', role: 'Dean / Executive', module: 'Reports', action: 'Scheduled', record: showSchedule.name, ipDevice: '192.168.1.24 · Desktop', outcome: 'Success' });
                  toast(`${showSchedule.name} scheduled for weekly delivery`);
                  setShowSchedule(null);
                }}
                className={btnPrimaryCls}
              >
                <i className="ri-time-line" /> Schedule Delivery
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <Field label="Frequency">
              <select className={selectCls}><option>Weekly (Monday)</option><option>Monthly (1st)</option><option>Quarterly</option></select>
            </Field>
            <Field label="Recipients">
              <input className={inputCls} defaultValue="Dean; Program Administrators; Compliance Administrator" />
            </Field>
            <div className="flex items-center gap-2 text-xs text-ink-500 bg-canvas-100 border border-line-200 rounded-lg p-3">
              <i className="ri-shield-check-line text-green-600" />
              Deliveries are limited to authorized users with the Export permission.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ReportPreview({ report, cohortFilter, onClose, onExport, onCSV }: { report: ReportDef; cohortFilter: string; onClose: () => void; onExport: () => void; onCSV: () => void }) {
  const { learners } = useAppData();
  const rows = useMemo(() => learners.filter((l) => l.cohort === cohortFilter).slice(0, 25), [learners, cohortFilter]);
  return (
    <Modal
      title={`${report.name} · Preview`}
      subtitle={`${report.id} · Cohort ${cohortFilter} · Academic Year 2026-2027`}
      onClose={onClose}
      size="2xl"
      footer={
        <>
          <button onClick={onCSV} className={btnSecondaryCls}><i className="ri-file-excel-line" /> Export CSV</button>
          <button onClick={onExport} className={btnPrimaryCls}><i className="ri-file-pdf-line" /> Export PDF</button>
        </>
      }
    >
      {report.id === 'RPT-01' ? (
        <DataTable<Learner>
          data={rows}
          rowKey={(l) => l.id}
          searchKeys={['name', 'id']}
          pageSize={8}
          columns={[
            { key: 'name', label: 'Learner', sortValue: (l) => l.name, render: (l) => <span className="text-sm font-medium text-ink-900">{l.name}</span> },
            { key: 'id', label: 'ID', render: (l) => <span className="text-xs text-ink-500">{l.id}</span> },
            { key: 'program', label: 'Program', render: (l) => <span className="text-[13px] text-ink-600">{l.program}</span> },
            { key: 'attendance', label: 'Attendance', sortValue: (l) => l.attendanceOverall, render: (l) => <span className="text-[13px] tabular-nums">{l.attendanceOverall}%</span> },
            { key: 'competency', label: 'Competency', sortValue: (l) => l.competencyProgress, render: (l) => <span className="text-[13px] tabular-nums">{l.competencyProgress}%</span> },
            { key: 'standing', label: 'Standing', sortValue: (l) => l.standing, render: (l) => <StatusBadge status={l.standing} /> },
          ]}
        />
      ) : (
        <div className="text-sm text-ink-600">
          <p className="mb-3">{report.description}</p>
          <div className="border border-line-200 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead><tr className="bg-canvas-100 border-b border-line-200">{report.fields.map((f) => <th key={f} className="px-3 py-2 text-[11px] font-semibold text-ink-500 uppercase">{f}</th>)}</tr></thead>
              <tbody>
                {[0, 1, 2, 3].map((i) => (
                  <tr key={i} className="border-b border-line-50 last:border-0">
                    {report.fields.map((f, j) => <td key={f} className="px-3 py-2 text-[13px] text-ink-700">{j === 0 ? `Record ${i + 1}` : '—'}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-ink-400 mt-3">Full data set available on export. Filters apply per the report definition.</p>
        </div>
      )}
    </Modal>
  );
}