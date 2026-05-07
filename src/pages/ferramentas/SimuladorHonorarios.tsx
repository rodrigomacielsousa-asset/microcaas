import React, { useState } from 'react';
import { Calculator, ArrowLeft, DollarSign, Users, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SimuladorHonorarios() {
  const [params, setParams] = useState({
    regime: 'simples',
    funcionarios: 1,
    socios: 1,
    lancamentos: 50,
    complexidade: 1
  });

  const baseHonorarios = params.regime === 'simples' ? 350 : params.regime === 'presumido' ? 600 : 1200;
  const porFuncionario = 50 * params.funcionarios;
  const porSocio = 30 * params.socios;
  const porLancamento = 0.5 * params.lancamentos;
  const fatorComplexidade = params.complexidade === 1 ? 1 : params.complexidade === 2 ? 1.3 : 1.6;

  const total = (baseHonorarios + porFuncionario + porSocio + porLancamento) * fatorComplexidade;

  const formatBRL = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/solucoes" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-8 group">
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar para Soluções
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm mb-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Simulador de Honorários</h1>
            <p className="text-slate-500">Estimativa base para precificação de serviços contábeis.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Regime Tributário</label>
              <select 
                value={params.regime}
                onChange={(e) => setParams({...params, regime: e.target.value})}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 font-bold focus:ring-2 focus:ring-emerald-600"
              >
                <option value="simples">Simples Nacional</option>
                <option value="presumido">Lucro Presumido</option>
                <option value="real">Lucro Real</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Funcionários</label>
                <input 
                  type="number" 
                  value={params.funcionarios}
                  onChange={(e) => setParams({...params, funcionarios: Number(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Sócios</label>
                <input 
                  type="number" 
                  value={params.socios}
                  onChange={(e) => setParams({...params, socios: Number(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 font-bold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Lançamentos/Mês</label>
              <input 
                type="number" 
                value={params.lancamentos}
                onChange={(e) => setParams({...params, lancamentos: Number(e.target.value)})}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 font-bold"
              />
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col justify-between">
            <header>
              <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest block mb-1">Honorário Estimado</span>
              <div className="text-4xl font-black">{formatBRL(total)}</div>
              <p className="text-slate-400 text-xs mt-2">Valor sugerido mensal + 13º Honorário.</p>
            </header>

            <div className="space-y-3 mt-8 pt-8 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Taxa Base</span>
                <span className="font-bold">{formatBRL(baseHonorarios)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">DP (Funcionários/Sócios)</span>
                <span className="font-bold">{formatBRL(porFuncionario + porSocio)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Processamento Contábil</span>
                <span className="font-bold">{formatBRL(porLancamento)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
