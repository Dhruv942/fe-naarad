import React from "react";
import {
  ICONS,
  WHATSAPP_PREVIEW_SENDER,
  WHATSAPP_PREVIEW_TIME,
} from "../../constants";
import { SampleMessage } from "../../types";

interface WhatsAppPreviewProps {
  message: SampleMessage | string;
  senderName?: string;
  timestamp?: string;
  isUserMessage?: boolean;
}

const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({
  message,
  senderName = WHATSAPP_PREVIEW_SENDER,
  timestamp,
  isUserMessage = false,
}) => {
  const time = timestamp || WHATSAPP_PREVIEW_TIME();

  const { summaryText, whyShowing, imageUrl, imageSuggestion, actionText } =
    typeof message === "string"
      ? {
          summaryText: message,
          whyShowing: undefined,
          imageUrl: undefined,
          imageSuggestion: undefined,
          actionText: undefined,
        }
      : message;

  const isPurelyEmoji = (str?: string): boolean => {
    if (!str) return false;
    const trimmedStr = str.trim();
    const emojiPattern = /^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u;
    return emojiPattern.test(trimmedStr);
  };

  let imageElement: React.ReactNode = null;
  const commonImageContainerClass =
    "my-1 mx-auto max-h-28 flex items-center justify-center";

  if (imageUrl) {
    if (imageUrl.startsWith("http") || imageUrl.startsWith("data:")) {
      imageElement = (
        <img
          src={imageUrl}
          alt="Preview"
          className={`${commonImageContainerClass} rounded-md object-contain`}
        />
      );
    } else if (isPurelyEmoji(imageUrl)) {
      imageElement = (
        <div
          className={`${commonImageContainerClass} py-1 text-3xl`}
          role="img"
          aria-label="icon"
        >
          {imageUrl}
        </div>
      );
    } else {
      imageElement = (
        <div
          className={`${commonImageContainerClass} py-1 text-gray-500 text-[10px] italic flex-col`}
        >
          <span className="opacity-70 text-2xl mb-1">
            {ICONS.IMAGE_PLACEHOLDER}
          </span>
          <span>(Image idea: {imageUrl})</span>
        </div>
      );
    }
  } else if (imageSuggestion) {
    if (isPurelyEmoji(imageSuggestion)) {
      imageElement = (
        <div
          className={`${commonImageContainerClass} py-1 text-3xl`}
          role="img"
          aria-label="icon"
        >
          {imageSuggestion}
        </div>
      );
    } else {
      imageElement = (
        <div
          className={`${commonImageContainerClass} py-1 text-gray-500 text-[10px] italic flex-col`}
        >
          <span className="opacity-70 text-2xl mb-1">
            {ICONS.IMAGE_PLACEHOLDER}
          </span>
          <span>(Suggested image: {imageSuggestion})</span>
        </div>
      );
    }
  }

  return (
    <div className="w-full max-w-[270px] mx-auto bg-white rounded-lg shadow-md overflow-hidden my-2 border border-gray-200 text-xs">
      {/* Header */}
      <div className="bg-gray-100 px-2 py-1.5 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center">
          <span
            className="text-gray-600 hover:text-gray-800 cursor-pointer text-base mr-1"
            role="img"
            aria-label="Back"
          >
            ‹
          </span>
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm">
            {senderName.charAt(0).toUpperCase()}
          </div>
          <div className="ml-2">
            <p className="text-[11px] font-semibold text-gray-800 leading-tight">
              {senderName}
            </p>
            <p className="text-[10px] text-gray-500 leading-tight">online</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-gray-500 text-base">
          <span role="img" aria-label="Video call">
            📹
          </span>
          <span role="img" aria-label="Call">
            📞
          </span>
          <span role="img" aria-label="More options">
            ⋮
          </span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-accent px-2 py-2 min-h-[12rem] overflow-y-auto flex flex-col space-y-2">
        <div className="text-center">
          <span className="bg-gray-200/90 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-md shadow-sm">
            TODAY
          </span>
        </div>

        <div
          className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`
              max-w-[80%] py-1.5 px-2 rounded-md shadow-sm relative
              ${
                isUserMessage
                  ? "bg-primary-light text-gray-800 rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }
            `}
          >
            {/* Tail */}
            <div
              className={`absolute bottom-0 w-2 h-2 ${isUserMessage ? "right-[-6px] bg-primary-light transform skew-y-[-20deg]" : "left-[-6px] bg-white transform skew-y-[20deg]"}`}
              style={
                isUserMessage
                  ? { clipPath: "polygon(0 0, 100% 100%, 100% 0)" }
                  : { clipPath: "polygon(0 0, 0 100%, 100% 0)" }
              }
            ></div>

            {imageElement}
            <p className="text-[11px] whitespace-pre-wrap leading-snug">
              {summaryText || "Your personalized update will appear here!"}
            </p>

            {actionText && (
              <button
                className="mt-1 w-full text-[11px] font-medium text-secondary-light hover:underline py-1 px-1 bg-transparent rounded-md focus:outline-none focus:ring-1 focus:ring-secondary-light/50"
                onClick={(e) => {
                  e.preventDefault();
                  alert(`Action: ${actionText}`);
                }}
                aria-label={`Action: ${actionText}`}
              >
                {actionText}
              </button>
            )}
            <div
              className={`text-[10px] mt-0.5 ${isUserMessage ? "text-right text-green-700/80" : "text-right text-gray-500/80"}`}
            >
              {time}
              {isUserMessage && <span className="ml-1 opacity-70">✓✓</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Input Bar */}
      <div className="bg-gray-100 px-2 py-1.5 flex items-center border-t border-gray-200 space-x-1">
        <span
          className="text-gray-500 text-lg p-1 hover:bg-gray-200 rounded-full cursor-pointer"
          role="img"
          aria-label="Emoji"
        >
          😀
        </span>
        <input
          type="text"
          placeholder="Message"
          className="flex-grow px-2 py-1 text-[11px] bg-white rounded-full focus:outline-none focus:ring-1 focus:ring-primary"
          disabled
        />
        <span
          className="text-gray-500 text-lg p-1 hover:bg-gray-200 rounded-full cursor-pointer"
          role="img"
          aria-label="Attach"
        >
          📎
        </span>
        {!isUserMessage && (
          <span
            className="text-gray-500 text-lg p-1 hover:bg-gray-200 rounded-full cursor-pointer"
            role="img"
            aria-label="Camera"
          >
            📸
          </span>
        )}
        <button
          className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md hover:bg-primary-dark transition-colors"
          aria-label="Send/Microphone"
        >
          <span className="text-base" role="img">
            🎤
          </span>
        </button>
      </div>
    </div>
  );
};

export default WhatsAppPreview;
