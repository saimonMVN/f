import { LIMITS } from '@framework/utils/limits';
import SupperCategoryList from "@components/suppercategory/suppercategory-list";
import SupperCategoryContainer from "@components/suppercategory/suppercategory-container";
import {useClothCategoryQuery} from "@framework/product/get-cloth-category";
import {UsefashionProductsQuery} from "@framework/product/get-all-fashion-products";
import {useRouter} from "next/router";
import {getDirection} from "@utils/get-direction";

export default function SupperCategoryElectronicFeed() {
  const { data: category } = useClothCategoryQuery({
    limit: LIMITS.FASHION_PRODUCTS_LIMITS,
  });
  const { data: products, isLoading, error } = UsefashionProductsQuery({
    limit: LIMITS.FASHION_PRODUCTS_LIMITS,
  });
  const { locale } = useRouter();
  const dir = getDirection(locale);
  const backgroundThumbnail = dir === 'ltr' ? '/assets/images/collection/cate_2.jpg' : '/assets/images/collection/cate_2_rtl.jpg';

  return (
      <div className="mb-8 lg:mb-12">
        <div className="xl:flex border border-black/10" >
          <div className={`xl:w-[420px] p-7 bg-no-repeat  ${dir == 'rtl' ? 'bg-left': 'bg-right'}`}
               style={{backgroundImage: `url(${backgroundThumbnail})`}}
          >
            <SupperCategoryList className={`supper-category--list`} data={category}/>
          </div>
          <div className="trendy-main-content w-full p-2.5">
            <SupperCategoryContainer data = {products} isLoading={isLoading} error={error}/>
          </div>
        </div>
      </div>
  );
}
