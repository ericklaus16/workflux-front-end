"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Settings,
  Bell,
  Search,
  Calendar,
  Clock,
  User,
  Eye,
  Edit,
  Trash2,
  Zap,
  LogOut,
  UserCheck,
  Workflow,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
} from "lucide-react";
import AssignmentModal from "./components/AssignmentModal";
import AdminHeader from "./components/header";
import axios from "axios";

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "ativo" | "inativo";
  avatar?: string;
}

export interface Assignment {
  id: string;
  taskTitle: string;
  employeeId: string;
  employeeName: string;
  assignedBy: string;
  assignedAt: string;
  dueDate: string;
  status: "pendente" | "em_progresso" | "concluida" | "cancelada";
  priority: "baixa" | "media" | "alta";
  variables: Record<string, any>;
}

export interface ActivityTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  variables: Array<{
    name: string;
    type: string;
    required: boolean;
    options?: string[];
  }>;
}

export interface Notification {
  id: string;
  userId: string;
  userName: string;
  taskTitle: string;
  stepName: string;
  type: "completed" | "started" | "cancelled" | "assigned";
  timestamp: string;
  isRead: boolean;
  priority?: "baixa" | "media" | "alta";
}

// Dados mockados de notificações
const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "user-0",
    userName: "Trabalhador Silva",
    taskTitle: "Visita ao Summit",
    stepName: "Visita",
    type: "completed",
    timestamp: "2025-10-10T08:30:00",
    isRead: false,
    priority: "alta",
  },
  {
    id: "1",
    userId: "user-1",
    userName: "João Silva",
    taskTitle: "Visita ao Cliente ABC",
    stepName: "Preparação de Documentos",
    type: "completed",
    timestamp: "2024-10-10T08:30:00",
    isRead: false,
    priority: "alta",
  },
  {
    id: "2",
    userId: "user-2",
    userName: "Maria Santos",
    taskTitle: "Reunião de Planejamento",
    stepName: "Apresentação de Proposta",
    type: "completed",
    timestamp: "2024-10-04T13:15:00",
    isRead: false,
    priority: "media",
  },
  {
    id: "3",
    userId: "user-3",
    userName: "Carlos Oliveira",
    taskTitle: "Entrega de Equipamentos",
    stepName: "Conferência de Itens",
    type: "started",
    timestamp: "2024-10-04T11:45:00",
    isRead: true,
    priority: "media",
  },
  {
    id: "4",
    userId: "user-1",
    userName: "João Silva",
    taskTitle: "Aprovação de Orçamento",
    stepName: "Análise Financeira",
    type: "completed",
    timestamp: "2024-10-04T10:20:00",
    isRead: true,
    priority: "alta",
  },
  {
    id: "5",
    userId: "user-4",
    userName: "Ana Paula",
    taskTitle: "Treinamento de Equipe",
    stepName: "Módulo 2 - Processos",
    type: "completed",
    timestamp: "2024-10-04T09:00:00",
    isRead: true,
    priority: "baixa",
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    "assignments" | "create" | "notifications"
  >("assignments");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todas");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [notificationFilter, setNotificationFilter] = useState<
    "todas" | "nao_lidas" | "lidas"
  >("todas");

  const getStatusColor = (status: Assignment["status"]) => {
    const colors = {
      pendente: "text-yellow-600 bg-yellow-100",
      em_progresso: "text-blue-600 bg-blue-100",
      concluida: "text-green-600 bg-green-100",
      cancelada: "text-red-600 bg-red-100",
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Assignment["priority"]) => {
    const colors = {
      baixa: "text-green-600 bg-green-100",
      media: "text-yellow-600 bg-yellow-100",
      alta: "text-red-600 bg-red-100",
    };
    return colors[priority];
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    const icons = {
      completed: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      started: <Info className="w-5 h-5 text-blue-600" />,
      cancelled: <X className="w-5 h-5 text-red-600" />,
      assigned: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    };
    return icons[type];
  };

  const getNotificationText = (notification: Notification) => {
    const texts = {
      completed: `completou a etapa "${notification.stepName}" na tarefa`,
      started: `iniciou a etapa "${notification.stepName}" na tarefa`,
      cancelled: `cancelou a etapa "${notification.stepName}" na tarefa`,
      assigned: `foi atribuído à etapa "${notification.stepName}" na tarefa`,
    };
    return texts[notification.type];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) {
      return "Data não informada";
    }

    try {
      const date = new Date(dateString);

      if (isNaN(date.getTime())) {
        return "Data inválida";
      }

      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error(
        "Erro ao formatar data:",
        error,
        "Data original:",
        dateString
      );
      return "Data inválida";
    }
  };

  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return "Agora mesmo";
      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} minutos atrás`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
      if (diffInSeconds < 604800)
        return `${Math.floor(diffInSeconds / 86400)} dias atrás`;

      return formatDate(dateString);
    } catch {
      return formatDate(dateString);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notif) => notif.id !== notificationId)
    );
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (notificationFilter === "nao_lidas") return !notif.isRead;
    if (notificationFilter === "lidas") return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredAssignments = assignments.filter((assignment) => {
    const taskTitle = assignment.taskTitle || "";
    const employeeName = assignment.employeeName || "";
    const status = assignment.status || "";

    const matchesSearch =
      taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "todas" || status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/tarefas/`
        );

        const assignmentsData = Array.isArray(response.data)
          ? response.data
          : [];

        const normalizedAssignments = assignmentsData.map(
          (assignment: any) => ({
            id: assignment.id || "",
            taskTitle: assignment.title,
            employeeId: assignment.employeeId,
            employeeName: assignment.atribuidoPara.nome,
            assignedBy: assignment.assignedBy,
            assignedAt: assignment.createdAt,
            dueDate: assignment.dueDate,
            status: assignment.status,
            priority: assignment.priority,
            variables: assignment.variables ?? {},
          })
        );

        setAssignments(normalizedAssignments);
      } catch (error) {
        console.error("Erro ao buscar atribuições:", error);
        setAssignments([]);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tarefas/${id}`);

      setAssignments((prev) =>
        prev.filter((assignment) => assignment.id !== id)
      );
    } catch (error) {
      console.log("Erro ao cancelar tarefa:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === "assignments"
                  ? "Gerenciar Atribuições"
                  : activeTab === "notifications"
                  ? "Notificações"
                  : "Criar Fluxos"}
              </h1>
              <p className="text-gray-600">
                {activeTab === "assignments"
                  ? "Atribua tarefas aos funcionários e acompanhe o progresso"
                  : activeTab === "notifications"
                  ? "Acompanhe as atualizações das tarefas e atividades"
                  : "Crie e configure novos fluxos de trabalho"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab("notifications")}
                className="relative text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {activeTab === "assignments" && (
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center cursor-pointer"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Atribuição
                </button>
              )}
              {activeTab === "notifications" && unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center cursor-pointer text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Marcar todas como lidas
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {activeTab === "assignments" ? (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Buscar por tarefa ou funcionário..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todas">Todos os status</option>
                  <option value="pendente">Pendente</option>
                  <option value="em_progresso">Em Progresso</option>
                  <option value="concluida">Concluída</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              {/* Assignments List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Atribuições ({filteredAssignments.length})
                  </h2>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredAssignments.length === 0 ? (
                    <div className="p-8 text-center">
                      <UserCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhuma atribuição encontrada
                      </h3>
                      <p className="text-gray-500">
                        Crie uma nova atribuição para começar.
                      </p>
                    </div>
                  ) : (
                    filteredAssignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {assignment.taskTitle}
                              </h3>
                              <span
                                className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                  assignment.priority
                                )}`}
                              >
                                {assignment.priority}
                              </span>
                              <span
                                className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  assignment.status
                                )}`}
                              >
                                {assignment.status.replace("_", " ")}
                              </span>
                            </div>

                            <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
                              <div className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {assignment.employeeName}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Prazo: {formatDate(assignment.dueDate)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Atribuído: {formatDate(assignment.assignedAt)}
                              </div>
                            </div>

                            {/* Variables Preview */}
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs font-medium text-gray-600 mb-2">
                                Configurações:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {Object.entries(assignment.variables)
                                  .slice(0, 3)
                                  .map(([key, value]) => (
                                    <span
                                      key={key}
                                      className="text-xs bg-white px-2 py-1 rounded border"
                                    >
                                      <span className="font-medium">
                                        {key}:
                                      </span>{" "}
                                      {Array.isArray(value)
                                        ? value.join(", ")
                                        : String(value)}
                                    </span>
                                  ))}
                                {Object.keys(assignment.variables).length >
                                  3 && (
                                  <span className="text-xs text-gray-500">
                                    +
                                    {Object.keys(assignment.variables).length -
                                      3}{" "}
                                    mais
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => setSelectedAssignment(assignment)}
                              className="text-blue-600 hover:text-blue-700 transition-colors p-2 cursor-pointer"
                              title="Ver detalhes"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              className="text-gray-400 hover:text-gray-600 transition-colors p-2 cursor-pointer"
                              title="Editar"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(assignment.id)}
                              className="text-red-400 hover:text-red-600 transition-colors p-2 cursor-pointer"
                              title="Cancelar"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === "notifications" ? (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setNotificationFilter("todas")}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      notificationFilter === "todas"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Todas ({notifications.length})
                  </button>
                  <button
                    onClick={() => setNotificationFilter("nao_lidas")}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      notificationFilter === "nao_lidas"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Não lidas ({unreadCount})
                  </button>
                  <button
                    onClick={() => setNotificationFilter("lidas")}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      notificationFilter === "lidas"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Lidas ({notifications.length - unreadCount})
                  </button>
                </div>
              </div>

              {/* Notifications List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Nenhuma notificação encontrada
                      </h3>
                      <p className="text-gray-500">
                        {notificationFilter === "nao_lidas"
                          ? "Você não tem notificações não lidas."
                          : "Você não tem notificações no momento."}
                      </p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          !notification.isRead
                            ? "bg-blue-50 border-l-4 border-l-blue-500"
                            : "bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {/* Icon */}
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm ${
                                  !notification.isRead
                                    ? "font-semibold text-gray-900"
                                    : "text-gray-700"
                                }`}
                              >
                                <span className="font-bold">
                                  {notification.userName}
                                </span>{" "}
                                {getNotificationText(notification)}{" "}
                                <span className="font-semibold">
                                  {notification.taskTitle}
                                </span>
                              </p>

                              {/* Metadata */}
                              <div className="flex items-center space-x-3 mt-2">
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatRelativeTime(notification.timestamp)}
                                </span>
                                {notification.priority && (
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(
                                      notification.priority
                                    )}`}
                                  >
                                    {notification.priority}
                                  </span>
                                )}
                                {!notification.isRead && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                                    Nova
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 ml-4">
                            {!notification.isRead && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-700 transition-colors p-1 text-xs"
                                title="Marcar como lida"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                deleteNotification(notification.id)
                              }
                              className="text-gray-400 hover:text-red-600 transition-colors p-1"
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Workflow className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Criação de Fluxos
              </h3>
              <p className="text-gray-500 mb-6">
                Esta funcionalidade será direcionada para a página de criação de
                workflows.
              </p>
              <Link href="/work_creation">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                  Ir para Criação de Fluxos
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Atribuição */}
      <AssignmentModal
        setShowAssignModal={setShowAssignModal}
        showAssignModal={showAssignModal}
        setAssignments={setAssignments}
      />
    </div>
  );
}
