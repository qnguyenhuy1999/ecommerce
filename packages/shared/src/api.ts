import { z } from 'zod';

// Generic API response envelope
export function createApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    data: dataSchema,
    message: z.string().optional(),
  });
}

export const apiErrorSchema = z.object({
  statusCode: z.number(),
  message: z.union([z.string(), z.array(z.string())]),
  error: z.string().optional(),
});

export const apiSuccessSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
});

export type ApiResponse<T extends z.ZodTypeAny> = z.infer<ReturnType<typeof createApiResponseSchema<T>>>;
export type ApiError = z.infer<typeof apiErrorSchema>;
