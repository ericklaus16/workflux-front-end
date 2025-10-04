"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

// Tipos para o usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: "gestor" | "funcionario" | "admin";
  department?: string;
  avatar?: string;
  permissions?: string[];
  createdAt?: string;
  lastLogin?: string;
}

// Estados possíveis da autenticação
export type AuthState = "loading" | "authenticated" | "unauthenticated";

// Estado do contexto
export interface UserContextState {
  user: User | null;
  authState: AuthState;
  isLoading: boolean;
  error: string | null;
}

// Ações do reducer
export type UserAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_AUTH_STATE"; payload: AuthState };

// Estado inicial
const initialState: UserContextState = {
  user: null,
  authState: "loading",
  isLoading: true,
  error: null,
};

// Reducer para gerenciar o estado
function userReducer(
  state: UserContextState,
  action: UserAction
): UserContextState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        authState: "authenticated",
        isLoading: false,
        error: null,
      };

    case "LOGIN_ERROR":
      return {
        ...state,
        user: null,
        authState: "unauthenticated",
        isLoading: false,
        error: action.payload,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        authState: "unauthenticated",
        isLoading: false,
        error: null,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    case "SET_AUTH_STATE":
      return {
        ...state,
        authState: action.payload,
        isLoading: action.payload === "loading",
      };

    default:
      return state;
  }
}

// Interface do contexto
export interface UserContextValue extends UserContextState {
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
}

// Criar o contexto
const UserContext = createContext<UserContextValue | undefined>(undefined);

// Provider do contexto
interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Função para fazer login
  const login = (userData: User) => {
    try {
      // Salvar dados no localStorage
      localStorage.setItem("workflux_user", JSON.stringify(userData));
      localStorage.setItem("workflux_auth_token", "your-auth-token"); // Se você usar tokens
      localStorage.setItem("workflux_last_login", new Date().toISOString());

      // Atualizar estado
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          ...userData,
          lastLogin: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      dispatch({
        type: "LOGIN_ERROR",
        payload: "Erro ao salvar dados do usuário",
      });
    }
  };

  // Função para logout
  const logout = () => {
    try {
      // Limpar localStorage
      localStorage.removeItem("workflux_user");
      localStorage.removeItem("workflux_auth_token");
      localStorage.removeItem("workflux_last_login");

      // Atualizar estado
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Função para atualizar dados do usuário
  const updateUser = (userData: Partial<User>) => {
    try {
      if (state.user) {
        const updatedUser = { ...state.user, ...userData };
        localStorage.setItem("workflux_user", JSON.stringify(updatedUser));
        dispatch({ type: "UPDATE_USER", payload: userData });
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
    }
  };

  // Função para limpar erros
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Função para verificar status de autenticação
  const checkAuthStatus = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const storedUser = localStorage.getItem("workflux_user");
      const storedToken = localStorage.getItem("workflux_auth_token");

      if (storedUser && storedToken) {
        const userData = JSON.parse(storedUser);

        // Aqui você pode fazer uma verificação com a API se o token ainda é válido
        // const response = await fetch('/api/verify-token', {
        //   headers: { Authorization: `Bearer ${storedToken}` }
        // });

        // if (response.ok) {
        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
        // } else {
        //   throw new Error('Token inválido');
        // }
      } else {
        dispatch({ type: "SET_AUTH_STATE", payload: "unauthenticated" });
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      logout(); // Limpar dados inválidos
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Verificar autenticação ao montar o componente
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Valor do contexto
  const contextValue: UserContextValue = {
    ...state,
    login,
    logout,
    updateUser,
    clearError,
    checkAuthStatus,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

// Hook para usar o contexto
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }
  return context;
}

// Hook para verificar se o usuário tem uma role específica
export function useHasRole(role: User["role"]) {
  const { user } = useUser();
  return user?.role === role;
}

// Hook para verificar se o usuário está autenticado
export function useIsAuthenticated() {
  const { authState } = useUser();
  return authState === "authenticated";
}
