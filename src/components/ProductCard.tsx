import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ExternalLink, ArrowRight, Star, Clock, Beaker, CheckCircle, CreditCard, Zap, Play, ShoppingCart, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Product } from '../types';
import { storageService } from '../services/storageService';
import { useCart } from '../hooks/useCart';

interface CardProps {
  item: Product;
  type: 'solucao' | 'micro' | 'bundle';
}

export const ProductCard: React.FC<CardProps> = ({ item, type }) => {
  const { addItem, items: cartItems } = useCart();
  const navigate = useNavigate();
  const isBeta = item.status === 'beta';
  const isSoon = item.status === 'em_breve';
  const isInCart = cartItems.some(i => i.slug === item.slug);
  
  const detailPath = type === 'solucao' ? `/solucao/${item.slug}` : 
                    type === 'bundle' ? `/bundle/${item.slug}` :
                    `/micro/${item.slug}`;

  const isInternalApp = item.liveUrl?.startsWith('/');
  const finalPath = isInternalApp ? item.liveUrl : detailPath;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: item.id,
      slug: item.slug,
      name: item.name,
      price: item.price,
      priceLabel: item.priceLabel,
      type: type === 'bundle' ? 'bundle' : 'individual',
      pricingModel: item.pricingModel,
      checkoutUrl: item.checkoutUrl
    });
  };

  const renderActionButton = () => {
    if (isSoon) {
      return (
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
          Em breve
        </span>
      );
    }

    if (isInternalApp) {
      return (
        <Link 
          to={item.liveUrl || '#'} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 active:scale-95"
        >
          <Play className="w-3 h-3 fill-current" /> Acessar
        </Link>
      );
    }

    if (item.pricingModel === 'free') {
      return (
        <a 
          href={item.liveUrl || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-3 py-2 rounded-lg transition-all flex items-center gap-1.5"
        >
          <Play className="w-3 h-3 fill-current" /> Acessar
        </a>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <button 
          disabled={isInCart}
          onClick={handleAddToCart}
          className={cn(
            "p-2 rounded-lg transition-all flex items-center justify-center",
            isInCart 
            ? "bg-indigo-600 text-white" 
            : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
          )}
          title={isInCart ? "Ir para o carrinho" : "Adicionar ao carrinho"}
        >
          {isInCart ? <ShoppingCart className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isInCart) handleAddToCart(e);
            navigate('/carrinho');
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap active:scale-95 shadow-sm hover:shadow-md"
        >
          {item.pricingModel === 'subscription' ? <Zap className="w-3 h-3 fill-current" /> : <CreditCard className="w-3 h-3" />}
          {item.pricingModel === 'subscription' ? 'Assinar' : 'Comprar'}
        </button>
      </div>
    );
  };

  const getPricingLabel = () => {
    switch (item.pricingModel) {
      case 'free': return 'Gratuito';
      case 'one_time': return 'Pagamento Único';
      case 'subscription': return 'Assinatura';
      default: return 'Consultar';
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 relative overflow-hidden">
      <div className="flex justify-between items-start mb-5">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
          type === 'solucao' ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "bg-slate-50 text-slate-600 border border-slate-100"
        )}>
          {item.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={cn(
            "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tight",
            isSoon ? "bg-slate-100 text-slate-500" :
            isBeta ? "bg-emerald-100 text-emerald-700" :
            item.status === 'active' ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
          )}>
            {item.statusBadge}
          </span>
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{getPricingLabel()}</span>
        </div>
      </div>

      <div className="flex-grow">
        <Link to={finalPath} className="block group/title">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-1 group-hover/title:text-indigo-600 transition-colors">
            {item.name}
          </h3>
        </Link>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {item.description}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Investimento</span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {item.priceLabel}
          </span>
        </div>
        {renderActionButton()}
      </div>
    </div>
  );
};
