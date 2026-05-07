import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Table, 
  Download, 
  Info, 
  AlertCircle, 
  Search, 
  Package, 
  Briefcase, 
  RefreshCw, 
  PieChart,
  FileSpreadsheet,
  TrendingUp
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { cn } from '../lib/utils';
import reformaData from '../data/reforma_tax_data.json';
import SimuladorTransicaoReforma from './ferramentas/SimuladorTransicaoReforma';

const { NBS_DATA, NCM_DATA, CST_DATA } = reformaData;

interface CalculationResult {
  quantidade: number;
  valorUnitario: number;
  valorBase: number;
  aliqIBS: number;
  aliqCBS: number;
  effIBS: number;
  effCBS: number;
  vIBS: number;
  vCBS: number;
  totalIBS_CBS: number;
  vPISReal: number;
  vCOFINSReal: number;
  totalReal: number;
  vPISPresumido: number;
  vCOFINSPresumido: number;
  totalPresumido: number;
  aliquotaIPI: number;
  vIPI: number;
  totalComIPI: number;
}

export default function ReformaHub() {
  const [activeTab, setActiveTab] = useState<'item' | 'transicao'>('item');
  const [tipo, setTipo] = useState<'ncm' | 'nbs'>('ncm');
  const [codigo, setCodigo] = useState('');
  const [itemEncontrado, setItemEncontrado] = useState<any>(null);
  const [cst, setCst] = useState('');
  const [cClassTrib, setCClassTrib] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [valorUnitarioStr, setValorUnitarioStr] = useState('');
  const [aliqIBS, setAliqIBS] = useState(0.9);
  const [aliqCBS, setAliqCBS] = useState(0.1);
  const [redIBS, setRedIBS] = useState(0);
  const [redCBS, setRedCBS] = useState(0);
  const [results, setResults] = useState<CalculationResult | null>(null);

  // Normalizar código (remover caracteres não numéricos)
  const normalizar = (str: string) => str.replace(/[^0-9]/g, '').replace(/^0+/, '');

  useEffect(() => {
    if (!codigo) {
      setItemEncontrado(null);
      return;
    }
    const data = tipo === 'nbs' ? NBS_DATA : NCM_DATA;
    const normCodigo = normalizar(codigo);
    const found = (data as any[]).find((i: any) => normalizar(i.codigo) === normCodigo);
    
    if (found) {
      setItemEncontrado(found);
      if (tipo === 'nbs') {
        setCst(found.cst || '');
        setCClassTrib(found.cclassTrib || '');
        setRedIBS(found.redIBS || 0);
        setRedCBS(found.redCBS || 0);
      }
    } else {
      setItemEncontrado(null);
    }
  }, [codigo, tipo]);

  const handleCstChange = (val: string) => {
    setCst(val);
    const found = CST_DATA.find(i => i.cst === val);
    if (found) {
      setCClassTrib(found.cclassTrib);
      setRedIBS(found.redIBS);
      setRedCBS(found.redCBS);
    }
  };

  const handleClassTribChange = (val: string) => {
    setCClassTrib(val);
    const found = (tipo === 'nbs' ? NBS_DATA : CST_DATA).find((i: any) => i.cclassTrib === val && i.cst === cst);
    if (found) {
      setRedIBS(found.redIBS || 0);
      setRedCBS(found.redCBS || 0);
    }
  };

  const formatarMoeda = (val: string) => {
    let v = val.replace(/\D/g, '');
    if (!v) return '';
    let numero = (parseInt(v, 10) / 100).toFixed(2);
    return numero.replace('.', ',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  const parseMoeda = (val: string) => {
    return parseFloat(val.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  };

  const calcular = () => {
    const valorUnitario = parseMoeda(valorUnitarioStr);
    const valor = quantidade * valorUnitario;

    if (valor <= 0) return;

    const effIBSVal = aliqIBS * (1 - redIBS / 100);
    const effCBSVal = aliqCBS * (1 - redCBS / 100);

    const vIBS = valor * (effIBSVal / 100);
    const vCBS = valor * (effCBSVal / 100);
    
    const pisReal = 1.65;
    const cofinsReal = 7.60;
    const pisPresumido = 0.65;
    const cofinsPresumido = 3.00;

    let aliqIPI = 0;
    if (tipo === 'ncm' && itemEncontrado) {
      const ipiStr = String(itemEncontrado.aliquotaIPI || '0').replace(',', '.');
      aliqIPI = (ipiStr.toUpperCase() === 'NT' || ipiStr === '') ? 0 : parseFloat(ipiStr);
    }

    const vIPI = valor * (aliqIPI / 100);

    setResults({
      quantidade,
      valorUnitario,
      valorBase: valor,
      aliqIBS,
      aliqCBS,
      effIBS: effIBSVal,
      effCBS: effCBSVal,
      vIBS,
      vCBS,
      totalIBS_CBS: vIBS + vCBS,
      vPISReal: valor * (pisReal / 100),
      vCOFINSReal: valor * (cofinsReal / 100),
      totalReal: valor * ((pisReal + cofinsReal) / 100),
      vPISPresumido: valor * (pisPresumido / 100),
      vCOFINSPresumido: valor * (cofinsPresumido / 100),
      totalPresumido: valor * ((pisPresumido + cofinsPresumido) / 100),
      aliquotaIPI: aliqIPI,
      vIPI,
      totalComIPI: valor + vIPI
    });
  };

  const exportarExcel = () => {
    if (!results) return;

    const data = [
      ["Calculadora IBS/CBS - " + (tipo === 'ncm' ? "Mercadoria" : "Serviço") + " - " + new Date().toLocaleString("pt-BR")],
      [],
      ["Dados do Item"],
      ["Código", codigo],
      ["Descrição", itemEncontrado?.descricao || "Não encontrado"],
      ["CST", cst],
      ["cClassTrib", cClassTrib],
      ["Quantidade", quantidade],
      ["Valor unitário (R$)", results.valorUnitario.toLocaleString('pt-BR', {minimumFractionDigits: 2})],
      ["Valor total base (R$)", results.valorBase.toLocaleString('pt-BR', {minimumFractionDigits: 2})],
      [],
      ["Resultados Reforma"],
      ["IBS", results.vIBS.toLocaleString('pt-BR', {minimumFractionDigits: 2})],
      ["CBS", results.vCBS.toLocaleString('pt-BR', {minimumFractionDigits: 2})],
      ["Total IBS/CBS", results.totalIBS_CBS.toLocaleString('pt-BR', {minimumFractionDigits: 2})],
      [],
      ["Comparativo Atual"],
      ["Total Lucro Real", results.totalReal.toLocaleString('pt-BR', {minimumFractionDigits: 2})],
      ["Total Lucro Presumido", results.totalPresumido.toLocaleString('pt-BR', {minimumFractionDigits: 2})],
      ["IPI", results.vIPI.toLocaleString('pt-BR', {minimumFractionDigits: 2})]
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Simulação");
    XLSX.writeFile(wb, `Simulacao_Reforma_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  const limpar = () => {
    setCodigo('');
    setItemEncontrado(null);
    setCst('');
    setCClassTrib('');
    setQuantidade(1);
    setValorUnitarioStr('');
    setResults(null);
    setRedIBS(0);
    setRedCBS(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-center mb-12">
        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[2rem] flex gap-2">
          <button 
            onClick={() => setActiveTab('item')}
            className={cn(
              "px-8 py-3 rounded-[1.5rem] text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'item' ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-lg" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <Package className="w-4 h-4" /> Por Item (NCM/NBS)
          </button>
          <button 
            onClick={() => setActiveTab('transicao')}
            className={cn(
              "px-8 py-3 rounded-[1.5rem] text-sm font-bold transition-all flex items-center gap-2",
              activeTab === 'transicao' ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-lg" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <TrendingUp className="w-4 h-4" /> Projeção de Transição
          </button>
        </div>
      </div>

      {activeTab === 'transicao' ? (
        <SimuladorTransicaoReforma />
      ) : (
        <>
          <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <Calculator className="w-10 h-10 text-indigo-600" />
          Simulador <span className="text-indigo-600">IBS / CBS</span>
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Ferramenta avançada para simulação da carga tributária na transição para o novo sistema nacional (EC 132/23).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-600" />
              Identificação do Item
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Tipo de Item</label>
                <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button 
                    onClick={() => { setTipo('ncm'); limpar(); }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all",
                      tipo === 'ncm' ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm" : "text-slate-400"
                    )}
                  >
                    <Package className="w-4 h-4" /> Mercadoria (NCM)
                  </button>
                  <button 
                    onClick={() => { setTipo('nbs'); limpar(); }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all",
                      tipo === 'nbs' ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm" : "text-slate-400"
                    )}
                  >
                    <Briefcase className="w-4 h-4" /> Serviço (NBS)
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Código {tipo.toUpperCase()}</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    placeholder={tipo === 'ncm' ? "Ex: 01012100" : "Ex: 1.1502.10.00"}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-600 transition-all text-slate-900 dark:text-white font-bold"
                  />
                  <Search className="absolute right-3 top-3 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Descrição</label>
              <textarea 
                readOnly
                value={itemEncontrado?.descricao || (codigo ? "Item não encontrado no banco de dados" : "Aguardando código...")}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 text-sm text-slate-600 dark:text-slate-400 resize-none h-20"
              />
            </div>

            {tipo === 'ncm' && itemEncontrado && (
              <div className="grid grid-cols-2 gap-4 mb-6 animate-in fade-in slide-in-from-top-2">
                <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                  <span className="block text-[10px] font-bold text-indigo-600 uppercase mb-1">Unidade Medida</span>
                  <span className="text-lg font-black dark:text-white">{itemEncontrado.unidadeMedida}</span>
                </div>
                <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                  <span className="block text-[10px] font-bold text-indigo-600 uppercase mb-1">Alíquota IPI</span>
                  <span className="text-lg font-black dark:text-white">{itemEncontrado.aliquotaIPI}%</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-t border-slate-100 dark:border-slate-800 mt-6">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">CST IBS/CBS</label>
                  <select 
                    value={cst}
                    onChange={(e) => handleCstChange(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border-none focus:ring-2 focus:ring-indigo-600 font-bold"
                  >
                    <option value="">-- Selecione --</option>
                    {[...new Set(CST_DATA.map(i => i.cst))].map(c => (
                      <option key={c} value={c}>{c} - {CST_DATA.find(i => i.cst === c)?.descricaoCST}</option>
                    ))}
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Classificação Tributária</label>
                  <select 
                    value={cClassTrib}
                    onChange={(e) => handleClassTribChange(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border-none focus:ring-2 focus:ring-indigo-600 font-bold"
                  >
                    <option value="">-- Selecione --</option>
                    {(tipo === 'nbs' && itemEncontrado ? NBS_DATA.filter((n: any) => n.codigo === itemEncontrado.codigo && n.cst === cst) : CST_DATA.filter(c => c.cst === cst)).map((c: any) => (
                      <option key={c.cclassTrib} value={c.cclassTrib}>{c.cclassTrib} - {c.nomeClass}</option>
                    ))}
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Redução IBS (%)</label>
                  <input type="number" value={redIBS} onChange={(e) => setRedIBS(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border-none font-bold" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Redução CBS (%)</label>
                  <input type="number" value={redCBS} onChange={(e) => setRedCBS(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border-none font-bold" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Quantidade</label>
                  <input type="number" value={quantidade} onChange={(e) => setQuantidade(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border-none font-bold" />
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Valor Unitário (R$)</label>
                  <input 
                    type="text" 
                    value={valorUnitarioStr}
                    onChange={(e) => setValorUnitarioStr(formatarMoeda(e.target.value))}
                    placeholder="0,00"
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border-none font-bold"
                  />
               </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={calcular}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" /> Calcular Resultados
              </button>
              <button 
                onClick={limpar}
                className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold px-8 py-4 rounded-2xl transition-all"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {!results ? (
            <div className="flex-1 min-h-[400px] bg-slate-50 dark:bg-slate-800/30 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-12 text-center">
              <Calculator className="w-16 h-16 text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-400">Pronto para Simular</h3>
              <p className="text-sm text-slate-400 max-w-[240px] mt-2">Preencha os dados do item ao lado para ver o comparativo de carga tributária.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              {/* Primary Result */}
              <div className="bg-slate-950 text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                <div className="relative z-10">
                  <header className="flex justify-between items-start mb-10">
                    <div>
                      <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] block mb-1">Carga Estimada Reforma</span>
                      <h3 className="text-2xl font-black">IBS + CBS</h3>
                    </div>
                    <div className="bg-indigo-600/30 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-500/30">
                      Proj. 2026/2033
                    </div>
                  </header>

                  <div className="space-y-8">
                    <div>
                      <div className="text-5xl font-black mb-2 tracking-tighter">
                        R$ {results.totalIBS_CBS.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-400 leading-relaxed italic">
                        Baseado em alíquota conjunta nominal de 1,00% com redução total de {redIBS + redCBS}% aplicada.
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">IBS ({results.effIBS.toFixed(2)}%)</span>
                        <span className="text-xl font-bold">R$ {results.vIBS.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">CBS ({results.effCBS.toFixed(2)}%)</span>
                        <span className="text-xl font-bold">R$ {results.vCBS.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                      </div>
                    </div>

                    <button 
                      onClick={exportarExcel}
                      className="w-full bg-white text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-all border-b-4 border-slate-300 active:border-b-0 active:translate-y-1"
                    >
                      <FileSpreadsheet className="w-5 h-5" /> Exportar Relatório Excel
                    </button>
                  </div>
                </div>
                {/* Decorative background glow */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full" />
              </div>

              {/* Comparative Column */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-indigo-600" />
                  Comparativo de Carga Atual
                </h3>
                
                <div className="space-y-4">
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-indigo-500 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold flex items-center gap-2 underline decoration-indigo-500 decoration-2 underline-offset-4">
                        Lucro Real
                      </span>
                      <span className="text-sm font-black text-rose-500">R$ {results.totalReal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-400 uppercase">
                      <span>PIS: 1.65%</span>
                      <span>COFINS: 7.60%</span>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-indigo-500 transition-colors">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold flex items-center gap-2 underline decoration-indigo-500 decoration-2 underline-offset-4">
                        Lucro Presumido
                      </span>
                      <span className="text-sm font-black text-rose-500">R$ {results.totalPresumido.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-400 uppercase">
                      <span>PIS: 0.65%</span>
                      <span>COFINS: 3.00%</span>
                    </div>
                  </div>

                  {tipo === 'ncm' && results.vIPI > 0 && (
                    <div className="p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xs font-bold text-emerald-600 block mb-1 uppercase">IPI Adicional</span>
                          <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Incidência Mercadoria</span>
                        </div>
                        <span className="text-lg font-black text-emerald-600">R$ {results.vIPI.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 p-6 rounded-[2rem] flex gap-4 text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <p>
                  As alíquotas de IBS e CBS estão em fase de transição. Os cálculos utilizam alíquotas nominais provisórias de 0,9% (IBS) e 0,1% (CBS) para 2026. A alíquota padrão final estimada é de ~27%.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )}
</div>
);
}
