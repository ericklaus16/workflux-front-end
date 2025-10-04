import React from 'react';
import { Task } from '../types';

type Props = {
  tasks: Task[];
  year?: number;
  month?: number; // 0-based
};

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}

export default function CalendarView({ tasks, year, month }: Props) {
  const today = new Date();
  const y = year ?? today.getFullYear();
  const m = month ?? today.getMonth();

  const first = startOfMonth(y, m);
  const startDay = first.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const tasksByDay = new Map<number, Task[]>();
  tasks.forEach((t) => {
    const dt = new Date(t.date);
    if (dt.getFullYear() === y && dt.getMonth() === m) {
      const d = dt.getDate();
      const arr = tasksByDay.get(d) ?? [];
      arr.push(t);
      tasksByDay.set(d, arr);
    }
  });

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="rounded-xl overflow-hidden shadow-sm">
      {/* Top decorative banner with gradient + illustration */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {first.toLocaleString(undefined, { month: 'long' })}
            </span>{' '}
            {y}
          </h3>
          <div className="text-sm text-gray-600 mt-1">Tarefas no mês: {tasks.length}</div>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          {/* small illustrative SVG that matches the brand gradient */}
          <div className="w-32 h-20 bg-white/60 rounded-lg p-2 flex items-center justify-center">
            <svg width="110" height="64" viewBox="0 0 110 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
              <rect x="6" y="8" width="90" height="44" rx="6" fill="url(#g1)" opacity="0.12" />
              <rect x="14" y="16" width="20" height="12" rx="3" fill="#2563EB" />
              <rect x="38" y="16" width="32" height="8" rx="3" fill="#7C3AED" />
              <circle cx="86" cy="28" r="6" fill="#2563EB" opacity="0.9" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="grid grid-cols-7 gap-2 text-xs">
          {weekDays.map((w) => (
            <div key={w} className="text-center font-medium text-gray-600">{w}</div>
          ))}

          {cells.map((c, idx) => {
            if (c === null) return <div key={idx} />;
            const dayTasks = tasksByDay.get(c) ?? [];
            return (
              <div
                key={idx}
                className={`min-h-[72px] p-3 rounded-md transition-shadow hover:shadow-md flex flex-col justify-start ${
                  dayTasks.length
                    ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-100'
                    : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="text-sm font-medium text-gray-800">{c}</div>
                  {dayTasks.length > 0 && (
                    <div className="ml-2 text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">{dayTasks.length}</div>
                  )}
                </div>
                <div className="mt-2 space-y-1">
                  {dayTasks.slice(0, 2).map((t) => (
                    <div key={t.id} className="text-xs text-gray-700 truncate">• {t.title}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
