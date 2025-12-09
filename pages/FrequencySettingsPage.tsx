import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { usePreferences } from "../contexts/PreferencesContext";
import Button from "../components/common/Button";
import TagButton from "../components/common/TagButton";
import SectionCard from "../components/common/SectionCard";
import ProgressIndicator from "../components/common/ProgressIndicator";
import { ICONS, PagePath } from "../constants";
import { UpdateFrequency, Alert } from "../types";
import { createAlert, updateAlertById } from "../services/api";
import { transformAlertToApiFormat } from "../utils/alertTransformer";

const FrequencySettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeAlert, setActiveAlert, user, saveActiveAlert } =
    usePreferences();
  const [timeError, setTimeError] = useState("");

  // Ensure activeAlert exists and has default frequency
  useEffect(() => {
    if (!activeAlert) {
      navigate(PagePath.DASHBOARD);
    } else if (!activeAlert.frequency) {
      // Set default to REAL_TIME immediately
      setActiveAlert((prev) =>
        prev ? { ...prev, frequency: UpdateFrequency.REAL_TIME } : null
      );
    }
  }, [activeAlert, navigate, setActiveAlert]);

  if (!activeAlert) {
    return <Navigate to={PagePath.DASHBOARD} replace />;
  }

  const handleUpdateAlert = (updater: (prevAlert: Alert) => Alert) => {
    setActiveAlert((prev) => (prev ? updater(prev) : null));
  };

  const frequencyOptions = Object.values(UpdateFrequency);

  const handleFrequencyTagSelect = (newFrequency: UpdateFrequency) => {
    if (newFrequency !== UpdateFrequency.REAL_TIME) return;

    handleUpdateAlert((prev) => ({
      ...prev,
      frequency: newFrequency,
      customFrequencyTime: undefined,
    }));
    setTimeError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Since only REAL_TIME is allowed, no need to validate customTime
    setTimeError("");

    if (!activeAlert) return;

    try {
      // Get user_id from localStorage (primary source)
      let userId = localStorage.getItem("user_id");

      // Fallback: Try to get from user context if available
      if (!userId && user.user_id) {
        console.warn("⚠️ user_id not in localStorage, using user context...");
        userId = user.user_id;
        // Also store it in localStorage for future use
        localStorage.setItem("user_id", userId);
      }

      if (!userId) {
        console.error("❌ User ID not found in localStorage");
        console.error("localStorage contents:", {
          user_id: localStorage.getItem("user_id"),
          authToken: localStorage.getItem("authToken") ? "exists" : "missing",
        });
        alert(
          "User ID not found. Please login again.\n\nIf you just logged in, please refresh the page and try again."
        );
        navigate(PagePath.LANDING);
        return;
      }

      console.log("✅ User ID found:", userId);

      // Check if we're in edit mode
      const editingAlertId = localStorage.getItem("editing_alert_id");
      const isEditMode = !!editingAlertId;

      console.log(
        isEditMode ? "📝 Updating alert" : "📤 Creating alert",
        "with user_id:",
        userId
      );
      console.log("📦 Active alert data:", activeAlert);

      // Transform alert to API format
      const alertData = transformAlertToApiFormat(activeAlert);
      console.log("🔄 Transformed alert data:", alertData);

      let response;

      if (isEditMode) {
        // Update existing alert
        console.log("✏️ Updating alert ID:", editingAlertId);
        response = await updateAlertById(userId, editingAlertId, {
          ...alertData,
          user_id: userId,
        });
      } else {
        // Create new alert
        response = await createAlert({
          ...alertData,
          user_id: userId,
        });
      }

      console.log("📥 Backend response:", response);

      if (response.success) {
        // Save to local state as well
        saveActiveAlert();
        
        // Clear edit mode flag
        if (isEditMode) {
          localStorage.removeItem("editing_alert_id");
        }
        
        alert(
          isEditMode
            ? "Alert Updated! Redirecting to your dashboard..."
            : "Alert Saved! You're all set. Redirecting to your dashboard..."
        );
        navigate(PagePath.DASHBOARD);
      } else {
        console.error(
          `❌ Failed to ${isEditMode ? "update" : "create"} alert:`,
          response.error
        );
        alert(
          `Failed to ${isEditMode ? "update" : "save"} alert: ${
            response.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("❌ Error saving alert:", error);
      alert("An error occurred while saving your alert. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-secondary-dark to-gray-900 text-white page-fade-enter">
      <div className="max-w-xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <ProgressIndicator
          currentStep={2}
          steps={["Select Interests", "Set Cadence"]}
        />

        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Set Cadence for{" "}
            <span className="text-primary">{activeAlert.name}</span>
          </h1>
          <p className="text-base sm:text-lg text-primary-lighter/80 mt-3">
            Almost there! Choose how often you'd like to receive your updates.
          </p>
        </header>

        <form onSubmit={handleSubmit}>
          <SectionCard className="bg-white/5 backdrop-blur-xl shadow-2xl border border-white/10">
            <div className="mb-8">
              <label className="block text-md font-semibold text-primary-lighter mb-4">
                How often should updates arrive?
              </label>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {frequencyOptions.map((freq) => {
                  const isDisabled = freq !== UpdateFrequency.REAL_TIME;
                  const isSelected = activeAlert.frequency === freq;

                  return (
                    <div key={freq} className="relative h-full">
                      <button
                        type="button"
                        onClick={() =>
                          !isDisabled && handleFrequencyTagSelect(freq)
                        }
                        disabled={isDisabled}
                        className={`
                          w-full h-full rounded-lg py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium
                          transition-all duration-200 whitespace-nowrap
                          ${
                            isSelected && !isDisabled
                              ? "bg-primary text-white ring-2 ring-primary-dark shadow-lg"
                              : isDisabled
                              ? "bg-gray-700/30 text-gray-400 cursor-not-allowed opacity-60"
                              : "bg-gray-700/50 text-gray-100 hover:bg-gray-700"
                          }
                        `}
                      >
                        {freq}
                      </button>
                      {isDisabled && (
                        <div className="absolute -bottom-1 left-0 right-0 flex items-center justify-center pointer-events-none">
                          <span className="text-[10px] text-yellow-400/90 whitespace-nowrap font-medium">
                            Coming Soon
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10">
              <p className="block text-md font-semibold text-primary-lighter mb-3">
                Delivery Platform:
              </p>
              <div className="bg-primary-lighter/10 p-4 rounded-lg border-2 border-primary/40 shadow-sm">
                <div className="flex items-center">
                  <input
                    id="whatsapp-platform"
                    name="platform"
                    type="radio"
                    checked={user.platform === "WhatsApp"}
                    readOnly
                    className="focus:ring-primary h-5 w-5 text-primary border-gray-400 cursor-not-allowed bg-gray-600"
                  />
                  <label
                    htmlFor="whatsapp-platform"
                    className="ml-3 block text-md font-medium text-primary-lighter flex items-center"
                  >
                    <span className="mr-2 text-xl">{ICONS.WHATSAPP}</span>{" "}
                    WhatsApp
                  </label>
                </div>
                <p className="ml-9 mt-1 text-xs text-gray-400">
                  (Currently the only platform. More coming soon!)
                </p>
              </div>
            </div>
          </SectionCard>

          <div className="mt-12 pt-8 border-t border-primary-lighter/20 flex flex-col-reverse sm:flex-row justify-between items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(PagePath.INTERESTS)}
              className="w-full sm:w-auto text-primary-lighter/80 hover:text-white !py-3 px-6"
              leftIcon={ICONS.ARROW_LEFT}
            >
              Back to Interests
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white !py-3.5 px-8 shadow-lg hover:shadow-xl"
              leftIcon={ICONS.CHECK}
            >
              Confirm & Create Alert
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FrequencySettingsPage;
