import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import Icon from '@/components/ui/icon';

interface TransactionFiltersProps {
  filters: {
    dateRange: { from: Date | null; to: Date | null };
    category: string;
    type: string;
    account: string;
    amountMin: string;
    amountMax: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
  accounts: any[];
  categories: { income: string[]; expense: string[] };
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  filters,
  onFiltersChange,
  accounts,
  categories
}) => {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      dateRange: { from: null, to: null },
      category: '',
      type: '',
      account: '',
      amountMin: '',
      amountMax: '',
      search: ''
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon name="Filter" size={20} />
            Фильтры
          </CardTitle>
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <Icon name="X" size={16} className="mr-1" />
            Очистить
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Поиск</Label>
            <Input
              placeholder="Поиск по описанию..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
          </div>

          <div>
            <Label>Тип операции</Label>
            <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Все типы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все типы</SelectItem>
                <SelectItem value="income">Доходы</SelectItem>
                <SelectItem value="expense">Расходы</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Категория</Label>
            <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Все категории" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все категории</SelectItem>
                {categories.income.map(cat => (
                  <SelectItem key={`income-${cat}`} value={cat}>{cat}</SelectItem>
                ))}
                {categories.expense.map(cat => (
                  <SelectItem key={`expense-${cat}`} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Счет</Label>
            <Select value={filters.account} onValueChange={(value) => updateFilter('account', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Все счета" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все счета</SelectItem>
                {accounts.map(account => (
                  <SelectItem key={account.id} value={account.id.toString()}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Сумма от</Label>
            <Input
              type="number"
              placeholder="0"
              value={filters.amountMin}
              onChange={(e) => updateFilter('amountMin', e.target.value)}
            />
          </div>

          <div>
            <Label>Сумма до</Label>
            <Input
              type="number"
              placeholder="999999"
              value={filters.amountMax}
              onChange={(e) => updateFilter('amountMax', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <Label>Период</Label>
            <DatePickerWithRange
              from={filters.dateRange.from}
              to={filters.dateRange.to}
              onSelect={(range) => updateFilter('dateRange', range)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionFilters;