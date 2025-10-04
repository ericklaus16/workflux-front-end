"use client";

import React, { useState } from "react";
import { Play, Users, Zap, Shield, ArrowRight, Menu, X } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Transforme seu
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              fluxo{" "}
            </span>
            de trabalho
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Crie tarefas visuais, associe funcionários e mantenha controle total
            sobre o fluxo da sua empresa com nossa plataforma intuitiva
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center">
              Começar Grátis
              <ArrowRight className="ml-2" size={20} />
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors flex items-center">
              <Play className="mr-2" size={20} />
              Ver Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Recursos Poderosos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tudo que você precisa para gerenciar suas tarefas e equipes de
              forma eficiente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Fluxos Visuais
              </h3>
              <p className="text-gray-600">
                Crie workflows visuais intuitivos com drag & drop. Veja o
                progresso das tarefas em tempo real.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Gestão de Equipes
              </h3>
              <p className="text-gray-600">
                Associe tarefas a funcionários específicos e acompanhe a
                produtividade da sua equipe.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Controle Total
              </h3>
              <p className="text-gray-600">
                Mantenha controle completo sobre todos os processos da sua
                empresa em uma única plataforma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Sobre o Workflux
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                O Workflux nasceu da necessidade de simplificar a gestão de
                projetos e equipes. Nossa plataforma combina a simplicidade
                visual com o poder de automação para criar uma experiência única
                de produtividade.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Com componentes arrastar-e-soltar similares ao Blueprint da
                Unreal Engine, você pode criar fluxos de trabalho complexos de
                forma intuitiva, sem necessidade de conhecimento técnico.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Experimentar Agora
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Nossa Missão
                </h3>
                <p className="text-gray-600">
                  Empoderar empresas de todos os tamanhos com ferramentas
                  visuais e intuitivas para otimizar seus processos e aumentar a
                  produtividade da equipe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para revolucionar sua empresa?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de empresas que já transformaram seus processos
            com o Workflux
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
            Começar Gratuitamente
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Entre em Contato
            </h2>
            <p className="text-xl text-gray-600">
              Tem dúvidas? Nossa equipe está aqui para ajudar
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Envie uma mensagem
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Enviar Mensagem
                </button>
              </form>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Informações de Contato
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Email</h4>
                  <p className="text-gray-600">contato@workflux.com</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Telefone</h4>
                  <p className="text-gray-600">+55 (11) 9999-9999</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Endereço</h4>
                  <p className="text-gray-600">São Paulo, SP - Brasil</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Horário de Atendimento
                  </h4>
                  <p className="text-gray-600">Segunda a Sexta, 9h às 18h</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold">Workflux</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p>&copy; 2024 Workflux. Todos os direitos reservados.</p>
              <p className="text-sm mt-1">
                Transformando empresas através da automação visual
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
