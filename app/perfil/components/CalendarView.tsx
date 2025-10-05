"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Activity } from "@/app/interfaces/Activity";

interface CalendarViewProps {
  tasks: Activity[];
  onDateClick?: (date: Date) => void;
}

export default function CalendarView({
  tasks,
  onDateClick,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter((task) => {
      const taskDate = new Date(task.createdAt);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(clickedDate);
    const dayTasks = getTasksForDate(clickedDate);
    if (dayTasks.length > 0) {
      setShowModal(true);
    }
    onDateClick?.(clickedDate);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const getOwnerInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square p-2"></div>);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dayTasks = getTasksForDate(date);
      const hasTask = dayTasks.length > 0;
      const today = isToday(date);
      const selected = isSelected(date);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`aspect-square p-1.5 rounded-lg transition-all duration-200 ${
            today
              ? "bg-blue-100 border-2 border-blue-500 font-bold hover:bg-blue-200"
              : selected
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-white hover:bg-blue-50 hover:shadow-md hover:scale-105"
          } ${hasTask ? "ring-1 ring-purple-300" : ""}`}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <span
              className={`text-xs font-medium ${
                today
                  ? "text-blue-700"
                  : selected
                  ? "text-white"
                  : "text-gray-700"
              }`}
            >
              {day}
            </span>
            {hasTask && (
              <div className="flex gap-0.5 mt-0.5">
                {dayTasks.slice(0, 3).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1 h-1 rounded-full ${
                      selected ? "bg-white" : "bg-purple-500"
                    }`}
                  ></div>
                ))}
              </div>
            )}
          </div>
        </button>
      );
    }

    return days;
  };

  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Calendário de Atividades
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <h3 className="text-lg font-semibold text-white min-w-[200px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>

            <button
              onClick={nextMonth}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-gray-500 uppercase"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Dia selecionado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span>Com atividades</span>
          </div>
        </div>
      </div>

      {/* Modal para tarefas do dia */}
      {showModal && selectedDate && selectedDateTasks.length > 0 && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold">
                  {selectedDate.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-white/90 text-sm">
                {selectedDateTasks.length}{" "}
                {selectedDateTasks.length === 1 ? "Atividade" : "Atividades"}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              <div className="space-y-4">
                {selectedDateTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group bg-gray-50 hover:bg-gray-100 rounded-xl p-5 border border-gray-200 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {task.status === "concluida" ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <h4
                          className={`text-lg font-semibold mb-2 ${
                            task.status === "concluida"
                              ? "line-through text-gray-500"
                              : "text-gray-900"
                          }`}
                        >
                          {task.title}
                        </h4>

                        {task.description && (
                          <p className="text-sm text-gray-600 mb-3">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                              {getOwnerInitials(task.atribuidoPara!.nome)}
                            </div>
                            <span className="text-sm text-gray-600">
                              {task.atribuidoPara!.nome}
                            </span>
                          </div>

                          {task.status === "concluida" && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Concluída
                            </span>
                          )}
                        </div>

                        {task.status !== "concluida" && (
                          <div className="mt-3 flex gap-2">
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                              Marcar como concluída
                            </button>
                            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                              Ver detalhes
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
