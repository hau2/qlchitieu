/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUserData } from '@/app/components/lib/useUserData';
import { updateUserData } from '@/app/components/lib/firebaseUtils';

export default function SettingPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [jsonPreview, setJsonPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, financeData, saveFinanceData } = useUserData();

  const handleExport = () => {
    if (!financeData) return alert('Không có dữ liệu để xuất');

    const blob = new Blob([JSON.stringify(financeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'financeData.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const parsed = JSON.parse(result);
          if (parsed && parsed.budgets && parsed.transactions) {
            await updateUserData(user.uid, parsed);
            saveFinanceData(parsed);
            alert('Nhập dữ liệu thành công');
            router.push('/');
          } else {
            alert('File không hợp lệ');
          }
        }
      } catch (_error) {
        alert('Đọc file thất bại');
        console.log(_error);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    const confirmReset = confirm('Bạn có chắc muốn xoá toàn bộ dữ liệu không?');
    if (!confirmReset || !user) return;

    setLoading(true);
    await updateUserData(user.uid, {});
    saveFinanceData({});
    alert('Đã xoá dữ liệu. Trang sẽ được tải lại.');
    location.reload();
  };

  const handlePreview = () => {
    if (financeData) {
      setJsonPreview(JSON.stringify(financeData, null, 2));
    } else {
      alert('Không có dữ liệu để xem');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-semibold">Tiện ích</h1>

      <div className="space-y-2">
        <Button onClick={handleExport} disabled={loading}>
          {loading ? 'Đang xử lý...' : '📤 Xuất dữ liệu'}
        </Button>

        <div className="space-y-1">
          <label className="text-sm">📥 Nhập dữ liệu từ file JSON</label>
          <Input type="file" accept=".json" ref={fileRef} onChange={handleImport} disabled={loading} />
        </div>

        <Button variant="destructive" onClick={handleReset} disabled={loading}>
          {loading ? 'Đang xoá...' : '🗑️ Xoá toàn bộ dữ liệu'}
        </Button>

        <Button variant="outline" onClick={handlePreview} disabled={loading}>👀 Xem dữ liệu hiện tại</Button>
        {jsonPreview && (
          <Textarea value={jsonPreview} readOnly rows={20} className="w-full text-xs bg-gray-100 dark:bg-gray-900" />
        )}
      </div>
      <footer className="pt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Lê Công Hậu. All rights reserved.
      </footer>
    </div>
  );
}