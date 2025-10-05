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
import { Plus } from "lucide-react";
import NodeCreationModal from "./components/NodeCreation";
import { DraggableComponentType, VariableType } from "../interfaces/Node";
import axios from "axios";

interface NodeData {
  nome: string;
  variaveisConfiguradas?: VariableType[];
  [key: string]: any;
}

const CustomBlueprintNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gray-800 border-2 border-gray-600 rounded-lg min-w-[200px] shadow-lg">
      <div className="bg-red-600 text-white px-4 py-2 rounded-t-lg text-sm font-medium">
        {data.nome}
      </div>

      <div className="p-3">
        {data.configuredVariables && data.configuredVariables.length > 0 && (
          <div className="space-y-2">
            {data.configuredVariables.map((variable: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between relative"
              >
                <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white cursor-pointer hover:bg-blue-400">
                    <div className="handle-left" />
                  </div>
                </div>

                <span className="text-white text-xs font-medium pl-2">
                  {variable.name}
                  {variable.required && (
                    <span className="text-red-400 ml-1">*</span>
                  )}
                </span>

                <span className="text-gray-400 text-xs uppercase">
                  {variable.type}
                </span>

                <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white cursor-pointer hover:bg-green-400">
                    <div className="handle-right" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {(!data.configuredVariables ||
          data.configuredVariables.length === 0) && (
          <div className="flex items-center justify-between relative py-2">
            <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white cursor-pointer hover:bg-blue-400" />
            </div>

            <span className="text-white text-xs">Execute</span>

            <div className="absolute -right-6 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white cursor-pointer hover:bg-green-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const nodeTypes = {
  default: CustomBlueprintNode,
  input: CustomBlueprintNode,
  output: CustomBlueprintNode,
};

type CustomNode = Node<NodeData>;

const DraggableComponent = ({
  component,
}: {
  component: DraggableComponentType;
}) => {
  const onDragStart = (
    event: React.DragEvent,
    componentData: DraggableComponentType
  ) => {
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(componentData)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  // Garante que variables sempre seja um array
  const variables = component.variaveis || [];

  const getColorStyle = (colorClass: string): string => {
    const colorMap: { [key: string]: string } = {
      "bg-blue-500": "#3b82f6",
      "bg-red-500": "#ef4444",
      "bg-green-500": "#22c55e",
      "bg-purple-500": "#a855f7",
      "bg-orange-500": "#f97316",
      "bg-teal-500": "#14b8a6",
      "bg-indigo-500": "#6366f1",
      "bg-pink-500": "#ec4899",
      "bg-yellow-500": "#eab308",
      "bg-gray-500": "#6b7280",
    };

    return colorMap[colorClass] || "#3b82f6";
  };

  return (
    <div
      className={`text-white p-4 rounded-lg cursor-grab active:cursor-grabbing shadow-lg hover:shadow-xl transition-all duration-200 border border-white/20`}
      onDragStart={(event) => onDragStart(event, component)}
      style={{ backgroundColor: getColorStyle(component.cor) }}
      draggable
    >
      <div className="text-center font-semibold text-sm mb-2">
        {component.nome}
      </div>

      <div className="text-xs opacity-90">
        {variables.length > 0 ? (
          <div>
            <div className="font-medium mb-1">
              Variáveis ({variables.length}):
            </div>
            <div className="space-y-1">
              {variables.slice(0, 3).map((variable, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-black/20 rounded px-2 py-1"
                >
                  <span className="truncate">{variable.name}</span>
                  <span className="text-xs opacity-75 ml-1">
                    {variable.type}
                    {variable.required && "*"}
                  </span>
                </div>
              ))}
              {variables.length > 3 && (
                <div className="text-center opacity-75">
                  +{variables.length - 3} mais...
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="font-medium">Componente Simples</div>
            <div className="opacity-75">Sem variáveis configuradas</div>
          </div>
        )}
      </div>
    </div>
  );
};

const initialNodes: CustomNode[] = [
  {
    id: "1",
    type: "input",
    data: { nome: "Start" },
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
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [customComponents, setCustomComponents] = useState<
    DraggableComponentType[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        console.log(response.data);

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

        // Dados de fallback caso a API falhe
        const fallbackData: DraggableComponentType[] = [
          {
            id: "visita",
            nome: "Visita",
            tipo: "default",
            cor: "bg-purple-500",
            variaveis: [
              { name: "destino", type: "string", value: null, required: true },
              {
                name: "horario",
                type: "datetime",
                value: null,
                required: true,
              },
            ],
          },
          {
            id: "reuniao",
            nome: "Reunião",
            tipo: "default",
            cor: "bg-orange-500",
            variaveis: [
              { name: "local", type: "string", value: null, required: true },
              { name: "duracao", type: "number", value: null, required: true },
            ],
          },
        ];

        setCustomComponents(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
  }, []);

  const handleSaveCustomNode = (nodeData: any) => {
    const newComponent: DraggableComponentType = {
      ...nodeData,
      variables: nodeData.variables || [],
    };

    setCustomComponents((prev) => [...prev, newComponent]);
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: CustomNode) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onUpdateNode = useCallback(
    (nodeId: string, newData: NodeData) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId ? { ...node, data: newData } : node
        )
      );

      if (selectedNode && selectedNode.id === nodeId) {
        setSelectedNode({ ...selectedNode, data: newData });
      }
    },
    [setNodes, selectedNode]
  );

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

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-lg p-6 border-r">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Componentes</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 cursor-pointer text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
            title="Criar novo nó"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-4">
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

      <NodeCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCustomNode}
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
