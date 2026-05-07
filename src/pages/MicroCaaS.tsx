import { useState, useMemo } from 'react';
import { Search, Box, Grid3X3, Filter, ShieldCheck, Zap, Globe, Sparkles, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import microcaasData from '../data/microcaas.json';
import bundlesData from '../data/bundles.json';
import type { Product, PricingModel, Bundle } from '../types';

export default function MicroCaaSPage() {
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('Todas');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedPricing, setSelectedPricing] = useState('Todos');

  const areas = useMemo(() => {
    const set = new Set((microcaasData as Product[]).map(s => s.area));
    return ['Todas', ...Array.from(set)];
  }, []);

  const statuses = ['Todos', 'Beta', 'Em breve', 'Ativo'];
  const pricingModels = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Gratuito', value: 'free' },
    { label: 'Pago (Único)', value: 'one_time' },
    { label: 'Assinatura', value: 'subscription' }
  ];

  const filtered = (microcaasData as Product[]).filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                         s.description.toLowerCase().includes(search.toLowerCase());
    const matchesArea = selectedArea === 'Todas' || s.area === selectedArea;
    const matchesStatus = selectedStatus === 'Todos' || s.statusBadge === selectedStatus;
    const matchesPricing = selectedPricing === 'Todos' || s.pricingModel === selectedPricing;
    return matchesSearch && matchesArea && matchesStatus && matchesPricing;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      {/* Ecosystem Header */}
      <div className="py-16 border-b border-slate-200 dark:border-slate-800 mb-12">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">Marketplace da Comunidade</h1>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              O ecossistema em constante evolução. Aqui, cada MicroCaaS é uma solução independente criada por e para contadores.
              <span className="block mt-4 text-sm font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1 rounded-full w-fit">
                Novas soluções adicionadas semanalmente
              </span>
            </p>
          </div>
          <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm gap-8">
            <div className="flex flex-col text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Integrado</span>
              <span className="text-2xl font-bold text-indigo-600">37+</span>
            </div>
            <div className="w-px h-full bg-slate-200 dark:bg-slate-800" />
            <div className="flex flex-col text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Usuários</span>
              <span className="text-2xl font-bold text-indigo-600">850+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Bundles */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Package className="w-6 h-6 text-indigo-600" /> Pacotes Econômicos (Combo)
            </h2>
            <p className="text-slate-500 text-sm">Economize até 30% comprando kits de soluções complementares.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {(bundlesData as Bundle[]).map(bundle => (
            <div key={bundle.slug} className="group bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800/50 dark:to-slate-900 border border-indigo-100 dark:border-slate-800 p-8 rounded-[2.5rem] flex flex-col gap-8 transition-all hover:border-indigo-300 dark:hover:border-indigo-600 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-3xl shadow-sm border border-indigo-50 dark:border-slate-700 relative z-10">
                {bundle.name.substring(0, 1).toUpperCase()}
              </div>
              <div className="flex-grow relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">Combo Econômico</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">Salva 20-30%</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{bundle.name}</h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">{bundle.description}</p>
                <Link to={`/bundle/${bundle.slug}`} className="text-indigo-600 font-bold text-xs inline-flex items-center gap-1 hover:underline">
                  Ver detalhes <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-indigo-50 dark:border-slate-800 relative z-10 mt-auto">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Apenas</div>
                  <div className="text-xl font-black text-slate-900 dark:text-white">{bundle.priceLabel}</div>
                </div>
                <Link to={`/bundle/${bundle.slug}`} className="btn-primary py-2.5 px-6 text-xs bg-indigo-600 hover:bg-indigo-700">Explorar Pack</Link>
              </div>
            </div>
          ))}

          {/* Featured Product: Nexus DF */}
          {microcaasData.find(p => p.id === 'nexus-df') && (
            <div className="group bg-gradient-to-br from-indigo-600 to-indigo-900 border border-indigo-500 p-8 rounded-[2.5rem] flex flex-col gap-8 transition-all hover:scale-[1.02] shadow-xl relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl animate-pulse" />
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white font-bold text-3xl border border-white/20 relative z-10">
                N
              </div>
              <div className="flex-grow relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm">Lançamento</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded backdrop-blur-sm border border-amber-400/30 font-black">Nexus DF</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Nexus DF — Demonstrações Financeiras</h3>
                <p className="text-indigo-100 text-sm mb-6 line-clamp-3">Pipeline automático CPC PME/Full: Balancete → BP, DRE, DRA, DMPL, DFC + Notas Editáveis.</p>
                <Link to="/app/nexus-df" className="text-amber-300 font-bold text-xs inline-flex items-center gap-1 hover:underline">
                  Abrir Nexus <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/10 relative z-10 mt-auto">
                <div>
                  <div className="text-[10px] text-indigo-300 uppercase font-bold tracking-widest">Investimento</div>
                  <div className="text-xl font-black text-white">R$ 497,00</div>
                </div>
                <Link to="/app/nexus-df" className="px-6 py-2.5 rounded-xl bg-white text-indigo-600 font-black text-xs hover:bg-slate-50 transition-all shadow-lg shadow-indigo-900/20">Acessar Grátis</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 space-y-10 flex-shrink-0">
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Search className="w-3 h-3" /> Buscar
            </h4>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Nome ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all text-sm outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Monetização
            </h4>
            <div className="flex flex-wrap lg:flex-col gap-1.5">
              {pricingModels.map(model => (
                <button
                  key={model.value}
                  onClick={() => setSelectedPricing(model.value)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedPricing === model.value 
                    ? "bg-indigo-600 text-white shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {model.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> Status
            </h4>
            <div className="flex flex-wrap lg:flex-col gap-1.5">
              {statuses.map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedStatus === status 
                    ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-sm" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t dark:border-slate-800 pt-8">
            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Globe className="w-3 h-3" /> Categorias
            </h4>
            <div className="flex flex-wrap lg:flex-col gap-1">
              {areas.map(area => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedArea === area 
                    ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(item => (
                <ProductCard key={item.id} item={item} type="micro" />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-slate-100/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <Box className="w-16 h-16 text-slate-300 mx-auto mb-6" />
              <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300 mb-2">Nenhuma solução encontrada</h3>
              <p className="text-slate-400 max-w-sm mx-auto">Tente redefinir seus filtros ou buscar por algo diferente. O ecossistema está em constante expansão!</p>
              <button 
                onClick={() => {
                  setSearch('');
                  setSelectedArea('Todas');
                  setSelectedStatus('Todos');
                  setSelectedPricing('Todos');
                }}
                className="mt-6 text-indigo-600 font-bold hover:underline"
              >
                Limpar todos os filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
