import React from "react";
import { SampleMessage, SelectableTagCategoryKey } from "./types";

export const PRIMARY_CTA_COLOR = "bg-primary";
export const PRIMARY_CTA_HOVER_COLOR = "hover:bg-primary-dark";
export const SECONDARY_COLOR = "bg-teal-500";
export const SECONDARY_HOVER_COLOR = "hover:bg-teal-600";

export const PagePath = {
  LANDING: "/", // Changed from LOGIN and set to root
  INTERESTS: "/interests",
  TUNING: "/tuning",
  FREQUENCY: "/frequency",
  DASHBOARD: "/dashboard",
};

export const ICONS = {
  SPORTS: "⚽",
  MOVIES: "🎬",
  NEWS: "📰",
  YOUTUBE: "📺",
  CUSTOM: "✍️",
  SETTINGS: "⚙️",
  CLOCK: "⏰",
  CHECK: "✅",
  EDIT: "✏️",
  USER: "👤",
  WHATSAPP: (
    <span className="text-xl" role="img" aria-label="whatsapp">
      💬
    </span>
  ),
  EMAIL: "📧",
  PHONE: "📱",
  ARROW_RIGHT: (
    <span className="ml-1" role="img" aria-label="right arrow">
      →
    </span>
  ),
  ARROW_LEFT: (
    <span className="mr-1" role="img" aria-label="left arrow">
      ←
    </span>
  ),
  SAVE: "💾",
  CANCEL: "❌",
  PAUSE: "⏸️",
  PLAY: "▶️",
  SUMMARY: "📋",
  TEST: "🧪",
  LOADING: "⏳",
  INFO: "ℹ️",
  BELL: "🔔",
  STAR: "⭐",
  LIGHTBULB: "💡",
  PLUS: "➕",
  TAG: "🏷️",
  OTHER: "✍️", // Icon for "Other (Specify)"
  IMAGE_PLACEHOLDER: (
    <span
      className="text-6xl text-gray-400"
      role="img"
      aria-label="image placeholder"
    >
      🖼️
    </span>
  ),
  READ_MORE: "📖",
  TRASH: "🗑️",
  GOOGLE: (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 6.58L5.84 9.4c.87-2.6 3.3-4.02 6.16-4.02z" />
    </svg>
  ),
  APPLE: (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.32 12.75c-.03-2.26-1.73-3.63-1.82-3.69a3.63 3.63 0 00-2.82-1.37c-1.32 0-2.5.78-3.17 1.51a4.1 4.1 0 00-1.22-.03c-1.35 0-2.7.82-3.42 1.58-1.58 1.6-2.37 4.25-1.76 6.6.5 1.92 1.73 3.45 3.14 4.2a4.5 4.5 0 003.28.73c.25 0 .5-.03.75-.07.22-.03.45-.07.66-.13.81-.2 1.4-.4 2.07-1.17.66-.78.92-1.14.92-1.17s-.04-.08-.04-.13c0-.05.46-1.39.48-1.43.03-.05.05-.1.05-.15s-.02-.1-.05-.15c-.02-.05-.05-.08-.08-.13a.56.56 0 00-.34-.17c-.11 0-.22.03-.3.08-.08.05-.14.1-.18.15-.04.05-.07.1-.08.15L19.32 12.75zM14.97 4.41a4.63 4.63 0 011.76-.3c.73 0 1.4.17 2 .45.02-1.82-1.2-3.03-1.33-3.13a2.95 2.95 0 00-2.22-1.06c-1.42 0-2.6.7-3.25 1.4-.02.03-.03.05-.05.08a2.69 2.69 0 011.18 1.05c.4-.41.85-.72 1.38-.9.1-.03.2-.06.3-.09z" />
    </svg>
  ),
  WHATSAPP_LOGO: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 11.5C21 16.7467 16.7467 21 11.5 21C10.573 21 9.68403 20.8543 8.85273 20.5817L3 22L4.41827 16.1473C4.14572 15.316 4 14.427 4 13.5C4 8.25329 8.25329 4 13.5 4C18.7467 4 23 8.25329 23 13.5C23 14.9338 22.6243 16.2648 21.9668 17.4183M21 11.5C21 10.7941 20.8805 10.1069 20.6587 9.45707"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 11H9.01M12 11H12.01M15 11H15.01"
        strokeWidth="2.5"
      />
    </svg>
  ),
};

export const WHATSAPP_PREVIEW_SENDER = "Your Updates";

export const WHATSAPP_PREVIEW_TIME = (): string => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
};

export const EXAMPLE_NOTIFICATIONS: Record<string, SampleMessage> = {
  DEFAULT: {
    summaryText:
      "Welcome! Select an interest to see a personalized sample update, or explore how our service works.",
    imageUrl: "✨",
    actionText: "Learn More",
  },
  SPORTS: {
    summaryText:
      "⚽ Great news for cricket fans! Virat Kohli just scored a century in the ongoing test match against Australia. What a performance!",
    imageUrl: "🏏",
    actionText: "Full Match Report",
  },
  MOVIES_TV: {
    summaryText:
      "🎬 Sci-Fi fans, rejoice! 'Dune: Part Two' is now streaming on Max. Critics are calling it a visual masterpiece.",
    imageUrl: "🏜️",
    actionText: "Watch Trailer",
  },
  NEWS: {
    summaryText:
      "📰 Tech Update: A new AI model has been released that can generate realistic images from text prompts. This could revolutionize digital art!",
    imageUrl: "🤖",
    actionText: "Discover AI Art",
  },
  YOUTUBE: {
    summaryText:
      "📺 MKBHD just dropped a new video reviewing the latest smartphone. He says the camera is a game-changer!",
    imageUrl: "📱",
    actionText: "Watch Review Now",
  },
  CUSTOM: {
    summaryText:
      "✍️ Based on your custom interest in 'Ancient Roman History', a new documentary exploring the fall of the Republic has just been released.",
    imageUrl: "🏛️",
    actionText: "Explore Documentary",
  },
};

export interface Tag {
  id: string;
  label: string;
  icon?: string | React.ReactNode;
  color?: string;
}

