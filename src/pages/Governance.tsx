import { Shield, CheckCircle, Scale, FileText, Lock, Eye } from 'lucide-react';

export default function Governance() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 space-y-24">
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-bold">Governança e QA</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Como garantimos a segurança, qualidade e conformidade de cada MicroCaaS publicado no nosso ecossistema.
        </p>
      </section>

      <div className="space-y-16">
        <section className="space-y-8">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="text-primary-600" /> Selo de Homologação CaaS
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Nenhuma solução entra no catálogo sem passar por nossa bateria de testes que avalia:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { t: 'Teste de Stress Fiscal', d: 'Validamos cálculos com massas de dados reais de diversos regimes.' },
              { t: 'Auditoria de Segurança', d: 'Pentest básico para garantir que dados dos clientes estão blindados.' },
              { t: 'Conformidade LGPD', d: 'Verificamos o tratamento de dados sensíveis e anonimização.' },
              { t: 'Padrão UI/UX', d: 'Garantimos que a ferramenta seja intuitiva e não exija treinamentos longos.' }
            ].map(item => (
              <div key={item.t} className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> {item.t}
                </h4>
                <p className="text-sm text-slate-500">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Scale className="text-primary-600" /> Ética e Responsabilidade
          </h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p>O ecossistema CaaS Contábil preza pela transparência. Desenvolvedores de MicroCaaS da comunidade assinam um termo de responsabilidade técnica sobre os cálculos gerados por suas ferramentas.</p>
            <p>Reservamo-nos o direito de remover qualquer solução que não cumpra com os requisitos mínimos de atualização frente à mudanças na legislação brasileira (especialmente durante o período de transição da Reforma Tributária).</p>
          </div>
        </section>

        <section className="bg-primary-600 text-white rounded-[2rem] p-12 text-center space-y-6">
          <Eye className="w-12 h-12 mx-auto" />
          <h3 className="text-2xl font-bold">Transparência em Primeiro Lugar</h3>
          <p className="text-primary-100 max-w-xl mx-auto">
            Qualquer usuário pode reportar inconsistências em uma ferramenta. Nossa equipe de QA técnica revisa denúncias em até 48h úteis.
          </p>
          <button className="bg-white text-primary-600 px-8 py-3 rounded-xl font-bold">
            Reportar Inconsistência
          </button>
        </section>
      </div>
    </div>
  );
}
