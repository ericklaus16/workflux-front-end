"use server";

import axios from "axios";
import { LoginFormState, Usuario } from "@/lib/types/definition";

export async function postLogin(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const errors: Record<string, string> = {};

    if (!email || !email.includes("@")) {
      errors.email = "Email válido é obrigatório";
    }

    if (!password || password.length < 8) {
      errors.senha = "Senha deve ter no mínimo 8 caracteres";
    }

    if (Object.keys(errors).length > 0) {
      return {
        errors,
        message: "Por favor, corrija os erros no formulário",
        success: false,
      };
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/usuarios/login`;

    console.log("API URL:", apiUrl);

    const payload = {
      email: email.trim(),
      senha: password,
    };

    console.log("Enviando para o backend:", payload);

    const response = await axios.post(apiUrl, payload);

    console.log("Resposta do backend:", response.data);

    const usuario: Usuario = {
      id: response.data.usuario.id,
      nome: response.data.usuario.nome,
      email: response.data.usuario.email,
      telefone: response.data.usuario.telefone,
      setor: response.data.usuario.setor,
      role: response.data.usuario.role,
      estaAtivo: response.data.usuario.estaAtivo,
      createdAt: response.data.usuario.createdAt,
      updatedAt: response.data.usuario.updatedAt,
    };

    if (!usuario.role || !["gestor", "funcionario"].includes(usuario.role)) {
      return {
        errors: {},
        message: "Erro ao identificar tipo de usuário.",
        success: false,
      };
    }

    // Aqui você pode salvar os dados do usuário no localStorage ou cookies
    // localStorage.setItem('usuario', JSON.stringify(usuario));

    return {
      errors: {},
      message: "Login realizado com sucesso! Redirecionando...",
      success: true,
      usuario,
    };
  } catch (error: any) {
    console.error("Erro ao realizar login:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Email ou senha incorretos. Tente novamente.";

      return {
        errors: {},
        message: errorMessage,
        success: false,
      };
    }

    return {
      errors: {},
      message: "Erro inesperado. Tente novamente mais tarde.",
      success: false,
    };
  }
}