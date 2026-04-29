import { DEAL_PRODUCTS } from "@/components/home/dealsOfTheWeekData";

/** @typedef {{ id: string; label: string }} FilterOption */

/** @type {FilterOption[]} */
export const ROOM_OPTIONS = [
  { id: "bedroom", label: "Bedroom" },
  { id: "bathroom", label: "Bathroom" },
  { id: "living", label: "Living room" },
  { id: "office", label: "Office" },
  { id: "garden", label: "Garden" },
  { id: "laundry", label: "Laundry" },
  { id: "kids", label: "Kids room" },
  { id: "outdoor", label: "Outdoor" },
  { id: "entry", label: "Entryway" },
  { id: "dining", label: "Dining room" },
];

/** @type {FilterOption[]} */
export const PRODUCT_TYPE_OPTIONS = [
  { id: "sofas", label: "Sofas" },
  { id: "chairs", label: "Chairs" },
  { id: "tables", label: "Tables" },
  { id: "towels", label: "Towels" },
  { id: "storage", label: "Storage" },
  { id: "lighting", label: "Lighting" },
  { id: "rugs", label: "Rugs" },
  { id: "beds", label: "Beds" },
  { id: "decorative", label: "Decorative" },
  { id: "outdoor-furniture", label: "Outdoor furniture" },
];

/** @type {{ id: string; label: string; swatch: string }[]} */
export const COLOR_OPTIONS = [
  { id: "cream", label: "Cream", swatch: "#e8ddd4" },
  { id: "charcoal", label: "Charcoal gray", swatch: "#3d4540" },
  { id: "soft-gray", label: "Soft gray", swatch: "#c9c8c4" },
  { id: "olive", label: "Olive green", swatch: "#4a5c45" },
  { id: "navy", label: "Navy blue", swatch: "#2c3e50" },
  { id: "terracotta", label: "Terracotta", swatch: "#c67b5c" },
  { id: "black", label: "Black", swatch: "#1a1a1a" },
  { id: "white", label: "White", swatch: "#f5f5f5" },
  { id: "walnut", label: "Walnut", swatch: "#5c4033" },
  { id: "sage", label: "Sage", swatch: "#9caa98" },
];

export const PRICE_MIN = 8;
export const PRICE_MAX = 590;

export const SORT_OPTIONS = [
  { id: "best", label: "Best sellers" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "reviews", label: "Most reviews" },
];

const ROOM_IDS = ROOM_OPTIONS.map((r) => r.id);
const TYPE_IDS = PRODUCT_TYPE_OPTIONS.map((t) => t.id);
const COLOR_IDS = COLOR_OPTIONS.map((c) => c.id);
const ratings = [5, 4, 4.5, 3, 3.5, 4, 5, 2, 5, 4];

/**
 * Deterministic catalogue (~100 items) with filter facets for the shop-all UI.
 */
export function buildShopAllProducts(count = 100) {
  return Array.from({ length: count }, (_, i) => {
    const base = DEAL_PRODUCTS[i % DEAL_PRODUCTS.length];
    const room = ROOM_IDS[i % ROOM_IDS.length];
    const productType = TYPE_IDS[i % TYPE_IDS.length];
    const color = COLOR_IDS[i % COLOR_IDS.length];
    const spread = Math.floor(i / DEAL_PRODUCTS.length);
    const notRated = i % 31 === 0;
    const ratingAvg = notRated ? 0 : ratings[i % ratings.length];
    const price = Math.round(
      Math.min(
        PRICE_MAX - 10,
        Math.max(PRICE_MIN, base.price * 0.85 + spread * 12 + (i % 7) * 15)
      ) * 100
    ) / 100;
    const compareAt = Math.round(price * (1.1 + (i % 5) * 0.02) * 100) / 100;
    const discount = Math.min(50, Math.max(5, 10 + (i % 8)));
    const reviews = notRated ? 0 : 8 + ((i * 17) % 190);

    return {
      id: `shop-${i + 1}`,
      slug: `${base.id}-${i + 1}`,
      name: base.name,
      image: base.image,
      price,
      compareAt,
      discount,
      reviews,
      ratingAvg,
      room,
      productType,
      color,
    };
  });
}

export const ALL_SHOP_PRODUCTS = buildShopAllProducts(100);
