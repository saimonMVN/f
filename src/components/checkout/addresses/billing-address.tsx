import { CheckoutFormValues } from "@lib/context/checkout-context"
import CountrySelect from "../country-select"
import ConnectForm from "@components/ui/form/connect-form"
import Input from "@components/ui/form/input"

const BillingAddress = () => {
  return (
    <ConnectForm<CheckoutFormValues>>
      {({ register, formState: { errors, touchedFields } }) => (
        <div className="grid grid-cols-1 gap-y-2">
          <div className="grid grid-cols-2 gap-x-2">
            <Input
              label="First name"
              {...register("billing_address.first_name", {
                required: "First name is required",
              })}
              autoComplete="given-name"
              error={errors.billing_address?.first_name?.message}
            />
            <Input
              label="Last name"
              {...register("billing_address.last_name", {
                required: "Last name is required",
              })}
              autoComplete="family-name"
              error={errors.billing_address?.last_name?.message}
            />
          </div>
          <Input
            label="Company"
            {...register("billing_address.company")}
            autoComplete="organization"
            error={errors.billing_address?.company?.message}
          />
          <Input
            label="Address"
            {...register("billing_address.address_1", {
              required: "Address is required",
            })}
            autoComplete="address-line1"
            error={errors.billing_address?.address_1?.message}
          />
          <Input
            label="Apartments, suite, etc."
            {...register("billing_address.address_2")}
            autoComplete="address-line2"
            error={errors.billing_address?.address_2?.message}
          />
          <div className="grid grid-cols-[144px_1fr] gap-x-2">
            <Input
              label="Postal code"
              {...register("billing_address.postal_code", {
                required: "Postal code is required",
              })}
              autoComplete="postal-code"
              error={errors.billing_address?.postal_code?.message}
            />
            <Input
              label="City"
              {...register("billing_address.city", {
                required: "City is required",
              })}
              autoComplete="address-level2"
              error={errors.billing_address?.city?.message}
            />
          </div>
          <CountrySelect
            {...register("billing_address.country_code", {
              required: "Country is required",
            })}
            autoComplete="country"
            errors={errors}
          />
          <Input
            label="State / Province"
            {...register("billing_address.province")}
            autoComplete="address-level1"
            error={errors.billing_address?.province?.message}
          />
          <Input
            label="Phone"
            {...register("billing_address.phone")}
            autoComplete="tel"
            error={errors.billing_address?.phone?.message}
          />
        </div>
      )}
    </ConnectForm>
  )
}

export default BillingAddress
