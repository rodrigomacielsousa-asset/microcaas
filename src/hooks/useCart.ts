import { useState, useEffect } from 'react';
import type { CartItem } from '../types';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('caas_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load cart', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('caas_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems(prev => {
      if (prev.find(i => i.slug === item.slug)) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (slug: string) => {
    setItems(prev => prev.filter(i => i.slug !== slug));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((acc, item) => acc + (item.price || 0), 0);

  return {
    items,
    addItem,
    removeItem,
    clearCart,
    total,
    count: items.length
  };
}
