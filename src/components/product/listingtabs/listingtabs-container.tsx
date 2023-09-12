import {ROUTES} from '@utils/routes';
import ProductsCarousel from '@components/product/products-carousel';
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';

interface Props {
    products: PricedProduct[];
    isLoading: any;
    error?: any;
    colSiderbar?: boolean;
}
const ListingTabsContainer: React.FC<Props> = ({products, isLoading, error, colSiderbar= true}) => {
    let breakpoints = {};
    if(colSiderbar){
         breakpoints = {
            '1536': {
                slidesPerView: 6,
            },
            '1280': {
                slidesPerView: 4,
            },
            '1024': {
                slidesPerView: 3,
            },
            '640': {
                slidesPerView: 3,
            },
            '360': {
                slidesPerView: 2,
            },
            '0': {
                slidesPerView: 1,
            },
        };
    }else{
         breakpoints = {
            '1536': {
                slidesPerView: 7,
            },
            '1280': {
                slidesPerView: 5,
            },
            '1024': {
                slidesPerView: 3,
            },
            '640': {
                slidesPerView: 3,
            },
            '360': {
                slidesPerView: 2,
            },
            '0': {
                slidesPerView: 1,
            },
        };
    }

    console.log(products)
    return (
        <ProductsCarousel
            sectionHeading=""
            categorySlug={ROUTES.PRODUCTS}
            products={products}
            loading={isLoading}
            error={error?.message}
            uniqueKey="electronic"
            carouselBreakpoint={breakpoints}
        />
    );
};
export default ListingTabsContainer;
