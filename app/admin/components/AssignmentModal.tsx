import { useEffect, useState } from "react";
import { ActivityTemplate, Assignment, Employee } from "../page";
import { Send } from "lucide-react";
import axios from "axios";
import { DraggableComponentType } from "@/app/interfaces/Node";
import { User, useUser } from "@/app/context/User";

type Props = {
  showAssignModal: boolean;
  setShowAssignModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
};

const AssignmentModal = ({
  showAssignModal,
  setShowAssignModal,
  setAssignments,
}: Props) => {
  const [assignmentForm, setAssignmentForm] = useState({
    employeeId: "",
    activityId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "media" as Assignment["priority"],
    variables: {} as Record<string, any>,
  });

  const [employees, setEmployees] = useState<User[]>([]);
  const [nodes, setNodes] = useState<DraggableComponentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  // Corrigir o useEffect com array de dependências adequado
  useEffect(() => {
    const fetchData = async () => {
      if (!showAssignModal) return; // Só busca quando o modal está aberto

      setLoading(true);
      setError(null);

      try {
        const [employeesResponse, nodesResponse] = await Promise.all([
          axios.get<User[]>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/usuarios/role/funcionario`
          ),
          axios.get<DraggableComponentType[]>(
            `${process.env.NEXT_PUBLIC_API_URL}/nodes`
          ),
        ]);

        setEmployees(employeesResponse.data);
        setNodes(nodesResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        setError("Erro ao carregar dados. Tente novamente.");
      } finally {
        console.log(employees);
        setLoading(false);
      }
    };

    fetchData();
  }, [showAssignModal]); // Dependência correta: só executa quando o modal abre/fecha

  // Reset form quando o modal fecha
  useEffect(() => {
    if (!showAssignModal) {
      setAssignmentForm({
        employeeId: "",
        activityId: "",
        title: "",
        description: "",
        dueDate: "",
        priority: "media",
        variables: {},
      });
    }
  }, [showAssignModal]);

  const handleAssignmentSubmit = async () => {
    try {
      setLoading(true);
      console.log(`${process.env.NEXT_PUBLIC_API_URL}/tarefas/`);

      // Aqui você pode fazer a requisição para salvar a atribuição
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/tarefas/`,
        {
          title: assignmentForm.title,
          priority: assignmentForm.priority,
          description: assignmentForm.description,
          dueDate: assignmentForm.dueDate,
          assignedById: user?.id,
          assignedTo: assignmentForm.employeeId,
          variables: assignmentForm.variables,
        }
      );

      const selectedEmployee = employees.find(
        (emp) => emp.id === assignmentForm.employeeId
      );

      const newAssignment: Assignment = {
        id: response.data.id,
        taskTitle: assignmentForm.title,
        employeeId: assignmentForm.employeeId,
        employeeName: selectedEmployee?.nome || "Funcionário",
        assignedBy: user?.nome || "Sistema",
        assignedAt: new Date().toISOString(),
        dueDate: assignmentForm.dueDate,
        status: "pendente",
        priority: assignmentForm.priority,
        variables: assignmentForm.variables,
      };

      // CORREÇÃO: Sintaxe correta para adicionar ao array
      setAssignments((prev) => [newAssignment, ...prev]);
      setShowAssignModal(false);
    } catch (error) {
      console.error("Erro ao criar atribuição:", error);
      setError("Erro ao criar atribuição. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const selectedActivity = nodes.find(
    (a) => a.id === assignmentForm.activityId
  );

  // Não renderizar se o modal não estiver aberto
  if (!showAssignModal) return null;

  return (
    <div className="fixed inset-0  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Nova Atribuição
            </h2>
            <button
              onClick={() => setShowAssignModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
              disabled={loading}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {loading && employees.length === 0 && nodes.length === 0 ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando dados...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-700 underline"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
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
                  disabled={loading}
                >
                  <option value="">Selecione um funcionário</option>
                  {Array.isArray(employees) &&
                    employees
                      .filter((emp) => emp.estaAtivo)
                      .map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.nome} - {employee.role}
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
                  disabled={loading}
                >
                  <option value="">Selecione o tipo de atividade</option>
                  {Array.isArray(nodes) &&
                    nodes.map((activity) => (
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
                    disabled={loading}
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
                    disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              {/* Variáveis da Atividade */}
              {selectedActivity &&
                Array.isArray(selectedActivity.variaveis) &&
                selectedActivity.variaveis.length > 0 && (
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
                              value={
                                assignmentForm.variables[variable.name] || ""
                              }
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
                              disabled={loading}
                            >
                              <option value="">Selecione...</option>
                              {Array.isArray(variable.options) &&
                                variable.options.map((option) => (
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
                                  ? assignmentForm.variables[
                                      variable.name
                                    ].join(", ")
                                  : assignmentForm.variables[variable.name] ||
                                    ""
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
                              disabled={loading}
                            />
                          ) : (
                            <input
                              type={
                                variable.type === "date"
                                  ? "date"
                                  : variable.type === "number"
                                  ? "number"
                                  : variable.type === "datetime"
                                  ? "datetime-local"
                                  : "text"
                              }
                              value={
                                assignmentForm.variables[variable.name] || ""
                              }
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
                              disabled={loading}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowAssignModal(false)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleAssignmentSubmit}
              disabled={
                loading ||
                !assignmentForm.employeeId ||
                !assignmentForm.activityId ||
                !assignmentForm.title
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? "Criando..." : "Atribuir Tarefa"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;
