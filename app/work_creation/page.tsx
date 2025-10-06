"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus, Code, Eye, EyeOff } from "lucide-react";
import NodeCreationModal from "./components/NodeCreation";
import { DraggableComponentType, NodeData } from "../interfaces/Node";
import axios from "axios";
import DraggableComponent from "./components/DraggableComponent";
import CustomBlueprintNode from "./components/CustomBlueprintNode";
import { CustomNode } from "../perfil/types";
import ComplexNodeCreation from "./components/ComplexNodeCreation";

const nodeTypes = {
  default: CustomBlueprintNode,
  input: CustomBlueprintNode,
  output: CustomBlueprintNode,
};

const initialNodes: CustomNode[] = [
  {
    id: "1",
    type: "input",
    data: { nome: "Início" },
    position: { x: 250, y: 25 },
  },
];

const initialEdges: Edge[] = [];

let id = 2;
const getId = () => `${id++}`;

function FlowComponent() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showComplexNodeModal, setShowComplexNodeModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [customComponents, setCustomComponents] = useState<
    DraggableComponentType[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConnectionsJson, setShowConnectionsJson] = useState(false);
  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("NEXT_PUBLIC_API_URL não está configurada");
        }

        const response = await axios.get(`${apiUrl}/nodes`);

        const processedData = response.data.map((item: any) => ({
          id: item.id,
          nome: item.nome,
          tipo: item.tipo || "default",
          cor: item.cor,
          variaveis: item.variaveis || [],
        }));

        setCustomComponents(processedData);
      } catch (err: any) {
        console.error("Erro ao buscar nós:", err);
        setError(err.message || "Erro ao carregar componentes");
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedNode) {
          event.preventDefault();

          if (selectedNode.id === "1") {
            alert("❌ O nó inicial não pode ser removido!");
            return;
          }

          // Deletar o nó selecionado
          setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));

          setEdges((eds) =>
            eds.filter(
              (edge) =>
                edge.source !== selectedNode.id &&
                edge.target !== selectedNode.id
            )
          );

          setSelectedNode(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedNode, setNodes, setEdges]);

  const handleSaveCustomNode = (nodeData: any) => {
    const newComponent: DraggableComponentType = {
      ...nodeData,
      variables: nodeData.variables || [],
    };

    setCustomComponents((prev) => [...prev, newComponent]);
  };

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: CustomNode) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const componentDataString = event.dataTransfer.getData(
        "application/reactflow"
      );

      if (!componentDataString) {
        return;
      }

      try {
        const componentData: DraggableComponentType =
          JSON.parse(componentDataString);

        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode: CustomNode = {
          id: getId(),
          type: "default",
          position,
          data: {
            nome: componentData.nome,
            cor: componentData.cor,
            componentId: componentData.id,
            configuredVariables: [...(componentData.variaveis || [])],
          },
        };

        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.error("Erro ao processar componente:", error);
      }
    },
    [screenToFlowPosition, setNodes]
  );

  // Gerar JSON das conexões
  const getConnectionsJson = useCallback(() => {
    const connections = edges.map((edge) => {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);

      return {
        id: edge.id,
        from: {
          nodeId: edge.source,
          nodeName: sourceNode?.data?.nome || "Unknown",
          handleId: edge.sourceHandle,
        },
        to: {
          nodeId: edge.target,
          nodeName: targetNode?.data?.nome || "Unknown",
          handleId: edge.targetHandle,
        },
      };
    });

    return {
      totalConnections: edges.length,
      totalNodes: nodes.length,
      connections,
      workflow: {
        nodes: nodes.map((node) => ({
          id: node.id,
          name: node.data.nome,
          type: node.type,
          position: node.position,
          variables: node.data.configuredVariables || [],
        })),
        edges: edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          sourceHandle: edge.sourceHandle,
          target: edge.target,
          targetHandle: edge.targetHandle,
        })),
      },
    };
  }, [edges, nodes]);

  // Log automático quando houver mudanças
  useEffect(() => {
    if (edges.length > 0) {
      console.log("📊 Conexões atualizadas:", getConnectionsJson());
    }
  }, [edges, getConnectionsJson]);

  // Copiar JSON para clipboard
  const copyJsonToClipboard = () => {
    const json = JSON.stringify(getConnectionsJson(), null, 2);
    navigator.clipboard.writeText(json);
    alert("JSON copiado para a área de transferência!");
  };

  // Exportar workflow
  const exportWorkflow = () => {
    const json = JSON.stringify(getConnectionsJson(), null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-lg p-6 border-r overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Componentes</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 cursor-pointer text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
            title="Criar novo nó"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => setShowComplexNodeModal(true)}
            className="bg-blue-600 cursor-pointer text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
            title="Criar novo nó complexo"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Carregando componentes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <div className="text-red-500 text-sm mb-2">⚠️ {error}</div>
              <p className="text-xs text-gray-500">Usando dados locais</p>
            </div>
          ) : null}

          {customComponents.map((component) => (
            <DraggableComponent key={component.id} component={component} />
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">
            Workflow Info
          </h3>
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Nós:</span>
              <span className="font-semibold">{nodes.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Conexões:</span>
              <span className="font-semibold">{edges.length}</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button
              onClick={() => setShowConnectionsJson(!showConnectionsJson)}
              className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-sm"
            >
              {showConnectionsJson ? (
                <>
                  <EyeOff size={14} className="mr-2" />
                  Ocultar JSON
                </>
              ) : (
                <>
                  <Eye size={14} className="mr-2" />
                  Ver JSON
                </>
              )}
            </button>

            <button
              onClick={copyJsonToClipboard}
              className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
              disabled={edges.length === 0}
            >
              <Code size={14} className="mr-2" />
              Copiar JSON
            </button>

            <button
              onClick={exportWorkflow}
              className="w-full bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm"
              disabled={edges.length === 0}
            >
              📥 Exportar Workflow
            </button>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p>
            Arraste os componentes para o workflow ao lado para criar seu fluxo.
          </p>
          <p className="mt-2 text-xs">
            Clique no <Plus size={12} className="inline" /> para criar novos
            tipos de nó.
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
            className="bg-gray-900"
          >
            <Controls />
            <Background color="#333" gap={20} />
          </ReactFlow>
        </div>

        {showConnectionsJson && (
          <div className="h-64 bg-gray-800 border-t border-gray-700 p-4 overflow-auto">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold text-sm">
                Conexões do Workflow (JSON)
              </h3>
              <button
                onClick={() => setShowConnectionsJson(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <pre className="text-green-400 text-xs font-mono overflow-auto">
              {JSON.stringify(getConnectionsJson(), null, 2)}
            </pre>
          </div>
        )}
      </div>

      <NodeCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomNode}
      />
      <ComplexNodeCreation
        isOpen={showComplexNodeModal}
        onClose={() => setShowComplexNodeModal(false)}
        onSave={handleSaveCustomNode}
        currentNodes={nodes}
        currentEdges={edges}
      />
    </div>
  );
}

export default function Home() {
  return (
    <ReactFlowProvider>
      <FlowComponent />
    </ReactFlowProvider>
  );
}
