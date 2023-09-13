import { useModalAction } from "@components/common/modal/modal.context"
import Radio from "@components/ui/radio"
import { Listbox, Transition } from "@headlessui/react"
import { useCheckout } from "@lib/context/checkout-context"
import { Address } from "@medusajs/medusa"
import clsx from "clsx"
import { isEqual, omit } from "lodash"
import { Fragment, useMemo, useState } from "react"
import { useWatch } from "react-hook-form"
import { BiChevronDown } from "react-icons/bi"
import { TiPencil } from "react-icons/ti"

type AddressSelectProps = {
  addresses: Address[]
}

const AddressSelect = ({ addresses }: AddressSelectProps) => {
  const [selected, setSelected] = useState<string | undefined>(undefined)
  const { openModal } = useModalAction();
  function handlePopupView(item: any) {
    openModal('ADDRESS_VIEW_AND_EDIT', item);
  }

  const { control, setSavedAddress } = useCheckout()

  const handleSelect = (id: string) => {
    const savedAddress = addresses.find((a) => a.id === id)

    if (savedAddress) {
      setSavedAddress(savedAddress)
    }

    setSelected(id)
  }

  const currentShippingAddress = useWatch({
    control,
    name: "shipping_address",
  })

  const selectedAddress = useMemo(() => {
    for (const address of addresses) {
      const checkEquality = isEqual(
        omit(address, [
          "id",
          "created_at",
          "updated_at",
          "country",
          "deleted_at",
          "metadata",
          "customer_id",
        ]),
        currentShippingAddress
      )

      if (checkEquality) {
        return address
      }
    }
  }, [currentShippingAddress, addresses])

  return (
    <Listbox onChange={handleSelect} value={selected}>
      <div className="relative">
        <Listbox.Button className="relative w-full flex justify-between items-center px-4 py-[10px] text-left bg-white cursor-default focus:outline-none border border-gray-200 focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-gray-300 focus-visible:ring-offset-2 focus-visible:border-gray-300 text-base-regular">
          {({ open }) => (
            <>
              <span className="block truncate">
                {selectedAddress
                  ? selectedAddress.address_1
                  : "Choose an address"}
              </span>
              <BiChevronDown
                size={16}
                className={clsx({ "transform rotate-180": open })}
              />
            </>
          )}
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-20 w-full overflow-auto text-small-regular bg-white border border-gray-200 border-top-0 max-h-60 focus:outline-none sm:text-sm">
            {addresses.map((address) => {
              return (
                <Listbox.Option
                  key={address.id}
                  value={address.id}
                  className="cursor-default select-none relative pl-6 pr-10 hover:bg-gray-50 py-4"
                >
                  <div className="flex justify-between">
                    <div className="flex gap-x-4 items-start">
                    <Radio checked={selected === address.id} />
                    <div className="flex flex-col">
                      <span className="text-left text-base-semi">
                        {address.first_name} {address.last_name}
                      </span>
                      {address.company && (
                        <span className="text-small-regular text-gray-700">
                          {address.company}
                        </span>
                      )}
                      <div className="flex flex-col text-left text-base-regular mt-2">
                        <span>
                          {address.address_1}
                          {address.address_2 && (
                            <span>, {address.address_2}</span>
                          )}
                        </span>
                        <span>
                          {address.postal_code}, {address.city}
                        </span>
                        <span>
                          {address.province && `${address.province}, `}
                          {address.country_code?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    </div>
                    <div className="flex absolute end-3 top-3 z-10 transition-all shipping_address__actions">
                <button
                  onClick={() => handlePopupView(address)}
                  className="flex justify-center items-center bg-skin-primary h-6 w-6 rounded-full text-skin-inverted text-opacity-80 text-base"
                >
                  <TiPencil />
                </button>
              </div>
                  </div>
                </Listbox.Option>
              )
            })}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export default AddressSelect
