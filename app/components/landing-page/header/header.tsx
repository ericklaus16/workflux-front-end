import { Menu, X, Zap } from "lucide-react";
import { useState } from "react";

function LandingPageHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="text-white" size={20} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Workflux
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#sobre"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sobre
            </a>
            <a
              href="#recursos"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Recursos
            </a>
            <a
              href="#contato"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contato
            </a>
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              Entrar
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Começar Grátis
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <a href="#sobre" className="text-gray-600 hover:text-gray-900">
                Sobre
              </a>
              <a href="#recursos" className="text-gray-600 hover:text-gray-900">
                Recursos
              </a>
              <a href="#contato" className="text-gray-600 hover:text-gray-900">
                Contato
              </a>
              <button className="text-left text-gray-600 hover:text-gray-900">
                Entrar
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-left">
                Começar Grátis
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default LandingPageHeader;
