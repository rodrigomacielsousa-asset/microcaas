import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  ArrowLeft, 
  TrendingUp, 
  Info, 
  AlertCircle, 
  Download, 
  Table as TableIcon,
  PieChart,
  RefreshCw,
  FileSpreadsheet,
  Calendar,
  LineChart as LineChartIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import { cn } from '../../lib/utils';

const ALL_YEARS = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];
const ALL_FACT  = [0.10, 0.25, 0.40, 0.60, 0.80, 0.90, 0.95, 1.00];

const SETORES = {
  'Padrão':     { cbs: 8.8,  ibs: 17.7 },
  'Educação':   { cbs: 5.28, ibs: 12.5 },
  'Saúde':      { cbs: 6.16, ibs: 14.5 },
  'Alimentos':  { cbs: 6.60, ibs: 12.0 },
  'Transporte': { cbs: 7.04, ibs: 15.0 }
};

const REGIMES = {
  'Lucro Real':       { pis: 1.65, cof: 7.6 },
  'Lucro Presumido':  { pis: 0.65, cof: 3.0 },
  'Simples Nacional': { pis: 0.0,  cof: 0.0 }
};

export default function SimuladorTransicaoReforma() {
  const [fat, setFat] = useState(200000);
  const [custosIVA, setCustosIVA] = useState(0);
  const [custosICMS, setCustosICMS] = useState(0);
  const [credAnt, setCredAnt] = useState(0);
  const [setor, setSetor] = useState<keyof typeof SETORES>('Padrão');
  const [regime, setRegime] = useState<keyof typeof REGIMES>('Lucro Real');
  const [modoManual, setModoManual] = useState(false);
  const [cargaAtual, setCargaAtual] = useState(25);
  
  // Detalhes ICMS
  const [icmsEnt, setIcmsEnt] = useState(19);
  const [icmsSai, setIcmsSai] = useState(19);
  const [incSai, setIncSai] = useState(0);
  const [opsSai, setOpsSai] = useState(0);
  const [incEnt, setIncEnt] = useState(0);
  const [opsEnt, setOpsEnt] = useState(0);
  const [ajuste, setAjuste] = useState(0);
  const [opsAjuste, setOpsAjuste] = useState(0);

  const [anoIni, setAnoIni] = useState(2026);
  const [anoFim, setAnoFim] = useState(2033);

  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    calcular();
  }, [fat, custosIVA, custosICMS, credAnt, setor, icmsEnt, icmsSai, incSai, opsSai, incEnt, opsEnt, ajuste, opsAjuste, modoManual, cargaAtual, regime, anoIni, anoFim]);

  const calcular = () => {
    if (anoFim < anoIni) return;

    const rates = SETORES[setor];
    const CBS = rates.cbs / 100;
    const IBS = rates.ibs / 100;

    const regRates = REGIMES[regime];
    const PIS = regRates.pis / 100;
    const COF = regRates.cof / 100;

    const idxIni = ALL_YEARS.indexOf(anoIni);
    const idxFim = ALL_YEARS.indexOf(anoFim);
    
    const anosValidos = ALL_YEARS.slice(idxIni, idxFim + 1);
    const fatoresValidos = ALL_FACT.slice(idxIni, idxFim + 1);

    const newResults = anosValidos.map((ano, idx) => {
      const f = fatoresValidos[idx];
      const baseIVA = fat * f;
      const vCBS = fat * CBS * f;
      const vIBS = fat * IBS * f;
      const credIVA = custosIVA * (CBS + IBS) * f;
      const subNovo = Math.max(0, (vCBS + vIBS - credIVA) - credAnt * f);

      const vPIS = fat * PIS - custosIVA * PIS;
      const vCOF = fat * COF - custosIVA * COF;

      const icmsDeb = fat * (icmsSai / 100);
      const icmsCred = custosICMS * (icmsEnt / 100);
      const icmsSem = Math.max(0, icmsDeb - icmsCred);
      
      const redSai = (icmsDeb) * (incSai / 100) * (opsSai / 100);
      const redEnt = (icmsCred) * (incEnt / 100) * (opsEnt / 100);
      const redAdj = (icmsSem) * (ajuste / 100) * (opsAjuste / 100);
      const icmsCom = Math.max(0, icmsSem - (redSai + redEnt + redAdj));

      const subAtual = modoManual ? (fat * (cargaAtual / 100)) : (vPIS + vCOF + icmsCom);
      const total = subNovo + subAtual;
      const aliqEf = fat > 0 ? (total / fat) : 0;

      return {
        ano,
        fator: f,
        baseIVA,
        vCBS,
        vIBS,
        credIVA,
        subNovo,
        vPIS,
        vCOF,
        icmsSem,
        icmsCom,
        subAtual,
        total,
        aliqEf
      };
    });

    setResults(newResults);
  };

  const exportarExcel = () => {
    if (results.length === 0) return;

    const data = [
      ["Ano", "Fator de Transição", "Base IVA", "CBS", "IBS", "Créditos IVA", "Subtotal Novo", "PIS", "COFINS", "ICMS c/ Incentivo", "Subtotal Atual", "Total", "Alíquota Efetiva"],
      ...results.map(r => [
        r.ano,
        (r.fator * 100).toFixed(0) + "%",
        r.baseIVA.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        r.vCBS.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        r.vIBS.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        r.credIVA.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        r.subNovo.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        r.vPIS.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        r.vCOF.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        r.icmsCom.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        r.subAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        r.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
        (r.aliqEf * 100).toFixed(2) + "%"
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transição");
    XLSX.writeFile(wb, `Projeção_Reforma_${new Date().getFullYear()}.xlsx`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <Link to="/ferramentas/indicadores" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-4 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-indigo-600" />
            Simulador de Transição <span className="text-indigo-600">Reforma Tributária</span>
          </h1>
          <p className="text-slate-500 mt-2">Acompanhe a evolução da carga tributária de 2026 a 2033 (IVA Dual).</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={exportarExcel}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
          >
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Exportar Relatório
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-600" />
              Parâmetros da Empresa
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Faturamento Anual (R$)</label>
                <input 
                  type="number" 
                  value={fat}
                  onChange={(e) => setFat(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 font-bold focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Custos IVA (R$)</label>
                  <input 
                    type="number" 
                    value={custosIVA}
                    onChange={(e) => setCustosIVA(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Custos ICMS (R$)</label>
                  <input 
                    type="number" 
                    value={custosICMS}
                    onChange={(e) => setCustosICMS(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Setor de Atividade</label>
                <select 
                  value={setor}
                  onChange={(e) => setSetor(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 font-bold focus:ring-2 focus:ring-indigo-600"
                >
                  {Object.keys(SETORES).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Regime Tributário Atual</label>
                <select 
                  value={regime}
                  onChange={(e) => setRegime(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 font-bold focus:ring-2 focus:ring-indigo-600"
                >
                  {Object.keys(REGIMES).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Carga Tributária Atual Manual</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={modoManual}
                      onChange={(e) => setModoManual(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600" />
                  </label>
                </div>
                {modoManual && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Carga Atual (%)</label>
                    <input 
                      type="number" 
                      value={cargaAtual}
                      onChange={(e) => setCargaAtual(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 font-bold"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
            <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-6">Regra de Transição</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Início</span>
                  <select 
                    value={anoIni} 
                    onChange={(e) => setAnoIni(Number(e.target.value))}
                    className="w-full bg-white/10 border-none rounded-xl p-2 text-sm font-bold focus:ring-1 focus:ring-indigo-500"
                  >
                    {ALL_YEARS.map(y => <option key={y} value={y} className="text-slate-900">{y}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Término</span>
                  <select 
                    value={anoFim} 
                    onChange={(e) => setAnoFim(Number(e.target.value))}
                    className="w-full bg-white/10 border-none rounded-xl p-2 text-sm font-bold focus:ring-1 focus:ring-indigo-500"
                  >
                    {ALL_YEARS.map(y => <option key={y} value={y} className="text-slate-900">{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl text-[10px] text-slate-400 leading-relaxed italic">
                A transição do ICMS e ISS ocorrerá gradualmente entre 2029 e 2032, com extinção completa em 2033. CBS e IBS iniciam em 2026.
              </div>
            </div>
          </div>
        </div>

        {/* Right: Results Dashboard */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Alíquota Inicial (2026)</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white">
                {(results[0]?.aliqEf * 100).toFixed(2)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Carga Efetiva Combinada</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Alíquota Final (2033)</span>
              <div className="text-2xl font-black text-indigo-600">
                {(results[results.length - 1]?.aliqEf * 100).toFixed(2)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Estimativa Alvos do Governo</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Variação Projetada</span>
              <div className={cn(
                "text-2xl font-black",
                (results[results.length - 1]?.aliqEf > results[0]?.aliqEf) ? "text-rose-500" : "text-emerald-500"
              )}>
                {((results[results.length - 1]?.aliqEf - results[0]?.aliqEf) * 100).toFixed(2)}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Diferencial Ponto-a-Ponto</div>
            </div>
          </div>

          {/* Gráfico de Evolução */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <h3 className="font-bold mb-8 flex items-center gap-2">
              <LineChartIcon className="w-5 h-5 text-indigo-600" />
              Projeção de Substituição Tributária
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={results}>
                  <defs>
                    <linearGradient id="colorIva" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorAtual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="ano" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 12, fontWeight: 600, fill: '#64748b'}}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#94a3b8'}}
                    tickFormatter={(value) => `R$ ${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: any) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  />
                  <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                  <Area 
                    name="Novo IVA (IBS+CBS)" 
                    type="monotone" 
                    dataKey="subNovo" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorIva)" 
                  />
                  <Area 
                    name="Tributos Atuais" 
                    type="monotone" 
                    dataKey="subAtual" 
                    stroke="#94a3b8" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorAtual)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex items-center gap-2 text-[10px] text-slate-400 justify-center uppercase font-bold tracking-widest">
              <RefreshCw className="w-3 h-3 animate-spin-slow" /> Atualização em tempo real conforme parâmetros
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-indigo-600" />
                Quadro Evolutivo de Transição
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">Ano</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">Fator</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">Subtotal IVA</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">Subtotal Atual</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">Total (R$)</th>
                    <th className="p-4 text-[10px] font-bold text-slate-500 uppercase">Efetiva</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {results.map((r, i) => (
                    <tr key={r.ano} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="p-4 font-bold text-slate-900 dark:text-white">{r.ano}</td>
                      <td className="p-4">
                        <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-2 py-1 rounded-full">
                          {(r.fator * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="p-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                        {r.subNovo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="p-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                        {r.subAtual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="p-4 font-bold text-slate-900 dark:text-white">
                        {r.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="p-4">
                         <div className="flex items-center gap-2">
                            <div className="flex-1 w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600" style={{ width: `${Math.min(100, (r.aliqEf * 100) * 2)}%` }} />
                            </div>
                            <span className="text-xs font-black">{(r.aliqEf * 100).toFixed(2)}%</span>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-8 rounded-[2rem] flex gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
            <div className="space-y-2">
              <h4 className="font-bold text-amber-900 dark:text-amber-300">Nota Legal Importante</h4>
              <p className="text-sm text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
                Este simulador é baseado nas premissas da Emenda Constitucional 132/2023 e nos textos do PLP 68/2024. As alíquotas reais de IBS e CBS serão fixadas por lei ordinária e resoluções do Comitê Gestor e Receita Federal. O fator de transição pode sofrer ajustes conforme a regulamentação final.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
