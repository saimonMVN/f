import Counter from '@components/ui/counter';
import { useCart } from '@contexts/cart/cart.context';
import { generateCartItem } from '@utils/generate-cart-item';
import PlusIcon from '@components/icons/plus-icon';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import { useStore } from 'src/lib/context/store-context';
interface Props {
  isBorderRounded?: boolean;
  variantId: string;
  quantity: number;
}

export const AddToCart = ({ variantId, quantity, isBorderRounded }: Props) => {
  const { width } = useWindowSize();
  const { t } = useTranslation('common');
  const { addItem } = useStore()

  const item = {
    variantId,
    quantity
  }

  const handleAddClick = (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => {
    e.stopPropagation();
    addItem(item);
  };
  return (
    <button
    className={`min-w-[150px] px-4 py-2 bg-skin-primary text-skin-inverted text-[13px] items-center justify-center focus:outline-none focus-visible:outline-none ${isBorderRounded ? 'rounded': 'rounded-full'}`}
    aria-label="Count Button"
    onClick={handleAddClick}
      // disabled={disabled || outOfStock}
    >
      {t('text-add-to-cart')}
    </button>
  )
};
