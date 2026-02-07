import { Navigate } from 'react-router-dom';
import { isOnboarded } from '@/lib/storage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isOnboarded()) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
