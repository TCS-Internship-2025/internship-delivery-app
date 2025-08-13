import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider.tsx';
import { ToastProvider } from '@/providers/ToastProvider.tsx';

import { ParcelForm } from '@/pages/ParcelForm.tsx';
import { ParcelPage } from '@/pages/Parcels.tsx';
import { RecipientForm } from '@/pages/RecipientForm.tsx';
import { ProviderPage } from '@/pages/Success.tsx';
import { Tracking } from '@/pages/Tracking.tsx';
import { Verified } from '@/pages/Verified.tsx';
import { Verify } from '@/pages/Verify.tsx';

import { AppLayout } from '@/components/AppLayout.tsx';
import Faq from './components/Faq.tsx';
import { FormProgressBar } from './components/FormProgressBar.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import TrackingSlug from './pages/[slug]/TrackingSlug.tsx';
import { ErrorPage } from './pages/Error.tsx';
import GDPRPage from './pages/GDPRPage.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { Login } from './pages/Login.tsx';
import { NewPassword } from './pages/NewPassword.tsx';
import { ParcelDetails } from './pages/ParcelDetails.tsx';
import { PasswordReset } from './pages/PasswordReset.tsx';
import { ProfileInfo } from './pages/ProfileInfo.tsx';
import { Register } from './pages/Register.tsx';
import { SiteNotFound } from './pages/SiteNotFound.tsx';
import { LocalizationProvider } from './providers/LocalizationProvider.tsx';

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
        path: ROUTES.VERIFY,
        element: <Verify />,
      },
      {
        path: ROUTES.VERIFIED,
        element: <Verified />,
      },
      {
        path: ROUTES.PASSWORDRESET,
        element: <PasswordReset />,
      },
      {
        path: ROUTES.NEWPASSWORD,
        element: <NewPassword />,
      },

      // App layout shared for public + protected pages
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <LandingPage />,
          },
          {
            path: ROUTES.GDPR,
            element: <GDPRPage />,
          },
          {
            path: ROUTES.TRACKING,
            element: <Tracking />,
          },
          {
            path: ROUTES.TRACKINGSLUG,
            element: <TrackingSlug />,
          },
          { path: ROUTES.FAQ, element: <Faq categories={['delivery', 'tracking']} /> },

          {
            element: <ProtectedRoute />,
            children: [
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
                element: <FormProgressBar />,
                children: [
                  {
                    path: ROUTES.RECIPIENT_FORM,
                    element: <RecipientForm />,
                  },
                  {
                    path: ROUTES.PARCEL_FORM,
                    element: <ParcelForm />,
                  },
                ],
              },

              {
                path: ROUTES.PROFILE,
                element: <ProfileInfo />,
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
  const queryClient = new QueryClient();
  document.documentElement.style.scrollBehavior = 'smooth';
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <LocalizationProvider>
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
          </LocalizationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}

if (!import.meta.vitest) {
  setupApp();
}
