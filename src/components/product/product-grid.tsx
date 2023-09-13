import type { FC } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Alert from '@components/ui/alert';
import Button from '@components/ui/button';
import ProductCard from '@components/product/product-cards/product-card';
import ProductList from '@components/product/product-cards/product-list-view';
import ProductCardLoader from '@components/ui/loaders/product-card-loader';
import cn from 'classnames';
import { useProductsQuery } from '@framework/product/get-all-products';
import { LIMITS } from '@framework/utils/limits';
import { Product } from '@framework/types';
import {PricedProduct} from "@medusajs/medusa/dist/types/pricing";
import {useState} from "react";
import {useCart} from "medusa-react";
import usePreviews from "@lib/hooks/use-previews";

interface ProductGridProps {
  className?: string;
  viewAs: boolean;
}


interface ISearchProductResponse {
  products: PricedProduct[];
  count: number;
  nextPage?:null | number
}
interface ProductGridProps {
  products: ISearchProductResponse;
  viewAs:boolean;
  className?:string;
}
export const ProductGrid: FC<ProductGridProps> = ({ className = '' ,viewAs,products}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { pathname, query } = router;
  const { offset, ...restQuery } = query;
  const [isLoading, setIsLoading] = useState(!products.products)
  const { cart } = useCart()
  const previews = usePreviews({products: products.products, region: cart?.region })



  const handleNextPage=()=>{
// offset

    router.push(
        {
          pathname,
          query: {
            ...restQuery,
            offset: products.nextPage
          },
        },
        undefined,
        { scroll: false }
    );

  }
    return (
        <>
            <div
                className={`gap-y-7 gap-5 ${ viewAs ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : 'grid grid-cols-1 gap-8'} ${className}`}
            >
                {isLoading ? (
                    Array.from({ length: 30 }).map((_, idx) => (
                        <article className={`flex flex-col product-card m-3 h-full`} key={`product--key-${idx}`}>
                            <ProductCardLoader
                                key={`product--key-${idx}`}
                                uniqueKey={`product--key-${idx}`}
                            />
                        </article>
                    ))
                ) :!isLoading && products.products.length < 0 ? <div className="col-span-full ">
                    <Alert message={"Data is empty "} />
                </div>: viewAs ? previews.map((product,inx) => (
                    <ProductCard
                        key={`product--key-${product.id}`}
                        pricedProduct={products.products[inx]}
                        previewProduct={product}
                    />
                )): previews.map((product,inx) => (
                    <ProductList
                        key={`product--key-${product.id}`}
                        pricedProduct={products.products[inx]}
                        previewProduct={product}
                    />
                ))
                }
                {/* end of error state */}
            </div>
            {products.nextPage && (
                <div className="text-center pt-8 xl:pt-10">
                    <Button
                        loading={isLoading}
                        disabled={isLoading}
                        onClick={() => handleNextPage()}
                        className={"w-60 "}
                    >
                        {t('button-load-more')}
                    </Button>
                </div>
            )}
        </>
    );
};
