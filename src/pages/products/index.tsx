import Container from '@components/ui/container';
import Layout from '@components/layout/layout';
import { ShopFilters } from '@components/search/filters';
import { ProductGrid } from '@components/product/product-grid';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {GetServerSideProps, GetStaticProps} from 'next';
import PageHeroSection from '@components/ui/page-hero-section';
import { useTranslation } from 'next-i18next';
import SearchTopBar from '@components/search/search-top-bar';
import { Element } from 'react-scroll';
import Seo from '@components/seo/seo';
import {useState} from "react";
import {getCookieByCookiesKey} from "@utils/global";
import {AppConst} from "@utils/app-const";
import medusaRequest from "@lib/medusa-fetch";
import {PricedProduct} from "@medusajs/medusa/dist/types/pricing";
import {fetchProductsList} from "@lib/data";


interface IProductResponse {
  products: PricedProduct[];
  count: number;
  nextPage?:null | number;
  prePage?:null | number
}

interface IProductProps {
  products: IProductResponse;
}
export default function Products({ products }: IProductProps) {
  const { t } = useTranslation('common');
  const [viewAs, setViewAs] = useState(Boolean(true));

  return (
    <>
      <Seo
        title="Products"
        description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        path="products"
      />
      <PageHeroSection heroTitle={t('text-all-grocery-items')} />
      <Container>

        <Element name="grid" className="flex pt-7 lg:pt-11 pb-16 lg:pb-20">
          <div className="flex-shrink-0 pe-8 xl:pe-16 hidden lg:block w-80 xl:w-96 sticky top-16 h-full">
            <ShopFilters />
          </div>
          <div className="w-full lg:-ms-2 xl:-ms-8 lg:-mt-1">
            <SearchTopBar viewAs={viewAs} onNavClick={setViewAs}/>
            <ProductGrid  key="prouctGrid" viewAs={viewAs} products={products}/>
          </div>
        </Element>
      </Container>
    </>
  );
}

Products.Layout = Layout;

export const getServerSideProps: GetServerSideProps<IProductProps> = async ({ locale, req, query }) => {
  const {q, category, collections, tags, types, offset } = query;
  const categoryHandle: string = category as string;
  const collectionsIds: string = collections as string;
  const tagIds: string = tags as string;
  const typeIds: string = types as string;
  const searchKeyword:string =q as string;
  const cookies = req.headers.cookie || ""
  const cart_id = getCookieByCookiesKey(AppConst.CART_COOKIES_ID, cookies) as string;
  const offsetData:string = offset as string

  try {
    const res = await fetchProductsList({
      pageParam: offsetData ? Number(offsetData) : 0 ,
      queryParams: {
        cart_id,
        category_id: [categoryHandle],
        collection_id: [collectionsIds],
        tags: [tagIds],
        type_id: [typeIds],
        q:searchKeyword
      },
    });

    const productsData: IProductResponse = res.response;

    return {
      props: {
        products: {...productsData, nextPage:res.nextPage, prePage:res.prePage},
        ...(await serverSideTranslations(locale!, ['common', 'forms', 'menu', 'footer'])),
      },
    };
  } catch (error) {
    return {
      props: {
        products: {
          products: [],
          count: 0,
          nextPage:null,
          prePage:null
        },
        ...(await serverSideTranslations(locale!, ['common', 'forms', 'menu', 'footer'])),
      },
    };
  }
};
