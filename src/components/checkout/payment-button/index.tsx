import Button from "@components/ui/button"
import { useCheckout } from "@lib/context/checkout-context"
import { PaymentSession } from "@medusajs/medusa"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import { useCart } from "medusa-react"
import React, { useEffect, useState } from "react"
import { FaSpinner } from "react-icons/fa"

type PaymentButtonProps = {
  paymentSession?: PaymentSession | null
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ paymentSession }) => {
  const [notReady, setNotReady] = useState(true)
  const { cart } = useCart()

  useEffect(() => {
    setNotReady(true)

    if (!cart) {
      return
    }

    if (!cart.shipping_address) {
      return
    }

    if (!cart.billing_address) {
      return
    }

    if (!cart.email) {
      return
    }

    if (cart.shipping_methods.length < 1) {
      return
    }

    setNotReady(false)
  }, [cart])

  switch (paymentSession?.provider_id) {
    case "stripe":
      return (
        <StripePaymentButton session={paymentSession} notReady={notReady} />
      )
    case "manual":
      return <ManualTestPaymentButton notReady={notReady} />
    // case "paypal":
    //   return (
    //     <PayPalPaymentButton notReady={notReady} session={paymentSession} />
    //   )
    default:
      return <Button
      variant="formButton"
      className={`w-full bg-skin-primary text-skin-inverted rounded font-semibold px-4 py-3 transition-all opacity-40 cursor-not-allowed'
      }`} disabled>Select a payment method</Button>
  }
}

const StripePaymentButton = ({
  session,
  notReady,
}: {
  session: PaymentSession
  notReady: boolean
}) => {
  const [disabled, setDisabled] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  )

  const { cart } = useCart()
  const { onPaymentCompleted } = useCheckout()

  const stripe = useStripe()
  const elements = useElements()
  const card = elements?.getElement("cardNumber")

  useEffect(() => {
    if (!stripe || !elements) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [stripe, elements])

  const handlePayment = async () => {
    setSubmitting(true)

    if (!stripe || !elements || !card || !cart) {
      setSubmitting(false)
      return
    }

    await stripe
      .confirmCardPayment(session.data.client_secret as string, {
        payment_method: {
          card: card,
          billing_details: {
            name:
              cart.billing_address.first_name +
              " " +
              cart.billing_address.last_name,
            address: {
              city: cart.billing_address.city ?? undefined,
              country: cart.billing_address.country_code ?? undefined,
              line1: cart.billing_address.address_1 ?? undefined,
              line2: cart.billing_address.address_2 ?? undefined,
              postal_code: cart.billing_address.postal_code ?? undefined,
              state: cart.billing_address.province ?? undefined,
            },
            email: cart.email,
            phone: cart.billing_address.phone ?? undefined,
          },
        },
      })
      .then(({ error, paymentIntent }) => {
        if (error) {
          const pi = error.payment_intent

          if (
            (pi && pi.status === "requires_capture") ||
            (pi && pi.status === "succeeded")
          ) {
            onPaymentCompleted()
          }

          setErrorMessage(error.message)
          return
        }

        if (
          (paymentIntent && paymentIntent.status === "requires_capture") ||
          paymentIntent.status === "succeeded"
        ) {
          return onPaymentCompleted()
        }

        return
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  return (
    <>
      <Button
         variant="formButton"
         className={`w-full bg-skin-primary text-skin-inverted rounded font-semibold px-4 py-3 transition-all ${
         (submitting || disabled || notReady) && 'opacity-40 cursor-not-allowed'
         }`}
        disabled={submitting || disabled || notReady}
        onClick={handlePayment}
      >
        {submitting ? <FaSpinner /> : "Order Now"}
      </Button>
      {errorMessage && (
        <div className="text-red-500 text-small-regular mt-2">
          {errorMessage}
        </div>
      )}
    </>
  )
}

const ManualTestPaymentButton = ({ notReady }: { notReady: boolean }) => {
    const [submitting, setSubmitting] = useState(false)
  
    const { onPaymentCompleted } = useCheckout()
  
    const handlePayment = () => {
      setSubmitting(true)
  
      onPaymentCompleted()
  
      setSubmitting(false)
    }
  
    return (
      <Button
      variant="formButton"
      className={`w-full bg-skin-primary text-skin-inverted rounded font-semibold px-4 py-3 transition-all ${
      (submitting || notReady) && 'opacity-40 cursor-not-allowed'
      }`}
     disabled={submitting || notReady}
     onClick={handlePayment}>
        {submitting ? <FaSpinner /> : "Order Now"}
      </Button>
    )
  }
  
  
export default PaymentButton
