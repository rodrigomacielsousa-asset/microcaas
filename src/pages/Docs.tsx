import { FileJson, Shield, CheckCircle, Code, Box, Database, Lock } from 'lucide-react';

export default function Docs() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
      <div className="py-16 text-center">
        <h1 className="text-4xl lg:text-6xl font-bold mb-6">Documentação do Ecossistema</h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto">
          Tudo o que você precisa saber sobre o padrão MicroCaaS e como integrar suas soluções ao nosso hub.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <aside className="lg:col-span-3 space-y-4 sticky top-24 h-fit">
          <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-6">Navegação</h4>
          {['Manifesto MicroCaaS', 'Padrões Técnicos', 'Arquitetura de Dados', 'Homologação', 'Segurança'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="block text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors text-sm font-medium">
              {item}
            </a>
          ))}
        </aside>

        <div className="lg:col-span-9 space-y-24">
          {/* Manifesto */}
          <section id="manifesto-microcaas" className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Box className="text-primary-600" /> Manifesto MicroCaaS
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              <p>O conceito de <strong>MicroCaaS</strong> nasceu da necessidade de fragmentar softwares contábeis complexos em ferramentas modulares e focadas em resultados imediatos.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 not-prose">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Simplicidade Extrema</h4>
                  <p className="text-sm">Cada MicroCaaS deve resolver exatamente UM problema (One Job to be Done).</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Interoperabilidade</h4>
                  <p className="text-sm">Deve ser fácil de entrar e sair. Dados devem ser portáveis via padrões abertos (JSON/CSV).</p>
                </div>
              </div>
            </div>
          </section>

          {/* Arquitetura de Dados */}
          <section id="arquitetura-de-dados" className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Database className="text-primary-600" /> Arquitetura de Dados
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              O arquivo <code>microcaas.manifest.json</code> é a certidão de nascimento de qualquer solução no nosso hub.
            </p>
            <div className="bg-slate-900 rounded-3xl p-8 overflow-hidden relative">
              <div className="absolute top-4 right-4 flex gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <pre className="text-emerald-400 font-mono text-sm leading-relaxed overflow-x-auto">
{`{
  "name": "Nome do Produto",
  "slug": "url-amigavel",
  "area": "Fiscal | Contábil | Financeiro",
  "version": "1.0.0",
  "description": "Explicação curta",
  "features": ["Func 1", "Func 2"],
  "pricingModel": "SaaS / Freemium",
  "requiredData": ["NCM", "CNPJ", "Competência"],
  "dataStorage": "local | firebase",
  "lastUpdated": "2026-05-01"
}`}
              </pre>
            </div>
          </section>

          {/* Homologação */}
          <section id="homologação" className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="text-primary-600" /> Homologação e Curadoria
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Qualidade UX', desc: 'Interface limpa, rápida e responsiva.' },
                { title: 'Conformidade', desc: 'Aderência às regras fiscais/contábeis.' },
                { title: 'Segurança', desc: 'Criptografia e proteção de dados LGPD.' }
              ].map(step => (
                <div key={step.title} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold mb-2">{step.title}</h4>
                  <p className="text-sm text-slate-500">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
