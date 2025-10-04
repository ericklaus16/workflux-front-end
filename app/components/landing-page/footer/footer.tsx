import { Zap } from "lucide-react";

function LandingPageFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold">Workflux</span>
          </div>
          <div className="text-gray-400 text-center md:text-right">
            <p>&copy; 2024 Workflux. Todos os direitos reservados.</p>
            <p className="text-sm mt-1">
              Transformando empresas através da automação visual
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default LandingPageFooter;
