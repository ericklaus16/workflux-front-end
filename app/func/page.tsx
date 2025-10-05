"use client";

import React, { useEffect, useState } from "react";
import {
  Clock,
  CheckCircle2,
  Eye,
  Calendar,
  Search,
  Bell,
  Settings,
  LogOut,
  Zap,
  House,
  User as UserIcon,
} from "lucide-react";
import { User, useUser } from "../context/User";
import Link from "next/link";
import {
  formatDate,
  getPriorityColor,
  getStatusColor,
  getTypeColor,
} from "./utils";
import { ActivityDetailModal } from "./components/ActivityDetailModal";
import axios from "axios";
import { Activity } from "../interfaces/Activity";

export default function FuncPage() {
  const [activeTab, setActiveTab] = useState<"atividades" | "concluidas">(
    "atividades"
  );
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("todas");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [completedActivities, setCompletedActivities] = useState<Activity[]>(
    []
  );
  const { user, logout, login } = useUser();

  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("usuario");

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          login(parsedUser);
        } catch (error) {
          console.error("Erro ao fazer parse do usuário:", error);
        }
      } else {
      }
    }

    const fetchData = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tarefas/usuario/${user?.id}`
      );

      console.log(response.data);
      setActivities(response.data);
    };

    fetchData();
  }, []);

  const filteredActivities = (
    activeTab === "atividades" ? activities : completedActivities
  ).filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      filterPriority === "todas" || activity.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

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
              <Link
                href="/func"
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <House size={20} />
              </Link>
              <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <Bell size={20} />
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <Settings size={20} />
              </button>
              <Link
                href="/perfil"
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <UserIcon size={20} />
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.nome[0]}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.nome.split(" ").slice(0, 2).join(" ")}
                </span>
              </div>
              <Link
                href="/"
                onClick={() => {
                  logout();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut size={20} />
              </Link>
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
                  Atividades ({activities.length})
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
                        <UserIcon className="w-4 h-4 mr-1" />
                        {activity.atribuidoPor!.nome}
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
      <ActivityDetailModal
        selectedActivity={selectedActivity}
        setSelectedActivity={setSelectedActivity}
      />
    </div>
  );
}
