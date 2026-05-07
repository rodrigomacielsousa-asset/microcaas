import React, { useState, useRef } from 'react';
import { 
  FileCheck, 
  ArrowLeft, 
  Send, 
  FileSignature, 
  CreditCard, 
  CheckCircle2, 
  Settings, 
  Plus, 
  DollarSign, 
  Copy,
  Layout,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  FileText,
  MessageCircle,
  MessageSquare,
  RefreshCw,
  Printer,
  Share2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const SERVICOS = [
  { id: 1, name: 'Assessoria Contábil Mensal', price: 650, period: 'mês', features: ['Contabilidade Digital', 'Fiscal Completo', 'DP até 3 func'] },
  { id: 2, name: 'Folha de Pagamento Adicional', price: 45, period: 'unid', features: ['Cálculo de encargos', 'eSocial', 'Benefícios'] },
  { id: 3, name: 'Consultoria Financeira BPO', price: 1200, period: 'mês', features: ['Gestão de Contas', 'DRE Mensal', 'Conciliação Diária'] },
];

export default function PropostasContratos() {
  const [workflowStep, setWorkflowStep] = useState<'builder' | 'preview' | 'sent' | 'correction' | 'signed'>('builder');
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [clientName, setClientName] = useState('');
  const [signature, setSignature] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const selectedItems = SERVICOS.filter(s => selectedServices.includes(s.id));
  const total = selectedItems.reduce((acc, curr) => acc + curr.price, 0);

  const toggleService = (id: number) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      setSignature(canvas.toDataURL());
      setWorkflowStep('signed');
    }
  };

  const renderWorkflowStatus = () => {
    switch (workflowStep) {
      case 'builder': return { label: 'Em Elaboração', color: 'bg-blue-100 text-blue-700', icon: Plus };
      case 'preview': return { label: 'Revisão Interna', color: 'bg-amber-100 text-amber-700', icon: Clock };
      case 'sent': return { label: 'Aguardando Assinatura', color: 'bg-indigo-100 text-indigo-700', icon: Send };
      case 'correction': return { label: 'Correção Solicitada', color: 'bg-rose-100 text-rose-700', icon: AlertCircle };
      case 'signed': return { label: 'Finalizado e Assinado', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 };
    }
  };

  const status = renderWorkflowStatus();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header com Workflow */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <Link to="/solucoes" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-4 group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">
              Propostas & <span className="text-indigo-600 italic">Contratos</span>
            </h1>
            <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5", status.color)}>
              <status.icon className="w-3 h-3" />
              {status.label}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
            <button 
              onClick={() => {
                if (workflowStep === 'signed') {
                   const text = `Contrato Assinado: ${clientName}\nValor: R$ ${total}/mês\nData: ${new Date().toLocaleDateString()}`;
                   window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }
              }}
              className={cn(
                "px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg",
                workflowStep === 'signed' ? "bg-emerald-600 text-white shadow-emerald-600/20" : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed"
              )}
            >
              <Share2 className="w-4 h-4" /> Exportar/WhatsApp
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Actions/Workflow */}
        <div className="lg:col-span-4 space-y-6">
          <AnimatePresence mode="wait">
            {workflowStep === 'builder' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                key="builder"
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm"
              >
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-indigo-600" /> Detalhes da Proposta
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Razão Social / Cliente</label>
                    <input 
                      type="text" 
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ex: Empresa Exemplo Ltda"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Serviços Selecionados</label>
                    <div className="space-y-2">
                      {SERVICOS.map(s => (
                        <button 
                          key={s.id}
                          onClick={() => toggleService(s.id)}
                          className={cn(
                            "w-full text-left p-3 rounded-xl border-2 transition-all flex justify-between items-center",
                            selectedServices.includes(s.id) ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/10" : "border-slate-100 dark:border-slate-800 hover:border-indigo-100"
                          )}
                        >
                          <span className="text-xs font-bold">{s.name}</span>
                          <span className="text-xs font-black">R${s.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setWorkflowStep('preview')}
                  disabled={!clientName || selectedServices.length === 0}
                  className="w-full mt-6 bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50"
                >
                  Continuar para Revisão <ChevronRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {workflowStep === 'preview' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                key="preview"
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm"
              >
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-amber-600">
                  <Clock className="w-5 h-5" /> Revisão Interna
                </h3>
                <p className="text-xs text-slate-400 mb-6">Confira os termos antes de disparar para o cliente por WhatsApp ou E-mail.</p>
                <div className="space-y-3">
                    <button 
                      onClick={() => setWorkflowStep('builder')}
                      className="w-full p-4 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                    >
                      Voltar para Edição
                    </button>
                    <button 
                      onClick={() => setWorkflowStep('sent')}
                      className="w-full p-4 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                    >
                      Disparar Proposta <Send className="w-4 h-4" />
                    </button>
                </div>
              </motion.div>
            )}

            {workflowStep === 'sent' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                key="sent"
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="font-bold text-lg">Proposta no Ar!</h3>
                  <p className="text-xs text-slate-400 px-4">O link único de assinatura foi enviado ao cliente.</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">Simular Visão do Cliente</div>
                    <button 
                      onClick={() => setWorkflowStep('correction')}
                      className="w-full py-2 bg-white dark:bg-slate-900 border border-slate-200 rounded-lg text-[10px] font-bold hover:bg-rose-50 hover:text-rose-600 transition-all"
                    >
                      Cliente solicita correção
                    </button>
                  </div>
                  
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100">
                    <p className="text-[10px] font-bold text-emerald-800 mb-2 italic">Ação do Cliente:</p>
                    <button 
                      onClick={() => {}} 
                      className="w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-default"
                    >
                      Processando Assinatura <FileSignature className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {workflowStep === 'correction' && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                key="correction"
                className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 shadow-sm border-rose-100"
              >
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-rose-600">
                  <MessageCircle className="w-5 h-5" /> Feedback do Cliente
                </h3>
                <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-100 mb-6">
                   <p className="text-xs text-rose-800 font-medium">"Poderia ajustar o vencimento para o dia 15? No dia 10 fica apertado para o nosso financeiro."</p>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={() => setWorkflowStep('builder')}
                    className="w-full p-4 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  >
                    Ajustar e Reenviar <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {workflowStep === 'signed' && (
               <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key="signed"
                className="bg-emerald-600 rounded-[2.5rem] p-10 text-white text-center shadow-2xl shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-black mb-2">Contrato Ativo!</h3>
                <p className="text-sm opacity-80 mb-8">Todos os itens foram oficializados e a cobrança mensal de R${total} foi agendada.</p>
                <button className="w-full bg-white text-emerald-600 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-transform">
                  Ver Recibo de Assinatura
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Bar */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800">
             <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resumo Financeiro</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
             </div>
             <div className="text-3xl font-black text-slate-900 dark:text-white">R$ {total}</div>
             <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Valor Mensal Recorrente</div>
          </div>
        </div>

        {/* Right Side: Document Preview / Signature Pad */}
        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden min-h-[800px] flex flex-col">
             {/* Document Header */}
             <div className="p-6 bg-slate-50 border-b border-slate-100 dark:bg-slate-800/50 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <FileText className="w-5 h-5 text-indigo-600" />
                   <span className="font-bold text-sm">Contrato_Prestação_Serviços.pdf</span>
                </div>
                <div className="flex gap-2">
                   <button className="p-2 hover:bg-white rounded-lg text-slate-400"><Printer className="w-4 h-4" /></button>
                   <button className="p-2 hover:bg-white rounded-lg text-slate-400 font-bold text-[10px] uppercase">100%</button>
                </div>
             </div>

             {/* Document Body */}
             <div className="p-16 flex-grow overflow-y-auto bg-slate-50/20">
                <div className="max-w-[700px] mx-auto bg-white dark:bg-slate-900 p-12 shadow-xl border border-slate-100 dark:border-slate-800 min-h-full">
                    {/* Fake Logo */}
                    <div className="w-12 h-12 bg-slate-900 rounded-xl mb-8 flex items-center justify-center text-white font-black text-xs">CaaS</div>

                    <div className="prose prose-slate dark:prose-invert max-w-none">
                       <h1 className="text-xl font-black mb-6 uppercase tracking-tight text-center">Contrato de Prestação de Serviços Contábeis</h1>
                       
                       <p className="text-sm leading-relaxed mb-6">
                        Pelo presente instrumento particular, de um lado **{clientName || '(Nome do Cliente)'}**, doravante denominado CONTRATANTE, e de outro **CaaS Contábil Solutions**, doravante denominado CONTRATADO, resolvem celebrar o presente contrato.
                       </p>

                       <h4 className="text-sm font-bold mb-2 uppercase">1. DOS SERVIÇOS</h4>
                       <p className="text-xs text-slate-600 mb-4 italic">Ficam estabelecidos como escopo principal:</p>
                       <ul className="space-y-2 mb-6">
                          {selectedItems.length > 0 ? selectedItems.map(s => (
                             <li key={s.id} className="text-xs flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
                                <span className="font-bold tracking-tight">{s.name}</span>
                                <span className="font-black">R$ {s.price}</span>
                             </li>
                          )) : (
                            <li className="text-xs text-slate-400 italic">Nenhum serviço selecionado...</li>
                          )}
                       </ul>

                       <h4 className="text-sm font-bold mb-2 uppercase tracking-tighter">2. DO INVESTIMENTO</h4>
                       <p className="text-sm mb-6">
                        O CONTRATANTE pagará mensalmente o valor total de **R$ {total},00** (valor por extenso: {total === 0 ? 'Zero Reais' : 'Seiscentos e Cinquenta Reais'}) mediante boleto bancário ou transferência PIX.
                       </p>

                       <div className="border-t-2 border-dashed border-slate-100 dark:border-slate-800 my-10" />

                       {/* Signature Area */}
                       <div className="grid grid-cols-2 gap-10 mt-20">
                          <div className="text-center">
                             <div className="border-b border-slate-300 mb-2" />
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Contatado: CaaS Contábil</span>
                          </div>
                          <div className="text-center relative">
                             {signature ? (
                               <motion.img 
                                 initial={{ opacity: 0, scale: 0.8 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 src={signature} 
                                 alt="Assinatura" 
                                 className="absolute bottom-6 left-1/2 -translate-x-1/2 h-16 grayscale brightness-75" 
                               />
                             ) : workflowStep === 'sent' && (
                               <motion.div 
                                 initial={{ opacity: 0 }}
                                 animate={{ opacity: 1 }}
                                 className="absolute -top-32 left-1/2 -translate-x-1/2 w-64 bg-white dark:bg-slate-900 border-2 border-indigo-600 p-4 rounded-2xl shadow-2xl z-20"
                               >
                                  <div className="text-[10px] font-bold text-indigo-600 uppercase mb-2 flex justify-between items-center">
                                    Assine aqui
                                    <button onClick={clearSignature} className="text-slate-400 hover:text-rose-600 px-2">Limpar</button>
                                  </div>
                                  <canvas
                                    ref={canvasRef}
                                    width={220}
                                    height={100}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                    className="bg-slate-50 dark:bg-slate-800 rounded-lg cursor-crosshair border border-slate-200"
                                  />
                                  <button 
                                    onClick={saveSignature}
                                    className="w-full mt-3 bg-indigo-600 text-white text-[10px] font-black py-2 rounded-lg"
                                  >
                                    CONFIRMAR ASSINATURA
                                  </button>
                               </motion.div>
                             )}
                             <div className={cn(
                               "border-b border-slate-300 mb-2 transition-colors",
                               workflowStep === 'sent' && "border-indigo-600"
                             )} />
                             <span className={cn(
                               "text-[10px] font-bold uppercase tracking-widest",
                               workflowStep === 'sent' ? "text-indigo-600" : "text-slate-400"
                             )}>
                               Contratante: {clientName || '(Aguardando)'}
                             </span>
                          </div>
                       </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

