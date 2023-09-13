import { FiAlertCircle } from "react-icons/fi"

const PaymentTest = () => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-x-2 bg-yellow-100 w-full p-2">
        <FiAlertCircle size={16} className="text-yellow-700" />
        <span className="text-small-regular text-yellow-700">
          <span className="font-semibold">Attention:</span> For testing purposes
          only.
        </span>
      </div>
    </div>
  )
}

export default PaymentTest
