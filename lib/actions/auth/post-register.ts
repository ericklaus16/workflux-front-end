"use server";

import axios from "axios";
import { RegisterFormState } from "@/lib/types/definition";

export async function postRegister(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  try {
    // Extrai os dados do FormData
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const telefone = formData.get("telefone") as string;
    const setor = formData.get("setor") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validações
    const errors: Record<string, string> = {};

    if (!firstName || !lastName) {
      errors.nome = "Nome e sobrenome são obrigatórios";
    }

    if (!email || !email.includes("@")) {
      errors.email = "Email válido é obrigatório";
    }

    if (!password || password.length < 8) {
      errors.senha = "Senha deve ter no mínimo 8 caracteres";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
    }

    // Se houver erros, retorna sem fazer a requisição
    if (Object.keys(errors).length > 0) {
      return {
        errors,
        message: "Por favor, corrija os erros no formulário",
        success: false,
      };
    }

    // Prepara o payload
    const nomeCompleto = `${firstName.trim()} ${lastName.trim()}`;

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/usuarios`;

    console.log("API URL:", apiUrl);

    const payload = {
      nome: nomeCompleto,
      email: email.trim(),
      telefone: telefone?.trim() || "",
      senha: password,
      setorId: setor?.trim() || "1", 
      role: "gestor",
      estaAtivo: true,
    };

    console.log("Enviando para o backend:", payload);

    const response = await axios.post(apiUrl, payload);

    if (!response.data.success) {
      return {
        errors: {},
        message: response.data.message || "Erro ao registrar usuário.",
        success: false,
      };
    }

    return {
      errors: {},
      message: "Usuário registrado com sucesso! Redirecionando...",
      success: true,
    };
  } catch (error: any) {
    console.error("Erro ao registrar:", error);

    if (axios.isAxiosError(error)) {
      return {
        errors: {},
        message:
          error.response?.data?.message ||
          "Erro ao conectar com o servidor. Tente novamente mais tarde.",
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