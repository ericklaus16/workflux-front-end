import { Handle, Position } from "@xyflow/react";

const CustomBlueprintNode = ({ data, id }: { data: any; id: string }) => {
  // Função para obter a cor do header
  const getHeaderColor = (colorClass: string): string => {
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

    return colorMap[colorClass] || "#ef4444";
  };

  // Verificar se é o nó inicial
  const isStartNode =
    id === "1" ||
    data.nome?.toLowerCase() === "início" ||
    data.nome?.toLowerCase() === "inicio" ||
    data.nome?.toLowerCase() === "start";

  return (
    <div className="bg-gray-800 border-2 border-gray-600 rounded-lg min-w-[200px] shadow-lg">
      {/* Header com handles de execução (flow) */}
      <div
        className="text-white px-4 py-2 rounded-t-lg text-sm font-medium relative"
        style={{ backgroundColor: getHeaderColor(data.cor || "bg-red-500") }}
      >
        {/* EXECUTION HANDLE - Entrada (esquerda, superior) */}
        {/* Não mostra para o nó inicial */}
        {!isStartNode && (
          <Handle
            type="target"
            position={Position.Left}
            id="exec-in"
            style={{
              top: "50%",
              left: -8,
              background: "#ffffff",
              width: 14,
              height: 14,
              border: "2px solid #1e293b",
              borderRadius: "2px",
            }}
            className="cursor-pointer hover:bg-gray-200"
          />
        )}

        <div className="text-center">{data.nome}</div>

        {/* EXECUTION HANDLE - Saída (direita, superior) */}
        <Handle
          type="source"
          position={Position.Right}
          id="exec-out"
          style={{
            top: "50%",
            right: -8,
            background: "#ffffff",
            width: 14,
            height: 14,
            border: "2px solid #1e293b",
            borderRadius: "2px",
          }}
          className="cursor-pointer hover:bg-gray-200"
        />
      </div>

      {/* Body com variáveis */}
      <div className="p-3">
        {data.configuredVariables && data.configuredVariables.length > 0 ? (
          <div className="space-y-3">
            {data.configuredVariables.map((variable: any, index: number) => {
              // Cores baseadas no tipo de variável (como na Unreal)
              const getTypeColor = (type: string) => {
                const colors: { [key: string]: string } = {
                  string: "#ec4899", // Rosa
                  number: "#22c55e", // Verde
                  boolean: "#ef4444", // Vermelho
                  datetime: "#a855f7", // Roxo
                  array: "#14b8a6", // Teal
                  object: "#3b82f6", // Azul
                };
                return colors[type.toLowerCase()] || "#6b7280";
              };

              const typeColor = getTypeColor(variable.type);

              return (
                <div key={index} className="relative">
                  {/* Container da variável */}
                  <div className="flex items-center justify-between bg-gray-900/50 rounded px-2 py-1.5">
                    {/* Handle de ENTRADA da variável (esquerda) */}
                    <Handle
                      type="target"
                      position={Position.Left}
                      id={`var-${variable.name}-in`}
                      style={{
                        left: -8,
                        background: typeColor,
                        width: 12,
                        height: 12,
                        border: "2px solid white",
                        borderRadius: "50%", // Círculo para data
                      }}
                      className="cursor-pointer hover:scale-110 transition-transform"
                    />

                    {/* Nome da variável */}
                    <div className="flex-1 px-2">
                      <span className="text-white text-xs font-medium">
                        {variable.name}
                        {variable.required && (
                          <span className="text-red-400 ml-1">*</span>
                        )}
                      </span>
                    </div>

                    {/* Tipo da variável */}
                    <span
                      className="text-xs uppercase font-mono px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${typeColor}20`,
                        color: typeColor,
                      }}
                    >
                      {variable.type}
                    </span>

                    {/* Handle de SAÍDA da variável (direita) */}
                    <Handle
                      type="source"
                      position={Position.Right}
                      id={`var-${variable.name}-out`}
                      style={{
                        right: -8,
                        background: typeColor,
                        width: 12,
                        height: 12,
                        border: "2px solid white",
                        borderRadius: "50%", // Círculo para data
                      }}
                      className="cursor-pointer hover:scale-110 transition-transform"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-2">
            <span className="text-gray-400 text-xs">Sem variáveis</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomBlueprintNode;
