/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil } from "lucide-react";
import { format, endOfMonth, differenceInDays } from "date-fns";
import { vi } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/app/components/lib/useUserData";

interface BudgetItem {
  category: string;
  icon: string;
  spent: number;
  limit: number;
}

function isEmojiOnly(input: string): boolean {
  const emojiRegex = /^(?:\p{Emoji}|\p{Extended_Pictographic})+$/u;
  return emojiRegex.test(input);
}

export default function BudgetPage() {
  const [month] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [daysLeft, setDaysLeft] = useState(0);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [editIcon, setEditIcon] = useState<string>("");
  const [iconError, setIconError] = useState<boolean>(false);

  const { financeData, saveFinanceData, user, loading } = useUserData();

  useEffect(() => {
    if (!financeData) return;
    const monthBudget = financeData.budgets?.[month] || {};
    const monthTransactions = financeData.transactions?.[month]?.spending || [];

    const result: BudgetItem[] = Object.entries(monthBudget).map(
      ([category, data]: any) => {
        const spent = monthTransactions
          .filter((t: any) => t.category === category)
          .reduce((sum: number, t: any) => sum + t.amount, 0);
        return {
          category,
          icon: data.icon || "💰",
          spent,
          limit: data.limit || 0,
        };
      }
    );

    setBudgets(result);

    const [year, monthNum] = month.split("-");
    const now = new Date();
    const lastDay = endOfMonth(new Date(Number(year), Number(monthNum) - 1));
    const remaining = differenceInDays(lastDay, now);
    setDaysLeft(Math.max(0, remaining));
  }, [financeData, month]);

  const handleEdit = (
    category: string,
    currentLimit: number,
    currentIcon: string
  ) => {
    setEditMode(category);
    setEditValue(currentLimit.toString());
    setEditIcon(currentIcon);
    setIconError(false);
  };

  const handleSave = (category: string) => {
    if (!isEmojiOnly(editIcon)) {
      setIconError(true);
      return;
    }
    if (!financeData) return;
    const copy = { ...financeData };
    copy.budgets[month][category].limit = parseInt(
      editValue.replace(/\D/g, "")
    );
    copy.budgets[month][category].icon = editIcon;
    saveFinanceData(copy);
    setEditMode(null);
  };

  const handleDelete = (category: string) => {
    const confirm = window.confirm(`Xoá ngân sách cho danh mục "${category}"?`);
    if (!confirm || !financeData) return;
    const copy = { ...financeData };
    delete copy.budgets[month][category];
    saveFinanceData(copy);
  };

  const monthLabel = format(new Date(month + "-01"), "MMMM yyyy", {
    locale: vi,
  });

  if (loading) return <p className="p-4">Đang tải dữ liệu...</p>;
  if (!user) return <p className="p-4">Vui lòng đăng nhập để sử dụng.</p>;

  return (
    <div className="p-4 bg-background min-h-screen">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl font-semibold">Ngân sách</h1>
        <Link
          href="/budget/add"
          className="text-pink-500 text-sm flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Thêm ngân sách
        </Link>
      </div>

      <p className="text-sm mb-4">
        Tháng {monthLabel} - Còn {daysLeft} ngày nữa hết tháng
      </p>

      <div className="space-y-3">
        {budgets.map((item) => (
          <div
            key={item.category}
            className="flex items-center gap-4 p-4 rounded-lg bg-card shadow border"
          >
            <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-xl">
              {editMode === item.category ? (
                <div className="flex flex-col items-center">
                  <Input
                    value={editIcon}
                    onChange={(e) => {
                      setEditIcon(e.target.value);
                      setIconError(false);
                    }}
                    className="text-center text-xl w-12 h-12"
                    maxLength={2}
                  />
                  {iconError && (
                    <span className="text-red-500 text-xs mt-1">
                      Chỉ được nhập emoji hợp lệ
                    </span>
                  )}
                </div>
              ) : (
                item.icon
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{item.category}</p>
              <p className="text-xs text-muted-foreground">
                Chi {item.spent.toLocaleString()}đ /{" "}
                {item.limit.toLocaleString()}đ
              </p>
              {editMode === item.category ? (
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-32 text-sm"
                  />
                  <Button size="sm" onClick={() => handleSave(item.category)}>
                    Lưu
                  </Button>
                </div>
              ) : (
                <p className="text-sm font-semibold text-green-600">
                  Còn lại {(item.limit - item.spent).toLocaleString()}đ
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(item.category, item.limit, item.icon)}
              >
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(item.category)}
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
