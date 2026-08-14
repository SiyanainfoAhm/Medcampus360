import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import StatusBadge from '@/components/base/StatusBadge';
import Avatar from '@/components/base/Avatar';
import Modal from '@/components/base/Modal';
import ConfirmDialog from '@/components/base/ConfirmDialog';
import { Field, inputCls, selectCls, btnPrimaryCls, btnSecondaryCls, btnDangerCls } from '@/components/base/Field';
import { useAppData } from '@/context/AppDataContext';
import { useToast } from '@/context/ToastContext';
import { ROLES, PERMISSIONS, USER_ACCOUNTS, type UserAccount } from '@/mocks/users';
import { PROGRAMS, DEPARTMENTS, CLINICAL_SITES, ACADEMIC_YEARS } from '@/mocks/institution';
import { NOTIFICATION_TEMPLATES } from '@/mocks/notifications';

const TABS = ['Users', 'Roles & Permissions', 'Programs', 'Departments', 'Clinical Sites', 'Notification Templates', 'Security', 'Integrations', 'System Health'];

const tabCls = (active: boolean) => `px-3.5 py-2 text-[13px] font-medium rounded-full whitespace-nowrap transition-colors ${active ? 'bg-navy-900 text-white' : 'text-ink-600 hover:bg-canvas-200'}`;

