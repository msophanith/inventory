import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/use-auth';

export default function AdminRoute() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAdmin) {
    return <Navigate to='/sell' replace />;
  }

  return <Outlet />;
}
