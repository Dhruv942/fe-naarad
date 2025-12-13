import React, { useState, useEffect } from "react";
import { usePreferences } from "../contexts/PreferencesContext";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import SectionCard from "../components/common/SectionCard";
import { ICONS, PagePath, INTEREST_TAG_HIERARCHY } from "../constants";
import {
  getAlertsByUserId,
  deleteAlertById,
  toggleAlertById,
  AlertItem,
} from "../services/api";

const getTagTextColor = (backgroundColor: string): string => {
  if (backgroundColor.includes("orange")) return "text-orange-700";
  if (backgroundColor.includes("pink")) return "text-pink-700";
  if (backgroundColor.includes("purple")) return "text-purple-700";
  if (backgroundColor.includes("teal")) return "text-teal-700";
  if (backgroundColor.includes("blue")) return "text-blue-700";
  if (backgroundColor.includes("primary-lightest")) return "text-green-800";
  return "text-primary-darker";
};

const formatTagLabel = (tag: string): string => {
  // Split by underscore and take only the first part, then capitalize
  const firstPart = tag.split("_")[0];
  return firstPart.charAt(0).toUpperCase() + firstPart.slice(1);
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

// Helper function to find question ID from question text
const findQuestionIdByText = (
  questionText: string,
  categoryKey: string
): string | null => {
  console.log(
    `🔍 Looking for question: "${questionText}" in category: ${categoryKey}`
  );

  const category = INTEREST_TAG_HIERARCHY[categoryKey.toUpperCase()];

  if (!category?.subCategories) {
    console.log(`❌ No subcategories found for ${categoryKey.toUpperCase()}`);
    return null;
  }

  console.log(`📂 Found ${category.subCategories.length} subcategories`);

  // Search through all subcategories
  for (const subCat of category.subCategories) {
    if (subCat.followUpQuestions) {
      console.log(
        `  🔎 Checking subcategory: ${subCat.label} (${subCat.followUpQuestions.length} questions)`
      );

      const match = subCat.followUpQuestions.find(
        (q: any) => q.text === questionText
      );
      if (match) {
        console.log(`  ✅ Found match! Question ID: ${match.id}`);
        return match.id;
      }
    }
  }

  console.log(`❌ No match found for question: "${questionText}"`);
  return null;
};

const DashboardPage: React.FC = () => {
  const { user, logout, startNewAlert, setActiveAlert } = usePreferences();
  const navigate = useNavigate();
  const [apiAlerts, setApiAlerts] = useState<any[]>([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(true);
  const [alertsError, setAlertsError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    // Try to get user_id from localStorage first, then from user context
    let userId = localStorage.getItem("user_id");

    if (!userId && user.user_id) {
      console.warn("⚠️ user_id not in localStorage, using user context...");
      userId = user.user_id;
      // Also store it in localStorage for future use
      localStorage.setItem("user_id", userId);
    }

    if (!userId) {
      console.error("❌ User ID not found");
      setAlertsError("User ID not found. Please login again.");
      setIsLoadingAlerts(false);
      return;
    }

    setIsLoadingAlerts(true);
    setAlertsError(null);

    try {
      console.log("📥 Fetching alerts for user_id:", userId);
      const response = await getAlertsByUserId(userId);

      if (response.success) {
        const alertsArray = Array.isArray(response.alerts)
          ? response.alerts
          : [];
        console.log("✅ Alerts fetched successfully:", alertsArray);
        setApiAlerts(alertsArray);
      } else {
        console.error("❌ Failed to fetch alerts:", response.error);
        setAlertsError(response.error || "Failed to fetch alerts");
      }
    } catch (error) {
      console.error("❌ Error fetching alerts:", error);
      setAlertsError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsLoadingAlerts(false);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (!confirm("Are you sure you want to delete this alert?")) {
      return;
    }

    // Try to get user_id from localStorage first, then from user context
    let userId = localStorage.getItem("user_id");

    if (!userId && user.user_id) {
      userId = user.user_id;
      localStorage.setItem("user_id", userId);
    }

    if (!userId) {
      alert("User ID not found. Please login again.");
      return;
    }

    try {
      console.log("🗑️ Deleting alert:", alertId, "for user:", userId);
      const response = await deleteAlertById(userId, alertId);

      if (response.success) {
        console.log("✅ Alert deleted successfully");
        // Remove alert from UI
        setApiAlerts(apiAlerts.filter((alert) => alert.alert_id !== alertId));
      } else {
        console.error("❌ Failed to delete alert:", response.error);
        alert(response.error || "Failed to delete alert");
      }
    } catch (error) {
      console.error("❌ Error deleting alert:", error);
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleToggleAlert = async (
    alertId: string,
    currentIsActive: boolean
  ) => {
    // Try to get user_id from localStorage first, then from user context
    let userId = localStorage.getItem("user_id");

    if (!userId && user.user_id) {
      userId = user.user_id;
      localStorage.setItem("user_id", userId);
    }

    if (!userId) {
      alert("User ID not found. Please login again.");
      return;
    }

    try {
      const action = currentIsActive ? "pause" : "activate";
      console.log(
        `⏯️ Toggling alert (${action}):`,
        alertId,
        "for user:",
        userId
      );

      const response = await toggleAlertById(userId, alertId, currentIsActive);

      if (response.success) {
        console.log(`✅ Alert ${action}d successfully`);
        // Update alert in UI
        setApiAlerts(
          apiAlerts.map((alert) =>
            alert.alert_id === alertId
              ? { ...alert, is_active: !currentIsActive }
              : alert
          )
        );
      } else {
        console.error(`❌ Failed to ${action} alert:`, response.error);
        alert(response.error || `Failed to ${action} alert`);
      }
    } catch (error) {
      console.error("❌ Error toggling alert:", error);
      alert(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const handleEditAlert = (apiAlert: AlertItem) => {
    console.log("\n==================== EDIT ALERT START ====================");
    console.log("✏️ Original API alert:", JSON.stringify(apiAlert, null, 2));

    // Store the alert_id in localStorage for the edit flow
    localStorage.setItem("editing_alert_id", apiAlert.alert_id);
    console.log("💾 Stored editing_alert_id:", apiAlert.alert_id);

    // Initialize empty alert data with all category structures
    const editAlert: any = {
      id: apiAlert.alert_id,
      name: `${apiAlert.main_category} Alert`,
      sports: {
        selectedTags: [],
        followUpAnswers: {},
        instructionTags: [],
        otherSportName: undefined,
        aiFollowUpQuestions: [],
        aiQuestionsAttempted: false,
      },
      moviesTV: {
        selectedTags: [],
        followUpAnswers: {},
        instructionTags: [],
        aiFollowUpQuestions: [],
        aiQuestionsAttempted: false,
      },
      news: {
        selectedTags: [],
        followUpAnswers: {},
        instructionTags: [],
        aiFollowUpQuestions: [],
        aiQuestionsAttempted: false,
      },
      youtube: {
        selectedTags: [],
        followUpAnswers: {},
        instructionTags: [],
        aiFollowUpQuestions: [],
        aiQuestionsAttempted: false,
      },
      customInterestTags: [],
      frequency:
        apiAlert.frequency === "realtime"
          ? "Real-time"
          : apiAlert.frequency || "Real-time",
      customFrequencyTime: apiAlert.customFrequencyTime,
      isActive: apiAlert.is_active,
      tuningFeedback: { liked: [], disliked: [] },
    };

    // Handle Custom Input category
    if (apiAlert.main_category === "Custom_Input") {
      editAlert.customInterestTags = apiAlert.sub_categories || [];
      console.log("📝 Set customInterestTags:", editAlert.customInterestTags);
    } else {
      // Map API category to frontend category key
      const categoryMap: Record<
        string,
        "sports" | "moviesTV" | "news" | "youtube"
      > = {
        Sports: "sports",
        Movies: "moviesTV",
        News: "news",
        YouTube: "youtube",
      };

      const targetCategory = categoryMap[apiAlert.main_category];

      if (targetCategory) {
        // Convert sub_categories (like "Cricket", "Football") to tag IDs (like "sports_cricket")
        const selectedTags: string[] = [];
        const category =
          INTEREST_TAG_HIERARCHY[apiAlert.main_category.toUpperCase()];

        if (category?.subCategories && apiAlert.sub_categories) {
          apiAlert.sub_categories.forEach((subCatLabel) => {
            const subCat = category.subCategories?.find(
              (sc: any) => sc.label.toLowerCase() === subCatLabel.toLowerCase()
            );
            if (subCat) {
              selectedTags.push(subCat.id);
              console.log(`✅ Converted "${subCatLabel}" → "${subCat.id}"`);
            } else {
              // If not found in hierarchy, add as-is (might be custom tag)
              selectedTags.push(subCatLabel);
              console.log(
                `⚠️ Could not find subcategory for "${subCatLabel}", adding as-is`
              );
            }
          });
        }

        editAlert[targetCategory].selectedTags = selectedTags;
        console.log(`📝 Set ${targetCategory}.selectedTags:`, selectedTags);

        // Convert followup_questions back to followUpAnswers format
        if (
          apiAlert.followup_questions &&
          apiAlert.followup_questions.length > 0
        ) {
          const followUpAnswers: any = {};

          apiAlert.followup_questions.forEach((fq) => {
            // Find the question ID by exact text match from constants
            const questionId = findQuestionIdByText(
              fq.question,
              targetCategory
            );

            if (questionId) {
              // Parse the selected answer (could be comma-separated)
              const selectedAnswers = fq.selected_answer
                .split(",")
                .map((s) => s.trim())
                .filter((s) => s.length > 0);

              followUpAnswers[questionId] = {
                selectedPredefinedTags: selectedAnswers,
                customAnswerViaOther: undefined,
              };

              console.log(
                `✅ Mapped question "${fq.question}" to ${questionId}:`,
                selectedAnswers
              );
            } else {
              console.warn(
                `⚠️ Could not find question ID for: "${fq.question}"`
              );
            }
          });

          if (Object.keys(followUpAnswers).length > 0) {
            editAlert[targetCategory].followUpAnswers = followUpAnswers;
            console.log(
              `📝 Set ${targetCategory}.followUpAnswers:`,
              followUpAnswers
            );
          }
        }

        // Convert custom_question to instructionTags if present
        if (apiAlert.custom_question && apiAlert.custom_question.trim()) {
          // For now, store as a custom instruction tag
          // In a real app, you might want to parse this more intelligently
          editAlert[targetCategory].instructionTags = [
            apiAlert.custom_question,
          ];
          console.log(`📝 Set ${targetCategory}.instructionTags:`, [
            apiAlert.custom_question,
          ]);
        }
      }
    }

    console.log("\n📝 Final converted alert:");
    console.log(JSON.stringify(editAlert, null, 2));
    console.log("==================== EDIT ALERT END ====================\n");

    setActiveAlert(editAlert);
    console.log("✅ Set active alert in context");

    navigate(PagePath.INTERESTS);
    console.log("🔄 Navigating to interests page");
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-lightest via-green-50 to-teal-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 page-fade-enter">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full sm:w-auto">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary tracking-tight">
                Your Dashboard
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mt-1">
                Manage your personalized WhatsApp updates.
              </p>
            </div>
            <Button
              onClick={logout}
              variant="danger"
              size="md"
              className="!py-2.5 px-5 shadow-md hover:shadow-lg w-full sm:w-auto shrink-0"
              leftIcon={ICONS.CANCEL}
            >
              Logout
            </Button>
          </div>
        </header>

        <div className="mb-6 sm:mb-8 flex justify-stretch sm:justify-end">
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
              <p className="text-sm sm:text-base text-gray-600">
                Loading your alerts...
              </p>
            </SectionCard>
          )}

          {/* Error State */}
          {!isLoadingAlerts && alertsError && (
            <SectionCard className="text-center py-8 bg-red-50 border-red-200">
              <h2 className="text-lg sm:text-xl font-semibold text-red-700 mb-2">
                Error Loading Alerts
              </h2>
              <p className="text-sm sm:text-base text-red-600">{alertsError}</p>
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
                  <div className="flex justify-between items-start gap-3 sm:gap-4 mb-4">
                    <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 break-words">
                        {apiAlert.main_category} Alert
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        onClick={() => handleEditAlert(apiAlert)}
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:bg-primary-lightest text-sm sm:text-base"
                        leftIcon={ICONS.EDIT}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteAlert(apiAlert.alert_id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 text-sm sm:text-base"
                        leftIcon={ICONS.TRASH}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <strong className="font-medium text-gray-500 text-xs sm:text-sm">
                        Status:
                      </strong>
                      <div className="flex items-center gap-2">
                        {/* Toggle Switch */}
                        <button
                          onClick={() =>
                            handleToggleAlert(
                              apiAlert.alert_id,
                              apiAlert.is_active
                            )
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                            apiAlert.is_active ? "bg-green-500" : "bg-gray-300"
                          }`}
                          role="switch"
                          aria-checked={apiAlert.is_active}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              apiAlert.is_active
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span
                          className={`font-semibold text-sm sm:text-base ${
                            apiAlert.is_active
                              ? "text-green-700"
                              : "text-gray-500"
                          }`}
                        >
                          {apiAlert.is_active ? "Active" : "Paused"}
                        </span>
                      </div>
                    </div>
                    {apiAlert.frequency && (
                      <div className="flex flex-wrap items-center gap-2">
                        <strong className="font-medium text-gray-500 text-xs sm:text-sm">
                          Frequency:
                        </strong>
                        <span className="text-gray-700 text-sm sm:text-base">
                          {apiAlert.frequency}
                          {apiAlert.customFrequencyTime
                            ? ` at ${apiAlert.customFrequencyTime}`
                            : ""}
                        </span>
                      </div>
                    )}
                    {Array.isArray(apiAlert.sub_categories) &&
                      apiAlert.sub_categories.length > 0 && (
                        <div>
                          <strong className="font-medium text-gray-500 text-xs sm:text-sm block mb-2">
                            Interests:
                          </strong>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {apiAlert.sub_categories.map((subCat, idx) => (
                              <DisplayDetailTag
                                key={idx}
                                label={formatTagLabel(subCat)}
                                color="primary-lightest"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    {apiAlert.followup_questions &&
                      apiAlert.followup_questions.length > 0 && (
                        <div>
                          <strong className="font-medium text-gray-500 text-xs sm:text-sm block mb-2">
                            Follow-up Details:
                          </strong>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {apiAlert.followup_questions.map((q, idx) => (
                              <DisplayDetailTag
                                key={idx}
                                label={
                                  typeof q === "string" ? q : q.selected_answer
                                }
                                color="accent-teal-light"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    {apiAlert.custom_question && (
                      <div>
                        <strong className="font-medium text-gray-500 text-xs sm:text-sm block mb-2">
                          Custom Preferences:
                        </strong>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
          {apiAlerts.length === 0 && !isLoadingAlerts && !alertsError && (
            <SectionCard className="text-center py-8 sm:py-12">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-2">
                No Alerts Yet!
              </h2>
              <p className="text-sm sm:text-base text-gray-500 mb-6 px-4">
                Click the button above to create your first personalized alert.
              </p>
              <Button
                onClick={startNewAlert}
                variant="primary"
                size="md"
                leftIcon={ICONS.PLUS}
                className="w-full sm:w-auto"
              >
                Create Your First Alert
              </Button>
            </SectionCard>
          )}
        </div>

        <div className="mt-8 sm:mt-12">
          <SectionCard
            title="Update History & Analytics"
            icon={<span className="text-primary text-2xl sm:text-3xl">📊</span>}
            className="opacity-80 bg-white/80 backdrop-blur-md shadow-lg border border-gray-200/50 hover:opacity-100 transition-opacity"
            titleClassName="!text-lg sm:!text-xl !text-gray-600"
          >
            <div className="text-center py-4 sm:py-5 px-4">
              <p className="text-gray-500 font-medium text-base sm:text-lg">
                Coming Soon!
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
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
