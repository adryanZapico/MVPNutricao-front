import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Download, Search, X } from 'lucide-react';
import { MealPlan, Meal, Food, Patient } from '../../types';
import { Button } from '../../components/ui/Button';
import { Table, TableColumn } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { apiService } from '../../services/api';

export const MealPlans: React.FC = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);

  const [formData, setFormData] = useState<{
    patientId: string;
    title: string;
    description: string;
    calories: number;
    meals: Meal[];
  }>({
    patientId: '',
    title: '',
    description: '',
    calories: 0,
    meals: [],
  });

  const [mealFormData, setMealFormData] = useState<{
    name: string;
    time: string;
    foods: Food[];
  }>({
    name: '',
    time: '',
    foods: [{ name: '', quantity: '', calories: 0 }],
  });

  useEffect(() => {
    loadMealPlans();
  }, [currentPage]);

  useEffect(() => {
    if (patientSearchTerm.trim() === '') {
      setFilteredPatients([]);
    } else {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(patientSearchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [patientSearchTerm, patients]);

  const loadPatients = async () => {
    try {
      const response = await apiService.getPatients();
      setPatients(response.data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    }
  };

  const loadMealPlans = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getMealPlans(currentPage);
      setMealPlans(response.data);
      setTotalPages(Math.ceil(response.total / response.limit));
    } catch (error) {
      console.error('Erro ao carregar planos alimentares:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!formData.patientId) {
        alert('Selecione um paciente.');
        return;
      }

      if (modalMode === 'create') {
        const payload = {
          ...formData,
          patientName: patients.find(p => p.id === formData.patientId)?.name || 'Nome Desconhecido'
        };
        await apiService.createMealPlan(payload);
        alert('Plano alimentar criado com sucesso!');
      } else if (selectedPlan) {
        await apiService.updateMealPlan(selectedPlan.id, formData);
        alert('Plano alimentar atualizado com sucesso!');
      }

      setIsModalOpen(false);
      resetForm();
      loadMealPlans();
    } catch (error) {
      console.error('Erro ao salvar plano:', error);
      alert('Erro ao salvar o plano. Tente novamente.');
    }
  };

  const handleDelete = async (plan: MealPlan) => {
    if (window.confirm(`Tem certeza que deseja excluir o plano "${plan.title}"?`)) {
      try {
        await apiService.deleteMealPlan(plan.id);
        alert('Plano excluído com sucesso!');
        loadMealPlans();
      } catch (error) {
        console.error('Erro ao excluir plano:', error);
        alert('Erro ao excluir o plano. Tente novamente.');
      }
    }
  };

  const openModal = (mode: 'create' | 'edit' | 'view', plan?: MealPlan) => {
    setModalMode(mode);
    setSelectedPlan(plan || null);
    if (mode === 'create') {
      resetForm();
      loadPatients();
      setPatientSearchTerm('');
      setFilteredPatients([]);
    } else if (plan) {
      setFormData({
        patientId: plan.patientId,
        title: plan.title,
        description: plan.description,
        calories: plan.calories,
        meals: plan.meals,
      });
    }
    setIsModalOpen(true);
  };

  const openMealModal = () => {
    setMealFormData({
      name: '',
      time: '',
      foods: [{ name: '', quantity: '', calories: 0 }],
    });
    setIsMealModalOpen(true);
  };

  const addMeal = () => {
    // Filtra alimentos vazios
    const validFoods = mealFormData.foods.filter(
      food => food.name.trim() && food.quantity.trim()
    );

    if (!mealFormData.name || !mealFormData.time || validFoods.length === 0) {
      alert('Preencha todos os campos obrigatórios da refeição.');
      return;
    }

    const newMeal: Meal = {
      name: mealFormData.name,
      time: mealFormData.time,
      foods: validFoods,
    };

    setFormData({
      ...formData,
      meals: [...formData.meals, newMeal],
    });

    setIsMealModalOpen(false);
  };

  const addFoodField = () => {
    setMealFormData({
      ...mealFormData,
      foods: [...mealFormData.foods, { name: '', quantity: '', calories: 0 }],
    });
  };

  const removeFoodField = (index: number) => {
    const updatedFoods = [...mealFormData.foods];
    updatedFoods.splice(index, 1);
    setMealFormData({ ...mealFormData, foods: updatedFoods });
  };

  const updateFoodField = (index: number, field: keyof Food, value: string | number) => {
    const updatedFoods = [...mealFormData.foods];
    updatedFoods[index] = { ...updatedFoods[index], [field]: value };
    setMealFormData({ ...mealFormData, foods: updatedFoods });
  };

  const removeMeal = (index: number) => {
    const updatedMeals = [...formData.meals];
    updatedMeals.splice(index, 1);
    setFormData({ ...formData, meals: updatedMeals });
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      title: '',
      description: '',
      calories: 0,
      meals: [],
    });
    setPatientSearchTerm('');
    setFilteredPatients([]);
  };

  const selectPatient = (patient: Patient) => {
    setFormData({ ...formData, patientId: patient.id });
    setPatientSearchTerm(patient.name);
    setFilteredPatients([]);
  };

  const columns: TableColumn<MealPlan>[] = [
    { key: 'patientName', label: 'Paciente' },
    { key: 'title', label: 'Título' },
    { key: 'description', label: 'Descrição' },
    {
      key: 'calories',
      label: 'Calorias',
      render: (value) => `${value as number} kcal`,
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (value) => new Date(value as string).toLocaleDateString('pt-BR'),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: unknown, row: MealPlan) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => openModal('view', row)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openModal('edit', row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4 text-green-600" />
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
        <h1 className="text-2xl font-bold text-gray-900">Planos Alimentares</h1>
        <Button onClick={() => openModal('create')}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      <Table<MealPlan>
        data={mealPlans}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
      />

      {/* Modal principal do plano alimentar */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          modalMode === 'create'
            ? 'Novo Plano Alimentar'
            : modalMode === 'edit'
            ? 'Editar Plano'
            : 'Detalhes do Plano'
        }
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modalMode === 'create' ? (
              <div className="relative">
                <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-1">
                  Paciente
                </label>
                <div className="relative">
                  <Input
                    id="patient"
                    placeholder="Buscar paciente..."
                    value={patientSearchTerm}
                    onChange={(e) => setPatientSearchTerm(e.target.value)}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                
                {filteredPatients.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredPatients.map(patient => (
                      <div
                        key={patient.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => selectPatient(patient)}
                      >
                        {patient.name}
                      </div>
                    ))}
                  </div>
                )}
                
                {formData.patientId && (
                  <div className="mt-2 text-sm text-green-600">
                    Paciente selecionado: {patients.find(p => p.id === formData.patientId)?.name}
                  </div>
                )}
              </div>
            ) : (
              <Input
                label="Paciente"
                value={selectedPlan?.patientName || ''}
                disabled
              />
            )}
            <Input
              label="Calorias totais"
              type="number"
              value={formData.calories || ''}
              onChange={(e) => setFormData({ ...formData, calories: Number(e.target.value) })}
              required
              disabled={modalMode === 'view'}
            />
          </div>

          <Input
            label="Título do plano"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            disabled={modalMode === 'view'}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descrição do plano alimentar..."
              disabled={modalMode === 'view'}
            />
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Refeições</h3>
              {modalMode !== 'view' && (
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm"
                  onClick={openMealModal}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Refeição
                </Button>
              )}
            </div>

            {formData.meals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Nenhuma refeição adicionada ainda</div>
            ) : (
              <div className="space-y-4">
                {formData.meals.map((meal, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                    {modalMode !== 'view' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => removeMeal(index)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{meal.name}</h4>
                      <span className="text-sm text-gray-500">{meal.time}</span>
                    </div>
                    <div className="space-y-2">
                      {meal.foods?.map((food: Food, foodIndex: number) => (
                        <div key={foodIndex} className="flex items-center justify-between text-sm">
                          <span>{food.name} - {food.quantity}</span>
                          <span className="text-gray-500">{food.calories} kcal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {modalMode !== 'view' && (
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {modalMode === 'create' ? 'Criar Plano' : 'Salvar Alterações'}
              </Button>
            </div>
          )}
        </form>
      </Modal>

      {/* Modal simples para adicionar refeição */}
      <Modal
        isOpen={isMealModalOpen}
        onClose={() => setIsMealModalOpen(false)}
        title="Adicionar Refeição"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Nome da refeição"
            value={mealFormData.name}
            onChange={(e) => setMealFormData({ ...mealFormData, name: e.target.value })}
            placeholder="Ex: Café da manhã, Almoço, Jantar"
            required
          />
          
          <Input
            label="Horário"
            type="time"
            value={mealFormData.time}
            onChange={(e) => setMealFormData({ ...mealFormData, time: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alimentos</label>
            <div className="space-y-3">
              {mealFormData.foods.map((food, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <Input
                      placeholder="Nome do alimento"
                      value={food.name}
                      onChange={(e) => updateFoodField(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-4">
                    <Input
                      placeholder="Quantidade"
                      value={food.quantity}
                      onChange={(e) => updateFoodField(index, 'quantity', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      placeholder="Cal"
                      type="number"
                      value={food.calories}
                      onChange={(e) => updateFoodField(index, 'calories', Number(e.target.value))}
                    />
                  </div>
                  <div className="col-span-1">
                    {mealFormData.foods.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFoodField(index)}
                        className="h-9 w-9 p-0"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFoodField}
                className="w-full"
              >
                <Plus className="h-3 w-3 mr-1" />
                Adicionar outro alimento
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsMealModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={addMeal}
            >
              Adicionar Refeição
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};