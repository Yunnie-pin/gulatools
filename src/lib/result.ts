import { LocalizedError } from "@/i18n/errors"
import { getLocale } from "@/i18n/locale"

export type Result<T> = { ok: true; value: T } | { ok: false; error: string }

export function errorMessage(error: unknown): string {
  if (error instanceof LocalizedError) return error.in(getLocale())
  return error instanceof Error ? error.message : String(error)
}

export function attempt<T>(fn: () => T): Result<T> {
  try {
    return { ok: true, value: fn() }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}

export async function settle<T>(fn: () => T | Promise<T>): Promise<Result<T>> {
  try {
    return { ok: true, value: await fn() }
  } catch (error) {
    return { ok: false, error: errorMessage(error) }
  }
}
