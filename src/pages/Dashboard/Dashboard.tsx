import React, { useEffect, useState } from 'react';
import { Users, Calendar, FileText, TrendingUp } from 'lucide-react';
import { apiService } from '../../services/api';
import { DashboardStats } from '../../types';


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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const data = await apiService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
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

  if (!stats) {
    return <p className="text-red-600">Erro ao carregar estatísticas</p>;
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

      {/* Recent Activity e Próximas Consultas ainda mockados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Próximas Consultas</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* Aqui ainda mockado */}
              <p className="text-gray-500 text-sm">Integração com backend ainda não implementada</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Atividade Recente</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* Aqui ainda mockado */}
              <p className="text-gray-500 text-sm">Integração com backend ainda não implementada</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
