import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePreferences } from "../contexts/PreferencesContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { ICONS, PagePath, EXAMPLE_NOTIFICATIONS } from "../constants";
import WhatsAppPreview from "../components/common/WhatsAppPreview";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

// SVG Section Divider Component
const SectionDivider: React.FC<{
  fillColor?: string;
  className?: string;
  type?: "curve" | "angle-top-left" | "angle-top-right" | "wave";
}> = ({ fillColor = "fill-gray-900", className = "", type = "curve" }) => {
  if (type === "angle-top-left") {
    return (
      <div className={`relative ${className}`} style={{ lineHeight: 0 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className={`w-full h-auto block ${fillColor}`}
        >
          <polygon points="0,100 1440,0 1440,100" />
        </svg>
      </div>
    );
  }
  if (type === "angle-top-right") {
    return (
      <div className={`relative ${className}`} style={{ lineHeight: 0 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className={`w-full h-auto block ${fillColor}`}
        >
          <polygon points="0,0 1440,100 0,100" />
        </svg>
      </div>
    );
  }
  if (type === "wave") {
    return (
      <div className={`relative ${className}`} style={{ lineHeight: 0 }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className={`w-full h-auto block ${fillColor}`}
        >
          <path d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z"></path>
        </svg>
      </div>
    );
  }
  return (
    <div
      className={`relative ${className}`}
      style={{ lineHeight: 0, transform: "translateY(1px)" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={`w-full h-auto block ${fillColor}`}
      >
        <path d="M1440,21.2109375 C1260,21.2109375 1080,80 720,80 C360,80 180,21.2109375 0,21.2109375 L0,0 L1440,0 L1440,21.2109375 Z"></path>
      </svg>
    </div>
  );
};

const CategoryShowcaseCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
  colorClass: string; // e.g., 'text-accent-orange'
  bgClass: string; // e.g., 'bg-accent-orange'
  delay?: string;
}> = ({ icon, title, description, tags, colorClass, bgClass, delay = "0" }) => (
  <div
    className="group relative bg-gray-900 rounded-2xl p-6 border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-2xl-dark wow animate__animated animate__fadeInUp flex flex-col h-full"
    data-wow-delay={delay}
  >
    <div
      className={`absolute inset-0 ${bgClass} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
    ></div>
    <div className="relative z-10 flex-grow">
      <div
        className={`w-14 h-14 mb-5 rounded-2xl ${bgClass} bg-opacity-10 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6">
        {description}
      </p>
    </div>
    <div className="relative z-10 pt-4 border-t border-white/5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Popular Interests
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className={`text-xs px-2.5 py-1 rounded-md bg-gray-800 text-gray-300 border border-white/5 group-hover:border-${
              colorClass.split("-")[1]
            }/30 transition-colors`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const HowItWorksStep: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  stepNumber: number;
  delay?: string;
}> = ({ icon, title, description, stepNumber, delay = "0" }) => (
  <div
    className={`text-center md:text-left p-6 bg-white/5 backdrop-blur-sm rounded-xl shadow-xl-dark border border-white/10 hover:border-primary/30 transition-all duration-300 wow animate__animated animate__fadeInUp group`}
    data-wow-delay={delay}
  >
    <div className="flex flex-col md:flex-row items-center">
      <div className="flex-shrink-0 w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg mr-0 md:mr-6 mb-4 md:mb-0 border-2 border-primary-dark group-hover:scale-110 transition-transform duration-300">
        {stepNumber}
      </div>
      <div className="mt-2 md:mt-0">
        <h3 className="text-xl lg:text-2xl font-semibold text-white mb-2">
          {title}
        </h3>
        <p className="text-primary-lighter/70 text-sm lg:text-base leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, startNewAlert } = usePreferences();
  const [email, setEmail] = useState(user.email || "");
  const [whatsappNumber, setWhatsappNumber] = useState(
    user.whatsappNumber || ""
  );
  const [countryDialCode, setCountryDialCode] = useState<string>("91");
  const [countryIso2, setCountryIso2] = useState<string>("in");
  const [emailError, setEmailError] = useState("");
  const [whatsappError, setWhatsappError] = useState("");
  const [loginIntent, setLoginIntent] = useState<"create" | "login">("create");

  // State for the interactive Hero demo
  const [activeDemoCategory, setActiveDemoCategory] =
    useState<string>("SPORTS");

  const loginSectionRef = useRef<HTMLDivElement>(null);

  const scrollToLogin = () => {
    loginSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const scrollToCategories = () => {
    document
      .getElementById("categories-section")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError("Email is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validateWhatsappNumber = (value: string): boolean => {
    // Normalize value to +<digits>
    const cleaned = value.replace(/\s+/g, "");
    if (!cleaned) {
      setWhatsappError("WhatsApp number is required.");
      return false;
    }

    const withPlus = cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
    if (!/^\+[1-9]\d{6,14}$/.test(withPlus)) {
      setWhatsappError("Please enter a valid WhatsApp number.");
      return false;
    }

    // Country-specific light checks
    const dial = countryDialCode || "91";
    const national = withPlus.replace(new RegExp(`^\\+${dial}`), "");

    if ((countryIso2 || "in").toLowerCase() === "in") {
      if (!/^\d{10}$/.test(national) || !/^[6-9]/.test(national)) {
        setWhatsappError(
          "Enter a valid 10-digit Indian mobile number starting 6-9."
        );
        return false;
      }
    } else {
      // Generic bounds for non-IN numbers
      if (national.length < 7 || national.length > 12) {
        setWhatsappError("Enter a valid phone number for your country.");
        return false;
      }
    }

    setWhatsappError("");
    return true;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Format phone number with + prefix
    const formattedNumber = whatsappNumber.startsWith("+")
      ? whatsappNumber
      : `+${whatsappNumber}`;

    if (validateEmail(email) && validateWhatsappNumber(formattedNumber)) {
      const updatedUser = {
        ...user,
        email,
        whatsappNumber: formattedNumber,
        isWhatsAppConfirmed: true,
      };
      setUser(updatedUser);
      if (loginIntent === "login" && updatedUser.alerts.length > 0) {
        navigate(PagePath.DASHBOARD);
      } else {
        startNewAlert();
      }
    }
  };

  const handleSocialLogin = (provider: string) => {
    const mockEmail =
      provider === "Google" ? "user@gmail.com" : "user@icloud.com";
    setEmail(mockEmail);
    let currentWhatsapp = whatsappNumber || "+1234567890";
    setWhatsappNumber(currentWhatsapp);

    if (validateWhatsappNumber(currentWhatsapp) && validateEmail(mockEmail)) {
      const updatedUser = {
        ...user,
        email: mockEmail,
        whatsappNumber: currentWhatsapp,
        isWhatsAppConfirmed: true,
      };
      setUser(updatedUser);
      if (updatedUser.alerts.length > 0) navigate(PagePath.DASHBOARD);
      else startNewAlert();
    } else {
      setWhatsappError("Please provide a valid WhatsApp number.");
      loginSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  useEffect(() => {
    const WOW = (window as any).WOW;
    if (WOW) {
      new WOW({
        live: false,
        boxClass: "wow",
        animateClass: "animate__animated",
        offset: 50,
        mobile: true,
      }).init();
    }
  }, []);

  const demoCategories = [
    { id: "SPORTS", label: "Sports", icon: ICONS.SPORTS },
    { id: "NEWS", label: "News", icon: ICONS.NEWS },
    { id: "MOVIES_TV", label: "Movies", icon: ICONS.MOVIES },
    { id: "YOUTUBE", label: "YouTube", icon: ICONS.YOUTUBE },
    { id: "CUSTOM", label: "Custom", icon: ICONS.CUSTOM },
  ];

  return (
    <>
      <style>{`
        .react-tel-input .flag-dropdown {
          background-color: transparent !important;
          border: none !important;
        }
        .react-tel-input .selected-flag {
          background-color: transparent !important;
        }
        .react-tel-input .selected-flag:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .react-tel-input .country-list {
          background-color: #1f2937 !important;
          border: 1px solid #374151 !important;
        }
        .react-tel-input .country-list .country {
          color: white !important;
        }
        .react-tel-input .country-list .country:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .react-tel-input .country-list .country.highlight {
          background-color: rgba(34, 197, 94, 0.2) !important;
        }
        .react-tel-input .search-box {
          background-color: #374151 !important;
          border: 1px solid #4b5563 !important;
          color: white !important;
        }
        .react-tel-input .search-box:focus {
          border-color: #22c55e !important;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-secondary-dark to-gray-900 text-white page-fade-enter overflow-x-hidden">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-30 py-4 px-4 sm:px-6 lg:px-8 bg-transparent">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/icons/icon.png"
                alt="Naarad AI"
                className="h-10 w-10 rounded-xl shadow-lg ring-2 ring-primary/30"
              />
              <h2 className="text-xl font-bold text-white tracking-wide">
                Naarad AI
              </h2>
            </div>
            <Button
              onClick={() => {
                setLoginIntent("login");
                scrollToLogin();
              }}
              variant="outline"
              className="border-white/40 text-white/90 hover:bg-white/10 hover:border-white/80"
            >
              Login
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-0"></div>
          <div className="absolute -top-40 -left-60 w-[500px] h-[500px] bg-primary/20 rounded-full filter blur-3xl opacity-30 animate-slow-pulse"></div>
          <div className="absolute -bottom-40 -right-52 w-[450px] h-[450px] bg-accent-teal/20 rounded-full filter blur-3xl opacity-30 animate-slow-pulse animation-delay-2000"></div>

          <div className="container mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className="inline-block px-3 py-1 mb-4 border border-primary/40 rounded-full bg-primary/10 backdrop-blur-sm text-primary-light text-sm font-medium wow animate__animated animate__fadeInDown">
                  ✨ Super-Personalized Updates
                </div>
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight wow animate__animated animate__fadeInDown"
                  data-wow-delay="0.1s"
                >
                  <span className="block text-white mb-2 leading-tight">
                    Stop drowning in information.
                  </span>
                  <span className="block text-primary">
                    Your World. Curated on WhatsApp.
                  </span>
                </h1>
                <p
                  className="text-lg md:text-xl text-primary-lighter/80 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed wow animate__animated animate__fadeInUp"
                  data-wow-delay="0.2s"
                >
                  Stop doomscrolling. Select the topics you actually care
                  about—from Cricket and Tech to specific YouTube channels—and
                  get a smart digest delivered daily.
                </p>
                <div
                  className="flex justify-center lg:justify-start wow animate__animated animate__fadeInUp"
                  data-wow-delay="0.3s"
                >
                  <Button
                    onClick={() => {
                      setLoginIntent("create");
                      scrollToLogin();
                    }}
                    variant="primary"
                    size="lg"
                    className="py-4 px-10 text-lg shadow-xl hover:shadow-glow-primary transform hover:scale-105"
                  >
                    Start Your Feed {ICONS.ARROW_RIGHT}
                  </Button>
                </div>
              </div>

              {/* Right Interactive Preview */}
              <div
                className="mt-10 lg:mt-0 wow animate__animated animate__fadeInRight"
                data-wow-delay="0.4s"
              >
                <div className="relative">
                  {/* Category Selectors */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-md mx-auto">
                    {demoCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveDemoCategory(cat.id)}
                        className={`
                                    flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                    ${
                                      activeDemoCategory === cat.id
                                        ? "bg-primary text-white shadow-lg ring-2 ring-primary-dark/50 transform scale-105"
                                        : "bg-gray-800/60 text-gray-400 hover:bg-gray-700 hover:text-white border border-white/10"
                                    }
                                `}
                      >
                        <span className="mr-2">{cat.icon}</span>
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Phone Mockup */}
                  <div className="relative mx-auto max-w-xs sm:max-w-sm transform transition-all duration-500 hover:scale-[1.02]">
                    <div className="absolute -inset-4 bg-gradient-to-b from-primary/20 to-accent-purple/20 rounded-[2.5rem] blur-xl opacity-60"></div>
                    <div className="relative rounded-2xl shadow-2xl-dark overflow-hidden border border-white/10 bg-gray-900">
                      <WhatsAppPreview
                        message={EXAMPLE_NOTIFICATIONS[activeDemoCategory]}
                        senderName="Naarad AI"
                      />
                    </div>
                    {/* Hand cursor instruction */}
                    <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden md:block animate-bounce">
                      <div className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-l-lg shadow-lg">
                        Try clicking tabs! 👆
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer z-20 opacity-70 hover:opacity-100 transition-opacity"
            onClick={scrollToCategories}
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </section>

        <SectionDivider fillColor="fill-gray-950" type="wave" />

        {/* NEW: Categories Showcase Section */}
        <section
          id="categories-section"
          className="py-20 bg-gray-950 relative overflow-hidden"
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16 wow animate__animated animate__fadeInUp">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                A Universe of Interests
              </h2>
              <p className="text-primary-lighter/70 text-lg">
                Naarad isn't just a news bot. It's a platform with specialized
                intelligence for every passion. Pick what matters; we'll ignore
                the rest.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              <CategoryShowcaseCard
                title="Sports"
                icon={ICONS.SPORTS}
                colorClass="text-accent-orange"
                bgClass="bg-accent-orange"
                description="Never miss a match, transfer, or highlight. Follow specific teams (e.g., RCB, Man Utd), players, or entire leagues."
                tags={["Cricket", "Football", "F1", "Tennis", "Esports"]}
                delay="0.1s"
              />
              <CategoryShowcaseCard
                title="News & Tech"
                icon={ICONS.NEWS}
                colorClass="text-accent-blue"
                bgClass="bg-accent-blue"
                description="Stay smart with summaries on Geopolitics, Startups, AI, or Local News. tailored to your depth preference."
                tags={["Startups", "Geopolitics", "AI", "Finance", "Local"]}
                delay="0.2s"
              />
              <CategoryShowcaseCard
                title="Movies & TV"
                icon={ICONS.MOVIES}
                colorClass="text-accent-purple"
                bgClass="bg-accent-purple"
                description="Get updates on new releases, OTT drops, and reviews. Track your favorite actors or genres without spoilers."
                tags={["Hollywood", "Bollywood", "Anime", "Netflix", "Reviews"]}
                delay="0.3s"
              />
              <CategoryShowcaseCard
                title="YouTube"
                icon={ICONS.YOUTUBE}
                colorClass="text-accent-pink"
                bgClass="bg-accent-pink"
                description="Follow your favorite creators (e.g., MKBHD, MrBeast) and get summaries of their latest videos instantly."
                tags={[
                  "Tech Reviews",
                  "Vlogs",
                  "Gaming",
                  "Cooking",
                  "Education",
                ]}
                delay="0.4s"
              />
              <CategoryShowcaseCard
                title="Custom Interests"
                icon={ICONS.CUSTOM}
                colorClass="text-accent-teal"
                bgClass="bg-accent-teal"
                description="Have a niche hobby? From 'Ancient History' to 'Gardening Tips', create a custom feed just for it."
                tags={["History", "Coding", "Fitness", "Gardening", "Deals"]}
                delay="0.5s"
              />
              {/* Last card is a CTA to start */}
              <div
                className="group relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-glow-primary wow animate__animated animate__fadeInUp flex flex-col items-center justify-center text-center cursor-pointer"
                data-wow-delay="0.6s"
                onClick={() => {
                  setLoginIntent("create");
                  scrollToLogin();
                }}
              >
                <div className="w-16 h-16 mb-4 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {ICONS.PLUS}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Build Your Own
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Mix and match categories to create your perfect morning
                  digest.
                </p>
                <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center">
                  Get Started {ICONS.ARROW_RIGHT}
                </span>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider fillColor="fill-gray-950" type="angle-top-left" />

        {/* How It Works Section */}
        <section className="py-20 bg-gray-900 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-primary-lighter wow animate__animated animate__fadeInUp">
              How It Works
            </h2>
            <p
              className="text-center text-primary-lighter/70 mb-16 max-w-2xl mx-auto wow animate__animated animate__fadeInUp"
              data-wow-delay="0.1s"
            >
              It's as easy as chatting with a friend.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
              <HowItWorksStep
                stepNumber={1}
                icon={ICONS.USER}
                title="Connect"
                description="Sign up with your WhatsApp number. No new apps to install."
                delay="0.2s"
              />
              <HowItWorksStep
                stepNumber={2}
                icon={ICONS.STAR}
                title="Select"
                description="Pick your categories. Be as specific as you like (e.g., 'Only Test Cricket')."
                delay="0.3s"
              />
              <HowItWorksStep
                stepNumber={3}
                icon={ICONS.CLOCK}
                title="Schedule"
                description="Choose when you want updates. Morning coffee? Evening commute? You decide."
                delay="0.4s"
              />
              <HowItWorksStep
                stepNumber={4}
                icon={ICONS.WHATSAPP}
                title="Receive"
                description="Get your personalized digest delivered to your WhatsApp chats."
                delay="0.5s"
              />
            </div>
          </div>
        </section>

        <SectionDivider fillColor="fill-gray-950" type="angle-top-right" />

        {/* Login Section */}
        <section
          ref={loginSectionRef}
          className="py-20 bg-gray-900 px-4 sm:px-6 lg:px-8"
        >
          <div className="container mx-auto">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-lg shadow-2xl-dark rounded-3xl p-8 md:p-12 w-full max-w-lg mx-auto border border-white/10 wow animate__animated animate__fadeInUp">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                  Start Your Feed
                </h2>
                <p className="text-gray-400 mt-3 text-lg">
                  Join thousands getting smarter updates.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  onBlur={() => validateEmail(email)}
                  icon={<span className="text-primary">{ICONS.EMAIL}</span>}
                  error={emailError}
                  required
                  inputClassName="bg-black/20 text-white placeholder-gray-500 border-white/10 focus:border-primary focus:ring-primary h-12"
                  labelClassName="!text-gray-300"
                />
                <div>
                  <label
                    htmlFor="whatsappNumberPhone"
                    className="block text-sm font-medium !text-gray-300 mb-2"
                  >
                    WhatsApp Number
                  </label>
                  <div className="bg-black/20 border border-white/10 rounded-lg focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                    <PhoneInput
                      country={"in"}
                      value={whatsappNumber}
                      onChange={(value, data: any) => {
                        setWhatsappNumber(value);
                        if (data && data.dialCode)
                          setCountryDialCode(String(data.dialCode));
                        if (data && data.countryCode)
                          setCountryIso2(String(data.countryCode));
                        if (whatsappError) validateWhatsappNumber(`+${value}`);
                      }}
                      onBlur={() =>
                        validateWhatsappNumber(`+${whatsappNumber}`)
                      }
                      inputProps={{
                        name: "whatsappNumberPhone",
                        id: "whatsappNumberPhone",
                        required: true,
                      }}
                      inputClass="!bg-transparent !text-white !border-0 !w-full !h-12 !text-base !placeholder-gray-500"
                      buttonClass="!bg-transparent !border-0 !text-white hover:!bg-white/10"
                      containerClass="w-full"
                      dropdownClass="!bg-gray-800 !text-white !border-gray-700"
                      enableSearch
                      disableSearchIcon
                    />
                  </div>
                  {whatsappError && (
                    <p className="mt-2 text-sm text-red-400">{whatsappError}</p>
                  )}
                  <p className="text-xs text-gray-500 pt-1">
                    We use your WhatsApp number to deliver personalized updates.
                    Standard rates may apply.
                  </p>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full !py-4 text-lg shadow-lg hover:shadow-glow-primary hover:-translate-y-1 transition-all"
                >
                  Continue to Personalization {ICONS.ARROW_RIGHT}
                </Button>
              </form>

              {/* <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-sm text-gray-500 mb-4">
                Or continue with
              </p>
              <div className="grid grid-cols-2 gap-4">
                 <Button 
                    variant="outline" 
                  className="border-white/20 hover:bg-white/5 text-gray-300"
                  onClick={() => handleSocialLogin("Google")}
                  >
                  {ICONS.GOOGLE} Google
                </Button>
                <Button 
                    variant="outline" 
                  className="border-white/20 hover:bg-white/5 text-gray-300"
                  onClick={() => handleSocialLogin("Apple")}
                >
                  {ICONS.APPLE} Apple
                </Button>
              </div>
            </div> */}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 text-center border-t border-white/5 bg-gray-950">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Naarad AI. Your world,
              summarized.
            </p>
            <div className="flex gap-6">
              <Link
                to={PagePath.PRIVACY_POLICY}
                className="text-gray-500 hover:text-primary text-sm transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
