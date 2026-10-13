import { describe, expect, it } from "vitest"
import { base64ToBytes, bytesToBase64 } from "@/lib/bytes"
import { decryptText, encryptText } from "./logic"

describe("aes-gcm", () => {
  it("round-trips unicode text", async () => {
    const secret = await encryptText("rahasia gula — ünïcödé", "kunci")
    expect(await decryptText(secret, "kunci")).toBe("rahasia gula — ünïcödé")
  })

  it("uses a fresh salt and iv each time", async () => {
    expect(await encryptText("x", "k")).not.toBe(await encryptText("x", "k"))
  })

  it("rejects the wrong password", async () => {
    const secret = await encryptText("x", "benar")
    await expect(decryptText(secret, "salah")).rejects.toThrow("Password salah")
  })

  it("detects tampering", async () => {
    const bytes = base64ToBytes(await encryptText("data penting", "k"))
    bytes[bytes.length - 1] = (bytes[bytes.length - 1] ?? 0) ^ 1
    await expect(decryptText(bytesToBase64(bytes), "k")).rejects.toThrow("diubah")
  })

  it("rejects truncated payloads and empty passwords", async () => {
    await expect(decryptText("AAAA", "k")).rejects.toThrow("pendek")
    await expect(encryptText("x", "")).rejects.toThrow("kosong")
  })
})
