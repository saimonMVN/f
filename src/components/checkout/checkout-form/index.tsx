import { useCart } from "medusa-react"
import Addresses from "../addresses"
import Shipping from "../shipping"
import Payment from "../payment"

const CheckoutForm = () => {
  const { cart } = useCart()

  if (!cart?.id) {
    return null
  }

  return (
    <div className="border border-skin-base bg-skin-fill rounded-md">
      <div className="w-full grid grid-cols-1 gap-y-8">
        <div>
          <Addresses />
        </div>

        <div>
          <Shipping cart={cart} />
        </div>

        <div>
          <Payment />
        </div>
      </div>
    </div>
  )
}

export default CheckoutForm
