import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, User, Search } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { apiService } from '../../services/api';

interface EvolutionData {
  id: string;
  patientId: string;
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  measures?: {
    waist?: number;
    chest?: number;
    hip?: number;
    arm?: number;
  };
}

interface Patient {
  id: string;
  name: string;
  email: string;
  currentWeight?: number;
  fatPercentage?: number;
}

type TimeRange = '3m' | '6m' | '1y';

interface WeightTrend {
  trend: 'up' | 'down' | 'stable';
  value: number;
}

export const Evolution: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [evolutionData, setEvolutionData] = useState<EvolutionData[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('6m');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEvolution, setIsLoadingEvolution] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPatients([]);
    } else {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  }, [searchTerm, patients]);

  const loadPatients = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getPatients();
      setPatients(response.data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPatientEvolution = async (patientId: string) => {
    try {
      setIsLoadingEvolution(true);
      const response = await apiService.getEvolution(patientId);
      setEvolutionData(response.data);
    } catch (error) {
      console.error('Erro ao carregar evolução:', error);
      setEvolutionData([]);
    } finally {
      setIsLoadingEvolution(false);
    }
  };

  const selectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setSearchTerm(patient.name);
    setFilteredPatients([]);
    loadPatientEvolution(patient.id);
  };

  const clearSelection = () => {
    setSelectedPatient(null);
    setSearchTerm('');
    setEvolutionData([]);
  };

  const getWeightTrend = (): WeightTrend => {
    if (evolutionData.length < 2) return { trend: 'stable', value: 0 };

    const latest = evolutionData[evolutionData.length - 1];
    const previous = evolutionData[evolutionData.length - 2];
    const difference = latest.weight - previous.weight;

    if (Math.abs(difference) < 0.1) return { trend: 'stable', value: 0 };

    return {
      trend: difference > 0 ? 'up' : 'down',
      value: Math.abs(difference)
    };
  };

  const getLatestBodyFat = (): number | undefined => {
    if (evolutionData.length === 0) return selectedPatient?.fatPercentage;
    
    for (let i = evolutionData.length - 1; i >= 0; i--) {
      if (evolutionData[i].bodyFat !== undefined) {
        return evolutionData[i].bodyFat;
      }
    }
    
    return selectedPatient?.fatPercentage;
  };

  const getLatestMuscleMass = (): number | undefined => {
    if (evolutionData.length === 0) return undefined;
    
    for (let i = evolutionData.length - 1; i >= 0; i--) {
      if (evolutionData[i].muscleMass !== undefined) {
        return evolutionData[i].muscleMass;
      }
    }
    
    return undefined;
  };

  const getLatestWeight = (): number | undefined => {
    if (evolutionData.length === 0) return selectedPatient?.currentWeight;
    return evolutionData[evolutionData.length - 1].weight;
  };

  const weightTrend = getWeightTrend();
  const latestWeight = getLatestWeight();
  const latestBodyFat = getLatestBodyFat();
  const latestMuscleMass = getLatestMuscleMass();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Evolução dos Pacientes</h1>
      </div>

      {/* Pesquisa de Pacientes */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar Paciente
            </label>
            <div className="relative">
              <Input
                placeholder="Digite o nome do paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!!selectedPatient}
                className="pr-10"
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
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-gray-600">{patient.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período
            </label>
            <div className="flex bg-gray-100 rounded-lg">
              {[
                { key: '3m', label: '3M' },
                { key: '6m', label: '6M' },
                { key: '1y', label: '1A' },
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setTimeRange(option.key as TimeRange)}
                  className={`px-4 py-2 text-sm font-medium ${
                    timeRange === option.key
                      ? 'bg-white shadow text-gray-900'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedPatient && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">Paciente Selecionado</h3>
                <p className="text-blue-700">{selectedPatient.name}</p>
                <p className="text-sm text-blue-600">{selectedPatient.email}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={clearSelection}
              >
                Alterar
              </Button>
            </div>
          </div>
        )}
      </div>

      {selectedPatient ? (
        <>
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Peso Atual */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Peso Atual</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {latestWeight ? `${latestWeight} kg` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Variação */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div
                  className={`p-3 rounded-full ${
                    weightTrend.trend === 'down'
                      ? 'bg-green-100'
                      : weightTrend.trend === 'up'
                      ? 'bg-red-100'
                      : 'bg-gray-100'
                  }`}
                >
                  {weightTrend.trend === 'down' ? (
                    <TrendingDown className="h-6 w-6 text-green-600" />
                  ) : weightTrend.trend === 'up' ? (
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  ) : (
                    <TrendingUp className="h-6 w-6 text-gray-600" />
                  )}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Variação</p>
                  <p
                    className={`text-2xl font-semibold ${
                      weightTrend.trend === 'down'
                        ? 'text-green-600'
                        : weightTrend.trend === 'up'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {weightTrend.trend === 'down'
                      ? '-'
                      : weightTrend.trend === 'up'
                      ? '+'
                      : ''}
                    {weightTrend.value.toFixed(1)} kg
                  </p>
                </div>
              </div>
            </div>

            {/* Percentual de Gordura */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">% Gordura</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {latestBodyFat ? `${latestBodyFat}%` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Massa Muscular */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Massa Muscular</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {latestMuscleMass ? `${latestMuscleMass} %` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Evolução */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Evolução do Peso
            </h2>
            <div className="h-80">
              {isLoadingEvolution ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : evolutionData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value: string) =>
                        new Date(value).toLocaleDateString('pt-BR', {
                          month: 'short',
                          day: '2-digit'
                        })
                      }
                    />
                    <YAxis
                      domain={['dataMin - 2', 'dataMax + 2']}
                      tickFormatter={(value: number) => `${value}kg`}
                    />
                    <Tooltip
                      labelFormatter={(value: string) =>
                        new Date(value).toLocaleDateString('pt-BR')
                      }
                      formatter={(value: number) => [`${value} kg`, 'Peso']}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Nenhum dado de evolução disponível
                </div>
              )}
            </div>
          </div>

          {/* Tabela de Dados Detalhados */}
          {evolutionData.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Histórico de Evolução
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Peso (kg)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Gordura
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Massa Muscular 
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {evolutionData.map((evolution) => (
                      <tr key={evolution.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(evolution.date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {evolution.weight}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {evolution.bodyFat || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {evolution.muscleMass ? `${evolution.muscleMass} ` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Selecione um paciente
          </h2>
          <p className="text-gray-600">
            Use a busca acima para visualizar a evolução de um paciente
          </p>
        </div>
      )}
    </div>
  );
};