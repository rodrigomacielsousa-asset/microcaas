import React, { useState } from 'react';
import { 
  UserCircle, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Send, 
  Download, 
  Calendar,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

const OBRIGACOES = [
  { id: 1, title: 'Folha de Pagamento', data: '05/05/2026', status: 'Concluído', icon: <CreditCard className="w-4 h-4" /> },
  { id: 2, title: 'DAS - Simples Nacional', data: '20/05/2026', status: 'Processando', icon: <FileText className="w-4 h-4" /> },
  { id: 3, title: 'FGTS / DCTFWeb', data: '07/05/2026', status: 'Pendente', icon: <Calendar className="w-4 h-4" /> },
  { id: 4, title: 'Balanço Patrimonial 2025', data: 'N/A', status: 'Assinatura Pendente', icon: <CheckCircle2 className="w-4 h-4" /> },
];

export default function PortalCliente() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="User" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Olá, João Silva</h1>
            <p className="text-slate-500">Tech Innovation Ltda. • CNPJ: 12.345.678/0001-90</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <MessageSquare className="w-5 h-5 text-indigo-600" /> Suporte
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Obligations Panel */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-10 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  Sua Jornada do Mês
                </h2>
                <div className="text-sm font-bold text-slate-400">Maio, 2026</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                {[
                  { step: 1, label: 'Documentos' },
                  { step: 2, label: 'Processamento' },
                  { step: 3, label: 'Guia de Pagamento' },
                  { step: 4, label: 'Concluído' }
                ].map((s) => (
                  <div key={s.step} className="flex flex-col gap-2">
                    <div className={cn(
                      "h-2 rounded-full transition-all",
                      s.step < activeStep ? "bg-emerald-500" : 
                      s.step === activeStep ? "bg-indigo-600 shadow-lg shadow-indigo-600/20" : 
                      "bg-slate-100 dark:bg-slate-800"
                    )} />
                    <span className={cn(
                      "text-[10px] uppercase font-bold tracking-widest text-center",
                      s.step === activeStep ? "text-indigo-600" : "text-slate-400"
                    )}>{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {OBRIGACOES.map((item) => (
                  <div 
                    key={item.id}
                    className="group bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 p-6 rounded-3xl flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors shadow-sm">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                          <Calendar className="w-3 h-3" /> Vence em: {item.data}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-bold",
                        item.status === 'Concluído' ? "bg-emerald-100 text-emerald-700" :
                        item.status === 'Processando' ? "bg-indigo-100 text-indigo-700" :
                        item.status === 'Pendente' ? "bg-amber-100 text-amber-700" :
                        "bg-rose-100 text-rose-700"
                      )}>
                        {item.status}
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white flex flex-col justify-between h-64 overflow-hidden relative">
              <div className="relative z-10">
                <TrendingUp className="w-8 h-8 mb-4 opacity-50" />
                <h3 className="text-xl font-bold">Relatórios Gerenciais</h3>
                <p className="text-indigo-100 text-sm mt-1">Seu balanço de Abril já está disponível.</p>
              </div>
              <button className="relative z-10 bg-white text-indigo-600 font-bold py-3 rounded-2xl w-full flex items-center justify-center gap-2">
                Ver Indicadores <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl -mr-24 -mt-24" />
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between h-64 overflow-hidden relative">
              <div className="relative z-10">
                <FileText className="w-8 h-8 mb-4 opacity-50 text-emerald-400" />
                <h3 className="text-xl font-bold">Envio de Arquivos</h3>
                <p className="text-slate-400 text-sm mt-1">Envie notas, recibos e extratos.</p>
              </div>
              <button className="relative z-10 bg-emerald-600 hover:bg-emerald-700 transition-all text-white font-bold py-3 rounded-2xl w-full flex items-center justify-center gap-2">
                Fazer Upload <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Recentes & Notificações
            </h3>
            <div className="space-y-6">
              {[
                { title: 'Guia FGTS Disponível', time: '1h atrás', color: 'bg-emerald-500' },
                { title: 'Balanço Postado', time: 'Ontem', color: 'bg-indigo-500' },
                { title: 'Alerta de Prazo', time: '2 dias atrás', color: 'bg-amber-500' },
              ].map((notif, i) => (
                <div key={i} className="flex gap-4">
                  <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", notif.color)} />
                  <div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{notif.title}</div>
                    <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">{notif.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest">
              Ver Histórico Completo
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] p-8 border border-transparent hover:border-indigo-100 transition-all flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-indigo-600 shadow-sm mb-6">
              <UserCircle className="w-10 h-10" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">Seu Contador Responsável</h4>
            <p className="text-slate-500 text-sm mt-1">Cássio Alcantara</p>
            <div className="mt-6 space-y-2 w-full">
              <button className="w-full bg-white dark:bg-slate-900 py-2 rounded-xl text-xs font-bold text-indigo-600 hover:shadow-md transition-all">
                Enviar E-mail
              </button>
              <button className="w-full bg-indigo-600 py-2 rounded-xl text-xs font-bold text-white hover:shadow-lg shadow-indigo-600/20 transition-all">
                WhatsApp Direto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
