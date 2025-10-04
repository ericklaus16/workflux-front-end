import { useUser } from "@/app/context/User";
import {
  LogOut,
  Settings,
  UserCheck,
  Users,
  Workflow,
  Zap,
} from "lucide-react";
import Link from "next/link";

type Props = {
  activeTab: "assignments" | "create";
  setActiveTab: React.Dispatch<React.SetStateAction<"assignments" | "create">>;
};

function AdminHeader({ activeTab, setActiveTab }: Props) {
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="text-white" size={20} />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Workflux
            </span>
            <p className="text-xs text-gray-500">Painel do Administrador</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        <button
          onClick={() => setActiveTab("assignments")}
          className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
            activeTab === "assignments"
              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <UserCheck className="w-5 h-5 mr-3" />
          Atribuições
        </button>

        <Link href="/work_creation">
          <button
            onClick={() => setActiveTab("create")}
            className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
              activeTab === "create"
                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Workflow className="w-5 h-5 mr-3" />
            Criar Fluxos
          </button>
        </Link>

        <button className="w-full flex items-center px-3 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
          <Users className="w-5 h-5 mr-3" />
          Funcionários
        </button>

        <button className="w-full flex items-center px-3 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
          <Settings className="w-5 h-5 mr-3" />
          Configurações
        </button>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.nome[0]}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {user?.nome.split(" ").slice(0, 2).join(" ")}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <Link
            href="/"
            onClick={() => {
              handleLogout();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <LogOut size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
