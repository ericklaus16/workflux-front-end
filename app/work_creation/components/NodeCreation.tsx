"use client";

import React, { useState } from "react";
import { X, Plus, Trash2, Save } from "lucide-react";
import axios from "axios";

interface Variable {
  id: string;
  name: string;
  type: "string" | "number" | "date" | "datetime" | "select" | "array";
  required: boolean;
  options?: string[];
}

interface NodeCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nodeData: any) => void;
}

export default function NodeCreationModal({
  isOpen,
  onClose,
  onSave,
}: NodeCreationProps) {
  const [nodeData, setNodeData] = useState({
    name: "",
    description: "",
    color: "bg-blue-500",
    variables: [] as Variable[],
  });

  const [newVariableName, setNewVariableName] = useState("");
  const [newVariableType, setNewVariableType] =
    useState<Variable["type"]>("string");
  const [newVariableRequired, setNewVariableRequired] = useState(true);
  const [newVariableOptions, setNewVariableOptions] = useState("");

  const colors = [
    { name: "Azul", value: "bg-blue-500" },
    { name: "Roxo", value: "bg-purple-500" },
    { name: "Verde", value: "bg-green-500" },
    { name: "Laranja", value: "bg-orange-500" },
    { name: "Vermelho", value: "bg-red-500" },
    { name: "Teal", value: "bg-teal-500" },
    { name: "Indigo", value: "bg-indigo-500" },
    { name: "Rosa", value: "bg-pink-500" },
  ];

  const variableTypes = [
    { value: "string", label: "Texto" },
    { value: "number", label: "Número" },
    { value: "date", label: "Data" },
    { value: "datetime", label: "Data e Hora" },
    { value: "select", label: "Seleção" },
    { value: "array", label: "Lista" },
  ];

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addVariable = () => {
    if (!newVariableName.trim()) return;

    const newVariable: Variable = {
      id: generateId(),
      name: newVariableName.trim(),
      type: newVariableType,
      required: newVariableRequired,
      ...(newVariableType === "select" && newVariableOptions
        ? { options: newVariableOptions.split(",").map((opt) => opt.trim()) }
        : {}),
    };

    setNodeData((prev) => ({
      ...prev,
      variables: [...prev.variables, newVariable],
    }));

    // Reset form
    setNewVariableName("");
    setNewVariableType("string");
    setNewVariableRequired(true);
    setNewVariableOptions("");
  };

  const removeVariable = (variableId: string) => {
    setNodeData((prev) => ({
      ...prev,
      variables: prev.variables.filter((v) => v.id !== variableId),
    }));
  };

  const updateVariable = (variableId: string, field: string, value: any) => {
    setNodeData((prev) => ({
      ...prev,
      variables: prev.variables.map((v) =>
        v.id === variableId ? { ...v, [field]: value } : v
      ),
    }));
  };

  const handleSave = () => {
    const componentData = {
      nome: nodeData.name,
      tipo: "default",
      cor: nodeData.color,
      descricao: nodeData.description,
      variaveis: nodeData.variables.map((v) => ({
        name: v.name,
        type: v.type,
        value: null,
        required: v.required,
        ...(v.options ? { options: v.options } : {}),
      })),
      usuarioId: "57009c51-1d98-49d1-a501-d6fea5cd7159",
    };

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/nodes`;

    axios.post(apiUrl, {
      nome: nodeData.name,
      tipo: "default",
      cor: nodeData.color,
      descricao: nodeData.description,
      variaveis: nodeData.variables.map((v) => ({
        name: v.name,
        type: v.type,
        value: null,
        required: v.required,
        ...(v.options ? { options: v.options } : {}),
      })),
      usuarioId: "57009c51-1d98-49d1-a501-d6fea5cd7159",
    });

    onSave(componentData);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setNodeData({
      name: "",
      description: "",
      color: "bg-blue-500",
      variables: [],
    });
    setNewVariableName("");
    setNewVariableType("string");
    setNewVariableRequired(true);
    setNewVariableOptions("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Criar Novo Nó</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Nó *
              </label>
              <input
                type="text"
                value={nodeData.name}
                onChange={(e) =>
                  setNodeData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: Aprovação de Documento"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={nodeData.description}
                onChange={(e) =>
                  setNodeData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Descreva a função deste nó..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor do Nó
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() =>
                      setNodeData((prev) => ({ ...prev, color: color.value }))
                    }
                    className={`${
                      color.value
                    } text-white px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      nodeData.color === color.value
                        ? "ring-2 ring-offset-2 ring-gray-900"
                        : "hover:opacity-80"
                    }`}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Variáveis ({nodeData.variables.length})
              </label>

              {nodeData.variables.length > 0 && (
                <div className="space-y-3 mb-4">
                  {nodeData.variables.map((variable) => (
                    <div
                      key={variable.id}
                      className="bg-gray-50 p-4 rounded-lg border"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Nome
                            </label>
                            <input
                              type="text"
                              value={variable.name}
                              onChange={(e) =>
                                updateVariable(
                                  variable.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Tipo
                            </label>
                            <select
                              value={variable.type}
                              onChange={(e) =>
                                updateVariable(
                                  variable.id,
                                  "type",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                            >
                              {variableTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center space-x-2">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={variable.required}
                                onChange={(e) =>
                                  updateVariable(
                                    variable.id,
                                    "required",
                                    e.target.checked
                                  )
                                }
                                className="mr-1"
                              />
                              <span className="text-xs text-gray-600">
                                Obrigatório
                              </span>
                            </label>
                          </div>
                        </div>

                        <button
                          onClick={() => removeVariable(variable.id)}
                          className="ml-3 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {variable.type === "select" && (
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Opções (separadas por vírgula)
                          </label>
                          <input
                            type="text"
                            value={variable.options?.join(", ") || ""}
                            onChange={(e) =>
                              updateVariable(
                                variable.id,
                                "options",
                                e.target.value
                                  .split(",")
                                  .map((opt) => opt.trim())
                              )
                            }
                            placeholder="Ex: Baixa, Média, Alta"
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Adicionar Nova Variável */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Adicionar Variável
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <input
                      type="text"
                      value={newVariableName}
                      onChange={(e) => setNewVariableName(e.target.value)}
                      placeholder="Nome da variável"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <select
                      value={newVariableType}
                      onChange={(e) =>
                        setNewVariableType(e.target.value as Variable["type"])
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {variableTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {newVariableType === "select" && (
                  <div className="mb-3">
                    <input
                      type="text"
                      value={newVariableOptions}
                      onChange={(e) => setNewVariableOptions(e.target.value)}
                      placeholder="Opções separadas por vírgula (Ex: Sim, Não, Talvez)"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newVariableRequired}
                      onChange={(e) => setNewVariableRequired(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">
                      Campo obrigatório
                    </span>
                  </label>

                  <button
                    onClick={addVariable}
                    disabled={!newVariableName.trim()}
                    className="bg-blue-600 text-white px-4 py-2  rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Save size={16} className="mr-2" />
            Salvar Componente
          </button>
        </div>
      </div>
    </div>
  );
}
