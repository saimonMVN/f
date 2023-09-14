import { FC } from 'react';
import SupperCategoryList from "@components/suppercategory/suppercategory-list";
import SupperCategoryContainer from "@components/suppercategory/suppercategory-container";
import {useRouter} from "next/router";
import {getDirection} from "@utils/get-direction";
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';

interface ProductFeedProps {
  className?: string;
  products: PricedProduct[]
}

const SupperCategoryClothFeed: FC<ProductFeedProps> = ({ className, products }) => {
  const { locale } = useRouter();
  const dir = getDirection(locale);
  const backgroundThumbnail = dir === 'ltr' ? '/assets/images/collection/cate_2.jpg' : '/assets/images/collection/cate_2_rtl.jpg';

  const category = {
    name: "Clothes",
  }

  return (
      <div className="mb-8 lg:mb-12">
        <div className="xl:flex border border-black/10" >
          <div className={`xl:w-[420px] p-7 bg-no-repeat  ${dir == 'rtl' ? 'bg-left': 'bg-right'}`}
               style={{backgroundImage: `url(${backgroundThumbnail})`}}
          >
            <SupperCategoryList className={`supper-category--list`} data={category}/>
          </div>
          <div className="trendy-main-content w-full p-2.5">
            <SupperCategoryContainer data={products} isLoading={false} error={false}/>
          </div>
        </div>
      </div>
  );
}

export default SupperCategoryClothFeed