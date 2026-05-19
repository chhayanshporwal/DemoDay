// ==========================================
// useAuth Hook — Auth state selector
// Connects UI components to Zustand store Auth slice
// ==========================================

import { useStore } from '../store/useStore';

export function useAuth() {
  const { isAuthenticated, user } = useStore();
  return { isAuthenticated, user };
}

export default useAuth;
