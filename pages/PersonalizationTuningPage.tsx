import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { usePreferences } from "../contexts/PreferencesContext";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import WhatsAppPreview from "../components/common/WhatsAppPreview";
import ProgressIndicator from "../components/common/ProgressIndicator";
import { ICONS, PagePath } from "../constants";
import { generateTuningSamples } from "../services/geminiService";
import { SampleMessage } from "../types";

const FALLBACK_TUNING_SAMPLES: SampleMessage[] = [
  {
    summaryText:
      "🎬 Weekend Binge Alert!\n\nA24 just dropped the teaser for 'Neon Harbour'—think 'Blade Runner' vibes with coastal noir twists. Plus, Kriti Sanon's sci-fi thriller hits Prime Video tomorrow.\n\nTap to line up your watchlist before everyone else.",
    imageUrl: "🍿",
    actionText: "See What's Streaming",
  },
  {
    summaryText:
      "⚽ Goal Rush: Sunday Special\n\nArsenal vs. Spurs kicks off at 9 PM IST with Havertz back in form. Meanwhile, Messi is rested and ready for Inter Miami's playoff push.\n\nSkip the noise; get the key highlights we’ll send post-match.",
    imageUrl: "⚽",
    actionText: "Track These Matches",
  },
  {
    summaryText:
      "📺 Creator Spotlight\n\nMKBHD just reviewed the Pixel Fold 3—bigger outer display, smarter AI summarizer. Also, Tanmay Bhat's new pod breaks down Indian startup failures with real numbers.\n\nTune in before Twitter does.",
    imageUrl: "🎧",
    actionText: "Open the Rundown",
  },
];

