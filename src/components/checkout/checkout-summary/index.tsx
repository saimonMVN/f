import { useCart } from "medusa-react"
import CartTotals from "../cart-totals"
import PaymentButton from "../payment-button"
import DiscountCode from "../discount-code"
import GiftCard from "../gift-card"
import CheckoutCard from "../checkout-card"

const CheckoutSummary = () => {
  const { cart } = useCart()

  if (!cart?.id) {
    return null
  }

  return (
    <div className="sticky top-0 flex flex-col">
      <div className="w-full bg-white p-6 flex flex-col gap-y-6">
        <CheckoutCard cart={cart} />
      </div>
      </div>
  )
}

export default CheckoutSummary
