"use server";

import axios from "axios";

interface RegisterData {
  nome: string;
  email: string;
  telefone?: string;
  senha: string;
  setor?: string;
  estaAtivo?: boolean;
}

interface RegisterResponse {
  success?: boolean;
  message: string;
  data?: any;
}

export async function postRegister(data: RegisterData): Promise<RegisterResponse> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/usuarios`;

    const payload = {
      nome: `${data.nome}`, // Combina firstName e lastName
      email: data.email,
      telefone: data.telefone || "",
      senha: data.senha,
      setor: data.setor || null,
      estaAtivo: true,
    };

    const response = await axios.post(apiUrl, payload);

    if (!response.data.success) {
      return {
        success: false,
        message: response.data.message || "Erro ao registrar usuário.",
      }
    }

    return {
      success: true,
      message: "Usuário registrado com sucesso.",
    }
  } catch (error) {
    return {
      success: false,
      message: "Erro ao conectar com o servidor. Tente novamente mais tarde."
    }
  }
}