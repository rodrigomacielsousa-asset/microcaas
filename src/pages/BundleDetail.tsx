import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Check, Package, Sparkles, CreditCard, Zap, Info } from 'lucide-react';
import bundlesData from '../data/bundles.json';
import microcaasData from '../data/microcaas.json';
import solucoesData from '../data/solucoes.json';
import { useCart } from '../hooks/useCart';
import { cn } from '../lib/utils';
import type { Bundle, Product } from '../types';

export default function BundleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const bundle = bundlesData.find(b => b.slug === slug) as Bundle;
  const { addItem, items: cartItems } = useCart();

  if (!bundle) return <div>Bundle não encontrado</div>;

  const isInCart = cartItems.some(i => i.slug === bundle.slug);

  // Get details of included items
  const includedItems = [...microcaasData, ...solucoesData].filter(p => 
    bundle.bundleItems.includes(p.slug)
  ) as Product[];

  const handleAddToCart = () => {
    addItem({
      id: bundle.id,
      slug: bundle.slug,
      name: bundle.name,
      price: bundle.price,
      priceLabel: bundle.priceLabel,
      type: 'bundle',
      pricingModel: bundle.pricingModel
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/microcaas" className="inline-flex items-center text-slate-500 hover:text-indigo-600 font-bold mb-12 group">
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar ao Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-indigo-200 dark:shadow-none font-bold text-2xl">
            {bundle.name.substring(0, 1).toUpperCase()}
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">{bundle.name}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">{bundle.longDescription || bundle.description}</p>
          
          <div className="space-y-4 mb-12">
            <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400">O que está incluído:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {includedItems.map(item => (
                <div key={item.slug} className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                   <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xs">
                     {item.name.substring(0, 2).toUpperCase()}
                   </div>
                   <div>
                     <div className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</div>
                     <div className="text-[10px] text-slate-400 uppercase tracking-widest">{item.area}</div>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-100 dark:bg-slate-800 p-10 rounded-[3rem] border-2 border-indigo-200 dark:border-indigo-900/30">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Oferta Combo de Lançamento</span>
            </div>
            
            <div className="mb-10">
              <div className="text-slate-400 line-through text-lg font-medium mb-1">R$ {(includedItems.reduce((acc, i) => acc + (i.price || 0), 0) * 1.2).toFixed(2)}</div>
              <div className="text-6xl font-bold text-slate-900 dark:text-white tracking-tighter mb-2">{bundle.priceLabel}</div>
              <p className="text-slate-500 font-medium">Economize até 30% comprando o conjunto</p>
            </div>

            <div className="space-y-4 mb-10">
              {bundle.features.map((feature, i) => (
                <div key={i} className="flex items-center text-slate-700 dark:text-slate-300 gap-3 font-medium">
                  <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  if (!isInCart) handleAddToCart();
                  navigate('/carrinho');
                }}
                className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 text-lg"
              >
                {bundle.pricingModel === 'subscription' ? <Zap className="w-5 h-5 fill-current" /> : <CreditCard className="w-5 h-5" />}
                {bundle.pricingModel === 'subscription' ? 'Assinar Combo' : 'Comprar Combo Agora'}
              </button>
              <button 
                onClick={handleAddToCart}
                disabled={isInCart}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold transition-all border-2",
                  isInCart 
                  ? "bg-slate-200 border-slate-200 text-slate-400 cursor-not-allowed" 
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-indigo-300"
                )}
              >
                {isInCart ? "Já está no carrinho" : "Adicionar ao carrinho"}
              </button>
            </div>
          </div>
          
          <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-3xl border border-amber-100 dark:border-amber-900/30 flex gap-4">
            <Info className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
              <strong>Como funciona?</strong> Ao adquirir este combo, você recebe acesso imediato a todas as ferramentas incluídas. O faturamento é centralizado e você economiza na taxa de transação única.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
