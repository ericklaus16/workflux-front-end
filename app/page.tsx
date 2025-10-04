"use client";

import React, { useCallback, useRef } from "react";
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

const DraggableComponents = [
  { id: "input", label: "Input", type: "input", color: "bg-blue-500" },
  { id: "process", label: "Process", type: "default", color: "bg-green-500" },
  { id: "output", label: "Output", type: "output", color: "bg-red-500" },
];

const DraggableComponent = ({
  component,
}: {
  component: (typeof DraggableComponents)[0];
}) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={`${component.color} text-white p-4 rounded-lg cursor-grab active:cursor-grabbing shadow-lg hover:shadow-xl transition-shadow`}
      onDragStart={(event) => onDragStart(event, component.type)}
      draggable
    >
      <div className="text-center font-medium">{component.label}</div>
    </div>
  );
};

const initialNodes: Node[] = [
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

function FlowComponent() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-lg p-6 border-r">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Componentes</h2>
        <div className="space-y-4">
          {DraggableComponents.map((component) => (
            <DraggableComponent key={component.id} component={component} />
          ))}
        </div>
        <div className="mt-6 text-sm text-gray-600">
          <p>
            Arraste os componentes para o workflow ao lado para criar seu fluxo.
          </p>
        </div>
      </div>

      <div className="flex-1" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
          className="bg-gray-50"
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
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
