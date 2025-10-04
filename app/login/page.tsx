"use client";

import React, { useActionState, useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { postLogin } from "@/lib/actions/auth/post-login";
import { LoginFormState } from "@/lib/types/definition";
import { useRouter } from "next/navigation";
import { useUser } from "../context/User";

const initialState: LoginFormState = {
  errors: {},
  message: "",
  success: false,
  usuario: undefined,
};

function LoginPage() {
  const router = useRouter();
  const { login, authState, isLoading: userLoading } = useUser();
  const [state, formAction, isPending] = useActionState(
    postLogin,
    initialState
  );

  const [showPassword, setShowPassword] = useState(false);

  // Redireciona após sucesso baseado na role do usuário
  useEffect(() => {
    if (authState === "authenticated") {
      router.push("/admin");
    }
  }, [authState, router]);

  useEffect(() => {
    if (state.success && state.usuario) {
      // Opcional: Salvar dados do usuário no localStorage
      localStorage.setItem("usuario", JSON.stringify(state.usuario));

      setTimeout(() => {
        // Redireciona baseado na role do usuário
        if (state.usuario?.role === "gestor") {
          router.push("/admin");
        } else if (state.usuario?.role === "funcionario") {
          router.push("/func");
        }
      }, 1500);
    }
  }, [state.success, state.usuario, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Voltar para Home */}
        <div className="text-left">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Início
          </Link>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Faça seu login</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ou{" "}
            <Link
              href="/cadastro"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              crie uma nova conta
            </Link>
          </p>
        </div>

        {/* Mensagens de Feedback */}
        {state.message && (
          <div
            className={`p-4 rounded-lg ${
              state.success
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <p className="text-sm font-medium">{state.message}</p>
            {state.success && state.usuario && (
              <div className="text-xs mt-2 space-y-1">
                <p>
                  Bem-vindo, <strong>{state.usuario.nome}</strong>!
                </p>
                <p>
                  Redirecionando para{" "}
                  {state.usuario.role === "gestor"
                    ? "painel administrativo"
                    : "painel do funcionário"}
                  ...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Form */}
        <form action={formAction} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isPending}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="seu@email.com"
              />
              {state.errors?.email && (
                <p className="text-red-500 text-xs mt-1">
                  {state.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  minLength={8}
                  disabled={isPending}
                  className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:cursor-not-allowed"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isPending}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {state.errors?.senha && (
                <p className="text-red-500 text-xs mt-1">
                  {state.errors.senha}
                </p>
              )}
            </div>
          </div>

          {/* Remember me and Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                disabled={isPending}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-900"
              >
                Lembrar de mim
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </div>
        </form>

        {/* Social login options */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Ou continue com
              </span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isPending}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                disabled={isPending}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
