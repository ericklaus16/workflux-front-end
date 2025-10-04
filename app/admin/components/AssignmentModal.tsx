import { useEffect, useState } from "react";
import { ActivityTemplate, Assignment, Employee } from "../page";
import { Send } from "lucide-react";
import axios from "axios";
import { DraggableComponentType } from "@/app/interfaces/Node";

type Props = {
  showAssignModal: boolean;
  setShowAssignModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@empresa.com",
    role: "Vendedor",
    department: "Vendas",
    status: "ativo",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@empresa.com",
    role: "Analista",
    department: "Marketing",
    status: "ativo",
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro@empresa.com",
    role: "Coordenador",
    department: "Operações",
    status: "ativo",
  },
];

const AssignmentModal = ({ showAssignModal, setShowAssignModal }: Props) => {
  if (!showAssignModal) return null;

  const [assignmentForm, setAssignmentForm] = useState({
    employeeId: "",
    activityId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "media" as Assignment["priority"],
    variables: {} as Record<string, any>,
  });

  const [nodes, setNodes] = useState<DraggableComponentType[]>([]);

  useEffect(() => {
    const fetchNodes = async () => {
      const response = await axios.get<DraggableComponentType[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/nodes`
      );

      setNodes(response.data);
    };

    if (nodes.length === 0) fetchNodes();
  });

  const handleAssignmentSubmit = () => {
    console.log("Nova atribuição:", assignmentForm);
    setShowAssignModal(false);

    setAssignmentForm({
      employeeId: "",
      activityId: "",
      title: "",
      description: "",
      dueDate: "",
      priority: "media",
      variables: {},
    });
  };

  const selectedActivity = nodes.find(
    (a) => a.id === assignmentForm.activityId
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Nova Atribuição
            </h2>
            <button
              onClick={() => setShowAssignModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Funcionário */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Funcionário *
              </label>
              <select
                value={assignmentForm.employeeId}
                onChange={(e) =>
                  setAssignmentForm((prev) => ({
                    ...prev,
                    employeeId: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um funcionário</option>
                {mockEmployees
                  .filter((emp) => emp.status === "ativo")
                  .map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.role}
                    </option>
                  ))}
              </select>
            </div>

            {/* Tipo de Atividade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Atividade *
              </label>
              <select
                value={assignmentForm.activityId}
                onChange={(e) =>
                  setAssignmentForm((prev) => ({
                    ...prev,
                    activityId: e.target.value,
                    variables: {}, // Reset variables when activity changes
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione o tipo de atividade</option>
                {nodes.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.nome}{" "}
                    {activity.descricao ? `- ${activity.descricao}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Título e Descrição */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título da Tarefa *
                </label>
                <input
                  type="text"
                  value={assignmentForm.title}
                  onChange={(e) =>
                    setAssignmentForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Visita ao Cliente ABC"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prazo *
                </label>
                <input
                  type="datetime-local"
                  value={assignmentForm.dueDate}
                  onChange={(e) =>
                    setAssignmentForm((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (Opcional)
              </label>
              <textarea
                value={assignmentForm.description}
                onChange={(e) =>
                  setAssignmentForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Descrição detalhada da tarefa..."
              />
            </div>

            {/* Prioridade */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                value={assignmentForm.priority}
                onChange={(e) =>
                  setAssignmentForm((prev) => ({
                    ...prev,
                    priority: e.target.value as Assignment["priority"],
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>

            {/* Variáveis da Atividade */}
            {selectedActivity && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Configurar Variáveis
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  {selectedActivity.variaveis.map((variable) => (
                    <div key={variable.name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {variable.name.charAt(0).toUpperCase() +
                          variable.name.slice(1)}
                        {variable.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      {variable.type === "select" ? (
                        <select
                          value={assignmentForm.variables[variable.name] || ""}
                          onChange={(e) =>
                            setAssignmentForm((prev) => ({
                              ...prev,
                              variables: {
                                ...prev.variables,
                                [variable.name]: e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Selecione...</option>
                          {variable.options?.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : variable.type === "array" ? (
                        <textarea
                          value={
                            Array.isArray(
                              assignmentForm.variables[variable.name]
                            )
                              ? assignmentForm.variables[variable.name].join(
                                  ", "
                                )
                              : assignmentForm.variables[variable.name] || ""
                          }
                          onChange={(e) =>
                            setAssignmentForm((prev) => ({
                              ...prev,
                              variables: {
                                ...prev.variables,
                                [variable.name]: e.target.value
                                  .split(",")
                                  .map((item) => item.trim()),
                              },
                            }))
                          }
                          placeholder="Digite valores separados por vírgula"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          rows={2}
                        />
                      ) : (
                        <input
                          type={
                            variable.type === "date"
                              ? "date"
                              : variable.type === "number"
                              ? "number"
                              : "text"
                          }
                          value={assignmentForm.variables[variable.name] || ""}
                          onChange={(e) =>
                            setAssignmentForm((prev) => ({
                              ...prev,
                              variables: {
                                ...prev.variables,
                                [variable.name]:
                                  variable.type === "number"
                                    ? Number(e.target.value)
                                    : e.target.value,
                              },
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder={`Digite ${variable.name}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAssignModal(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleAssignmentSubmit}
              disabled={
                !assignmentForm.employeeId ||
                !assignmentForm.activityId ||
                !assignmentForm.title
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Atribuir Tarefa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;
