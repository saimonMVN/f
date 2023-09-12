import { PricedVariant } from "@medusajs/medusa/dist/types/pricing"

export const isSingleVariantInStockOrBackorder = (variants: PricedVariant[] | null): boolean => {
  if (!variants || variants.length !== 1) {
    return false;
  }

  const singleVariant = variants[0];

  return (
    (singleVariant.inventory_quantity !== undefined && singleVariant.inventory_quantity > 0) ||
    (singleVariant.allow_backorder !== undefined && singleVariant.allow_backorder)
  );
};
