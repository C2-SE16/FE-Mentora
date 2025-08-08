import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/format';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

interface CartSummaryProps {
  total: number;
  selectedCount: number;
  totalSelected: number;
  couponCode: string;
  onCouponChange: (value: string) => void;
  onApplyCoupon: () => void;
  onCheckout: () => void;
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
  processing?: boolean;
}

export function CartSummary({
  total,
  selectedCount,
  totalSelected,
  couponCode,
  onCouponChange,
  onApplyCoupon,
  onCheckout,
  onSelectAll,
  allSelected,
  processing = false,
}: CartSummaryProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Tổng cộng</h2>

      <div className="mb-4">
        <div className="flex items-center mb-4">
          <Checkbox 
            checked={allSelected}
            onCheckedChange={(checked) => onSelectAll(!!checked)}
            id="select-all"
            className="mr-2"
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Chọn tất cả khóa học
          </label>
        </div>

        <div className="flex justify-between mb-2">
          <span>Số khóa học đã chọn</span>
          <span>{selectedCount}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Tổng tiền khóa học đã chọn</span>
          <span>{formatCurrency(totalSelected)}</span>
        </div>

        <div className="flex justify-between mb-2">
          <span>Tổng tiền tất cả khóa học</span>
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
        <Button variant="outline" onClick={onApplyCoupon} className="w-full">
          Áp dụng
        </Button>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Tổng tiền thanh toán</span>
          <span className="font-semibold text-xl text-primary">{formatCurrency(totalSelected)}</span>
        </div>

        <Button 
          onClick={onCheckout} 
          className="w-full"
          disabled={selectedCount === 0 || processing}
        >
          {processing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>Thanh toán ({selectedCount} khóa học)</>
          )}
        </Button>
      </div>
    </div>
  );
}
