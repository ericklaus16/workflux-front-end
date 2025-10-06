import { Edge } from "@xyflow/react";
import { CustomNode } from "../perfil/types";
import { VariableType } from "../interfaces/Node";

export function inferVariablesFromWorkflow(
  nodes: CustomNode[],
  edges: Edge[]
): {
  inputVariables: VariableType[];
  outputVariables: VariableType[];
} {
  const inputVariables: VariableType[] = [];
  const outputVariables: VariableType[] = [];

  // 1. Identificar o nó inicial (entrada do workflow)
  const startNode = nodes.find((n) => n.id === "1" || n.data.nome === "Início");

  // 2. Identificar nós finais (sem conexões de saída de execução)
  const endNodes = nodes.filter((node) => {
    const hasExecutionOutput = edges.some(
      (edge) => edge.source === node.id && edge.sourceHandle === "exec-out"
    );
    return !hasExecutionOutput && node.id !== startNode?.id;
  });

  // 3. Coletar variáveis de ENTRADA
  // São variáveis que:
  // - Têm handle de entrada (target)
  // - MAS não estão conectadas a nenhuma saída de outro nó
  nodes.forEach((node) => {
    const nodeVariables = node.data.configuredVariables || [];

    nodeVariables.forEach((variable: any) => {
      const handleId = `var-${variable.name}-in`;

      // Verifica se essa variável de entrada NÃO está conectada
      const isConnected = edges.some(
        (edge) => edge.target === node.id && edge.targetHandle === handleId
      );

      if (!isConnected) {
        // Adiciona como variável de entrada do complex node
        inputVariables.push({
          name: `${node.data.nome}_${variable.name}`,
          type: variable.type,
          value: null,
          required: variable.required,
          options: variable.options,
        });
      }
    });
  });

  // 4. Coletar variáveis de SAÍDA
  // São as variáveis dos nós finais que têm handle de saída
  endNodes.forEach((node) => {
    const nodeVariables = node.data.configuredVariables || [];

    nodeVariables.forEach((variable: any) => {
      outputVariables.push({
        name: `${node.data.nome}_${variable.name}`,
        type: variable.type,
        value: null,
        required: false, // Saídas geralmente não são obrigatórias
        options: variable.options,
      });
    });
  });

  return { inputVariables, outputVariables };
}
