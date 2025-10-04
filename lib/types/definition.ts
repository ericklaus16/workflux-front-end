export interface RegisterFormState {
  errors: Record<string, string>;
  message: string;
  success: boolean;
}

export interface LoginFormState {
  errors: Record<string, string>;
  message: string;
  success: boolean;
  role?: "gestor" | "funcionario";
}