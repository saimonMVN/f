import Image from '@components/ui/image';
import { generateCartItemName } from '@utils/generate-cart-item-name';
import usePrice from '@framework/product/use-price';
import { LineItem, Region } from '@medusajs/medusa';
import { formatAmount } from 'medusa-react';
import { shortenText } from '@utils/shorten-text';

type CartItemProps = {
  item: Omit<LineItem, "beforeInsert">;
  region: Region
};
const CheckoutItem: React.FC<CartItemProps> = ({ item, region }) => {
  const price = formatAmount({
    amount: item.unit_price || 0,
    region: region,
    includeTaxes: false,
  })
  return (
    <div className="flex py-4 items-center  border-b border-skin-base ">
      <div className="flex border rounded-md border-skin-base  w-16 h-16 flex-shrink-0">
        <Image
          src={item.thumbnail ?? '/assets/placeholder/order-product.svg'}
          alt={'item image'}
          className="rounded-md me-5"
          width={64}
          height={64}
        />
      </div>
      <h6 className="text-15px text-skin-base font-normal ps-3">
        {shortenText(item.title, 40)}
      </h6>
      <div className="flex ms-auto text-15px text-skin-base font-normal  ps-2 flex-shrink-0">
        {price}
      </div>
    </div>
  );
  }

export default CheckoutItem