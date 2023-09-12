import { LIMITS } from '@framework/utils/limits';
import ListingTabsList from "@components/product/listingtabs/listingtabs-list";
import ListingTabsContainer from "@components/product/listingtabs/listingtabs-container";
import {useElectronicProductsQuery} from "@framework/product/get-all-electronic-products";
import { useElectronicCategoryQuery } from '@framework/product/get-electronic-category';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';

type BoxProps = {
    colSiderbar: boolean;
    category: any; // 👈️ added type for children
    products: PricedProduct[];
};

export default function ListingTabsElectronicFeed(props: BoxProps) {
  const { data: category} = useElectronicCategoryQuery({
    limit: LIMITS.ELETRONIC_PRODUCTS_LIMITS,
  });
  const {
      data: data,
      isLoading,
      error
  } = useElectronicProductsQuery({
    limit: LIMITS.ELETRONIC_PRODUCTS_LIMITS,
  });
  const {colSiderbar} = props;
    return (
      <div className="mb-8">
        <div className="listing-tabs">
          <ListingTabsList className={`ltabs-heading`} data={category}/>
          <ListingTabsContainer data={props.products} isLoading={isLoading} error={error} colSiderbar={colSiderbar}/>
        </div>
      </div>
  );
}
