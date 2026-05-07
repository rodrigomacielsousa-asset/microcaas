import React, { useState } from 'react';
import { 
  FileSearch, 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  FileText, 
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
  Zap,
  TrendingUp,
  Clock,
  Database,
  MessageCircle,
  Code
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeInvoice } from '../services/geminiService';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result?.toString().split(',')[1];
      resolve(base64 || '');
    };
    reader.onerror = error => reject(error);
  });
};

const MOCK_DOCS = [
  { id: '1', name: 'NFe_9823.xml', status: 'Processado', data: '02/05/2026', valor: 1250.40, cst: '000', fornecedor: 'Tech Solutions Ltda', cnpj: '12.345.678/0001-90', confianca: 98, conta: '6.1.1.01 (Serviços TI)', centro: 'TI' },
  { id: '2', name: 'NFS_Jan_26.pdf', status: 'Auditando', data: '28/04/2026', valor: 4500.00, cst: 'Serviços', fornecedor: 'Aluguel & Cia', cnpj: '98.765.432/0001-11', confianca: 94, conta: '6.2.2.05 (Aluguéis)', centro: 'Adm' },
  { id: '3', name: 'Recibo_Taxi.png', status: 'Pendente', data: '01/05/2026', valor: 45.00, cst: 'Despesa', fornecedor: 'Uber do Brasil', cnpj: '17.272.261/0001-60', confianca: 89, conta: '6.1.5.02 (Viagens)', centro: 'Vendas' },
];

