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
import { TrendingUp, TrendingDown, User } from 'lucide-react';


interface EvolutionData {
  date: string;
  weight: number;
  bodyFat: number;
  muscleMass: number;
  waist: number;
  chest: number;
  hip: number;
  arm: number;
}

type TimeRange = '3m' | '6m' | '1y';

interface WeightTrend {
  trend: 'up' | 'down' | 'stable';
  value: number;
}

export const Evolution: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [evolutionData, setEvolutionData] = useState<EvolutionData[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('6m');

  useEffect(() => {
    if (selectedPatient) {
      loadEvolutionData();
    }
  }, [selectedPatient, timeRange]);

  const loadEvolutionData = async (): Promise<void> => {
    const mockData: EvolutionData[] = [
      { date: '2024-01-01', weight: 70, bodyFat: 22, muscleMass: 35, waist: 78, chest: 95, hip: 98, arm: 28 },
      { date: '2024-01-15', weight: 69.5, bodyFat: 21.5, muscleMass: 35.2, waist: 77, chest: 95, hip: 97, arm: 28.2 },
      { date: '2024-02-01', weight: 69, bodyFat: 21, muscleMass: 35.5, waist: 76, chest: 96, hip: 96, arm: 28.5 },
      { date: '2024-02-15', weight: 68.5, bodyFat: 20.5, muscleMass: 35.8, waist: 75, chest: 96, hip: 95, arm: 28.8 },
      { date: '2024-03-01', weight: 68, bodyFat: 20, muscleMass: 36, waist: 74, chest: 97, hip: 94, arm: 29 },
    ];
    setEvolutionData(mockData);
  };

  const getWeightTrend = (): WeightTrend => {
    if (evolutionData.length < 2) return { trend: 'stable', value: 0 };

    const latest = evolutionData[evolutionData.length - 1];
    const previous = evolutionData[evolutionData.length - 2];
    const difference = latest.weight - previous.weight;

    return {
      trend: difference > 0 ? 'up' : difference < 0 ? 'down' : 'stable',
      value: Math.abs(difference)
    };
  };

  const weightTrend = getWeightTrend();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Evolução dos Pacientes</h1>
      </div>

     
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selecionar Paciente
            </label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um paciente</option>
              <option value="1">Maria Silva</option>
              <option value="2">João Santos</option>
              <option value="3">Ana Costa</option>
            </select>
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
      </div>

      {selectedPatient ? (
        <>
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Peso Atual</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {evolutionData.length > 0
                      ? `${evolutionData[evolutionData.length - 1].weight} kg`
                      : '-'}
                  </p>
                </div>
              </div>
            </div>

          
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

       
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">% Gordura</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {evolutionData.length > 0
                      ? `${evolutionData[evolutionData.length - 1].bodyFat}%`
                      : '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

         
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Evolução do Peso
            </h2>
            <div className="h-80">
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
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Selecione um paciente
          </h2>
          <p className="text-gray-600">
            Escolha um paciente acima para visualizar sua evolução e progresso
            ao longo do tempo.
          </p>
        </div>
      )}
    </div>
  );
};
