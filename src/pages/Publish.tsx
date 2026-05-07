import React, { useState } from 'react';
import { Send, FileJson, CheckCircle, Rocket, Shield, AlertTriangle } from 'lucide-react';
import { storageService } from '../services/storageService';
import { motion, AnimatePresence } from 'motion/react';

export default function Publish() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    userEmail: '',
    description: '',
    area: 'Contábil',
    pricingModel: 'free' as const,
    price: 0,
    manifestJson: `{
  "name": "",
  "slug": "",
  "area": "",
  "version": "1.0.0",
  "description": "",
  "features": [],
  "status": "beta",
  "pricingModel": "free",
  "checkoutUrl": "",
  "liveUrl": "",
  "tags": [],
  "lastUpdated": "${new Date().toISOString().split('T')[0]}"
}`
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await storageService.saveSubmission(formData);
    setSubmitted(true);
  };

  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(formData.manifestJson);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "microcaas.manifest.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Publicar no Ecossistema</h1>
              <p className="text-xl text-slate-500 dark:text-slate-400">
                Tem um MicroCaaS ou uma ideia disruptiva? Preencha o formulário e faça parte da revolução contábil.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-amber-50 dark:bg-amber-900/10 p-8 rounded-3xl border border-amber-200 dark:border-amber-800">
              <div className="flex flex-col items-center text-center gap-3">
                <Shield className="w-8 h-8 text-amber-600" />
                <h4 className="font-bold text-amber-900 dark:text-amber-100 text-sm">Validamos sua Ideia</h4>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <Rocket className="w-8 h-8 text-amber-600" />
                <h4 className="font-bold text-amber-900 dark:text-amber-100 text-sm">Escalamos o Produto</h4>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <Users className="w-8 h-8 text-amber-600" />
                <h4 className="font-bold text-amber-900 dark:text-amber-100 text-sm">Conectamos Clientes</h4>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Seu Nome / Empresa</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="João Silva ou Empresa LTDA"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">E-mail para Contato</label>
                  <input 
                    required
                    type="email" 
                    value={formData.userEmail}
                    onChange={(e) => setFormData({...formData, userEmail: e.target.value})}
                    placeholder="joao@exemplo.com"
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Área Principal</label>
                  <select 
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Contábil</option>
                    <option>Fiscal</option>
                    <option>Financeiro</option>
                    <option>Reforma Tributária</option>
                    <option>Outros</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Modelo de Negócio</label>
                  <select 
                    value={formData.pricingModel}
                    onChange={(e) => setFormData({...formData, pricingModel: e.target.value as any})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="free">Gratuito</option>
                    <option value="one_time">Pagamento Único</option>
                    <option value="subscription">Assinatura</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Descriçãocurta da Solução</label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Escrita rápida do problema e da sua solução..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Manifesto MicroCaaS (JSON)</label>
                  <button 
                    type="button"
                    onClick={downloadJson}
                    className="text-xs flex items-center gap-1 font-bold text-primary-600 hover:underline"
                  >
                    <FileJson className="w-3 h-3" /> Baixar Template
                  </button>
                </div>
                <textarea 
                  rows={10}
                  value={formData.manifestJson}
                  onChange={(e) => setFormData({...formData, manifestJson: e.target.value})}
                  className="w-full bg-slate-900 border-none rounded-xl p-4 font-mono text-emerald-400 text-xs leading-relaxed focus:ring-2 focus:ring-primary-500"
                />
                <p className="text-[10px] text-slate-500 italic">O manifesto é obrigatório para a homologação no portal.</p>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary-500/30 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                <Send className="w-5 h-5" /> Enviar para Homologação
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-8 py-24 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl"
          >
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Submissão Recebida!</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Sua solicitação foi salva localmente e enviada para nosso time de curadoria. Em breve entraremos em contato via e-mail.
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-8 text-primary-600 font-bold hover:underline"
            >
              Publicar outra solução
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
