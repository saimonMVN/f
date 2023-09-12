import Container from '@components/ui/container';
import Layout from '@components/layout/layout';
import Map from '@components/ui/map';
import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import ContactForm from '@components/common/form/contact-form';
import ContactSupport from '@components/contact/contact-support';
import Seo from '@components/seo/seo';
import PageHeroSection from "@components/ui/page-hero-section";
import React from "react";

export default function ContactUsPage() {
    return (
        <>
            <Seo
                title="Contact Us"
                description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
                path="contact-us"
            />
            <PageHeroSection heroTitle="text-page-contactus"/>
            <Container>
                <div
                    className="flex flex-wrap bg-skin-fill w-full  xl:py-12  relative z-10">
                    <div className="w-full md:w-[53%] xl:w-[60%] md:pe-8 lg:pe-0 2xl:pe-24 lg:mb-0 mb-8">
                        <ContactSupport/>
                    </div>
                    <div className="w-full md:w-[47%] xl:w-[40%] pb-0.5 lg:ps-12 pt-1.5">
                        <ContactForm/>
                    </div>
                </div>
            </Container>
            <div className="mt-12 md:mt-16 xl:mt-20 2xl:mt-24 bg-skin-three relative h-[420px]">
                <Map
                    lat={1.295831}
                    lng={103.76261}
                    height={'420px'}
                    zoom={15}
                    showInfoWindow={true}
                />
            </div>

        </>
    );
}

ContactUsPage.Layout = Layout;

export const getStaticProps = async ({locale}: any) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common',
                'forms',
                'menu',
                'footer',
            ])),
        },
    };
};
