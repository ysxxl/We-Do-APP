import { createContext, useContext, useState, type ReactNode } from 'react';

export type Route =
  | 'landing'
  | 'login'
  | 'signup'
  | 'onboarding'
  | 'dashboard'
  | 'tasks'
  | 'habits'
  | 'settings';

type RouterContextValue = {
  route: Route;
  navigate: (r: Route) => void;
};

const RouterContext = createContext<RouterContextValue | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>('landing');
  const navigate = (r: Route) => {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
