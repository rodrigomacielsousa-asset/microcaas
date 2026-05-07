import React, { useState } from 'react';
import { ShoppingCart, Trash2, ArrowRight, CreditCard, HelpCircle, CheckCircle, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { storageService } from '../services/storageService';
import bundlesData from '../data/bundles.json';
import { cn } from '../lib/utils';
import type { Bundle } from '../types';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { items, removeItem, total, clearCart } = useCart();
  const [isFinishing, setIsFinishing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();

  // Simple bundle suggestion logic
  const suggestion = bundlesData.find(b => {
    const bundle = b as Bundle;
    const matchingItems = items.filter(i => bundle.bundleItems.includes(i.slug));
    return matchingItems.length >= 2;
  }) as Bundle | undefined;

  const handleCheckout = async () => {
    if (!auth.currentUser) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }

    setIsFinishing(true);
    
    try {
      // Create checkout request in Firebase
      await storageService.createCheckoutRequest({
        items: items.map(i => i.slug),
        totalLabel: `R$ ${total.toFixed(2)}`,
        suggestedBundleSlug: suggestion?.slug,
        status: 'pending',
        userEmail: auth.currentUser.email || ''
      });

      // Dynamic combo checkout request feedback
      setTimeout(() => {
        setCompleted(true);
        clearCart();
      }, 1500);
    } catch (err) {
      console.error(err);
      alert('Erro ao processar pedido. Tente novamente.');
    } finally {
      setIsFinishing(false);
    }
  };

  if (completed) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Pedido Enviado!</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">
          Como seu carrinho possui múltiplos itens, nossa equipe está gerando um link de pagamento único com o melhor desconto possível. Você receberá um e-mail em instantes.
        </p>
        <Link to="/microcaas" className="btn-primary py-4 px-8">
          Voltar ao ecossistema
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <ShoppingCart className="w-16 h-16 text-slate-200 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Seu carrinho está vazio</h1>
        <p className="text-slate-500 mb-12">Adicione soluções ou MicroCaaS para começar.</p>
        <Link to="/microcaas" className="btn-primary py-4 px-8">
          Explorar marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-12 flex items-center gap-4">
        <ShoppingCart className="w-10 h-10 text-indigo-600" /> Seu Carrinho
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.slug} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-indigo-600">
                  {item.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{item.name}</h3>
                  <p className="text-xs text-slate-400 uppercase tracking-widest">{item.type === 'bundle' ? 'Combo' : 'Individual'}</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{item.priceLabel}</div>
                  <div className="text-xs text-slate-400 capitalize">{item.pricingModel}</div>
                </div>
                <button 
                  onClick={() => removeItem(item.slug)}
                  className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {suggestion && (
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 text-indigo-200 uppercase text-[10px] font-bold tracking-widest">
                  <Package className="w-4 h-4" /> Sugestão de Economia
                </div>
                <h3 className="text-2xl font-bold mb-2">Compre como o "{suggestion.name}"</h3>
                <p className="text-indigo-100 mb-6 max-w-lg">Detectamos que você está levando itens que fazem parte deste kit. Compre o combo e economize no valor total.</p>
                <Link to={`/bundle/${suggestion.slug}`} className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold text-sm inline-flex items-center gap-2 hover:bg-indigo-50 transition-colors">
                  Ver detalhes do combo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Package className="w-48 h-48" />
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 sticky top-32">
            <h3 className="font-bold text-xl mb-8">Resumo</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal ({items.length} itens)</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end">
                <span className="font-bold">Total</span>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">R$ {total.toFixed(2)}</div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">Pode haver descontos no combo</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isFinishing}
              className="w-full btn-primary py-5 rounded-2xl flex items-center justify-center gap-3 text-lg"
            >
              {isFinishing ? (
                <>Processando...</>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" /> 
                  {items.length > 1 ? "Solicitar Link de Combo" : "Finalizar Compra"}
                </>
              )}
            </button>

            <div className="mt-6 flex items-start gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <HelpCircle className="w-5 h-5 text-indigo-500 flex-shrink-0" />
              <p className="text-[10px] text-slate-400 leading-relaxed">
                {items.length > 1 
                  ? "Para múltiplos itens, nosso admin enviará um link de pagamento manual em até 30min para garantir o melhor preço de pacote."
                  : "Você será redirecionado para o checkout seguro da solução."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
