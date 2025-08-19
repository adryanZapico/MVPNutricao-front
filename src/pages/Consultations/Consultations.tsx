import React, { useState, useEffect, useRef } from 'react';
import { Plus, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Consultation, Patient } from '../../types';
import { apiService } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const Consultations: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewConsultations, setViewConsultations] = useState<Consultation[]>([]);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Patient[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    date: '',
    time: '',
    status: 'scheduled' as const,
    notes: '',
    weight: 0,
  });

  useEffect(() => {
    loadConsultations();
    loadPatients();
  }, []);

  const loadConsultations = async () => {
    try {
      const response = await apiService.getConsultations();
      // console.log('Consultations carregadas da API:', response.data); // Depuração
      setConsultations(response.data);
    } catch (error) {
      console.error('Erro ao carregar consultas:', error);
    }
  };

  const loadPatients = async () => {
    try {
      const response = await apiService.getPatients();
      setPatients(response.data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    }
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  };

  const getConsultationsForDate = (date: Date) => {
    // console.log('Filtrando consultas para:', format(date, 'yyyy-MM-dd')); // Depuração
    const filtered = consultations.filter(consultation =>
      isSameDay(parseISO(consultation.date), date) // Usa parseISO para consistência
    );
    // console.log('Consultas filtradas:', filtered); // Depuração
    return filtered;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Valor de formData.date antes de enviar:', formData.date);
    try {
      const payload = {
        ...formData,
        date: formData.date,
      };
      console.log('Payload enviado ao backend:', payload);
      await apiService.createConsultation(payload);
      const updatedConsultations = await apiService.getConsultations();
      console.log('Consultas após criação:', updatedConsultations.data);
      setIsCreateModalOpen(false);
      resetForm();
      loadConsultations();
    } catch (error) {
      console.error('Erro ao salvar consulta:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      patientName: '',
      date: '',
      time: '',
      status: 'scheduled',
      notes: '',
      weight: 0,
    });
    setSearchTerm('');
    setSuggestions([]);
  };

  const openCreateModal = (date?: Date) => {
    if (date) {
      setSelectedDate(date);
      setFormData({
        ...formData,
        date: format(date, 'yyyy-MM-dd'),
      });
    }
    setIsCreateModalOpen(true);
  };

  const openViewModal = (date: Date) => {
    const dayConsultations = getConsultationsForDate(date);
    setViewConsultations(dayConsultations);
    setSelectedDate(date);
    setIsViewModalOpen(true);
  };

  const handlePatientSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term) {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(term.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setFormData({
      ...formData,
      patientId: patient.id,
      patientName: patient.name,
    });
    setSearchTerm(patient.name);
    setSuggestions([]);
    if (inputRef.current) inputRef.current.focus();
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
                  {dayConsultations.length > 0 && dayConsultations.slice(0, 3).map((consultation) => (
                    <div
                      key={consultation.id}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate flex items-center gap-1"
                    >
                      <Clock className="h-3 w-3" />
                      {consultation.time} - {consultation.patientName}
                    </div>
                  ))}
                  {dayConsultations.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openViewModal(day);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Ver todas ({dayConsultations.length})
                    </Button>
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

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nova Consulta"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paciente
            </label>
            <Input
              ref={inputRef}
              value={searchTerm}
              onChange={handlePatientSearch}
              placeholder="Digite o nome do paciente..."
              required
            />
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-auto">
                {suggestions.map((patient) => (
                  <li
                    key={patient.id}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handlePatientSelect(patient)}
                  >
                    {patient.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Data"
              type="date"
              value={formData.date}
              onChange={(e) => {
                console.log('Valor do campo data:', e.target.value);
                setFormData({ ...formData, date: e.target.value });
              }}
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

          {/* <Input
            label="Peso (kg)"
            type="number"
            step="0.1"
            value={formData.weight || ''}
            onChange={(e) =>
              setFormData({ ...formData, weight: Number(e.target.value) })
            }
            placeholder="Peso do paciente"
            required
          /> */}

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
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Agendar</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Consultas em ${selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: ptBR }) : ''}`}
        size="lg"
      >
        <div className="space-y-4">
          {viewConsultations.length === 0 ? (
            <p className="text-gray-500">Nenhuma consulta neste dia.</p>
          ) : (
            viewConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="p-3 bg-gray-50 rounded-md border border-gray-200"
              >
                <p><strong>Paciente:</strong> {consultation.patientName}</p>
                <p><strong>Horário:</strong> {consultation.time}</p>
                <p><strong>Status:</strong> {consultation.status}</p>
                {/* <p><strong>Peso:</strong> {consultation.weight} kg</p> */}
                <p><strong>Observações:</strong> {consultation.notes || 'Nenhuma'}</p>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};