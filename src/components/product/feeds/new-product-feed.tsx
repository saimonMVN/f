import type { FC } from 'react';
import ProductsListBlock from '../products-list-four';
import { LIMITS } from '@framework/utils/limits';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';

interface ProductFeedProps {
  className?: string;
  products: PricedProduct[]
}

const NewProductFeed: FC<ProductFeedProps> = ({ className, products }) => {
  return (
    <ProductsListBlock
      sectionHeading="text-new-arrival"
      className={className}
      products={products}
      loading={false}
      error={""}
      limit={LIMITS.NEW_ARRIVAL_PRODUCTS_LIMITS}
      uniqueKey="new"
    />
  );
};
export default NewProductFeed;
