import React, { useState, useEffect } from 'react';
import { Plus, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Consultation } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

export const Consultations: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const [formData, setFormData] = useState({
    patientName: '',
    date: '',
    time: '',
    notes: '',
  });

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    const mockConsultations: Consultation[] = [
      {
        id: '1',
        patientId: '1',
        patientName: 'Maria Silva',
        date: '2024-01-25',
        time: '09:00',
        status: 'scheduled',
        notes: 'Consulta de retorno',
      },
      {
        id: '2',
        patientId: '2',
        patientName: 'João Santos',
        date: '2024-01-25',
        time: '14:00',
        status: 'scheduled',
        notes: 'Primeira consulta',
      },
    ];
    setConsultations(mockConsultations);
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getConsultationsForDate = (date: Date) => {
    return consultations.filter(consultation =>
      isSameDay(new Date(consultation.date), date)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Criando consulta:', formData);
    setIsModalOpen(false);
    resetForm();
    loadConsultations();
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      date: '',
      time: '',
      notes: '',
    });
  };

  const openCreateModal = (date?: Date) => {
    if (date) {
      setSelectedDate(date);
      setFormData({
        ...formData,
        date: format(date, 'yyyy-MM-dd'),
      });
    }
    setIsModalOpen(true);
  };

  const renderCalendarView = () => {
    const days = getDaysInMonth();
    const today = new Date();

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-500" />
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </h2>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentDate(addDays(currentDate, -30))}
            >
              Anterior
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Hoje
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentDate(addDays(currentDate, 30))}
            >
              Próximo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="bg-gray-50 py-2 px-3">
              <span className="text-xs font-medium text-gray-700">{day}</span>
            </div>
          ))}

          {days.map((day) => {
            const dayConsultations = getConsultationsForDate(day);
            const isToday = isSameDay(day, today);
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <div
                key={day.toISOString()}
                className={`bg-white p-2 h-32 cursor-pointer hover:bg-gray-50 
                  ${isToday ? 'ring-2 ring-blue-500' : ''} 
                  ${isSelected ? 'bg-blue-50' : ''}`}
                onClick={() => openCreateModal(day)}
              >
                <span
                  className={`text-sm font-medium 
                  ${isToday ? 'text-blue-600' : 'text-gray-900'}`}
                >
                  {format(day, 'd')}
                </span>

                <div className="mt-1 space-y-1">
                  {dayConsultations.slice(0, 3).map((consultation) => (
                    <div
                      key={consultation.id}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate flex items-center gap-1"
                    >
                      <Clock className="h-3 w-3" />
                      {consultation.time} - {consultation.patientName}
                    </div>
                  ))}
                  {dayConsultations.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayConsultations.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-blue-500" />
          Consultas
        </h1>
        <div className="flex space-x-3">
          <div className="flex bg-gray-100 rounded-lg">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                viewMode === 'month'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                viewMode === 'week'
                  ? 'bg-white shadow text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Semana
            </button>
          </div>
          <Button onClick={() => openCreateModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Consulta
          </Button>
        </div>
      </div>

      {renderCalendarView()}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Consulta"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Paciente"
            value={formData.patientName}
            onChange={(e) =>
              setFormData({ ...formData, patientName: e.target.value })
            }
            placeholder="Nome do paciente"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />
            <Input
              label="Horário"
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({ ...formData, time: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Observações sobre a consulta..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Agendar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