export interface FollowUpQuestion {
  id: string;
  text: string;
  predefinedAnswerTags?: Tag[];
  hasOtherOption?: boolean;
  helperText?: string;
  isSingleSelect?: boolean;
}

export interface SubCategory {
  id: string;
  label: string;
  icon?: string | React.ReactNode;
  tags?: Tag[]; // Now optional, especially for News
  description?: string;
  popularTeams?: Tag[]; // For Sports
  popularPlayers?: Tag[]; // For Sports
  followUpQuestions?: FollowUpQuestion[]; // Moved here for context-specific questions
  popularInstructionTags?: Tag[]; // Now can be at sub-category level
}

export interface MainCategory {
  id: SelectableTagCategoryKey | "custom";
  label: string;
  icon: string | React.ReactNode;
  color: string;
  textColor: string;
  subCategories?: SubCategory[];
  tags?: Tag[];
  followUpQuestions?: FollowUpQuestion[];
  followUpHelperText?: string;
  popularInstructionTags?: Tag[];
}

export const INTEREST_TAG_HIERARCHY: Record<string, MainCategory> = {
  SPORTS: {
    id: "sports",
    label: "Sports",
    icon: ICONS.SPORTS,
    color: "accent-orange",
    textColor: "text-white",
    subCategories: [
      {
        id: "sports_cricket",
        label: "Cricket",
        icon: "🏏",
        popularTeams: [
          { id: "cricket_team_rcb", label: "Royal Challengers Bengaluru" },
          { id: "cricket_team_mi", label: "Mumbai Indians" },
          { id: "cricket_team_csk", label: "Chennai Super Kings" },
          { id: "cricket_team_ind", label: "Team India" },
          { id: "cricket_team_aus", label: "Team Australia" },
          { id: "cricket_team_eng", label: "Team England" },
        ],
        popularPlayers: [
          { id: "cricket_player_vk", label: "Virat Kohli" },
          { id: "cricket_player_rs", label: "Rohit Sharma" },
          { id: "cricket_player_msd", label: "MS Dhoni" },
          { id: "cricket_player_sc", label: "Shubman Gill" },
          { id: "cricket_player_jb", label: "Jasprit Bumrah" },
          { id: "cricket_player_sp", label: "Steve Smith" },
        ],
        followUpQuestions: [
          {
            id: "favTeam",
            text: "Which are your favorite cricket teams?",
            hasOtherOption: true,
          },
          {
            id: "favPlayer",
            text: "Any favorite cricket players you follow closely?",
            hasOtherOption: true,
          },
          {
            id: "cricket_leagues",
            text: "Which leagues or tournaments catch your eye?",
            predefinedAnswerTags: [
              { id: "cricket_ipl", label: "IPL" },
              { id: "cricket_t20wc", label: "T20 World Cup" },
              { id: "cricket_test", label: "Test Matches" },
              { id: "cricket_odi", label: "ODI World Cup" },
            ],
            hasOtherOption: true,
          },
        ],
        popularInstructionTags: [
          {
            id: "cricket_instr_winsonly",
            label: "Notify on wins only (my team)",
          },
          { id: "cricket_instr_scores", label: "Include final scores" },
          {
            id: "cricket_instr_milestones",
            label: "Alerts on milestones (100s, 5-fers)",
          },
          { id: "cricket_instr_nogossip", label: "No player gossip/rumors" },
          { id: "cricket_instr_highlights", label: "Prefer highlights links" },
        ],
      },
      {
        id: "sports_football",
        label: "Football (Soccer)",
        icon: "⚽",
        popularTeams: [
          { id: "football_team_mu", label: "Manchester United" },
          { id: "football_team_rm", label: "Real Madrid" },
          { id: "football_team_fcb", label: "FC Barcelona" },
          { id: "football_team_liv", label: "Liverpool FC" },
          { id: "football_team_bayern", label: "Bayern Munich" },
          { id: "football_team_atkmb", label: "ATK Mohun Bagan" },
        ],
        popularPlayers: [
          { id: "football_player_lm", label: "Lionel Messi" },
          { id: "football_player_cr7", label: "Cristiano Ronaldo" },
          { id: "football_player_km", label: "Kylian Mbappé" },
          { id: "football_player_sc", label: "Sunil Chhetri" },
          { id: "football_player_neymar", label: "Neymar Jr." },
          { id: "football_player_haaland", label: "Erling Haaland" },
        ],
        followUpQuestions: [
          {
            id: "favTeam",
            text: "Which are your favorite football teams?",
            hasOtherOption: true,
          },
          {
            id: "favPlayer",
            text: "Any favorite football players you follow closely?",
            hasOtherOption: true,
          },
          {
            id: "football_updateType",
            text: "What kind of football news do you prefer?",
            predefinedAnswerTags: [
              { id: "updateType_matchResults", label: "Match Results" },
              {
                id: "updateType_transferNews",
                label: "Transfer News & Rumors",
              },
              { id: "updateType_tactical", label: "Tactical Analysis" },
              { id: "updateType_highlights", label: "Highlight Links" },
            ],
            hasOtherOption: true,
          },
        ],
        popularInstructionTags: [
          {
            id: "football_instr_winsonly",
            label: "Notify on wins only (my team)",
          },
          { id: "football_instr_scores", label: "Include final scores" },
          { id: "football_instr_transfers", label: "Focus on transfer news" },
          { id: "football_instr_redcards", label: "Alerts on red cards" },
          {
            id: "football_instr_startinglineup",
            label: "Send starting lineup news",
          },
        ],
      },
      {
        id: "sports_basketball",
        label: "Basketball",
        icon: "🏀",
        popularTeams: [
          { id: "bball_team_lakers", label: "Los Angeles Lakers" },
          { id: "bball_team_warriors", label: "Golden State Warriors" },
          { id: "bball_team_celtics", label: "Boston Celtics" },
          { id: "bball_team_bulls", label: "Chicago Bulls" },
        ],
        popularPlayers: [
          { id: "bball_player_lbj", label: "LeBron James" },
          { id: "bball_player_sc", label: "Stephen Curry" },
          { id: "bball_player_kd", label: "Kevin Durant" },
          { id: "bball_player_giannis", label: "Giannis Antetokounmpo" },
        ],
        followUpQuestions: [
          {
            id: "favTeam",
            text: "Which are your favorite basketball teams?",
            hasOtherOption: true,
          },
          {
            id: "favPlayer",
            text: "Any favorite basketball players you follow closely?",
            hasOtherOption: true,
          },
          {
            id: "bball_contentType",
            text: "Besides the scores, what kind of basketball content are you into?",
            predefinedAnswerTags: [
              { id: "bball_content_highlights", label: "Game Highlights" },
              { id: "bball_content_interviews", label: "Player Interviews" },
              { id: "bball_content_trades", label: "Trade Rumors" },
              { id: "bball_content_analysis", label: "Deep Analysis" },
            ],
          },
        ],
        popularInstructionTags: [
          { id: "bball_instr_closegame", label: "Alert for close games" },
          { id: "bball_instr_stats", label: "Include player stats" },
          { id: "bball_instr_notrades", label: "No trade rumors" },
        ],
      },
      {
        id: "sports_tennis",
        label: "Tennis",
        icon: "🎾",
        popularPlayers: [
          { id: "tennis_player_djokovic", label: "Novak Djokovic" },
          { id: "tennis_player_nadal", label: "Rafael Nadal" },
          { id: "tennis_player_federer", label: "Roger Federer" },
          { id: "tennis_player_alcaraz", label: "Carlos Alcaraz" },
          { id: "tennis_player_swiatek", label: "Iga Świątek" },
          { id: "tennis_player_serena", label: "Serena Williams" },
        ],
        followUpQuestions: [
          {
            id: "favPlayer",
            text: "Any favorite tennis players you follow closely?",
            hasOtherOption: true,
          },
          {
            id: "tennis_events",
            text: "Which type of events are you most interested in?",
            predefinedAnswerTags: [
              { id: "tennis_grandslam_only", label: "Grand Slams only" },
              { id: "tennis_atp", label: "ATP Tour (Mens)" },
              { id: "tennis_wta", label: "WTA Tour (Womens)" },
              { id: "tennis_all", label: "All major events" },
            ],
          },
          {
            id: "tennis_matchFocus",
            text: "When a match happens, what's the most important thing for me to tell you?",
            predefinedAnswerTags: [
              { id: "tennis_focus_score", label: "Just the final score" },
              {
                id: "tennis_focus_moments",
                label: "Key moments (e.g., break points)",
              },
              { id: "tennis_focus_summary", label: "Full match summary" },
            ],
          },
        ],
        popularInstructionTags: [
          { id: "tennis_instr_upsets", label: "Alert on major upsets" },
          { id: "tennis_instr_tiebreaks", label: "Notify on tie-breaks" },
          {
            id: "tennis_instr_mycountry",
            label: "Focus on my country's players",
          },
        ],
      },
      {
        id: "sports_f1",
        label: "Formula 1",
        icon: "🏎️",
        popularTeams: [
          { id: "f1_team_mercedes", label: "Mercedes-AMG Petronas" },
          { id: "f1_team_redbull", label: "Oracle Red Bull Racing" },
          { id: "f1_team_ferrari", label: "Scuderia Ferrari" },
          { id: "f1_team_mclaren", label: "McLaren F1 Team" },
        ],
        popularPlayers: [
          { id: "f1_driver_hamilton", label: "Lewis Hamilton" },
          { id: "f1_driver_verstappen", label: "Max Verstappen" },
          { id: "f1_driver_leclerc", label: "Charles Leclerc" },
          { id: "f1_driver_norris", label: "Lando Norris" },
        ],
        followUpQuestions: [
          {
            id: "favTeam",
            text: "Which are your favorite F1 teams?",
            hasOtherOption: true,
          },
          {
            id: "favPlayer",
            text: "Any favorite F1 drivers you follow closely?",
            hasOtherOption: true,
          },
          {
            id: "f1_session",
            text: "Which part of a race weekend interests you most?",
            predefinedAnswerTags: [
              { id: "f1_practice", label: "Practice Sessions" },
              { id: "f1_qualifying", label: "Qualifying" },
              { id: "f1_race", label: "The Main Race" },
              { id: "f1_all", label: "The whole weekend!" },
            ],
          },
        ],
        popularInstructionTags: [
          { id: "f1_instr_overtakes", label: "Highlight key overtakes" },
          {
            id: "f1_instr_safetycar",
            label: "Notify on safety car deployment",
          },
          { id: "f1_instr_qualyonly", label: "Only qualifying & race results" },
        ],
      },
      {
        id: "sports_golf",
        label: "Golf",
        icon: "⛳",
        popularPlayers: [
          { id: "golf_player_woods", label: "Tiger Woods" },
          { id: "golf_player_scheffler", label: "Scottie Scheffler" },
          { id: "golf_player_mcilroy", label: "Rory McIlroy" },
          { id: "golf_player_rahm", label: "Jon Rahm" },
        ],
        followUpQuestions: [
          {
            id: "favPlayer",
            text: "Any favorite golfers you follow closely?",
            hasOtherOption: true,
          },
          {
            id: "golf_tours",
            text: "Which professional tours do you follow?",
            predefinedAnswerTags: [
              { id: "golf_tour_pga", label: "PGA Tour" },
              { id: "golf_tour_liv", label: "LIV Golf" },
              { id: "golf_tour_lpga", label: "LPGA Tour (Womens)" },
              { id: "golf_tour_euro", label: "European Tour" },
            ],
          },
          {
            id: "golf_updateType",
            text: "During a tournament, what kind of updates are most exciting for you?",
            predefinedAnswerTags: [
              { id: "golf_update_summary", label: "End-of-day summaries" },
              { id: "golf_update_holeinone", label: "Hole-in-one alerts" },
              { id: "golf_update_leader", label: "Leader changes" },
              { id: "golf_update_favs", label: "My favorite players only" },
            ],
          },
        ],
        popularInstructionTags: [
          { id: "golf_instr_leaderboard", label: "Leaderboard updates only" },
          { id: "golf_instr_majorsonly", label: "Majors only" },
          { id: "golf_instr_finalround", label: "Final round updates only" },
        ],
      },
      {
        id: "sports_badminton",
        label: "Badminton",
        icon: "🏸",
        popularPlayers: [
          { id: "badminton_player_pvsindhu", label: "PV Sindhu" },
          { id: "badminton_player_lsen", label: "Lakshya Sen" },
          { id: "badminton_player_va", label: "Viktor Axelsen" },
          { id: "badminton_player_ays", label: "An Se-young" },
        ],
        followUpQuestions: [
          {
            id: "favPlayer",
            text: "Any favorite badminton players you follow closely?",
            hasOtherOption: true,
          },
          {
            id: "badminton_tournaments",
            text: "Which tournaments are a must-watch for you?",
            predefinedAnswerTags: [
              { id: "badminton_tourn_olympics", label: "Olympics" },
              { id: "badminton_tourn_bwf", label: "BWF World Championships" },
              { id: "badminton_tourn_allengland", label: "All England Open" },
              { id: "badminton_tourn_thomasuber", label: "Thomas & Uber Cup" },
            ],
          },
          {
            id: "badminton_newsType",
            text: "Beyond who won, what badminton news interests you most?",
            predefinedAnswerTags: [
              {
                id: "badminton_news_rankings",
                label: "Player ranking changes",
              },
              {
                id: "badminton_news_schedules",
                label: "Upcoming match schedules",
              },
              {
                id: "badminton_news_indian",
                label: "News about Indian players",
              },
            ],
          },
        ],
        popularInstructionTags: [
          {
            id: "badminton_instr_mycountry",
            label: "Focus on my country's players",
          },
          { id: "badminton_instr_finals", label: "Finals only" },
        ],
      },
      {
        id: "sports_kabaddi",
        label: "Kabaddi",
        icon: "🤸",
        popularTeams: [
          { id: "kabaddi_team_patna", label: "Patna Pirates" },
          { id: "kabaddi_team_bengaluru", label: "Bengaluru Bulls" },
          { id: "kabaddi_team_jaipur", label: "Jaipur Pink Panthers" },
        ],
        popularPlayers: [
          { id: "kabaddi_player_pardeep", label: "Pardeep Narwal" },
          { id: "kabaddi_player_pawan", label: "Pawan Sehrawat" },
        ],
        followUpQuestions: [
          {
            id: "favTeam",
            text: "Which are your favorite kabaddi teams?",
            hasOtherOption: true,
          },
          {
            id: "favPlayer",
            text: "Any favorite kabaddi players you follow closely?",
            hasOtherOption: true,
          },
          {
            id: "kabaddi_leagues",
            text: "Which Kabaddi action are you tracking?",
            predefinedAnswerTags: [
              { id: "kabaddi_league_pkl", label: "Pro Kabaddi League (PKL)" },
              {
                id: "kabaddi_league_international",
                label: "International Matches",
              },
              { id: "kabaddi_league_super", label: "Super Kabaddi League" },
            ],
          },
        ],
        popularInstructionTags: [
          { id: "kabaddi_instr_superraid", label: "Notify on Super Raids" },
          { id: "kabaddi_instr_winsonly", label: "Wins only" },
        ],
      },
      {
        id: "sports_esports",
        label: "eSports",
        icon: "🎮",
        followUpQuestions: [
          {
            id: "esports_games",
            text: "Which games do you follow?",
            predefinedAnswerTags: [
              { id: "esports_valorant", label: "Valorant" },
              { id: "esports_csgo", label: "Counter-Strike" },
              { id: "esports_dota2", label: "Dota 2" },
              { id: "esports_lol", label: "League of Legends" },
              { id: "esports_bgmi", label: "BGMI (India)" },
            ],
            hasOtherOption: true,
          },
          {
            id: "esports_teamsRegions",
            text: "Any specific teams or regions you root for?",
            predefinedAnswerTags: [
              { id: "esports_region_na", label: "North America (NA)" },
              { id: "esports_region_eu", label: "Europe (EU)" },
              { id: "esports_region_asia", label: "Asia" },
              { id: "esports_region_in", label: "India" },
            ],
            hasOtherOption: true,
          },
          {
            id: "esports_newsType",
            text: "What kind of eSports news gets you hyped?",
            predefinedAnswerTags: [
              { id: "esports_news_results", label: "Tournament results" },
              {
                id: "esports_news_roster",
                label: "Roster updates & team news",
              },
              {
                id: "esports_news_patches",
                label: "Major game updates/patches",
              },
            ],
          },
        ],
        popularInstructionTags: [
          { id: "esports_instr_roster", label: "Roster changes" },
          { id: "esports_instr_majors", label: "Majors only" },
          { id: "esports_instr_twitch", label: "Link to Twitch streams" },
        ],
      },
      {
        id: "sports_other",
        label: "Other Sport",
        icon: ICONS.OTHER,
        tags: [{ id: "other_sport_generic", label: "General Updates" }],
      },
    ],
    followUpHelperText:
      "These answers help us personalize your sports news further.",
  },
  MOVIES_TV: {
    id: "moviesTV",
    label: "Movies & TV",
    icon: ICONS.MOVIES,
    color: "accent-purple",
    textColor: "text-white",
    subCategories: [
      {
        id: "moviestv_hollywood",
        label: "Hollywood",
        icon: "🎬",
        popularInstructionTags: [
          {
            id: "moviestv_instr_nospoilers",
            label: "No spoilers for new releases",
          },
          {
            id: "moviestv_instr_ratings",
            label: "Include Rotten Tomatoes score",
          },
          {
            id: "moviestv_instr_streamingonly",
            label: "Alerts for streaming availability only",
          },
          {
            id: "moviestv_instr_awardseason",
            label: "Focus on award seasons (Oscars, etc.)",
          },
        ],
        followUpQuestions: [
          {
            id: "hollywood_genres",
            text: "Which Hollywood genres are your go-to?",
            predefinedAnswerTags: [
              { id: "genre_action", label: "Action" },
              { id: "genre_comedy", label: "Comedy" },
              { id: "genre_drama", label: "Drama" },
              { id: "genre_scifi", label: "Sci-Fi" },
              { id: "genre_horror", label: "Horror" },
              { id: "genre_thriller", label: "Thriller" },
            ],
            hasOtherOption: true,
          },
          {
            id: "hollywood_favs",
            text: "Any favorite actors or directors I should track for you?",
            hasOtherOption: true,
          },
          {
            id: "releaseAlerts",
            text: "When should we notify you about new releases?",
            predefinedAnswerTags: [
              { id: "release_theatrical", label: "Theatrical Release" },
              { id: "release_streaming", label: "When it hits Streaming" },
              { id: "release_both", label: "Both Theatrical & Streaming" },
            ],
          },
        ],
      },
      {
        id: "moviestv_bollywood",
        label: "Bollywood",
        icon: "🕺",
        popularInstructionTags: [
          { id: "bollywood_instr_nospoilers", label: "No spoilers!" },
          { id: "bollywood_instr_music", label: "Include music releases" },
          {
            id: "bollywood_instr_boxoffice",
            label: "Include box office numbers",
          },
          {
            id: "bollywood_instr_interviews",
            label: "Cast & director interviews",
          },
        ],
        followUpQuestions: [
          {
            id: "bollywood_genres",
            text: "What kind of Bollywood movies do you enjoy?",
            predefinedAnswerTags: [
              { id: "bwood_genre_masala", label: "Masala / Action" },
              { id: "bwood_genre_romcom", label: "Rom-Com" },
              { id: "bwood_genre_drama", label: "Drama" },
              { id: "bwood_genre_thriller", label: "Thriller/Crime" },
            ],
            hasOtherOption: true,
          },
          {
            id: "bollywood_favs",
            text: "Any favorite actors or directors in Bollywood?",
            hasOtherOption: true,
          },
          {
            id: "bollywood_music",
            text: "How important is the music for you?",
            predefinedAnswerTags: [
              {
                id: "bwood_music_very",
                label: "Very important, send album news",
              },
              {
                id: "bwood_music_somewhat",
                label: "Just the hit songs are fine",
              },
              { id: "bwood_music_not", label: "Not important" },
            ],
          },
        ],
      },
      {
        id: "moviestv_regional",
        label: "Regional Cinema",
        icon: "🗺️",
        popularInstructionTags: [
          {
            id: "regional_instr_subtitles",
            label: "Info on subtitle availability",
          },
          {
            id: "regional_instr_original_lang",
            label: "Original language only",
          },
          { id: "regional_instr_remakes", label: "News about remakes" },
        ],
        followUpQuestions: [
          {
            id: "regional_lang",
            text: "Which regional languages are you interested in?",
            predefinedAnswerTags: [
              { id: "lang_tamil", label: "Tamil" },
              { id: "lang_telugu", label: "Telugu" },
              { id: "lang_malayalam", label: "Malayalam" },
              { id: "lang_kannada", label: "Kannada" },
              { id: "lang_bengali", label: "Bengali" },
              { id: "lang_marathi", label: "Marathi" },
            ],
            hasOtherOption: true,
          },
          {
            id: "regional_genres",
            text: "What's your go-to genre in regional cinema?",
            predefinedAnswerTags: [
              { id: "regional_genre_action", label: "Action / Masala" },
              { id: "regional_genre_drama", label: "Drama / Arthouse" },
              { id: "regional_genre_comedy", label: "Comedy" },
              { id: "regional_genre_thriller", label: "Thriller" },
            ],
            hasOtherOption: true,
          },
          {
            id: "regional_favs",
            text: "Any favorite actors or directors I should track for you in regional cinema?",
            hasOtherOption: true,
          },
        ],
      },
      {
        id: "moviestv_tv",
        label: "TV Shows & Series",
        icon: "📺",
        popularInstructionTags: [
          { id: "tv_instr_nospoilers_ep", label: "No episode spoilers" },
          { id: "tv_instr_newseason", label: "Alert for new seasons only" },
          { id: "tv_instr_binge", label: "Suggest binge-worthy shows" },
          { id: "tv_instr_weekly", label: "Reminders for weekly episodes" },
        ],
        followUpQuestions: [
          {
            id: "tv_platforms",
            text: "Which streaming platforms do you use?",
            predefinedAnswerTags: [
              { id: "platform_netflix", label: "Netflix" },
              { id: "platform_prime", label: "Amazon Prime" },
              { id: "platform_disney", label: "Disney+" },
              { id: "platform_hotstar", label: "Hotstar (India)" },
              { id: "platform_sonyliv", label: "SonyLIV (India)" },
            ],
            hasOtherOption: true,
          },
          {
            id: "tv_genres",
            text: "What genre of shows are you into?",
            predefinedAnswerTags: [
              { id: "tv_genre_sitcom", label: "Sitcom" },
              { id: "tv_genre_drama", label: "Drama" },
              { id: "tv_genre_crime", label: "Crime/Thriller" },
              { id: "tv_genre_fantasy", label: "Fantasy/Sci-Fi" },
            ],
            hasOtherOption: true,
          },
          {
            id: "tv_showStatus",
            text: "What's your current watching style?",
            predefinedAnswerTags: [
              {
                id: "tv_style_new",
                label: "Brand new, currently airing shows",
              },
              { id: "tv_style_binge", label: "Completed, binge-worthy series" },
              {
                id: "tv_style_classic",
                label: "Critically-acclaimed classics",
              },
            ],
          },
        ],
      },
      {
        id: "moviestv_docs",
        label: "Documentaries",
        icon: "🌍",
        popularInstructionTags: [
          { id: "docs_instr_deepdive", label: "Prefer deep-dive series" },
          { id: "docs_instr_biography", label: "Biographies are great" },
          {
            id: "docs_instr_investigative",
            label: "Investigative journalism focus",
          },
        ],
        followUpQuestions: [
          {
            id: "docs_topics",
            text: "What documentary topics fascinate you?",
            predefinedAnswerTags: [
              { id: "docs_topic_nature", label: "Nature & Wildlife" },
              { id: "docs_topic_history", label: "History" },
              { id: "docs_topic_crime", label: "True Crime" },
              { id: "docs_topic_science", label: "Science & Tech" },
              { id: "docs_topic_sports", label: "Sports" },
            ],
            hasOtherOption: true,
          },
          {
            id: "docs_format",
            text: "How do you like your documentaries served?",
            predefinedAnswerTags: [
              { id: "docs_format_film", label: "Feature-length films" },
              { id: "docs_format_series", label: "Multi-part docuseries" },
              {
                id: "docs_format_short",
                label: "Short documentaries (< 40 mins)",
              },
            ],
          },
          {
            id: "docs_platforms",
            text: "Where do you usually watch documentaries?",
            predefinedAnswerTags: [
              { id: "docs_platform_netflix", label: "Netflix" },
              { id: "docs_platform_youtube", label: "YouTube" },
              { id: "docs_platform_curiosity", label: "CuriosityStream" },
              { id: "docs_platform_nebula", label: "Nebula" },
            ],
            hasOtherOption: true,
          },
        ],
      },
    ],
  },
  NEWS: {
    id: "news",
    label: "News",
    icon: ICONS.NEWS,
    color: "accent-blue",
    textColor: "text-white",
    subCategories: [
      {
        id: "news_tech",
        label: "Technology",
        icon: "💻",
        followUpQuestions: [
          {
            id: "tech_storyType",
            text: "What kinda tech stories get you hooked lately?",
            predefinedAnswerTags: [
              { id: "tech_story_startups", label: "💡 Startups" },
              { id: "tech_story_ai", label: "🤖 AI & Innovation" },
              { id: "tech_story_gadgets", label: "📱 Gadgets" },
              { id: "tech_story_bigtech", label: "🏢 Big Tech" },
            ],
          },
          {
            id: "tech_side",
            text: "Nice — and which side of tech excites you more?",
            predefinedAnswerTags: [
              { id: "tech_side_consumer", label: "🧑‍💻 Consumer" },
              { id: "tech_side_enterprise", label: "🏭 Enterprise" },
              { id: "tech_side_research", label: "🔬 Research" },
            ],
          },
          {
            id: "tech_vibe",
            text: "When it comes to updates, what’s your vibe?",
            predefinedAnswerTags: [
              { id: "tech_vibe_breaking", label: "⚡ Breaking news" },
              { id: "tech_vibe_deepdives", label: "🧠 Deep dives" },
              { id: "tech_vibe_explainers", label: "😄 Fun explainers" },
            ],
          },
        ],
        popularInstructionTags: [
          { id: "tech_instr_launches", label: "Focus on product launches" },
          { id: "tech_instr_no_funding", label: "Avoid startup funding news" },
          { id: "tech_instr_technical", label: "Include technical deep-dives" },
          {
            id: "tech_instr_major_only",
            label: "Major companies only (Apple, etc.)",
          },
        ],
      },
      {
        id: "news_finance",
        label: "Business & Finance",
        icon: "💹",
        followUpQuestions: [
          {
            id: "finance_storyType",
            text: "What business stories grab your attention?",
            predefinedAnswerTags: [
              { id: "finance_story_startups", label: "🚀 Startups" },
              { id: "finance_story_global", label: "🌍 Global markets" },
              { id: "finance_story_corps", label: "🏢 Big corporates" },
              { id: "finance_story_personal", label: "💰 Personal finance" },
            ],
          },
          {
            id: "finance_insights",
            text: "Cool — and what kind of insights do you enjoy most?",
            predefinedAnswerTags: [
              { id: "finance_insights_trends", label: "📊 Daily trends" },
              { id: "finance_insights_expert", label: "💡 Expert takes" },
              { id: "finance_insights_founder", label: "🧑‍💼 Founder stories" },
            ],
          },
          {
            id: "finance_sectors",
            text: "Any sectors you’d love me to keep an eye on?",
            predefinedAnswerTags: [
              { id: "finance_sector_tech", label: "💻 Tech" },
              { id: "finance_sector_finance", label: "🏦 Finance" },
              { id: "finance_sector_fmcg", label: "🍔 FMCG" },
              { id: "finance_sector_energy", label: "🔋 Energy" },
              { id: "finance_sector_auto", label: "🚗 Auto" },
            ],
          },
        ],
        popularInstructionTags: [
          {
            id: "finance_instr_local_market",
            label: "Focus on my country's market",
          },
          { id: "finance_instr_no_crypto", label: "No crypto news" },
          { id: "finance_instr_tickers", label: "Include stock tickers" },
          { id: "finance_instr_ceo", label: "CEO interviews" },
        ],
      },
      {
        id: "news_world",
        label: "World Affairs",
        icon: "🌍",
        followUpQuestions: [
          {
            id: "world_region",
            text: "What part of the world do you track the most?",
            predefinedAnswerTags: [
              { id: "world_region_sa", label: "🇮🇳 South Asia" },
              { id: "world_region_us", label: "🇺🇸 US" },
              { id: "world_region_eu", label: "🇪🇺 Europe" },
              { id: "world_region_global", label: "🌍 Global mix" },
            ],
          },
          {
            id: "world_updateType",
            text: "What kind of world updates interest you?",
            predefinedAnswerTags: [
              { id: "world_update_geopolitics", label: "⚔️ Geopolitics" },
              { id: "world_update_economy", label: "💱 Economy" },
              { id: "world_update_diplomacy", label: "🕊️ Diplomacy" },
              { id: "world_update_conflicts", label: "🔥 Conflicts" },
            ],
          },
          {
            id: "world_depth",
            text: "You like your news…",
            predefinedAnswerTags: [
              { id: "world_depth_quick", label: "📰 Quick & sharp" },
              { id: "world_depth_deep", label: "🧩 Detailed & deep" },
            ],
          },
        ],
        popularInstructionTags: [
          { id: "world_instr_diplomacy", label: "Focus on diplomacy" },
          {
            id: "world_instr_no_graphic",
            label: "No graphic conflict reports",
          },
          { id: "world_instr_context", label: "Include historical context" },
          { id: "world_instr_trade", label: "Summarize trade agreements" },
        ],
      },
      {
        id: "news_science",
        label: "Science",
        icon: "🔬",
        followUpQuestions: [
          {
            id: "sci_topic",
            text: "What kinda science stuff fascinates you most?",
            predefinedAnswerTags: [
              { id: "sci_topic_space", label: "🚀 Space" },
              { id: "sci_topic_bio", label: "🧬 Biology" },
              { id: "sci_topic_physics", label: "⚡ Physics" },
              { id: "sci_topic_env", label: "🌱 Environment" },
            ],
          },
          {
            id: "sci_depth",
            text: "How deep should we go with updates?",
            predefinedAnswerTags: [
              { id: "sci_depth_simple", label: "💬 Simple" },
              { id: "sci_depth_medium", label: "🧠 Medium" },
              { id: "sci_depth_research", label: "🔬 Research-level" },
            ],
          },
          {
            id: "sci_storyType",
            text: "What stories spark your curiosity?",
            predefinedAnswerTags: [
              { id: "sci_story_discoveries", label: "🧪 Discoveries" },
              { id: "sci_story_experiments", label: "🧤 Experiments" },
              { id: "sci_story_debates", label: "💭 Debates" },
            ],
          },
        ],
        popularInstructionTags: [
          { id: "sci_instr_eli5", label: "Explain for non-experts" },
          { id: "sci_instr_papers", label: "Link to research papers" },
          {
            id: "sci_instr_positive_breakthroughs",
            label: "Focus on breakthroughs",
          },
          { id: "sci_instr_no_pseudoscience", label: "No pseudoscience" },
        ],
      },
      {
        id: "news_health",
        label: "Health & Wellness",
        icon: "⚕️",
        followUpQuestions: [
          {
            id: "health_updateType",
            text: "What kinda health updates do you want from me?",
            predefinedAnswerTags: [
              { id: "health_update_nutrition", label: "🥗 Nutrition" },
              { id: "health_update_mental", label: "🧘 Mental health" },
              { id: "health_update_fitness", label: "🏋️ Fitness" },
              { id: "health_update_research", label: "💉 Research" },
            ],
          },
          {
            id: "health_contentStyle",
            text: "How do you like your health content?",
            predefinedAnswerTags: [
              { id: "health_content_lifestyle", label: "🌿 Lifestyle tips" },
              { id: "health_content_studies", label: "📚 Studies & data" },
              { id: "health_content_mix", label: "⚖️ Balanced mix" },
            ],
          },
          {
            id: "health_tone",
            text: "What tone keeps you motivated?",
            predefinedAnswerTags: [
              { id: "health_tone_uplifting", label: "💪 Uplifting" },
              { id: "health_tone_edu", label: "🧠 Educational" },
              { id: "health_tone_analytical", label: "🧾 Analytical" },
            ],
          },
        ],
        popularInstructionTags: [
          { id: "health_instr_actionable", label: "Provide actionable tips" },
          { id: "health_instr_sources", label: "Cite scientific sources" },
          {
            id: "health_instr_mental_focus",
            label: "Prioritize mental health",
          },
          { id: "health_instr_no_fads", label: "No diet fads" },
        ],
      },
      {
        id: "news_politics",
        label: "Politics",
        icon: "🏛️",
        followUpQuestions: [
          {
            id: "politics_space",
            text: "Which political space do you follow closely?",
            predefinedAnswerTags: [
              { id: "politics_space_national", label: "🇮🇳 National" },
              { id: "politics_space_state", label: "🏙️ State" },
              { id: "politics_space_global", label: "🌍 Global" },
            ],
          },
          {
            id: "politics_attention",
            text: "What catches your attention most?",
            predefinedAnswerTags: [
              { id: "politics_attention_policy", label: "📜 Policy moves" },
              { id: "politics_attention_elections", label: "🗳️ Elections" },
              {
                id: "politics_attention_strategy",
                label: "🧩 Strategy & power plays",
              },
            ],
          },
          {
            id: "politics_tone",
            text: "What tone do you prefer?",
            predefinedAnswerTags: [
              { id: "politics_tone_neutral", label: "⚖️ Neutral" },
              { id: "politics_tone_analytical", label: "🧠 Analytical" },
              { id: "politics_tone_witty", label: "😏 Witty & sharp" },
            ],
          },
        ],
        popularInstructionTags: [
          {
            id: "politics_instr_policy_analysis",
            label: "Focus on policy analysis",
          },
          { id: "politics_instr_no_opinion", label: "Avoid opinion pieces" },
          {
            id: "politics_instr_local_elections",
            label: "Cover local-level elections",
          },
          {
            id: "politics_instr_explain_process",
            label: "Explain legislative process",
          },
        ],
      },
      {
        id: "news_environment",
        label: "Environment",
        icon: "🌳",
        followUpQuestions: [
          {
            id: "env_storyType",
            text: "What kinda green stories interest you most?",
            predefinedAnswerTags: [
              { id: "env_story_climate", label: "🌎 Climate change" },
              { id: "env_story_conservation", label: "🌳 Conservation" },
              { id: "env_story_energy", label: "🔋 Clean energy" },
              { id: "env_story_pollution", label: "🚯 Pollution" },
            ],
          },
          {
            id: "env_angle",
            text: "What angle would you like more of?",
            predefinedAnswerTags: [
              { id: "env_angle_crises", label: "🆘 Global crises" },
              { id: "env_angle_local", label: "🏡 Local action" },
              { id: "env_angle_innovation", label: "💡 Innovation & fixes" },
            ],
          },
          {
            id: "env_hope",
            text: "What gives you hope in this space?",
            predefinedAnswerTags: [
              { id: "env_hope_tech", label: "🚀 New tech" },
              { id: "env_hope_activism", label: "✊ Activism" },
              { id: "env_hope_grassroots", label: "🌾 Grassroots efforts" },
            ],
          },
        ],
        popularInstructionTags: [
          { id: "env_instr_solutions", label: "Focus on solutions" },
          { id: "env_instr_data", label: "Include data & statistics" },
          {
            id: "env_instr_local_conservation",
            label: "Cover local conservation",
          },
          { id: "env_instr_green_tech", label: "Highlight green tech" },
        ],
      },
      {
        id: "news_education",
        label: "Education",
        icon: "🎓",
        followUpQuestions: [
          {
            id: "edu_updateType",
            text: "What type of education updates should I send?",
            predefinedAnswerTags: [
              { id: "edu_update_edtech", label: "💻 Edtech" },
              { id: "edu_update_policy", label: "📚 Policy & exams" },
              { id: "edu_update_careers", label: "💼 Careers" },
              { id: "edu_update_highered", label: "🎓 Higher ed" },
            ],
          },
          {
            id: "edu_role",
            text: "Just curious — which one describes you best?",
            predefinedAnswerTags: [
              { id: "edu_role_student", label: "👩‍🎓 Student" },
              { id: "edu_role_parent", label: "👩‍👩‍👧 Parent" },
              { id: "edu_role_teacher", label: "👩‍🏫 Teacher" },
              { id: "edu_role_professional", label: "👨‍💼 Professional" },
            ],
          },
          {
            id: "edu_storyType",
            text: "What kind of stories inspire you most?",
            predefinedAnswerTags: [
              { id: "edu_story_success", label: "🌟 Success stories" },
              { id: "edu_story_trends", label: "📊 Trends" },
              { id: "edu_story_skills", label: "🛠️ Skill-building insights" },
            ],
          },
        ],
        popularInstructionTags: [
          {
            id: "edu_instr_higher_ed_policy",
            label: "Focus on higher-ed policy",
          },
          { id: "edu_instr_no_exam_stress", label: "No exam stress articles" },
          { id: "edu_instr_edtech_startups", label: "Include EdTech startups" },
          { id: "edu_instr_skill_focus", label: "Focus on skill development" },
        ],
      },
      {
        id: "news_local",
        label: "Local News",
        icon: "🏘️",
        followUpQuestions: [
          {
            id: "local_updateType",
            text: "What local updates do you care about most?",
            predefinedAnswerTags: [
              { id: "local_update_city", label: "🏙️ City issues" },
              { id: "local_update_culture", label: "🎭 Culture & events" },
              { id: "local_update_openings", label: "🏪 New openings" },
              { id: "local_update_safety", label: "🚨 Safety alerts" },
            ],
          },
          {
            id: "local_focus",
            text: "Where should I focus the updates?",
            predefinedAnswerTags: [
              { id: "local_focus_city", label: "📍 My city" },
              { id: "local_focus_state", label: "🗺️ My state" },
              { id: "local_focus_region", label: "🧭 Nearby region" },
            ],
          },
          {
            id: "local_tone",
            text: "What tone works best for you?",
            predefinedAnswerTags: [
              { id: "local_tone_info", label: "📢 Informative" },
              { id: "local_tone_actionable", label: "🧭 Actionable" },
              { id: "local_tone_feelgood", label: "❤️ Feel-good" },
            ],
          },
        ],
        popularInstructionTags: [
          {
            id: "local_instr_my_neighborhood",
            label: "Focus on my neighborhood",
          },
          { id: "local_instr_weekend", label: "Include weekend events" },
          { id: "local_instr_no_crime", label: "No crime reports" },
          { id: "local_instr_restaurants", label: "New restaurant openings" },
        ],
      },
    ],
  },
  YOUTUBE: {
    id: "youtube",
    label: "YouTube",
    icon: ICONS.YOUTUBE,
    color: "accent-pink",
    textColor: "text-white",
    popularInstructionTags: [
      { id: "yt_instr_under15", label: "Only videos under 15 mins" },
      { id: "yt_instr_educational", label: "Prioritize educational content" },
      { id: "yt_instr_noclickbait", label: "Avoid clickbait-style titles" },
      {
        id: "yt_instr_channeldigest",
        label: "Daily digest for subscribed channels",
      },
      { id: "yt_instr_highproduction", label: "Prefer high production value" },
      { id: "yt_instr_shortsok", label: "Shorts & Livestreams are OK" },
      {
        id: "yt_instr_notranscripts",
        label: "Include transcripts if available",
      },
    ],
    followUpQuestions: [
      {
        id: "yt_channels",
        text: "To start, which channels or creators are your must-watches? (e.g., MKBHD, MrBeast)",
        hasOtherOption: true,
      },
      {
        id: "yt_topics",
        text: "And what topics do you generally enjoy on YouTube?",
        predefinedAnswerTags: [
          { id: "yt_topic_coding", label: "Coding Tutorials" },
          { id: "yt_topic_gaming", label: "Gaming" },
          { id: "yt_topic_cooking", label: "Cooking Shows" },
          { id: "yt_topic_science", label: "Science Explainers" },
          { id: "yt_topic_music", label: "Music" },
          { id: "yt_topic_podcasts", label: "Video Podcasts" },
          { id: "yt_topic_reviews", label: "Product Reviews" },
          { id: "yt_topic_travel", label: "Travel Vlogs" },
        ],
        hasOtherOption: true,
      },
      {
        id: "yt_duration",
        text: "What is your preferred video length?",
        isSingleSelect: true,
        predefinedAnswerTags: [
          { id: "yt_dur_short", label: "< 5 minutes" },
          { id: "yt_dur_medium", label: "5-15 minutes" },
          { id: "yt_dur_long", label: "15-30 minutes" },
          { id: "yt_dur_any", label: "> 30 minutes / Any" },
        ],
      },
      {
        id: "creatorInteraction",
        text: "Are you interested in creator updates beyond just new videos?",
        predefinedAnswerTags: [
          { id: "creator_community", label: "Community Posts" },
          { id: "creator_live", label: "Live Streams" },
          { id: "creator_shorts", label: "YouTube Shorts" },
          { id: "creator_noextra", label: "Just the main videos" },
        ],
      },
    ],
  },
  CUSTOM: {
    id: "custom",
    label: "Custom",
    icon: ICONS.CUSTOM,
    color: "accent-teal",
    textColor: "text-white",
    tags: [
      { id: "custom_pop_local", label: "Local Events (My Area)" },
      { id: "custom_pop_books", label: "Book Summaries" },
      { id: "custom_pop_recipes", label: "New Recipes Weekly" },
      { id: "custom_pop_deals", label: "Tech Deals/Sales" },
      { id: "custom_pop_history", label: "Daily History Fact" },
      {
        id: "custom_pop_language",
        label: "Word of the Day (Language Learning)",
      },
      { id: "custom_pop_quotes", label: "Motivational Quotes" },
      {
        id: "custom_pop_stock",
        label: "Stock Market Movers (Specific Stocks)",
      },
    ],
  },
};
