import { useCheckout } from "@lib/context/checkout-context"
import ShippingAddress from "./shippping-address"
import { CheckBox } from "@components/ui/form/checkbox"
import BillingAddress from "./billing-address"
import Button from "@components/ui/button"
import { FaSpinner } from "react-icons/fa"
import Heading from "@components/ui/heading"
import { useTranslation } from "next-i18next"
import { BiEdit } from "react-icons/bi"
import { RadioGroup } from "@headlessui/react"
import { TiPencil } from "react-icons/ti"
import { useMeCustomer } from "medusa-react"

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
      {isEdit || (customer && customer.shipping_addresses.length===0) ? (
        <div className="ps-5 sm:ps-9 lg:ps-20 sm:pe-9 pe-5 pb-6 accordion__content">
          <ShippingAddress />
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
      ) : (
        <div>
          <div className="ps-5 sm:ps-9 lg:ps-20 sm:pe-9 pe-5 pb-6 accordion__content">
            {cart && cart.shipping_address ? (
              <div className="flex items-start gap-x-8  border-2 relative shadow-md focus:outline-none rounded-md p-5 border-skin-base min-h-[112px] h-full group address__box">
                <div className="flex items-start justify-between w-full">
                  <div className="flex flex-col">
                    <span>
                      {cart.shipping_address.first_name}{" "}
                      {cart.shipping_address.last_name}
                    </span>
                    <span>
                      {cart.shipping_address.address_1}{" "}
                      {cart.shipping_address.address_2}
                    </span>
                    <span>
                      {cart.shipping_address.postal_code},{" "}
                      {cart.shipping_address.city}
                    </span>
                    <span>
                      {cart.shipping_address.country_code?.toUpperCase()}
                    </span>
                    <div className="mt-4 flex flex-col">
                      <span>{cart.shipping_address.phone}</span>
                      <span>{cart.email}</span>
                    </div>
                    {checked && (
                      <div className="flex items-center gap-x-2 mt-6">
                        <div className="flex items-center justify-center border border-gray-700 bg-gray-100 w-4 h-4">
                          ✓
                        </div>
                        <span>{t("text-billing-address-same")}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex absolute end-3 top-3 z-10 lg:opacity-0 transition-all address__actions">
                <button onClick={setEdit}
                  className="flex justify-center items-center bg-skin-primary h-6 w-6 rounded-full text-skin-inverted text-opacity-80 text-base"
                >
                  <TiPencil />
                </button>
              </div>
                </div>
              </div>
            ) : (
              <div>
                <FaSpinner />
              </div>
            )}
          </div>
          {!checked && (
            <div>
              <div className="text-xl-semi flex items-center gap-x-4 px-8 pb-6 pt-8">
                <div className={pageNumberClasses}>
                  2
                </div>
                <Heading>{t("text-billing-address")}</Heading>
              </div>
              <div className="ps-5 sm:ps-9 lg:ps-20 sm:pe-9 pe-5 pb-6 accordion__content">
                {cart && cart.billing_address ? (
                  <div className="flex items-start gap-x-8  border-2 relative shadow-md focus:outline-none rounded-md p-5 border-skin-base min-h-[112px] h-full group address__box">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex flex-col">
                        <span>
                          {cart.billing_address.first_name}{" "}
                          {cart.billing_address.last_name}
                        </span>
                        <span>
                          {cart.billing_address.address_1}{" "}
                          {cart.billing_address.address_2}
                        </span>
                        <span>
                          {cart.billing_address.postal_code},{" "}
                          {cart.billing_address.city}
                        </span>
                        <span>
                          {cart.billing_address.country_code?.toUpperCase()}
                        </span>

                        <div className="mt-4 flex flex-col">
                          <span>{cart.billing_address.phone}</span>
                        </div>
                      </div>
                      <div className="flex absolute end-3 top-3 z-10 lg:opacity-0 transition-all address__actions">
                <button onClick={setEdit}
                  className="flex justify-center items-center bg-skin-primary h-6 w-6 rounded-full text-skin-inverted text-opacity-80 text-base"
                >
                  <TiPencil />
                </button>
              </div>
                    </div>
                  </div>
                ) : (
                  <div className="">
                    <FaSpinner />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Addresses
