import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { apiService } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface AnamneseForm {
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
  fatPercentage?: number;
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
}

export const Anamnese: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AnamneseForm>({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: 'F',
    maritalStatus: '',
    profession: '',
    address: '',
    height: undefined,
    currentWeight: undefined,
    targetWeight: undefined,
    waistCirc: undefined,
    hipCirc: undefined,
    fatPercentage: undefined,
    consultReason: '',
    diagnosedDiseases: '',
    pastSurgeries: '',
    familyHistory: '',
    medications: '',
    allergies: '',
    supplements: '',
    mealTimes: '',
    usualFoods: '',
    appetite: '',
    chewing: '',
    waterIntake: undefined,
    fruitVegConsumption: '',
    carbConsumption: '',
    proteinConsumption: '',
    dairyConsumption: '',
    fatConsumption: '',
    sugarConsumption: '',
    alcoholConsumption: '',
    coffeeTeaConsumption: '',
    activityLevel: '',
    activityType: '',
    smoking: '',
    alcoholUse: '',
    sleep: '',
    giSymptoms: '',
    weightChanges: '',
    fatigue: '',
    otherComplaints: '',
    goals: '',
    nutritionistNotes: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof AnamneseForm, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof AnamneseForm, string>> = {};
    if (!formData.name) newErrors.name = 'Nome é obrigatório';
    if (!formData.email) newErrors.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'E-mail inválido';
    if (!formData.phone) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.birthDate) newErrors.birthDate = 'Data de nascimento é obrigatória';
    if (!formData.gender) newErrors.gender = 'Sexo é obrigatório';
    if (formData.height && formData.height <= 0) newErrors.height = 'Altura deve ser maior que 0';
    if (formData.currentWeight && formData.currentWeight <= 0) newErrors.currentWeight = 'Peso deve ser maior que 0';
    if (formData.targetWeight && formData.targetWeight <= 0) newErrors.targetWeight = 'Peso alvo deve ser maior que 0';
    if (formData.waistCirc && formData.waistCirc <= 0) newErrors.waistCirc = 'Cintura deve ser maior que 0';
    if (formData.hipCirc && formData.hipCirc <= 0) newErrors.hipCirc = 'Quadril deve ser maior que 0';
    if (formData.fatPercentage && formData.fatPercentage <= 0) newErrors.fatPercentage = 'Percentual de gordura deve ser maior que 0';
    if (formData.waterIntake && formData.waterIntake <= 0) newErrors.waterIntake = 'Consumo de água deve ser maior que 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await apiService.createPatient(formData);
      navigate('/patients');
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      alert('Erro ao criar paciente. Verifique os dados e tente novamente.');
    }
  };

  const handleChange = (field: keyof AnamneseForm, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Nova Anamnese</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Pessoais */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome completo"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              error={errors.name}
            />
            <Input
              label="E-mail"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              error={errors.email}
            />
            <Input
              label="Telefone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              required
              error={errors.phone}
            />
            <Input
              label="Data de nascimento"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleChange('birthDate', e.target.value)}
              required
              error={errors.birthDate}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value as 'M' | 'F')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Selecione</option>
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
            </div>
            <Input
              label="Estado Civil"
              value={formData.maritalStatus}
              onChange={(e) => handleChange('maritalStatus', e.target.value)}
            />
            <Input
              label="Profissão"
              value={formData.profession}
              onChange={(e) => handleChange('profession', e.target.value)}
            />
            <Input
              label="Endereço"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
        </div>

        {/* Antropometria */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Antropometria</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Peso (kg)"
              type="number"
              step="0.1"
              value={formData.currentWeight || ''}
              onChange={(e) => handleChange('currentWeight', Number(e.target.value))}
              error={errors.currentWeight}
            />
            <Input
              label="Altura (cm)"
              type="number"
              value={formData.height || ''}
              onChange={(e) => handleChange('height', Number(e.target.value))}
              error={errors.height}
            />
            <Input
              label="Circunferência da Cintura (cm)"
              type="number"
              step="0.1"
              value={formData.waistCirc || ''}
              onChange={(e) => handleChange('waistCirc', Number(e.target.value))}
              error={errors.waistCirc}
            />
            <Input
              label="Circunferência do Quadril (cm)"
              type="number"
              step="0.1"
              value={formData.hipCirc || ''}
              onChange={(e) => handleChange('hipCirc', Number(e.target.value))}
              error={errors.hipCirc}
            />
            <Input
              label="Percentual de Gordura (%)"
              type="number"
              step="0.1"
              value={formData.fatPercentage || ''}
              onChange={(e) => handleChange('fatPercentage', Number(e.target.value))}
              error={errors.fatPercentage}
            />
          </div>
        </div>

        {/* Dados Clínicos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados Clínicos e Histórico de Saúde</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Motivo da Consulta"
              value={formData.consultReason}
              onChange={(e) => handleChange('consultReason', e.target.value)}
            />
            <Input
              label="Doenças Diagnosticadas"
              value={formData.diagnosedDiseases}
              onChange={(e) => handleChange('diagnosedDiseases', e.target.value)}
            />
            <Input
              label="Cirurgias Prévias"
              value={formData.pastSurgeries}
              onChange={(e) => handleChange('pastSurgeries', e.target.value)}
            />
            <Input
              label="Histórico Familiar"
              value={formData.familyHistory}
              onChange={(e) => handleChange('familyHistory', e.target.value)}
            />
            <Input
              label="Medicamentos em Uso"
              value={formData.medications}
              onChange={(e) => handleChange('medications', e.target.value)}
            />
            <Input
              label="Alergias/Intolerâncias"
              value={formData.allergies}
              onChange={(e) => handleChange('allergies', e.target.value)}
            />
            <Input
              label="Suplementos em Uso"
              value={formData.supplements}
              onChange={(e) => handleChange('supplements', e.target.value)}
            />
          </div>
        </div>

        {/* Hábitos Alimentares */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hábitos Alimentares</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Horários das Refeições"
              value={formData.mealTimes}
              onChange={(e) => handleChange('mealTimes', e.target.value)}
            />
            <Input
              label="Alimentos Consumidos Habitualmente"
              value={formData.usualFoods}
              onChange={(e) => handleChange('usualFoods', e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apetite</label>
              <select
                value={formData.appetite}
                onChange={(e) => handleChange('appetite', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione</option>
                <option value="Normal">Normal</option>
                <option value="Aumentado">Aumentado</option>
                <option value="Reduzido">Reduzido</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mastigação</label>
              <select
                value={formData.chewing}
                onChange={(e) => handleChange('chewing', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione</option>
                <option value="Rápida">Rápida</option>
                <option value="Lenta">Lenta</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
            <Input
              label="Consumo de Água (Litros/dia)"
              type="number"
              step="0.1"
              value={formData.waterIntake || ''}
              onChange={(e) => handleChange('waterIntake', Number(e.target.value))}
              error={errors.waterIntake}
            />
            <Input
              label="Frutas e Verduras"
              value={formData.fruitVegConsumption}
              onChange={(e) => handleChange('fruitVegConsumption', e.target.value)}
            />
            <Input
              label="Carboidratos"
              value={formData.carbConsumption}
              onChange={(e) => handleChange('carbConsumption', e.target.value)}
            />
            <Input
              label="Proteínas"
              value={formData.proteinConsumption}
              onChange={(e) => handleChange('proteinConsumption', e.target.value)}
            />
            <Input
              label="Lácteos"
              value={formData.dairyConsumption}
              onChange={(e) => handleChange('dairyConsumption', e.target.value)}
            />
            <Input
              label="Gorduras"
              value={formData.fatConsumption}
              onChange={(e) => handleChange('fatConsumption', e.target.value)}
            />
            <Input
              label="Açúcares e Doces"
              value={formData.sugarConsumption}
              onChange={(e) => handleChange('sugarConsumption', e.target.value)}
            />
            <Input
              label="Bebidas Alcoólicas"
              value={formData.alcoholConsumption}
              onChange={(e) => handleChange('alcoholConsumption', e.target.value)}
            />
            <Input
              label="Café/Chá"
              value={formData.coffeeTeaConsumption}
              onChange={(e) => handleChange('coffeeTeaConsumption', e.target.value)}
            />
          </div>
        </div>

        {/* Hábitos de Vida */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hábitos de Vida</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Atividade Física</label>
              <select
                value={formData.activityLevel}
                onChange={(e) => handleChange('activityLevel', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione</option>
                <option value="Sedentário">Sedentário</option>
                <option value="Leve">Leve</option>
                <option value="Moderado">Moderado</option>
                <option value="Intenso">Intenso</option>
              </select>
            </div>
            <Input
              label="Tipo de Atividade e Frequência"
              value={formData.activityType}
              onChange={(e) => handleChange('activityType', e.target.value)}
            />
            <Input
              label="Tabagismo"
              value={formData.smoking}
              onChange={(e) => handleChange('smoking', e.target.value)}
            />
            <Input
              label="Etilismo"
              value={formData.alcoholUse}
              onChange={(e) => handleChange('alcoholUse', e.target.value)}
            />
            <Input
              label="Sono (Horas por noite, Qualidade)"
              value={formData.sleep}
              onChange={(e) => handleChange('sleep', e.target.value)}
            />
          </div>
        </div>

        {/* Avaliação Subjetiva */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Avaliação Subjetiva</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Sintomas Gastrointestinais"
              value={formData.giSymptoms}
              onChange={(e) => handleChange('giSymptoms', e.target.value)}
            />
            <Input
              label="Alterações de Peso Recentes"
              value={formData.weightChanges}
              onChange={(e) => handleChange('weightChanges', e.target.value)}
            />
            <Input
              label="Fadiga/Energia"
              value={formData.fatigue}
              onChange={(e) => handleChange('fatigue', e.target.value)}
            />
            <Input
              label="Outras Queixas"
              value={formData.otherComplaints}
              onChange={(e) => handleChange('otherComplaints', e.target.value)}
            />
          </div>
        </div>

        {/* Objetivos e Expectativas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Objetivos e Expectativas</h2>
          <Input
            label="Objetivos"
            value={formData.goals}
            onChange={(e) => handleChange('goals', e.target.value)}
          />
        </div>

        {/* Observações do Nutricionista */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Observações do Nutricionista</h2>
          <Input
            label="Observações"
            value={formData.nutritionistNotes}
            onChange={(e) => handleChange('nutritionistNotes', e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="secondary" type="button" onClick={() => navigate('/patients')}>
            Cancelar
          </Button>
          <Button type="submit">Criar Paciente</Button>
        </div>
      </form>
    </div>
  );
};