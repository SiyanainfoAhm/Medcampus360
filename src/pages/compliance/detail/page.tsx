import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import StatusBadge from '@/components/base/StatusBadge';
import Modal from '@/components/base/Modal';
import { Field, inputCls, selectCls, btnPrimaryCls, btnSecondaryCls } from '@/components/base/Field';
import { EmptyState } from '@/components/base/States';
import { useAppData } from '@/context/AppDataContext';
import { useToast } from '@/context/ToastContext';
import { COMPLIANCE_STATUSES } from '@/mocks/compliance';

export default function ComplianceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { complianceIndicators, evidence, updateCompliance, addEvidence, addAudit } = useAppData();
  const { toast } = useToast();
  const [showUpload, setShowUpload] = useState(false);

  const indicator = complianceIndicators.find((c) => c.id === id);
  const linkedEvidence = useMemo(() => evidence.filter((e) => e.indicatorId === id), [evidence, id]);

  if (!indicator) {
    return (
      <div className="animate-fade-in">
        <PageHeader crumbs={[{ label: 'Compliance', path: '/compliance' }, { label: 'Indicator Detail' }]} title="Indicator not found" />
        <EmptyState title="No indicator matches this ID" action={{ label: 'Back to compliance', onClick: () => navigate('/compliance') }} />
      </div>
    );
  }

  const statusTone = (s: string) =>
    s === 'Ready' ? 'green' : s === 'Attention Required' ? 'amber' : s === 'Evidence Missing' ? 'red' : 'blue';

  const approvalHistory = [
    { date: '08/12/2026', user: 'Rachel Kim', action: 'Reviewed status', from: 'Under Review', to: 'Attention Required' },
    { date: '08/01/2026', user: 'Rachel Kim', action: 'Evidence approved', from: 'Under Review', to: 'Under Review' },
    { date: '07/25/2026', user: 'Dr. Margaret Sullivan', action: 'Indicator added', from: '—', to: 'Under Review' },
  ];

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Compliance', path: '/compliance' }, { label: indicator.code }]}
        title={indicator.name}
        subtitle={`${indicator.category} · Owned by ${indicator.owner} · Reporting period ${indicator.reportingPeriod}`}
        actions={
          <>
            <button onClick={() => setShowUpload(true)} className={btnSecondaryCls}><i className="ri-upload-2-line" /> Add Evidence</button>
            <button
              onClick={() => {
                updateCompliance(indicator.id, { status: indicator.status === 'Evidence Missing' ? 'Under Review' : indicator.status === 'Under Review' ? 'Ready' : indicator.status });
                addAudit({ user: 'Rachel Kim', role: 'Compliance Administrator', module: 'Compliance', action: 'Reviewed', record: `${indicator.code} - ${indicator.name}`, ipDevice: '192.168.1.41 · Desktop', outcome: 'Success' });
                toast('Indicator status updated');
              }}
              className={btnPrimaryCls}
            >
              <i className="ri-refresh-line" /> Refresh Status
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card title="Requirement">
            <p className="text-sm text-ink-700 leading-relaxed">{indicator.requirement}</p>
            <div className="flex items-start gap-2 mt-4 text-xs text-ink-500 bg-canvas-100 border border-line-200 rounded-lg p-3">
              <i className="ri-information-line mt-0.5 text-clinic-700" />
              This is a readiness status for the fictional Northbridge University School of Medicine. It is not an accreditation claim.
            </div>
          </Card>

          <Card title="Current Status" subtitle="Approved evidence appears here from the institutional evidence record">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                ['Status', indicator.status],
                ['Data source', indicator.dataSource],
                ['Last reviewed', indicator.lastReviewed],
                ['Next review', indicator.nextReview],
              ].map(([k, v]) => (
                <div key={k} className="border border-line-200 rounded-lg p-3">
                  <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wide">{k}</p>
                  <p className="text-[13px] font-medium text-ink-900 mt-1">{v}</p>
                </div>
              ))}
            </div>
            <div className="border border-amber-200 bg-amber-50/50 rounded-lg p-4">
              <p className="text-sm font-semibold text-amber-800 flex items-center gap-2"><i className="ri-tools-line" /> Corrective action</p>
              <p className="text-[13px] text-ink-700 mt-1">{indicator.correctiveAction}</p>
            </div>
          </Card>

          <Card title="Approval History" subtitle="Status changes and evidence approvals" bodyClass="p-0">
            <div className="divide-y divide-line-50">
              {approvalHistory.map((h, i) => (
                <div key={i} className="flex items-center gap-4 px-4 py-3">
                  <span className="w-8 h-8 rounded-full bg-canvas-100 text-ink-500 flex items-center justify-center flex-shrink-0"><i className="ri-history-line" /></span>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-ink-900">{h.action}</p>
                    <p className="text-[11px] text-ink-400">{h.user} · {h.date}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <StatusBadge status={h.from} tone={statusTone(h.from)} />
                    <i className="ri-arrow-right-line text-ink-300" />
                    <StatusBadge status={h.to} tone={statusTone(h.to)} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Linked Evidence" subtitle={`${linkedEvidence.length} evidence records`}>
            <div className="space-y-2.5">
              {linkedEvidence.map((e) => (
                <div key={e.id} className="border border-line-200 rounded-lg p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-medium text-ink-900 truncate">{e.title}</p>
                    <StatusBadge status={e.status} tone={e.status === 'Approved' ? 'green' : 'amber'} />
                  </div>
                  <p className="text-[11px] text-ink-400 mt-1">{e.type} · {e.uploadedBy} · {e.uploadedAt}</p>
                </div>
              ))}
              {linkedEvidence.length === 0 && <p className="text-sm text-ink-400 text-center py-6">No evidence linked yet. Add evidence to this indicator.</p>}
            </div>
          </Card>

          <Card title="Related Workflow">
            <div className="space-y-2">
              <button onClick={() => navigate('/reports?report=RPT-11')} className="w-full text-left text-[13px] text-clinic-700 hover:text-clinic-800 flex items-center gap-2"><i className="ri-file-chart-line" /> Compliance Readiness Report</button>
              <button onClick={() => navigate('/administration/audit')} className="w-full text-left text-[13px] text-clinic-700 hover:text-clinic-800 flex items-center gap-2"><i className="ri-file-search-line" /> Audit Log</button>
              <button onClick={() => navigate('/sitemap')} className="w-full text-left text-[13px] text-clinic-700 hover:text-clinic-800 flex items-center gap-2"><i className="ri-map-2-line" /> Evidence pack export</button>
            </div>
          </Card>
        </div>
      </div>

      {showUpload && (
        <Modal title="Add Evidence" subtitle={`${indicator.code} · ${indicator.name}`} onClose={() => setShowUpload(false)} size="md"
          footer={
            <>
              <button onClick={() => setShowUpload(false)} className={btnSecondaryCls}>Cancel</button>
              <button
                onClick={() => {
                  addEvidence({ indicatorId: indicator.id, title: `${indicator.code} - ${indicator.reportingPeriod} evidence`, type: 'PDF', uploadedBy: 'Rachel Kim', uploadedAt: new Date().toLocaleDateString('en-US'), size: '1.2 MB', status: 'Approved' });
                  updateCompliance(indicator.id, { evidenceCount: indicator.evidenceCount + 1 });
                  addAudit({ user: 'Rachel Kim', role: 'Compliance Administrator', module: 'Compliance', action: 'Approved', record: `Evidence for ${indicator.code}`, ipDevice: '192.168.1.41 · Desktop', outcome: 'Success' });
                  toast('Evidence approved and linked — visible in the institutional evidence record');
                  setShowUpload(false);
                }}
                className={btnPrimaryCls}
              >
                <i className="ri-upload-2-line" /> Upload & Approve
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <Field label="Evidence title" required>
              <input className={inputCls} defaultValue={`${indicator.code} - ${indicator.reportingPeriod} evidence`} />
            </Field>
            <Field label="Document type">
              <select className={selectCls}><option>PDF</option><option>CSV</option><option>Image</option><option>System Record</option></select>
            </Field>
            <div className="border-2 border-dashed border-line-300 rounded-lg p-8 text-center">
              <i className="ri-file-upload-line text-2xl text-ink-400" />
              <p className="text-[13px] text-ink-600 mt-2">Drag & drop evidence file here</p>
              <p className="text-[11px] text-ink-400 mt-1">or <span className="text-clinic-700 font-medium">browse files</span></p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}