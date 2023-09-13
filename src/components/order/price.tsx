import usePrice from '@framework/product/use-price';
import { calculateTotal } from '@contexts/cart/cart.utils';
import { formatAmount } from 'medusa-react';
import { Order } from '@medusajs/medusa';

export const TotalPrice: React.FC<{ items: Order }> = ({ items }) => {
  return <span className="total_price">
    { formatAmount({
    amount: items.total || 0,
    region: items.region,
    includeTaxes: false,
  })}</span>;
};

export const DiscountPrice = (discount: any) => {
  const { price } = usePrice({
    amount: discount?.discount,
    currencyCode: 'USD',
  });
  return <>-{price}</>;
};

export const DeliveryFee = (delivery: any) => {
  const { price } = usePrice({
    amount: delivery?.delivery,
    currencyCode: 'USD',
  });
  return <>{price}</>;
};

export const SubTotalPrice: React.FC<{ items?: any }> = ({ items }) => {
  return <>    { formatAmount({
    amount: items.subtotal || 0,
    region: items.region,
    includeTaxes: false,
  })}</>;
};
