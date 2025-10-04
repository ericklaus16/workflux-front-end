"use client";

import React, { useState, useEffect } from 'react';
import { Zap, Bell, Settings, LogOut, User as UserIcon, CheckCircle, Clock, Eye, Home } from 'lucide-react';
import CalendarView from './components/CalendarView';
import TaskList from './components/TaskList';
import { User, Task } from './types';
import { Usuario } from '@/lib/types/definition';
import Link from 'next/link';

const mockUsers: User[] = [
	{ id: 'u2', name: 'Ana Silva' },
	{ id: 'u3', name: 'Carlos Mendes' },
	{ id: 'u4', name: 'Beatriz Costa' },
];

const mockTasks: Task[] = [
	{ id: 't1', title: 'Reunião com time', date: new Date().toISOString(), owner: { id: 'current', name: 'Você' }, description: 'Planejar sprint e definir objetivos para a próxima semana', completed: false },
	{ id: 't2', title: 'Revisar PR #42', date: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), owner: { id: 'current', name: 'Você' }, description: 'Revisar código do front-end e fazer sugestões', completed: false },
	{ id: 't3', title: 'Demo do projeto', date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), owner: mockUsers[0], description: 'Apresentar novas features para o cliente', completed: false },
	{ id: 't4', title: 'Enviar relatório', date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), owner: mockUsers[1], description: 'Relatório mensal de progresso', completed: true },
	{ id: 't5', title: 'Atualizar documentação', date: new Date().toISOString(), owner: { id: 'current', name: 'Você' }, description: 'Atualizar docs da API', completed: true },
	{ id: 't6', title: 'Code review', date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), owner: mockUsers[2], description: 'Revisar implementação do novo módulo', completed: false },
];

export default function ProfilePage() {
	const [usuario, setUsuario] = useState<Usuario | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Carrega dados do usuário do localStorage
	useEffect(() => {
		try {
			const usuarioStorage = localStorage.getItem("usuario");
			if (usuarioStorage) {
				const usuarioData = JSON.parse(usuarioStorage);
				setUsuario(usuarioData);
			}
		} catch (error) {
			console.error("Erro ao carregar usuário:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600">Carregando...</p>
				</div>
			</div>
		);
	}

	if (!usuario) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<p className="text-gray-600 mb-4">Nenhum usuário logado</p>
					<Link href="/login" className="text-blue-600 hover:underline">
						Fazer login
					</Link>
				</div>
			</div>
		);
	}

	// Ordena as tarefas por data (crescente: mais antigas primeiro)
	const sortedTasks = [...mockTasks].sort((a, b) =>
		new Date(a.date).getTime() - new Date(b.date).getTime()
	);

	const myTasks = sortedTasks.filter((t) => t.owner.id === 'current');
	const interestedTasks = sortedTasks.filter((t) => t.owner.id !== 'current');

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map(n => n[0])
			.slice(0, 2)
			.join('')
			.toUpperCase();
	};

	// Contagem corrigida: apenas tarefas SUAS
	const completedCount = myTasks.filter(t => t.completed).length;
	const pendingCount = myTasks.filter(t => !t.completed).length;
	// Contagem corrigida: apenas tarefas de outros que ainda NÃO estão concluídas
	const interestedPendingCount = interestedTasks.filter(t => !t.completed).length;

	// Define a rota do Home baseado na role do usuário
	const homeRoute = usuario.role === 'gestor' ? '/admin' : '/func';

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
			{/* Header */}
			<header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
							<div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
								<Zap className="text-white" size={18} />
							</div>
							<span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
								Workflux
							</span>
						</Link>

						<div className="flex items-center space-x-4">
							<Link
								href={homeRoute}
								className="text-gray-400 hover:text-gray-600 transition-colors"
								title={`Ir para ${usuario.role === 'gestor' ? 'Admin' : 'Funcionário'}`}
							>
								<Home size={20} />
							</Link>
							<button className="text-gray-400 hover:text-gray-600 transition-colors relative">
								<Bell size={20} />
								<span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
									3
								</span>
							</button>
							<button className="text-gray-400 hover:text-gray-600 transition-colors">
								<Settings size={20} />
							</button>
							<div className="h-8 w-px bg-gray-300"></div>
							<div className="flex items-center space-x-3">
								<div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
									<span className="text-white text-sm font-bold">
										{getInitials(usuario.nome)}
									</span>
								</div>
								<div className="hidden sm:block">
									<p className="text-sm font-semibold text-gray-900">{usuario.nome}</p>
									<p className="text-xs text-gray-500 capitalize">{usuario.role}</p>
								</div>
							</div>
							<Link
								href="/login"
								className="text-gray-400 hover:text-red-600 transition-colors"
								title="Sair"
							>
								<LogOut size={20} />
							</Link>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Welcome Section */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">
						Olá, {usuario.nome.split(' ')[0]}! 👋
					</h1>
					<p className="text-gray-600">
						Bem-vindo ao seu painel de atividades. Aqui você pode acompanhar suas tarefas e as de sua equipe.
					</p>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Tarefas Pendentes</p>
								<p className="text-3xl font-bold text-blue-600 mt-2">{pendingCount}</p>
								<p className="text-xs text-gray-500 mt-1">Suas tarefas</p>
							</div>
							<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
								<Clock className="w-6 h-6 text-blue-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Concluídas</p>
								<p className="text-3xl font-bold text-green-600 mt-2">{completedCount}</p>
								<p className="text-xs text-gray-500 mt-1">Suas tarefas</p>
							</div>
							<div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
								<CheckCircle className="w-6 h-6 text-green-600" />
							</div>
						</div>
					</div>

					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Acompanhando</p>
								<p className="text-3xl font-bold text-purple-600 mt-2">{interestedPendingCount}</p>
								<p className="text-xs text-gray-500 mt-1">Tarefas pendentes da equipe</p>
							</div>
							<div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
								<Eye className="w-6 h-6 text-purple-600" />
							</div>
						</div>
					</div>
				</div>

				{/* Main Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Calendar */}
					<div className="lg:col-span-2">
						<CalendarView tasks={sortedTasks} />
					</div>

					{/* Task Lists */}
					<aside className="space-y-6">
						<TaskList
							title="Minhas tarefas"
							tasks={myTasks}
							icon={<UserIcon className="w-5 h-5 text-blue-600" />}
						/>
						<TaskList
							title="Tarefas que acompanho"
							tasks={interestedTasks}
							icon={<Eye className="w-5 h-5 text-purple-600" />}
						/>
					</aside>
				</div>
			</div>
		</div>
	);
}
