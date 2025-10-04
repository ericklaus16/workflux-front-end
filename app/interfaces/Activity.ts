export interface Activity {
  id: string;
  title: string;
  description: string;
  type: "visita" | "reuniao" | "entrega" | "aprovacao";
  priority: "baixa" | "media" | "alta";
  dueDate: string;
  assignedBy: string;
  status: "pendente" | "em_progresso" | "concluida";
  variables: Record<string, any>;
  workflow?: {
    steps: Array<{
      id: string;
      name: string;
      completed: boolean;
    }>;
  };
}