// A self-contained, animated card for providing feedback
const TuningCard: React.FC<{
  message: SampleMessage;
  onFeedback: (direction: "like" | "dislike") => void;
  isExiting: "like" | "dislike" | null;
  isInitial: boolean;
}> = ({ message, onFeedback, isExiting, isInitial }) => {
  const animationClass = isExiting
    ? isExiting === "like"
      ? "animate__animated animate__rotateOutUpRight"
      : "animate__animated animate__rotateOutUpLeft"
    : isInitial
      ? "animate__animated animate__fadeInUp"
      : "";

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center ${animationClass}`}
      style={{ animationDuration: "0.6s" }}
    >
      <div className="w-full flex flex-col gap-3 sm:gap-6">
        {/* Background box with preview only */}

        <WhatsAppPreview message={message} />

        {/* Like/Dislike Buttons - Outside the box, below preview */}
        <div className="flex justify-center items-center gap-3 sm:gap-6 -mt-2">
          <Button
            onClick={() => onFeedback("dislike")}
            className="bg-red-600/90 hover:bg-red-500 border-2 border-red-400/50 text-white w-16 h-16 sm:w-24 sm:h-24 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center flex-shrink-0"
            aria-label="Dislike"
          >
            <span
              className="text-3xl sm:text-5xl"
              role="img"
              aria-hidden="true"
            >
              👎
            </span>
          </Button>
          <Button
            onClick={() => onFeedback("like")}
            className="bg-green-600/90 hover:bg-green-500 border-2 border-green-400/50 text-white w-16 h-16 sm:w-24 sm:h-24 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center flex-shrink-0"
            aria-label="Like"
          >
            <span
              className="text-3xl sm:text-5xl"
              role="img"
              aria-hidden="true"
            >
              👍
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

const PersonalizationTuningPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeAlert, setActiveAlert, user } = usePreferences();
  const userRef = useRef(user);
  const [cards, setCards] = useState<SampleMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [exitDirection, setExitDirection] = useState<"like" | "dislike" | null>(
    null
  );
  const [isInitialCard, setIsInitialCard] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const MIN_FEEDBACK_COUNT = 3;

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    if (!activeAlert) {
      navigate(PagePath.DASHBOARD);
      return;
    }

    let cancelled = false;

    const ensureMinimumSamples = (samples: SampleMessage[]): SampleMessage[] => {
      const normalized = samples
        .filter(Boolean)
        .map((sample) => ({
          ...sample,
          imageUrl: sample.imageUrl || sample.imageSuggestion,
        }))
        .slice(0, MIN_FEEDBACK_COUNT);

      if (normalized.length >= MIN_FEEDBACK_COUNT) {
        return normalized;
      }

      const remaining = MIN_FEEDBACK_COUNT - normalized.length;
      const fallbackAdditions = FALLBACK_TUNING_SAMPLES.slice(0, remaining);
      return [...normalized, ...fallbackAdditions];
    };

    const loadSamples = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const generatedSamples = await generateTuningSamples(
          activeAlert,
          userRef.current
        );
        if (cancelled) return;

        const preparedSamples = ensureMinimumSamples(generatedSamples);

        setCards(preparedSamples);
        setCurrentIndex(0);
        setFeedbackCount(0);
        setExitDirection(null);
        setIsInitialCard(true);
      } catch (err) {
        console.error("Failed to generate tuning samples:", err);
        if (cancelled) return;
        setError(
          "We couldn't generate fresh samples right now. Showing fallback suggestions."
        );
        setCards(FALLBACK_TUNING_SAMPLES.slice(0, MIN_FEEDBACK_COUNT));
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadSamples();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAlert?.id, navigate]);

  const handleFeedback = (direction: "like" | "dislike") => {
    if (!activeAlert || currentIndex >= cards.length || exitDirection) return;

    setExitDirection(direction);
    const currentCard = cards[currentIndex];

    setActiveAlert((prev) => {
      if (!prev) return null;
      const updatedFeedback = {
        ...(prev.tuningFeedback || { liked: [], disliked: [] }),
      };
      if (direction === "like") {
        updatedFeedback.liked.push(currentCard.summaryText);
      } else {
        updatedFeedback.disliked.push(currentCard.summaryText);
      }
      return { ...prev, tuningFeedback: updatedFeedback };
    });

    setTimeout(() => {
      setFeedbackCount((prev) => prev + 1);
      setCurrentIndex((prev) => prev + 1);
      setExitDirection(null);
      if (isInitialCard) {
        setIsInitialCard(false);
      }
    }, 600); // Match animation duration
  };

  if (!activeAlert) {
    return <Navigate to={PagePath.DASHBOARD} replace />;
  }

  const isTuningComplete = feedbackCount >= MIN_FEEDBACK_COUNT;
  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-secondary-dark to-gray-900 text-white page-fade-enter flex flex-col">
      <div className="w-full max-w-xl mx-auto py-10 px-4 sm:px-6 lg:px-8 flex-grow flex flex-col">
        <ProgressIndicator
          currentStep={2}
          steps={["Select Interests", "Fine-Tune Feed", "Set Cadence"]}
        />

        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Fine-Tune Your Feed
          </h1>
          <p className="text-base sm:text-lg text-primary-lighter/80 mt-3">
            Help us learn your taste. Tell us what you think of these
            AI-generated samples.
          </p>
        </header>

        <div className="flex-grow w-full flex flex-col items-center justify-center py-4">
          <div
            className={`relative w-full max-w-sm transition-all duration-500 ease-in-out-sine ${isLoading ? "h-64" : "h-[600px]"}`}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner
                  text="Generating personalized samples..."
                  size="lg"
                />
              </div>
            )}
            {!isLoading && (
              <>
                {/* Card Deck visual effect */}
                {currentIndex + 2 < cards.length && !isTuningComplete && (
                  <div
                    className="absolute inset-0 bg-white/5 p-3 rounded-2xl shadow-xl transition-all duration-300"
                    style={{ transform: "scale(0.9)", top: "30px" }}
                  >
                    <div className="w-full h-full bg-gray-700/50 rounded-xl"></div>
                  </div>
                )}
                {currentIndex + 1 < cards.length && !isTuningComplete && (
                  <div
                    className="absolute inset-0 bg-white/10 p-3 rounded-2xl shadow-2xl transition-all duration-300"
                    style={{ transform: "scale(0.95)", top: "15px" }}
                  >
                    <div className="w-full h-full bg-gray-800/50 rounded-xl"></div>
                  </div>
                )}

                {/* Top card */}
                {currentCard && !isTuningComplete && (
                  <TuningCard
                    message={currentCard}
                    onFeedback={handleFeedback}
                    isExiting={exitDirection}
                    isInitial={isInitialCard}
                  />
                )}

                {/* Completion message */}
                {isTuningComplete && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center animate__animated animate__fadeIn p-8 bg-white/10 rounded-2xl shadow-2xl-dark border border-white/10 backdrop-blur-sm">
                      <span
                        className="text-6xl mb-4 block"
                        role="img"
                        aria-label="Checkmark"
                      >
                        ✅
                      </span>
                      <h2 className="text-2xl font-semibold text-primary">
                        Great! We've got it.
                      </h2>
                      <p className="text-primary-lighter/80 mt-2">
                        Your preferences are saved. Proceed to the final step to
                        set your update frequency.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {!isLoading && error && (
          <div className="mt-4 text-sm text-yellow-200 bg-yellow-900/30 border border-yellow-500/40 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}
      </div>

      <div className="sticky bottom-0 z-10 p-2 bg-gray-950/90 backdrop-blur-sm border-t border-primary-lighter/20">
        <div className="max-w-xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(PagePath.INTERESTS)}
            className="w-full sm:w-auto text-primary-lighter/80 hover:text-white"
            leftIcon={ICONS.ARROW_LEFT}
          >
            Back to Interests
          </Button>
          <div className="relative group w-full sm:w-auto">
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => navigate(PagePath.FREQUENCY)}
              disabled={!isTuningComplete}
              className="w-full disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              rightIcon={ICONS.ARROW_RIGHT}
            >
              Next: Set Cadence ({Math.min(feedbackCount, MIN_FEEDBACK_COUNT)}/
              {MIN_FEEDBACK_COUNT})
            </Button>
            {!isTuningComplete && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                Please rate {MIN_FEEDBACK_COUNT} samples to continue.
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationTuningPage;
