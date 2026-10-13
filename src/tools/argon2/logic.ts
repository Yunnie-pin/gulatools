import { argon2d, argon2i, argon2id, argon2Verify, scrypt } from "hash-wasm"
import { bytesToHex } from "@/lib/bytes"

export const ARGON2_VARIANTS = { argon2id, argon2i, argon2d } as const

export type Argon2Variant = keyof typeof ARGON2_VARIANTS

export type Argon2Params = {
  iterations: number
  memoryMiB: number
  parallelism: number
}

export type ScryptParams = {
  costLog2: number
  blockSize: number
  parallelism: number
}

export type Argon2Info = Argon2Params & { variant: Argon2Variant }

const HASH_LENGTH = 32

export const randomSalt = () => crypto.getRandomValues(new Uint8Array(16))

export function hashArgon2(variant: Argon2Variant, password: string, params: Argon2Params, salt = randomSalt()) {
  return ARGON2_VARIANTS[variant]({
    password,
    salt,
    iterations: params.iterations,
    memorySize: params.memoryMiB * 1024,
    parallelism: params.parallelism,
    hashLength: HASH_LENGTH,
    outputType: "encoded",
  })
}

export const verifyArgon2 = (password: string, hash: string) => argon2Verify({ password, hash: hash.trim() })

export async function hashScrypt(password: string, params: ScryptParams, salt = randomSalt()) {
  const hash = await scrypt({
    password,
    salt,
    costFactor: 2 ** params.costLog2,
    blockSize: params.blockSize,
    parallelism: params.parallelism,
    hashLength: HASH_LENGTH,
    outputType: "hex",
  })
  return { hash, salt: bytesToHex(salt) }
}

const ARGON2_PATTERN = /^\$(argon2id|argon2i|argon2d)\$v=19\$m=(\d+),t=(\d+),p=(\d+)\$[A-Za-z0-9+/]+\$[A-Za-z0-9+/]+$/

export function parseArgon2(hash: string): Argon2Info {
  const match = ARGON2_PATTERN.exec(hash.trim())
  if (!match) throw new Error("Bukan hash Argon2 yang valid (format: $argon2id$v=19$m=…,t=…,p=…$salt$hash)")
  const [, variant, memory = "0", iterations = "0", parallelism = "0"] = match
  return {
    variant: variant as Argon2Variant,
    memoryMiB: Number(memory) / 1024,
    iterations: Number(iterations),
    parallelism: Number(parallelism),
  }
}
