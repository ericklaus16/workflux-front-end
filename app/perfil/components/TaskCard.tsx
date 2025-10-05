"use client";

import React, { useState } from "react";
import {
  Calendar,
  User,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Activity } from "@/app/interfaces/Activity";

type Props = {
  task: Activity;
};

export default function TaskCard({ task }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const today = new Date();
    const diffTime = d.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Amanhã";
    if (diffDays === -1) return "Ontem";
    if (diffDays < -1) return `${Math.abs(diffDays)} dias atrás`;
    if (diffDays > 1) return `Em ${diffDays} dias`;

    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  };

  const getOwnerInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={`rounded-lg border transition-all duration-200 hover:shadow-md ${
        task.status === "concluida"
          ? "bg-gray-50 border-gray-200"
          : "bg-white border-gray-200 hover:border-blue-300"
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-start gap-3 text-left"
      >
        <div className="mt-0.5">
          {task.status === "concluida" ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-semibold ${
              task.status === "concluida"
                ? "text-gray-500 line-through"
                : "text-gray-900"
            }`}
          >
            {task.title}
          </h3>

          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                {getOwnerInitials(task.atribuidoPara!.nome)}
              </div>
              <span className="truncate max-w-[100px]">
                {task.atribuidoPara!.nome}
              </span>
            </div>
          </div>
        </div>

        <div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {isExpanded && task.description && (
        <div className="px-4 pb-4 pt-0">
          <div className="pl-8 pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600 mt-2">{task.description}</p>
            <div className="mt-3 flex gap-2">
              {task.status !== "concluida" && (
                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors">
                  Marcar como concluída
                </button>
              )}
              <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors">
                Ver detalhes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
