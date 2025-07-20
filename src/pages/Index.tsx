import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { toast } from 'sonner';
import Icon from '@/components/ui/icon';
import api from '@/lib/api';
import TransactionFilters from '@/components/TransactionFilters';
import TransactionChart from '@/components/TransactionChart';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddShift, setShowAddShift] = useState(false);
  const [showAddCredit, setShowAddCredit] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [transactionFilters, setTransactionFilters] = useState({
    dateRange: { from: null, to: null },
    category: '',
    type: '',
    account: '',
    amountMin: '',
    amountMax: '',
    search: ''
  });
  
  const queryClient = useQueryClient();

  // Проверка авторизации при загрузке
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      // Получаем данные пользователя
      api.getCurrentUser().then(response => {
        if (response.data) {
          setUser(response.data);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('authToken');
        }
      });
    }
  }, []);

  // API запросы
  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: () => api.getAccounts().then(res => res.data || []),
    enabled: isAuthenticated
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => api.getTransactions({ limit: 50 }).then(res => res.data || []),
    enabled: isAuthenticated
  });

  const { data: credits = [] } = useQuery({
    queryKey: ['credits'],
    queryFn: () => api.getCredits().then(res => res.data || []),
    enabled: isAuthenticated
  });

  const { data: workShifts = [] } = useQuery({
    queryKey: ['workShifts'],
    queryFn: () => api.getWorkShifts({ limit: 50 }).then(res => res.data || []),
    enabled: isAuthenticated
  });

  // Мутации
  const createTransactionMutation = useMutation({
    mutationFn: api.createTransaction.bind(api),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Транзакция добавлена');
      setShowAddTransaction(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Ошибка при добавлении транзакции');
    }
  });

  const createCreditMutation = useMutation({
    mutationFn: api.createCredit.bind(api),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
      toast.success('Кредит добавлен');
      setShowAddCredit(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Ошибка при добавлении кредита');
    }
  });

  const createWorkShiftMutation = useMutation({
    mutationFn: api.createWorkShift.bind(api),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workShifts'] });
      toast.success('Смена добавлена');
      setShowAddShift(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Ошибка при добавлении смены');
    }
  });

  const loginMutation = useMutation({
    mutationFn: api.login.bind(api),
    onSuccess: (response) => {
      if (response.data) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success('Вход выполнен успешно');
        setShowLogin(false);
      }
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Ошибка входа');
    }
  });

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Вы вышли из системы');
  };

  // Fallback данные для демонстрации (если нет подключения к серверу)
  const fallbackAccounts = isAuthenticated ? accounts : [
    { id: 1, name: 'Основной счёт', balance: 125000, type: 'checking', currency: 'RUB' },
    { id: 2, name: 'Накопления', balance: 85000, type: 'savings', currency: 'RUB' },
    { id: 3, name: 'Кредитная карта', balance: -12000, type: 'credit', currency: 'RUB', limit: 150000 },
    { id: 4, name: 'USD счёт', balance: 2500, type: 'checking', currency: 'USD' },
  ];

  const fallbackTransactions = isAuthenticated ? transactions : [
    { id: 1, description: 'Зарплата', amount: 85000, type: 'income', date: '2025-01-16', category_id: 1 },
    { id: 2, description: 'Продукты', amount: -5200, type: 'expense', date: '2025-01-16', category_id: 2 },
    { id: 3, description: 'Бонус', amount: 15000, type: 'income', date: '2025-01-15', category_id: 1 },
    { id: 4, description: 'Кафе', amount: -850, type: 'expense', date: '2025-01-15', category_id: 3 },
    { id: 5, description: 'Коммунальные', amount: -8500, type: 'expense', date: '2025-01-14', category_id: 4 },
    { id: 6, description: 'Фриланс', amount: 25000, type: 'income', date: '2025-01-13', category_id: 1 },
    { id: 7, description: 'Такси', amount: -650, type: 'expense', date: '2025-01-13', category_id: 5 },
    { id: 8, description: 'Интернет', amount: -990, type: 'expense', date: '2025-01-12', category_id: 4 },
  ];

  const scheduledPayments = [
    { id: 1, name: 'Аренда жилья', amount: 45000, type: 'mandatory', date: '2025-01-25', category: 'Жилье', account_id: 1 },
    { id: 2, name: 'Коммунальные услуги', amount: 8500, type: 'mandatory', date: '2025-01-20', category: 'Коммунальные', account_id: 1 },
    { id: 3, name: 'Интернет', amount: 990, type: 'monthly', date: '2025-01-22', category: 'Связь', account_id: 1 },
    { id: 4, name: 'Спортзал', amount: 2800, type: 'monthly', date: '2025-01-28', category: 'Здоровье', account_id: 1 },
    { id: 5, name: 'Страховка авто', amount: 3200, type: 'monthly', date: '2025-01-30', category: 'Страхование', account_id: 1 },
  ];

  const fallbackCredits = isAuthenticated ? credits : [
    { 
      id: 1, 
      name: 'Ипотека', 
      total_amount: 3500000, 
      remaining_amount: 2800000, 
      monthly_payment: 35000, 
      interest_rate: 8.5, 
      start_date: '2022-03-01',
      end_date: '2037-03-01',
      type: 'mortgage',
      next_payment_date: '2025-02-01'
    },
    { 
      id: 2, 
      name: 'Автокредит', 
      total_amount: 1200000, 
      remaining_amount: 450000, 
      monthly_payment: 18500, 
      interest_rate: 12.5, 
      start_date: '2023-06-01',
      end_date: '2028-06-01',
      type: 'auto',
      next_payment_date: '2025-02-05'
    },
    { 
      id: 3, 
      name: 'Микрозайм', 
      total_amount: 50000, 
      remaining_amount: 25000, 
      monthly_payment: 8500, 
      interest_rate: 45.0, 
      start_date: '2024-11-01',
      end_date: '2025-04-01',
      type: 'microloan',
      next_payment_date: '2025-01-20'
    }
  ];

  const fallbackShifts = isAuthenticated ? workShifts : [
    { id: 1, date: '2025-01-16', hours: 8, hourly_rate: 800, advance: 2000, bonus: 1000, deduction: 0, total_amount: 7400, status: 'completed' },
    { id: 2, date: '2025-01-15', hours: 9, hourly_rate: 800, advance: 0, bonus: 0, deduction: 500, total_amount: 6700, status: 'completed' },
    { id: 3, date: '2025-01-14', hours: 7, hourly_rate: 800, advance: 1500, bonus: 0, deduction: 0, total_amount: 4100, status: 'completed' },
    { id: 4, date: '2025-01-13', hours: 8, hourly_rate: 800, advance: 0, bonus: 0, deduction: 0, total_amount: 6400, status: 'completed' },
    { id: 5, date: '2025-01-20', hours: 8, hourly_rate: 800, advance: 0, bonus: 0, deduction: 0, total_amount: 6400, status: 'planned' },
    { id: 6, date: '2025-01-21', hours: 8, hourly_rate: 800, advance: 0, bonus: 0, deduction: 0, total_amount: 6400, status: 'planned' },
  ];

  // Получаем ближайшие платежи (кредиты + запланированные)
  const getUpcomingPayments = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const creditPayments = fallbackCredits.map(credit => ({
      id: `credit-${credit.id}`,
      name: `${credit.name} (платеж)`,
      amount: credit.monthly_payment,
      date: credit.next_payment_date,
      type: 'credit',
      category: 'Кредиты',
      account_id: 1,
      isOverdue: new Date(credit.next_payment_date) < today
    }));

    const upcomingPayments = scheduledPayments.map(payment => ({
      ...payment,
      isOverdue: new Date(payment.date) < today
    }));

    return [...creditPayments, ...upcomingPayments]
      .filter(payment => new Date(payment.date) <= nextWeek)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const upcomingPayments = getUpcomingPayments();

  // Фильтрация транзакций
  const getFilteredTransactions = () => {
    return fallbackTransactions.filter(transaction => {
      // Поиск по описанию
      if (transactionFilters.search && !transaction.description.toLowerCase().includes(transactionFilters.search.toLowerCase())) {
        return false;
      }

      // Фильтр по типу
      if (transactionFilters.type && transaction.type !== transactionFilters.type) {
        return false;
      }

      // Фильтр по категории
      if (transactionFilters.category) {
        const categoryName = getCategoryName(transaction.category_id);
        if (categoryName !== transactionFilters.category) {
          return false;
        }
      }

      // Фильтр по счету
      if (transactionFilters.account && transaction.account_id?.toString() !== transactionFilters.account) {
        return false;
      }

      // Фильтр по сумме
      const amount = Math.abs(transaction.amount);
      if (transactionFilters.amountMin && amount < parseFloat(transactionFilters.amountMin)) {
        return false;
      }
      if (transactionFilters.amountMax && amount > parseFloat(transactionFilters.amountMax)) {
        return false;
      }

      // Фильтр по дате
      if (transactionFilters.dateRange.from || transactionFilters.dateRange.to) {
        const transactionDate = new Date(transaction.date);
        if (transactionFilters.dateRange.from && transactionDate < transactionFilters.dateRange.from) {
          return false;
        }
        if (transactionFilters.dateRange.to && transactionDate > transactionFilters.dateRange.to) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredTransactions = getFilteredTransactions();

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

  // Расчеты
  const totalBalance = fallbackAccounts.reduce((sum, acc) => sum + (acc.currency === 'RUB' ? acc.balance : acc.balance * 95), 0);
  const monthlyIncome = fallbackTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const monthlyExpenses = Math.abs(fallbackTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0));
  const scheduledPaymentsTotal = scheduledPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalCreditPayments = fallbackCredits.reduce((sum, c) => sum + c.monthly_payment, 0);
  const totalDebt = fallbackCredits.reduce((sum, c) => sum + c.remaining_amount, 0);
  const upcomingPaymentsTotal = upcomingPayments.reduce((sum, p) => sum + p.amount, 0);

  // Функция расчета процентов по кредиту
  const calculateCreditStats = (credit: any) => {
    const monthlyRate = credit.interest_rate / 100 / 12;
    const totalMonths = Math.ceil(credit.remaining_amount / credit.monthly_payment);
    const totalInterest = (credit.monthly_payment * totalMonths) - credit.remaining_amount;
    const paidAmount = credit.total_amount - credit.remaining_amount;
    const progress = (paidAmount / credit.total_amount) * 100;
    
    return {
      totalMonths,
      totalInterest,
      paidAmount,
      progress,
      monthlyInterest: credit.remaining_amount * monthlyRate,
      monthlyPrincipal: credit.monthly_payment - (credit.remaining_amount * monthlyRate)
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
      const shift = fallbackShifts.find(s => s.date === dateStr);
      days.push({ day, shift, date });
    }

    return days;
  };

  // Компонент авторизации
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Вход в систему</CardTitle>
            <CardDescription>Войдите в свой аккаунт для продолжения</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              loginMutation.mutate({
                email: formData.get('email') as string,
                password: formData.get('password') as string
              });
            }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="password">Пароль</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                  {loginMutation.isPending ? 'Вход...' : 'Войти'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Финансовый трекер</h1>
            <p className="text-gray-600">Управляйте своими финансами и отслеживайте доходы</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Добро пожаловать, {user?.username || 'Пользователь'}</span>
            <Button variant="outline" onClick={handleLogout}>
              Выйти
            </Button>
          </div>
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
                  <CardTitle className="text-sm font-medium text-gray-600">Ближайшие платежи</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">
                    {upcomingPaymentsTotal.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    На ближайшую неделю ({upcomingPayments.length} платежей)
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Накопления</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    {fallbackAccounts.filter(a => a.type === 'savings').reduce((sum, a) => sum + a.balance, 0).toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    На сберегательных счетах
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Ближайшие платежи - детальный блок */}
            {upcomingPayments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Calendar" size={20} />
                    Ближайшие платежи
                  </CardTitle>
                  <CardDescription>Платежи на ближайшие 7 дней</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingPayments.map((payment) => (
                      <div key={payment.id} className={`flex items-center justify-between p-3 border rounded-lg ${payment.isOverdue ? 'border-error bg-error/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <div className="flex items-center gap-3">
                          <Icon 
                            name={payment.isOverdue ? 'AlertTriangle' : payment.type === 'credit' ? 'CreditCard' : 'Calendar'} 
                            size={20} 
                            className={payment.isOverdue ? 'text-error' : 'text-gray-600'} 
                          />
                          <div>
                            <p className="font-medium">{payment.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={payment.isOverdue ? 'destructive' : payment.type === 'credit' ? 'default' : 'secondary'} className="text-xs">
                                {payment.isOverdue ? 'Просрочен' : payment.type === 'credit' ? 'Кредит' : payment.type}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {payment.category}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(payment.date).toLocaleDateString('ru-RU')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-bold ${payment.isOverdue ? 'text-error' : 'text-gray-900'}`}>
                            {payment.amount.toLocaleString('ru-RU')} ₽
                          </span>
                          <div className="text-xs text-gray-500">
                            {fallbackAccounts.find(a => a.id === payment.account_id)?.name || 'Основной счет'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

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
                  <h3 className="text-lg font-semibold">Операции ({filteredTransactions.length})</h3>
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
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        createTransactionMutation.mutate({
                          account_id: parseInt(formData.get('account') as string),
                          amount: parseFloat(formData.get('amount') as string) * (formData.get('type') === 'expense' ? -1 : 1),
                          description: formData.get('description') as string,
                          type: formData.get('type') as 'income' | 'expense',
                          date: new Date().toISOString().split('T')[0],
                          category_id: 1
                        });
                      }}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="amount">Сумма</Label>
                            <Input id="amount" name="amount" type="number" placeholder="0" required />
                          </div>
                          <div>
                            <Label htmlFor="type">Тип</Label>
                            <Select name="type" required>
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
                            <Label htmlFor="account">Счет</Label>
                            <Select name="account" required>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите счет" />
                              </SelectTrigger>
                              <SelectContent>
                                {fallbackAccounts.map(account => (
                                  <SelectItem key={account.id} value={account.id.toString()}>
                                    {account.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="description">Описание</Label>
                            <Input id="description" name="description" placeholder="Описание операции" required />
                          </div>
                          <Button type="submit" className="w-full" disabled={createTransactionMutation.isPending}>
                            {createTransactionMutation.isPending ? 'Добавление...' : 'Добавить'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <TransactionFilters
                  filters={transactionFilters}
                  onFiltersChange={setTransactionFilters}
                  accounts={fallbackAccounts}
                  categories={categories}
                />

                <TransactionChart 
                  transactions={filteredTransactions}
                  accounts={fallbackAccounts}
                />

                <Card>
                  <CardHeader>
                    <CardTitle>Список операций</CardTitle>
                    <CardDescription>
                      {filteredTransactions.length > 0 ? 
                        `Показано ${filteredTransactions.length} из ${fallbackTransactions.length} операций` : 
                        'Операции не найдены'
                      }
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {filteredTransactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${transaction.type === 'income' ? 'bg-success' : 'bg-error'}`} />
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {getCategoryName(transaction.category_id)}
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
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Новый кредит</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        createCreditMutation.mutate({
                          name: formData.get('name') as string,
                          type: formData.get('type') as string,
                          total_amount: parseFloat(formData.get('total_amount') as string),
                          remaining_amount: parseFloat(formData.get('remaining_amount') as string),
                          monthly_payment: parseFloat(formData.get('monthly_payment') as string),
                          interest_rate: parseFloat(formData.get('interest_rate') as string),
                          start_date: formData.get('start_date') as string,
                          end_date: formData.get('end_date') as string,
                          next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                        });
                      }}>
                        <div className="space-y-4">
                        <div>
                          <Label htmlFor="creditName">Название</Label>
                          <Input id="creditName" name="name" placeholder="Название кредита" required />
                        </div>
                        <div>
                          <Label htmlFor="creditAmount">Сумма кредита</Label>
                          <Input id="creditAmount" name="total_amount" type="number" placeholder="0" required />
                        </div>
                        <div>
                          <Label htmlFor="creditRemaining">Остаток долга</Label>
                          <Input id="creditRemaining" name="remaining_amount" type="number" placeholder="0" required />
                        </div>
                        <div>
                          <Label htmlFor="creditRate">Процентная ставка (%)</Label>
                          <Input id="creditRate" name="interest_rate" type="number" step="0.1" placeholder="0" required />
                        </div>
                        <div>
                          <Label htmlFor="creditPayment">Ежемесячный платеж</Label>
                          <Input id="creditPayment" name="monthly_payment" type="number" placeholder="0" required />
                        </div>
                        <div>
                          <Label htmlFor="creditAccount">Счет для списания</Label>
                          <Select name="account_id" required>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите счет" />
                            </SelectTrigger>
                            <SelectContent>
                              {fallbackAccounts.map(account => (
                                <SelectItem key={account.id} value={account.id.toString()}>
                                  <div className="flex items-center justify-between w-full">
                                    <span>{account.name}</span>
                                    <span className="text-sm text-gray-500 ml-2">
                                      {account.balance.toLocaleString('ru-RU')} {account.currency === 'USD' ? '$' : '₽'}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="creditType">Тип кредита</Label>
                          <Select name="type" required>
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
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="creditStartDate">Дата начала</Label>
                            <Input id="creditStartDate" name="start_date" type="date" required />
                          </div>
                          <div>
                            <Label htmlFor="creditEndDate">Дата окончания</Label>
                            <Input id="creditEndDate" name="end_date" type="date" required />
                          </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={createCreditMutation.isPending}>
                          {createCreditMutation.isPending ? 'Добавление...' : 'Добавить кредит'}
                        </Button>
                        </div>
                      </form>
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
                              <Badge variant={new Date(credit.next_payment_date) < new Date() ? 'destructive' : 'default'}>
                                {new Date(credit.next_payment_date).toLocaleDateString('ru-RU')}
                              </Badge>
                            </div>

                            <div className="flex gap-2 pt-4">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => {
                                  // Выполнить платеж по кредиту
                                  toast.success(`Платеж по кредиту "${credit.name}" выполнен`);
                                }}
                              >
                                <Icon name="CreditCard" size={14} className="mr-1" />
                                Платеж
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  // Досрочное погашение
                                  toast.info('Функция досрочного погашения в разработке');
                                }}
                              >
                                <Icon name="DollarSign" size={14} className="mr-1" />
                                Досрочно
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="scheduled" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Запланированные платежи</h3>
                  <Dialog open={showAddPayment} onOpenChange={setShowAddPayment}>
                    <DialogTrigger asChild>
                      <Button>
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить платеж
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Новый запланированный платеж</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        // Здесь будет логика добавления платежа
                        toast.success('Платеж добавлен');
                        setShowAddPayment(false);
                      }}>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="paymentName">Название платежа</Label>
                            <Input id="paymentName" name="name" placeholder="Например, аренда квартиры" required />
                          </div>
                          <div>
                            <Label htmlFor="paymentAmount">Сумма</Label>
                            <Input id="paymentAmount" name="amount" type="number" placeholder="0" required />
                          </div>
                          <div>
                            <Label htmlFor="paymentAccount">Счет для списания</Label>
                            <Select name="account" required>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите счет" />
                              </SelectTrigger>
                              <SelectContent>
                                {fallbackAccounts.map(account => (
                                  <SelectItem key={account.id} value={account.id.toString()}>
                                    <div className="flex items-center justify-between w-full">
                                      <span>{account.name}</span>
                                      <span className="text-sm text-gray-500 ml-2">
                                        {account.balance.toLocaleString('ru-RU')} {account.currency === 'USD' ? '$' : '₽'}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="paymentType">Тип платежа</Label>
                            <Select name="type" required>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите тип" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mandatory">Обязательный</SelectItem>
                                <SelectItem value="monthly">Ежемесячный</SelectItem>
                                <SelectItem value="weekly">Еженедельный</SelectItem>
                                <SelectItem value="yearly">Ежегодный</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="paymentDate">Дата платежа</Label>
                            <Input id="paymentDate" name="date" type="date" required />
                          </div>
                          <div>
                            <Label htmlFor="paymentCategory">Категория</Label>
                            <Select name="category" required>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите категорию" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Жилье">Жилье</SelectItem>
                                <SelectItem value="Коммунальные">Коммунальные услуги</SelectItem>
                                <SelectItem value="Связь">Связь и интернет</SelectItem>
                                <SelectItem value="Здоровье">Здоровье и медицина</SelectItem>
                                <SelectItem value="Страхование">Страхование</SelectItem>
                                <SelectItem value="Образование">Образование</SelectItem>
                                <SelectItem value="Прочее">Прочее</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button type="submit" className="w-full">
                            Добавить платеж
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

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
                                <span className="text-xs text-gray-400">
                                  • {fallbackAccounts.find(a => a.id === payment.account_id)?.name}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-error">
                              -{payment.amount.toLocaleString('ru-RU')} ₽
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <Button size="sm" variant="outline" onClick={() => {
                                // Выполнить платеж
                                toast.success(`Платеж "${payment.name}" выполнен`);
                              }}>
                                <Icon name="CheckCircle" size={14} className="mr-1" />
                                Выполнить
                              </Button>
                              <Button size="sm" variant="outline">
                                <Icon name="Edit" size={14} />
                              </Button>
                            </div>
                          </div>
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