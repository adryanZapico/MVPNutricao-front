export interface User {
  id: string;
  name: string;
  email: string;
  role: 'nutritionist' | 'admin';
}


export type Gender = 'M' | 'F';

export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string; // ISO date (yyyy-mm-dd)
  gender: Gender;
  height: number;
  currentWeight: number;
  targetWeight: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};


export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  weight?: number;
  bodyMeasures?: {
    waist: number;
    chest: number;
    hip: number;
    arm: number;
  };
}

export interface MealPlan {
  id: string;
  patientId: string;
  patientName: string;
  title: string;
  description: string;
  calories: number;
  createdAt: string;
  meals: Meal[];
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  foods: Food[];
}

export interface Food {
  id: string;
  name: string;
  quantity: string;
  calories: number;
}

export interface Evolution {
  id: string;
  patientId: string;
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  measures: {
    waist: number;
    chest: number;
    hip: number;
    arm: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}