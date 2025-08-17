import React, { useEffect, useState } from 'react';
import { Search, Edit, Trash2, Eye } from 'lucide-react';
import { Patient } from '../types';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Table } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';

export const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'view'>('view');
  const [errors, setErrors] = useState<Partial<Record<keyof Patient, string>>>({});

  const [formData, setFormData] = useState<Patient>({
    id: '',
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
    imc: undefined,
    rcq: undefined,
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
    createdAt: '',
    updatedAt: '',
  });

  useEffect(() => {
    loadPatients();
  }, [currentPage, searchTerm]);

  const loadPatients = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getPatients(currentPage, 10, searchTerm);
      setPatients(response.data);
      setTotalPages(Math.ceil(response.total / response.limit));
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      alert('Erro ao carregar pacientes.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Patient, string>> = {};
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
    if (modalMode === 'edit' && !validateForm()) return;

    try {
      if (modalMode === 'edit' && selectedPatient) {
        await apiService.updatePatient(selectedPatient.id, formData);
      }
      setIsModalOpen(false);
      resetForm();
      loadPatients();
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
      alert('Erro ao atualizar paciente. Verifique os dados e tente novamente.');
    }
  };

  const handleDelete = async (patient: Patient) => {
    if (window.confirm(`Tem certeza que deseja excluir o paciente ${patient.name}?`)) {
      try {
        await apiService.deletePatient(patient.id);
        loadPatients();
      } catch (error) {
        console.error('Erro ao excluir paciente:', error);
        alert('Erro ao excluir paciente.');
      }
    }
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const openModal = (mode: 'edit' | 'view', patient?: Patient) => {
    setModalMode(mode);
    setSelectedPatient(patient || null);

    if (patient) {
      setFormData({
        id: patient.id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        birthDate: formatDateForInput(patient.birthDate),
        gender: patient.gender,
        maritalStatus: patient.maritalStatus || '',
        profession: patient.profession || '',
        address: patient.address || '',
        height: patient.height,
        currentWeight: patient.currentWeight,
        targetWeight: patient.targetWeight,
        waistCirc: patient.waistCirc,
        hipCirc: patient.hipCirc,
        imc: patient.imc,
        rcq: patient.rcq,
        fatPercentage: patient.fatPercentage,
        consultReason: patient.consultReason || '',
        diagnosedDiseases: patient.diagnosedDiseases || '',
        pastSurgeries: patient.pastSurgeries || '',
        familyHistory: patient.familyHistory || '',
        medications: patient.medications || '',
        allergies: patient.allergies || '',
        supplements: patient.supplements || '',
        mealTimes: patient.mealTimes || '',
        usualFoods: patient.usualFoods || '',
        appetite: patient.appetite || '',
        chewing: patient.chewing || '',
        waterIntake: patient.waterIntake,
        fruitVegConsumption: patient.fruitVegConsumption || '',
        carbConsumption: patient.carbConsumption || '',
        proteinConsumption: patient.proteinConsumption || '',
        dairyConsumption: patient.dairyConsumption || '',
        fatConsumption: patient.fatConsumption || '',
        sugarConsumption: patient.sugarConsumption || '',
        alcoholConsumption: patient.alcoholConsumption || '',
        coffeeTeaConsumption: patient.coffeeTeaConsumption || '',
        activityLevel: patient.activityLevel || '',
        activityType: patient.activityType || '',
        smoking: patient.smoking || '',
        alcoholUse: patient.alcoholUse || '',
        sleep: patient.sleep || '',
        giSymptoms: patient.giSymptoms || '',
        weightChanges: patient.weightChanges || '',
        fatigue: patient.fatigue || '',
        otherComplaints: patient.otherComplaints || '',
        goals: patient.goals || '',
        nutritionistNotes: patient.nutritionistNotes || '',
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      });
    } else {
      resetForm();
    }

    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      id: '',
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
      imc: undefined,
      rcq: undefined,
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
      createdAt: '',
      updatedAt: '',
    });
    setErrors({});
  };

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    { key: 'phone', label: 'Telefone' },
    {
      key: 'age',
      label: 'Idade',
      render: (value: any, row: Patient) => {
        const age = new Date().getFullYear() - new Date(row.birthDate).getFullYear();
        return `${age} anos`;
      },
    },
    {
      key: 'currentWeight',
      label: 'Peso Atual',
      render: (value: number) => (value ? `${value} kg` : '-'),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (value: any, row: Patient) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => openModal('view', row)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openModal('edit', row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row)}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar pacientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="secondary">
          <Search className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>

      {/* Table */}
      <Table
        data={patients}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'edit' ? 'Editar Paciente' : 'Detalhes do Paciente'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={modalMode === 'view'}
                error={errors.name}
              />
              <Input
                label="E-mail"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={modalMode === 'view'}
                error={errors.email}
              />
              <Input
                label="Telefone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                disabled={modalMode === 'view'}
                error={errors.phone}
              />
              <Input
                label="Data de nascimento"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                required
                disabled={modalMode === 'view'}
                error={errors.birthDate}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'M' | 'F' })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={modalMode === 'view'}
                >
                  <option value="">Selecione</option>
                  <option value="F">Feminino</option>
                  <option value="M">Masculino</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
              </div>
              <Input
                label="Estado Civil"
                value={formData.maritalStatus || ''}
                onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Profissão"
                value={formData.profession || ''}
                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Endereço"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={modalMode === 'view'}
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
                onChange={(e) => setFormData({ ...formData, currentWeight: Number(e.target.value) || undefined })}
                disabled={modalMode === 'view'}
                error={errors.currentWeight}
              />
              <Input
                label="Altura (cm)"
                type="number"
                value={formData.height || ''}
                onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) || undefined })}
                disabled={modalMode === 'view'}
                error={errors.height}
              />
              <Input
                label="Circunferência da Cintura (cm)"
                type="number"
                step="0.1"
                value={formData.waistCirc || ''}
                onChange={(e) => setFormData({ ...formData, waistCirc: Number(e.target.value) || undefined })}
                disabled={modalMode === 'view'}
                error={errors.waistCirc}
              />
              <Input
                label="Circunferência do Quadril (cm)"
                type="number"
                step="0.1"
                value={formData.hipCirc || ''}
                onChange={(e) => setFormData({ ...formData, hipCirc: Number(e.target.value) || undefined })}
                disabled={modalMode === 'view'}
                error={errors.hipCirc}
              />
              <Input
                label="Percentual de Gordura (%)"
                type="number"
                step="0.1"
                value={formData.fatPercentage || ''}
                onChange={(e) => setFormData({ ...formData, fatPercentage: Number(e.target.value) || undefined })}
                disabled={modalMode === 'view'}
                error={errors.fatPercentage}
              />
              <Input
                label="IMC"
                value={formData.imc || ''}
                disabled
              />
              <Input
                label="RCQ"
                value={formData.rcq || ''}
                disabled
              />
            </div>
          </div>

          {/* Dados Clínicos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados Clínicos e Histórico de Saúde</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Motivo da Consulta"
                value={formData.consultReason || ''}
                onChange={(e) => setFormData({ ...formData, consultReason: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Doenças Diagnosticadas"
                value={formData.diagnosedDiseases || ''}
                onChange={(e) => setFormData({ ...formData, diagnosedDiseases: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Cirurgias Prévias"
                value={formData.pastSurgeries || ''}
                onChange={(e) => setFormData({ ...formData, pastSurgeries: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Histórico Familiar"
                value={formData.familyHistory || ''}
                onChange={(e) => setFormData({ ...formData, familyHistory: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Medicamentos em Uso"
                value={formData.medications || ''}
                onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Alergias/Intolerâncias"
                value={formData.allergies || ''}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Suplementos em Uso"
                value={formData.supplements || ''}
                onChange={(e) => setFormData({ ...formData, supplements: e.target.value })}
                disabled={modalMode === 'view'}
              />
            </div>
          </div>

          {/* Hábitos Alimentares */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Hábitos Alimentares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Horários das Refeições"
                value={formData.mealTimes || ''}
                onChange={(e) => setFormData({ ...formData, mealTimes: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Alimentos Consumidos Habitualmente"
                value={formData.usualFoods || ''}
                onChange={(e) => setFormData({ ...formData, usualFoods: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apetite</label>
                <select
                  value={formData.appetite || ''}
                  onChange={(e) => setFormData({ ...formData, appetite: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={modalMode === 'view'}
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
                  value={formData.chewing || ''}
                  onChange={(e) => setFormData({ ...formData, chewing: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={modalMode === 'view'}
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
                onChange={(e) => setFormData({ ...formData, waterIntake: Number(e.target.value) || undefined })}
                disabled={modalMode === 'view'}
                error={errors.waterIntake}
              />
              <Input
                label="Frutas e Verduras"
                value={formData.fruitVegConsumption || ''}
                onChange={(e) => setFormData({ ...formData, fruitVegConsumption: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Carboidratos"
                value={formData.carbConsumption || ''}
                onChange={(e) => setFormData({ ...formData, carbConsumption: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Proteínas"
                value={formData.proteinConsumption || ''}
                onChange={(e) => setFormData({ ...formData, proteinConsumption: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Lácteos"
                value={formData.dairyConsumption || ''}
                onChange={(e) => setFormData({ ...formData, dairyConsumption: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Gorduras"
                value={formData.fatConsumption || ''}
                onChange={(e) => setFormData({ ...formData, fatConsumption: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Açúcares e Doces"
                value={formData.sugarConsumption || ''}
                onChange={(e) => setFormData({ ...formData, sugarConsumption: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Bebidas Alcoólicas"
                value={formData.alcoholConsumption || ''}
                onChange={(e) => setFormData({ ...formData, alcoholConsumption: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Café/Chá"
                value={formData.coffeeTeaConsumption || ''}
                onChange={(e) => setFormData({ ...formData, coffeeTeaConsumption: e.target.value })}
                disabled={modalMode === 'view'}
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
                  value={formData.activityLevel || ''}
                  onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={modalMode === 'view'}
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
                value={formData.activityType || ''}
                onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Tabagismo"
                value={formData.smoking || ''}
                onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Etilismo"
                value={formData.alcoholUse || ''}
                onChange={(e) => setFormData({ ...formData, alcoholUse: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Sono (Horas por noite, Qualidade)"
                value={formData.sleep || ''}
                onChange={(e) => setFormData({ ...formData, sleep: e.target.value })}
                disabled={modalMode === 'view'}
              />
            </div>
          </div>

          {/* Avaliação Subjetiva */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Avaliação Subjetiva</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Sintomas Gastrointestinais"
                value={formData.giSymptoms || ''}
                onChange={(e) => setFormData({ ...formData, giSymptoms: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Alterações de Peso Recentes"
                value={formData.weightChanges || ''}
                onChange={(e) => setFormData({ ...formData, weightChanges: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Fadiga/Energia"
                value={formData.fatigue || ''}
                onChange={(e) => setFormData({ ...formData, fatigue: e.target.value })}
                disabled={modalMode === 'view'}
              />
              <Input
                label="Outras Queixas"
                value={formData.otherComplaints || ''}
                onChange={(e) => setFormData({ ...formData, otherComplaints: e.target.value })}
                disabled={modalMode === 'view'}
              />
            </div>
          </div>

          {/* Objetivos e Expectativas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Objetivos e Expectativas</h2>
            <Input
              label="Objetivos"
              value={formData.goals || ''}
              onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
              disabled={modalMode === 'view'}
            />
          </div>

          {/* Observações do Nutricionista */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Observações do Nutricionista</h2>
            <Input
              label="Observações"
              value={formData.nutritionistNotes || ''}
              onChange={(e) => setFormData({ ...formData, nutritionistNotes: e.target.value })}
              disabled={modalMode === 'view'}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              {modalMode === 'view' ? 'Fechar' : 'Cancelar'}
            </Button>
            {modalMode === 'edit' && <Button type="submit">Salvar</Button>}
          </div>
        </form>
      </Modal>
    </div>
  );
};