'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axiosInstance from '@/lib/api/axios';
import { toast } from 'react-hot-toast';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the form validation schema
const formSchema = z.object({
  code: z.string().min(6, 'Mã phải có ít nhất 6 ký tự'),
  description: z.string().optional(),
  discountType: z.enum(['Percentage', 'Fixed']),
  discountValue: z.coerce.number().positive('Giá trị giảm giá phải là số dương'),
  maxDiscount: z.coerce.number().optional(),
  startDate: z.date({
    required_error: 'Ngày bắt đầu là bắt buộc',
  }),
  endDate: z
    .date({
      required_error: 'Ngày kết thúc là bắt buộc',
    })
    .refine((date) => date > new Date(), {
      message: 'Ngày kết thúc phải trong tương lai',
    }),
  maxUsage: z.coerce.number().int().optional(),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface AppliedVoucherData {
  voucher: {
    code: string;
    discountType: string;
    discountValue: number;
  };
  discountedCourses: Array<{
    courseId: string;
    title: string;
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
  }>;
  totalDiscount: number;
  totalFinalPrice: number;
}

const PromotionsPage = () => {
  const params = useParams();
  const courseId = typeof params?.courseId === 'string' ? params?.courseId : '';
  const [isLoading, setIsLoading] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucherData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      code: '',
      description: '',
      discountType: 'Percentage',
      discountValue: 0,
      maxDiscount: undefined,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      maxUsage: undefined,
      isActive: true,
    },
  });

  const generateVoucherCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setValue('code', code);
  };

  // Function to apply voucher and save to database
  const applyVoucherAndSaveToDB = async (voucherCode: string) => {
    try {
      const response = await axiosInstance.post('voucher/apply-and-save-db', {
        code: voucherCode,
        courseIds: courseId, // Gửi như string vì backend expect string
      });
      console.log('response applyVoucherAndSaveToDB:::', response);
      if (response.data.statusCode === 201) {
        setAppliedVoucher(response.data.data.data);
        toast.success('Áp dụng mã giảm giá thành công và đã lưu vào database!');
        return response.data.data.data;
      } else {
        toast.error('Không thể áp dụng mã giảm giá');
        return null;
      }
    } catch (error: any) {
      console.error('Lỗi khi áp dụng mã giảm giá:', error);
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi áp dụng mã giảm giá');
      return null;
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        scope: 'SPECIFIC_COURSES',
        courseIds: courseId, // Gửi như string vì backend expect string
      };

      // Step 1: Create voucher
      const response = await axiosInstance.post('voucher/create-voucher', payload);

      if (response.data.statusCode === 201) {
        toast.success('Tạo mã giảm giá thành công!');

        // Step 2: Apply voucher and save to database
        const appliedData = await applyVoucherAndSaveToDB(values.code);

        if (appliedData) {
          const discountedCourse = appliedData.discountedCourses[0];
          if (discountedCourse) {
            toast.success(
              `Mã giảm giá đã được áp dụng! Giảm ${discountedCourse.discountAmount.toLocaleString('vi-VN')}₫`,
              { duration: 5000 }
            );
          }
        }

        form.reset();
      } else {
        toast.error('Không thể tạo mã giảm giá.');
      }
    } catch (error: any) {
      console.error('Lỗi khi tạo mã giảm giá:', error);
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi khi tạo mã giảm giá');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="container mx-auto p-6" suppressHydrationWarning>
      <h1 className="text-2xl font-bold mb-6">Khuyến Mãi Khóa Học</h1>

      {/* Applied Voucher Information */}
      {appliedVoucher && (
        <div
          className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6"
          suppressHydrationWarning
        >
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            ✅ Mã Giảm Giá Đã Được Áp Dụng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Mã voucher:</p>
              <p className="font-semibold text-green-700">{appliedVoucher.voucher.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Loại giảm giá:</p>
              <p className="font-semibold">
                {appliedVoucher.voucher.discountType === 'Percentage'
                  ? 'Phần trăm'
                  : 'Số tiền cố định'}
              </p>
            </div>
          </div>

          {appliedVoucher.discountedCourses.map((course) => (
            <div key={course.courseId} className="mt-4 p-4 bg-white rounded border">
              <h4 className="font-semibold mb-2">{course.title}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Giá gốc:</p>
                  <p className="font-semibold">{course.originalPrice.toLocaleString('vi-VN')}₫</p>
                </div>
                <div>
                  <p className="text-gray-600">Giảm giá:</p>
                  <p className="font-semibold text-red-600">
                    -{course.discountAmount.toLocaleString('vi-VN')}₫
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Giá cuối:</p>
                  <p className="font-semibold text-green-600">
                    {course.finalPrice.toLocaleString('vi-VN')}₫
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Tiết kiệm:</p>
                  <p className="font-semibold text-blue-600">
                    {course.discountAmount.toLocaleString('vi-VN')}₫
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden" suppressHydrationWarning>
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Tạo Mã Giảm Giá</h2>
          <p className="text-gray-600 text-sm mt-1">
            Tạo mã giảm giá cho khóa học này để dành cho học viên của bạn
          </p>
        </div>
        <div className="p-6" suppressHydrationWarning>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Mã Giảm Giá</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="SUMMER2024"
                  {...form.register('code')}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Nhập mã duy nhất (tối thiểu 6 ký tự, chữ in hoa)
                </p>
                {form.formState.errors.code && (
                  <p className="text-red-500 text-xs mt-1">
                    {typeof form.formState.errors.code.message === 'string'
                      ? form.formState.errors.code.message
                      : 'Mã không hợp lệ'}
                  </p>
                )}
              </div>
              <button
                type="button"
                className="px-4 py-2 border rounded-md mb-6"
                onClick={generateVoucherCode}
              >
                Tạo Mã
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mô Tả</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Giảm giá đặc biệt cho..."
                rows={3}
                {...form.register('description')}
              />
              <p className="text-xs text-gray-500 mt-1">
                Cung cấp mô tả ngắn gọn cho mã giảm giá này
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Loại Giảm Giá</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  {...form.register('discountType')}
                >
                  <option value="Percentage">Phần Trăm (%)</option>
                  <option value="Fixed">Số Tiền Cố Định</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Chọn phần trăm hoặc số tiền cố định</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Giá Trị Giảm Giá</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder={form.watch('discountType') === 'Percentage' ? '10' : '5.99'}
                  {...form.register('discountValue')}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {form.watch('discountType') === 'Percentage'
                    ? 'Nhập phần trăm (1-100)'
                    : 'Nhập số tiền cố định'}
                </p>
                {form.formState.errors.discountValue && (
                  <p className="text-red-500 text-xs mt-1">
                    {typeof form.formState.errors.discountValue.message === 'string'
                      ? form.formState.errors.discountValue.message
                      : 'Giá trị không hợp lệ'}
                  </p>
                )}
              </div>
            </div>

            {form.watch('discountType') === 'Percentage' && (
              <div>
                <label className="block text-sm font-medium mb-1">Giảm Giá Tối Đa (Tùy chọn)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="50"
                  {...form.register('maxDiscount', { valueAsNumber: true })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Số tiền giảm giá tối đa (để trống nếu không giới hạn)
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Ngày Bắt Đầu</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  {...form.register('startDate', {
                    valueAsDate: true,
                  })}
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
                {form.formState.errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ngày Kết Thúc</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  {...form.register('endDate', {
                    valueAsDate: true,
                  })}
                  defaultValue={
                    new Date(new Date().setMonth(new Date().getMonth() + 1))
                      .toISOString()
                      .split('T')[0]
                  }
                />
                {form.formState.errors.endDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Số Lần Sử Dụng Tối Đa (Tùy chọn)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="100"
                {...form.register('maxUsage', { valueAsNumber: true })}
              />
              <p className="text-xs text-gray-500 mt-1">
                Số lần tối đa mã này có thể được sử dụng (để trống nếu không giới hạn)
              </p>
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div>
                <label className="block text-base font-medium">Trạng Thái</label>
                <p className="text-xs text-gray-500">Kích hoạt hoặc vô hiệu hóa mã giảm giá này</p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  {...form.register('isActive')}
                  defaultChecked={true}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? 'Đang Tạo Mã...' : 'Tạo & Áp Dụng Mã Giảm Giá'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromotionsPage;
