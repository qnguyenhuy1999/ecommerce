import * as React from "react";
import { cn } from "@ecom/ui";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  badge?: React.ReactNode;
}

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (id: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

const ProductGrid = React.forwardRef<HTMLDivElement, ProductGridProps>(
  (
    { products, onAddToCart, loading, emptyMessage = "No products found.", className },
    ref
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
            className
          )}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCard
              key={i}
              id=""
              image=""
              title=""
              price={0}
              loading
            />
          ))}
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-center py-16 text-muted-foreground",
            className
          )}
        >
          <p className="text-sm">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
          className
        )}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.image}
            title={product.title}
            price={product.price}
            originalPrice={product.originalPrice}
            badge={product.badge}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    );
  }
);
ProductGrid.displayName = "ProductGrid";

export { ProductGrid };
export type { ProductGridProps, Product };