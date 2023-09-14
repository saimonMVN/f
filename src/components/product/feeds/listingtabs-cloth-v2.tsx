import { LIMITS } from '@framework/utils/limits';
import ListingTabsList from "@components/product/listingtabs/listingtabs-list-v2";
import ListingTabsContainer from "@components/product/listingtabs/listingtabs-container-v2";
import { useClothCategoryQuery } from '@framework/product/get-cloth-category';
import {UsefashionProductsQuery} from "@framework/product/get-all-fashion-products";
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';

type BoxProps = {
  colSiderbar: boolean;
  category: any; // 👈️ added type for children
  products: PricedProduct[];
  error?: string | undefined | null;
  showBanner?: string;
};

export default function ListingTabsClothFeed(props: BoxProps) {
  const data = {name: "Demo Categories 2"}
  const {showBanner} = props;
  const banner_url = '/assets/images/collection/banner_cate_home7_4.jpg';

  return (
      <div className="mb-8 lg:mb-12">
        <div className="listing-tabs" >
          <ListingTabsList className={`ltabs-heading`} data={data}/>
          <ListingTabsContainer data={props.products} category={data} isLoading={false} error={""} showBanner={showBanner} banner_url={banner_url}/>
        </div>
      </div>
  );
}
