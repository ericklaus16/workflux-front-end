"use client";

import React, { useState } from 'react';
import { Task } from '../types';
import TaskCard from './TaskCard';
import { ChevronDown, ChevronUp, ListTodo } from 'lucide-react';

type Props = {
  title: string;
  tasks: Task[];
  icon?: React.ReactNode;
};

export default function TaskList({ title, tasks, icon }: Props) {
  const [isExpanded, setIsExpanded] = useState(true);

  const completedTasks = tasks.filter(t => t.completed);
  const pendingTasks = tasks.filter(t => !t.completed);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon || <ListTodo className="w-5 h-5 text-blue-600" />}
          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500">
              {pendingTasks.length} pendente{pendingTasks.length !== 1 ? 's' : ''} · {completedTasks.length} concluída{completedTasks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-4">
          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ListTodo className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Nenhuma tarefa encontrada.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((t) => (
                <TaskCard key={t.id} task={t} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
