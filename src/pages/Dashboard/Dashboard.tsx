import React, { useEffect, useState } from 'react';
import { Users, Calendar, FileText, TrendingUp } from 'lucide-react';
// import { apiService } from '../services/api';

interface DashboardStats {
  totalPatients: number;
  todayConsultations: number;
  activeMealPlans: number;
  monthlyGrowth: number;
}

const StatCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
}> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    todayConsultations: 0,
    activeMealPlans: 0,
    monthlyGrowth: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Simulando dados enquanto não há backend
      setTimeout(() => {
        setStats({
          totalPatients: 127,
          todayConsultations: 8,
          activeMealPlans: 45,
          monthlyGrowth: 12.5,
        });
        setIsLoading(false);
      }, 1000);
      
      // Quando houver backend, usar:
      // const response = await apiService.getDashboardStats();
      // setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="ml-4 space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          {new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Pacientes"
          value={stats.totalPatients}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Consultas Hoje"
          value={stats.todayConsultations}
          icon={Calendar}
          color="bg-green-500"
        />
        <StatCard
          title="Planos Ativos"
          value={stats.activeMealPlans}
          icon={FileText}
          color="bg-purple-500"
        />
        <StatCard
          title="Crescimento Mensal"
          value={`${stats.monthlyGrowth}%`}
          icon={TrendingUp}
          color="bg-orange-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Próximas Consultas</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { time: '09:00', patient: 'Maria Silva', type: 'Consulta de retorno' },
                { time: '10:30', patient: 'João Santos', type: 'Primeira consulta' },
                { time: '14:00', patient: 'Ana Costa', type: 'Acompanhamento' },
              ].map((appointment, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patient}</p>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                  </div>
                  <span className="text-sm font-medium text-blue-600">{appointment.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Atividade Recente</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { action: 'Novo paciente cadastrado', patient: 'Carlos Oliveira', time: '2h atrás' },
                { action: 'Plano alimentar criado', patient: 'Lucia Fernandes', time: '4h atrás' },
                { action: 'Consulta finalizada', patient: 'Pedro Lima', time: '6h atrás' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.patient}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};