"use client";

import React, { useState, useCallback, useRef } from "react";
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

interface NodeData {
  label: string;
  configuredVariables?: VariableType[];
  [key: string]: any;
}

const CustomBlueprintNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gray-800 border-2 border-gray-600 rounded-lg min-w-[200px] shadow-lg">
      <div className="bg-red-600 text-white px-4 py-2 rounded-t-lg text-sm font-medium">
        {data.label}
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

const DraggableComponents = [
  {
    id: "visita",
    label: "Visita",
    type: "default",
    color: "bg-purple-500",
    variables: [
      { name: "destino", type: "string" as const, value: null, required: true },
      {
        name: "horario",
        type: "datetime" as const,
        value: null,
        required: true,
      },
    ],
  },
  {
    id: "reuniao",
    label: "Reunião",
    type: "default",
    color: "bg-orange-500",
    variables: [
      { name: "local", type: "string" as const, value: null, required: true },
      { name: "duracao", type: "number" as const, value: null, required: true },
    ],
  },
  {
    id: "entrega",
    label: "Entrega",
    type: "default",
    color: "bg-teal-500",
    variables: [
      {
        name: "endereco",
        type: "string" as const,
        value: null,
        required: true,
      },
      { name: "prazo", type: "date" as const, value: null, required: true },
      {
        name: "prioridade",
        type: "select" as const,
        value: null,
        required: true,
        options: ["Baixa", "Média", "Alta"],
      },
    ],
  },
];

// Tipo para as variáveis
type VariableType = {
  name: string;
  type: "string" | "number" | "date" | "datetime" | "select" | "array";
  value: any;
  required: boolean;
  options?: string[]; // Para campos do tipo select
};

// Tipo atualizado para os componentes
type DraggableComponentType = {
  id: string;
  label: string;
  type: string;
  color: string;
  variables: VariableType[];
};

