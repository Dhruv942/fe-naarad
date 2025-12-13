import { Alert, CategorySpecificPreferences } from "../types";
import { CreateAlertRequest, FollowUpQuestion } from "../services/api";
import { INTEREST_TAG_HIERARCHY } from "../constants";

/**
 * Transform frontend Alert data to backend API format
 */
export const transformAlertToApiFormat = (
  alert: Alert
): Omit<CreateAlertRequest, "user_id"> => {
  console.log("🔄 Transforming alert to API format:", alert);
  console.log("🔍 Debug - Sports selectedTags:", alert.sports.selectedTags);
  console.log("🔍 Debug - News selectedTags:", alert.news.selectedTags);
  console.log("🔍 Debug - Movies selectedTags:", alert.moviesTV.selectedTags);
  console.log("🔍 Debug - YouTube selectedTags:", alert.youtube.selectedTags);
  console.log("🔍 Debug - Custom Interest Tags:", alert.customInterestTags);

  // Determine main category - default to Custom_Input if nothing selected
  let main_category: "Sports" | "News" | "Movies" | "YouTube" | "Custom_Input" =
    "Custom_Input";
  let activeCategoryData: CategorySpecificPreferences | null = null;

  // Check Sports
  const hasSportsFollowUp =
    alert.sports.followUpAnswers &&
    Object.keys(alert.sports.followUpAnswers).length > 0;
  const hasSports =
    alert.sports.selectedTags.length > 0 ||
    (alert.sports.instructionTags && alert.sports.instructionTags.length > 0) ||
    alert.sports.otherSportName ||
    hasSportsFollowUp;
  console.log("🔍 Sports check:", {
    selectedTags: alert.sports.selectedTags.length,
    instructionTags: alert.sports.instructionTags?.length || 0,
    otherSportName: alert.sports.otherSportName,
    followUpAnswers: hasSportsFollowUp,
    result: hasSports,
  });

  // Check News
  const hasNewsFollowUp =
    alert.news.followUpAnswers &&
    Object.keys(alert.news.followUpAnswers).length > 0;
  const hasNews =
    alert.news.selectedTags.length > 0 ||
    (alert.news.instructionTags && alert.news.instructionTags.length > 0) ||
    hasNewsFollowUp;
  console.log("🔍 News check:", {
    selectedTags: alert.news.selectedTags.length,
    instructionTags: alert.news.instructionTags?.length || 0,
    followUpAnswers: hasNewsFollowUp,
    result: hasNews,
  });

  // Check Movies
  const hasMoviesFollowUp =
    alert.moviesTV.followUpAnswers &&
    Object.keys(alert.moviesTV.followUpAnswers).length > 0;
  const hasMovies =
    alert.moviesTV.selectedTags.length > 0 ||
    (alert.moviesTV.instructionTags &&
      alert.moviesTV.instructionTags.length > 0) ||
    hasMoviesFollowUp;
  console.log("🔍 Movies check:", {
    selectedTags: alert.moviesTV.selectedTags.length,
    instructionTags: alert.moviesTV.instructionTags?.length || 0,
    followUpAnswers: hasMoviesFollowUp,
    result: hasMovies,
  });

  // Check YouTube
  const hasYouTubeFollowUp =
    alert.youtube.followUpAnswers &&
    Object.keys(alert.youtube.followUpAnswers).length > 0;
  const hasYouTube =
    alert.youtube.selectedTags.length > 0 ||
    (alert.youtube.instructionTags &&
      alert.youtube.instructionTags.length > 0) ||
    hasYouTubeFollowUp;
  console.log("🔍 YouTube check:", {
    selectedTags: alert.youtube.selectedTags.length,
    instructionTags: alert.youtube.instructionTags?.length || 0,
    followUpAnswers: hasYouTubeFollowUp,
    result: hasYouTube,
  });

  // Check Custom Input
  const hasCustomInput = alert.customInterestTags.length > 0;
  console.log("🔍 Custom Input check:", {
    customInterestTags: alert.customInterestTags.length,
    result: hasCustomInput,
  });

  if (hasSports) {
    main_category = "Sports";
    activeCategoryData = alert.sports;
    console.log("✅ Selected: Sports");
  } else if (hasNews) {
    main_category = "News";
    activeCategoryData = alert.news;
    console.log("✅ Selected: News");
  } else if (hasMovies) {
    main_category = "Movies";
    activeCategoryData = alert.moviesTV;
    console.log("✅ Selected: Movies");
  } else if (hasYouTube) {
    main_category = "YouTube";
    activeCategoryData = alert.youtube;
    console.log("✅ Selected: YouTube");
  } else if (hasCustomInput) {
    main_category = "Custom_Input";
    console.log("✅ Selected: Custom_Input");
  } else {
    console.log("⚠️ No category selected, defaulting to Custom_Input");
  }

  const finalMainCategory = main_category;

  console.log("📋 Detected main_category:", finalMainCategory);

  // Collect sub_categories (selected tags from the active category)
  let sub_categories: string[] = [];

  if (finalMainCategory === "Custom_Input") {
    // For Custom_Input, use customInterestTags as sub_categories
    sub_categories = alert.customInterestTags || [];
    console.log(
      "✨ Custom_Input: Using customInterestTags as sub_categories:",
      sub_categories
    );
  } else {
    // For other categories, use selectedTags from active category
    sub_categories = activeCategoryData?.selectedTags || [];

    // Add other sport name if applicable
    if (finalMainCategory === "Sports" && alert.sports.otherSportName) {
      sub_categories.push(alert.sports.otherSportName);
    }
  }

  console.log(
    "🏷️ Sub categories (before followup processing):",
    sub_categories
  );

  // Collect followup_questions with full schema (question, selected_answer, answers)
  const followup_questions: FollowUpQuestion[] = [];
  const detectedSubCategories = new Set<string>(sub_categories); // Track subcategories

  if (activeCategoryData?.followUpAnswers) {
    // Get the category constants to find question definitions
    const categoryKey =
      finalMainCategory === "Movies"
        ? "MOVIES_TV"
        : finalMainCategory.toUpperCase();
    const categoryData = INTEREST_TAG_HIERARCHY[categoryKey];

    for (const questionId in activeCategoryData.followUpAnswers) {
      const answer = activeCategoryData.followUpAnswers[questionId];

      // Find the question definition in constants
      let questionDef: any = null;
      let allAvailableAnswers: string[] = [];
      let subCategoryLabel: string | null = null;

      // Search in main category follow-up questions
      if (categoryData?.followUpQuestions) {
        questionDef = categoryData.followUpQuestions.find(
          (q: any) => q.id === questionId
        );
      }

      // If not found in main category, search in subcategories
      if (!questionDef && categoryData?.subCategories) {
        for (const subCat of categoryData.subCategories) {
          if (subCat.followUpQuestions) {
            questionDef = subCat.followUpQuestions.find(
              (q: any) => q.id === questionId
            );
            if (questionDef) {
              // Track the subcategory this question belongs to
              subCategoryLabel = subCat.label;

              // Also get dynamic options if available (teams, players, etc.)
              if (questionId === "favTeam" && subCat.popularTeams) {
                allAvailableAnswers = subCat.popularTeams.map(
                  (t: any) => t.label
                );
              } else if (questionId === "favPlayer" && subCat.popularPlayers) {
                allAvailableAnswers = subCat.popularPlayers.map(
                  (p: any) => p.label
                );
              }
              break;
            }
          }
        }
      }

      // Build the selected answer string
      let selectedAnswer = "";
      if (
        answer.selectedPredefinedTags &&
        answer.selectedPredefinedTags.length > 0
      ) {
        selectedAnswer = answer.selectedPredefinedTags.join(", ");
      }
      if (answer.customAnswerViaOther && answer.customAnswerViaOther.trim()) {
        selectedAnswer = selectedAnswer
          ? `${selectedAnswer}, ${answer.customAnswerViaOther.trim()}`
          : answer.customAnswerViaOther.trim();
      }

      // Get all available answers from predefinedAnswerTags if they exist
      if (
        questionDef?.predefinedAnswerTags &&
        allAvailableAnswers.length === 0
      ) {
        allAvailableAnswers = questionDef.predefinedAnswerTags.map(
          (tag: any) => tag.label
        );
      }

      // Only add if we have both question and selected answer
      if (questionDef && selectedAnswer) {
        followup_questions.push({
          question: questionDef.text,
          selected_answer: selectedAnswer,
          answers: allAvailableAnswers,
        });

        // Add subcategory to the set if detected from follow-up questions
        if (subCategoryLabel) {
          detectedSubCategories.add(subCategoryLabel);
          console.log(
            `🔍 Detected subcategory from follow-up: ${subCategoryLabel}`
          );
        }
      }
    }
  }

  // Update sub_categories with detected subcategories from follow-up questions
  sub_categories = Array.from(detectedSubCategories);
  console.log("🏷️ Sub categories (after followup processing):", sub_categories);
  console.log("❓ Follow-up questions (structured):", followup_questions);

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

  // For Custom_Input category, custom interest tags are already in sub_categories
  // Only add instruction tags or AI questions to custom_question if they exist
  // (Note: Custom_Input typically doesn't have instructionTags or aiFollowUpQuestions,
  // but we check just in case)

  const custom_question = custom_question_parts.join(" | ");

  console.log("💬 Final custom_question parts:", custom_question_parts);
  console.log("💬 Final custom_question string:", custom_question);

  // Build transformed object
  const transformed: Omit<CreateAlertRequest, "user_id"> = {
    main_category: finalMainCategory,
  };

  // Always include sub_categories (even if empty) for non-Custom_Input categories
  if (finalMainCategory !== "Custom_Input") {
    transformed.sub_categories = sub_categories;
  } else if (sub_categories.length > 0) {
    // For Custom_Input, only include if there are values
    transformed.sub_categories = sub_categories;
  }

  // Always include followup_questions if they exist
  if (followup_questions.length > 0) {
    transformed.followup_questions = followup_questions;
  }

  // Always include custom_question as empty string (not null) if user didn't provide anything
  transformed.custom_question = custom_question.trim() || "";

  console.log("✅ Transformation complete:", transformed);

  return transformed;
};
