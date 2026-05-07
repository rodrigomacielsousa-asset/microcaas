import { motion } from 'motion/react';
import { ArrowRight, Box, Rocket, ShieldCheck, Zap, Users, Globe, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import solucoesData from '../data/solucoes.json';
import microcaasData from '../data/microcaas.json';
import type { Solucao, MicroCaaS } from '../types';

export default function Home() {
  const featuredSolucoes = (solucoesData as Solucao[]).slice(0, 6);
  const featuredMicro = (microcaasData as MicroCaaS[]).slice(0, 4);

  return (
    <div className="space-y-32 pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-100 dark:border-indigo-800"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>O Futuro da Contabilidade é Modular</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl lg:text-7xl font-bold leading-[1.1] text-slate-900 dark:text-white"
            >
              Hub de <span className="text-indigo-600">Soluções</span> Contábeis
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto"
            >
              Explore o ecossistema de <strong>MicroCaaS</strong>: ferramentas modulares focadas em dores reais. Simples, rápido, essencial.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
            >
              <Link 
                to="/solucoes" 
                className="btn-primary px-8 py-3.5 text-base shadow-lg shadow-indigo-100"
              >
                Ver Soluções Oficiais
              </Link>
              <Link 
                to="/microcaas" 
                className="w-full sm:w-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white px-8 py-3.5 rounded-full text-base font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Marketplace da Comunidade
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Explicação Institucional */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
              O que é CaaS e MicroCaaS?
            </h2>
            <div className="space-y-6 text-slate-600 dark:text-slate-400 text-lg">
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">CaaS Contábil</h4>
                  <p className="text-base">Accounting as a Service. Não é apenas software, é uma plataforma de apoio à gestão onde a contabilidade é o cerne da inteligência financeira.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">MicroCaaS</h4>
                  <p className="text-base">São microsoluções modulares. Em vez de contratar um ERP gigante e complexo, você resolve uma dor específica: um simulador de reforma, um portal de documentos ou uma automação fiscal de entrada.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div>
                <h4 className="text-4xl font-bold text-indigo-600 mb-2">100%</h4>
                <p className="text-sm text-slate-500 font-medium">Cloud Native</p>
              </div>
              <div>
                <h4 className="text-4xl font-bold text-indigo-500 mb-2">+30</h4>
                <p className="text-sm text-slate-500 font-medium">MicroSoluções</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-800 dark:text-white">
                <Zap className="text-indigo-600 fill-current w-5 h-5" /> Por que MicroCaaS?
              </h3>
              <ul className="space-y-4">
                {[
                  'Implementação em minutos, não meses.',
                  'Preço modular: pague só pelo que usar.',
                  'Foco em uma dor real (One Job to be Done).',
                  'Integração via API com seu stack atual.',
                  'Inovação contínua da comunidade.'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm font-medium">
                    <CheckCircleIcon className="text-indigo-500 w-5 h-5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <p className="text-sm italic text-slate-500 dark:text-slate-400">
                  "O MicroCaaS descentraliza a inovação. Qualquer contador com uma boa ideia pode criar uma solução e escalar no nosso ecossistema."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Soluções Oficiais */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">Soluções Oficiais CaaS Contábil</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">Nossas soluções proprietárias de alta robustez e confiabilidade.</p>
            </div>
            <Link to="/solucoes" className="text-primary-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Ver todas <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredSolucoes.map((item) => (
              <ProductCard key={item.id} item={item} type="solucao" />
            ))}
          </div>
        </div>
      </section>

      {/* MicroCaaS Destaques */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">Marketplace MicroCaaS</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Micro-apps da comunidade e soluções inspiradas em tendências globais para dores específicas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMicro.map((item) => (
            <ProductCard key={item.id} item={item} type="micro" />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            to="/microcaas" 
            className="inline-flex items-center gap-2 text-slate-900 dark:text-white font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-8 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            Explorar Catálogo Completo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* MicroCaaS Factory CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-10 lg:p-16 text-white relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 group">
          <div className="relative z-10 flex-1 space-y-6 text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">MicroCaaS Factory</h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0">
              Transforme sua expertise em produto. Nós entregamos tudo pronto: domínio, GitHub, Firebase e deploy em menos de 15 dias.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <Link to="/microcaas-factory" className="btn-primary py-3.5 px-8">
                Falar com Especialista
              </Link>
              <Link to="/docs" className="bg-slate-800 text-white px-8 py-3.5 rounded-full font-bold hover:bg-slate-700 transition-colors border border-slate-700">
                Ver Manifesto
              </Link>
            </div>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="bg-indigo-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-2xl">
              <Rocket className="w-12 h-12 mb-4 text-white" />
              <div className="text-xl font-bold">Ideia → Produto</div>
              <div className="text-xs text-indigo-200 mt-1 uppercase tracking-widest font-bold">Time-to-Market: 15 dias</div>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-indigo-600/20 to-transparent pointer-events-none" />
        </div>
      </section>
    </div>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
