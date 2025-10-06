// ComplexNodeCreation.tsx
"use client";

import React, { useState, useEffect } from "react";
import { X, Save, PackageCheck, AlertCircle } from "lucide-react";
import axios from "axios";
import { CustomNode } from "@/app/perfil/types";
import { Edge } from "@xyflow/react";
import {
  DraggableComponentType,
  InternalWorkflow,
  VariableType,
} from "@/app/interfaces/Node";
import { inferVariablesFromWorkflow } from "../utils";

interface ComplexNodeCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (complexNodeData: any) => void;

  // Dados do workflow atual
  currentNodes: CustomNode[];
  currentEdges: Edge[];
}

export default function ComplexNodeCreation({
  isOpen,
  onClose,
  onSave,
  currentNodes,
  currentEdges,
}: ComplexNodeCreationProps) {
  const [complexNodeData, setComplexNodeData] = useState({
    name: "",
    description: "",
    color: "bg-purple-500",
  });

  const [inferredVariables, setInferredVariables] = useState<{
    inputs: VariableType[];
    outputs: VariableType[];
  }>({ inputs: [], outputs: [] });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validar workflow antes de permitir salvar
  useEffect(() => {
    if (!isOpen) return;

    const errors: string[] = [];

    // Validação 1: Deve ter pelo menos 2 nós (além do início)
    if (currentNodes.length < 2) {
      errors.push("O workflow deve conter pelo menos 2 nós");
    }

    // Validação 2: Deve ter pelo menos 1 conexão
    if (currentEdges.length < 1) {
      errors.push("O workflow deve ter pelo menos 1 conexão");
    }

    // Validação 3: Todos os nós devem estar conectados (caminho do início até o fim)
    const startNode = currentNodes.find((n) => n.id === "1");
    if (startNode) {
      const reachableNodes = new Set<string>();
      const queue = [startNode.id];

      while (queue.length > 0) {
        const nodeId = queue.shift()!;
        reachableNodes.add(nodeId);

        const outgoingEdges = currentEdges.filter((e) => e.source === nodeId);
        outgoingEdges.forEach((edge) => {
          if (!reachableNodes.has(edge.target)) {
            queue.push(edge.target);
          }
        });
      }

      const disconnectedNodes = currentNodes.filter(
        (n) => !reachableNodes.has(n.id)
      );

      if (disconnectedNodes.length > 0) {
        errors.push(
          `${disconnectedNodes.length} nó(s) não conectado(s) ao fluxo principal`
        );
      }
    }

    setValidationErrors(errors);

    // Inferir variáveis se o workflow for válido
    if (errors.length === 0) {
      const { inputVariables, outputVariables } = inferVariablesFromWorkflow(
        currentNodes,
        currentEdges
      );

      setInferredVariables({
        inputs: inputVariables,
        outputs: outputVariables,
      });
    }
  }, [isOpen, currentNodes, currentEdges]);

  const handleSave = async () => {
    if (validationErrors.length > 0) {
      alert("Corrija os erros antes de salvar");
      return;
    }

    if (!complexNodeData.name.trim()) {
      alert("Digite um nome para o Nó Complexo");
      return;
    }

    // Gerar o JSON do workflow interno
    const workflowJson: InternalWorkflow = {
      nodes: currentNodes.map((node) => ({
        id: node.id,
        name: node.data.nome,
        type: node.type || "default",
        position: node.position,
        variables: node.data.configuredVariables || [],
      })),
      edges: currentEdges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        sourceHandle: edge.sourceHandle || "",
        target: edge.target,
        targetHandle: edge.targetHandle || "",
        type: edge.sourceHandle?.includes("exec") ? "execution" : "data",
      })),
    };

    const allVariables = [
      ...inferredVariables.inputs,
      ...inferredVariables.outputs,
    ];

    const complexNode: DraggableComponentType = {
      id: `complex_${Date.now()}`,
      nome: complexNodeData.name,
      tipo: "complex",
      cor: complexNodeData.color,
      descricao: complexNodeData.description,
      workflowJson: JSON.stringify(workflowJson, null, 2),
      variaveis: allVariables,
      metadata: {
        totalNodes: currentNodes.length,
        totalConnections: currentEdges.length,
        createdAt: new Date().toISOString(),
        nodeIds: currentNodes.map((n) => n.id),
      },
    };

    // Salvar no backend
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/nodes`;
      await axios.post(apiUrl, {
        ...complexNode,
        usuarioId: "57009c51-1d98-49d1-a501-d6fea5cd7159",
      });

      onSave(complexNode);
      handleClose();
    } catch (error) {
      console.error("Erro ao salvar Nó Complexo:", error);
      alert("Erro ao salvar. Verifique o console.");
    }
  };

  const handleClose = () => {
    setComplexNodeData({
      name: "",
      description: "",
      color: "bg-purple-500",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-purple-50">
          <div className="flex items-center space-x-3">
            <PackageCheck className="text-purple-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">
              Criar Nó Complexo
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Erros de Validação */}
          {validationErrors.length > 0 && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="text-red-500 mr-3 mt-0.5" size={20} />
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">
                    Erros no Workflow:
                  </h4>
                  <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                    {validationErrors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Estatísticas do Workflow */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Nós no Workflow</p>
              <p className="text-2xl font-bold text-blue-600">
                {currentNodes.length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Conexões</p>
              <p className="text-2xl font-bold text-green-600">
                {currentEdges.length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Variáveis Inferidas</p>
              <p className="text-2xl font-bold text-purple-600">
                {inferredVariables.inputs.length +
                  inferredVariables.outputs.length}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Nó Complexo *
              </label>
              <input
                type="text"
                value={complexNodeData.name}
                onChange={(e) =>
                  setComplexNodeData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Ex: Processo de Aprovação Completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={complexNodeData.description}
                onChange={(e) =>
                  setComplexNodeData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Descreva o que este workflow faz..."
              />
            </div>

            {/* Variáveis Inferidas - Entradas */}
            {inferredVariables.inputs.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Variáveis de Entrada ({inferredVariables.inputs.length})
                </h3>
                <div className="space-y-2">
                  {inferredVariables.inputs.map((variable, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-50 p-3 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <span className="font-medium text-sm text-gray-800">
                          {variable.name}
                        </span>
                        {variable.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </div>
                      <span className="text-xs uppercase font-mono text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {variable.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Variáveis Inferidas - Saídas */}
            {inferredVariables.outputs.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Variáveis de Saída ({inferredVariables.outputs.length})
                </h3>
                <div className="space-y-2">
                  {inferredVariables.outputs.map((variable, idx) => (
                    <div
                      key={idx}
                      className="bg-green-50 p-3 rounded-lg flex items-center justify-between"
                    >
                      <span className="font-medium text-sm text-gray-800">
                        {variable.name}
                      </span>
                      <span className="text-xs uppercase font-mono text-green-600 bg-green-100 px-2 py-1 rounded">
                        {variable.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview do JSON (colapsável) */}
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="cursor-pointer font-medium text-sm text-gray-700">
                🔍 Preview do Workflow JSON
              </summary>
              <pre className="mt-3 text-xs bg-gray-900 text-green-400 p-3 rounded overflow-auto max-h-64">
                {JSON.stringify(
                  {
                    nodes: currentNodes.map((n) => ({
                      id: n.id,
                      name: n.data.nome,
                    })),
                    edges: currentEdges.map((e) => ({
                      from: e.source,
                      to: e.target,
                    })),
                  },
                  null,
                  2
                )}
              </pre>
            </details>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={
              validationErrors.length > 0 || !complexNodeData.name.trim()
            }
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Save size={16} className="mr-2" />
            Salvar Nó Complexo
          </button>
        </div>
      </div>
    </div>
  );
}
