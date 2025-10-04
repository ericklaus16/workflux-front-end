import React from 'react';
import Image from 'next/image';
import { Task } from '../types';
import { Zap } from 'lucide-react';

type Props = {
  task: Task;
};

export default function TaskCard({ task }: Props) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-lg shadow-sm border ${task.completed ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="w-16 h-16 rounded-md flex items-center justify-center overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        {/* Use a project asset as decor (replace with meaningful image later) */}
        <Image src="/file.svg" alt="task" width={48} height={48} />
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{task.title}</h3>
            {task.description && <p className="text-xs text-gray-600 mt-1 truncate max-w-md">{task.description}</p>}
          </div>

          <div className="text-right">
            <div className="text-xs text-gray-500">{new Date(task.date).toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">Por: <span className="font-medium text-gray-700">{task.owner.name}</span></div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700">
            <Zap size={14} /> Ver detalhes
          </button>
          {task.completed ? (
            <span className="text-sm text-green-600">Concluída</span>
          ) : (
            <span className="text-sm text-gray-500">Pendente</span>
          )}
        </div>
      </div>
    </div>
  );
}
