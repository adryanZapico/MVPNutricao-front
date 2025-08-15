import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
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
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: 'F' as 'M' | 'F',
    height: 0,
    currentWeight: 0,
    targetWeight: 0,
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
    } finally {
      setIsLoading(false);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'create') {
        apiService.createPatient(formData)
        console.log('Criando paciente:', formData);
      } else if (modalMode === 'edit' && selectedPatient) {
        await apiService.updatePatient(selectedPatient.id, formData);
        console.log('Paciente atualizado:', formData);
      }

      setIsModalOpen(false);
      resetForm();
      loadPatients();
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
    }
  };

  const handleDelete = async (patient: Patient) => {
    if (window.confirm(`Tem certeza que deseja excluir o paciente ${patient.name}?`)) {
      try {
        await apiService.deletePatient(patient.id);
        console.log('Excluindo paciente:', patient.id);
        loadPatients();
      } catch (error) {
        console.error('Erro ao excluir paciente:', error);
      }
    }
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  const openModal = (mode: 'create' | 'edit' | 'view', patient?: Patient) => {
    setModalMode(mode);
    setSelectedPatient(patient || null);

    if (patient) {
      setFormData({
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        birthDate: formatDateForInput(patient.birthDate), // ⬅ Aqui formata
        gender: patient.gender,
        height: patient.height,
        currentWeight: patient.currentWeight,
        targetWeight: patient.targetWeight,
      });
    } else {
      resetForm();
    }

    setIsModalOpen(true);
  };


  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      birthDate: '',
      gender: 'F',
      height: 0,
      currentWeight: 0,
      targetWeight: 0,
    });
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
      }
    },
    {
      key: 'currentWeight',
      label: 'Peso Atual',
      render: (value: number) => `${value} kg`
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
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
        <Button onClick={() => openModal('create')}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Paciente
        </Button>
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
        title={
          modalMode === 'create'
            ? 'Novo Paciente'
            : modalMode === 'edit'
              ? 'Editar Paciente'
              : 'Detalhes do Paciente'
        }
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nome completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={modalMode === 'view'}
            />
            <Input
              label="E-mail"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={modalMode === 'view'}
            />
            <Input
              label="Telefone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              disabled={modalMode === 'view'}
            />
            <Input
              label="Data de nascimento"
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              required
              disabled={modalMode === 'view'}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexo
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'M' | 'F' })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={modalMode === 'view'}
              >
                <option value="F">Feminino</option>
                <option value="M">Masculino</option>
              </select>
            </div>
            <Input
              label="Altura (cm)"
              type="number"
              value={formData.height || ''}
              onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
              required
              disabled={modalMode === 'view'}
            />
            <Input
              label="Peso atual (kg)"
              type="number"
              step="0.1"
              value={formData.currentWeight || ''}
              onChange={(e) => setFormData({ ...formData, currentWeight: Number(e.target.value) })}
              required
              disabled={modalMode === 'view'}
            />
            <Input
              label="Peso alvo (kg)"
              type="number"
              step="0.1"
              value={formData.targetWeight || ''}
              onChange={(e) => setFormData({ ...formData, targetWeight: Number(e.target.value) })}
              required
              disabled={modalMode === 'view'}
            />
          </div>

          {modalMode !== 'view' && (
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {modalMode === 'create' ? 'Criar' : 'Salvar'}
              </Button>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};