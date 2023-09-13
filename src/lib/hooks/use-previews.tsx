import transformProductPreview from "@lib/util/transform-product-preview"
import { Product, Region } from "@medusajs/medusa"
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing"
import { useMemo } from "react"
import { InfiniteProductPage, ProductPreviewType } from "../../interfaces/global"

type UsePreviewProps<T> = {
  products?: PricedProduct[]
  region?: Region
}

const usePreviews = <T extends InfiniteProductPage>({
  products,
  region,
}: UsePreviewProps<T>) => {

  console.log(products, region)
  const previews: ProductPreviewType[] = useMemo(() => {
    if (!products || !region) {
      return []
    }

    const transformedProducts = products.map((p) =>
      transformProductPreview(p, region)
    )

    return transformedProducts
  }, [products, region])

  return previews
}

export default usePreviews