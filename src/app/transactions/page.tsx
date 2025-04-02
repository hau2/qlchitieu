/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { format, parseISO, getDate } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserData } from "@/app/components/lib/useUserData";

export default function TransactionHistoryPage() {
  const { financeData, loading, user } = useUserData();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");

  if (loading) return <p className="p-4">Đang tải dữ liệu...</p>;
  if (!user || !financeData) return <p className="p-4">Vui lòng đăng nhập để sử dụng.</p>;

  const transactions = financeData.transactions[selectedMonth] || {
    spending: [],
    income: [],
  };
  const all = [...transactions.spending, ...transactions.income].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const summary = {
    income: transactions.income.reduce((sum: number, t: any) => sum + t.amount, 0),
    spending: transactions.spending.reduce((sum: number, t: any) => sum + t.amount, 0),
  };
  const net = summary.income - summary.spending;

  const daysInMonth = new Date(
    parseInt(selectedMonth.split("-")[0]),
    parseInt(selectedMonth.split("-")[1]),
    0
  ).getDate();

  const dayTransactionType: Record<number, "income" | "spending" | "both"> = {};
  transactions.income.forEach((t: any) => {
    const day = getDate(parseISO(t.date));
    dayTransactionType[day] =
      dayTransactionType[day] === "spending" ? "both" : "income";
  });
  transactions.spending.forEach((t: any) => {
    const day = getDate(parseISO(t.date));
    dayTransactionType[day] =
      dayTransactionType[day] === "income" ? "both" : "spending";
  });

  const filteredTransactions = all.filter((t) => {
    const matchesDay = selectedDay ? getDate(parseISO(t.date)) === selectedDay : true;
    const matchesCategory = categoryFilter ? t.category === categoryFilter : true;
    const matchesSearch = t.note?.toLowerCase().includes(search.toLowerCase());
    return matchesDay && matchesCategory && matchesSearch;
  });

  const allCategories = Array.from(new Set(all.map((t) => t.category))).filter(Boolean);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Sổ giao dịch</h1>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            setSelectedDay(null);
          }}
          className="text-sm border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-900 dark:text-white"
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm font-medium px-1">
        <span className="text-blue-600">
          Tổng thu {summary.income.toLocaleString()}đ
        </span>
        <span className="text-pink-600">
          Tổng chi {summary.spending.toLocaleString()}đ
        </span>
        <span className={cn(net < 0 ? "text-red-500" : "text-green-600")}>Chênh lệch {net.toLocaleString()}đ</span>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mt-4">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <div key={day} className="relative">
            <Button
              variant={selectedDay === day ? "default" : "outline"}
              size="icon"
              className={cn(
                "w-10 h-10 text-sm font-medium rounded-full",
                selectedDay === day
                  ? "bg-pink-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              )}
              onClick={() => setSelectedDay(day === selectedDay ? null : day)}
            >
              {day}
            </Button>
            {dayTransactionType[day] === "income" && (
              <span className="absolute bottom-0 right-0 text-xs">💰</span>
            )}
            {dayTransactionType[day] === "spending" && (
              <span className="absolute bottom-0 right-0 text-xs">💸</span>
            )}
            {dayTransactionType[day] === "both" && (
              <span className="absolute bottom-0 right-0 text-xs">💰💸</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
        <Input
          placeholder="Tìm kiếm theo ghi chú..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/2"
        />
        <Select
          value={categoryFilter}
          onValueChange={(val) => setCategoryFilter(val === "all" ? "" : val)}
        >
          <SelectTrigger className="w-full sm:w-1/2">
            <SelectValue placeholder="Lọc theo danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            {allCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 mt-2">
        {filteredTransactions.length === 0 ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Không có dữ liệu
          </p>
        ) : (
          filteredTransactions.map((t, idx) => (
            <Card key={t.id || idx}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="text-2xl">{(t as any).icon || "💸"}</div>
                <div className="flex-1">
                  <p className="font-medium">
                    {t.note ||
                      (transactions.income.includes(t) ? "Nhận tiền" : "Chi tiêu")}{" "}
                    {t.category && `(${t.category})`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(parseISO(t.date), "dd/MM/yyyy")}
                  </p>
                </div>
                <div
                  className={cn(
                    "font-bold",
                    transactions.income.includes(t)
                      ? "text-blue-600"
                      : "text-pink-600"
                  )}
                >
                  {transactions.income.includes(t) ? "+" : "-"}
                  {t.amount.toLocaleString()}đ
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}