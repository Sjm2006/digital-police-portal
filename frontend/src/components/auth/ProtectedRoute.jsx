import ProtectedRoute from '../components/auth/ProtectedRoute';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-slate-500">
          Verifying your session...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    const dashboardRoutes = {
      citizen: '/citizen/dashboard',
      officer: '/officer/dashboard',
      admin: '/admin/dashboard',
    };

    return (
      <Navigate
        to={dashboardRoutes[user.role] || '/'}
        replace
      />
    );
  }

  return <Outlet />;
}
