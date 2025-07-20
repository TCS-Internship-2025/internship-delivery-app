import { enqueueSnackbar } from 'notistack';
import type z from 'zod';

import type { CustomSnackbarOptions } from '@/providers/ToastProvider';

/**
 * Retrieves and parses a value from sessionStorage, validates it with a Zod schema,
 * and optionally converts specified fields to Date objects.
 *
 * @template T - The expected return type after schema validation.
 * @param key - The sessionStorage key to retrieve.
 * @param schema - The Zod schema to validate and parse the data.
 * @param dateFields - An array of field names that should be converted to Date objects.
 * @returns The parsed and validated object, or undefined if not found or invalid.
 *
 * @example
 * const user = parseFromStorage('USER_KEY', userSchema, ['createdAt', 'updatedAt']);
 */
export function parseFromStorage<T>(key: string, schema: z.ZodType<T>, dateFields: string[] = []): T | undefined {
  const raw = sessionStorage.getItem(key);
  if (!raw) return undefined;
  try {
    const json = JSON.parse(raw) as Record<string, unknown>;
    for (const field of dateFields) {
      if (json[field] && typeof json[field] === 'string') {
        json[field] = new Date(json[field]);
      }
    }
    return schema.parse(json);
  } catch {
    enqueueSnackbar(`Error parsing ${key} from sessionStorage:`, {
      variant: 'error',
      headerMessage: 'Something went wrong',
    } as CustomSnackbarOptions);
    return undefined;
  }
}
