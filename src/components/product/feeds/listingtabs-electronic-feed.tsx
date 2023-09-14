
import ListingTabsList from "@components/product/listingtabs/listingtabs-list";
import ListingTabsContainer from "@components/product/listingtabs/listingtabs-container";
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';


type BoxProps = {
    colSiderbar: boolean;
    category: any; // 👈️ added type for children
    products: PricedProduct[];
    error?: string | undefined | null;
};

export default function ListingTabsElectronicFeed(props: BoxProps) {
  const data = {name: "Demo Categories 1"}
  const {colSiderbar} = props;

    return (
      <div className="mb-8">
        <div className="listing-tabs">
          <ListingTabsList className={`ltabs-heading`} data={data}/>
          <ListingTabsContainer products={props.products} isLoading={false} colSiderbar={colSiderbar} />
        </div>
      </div>
  );
}
