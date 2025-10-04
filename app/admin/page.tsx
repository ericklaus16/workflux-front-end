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

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"assignments" | "create">(
    "assignments"
  );
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todas");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

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

        // Validar e normalizar os dados recebidos
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
                  : "Criar Fluxos"}
              </h1>
              <p className="text-gray-600">
                {activeTab === "assignments"
                  ? "Atribua tarefas aos funcionários e acompanhe o progresso"
                  : "Crie e configure novos fluxos de trabalho"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <Bell size={20} />
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
