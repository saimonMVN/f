import { OrderDetailsContent } from './order-details-content';
import { useUI } from '@contexts/ui.context';
import { Order } from '@medusajs/medusa';
import { formatAmount } from 'medusa-react';

const OrderDrawer: React.FC = () => {
  const { data, closeDrawer } = useUI();
  const orderData : Order = data

  const onClose = () => {
    return closeDrawer();
  };

  const { shipping_address, region } = orderData;

  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return formatAmount({ amount, region, includeTaxes: false })
  }

  return (
    <>
      {orderData && (
        <>
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-8">Order Details</h2>
            <div className="text-[14px] opacity-70 mb-3 text-skin-base">
              Delivery Address
            </div>
            <div className="rounded border border-solid min-h-[90px] bg-skin-two p-4 border-skin-two text-[12px] md:text-[14px]">
              <p className="text-skin-base opacity-70">
                {shipping_address.address_1 + ", " + shipping_address.city}
              </p>
            </div>
            <div className="flex flex-wrap w-full flex-row pt-8 pb-10 capitalize">Status: {orderData.status}</div>
            {/* <OrderStatus status={orderData?.status?.serial} /> */}
            <div className="grid grid-cols-12 bg-skin-two py-3 rounded-[3px] text-black text-[12px] md:text-[14px]">
              <div className="col-span-2 opacity-50"></div>
              <div className="col-span-5 opacity-50">Items Name</div>
              <div className="col-span-3 opacity-50 md:text-start text-center">
                Quantity
              </div>
              <div className="col-span-2 opacity-50">Price</div>
            </div>
            {orderData?.items?.map((item, index) => (
              <OrderDetailsContent key={index} item={item} region={region} />
            ))}
            <div className="mt-3 text-end">
              <div className="text-black inline-flex flex-col text-[12px] md:text-[14px]">
                <div className="mb-2 pb-1 border-b border-skin-base ps-20">
                  
                  <p className="flex justify-between mb-1">
                    <span className="me-8">Subtotal: </span>
                    <span className="font-medium">
                      {getAmount(orderData.subtotal)}
                    </span>
                  </p>

                  {typeof orderData.tax_total === 'number' && orderData.tax_total>0 && (
                  <p className="flex justify-between mb-2">
                    <span className="me-8">Tax: </span>
                    <span className="font-medium">
                      {getAmount(orderData.tax_total)}
                    </span>
                  </p>
                  )}

                  {typeof orderData?.discount_total === 'number' && orderData.discount_total>0 && (
                    <p className="flex justify-between mb-2">
                      <span className="me-8">Discount (Voucher): </span>
                      <span className="font-medium">
                      -{getAmount(orderData.discount_total)}
                      </span>
                    </p>
                  )}

                  {typeof orderData?.gift_card_total === 'number' && orderData.gift_card_total>0 && (
                    <p className="flex justify-between mb-2">
                      <span className="me-8">Discount (Gift Card): </span>
                      <span className="font-medium">
                      -{getAmount(orderData.gift_card_total)}
                      </span>
                    </p>
                  )}
                
                   <p className="flex justify-between mb-2">
                      <span className="me-8">Delivery Fee:</span>
                      <span className="font-medium">
                      {getAmount(orderData.shipping_total)}
                      </span>
                    </p>
                </div>
              
                <p className="flex justify-between ps-20 mb-2">
                  <span className="me-8">Total Cost:</span>
                  <span className="font-medium">
                  {getAmount(orderData.total)}
                  </span>
                </p>
              </div>
            </div>
            <div className="text-end mt-12 opacity-50">
              <span className="py-3 px-5 cursor-pointer inline-block text-[12px] md:text-[14px] text-black font-medium bg-white rounded border border-solid border-[#DEE5EA] me-4 hover:bg-[#F35C5C] hover:text-white hover:border-[#F35C5C] transition-all capitalize">
                Report order
              </span>
              <span
                onClick={onClose}
                className="py-3 px-5 cursor-pointer inline-block text-[12px] md:text-[14px] text-white font-medium bg-[#F35C5C] rounded border border-solid border-[#F35C5C]  hover:bg-white hover:text-black hover:border-[#DEE5EA] transition-all capitalize"
              >
                Cancel order
              </span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderDrawer;
