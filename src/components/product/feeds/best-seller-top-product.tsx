import ProductsCarousel from '@components/product/products-carousel-v2';
import { useBestSellerProductsQuery } from '@framework/product/get-all-best-seller-products';
import { LIMITS } from '@framework/utils/limits';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { ROUTES } from '@utils/routes';

interface IBestSellerProductFeed {
  products: PricedProduct[]
}

export default function BestSellerProductFeed({products}: IBestSellerProductFeed) {

  return (
    <ProductsCarousel
      sectionHeading="text-best-sellers-product"
      categorySlug={ROUTES.PRODUCTS}
      products={products}
      loading={false}
      error={""}
      limit={LIMITS.BEST_SELLER_PRODUCTS_LIMITS}
      uniqueKey="best-sellers"
      className= "mb-8 lg:mb-12"
      borderCarousel= {true}
      rowCarousel= {2}
    />
  );
}
