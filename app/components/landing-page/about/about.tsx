function LandingPageAbout() {
  return (
    <section id="sobre" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Sobre o Workflux
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              O Workflux nasceu da necessidade de simplificar a gestão de
              projetos e equipes. Nossa plataforma combina a simplicidade visual
              com o poder de automação para criar uma experiência única de
              produtividade.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Com componentes arrastar-e-soltar similares ao Blueprint da Unreal
              Engine, você pode criar fluxos de trabalho complexos de forma
              intuitiva, sem necessidade de conhecimento técnico.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Experimentar Agora
            </button>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Nossa Missão
              </h3>
              <p className="text-gray-600">
                Empoderar empresas de todos os tamanhos com ferramentas visuais
                e intuitivas para otimizar seus processos e aumentar a
                produtividade da equipe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
