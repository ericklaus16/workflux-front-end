import { ArrowRight, Play } from "lucide-react";

function LandingPageHeroSection() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
          Transforme seu
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {" "}
            fluxo{" "}
          </span>
          de trabalho
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Crie tarefas visuais, associe funcionários e mantenha controle total
          sobre o fluxo da sua empresa com nossa plataforma intuitiva
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center">
            Começar Grátis
            <ArrowRight className="ml-2" size={20} />
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors flex items-center">
            <Play className="mr-2" size={20} />
            Ver Demo
          </button>
        </div>
      </div>
    </section>
  );
}

export default LandingPageHeroSection;
