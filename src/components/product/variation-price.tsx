import {useTranslation} from 'next-i18next';

interface IVariationPriceProps {
    originalPrice: string;
    calculatedPrice: string;
    percentageDiff: string;
    priceType: string;
}

export default function VariationPrice({
                                           originalPrice,
                                           calculatedPrice,
                                           percentageDiff,
                                           priceType,
                                       }: IVariationPriceProps) {
    const {t} = useTranslation('common');

    return (
        <div className="flex items-center mt-5">
            <div className="text-skin-primary font-semibold text-base md:text-xl xl:text-[30px]">
                {calculatedPrice}
            </div>
            {priceType === 'sale' && (
                <>
                    <del className="text-sm md:text-15px ps-3 text-skin-base text-opacity-50">
                        {originalPrice}
                    </del>
                    <span
                        className="inline-block rounded font-semibold text-xs md:text-sm bg-skin-red text-skin-inverted uppercase px-2 py-1 ms-2.5">
            {percentageDiff} {t('text-off')}
          </span>
                </>
            )}
        </div>
    );
}

// <div className="flex items-center mt-5">
// <div className="text-skin-primary font-semibold text-base md:text-xl xl:text-[30px]">
//   {
//     ? `${price}`
//     : `${min_price} - ${max_price}`}
// </div>
// {discount && (
//   <>
//     <del className="text-sm md:text-15px ps-3 text-skin-base text-opacity-50">
//       {basePrice}
//     </del>
//     <span className="inline-block rounded font-semibold text-xs md:text-sm bg-skin-red text-skin-inverted uppercase px-2 py-1 ms-2.5">
//       {discount} {t('text-off')}
//     </span>
//   </>
// )}
// </div>
