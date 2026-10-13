import { expose } from "comlink"
import { type Argon2Params, type Argon2Variant, hashArgon2, hashScrypt, type ScryptParams, verifyArgon2 } from "./logic"

async function timed<T>(task: Promise<T>) {
  const started = performance.now()
  const value = await task
  return { value, ms: performance.now() - started }
}

const api = {
  argon2: (variant: Argon2Variant, password: string, params: Argon2Params) =>
    timed(hashArgon2(variant, password, params)),
  scrypt: (password: string, params: ScryptParams) => timed(hashScrypt(password, params)),
  verify: verifyArgon2,
}

export type KdfApi = typeof api

expose(api)
