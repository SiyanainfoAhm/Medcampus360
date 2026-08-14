import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/context/RoleContext';
import { useToast } from '@/context/ToastContext';
import { ROLES } from '@/mocks/users';
import { INSTITUTION } from '@/mocks/institution';

export default function LoginPage() {
  const { setRole } = useRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectRole = (roleId: string) => {
    setLoading(roleId);
    setTimeout(() => {
      setRole(roleId);
      const role = ROLES.find((r) => r.id === roleId);
      toast(`Signed in as ${role?.personaName || 'user'}`);
      const target = roleId === 'learner' ? '/learners/MED-2026-0147' : roleId === 'faculty' ? '/clinical/reviews' : roleId === 'compliance' ? '/compliance' : '/overview';
      navigate(target);
    }, 450);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-[44%] flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute top-20 left-16 w-72 h-72 rounded-full bg-teal-400 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-clinic-500 blur-3xl" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center">
              <i className="ri-hospital-line text-white text-xl" />
            </span>
            <div>
              <h1 className="text-lg font-semibold text-white">MedCampus 360</h1>
              <p className="text-xs text-navy-300">{INSTITUTION.tagline}</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <h2 className="text-[28px] leading-tight font-semibold text-white max-w-md">
            Medical education and clinical learning, unified.
          </h2>
          <p className="text-sm text-navy-300 mt-4 max-w-md leading-relaxed">
            One platform for learners, faculty preceptors, clinical coordinators, and institutional leadership —
            managing rotations, competencies, attendance, assessments, and accreditation evidence.
          </p>
        </div>
        <p className="relative text-[11px] text-navy-400">
          Northbridge University School of Medicine &middot; Boston, Massachusetts &middot; Academic Year 2026-2027
        </p>
      </div>

      {/* Right sign-in panel */}
      <div className="flex-1 flex items-center justify-center bg-canvas-100 p-6">
        <div className="w-full max-w-xl">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <span className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center">
              <i className="ri-hospital-line text-white text-lg" />
            </span>
            <div>
              <h1 className="text-base font-semibold text-ink-900">MedCampus 360</h1>
              <p className="text-[11px] text-ink-500">{INSTITUTION.tagline}</p>
            </div>
          </div>

          <div className="mb-7">
            <h2 className="text-xl font-semibold text-ink-900">Sign in to MedCampus 360</h2>
            <p className="text-sm text-ink-500 mt-1">
              {INSTITUTION.school} · Select your presentation role to continue
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ROLES.map((role) => {
              const isDean = role.id === 'dean';
              return (
                <button
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  disabled={loading !== null}
                  className={`flex items-start gap-3 p-4 bg-white border rounded-lg text-left transition-all hover:border-navy-300 hover:shadow-card disabled:opacity-70 ${
                    isDean ? 'border-navy-900 ring-1 ring-navy-900' : 'border-line-200'
                  }`}
                >
                  <span className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${isDean ? 'bg-navy-900 text-white' : 'bg-clinic-50 text-clinic-700'}`}>
                    {loading === role.id ? (
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <i className={`${role.icon} text-lg`} />
                    )}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-ink-900">
                      {role.label}
                    </span>
                    <span className="block text-xs text-ink-500 mt-0.5">{role.personaName}</span>
                    <span className="block text-[11px] text-ink-400 mt-0.5">{role.description}</span>
                  </span>
                  <i className="ri-arrow-right-s-line text-ink-300 mt-1 flex-shrink-0" />
                </button>
              );
            })}
          </div>

          <div className="mt-7 flex items-center justify-between text-[11px] text-ink-400">
            <span className="flex items-center gap-1.5">
              <i className="ri-shield-check-line text-green-600" />
              HIPAA-aligned privacy controls &middot; Role-based access &middot; Audit logging
            </span>
            <span>v3.0 · AY 2026-27</span>
          </div>
        </div>
      </div>
    </div>
  );
}