import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { QueryClientProvider } from '@tanstack/react-query';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import { AuthProvider } from '@/providers/AuthProvider';
import { FormProvider } from '@/providers/FormProvider.tsx';
import { ThemeProvider } from '@/providers/ThemeProvider.tsx';
import { ToastProvider } from '@/providers/ToastProvider.tsx';

import { ParcelForm } from '@/pages/ParcelForm.tsx';
import { ParcelPage } from '@/pages/Parcels.tsx';
import { RecipientForm } from '@/pages/RecipientForm.tsx';
import { Tracking } from '@/pages/Tracking.tsx';

import { AppLayout } from '@/components/AppLayout.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import TrackingSlug from './pages/[slug]/TrackingSlug.tsx';
import { ErrorPage } from './pages/Error.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { Login } from './pages/Login.tsx';
import { ParcelDetails } from './pages/ParcelDetails.tsx';
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
    errorElement: <SiteNotFound />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <Login />,
      },
      {
        path: ROUTES.REGISTER,
        element: <Register />,
      },

      {
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoute>
                    <LandingPage />
                  </ProtectedRoute>
                ),
              },
              {
                path: ROUTES.PARCELS,
                children: [
                  {
                    index: true,
                    element: <ParcelPage />,
                  },
                  {
                    path: ROUTES.DETAILS,
                    element: <ParcelDetails />,
                  },
                ],
              },
              {
                path: ROUTES.RECIPIENT_FORM,
                element: <RecipientForm />,
              },
              {
                path: ROUTES.PARCEL_FORM,
                element: <ParcelForm />,
              },
              {
                path: ROUTES.TRACKING,
                element: <Tracking />,
              },
              {
                path: ROUTES.TRACKINGSLUG,
                element: <TrackingSlug />,
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
                <FormProvider>
                  <RouterProvider router={router} />
                </FormProvider>
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
