import React, { useState } from 'react';
import { 
  BarChart3, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  FileText, 
  Users, 
  Clock, 
  Search, 
  Plus,
  ArrowRight,
  TrendingDown,
  ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const ACCOUNTS_PAYABLE = [
  { id: 1, title: 'Aluguel - Escritório Central', category: 'Infraestrutura', due: '05/05/2026', amount: 8500.00, status: 'Aguardando Aprovação', author: 'Cássio A.' },
  { id: 2, title: 'Amazon AWS - Cloud', category: 'Tecnologia', due: '10/05/2026', amount: 1250.40, status: 'Aprovado', author: 'Diego S.' },
  { id: 3, title: 'Papelaria & Insumos', category: 'Administrativo', due: '02/05/2026', amount: 320.15, status: 'Vencido', author: 'Ana B.' },
];

export default function APInteligente() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <Link to="/solucoes" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-4 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-indigo-600" />
            AP <span className="text-indigo-600">Inteligente</span>
          </h1>
          <p className="text-slate-500 mt-2">Gestão de contas a pagar com fluxos de aprovação e centros de custo.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">
            <Plus className="w-5 h-5" /> Novo Lançamento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total a Pagar (Mês)</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white">R$ 124.500,00</div>
            <div className="flex items-center gap-1 text-[10px] font-bold text-rose-500 mt-2">
              <TrendingDown className="w-3 h-3" /> +12% vs mês anterior
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 dark:bg-slate-800/50 rounded-full -mr-16 -mt-16" />
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Aprovar agora</div>
          <div className="text-3xl font-black text-amber-500">8 Pendentes</div>
          <div className="text-[10px] font-bold text-slate-400 mt-2 italic">Valor total em aberto: R$ 15.200,00</div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-1">Centro de Custo Top</div>
            <div className="text-3xl font-black">Pessoas & Folha</div>
            <div className="text-[10px] text-slate-400 mt-2 uppercase font-bold tracking-widest">62% do orçamento total</div>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full -mr-16 -mb-16" />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20">Todos</button>
            <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors">Aprovar</button>
            <button className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors">Vencidos</button>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar favorecido ou categoria..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="p-8">Favorecido / Título</th>
                <th className="p-8">Categoria</th>
                <th className="p-8">Data Venc.</th>
                <th className="p-8 text-right">Valor</th>
                <th className="p-8 text-center">Status</th>
                <th className="p-8 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ACCOUNTS_PAYABLE.map((item) => (
                <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white leading-tight">{item.title}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Soliciado por: {item.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{item.category}</span>
                  </td>
                  <td className="p-8">
                    <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.due}</div>
                  </td>
                  <td className="p-8 text-right font-black text-slate-900 dark:text-white">
                    {item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="p-8 text-center">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-bold",
                      item.status === 'Aprovado' ? "bg-emerald-100 text-emerald-700" :
                      item.status === 'Aguardando Aprovação' ? "bg-amber-100 text-amber-700" :
                      "bg-rose-100 text-rose-700"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-8 text-right">
                    <button className="p-3 bg-white dark:bg-slate-900 rounded-xl hover:bg-indigo-600 hover:text-white transition-all text-slate-400 shadow-sm">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 p-10 rounded-[3rem] flex gap-6">
          <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-indigo-900 dark:text-indigo-300">Gestão de Alçadas</h4>
            <p className="text-indigo-700/80 dark:text-indigo-400/80 text-sm mt-2 leading-relaxed">
              Configure limites por usuário. Acima de R$ 5.000,00, a aprovação do Diretor Financeiro é necessária automaticamente.
            </p>
            <button className="mt-6 flex items-center gap-2 text-indigo-600 font-bold text-sm">
              Editar workflow de aprovação <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-10 flex gap-6 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-500 shadow-sm shrink-0">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-bold dark:text-white">Pagamento em Lote</h4>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Gere arquivos CNAB ou integre via API para liquidar todas as contas aprovadas com um único clique.
            </p>
            <button className="mt-6 flex items-center gap-2 text-indigo-600 font-bold text-sm">
              Configurar Integração Bancária <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
