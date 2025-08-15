import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Download } from 'lucide-react';
import { MealPlan, Meal, Food } from '../types';
import { Button } from '../components/ui/Button';
import { Table, TableColumn } from '../components/ui/Table';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

export const MealPlans: React.FC = () => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedPlan, setSelectedPlan] = useState<MealPlan | null>(null);

  const [formData, setFormData] = useState<{
    patientName: string;
    title: string;
    description: string;
    calories: number;
    meals: Meal[];
  }>({
    patientName: '',
    title: '',
    description: '',
    calories: 0,
    meals: [],
  });

  useEffect(() => {
    loadMealPlans();
  }, [currentPage]);

  const loadMealPlans = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockPlans: MealPlan[] = [
        {
          id: '1',
          patientId: '1',
          patientName: 'Maria Silva',
          title: 'Plano de Emagrecimento',
          description: 'Plano focado em redução de peso com 1200 kcal',
          calories: 1200,
          createdAt: '2024-01-15',
          meals: [
            {
              id: '1',
              name: 'Café da manhã',
              time: '07:00',
              foods: [
                { id: '1', name: 'Aveia', quantity: '30g', calories: 120 },
                { id: '2', name: 'Banana', quantity: '1 unidade', calories: 90 },
              ],
            },
          ],
        },
        {
          id: '2',
          patientId: '2',
          patientName: 'João Santos',
          title: 'Plano de Ganho de Massa',
          description: 'Plano hipercalórico com 2500 kcal',
          calories: 2500,
          createdAt: '2024-01-10',
          meals: [],
        },
      ];
      setMealPlans(mockPlans);
      setTotalPages(1);
      setIsLoading(false);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Salvando plano:', formData);
    setIsModalOpen(false);
    resetForm();
    loadMealPlans();
  };

  const handleDelete = async (plan: MealPlan) => {
    if (window.confirm(`Tem certeza que deseja excluir o plano "${plan.title}"?`)) {
      console.log('Excluindo plano:', plan.id);
      loadMealPlans();
    }
  };

  const openModal = (mode: 'create' | 'edit' | 'view', plan?: MealPlan) => {
    setModalMode(mode);
    setSelectedPlan(plan || null);
    if (plan) {
      setFormData({
        patientName: plan.patientName,
        title: plan.title,
        description: plan.description,
        calories: plan.calories,
        meals: plan.meals,
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
    console.log(selectedPlan)
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      title: '',
      description: '',
      calories: 0,
      meals: [],
    });
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
            <Input
              label="Paciente"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              required
              disabled={modalMode === 'view'}
            />
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
                <Button type="button" variant="secondary" size="sm">
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
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
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
    </div>
  );
};
