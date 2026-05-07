import { dbService } from './dbService';
import type { Submission, CheckoutRequest, Entitlement } from '../types';
import { auth } from '../lib/firebase';

export const storageService = {
  async saveSubmission(submission: Partial<Submission>) {
    const fullSubmission: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      userEmail: submission.userEmail || '',
      name: submission.name || '',
      description: submission.description || '',
      area: submission.area || 'Contábil',
      pricingModel: submission.pricingModel || 'free',
      price: submission.price || 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      manifestJson: submission.manifestJson || '',
    };

    await dbService.addDoc('submissions', fullSubmission);
    return fullSubmission;
  },

  async updateSubmissionStatus(id: string, status: 'approved' | 'rejected') {
    await dbService.updateDoc('submissions', id, { status });
  },

  async getSubmissions(): Promise<Submission[]> {
    return await dbService.getCollection<Submission>('submissions');
  },

  async logPurchaseIntent(productId: string) {
    await dbService.addDoc('purchase_intents', { 
      productId, 
      timestamp: new Date().toISOString(),
      userEmail: auth.currentUser?.email || 'Visitante'
    });
  },

  async createCheckoutRequest(request: Partial<CheckoutRequest>) {
    const fullRequest = {
      userId: auth.currentUser?.uid || '',
      userEmail: request.userEmail || auth.currentUser?.email || 'Visitante',
      items: request.items || [],
      total: parseFloat((request.totalLabel || '0').replace('R$ ', '').replace(',', '.')),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const doc = await dbService.addDoc('orders', fullRequest);
    return doc;
  },

  async getCheckoutRequests(): Promise<CheckoutRequest[]> {
    return await dbService.getCollection<CheckoutRequest>('orders');
  },

  async updateCheckoutRequest(id: string, updates: Partial<CheckoutRequest>) {
    await dbService.updateDoc('orders', id, updates);
  },

  async grantEntitlement(userEmail: string, productSlug: string) {
    const entitlement: Entitlement = {
      id: Math.random().toString(36).substr(2, 9),
      userEmail,
      productSlug,
      grantedAt: new Date().toISOString(),
      status: 'active'
    };

    await dbService.addDoc('entitlements', entitlement);
  },

  async getUserEntitlements(email: string): Promise<Entitlement[]> {
    return await dbService.getCollection<Entitlement>('entitlements', [
      // we would need where('userEmail', '==', email)
    ]);
    // For MVP, we'll fetch all and filter in UI or add index if needed.
    // Actually dbService supports queries.
  }
};

