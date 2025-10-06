import React, { useState, useEffect } from "react";
import { usePreferences } from "../contexts/PreferencesContext";
import Button from "../components/common/Button";
import SectionCard from "../components/common/SectionCard";
import { ICONS } from "../constants";
import { getAlertsByUserId, deleteAlertById, AlertItem } from "../services/api";

const getTagTextColor = (backgroundColor: string): string => {
  if (backgroundColor.includes("orange")) return "text-orange-700";
  if (backgroundColor.includes("pink")) return "text-pink-700";
  if (backgroundColor.includes("purple")) return "text-purple-700";
  if (backgroundColor.includes("teal")) return "text-teal-700";
  if (backgroundColor.includes("blue")) return "text-blue-700";
  if (backgroundColor.includes("primary-lightest")) return "text-green-800";
  return "text-primary-darker";
};

const DisplayDetailTag: React.FC<{
  label: string;
  icon?: React.ReactNode;
  color?: string;
}> = ({ label, icon, color = "primary-lightest" }) => {
  const textColorClass = getTagTextColor(color);
  return (
    <span
      className={`bg-${color} ${textColorClass} px-2.5 py-1 rounded-full text-xs font-medium shadow-sm border border-black/5 inline-flex items-center gap-1.5`}
    >
      {icon && <span className="text-sm">{icon}</span>}
      {label}
    </span>
  );
};

const DashboardPage: React.FC = () => {
  const { user, logout, startNewAlert } = usePreferences();
  const [apiAlerts, setApiAlerts] = useState<AlertItem[]>([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);
  const [alertsError, setAlertsError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      setIsLoadingAlerts(false);
      return;
    }

    setIsLoadingAlerts(true);
    setAlertsError(null);

    try {
      const response = await getAlertsByUserId(userId);

      if (response.success && response.alerts) {
        setApiAlerts(response.alerts);
      } else {
        setAlertsError(response.error || "Failed to fetch alerts");
      }
    } catch (error) {
      setAlertsError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoadingAlerts(false);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (!confirm("Are you sure you want to delete this alert?")) {
      return;
    }

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      alert("User ID not found. Please login again.");
      return;
    }

    try {
      const response = await deleteAlertById(userId, alertId);

      if (response.success) {
        // Remove alert from UI
        setApiAlerts(apiAlerts.filter((alert) => alert.alert_id !== alertId));
      } else {
        alert(response.error || "Failed to delete alert");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-lightest via-green-50 to-teal-100 py-10 px-4 sm:px-6 lg:px-8 page-fade-enter">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-secondary tracking-tight">
                Your Dashboard
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Manage your personalized WhatsApp updates.
              </p>
            </div>
            <Button
              onClick={logout}
              variant="danger"
              size="md"
              className="!py-2.5 px-5 shadow-md hover:shadow-lg"
              leftIcon={ICONS.CANCEL}
            >
              Logout
            </Button>
          </div>
        </header>

        <div className="mb-8 flex justify-center sm:justify-end">
          <Button
            onClick={startNewAlert}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            leftIcon={ICONS.PLUS}
          >
            Create New Alert
          </Button>
        </div>

        <div className="space-y-6">
          {/* Loading State */}
          {isLoadingAlerts && (
            <SectionCard className="text-center py-8">
              <p className="text-gray-600">Loading your alerts...</p>
            </SectionCard>
          )}

          {/* Error State */}
          {!isLoadingAlerts && alertsError && (
            <SectionCard className="text-center py-8 bg-red-50 border-red-200">
              <h2 className="text-xl font-semibold text-red-700 mb-2">
                Error Loading Alerts
              </h2>
              <p className="text-red-600">{alertsError}</p>
            </SectionCard>
          )}

          {/* API Alerts Section */}
          {!isLoadingAlerts && !alertsError && apiAlerts.length > 0 && (
            <>
              {apiAlerts.map((apiAlert) => (
                <SectionCard
                  key={apiAlert.alert_id}
                  className="bg-white/95 backdrop-blur-md shadow-xl-dark border border-gray-200/70"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-semibold text-gray-800">
                        {apiAlert.main_category} Alert
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        onClick={() => handleDeleteAlert(apiAlert.alert_id)}
                        variant="ghost"
                        size="sm"
                        className="w-full sm:w-auto text-red-500 hover:bg-red-50"
                        leftIcon={ICONS.TRASH}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <strong className="font-medium text-gray-500 text-sm">Status:</strong>
                      <span className="ml-2 font-semibold text-green-700">Active</span>
                    </div>
                    {apiAlert.frequency && (
                      <div>
                        <strong className="font-medium text-gray-500 text-sm">
                          Frequency:
                        </strong>
                        <span className="ml-2 text-gray-700">
                          {apiAlert.frequency}
                          {apiAlert.customFrequencyTime
                            ? ` at ${apiAlert.customFrequencyTime}`
                            : ""}
                        </span>
                      </div>
                    )}
                    {apiAlert.sub_categories && apiAlert.sub_categories.length > 0 && (
                      <div>
                        <strong className="font-medium text-gray-500 text-sm block mb-1.5">
                          Interests:
                        </strong>
                        <div className="flex flex-wrap gap-2">
                          {apiAlert.sub_categories.map((subCat, idx) => (
                            <DisplayDetailTag
                              key={idx}
                              label={subCat}
                              color="primary-lightest"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {apiAlert.followup_questions && apiAlert.followup_questions.length > 0 && (
                      <div>
                        <strong className="font-medium text-gray-500 text-sm block mb-1.5">
                          Follow-up Details:
                        </strong>
                        <div className="flex flex-wrap gap-2">
                          {apiAlert.followup_questions.map((q, idx) => (
                            <DisplayDetailTag
                              key={idx}
                              label={q}
                              color="accent-teal-light"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {apiAlert.custom_question && (
                      <div>
                        <strong className="font-medium text-gray-500 text-sm block mb-1.5">
                          Custom Preferences:
                        </strong>
                        <div className="flex flex-wrap gap-2">
                          <DisplayDetailTag
                            label={apiAlert.custom_question}
                            color="pink-light"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </SectionCard>
              ))}
            </>
          )}

          {/* No Alerts Message */}
          {apiAlerts.length === 0 && !isLoadingAlerts && (
            <SectionCard className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                No Alerts Yet!
              </h2>
              <p className="text-gray-500 mb-6">
                Click the button above to create your first personalized alert.
              </p>
              <Button
                onClick={startNewAlert}
                variant="primary"
                size="md"
                leftIcon={ICONS.PLUS}
              >
                Create Your First Alert
              </Button>
            </SectionCard>
          )}
        </div>

        <div className="mt-12">
          <SectionCard
            title="Update History & Analytics"
            icon={<span className="text-primary text-3xl">📊</span>}
            className="opacity-80 bg-white/80 backdrop-blur-md shadow-lg border border-gray-200/50 hover:opacity-100"
            titleClassName="!text-xl !text-gray-600"
          >
            <div className="text-center py-5">
              <p className="text-gray-500 font-medium text-lg">Coming Soon!</p>
              <p className="text-gray-500 mt-1">
                Track updates received and insights into your most engaged
                topics.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
