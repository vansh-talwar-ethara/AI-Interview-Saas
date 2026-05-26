import type { ApiResponse } from "@intervuex/shared";

export function success<T>(data: T, statusCode = 200): { statusCode: number; body: ApiResponse<T> } {
  return { statusCode, body: { success: true, data, error: null } };
}

export function failure(message: string, code: string, statusCode = 400): { statusCode: number; body: ApiResponse<null> } {
  return { statusCode, body: { success: false, data: null, error: `${code}: ${message}` } };
}
