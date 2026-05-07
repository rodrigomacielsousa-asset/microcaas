import React, { useState } from 'react';
import { 
  Cloud, 
  ArrowLeft, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Smartphone, 
  Globe, 
  Lock, 
  Server,
  ArrowRight,
  Database,
  Link as LinkIcon,
  Search,
  Folder,
  FileText,
  Upload,
  Clock,
  MoreVertical,
  Activity,
  HardDrive,
  Share2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { classifyCloudFile, iCloudFile } from '../services/geminiService';

const INITIAL_FILES = [
  { id: '1', name: 'Contrato_Social_2024.pdf', category: 'Legal', size: '12.4mb', date: 'Há 2 dias', confidence: 100 },
  { id: '2', name: 'Guia_GPS_Jun_26.pdf', category: 'RH', size: '156kb', date: 'Há 1 hora', confidence: 98 },
  { id: '3', name: 'NFe_TechSolutions.xml', category: 'Fiscal', size: '2.4mb', date: 'Hoje', confidence: 99 },
  { id: '4', name: 'Balancete_Auditado.pdf', category: 'Contabil', size: '8.2mb', date: 'Ontem', confidence: 94 },
];

export default function ICloudContabil() {
  const [activeTab, setActiveTab] = useState<'Fiscal' | 'Contabil' | 'RH' | 'Legal' | 'Todos'>('Todos');
  const [files, setFiles] = useState(INITIAL_FILES);
  const [isUploading, setIsUploading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<any>(null);

  const filteredFiles = activeTab === 'Todos' ? files : files.filter(f => f.category === activeTab);

  const handleWhatsApp = (file: any) => {
    const text = `*Documento iCloud Contábil*\n\nArquivo: ${file.name}\nCategoria: ${file.category}\nTamanho: ${file.size}\nData: ${file.date}\nConfiança IA: ${file.confidence}%\n\nVisualizado via CaaS iCloud.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleExport = (file: any) => {
    const content = JSON.stringify(file, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.split('.')[0]}_metadata.json`;
    a.click();
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result?.toString().split(',')[1] || '');
      reader.onerror = error => reject(error);
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const base64 = await fileToBase64(file);
      const result = await classifyCloudFile(base64, file.type);
      
      const newFile = {
        id: Math.random().toString(),
        name: result.name || file.name,
        category: result.category,
        size: (file.size / 1024 / 1024).toFixed(1) + 'mb',
        date: 'Agora',
        confidence: result.confidence
      };

      setFiles(prev => [newFile, ...prev]);
    } catch (err) {
      console.error("Cloud Error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <Link to="/solucoes" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-4 group">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Ver Ecossistema
            </Link>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white flex items-center gap-3 decoration-indigo-600">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <Cloud className="w-6 h-6" />
              </div>
              iCloud <span className="text-indigo-600 italic">Contábil</span>
            </h1>
          </div>
          <div className="flex gap-3">
            <label className={cn(
              "bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl cursor-pointer shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2",
              isUploading && "opacity-50 cursor-not-allowed"
            )}>
              <Upload className="w-5 h-5" />
              {isUploading ? 'Analisando...' : 'Subir Arquivo'}
              <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
            </label>
            <button className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold px-6 py-3 rounded-2xl hover:bg-slate-50 transition-all">
              Acesso White-label
            </button>
          </div>
        </div>

        {/* Cloud Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Uso de Nuvem', value: '1.2 TB', icon: HardDrive, color: 'text-indigo-600' },
            { label: 'Sincronizações', value: '42.1k', icon: Activity, color: 'text-emerald-600' },
            { label: 'Dispositivos', value: '185', icon: Smartphone, color: 'text-amber-600' },
            { label: 'Tempo de Resposta', value: '120ms', icon: Zap, color: 'text-blue-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Explorer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-2">
            {['Todos', 'Fiscal', 'Contabil', 'RH', 'Legal'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex items-center justify-between group",
                  activeTab === tab 
                    ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20" 
                    : "text-slate-500 hover:bg-white hover:text-indigo-600"
                )}
              >
                <div className="flex items-center gap-3">
                  <Folder className={cn("w-5 h-5", activeTab === tab ? "text-indigo-400" : "text-slate-300 group-hover:text-indigo-600")} />
                  {tab}
                </div>
                {activeTab === tab && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />}
              </button>
            ))}
            
            <div className="mt-10 p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl text-white relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold text-sm mb-2">CPU Contábil</h4>
                <p className="text-[10px] text-indigo-100 leading-relaxed mb-4 opacity-80 italic">A IA está monitorando novas alterações em tempo real.</p>
                <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                   <motion.div 
                     animate={{ x: [-20, 100] }}
                     transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                     className="w-1/4 h-full bg-indigo-300 blur-sm"
                   />
                </div>
              </div>
              <Cpu className="absolute -bottom-4 -right-4 w-20 h-20 text-white/5" />
            </div>
          </div>

          {/* Explorer Content */}
          <div className="lg:col-span-9 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-black text-xl flex items-center gap-2">
                Arquivos do Escritório
                <span className="text-xs font-bold text-slate-400 ml-2">({filteredFiles.length})</span>
              </h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-50 rounded-lg"><Search className="w-5 h-5 text-slate-400" /></button>
                <button className="p-2 hover:bg-slate-50 rounded-lg"><MoreVertical className="w-5 h-5 text-slate-400" /></button>
              </div>
            </div>

            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="p-6">Nome do Arquivo</th>
                      <th className="p-6">Categoria</th>
                      <th className="p-6">Acurácia IA</th>
                      <th className="p-6">Tamanho</th>
                      <th className="p-6">Data</th>
                      <th className="p-6"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <AnimatePresence>
                      {filteredFiles.map((file) => (
                        <motion.tr 
                          key={file.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          onClick={() => setSelectedFile(file)}
                          className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
                        >
                          <td className="p-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-800 shadow-sm">
                                <FileText className="w-5 h-5 text-indigo-600" />
                              </div>
                              <span className="font-bold text-slate-900 dark:text-white">{file.name}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className={cn(
                              "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                              file.category === 'Fiscal' ? 'bg-amber-100 text-amber-700' :
                              file.category === 'Contabil' ? 'bg-indigo-100 text-indigo-700' :
                              file.category === 'RH' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-purple-100 text-purple-700'
                            )}>
                              {file.category}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-500">{file.confidence}%</span>
                              <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600" style={{ width: `${file.confidence}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="p-6 text-[11px] font-bold text-slate-400">{file.size}</td>
                          <td className="p-6 text-[11px] font-bold text-slate-500">{file.date}</td>
                          <td className="p-6 text-right">
                             <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                                <ArrowRight className="w-4 h-4" />
                             </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
               </table>
            </div>

            {filteredFiles.length === 0 && (
              <div className="p-20 text-center">
                 <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Database className="w-8 h-8" />
                 </div>
                 <p className="text-slate-400 font-medium">Nenhum documento encontrado nesta categoria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFile(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-indigo-600">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white capitalize leading-tight">
                    {selectedFile.name.split('.')[0].replace(/_/g, ' ')}
                  </h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{selectedFile.category}</span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{selectedFile.size}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Análise de IA</div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold">Confiança na Classificação</span>
                    <span className="text-sm font-black text-indigo-600">{selectedFile.confidence}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${selectedFile.confidence}%` }}
                      className="h-full bg-indigo-600" 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleWhatsApp(selectedFile)}
                  className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/20"
                >
                  <Share2 className="w-5 h-5" /> WhatsApp
                </button>
                <button 
                  onClick={() => handleExport(selectedFile)}
                  className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-slate-900/40"
                >
                  <HardDrive className="w-5 h-5" /> ERP Export
                </button>
              </div>

              <button 
                onClick={() => setSelectedFile(null)}
                className="w-full mt-4 text-slate-400 hover:text-slate-600 font-bold text-sm py-2"
              >
                Fechar Detalhes
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
