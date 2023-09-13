import Image from '@components/ui/image';
import Link from '@components/ui/link';
import { ROUTES } from '@utils/routes';
import { searchProductPlaceholder } from '@assets/placeholders';
import { Product } from '@medusajs/medusa';
import {ProductPreviewType} from "@interfaces/global";
import {PricedProduct} from "@medusajs/medusa/dist/types/pricing";
import React from "react";

type SearchProductProps = {
  product: PricedProduct;
  previewProduct: ProductPreviewType;

};

const SearchProduct: React.FC<SearchProductProps> = ({ product,previewProduct }) => {
  const { title, handle} = product ?? {};

  return (
      <Link
          href={`${ROUTES.PRODUCT}/${handle}`}
          className="group w-full h-auto flex justify-start items-center"
      >
        <div className="relative flex w-15 h-15 rounded-md overflow-hidden flex-shrink-0 cursor-pointer me-4">
          <Image
              src={product.thumbnail ?? searchProductPlaceholder}
              width={80}
              height={80}
              loading="eager"
              alt={handle || 'Product Image'}
              className="bg-skin-thumbnail object-cover"
          />
        </div>
        <div className="flex flex-col w-full overflow-hidden">
          <h3 className="truncate text-skin-base text-15px  mb-1.5">{title}</h3>
          <div className="space-s-2 mb-4 lg:mb-4">
            {/* <span className="inline-block font-semibold text-sm sm:text-15px lg:text-base text-skin-primary">
            {product_type === 'variable' ? `${minPrice} - ${maxPrice}` : price}
          </span>
          {basePrice && (
              <del className="text-sm text-skin-base text-opacity-70">
                {basePrice}
              </del>
          )} */}

            <div className="space-s-2 mb-2">
          <span className="inline-block font-semibold text-sm sm:text-15px lg:text-base text-skin-primary">
          {previewProduct.price?.calculated_price}
          </span>
              {previewProduct.price?.price_type === 'sale' && (
                  <del className="text-sm text-gray-400 text-opacity-70">
                    {previewProduct.price.original_price}
                  </del>
              )}
            </div>
          </div>
        </div>
      </Link>
  );
};

export default SearchProduct;
