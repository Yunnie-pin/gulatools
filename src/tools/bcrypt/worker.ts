import { compare, hash } from "bcryptjs"
import { expose } from "comlink"

const api = {
  async hash(password: string, cost: number) {
    const started = performance.now()
    const value = await hash(password, cost)
    return { hash: value, ms: performance.now() - started }
  },
  compare: (password: string, hashed: string): Promise<boolean> => compare(password, hashed),
}

export type BcryptApi = typeof api

expose(api)
