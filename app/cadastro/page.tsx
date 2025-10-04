"use client";

import React, { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Eye, EyeOff, ArrowLeft, Check, Loader2 } from "lucide-react";
import { postRegister } from "@/lib/actions/auth/post-register";
import { RegisterFormState } from "@/lib/types/definition";
import { useRouter } from "next/navigation";

const initialState: RegisterFormState = {
  errors: {},
  message: "",
  success: false,
};

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    postRegister,
    initialState
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redireciona após sucesso
  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  }, [state.success, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="absolute inset-0 opacity-40"></div>

      <div className="relative w-[50%] space-y-8">
        <div className="text-left">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Início
          </Link>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Workflux
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crie sua conta
          </h1>
          <p className="text-gray-600">
            Comece a transformar seus fluxos de trabalho hoje mesmo
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
          {/* Mensagens de Feedback */}
          {state.message && (
            <div
              className={`mb-6 p-4 rounded-lg ${state.success
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
                }`}
            >
              <p className="text-sm font-medium">{state.message}</p>
            </div>
          )}

          <form action={formAction} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nome
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  disabled={isPending}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="João"
                />
                {state.errors?.nome && (
                  <p className="text-red-500 text-xs mt-1">
                    {state.errors.nome}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Sobrenome
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  disabled={isPending}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Silva"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                disabled={isPending}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="joao@empresa.com"
              />
              {state.errors?.email && (
                <p className="text-red-500 text-xs mt-1">
                  {state.errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="telefone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Telefone <span className="text-gray-400">(opcional)</span>
              </label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                disabled={isPending}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label
                htmlFor="setor"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Setor <span className="text-gray-400">(opcional)</span>
              </label>
              <input
                id="setor"
                name="setor"
                type="text"
                disabled={isPending}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Ex: TI, RH, Financeiro"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  disabled={isPending}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Mínimo 8 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {state.errors?.senha && (
                <p className="text-red-500 text-xs mt-1">
                  {state.errors.senha}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  disabled={isPending}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Digite a senha novamente"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isPending}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {state.errors?.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {state.errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  required
                  disabled={isPending}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="agreeTerms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Eu concordo com os{" "}
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-500 hover:underline"
                  >
                    Termos de Serviço
                  </Link>{" "}
                  e{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-500 hover:underline"
                  >
                    Política de Privacidade
                  </Link>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  id="newsletter"
                  name="newsletter"
                  type="checkbox"
                  disabled={isPending}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="newsletter"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Quero receber atualizações por email sobre novos recursos e
                  dicas
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Criando conta...
                </>
              ) : (
                "Criar Conta Gratuita"
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar com Google
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Continuar com Facebook
              </button>
            </div>
          </form>
          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-500 font-semibold hover:underline transition-colors"
              >
                Faça seu login
              </Link>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white/50 backdrop-blur-sm rounded-xl flex flex-col items-center p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ✨ O que você ganha com o Workflux:
          </h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-700">
              <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
              <span>Fluxos visuais intuitivos com drag & drop</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
              <span>Gestão completa de equipes e tarefas</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
              <span>Automação inteligente de processos</span>
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
              <span>Relatórios em tempo real</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            Ao se cadastrar, você concorda com nossos{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
