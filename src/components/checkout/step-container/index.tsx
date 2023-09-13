import { Disclosure } from "@headlessui/react"
import { useCheckout } from "@lib/context/checkout-context"
import clsx from "clsx"

type StepContainerProps = {
  index: number
  title: string
  closedState?: React.ReactNode
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

const StepContainer = ({
  index,
  title,
  className,
  closedState,
  children,
  ...props
}: StepContainerProps) => {
  const {
    editAddresses: { state },
  } = useCheckout()

  const pageNumberClasses = "h-9 w-9 flex items-center justify-center rounded-full border-2 border-slate-600 text-slate-600 me-3 font-medium"
  return (
    <div>
      <div
        className={clsx("bg-white", className, {
          "opacity-50 pointer-events-none select-none": state,
        })}
        {...props}
      >
        <div className="text-xl-semi flex items-center gap-x-4 px-8 pb-6 pt-8">
          <div className={pageNumberClasses}>
            {index}
          </div>
          <h2>{title}</h2>
        </div>
        <Disclosure>
          <Disclosure.Panel
            static
            className={clsx(
              "transition-[max-height,opacity] duration-700 ease-in-out overflow-hidden",
              {
                "max-h-[9999px] opacity-100": !state,
                "max-h-0 opacity-0": state,
              }
            )}
          >
            {children}
          </Disclosure.Panel>
          <Disclosure.Panel
            static
            className={clsx(
              "transition-[max-height,opacity] duration-700 ease-in-out overflow-hidden",
              {
                "max-h-[9999px] opacity-100": state,
                "max-h-0 opacity-0": !state,
              }
            )}
          >
            {closedState}
          </Disclosure.Panel>
        </Disclosure>
      </div>
    </div>
  )
}

export default StepContainer
