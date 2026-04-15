// router component.
import React, { Suspense, lazy } from "react";
import { Navigate, createBrowserRouter, useLocation } from "react-router-dom";
import { authStorage } from "./services/authService";

const Login = lazy(() => import("./pages/Auth/Login"));
const Signup = lazy(() => import("./pages/Auth/Signup"));
const VerifyEmail = lazy(() => import("./pages/Auth/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/Auth/ResetPassword"));
const Home = lazy(() => import("./pages/Home/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const SavedListings = lazy(() => import("./pages/Dashboard/SavedListings"));
const Account = lazy(() => import("./pages/Dashboard/Account"));
const StripeCheckout = lazy(() => import("./pages/Checkout/StripeCheckout"));

const LoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-zinc-100 via-amber-50 to-amber-200 flex items-center justify-center">
    <p className="text-sm text-zinc-600">Loading...</p>
  </div>
);

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const token = authStorage.getToken();

  if (!token) {
    const redirectPath = `${location.pathname}${location.search}${location.hash}`;
    return (
      <Navigate
        to={`/auth?redirect=${encodeURIComponent(redirectPath)}`}
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
};

const withSuspense = (element) => (
  <Suspense fallback={<LoadingScreen />}>{element}</Suspense>
);

const withProtectedSuspense = (element) =>
  withSuspense(<RequireAuth>{element}</RequireAuth>);

const router = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<Home />),
  },
  {
    path: "/auth",
    element: withSuspense(<Login />),
  },
  {
    path: "/auth/login",
    element: withSuspense(<Login />),
  },
  {
    path: "/auth/signup",
    element: withSuspense(<Signup />),
  },
  {
    path: "/auth/verify-email",
    element: withSuspense(<VerifyEmail />),
  },
  {
    path: "/auth/forgot-password",
    element: withSuspense(<ForgotPassword />),
  },
  {
    path: "/auth/forget-password",
    element: withSuspense(<ForgotPassword />),
  },
  {
    path: "/auth/reset-password",
    element: withSuspense(<ResetPassword />),
  },
  {
    path: "/auth/reset-password/:token",
    element: withSuspense(<ResetPassword />),
  },
  {
    path: "/login",
    element: withSuspense(<Login />),
  },
  {
    path: "/signup",
    element: withSuspense(<Signup />),
  },
  {
    path: "/verify-email",
    element: withSuspense(<VerifyEmail />),
  },
  {
    path: "/forgot-password",
    element: withSuspense(<ForgotPassword />),
  },
  {
    path: "/forget-password",
    element: withSuspense(<ForgotPassword />),
  },
  {
    path: "/reset-password",
    element: withSuspense(<ResetPassword />),
  },
  {
    path: "/reset-password/:token",
    element: withSuspense(<ResetPassword />),
  },
  {
    path: "/dashboard",
    element: withProtectedSuspense(<Dashboard />),
  },
  {
    path: "/saved-listings",
    element: withProtectedSuspense(<SavedListings />),
  },
  {
    path: "/accounts",
    element: withProtectedSuspense(<Account />),
  },
  {
    path: "/checkout",
    element: withProtectedSuspense(<StripeCheckout />),
  },
]);

export default router;
