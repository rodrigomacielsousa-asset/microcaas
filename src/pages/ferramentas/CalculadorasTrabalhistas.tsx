import React, { useState } from 'react';
import { ArrowLeft, Calculator, Wallet, Umbrella, LogOut, TrendingUp, Download, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

export default function CalculadorasTrabalhistas() {
  const [activeTab, setActiveTab] = useState<'clt' | 'prolabore' | 'ferias' | 'rescisao' | 'custo'>('clt');
  
  // State management
  const [cltData, setCltData] = useState({ salario: 3500, dependentes: 1, he: 0, vr: 0, vt: 0, insalubridade: 0, periculosidade: 0, pensao: 0, salFam: 0, faltas: 0, outrosDesc: 0, outrosProv: 0 });
  const [plData, setPlData] = useState({ valor: 5000, dependentes: 0, inssMode: '11', outrosDesc: 0 });
  const [feData, setFeData] = useState({ salario: 3000, dias: 30, dependentes: 0, abono: false, ad13: false, extras: 0 });
  const [reData, setReData] = useState({ adm: '', dem: '', salario: 3000, motivo: 'semjusta', diasMes: 15, aviso: 30, feriasVenc: false, dependentes: 0, fgtsSaldo: 0 });
  const [cuData, setCuData] = useState({ salario: 3000, regime: 'lucro', rat: 1.0, fap: 1.0, terceiros: 5.8, benef: 0 });

  const [results, setResults] = useState<any>(null);

  const formatBRL = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

  // Constants 2026
  const FAIXAS_INSS = [
    { upto: 1621.00, rate: 0.075 },
    { upto: 2902.84, rate: 0.09 },
    { upto: 4354.27, rate: 0.12 },
    { upto: 8475.55, rate: 0.14 }
  ];

  const calcINSS = (base: number) => {
    let total = 0;
    let prev = 0;
    for (const f of FAIXAS_INSS) {
      if (base <= prev) break;
      const faixaVal = Math.min(base, f.upto) - prev;
      total += faixaVal * f.rate;
      prev = f.upto;
    }
    return round2(total);
  };

  const calcIR2026 = (baseIR: number, brutoTrib: number) => {
    if (brutoTrib <= 5000) return 0;
    
    // Tabela simplificada IR
    const faixas = [
      { upto: 2428.80, rate: 0.00, ded: 0.00 },
      { upto: 2826.65, rate: 0.075, ded: 182.16 },
      { upto: 3751.05, rate: 0.15, ded: 394.16 },
      { upto: 4664.68, rate: 0.225, ded: 675.49 },
      { upto: Infinity, rate: 0.275, ded: 908.73 }
    ];
    
    const f = faixas.find(x => baseIR <= x.upto) || faixas[faixas.length-1];
    let imposto = Math.max(0, baseIR * f.rate - f.ded);

    if (brutoTrib <= 7350) {
      const fator = (7350 - brutoTrib) / (7350 - 5000);
      const redutor = 312.89 * Math.max(0, Math.min(1, fator));
      imposto = Math.max(0, imposto - redutor);
    }
    return round2(imposto);
  };

  const handleCalculate = () => {
    if (activeTab === 'clt') {
      const valorHora = cltData.salario / 220;
      const valorHE = round2(valorHora * 1.5 * cltData.he);
      const brutoTrib = cltData.salario + cltData.insalubridade + cltData.periculosidade + cltData.outrosProv + valorHE;
      const descFaltas = round2((cltData.salario / 30) * cltData.faltas);
      const baseINSS = Math.max(0, brutoTrib - descFaltas);
      const inss = calcINSS(baseINSS);
      const baseIR = Math.max(0, baseINSS - inss - (cltData.dependentes * 189.59) - cltData.pensao);
      const ir = calcIR2026(baseIR, brutoTrib);
      const descontos = inss + ir + cltData.outrosDesc + cltData.vt + cltData.pensao + descFaltas;
      const liquido = brutoTrib - descontos + cltData.vr + cltData.salFam;
      
      setResults({ bruto: brutoTrib, principalDesc: inss, secundarioDesc: ir, outrosDesc: descontos - inss - ir, totalDesc: descontos, liquido });
    }

    if (activeTab === 'prolabore') {
      const bruto = plData.valor;
      let inss = 0;
      if (plData.inssMode === 'prog') {
        inss = calcINSS(bruto);
      } else if (plData.inssMode === '11') {
        inss = round2(Math.min(bruto, 8475.55) * 0.11);
      } else if (plData.inssMode === '20') {
        inss = round2(Math.min(bruto, 8475.55) * 0.20);
      }
      
      const baseIR = Math.max(0, bruto - inss - (plData.dependentes * 189.59));
      const ir = calcIR2026(baseIR, bruto);
      const totalDesc = inss + ir + plData.outrosDesc;
      const liquido = bruto - totalDesc;
      
      setResults({ 
        bruto, 
        principalDesc: inss, 
        secundarioDesc: ir, 
        outrosDesc: plData.outrosDesc, 
        totalDesc, 
        liquido 
      });
    }

    if (activeTab === 'ferias') {
      const diasFerias = feData.dias;
      const remunBase = feData.salario + feData.extras;
      const feriasValor = round2((remunBase / 30) * diasFerias);
      const tercoConstitucional = round2(feriasValor / 3);
      
      // Abono Pecuniário (venda de 10 dias)
      let abonoValor = 0;
      let tercoAbono = 0;
      if (feData.abono) {
        abonoValor = round2((remunBase / 30) * 10);
        tercoAbono = round2(abonoValor / 3);
      }

      const adiant13 = feData.ad13 ? round2(feData.salario / 2) : 0;
      
      // Base INSS: Férias + Terço (Abono e Terço do Abono não incidem INSS/FGTS/IRRF)
      const baseINSS = feriasValor + tercoConstitucional;
      const inss = calcINSS(baseINSS);
      
      const baseIR = Math.max(0, baseINSS - inss - (feData.dependentes * 189.59));
      const ir = calcIR2026(baseIR, baseINSS);
      
      const brutoTotal = feriasValor + tercoConstitucional + abonoValor + tercoAbono + adiant13;
      const liquido = brutoTotal - (inss + ir);
      
      setResults({ 
        bruto: brutoTotal, 
        principalDesc: inss, 
        secundarioDesc: ir, 
        outrosDesc: 0, 
        totalDesc: inss + ir, 
        liquido 
      });
    }

    if (activeTab === 'rescisao') {
      const salario = reData.salario;
      const motivo = reData.motivo;
      
      // Dias de Salário (Saldo)
      const saldoSalario = round2((salario / 30) * reData.diasMes);
      
      // Férias Proporcionais/Vencidas (Simplificado: assumindo 6 meses proporcionais)
      const mesesProp = 6; 
      const feriasProp = round2((salario / 12) * mesesProp);
      const tercoFerias = round2(feriasProp / 3);
      
      // 13º Proporcional
      const decimoProp = round2((salario / 12) * mesesProp);
      
      // Multa FGTS (se demissão sem justa causa)
      let multaFGTS = 0;
      if (motivo === 'semjusta') {
        multaFGTS = round2(reData.fgtsSaldo * 0.40);
      }

      // Aviso Prévio (se indenizado)
      let avisoPrevio = 0;
      if (motivo === 'semjusta') {
        avisoPrevio = round2(salario + (3 * (mesesProp/12) * (salario/30))); // Simplificação legal
      }

      const bruto = saldoSalario + feriasProp + tercoFerias + decimoProp + multaFGTS + avisoPrevio;
      
      // Deduções simplificadas para rescisão
      const inssSaldo = calcINSS(saldoSalario);
      const inss13 = calcINSS(decimoProp);
      
      const totalDesc = inssSaldo + inss13;
      const liquido = bruto - totalDesc;

      setResults({ 
        bruto, 
        principalDesc: inssSaldo, 
        secundarioDesc: inss13, 
        outrosDesc: multaFGTS, // Usando campos existentes para mostrar detalhes
        totalDesc, 
        liquido 
      });
    }

    if (activeTab === 'custo') {
      const salario = cuData.salario;
      const fgts = round2(salario * 0.08);
      
      // Encargos Patronais
      const inssPatronal = cuData.regime === 'lucro' ? round2(salario * 0.20) : 0;
      const ratAjustado = cuData.regime === 'lucro' ? round2(salario * (cuData.rat * cuData.fap / 100)) : 0;
      const outrasEntidades = cuData.regime === 'lucro' ? round2(salario * (cuData.terceiros / 100)) : 0;
      
      // Provisões (1/12 de Férias + 1/3 e 1/12 de 13º)
      const provFerias = round2((salario / 12) * 1.3333);
      const prov13 = round2(salario / 12);
      const fgtsProv = round2((provFerias + prov13) * 0.08);

      const encargosTotal = fgts + inssPatronal + ratAjustado + outrasEntidades + provFerias + prov13 + fgtsProv;
      const custoTotal = salario + encargosTotal + cuData.benef;

      setResults({ 
        bruto: salario, 
        principalDesc: fgts + fgtsProv, 
        secundarioDesc: inssPatronal + ratAjustado + outrasEntidades, 
        outrosDesc: provFerias + prov13 + cuData.benef, 
        totalDesc: encargosTotal + cuData.benef, 
        liquido: custoTotal 
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link to="/solucoes" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-8 group">
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar para Soluções
      </Link>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold dark:text-white">Calculadoras Trabalhistas</h1>
              <p className="text-slate-500">Suite de simulação atualizada base 2026.</p>
            </div>
          </div>
          <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-x-auto">
            <TabButton active={activeTab === 'clt'} onClick={() => {setActiveTab('clt'); setResults(null);}} icon={Wallet} label="CLT" />
            <TabButton active={activeTab === 'prolabore'} onClick={() => {setActiveTab('prolabore'); setResults(null);}} icon={Calculator} label="Pró-Labore" />
            <TabButton active={activeTab === 'ferias'} onClick={() => {setActiveTab('ferias'); setResults(null);}} icon={Umbrella} label="Férias" />
            <TabButton active={activeTab === 'rescisao'} onClick={() => {setActiveTab('rescisao'); setResults(null);}} icon={LogOut} label="Rescisão" />
            <TabButton active={activeTab === 'custo'} onClick={() => {setActiveTab('custo'); setResults(null);}} icon={TrendingUp} label="Custo Empresa" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            {activeTab === 'clt' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputField label="Salário Bruto" value={cltData.salario} onChange={(v:any) => setCltData({...cltData, salario: Number(v)})} />
                 <InputField label="Dependentes" value={cltData.dependentes} onChange={(v:any) => setCltData({...cltData, dependentes: Number(v)})} type="number" />
                 <InputField label="Vale Transporte" value={cltData.vt} onChange={(v:any) => setCltData({...cltData, vt: Number(v)})} />
                 <InputField label="Faltas (Dias)" value={cltData.faltas} onChange={(v:any) => setCltData({...cltData, faltas: Number(v)})} type="number" />
              </div>
            )}
            
            {activeTab === 'prolabore' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputField label="Valor Bruto" value={plData.valor} onChange={(v:any) => setPlData({...plData, valor: Number(v)})} />
                 <InputField label="Dependentes" value={plData.dependentes} onChange={(v:any) => setPlData({...plData, dependentes: Number(v)})} type="number" />
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Modelo INSS</label>
                    <select value={plData.inssMode} onChange={(e) => setPlData({...plData, inssMode: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 p-4 rounded-2xl font-bold dark:text-white">
                       <option value="11">11% (Individual)</option>
                       <option value="20">20% (Individual)</option>
                       <option value="prog">Progressivo 2026</option>
                    </select>
                 </div>
              </div>
            )}

            {activeTab === 'ferias' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputField label="Salário Base" value={feData.salario} onChange={(v:any) => setFeData({...feData, salario: Number(v)})} />
                 <InputField label="Dias de Férias" value={feData.dias} onChange={(v:any) => setFeData({...feData, dias: Number(v)})} type="number" />
                 <div className="flex items-center gap-2 pt-8">
                    <input type="checkbox" checked={feData.ad13} onChange={(e) => setFeData({...feData, ad13: e.target.checked})} className="w-5 h-5 rounded border-slate-300" id="ad13" />
                    <label htmlFor="ad13" className="text-sm font-bold text-slate-700 dark:text-slate-200">Adiantar 1ª parcela 13º</label>
                 </div>
              </div>
            )}

            {activeTab === 'custo' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputField label="Salário Bruto" value={cuData.salario} onChange={(v:any) => setCuData({...cuData, salario: Number(v)})} />
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Regime</label>
                    <select value={cuData.regime} onChange={(e) => setCuData({...cuData, regime: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 p-4 rounded-2xl font-bold dark:text-white">
                       <option value="lucro">Lucro Real/Presumido</option>
                       <option value="simples">Simples Nacional</option>
                    </select>
                 </div>
              </div>
            )}

            {activeTab === 'rescisao' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <InputField label="Último Salário" value={reData.salario} onChange={(v:any) => setReData({...reData, salario: Number(v)})} />
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Motivo</label>
                    <select value={reData.motivo} onChange={(e) => setReData({...reData, motivo: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-800 p-4 rounded-2xl font-bold dark:text-white">
                       <option value="semjusta">Demissão sem Justa Causa</option>
                       <option value="pedido">Pedido de Demissão</option>
                       <option value="justa">Justa Causa</option>
                    </select>
                 </div>
              </div>
            )}

            <button onClick={handleCalculate} className="btn-primary py-4 px-12 text-lg shadow-xl shadow-indigo-500/20">Calcular Agora</button>
          </div>

          <div className="lg:col-span-5">
             {!results ? (
               <div className="h-full bg-slate-50 dark:bg-slate-800/30 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800 flex items-center justify-center p-12 text-center">
                  <div><Calculator className="w-8 h-8 mx-auto mb-4 text-slate-300" /><h3 className="font-bold text-slate-400">Aguardando dados...</h3></div>
               </div>
             ) : (
               <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                  <div className="relative z-10 space-y-8">
                     <div>
                       <span className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest block mb-1">{activeTab === 'custo' ? 'Custo Total Estimado' : 'Líquido Estimado'}</span>
                       <div className="text-5xl font-black whitespace-nowrap overflow-hidden text-ellipsis">{formatBRL(results.liquido)}</div>
                     </div>
                     <div className="space-y-4">
                        <ResultRow label={activeTab === 'custo' ? 'Salário Base' : 'Total Proventos'} value={formatBRL(results.bruto)} />
                        <ResultRow label={activeTab === 'custo' ? 'FGTS (8%)' : 'Desconto INSS'} value={formatBRL(results.principalDesc)} color={activeTab === 'custo' ? 'text-indigo-300' : 'text-rose-400'} />
                        <ResultRow label={activeTab === 'custo' ? 'INSS Patronal' : 'Desconto IRRF'} value={formatBRL(results.secundarioDesc)} color={activeTab === 'custo' ? 'text-indigo-300' : 'text-rose-400'} />
                        <div className="pt-4 border-t border-white/10 flex justify-between font-bold">
                           <span>{activeTab === 'custo' ? 'Total Adicionais' : 'Total Descontos'}</span>
                           <span className={activeTab === 'custo' ? 'text-emerald-400' : 'text-rose-400'}>{formatBRL(results.totalDesc || 0)}</span>
                        </div>
                     </div>
                     <button className="w-full bg-white/10 hover:bg-white/20 px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"><Download className="w-5 h-5" /> Exportar</button>
                  </div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button onClick={onClick} className={cn("flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap", active ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200")}>
      <Icon className="w-4 h-4" /> {label}
    </button>
  );
}

function InputField({ label, value, onChange, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 transition-all font-bold" />
    </div>
  );
}

function ResultRow({ label, value, color = "text-white" }: any) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-white/60 font-medium">{label}</span>
      <span className={cn("font-bold", color)}>{value}</span>
    </div>
  );
}
