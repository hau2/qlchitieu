"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUserData } from '@/app/components/lib/useUserData';

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
  const { financeData, saveFinanceData, user, loading } = useUserData();

  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [icon, setIcon] = useState('🚗');

  const formatCurrency = (value: string) => {
    const number = parseInt(value.replace(/\D/g, '')) || 0;
    return number.toLocaleString('vi-VN');
  };

  const handleSubmit = () => {
    console.log(category, limit, financeData);
    
    if (!category || !limit || !financeData) return;

    let copy = { ...financeData };
    if (!copy?.budgets?.[month]) {
      copy = {
        ...copy,
        budgets: {
          ...copy.budgets,
          [month]: {}
        }
      }
    };
    copy.budgets[month][category] = {
      limit: parseInt(limit.replace(/\D/g, '')),
      icon,
    };

    saveFinanceData(copy);
    router.push('/budget');
  };

  if (loading) return <p className="p-4">Đang tải dữ liệu...</p>;
  if (!user) return <p className="p-4">Vui lòng đăng nhập để sử dụng.</p>;

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

        <Button
          onClick={handleSubmit}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white"
        >
          Lưu ngân sách
        </Button>

        <Button onClick={() => router.back()} className="w-full bg-secondary text-black">
          Hủy
        </Button>
      </div>
    </div>
  );
}