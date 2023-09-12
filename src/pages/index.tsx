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
import {GetStaticProps} from 'next';
import Seo from '@components/seo/seo';
import {QueryClient} from 'react-query';
import {dehydrate} from 'react-query/hydration';
import {API_ENDPOINTS} from '@framework/utils/api-endpoints';
import {fetchCategories} from '@framework/category/get-all-categories';
import {fetchPopularProducts} from '@framework/product/get-all-popular-products';
import {LIMITS} from '@framework/utils/limits';
import HeroSliderBlock from "@components/hero/hero-slider-block";
import FeatureCarousel from "@components/common/featured-carousel";
import BannerGridTwo from "@components/common/banner-grid-two";
import BannerAllCarousel from "@components/common/banner-all-carousel";
import CategoryGridListBlock from "@components/common/category-grid-list-block";

import SupperCategoryElectronicFeed from "@components/product/feeds/suppercategory-electronic-feed";
import SupperCategoryClothFeed from "@components/product/feeds/suppercategory-cloth-feed";
import {fetchBestSellerProducts} from "@framework/product/get-all-best-seller-products";

export default function Home() {
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
                <BestSellerProductFeed/>
                <BannerGridTwo
                    data={bannerTwo}
                    className="mb-8 lg:mb-12"
                    girdClassName="xl:gap-5 "
                />
                <SupperCategoryElectronicFeed />
                <BannerGridTwo
                    data={bannerTwo2}
                    className="mb-8 lg:mb-12"
                    girdClassName="xl:gap-5 2xl:grid-cols-[minmax(1130px,_1fr)_1fr] "
                />
                <SupperCategoryClothFeed />
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

export const getStaticProps: GetStaticProps = async ({locale}) => {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(
        [API_ENDPOINTS.CATEGORIES, {limit: LIMITS.CATEGORIES_LIMITS}],
        fetchCategories
    );

    await queryClient.prefetchQuery(
        [
            API_ENDPOINTS.BEST_SELLER_PRODUCTS, {limit: LIMITS.BEST_SELLER_PRODUCTS_LIMITS},
        ],
        fetchBestSellerProducts
    );

    await queryClient.prefetchQuery(
        [API_ENDPOINTS.POPULAR_PRODUCTS, {limit: LIMITS.POPULAR_PRODUCTS_LIMITS}],
        fetchPopularProducts
    );

    return {
        props: {
            dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
            ...(await serverSideTranslations(locale!, [
                'common',
                'forms',
                'menu',
                'footer',
            ])),
        },
        revalidate: 60,
    };
};
