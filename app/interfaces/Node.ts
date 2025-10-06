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
  workflowJson?: string;
  metadata?: {
    totalNodes: number;
    totalConnections: number;
    createdAt: string;
    nodeIds: string[]; // IDs dos nós que compõem o complex node
  };
}

export interface NodeData {
  nome: string;
  variaveisConfiguradas?: VariableType[];
  [key: string]: any;
}

export interface InternalWorkflow {
  nodes: Array<{
    id: string;
    name: string;
    type: string;
    position: { x: number; y: number };
    variables: VariableType[];
  }>;
  edges: Array<{
    id: string;
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
    type: "execution" | "data";
  }>;
}
