export interface User {
  id: string;
  name: string;
  email: string;
  role: 'nutritionist' | 'admin';
}


export type Gender = 'M' | 'F';

// types.ts
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: 'M' | 'F';
  maritalStatus?: string;
  profession?: string;
  address?: string;
  height?: number;
  currentWeight?: number;
  targetWeight?: number;
  waistCirc?: number;
  hipCirc?: number;
  imc?: number;
  rcq?: number;
  fatPercentage?: number;
  muscleMass?: number;
  consultReason?: string;
  diagnosedDiseases?: string;
  pastSurgeries?: string;
  familyHistory?: string;
  medications?: string;
  allergies?: string;
  supplements?: string;
  mealTimes?: string;
  usualFoods?: string;
  appetite?: string;
  chewing?: string;
  waterIntake?: number;
  fruitVegConsumption?: string;
  carbConsumption?: string;
  proteinConsumption?: string;
  dairyConsumption?: string;
  fatConsumption?: string;
  sugarConsumption?: string;
  alcoholConsumption?: string;
  coffeeTeaConsumption?: string;
  activityLevel?: string;
  activityType?: string;
  smoking?: string;
  alcoholUse?: string;
  sleep?: string;
  giSymptoms?: string;
  weightChanges?: string;
  fatigue?: string;
  otherComplaints?: string;
  goals?: string;
  nutritionistNotes?: string;
  createdAt: string;
  updatedAt: string;
  
}

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

export interface Food {
  id?: string;
  name: string;
  quantity: string;
  calories: number;
}

export interface Meal {
  id?: string;
  name: string;
  time: string;
  foods: Food[];
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


export interface DashboardStats {
  totalPatients: number;
  todayConsultations: number;
  activeMealPlans: number;
  monthlyGrowth: number;
}