/** @typedef {{ id: string; label: string }} JournalCategory */

/** @type {JournalCategory[]} */
export const JOURNAL_FILTER_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "design-tips", label: "Design Tips" },
  { id: "buying-guide", label: "Buying Guide" },
  { id: "room-ideas", label: "Room Ideas" },
  { id: "styling", label: "Styling" },
];

/**
 * Listing posts (hero carousel uses separate ids in journalHeroData).
 * Images live under /public.
 */
export const JOURNAL_LISTING_POSTS = [
  ...Array.from({ length: 11 }).flatMap((_, i) => [
    {
      slug: `post-1-${i}`,
      categoryId: "design-tips",
      categoryLabel: "Design Tips",
      readMinutes: 5,
      title: "5 ways to make a small living room feel bigger",
      excerpt: "Limited space doesn't mean limited style. Layer mirrors, smarter seating, and vertical lines so every inch feels intentional.",
      image: "/journal-img-1.jpg",
    },
    {
      slug: `post-2-${i}`,
      categoryId: "styling",
      categoryLabel: "Styling",
      readMinutes: 7,
      title: "How to choose the right sofa for your space",
      excerpt: "Measurements, cushion fill, arm height, and fabric—we walk through what actually matters before you commit.",
      image: "/journal-img-2.jpg",
    },
    {
      slug: `post-3-${i}`,
      categoryId: "room-ideas",
      categoryLabel: "Room Ideas",
      readMinutes: 6,
      title: "The essential furniture pieces every home needs",
      excerpt: "Start with a flexible foundation: seating you love, surfaces that multitask, and storage that disappears into the room.",
      image: "/journal-img-3.jpg",
    },
    {
      slug: `post-4-${i}`,
      categoryId: "room-ideas",
      categoryLabel: "Room Ideas",
      readMinutes: 4,
      title: "Creating a cozy bedroom retreat",
      excerpt: "Warm layers, bedside glow, and clutter-free surfaces turn your bedroom into the calmest room in the house.",
      image: "/journal-img-4.jpg",
    },
    {
      slug: `post-5-${i}`,
      categoryId: "styling",
      categoryLabel: "Styling",
      readMinutes: 5,
      title: "Coffee table styling tips from designers",
      excerpt: "Rule of three, varied heights, and one sculptural moment—keep everyday objects feeling curated, not cluttered.",
      image: "/journal-img-5.jpg",
    },
    {
      slug: `post-6-${i}`,
      categoryId: "buying-guide",
      categoryLabel: "Buying Guide",
      readMinutes: 8,
      title: "How to care for solid wood furniture",
      excerpt: "Humidity, coasters, and gentle cleaners extend the life of tables and case goods without fussy routines.",
      image: "/journal-img-6.jpg",
    },
    {
      slug: `post-7-${i}`,
      categoryId: "design-tips",
      categoryLabel: "Design Tips",
      readMinutes: 5,
      title: "Entryway ideas that make a strong first impression",
      excerpt: "A slim console, mirror bounce, and concealed shoe storage keep arrivals polished even on busy weekdays.",
      image: "/journal-img-7.jpg",
    },
    {
      slug: `post-8-${i}`,
      categoryId: "buying-guide",
      categoryLabel: "Buying Guide",
      readMinutes: 9,
      title: "Sofa vs. sectional: Which fits your layout?",
      excerpt: "Traffic paths, chaise direction, and scale—we compare silhouettes so your living room breathes.",
      image: "/journal-img-8.jpg",
    },
    {
      slug: `post-9-${i}`,
      categoryId: "buying-guide",
      categoryLabel: "Buying Guide",
      readMinutes: 7,
      title: "Sustainable furniture choices that still feel luxurious",
      excerpt: "Certified wood, durable upholstery, and timeless silhouettes reduce turnover without sacrificing warmth.",
      image: "/journal-img-9.jpg",
    },
  ]),
];

export const JOURNAL_POSTS_PER_PAGE = 9;
