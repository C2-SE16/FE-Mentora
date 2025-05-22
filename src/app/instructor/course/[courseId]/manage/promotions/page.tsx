'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import axiosInstance from '@/lib/api/axios';
import { toast } from 'react-hot-toast';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the form validation schema
const formSchema = z.object({
  code: z.string().min(6, 'Code must be at least 6 characters'),
  description: z.string().optional(),
  discountType: z.enum(['Percentage', 'Fixed']),
  discountValue: z.coerce.number().positive('Discount must be positive'),
  maxDiscount: z.coerce.number().optional(),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z
    .date({
      required_error: 'End date is required',
    })
    .refine((date) => date > new Date(), {
      message: 'End date must be in the future',
    }),
  maxUsage: z.coerce.number().int().optional(),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const PromotionsPage = () => {
  const params = useParams();
  const courseId = typeof params?.courseId === 'string' ? params?.courseId : '';
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        ...values,
        scope: 'SPECIFIC_COURSES',
        courseIds: [courseId],
      };

      // Make the API call
      const response = await axiosInstance.post('voucher/create-voucher', payload);

      if (response.data.data.success) {
        toast.success('Voucher created successfully!');
        form.reset();
      } else {
        toast.error('Failed to create voucher.');
      }
    } catch (error: any) {
      console.error('Error creating voucher:', error);
      toast.error(error.response?.data?.message || 'An error occurred while creating the voucher');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Course Promotions</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Create Discount Voucher</h2>
          <p className="text-gray-600 text-sm mt-1">
            Create a voucher for this course to offer discounts to your students
          </p>
        </div>
        <div className="p-6">
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Voucher Code</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="SUMMER2024"
                  {...form.register('code')}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a unique code (minimum 6 characters, uppercase)
                </p>
                {form.formState.errors.code && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.code.message}</p>
                )}
              </div>
              <button
                type="button"
                className="px-4 py-2 border rounded-md mb-6"
                onClick={generateVoucherCode}
              >
                Generate Code
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Special discount for..."
                rows={3}
                {...form.register('description')}
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide a brief description for this voucher
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Discount Type</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  {...form.register('discountType')}
                >
                  <option value="Percentage">Percentage (%)</option>
                  <option value="Fixed">Fixed Amount</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Choose percentage or fixed amount</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Discount Value</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder={form.watch('discountType') === 'Percentage' ? '10' : '5.99'}
                  {...form.register('discountValue')}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {form.watch('discountType') === 'Percentage'
                    ? 'Enter percentage (1-100)'
                    : 'Enter fixed amount'}
                </p>
                {form.formState.errors.discountValue && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.discountValue.message}
                  </p>
                )}
              </div>
            </div>

            {form.watch('discountType') === 'Percentage' && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Maximum Discount (Optional)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="50"
                  {...form.register('maxDiscount', { valueAsNumber: true })}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum amount to discount (leave empty for no limit)
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
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
                <label className="block text-sm font-medium mb-1">End Date</label>
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
              <label className="block text-sm font-medium mb-1">Maximum Usages (Optional)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                placeholder="100"
                {...form.register('maxUsage', { valueAsNumber: true })}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum number of times this voucher can be used (leave empty for unlimited)
              </p>
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div>
                <label className="block text-base font-medium">Active Status</label>
                <p className="text-xs text-gray-500">Activate or deactivate this voucher</p>
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
              {isLoading ? 'Creating Voucher...' : 'Create Voucher'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromotionsPage;
