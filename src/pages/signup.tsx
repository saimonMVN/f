import Layout from '@components/layout/layout';
import SignupForm from '@components/auth/sign-up-form';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Seo from '@components/seo/seo';
import { useAccount } from '@lib/context/account-context';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function SignInPage() {
  const { retrievingCustomer, customer } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (!retrievingCustomer && customer) {
      router.back()
    }
  }, [customer, retrievingCustomer, router])

  return (
    <>
      <Seo
        title="Sign Up"
        description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        path="signup"
      />

      <div className="flex justify-center items-center">
          <div className="py-10 lg:py-16">
          <SignupForm
            isPopup={false}
            className="border border-skin-base rounded-lg"
          />
        </div>
      </div>

    </>
  );
}

SignInPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        'common',
        'forms',
        'menu',
        'footer',
      ])),
    },
  };
};
