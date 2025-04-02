"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { EyeIcon, Scissors, Car, Receipt, Gift } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#ec4899', '#60a5fa', '#4ade80'];


const iconMap = {
  Scissors: <Scissors className="w-4 h-4 text-pink-500" />,
  Car: <Car className="w-4 h-4 text-blue-500" />,
  Receipt: <Receipt className="w-4 h-4 text-green-500" />,
  Gift: <Gift className="w-4 h-4 text-purple-500" />
};

export default function DashboardOverview() {
  const [viewAmount, setViewAmount] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() trả về 0-11
    return `${year}-${month}`;
  });
  const [data, setData] = useState();

  useEffect(() => {
    const stored = localStorage.getItem('financeData');
    if (stored) {
      setData(JSON.parse(stored));
    }
  }, []);

  const toggleView = () => setViewAmount(!viewAmount);

  const current = data?.transactions?.[selectedMonth] || { spending: [], income: [] };

  const spendingData = current.spending.map((item) => ({
    name: item.category,
    value: item.amount,
    icon: iconMap[item.icon] || null
  }));

  const incomeData = current.income.map((item) => ({
    name: item.category,
    value: item.amount,
    icon: iconMap[item.icon] || null
  }));

  const totalSpending = spendingData.reduce((sum, item) => sum + item.value, 0);
  const totalIncome = incomeData.reduce((sum, item) => sum + item.value, 0);

  const renderLegend = (data, total) => (
    <ul className="flex flex-col gap-2 text-sm mt-4">
      {data.map((entry, index) => {
        const percent = ((entry.value / total) * 100).toFixed(1);
        return (
          <li key={`legend-${index}`} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
            {entry.icon}
            <span className="flex-1">{entry.name}</span>
            <span className="text-right">{entry.value.toLocaleString()}đ ({percent}%)</span>
          </li>
        );
      })}
    </ul>
  );

  const renderLabelPercent = ({ percent }) => `${(percent * 100).toFixed(0)}%`;

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Tình hình thu chi</h1>
        <div className="flex items-center gap-2">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          />
          <Button variant="ghost" size="icon" onClick={toggleView}>
            <EyeIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="spending" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="spending">Chi tiêu</TabsTrigger>
          <TabsTrigger value="income">Thu nhập</TabsTrigger>
        </TabsList>

        <TabsContent value="spending">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm">Tháng {selectedMonth.split('-')[1]}/ {selectedMonth.split('-')[0]}</p>
              <p className="text-2xl font-bold">
                {viewAmount ? `${totalSpending.toLocaleString()}đ` : '•••••'}
              </p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      cornerRadius={8}
                      fill="#8884d8"
                      paddingAngle={4}
                      dataKey="value"
                      label={renderLabelPercent}
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-s-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {renderLegend(spendingData, totalSpending)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm">Tháng {selectedMonth.split('-')[1]}/ {selectedMonth.split('-')[0]}</p>
              <p className="text-2xl font-bold">
                {viewAmount ? `${totalIncome.toLocaleString()}đ` : '•••••'}
              </p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      cornerRadius={8}
                      fill="#8884d8"
                      dataKey="value"
                      label={renderLabelPercent}
                    >
                      {incomeData.map((entry, index) => (
                        <Cell key={`cell-i-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {renderLegend(incomeData, totalIncome)}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
