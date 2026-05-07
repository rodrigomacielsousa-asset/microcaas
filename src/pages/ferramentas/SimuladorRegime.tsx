import React, { useState, useEffect } from 'react';
import { ArrowLeft, BarChart3, TrendingDown, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function SimuladorRegime() {
  const [data, setData] = useState({
    receitaAnual: 1200000,
    compras: 400000,
    folha: 300000,
    outrasDespesas: 100000,
    atividade: 'servicos' as 'comercio' | 'industria' | 'servicos'
  });

  const [results, setResults] = useState<any>(null);

  const formatBRL = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const calculate = () => {
    // 1. Simples Nacional (Aproximação Anexo III/V)
    const fatorR = data.folha / data.receitaAnual;
    const aliqSimples = fatorR >= 0.28 ? 0.12 : 0.18; // Estimativa média por faixa
    const totalSimples = data.receitaAnual * aliqSimples;

    // 2. Lucro Presumido
    const presuncao = data.atividade === 'servicos' ? 0.32 : 0.08;
    const irpjLp = (data.receitaAnual * presuncao) * 0.15;
    const csllLp = (data.receitaAnual * (data.atividade === 'servicos' ? 0.32 : 0.12)) * 0.09;
    const pisCofinsLp = data.receitaAnual * 0.0365;
    const inssPatronal = data.folha * 0.28; // CPP + RAT + Terceiros
    const totalLP = irpjLp + csllLp + pisCofinsLp + inssPatronal;

    // 3. Lucro Real
    const lucroContabil = data.receitaAnual - data.compras - data.folha - data.outrasDespesas;
    const irpjLr = Math.max(0, lucroContabil * 0.15);
    const csllLr = Math.max(0, lucroContabil * 0.09);
    const pisCofinsLr = (data.receitaAnual - data.compras) * 0.0925; // Simplificado não-cumulativo
    const totalLR = irpjLr + csllLr + pisCofinsLr + inssPatronal;

    setResults({
      simples: totalSimples,
      presumido: totalLP,
      real: totalLR,
      winner: totalSimples < totalLP && totalSimples < totalLR ? 'simples' : totalLP < totalLR ? 'presumido' : 'real'
    });
  };

  useEffect(() => {
    calculate();
  }, [data]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link to="/solucoes" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-8 group">
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar para Soluções
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm mb-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Simulador de Regime Tributário</h1>
            <p className="text-slate-500">Compare a carga tributária entre Simples, Presumido e Real.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-6">
             <InputField label="Receita Bruta Anual" value={data.receitaAnual} onChange={(v) => setData({...data, receitaAnual: Number(v)})} />
             <InputField label="Compras / Custos" value={data.compras} onChange={(v) => setData({...data, compras: Number(v)})} />
             <InputField label="Folha de Pagamento Anual" value={data.folha} onChange={(v) => setData({...data, folha: Number(v)})} />
             <div className="space-y-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Atividade Principal</label>
               <select 
                 value={data.atividade} 
                 onChange={(e) => setData({...data, atividade: e.target.value as any})}
                 className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all font-bold appearance-none"
               >
                 <option value="comercio">Comércio</option>
                 <option value="industria">Indústria</option>
                 <option value="servicos">Serviços</option>
               </select>
             </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
             {results && (
               <div className="grid grid-cols-1 gap-4">
                  <ComparisonCard 
                    title="Simples Nacional" 
                    value={results.simples} 
                    isWinner={results.winner === 'simples'} 
                    description="Ideal para pequenos negócios com faturamento ate R$ 4.8M."
                  />
                  <ComparisonCard 
                    title="Lucro Presumido" 
                    value={results.presumido} 
                    isWinner={results.winner === 'presumido'} 
                    description="Baseado em margens fixas de lucro da atividade."
                  />
                  <ComparisonCard 
                    title="Lucro Real" 
                    value={results.real} 
                    isWinner={results.winner === 'real'} 
                    description="O imposto incide sobre o lucro líquido contábil efetivo."
                  />

                  <div className="mt-8 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50 p-6 rounded-[2rem]">
                    <div className="flex gap-4">
                      <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-amber-900 dark:text-amber-200">Atenção: Simulação Simplificada</p>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1 leading-relaxed">
                          Este simulador utiliza alíquotas médias e regras simplificadas. Para uma análise precisa, é fundamental considerar o CNAE específico, benefícios fiscais estaduais/municipais e gastos dedutíveis detalhados.
                        </p>
                      </div>
                    </div>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonCard({ title, value, isWinner, description }: any) {
  return (
    <div className={cn(
      "border-2 transition-all p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6",
      isWinner 
      ? "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-500 shadow-lg shadow-emerald-500/10" 
      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800"
    )}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-lg dark:text-white">{title}</h3>
          {isWinner && <span className="bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Mais Vantajoso</span>}
        </div>
        <p className="text-xs text-slate-400 max-w-[280px]">{description}</p>
      </div>
      <div className="text-right">
         <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Custo Estimado</div>
         <div className={cn("text-2xl font-black", isWinner ? "text-emerald-600" : "text-slate-900 dark:text-white")}>
           {value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
         </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all font-bold"
      />
    </div>
  );
}
