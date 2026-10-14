import { describe, expect, it } from "vitest"
import { certificateTextFromFile, derToPem, fingerprint, parseCertificates } from "./logic"

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

const RSA_PEM = `-----BEGIN CERTIFICATE-----
MIIDLTCCAhWgAwIBAgIUduOKnS+k+KFrmODenzUde/AmPD4wDQYJKoZIhvcNAQEL
BQAwJjETMBEGA1UEAwwKS29waSBQYWhpdDEPMA0GA1UECgwGV2FydW5nMB4XDTI2
MTAxNDE0MjEwMVoXDTI2MTExMzE0MjEwMVowJjETMBEGA1UEAwwKS29waSBQYWhp
dDEPMA0GA1UECgwGV2FydW5nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKC
AQEA2tCGuo5eMSZDMHvPXbILhwM/K9B+YN8l6wcuk7lvWD3lfeSx9dENhnDIPKLe
DdjDqt4mwyysTwfAdwEbkTA3KG24bOOHkoTlLAN+nIJycuNPI8Y0pZkK7WzamTSE
yDcfeZfklOhzGz6YAxuaGUuQxfcf6GHEwsr0M9H567pXVWC3YkMaM+E21EW6jFhe
Hr7QYBD1jKimsCmEVKVLGOi7dCKDttVJj0lrJXlSBeHu3OEoXr+zdo/xwEo6dNbS
fmN6gzKNUf5rtQb5D9Anv+ZAqeBVQb58IEJXjPjy0gxpWxxLi4gaC0D33yawhZFu
UamAltCD0FxzAqqE//crXE6QewIDAQABo1MwUTAdBgNVHQ4EFgQU6MiIcdCQh8jb
llhlavW6410+DTwwHwYDVR0jBBgwFoAU6MiIcdCQh8jbllhlavW6410+DTwwDwYD
VR0TAQH/BAUwAwEB/zANBgkqhkiG9w0BAQsFAAOCAQEAlx7p4SKltPm+XJRy4T7W
XCjpzzLFg9wu+6hE0ZHZSk8/eNTEiFEJSXrsjK8E0AYm8E8pCDyFdoOm5uiRigg+
o0crue/MBckPhIkQssSUG9MkIt8M7OcBLqDFAz7eQTV/KHAM19YbeAsF2kbbxb8V
c2DFkHlBGDoDlCx+gp07Em/UbhYANpxbtnTcEjBVsRAJoIjUR5NtHHKrTxv801QR
llvr8Az6jLm+Zgb4o1WpfU5xiEU4Wbm7VcaBiBIVk0bbkH4OvVZsQHVOWV2RuxeX
E6Sz5lLCxfYyQpw2pR6W4M9RW1ji2Juy3G8MGUw3l4yuASFCiaXyePj5J8sohqg2
FQ==
-----END CERTIFICATE-----`

describe("parseCertificates", () => {
  it("decodes the fields openssl reports for an EC certificate", () => {
    const [cert] = parseCertificates(EC_PEM)
    expect(cert).toMatchObject({
      version: 3,
      serial: "1A:2B:3C",
      subject: "CN=gulatools.dev, O=Gula Tools, C=ID",
      issuer: "CN=gulatools.dev, O=Gula Tools, C=ID",
      notBefore: new Date("2026-10-14T14:21:01Z"),
      notAfter: new Date("2036-10-11T14:21:01Z"),
      signatureAlgorithm: "ecdsa-with-SHA256",
      publicKey: { algorithm: "EC", curve: "P-256", size: 256 },
      subjectAltNames: ["DNS:gulatools.dev", "DNS:*.gulatools.dev", "IP:127.0.0.1", "email:halo@gulatools.dev"],
      basicConstraints: { ca: true, pathLength: 0 },
      keyUsage: ["Digital Signature", "Certificate Sign", "CRL Sign"],
    })
    expect(cert?.extensions).toContainEqual({ oid: "2.5.29.15", name: "Key Usage", critical: true })
  })

  it("reads RSA key size and exponent and strips the sign byte from serials", () => {
    const [cert] = parseCertificates(RSA_PEM)
    expect(cert).toMatchObject({
      serial: "76:E3:8A:9D:2F:A4:F8:A1:6B:98:E0:DE:9F:35:1D:7B:F0:26:3C:3E",
      subject: "O=Warung, CN=Kopi Pahit",
      signatureAlgorithm: "sha256WithRSAEncryption",
      publicKey: { algorithm: "RSA", size: 2048, exponent: 65537 },
      basicConstraints: { ca: true },
    })
  })

  it("reads every certificate in a pasted chain", () => {
    expect(
      parseCertificates(`${EC_PEM}
${RSA_PEM}`).map((cert) => cert.publicKey.algorithm),
    ).toEqual(["EC", "RSA"])
  })

  it("accepts bare Base64 DER and binary DER converted to PEM", () => {
    const [cert] = parseCertificates(EC_PEM)
    if (!cert) throw new Error("missing certificate")
    const bare = EC_PEM.replace(/-----[A-Z ]+-----/g, "")
    expect(parseCertificates(bare)[0]?.serial).toBe("1A:2B:3C")
    expect(parseCertificates(derToPem(cert.der))[0]?.serial).toBe("1A:2B:3C")
  })

  it("loads both PEM text files and binary DER files", () => {
    const [cert] = parseCertificates(EC_PEM)
    if (!cert) throw new Error("missing certificate")
    expect(certificateTextFromFile(new TextEncoder().encode(EC_PEM))).toBe(EC_PEM)
    expect(parseCertificates(certificateTextFromFile(cert.der))[0]?.serial).toBe("1A:2B:3C")
  })

  it("matches the fingerprints openssl prints", async () => {
    const [cert] = parseCertificates(EC_PEM)
    if (!cert) throw new Error("missing certificate")
    expect(await fingerprint(cert.der, "SHA-256")).toBe(
      "ED:93:3D:F8:75:53:02:19:04:7C:3B:78:80:84:38:57:3D:A9:99:1F:60:56:4B:51:46:6E:59:7B:C9:D1:C5:EC",
    )
    expect(await fingerprint(cert.der, "SHA-1")).toBe("2F:B1:5D:71:FB:9A:3D:54:4C:54:9C:C2:B1:62:5B:B0:72:1A:24:25")
  })

  it("refuses private keys and garbage with a clear message", () => {
    expect(() =>
      parseCertificates(`-----BEGIN PRIVATE KEY-----
abc
-----END PRIVATE KEY-----`),
    ).toThrow("private key")
    expect(() => parseCertificates("bukan sertifikat")).toThrow("sertifikat")
  })
})
