import React from 'react';
import Layout from '@components/layout/layout';
import AccountLayout from '@components/my-account/account-layout';
import OrderTable from '@components/order/order-table';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Seo from '@components/seo/seo';
import { useCustomerOrders } from 'medusa-react';
import Link from 'next/link';
import Button from '@components/ui/button';

export default function OrdersTablePage() {
  const { orders, isLoading } = useCustomerOrders()

  return (
    <>
      <Seo
        title="Orders"
        description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        path="my-account/orders"
      />
      <AccountLayout>
        {!isLoading && orders?.length===0 ? (
            <div className="w-full flex flex-col items-center gap-y-4">
              <h2 className="text-large-semi">Nothing to see here</h2>
              <p className="text-base-regular">
                You don&apos;t have any orders yet, let us change that {":)"}
              </p>
              <div className="mt-4">
                <Link href="/">
                  <Button>Continue shopping</Button>
                </Link>
              </div>
            </div>
          )
        : !isLoading ? (
          <OrderTable orders={orders} />
        ) : (
          <div>Loading...</div>
        )}
      </AccountLayout>
    </>
  );
}

OrdersTablePage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => {
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
