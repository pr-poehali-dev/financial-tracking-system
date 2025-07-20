import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface TransactionChartProps {
  transactions: any[];
  accounts: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const TransactionChart: React.FC<TransactionChartProps> = ({ transactions, accounts }) => {
  // Подготовка данных для графика по дням
  const getDailyData = () => {
    const dailyData: { [key: string]: { date: string; income: number; expense: number } } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date).toLocaleDateString('ru-RU');
      if (!dailyData[date]) {
        dailyData[date] = { date, income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        dailyData[date].income += Math.abs(transaction.amount);
      } else {
        dailyData[date].expense += Math.abs(transaction.amount);
      }
    });
    
    return Object.values(dailyData).sort((a, b) => 
      new Date(a.date.split('.').reverse().join('-')).getTime() - 
      new Date(b.date.split('.').reverse().join('-')).getTime()
    );
  };

  // Подготовка данных для графика по категориям
  const getCategoryData = () => {
    const categoryData: { [key: string]: number } = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const category = getCategoryName(transaction.category_id);
        categoryData[category] = (categoryData[category] || 0) + Math.abs(transaction.amount);
      });
    
    return Object.entries(categoryData).map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / Object.values(categoryData).reduce((a, b) => a + b, 0)) * 100)
    }));
  };

  // Подготовка данных для баланса счетов
  const getAccountsData = () => {
    return accounts.map(account => ({
      name: account.name,
      balance: account.balance,
      type: account.type
    }));
  };

  const getCategoryName = (categoryId: number) => {
    const categories = {
      1: 'Работа',
      2: 'Питание', 
      3: 'Развлечения',
      4: 'Обязательные',
      5: 'Транспорт'
    };
    return categories[categoryId as keyof typeof categories] || 'Прочее';
  };

  const dailyData = getDailyData();
  const categoryData = getCategoryData();
  const accountsData = getAccountsData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="BarChart3" size={20} />
          Аналитика операций
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">По дням</TabsTrigger>
            <TabsTrigger value="categories">По категориям</TabsTrigger>
            <TabsTrigger value="accounts">По счетам</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toLocaleString('ru-RU')} ₽`, '']}
                    labelFormatter={(label) => `Дата: ${label}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Доходы"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expense" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Расходы"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value.toLocaleString('ru-RU')} ₽`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Расходы по категориям</h4>
                {categoryData.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {category.value.toLocaleString('ru-RU')} ₽
                      </div>
                      <div className="text-xs text-gray-500">
                        {category.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accountsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toLocaleString('ru-RU')} ₽`, 'Баланс']}
                  />
                  <Bar 
                    dataKey="balance" 
                    fill="#3b82f6"
                    name="Баланс"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TransactionChart;