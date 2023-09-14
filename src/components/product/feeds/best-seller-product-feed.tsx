import type { FC } from 'react';
import ProductsCarousel from '@components/product/products-carousel';
import { LIMITS } from '@framework/utils/limits';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { ROUTES } from '@utils/routes';

interface ProductFeedProps {
  className?: string;
  products: PricedProduct[]
}

const BestSellerProductFeed: FC<ProductFeedProps> = ({ className, products }) => {
  return (
    <ProductsCarousel
      sectionHeading="text-best-sellers"
      categorySlug={ROUTES.PRODUCTS}
      products={products}
      loading={false}
      error={""}
      limit={LIMITS.BEST_SELLER_PRODUCTS_LIMITS}
      uniqueKey="best-sellers"
      className = "mb-8"
    />
  );
}

export default BestSellerProductFeed