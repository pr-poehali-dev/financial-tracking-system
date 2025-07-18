const API_BASE_URL = 'http://localhost:3001/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка сервера');
      }

      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return { error: error instanceof Error ? error.message : 'Неизвестная ошибка' };
    }
  }

  // Аутентификация
  async register(userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: any; token: string }>> {
    const response = await this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('authToken', this.token);
    }

    return response;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: any; token: string }>> {
    const response = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('authToken', this.token);
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<any>> {
    return this.request('/auth/me');
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Счета
  async getAccounts(): Promise<ApiResponse<any[]>> {
    return this.request('/accounts');
  }

  async createAccount(accountData: {
    name: string;
    type: string;
    balance?: number;
    currency?: string;
    credit_limit?: number;
  }): Promise<ApiResponse<any>> {
    return this.request('/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }

  async updateAccount(id: number, updates: any): Promise<ApiResponse<any>> {
    return this.request(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteAccount(id: number): Promise<ApiResponse<any>> {
    return this.request(`/accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // Транзакции
  async getTransactions(options: {
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
    categoryId?: number;
    accountId?: number;
  } = {}): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/transactions?${params.toString()}`);
  }

  async createTransaction(transactionData: {
    account_id: number;
    category_id?: number;
    amount: number;
    description?: string;
    type: 'income' | 'expense';
    date: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async updateTransaction(id: number, updates: any): Promise<ApiResponse<any>> {
    return this.request(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTransaction(id: number): Promise<ApiResponse<any>> {
    return this.request(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  async getTransactionStats(options: {
    startDate?: string;
    endDate?: string;
  } = {}): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/transactions/stats?${params.toString()}`);
  }

  async getCategoryStats(options: {
    startDate?: string;
    endDate?: string;
    type?: 'income' | 'expense';
  } = {}): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/transactions/category-stats?${params.toString()}`);
  }

  // Кредиты
  async getCredits(): Promise<ApiResponse<any[]>> {
    return this.request('/credits');
  }

  async createCredit(creditData: {
    name: string;
    type: string;
    total_amount: number;
    remaining_amount?: number;
    monthly_payment: number;
    interest_rate: number;
    start_date: string;
    end_date: string;
    next_payment_date?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/credits', {
      method: 'POST',
      body: JSON.stringify(creditData),
    });
  }

  async updateCredit(id: number, updates: any): Promise<ApiResponse<any>> {
    return this.request(`/credits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteCredit(id: number): Promise<ApiResponse<any>> {
    return this.request(`/credits/${id}`, {
      method: 'DELETE',
    });
  }

  async makeCreditPayment(id: number, amount: number): Promise<ApiResponse<any>> {
    return this.request(`/credits/${id}/payment`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  async getCreditPayments(id: number): Promise<ApiResponse<any[]>> {
    return this.request(`/credits/${id}/payments`);
  }

  // Рабочие смены
  async getWorkShifts(options: {
    startDate?: string;
    endDate?: string;
    status?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/work-shifts?${params.toString()}`);
  }

  async createWorkShift(shiftData: {
    date: string;
    hours: number;
    hourly_rate: number;
    bonus?: number;
    advance?: number;
    deduction?: number;
    notes?: string;
    status?: string;
  }): Promise<ApiResponse<any>> {
    return this.request('/work-shifts', {
      method: 'POST',
      body: JSON.stringify(shiftData),
    });
  }

  async updateWorkShift(id: number, updates: any): Promise<ApiResponse<any>> {
    return this.request(`/work-shifts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteWorkShift(id: number): Promise<ApiResponse<any>> {
    return this.request(`/work-shifts/${id}`, {
      method: 'DELETE',
    });
  }

  async getWorkShiftStats(options: {
    startDate?: string;
    endDate?: string;
    status?: string;
  } = {}): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    return this.request(`/work-shifts/stats?${params.toString()}`);
  }

  async getWorkShiftCalendar(year: number, month: number): Promise<ApiResponse<any[]>> {
    return this.request(`/work-shifts/calendar/${year}/${month}`);
  }
}

export const api = new ApiClient();
export default api;