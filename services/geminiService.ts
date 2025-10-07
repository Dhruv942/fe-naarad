import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import {
  UserPreferences,
  SampleMessage,
  SelectableTagCategoryKey,
  CategorySpecificPreferences,
  AiFollowUpQuestion,
  FollowUpAnswer,
  Alert,
} from "../types";
import {
  INTEREST_TAG_HIERARCHY,
  FollowUpQuestion as FollowUpQuestionType,
} from "../constants";
import {
  fetchRSSFeedsByCategories,
  getRecentRSSItems,
  RSSFeedItem,
} from "./rssService";

const API_KEY = "AIzaSyBkOVmlsGIo74r3XG5YQzllNBm8Zlc1s-k"; // Gemini API Key

if (!API_KEY) {
  console.warn(
    "API_KEY for Gemini is not set. Sample message generation will not work."
  );
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "mock_api_key_placeholder" });

export const getTagLabel = (tagId: string): string => {
  for (const mainCatKey in INTEREST_TAG_HIERARCHY) {
    const mainCat = INTEREST_TAG_HIERARCHY[mainCatKey];
    if (mainCat.tags) {
      const foundTag = mainCat.tags.find((t) => t.id === tagId);
      if (foundTag) return foundTag.label;
    }
    if (mainCat.subCategories) {
      for (const subCat of mainCat.subCategories) {
        if (subCat.tags) {
          const foundTag = subCat.tags.find((t) => t.id === tagId);
          if (foundTag) return foundTag.label;
        }
      }
    }
  }
  return tagId;
};

const getFollowUpQuestionText = (
  categoryKey: SelectableTagCategoryKey,
  questionId: string
): string => {
  const mainCat =
    INTEREST_TAG_HIERARCHY[
      categoryKey.toUpperCase() as keyof typeof INTEREST_TAG_HIERARCHY
    ];
  const question = mainCat?.followUpQuestions?.find((q) => q.id === questionId);
  return question ? question.text : questionId;
};

/**
 * Extract categories from alert for RSS feed fetching
 */
const extractCategoriesFromAlert = (alert: Alert): string[] => {
  const categories: string[] = [];

  if (alert.sports?.selectedTags?.length > 0) categories.push("sports");
  if (alert.moviesTV?.selectedTags?.length > 0) categories.push("moviesTV");
  if (alert.news?.selectedTags?.length > 0) categories.push("news");
  if (alert.youtube?.selectedTags?.length > 0) categories.push("technology");

  return categories;
};

/**
 * Format RSS feed items for Gemini prompt
 */
const formatRSSFeedsForPrompt = (rssItems: RSSFeedItem[]): string => {
  if (rssItems.length === 0) {
    return "No recent news available.";
  }

  let prompt = "Recent News & Updates from RSS Feeds:\n\n";

  rssItems.forEach((item, index) => {
    prompt += `${index + 1}. ${item.title}\n`;
    prompt += `   ${item.description.substring(0, 200)}${item.description.length > 200 ? "..." : ""}\n`;
    prompt += `   Published: ${item.pubDate}\n`;
    if (item.imageUrl) {
      prompt += `   Image URL: ${item.imageUrl}\n`;
    }
    prompt += `\n`;
  });

  return prompt;
};

