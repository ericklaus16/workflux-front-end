"use client"

import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrando componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Definindo tipos TypeScript
interface SectorData {
  nome: string;
  orcamento: number;
  despesas: number;
  eficiencia: number;
  funcionarios: number;
  projetos: number;
  concluidos: number;
  cor: string;
}

interface SectorsData {
  [key: string]: SectorData;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('mensal');
  const [selectedSector, setSelectedSector] = useState<string>('todos');
  const [loading, setLoading] = useState<boolean>(true);

  // Dados mockados com tipo definido
  const sectorsData: SectorsData = {
    saude: {
      nome: 'Saúde',
      orcamento: 45000000,
      despesas: 42000000,
      eficiencia: 87,
      funcionarios: 1250,
      projetos: 24,
      concluidos: 18,
      cor: 'bg-blue-500',
    },
    financas: {
      nome: 'Finanças',
      orcamento: 28000000,
      despesas: 26500000,
      eficiencia: 92,
      funcionarios: 320,
      projetos: 15,
      concluidos: 14,
      cor: 'bg-green-500',
    },
    educacao: {
      nome: 'Educação',
      orcamento: 52000000,
      despesas: 48500000,
      eficiencia: 79,
      funcionarios: 2100,
      projetos: 32,
      concluidos: 25,
      cor: 'bg-purple-500',
    },
    infraestrutura: {
      nome: 'Infraestrutura',
      orcamento: 38000000,
      despesas: 41000000,
      eficiencia: 65,
      funcionarios: 680,
      projetos: 18,
      concluidos: 12,
      cor: 'bg-orange-500',
    },
    seguranca: {
      nome: 'Segurança',
      orcamento: 32000000,
      despesas: 30500000,
      eficiencia: 88,
      funcionarios: 850,
      projetos: 21,
      concluidos: 17,
      cor: 'bg-red-500',
    },
  };

