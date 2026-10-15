import { z } from 'zod';

export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: ActionError };

export interface ActionError {
  code: string;
  message: string;
  fields?: Record<string, string[] | undefined>;
  statusCode?: number;
}

export function success<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function failure(error: ActionError): ActionResult<never> {
  return { success: false, error };
}

export function validateFormData<T>(
  schema: z.ZodSchema<T>,
  formData: FormData,
): ActionResult<T> {
  const data = Object.fromEntries(formData.entries());
  const result = schema.safeParse(data);

  if (!result.success) {
    return failure({
      code: 'VALIDATION_ERROR',
      message: 'Invalid input',
      fields: result.error.flatten().fieldErrors,
    });
  }

  return success(result.data);
}
