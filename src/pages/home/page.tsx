import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/context/RoleContext';

export default function Home() {
  const navigate = useNavigate();
  const { currentRole } = useRole();

  useEffect(() => {
    if (currentRole) {
      navigate('/overview');
    } else {
      navigate('/login');
    }
  }, [currentRole, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-canvas-100">
      <span className="w-8 h-8 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}