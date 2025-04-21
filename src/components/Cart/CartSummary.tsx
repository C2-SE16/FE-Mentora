import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/format';

interface CartSummaryProps {
  total: number;
  couponCode: string;
  onCouponChange: (value: string) => void;
  onApplyCoupon: () => void;
  onCheckout: () => void;
}

export function CartSummary({
  total,
  couponCode,
  onCouponChange,
  onApplyCoupon,
  onCheckout,
}: CartSummaryProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Tổng cộng</h2>
      
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span>Tạm tính</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Nhập mã giảm giá"
          value={couponCode}
          onChange={(e) => onCouponChange(e.target.value)}
          className="mb-2"
        />
        <Button
          variant="outline"
          onClick={onApplyCoupon}
          className="w-full"
        >
          Áp dụng
        </Button>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Tổng tiền</span>
          <span className="font-semibold text-xl text-primary">
            {formatCurrency(total)}
          </span>
        </div>

        <Button onClick={onCheckout} className="w-full">
          Thanh toán
        </Button>
      </div>
    </div>
  );
} 