const DraggableComponent = ({
  component,
}: {
  component: DraggableComponentType;
}) => {
  const onDragStart = (
    event: React.DragEvent,
    componentData: DraggableComponentType
  ) => {
    // Passa o componente completo com suas variáveis
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(componentData)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={`${component.color} text-white p-4 rounded-lg cursor-grab active:cursor-grabbing shadow-lg hover:shadow-xl transition-shadow`}
      onDragStart={(event) => onDragStart(event, component)}
      draggable
    >
      <div className="text-center font-medium">{component.label}</div>
      {component.variables.length > 0 && (
        <div className="text-xs mt-2 opacity-75">
          <div>Variáveis:</div>
          {component.variables.map((variable, index) => (
            <div key={index} className="truncate">
              • {variable.name} {variable.required && "*"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const initialNodes: CustomNode[] = [
  {
    id: "1",
    type: "input",
    data: { label: "Start" },
    position: { x: 250, y: 25 },
  },
];

const initialEdges: Edge[] = [];

let id = 2;
const getId = () => `${id++}`;

const PropertiesPanel = ({
  selectedNode,
  onUpdateNode,
}: {
  selectedNode: CustomNode | null;
  onUpdateNode: (nodeId: string, newData: NodeData) => void;
}) => {
  const [localValues, setLocalValues] = useState<Record<string, any>>({});

  const handleVariableChange = (variableName: string, value: any) => {
    if (!selectedNode) return;

    const newLocalValues = { ...localValues, [variableName]: value };
    setLocalValues(newLocalValues);

    const currentVariabes = selectedNode.data.configuredVariables || [];

    // Atualiza o nó com os novos valores
    const updatedVariables = currentVariabes.map((v: any) =>
      v.name === variableName ? { ...v, value } : v
    );

    onUpdateNode(selectedNode.id, {
      ...selectedNode.data,
      configuredVariables: updatedVariables,
    });
  };

  const renderVariableInput = (variable: any) => {
    const currentValue = localValues[variable.name] ?? variable.value;

    switch (variable.type) {
      case "string":
        return (
          <input
            type="text"
            value={currentValue || ""}
            onChange={(e) =>
              handleVariableChange(variable.name, e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Digite ${variable.name}`}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={currentValue || ""}
            onChange={(e) =>
              handleVariableChange(
                variable.name,
                parseFloat(e.target.value) || 0
              )
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={currentValue || ""}
            onChange={(e) =>
              handleVariableChange(variable.name, e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "datetime":
        return (
          <input
            type="datetime-local"
            value={currentValue || ""}
            onChange={(e) =>
              handleVariableChange(variable.name, e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      case "select":
        return (
          <select
            value={currentValue || ""}
            onChange={(e) =>
              handleVariableChange(variable.name, e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione...</option>
            {variable.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "array":
        return (
          <textarea
            value={currentValue ? JSON.stringify(currentValue, null, 2) : ""}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleVariableChange(variable.name, parsed);
              } catch {
                // Ignore invalid JSON while typing
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="[]"
          />
        );

      default:
        return (
          <input
            type="text"
            value={currentValue || ""}
            onChange={(e) =>
              handleVariableChange(variable.name, e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  if (!selectedNode) {
    return (
      <div className="w-80 bg-gray-800 text-white p-6 border-l border-gray-700">
        <div className="text-center text-gray-400 mt-10">
          <div className="text-lg font-medium mb-2">Properties</div>
          <div className="text-sm">
            Selecione um nó para ver suas propriedades
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-800 text-white p-6 border-l border-gray-700 overflow-y-auto">
      <div className="mb-6">
        <div className="text-lg font-bold text-blue-400 mb-1">
          {selectedNode.data.label}
        </div>
        <div className="text-xs text-gray-400">
          ID: {selectedNode.id} | Type: {selectedNode.data.componentId}
        </div>
      </div>

      <div className="mb-6">
        <div className="text-sm font-semibold text-gray-300 mb-3 border-b border-gray-600 pb-1">
          ASSIGNMENT
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Assigned To
            </label>
            <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selecionar funcionário...</option>
              <option value="joao">João Silva</option>
              <option value="maria">Maria Santos</option>
              <option value="pedro">Pedro Costa</option>
            </select>
          </div>
        </div>
      </div>

      {selectedNode.data.configuredVariables &&
        selectedNode.data.configuredVariables.length > 0 && (
          <div className="mb-6">
            <div className="text-sm font-semibold text-gray-300 mb-3 border-b border-gray-600 pb-1">
              VARIABLES
            </div>
            <div className="space-y-4">
              {selectedNode.data.configuredVariables.map(
                (variable: any, index: number) => (
                  <div key={index} className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-medium text-gray-300">
                        {variable.name}
                        {variable.required && (
                          <span className="text-red-400 ml-1">*</span>
                        )}
                      </label>
                      <span className="text-xs text-gray-500 uppercase">
                        {variable.type}
                      </span>
                    </div>
                    {renderVariableInput(variable)}
                  </div>
                )
              )}
            </div>
          </div>
        )}

      <div className="mt-8">
        <div className="text-sm font-semibold text-gray-300 mb-3 border-b border-gray-600 pb-1">
          DEBUG INFO
        </div>
        <div className="text-xs text-gray-500 bg-gray-900 p-3 rounded-lg">
          <div>
            Position: ({Math.round(selectedNode.position.x)},{" "}
            {Math.round(selectedNode.position.y)})
          </div>
          <div>
            Variables: {selectedNode.data.configuredVariables?.length || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

function FlowComponent() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [customComponents, setCustomComponents] = useState(DraggableComponents);
  const { screenToFlowPosition } = useReactFlow();

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
          type: "default", // Usar o tipo customizado
          position,
          data: {
            label: componentData.label,
            componentId: componentData.id,
            configuredVariables: [...componentData.variables],
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
          className="bg-gray-900" // Fundo escuro como Blueprint
        >
          <Controls />
          <Background color="#333" gap={20} />
        </ReactFlow>
      </div>

      <PropertiesPanel
        selectedNode={selectedNode}
        onUpdateNode={onUpdateNode}
      />

      <NodeCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => {}}
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
