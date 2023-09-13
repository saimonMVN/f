import Link from '@components/ui/link';
import Image from '@components/ui/image';
import { IoIosCloseCircle } from 'react-icons/io';
import Counter from '@components/ui/counter';
import { LineItem, Region } from '@medusajs/medusa';
import { useStore } from '@lib/context/store-context';
import { formatAmount } from 'medusa-react';

type CartItemProps = {
  item: Omit<LineItem, "beforeInsert">;
  region: Region
};

const CartItem: React.FC<CartItemProps> = ({ item, region }) => {
  const { deleteItem, updateItem } = useStore()

  const outOfStock = item.variant.inventory_quantity <= item.quantity;  
  return (
    <div
      className={`group w-full h-auto flex justify-start items-center bg-skin-fill py-4 md:py-7 border-b border-skin-one border-opacity-70 relative last:border-b-0`}
      title={item.title}
    >
      <div className="relative flex rounded overflow-hidden flex-shrink-0 cursor-pointer w-[90px] md:w-[100px] h-[90px] md:h-[100px]">
        <Image
          src={item?.thumbnail ?? '/assets/placeholder/cart-item.svg'}
          width={100}
          height={100}
          loading="eager"
          alt={item.title || 'Product Image'}
          className="object-cover bg-skin-thumbnail"
        />
        <div
          className="absolute top-0 start-0 h-full w-full bg-black bg-opacity-30 md:bg-opacity-0 flex justify-center items-center transition duration-200 ease-in-out md:group-hover:bg-opacity-30"
          onClick={() => deleteItem(item.id)}
          role="button"
        >
          <IoIosCloseCircle className="relative text-white text-2xl transform md:scale-0 md:opacity-0 transition duration-300 ease-in-out md:group-hover:scale-100 md:group-hover:opacity-100" />
        </div>
      </div>

      <div className="flex w-full overflow-hidden items-start justify-between">
        <div className="ps-3 md:ps-4">
          <Link
            href={`#`}
            className="block text-skin-base text-13px sm:text-sm mb-2 lg:text-15px transition-all leading-5 hover:text-skin-primary"
          >
            {item?.title}
          </Link>
          <div className="text-13px sm:text-sm text-skin-muted mt-1.5 block mb-2">
          {formatAmount({
          amount: item.unit_price || 0,
          region: region,
          includeTaxes: false,
        })} x {item.quantity}
          </div>
          <Counter
            value={item.quantity}
            onIncrement={() => updateItem({
              lineId: item.id,
              quantity: item.quantity + 1,
            })}
            onDecrement={() => updateItem({
              lineId: item.id,
              quantity: item.quantity - 1,
            })}
            variant="cart"
            disabled={outOfStock}
          />
        </div>

        <div className='flex flex-col'>
        <div className="flex font-normal text-base md:text-base text-skin-base leading-5 flex-shrink-0 min-w-[65px] md:min-w-[80px] justify-end">
        {formatAmount({
          amount: item.subtotal || 0,
          region: region,
          includeTaxes: false,
        })}
        </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
