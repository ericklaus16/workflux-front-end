function LandingPageContact() {
  return (
    <section id="contato" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h2>
          <p className="text-xl text-gray-600">
            Tem dúvidas? Nossa equipe está aqui para ajudar
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Envie uma mensagem
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Informações de Contato
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Email</h4>
                <p className="text-gray-600">contato@workflux.com</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Telefone</h4>
                <p className="text-gray-600">+55 (11) 9999-9999</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Endereço</h4>
                <p className="text-gray-600">São Paulo, SP - Brasil</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Horário de Atendimento
                </h4>
                <p className="text-gray-600">Segunda a Sexta, 9h às 18h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LandingPageContact;
