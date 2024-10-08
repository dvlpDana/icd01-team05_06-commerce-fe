import SortOptionSelect from './sort-option-select';
import OrderStatusSelect from './order-status-select';
import OrderTable from './order-table';

const OrderInfo = () => {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex justify-end gap-4">
        <div className="flex items-center gap-2">
          <span>정렬기준</span>
          <SortOptionSelect />
        </div>
        <div className="flex items-center gap-2">
          <span>주문상태</span>
          <OrderStatusSelect />
        </div>
      </div>
      <OrderTable />
      <div className="flex flex-col gap-1">
        <p>
          - 발송 전 주문은 주문상세내역에서 주문취소, 배송 주소 변경(국내배송만 해당)이 가능합니다.
        </p>
        <p>- 주문번호를 클릭하시면 주문상세내역을 확인하실 수 있습니다.</p>
      </div>
    </div>
  );
};

export default OrderInfo;
