import { z } from 'zod/v4';

const HttpStatusMessages: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  408: 'Request Timeout',
  409: 'Conflict',
  429: 'Too Many Requests',
  422: 'Unprocessable Entity',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};

/**
 * Converts long and nested zod errors to a more readable format by flattening
 * union errors and grouping similar issues by field name and message.
 *
 * @param error - The ZodError to reduce
 * @returns A formatted string with the first 3 unique error messages
 */
export function reduceZodError(error: z.ZodError): string {
  const extractIssues = (issues: z.ZodIssue[]): z.ZodIssue[] => {
    const flatIssues: z.ZodIssue[] = [];

    for (const issue of issues) {
      if (issue.code === 'invalid_union') {
        // In Zod v4, invalid_union has an 'errors' property that is $ZodIssue[][]
        const unionIssue = issue as z.ZodIssue & { errors: z.ZodIssue[][] };
        for (const unionErrorIssues of unionIssue.errors) {
          flatIssues.push(...extractIssues(unionErrorIssues));
        }
      } else {
        flatIssues.push(issue);
      }
    }

    return flatIssues;
  };

  const allIssues = extractIssues(error.issues);
  const errorGroups = new Map<string, z.ZodIssue>();

  for (const issue of allIssues) {
    const fieldName = issue.path.length > 0 ? issue.path[issue.path.length - 1] : 'root';
    const groupKey = `${issue.message}:${String(fieldName)}`;

    if (!errorGroups.has(groupKey)) {
      errorGroups.set(groupKey, issue);
    }
  }

  const uniqueIssues = Array.from(errorGroups.values());

  const formatted = uniqueIssues.map((issue) => {
    const fieldName = issue.path.length > 0 ? issue.path[issue.path.length - 1] : 'root';

    if (issue.path.length > 0 && typeof fieldName === 'string') {
      return `${issue.message} for ${fieldName}`;
    } else if (issue.path.length > 0) {
      return `${issue.message} at ${issue.path.join('.')}`;
    } else {
      return issue.message;
    }
  });

  return formatted.slice(0, 3).join('\n');
}

/**
 * Handles HTTP responses by checking status codes and parsing JSON with Zod validation.
 * Converts HTTP errors to a short and summarized format for display in toast.
 *
 * @param response - The fetch Response object
 * @param schema - Zod schema to validate the response data
 * @returns Parsed and validated response data
 * @throws Error with formatted message for non-2xx responses
 */
export async function handleHttpResponse<Z extends z.ZodTypeAny>(response: Response, schema: Z): Promise<z.infer<Z>> {
  if (!response.ok) {
    const statusText = HttpStatusMessages[response.status] || 'Unknown Error';
    let errorMessage = `HTTP status ${response.status} - ${statusText}`;
    try {
      const clone = response.clone();
      const errorJson: unknown = await clone.json();
      if (errorJson && typeof errorJson === 'object') {
        if (
          'detail' in errorJson &&
          typeof (errorJson as { detail: unknown }).detail === 'string' &&
          (errorJson as { detail: string }).detail !== statusText
        ) {
          errorMessage += `\n\n • ${(errorJson as { detail: string }).detail}`;
        } else if (
          'error' in errorJson &&
          typeof (errorJson as { error: unknown }).error === 'string' &&
          (errorJson as { error: string }).error !== statusText
        ) {
          errorMessage += `\n${(errorJson as { error: string }).error}`;
        } else if (
          'message' in errorJson &&
          typeof (errorJson as { message: unknown }).message === 'string' &&
          (errorJson as { message: string }).message !== statusText
        ) {
          errorMessage += `\n\n • ${(errorJson as { message: string }).message}`;
        }
      }
    } catch {
      try {
        const clone = response.clone();
        const text = await clone.text();
        if (text) errorMessage += ` - ${text}`;
      } catch {
        // ignore additional errors
      }
    }
    throw new Error(errorMessage);
  }

  /* Handle empty JSON responses (204 No Content) by checking headers and attempting schema validation with empty objects or text fallback.
  Otherwise the frontend displays an error when resending verification email, even though the backend actually sends it.*/
  const contentLength = response.headers.get('content-length');
  const contentType = response.headers.get('content-type');

  if (
    response.status === 204 ||
    contentLength === '0' ||
    (!contentType?.includes('application/json') && !contentLength)
  ) {
    try {
      return schema.parse({});
    } catch {
      return schema.parse((await response.text()) || '');
    }
  }

  try {
    const json: unknown = await response.json();
    return schema.parse(json);
  } catch (parseError) {
    try {
      const text = await response.text();
      return schema.parse(text || {});
    } catch {
      throw parseError;
    }
  }
}
