import React, { useState } from 'react';
import { 
  BarChart3, 
  ArrowLeft, 
  TrendingUp, 
  PieChart, 
  Target, 
  Zap, 
  FileDown, 
  RefreshCw,
  ChevronDown,
  Calendar,
  Layers,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const FORECAST_DATA = [
  { mes: 'Mai', realizado: 45000, projetado: 45000 },
  { mes: 'Jun', realizado: 0, projetado: 48500 },
  { mes: 'Jul', realizado: 0, projetado: 52000 },
  { mes: 'Ago', realizado: 0, projetado: 51200 },
  { mes: 'Set', realizado: 0, projetado: 56000 },
  { mes: 'Out', realizado: 0, projetado: 61000 },
];

const REVENUE_STREAMS = [
  { name: 'Serviços', value: 35000, color: '#4f46e5' },
  { name: 'Produtos', value: 8500, color: '#8b5cf6' },
  { name: 'Recorrência', value: 12000, color: '#10b981' },
];

export default function ForecastRelatorios() {
  const [selectedScenario, setSelectedScenario] = useState('otimista');

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <Link to="/solucoes" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-4 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-indigo-600" />
            Forecast & <span className="text-indigo-600">Estratégico</span>
          </h1>
          <p className="text-slate-500 mt-2">Visão antecipada do futuro financeiro do seu cliente. Relatórios prontos em segundos.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <FileDown className="w-5 h-5 text-indigo-600" /> Baixar PDF
          </button>
          <button className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            <Zap className="w-5 h-5" /> Atualizar Dados
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Main Forecast Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-10 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-bold dark:text-white">Fluxo de Caixa Projetado</h3>
                <p className="text-xs text-slate-400 font-medium">Projeção estimada para os próximos 6 meses</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setSelectedScenario('otimista')}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-bold transition-all",
                    selectedScenario === 'otimista' ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                  )}
                >
                  Otimista
                </button>
                <button 
                  onClick={() => setSelectedScenario('conservador')}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-bold transition-all",
                    selectedScenario === 'conservador' ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                  )}
                >
                  Conservador
                </button>
              </div>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={FORECAST_DATA}>
                  <defs>
                    <linearGradient id="colorProjetado" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="mes" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fontWeight: 600, fill: '#64748b'}}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#94a3b8'}}
                    tickFormatter={(val) => `R$ ${val/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area 
                    name="Projetado" 
                    type="monotone" 
                    dataKey="projetado" 
                    stroke="#4f46e5" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorProjetado)" 
                    dot={{r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <h4 className="font-bold mb-6 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-600" />
                Composição de Receita
              </h4>
              <div className="h-[200px] w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REVENUE_STREAMS} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" radius={[0, 10, 10, 0]} fill="#4f46e5" barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col justify-around py-4 pl-4 pointer-events-none">
                  {REVENUE_STREAMS.map(stream => (
                    <div key={stream.name} className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{stream.name}</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">R$ {(stream.value/1000).toFixed(1)}k</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                <Zap className="w-8 h-8 mb-4 opacity-50" />
                <h3 className="text-xl font-bold">Resumo Estratégico</h3>
                <p className="text-indigo-100 text-sm mt-2 leading-relaxed">
                  O ponto de equilíbrio está projetado para <span className="font-bold">22/07/2026</span>. O caixa permite investimento de até <span className="font-bold text-emerald-300">R$ 15k</span> em marketing este mês sem comprometer a operação.
                </p>
              </div>
              <div className="relative z-10 mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-indigo-300 uppercase">Burn Rate</div>
                  <div className="text-lg font-bold">R$ 5.200/mês</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-indigo-300 uppercase">Runway</div>
                  <div className="text-lg font-bold">14 Meses</div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="font-bold text-lg mb-8 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Metas do Exercício
            </h3>
            <div className="space-y-8">
              {[
                { label: 'Crescimento de Receita', progress: 72, goal: '20%', current: '+14%', color: 'bg-indigo-600' },
                { label: 'Margem de Lucro', progress: 45, goal: '30%', current: '13.5%', color: 'bg-emerald-500' },
                { label: 'EBITDA Mensal', progress: 88, goal: 'R$ 50k', current: 'R$ 44k', color: 'bg-amber-500' },
              ].map((meta, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{meta.label}</div>
                      <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Meta: {meta.goal}</div>
                    </div>
                    <div className="text-xs font-black text-indigo-600">{meta.current}</div>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${meta.progress}%` }}
                      transition={{ duration: 1, delay: i * 0.2 }}
                      className={cn("h-full rounded-full transition-all", meta.color)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border border-transparent hover:border-indigo-100 transition-all p-8">
            <h4 className="font-bold text-sm mb-6 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Cenários "What-if"
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all">
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Contratar 3 novos devs?</div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all">
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Reduzir custo fixo em 10%?</div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-all" />
              </div>
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all">
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400">Novo investimento R$ 500k?</div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-all" />
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-8 rounded-[2.5rem] flex gap-4">
            <Info className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed font-medium">
              Dados atualizados via API com o Omie ERP em 02/05 às 20:15h. Próxima sincronização em 4 horas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
