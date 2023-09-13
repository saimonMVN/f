import Container from '@components/ui/container';
import Layout from '@components/layout/layout';
import {ShopFilters} from '@components/search/filters';
import {ProductGrid} from '@components/product/product-grid';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {GetServerSideProps} from 'next';
import {Element} from 'react-scroll';
import SearchTopBar from '@components/search/search-top-bar';
import Divider from '@components/ui/divider';
import Seo from '@components/seo/seo';
import {useState} from "react";
import Breadcrumb from "@components/ui/breadcrumb";
import {AppConst} from "@utils/app-const";
import {fetchProductsList} from "@lib/data";
import {PricedProduct} from "@medusajs/medusa/dist/types/pricing";
import {getCookieByCookiesKey} from "@utils/global";


interface ISearchProductResponse {
  products: PricedProduct[];
  count: number;
  nextPage?:null | number
}

interface SearchProps {
  products: ISearchProductResponse;
}
export default function Search({products}: SearchProps) {
  const [viewAs, setViewAs] = useState(Boolean(true));


  return (
      <>
        <Seo
            title="Search"
            description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
            path="search"
        />
        <Divider/>
        <Container>
          <div className="pt-6">
            <Breadcrumb/>
          </div>
          <Element name="grid" className="flex pt-7 lg:pt-11 pb-16 lg:pb-20 products-category">
            <div className="flex-shrink-0 pe-8 xl:pe-16 hidden lg:block w-80 xl:w-86 sticky top-16 h-full">
              <ShopFilters/>
            </div>
            <div className="w-full lg:-ms-2 xl:-ms-8 lg:-mt-1">
              <SearchTopBar viewAs={viewAs} onNavClick={setViewAs}/>
              <ProductGrid products={products} key="prouctGrid" viewAs={viewAs}/>
            </div>
          </Element>
        </Container>
      </>
  );
}

Search.Layout = Layout;



export const getServerSideProps: GetServerSideProps<SearchProps> = async ({ locale, req, query }) => {
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

    const productsData: ISearchProductResponse = res.response;

    return {
      props: {
        products: {...productsData, nextPage:res.nextPage},
        ...(await serverSideTranslations(locale!, ['common', 'forms', 'menu', 'footer'])),
      },
    };
  } catch (error) {
    return {
      props: {
        products: {
          products: [],
          count: 0,
          nextPage:null
        },
        ...(await serverSideTranslations(locale!, ['common', 'forms', 'menu', 'footer'])),
      },
    };
  }
};
