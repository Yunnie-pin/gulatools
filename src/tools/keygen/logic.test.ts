import { describe, expect, it } from "vitest"
import { signToken, verifySignature } from "../jwt/logic"
import { convertKey, generateKeys } from "./logic"

describe("generateKeys", () => {
  it.each(["rsa-2048", "p256", "p521", "ed25519"] as const)("creates a %s pair usable for JWT", async (type) => {
    const keys = await generateKeys(type)
    expect(keys.publicPem).toMatch(/^-----BEGIN PUBLIC KEY-----/)
    expect(keys.privatePem).toMatch(/^-----BEGIN PRIVATE KEY-----/)
    expect(JSON.parse(keys.privateJwk)).toHaveProperty("d")
    expect(JSON.parse(keys.publicJwk)).not.toHaveProperty("d")

    const token = await signToken({
      alg: keys.alg,
      payload: "{}",
      key: keys.privatePem,
      expiresIn: "",
      issuedAt: false,
    })
    expect(await verifySignature(token, keys.publicPem)).toBe(true)
  })
})

const EC_PEM = `-----BEGIN CERTIFICATE-----
MIICEjCCAbigAwIBAgIDGis8MAoGCCqGSM49BAMCMDoxCzAJBgNVBAYTAklEMRMw
EQYDVQQKDApHdWxhIFRvb2xzMRYwFAYDVQQDDA1ndWxhdG9vbHMuZGV2MB4XDTI2
MTAxNDE0MjEwMVoXDTM2MTAxMTE0MjEwMVowOjELMAkGA1UEBhMCSUQxEzARBgNV
BAoMCkd1bGEgVG9vbHMxFjAUBgNVBAMMDWd1bGF0b29scy5kZXYwWTATBgcqhkjO
PQIBBggqhkjOPQMBBwNCAATGnZ0eF547IwlXeoWD7sq+hIfSnkteuG1AaedxQT+r
r+aWruZIbSzDcPRV7E4yrgZQtyTMom/mg6qv+12ZEv+do4GsMIGpMB0GA1UdDgQW
BBSUr/NHRPNs5xhYu6yHT6JB9aViZTAfBgNVHSMEGDAWgBSUr/NHRPNs5xhYu6yH
T6JB9aViZTBDBgNVHREEPDA6gg1ndWxhdG9vbHMuZGV2gg8qLmd1bGF0b29scy5k
ZXaHBH8AAAGBEmhhbG9AZ3VsYXRvb2xzLmRldjASBgNVHRMBAf8ECDAGAQH/AgEA
MA4GA1UdDwEB/wQEAwIBhjAKBggqhkjOPQQDAgNIADBFAiEAr5dFPiJcTh7EJMMr
jTiD7PNJMLsI2tZLkDgdpKq6cWQCIDmJGJaumx6WT6JTkTkM8ZUej8n03NIYQDGj
wa4nf7FP
-----END CERTIFICATE-----`

const output = (result: Awaited<ReturnType<typeof convertKey>>, title: string) =>
  result.outputs.find((item) => item.title === title)?.value ?? ""

describe("convertKey", () => {
  it.each(["rsa-2048", "p384", "ed25519"] as const)(
    "round-trips a %s private key between PEM and JWK",
    async (type) => {
      const keys = await generateKeys(type)
      const fromPem = await convertKey(keys.privatePem)
      expect(JSON.parse(output(fromPem, "Private key (JWK)"))).toEqual(JSON.parse(keys.privateJwk))
      expect(output(fromPem, "Public key (PEM)")).toBe(keys.publicPem)

      const fromJwk = await convertKey(keys.privateJwk)
      expect(output(fromJwk, "Private key (PEM, PKCS#8)")).toBe(keys.privatePem)
      expect(fromJwk.thumbprint).toBe(fromPem.thumbprint)
    },
  )

  it("converts a public key without inventing a private half", async () => {
    const keys = await generateKeys("p256")
    const result = await convertKey(keys.publicPem)
    expect(result.alg).toBe("ES256")
    expect(result.outputs.map((item) => item.title)).toEqual(["Public key (PEM)", "Public key (JWK)"])
  })

  it("extracts the public key from an X.509 certificate", async () => {
    const result = await convertKey(EC_PEM)
    expect(JSON.parse(output(result, "Public key (JWK)"))).toMatchObject({ kty: "EC", crv: "P-256" })
  })

  it("keeps an alg the JWK already declares", async () => {
    const keys = await generateKeys("rsa-2048")
    const jwk = { ...JSON.parse(keys.publicJwk), alg: "PS256" }
    expect(JSON.parse(output(await convertKey(JSON.stringify(jwk)), "Public key (JWK)")).alg).toBe("PS256")
  })

  it("explains how to handle PKCS#1 and SEC1 keys and rejects unknown input", async () => {
    await expect(convertKey("-----BEGIN RSA PRIVATE KEY-----\nAAAA\n-----END RSA PRIVATE KEY-----")).rejects.toThrow(
      "openssl pkcs8",
    )
    await expect(convertKey('{"kty":"oct","k":"AAAA"}')).rejects.toThrow("tidak dikenali")
    await expect(convertKey("hello")).rejects.toThrow("tidak dikenali")
  })
})
