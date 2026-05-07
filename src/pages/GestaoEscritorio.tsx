import React, { useState } from 'react';
import { 
  BarChart3, 
  ArrowLeft, 
  Layout, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Plus, 
  Users, 
  MoreVertical,
  Calendar,
  AlertCircle,
  Flag,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const COLUMNS = [
  { id: 'todo', title: 'A Iniciar', count: 12, color: 'bg-slate-500' },
  { id: 'doing', title: 'Em Andamento', count: 5, color: 'bg-indigo-600' },
  { id: 'review', title: 'Revisão / Auditoria', count: 3, color: 'bg-amber-500' },
  { id: 'done', title: 'Concluído', count: 45, color: 'bg-emerald-600' },
];

const TASKS = [
  { id: 1, title: 'Fechamento Folha - Tech Inov', client: 'Tech Innovation Ltda', due: '05/05', priority: 'high', type: 'DP' },
  { id: 2, title: 'Conciliação Bancária - Abril', client: 'Aero Cargo', due: '10/05', priority: 'medium', type: 'Contábil' },
  { id: 3, title: 'Escrituração Fiscal - Entradas', client: 'Supermercado Central', due: '15/05', priority: 'high', type: 'Fiscal' },
  { id: 4, title: 'Atualização Cadastral', client: 'Consultoria X', due: '20/05', priority: 'low', type: 'Legal' },
];

export default function GestaoEscritorio() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <Link to="/solucoes" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-4 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Layout className="w-10 h-10 text-indigo-600" />
            Gestão do <span className="text-indigo-600">Escritório</span>
          </h1>
          <p className="text-slate-500 mt-2">Visibilidade total de fluxos, SLAs e produtividade da sua equipe contábil.</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
            <Plus className="w-5 h-5" /> Nova Tarefa
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'SLA Dentro do Prazo', value: '98.5%', icon: <CheckCircle2 className="text-emerald-600" />, sub: '+2.1% este mês' },
          { label: 'Tempo Médio Entrega', value: '3.2 dias', icon: <Clock className="text-indigo-600" />, sub: '-0.5 dias vs Abr' },
          { label: 'Ocupação da Equipe', value: '82%', icon: <Users className="text-amber-600" />, sub: 'Ideal: 85%' },
          { label: 'Receita por Atendente', value: 'R$ 12k', icon: <BarChart3 className="text-rose-600" />, sub: 'Meta: R$ 15k' },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{item.sub}</span>
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-slate-100 dark:bg-slate-800/50 p-8 rounded-[3rem] overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl font-bold text-sm text-indigo-600 shadow-sm">Todos os Departamentos</button>
            <button className="px-4 py-2 bg-transparent rounded-xl font-bold text-sm text-slate-500 hover:text-slate-700">Minhas Tarefas</button>
          </div>
          <button className="flex items-center gap-2 text-slate-500 font-bold text-sm">
            <Filter className="w-4 h-4" /> Filtros Avançados
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {COLUMNS.map((col) => (
            <div key={col.id} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", col.color)} />
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{col.title}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-white/50 dark:bg-slate-800 px-2 py-0.5 rounded-md">{col.count}</span>
              </div>

              <div className="flex flex-col gap-4">
                {col.id === 'doing' && TASKS.map((task) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-transparent hover:border-indigo-100 transition-all group cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={cn(
                        "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md",
                        task.type === 'DP' ? "bg-rose-50 text-rose-600" :
                        task.type === 'Fiscal' ? "bg-indigo-50 text-indigo-600" :
                        "bg-amber-50 text-amber-600"
                      )}>
                        {task.type}
                      </span>
                      <MoreVertical className="w-4 h-4 text-slate-300 transition-colors" />
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                    <div className="text-xs text-slate-500 mb-4">{task.client}</div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                        <Calendar className="w-3 h-3" /> {task.due}
                      </div>
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white dark:border-slate-900 text-[10px] flex items-center justify-center font-bold text-indigo-600">JS</div>
                        <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white dark:border-slate-900 text-[10px] flex items-center justify-center font-bold text-slate-600">+1</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {col.id !== 'doing' && (
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl h-32 flex items-center justify-center">
                    <button className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 hover:text-indigo-600 hover:scale-110 transition-all">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategic Tip */}
      <div className="mt-12 p-8 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-[2.5rem] flex gap-4">
        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-900 dark:text-amber-300">Dica de Gestão</h4>
          <p className="text-sm text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
            Você tem 3 tarefas do departamento Fiscal com SLA vencendo em menos de 24 horas. Considere remanejar recursos da equipe Contábil, que está com 65% de ocupação.
          </p>
        </div>
      </div>
    </div>
  );
}
