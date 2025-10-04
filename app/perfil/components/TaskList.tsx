import React from 'react';
import { Task } from '../types';
import TaskCard from './TaskCard';

type Props = {
  title?: string;
  tasks: Task[];
};

export default function TaskList({ title, tasks }: Props) {
  return (
    <section>
      {title && <h2 className="text-lg font-bold mb-3">{title}</h2>}
      <div className="space-y-3">
        {tasks.length === 0 && <p className="text-sm text-gray-500">Nenhuma tarefa encontrada.</p>}
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} />
        ))}
      </div>
    </section>
  );
}
