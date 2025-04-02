/* app/budget/add/page.tsx */
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ICON_OPTIONS = [
  { label: '🚗 Xe', value: '🚗' },
  { label: '🍔 Ăn uống', value: '🍔' },
  { label: '💵 Tiền mặt', value: '💵' },
  { label: '📄 Hóa đơn', value: '📄' },
  { label: '🛍️ Mua sắm', value: '🛍️' },
  { label: '🎓 Học tập', value: '🎓' },
];

export default function AddBudgetPage() {
  const router = useRouter();
  const [month, setMonth] = useState('2025-04');
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [icon, setIcon] = useState('🚗');

  const formatCurrency = (value: string) => {
    const number = parseInt(value.replace(/\D/g, '')) || 0;
    return number.toLocaleString('vi-VN');
  };

  const handleSubmit = () => {
    if (!category || !limit) return;

    const raw = localStorage.getItem('financeData');
    const data = raw ? JSON.parse(raw) : { budgets: {}, transactions: {} };

    if (!data.budgets[month]) data.budgets[month] = {};
    data.budgets[month][category] = {
      limit: parseInt(limit.replace(/\D/g, '')),
      icon
    };

    localStorage.setItem('financeData', JSON.stringify(data));
    router.push('/budget');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Tạo ngân sách mới</h1>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Tháng</label>
          <Input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Danh mục</label>
          <Input
            placeholder="Ví dụ: Ăn uống, Di chuyển"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Số tiền giới hạn</label>
          <Input
            placeholder="Nhập số tiền..."
            value={formatCurrency(limit)}
            onChange={(e) => setLimit(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Chọn biểu tượng</label>
          <Select value={icon} onValueChange={setIcon}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn biểu tượng" />
            </SelectTrigger>
            <SelectContent>
              {ICON_OPTIONS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSubmit} className="w-full bg-pink-500 hover:bg-pink-600 text-white">
          Lưu ngân sách
        </Button>

        <Button onClick={() => router.back()} className="w-full bg-secondary text-black">
          Hủy
        </Button>
      </div>
    </div>
  );
}