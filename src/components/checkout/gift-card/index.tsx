import TrashIcon from "@components/icons/trash-icon"
import Button from "@components/ui/button"
import Input from "@components/ui/form/input"
import { Cart } from "@medusajs/medusa"
import { useCart } from "medusa-react"
import React, { useMemo } from "react"
import { useForm } from "react-hook-form"

type GiftCardFormValues = {
  gift_card_code: string
}

type GiftCardProps = {
  cart?: Omit<Cart, "refundable_amount" | "refunded_total">
}

const GiftCard: React.FC<GiftCardProps> = ({ cart }) => {
  const {
    updateCart: { mutate, isLoading },
    setCart,
  } = useCart()

  const {
    register,
    handleSubmit,
    formState: { touchedFields, errors },
    setError,
  } = useForm<GiftCardFormValues>()

  const appliedGiftCard = useMemo(() => {
    if (!cart || !cart.gift_cards?.length) {
      return undefined
    }

    return cart.gift_cards[0].code
  }, [cart])

  const onSubmit = (data: GiftCardFormValues) => {
    mutate(
      {
        gift_cards: [{ code: data.gift_card_code }],
      },
      {
        onSuccess: ({ cart }) => setCart(cart),
        onError: () => {
          setError(
            "gift_card_code",
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
    mutate(
      {
        gift_cards: [],
      },
      {
        onSuccess: ({ cart }) => setCart(cart),
      }
    )
  }

  return (
    <div className="w-full bg-white flex flex-col my-4">
      <div className="text-sm">
        {appliedGiftCard ? (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-700">Code: </span>
              <span className="font-semibold">{appliedGiftCard}</span>
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
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="grid grid-cols-[1fr_80px] items-center gap-x-2">
              <Input
                placeholder="Gift Card Code"
                {...register("gift_card_code", {
                  required: "Code is required",
                })}
                error={errors.gift_card_code?.message}
              />
                <Button
                  className="!h-10"
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

export default GiftCard
