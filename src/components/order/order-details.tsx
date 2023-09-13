import { useOrderQuery } from '@framework/order/get-order';
import usePrice from '@framework/product/use-price';
import { OrderItem } from '@framework/types';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Heading from '@components/ui/heading';
import { LineItem, Order, Region } from '@medusajs/medusa';
import useEnrichedLineItems from '@lib/hooks/use-enrich-line-items';
import LineItemPrice from './line-item-price';
import { formatAmount } from 'medusa-react';

type ItemsProps = {
  product: LineItem
  region: Region
  cartId: string
}

const OrderItemCard = ({ product, region, cartId }: ItemsProps) => {
  return (
    <tr
      className="border-b font-normal border-skin-base last:border-b-0"
      key={product.id}
    >
      <td className="p-4">
        {product.title} * {product.quantity}
      </td>
      <td className="p-4"><LineItemPrice item={product} region={region} /></td>
    </tr>
  );
};
const OrderDetails: React.FC<{ className?: string, order: Order }> = ({
  className = 'pt-10 lg:pt-12', order
}) => {
  const { t } = useTranslation('common');

  return (
    <div className={className}>
      <Heading variant="heading" className="mb-6 xl:mb-7">
        {t('text-order-details')}:
      </Heading>
      <table className="w-full text-skin-base font-semibold text-sm lg:text-base">
        <thead>
          <tr>
            <th className="bg-skin-secondary p-4 text-start first:rounded-ts-md w-1/2">
              {t('text-product')}
            </th>
            <th className="bg-skin-secondary p-4 text-start last:rounded-te-md w-1/2">
              {t('text-total')}
            </th>
          </tr>
        </thead>
        <tbody>
          {order?.items.map((product, index) => (
            <OrderItemCard key={index} product={product} region={order.region} cartId={order.cart_id} />
          ))}
        </tbody>
        <tfoot>
          <tr className="odd:bg-skin-secondary">
            <td className="p-4 italic">{t('text-sub-total')}:</td>
            <td className="p-4">
            {formatAmount({
          amount: order.subtotal || 0,
          region: order.region,
          includeTaxes: false,
        })}
            </td>
          </tr>
          <tr className="odd:bg-skin-secondary">
            <td className="p-4 italic">{t('text-shipping')}:</td>
            <td className="p-4">
            {formatAmount({
          amount: order.shipping_total || 0,
          region: order.region,
          includeTaxes: false,
        })}
              <span className="text-[13px] font-normal ps-1.5 inline-block">
                via Flat rate
              </span>
            </td>
          </tr>
          <tr className="odd:bg-skin-secondary">
            <td className="p-4 italic">{t('text-payment-method')}:</td>
            <td className="p-4">
              {/* {order?.payment_gateway} */}
              Cash On Delivery
            </td>
          </tr>
          <tr className="odd:bg-skin-secondary">
            <td className="p-4 italic">{t('text-total')}:</td>
            <td className="p-4">
            {formatAmount({
          amount: order.total || 0,
          region: order.region,
          includeTaxes: false,
        })}
            </td>
          </tr>
          <tr className="odd:bg-skin-secondary">
            <td className="p-4 italic">{t('text-note')}:</td>
            <td className="p-4">{t('text-new-order')}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default OrderDetails;
