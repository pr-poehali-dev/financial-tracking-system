import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const accounts = [
    { id: 1, name: 'Основной счёт', balance: 125000, type: 'checking' },
    { id: 2, name: 'Накопления', balance: 85000, type: 'savings' },
    { id: 3, name: 'Кредитная карта', balance: -12000, type: 'credit' },
  ];

  const payments = [
    { id: 1, name: 'Аренда жилья', amount: 45000, type: 'mandatory', date: '2025-01-25' },
    { id: 2, name: 'Коммунальные услуги', amount: 8500, type: 'mandatory', date: '2025-01-20' },
    { id: 3, name: 'Интернет', amount: 990, type: 'monthly', date: '2025-01-15' },
    { id: 4, name: 'Спортзал', amount: 2800, type: 'monthly', date: '2025-01-10' },
  ];

  const shifts = [
    { id: 1, date: '2025-01-16', hours: 8, hourlyRate: 800, advance: 2000, total: 6400 },
    { id: 2, date: '2025-01-15', hours: 9, hourlyRate: 800, advance: 0, total: 7200 },
    { id: 3, date: '2025-01-14', hours: 7, hourlyRate: 800, advance: 1500, total: 5600 },
    { id: 4, date: '2025-01-13', hours: 8, hourlyRate: 800, advance: 0, total: 6400 },
  ];

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalMonthlyPayments = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalMonthlyIncome = shifts.reduce((sum, shift) => sum + shift.total, 0);

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
              <Icon name="Clock" size={16} />
              Работа
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <Icon name="FileText" size={16} />
              Отчеты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <CardTitle className="text-sm font-medium text-gray-600">Месячные расходы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalMonthlyPayments.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="flex items-center mt-2">
                    <Icon name="TrendingDown" size={16} className="text-error mr-1" />
                    <span className="text-sm text-error">-3% за месяц</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Доходы за месяц</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalMonthlyIncome.toLocaleString('ru-RU')} ₽
                  </div>
                  <div className="flex items-center mt-2">
                    <Icon name="TrendingUp" size={16} className="text-success mr-1" />
                    <span className="text-sm text-success">+8% за месяц</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Бюджет на месяц</CardTitle>
                  <CardDescription>Использовано 67% от плана</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Обязательные платежи</span>
                        <span>53,500 ₽ / 60,000 ₽</span>
                      </div>
                      <Progress value={89} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Питание</span>
                        <span>18,000 ₽ / 25,000 ₽</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Развлечения</span>
                        <span>4,500 ₽ / 10,000 ₽</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Недавние операции</CardTitle>
                  <CardDescription>Последние 5 транзакций</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Зарплата за смену', amount: 6400, type: 'income', date: '16 янв' },
                      { name: 'Продукты', amount: -1200, type: 'expense', date: '16 янв' },
                      { name: 'Зарплата за смену', amount: 7200, type: 'income', date: '15 янв' },
                      { name: 'Кафе', amount: -450, type: 'expense', date: '15 янв' },
                      { name: 'Аванс', amount: -2000, type: 'expense', date: '14 янв' },
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${transaction.type === 'income' ? 'bg-success' : 'bg-error'}`} />
                          <div>
                            <p className="font-medium text-sm">{transaction.name}</p>
                            <p className="text-xs text-gray-500">{transaction.date}</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="CreditCard" size={20} />
                    Счета и карты
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {accounts.map((account) => (
                      <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Icon name={account.type === 'credit' ? 'CreditCard' : 'Wallet'} size={20} className="text-gray-600" />
                          <div>
                            <p className="font-medium">{account.name}</p>
                            <p className="text-sm text-gray-500">
                              {account.type === 'checking' ? 'Расчетный счет' : 
                               account.type === 'savings' ? 'Сберегательный' : 'Кредитная карта'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${account.balance >= 0 ? 'text-gray-900' : 'text-error'}`}>
                            {account.balance.toLocaleString('ru-RU')} ₽
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить счет
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Calendar" size={20} />
                    Запланированные платежи
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <Icon name="Calendar" size={20} className="text-gray-600" />
                          <div>
                            <p className="font-medium">{payment.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={payment.type === 'mandatory' ? 'destructive' : 'secondary'} className="text-xs">
                                {payment.type === 'mandatory' ? 'Обязательный' : 'Ежемесячный'}
                              </Badge>
                              <span className="text-xs text-gray-500">{payment.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-error">
                            -{payment.amount.toLocaleString('ru-RU')} ₽
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить платеж
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="work" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Часов за месяц</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">156</div>
                  <div className="flex items-center mt-2">
                    <Icon name="Clock" size={16} className="text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">из 160 запланированных</span>
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

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">Авансы</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">3,500 ₽</div>
                  <div className="flex items-center mt-2">
                    <Icon name="AlertTriangle" size={16} className="text-warning mr-1" />
                    <span className="text-sm text-warning">К возврату</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Calendar" size={20} />
                  График смен
                </CardTitle>
                <CardDescription>Подробная информация по сменам</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shifts.map((shift) => (
                    <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="font-medium">{shift.date}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(shift.date).toLocaleDateString('ru-RU', { weekday: 'short' })}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium">{shift.hours} часов</p>
                          <p className="text-sm text-gray-500">{shift.hourlyRate} ₽/час</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Заработок:</span>
                            <span className="font-medium text-success">+{(shift.hours * shift.hourlyRate).toLocaleString('ru-RU')} ₽</span>
                          </div>
                          {shift.advance > 0 && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">Аванс:</span>
                              <span className="font-medium text-error">-{shift.advance.toLocaleString('ru-RU')} ₽</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Итого:</span>
                            <span className="font-bold text-gray-900">{shift.total.toLocaleString('ru-RU')} ₽</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить смену
                </Button>
              </CardContent>
            </Card>
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
                      { category: 'Обязательные платежи', amount: 53500, percentage: 60, color: 'bg-primary' },
                      { category: 'Питание', amount: 18000, percentage: 20, color: 'bg-success' },
                      { category: 'Транспорт', amount: 8000, percentage: 9, color: 'bg-warning' },
                      { category: 'Развлечения', amount: 4500, percentage: 5, color: 'bg-error' },
                      { category: 'Прочее', amount: 5000, percentage: 6, color: 'bg-gray-400' },
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
                      { goal: 'Экстренный фонд', current: 45000, target: 100000, color: 'bg-primary' },
                      { goal: 'Отпуск', current: 25000, target: 50000, color: 'bg-success' },
                      { goal: 'Новый телефон', current: 35000, target: 80000, color: 'bg-warning' },
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
                  <Button className="w-full mt-4" variant="outline">
                    <Icon name="Target" size={16} className="mr-2" />
                    Добавить цель
                  </Button>
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