"use client";

import React, { useState } from "react";
import {
  Clock,
  CheckCircle2,
  Eye,
  Calendar,
  MapPin,
  User,
  ArrowRight,
  Filter,
  Search,
  Bell,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  type: "visita" | "reuniao" | "entrega" | "aprovacao";
  priority: "baixa" | "media" | "alta";
  dueDate: string;
  assignedBy: string;
  status: "pendente" | "em_progresso" | "concluida";
  variables: Record<string, any>;
  workflow?: {
    steps: Array<{
      id: string;
      name: string;
      completed: boolean;
    }>;
  };
}

const mockActivities: Activity[] = [
  {
    id: "1",
    title: "Visita ao Cliente ABC",
    description: "Reunião para apresentar nova proposta comercial",
    type: "visita",
    priority: "alta",
    dueDate: "2024-10-05T14:00:00",
    assignedBy: "Maria Silva",
    status: "pendente",
    variables: {
      destino: "Rua das Flores, 123 - São Paulo",
      horario: "2024-10-05T14:00:00",
      cliente: "ABC Ltda",
    },
    workflow: {
      steps: [
        { id: "1", name: "Preparar apresentação", completed: true },
        { id: "2", name: "Realizar visita", completed: false },
        { id: "3", name: "Enviar relatório", completed: false },
      ],
    },
  },
  {
    id: "2",
    title: "Reunião de Planejamento",
    description: "Definir estratégias para o próximo trimestre",
    type: "reuniao",
    priority: "media",
    dueDate: "2024-10-06T10:00:00",
    assignedBy: "João Santos",
    status: "pendente",
    variables: {
      local: "Sala de Reuniões 2",
      duracao: 120,
      participantes: ["Equipe de Vendas", "Gerência"],
    },
  },
  {
    id: "3",
    title: "Entrega de Documentos",
    description: "Entregar contratos assinados no escritório central",
    type: "entrega",
    priority: "alta",
    dueDate: "2024-10-04T16:00:00",
    assignedBy: "Ana Costa",
    status: "em_progresso",
    variables: {
      endereco: "Av. Paulista, 1000 - São Paulo",
      prazo: "2024-10-04",
      prioridade: "Alta",
    },
  },
];

const completedActivities: Activity[] = [
  {
    id: "4",
    title: "Reunião com Fornecedor XYZ",
    description: "Negociação de novos preços",
    type: "reuniao",
    priority: "media",
    dueDate: "2024-10-02T15:00:00",
    assignedBy: "Carlos Lima",
    status: "concluida",
    variables: {
      local: "Escritório Principal",
      duracao: 90,
    },
  },
];

export default function FuncPage() {
  const [activeTab, setActiveTab] = useState<"atividades" | "concluidas">(
    "atividades"
  );
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("todas");

  const getTypeColor = (type: Activity["type"]) => {
    const colors = {
      visita: "bg-purple-500",
      reuniao: "bg-orange-500",
      entrega: "bg-teal-500",
      aprovacao: "bg-blue-500",
    };
    return colors[type] || "bg-gray-500";
  };

  const getPriorityColor = (priority: Activity["priority"]) => {
    const colors = {
      baixa: "text-green-600 bg-green-100",
      media: "text-yellow-600 bg-yellow-100",
      alta: "text-red-600 bg-red-100",
    };
    return colors[priority];
  };

  const getStatusColor = (status: Activity["status"]) => {
    const colors = {
      pendente: "text-gray-600 bg-gray-100",
      em_progresso: "text-blue-600 bg-blue-100",
      concluida: "text-green-600 bg-green-100",
    };
    return colors[status];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const filteredActivities = (
    activeTab === "atividades" ? mockActivities : completedActivities
  ).filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      filterPriority === "todas" || activity.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  // Modal de Detalhes da Atividade
  const ActivityDetailModal = () => {
    if (!selectedActivity) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedActivity.title}
                </h2>
                <p className="text-gray-600">{selectedActivity.description}</p>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              {/* Informações Gerais */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Tipo
                  </label>
                  <div className="flex items-center mt-1">
                    <div
                      className={`w-3 h-3 rounded-full ${getTypeColor(
                        selectedActivity.type
                      )} mr-2`}
                    ></div>
                    <span className="capitalize">{selectedActivity.type}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Prioridade
                  </label>
                  <div className="mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(
                        selectedActivity.priority
                      )}`}
                    >
                      {selectedActivity.priority}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Prazo
                  </label>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{formatDate(selectedActivity.dueDate)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Atribuído por
                  </label>
                  <div className="flex items-center mt-1">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span>{selectedActivity.assignedBy}</span>
                  </div>
                </div>
              </div>

              {/* Variáveis */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Detalhes da Atividade
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid gap-3">
                    {Object.entries(selectedActivity.variables).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm font-medium text-gray-600 capitalize">
                            {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                          </span>
                          <span className="text-sm text-gray-900">
                            {Array.isArray(value)
                              ? value.join(", ")
                              : String(value)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Workflow Steps */}
              {selectedActivity.workflow && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Fluxo de Trabalho
                  </h3>
                  <div className="space-y-3">
                    {selectedActivity.workflow.steps.map((step, index) => (
                      <div key={step.id} className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            step.completed
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span
                          className={`${
                            step.completed
                              ? "text-green-700 line-through"
                              : "text-gray-700"
                          }`}
                        >
                          {step.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
              {selectedActivity.status !== "concluida" && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Marcar como Concluída
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Workflux
              </span>
              <span className="text-sm text-gray-500">| Funcionário</span>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Bell size={20} />
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <Settings size={20} />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JS</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  João Silva
                </span>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Minhas Atividades
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie suas tarefas e acompanhe o progresso
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("atividades")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "atividades"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Atividades ({mockActivities.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab("concluidas")}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "concluidas"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Concluídas ({completedActivities.length})
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar atividades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="todas">Todas as prioridades</option>
            <option value="alta">Alta prioridade</option>
            <option value="media">Média prioridade</option>
            <option value="baixa">Baixa prioridade</option>
          </select>
        </div>

        {/* Activities List */}
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                {activeTab === "atividades" ? (
                  <Clock size={48} />
                ) : (
                  <CheckCircle2 size={48} />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === "atividades"
                  ? "Nenhuma atividade pendente"
                  : "Nenhuma atividade concluída"}
              </h3>
              <p className="text-gray-500">
                {activeTab === "atividades"
                  ? "Você está em dia com suas tarefas!"
                  : "Complete algumas atividades para vê-las aqui."}
              </p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getTypeColor(
                          activity.type
                        )} mr-3`}
                      ></div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {activity.title}
                      </h3>
                      <span
                        className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          activity.priority
                        )}`}
                      >
                        {activity.priority}
                      </span>
                      {activeTab === "atividades" && (
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            activity.status
                          )}`}
                        >
                          {activity.status.replace("_", " ")}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{activity.description}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(activity.dueDate)}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {activity.assignedBy}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedActivity(activity)}
                    className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalhes
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <ActivityDetailModal />
    </div>
  );
}
