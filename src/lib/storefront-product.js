import { PRODUCTS as POPULAR_PRODUCTS } from "@/components/home/popularPicksData";
import { DEAL_PRODUCTS } from "@/components/home/dealsOfTheWeekData";
import { ALL_SHOP_PRODUCTS } from "@/components/shop-all/shopAllData";

const CATEGORY_LABEL = {
  living: "Living room",
  bedroom: "Bedroom",
  bathroom: "Bathroom",
  dining: "Dining room",
};

const ROOM_LABEL_LOOKUP = Object.fromEntries(
  [
    ["living", "Living room"],
    ["bedroom", "Bedroom"],
    ["bathroom", "Bathroom"],
    ["office", "Office"],
    ["garden", "Garden"],
  ]
);

const TYPE_LABEL_LOOKUP = {
  sofas: "Sofas",
  chairs: "Chairs",
  tables: "Tables",
  towels: "Towels",
  storage: "Storage",
  lighting: "Lighting",
  rugs: "Rugs",
  beds: "Beds",
  decorative: "Decorative",
  "outdoor-furniture": "Outdoor",
};

export function galleryForPrimaryImage(primary) {
  const pool = [...new Set(DEAL_PRODUCTS.map((d) => d.image))];
  const rest = pool.filter((img) => img !== primary).slice(0, 3);
  return [primary, ...rest.slice(0, 2)].filter(Boolean).slice(0, 3);
}

function middleCategoryFromName(name) {
  const n = name.toLowerCase();
  if (n.includes("table")) return "Tables";
  if (n.includes("sofa") || n.includes("couch")) return "Sofas";
  if (n.includes("console")) return "Storage";
  if (n.includes("chair")) return "Chairs";
  return "Furniture";
}

function stockFromSlug(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return 8 + (h % 40);
}

const DESCRIPTION_FALLBACK =
  "Handcrafted with a solid hardwood frame and premium upholstery, built for lasting comfort.";

export function buildPdpFromShop(p) {
  const roomLabel =
    ROOM_LABEL_LOOKUP[p.room] ?? CATEGORY_LABEL[p.room] ?? "Living room";
  const mid =
    TYPE_LABEL_LOOKUP[p.productType] ??
    (p.productType
      ? p.productType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "Furniture");

  return {
    slug: p.slug,
    source: "shop",
    id: p.id,
    name: p.name,
    image: p.image,
    gallery: galleryForPrimaryImage(p.image),
    price: p.price,
    compareAt: p.compareAt,
    discount: p.discount,
    reviews: p.reviews,
    stockQty: stockFromSlug(p.slug),
    description: DESCRIPTION_FALLBACK,
    materialBlurb:
      "Frame: solid oak wood. Upholstery: high-performance 100% polyester blend. Assembly required — tools included.",
    specs: [
      { label: "Dimensions", value: "84\" W × 36\" D × 32\" H" },
      { label: "Seat height", value: "18\"" },
      { label: "Weight capacity", value: "750 lbs" },
      { label: "Materials", value: "Solid oak frame, pocket springs, premium fabric" },
      { label: "Assembly", value: "Moderate (2 people, ~45 min)" },
    ],
    breadcrumbs: [
      { label: roomLabel, href: "/shop-all" },
      { label: mid, href: "/shop-all" },
      { label: p.name, href: null },
    ],
    colorOptions: [
      { id: "cream", label: "Cream", thumb: p.image, swatch: "#e8ddd4" },
      { id: "charcoal", label: "Charcoal", thumb: "/pick-2.png", swatch: "#3d4540" },
    ],
  };
}

export function buildPdpFromPopular(p) {
  const room = CATEGORY_LABEL[p.category] ?? "Living room";
  return {
    slug: p.slug,
    source: "popular",
    id: p.id,
    name: p.name,
    image: p.image,
    gallery: galleryForPrimaryImage(p.image),
    price: p.price,
    compareAt: p.compareAt,
    discount: p.discount,
    reviews: p.reviews,
    stockQty: stockFromSlug(p.slug),
    description: DESCRIPTION_FALLBACK,
    materialBlurb:
      "Frame: solid oak wood. Upholstery: high-performance 100% polyester blend. Assembly required — tools included.",
    specs: [
      { label: "Dimensions", value: "84\" W × 36\" D × 32\" H" },
      { label: "Seat height", value: "18\"" },
      { label: "Weight capacity", value: "750 lbs" },
      { label: "Materials", value: "Solid oak frame, pocket springs, premium fabric" },
      { label: "Assembly", value: "Moderate (2 people, ~45 min)" },
    ],
    breadcrumbs: [
      { label: room, href: "/shop-all" },
      { label: middleCategoryFromName(p.name), href: "/shop-all" },
      { label: p.name, href: null },
    ],
    colorOptions: [
      { id: "cream", label: "Cream", thumb: p.image, swatch: "#e8ddd4" },
      { id: "charcoal", label: "Charcoal", thumb: "/pick-2.png", swatch: "#3d4540" },
    ],
  };
}

export function buildPdpFromDeal(p) {
  return {
    slug: p.id,
    source: "deal",
    id: p.id,
    name: p.name,
    image: p.image,
    gallery: galleryForPrimaryImage(p.image),
    price: p.price,
    compareAt: p.compareAt,
    discount: p.discount,
    reviews: p.reviews,
    stockQty: stockFromSlug(p.id),
    description: DESCRIPTION_FALLBACK,
    materialBlurb:
      "Frame: solid oak wood. Upholstery: high-performance 100% polyester blend. Assembly required — tools included.",
    specs: [
      { label: "Dimensions", value: "84\" W × 36\" D × 32\" H" },
      { label: "Seat height", value: "18\"" },
      { label: "Weight capacity", value: "750 lbs" },
      { label: "Materials", value: "Solid oak frame, pocket springs, premium fabric" },
      { label: "Assembly", value: "Moderate (2 people, ~45 min)" },
    ],
    breadcrumbs: [
      { label: "Living room", href: "/shop-all" },
      { label: middleCategoryFromName(p.name), href: "/shop-all" },
      { label: p.name, href: null },
    ],
    colorOptions: [
      { id: "cream", label: "Cream", thumb: p.image, swatch: "#e8ddd4" },
      { id: "charcoal", label: "Charcoal", thumb: "/pick-2.png", swatch: "#3d4540" },
    ],
  };
}

export function resolveStorefrontProduct(slug) {
  const shop = ALL_SHOP_PRODUCTS.find((x) => x.slug === slug);
  if (shop) return buildPdpFromShop(shop);

  const pop = POPULAR_PRODUCTS.find((x) => x.slug === slug);
  if (pop) return buildPdpFromPopular(pop);

  const deal = DEAL_PRODUCTS.find((x) => x.id === slug);
  if (deal) return buildPdpFromDeal(deal);

  return null;
}
