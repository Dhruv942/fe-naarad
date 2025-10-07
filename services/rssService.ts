// RSS Feed Service
// Fetches and parses RSS feeds for different categories

export interface RSSFeedItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  category?: string;
  imageUrl?: string;
}

// Simple in-memory cache with 5-minute expiry
interface CacheEntry {
  data: RSSFeedItem[];
  timestamp: number;
}

const RSS_CACHE: Map<string, CacheEntry> = new Map();
const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

export const CATEGORY_RSS_FEEDS: Record<string, string[]> = {
  sports: [
    "https://www.thehindu.com/sport/feeder/default.rss",
    "https://www.thehindu.com/sport/football/feeder/default.rss",
    "https://feeds.bbci.co.uk/sport/rss.xml",
    "https://rss.cnn.com/rss/edition_sport.rss",
  ],
  news: [
    "https://www.thehindu.com/news/feeder/default.rss",
    "https://rss.cnn.com/rss/edition.rss",
    "https://feeds.reuters.com/reuters/topNews",
  ],
  moviesTV: [
    "https://www.thehindu.com/entertainment/movies/feeder/default.rss",
    "https://variety.com/feed/",
    "https://feeds.feedburner.com/TheMovieBlog",
  ],
  technology: [
    "https://feeds.feedburner.com/TechCrunch",
    "https://rss.cnn.com/rss/edition_technology.rss",
    "https://feeds.reuters.com/reuters/technologyNews",
  ],
};

/**
 * Parse RSS XML to extract feed items
 */
const parseRSSXML = (xmlText: string): RSSFeedItem[] => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    const items = xmlDoc.querySelectorAll("item");
    const feedItems: RSSFeedItem[] = [];

    items.forEach((item) => {
      const title = item.querySelector("title")?.textContent || "";
      const description = item.querySelector("description")?.textContent || "";
      const link = item.querySelector("link")?.textContent || "";
      const pubDate = item.querySelector("pubDate")?.textContent || "";
      const category = item.querySelector("category")?.textContent || "";

      // Try to extract image from different RSS formats
      let imageUrl =
        item.querySelector("enclosure")?.getAttribute("url") ||
        item.querySelector("media\\:thumbnail")?.getAttribute("url") ||
        item.querySelector("media\\:content")?.getAttribute("url") ||
        item.getElementsByTagNameNS("http://search.yahoo.com/mrss/", "thumbnail")[0]?.getAttribute("url") ||
        item.getElementsByTagNameNS("http://search.yahoo.com/mrss/", "content")[0]?.getAttribute("url") ||
        undefined;

      // If no image found, try to extract from description HTML
      if (!imageUrl && description) {
        const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (imgMatch) {
          imageUrl = imgMatch[1];
        }
      }

      if (title) {
        feedItems.push({
          title,
          description: description.replace(/<[^>]*>/g, "").substring(0, 300), // Strip HTML and limit
          link,
          pubDate,
          category,
          imageUrl,
        });
      }
    });

    return feedItems;
  } catch (error) {
    console.error("Error parsing RSS XML:", error);
    return [];
  }
};

/**
 * Fetch RSS feed from a single URL using AllOrigins CORS proxy
 */
const fetchSingleRSSFeed = async (
  feedUrl: string
): Promise<RSSFeedItem[]> => {
  try {
    console.log("🔗 Fetching RSS feed:", feedUrl);

    // Use AllOrigins CORS proxy
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;

    const response = await fetch(proxyUrl);

    if (!response.ok) {
      console.warn(`⚠️ Failed to fetch RSS feed: ${feedUrl}`);
      return [];
    }

    const data = await response.json();

    if (!data.contents) {
      console.warn(`⚠️ No content received for ${feedUrl}`);
      return [];
    }

    const feedItems = parseRSSXML(data.contents);
    console.log(`✅ Fetched ${feedItems.length} items from ${feedUrl}`);

    // Limit to 10 items per feed
    return feedItems.slice(0, 10);
  } catch (error) {
    console.error(`❌ Error fetching RSS feed ${feedUrl}:`, error);
    return [];
  }
};

/**
 * Fetch RSS feeds for specific categories with caching
 */
export const fetchRSSFeedsByCategories = async (
  categories: string[]
): Promise<RSSFeedItem[]> => {
  const cacheKey = categories.sort().join(',');

  // Check cache first
  const cached = RSS_CACHE.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_EXPIRY_MS) {
    console.log(`✅ Using cached RSS feeds for: ${cacheKey}`);
    return cached.data;
  }

  console.log("📡 Fetching RSS feeds for categories:", categories);

  const allFeedUrls: string[] = [];

  // Collect all feed URLs for the specified categories
  categories.forEach((category) => {
    const categoryKey = category.toLowerCase();
    if (CATEGORY_RSS_FEEDS[categoryKey]) {
      allFeedUrls.push(...CATEGORY_RSS_FEEDS[categoryKey]);
    }
  });

  if (allFeedUrls.length === 0) {
    console.warn("⚠️ No RSS feeds found for categories:", categories);
    return [];
  }

  // Fetch all feeds in parallel
  const feedPromises = allFeedUrls.map((url) => fetchSingleRSSFeed(url));
  const feedResults = await Promise.all(feedPromises);

  // Flatten and combine all feed items
  const allItems = feedResults.flat();

  // Cache the results
  RSS_CACHE.set(cacheKey, {
    data: allItems,
    timestamp: Date.now()
  });

  console.log(`✅ Total RSS items fetched: ${allItems.length}`);
  return allItems;
};

/**
 * Get recent RSS feed items (limit to latest N items)
 */
export const getRecentRSSItems = (
  items: RSSFeedItem[],
  limit: number = 10
): RSSFeedItem[] => {
  // Sort by publication date (most recent first)
  const sortedItems = items.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime();
    const dateB = new Date(b.pubDate).getTime();
    return dateB - dateA; // Descending order
  });

  return sortedItems.slice(0, limit);
};