  // Dados para gráficos com tipos definidos
  const getChartData = (): { 
    barData: ChartData; 
    efficiencyData: ChartData; 
    projectsData: ChartData; 
    employeesData: ChartData; 
  } => {
    const sectors = Object.keys(sectorsData);
    const labels = sectors.map(sector => sectorsData[sector].nome);
    
    return {
      barData: {
        labels: labels,
        datasets: [
          {
            label: 'Orçamento (R$)',
            data: sectors.map(sector => sectorsData[sector].orcamento / 1000000),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
          },
          {
            label: 'Despesas (R$)',
            data: sectors.map(sector => sectorsData[sector].despesas / 1000000),
            backgroundColor: 'rgba(239, 68, 68, 0.6)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1,
          },
        ],
      },
      efficiencyData: {
        labels: labels,
        datasets: [
          {
            label: 'Eficiência (%)',
            data: sectors.map(sector => sectorsData[sector].eficiencia),
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(139, 92, 246, 0.7)',
              'rgba(249, 115, 22, 0.7)',
              'rgba(239, 68, 68, 0.7)',
            ],
            borderColor: [
              'rgba(59, 130, 246, 1)',
              'rgba(16, 185, 129, 1)',
              'rgba(139, 92, 246, 1)',
              'rgba(249, 115, 22, 1)',
              'rgba(239, 68, 68, 1)',
            ],
            borderWidth: 2,
          },
        ],
      },
      projectsData: {
        labels: labels,
        datasets: [
          {
            label: 'Projetos Concluídos',
            data: sectors.map(sector => sectorsData[sector].concluidos),
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1,
          },
          {
            label: 'Projetos em Andamento',
            data: sectors.map(sector => 
              sectorsData[sector].projetos - sectorsData[sector].concluidos
            ),
            backgroundColor: 'rgba(249, 115, 22, 0.6)',
            borderColor: 'rgba(249, 115, 22, 1)',
            borderWidth: 1,
          },
        ],
      },
      employeesData: {
        labels: labels,
        datasets: [
          {
            label: 'Funcionários',
            data: sectors.map(sector => sectorsData[sector].funcionarios),
            backgroundColor: [
              'rgba(59, 130, 246, 0.7)',
              'rgba(16, 185, 129, 0.7)',
              'rgba(139, 92, 246, 0.7)',
              'rgba(249, 115, 22, 0.7)',
              'rgba(239, 68, 68, 0.7)',
            ],
            borderWidth: 1,
          },
        ],
      },
    };
  };

  const chartData = getChartData();

  // Opções dos gráficos
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Análise por Setor',
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Valores em Milhões (R$)',
        },
      },
    },
  };

  // Simular carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Carregando dados dos setores...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6 mb-6 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Dashboard de Análise - Setores da Prefeitura</h1>
        <p className="text-blue-100 mb-6">Visualize dados e métricas de desempenho de todos os setores municipais</p>
        
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm">Período:</label>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="mensal">Mensal</option>
              <option value="trimestral">Trimestral</option>
              <option value="anual">Anual</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm">Setor:</label>
            <select 
              value={selectedSector} 
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="todos">Todos os Setores</option>
              {Object.keys(sectorsData).map((sector: string) => (
                <option key={sector} value={sector}>
                  {sectorsData[sector].nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Métricas por Setor */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {Object.keys(sectorsData).map((sector: string) => (
          <div key={sector} className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className={`w-12 h-1 ${sectorsData[sector].cor} rounded-full mb-3`}></div>
            <h3 className="font-bold text-lg text-gray-800 mb-4">{sectorsData[sector].nome}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Eficiência</span>
                <span className="font-bold text-gray-800">{sectorsData[sector].eficiencia}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Orçamento</span>
                <span className="font-bold text-gray-800">
                  R$ {(sectorsData[sector].orcamento / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Funcionários</span>
                <span className="font-bold text-gray-800">{sectorsData[sector].funcionarios}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orçamento vs Despesas */}
        <div className="bg-white rounded-xl p-6 shadow-md lg:col-span-2">
          <h3 className="font-bold text-xl text-gray-800 mb-4">Orçamento vs Despesas por Setor</h3>
          <div className="h-80">
            <Bar data={chartData.barData} options={barOptions} />
          </div>
        </div>
        
        {/* Eficiência */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-xl text-gray-800 mb-4">Eficiência por Setor</h3>
          <div className="h-80">
            <Doughnut data={chartData.efficiencyData} options={chartOptions} />
          </div>
        </div>
        
        {/* Funcionários */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-xl text-gray-800 mb-4">Distribuição de Funcionários</h3>
          <div className="h-80">
            <Pie data={chartData.employeesData} options={chartOptions} />
          </div>
        </div>
        
        {/* Projetos */}
        <div className="bg-white rounded-xl p-6 shadow-md lg:col-span-2">
          <h3 className="font-bold text-xl text-gray-800 mb-4">Andamento de Projetos</h3>
          <div className="h-80">
            <Bar data={chartData.projectsData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Resumo Executivo */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h2 className="font-bold text-2xl text-gray-800 mb-6">Resumo Executivo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
            <h4 className="font-semibold text-gray-700 mb-2">Eficiência Geral</h4>
            <div className="text-4xl font-bold text-blue-600 mb-2">82%</div>
            <p className="text-sm text-gray-600">Média de eficiência entre todos os setores</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
            <h4 className="font-semibold text-gray-700 mb-2">Orçamento Utilizado</h4>
            <div className="text-4xl font-bold text-green-600 mb-2">94%</div>
            <p className="text-sm text-gray-600">Do orçamento total já foi executado</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center">
            <h4 className="font-semibold text-gray-700 mb-2">Projetos Concluídos</h4>
            <div className="text-4xl font-bold text-purple-600 mb-2">73%</div>
            <p className="text-sm text-gray-600">Dos projetos municipais foram finalizados</p>
          </div>
        </div>
      </div>

      {/* Indicadores de Performance */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
          <div className="text-sm text-gray-500">Tempo Médio de Resposta</div>
          <div className="text-2xl font-bold text-gray-800">2.3 dias</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
          <div className="text-sm text-gray-500">Satisfação do Cidadão</div>
          <div className="text-2xl font-bold text-gray-800">88%</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
          <div className="text-sm text-gray-500">Processos Digitalizados</div>
          <div className="text-2xl font-bold text-gray-800">76%</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-orange-500">
          <div className="text-sm text-gray-500">Meta do Trimestre</div>
          <div className="text-2xl font-bold text-gray-800">92%</div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;