"use server";

import axios from "axios";
import { LoginFormState } from "@/lib/types/definition";

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

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/usuarios/login`;

    const payload = {
      email: email.trim(),
      senha: password,
    };

    const response = await axios.post(apiUrl, payload);

    // console.log("Resposta da API:", response.data.role);

    const userRole = response.data.role;

    if (!userRole || !["gestor", "funcionario"].includes(userRole)) {
      return {
        errors: {},
        message: "Erro ao identificar tipo de usuário.",
        success: false,
      };
    }

    return {
      errors: {},
      message: "Login realizado com sucesso! Redirecionando...",
      success: true,
      role: userRole, // Adiciona a role ao retorno
    };
  } catch (error: any) {
    console.error("Erro ao realizar login:", error);
    return {
      errors: {},
      message: "Erro ao realizar login. Tente novamente mais tarde.",
      success: false,
    };
  }
}