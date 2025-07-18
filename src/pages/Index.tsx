import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddShift, setShowAddShift] = useState(false);
  const [showAddCredit, setShowAddCredit] = useState(false);

  // Расширенные данные для демонстрации
  const accounts = [
    { id: 1, name: 'Основной счёт', balance: 125000, type: 'checking', currency: 'RUB' },
    { id: 2, name: 'Накопления', balance: 85000, type: 'savings', currency: 'RUB' },
    { id: 3, name: 'Кредитная карта', balance: -12000, type: 'credit', currency: 'RUB', limit: 150000 },
    { id: 4, name: 'USD счёт', balance: 2500, type: 'checking', currency: 'USD' },
  ];

  const transactions = [
    { id: 1, name: 'Зарплата', amount: 85000, type: 'income', date: '2025-01-16', category: 'Работа' },
    { id: 2, name: 'Продукты', amount: -5200, type: 'expense', date: '2025-01-16', category: 'Питание' },
    { id: 3, name: 'Бонус', amount: 15000, type: 'income', date: '2025-01-15', category: 'Премия' },
    { id: 4, name: 'Кафе', amount: -850, type: 'expense', date: '2025-01-15', category: 'Развлечения' },
    { id: 5, name: 'Коммунальные', amount: -8500, type: 'expense', date: '2025-01-14', category: 'Обязательные' },
    { id: 6, name: 'Фриланс', amount: 25000, type: 'income', date: '2025-01-13', category: 'Подработка' },
    { id: 7, name: 'Такси', amount: -650, type: 'expense', date: '2025-01-13', category: 'Транспорт' },
    { id: 8, name: 'Интернет', amount: -990, type: 'expense', date: '2025-01-12', category: 'Обязательные' },
  ];

  const scheduledPayments = [
    { id: 1, name: 'Аренда жилья', amount: 45000, type: 'mandatory', date: '2025-01-25', category: 'Жилье' },
    { id: 2, name: 'Коммунальные услуги', amount: 8500, type: 'mandatory', date: '2025-01-20', category: 'Коммунальные' },
    { id: 3, name: 'Интернет', amount: 990, type: 'monthly', date: '2025-01-15', category: 'Связь' },
    { id: 4, name: 'Спортзал', amount: 2800, type: 'monthly', date: '2025-01-10', category: 'Здоровье' },
    { id: 5, name: 'Страховка авто', amount: 3200, type: 'monthly', date: '2025-01-05', category: 'Страхование' },
  ];

  const credits = [
    { 
      id: 1, 
      name: 'Ипотека', 
      totalAmount: 3500000, 
      remainingAmount: 2800000, 
      monthlyPayment: 35000, 
      rate: 8.5, 
      startDate: '2022-03-01',
      endDate: '2037-03-01',
      type: 'mortgage',
      nextPayment: '2025-02-01'
    },
    { 
      id: 2, 
      name: 'Автокредит', 
      totalAmount: 1200000, 
      remainingAmount: 450000, 
      monthlyPayment: 18500, 
      rate: 12.5, 
      startDate: '2023-06-01',
      endDate: '2028-06-01',
      type: 'auto',
      nextPayment: '2025-02-05'
    },
    { 
      id: 3, 
      name: 'Микрозайм', 
      totalAmount: 50000, 
      remainingAmount: 25000, 
      monthlyPayment: 8500, 
      rate: 45.0, 
      startDate: '2024-11-01',
      endDate: '2025-04-01',
      type: 'microloan',
      nextPayment: '2025-01-20'
    }
  ];

  const shifts = [
    { id: 1, date: '2025-01-16', hours: 8, hourlyRate: 800, advance: 2000, bonus: 1000, deduction: 0, total: 7400, status: 'completed' },
    { id: 2, date: '2025-01-15', hours: 9, hourlyRate: 800, advance: 0, bonus: 0, deduction: 500, total: 6700, status: 'completed' },
    { id: 3, date: '2025-01-14', hours: 7, hourlyRate: 800, advance: 1500, bonus: 0, deduction: 0, total: 4100, status: 'completed' },
    { id: 4, date: '2025-01-13', hours: 8, hourlyRate: 800, advance: 0, bonus: 0, deduction: 0, total: 6400, status: 'completed' },
    { id: 5, date: '2025-01-20', hours: 8, hourlyRate: 800, advance: 0, bonus: 0, deduction: 0, total: 6400, status: 'planned' },
    { id: 6, date: '2025-01-21', hours: 8, hourlyRate: 800, advance: 0, bonus: 0, deduction: 0, total: 6400, status: 'planned' },
  ];

  // Расчеты
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.currency === 'RUB' ? acc.balance : acc.balance * 95), 0);
  const monthlyIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = Math.abs(transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
  const scheduledPaymentsTotal = scheduledPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalCreditPayments = credits.reduce((sum, c) => sum + c.monthlyPayment, 0);
  const totalDebt = credits.reduce((sum, c) => sum + c.remainingAmount, 0);

  // Функция расчета процентов по кредиту
  const calculateCreditStats = (credit: any) => {
    const monthlyRate = credit.rate / 100 / 12;
    const totalMonths = Math.ceil(credit.remainingAmount / credit.monthlyPayment);
    const totalInterest = (credit.monthlyPayment * totalMonths) - credit.remainingAmount;
    const paidAmount = credit.totalAmount - credit.remainingAmount;
    const progress = (paidAmount / credit.totalAmount) * 100;
    
    return {
      totalMonths,
      totalInterest,
      paidAmount,
      progress,
      monthlyInterest: credit.remainingAmount * monthlyRate,
      monthlyPrincipal: credit.monthlyPayment - (credit.remainingAmount * monthlyRate)
    };
  };

  const categories = {
    income: ['Работа', 'Премия', 'Подработка', 'Инвестиции', 'Прочее'],
    expense: ['Питание', 'Транспорт', 'Развлечения', 'Обязательные', 'Здоровье', 'Одежда', 'Прочее']
  };

  const workCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];

    // Пустые дни в начале месяца
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateStr = date.toISOString().split('T')[0];
      const shift = shifts.find(s => s.date === dateStr);
      days.push({ day, shift, date });
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Финансовый трекер</h1>
          <p className="text-gray-600">Управляйте своими финансами и отслеживайте доходы</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Icon name="BarChart3" size={16} />
              Дашборд
            </TabsTrigger>
            <TabsTrigger value="finances" className="flex items-center gap-2">
              <Icon name="Wallet" size={16} />
              Финансы
            </TabsTrigger>
            <TabsTrigger value="work" className="flex items-center gap-2">
              <Icon name="Calendar" size={16} />
              Работа
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Icon name="FileText" size={16} />
              Отчеты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Основные метрики */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Общий баланс</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalBalance.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="flex items-center mt-2">
                    <Icon name="TrendingUp" size={16} className="text-success mr-1" />
                    <span className="text-sm text-success">+12% за месяц</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Доходы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    +{monthlyIncome.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="flex items-center mt-2">
                    <Icon name="TrendingUp" size={16} className="text-success mr-1" />
                    <span className="text-sm text-success">+8% за месяц</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Расходы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-error">
                    -{monthlyExpenses.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="flex items-center mt-2">
                    <Icon name="TrendingDown" size={16} className="text-error mr-1" />
                    <span className="text-sm text-error">-3% за месяц</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Долги</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">
                    {totalDebt.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="flex items-center mt-2">
                    <Icon name="AlertTriangle" size={16} className="text-warning mr-1" />
                    <span className="text-sm text-warning">{totalCreditPayments.toLocaleString('ru-RU')} ₽/мес</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Дополнительные метрики */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Профицит/Дефицит</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${(monthlyIncome - monthlyExpenses - scheduledPaymentsTotal - totalCreditPayments) >= 0 ? 'text-success' : 'text-error'}`}>
                    {(monthlyIncome - monthlyExpenses - scheduledPaymentsTotal - totalCreditPayments).toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    После всех обязательств
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Средний день</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(monthlyExpenses / 30).toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Средние расходы в день
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Накопления</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    {accounts.filter(a => a.type === 'savings').reduce((sum, a) => sum + a.balance, 0).toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    На сберегательных счетах
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Графики и недавние операции */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Бюджет на месяц</CardTitle>
                  <CardDescription>Использовано {Math.round(((monthlyExpenses + scheduledPaymentsTotal) / monthlyIncome) * 100)}% от доходов</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Обязательные платежи</span>
                        <span>{scheduledPaymentsTotal.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <Progress value={(scheduledPaymentsTotal / monthlyIncome) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Кредиты</span>
                        <span>{totalCreditPayments.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <Progress value={(totalCreditPayments / monthlyIncome) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Прочие расходы</span>
                        <span>{monthlyExpenses.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <Progress value={(monthlyExpenses / monthlyIncome) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Недавние операции</CardTitle>
                  <CardDescription>Последние 8 транзакций</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 8).map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${transaction.type === 'income' ? 'bg-success' : 'bg-error'}`} />
                          <div>
                            <p className="font-medium text-sm">{transaction.name}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {transaction.category}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(transaction.date).toLocaleDateString('ru-RU')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`font-medium ${transaction.type === 'income' ? 'text-success' : 'text-error'}`}>
                          {transaction.type === 'income' ? '+' : ''}{transaction.amount.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="finances" className="space-y-6">
            {/* Вкладки в финансах */}
            <Tabs defaultValue="accounts" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="accounts">Счета</TabsTrigger>
                <TabsTrigger value="transactions">Операции</TabsTrigger>
                <TabsTrigger value="scheduled">Платежи</TabsTrigger>
                <TabsTrigger value="credits">Кредиты</TabsTrigger>
                <TabsTrigger value="budgets">Бюджеты</TabsTrigger>
              </TabsList>

              <TabsContent value="accounts" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {accounts.map((account) => (
                    <Card key={account.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2">
                          <Icon name={account.type === 'credit' ? 'CreditCard' : 'Wallet'} size={20} />
                          {account.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Баланс</span>
                            <span className={`text-xl font-bold ${account.balance >= 0 ? 'text-gray-900' : 'text-error'}`}>
                              {account.balance.toLocaleString('ru-RU')} {account.currency === 'USD' ? '$' : '₽'}
                            </span>
                          </div>
                          {account.type === 'credit' && account.limit && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Использовано</span>
                                <span>{Math.abs(account.balance).toLocaleString('ru-RU')} / {account.limit.toLocaleString('ru-RU')} ₽</span>
                              </div>
                              <Progress value={(Math.abs(account.balance) / account.limit) * 100} className="h-2" />
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Icon name="Plus" size={14} className="mr-1" />
                              Пополнить
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Icon name="Minus" size={14} className="mr-1" />
                              Списать
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Операции</h3>
                  <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
                    <DialogTrigger asChild>
                      <Button>
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить операцию
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Новая операция</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="amount">Сумма</Label>
                          <Input id="amount" type="number" placeholder="0" />
                        </div>
                        <div>
                          <Label htmlFor="type">Тип</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите тип" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="income">Доход</SelectItem>
                              <SelectItem value="expense">Расход</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="category">Категория</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.income.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                              {categories.expense.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="description">Описание</Label>
                          <Input id="description" placeholder="Описание операции" />
                        </div>
                        <Button className="w-full">Добавить</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card>
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${transaction.type === 'income' ? 'bg-success' : 'bg-error'}`} />
                            <div>
                              <p className="font-medium">{transaction.name}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {transaction.category}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {new Date(transaction.date).toLocaleDateString('ru-RU')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className={`font-bold ${transaction.type === 'income' ? 'text-success' : 'text-error'}`}>
                            {transaction.type === 'income' ? '+' : ''}{transaction.amount.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="credits" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Кредиты и займы</h3>
                  <Dialog open={showAddCredit} onOpenChange={setShowAddCredit}>
                    <DialogTrigger asChild>
                      <Button>
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить кредит
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Новый кредит</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="creditName">Название</Label>
                          <Input id="creditName" placeholder="Название кредита" />
                        </div>
                        <div>
                          <Label htmlFor="creditAmount">Сумма кредита</Label>
                          <Input id="creditAmount" type="number" placeholder="0" />
                        </div>
                        <div>
                          <Label htmlFor="creditRate">Процентная ставка (%)</Label>
                          <Input id="creditRate" type="number" step="0.1" placeholder="0" />
                        </div>
                        <div>
                          <Label htmlFor="creditPayment">Ежемесячный платеж</Label>
                          <Input id="creditPayment" type="number" placeholder="0" />
                        </div>
                        <div>
                          <Label htmlFor="creditType">Тип кредита</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите тип" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mortgage">Ипотека</SelectItem>
                              <SelectItem value="auto">Автокредит</SelectItem>
                              <SelectItem value="personal">Потребительский</SelectItem>
                              <SelectItem value="microloan">Микрозайм</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full">Добавить</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {credits.map((credit) => {
                    const stats = calculateCreditStats(credit);
                    return (
                      <Card key={credit.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2">
                            <Icon name={credit.type === 'mortgage' ? 'Home' : credit.type === 'auto' ? 'Car' : 'CreditCard'} size={20} />
                            {credit.name}
                          </CardTitle>
                          <CardDescription>
                            {credit.rate}% годовых • До {new Date(credit.endDate).toLocaleDateString('ru-RU')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Погашено</span>
                                <span>{stats.paidAmount.toLocaleString('ru-RU')} / {credit.totalAmount.toLocaleString('ru-RU')} ₽</span>
                              </div>
                              <Progress value={stats.progress} className="h-2" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Остаток</p>
                                <p className="font-bold text-error">{credit.remainingAmount.toLocaleString('ru-RU')} ₽</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Ежемесячно</p>
                                <p className="font-bold text-gray-900">{credit.monthlyPayment.toLocaleString('ru-RU')} ₽</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Основной долг</p>
                                <p className="font-medium text-primary">{Math.round(stats.monthlyPrincipal).toLocaleString('ru-RU')} ₽</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Проценты</p>
                                <p className="font-medium text-warning">{Math.round(stats.monthlyInterest).toLocaleString('ru-RU')} ₽</p>
                              </div>
                            </div>

                            <div className="text-sm">
                              <p className="text-gray-600">Переплата по кредиту</p>
                              <p className="font-bold text-error">{Math.round(stats.totalInterest).toLocaleString('ru-RU')} ₽</p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="text-sm text-gray-600">Следующий платеж</span>
                              <Badge variant={new Date(credit.nextPayment) < new Date() ? 'destructive' : 'default'}>
                                {new Date(credit.nextPayment).toLocaleDateString('ru-RU')}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="scheduled" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Запланированные платежи</CardTitle>
                    <CardDescription>Итого: {scheduledPaymentsTotal.toLocaleString('ru-RU')} ₽ в месяц</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {scheduledPayments.map((payment) => (
                        <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <Icon name="Calendar" size={20} className="text-gray-600" />
                            <div>
                              <p className="font-medium">{payment.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={payment.type === 'mandatory' ? 'destructive' : 'secondary'} className="text-xs">
                                  {payment.type === 'mandatory' ? 'Обязательный' : 'Ежемесячный'}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {payment.category}
                                </Badge>
                                <span className="text-xs text-gray-500">{payment.date}</span>
                              </div>
                            </div>
                          </div>
                          <span className="font-bold text-error">
                            -{payment.amount.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="budgets" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Бюджеты по категориям</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { category: 'Питание', budget: 25000, spent: 18000 },
                        { category: 'Транспорт', budget: 10000, spent: 8000 },
                        { category: 'Развлечения', budget: 15000, spent: 4500 },
                        { category: 'Здоровье', budget: 8000, spent: 2800 },
                        { category: 'Одежда', budget: 12000, spent: 0 },
                      ].map((budget, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{budget.category}</span>
                            <span className="text-sm text-gray-600">
                              {budget.spent.toLocaleString('ru-RU')} / {budget.budget.toLocaleString('ru-RU')} ₽
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={(budget.spent / budget.budget) * 100} className="flex-1 h-2" />
                            <span className="text-xs text-gray-500 w-8">
                              {Math.round((budget.spent / budget.budget) * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="work" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Часов за месяц</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {shifts.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.hours, 0)}
                  </div>
                  <div className="flex items-center mt-2">
                    <Icon name="Clock" size={16} className="text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">из 160 запланированных</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Заработано</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    {shifts.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.total, 0).toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="flex items-center mt-2">
                    <Icon name="TrendingUp" size={16} className="text-success mr-1" />
                    <span className="text-sm text-success">+5% к прошлому месяцу</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Авансы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">
                    {shifts.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.advance, 0).toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="flex items-center mt-2">
                    <Icon name="AlertTriangle" size={16} className="text-warning mr-1" />
                    <span className="text-sm text-warning">К возврату</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Средний час</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">800 ₽</div>
                  <div className="flex items-center mt-2">
                    <Icon name="TrendingUp" size={16} className="text-success mr-1" />
                    <span className="text-sm text-success">+50 ₽ за месяц</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Calendar" size={20} />
                    Календарь смен
                  </CardTitle>
                  <CardDescription>Январь 2025</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-gray-600">
                      {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
                        <div key={day} className="p-2">{day}</div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {workCalendar().map((day, index) => (
                        <div key={index} className="aspect-square">
                          {day ? (
                            <div className={`w-full h-full flex items-center justify-center text-sm rounded-lg cursor-pointer transition-colors ${
                              day.shift 
                                ? day.shift.status === 'completed' 
                                  ? 'bg-success text-white' 
                                  : 'bg-primary text-white'
                                : 'hover:bg-gray-100'
                            }`}>
                              {day.day}
                            </div>
                          ) : (
                            <div className="w-full h-full" />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-success rounded" />
                        <span>Выполнено</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary rounded" />
                        <span>Запланировано</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Clock" size={20} />
                    Детали смен
                  </CardTitle>
                  <CardDescription>
                    <Dialog open={showAddShift} onOpenChange={setShowAddShift}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Icon name="Plus" size={14} className="mr-1" />
                          Добавить смену
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Новая смена</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="shiftDate">Дата</Label>
                            <Input id="shiftDate" type="date" />
                          </div>
                          <div>
                            <Label htmlFor="shiftHours">Часы</Label>
                            <Input id="shiftHours" type="number" placeholder="8" />
                          </div>
                          <div>
                            <Label htmlFor="shiftRate">Ставка за час</Label>
                            <Input id="shiftRate" type="number" placeholder="800" />
                          </div>
                          <div>
                            <Label htmlFor="shiftAdvance">Аванс</Label>
                            <Input id="shiftAdvance" type="number" placeholder="0" />
                          </div>
                          <div>
                            <Label htmlFor="shiftBonus">Премия</Label>
                            <Input id="shiftBonus" type="number" placeholder="0" />
                          </div>
                          <div>
                            <Label htmlFor="shiftDeduction">Вычеты</Label>
                            <Input id="shiftDeduction" type="number" placeholder="0" />
                          </div>
                          <div>
                            <Label htmlFor="shiftNotes">Примечания</Label>
                            <Textarea id="shiftNotes" placeholder="Дополнительная информация" />
                          </div>
                          <Button className="w-full">Добавить смену</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shifts.slice(0, 6).map((shift) => (
                      <div key={shift.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${shift.status === 'completed' ? 'bg-success' : 'bg-primary'}`} />
                          <div>
                            <p className="font-medium text-sm">
                              {new Date(shift.date).toLocaleDateString('ru-RU')} • {shift.hours}ч
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              {shift.bonus > 0 && <span className="text-success">+{shift.bonus}₽ премия</span>}
                              {shift.advance > 0 && <span className="text-warning">-{shift.advance}₽ аванс</span>}
                              {shift.deduction > 0 && <span className="text-error">-{shift.deduction}₽ вычет</span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{shift.total.toLocaleString('ru-RU')} ₽</p>
                          <p className="text-xs text-gray-500">{shift.hourlyRate}₽/ч</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="PieChart" size={20} />
                    Структура расходов
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: 'Обязательные платежи', amount: 53500, percentage: 35 },
                      { category: 'Кредиты', amount: 61500, percentage: 40 },
                      { category: 'Питание', amount: 18000, percentage: 12 },
                      { category: 'Транспорт', amount: 8000, percentage: 5 },
                      { category: 'Развлечения', amount: 4500, percentage: 3 },
                      { category: 'Прочее', amount: 7500, percentage: 5 },
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.category}</span>
                          <span className="text-sm text-gray-500">{item.amount.toLocaleString('ru-RU')} ₽</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={item.percentage} className="flex-1 h-2" />
                          <span className="text-xs text-gray-500 w-8">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="TrendingUp" size={20} />
                    Финансовые цели
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { goal: 'Экстренный фонд', current: 45000, target: 100000 },
                      { goal: 'Отпуск', current: 25000, target: 50000 },
                      { goal: 'Новый телефон', current: 35000, target: 80000 },
                      { goal: 'Машина', current: 250000, target: 500000 },
                    ].map((goal, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{goal.goal}</span>
                          <span className="text-sm text-gray-500">
                            {goal.current.toLocaleString('ru-RU')} / {goal.target.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={(goal.current / goal.target) * 100} className="flex-1 h-2" />
                          <span className="text-xs text-gray-500 w-8">
                            {Math.round((goal.current / goal.target) * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Download" size={20} />
                  Экспорт отчетов
                </CardTitle>
                <CardDescription>Выгрузите данные в различных форматах</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Icon name="FileText" size={16} />
                    PDF отчет
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Icon name="Sheet" size={16} />
                    Excel таблица
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Icon name="Database" size={16} />
                    CSV данные
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;