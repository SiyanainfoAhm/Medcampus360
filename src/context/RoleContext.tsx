import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Role } from '@/mocks/users';
import { getRoleById } from '@/mocks/users';

interface RoleContextType {
  currentRole: Role | null;
  setRole: (roleId: string) => void;
  logout: () => void;
  canAccessModule: (moduleId: string) => boolean;
}

const RoleContext = createContext<RoleContextType | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role | null>(() => {
    const saved = localStorage.getItem('mc360_role');
    if (saved) {
      const role = getRoleById(saved);
      return role || null;
    }
    return null;
  });

  const setRole = useCallback((roleId: string) => {
    const role = getRoleById(roleId);
    if (role) {
      localStorage.setItem('mc360_role', roleId);
      setCurrentRole(role);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mc360_role');
    setCurrentRole(null);
  }, []);

  const canAccessModule = useCallback(
    (moduleId: string) => {
      if (!currentRole) return false;
      return currentRole.modules.includes(moduleId);
    },
    [currentRole]
  );

  return (
    <RoleContext.Provider value={{ currentRole, setRole, logout, canAccessModule }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}