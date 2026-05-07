import React, { useState } from 'react';
import { Calculator, ArrowLeft, TrendingUp, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function SimuladorFatorR() {
  const [folha, setFolha] = useState(0);
  const [receita, setReceita] = useState(0);

  const fatorR = receita > 0 ? (folha / receita) : 0;
  const isAnexoIII = fatorR >= 0.28;

  const formatBRL = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/solucoes" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-8 group">
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar para Soluções
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm mb-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Simulador de Fator R</h1>
            <p className="text-slate-500">Determine se sua empresa tributará pelo Anexo III ou V do Simples Nacional.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Folha de Pagamento (Últimos 12 meses)</label>
            <input 
              type="number" 
              value={folha || ''} 
              onChange={(e) => setFolha(Number(e.target.value))}
              placeholder="R$ 0,00"
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-lg font-bold focus:ring-2 focus:ring-indigo-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Receita Bruta (Últimos 12 meses)</label>
            <input 
              type="number" 
              value={receita || ''} 
              onChange={(e) => setReceita(Number(e.target.value))}
              placeholder="R$ 0,00"
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-lg font-bold focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={cn(
            "p-8 rounded-[2rem] border-2 transition-all",
            isAnexoIII ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-slate-50 border-slate-200 text-slate-400"
          )}>
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold uppercase tracking-widest text-xs">Anexo III (6% inicial)</h3>
              {isAnexoIII && <CheckCircle2 className="w-6 h-6 text-emerald-600" />}
            </div>
            <div className="text-sm leading-relaxed">
              Tributação reduzida permitida quando a folha corresponde a pelo menos 28% do faturamento.
            </div>
          </div>

          <div className={cn(
            "p-8 rounded-[2rem] border-2 transition-all",
            !isAnexoIII && receita > 0 ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-slate-50 border-slate-200 text-slate-400"
          )}>
             <div className="flex justify-between items-start mb-6">
              <h3 className="font-bold uppercase tracking-widest text-xs">Anexo V (15,5% inicial)</h3>
              {!isAnexoIII && receita > 0 && <AlertTriangle className="w-6 h-6 text-amber-600" />}
            </div>
            <div className="text-sm leading-relaxed">
              Tributação padrão para atividades de serviços intelectuais quando o Fator R é inferior a 28%.
            </div>
          </div>
        </div>

        {receita > 0 && (
          <div className="mt-12 p-8 bg-slate-900 text-white rounded-[2rem] relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <span className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest block mb-1">Seu Fator R</span>
                <div className="text-5xl font-black">{(fatorR * 100).toFixed(2)}%</div>
              </div>
              <div className="text-center md:text-right">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Status de Opção</span>
                <div className={cn("text-2xl font-bold", isAnexoIII ? "text-emerald-400" : "text-amber-400")}>
                  {isAnexoIII ? "Apto ao Anexo III" : "Sujeito ao Anexo V"}
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] -mr-32 -mt-32" />
          </div>
        )}
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 p-8 rounded-[2.5rem] flex gap-4">
        <Info className="w-6 h-6 text-indigo-600 shrink-0" />
        <div className="space-y-2">
          <h4 className="font-bold text-indigo-900 dark:text-indigo-300">Dica Estratégica</h4>
          <p className="text-sm text-indigo-700/80 dark:text-indigo-400/80 leading-relaxed">
            Se seu Fator R está próximo de 28%, considere aumentar seu Pró-labore para atingir o limite e economizar significativamente no imposto do Simples Nacional. A economia no DAS costuma ser muito superior ao aumento do INSS/IRRF sobre o sócio.
          </p>
        </div>
      </div>
    </div>
  );
}
