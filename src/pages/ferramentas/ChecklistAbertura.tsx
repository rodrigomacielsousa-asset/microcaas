import React, { useState } from 'react';
import { ClipboardList, ArrowLeft, CheckCircle2, Circle, AlertCircle, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function ChecklistAbertura() {
  const [steps, setSteps] = useState([
    { id: 1, text: "Definição de Atividades (CNAE)", done: false, info: "Identifique os códigos exatos de serviço ou comércio para evitar problemas fiscais." },
    { id: 2, text: "Viabilidade de Endereço (Prefeitura)", done: false, info: "Verifique se a atividade é permitida no local escolhido antes de alugar." },
    { id: 3, text: "Elaboração do Contrato Social", done: false, info: "Defina sócios, capital social e participações de forma clara." },
    { id: 4, text: "Registro na Junta Comercial", done: false, info: "Protocolo digital para obter o NIRE." },
    { id: 5, text: "Inscrição no CNPJ (Receita)", done: false, info: "Geração do número oficial de identificação da empresa." },
    { id: 6, text: "Inscrição Estadual/Municipal", done: false, info: "Necessário para emissão de Notas Fiscais." },
    { id: 7, text: "Licenciamento e Alvarás", done: false, info: "Bombeiros, Vigilância Sanitária e licenças específicas." },
    { id: 8, text: "Certificado Digital (e-CNPJ)", done: false, info: "Necessário para cumprir obrigações fiscais digitais." }
  ]);

  const toggleStep = (id: number) => {
    setSteps(steps.map(s => s.id === id ? { ...s, done: !s.done } : s));
  };

  const progress = (steps.filter(s => s.done).length / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/solucoes" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-8 group">
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar para Soluções
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold dark:text-white">Checklist de Abertura</h1>
              <p className="text-slate-500">Passo a passo legal para registrar sua empresa no Brasil.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-400 uppercase">Progresso</div>
              <div className="text-xl font-black text-indigo-600">{Math.round(progress)}%</div>
            </div>
            <div className="w-32 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => toggleStep(step.id)}
              className={cn(
                "group flex items-center gap-6 p-6 rounded-2xl border-2 text-left transition-all",
                step.done 
                  ? "bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30" 
                  : "bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 hover:border-indigo-100"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors",
                step.done ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-indigo-600"
              )}>
                {step.done ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <div className={cn("font-bold text-lg", step.done ? "text-emerald-900 dark:text-emerald-300 line-through opacity-50" : "text-slate-900 dark:text-white")}>
                  {step.text}
                </div>
                <div className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> {step.info}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-12 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50 rounded-2xl flex gap-4 text-sm text-amber-700 dark:text-amber-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>Este roteiro é uma base genérica. Dependendo do Estado e da Atividade (ex: posto de combustível, farmácia), exigências adicionais se aplicam.</p>
        </div>
      </div>
    </div>
  );
}
