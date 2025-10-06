import { DraggableComponentType } from "@/app/interfaces/Node";

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

export default DraggableComponent;
