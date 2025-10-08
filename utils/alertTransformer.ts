import { Alert, CategorySpecificPreferences } from "../types";
import { CreateAlertRequest } from "../services/api";

/**
 * Transform frontend Alert data to backend API format
 */
export const transformAlertToApiFormat = (
  alert: Alert
): Omit<CreateAlertRequest, "user_id"> => {
  console.log("🔄 Transforming alert to API format:", alert);

  // Determine main category
  let main_category: "Sports" | "News" | "Movies" | "YouTube" | "Custom_Input" =
    "Custom_Input";
  let activeCategoryData: CategorySpecificPreferences | null = null;

  if (
    alert.sports.selectedTags.length > 0 ||
    (alert.sports.instructionTags && alert.sports.instructionTags.length > 0) ||
    alert.sports.otherSportName
  ) {
    main_category = "Sports";
    activeCategoryData = alert.sports;
  } else if (
    alert.news.selectedTags.length > 0 ||
    (alert.news.instructionTags && alert.news.instructionTags.length > 0)
  ) {
    main_category = "News";
    activeCategoryData = alert.news;
  } else if (
    alert.moviesTV.selectedTags.length > 0 ||
    (alert.moviesTV.instructionTags &&
      alert.moviesTV.instructionTags.length > 0)
  ) {
    main_category = "Movies";
    activeCategoryData = alert.moviesTV;
  } else if (
    alert.youtube.selectedTags.length > 0 ||
    (alert.youtube.instructionTags && alert.youtube.instructionTags.length > 0)
  ) {
    main_category = "YouTube";
    activeCategoryData = alert.youtube;
  } else if (alert.customInterestTags.length > 0) {
    main_category = "Custom_Input";
  }

  console.log("📋 Detected main_category:", main_category);

  // Collect sub_categories (selected tags from the active category)
  const sub_categories: string[] = activeCategoryData?.selectedTags || [];

  // Add other sport name if applicable
  if (main_category === "Sports" && alert.sports.otherSportName) {
    sub_categories.push(alert.sports.otherSportName);
  }

  console.log("🏷️ Sub categories:", sub_categories);

  // Collect followup_questions (answers from predefined follow-up questions + custom answers)
  const followup_questions: string[] = [];

  if (activeCategoryData?.followUpAnswers) {
    for (const questionId in activeCategoryData.followUpAnswers) {
      const answer = activeCategoryData.followUpAnswers[questionId];

      // Add selected predefined tags
      if (
        answer.selectedPredefinedTags &&
        answer.selectedPredefinedTags.length > 0
      ) {
        followup_questions.push(...answer.selectedPredefinedTags);
      }

      // Add custom answer if provided
      if (answer.customAnswerViaOther && answer.customAnswerViaOther.trim()) {
        followup_questions.push(answer.customAnswerViaOther.trim());
      }
    }
  }

  console.log("❓ Follow-up questions:", followup_questions);

  // Collect custom_question (instruction tags + AI follow-up questions)
  const custom_question_parts: string[] = [];

  console.log(
    "🔍 Processing custom_question from activeCategoryData:",
    activeCategoryData
  );
  console.log(
    "🔍 Full alert object for debugging:",
    JSON.stringify(alert, null, 2)
  );

  // Add instruction tags (tags jo user ne select kiye ya type kiye)
  if (
    activeCategoryData?.instructionTags &&
    activeCategoryData.instructionTags.length > 0
  ) {
    console.log(
      "📌 Adding instruction tags:",
      activeCategoryData.instructionTags
    );
    console.log(
      "📌 Instruction tags count:",
      activeCategoryData.instructionTags.length
    );
    custom_question_parts.push(...activeCategoryData.instructionTags);
  } else {
    console.log("⚠️ No instruction tags found in activeCategoryData");
    console.log(
      "⚠️ activeCategoryData keys:",
      activeCategoryData ? Object.keys(activeCategoryData) : "null"
    );
  }

  // Do NOT include selected interest tags here; they already go to sub_categories.
  // custom_question should only carry specific instructions (tags + typed input) and AI Q&A.

  // Add AI follow-up questions and answers
  if (
    activeCategoryData?.aiFollowUpQuestions &&
    activeCategoryData.aiFollowUpQuestions.length > 0
  ) {
    console.log(
      "🤖 Adding AI follow-up questions:",
      activeCategoryData.aiFollowUpQuestions
    );
    console.log(
      "🤖 AI questions count:",
      activeCategoryData.aiFollowUpQuestions.length
    );
    activeCategoryData.aiFollowUpQuestions.forEach((q) => {
      console.log("🤖 Processing question:", q);
      if (q.answer && q.answer.trim()) {
        const formatted = `${q.question}: ${q.answer}`;
        console.log("🤖 Adding formatted Q&A:", formatted);
        custom_question_parts.push(formatted);
      } else {
        console.log("⚠️ Skipping question (empty answer):", q);
      }
    });
  } else {
    console.log("⚠️ No AI follow-up questions found");
  }

  // For Custom_Input category, add custom interest tags
  if (main_category === "Custom_Input" && alert.customInterestTags.length > 0) {
    console.log(
      "✨ Adding custom interest tags for Custom_Input:",
      alert.customInterestTags
    );
    custom_question_parts.push(...alert.customInterestTags);
  }

  const custom_question = custom_question_parts.join(" | ");

  console.log("💬 Final custom_question parts:", custom_question_parts);
  console.log("💬 Final custom_question string:", custom_question);

  const transformed = {
    main_category,
    sub_categories,
    followup_questions,
    custom_question,
  };

  console.log("✅ Transformation complete:", transformed);

  return transformed;
};
