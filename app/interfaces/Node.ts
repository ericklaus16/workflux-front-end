export interface VariableType {
  name: string;
  type: "string" | "number" | "date" | "datetime" | "select" | "array";
  value: any;
  required: boolean;
  options?: string[];
}

export interface DraggableComponentType {
  id: string;
  nome: string;
  tipo: string;
  cor: string;
  variaveis: VariableType[];
  descricao?: string;
}
