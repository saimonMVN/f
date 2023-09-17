import Layout from '@components/layout/layout';
import Container from '@components/ui/container';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import BestSellerProductFeed from '@components/product/feeds/best-seller-product-feed';

import {
    bannerDiscount,
    bannersGridHero as bannerTwo,
    bannersGridHero2 as bannerTwo2,
    homeTwoHeroBanner as heroBanner
} from '@framework/static/banner';
import {GetServerSideProps } from 'next';
import Seo from '@components/seo/seo';
import HeroSliderBlock from "@components/hero/hero-slider-block";
import FeatureCarousel from "@components/common/featured-carousel";
import BannerGridTwo from "@components/common/banner-grid-two";
import BannerAllCarousel from "@components/common/banner-all-carousel";
import CategoryGridListBlock from "@components/common/category-grid-list-block";

import SupperCategoryElectronicFeed from "@components/product/feeds/suppercategory-electronic-feed";
import SupperCategoryClothFeed from "@components/product/feeds/suppercategory-cloth-feed";
import { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { getCookieByCookiesKey } from '@utils/global';
import { AppConst } from '@utils/app-const';
import { fetchProductsList } from '@lib/data';

interface IHomeProductResponse {
    products: PricedProduct[];
    count: number;
    nextPage?:null | number;
    prePage?:null | number
  }
  
  interface IHomeProps {
    response: IHomeProductResponse;
  }

export default function Home({response}: IHomeProps) {
    return (
        <>
            <Seo
                title="Electronics Store Store React Template"
                description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
                path="/"
            />

            <Container>
                <HeroSliderBlock
                    heroBanner={heroBanner}
                    className={`mb-7 mt-6`}
                    contentClassName="p-5 sm:pb-24 xl:pb-32 sm:pt-16 xl:pt-24"
                />
                <FeatureCarousel/>
                <BestSellerProductFeed products={response.products} />
                <BannerGridTwo
                    data={bannerTwo}
                    className="mb-8 lg:mb-12"
                    girdClassName="xl:gap-5 "
                />
                <SupperCategoryElectronicFeed products={response.products} />
                <BannerGridTwo
                    data={bannerTwo2}
                    className="mb-8 lg:mb-12"
                    girdClassName="xl:gap-5 2xl:grid-cols-[minmax(1130px,_1fr)_1fr] "
                />
                <SupperCategoryClothFeed products={response.products} />
                <CategoryGridListBlock  className="mb-6 lg:mb-8" />
                <BannerAllCarousel
                    data={bannerDiscount}
                    className="mb-8 lg:mb-12"
                />

            </Container>

        </>
    );
}

Home.Layout = Layout;

export const getServerSideProps: GetServerSideProps<IHomeProps> = async ({ locale, req }) => {
    try {
      const cookies = req.headers.cookie || ""
      const cart_id = getCookieByCookiesKey(AppConst.CART_COOKIES_ID, cookies) as string;

        const res = await fetchProductsList({
          queryParams: {
            cart_id,
          },
        });
    
        const productsData = res.response;
        return {
          props: {
            response: {...productsData, nextPage:res.nextPage, prePage:res.prePage},
            ...(await serverSideTranslations(locale!, ['common', 'forms', 'menu', 'footer'])),
          },
        };
      } catch (error) {
        return {
          props: {
            response: {
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
    