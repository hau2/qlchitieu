"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserData } from "@/app/components/lib/useUserData";
import { updateUserData } from "@/app/components/lib/firebaseUtils";

const DEFAULT_INCOME_CATEGORIES = [
  "Lương",
  "Thưởng",
  "Lợi nhuận",
  "Kinh doanh",
  "Trợ cấp",
  "Thu hồi nợ",
];

export default function AddTransactionPage() {
  const [type, setType] = useState<"spending" | "income">("spending");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const { user, financeData, saveFinanceData } = useUserData();
  const router = useRouter();

  useEffect(() => {
    const month = date.slice(0, 7);
    const budgetCategories = Object.keys(financeData?.budgets?.[month] || {});
    setCategories(type === "spending" ? budgetCategories : DEFAULT_INCOME_CATEGORIES);
  }, [date, type, financeData]);

  const handleTabChange = (val: string) => {
    setType(val as "spending" | "income");
    setCategory("");
    setError("");
  };

  const formatAmount = (val: string) => {
    const raw = val.replace(/\D/g, "");
    return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleSave = async () => {
    if (!user) return;
    if (!amount.replace(/\D/g, "") || !category) {
      setError("Vui lòng nhập số tiền và chọn danh mục.");
      return;
    }

    const month = date.slice(0, 7);
    const record = {
      id: Date.now().toString(),
      amount: parseInt(amount.replace(/\D/g, "")),
      category,
      date,
      note,
    };

    const newData = { ...financeData };
    if (!newData.transactions) newData.transactions = {};
    if (!newData.transactions[month]) newData.transactions[month] = { spending: [], income: [] };

    newData.transactions[month][type].push(record);
    await updateUserData(user.uid, newData);
    saveFinanceData(newData);
    router.push("/transactions");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Ghi chép GD</h1>

      <Tabs defaultValue="spending" onValueChange={handleTabChange} className="w-full mb-4">
        <TabsList className="grid grid-cols-2 w-full bg-pink-100 dark:bg-pink-900">
          <TabsTrigger value="spending">💸 Chi tiêu</TabsTrigger>
          <TabsTrigger value="income">💰 Thu nhập</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Số tiền <span className="text-red-500">*</span></label>
          <Input
            type="text"
            placeholder="0đ"
            value={formatAmount(amount)}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Danh mục <span className="text-red-500">*</span></label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start bg-background text-foreground border-border">
                {category || "Chọn danh mục"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Tìm danh mục..." />
                <CommandList>
                  <CommandEmpty>Không có danh mục phù hợp</CommandEmpty>
                  <CommandEmpty><Button onClick={() => router.push("/budget/add")}>Thêm Danh Mục ngay</Button></CommandEmpty>
                  {categories.map((cat) => (
                    <CommandItem
                      key={cat}
                      value={cat}
                      onSelect={() => {
                        setCategory(cat);
                        setOpen(false);
                      }}
                    >
                      {cat}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="text-sm font-medium">Ngày giao dịch</label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div>
          <label className="text-sm font-medium">Ghi chú</label>
          <Input placeholder="Nhập ghi chú..." value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        {error && <p className="text-red-500 text-sm -mt-2">{error}</p>}

        <Button onClick={handleSave} className="w-full bg-pink-500 hover:bg-pink-600 text-white border border-pink-500">
          {type === "spending" ? "Thêm giao dịch chi" : "Thêm giao dịch thu"}
        </Button>
      </div>
    </div>
  );
}
