import React, { useState } from 'react';
import { Upload, FileText, Download, CheckCircle, AlertCircle, ArrowRight, Table, Sparkles, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function ExtratoBR() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'processing' | 'result'>('upload');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processFile = () => {
    if (!file) return;
    setIsProcessing(true);
    setStep('processing');
    
    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep('result');
    }, 4000);
  };

  const mockData = [
    { data: '05/03/2026', desc: 'PIX RECEBIDO - JOÃO SILVA', valor: '500,00', conta: '1.1.1.01 - Caixa' },
    { data: '06/03/2026', desc: 'PAGTO BOLETO FORNECEDOR', valor: '-2.000,00', conta: '6.2.1.05 - Subcontratados' },
    { data: '06/03/2026', desc: 'TARIFA BANCARIA', valor: '-15,00', conta: '6.1.1.10 - Despesas Bancárias' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/microcaas" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 font-medium group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar para o MicroCaaS
      </Link>

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3 h-3" /> IA-Powered
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">ExtratoBR</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Converta PDFs de extratos bancários brasileiros em lançamentos contábeis classificados em segundos.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-8">
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center transition-colors hover:border-indigo-500 group relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-50 transition-colors">
                  <Upload className="w-10 h-10 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {file ? file.name : "Clique ou arraste o PDF do extrato"}
                </h3>
                <p className="text-slate-500 text-sm">Suporta Itaú, Bradesco, Santander, Banco do Brasil e outros.</p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={processFile}
                  disabled={!file}
                  className="btn-primary py-4 px-12 flex items-center gap-3 disabled:opacity-50"
                >
                  Processar com IA <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center space-y-6"
            >
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900/30 rounded-full" />
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Analisando Extrato...</h3>
                <p className="text-slate-500 text-sm animate-pulse">
                  Identificando PIX, Boletos e classificando contas contábeis
                </p>
              </div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 dark:text-emerald-400">Classificação Concluída</h4>
                    <p className="text-emerald-700 dark:text-emerald-500 text-xs">98% de precisão nos lançamentos</p>
                  </div>
                </div>
                <button className="bg-white dark:bg-slate-800 text-emerald-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 hover:bg-emerald-50 transition-all">
                  <Download className="w-4 h-4" /> Exportar Excel
                </button>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      <th className="px-6 py-4">Data</th>
                      <th className="px-6 py-4">Descrição</th>
                      <th className="px-6 py-4">Valor</th>
                      <th className="px-6 py-4">Conta Sugerida</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {mockData.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="px-6 py-4 font-mono text-xs">{row.data}</td>
                        <td className="px-6 py-4 font-medium">{row.desc}</td>
                        <td className={cn("px-6 py-4 font-bold text-right", row.valor.startsWith('-') ? "text-rose-600" : "text-emerald-600")}>
                          R$ {row.valor}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded text-[10px] font-bold uppercase italic">
                            {row.conta}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex justify-center pt-4">
                <button onClick={() => setStep('upload')} className="text-slate-400 text-sm font-bold hover:text-indigo-600 transition-colors">
                  Processar outro arquivo
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Testimonials/Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl text-center">
          <h4 className="font-bold mb-2">98% Precisão</h4>
          <p className="text-slate-500 text-xs">IA treinada em planos de contas brasileiros padrão (COSIF/IFRS).</p>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl text-center">
          <h4 className="font-bold mb-2">Setup Zero</h4>
          <p className="text-slate-500 text-xs">Não precisa configurar layouts complexos. Só subir o PDF.</p>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl text-center">
          <h4 className="font-bold mb-2">Exportação Direta</h4>
          <p className="text-slate-500 text-xs">Gere arquivos compatíveis com Alterdata, Questor, Domínio e mais.</p>
        </div>
      </div>
    </div>
  );
}
