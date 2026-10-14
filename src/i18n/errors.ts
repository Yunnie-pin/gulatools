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
