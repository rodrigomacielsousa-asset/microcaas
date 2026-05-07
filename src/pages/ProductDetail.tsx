import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Check, ExternalLink, Github, Terminal, Calendar, Layers, Lock, Cpu, Rocket, ChevronRight, Bookmark, ShoppingCart, Plus, Zap, CreditCard, Play } from 'lucide-react';
import solucoesData from '../data/solucoes.json';
import microcaasData from '../data/microcaas.json';
import type { Solucao, MicroCaaS, Product } from '../types';
import { storageService } from '../services/storageService';
import { useCart } from '../hooks/useCart';
import { cn } from '../lib/utils';
import { useState } from 'react';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, items: cartItems } = useCart();
  const [activeTab, setActiveTab] = useState<'info' | 'roadmap' | 'changelog'>('info');

  const product = (solucoesData as Product[]).find(s => s.slug === slug) || 
                  (microcaasData as Product[]).find(m => m.slug === slug);

  const [hasAccess, setHasAccess] = useState(product?.pricingModel === 'free');

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold mb-4">Produto não encontrado</h1>
        <Link to="/" className="text-primary-600 font-bold underline">Voltar para a Home</Link>
      </div>
    );
  }

  const isOfficial = (solucoesData as Solucao[]).some(s => s.slug === slug);
  const isInCart = cartItems.some(i => i.slug === product.slug);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      priceLabel: product.priceLabel,
      type: 'individual',
      pricingModel: product.pricingModel
    });
  };

  const handleBuy = () => {
    storageService.logPurchaseIntent(product.id);
    if (product.checkoutUrl && product.checkoutUrl !== '#') {
      // Intercept original external domain to internal cart
      if (product.checkoutUrl.includes('buy.microcaas.com.br')) {
        addItem({
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.price,
          priceLabel: product.priceLabel,
          type: 'individual',
          pricingModel: product.pricingModel,
          checkoutUrl: product.checkoutUrl
        });
        navigate('/carrinho');
      } else {
        window.open(product.checkoutUrl, '_blank');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <Link to={isOfficial ? "/solucoes" : "/microcaas"} className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-colors mb-8 font-medium">
        <ArrowLeft className="w-4 h-4" /> Voltar para o catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-xs font-bold uppercase tracking-widest">
                {product.area}
              </span>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold">
                Status: {product.statusBadge}
              </span>
              {product.version && (
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-mono">
                  v{product.version}
                </span>
              )}
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              {product.name}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              {product.longDescription || product.description}
            </p>
          </section>

          {/* Screenshot / Paywall */}
          <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] border-8 border-white dark:border-slate-900 shadow-2xl flex items-center justify-center overflow-hidden">
            {!hasAccess ? (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-12 z-20">
                <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl">
                  <Lock className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Acesso Bloqueado</h3>
                <p className="text-slate-300 max-w-md mb-8">
                  Esta é uma solução premium do MicroCaaS. Adquira ou assine para liberar o acesso vitalício ao protótipo e ferramentas.
                </p>
                <div className="flex gap-4">
                  <button onClick={handleBuy} className="btn-primary py-3 px-8 flex items-center gap-2">
                    <Rocket className="w-4 h-4" /> Liberar Agora
                  </button>
                  <button onClick={() => setHasAccess(true)} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold border border-white/20 transition-all">
                    Modo Demo
                  </button>
                </div>
              </div>
            ) : null}
            <div className="text-center p-8">
              <Layers className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-slate-400 font-medium font-mono uppercase tracking-widest text-xs">Preview em Breve</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200 dark:border-slate-800">
            <div className="flex gap-8">
              {['info', 'roadmap', 'changelog'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "pb-4 text-sm font-bold uppercase tracking-widest transition-all relative",
                    activeTab === tab ? "text-primary-600" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  {tab}
                  {activeTab === tab && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" />}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[200px]">
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-6">Recursos Inclusos</h3>
                  <ul className="space-y-4">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary-600" /> Tecnologias
                  </h3>
                  <div className="space-y-2 text-sm text-slate-500">
                    <p>• Interface Responsiva React</p>
                    <p>• Integração via API RESTful</p>
                    <p>• Segurança ponta-a-ponta</p>
                    <p>• GDPR / LGPD Compliance</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'roadmap' && (
              <div className="space-y-6">
                {[
                  { q: 'Q3 2026', items: ['Integração com ERP Protheus', 'Dashboard BI Mobile'] },
                  { q: 'Q4 2026', items: ['Relatórios IA Preditiva', 'White Label para Escritórios'] },
                ].map((phase, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-24 flex-shrink-0 font-bold text-slate-400">{phase.q}</div>
                    <div className="flex-grow space-y-2">
                      {phase.items.map((item, j) => (
                        <div key={j} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'changelog' && (
              <div className="text-slate-500 italic text-center py-12">
                Nenhuma atualização registrada ainda para esta versão.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Actions */}
        <aside className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-8 shadow-xl sticky top-24">
            <div className="mb-8">
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest block mb-2">Investimento</span>
              <div className="text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{product.priceLabel}</div>
              <p className="text-xs text-slate-400 capitalize mt-1">{product.pricingModel === 'one_time' ? 'Pagamento Único' : product.pricingModel}</p>
            </div>

            <div className="space-y-4">
              {product.status === 'em_breve' ? (
                <button className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 px-6 py-4 rounded-2xl font-bold cursor-not-allowed">
                  Disponível em Breve
                </button>
              ) : (
                <>
                  {product.liveUrl?.startsWith('/') && (
                    <Link 
                      to={product.liveUrl}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-2"
                    >
                      <Play className="w-5 h-5 fill-current" /> Acessar Protótipo
                    </Link>
                  )}
                  {product.pricingModel !== 'free' && (
                    <button 
                      onClick={handleAddToCart}
                      disabled={isInCart}
                      className={cn(
                        "w-full py-4 rounded-2xl font-bold transition-all border-2 flex items-center justify-center gap-2",
                        isInCart 
                        ? "bg-slate-100 border-slate-100 text-slate-400 cursor-not-allowed" 
                        : "bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 hover:bg-indigo-50"
                      )}
                    >
                      {isInCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                      {isInCart ? "No carrinho" : "Adicionar ao carrinho"}
                    </button>
                  )}
                  <button 
                    onClick={handleBuy}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {product.pricingModel === 'subscription' ? <Zap className="w-5 h-5 fill-current" /> : <CreditCard className="w-5 h-5" />}
                    {product.pricingModel === 'subscription' ? 'Assinar Agora' : 'Comprar Agora'}
                  </button>
                </>
              )}
              
              {!isOfficial && (
                <div className="grid grid-cols-2 gap-3">
                  <a href="#" className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-sm font-bold text-slate-700 dark:text-white">
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                  <a href="#" className="flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-sm font-bold text-slate-700 dark:text-white">
                    <Terminal className="w-4 h-4" /> Docs
                  </a>
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <ShieldCheckIcon className="w-4 h-4 text-emerald-500" />
                <span>Garantia de Qualidade CaaS</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span>Segurança Bancária SSL</span>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 dark:bg-primary-950/20 rounded-[2rem] p-8 space-y-4">
            <h4 className="font-bold text-primary-900 dark:text-primary-100">Dúvidas?</h4>
            <p className="text-sm text-primary-800 dark:text-primary-300">
              Caso precise de suporte técnico ou implementação customizada deste MicroCaaS, entre em contato.
            </p>
            <button className="text-primary-600 dark:text-primary-400 font-bold text-sm underline underline-offset-4">
              Suporte CaaS Factory
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}
