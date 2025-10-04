export interface VariableType {
  name: string;
  type: "string" | "number" | "date" | "datetime" | "select" | "array";
  value: any;
  required: boolean;
  options?: string[];
}

export interface DraggableComponentType {
  id: string;
  label: string;
  type: string;
  color: string;
  variables: VariableType[];
}
