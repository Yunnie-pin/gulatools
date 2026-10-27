import { defineMessages, type Locale } from "./locale"

const catalogs = defineMessages(
  {
    invalidBase64: () => "Input bukan Base64 yang valid",
    notUtf8: () => "Hasil decode bukan teks UTF-8 (kemungkinan data biner)",
    brokenShareLink: () => "Tautan yang dibagikan rusak atau tidak lengkap",
    shareTooLarge: () => "Input terlalu besar untuk dibagikan lewat tautan",
    emptyPassword: () => "Password tidak boleh kosong",
    ciphertextTooShort: () => "Data terenkripsi terlalu pendek atau terpotong",
    wrongPasswordOrTampered: () => "Password salah atau data sudah diubah",
    invalidArgon2: () => "Bukan hash Argon2 yang valid (format: $argon2id$v=19$m=…,t=…,p=…$salt$hash)",
    invalidBcrypt: () => "Bukan hash bcrypt yang valid (format: $2b$10$…, 60 karakter)",
    unknownColor: () => "Warna tidak dikenali. Contoh: #ff6b5e, rgb(255 107 94), hsl(5 100% 68%), coral",
    invalidCron: (detail: string) => `Ekspresi cron tidak valid: ${detail}`,
    invalidXml: (message: string, line: number) => `XML tidak valid: ${message} (baris ${line})`,
    invalidCsv: (message: string, line: number) => `CSV tidak valid: ${message} (baris ${line})`,
    csvNeedsRows: () => "CSV membutuhkan array berisi objek",
    tomlNeedsObject: () => "TOML membutuhkan objek di level teratas",
    emptyKey: () => "Kunci tidak boleh kosong",
    emptyImage: () => "Tempel data URI atau string Base64",
    notAnImage: (type: string) => `Data URI bertipe ${type}, bukan gambar`,
    invalidImageData: () => "Bukan data URI atau Base64 yang valid",
    emptyJsonPath: () => "Masukkan ekspresi JSONPath, misalnya $.store.book[*].title",
    jsonPathNeedsRoot: () => "Ekspresi JSONPath harus diawali dengan $",
    invalidJwt: () => "Bukan JWT yang valid. Format yang diharapkan: header.payload.signature",
    publicKeyFormat: () => "Kunci publik harus berupa PEM (SPKI atau X.509) atau JWK",
    unsignedJwt: () => "Token tidak ditandatangani (alg: none)",
    privateKeyFormat: () => "Private key harus berupa PKCS#8 PEM (-----BEGIN PRIVATE KEY-----) atau JWK",
    payloadNotJson: () => "Payload harus JSON yang valid",
    payloadNotObject: () => "Payload harus berupa objek JSON",
    emptySecret: () => "Secret tidak boleh kosong",
    emptyPrivateKey: () => "Private key wajib diisi",
    noCharset: () => "Pilih minimal satu jenis karakter",
    emptyQrText: () => "Isi teks atau URL untuk dijadikan QR code",
    noQrFound: () => "Tidak ada QR code yang terbaca di gambar ini",
    noCanvas: () => "Browser tidak mendukung pembacaan gambar",
    regexTimeout: () => "Regex berjalan lebih dari 1 detik dan dihentikan (kemungkinan catastrophic backtracking)",
    emptyTimestamp: () => "Masukkan Unix timestamp atau tanggal",
    dateOutOfRange: () => "Di luar rentang tanggal yang didukung",
    unknownDateFormat: () => "Format tidak dikenali. Contoh: 1760000000, 2026-10-13T08:00:00Z",
    invalidPercentEscape: () => "Input berisi escape sequence (%XX) yang tidak valid",
    emptyNumber: () => "Masukkan bilangan",
    invalidDigits: (base: number) => `Digit tidak valid untuk basis ${base}`,
    invalidChmod: () => "Mode tidak valid. Contoh: 755, 4755, rwxr-xr-x",
    invalidCidr: () => "Format tidak valid. Contoh: 192.168.1.0/24, 10.0.0.1 255.0.0.0, atau 2001:db8::/32",
    invalidNetmask: () => "Netmask harus berupa bit 1 yang berurutan, misalnya 255.255.255.0",
    invalidJsonString: () => "Bukan isi string JSON yang valid. Periksa escape sequence dan tanda kutip",
    invalidSchemaJson: (detail: string) => `Schema bukan JSON yang valid: ${detail}`,
    invalidDataJson: (detail: string) => `Data bukan JSON yang valid: ${detail}`,
    invalidSchema: (detail: string) => `Schema tidak valid: ${detail}`,
    invalidCertificate: () =>
      "Bukan sertifikat X.509 yang valid. Tempel PEM (-----BEGIN CERTIFICATE-----) atau Base64 DER",
    privateKeyNotCertificate: () => "Ini private key, bukan sertifikat. Jangan tempel private key di sini",
    unreadableImage: () => "File ini tidak bisa dibaca sebagai gambar",
    unsupportedImageFormat: (format: string) => `Browser ini tidak bisa menyimpan gambar sebagai ${format}`,
    invalidSvg: (detail: string) => `SVG tidak valid: ${detail}`,
    curlNotCurl: () => "Perintah harus diawali dengan curl",
    curlNoUrl: () => "Perintah curl tidak berisi URL",
    unclosedQuote: () => "Ada tanda kutip yang tidak ditutup",
    missingFlagValue: (flag: string) => `Opsi ${flag} membutuhkan nilai`,
    curlUnsupportedFlag: (flag: string) => `Opsi ${flag} (upload file atau multipart) belum didukung`,
    emptyTotpSecret: () => "Masukkan secret Base32 atau URI otpauth://",
    invalidBase32: () => "Secret bukan Base32 yang valid (hanya A–Z dan 2–7)",
    invalidOtpauth: () => "Bukan URI otpauth://totp/ yang valid",
    invalidOriginalJson: (detail: string) => `JSON asli tidak valid: ${detail}`,
    invalidModifiedJson: (detail: string) => `JSON yang diubah tidak valid: ${detail}`,
    invalidUrl: () => "Bukan URL absolut yang valid. Contoh: https://example.com/path?q=1",
    invalidSemverRange: () => "Bukan range semver yang valid. Contoh: ^1.2.0, ~2.3, >=1.0.0 <2 || 3.x",
    invalidCompressed: (format: string) => `Data ${format} rusak atau terpotong`,
    notDockerRun: () => "Perintah harus diawali dengan docker run",
    dockerNoImage: () => "Perintah docker run tidak berisi nama image",
    minifyFailed: (detail: string) => `Gagal minify: ${detail}`,
    invalidBase58: () => "Bukan Base58 yang valid (tanpa 0, O, I, dan l)",
    invalidHex: () => "Bukan hex yang valid. Contoh: 48656c6c6f atau 48 65 6c 6c 6f",
    unsupportedKey: () =>
      "Kunci tidak dikenali. Tempel PEM (PUBLIC KEY, PRIVATE KEY, atau CERTIFICATE) atau JWK RSA, EC P-256/384/521, atau Ed25519",
    legacyPem: () =>
      "Format PKCS#1/SEC1 belum didukung. Ubah dulu ke PKCS#8: openssl pkcs8 -topk8 -nocrypt -in key.pem",
  },
  {
    invalidBase64: () => "Input is not valid Base64",
    notUtf8: () => "Decoded data is not UTF-8 text (probably binary)",
    brokenShareLink: () => "The shared link is broken or incomplete",
    shareTooLarge: () => "Input is too large to share as a link",
    emptyPassword: () => "Password must not be empty",
    ciphertextTooShort: () => "Encrypted data is too short or truncated",
    wrongPasswordOrTampered: () => "Wrong password, or the data has been modified",
    invalidArgon2: () => "Not a valid Argon2 hash (format: $argon2id$v=19$m=…,t=…,p=…$salt$hash)",
    invalidBcrypt: () => "Not a valid bcrypt hash (format: $2b$10$…, 60 characters)",
    unknownColor: () => "Unrecognized color. Examples: #ff6b5e, rgb(255 107 94), hsl(5 100% 68%), coral",
    invalidCron: (detail) => `Invalid cron expression: ${detail}`,
    invalidXml: (message, line) => `Invalid XML: ${message} (line ${line})`,
    invalidCsv: (message, line) => `Invalid CSV: ${message} (line ${line})`,
    csvNeedsRows: () => "CSV needs an array of objects",
    tomlNeedsObject: () => "TOML needs an object at the top level",
    emptyKey: () => "Key must not be empty",
    emptyImage: () => "Paste a data URI or a Base64 string",
    notAnImage: (type) => `Data URI has type ${type}, not an image`,
    invalidImageData: () => "Not a valid data URI or Base64",
    emptyJsonPath: () => "Enter a JSONPath expression, for example $.store.book[*].title",
    jsonPathNeedsRoot: () => "A JSONPath expression must start with $",
    invalidJwt: () => "Not a valid JWT. Expected format: header.payload.signature",
    publicKeyFormat: () => "The public key must be PEM (SPKI or X.509) or JWK",
    unsignedJwt: () => "The token is not signed (alg: none)",
    privateKeyFormat: () => "The private key must be PKCS#8 PEM (-----BEGIN PRIVATE KEY-----) or JWK",
    payloadNotJson: () => "Payload must be valid JSON",
    payloadNotObject: () => "Payload must be a JSON object",
    emptySecret: () => "Secret must not be empty",
    emptyPrivateKey: () => "A private key is required",
    noCharset: () => "Choose at least one character set",
    emptyQrText: () => "Enter text or a URL to turn into a QR code",
    noQrFound: () => "No QR code could be read from this image",
    noCanvas: () => "This browser cannot read images",
    regexTimeout: () => "The regex ran for more than 1 second and was stopped (likely catastrophic backtracking)",
    emptyTimestamp: () => "Enter a Unix timestamp or a date",
    dateOutOfRange: () => "Outside the supported date range",
    unknownDateFormat: () => "Unrecognized format. Examples: 1760000000, 2026-10-13T08:00:00Z",
    invalidPercentEscape: () => "Input contains an invalid escape sequence (%XX)",
    emptyNumber: () => "Enter a number",
    invalidDigits: (base) => `Invalid digits for base ${base}`,
    invalidChmod: () => "Invalid mode. Examples: 755, 4755, rwxr-xr-x",
    invalidCidr: () => "Invalid format. Examples: 192.168.1.0/24, 10.0.0.1 255.0.0.0, or 2001:db8::/32",
    invalidNetmask: () => "The netmask must be contiguous 1 bits, for example 255.255.255.0",
    invalidJsonString: () => "Not a valid JSON string body. Check escape sequences and quotes",
    invalidSchemaJson: (detail) => `Schema is not valid JSON: ${detail}`,
    invalidDataJson: (detail) => `Data is not valid JSON: ${detail}`,
    invalidSchema: (detail) => `Invalid schema: ${detail}`,
    invalidCertificate: () => "Not a valid X.509 certificate. Paste PEM (-----BEGIN CERTIFICATE-----) or Base64 DER",
    privateKeyNotCertificate: () => "This is a private key, not a certificate. Do not paste private keys here",
    unreadableImage: () => "This file cannot be read as an image",
    unsupportedImageFormat: (format) => `This browser cannot save images as ${format}`,
    invalidSvg: (detail) => `Invalid SVG: ${detail}`,
    curlNotCurl: () => "The command must start with curl",
    curlNoUrl: () => "The curl command has no URL",
    unclosedQuote: () => "A quote is not closed",
    missingFlagValue: (flag) => `Option ${flag} needs a value`,
    curlUnsupportedFlag: (flag) => `Option ${flag} (file upload or multipart) is not supported yet`,
    emptyTotpSecret: () => "Enter a Base32 secret or an otpauth:// URI",
    invalidBase32: () => "The secret is not valid Base32 (A–Z and 2–7 only)",
    invalidOtpauth: () => "Not a valid otpauth://totp/ URI",
    invalidOriginalJson: (detail) => `Original JSON is invalid: ${detail}`,
    invalidModifiedJson: (detail) => `Modified JSON is invalid: ${detail}`,
    invalidUrl: () => "Not a valid absolute URL. Example: https://example.com/path?q=1",
    invalidSemverRange: () => "Not a valid semver range. Examples: ^1.2.0, ~2.3, >=1.0.0 <2 || 3.x",
    invalidCompressed: (format) => `The ${format} data is corrupt or truncated`,
    notDockerRun: () => "The command must start with docker run",
    dockerNoImage: () => "The docker run command has no image name",
    minifyFailed: (detail) => `Minify failed: ${detail}`,
    invalidBase58: () => "Not valid Base58 (no 0, O, I, or l)",
    invalidHex: () => "Not valid hex. Examples: 48656c6c6f or 48 65 6c 6c 6f",
    unsupportedKey: () =>
      "Unrecognized key. Paste a PEM (PUBLIC KEY, PRIVATE KEY, or CERTIFICATE) or an RSA, EC P-256/384/521, or Ed25519 JWK",
    legacyPem: () =>
      "PKCS#1/SEC1 keys are not supported yet. Convert to PKCS#8 first: openssl pkcs8 -topk8 -nocrypt -in key.pem",
  },
)

type Catalog = (typeof catalogs)["id"]

export type ErrorKey = keyof Catalog

type Args<K extends ErrorKey> = Parameters<Catalog[K]>

function render<K extends ErrorKey>(locale: Locale, key: K, args: Args<K>): string {
  const message = catalogs[locale][key] as (...values: Args<K>) => string
  return message(...args)
}

export class LocalizedError<K extends ErrorKey = ErrorKey> extends Error {
  readonly key: K
  readonly args: Args<K>

  constructor(key: K, ...args: Args<K>) {
    super(render("id", key, args))
    this.key = key
    this.args = args
  }

  in(locale: Locale): string {
    return render(locale, this.key, this.args)
  }
}
