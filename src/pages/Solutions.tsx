import { useState, useMemo } from 'react';
import { Search, Filter, Rocket } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import solucoesData from '../data/solucoes.json';
import type { Solucao } from '../types';

export default function Solutions() {
  const [search, setSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState('Todas');

  const areas = useMemo(() => {
    const set = new Set((solucoesData as Solucao[]).map(s => s.area));
    return ['Todas', ...Array.from(set)];
  }, []);

  const filtered = (solucoesData as Solucao[]).filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                         s.description.toLowerCase().includes(search.toLowerCase());
    const matchesArea = selectedArea === 'Todas' || s.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <div className="py-12 border-b border-slate-200 dark:border-slate-800 mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Rocket className="text-primary-600 w-8 h-8" />
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Soluções Oficiais</h1>
        </div>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          Ferramentas completas de alta performance desenvolvidas internamente pelo time CaaS Contábil.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <aside className="lg:w-64 space-y-8 flex-shrink-0">
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400">Buscar</h4>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Nome ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500 transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 font-mono">Área de Atuação</h4>
            <div className="flex flex-col gap-1">
              {areas.map(area => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedArea === area 
                    ? "bg-primary-600 text-white shadow-md shadow-primary-500/20" 
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-grow">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(item => (
                <ProductCard key={item.id} item={item} type="solucao" />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400 font-medium">Nenhuma solução encontrada com estes filtros.</p>
              <button 
                onClick={() => {setSearch(''); setSelectedArea('Todas');}}
                className="mt-4 text-primary-600 font-bold hover:underline"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
