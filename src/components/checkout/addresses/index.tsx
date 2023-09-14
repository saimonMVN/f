import { useCheckout } from "@lib/context/checkout-context"
import { CheckBox } from "@components/ui/form/checkbox"
import BillingAddress from "./billing-address"
import Button from "@components/ui/button"
import Heading from "@components/ui/heading"
import { useTranslation } from "next-i18next"
import { useMeCustomer } from "medusa-react"
import ShippingAddress from "./shipping-address"

const Addresses = () => {
  const {t} = useTranslation();
  const { customer } = useMeCustomer()

  const {
    sameAsBilling: { state: checked, toggle: onChange },
    editAddresses: { state: isEdit, toggle: setEdit },
    setAddresses,
    handleSubmit,
    cart,
  } = useCheckout()

  const pageNumberClasses = "h-9 w-9 flex items-center justify-center rounded-full border-2 border-slate-600 text-slate-600 me-3 font-medium"

  return (
    <div className="bg-white">
      <div className="text-xl-semi flex items-center gap-x-4 px-8 pb-6 pt-8">
        <div className={pageNumberClasses}>
          1
        </div>
        <Heading>{t("text-delivery-address")}</Heading>
      </div>
      {customer && (
        <div className="ps-5 sm:ps-9 lg:ps-20 sm:pe-9 pe-5 pb-6 accordion__content">
          <div className="mb-6 flex flex-col gap-y-4  p-4">
          <ShippingAddress customer={customer} />
          </div>
          <div className="mt-6">
            <CheckBox
              label={t("text-billing-address-same")}
              checked={checked}
              onChange={onChange}
            />
          </div>
          {!checked && (
            <div>
              <div className="text-xl-semi flex items-center gap-x-4 pb-6 pt-8 px-[-10px] lg:mx-[-48px]">
                <div className={pageNumberClasses}>
                  2
                </div>
                <Heading>{t("text-billing-address")}</Heading>
              </div>
              <BillingAddress />
            </div>
          )}
        <div className="text-end">
          <Button
          variant="formButton"
            className="mt-6 bg-skin-primary text-skin-inverted rounded font-medium px-4 py-3 "
            onClick={handleSubmit(setAddresses)}
            disabled={customer?.shipping_addresses.length===0}
          >
            {t("text-continue-to-delivery")}
          </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Addresses
