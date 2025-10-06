import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserPreferences, SampleMessage, SelectableTagCategoryKey, CategorySpecificPreferences, AiFollowUpQuestion, FollowUpAnswer, Alert } from '../types';
import { INTEREST_TAG_HIERARCHY, FollowUpQuestion as FollowUpQuestionType } from '../constants';
import { fetchRSSFeedsByCategories, getRecentRSSItems, RSSFeedItem } from './rssService';

const API_KEY = "AIzaSyB4vE8BAkg0J0XZ2bvMR9U4iNs3DfeONS0"; // Gemini API Key

if (!API_KEY) {
  console.warn("API_KEY for Gemini is not set. Sample message generation will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "mock_api_key_placeholder" });

export const getTagLabel = (tagId: string): string => {
  for (const mainCatKey in INTEREST_TAG_HIERARCHY) {
    const mainCat = INTEREST_TAG_HIERARCHY[mainCatKey];
    if (mainCat.tags) {
      const foundTag = mainCat.tags.find(t => t.id === tagId);
      if (foundTag) return foundTag.label;
    }
    if (mainCat.subCategories) {
      for (const subCat of mainCat.subCategories) {
        if (subCat.tags) {
          const foundTag = subCat.tags.find(t => t.id === tagId);
          if (foundTag) return foundTag.label;
        }
      }
    }
  }
  return tagId; 
};

const getFollowUpQuestionText = (categoryKey: SelectableTagCategoryKey, questionId: string): string => {
  const mainCat = INTEREST_TAG_HIERARCHY[categoryKey.toUpperCase() as keyof typeof INTEREST_TAG_HIERARCHY];
  const question = mainCat?.followUpQuestions?.find(q => q.id === questionId);
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
    prompt += `   ${item.description.substring(0, 200)}${item.description.length > 200 ? '...' : ''}\n`;
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
  prompt += `- Frequency: ${alert.frequency}${alert.frequency === "Custom" && alert.customFrequencyTime ? ` at ${alert.customFrequencyTime}` : ''}\n`;

  const processCategory = (categoryKey: SelectableTagCategoryKey, categoryLabel: string) => {
    const categoryData = alert[categoryKey] as CategorySpecificPreferences;
    let categoryHasContent = false;

    if (categoryData.selectedTags.length > 0) categoryHasContent = true;
    if (categoryKey === 'sports' && categoryData.otherSportName && categoryData.otherSportName.trim() !== '') {
        categoryHasContent = true;
    }
    if (categoryData.followUpAnswers) {
        for (const qId in categoryData.followUpAnswers) {
            const answerObj = categoryData.followUpAnswers[qId];
            if ((answerObj.selectedPredefinedTags && answerObj.selectedPredefinedTags.length > 0) || (answerObj.customAnswerViaOther && answerObj.customAnswerViaOther.trim() !== '')) {
                categoryHasContent = true;
                break;
            }
        }
    }
    if (categoryData.instructionTags && categoryData.instructionTags.length > 0) categoryHasContent = true;
    
    if (categoryHasContent) {
        prompt += `- ${categoryLabel}:\n`;
        if (categoryData.selectedTags.length > 0) {
            prompt += `  - Interests/Topics: ${categoryData.selectedTags.map(getTagLabel).join(', ')}\n`;
        }
        if (categoryKey === 'sports' && categoryData.otherSportName && categoryData.otherSportName.trim() !== '') {
            prompt += `  - Specified Other Sport: ${categoryData.otherSportName.trim()}\n`;
        }
        if (categoryData.followUpAnswers) {
            let hasFollowUpOutput = false;
            let followUpPromptPart = "  - Additional Details (Fixed Q&A):\n";
            for (const questionId in categoryData.followUpAnswers) {
                const answerObj = categoryData.followUpAnswers[questionId];
                let answerParts: string[] = [];
                if (answerObj.selectedPredefinedTags && answerObj.selectedPredefinedTags.length > 0) {
                    answerParts.push(...answerObj.selectedPredefinedTags);
                }
                if (answerObj.customAnswerViaOther && answerObj.customAnswerViaOther.trim() !== '') {
                    answerParts.push(`Other: ${answerObj.customAnswerViaOther.trim()}`);
                }

                if (answerParts.length > 0) {
                    hasFollowUpOutput = true;
                    const questionText = getFollowUpQuestionText(categoryKey, questionId);
                    followUpPromptPart += `    - Q: ${questionText}\n    - A: ${answerParts.join('; ')}\n`;
                }
            }
            if (hasFollowUpOutput) {
                prompt += followUpPromptPart;
            }
        }
        if (categoryData.instructionTags && categoryData.instructionTags.length > 0) {
            prompt += `  - Specific Instructions (Tags): ${categoryData.instructionTags.join(', ')}\n`;
        }
    }
  };
  
  processCategory('sports', 'Sports');
  processCategory('moviesTV', 'Movies & TV');
  processCategory('news', 'News');
  processCategory('youtube', 'YouTube');
  
  if (alert.customInterestTags.length > 0) {
    prompt += `- Custom Interests: ${alert.customInterestTags.join(', ')}\n`;
  }
  
  return prompt;
};

const generateSampleMessageFromText = async (promptText: string): Promise<SampleMessage> => {
    const fallbackMessage: SampleMessage = {
        summaryText: "Sample message generation is disabled or encountered an error. This is a mock update!",
        imageUrl: "⚙️",
        actionText: "Try Again Later"
    };

    if (!API_KEY || API_KEY === "mock_api_key_placeholder") {
        return Promise.resolve(fallbackMessage);
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: promptText,
            config: { responseMimeType: "application/json" }
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
        if (error instanceof Error && error.message.includes('API key not valid')) {
            return { ...fallbackMessage, summaryText: "Could not generate sample: API key is not valid." };
        }
        return { ...fallbackMessage, summaryText: "Sorry, we couldn't generate a sample message at this time." };
    }
};

// FIX: Export a new function 'generateSampleMessage' for use in the ReviewConfirmPage.
export const generateSampleMessage = async (alert: Alert, user: UserPreferences): Promise<SampleMessage> => {
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

export const generateTuningSamples = async (alert: Alert, user: UserPreferences): Promise<SampleMessage[]> => {
    const fallbackMessages: SampleMessage[] = [
        { summaryText: "This is a mock 'Direct Hit' update based on your tags!", imageUrl: "🎯", actionText: "See More" },
        { summaryText: "This is a mock 'Depth Test' update, perhaps more analytical.", imageUrl: "🤔", actionText: "Read Analysis" },
        { summaryText: "This is a mock 'Boundary Test' on a related topic.", imageUrl: "🗺️", actionText: "Explore Topic" },
        { summaryText: "Sample 4: A different angle on your interests.", imageUrl: "✨", actionText: "Learn more"},
        { summaryText: "Sample 5: Testing another format for you.", imageUrl: "📰", actionText: "Read article"},
        { summaryText: "Sample 6: How about this related idea?", imageUrl: "💡", actionText: "Discover"},
    ];

    if (!API_KEY || API_KEY === "mock_api_key_placeholder") {
        return Promise.resolve(fallbackMessages);
    }

    try {
        // Fetch RSS feeds based on alert categories
        const categories = extractCategoriesFromAlert(alert);
        console.log("📡 Fetching RSS feeds for categories:", categories);

        const rssItems = await fetchRSSFeedsByCategories(categories);
        const recentItems = getRecentRSSItems(rssItems, 15); // Get latest 15 items

        console.log(`✅ Fetched ${recentItems.length} RSS items for personalization`);

        const userPreferencesPrompt = formatAlertForPrompt(alert, user);
        const rssFeedsPrompt = formatRSSFeedsForPrompt(recentItems);

        const fullPrompt = `Based on the user's alert configuration and recent real news from RSS feeds, generate an array of exactly 6 highly personalized WhatsApp updates. Use the REAL news items provided to create relevant messages. The response MUST be a valid JSON array of objects.

User Config:
${userPreferencesPrompt}

${rssFeedsPrompt}

CRITICAL PERSONALIZATION REQUIREMENTS:
1. **PRIORITIZE Custom Question/Instructions:** If the user has provided custom questions or specific instructions, EVERY message MUST satisfy those requirements first and foremost.
2. **User Satisfaction:** Each message should be crafted to PERFECTLY match what the user wants based on their custom preferences.
3. **Same News, Different Formats:** You can use the SAME highly relevant news item multiple times but present it in DIFFERENT ways (formats, tones, depths) if it strongly matches user preferences. This ensures deep personalization.

Instructions for the 6 samples:
1. **Perfect Match:** Find the news that BEST matches user's custom question/preferences and present it clearly.
2. **Same News, Different Angle:** Take the same (or another highly relevant) news and present it with a different angle/depth.
3. **Same News, Different Format:** Present highly relevant news in a different format (bullets, question, casual tone).
4. **Best Match #2:** Find another news item that perfectly satisfies custom preferences.
5. **Actionable Format:** Present top relevant news with strong call-to-action.
6. **Variety Test:** A related but slightly different take while still respecting custom preferences.

IMPORTANT RULES:
- Use REAL news items from RSS feeds only (DO NOT make up fake news)
- EVERY message must satisfy the user's custom question/instructions if provided
- You CAN reuse the same news item 2-3 times if it's the best match for user preferences, just present it differently
- Use the Image URL from RSS feeds when available
- If no image URL in RSS, use relevant emoji (🏏, ⚽, 🎬, 📰, 🏆, 🎯, etc.)

Each object in the array must have this structure:
{
  "summaryText": "string (the personalized news update - max 200 words)",
  "imageUrl": "string (use RSS feed imageUrl if available, otherwise use emoji)",
  "actionText": "string (Read More, Watch Video, See Stats, etc.)"
}

JSON Response:`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: fullPrompt,
            config: { responseMimeType: "application/json" }
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) jsonStr = match[2].trim();

        const parsedArray = JSON.parse(jsonStr) as SampleMessage[];
        if (Array.isArray(parsedArray) && parsedArray.length > 0) {
            return parsedArray.map(item => ({
                ...item,
                imageUrl: item.imageSuggestion || item.imageUrl,
            }));
        }
        throw new Error("AI response was not a valid array.");

    } catch (error) {
        console.error("Error generating tuning samples from Gemini:", error);
        return fallbackMessages;
    }
};