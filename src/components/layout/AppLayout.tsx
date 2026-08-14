import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useRole } from '@/context/RoleContext';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { currentRole } = useRole();

  // If signed out, pages under AppLayout still render for presentation;
  // the header shows the current persona. Login flow sets the role.
  void currentRole;
  void location;

  return (
    <div className="min-h-screen bg-canvas-100">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <div className={`transition-all duration-200 ${collapsed ? 'ml-[64px]' : 'ml-[260px]'}`}>
        <Header />
        <main className="px-6 pt-8 pb-12 min-h-[calc(100vh-64px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}