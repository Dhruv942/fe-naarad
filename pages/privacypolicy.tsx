import React from "react";
import { useNavigate } from "react-router-dom";
import { PagePath, ICONS } from "../constants";
import Button from "../components/common/Button";

const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300 font-sans">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(PagePath.LANDING)}
          className="mb-8 text-primary-lighter/70 hover:text-white pl-0"
          leftIcon={ICONS.ARROW_LEFT}
        >
          Back to Home
        </Button>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 border-b border-white/10 pb-6">
            Privacy Policy
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                1. Introduction
              </h2>
              <p>
                Welcome to Naarad AI ("we," "our," or "us"). We are committed to
                protecting your personal information and your right to privacy.
                This Privacy Policy explains how we collect, use, and share your
                information when you use our WhatsApp-based news and update
                service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                2. Information We Collect
              </h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li>
                  <strong>Contact Information:</strong> We collect your WhatsApp
                  phone number and email address to deliver the service.
                </li>
                <li>
                  <strong>Preferences:</strong> We store the interests,
                  categories, and specific topics you select to personalize your
                  feed.
                </li>
                <li>
                  <strong>Usage Data:</strong> We may collect anonymous data on
                  how you interact with our website to improve the user
                  experience.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                3. How We Use Your Information
              </h2>
              <p>We use your information strictly to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-2 text-gray-400">
                <li>
                  Curate and generate personalized summaries based on your
                  interests.
                </li>
                <li>
                  Send these updates to your provided WhatsApp number at your
                  chosen frequency.
                </li>
                <li>Manage your account and settings.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                4. AI Processing
              </h2>
              <p>
                Our service uses Artificial Intelligence (AI) to process news
                and information. Your preferences are used as prompts for the AI
                to generate relevant summaries. We do not use your personal
                contact details (phone/email) as training data for public AI
                models.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                5. Data Sharing
              </h2>
              <p>
                We do not sell your personal data to third parties. We may share
                data with trusted service providers (e.g., cloud hosting,
                WhatsApp Business API providers) solely for the purpose of
                operating the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-3">
                6. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us at support@naarad.ai.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Naarad AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