const formatAlertForPrompt = (alert: Alert, user: UserPreferences): string => {
  let prompt = "User's Alert Configuration:\n";
  prompt += `- Alert Name: ${alert.name}\n`;
  prompt += `- Frequency: ${alert.frequency}${alert.frequency === "Custom" && alert.customFrequencyTime ? ` at ${alert.customFrequencyTime}` : ""}\n`;

  const processCategory = (
    categoryKey: SelectableTagCategoryKey,
    categoryLabel: string
  ) => {
    const categoryData = alert[categoryKey] as CategorySpecificPreferences;
    let categoryHasContent = false;

    if (categoryData.selectedTags.length > 0) categoryHasContent = true;
    if (
      categoryKey === "sports" &&
      categoryData.otherSportName &&
      categoryData.otherSportName.trim() !== ""
    ) {
      categoryHasContent = true;
    }
    if (categoryData.followUpAnswers) {
      for (const qId in categoryData.followUpAnswers) {
        const answerObj = categoryData.followUpAnswers[qId];
        if (
          (answerObj.selectedPredefinedTags &&
            answerObj.selectedPredefinedTags.length > 0) ||
          (answerObj.customAnswerViaOther &&
            answerObj.customAnswerViaOther.trim() !== "")
        ) {
          categoryHasContent = true;
          break;
        }
      }
    }
    if (categoryData.instructionTags && categoryData.instructionTags.length > 0)
      categoryHasContent = true;

    if (categoryHasContent) {
      prompt += `- ${categoryLabel}:\n`;
      if (categoryData.selectedTags.length > 0) {
        prompt += `  - Interests/Topics: ${categoryData.selectedTags.map(getTagLabel).join(", ")}\n`;
      }
      if (
        categoryKey === "sports" &&
        categoryData.otherSportName &&
        categoryData.otherSportName.trim() !== ""
      ) {
        prompt += `  - Specified Other Sport: ${categoryData.otherSportName.trim()}\n`;
      }
      if (categoryData.followUpAnswers) {
        let hasFollowUpOutput = false;
        let followUpPromptPart = "  - Additional Details (Fixed Q&A):\n";
        for (const questionId in categoryData.followUpAnswers) {
          const answerObj = categoryData.followUpAnswers[questionId];
          let answerParts: string[] = [];
          if (
            answerObj.selectedPredefinedTags &&
            answerObj.selectedPredefinedTags.length > 0
          ) {
            answerParts.push(...answerObj.selectedPredefinedTags);
          }
          if (
            answerObj.customAnswerViaOther &&
            answerObj.customAnswerViaOther.trim() !== ""
          ) {
            answerParts.push(`Other: ${answerObj.customAnswerViaOther.trim()}`);
          }

          if (answerParts.length > 0) {
            hasFollowUpOutput = true;
            const questionText = getFollowUpQuestionText(
              categoryKey,
              questionId
            );
            followUpPromptPart += `    - Q: ${questionText}\n    - A: ${answerParts.join("; ")}\n`;
          }
        }
        if (hasFollowUpOutput) {
          prompt += followUpPromptPart;
        }
      }
      if (
        categoryData.instructionTags &&
        categoryData.instructionTags.length > 0
      ) {
        prompt += `  - Specific Instructions (Tags): ${categoryData.instructionTags.join(", ")}\n`;
      }
    }
  };

  processCategory("sports", "Sports");
  processCategory("moviesTV", "Movies & TV");
  processCategory("news", "News");
  processCategory("youtube", "YouTube");

  if (alert.customInterestTags.length > 0) {
    prompt += `- Custom Interests: ${alert.customInterestTags.join(", ")}\n`;
  }

  return prompt;
};

const generateSampleMessageFromText = async (
  promptText: string
): Promise<SampleMessage> => {
  const fallbackMessage: SampleMessage = {
    summaryText:
      "Sample message generation is disabled or encountered an error. This is a mock update!",
    imageUrl: "⚙️",
    actionText: "Try Again Later",
  };

  if (!API_KEY || API_KEY === "mock_api_key_placeholder") {
    return Promise.resolve(fallbackMessage);
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: promptText,
      config: { responseMimeType: "application/json" },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) jsonStr = match[2].trim();

    const parsedData = JSON.parse(jsonStr) as SampleMessage;
    if (parsedData.imageSuggestion && !parsedData.imageUrl) {
      parsedData.imageUrl = parsedData.imageSuggestion;
    }
    return parsedData;
  } catch (error) {
    console.error("Error generating single sample message from Gemini:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
      return {
        ...fallbackMessage,
        summaryText: "Could not generate sample: API key is not valid.",
      };
    }
    return {
      ...fallbackMessage,
      summaryText: "Sorry, we couldn't generate a sample message at this time.",
    };
  }
};

