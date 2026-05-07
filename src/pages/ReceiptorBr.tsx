import React, { useState } from 'react';
import { Camera, FileSearch, Sparkles, Download, CheckCircle, ShieldCheck, Zap, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function ReceiptorBR() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setResult({
        cnpj: "12.345.678/0001-90",
        valor_total: 1200.00,
        icms_iss: 60.00,
        conta_contabil: "6.1.1.01",
        centro_custo: "Marketing",
        lancamento: "Débito Desp.Op. R$1.200 | Crédito Caixa R$1.200"
      });
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/microcaas" className="inline-flex items-center gap-2 text-slate-500 hover:text-rose-600 transition-colors mb-8 font-medium group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Voltar para o MicroCaaS
      </Link>

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          <Zap className="w-3 h-3 fill-current" /> OCR Inteligente
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">ReceiptorBR</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Capture fotos de notas fiscais (NF-e/NFS-e) e receba a classificação contábil automática pronta para o seu ERP.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Upload Side */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-12 text-center hover:border-rose-500 transition-colors relative cursor-pointer group">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} />
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Camera className="w-10 h-10 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Tirar Foto ou Enviar</h3>
            <p className="text-slate-500 text-sm italic">Capture o QR-Code ou a DANFE completa</p>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-rose-500">
               <ShieldCheck className="w-5 h-5" />
               <span className="text-xs font-bold uppercase tracking-widest">Segurança Bancária</span>
            </div>
            <p className="text-sm text-slate-300">Dados protegidos por criptografia de ponta-a-ponta e processados por IA em ambiente restrito.</p>
          </div>
        </div>

        {/* Result Side */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-8 min-h-[400px]">
          <AnimatePresence mode="wait">
            {!isProcessing && !result && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <ImageIcon className="w-16 h-16 text-slate-100 dark:text-slate-800 mb-4" />
                <p className="text-slate-400 font-medium">Aguardando envio de nota fiscal para processar...</p>
              </motion.div>
            )}

            {isProcessing && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center py-12 space-y-6"
              >
                <div className="w-16 h-16 border-4 border-rose-100 rounded-full border-t-rose-600 animate-spin" />
                <p className="text-rose-600 font-bold animate-pulse text-sm">Classificando Lançamento...</p>
              </motion.div>
            )}

            {result && (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-2 text-emerald-500">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Capturado com Sucesso</span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">CNPJ Emissor</label>
                    <p className="font-mono text-sm">{result.cnpj}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Valor Total</label>
                      <p className="font-bold text-slate-900 dark:text-white">R$ {result.valor_total.toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">ICMS/ISS</label>
                      <p className="font-bold text-slate-900 dark:text-white">R$ {result.icms_iss.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
                    <label className="text-[10px] font-bold text-indigo-200 uppercase mb-1 block flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Classificação IA
                    </label>
                    <p className="font-bold mb-1">C.Contábil: {result.conta_contabil}</p>
                    <p className="text-xs text-indigo-100">{result.lancamento}</p>
                  </div>
                </div>

                <button className="w-full btn-primary py-4 mt-4 flex items-center justify-center gap-3">
                  <Download className="w-5 h-5" /> Exportar para ERP
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
