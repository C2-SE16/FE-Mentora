/**
 * Định dạng số thành chuỗi tiền tệ
 * @param amount Số tiền cần định dạng
 * @param currency Loại tiền tệ (mặc định: VND)
 * @returns Chuỗi tiền tệ đã định dạng
 */
export const formatCurrency = (amount: number, currency: string = 'VND'): string => {
  if (currency === 'VND') {
    // Định dạng tiền VND: 1.000.000 ₫
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  } else if (currency === 'USD') {
    // Định dạng tiền USD: $1,000.00
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  } else {
    // Định dạng tiền tệ khác
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
};

/**
 * Định dạng ngày tháng
 * @param dateString Chuỗi ngày tháng
 * @param format Định dạng (mặc định: 'full')
 * @returns Chuỗi ngày tháng đã định dạng
 */
export const formatDate = (dateString: string, format: 'full' | 'date' | 'time' = 'full'): string => {
  const date = new Date(dateString);
  
  if (format === 'date') {
    // Chỉ hiển thị ngày tháng năm
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } else if (format === 'time') {
    // Chỉ hiển thị giờ phút
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } else {
    // Hiển thị đầy đủ ngày tháng năm giờ phút
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
};

/**
 * Rút gọn chuỗi text
 * @param text Chuỗi cần rút gọn
 * @param maxLength Độ dài tối đa
 * @returns Chuỗi đã được rút gọn
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Chuyển đổi số thành chuỗi có đơn vị đo
 * @param value Giá trị số
 * @param unit Đơn vị (mặc định: '')
 * @returns Chuỗi có đơn vị đo
 */
export const formatWithUnit = (value: number, unit: string = ''): string => {
  return `${value.toLocaleString('vi-VN')}${unit ? ' ' + unit : ''}`;
}; 