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


interface IProductPropsType {
  products: PricedProduct[];
  error?: string | undefined | null;
}
export default function Products({ products, error }: IProductPropsType) {
  const { t } = useTranslation('common');
  const [viewAs, setViewAs] = useState(Boolean(true));
console.log(products,"products")
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

export const getServerSideProps: GetServerSideProps<
    IProductPropsType
> = async ({locale, req}) => {
  try {
    const cookies = req.headers.cookie || ""
    const cart_id = getCookieByCookiesKey(AppConst.CART_COOKIES_ID, cookies);
    const res = await medusaRequest('GET', '/products', {
      query: {
        cart_id,
      },
    });

    if (
        !res.ok
    ) {
      return {notFound: true};
    }
    return {
      props: {
        products: res.body,
        error: null,
        ...(await serverSideTranslations(locale!, [
          'common',
          'forms',
          'menu',
          'footer',
        ])),
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
