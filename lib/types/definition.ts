export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  setor: string | null;
  role: "gestor" | "funcionario";
  estaAtivo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginFormState {
  errors: Record<string, string>;
  message: string;
  success: boolean;
  usuario?: Usuario; // Agora retorna o usuário completo
}

export interface RegisterFormState {
  errors: Record<string, string>;
  message: string;
  success: boolean;
}