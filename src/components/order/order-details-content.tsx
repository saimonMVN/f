import usePrice from '@framework/product/use-price';
import Image from '@components/ui/image';
import { LineItem, Region } from '@medusajs/medusa';
import { productGalleryPlaceholder } from '@assets/placeholders';
import LineItemPrice from './line-item-price';

export const OrderDetailsContent: React.FC<{ item: LineItem, region: Region }> = ({ item, region }) => {
  return (
    <div className="relative grid grid-cols-12 py-2 pb-0 border-b border-solid border-skin-base text-[12px] md:text-[14px]">
      <div className="col-span-2 self-center">
        <Image
          src={item.thumbnail ?? productGalleryPlaceholder}
          alt={item?.title || 'Product Image'}
          width="60"
          height="60"
          quality={100}
          className="object-cover"
        />
      </div>
      <div className="col-span-5 self-center">
        <h2 className="text-skin-base">{item?.title}</h2>
      </div>
      <div className="col-span-3 self-center md:text-start text-center">
        {typeof item.quantity === 'number' && <p>{item.quantity}x</p>}
      </div>
      <div className="col-span-2 self-center">
      <LineItemPrice region={region} item={item} />
      </div>
    </div>
  );
};
