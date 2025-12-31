const API_BASE_URL = "https://naaradupdates.info";

export interface LoginRequest {
  email: string;
  country_code: string;
  phone_number: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    id?: string;
    email?: string;
    whatsappNumber?: string;
    token?: string;
    user_id?: string;
  };
  user_id?: string; // Backend might send user_id at root level
  id?: string; // Or might send id at root level
  error?: string;
}

export interface FollowUpQuestion {
  question: string;
  selected_answer: string;
  options: string[];
}

export interface AlertItem {
  alert_id: string;
  main_category: string;
  sub_categories: string[];
  followup_questions: FollowUpQuestion[];
  custom_question: string;
  user_id: string;
  frequency?: string;
  customFrequencyTime?: string;
  is_active: boolean;
  // Add more fields if your API sends them
}

export interface GetAlertsResponse {
  success: boolean;
  alerts?: AlertItem[];
  message?: string;
  error?: string;
}
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  console.log("🌐 API Service - Login function called");
  console.log("📍 API Base URL:", API_BASE_URL);
  console.log("📦 Request payload:", data);

  try {
    const url = `${API_BASE_URL}/auth/login`;
    console.log("🔗 Full request URL:", url);

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    console.log("⚙️ Request options:", requestOptions);
    console.log("⏳ Sending fetch request...");

    const response = await fetch(url, requestOptions);

    console.log("📡 Response status:", response.status);
    console.log("📡 Response status text:", response.statusText);
    console.log(
      "📡 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const result = await response.json();
    console.log("📄 Response body:", result);

    if (!response.ok) {
      console.warn("⚠️ Response not OK, status:", response.status);
      const errorMessage =
        result.message ||
        result.error ||
        result.detail ||
        JSON.stringify(result) ||
        "Login failed";
      console.error("🔴 Error message from server:", errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }

    console.log("✅ Login API call successful");
    console.log("📦 Raw API response:", JSON.stringify(result, null, 2));

    // Extract user_id from various possible locations
    const extractedUserId =
      result.user?.user_id ||
      result.user?.id ||
      result.user_id ||
      result.id ||
      result.data?.user_id ||
      result.data?.id;

    console.log("🔍 Extracted user_id from response:", extractedUserId);
    console.log("📦 Returning response:", {
      success: true,
      user: result.user,
      user_id: extractedUserId,
      id: result.id,
      message: result.message,
    });

    return {
      success: true,
      user: result.user,
      user_id: extractedUserId,
      id: result.id,
      message: result.message,
    };
  } catch (error) {
    console.error("❌ API Service - Login error:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
};

export interface CreateAlertRequest {
  user_id: string; // Required
  main_category: "Sports" | "News" | "Movies" | "YouTube" | "Custom_Input"; // Required
  sub_categories?: string[]; // Optional
  followup_questions?: FollowUpQuestion[]; // Optional - array of question objects
  custom_question?: string; // Optional
}

export interface CreateAlertResponse {
  success: boolean;
  message?: string;
  alert?: {
    id: string;
    main_category: string;
    sub_categories: string[];
    followup_questions: string[];
    custom_question: string;
    user_id: string;
  };
  error?: string;
}

export const createAlert = async (
  data: CreateAlertRequest
): Promise<CreateAlertResponse> => {
  console.log("🌐 API Service - Create Alert function called");
  console.log("📍 API Base URL:", API_BASE_URL);
  console.log("📦 Request payload:", data);

  try {
    const url = `${API_BASE_URL}/alerts/`;
    console.log("🔗 Full request URL:", url);

    const authToken = localStorage.getItem("authToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
      console.log("🔑 Adding auth token to headers");
    }

    const requestOptions = {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    };

    console.log("⚙️ Request options:", requestOptions);
    console.log("⏳ Sending fetch request...");

    const response = await fetch(url, requestOptions);

    console.log("📡 Response status:", response.status);
    console.log("📡 Response status text:", response.statusText);
    console.log(
      "📡 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const result = await response.json();
    console.log("📄 Response body:", result);

    if (!response.ok) {
      console.warn("⚠️ Response not OK, status:", response.status);
      const errorMessage =
        result.message ||
        result.error ||
        result.detail ||
        JSON.stringify(result) ||
        "Failed to create alert";
      console.error("🔴 Error message from server:", errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }

    console.log("✅ Create Alert API call successful");
    return {
      success: true,
      alert: result.alert || result,
      message: result.message,
    };
  } catch (error) {
    console.error("❌ API Service - Create Alert error:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
};

export const getAlertsByUserId = async (
  userId: string
): Promise<GetAlertsResponse> => {
  console.log("🌐 API Service - Get Alerts by User ID called");
  console.log("📍 API Base URL:", API_BASE_URL);
  console.log("🧑 User ID:", userId);

  try {
    const url = `${API_BASE_URL}/alerts/${userId}`;
    console.log("🔗 Full request URL:", url);

    const authToken = localStorage.getItem("authToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
      console.log("🔑 Adding auth token to headers");
    }

    const response = await fetch(url, { method: "GET", headers });

    console.log("📡 Response status:", response.status);
    const result = await response.json();
    console.log("📄 Response body:", result);

    if (!response.ok) {
      console.warn("⚠️ Response not OK");
      return {
        success: false,
        error: result.message || result.error || "Failed to fetch alerts",
      };
    }

    // Handle different response formats:
    // 1. Direct array: [alert1, alert2]
    // 2. Object with alerts: {alerts: [...]}
    // 3. Object with data: {data: [...]}
    const normalizedAlerts = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
      ? result.data
      : Array.isArray(result?.alerts)
      ? result.alerts
      : [];

    console.log("📦 Normalized alerts:", normalizedAlerts);
    console.log("📦 Alerts count:", normalizedAlerts.length);

    return {
      success: true,
      alerts: normalizedAlerts,
    };
  } catch (error) {
    console.error("❌ Error fetching alerts:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export interface DeleteAlertResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ToggleAlertResponse {
  success: boolean;
  message?: string;
  error?: string;
  is_active?: boolean;
}

export const deleteAlertById = async (
  userId: string,
  alertId: string
): Promise<DeleteAlertResponse> => {
  console.log("🌐 API Service - Delete Alert called");
  console.log("🧑 User ID:", userId);
  console.log("🗑️ Alert ID:", alertId);

  try {
    const url = `${API_BASE_URL}/alerts/${userId}/${alertId}`;
    console.log("🔗 Full request URL:", url);

    const authToken = localStorage.getItem("authToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
      console.log("🔑 Adding auth token to headers");
    }

    const response = await fetch(url, { method: "DELETE", headers });

    console.log("📡 Response status:", response.status);
    const result = await response.json();
    console.log("📄 Response body:", result);

    if (!response.ok) {
      console.warn("⚠️ Response not OK");
      return {
        success: false,
        error: result.message || result.error || "Failed to delete alert",
      };
    }

    return {
      success: true,
      message: result.message || "Alert deleted successfully",
    };
  } catch (error) {
    console.error("❌ Error deleting alert:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export const toggleAlertById = async (
  userId: string,
  alertId: string,
  currentIsActive: boolean
): Promise<ToggleAlertResponse> => {
  console.log("🌐 API Service - Toggle Alert called");
  console.log("🧑 User ID:", userId);
  console.log("⏯️ Alert ID:", alertId);
  console.log("⏯️ Current state:", currentIsActive ? "active" : "paused");

  try {
    const url = `${API_BASE_URL}/alerts/${userId}/${alertId}`;
    console.log("🔗 Full request URL:", url);

    const authToken = localStorage.getItem("authToken");
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
      console.log("🔑 Adding auth token to headers");
    }

    const desiredState = !currentIsActive;
    const response = await fetch(url, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ is_active: desiredState }),
    });

    console.log("📡 Response status:", response.status);
    const result = await response.json();
    console.log("📄 Response body:", result);

    if (!response.ok) {
      console.warn("⚠️ Response not OK");
      return {
        success: false,
        error:
          result.message ||
          result.error ||
          `Failed to ${desiredState ? "activate" : "pause"} alert`,
      };
    }

    return {
      success: true,
      is_active: result.is_active ?? desiredState,
      message:
        result.message ||
        `Alert ${desiredState ? "activated" : "paused"} successfully`,
    };
  } catch (error) {
    console.error("❌ Error toggling alert:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

export default {
  login,
  createAlert,
  getAlertsByUserId,
  deleteAlertById,
  toggleAlertById,
};
