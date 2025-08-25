import axios, { AxiosInstance } from 'axios';
import { mockUsers } from '../mock/mockUsers';

import {
  ApiResponse,
  PaginatedResponse,
  Patient,
  Consultation,
  MealPlan,
  Evolution,
  User,
} from '../types';


class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Adiciona token de autenticação nas requisições
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Trata respostas com erro
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ---------- AUTH ----------
 async login(email: string, password: string) {
  // 1️⃣ Verifica se estamos usando mock (sem backend)
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Salva token no navegador
    localStorage.setItem('token', user.token);

    // Retorna dados no formato esperado
    return {
      success: true,
      data: {
        token: user.token,
        user: { name: user.name, email: user.email }
      }
    };
  }

  // 2️⃣ Se não for mock, chama API real
  const response = await this.api.post('/auth/login', { email, password });
  return response.data;
}

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
    localStorage.removeItem('token');
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await this.api.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  }

  // ---------- PATIENTS ----------
async getPatients(page = 1, limit = 10, search = ''): Promise<PaginatedResponse<Patient>> {
  const response = await this.api.get<PaginatedResponse<Patient>>('/patients', {
    params: {
      page,
      limit,
      search // backend precisa ler isso
    }
  });
  return response.data;
}

  async getPatient(id: string): Promise<ApiResponse<Patient>> {
    const response = await this.api.get<ApiResponse<Patient>>(`/patients/${id}`);
    return response.data;
  }

  async createPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Patient>> {
    const response = await this.api.post<ApiResponse<Patient>>('/patients', patient);
    return response.data;
  }

  async updatePatient(id: string, patient: Partial<Patient>): Promise<ApiResponse<Patient>> {
    const response = await this.api.put<ApiResponse<Patient>>(`/patients/${id}`, patient);
    return response.data;
  }

  async deletePatient(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete<ApiResponse<void>>(`/patients/${id}`);
    return response.data;
  }

  // ---------- CONSULTATIONS ----------
  async getConsultations(page = 1, limit = 10): Promise<PaginatedResponse<Consultation>> {
    const response = await this.api.get<PaginatedResponse<Consultation>>(
      `/consultations?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async getConsultation(id: string): Promise<ApiResponse<Consultation>> {
    const response = await this.api.get<ApiResponse<Consultation>>(`/consultations/${id}`);
    return response.data;
  }

async createConsultation(consultation: Omit<Consultation, 'id'>): Promise<ApiResponse<Consultation>> {
  
  const payload = {
    ...consultation,
    date: consultation.date, 
  };
  console.log('Payload enviado ao backend:', payload); 
  const response = await this.api.post<ApiResponse<Consultation>>('/consultations', payload, {
    headers: {
      'Content-Type': 'application/json', 
    },
  });
  return response.data;
}

  async updateConsultation(id: string, consultation: Partial<Consultation>): Promise<ApiResponse<Consultation>> {
    const response = await this.api.put<ApiResponse<Consultation>>(`/consultations/${id}`, consultation);
    return response.data;
  }

  async deleteConsultation(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete<ApiResponse<void>>(`/consultations/${id}`);
    return response.data;
  }

  // ---------- MEAL PLANS ----------
  async getMealPlans(page = 1, limit = 10): Promise<PaginatedResponse<MealPlan>> {
    const response = await this.api.get<PaginatedResponse<MealPlan>>(`/meal-plans?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getMealPlan(id: string): Promise<ApiResponse<MealPlan>> {
    const response = await this.api.get<ApiResponse<MealPlan>>(`/meal-plans/${id}`);
    return response.data;
  }

  async createMealPlan(mealPlan: Omit<MealPlan, 'id' | 'createdAt'>): Promise<ApiResponse<MealPlan>> {
    const response = await this.api.post<ApiResponse<MealPlan>>('/meal-plans', mealPlan);
    return response.data;
  }

  async updateMealPlan(id: string, mealPlan: Partial<MealPlan>): Promise<ApiResponse<MealPlan>> {
    const response = await this.api.put<ApiResponse<MealPlan>>(`/meal-plans/${id}`, mealPlan);
    return response.data;
  }

  async deleteMealPlan(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete<ApiResponse<void>>(`/meal-plans/${id}`);
    return response.data;
  }

  // ---------- EVOLUTIONS ----------
  async getEvolution(patientId: string): Promise<ApiResponse<Evolution[]>> {
    const response = await this.api.get<ApiResponse<Evolution[]>>(`/evolution/${patientId}`);
    return response.data;
  }

  async postEvolution(data: {
  patientId: string;
  date: string;
  weight: number;
  bodyFat?: number;
  measures?: { waist?: number; hip?: number };
}): Promise<ApiResponse<Evolution>> {
  const response = await this.api.post<ApiResponse<Evolution>>('/evolution', data);
  return response.data;
}

  async addEvolution(evolution: Omit<Evolution, 'id'>): Promise<ApiResponse<Evolution>> {
    const response = await this.api.post<ApiResponse<Evolution>>('/evolution', evolution);
    return response.data;
  }

  // ---------- DASHBOARD ----------
  async getDashboardStats(): Promise<ApiResponse<unknown>> {
    const response = await this.api.get<ApiResponse<unknown>>('/dashboard/stats');
    return response.data;
  }
}

export const apiService = new ApiService();
