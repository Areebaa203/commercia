import { notFound } from "next/navigation";
import ProductDetailView from "@/components/products/ProductDetailView";
import { resolveStorefrontProduct } from "@/lib/storefront-product";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = resolveStorefrontProduct(slug);
  return {
    title: p ? `${p.name} · Haven` : "Product",
    description: p ? `Shop ${p.name} at Haven.` : undefined,
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = resolveStorefrontProduct(slug);
  if (!product) notFound();
  return <ProductDetailView product={product} />;
}
