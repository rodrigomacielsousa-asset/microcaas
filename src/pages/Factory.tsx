import { Factory, Cog, Code, Rocket, CheckCircle, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MicroCaaSFactory() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-24 space-y-24">
      <section className="text-center space-y-8">
        <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-500/20">
          <Factory className="w-10 h-10" />
        </div>
        <h1 className="text-5xl lg:text-7xl font-bold font-display">MicroCaaS <br /> <span className="text-indigo-600">Factory</span></h1>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Nós transformamos seu conhecimento em uma solução contábil modular. Você entra com o "know-how" e nós entregamos o "software-as-a-service".
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div className="space-y-12">
          <h2 className="text-3xl font-bold">O que entregamos:</h2>
          <div className="space-y-8">
            {[
              { icon: GlobeIcon, title: 'Domínio e SSL', desc: 'Sua marca com domínio próprio pronto para produção.' },
              { icon: Code, title: 'Código Fonte (Vite/React)', desc: 'Repositório GitHub privado e clean code.' },
              { icon: DatabaseIcon, title: 'Infraestrutura Firebase', desc: 'Autenticação e banco de dados NoSQL escalável.' },
              { icon: ZapIcon, title: 'Deploy Automatizado', desc: 'CI/CD configurado para atualizações em segundos.' }
            ].map(item => (
              <div key={item.title} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-indigo-600">
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold mb-1">{item.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-white p-10 rounded-[3rem] space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px]" />
          <h2 className="text-3xl font-bold relative z-10">O Fluxo de Produção</h2>
          <div className="space-y-6 relative z-10">
            {[
              '1. Reunião de escopo (A Dor)',
              '2. Prototipação da Lógica',
              '3. Desenvolvimento do MicroCaaS',
              '4. Homologação CaaS Contábil',
              '5. Publicação no Marketplace'
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-4 text-slate-300">
                <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-xs font-bold text-indigo-400">{i + 1}</div>
                <span className="font-medium">{step}</span>
              </div>
            ))}
          </div>

          <div className="pt-6 relative z-10">
            <Link to="/sobre#contato" className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95">
              Solicitar Orçamento
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.6 9h16.8M3.6 15h16.8" />
    </svg>
  );
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7M4 7c0 1.1.9-2 2-2h12a2 2 0 012 2M4 7c0-1.1.9 2 2 2h12a2 2 0 002-2" />
    </svg>
  );
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}