// FIX: Export a new function 'generateSampleMessage' for use in the ReviewConfirmPage.
export const generateSampleMessage = async (
  alert: Alert,
  user: UserPreferences
): Promise<SampleMessage> => {
  const userPreferencesPrompt = formatAlertForPrompt(alert, user);
  const fullPrompt = `Based on the user's alert configuration, generate a single, realistic, and compelling sample WhatsApp update. The response MUST be a valid JSON object.

User Config:
${userPreferencesPrompt}

The JSON object must have this structure:
{
  "summaryText": "string",
  "imageSuggestion": "string (a brief suggestion for a relevant emoji or a short image description)",
  "actionText": "string"
}

JSON Response:`;
  return generateSampleMessageFromText(fullPrompt);
};

export const generateTuningSamples = async (
  alert: Alert,
  user: UserPreferences
): Promise<SampleMessage[]> => {
  if (!API_KEY || API_KEY === "mock_api_key_placeholder") {
    console.error("❌ Gemini API key is missing!");
    return Promise.resolve([
      {
        summaryText: "API key missing. Please configure Gemini API.",
        imageUrl: "⚠️",
        actionText: "Configure",
      },
    ]);
  }

  try {
    // Start RSS feeds fetch in background (don't wait for it)
    const categories = extractCategoriesFromAlert(alert);
    console.log(
      "📡 Starting background RSS feed fetch for categories:",
      categories
    );

    // Fire and forget - this will populate cache for future use
    fetchRSSFeedsByCategories(categories)
      .then((items) =>
        console.log(
          `✅ Background fetch complete: ${items.length} RSS items cached`
        )
      )
      .catch((err) => console.warn("⚠️ Background RSS fetch failed:", err));

    // Generate samples immediately using Gemini with user preferences
    const userPreferencesPrompt = formatAlertForPrompt(alert, user);

    // Get current date for realistic news generation
    const today = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const fullPrompt = `Generate 6 realistic WhatsApp news updates as JSON array. Make them feel like REAL breaking news from today (${today}).

${userPreferencesPrompt}

Requirements:
- Create realistic news that feels current and authentic
- Include specific details, names, numbers, scores where relevant
- Vary formats: breaking news, match updates, announcements, analysis
- Match user's custom preferences/questions if provided
- Use relevant emojis for imageUrl

JSON format:
[{
  "summaryText": "realistic news update with specific details (max 150 words)",
  "imageUrl": "relevant emoji",
  "actionText": "action phrase"
}]

JSON Response:`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: fullPrompt,
      config: { responseMimeType: "application/json" },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) jsonStr = match[2].trim();

    const parsedArray = JSON.parse(jsonStr) as SampleMessage[];
    if (Array.isArray(parsedArray) && parsedArray.length > 0) {
      const samples = parsedArray.map((item) => ({
        ...item,
        imageUrl: item.imageSuggestion || item.imageUrl,
      }));

      console.log(`✅ Generated ${samples.length} tuning samples successfully`);
      return samples;
    }
    throw new Error("AI response was not a valid array.");
  } catch (error) {
    console.error("❌ Error generating tuning samples from Gemini:", error);

    // Return meaningful error-based samples
    return [
      {
        summaryText:
          "Failed to generate samples. Error: " +
          (error instanceof Error ? error.message : "Unknown error"),
        imageUrl: "❌",
        actionText: "Retry",
      },
      {
        summaryText: "Please check your internet connection and try again.",
        imageUrl: "🔄",
        actionText: "Retry",
      },
      {
        summaryText: "If issue persists, contact support.",
        imageUrl: "💬",
        actionText: "Contact",
      },
    ];
  }
};
