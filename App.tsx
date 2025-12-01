import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import LandingPage from "./pages/LandingPage";
import InterestSelectionPage from "./pages/InterestSelectionPage";
import PersonalizationTuningPage from "./pages/PersonalizationTuningPage";
import FrequencySettingsPage from "./pages/FrequencySettingsPage";
import DashboardPage from "./pages/DashboardPage";
import PrivacyPolicyPage from "./pages/privacypolicy";
import { usePreferences } from "./contexts/PreferencesContext";
import { PagePath } from "./constants";

const App: React.FC = () => {
  const { user } = usePreferences();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Check authentication: user must have both email and whatsappNumber
  const isAuthenticated = user.email !== "" && user.whatsappNumber !== "";

  useEffect(() => {
    // Scroll to top on every route change
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // If user is authenticated and visiting landing page, redirect to dashboard
    if (isAuthenticated && pathname === PagePath.LANDING) {
      console.log("✅ User is authenticated, redirecting to dashboard");
      navigate(PagePath.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, pathname, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path={PagePath.LANDING} element={<LandingPage />} />
        <Route path={PagePath.INTERESTS} element={<InterestSelectionPage />} />
        <Route
          path={PagePath.TUNING}
          element={
            isAuthenticated ? (
              <PersonalizationTuningPage />
            ) : (
              <Navigate to={PagePath.LANDING} replace />
            )
          }
        />
        <Route
          path={PagePath.FREQUENCY}
          element={
            isAuthenticated ? (
              <FrequencySettingsPage />
            ) : (
              <Navigate to={PagePath.LANDING} replace />
            )
          }
        />
        <Route
          path={PagePath.DASHBOARD}
          element={
            isAuthenticated ? (
              <DashboardPage />
            ) : (
              <Navigate to={PagePath.LANDING} replace />
            )
          }
        />
        <Route path={PagePath.PRIVACY_POLICY} element={<PrivacyPolicyPage />} />
        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? PagePath.DASHBOARD : PagePath.LANDING}
              replace
            />
          }
        />
      </Routes>
      <Analytics />
    </div>
  );
};

export default App;