export default function AdministrationPage() {
  const navigate = useNavigate();
  const { faculty, addAudit } = useAppData();
  const { toast } = useToast();
  const [tab, setTab] = useState('Users');
  const [users, setUsers] = useState<UserAccount[]>(USER_ACCOUNTS);
  const [showAddUser, setShowAddUser] = useState(false);
  const [toDelete, setToDelete] = useState<UserAccount | null>(null);
  const [showRoleMatrix, setShowRoleMatrix] = useState(false);

  const securitySettings = [
    { label: 'Multi-factor authentication', detail: 'Required for all faculty and administrator accounts', value: 'Enforced', enabled: true },
    { label: 'Session timeout', detail: 'Idle sessions expire automatically', value: '30 minutes', enabled: true },
    { label: 'Password policy', detail: '12+ characters, complexity rules, 90-day rotation', value: 'Enforced', enabled: true },
    { label: 'Sensitive-action reauthentication', detail: 'Re-authenticate for releases, exports, and permission changes', value: 'Required', enabled: true },
    { label: 'Audit retention', detail: 'Immutable audit records retained', value: '7 years', enabled: true },
    { label: 'Data-export approval', detail: 'Exports require a role with the Export permission', value: 'Approval flow', enabled: true },
  ];

  const integrations = [
    { name: 'Readdy Backend / Supabase', status: 'Not connected', detail: 'Optional authentication, database, and edge functions', tone: 'amber' as const },
    { name: 'EHR / Clinical Data', status: 'Read-only export', detail: 'De-identified rotation and attendance extract', tone: 'green' as const },
    { name: 'Email & Notifications', status: 'Connected', detail: 'Learner and faculty notifications', tone: 'green' as const },
    { name: 'SSO / SAML', status: 'Configured', detail: 'Institution identity provider', tone: 'green' as const },
    { name: 'Analytics', status: 'Connected', detail: 'Institutional reporting', tone: 'green' as const },
  ];

  const healthChecks = [
    { label: 'Core application', value: 'Operational', pct: 99.98, ok: true },
    { label: 'Database & records', value: 'Operational', pct: 99.95, ok: true },
    { label: 'Notification service', value: 'Operational', pct: 99.9, ok: true },
    { label: 'Export service', value: 'Operational', pct: 99.7, ok: true },
  ];

  const filteredUsers = useMemo(() => users, [users]);

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Administration' }, { label: 'Administration' }]}
        title="Administration"
        subtitle="Users, roles and permissions, programs, clinical sites, security, and system health"
        actions={
          <button onClick={() => navigate('/administration/audit')} className={btnSecondaryCls}>
            <i className="ri-file-search-line" /> Audit Log
          </button>
        }
      />

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-5">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={tabCls(tab === t)}>{t}</button>
        ))}
      </div>

      {tab === 'Users' && (
        <>
          <Card
            title="User Accounts"
            subtitle={`${users.length} institutional accounts`}
            actions={<button onClick={() => setShowAddUser(true)} className={btnPrimaryCls + ' !h-9 !px-3 text-xs'}><i className="ri-user-add-line" /> Add User</button>}
            bodyClass="p-0"
          >
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line-100">
                  {['User', 'Email', 'Role', 'MFA', 'Last active', 'Status', ''].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-line-50 last:border-0 hover:bg-canvas-50 transition-colors">
                    <td className="px-4 py-3"><div className="flex items-center gap-2.5"><Avatar name={u.name} size={28} /><span className="text-sm font-medium text-ink-900">{u.name}</span></div></td>
                    <td className="px-4 py-3 text-[13px] text-ink-600">{u.email}</td>
                    <td className="px-4 py-3 text-[13px] text-ink-600">{u.role}</td>
                    <td className="px-4 py-3 text-[13px]">{u.mfa ? <StatusBadge status="Enabled" tone="green" /> : <StatusBadge status="Optional" tone="amber" />}</td>
                    <td className="px-4 py-3 text-[13px] text-ink-600 whitespace-nowrap">{u.lastActive}</td>
                    <td className="px-4 py-3"><StatusBadge status={u.status} tone={u.status === 'Active' ? 'green' : 'neutral'} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => setToDelete(u)} className="w-8 h-8 flex items-center justify-center rounded-md text-ink-400 hover:text-red-600 hover:bg-red-50"><i className="ri-delete-bin-line" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <div className="mt-4 text-xs text-ink-400 flex items-center gap-2">
            <i className="ri-shield-check-line text-green-600" /> HIPAA-aligned privacy controls · role-based access · immutable audit trail for sensitive actions.
          </div>
        </>
      )}

      {tab === 'Roles & Permissions' && (
        <Card title="Role & Permission Matrix" subtitle="Capabilities across the 6 presentation roles"
          actions={<button onClick={() => setShowRoleMatrix(true)} className={btnPrimaryCls + ' !h-9 !px-3 text-xs'}><i className="ri-table-line" /> Full Matrix</button>}
          bodyClass="p-0"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 860 }}>
              <thead>
                <tr className="border-b border-line-100">
                  <th className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide">Role</th>
                  {PERMISSIONS.map((p) => <th key={p} className="px-3 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide text-center">{p}</th>)}
                </tr>
              </thead>
              <tbody>
                {ROLES.map((r) => (
                  <tr key={r.id} className="border-b border-line-50 last:border-0">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-ink-900">{r.label}</p>
                      <p className="text-[11px] text-ink-400">{r.personaName}</p>
                    </td>
                    {PERMISSIONS.map((p) => (
                      <td key={p} className="px-3 py-3 text-center">
                        <span className={`w-6 h-6 inline-flex items-center justify-center rounded-full ${r.permissions.includes(p) ? 'bg-green-100 text-green-700' : 'bg-canvas-100 text-ink-300'}`}>
                          <i className={`${r.permissions.includes(p) ? 'ri-check-line' : 'ri-close-line'} text-sm`} />
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'Programs' && (
        <Card title="Academic Programs" subtitle="12 programs across undergraduate, graduate, residency, and fellowship" bodyClass="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line-100">
                {['Program', 'Short', 'Type', 'Learners', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PROGRAMS.map((p, i) => (
                <tr key={p.id} className="border-b border-line-50 last:border-0 hover:bg-canvas-50">
                  <td className="px-4 py-3 text-sm font-medium text-ink-900">{p.name}</td>
                  <td className="px-4 py-3 text-[13px] text-ink-600">{p.short}</td>
                  <td className="px-4 py-3 text-[13px] text-ink-600">{p.type}</td>
                  <td className="px-4 py-3 text-[13px] tabular-nums">{[1024, 354, 96, 84, 72, 66, 60, 54, 30, 26, 14, 22][i] || 20}</td>
                  <td className="px-4 py-3"><StatusBadge status="Active" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'Departments' && (
        <Card title="Departments" subtitle="18 academic and clinical departments" bodyClass="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-line-100">
            {DEPARTMENTS.map((d) => (
              <div key={d.id} className="bg-white p-4">
                <p className="text-sm font-medium text-ink-900">{d.name}</p>
                <p className="text-[11px] text-ink-400 mt-1">Chair: {d.chair}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'Clinical Sites' && (
        <Card title="Clinical Training Sites" subtitle="8 clinical sites across the Boston metro area" bodyClass="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line-100">
                {['Site', 'Type', 'City', 'Capacity', 'Rotations', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CLINICAL_SITES.map((s, i) => (
                <tr key={s.id} className="border-b border-line-50 last:border-0">
                  <td className="px-4 py-3 text-sm font-medium text-ink-900">{s.name}</td>
                  <td className="px-4 py-3 text-[13px] text-ink-600">{s.type}</td>
                  <td className="px-4 py-3 text-[13px] text-ink-600">{s.city}</td>
                  <td className="px-4 py-3 text-[13px] tabular-nums">{s.capacity}</td>
                  <td className="px-4 py-3 text-[13px] tabular-nums">{[6, 4, 4, 3, 4, 3, 3, 3][i]}</td>
                  <td className="px-4 py-3"><StatusBadge status="Active" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'Notification Templates' && (
        <Card title="Notification Templates" subtitle="Email and push notification delivery configuration" bodyClass="p-0">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line-100">
                {['Template', 'Subject', 'Channel', 'Trigger', 'Enabled'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NOTIFICATION_TEMPLATES.map((t) => (
                <tr key={t.id} className="border-b border-line-50 last:border-0">
                  <td className="px-4 py-3 text-sm font-medium text-ink-900">{t.name}</td>
                  <td className="px-4 py-3 text-[13px] text-ink-600">{t.subject}</td>
                  <td className="px-4 py-3 text-[13px] text-ink-600">{t.channel}</td>
                  <td className="px-4 py-3 text-[13px] text-ink-600">{t.event}</td>
                  <td className="px-4 py-3"><StatusBadge status={t.enabled ? 'Enabled' : 'Disabled'} tone={t.enabled ? 'green' : 'neutral'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {tab === 'Security' && (
        <Card title="Security Settings" subtitle="HIPAA-aligned privacy controls">
          <div className="space-y-3">
            {securitySettings.map((s) => (
              <div key={s.label} className="flex items-center justify-between border border-line-200 rounded-lg p-4">
                <div>
                  <p className="text-sm font-medium text-ink-900 flex items-center gap-2"><i className="ri-shield-check-line text-green-600" /> {s.label}</p>
                  <p className="text-[11px] text-ink-400 mt-0.5">{s.detail}</p>
                </div>
                <StatusBadge status={s.value} tone="green" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'Integrations' && (
        <Card title="Integration Status" subtitle="Connected services and data flows">
          <div className="space-y-3">
            {integrations.map((i) => (
              <div key={i.name} className="flex items-center justify-between border border-line-200 rounded-lg p-4">
                <div>
                  <p className="text-sm font-medium text-ink-900">{i.name}</p>
                  <p className="text-[11px] text-ink-400 mt-0.5">{i.detail}</p>
                </div>
                <StatusBadge status={i.status} tone={i.tone} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'System Health' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card title="Service Health" subtitle="Live operational status">
            <div className="space-y-4">
              {healthChecks.map((h) => (
                <div key={h.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] text-ink-700">{h.label}</span>
                    <span className={`text-xs font-semibold ${h.ok ? 'text-green-700' : 'text-red-600'}`}>{h.value} · {h.pct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-canvas-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${h.ok ? 'bg-green-600' : 'bg-red-600'}`} style={{ width: `${h.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Platform" subtitle="MedCampus 360 · AY 2026-27">
            <div className="space-y-3 text-sm">
              {[
                ['Institution', 'Northbridge University School of Medicine'],
                ['Location', 'Boston, Massachusetts'],
                ['Academic year', '2026-2027 · Fall Term'],
                ['Learners', '1,024'],
                ['Faculty & preceptors', `${faculty.length}`],
                ['Active rotations', '42'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-line-50 pb-2">
                  <span className="text-ink-500">{k}</span>
                  <span className="font-medium text-ink-900">{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {showAddUser && (
        <Modal title="Add User" subtitle="Create an institutional account" onClose={() => setShowAddUser(false)} size="md"
          footer={
            <>
              <button onClick={() => setShowAddUser(false)} className={btnSecondaryCls}>Cancel</button>
              <button
                onClick={() => {
                  setUsers((prev) => [{ id: `u-${Date.now()}`, name: 'New User', email: 'user@northbridge.edu', role: 'Program Administrator', status: 'Active', mfa: true, lastActive: 'Never' }, ...prev]);
                  addAudit({ user: 'Rachel Kim', role: 'Compliance Administrator', module: 'Administration', action: 'Created', record: 'User account', ipDevice: '192.168.1.41 · Desktop', outcome: 'Success' });
                  toast('User account created');
                  setShowAddUser(false);
                }}
                className={btnPrimaryCls}
              >
                <i className="ri-user-add-line" /> Create User
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <Field label="Full name" required><input className={inputCls} placeholder="Name" /></Field>
            <Field label="Email" required><input className={inputCls} placeholder="user@northbridge.edu" /></Field>
            <Field label="Role">
              <select className={selectCls}>{ROLES.map((r) => <option key={r.id}>{r.label}</option>)}</select>
            </Field>
          </div>
        </Modal>
      )}

      {toDelete && (
        <ConfirmDialog
          title="Remove user"
          message={`Remove ${toDelete.name} from the institution? This action is recorded in the audit log.`}
          confirmLabel="Remove"
          danger
          onConfirm={() => {
            setUsers((prev) => prev.filter((u) => u.id !== toDelete.id));
            addAudit({ user: 'Rachel Kim', role: 'Compliance Administrator', module: 'Administration', action: 'Deleted', record: toDelete.name, ipDevice: '192.168.1.41 · Desktop', outcome: 'Success' });
            toast('User removed');
            setToDelete(null);
          }}
          onCancel={() => setToDelete(null)}
        />
      )}

      {showRoleMatrix && (
        <Modal title="Role & Permission Matrix" subtitle="View, Create, Edit, Approve, Export, Administer" onClose={() => setShowRoleMatrix(false)} size="2xl"
          footer={<button onClick={() => setShowRoleMatrix(false)} className={btnPrimaryCls}>Close</button>}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line-100">
                  <th className="px-3 py-2.5 text-[11px] font-semibold text-ink-500 uppercase">Role</th>
                  {PERMISSIONS.map((p) => <th key={p} className="px-2 py-2.5 text-[11px] font-semibold text-ink-500 uppercase text-center">{p}</th>)}
                </tr>
              </thead>
              <tbody>
                {ROLES.map((r) => (
                  <tr key={r.id} className="border-b border-line-50">
                    <td className="px-3 py-2.5 text-[13px] font-medium text-ink-900">{r.label}</td>
                    {PERMISSIONS.map((p) => (
                      <td key={p} className="px-2 py-2.5 text-center">
                        <span className={`w-5 h-5 inline-flex items-center justify-center rounded-full ${r.permissions.includes(p) ? 'bg-green-100 text-green-700' : 'bg-canvas-100 text-ink-300'}`}>
                          <i className={`${r.permissions.includes(p) ? 'ri-check-line' : 'ri-close-line'} text-xs`} />
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}
    </div>
  );
}