import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';

import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { QueryClientProvider } from '@tanstack/react-query';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/providers/ThemeProvider.tsx';
import { ToastProvider } from '@/providers/ToastProvider.tsx';

import { Page0 } from '@/pages/Page0.tsx';
import { Page1 } from '@/pages/Page1.tsx';
import { Page2 } from '@/pages/Page2.tsx';
import { Page3 } from '@/pages/Page3.tsx';
import { Page4 } from '@/pages/Page4.tsx';

import { AppLayout } from '@/components/AppLayout.tsx';
import { ProtectedRoute } from '@/components/ProtectedRoute.tsx';
import { ErrorPage } from './pages/Error.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';
import { SiteNotFound } from './pages/SiteNotFound.tsx';
import { ProviderPage } from './pages/Success.tsx';
import { LocalizationProvider } from './providers/LocalizationProvider.tsx';
import { queryClient } from './queryClient.ts';

console.log('Commit SHA:', import.meta.env.VITE_COMMIT_HASH);

const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((module) => ({
    default: module.ReactQueryDevtools,
  }))
);

const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Login />, // Login page as a standalone route
  },
  {
    path: ROUTES.REGISTER,
    element: <Register />, // Register page as a standalone route
  },
  {
    element: <AppLayout />,
    errorElement: <SiteNotFound />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Page0 />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PAGE1,
        element: <Page1 />,
      },
      {
        path: ROUTES.PAGE2,
        element: <Page2 />,
      },
      {
        path: ROUTES.PAGE3,
        element: <Page3 />,
      },
      {
        path: ROUTES.PAGE4,
        element: <Page4 />,
      },
      {
        path: ROUTES.PAGE5,
        children: [
          {
            path: ROUTES.SUCCESS,
            element: <ProviderPage />,
          },
          {
            path: ROUTES.ERROR,
            element: <ErrorPage />,
          },
        ],
      },
    ],
  },
]);

// Register ag-grid modules only when needed
if (typeof window !== 'undefined') {
  ModuleRegistry.registerModules([AllCommunityModule]);
}

export function setupApp() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider>
        <LocalizationProvider>
          <QueryClientProvider client={queryClient}>
            {import.meta.env.DEV && (
              <Suspense fallback={null}>
                <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
              </Suspense>
            )}
            <ToastProvider>
              <AuthProvider>
                <RouterProvider router={router} />
              </AuthProvider>
            </ToastProvider>
          </QueryClientProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </StrictMode>
  );
}

if (!import.meta.vitest) {
  setupApp();
}
