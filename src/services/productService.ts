import { dbService } from './dbService';
import type { Product, Bundle } from '../types';
import initialSolucoes from '../data/solucoes.json';
import initialMicrocaas from '../data/microcaas.json';
import initialBundles from '../data/bundles.json';

const PRODUCTS_COLLECTION = 'products';
const BUNDLES_COLLECTION = 'bundles';

export const productService = {
  async getProducts(): Promise<Product[]> {
    const products = await dbService.getCollection<Product>(PRODUCTS_COLLECTION);
    if (products.length === 0) {
      // Seed fallback or first load
      return [...initialSolucoes, ...initialMicrocaas] as Product[];
    }
    return products;
  },

  async getBundles(): Promise<Bundle[]> {
    const bundles = await dbService.getCollection<Bundle>(BUNDLES_COLLECTION);
    if (bundles.length === 0) {
      return initialBundles as Bundle[];
    }
    return bundles;
  },

  async saveProduct(product: Product) {
    if (product.id) {
      return await dbService.setDoc(PRODUCTS_COLLECTION, product.id, product);
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      return await dbService.setDoc(PRODUCTS_COLLECTION, newId, { ...product, id: newId });
    }
  },

  async deleteProduct(id: string) {
    return await dbService.deleteDoc(PRODUCTS_COLLECTION, id);
  },

  async saveBundle(bundle: Bundle) {
    if (bundle.id) {
      return await dbService.setDoc(BUNDLES_COLLECTION, bundle.id, bundle);
    } else {
      const newId = 'bundle-' + Math.random().toString(36).substr(2, 5);
      return await dbService.setDoc(BUNDLES_COLLECTION, newId, { ...bundle, id: newId });
    }
  }
};
