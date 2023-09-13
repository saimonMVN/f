import Scrollbar from '@components/ui/scrollbar';
import { useCart as OldCart } from '@contexts/cart/cart.context';
import { useUI } from '@contexts/ui.context';
import usePrice from '@framework/product/use-price';
import { IoClose } from 'react-icons/io5';
import CartItem from './cart-item';
import EmptyCart from './empty-cart';
import Link from '@components/ui/link';
import { ROUTES } from '@utils/routes';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import Heading from '@components/ui/heading';
import Text from '@components/ui/text';
import DeleteIcon from '@components/icons/delete-icon';
import { formatAmount, useCart } from 'medusa-react';
import useEnrichedLineItems from '@lib/hooks/use-enrich-line-items';
import { useStore } from '@lib/context/store-context';

export default function Cart() {
  const { t } = useTranslation('common');
  const { closeDrawer } = useUI();
  const { cart } = useCart()
  const { resetCart } = useStore()

  const items = useEnrichedLineItems()
  const isEmpty = cart?.region && cart?.items.length;

  return (
    <div className="flex flex-col w-full h-full justify-between">
      <div className="w-full flex justify-between items-center relative ps-5 md:ps-7 border-b border-skin-base">
        <Heading variant="titleMedium">{t('text-shopping-cart')}</Heading>
        <div className="flex items-center">
          {cart?.items.length ? (
            <button
              className="flex flex-shrink items-center text-15px transition duration-150 ease-in focus:outline-none text-skin-base opacity-50 hover:opacity-100 -me-1.5"
              aria-label={t('text-clear-all')}
              onClick={resetCart}
            >
              <DeleteIcon />
              <span className="ps-1">{t('text-clear-all')}</span>
            </button>
          )
          :
          ""
          }

          <button
            className="flex text-2xl items-center justify-center px-4 md:px-6 py-6 lg:py-7 focus:outline-none transition-opacity text-skin-base hover:opacity-60"
            onClick={closeDrawer}
            aria-label="close"
          >
            <IoClose />
          </button>
          
        </div>
      </div>
  
      {items && items.length && cart?.region
          ?  (
        <Scrollbar className="cart-scrollbar w-full flex-grow">
          <div className="w-full px-5 md:px-7">
          {items
              .sort((a, b) => {
                return a.created_at > b.created_at ? -1 : 1
              })
              .map((item) => (
              <CartItem item={item} region={cart?.region} key={item.id} />
            ))}
          </div>
        </Scrollbar>
      ) : (
        <EmptyCart />
      )}
      <div className="border-t border-skin-base px-5 md:px-7 pt-5 md:pt-6 pb-5 md:pb-6">
        <div className="flex pb-5 md:pb-7">
          <div className="pe-3">
            <Heading className="mb-2.5">{t('text-sub-total')}:</Heading>
            <Text className="leading-6">
              {t('text-cart-final-price-discount')}
            </Text>
          </div>
          {cart && 
          <div className="flex-shrink-0 font-semibold text-base md:text-lg text-skin-base -mt-0.5 min-w-[80px] text-end">
          {formatAmount({
          amount: cart.subtotal || 0,
          region: cart?.region,
          includeTaxes: false,
          })}
          </div>
          }
        </div>
        <div className="flex flex-col" onClick={closeDrawer}>
          <Link
            href={ROUTES.CHECKOUT}
            className={cn(
              'w-full px-5 py-3 md:py-4 flex items-center justify-center bg-heading rounded font-semibold text-sm sm:text-15px text-skin-inverted bg-skin-primary focus:outline-none transition duration-300 hover:bg-opacity-90',
              {
                'cursor-not-allowed !text-skin-base !text-opacity-25 bg-skin-button-disable hover:bg-skin-button-disable':
                  !isEmpty,
              }
            )}
          >
            <span className="py-0.5">{t('text-proceed-to-checkout')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