export default function PreContabilidade() {
  const [dragActive, setDragActive] = useState(false);
  const [processedDocs, setProcessedDocs] = useState(MOCK_DOCS);
  const [selectedDoc, setSelectedDoc] = useState<typeof MOCK_DOCS[0] | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const sendToWhatsApp = (doc: any) => {
    const message = `*Relatório Pré-Contábil - MicroCaaS*%0A%0A` +
      `*Fornecedor:* ${doc.fornecedor}%0A` +
      `*CNPJ:* ${doc.cnpj}%0A` +
      `*Data:* ${doc.data}%0A` +
      `*Valor:* ${doc.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}%0A` +
      `*Conta:* ${doc.conta}%0A` +
      `*Centro de Custo:* ${doc.centro}%0A%0A` +
      `_Documento processado via IA Gemini (99% de acurácia)_`;
    
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const exportToCSV = (doc: any) => {
    const headers = ["Fornecedor", "CNPJ", "Data", "Valor", "Conta Contabil", "Centro de Custo", "Moeda", "Status", "Fonte"];
    const row = [
      `"${doc.fornecedor}"`,
      `"${doc.cnpj}"`,
      `"${doc.data}"`,
      doc.valor.toString().replace('.', ','),
      `"${doc.conta}"`,
      `"${doc.centro}"`,
      "BRL",
      `"${doc.status}"`,
      "Gemini-AI-OCR"
    ];
    
    const csvContent = "\uFEFF" + [headers.join(";"), row.join(";")].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `lancamento_${doc.fornecedor.replace(/\s+/g, '_')}_${doc.data.replace(/\//g, '-')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processFile = async (file: File) => {
    const fileName = file.name;
    const newId = Math.random().toString();
    
    const processingDoc = {
      id: newId,
      name: fileName,
      status: 'Processando',
      data: 'Agora',
      valor: 0,
      cst: 'Validando...',
      fornecedor: 'Lendo OCR...',
      cnpj: 'Analisando...',
      confianca: 10,
      conta: 'IA Classificando...',
      centro: '---',
      resumo: 'Aguardando processamento...'
    };

    setProcessedDocs(prev => [processingDoc, ...prev]);
    setIsUploading(true);

    try {
      const base64 = await fileToBase64(file);
      const result = await analyzeInvoice(base64, file.type);
      
      setProcessedDocs(prev => prev.map(doc => {
        if (doc.id === newId) {
          return {
            ...doc,
            status: 'Processado',
            valor: result.valor,
            impostos: result.impostos,
            tipoOperacao: result.tipoOperacao,
            fornecedor: result.fornecedor,
            cnpj: result.cnpj,
            data: result.data,
            confianca: 99,
            conta: result.contaContabil,
            centro: result.centroCusto,
            resumo: result.resumo
          };
        }
        return doc;
      }));
    } catch (error) {
      console.error("Erro no OCR:", error);
      setProcessedDocs(prev => prev.map(doc => {
        if (doc.id === newId) {
          return { ...doc, status: 'Erro', fornecedor: 'Erro na leitura' };
        }
        return doc;
      }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <Link to="/solucoes" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-4 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar
          </Link>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Zap className="w-10 h-10 text-indigo-600" />
            CaaS <span className="text-indigo-600">Pré-contábil</span>
          </h1>
          <p className="text-slate-500 mt-2 italic">95% menos digitação. OCR nativo BR com inteligência fiscal SPED-ready.</p>
        </div>
      </div>

      {/* Top Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Economia Mensal', value: '15.4 horas', sub: '+12% vs abr', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Acurácia OCR', value: '98.2%', sub: 'NFe / NFSe', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Auto-classificados', value: '842', sub: 'notas este mês', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Meta de MRR', value: 'R$ 12.4k', sub: 'CaaS Contábil', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
            <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{stat.label}</div>
            <div className="text-[10px] text-slate-400 mt-1">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Dropzone Area */}
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={cn(
              "relative border-2 border-dashed rounded-[3rem] p-12 transition-all flex flex-col items-center justify-center gap-6",
              dragActive 
                ? "bg-indigo-50 border-indigo-400 dark:bg-indigo-900/10 scale-[0.99]" 
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            )}
          >
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-600/30">
              <Upload className="w-10 h-10" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black dark:text-white">Arraste DANFEs ou NFSe</h3>
              <p className="text-slate-500 mt-2 max-w-md mx-auto font-medium">Capture fotos, arraste PDFs ou envie por e-mail. Nossa IA faz a classificação instantânea.</p>
            </div>
            <div className="flex gap-4">
              <label className={cn(
                "bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-2xl cursor-pointer shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2",
                isUploading && "opacity-50 cursor-not-allowed"
              )}>
                {isUploading ? 'Processando...' : 'Selecionar Notas'}
                <input 
                  type="file" 
                  className="hidden" 
                  multiple 
                  onChange={handleFileChange}
                  disabled={isUploading}
                  accept="image/*,application/pdf"
                />
              </label>
              <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold px-8 py-4 rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2">
                Conectar E-mail
              </button>
            </div>
          </div>

          {/* List Section */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h3 className="font-black text-xl flex items-center gap-2">
                <Database className="w-6 h-6 text-indigo-600" />
                Extrações Recentes
              </h3>
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Pesquisar notas..."
                  className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm w-full focus:ring-2 focus:ring-indigo-600 font-medium"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <tr>
                    <th className="p-6">Documento / Fornecedor</th>
                    <th className="p-6">IA Confid.</th>
                    <th className="p-6">Classificação</th>
                    <th className="p-6 text-right">Valor</th>
                    <th className="p-6"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <AnimatePresence>
                    {processedDocs.map((doc) => (
                      <motion.tr 
                        key={doc.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setSelectedDoc(doc)}
                        className={cn(
                          "group cursor-pointer transition-all border-l-4",
                          selectedDoc?.id === doc.id ? "bg-indigo-50/50 border-indigo-600" : "hover:bg-slate-50/50 border-transparent"
                        )}
                      >
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white">{doc.fornecedor}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{doc.cnpj}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                             <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${doc.confianca}%` }}
                                  className={cn("h-full", doc.confianca > 90 ? "bg-emerald-500" : "bg-amber-500")}
                                />
                             </div>
                             <span className="text-[10px] font-bold text-slate-500">{doc.confianca}%</span>
                          </div>
                        </td>
                        <td className="p-6">
                           <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-[10px] font-bold inline-block">
                             {doc.conta}
                           </div>
                        </td>
                        <td className="p-6 text-right font-black text-slate-900 dark:text-white">
                          {doc.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                        <td className="p-6 text-right">
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-1" />
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar: Details & Export */}
        <div className="lg:col-span-4 space-y-6">
          <AnimatePresence mode="wait">
            {selectedDoc ? (
              <motion.div 
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-xl relative overflow-hidden"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-lg">Detalhes OCR</h3>
                    <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-900">
                      <AlertCircle className="w-5 h-5 rotate-45" />
                    </button>
                  </div>

                  {/* Operation Type Badge */}
                  <div className="flex items-center gap-2 mb-6">
                    <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {selectedDoc.tipoOperacao || 'Operação Detectada'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{selectedDoc.id.length < 10 ? 'LANC_MANUAL' : 'LANC_IA'}</span>
                  </div>

                  {/* Financial Values Container */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Valor Bruto</div>
                      <div className="text-lg font-black text-slate-900 dark:text-white">
                        {selectedDoc.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </div>
                    <div className="bg-rose-50 dark:bg-rose-900/10 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                      <div className="text-[10px] font-bold text-rose-500 uppercase mb-1">Impostos</div>
                      <div className="text-lg font-black text-rose-600 dark:text-rose-400">
                        {((selectedDoc as any).impostos || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Accounting Entry */}
                  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 mb-6 shadow-sm">
                    <div className="text-[10px] uppercase font-bold text-slate-400 mb-4 flex items-center justify-between">
                      <span>Lançamento Contábil Sugerido</span>
                      <span className="text-indigo-600">Partidas Dobradas</span>
                    </div>
                    <div className="space-y-4">
                      {/* Debit Line */}
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded flex items-center justify-center text-[10px] font-bold text-emerald-600 shrink-0">D</div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{selectedDoc.conta}</div>
                          <div className="text-[9px] text-slate-400">Ativo/Despesa • Centro: {selectedDoc.centro}</div>
                        </div>
                        <div className="text-xs font-black text-slate-900 dark:text-white">
                          {selectedDoc.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                      </div>
                      {/* Credit Line */}
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-rose-100 dark:bg-rose-900/30 rounded flex items-center justify-center text-[10px] font-bold text-rose-600 shrink-0">C</div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-slate-900 dark:text-white">1.1.1.02.001 (Banco Conta Movimento)</div>
                          <div className="text-[9px] text-slate-400">Passivo/Disponibilidade</div>
                        </div>
                        <div className="text-xs font-black text-slate-900 dark:text-white">
                          {selectedDoc.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Summary / Audit Trail */}
                  <div className="mb-8 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/20">
                    <h4 className="text-[10px] font-bold text-indigo-600 uppercase mb-2 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Trilha de Auditoria IA
                    </h4>
                    <p className="text-[11px] text-indigo-900/70 dark:text-indigo-300/70 leading-relaxed font-medium">
                      "{selectedDoc.resumo || `A operação foi identificada como ${selectedDoc.tipoOperacao?.toLowerCase() || 'venda'}. Os impostos foram calculados com base na descrição da nota.`}"
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                     <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500">Centro de Custo</span>
                        <span className="text-[10px] font-black text-indigo-600">{selectedDoc.centro}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <button 
                      onClick={() => exportToCSV(selectedDoc)}
                      className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Exportar p/ ERP (.csv)
                    </button>
                    <button 
                      onClick={() => sendToWhatsApp(selectedDoc)}
                      className="w-full bg-emerald-500 text-white font-bold py-4 rounded-2xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                    >
                      <MessageCircle className="w-5 h-5" />
                      Enviar WhatsApp
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden"
              >
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <FileSearch className="w-10 h-10" />
                  </div>
                  <h3 className="font-black text-xl mb-2">Selecione uma nota</h3>
                  <p className="text-indigo-100 text-sm">Visualize a trilha de auditoria e o lançamento contábil gerado pela IA.</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-16 -mt-16" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Export Options */}
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <h4 className="font-black text-sm uppercase tracking-wider">Integrações Diretas</h4>
               <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[9px] font-bold">API ACTIVE</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Omie', color: 'bg-indigo-50 text-indigo-600' },
                { name: 'Conta Azul', color: 'bg-blue-50 text-blue-600' },
                { name: 'Dominio', color: 'bg-amber-50 text-amber-600' },
                { name: 'Nibo', color: 'bg-rose-50 text-rose-600' }
              ].map((erp) => (
                <button key={erp.name} className={cn("p-4 rounded-2xl flex flex-col items-center gap-2 hover:scale-[1.02] transition-all border border-transparent hover:border-slate-200", erp.color)}>
                  <Code className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase">{erp.name}</span>
                </button>
              ))}
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-3 mt-6 text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest">
               Configurar Webhooks <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
