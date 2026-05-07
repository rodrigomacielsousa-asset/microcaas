import React, { useState, useEffect } from 'react';
import { Search, Info, Building2, FileText, PieChart, ShieldCheck, Download, Trash2, ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import cnaeData from '../../data/cnae_data.json';

interface CNAEEntry {
  cnae: string;
  descricao: string;
  fpas?: string;
  terceiros_codigo?: string;
  terceiros_percentual?: string;
  percentual_empresa?: string;
  rat_ate_2009?: string;
  rat_2010?: string;
  anexo_simples?: string;
  desoneracao_2016_2017?: string;
  desoneracao_2017?: string;
  mei_ocupacao?: string;
  mei_permitido?: string;
  simples_permitido?: string;
}

export default function ConsultaCNAE() {
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState<CNAEEntry[]>([]);
  const [selectedResult, setSelectedResult] = useState<CNAEEntry | null>(null);
  const [ibgeInfo, setIbgeInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const buscarIBGE = async (cnae: string) => {
    const classe5 = cnae.replace(/\D/g, "").substring(0, 5);
    try {
      const resp = await fetch(`https://servicodados.ibge.gov.br/api/v2/cnae/classes/${classe5}`);
      if (resp.ok) return await resp.json();
    } catch (e) {
      console.error('IBGE fetch error', e);
    }
    return null;
  };

  const handleSearch = () => {
    const input = searchTerm.toLowerCase().trim();
    if (input.length < 2) {
      setMatches([]);
      return;
    }

    const termoNumerico = input.replace(/\D/g, "");

    const foundMatches = (cnaeData as CNAEEntry[]).filter(c => {
      const cnaeNum = (c.cnae || "").replace(/\D/g, "");
      const desc = (c.descricao || "").toLowerCase();

      return (
        (termoNumerico && cnaeNum.includes(termoNumerico)) ||
        desc.includes(input)
      );
    });

    setMatches(foundMatches);
    
    if (termoNumerico && termoNumerico.length >= 5) {
      const exact = foundMatches.find(m => m.cnae.replace(/\D/g, "") === termoNumerico);
      if (exact) {
        handleSelect(exact);
      }
    }
  };

  const handleSelect = async (entry: CNAEEntry) => {
    setSelectedResult(entry);
    setMatches([]);
    setLoading(true);
    setIbgeInfo(null);
    try {
      const ibge = await buscarIBGE(entry.cnae);
      setIbgeInfo(ibge);
    } catch (err) {
      console.error("Error fetching IBGE data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(handleSearch, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getFiscalInfo = (secao: string, cnae: string) => {
    // IE - Comércio (G), Indústria (C), Agro (A)
    const ie = ["G", "C", "A"].includes(secao) ? "Obrigatória" : "Não obrigatória";
    // IM - Serviços
    const im = ["M","N","I","J","Q","R","S","T","L","H","P"].includes(secao) ? "Obrigatória" : "Não obrigatória";
    // IPI - Indústria
    const ipi = secao === "C" ? "Sim" : "Não";

    // Fator R
    const fatorRServicos = ["6920", "6201", "7111", "7311", "7020"];
    const isFatorR = fatorRServicos.includes(cnae.substring(0, 4));

    return { ie, im, ipi, isFatorR };
  };

  const aliquotasSimples = {
    "I":   { min: "4,0%",  max: "19,0%"  },
    "II":  { min: "4,5%",  max: "30,0%"  },
    "III": { min: "6,0%",  max: "33,0%"  },
    "IV":  { min: "4,5%",  max: "33,0%"  },
    "V":   { min: "15,5%", max: "30,5%"  },
    "VI":  { min: "16,9%", max: "33,0%"  }
  };

  const currentSecao = ibgeInfo?.grupo?.divisao?.secao?.id || (selectedResult ? (parseInt(selectedResult.cnae.substring(0,2)) <= 3 ? "A" : "M") : "");
  const { ie, im, ipi, isFatorR } = getFiscalInfo(currentSecao, selectedResult?.cnae || "");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/solucoes" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-8 group">
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar para Soluções
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm mb-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Consulta CNAE <span className="text-indigo-600 italic">Inteligente</span></h1>
            <p className="text-slate-500 text-sm">Pesquise por código ou descrição para visualizar enquadramentos fiscais completos.</p>
          </div>
        </div>

        <div className="relative">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite o CNAE (ex: 6201-5/01) ou atividade (ex: Software)"
            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-indigo-600 focus:ring-0 rounded-2xl p-6 pl-14 text-xl font-bold transition-all"
          />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          {searchTerm && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setMatches([]);
                setSelectedResult(null);
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 p-1"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Suggestions List */}
        {matches.length > 0 && !selectedResult && (
          <div className="mt-4 space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-2">
            {matches.map((m, i) => (
              <button
                key={i}
                onClick={() => handleSelect(m)}
                className="w-full text-left p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg border-2 border-transparent hover:border-indigo-100 transition-all flex justify-between items-center group"
              >
                <div>
                  <div className="font-black text-slate-900 dark:text-white text-lg">{m.cnae}</div>
                  <div className="text-sm text-slate-500 font-medium">{m.descricao}</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        )}
      </div>

      {!selectedResult && searchTerm.length >= 2 && matches.length === 0 && !loading && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
           <Info className="w-16 h-16 text-slate-300 mx-auto mb-6" />
           <h3 className="text-2xl font-bold text-slate-400 uppercase tracking-tighter">Atividade não encontrada</h3>
           <p className="text-slate-400 mt-2">Dica: Tente termos como 'Comércio', 'Transporte' ou 'Assessor'.</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
           <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Consultando base IBGE...</p>
        </div>
      )}

      {selectedResult && !loading && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Card Simulador ASSCON */}
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-black text-amber-900 dark:text-amber-500 mb-2 whitespace-nowrap flex items-center gap-3">
                <Search className="w-6 h-6" /> Qual regime tributário é mais vantajoso?
              </h3>
              <p className="text-amber-800/80 dark:text-amber-400/80 leading-relaxed">
                Use o <strong>Simulador da ASSCON</strong> para comparar <strong>Simples Nacional, Lucro Presumido e Lucro Real</strong> com base no seu faturamento e folha.
              </p>
            </div>
            <Link 
              to="/ferramentas/simulador-regime" 
              className="whitespace-nowrap bg-amber-600 hover:bg-amber-700 text-white font-black py-4 px-8 rounded-2xl transition-all shadow-xl shadow-amber-600/20 text-center"
            >
              Ir para o Simulador
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Header Result Card */}
            <div className="lg:col-span-2 bg-indigo-600 rounded-[3rem] p-12 text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
               <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">CNAE Principal</span>
                    <button 
                      onClick={() => setSelectedResult(null)}
                      className="text-[10px] font-black bg-white text-indigo-600 px-4 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
                    >
                      Nova Pesquisa
                    </button>
                  </div>
                  <h2 className="text-5xl font-black mb-4 tracking-tighter">{selectedResult.cnae}</h2>
                  <p className="text-2xl font-medium text-indigo-50 leading-relaxed mb-8">{selectedResult.descricao}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
                      <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest block mb-1">Inscrição Estadual</span>
                      <div className="font-black text-lg">{ie}</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10">
                      <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest block mb-1">Inscrição Municipal</span>
                      <div className="font-black text-lg">{im}</div>
                    </div>
                  </div>
               </div>
               <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32" />
            </div>

            {/* Social Security */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl border border-slate-800">
               <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-8 flex items-center gap-2">
                 <PieChart className="w-4 h-4" /> Previdenciário
               </h3>
               <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-slate-800 pb-3">
                    <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">FPAS</span>
                    <span className="font-black text-2xl">{selectedResult.fpas || "-"}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-800 pb-3">
                    <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Terceiros</span>
                    <span className="font-black text-xl">{selectedResult.terceiros_codigo || "-"}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-800 pb-3">
                    <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">% Terceiros</span>
                    <span className="font-black text-xl">{selectedResult.terceiros_percentual || "-"}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">RAT (Atual)</span>
                    <span className="font-black text-2xl text-emerald-400">{selectedResult.rat_2010 || "-"}</span>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Simples Nacional Details */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm relative pr-20">
               <div className="absolute right-8 top-10 w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-8 h-8" />
               </div>
               <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Simples Nacional</h3>
               
               <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Pode Optar?</span>
                    <div className="text-2xl font-black text-emerald-600 truncate">{selectedResult.simples_permitido || "Sim"}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Anexo Sugerido</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">Anexo {selectedResult.anexo_simples || "III"}</div>
                  </div>
               </div>

               <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 mb-6">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Alíquota Progressiva</div>
                  <div className="font-black text-slate-900 dark:text-white">
                    {aliquotasSimples[selectedResult.anexo_simples as keyof typeof aliquotasSimples] ? (
                      `Inicia em ${aliquotasSimples[selectedResult.anexo_simples as keyof typeof aliquotasSimples].min} até ${aliquotasSimples[selectedResult.anexo_simples as keyof typeof aliquotasSimples].max}`
                    ) : (
                      "Sob consulta via Simples Nacional"
                    )}
                  </div>
               </div>

               {isFatorR && (
                 <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                    <span className="text-[10px] font-black text-amber-600 uppercase mb-1 block">Atenção: Sujeito ao Fator R</span>
                    <p className="text-xs text-amber-700 leading-tight">A tributação muda caso a folha de salários represente mais de 28% da receita bruta.</p>
                 </div>
               )}
            </div>

            {/* MEI Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 p-10 shadow-sm overflow-hidden flex flex-col justify-center">
               <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8">Disponibilidade MEI</h3>
               <div className={cn(
                 "p-8 rounded-[2.5rem] text-center transition-all",
                 selectedResult.mei_ocupacao ? "bg-emerald-600 text-white" : "bg-rose-50 dark:bg-rose-900/10 text-rose-600"
               )}>
                 <div className="text-sm font-bold uppercase tracking-widest mb-1">
                   {selectedResult.mei_ocupacao ? "Atividade Permitida" : "Não Permitido no MEI"}
                 </div>
                 {selectedResult.mei_ocupacao ? (
                   <div className="text-2xl font-black leading-tight uppercase">{selectedResult.mei_ocupacao}</div>
                 ) : (
                   <p className="text-xs opacity-80 mt-2">Esta atividade deve ser exercida exclusivamente via ME ou superior.</p>
                 )}
               </div>
            </div>
          </div>

          {/* IBGE Official Data */}
          {ibgeInfo && (
            <div className="bg-slate-50 dark:bg-slate-800/20 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2">
                 <Building2 className="w-4 h-4" /> Detalhes Oficiais IBGE
               </h3>
               <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Descrição Oficial</span>
                      <p className="text-xl font-bold text-slate-800 dark:text-white">{ibgeInfo.descricao}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100">
                         <span className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Classe ID</span>
                         <span className="font-black text-lg">{ibgeInfo.id}</span>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100">
                         <span className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Seção</span>
                         <span className="font-black text-lg text-indigo-600">{ibgeInfo?.grupo?.divisao?.secao?.id || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {ibgeInfo.observacoes && ibgeInfo.observacoes.length > 0 && (
                    <div className="space-y-4">
                      <span className="text-[10px] font-black text-slate-400 uppercase">Observações e Abrangência</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {ibgeInfo.observacoes.map((obs: string, idx: number) => (
                          <div key={idx} className="flex gap-3 text-xs text-slate-500 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                            <p>{obs}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* Action Bar Footer */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-900 p-8 rounded-[3rem] shadow-2xl">
             <div className="text-white">
               <div className="text-xs font-bold text-indigo-400 uppercase">Base Legal - Simples Nacional</div>
               <p className="text-[10px] text-slate-500 max-w-md mt-1">Lei Complementar nº 123/2006, art. 3º, art. 17 e art. 18. Resolução CGSN nº 140/2018.</p>
             </div>
             <div className="flex gap-3">
                <button 
                  onClick={() => window.print()}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-2xl flex items-center gap-2 transition-all shadow-xl"
                >
                  <Download className="w-5 h-5" /> Exportar PDF
               </button>
               <button 
                  onClick={() => setSelectedResult(null)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-8 rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/30"
                >
                  Nova Consulta
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
