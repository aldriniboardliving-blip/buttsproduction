'use server';

import type { ActionResult } from '@/lib/action-result';
import {
  createBusiness,
  updateBusiness,
} from './businesses';
import { createService, updateService } from './services';
import { createEvent, updateEvent } from './events';
import { createFaq, updateFaq } from './faqs';
import { createProduct, updateProduct } from './products';
import { createTeamMember, updateTeamMember } from './team';
import { saveSettings } from './settings';

/**
 * Converts a submitted FormData into the flat object the Zod schemas expect.
 *
 * Repeated field names collapse into arrays, which is how multi-checkbox
 * groups (businessIds, faqIds, …) are carried across.
 */
function fromFormData(formData: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const [key, raw] of formData.entries()) {
    if (key === 'id') continue;
    const value = typeof raw === 'string' ? raw : '';

    if (key in out) {
      const existing = out[key];
      if (Array.isArray(existing)) existing.push(value);
      else out[key] = [existing, value];
    } else {
      out[key] = value;
    }
  }

  return out;
}

/**
 * Service pricing is a nested schema object, but form controls submit flat
 * names like `pricing.amount`. Rebuild the nesting before validating.
 */
function fromServiceFormData(formData: FormData): Record<string, unknown> {
  const flat = fromFormData(formData);

  const pricing = {
    amount: Number(flat['pricing.amount'] ?? 0) || 0,
    currency: 'USD',
    unit: String(flat['pricing.unit'] ?? 'per_session'),
    customUnitLabel: String(flat['pricing.customUnitLabel'] ?? ''),
  };

  const { 'pricing.amount': _amount, 'pricing.unit': _unit, ...rest } = flat;

  return {
    ...rest,
    pricing,
    bookingConfig: {
      formKey: String(flat.bookingFormKey ?? 'general'),
      requiresApproval: true,
      collectsPayment: false,
    },
  };
}

type Handler = (formData: FormData) => Promise<ActionResult<unknown>>;

export const submitCreateBusiness: Handler = async (formData) =>
  createBusiness(fromFormData(formData)) as Promise<ActionResult<unknown>>;

export const submitUpdateBusiness: Handler = async (formData) => {
  const id = String(formData.get('id') ?? '');
  return updateBusiness(id, fromFormData(formData)) as Promise<ActionResult<unknown>>;
};

export const submitCreateService: Handler = async (formData) =>
  createService(fromServiceFormData(formData)) as Promise<ActionResult<unknown>>;

export const submitUpdateService: Handler = async (formData) => {
  const id = String(formData.get('id') ?? '');
  return updateService(id, fromServiceFormData(formData)) as Promise<ActionResult<unknown>>;
};

export const submitCreateEvent: Handler = async (formData) =>
  createEvent(fromFormData(formData)) as Promise<ActionResult<unknown>>;

export const submitUpdateEvent: Handler = async (formData) => {
  const id = String(formData.get('id') ?? '');
  return updateEvent(id, fromFormData(formData)) as Promise<ActionResult<unknown>>;
};

export const submitCreateFaq: Handler = async (formData) =>
  createFaq(fromFormData(formData)) as Promise<ActionResult<unknown>>;

export const submitUpdateFaq: Handler = async (formData) => {
  const id = String(formData.get('id') ?? '');
  return updateFaq(id, fromFormData(formData)) as Promise<ActionResult<unknown>>;
};

export const submitCreateProduct: Handler = async (formData) =>
  createProduct(fromFormData(formData)) as Promise<ActionResult<unknown>>;

export const submitUpdateProduct: Handler = async (formData) => {
  const id = String(formData.get('id') ?? '');
  return updateProduct(id, fromFormData(formData)) as Promise<ActionResult<unknown>>;
};

export const submitCreateTeamMember: Handler = async (formData) =>
  createTeamMember(fromFormData(formData)) as Promise<ActionResult<unknown>>;

export const submitUpdateTeamMember: Handler = async (formData) => {
  const id = String(formData.get('id') ?? '');
  return updateTeamMember(id, fromFormData(formData)) as Promise<ActionResult<unknown>>;
};

export const submitSaveSettings: Handler = async (formData) =>
  saveSettings(fromFormData(formData)) as Promise<ActionResult<unknown>>;