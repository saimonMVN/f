import { CheckoutFormValues } from "@lib/context/checkout-context"
import { emailRegex } from "@lib/util/regex"
import { useMeCustomer } from "medusa-react"
import CountrySelect from "../country-select"
import AddressSelect from "./address-select"
import ConnectForm from "@components/ui/form/connect-form"
import Input from "@components/ui/form/input"
import AddressGrid from "@components/address/address-grid"

const ShippingAddress = () => {
  const { customer } = useMeCustomer()
  return (
    <div>
      {customer && customer.shipping_addresses?.length === 0 && (
        // <div className="mb-6 flex flex-col gap-y-4 bg-amber-100 p-4">
          <AddressGrid customer={customer} />
        // </div>
      )}
      {customer && (customer.shipping_addresses?.length || 0) > 0 && (
        <div className="mb-6 flex flex-col gap-y-4 bg-amber-100 p-4">
          <p className="text-small-regular">
            {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
          </p>
          <AddressSelect addresses={customer.shipping_addresses} />
        </div>
      )}
      {customer && (customer.shipping_addresses?.length || 0 ) > 0 &&
      <ConnectForm<CheckoutFormValues>>
        {({ register, formState: { errors, touchedFields } }) => (
          <div className="grid grid-cols-1 gap-y-2">
            <Input
              label="Email"
              {...register("email", {
                required: "Email is required",
                pattern: emailRegex,
              })}
              autoComplete="email"
              error={errors.email?.message}
            />
            <div className="grid grid-cols-2 gap-x-2">
              <Input
                label="First name"
                {...register("shipping_address.first_name", {
                  required: "First name is required",
                })}
                autoComplete="given-name"
                error={errors.shipping_address?.first_name?.message}
              />
              <Input
                label="Last name"
                {...register("shipping_address.last_name", {
                  required: "Last name is required",
                })}
                autoComplete="family-name"
                error={errors.shipping_address?.last_name?.message}
              />
            </div>
            <Input
              label="Company"
              {...register("shipping_address.company")}
              autoComplete="organization"
              error={errors.shipping_address?.company?.message}
            />
            <Input
              label="Address"
              {...register("shipping_address.address_1", {
                required: "Address is required",
              })}
              autoComplete="address-line1"
              error={errors.shipping_address?.address_1?.message}
            />
            <Input
              label="Apartments, suite, etc."
              {...register("shipping_address.address_2")}
              autoComplete="address-line2"
              error={errors.shipping_address?.address_2?.message}
            />
            <div className="grid grid-cols-[122px_1fr] gap-x-2">
              <Input
                label="Postal code"
                {...register("shipping_address.postal_code", {
                  required: "Postal code is required",
                })}
                autoComplete="postal-code"
                error={errors.shipping_address?.postal_code?.message}
                />
              <Input
                label="City"
                {...register("shipping_address.city", {
                  required: "City is required",
                })}
                autoComplete="address-level2"
                error={errors.shipping_address?.city?.message}
                />
            </div>
            <CountrySelect
              {...register("shipping_address.country_code", {
                required: "Country is required",
              })}
              autoComplete="country"
              errors={errors}
            />
            <Input
              label="State / Province"
              {...register("shipping_address.province")}
              autoComplete="address-level1"
              error={errors.shipping_address?.province?.message}
            />
            <Input
              label="Phone"
              {...register("shipping_address.phone")}
              autoComplete="tel"
              error={errors.shipping_address?.phone?.message}
            />
          </div>
        )}
      </ConnectForm>
      }
    </div>
  )
}

export default ShippingAddress
