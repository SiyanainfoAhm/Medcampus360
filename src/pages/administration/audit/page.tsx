import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import DataTable from '@/components/base/DataTable';
import StatusBadge from '@/components/base/StatusBadge';
import { useAppData } from '@/context/AppDataContext';
import { selectCls } from '@/components/base/Field';

export default function AuditLogPage() {
  const navigate = useNavigate();
  const { audit } = useAppData();
  const [moduleFilter, setModuleFilter] = useState('All Modules');

  const filtered = useMemo(() => {
    let list = audit;
    if (moduleFilter !== 'All Modules') list = list.filter((a) => a.module === moduleFilter);
    return list;
  }, [audit, moduleFilter]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Administration', path: '/administration' }, { label: 'Audit Log' }]}
        title="Audit Log"
        subtitle="Immutable record of system activity · retained for 7 years"
        actions={
          <select value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)} className={selectCls + ' !w-56'} aria-label="Module filter">
            <option>All Modules</option>
            {Array.from(new Set(audit.map((a) => a.module))).map((m) => <option key={m}>{m}</option>)}
          </select>
        }
      />

      <Card title={`${filtered.length} audit entries`} bodyClass="p-0">
        <DataTable
          data={filtered}
          rowKey={(a) => a.id}
          searchKeys={['user', 'module', 'action', 'record']}
          searchPlaceholder="Search by user, action, module, or record..."
          pageSize={12}
          columns={[
            { key: 'timestamp', label: 'Timestamp', sortValue: (a) => a.timestamp, render: (a) => <span className="text-[13px] text-ink-600 whitespace-nowrap tabular-nums">{a.timestamp}</span> },
            { key: 'user', label: 'User', sortValue: (a) => a.user, render: (a) => <span className="text-sm font-medium text-ink-900">{a.user}</span> },
            { key: 'role', label: 'Role', render: (a) => <span className="text-[13px] text-ink-600">{a.role}</span> },
            { key: 'module', label: 'Module', sortValue: (a) => a.module, render: (a) => <span className="text-[13px] text-ink-600">{a.module}</span> },
            { key: 'action', label: 'Action', render: (a) => <span className="text-[13px] text-ink-700">{a.action}</span> },
            { key: 'record', label: 'Record', render: (a) => <span className="text-[13px] text-ink-600">{a.record}</span> },
            { key: 'ipDevice', label: 'IP / Device', render: (a) => <span className="text-[13px] text-ink-500">{a.ipDevice}</span> },
            { key: 'outcome', label: 'Outcome', sortValue: (a) => a.outcome, render: (a) => <StatusBadge status={a.outcome} tone={a.outcome === 'Success' ? 'green' : a.outcome === 'Denied' ? 'amber' : 'red'} /> },
          ]}
        />
      </Card>

      <div className="mt-4 flex items-start gap-2 text-xs text-ink-500 bg-white border border-line-200 rounded-lg p-3">
        <i className="ri-shield-check-line text-green-600 mt-0.5" />
        <div>
          Audit entries are append-only and cannot be modified or deleted. Sensitive actions (results release, evidence approval, exports, permission changes) always create an entry with user, role, module, action, record, device, and outcome.
        </div>
        <button onClick={() => navigate('/administration')} className="ml-auto text-clinic-700 hover:text-clinic-800 font-medium whitespace-nowrap">Back to Administration</button>
      </div>
    </div>
  );
}