import React from 'react';
import { Zap, Bell, Settings, LogOut } from 'lucide-react';
import CalendarView from './components/CalendarView';
import TaskList from './components/TaskList';
import { User, Task } from './types';

const mockUser: User = {
	id: 'u1',
	name: 'Ruan R.',
	avatarUrl: undefined,
};

const mockUsers: User[] = [
	mockUser,
	{ id: 'u2', name: 'Ana Silva' },
	{ id: 'u3', name: 'Carlos' },
];

const mockTasks: Task[] = [
	{ id: 't1', title: 'Reunião com time', date: new Date().toISOString(), owner: mockUser, description: 'Planejar sprint', completed: false },
	{ id: 't2', title: 'Revisar PR #42', date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), owner: mockUser, description: 'Revisar front-end' },
	{ id: 't3', title: 'Demo do projeto', date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), owner: mockUsers[1], description: 'Apresentar features' },
	{ id: 't4', title: 'Enviar relatório', date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), owner: mockUsers[2], description: 'Relatório mensal', completed: true },
];

export default function ProfilePage() {
	const myTasks = mockTasks.filter((t) => t.owner.id === mockUser.id);
	const interestedTasks = mockTasks.filter((t) => t.owner.id !== mockUser.id);

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header similar to other pages */}
			<header className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center space-x-3">
							<div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
								<Zap className="text-white" size={18} />
							</div>
							<span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Workflux</span>
							<span className="text-sm text-gray-500">| Perfil</span>
						</div>

						<div className="flex items-center space-x-4">
							<button className="text-gray-400 hover:text-gray-600 transition-colors"><Bell size={18} /></button>
							<button className="text-gray-400 hover:text-gray-600 transition-colors"><Settings size={18} /></button>
							<div className="flex items-center space-x-2">
								<div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
									<span className="text-white text-sm font-medium">{mockUser.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</span>
								</div>
								<span className="text-sm font-medium text-gray-700">{mockUser.name}</span>
							</div>
							<button className="text-gray-400 hover:text-gray-600 transition-colors"><LogOut size={18} /></button>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
					<p className="text-gray-600 mt-2">Agenda, suas tarefas e tarefas das pessoas que você acompanha.</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="md:col-span-2">
						<CalendarView tasks={mockTasks} />
					</div>

					<aside className="space-y-6">
						<TaskList title="Minhas tarefas" tasks={myTasks} />
						<TaskList title="Tarefas que acompanho" tasks={interestedTasks} />
					</aside>
				</div>
			</div>
		</div>
	);
}
