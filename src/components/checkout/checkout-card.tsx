import Link from 'next/link';
import Text from '@components/ui/text';
import Button from '@components/ui/button';
import { CheckoutCardFooterItem } from './checkout-card-footer-item';
import { useTranslation } from 'next-i18next';
import Router from 'next/router';
import { ROUTES } from '@utils/routes';
import useEnrichedLineItems from '@lib/hooks/use-enrich-line-items';
import { formatAmount, useCart } from 'medusa-react';
import CheckoutItem from './checkout-card-item';
import PaymentButton from './payment-button';
import DiscountCode from './discount-code';
import GiftCard from './gift-card';
import { Cart } from '@medusajs/medusa';

type CheckoutCardProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

const CheckoutCard: React.FC<CheckoutCardProps> = ({ cart }) => {
  const { t } = useTranslation('common');

  const items = useEnrichedLineItems()
  const isEmpty = cart?.region && cart?.items.length;
  
  function orderHeader() {
    !isEmpty && Router.push(ROUTES.ORDER);
  }
  

  return (
    <>
      <div className="border border-skin-base bg-skin-fill rounded-md py-1 xl:py-6 px-4 xl:px-7">
        <div className="flex py-4 rounded-md text-sm font-semibold text-heading">
          <span className="text-15px text-skin-base font-medium">
            {t('text-product')}
          </span>
          <span className="ms-auto flex-shrink-0 text-15px text-skin-base font-medium ">
            {t('text-sub-total')}
          </span>
        </div>
        {items && items.length && cart?.region ? (
          items.map((item) => <CheckoutItem item={item} key={item.id} region={cart.region} />)
        ) : (
          <p className="text-skin-red text-opacity-70 py-4">
            {t('text-empty-cart')}
          </p>
        )}

         {cart && 
         (
         <>
         <CheckoutCardFooterItem item={
            {
              id: "1",
              name: t('text-sub-total'),
              price: formatAmount({
                amount: cart.subtotal || 0,
                region: cart.region,
                includeTaxes: false,
              }),
            }
          } />

         {!!cart.discount_total && (
         <CheckoutCardFooterItem item={
            {
              id: "2",
              name: t('text-discount'),
              price: formatAmount({
                amount: cart.discount_total || 0,
                region: cart.region,
                includeTaxes: false,
              }),
            }
          } />
          )}

         {!!cart.gift_card_total && (
         <CheckoutCardFooterItem item={
            {
              id: "3",
              name: t('text-gift-card'),
              price: formatAmount({
                amount: cart.gift_card_total || 0,
                region: cart.region,
                includeTaxes: false,
              }),
            }
          } />
         )}

         <CheckoutCardFooterItem item={
            {
              id: "4",
              name: t('text-shipping'),
              price: formatAmount({
                amount: cart.shipping_total || 0,
                region: cart.region,
                includeTaxes: false,
              }),
            }
          } />

         <CheckoutCardFooterItem item={
            {
              id: "5",
              name: t('text-tax'),
              price: formatAmount({
                amount: cart.tax_total || 0,
                region: cart.region,
                includeTaxes: false,
              }),
            }
          } />

          <CheckoutCardFooterItem item={
            {
              id: "6",
              name: t('text-total'),
              price: formatAmount({
                  amount: cart.total || 0,
                  region: cart.region,
                  includeTaxes: false,
                })
            }
          } />
          </>
          )
          }

        <DiscountCode cart={cart} />
        <GiftCard cart={cart} />


       <PaymentButton paymentSession={cart?.payment_session} />
      </div>
      <Text className="mt-8">
        {t('text-by-placing-your-order')}{' '}
        <Link href={ROUTES.TERMS} className="text-skin-primary underline font-medium">
            {t('text-terms-of-service')}
        </Link>
        {' '}{t('text-and')}{' '}
        <Link href={ROUTES.PRIVACY} className="text-skin-primary underline font-medium">
            {t('text-privacy')}
        </Link>
        . {t('text-credit-debit')}
      </Text>
      <Text className="mt-4">{t('text-bag-fee')}</Text>
    </>
  );
};

export default CheckoutCard;
