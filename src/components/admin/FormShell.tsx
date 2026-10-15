'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export interface FormActionResult {
  success: boolean;
  error?: { code?: string; message: string; fields?: Record<string, string[] | undefined> };
  data?: unknown;
}

/**
 * Wraps an admin form: owns pending state, maps server validation errors onto
 * fields, and redirects on success. Every admin form uses this so error
 * handling is identical and field-level messages actually render.
 */
export function FormShell({
  action,
  id,
  submitLabel,
  cancelHref,
  backHref,
  hidden,
  children,
}: {
  action: (formData: FormData) => Promise<FormActionResult>;
  id?: string;
  submitLabel: string;
  cancelHref?: string;
  backHref?: string;
  hidden?: Record<string, string | undefined>;
  children: (state: {
    pending: boolean;
    errors: Record<string, string[] | undefined>;
    error: string;
  }) => React.ReactNode;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [error, setError] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setErrors({});

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await action(formData);

      if (result.success) {
        router.push(backHref ?? '/admin');
        router.refresh();
        return;
      }

      setErrors(result.error?.fields ?? {});
      setError(result.error?.message ?? 'Something went wrong. Please try again.');
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {id && <input type="hidden" name="id" value={id} />}
      {hidden &&
        Object.entries(hidden).map(([key, value]) =>
          value === undefined ? null : <input key={key} type="hidden" name={key} value={value} />,
        )}

      {error && (
        <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {children({ pending: isPending, errors, error })}

      <div className="mt-8 flex items-center justify-end gap-3 border-t border-neutral-200 pt-6">
        {cancelHref && (
          <Button type="button" variant="outline" onClick={() => router.push(cancelHref)}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isPending}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}

type Errors = Record<string, string[] | undefined>;

function errorFor(errors: Errors, name: string): string | undefined {
  return errors[name]?.[0];
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-neutral-600">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

const fieldBase =
  'w-full rounded-lg border bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-2 focus:outline-offset-1 focus:outline-primary-500';

export function Field({
  name,
  label,
  errors,
  hint,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  errors?: Errors;
  hint?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={errorFor(errors ?? {}, name) ? 'true' : undefined}
        className={`${fieldBase} ${errorFor(errors ?? {}, name) ? 'border-red-500' : 'border-neutral-300'}`}
        {...props}
      />
      {errorFor(errors ?? {}, name) ? (
        <p className="mt-1 text-xs text-red-600">{errorFor(errors ?? {}, name)}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-neutral-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextArea({
  name,
  label,
  errors,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  name: string;
  label: string;
  errors?: Errors;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        rows={props.rows ?? 4}
        aria-invalid={errorFor(errors ?? {}, name) ? 'true' : undefined}
        className={`${fieldBase} ${errorFor(errors ?? {}, name) ? 'border-red-500' : 'border-neutral-300'}`}
        {...props}
      />
      {errorFor(errors ?? {}, name) && (
        <p className="mt-1 text-xs text-red-600">{errorFor(errors ?? {}, name)}</p>
      )}
    </div>
  );
}

export function SelectField({
  name,
  label,
  errors,
  options,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  name: string;
  label: string;
  errors?: Errors;
  options: { value: string; label: string }[];
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-neutral-700">
        {label}
      </label>
      <select
        id={name}
        name={name}
        aria-invalid={errorFor(errors ?? {}, name) ? 'true' : undefined}
        className={`${fieldBase} ${errorFor(errors ?? {}, name) ? 'border-red-500' : 'border-neutral-300'}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorFor(errors ?? {}, name) && (
        <p className="mt-1 text-xs text-red-600">{errorFor(errors ?? {}, name)}</p>
      )}
    </div>
  );
}

export function CheckboxField({
  name,
  label,
  defaultChecked,
  hint,
  className,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={`flex cursor-pointer items-start gap-2 text-sm text-neutral-700 ${className ?? ''}`}>
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:outline-primary-500"
      />
      <span>
        {label}
        {hint && <span className="mt-0.5 block text-xs text-neutral-500">{hint}</span>}
      </span>
    </label>
  );
}

export function CheckboxGroup({
  name,
  legend,
  options,
  defaultValues,
  className,
}: {
  name: string;
  legend: string;
  options: { value: string; label: string }[];
  defaultValues?: string[];
  className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className="mb-2 text-sm font-medium text-neutral-700">{legend}</legend>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              name={name}
              value={option.value}
              defaultChecked={defaultValues?.includes(option.value)}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:outline-primary-500"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}