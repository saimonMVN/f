import { medusaClient } from "@lib/config"
import { Cart } from "@medusajs/medusa"
import { formatAmount, useCart, useUpdateCart } from "medusa-react"
import React, { useMemo } from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import TrashIcon from "@components/icons/trash-icon"
import Input from "@components/ui/form/input"
import Button from "@components/ui/button"

type DiscountFormValues = {
  discount_code: string
}

type DiscountCodeProps = {
  cart: Omit<Cart, "refundable_amount" | "refunded_total">
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const { id, discounts, region } = cart
  const { mutate, isLoading } = useUpdateCart(id)
  const { setCart } = useCart()

  const { isLoading: mutationLoading, mutate: removeDiscount } = useMutation(
    (payload: { cartId: string; code: string }) => {
      return medusaClient.carts.deleteDiscount(payload.cartId, payload.code)
    }
  )

  const appliedDiscount = useMemo(() => {
    if (!discounts || !discounts.length) {
      return undefined
    }

    switch (discounts[0].rule.type) {
      case "percentage":
        return `${discounts[0].rule.value}%`
      case "fixed":
        return `- ${formatAmount({
          amount: discounts[0].rule.value,
          region: region,
        })}`

      default:
        return "Free shipping"
    }
  }, [discounts, region])

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<DiscountFormValues>({
    mode: "onSubmit",
  })

  const onApply = (data: DiscountFormValues) => {
    mutate(
      {
        discounts: [{ code: data.discount_code }],
      },
      {
        onSuccess: ({ cart }) => setCart(cart),
        onError: () => {
          setError(
            "discount_code",
            {
              message: "Code is invalid",
            },
            {
              shouldFocus: true,
            }
          )
        },
      }
    )
  }

  const onRemove = () => {
    removeDiscount(
      { cartId: id, code: discounts[0].code },
      {
        onSuccess: ({ cart }) => {
          setCart(cart)
        },
      }
    )
  }

  return (
    <div className="w-full bg-white flex flex-col mt-8 mb-4">
      <div className="text-sm">
        {appliedDiscount ? (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-700">Code: </span>
              <span className="font-semibold">{appliedDiscount}</span>
            </div>
            <div>
              <button
                className="flex items-center gap-x-2"
                onClick={onRemove}
                disabled={isLoading}
              >
                <TrashIcon width="16" height="16" />
                <span className="sr-only">Remove gift card from order</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onApply)} className="w-full">
            <div className="grid grid-cols-[1fr_80px] items-center gap-x-2">
              <Input
                placeholder="Voucher Code"
                {...register("discount_code", {
                  required: "Code is required",
                })}
                error={errors.discount_code?.message}
              />
                <Button className="!h-10"
                  disabled={isLoading}
                  loading={isLoading}
                >
                  Apply
                </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default DiscountCode