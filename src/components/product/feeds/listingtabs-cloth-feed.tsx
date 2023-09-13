import { LIMITS } from '@framework/utils/limits';
import ListingTabsList from "@components/product/listingtabs/listingtabs-list";
import ListingTabsContainer from "@components/product/listingtabs/listingtabs-container";
import { useClothCategoryQuery } from '@framework/product/get-cloth-category';
import {UsefashionProductsQuery} from "@framework/product/get-all-fashion-products";
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';

type BoxProps = {
  colSiderbar: boolean;
  category: any; // 👈️ added type for children
  products: PricedProduct[];
  error?: string | undefined | null;
};

export default function ListingTabsClothFeed(props: BoxProps) {
  // const { data: category } = useClothCategoryQuery({
  //   limit: LIMITS.FASHION_PRODUCTS_LIMITS,
  // });

  const data = {name: "Demo Categories 2"}

  return (
      <div className="mb-8">
        <div className="listing-tabs" >
          <ListingTabsList className={`ltabs-heading`} data={data}/>
          <ListingTabsContainer products={props.products} isLoading={false} error={props.error} colSiderbar={props.colSiderbar}/>
        </div>
      </div>
  );
}
