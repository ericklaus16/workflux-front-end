import { Activity } from "../interfaces/Activity";

export const getTypeColor = (type: Activity["type"]) => {
  const colors = {
    visita: "bg-purple-500",
    reuniao: "bg-orange-500",
    entrega: "bg-teal-500",
    aprovacao: "bg-blue-500",
  };
  return colors[type] || "bg-gray-500";
};

export const getPriorityColor = (priority: Activity["priority"]) => {
  const colors = {
    baixa: "text-green-600 bg-green-100",
    media: "text-yellow-600 bg-yellow-100",
    alta: "text-red-600 bg-red-100",
  };
  return colors[priority];
};

export const getStatusColor = (status: Activity["status"]) => {
  const colors = {
    pendente: "text-gray-600 bg-gray-100",
    em_progresso: "text-blue-600 bg-blue-100",
    concluida: "text-green-600 bg-green-100",
  };
  return colors[status];
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
