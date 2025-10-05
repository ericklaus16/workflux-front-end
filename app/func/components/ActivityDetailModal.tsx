import { Activity } from "@/app/interfaces/Activity";
import { Calendar, CheckCircle2, User } from "lucide-react";
import { formatDate, getPriorityColor, getTypeColor } from "../utils";

type Props = {
  selectedActivity: Activity | null;
  setSelectedActivity: React.Dispatch<React.SetStateAction<Activity | null>>;
};

export const ActivityDetailModal = ({
  selectedActivity,
  setSelectedActivity,
}: Props) => {
  if (!selectedActivity) return null;

  console.log(selectedActivity);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[100vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedActivity.title}
              </h2>
              <p className="text-gray-600">{selectedActivity.description}</p>
            </div>
            <button
              onClick={() => setSelectedActivity(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Informações Gerais */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Prioridade
                </label>
                <div className="mt-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(
                      selectedActivity.priority
                    )}`}
                  >
                    {selectedActivity.priority}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Prazo
                </label>
                <div className="flex items-center mt-1">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{formatDate(selectedActivity.dueDate)}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Atribuído por
                </label>
                <div className="flex items-center mt-1">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <span>
                    {selectedActivity
                      .atribuidoPor!.nome.split(" ")
                      .slice(0, 2)
                      .join(" ")}
                  </span>
                </div>
              </div>
            </div>

            {/* Variáveis */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Detalhes da Atividade
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid gap-3">
                  {Object.entries(selectedActivity.variables).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm font-medium text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
                        </span>
                        <span className="text-sm text-gray-900">
                          {Array.isArray(value)
                            ? value.join(", ")
                            : String(value)}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Workflow Steps */}
            {selectedActivity.workflow && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Fluxo de Trabalho
                </h3>
                <div className="space-y-3">
                  {selectedActivity.workflow.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                          step.completed
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span
                        className={`${
                          step.completed
                            ? "text-green-700 line-through"
                            : "text-gray-700"
                        }`}
                      >
                        {step.name}
                      </span>
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
              onClick={() => setSelectedActivity(null)}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Fechar
            </button>
            {selectedActivity.status !== "concluida" && (
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Marcar como Concluída
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
