import type { Locale } from "@/i18n/locale"

type AboutText = { intro: string; uses: readonly string[] }

export type ToolAbout = Record<Locale, AboutText>

export const about: Record<string, ToolAbout> = {
  "json-formatter": {
    id: {
      intro:
        "JSON Formatter merapikan JSON yang berantakan menjadi terindentasi dan mudah dibaca, atau sebaliknya memadatkannya menjadi satu baris. Kesalahan sintaks ditunjukkan lengkap dengan posisinya.",
      uses: [
        "Membaca response API yang dikirim dalam satu baris panjang.",
        "Mencari koma atau kurung kurawal yang hilang di file konfigurasi.",
        "Memperkecil payload JSON sebelum disimpan atau dikirim.",
      ],
    },
    en: {
      intro:
        "JSON Formatter turns messy JSON into readable, indented output, or minifies it back into a single line. Syntax errors are reported with their exact position.",
      uses: [
        "Reading API responses that arrive as one long line.",
        "Finding a missing comma or brace in a config file.",
        "Shrinking a JSON payload before storing or sending it.",
      ],
    },
  },
  "code-formatter": {
    id: {
      intro:
        "Code Formatter memakai Prettier untuk merapikan JavaScript, TypeScript, CSS, HTML, Markdown, GraphQL, dan YAML dengan gaya yang konsisten. Hasilnya sama seperti menjalankan Prettier di proyek, tanpa perlu instalasi.",
      uses: [
        "Merapikan potongan kode dari Stack Overflow atau chat sebelum ditempel ke proyek.",
        "Menyeragamkan indentasi file YAML atau HTML.",
        "Mengecek hasil Prettier tanpa membuka editor.",
      ],
    },
    en: {
      intro:
        "Code Formatter uses Prettier to format JavaScript, TypeScript, CSS, HTML, Markdown, GraphQL, and YAML in a consistent style. The output matches running Prettier in a project, with nothing to install.",
      uses: [
        "Cleaning up snippets from Stack Overflow or chat before pasting them into a project.",
        "Normalizing indentation in YAML or HTML files.",
        "Checking Prettier output without opening an editor.",
      ],
    },
  },
  "sql-formatter": {
    id: {
      intro:
        "SQL Formatter memecah query panjang menjadi baris dan indentasi yang jelas, dengan dialek PostgreSQL, MySQL, SQLite, SQL Server, dan lainnya. Keyword bisa diubah ke huruf besar agar struktur query lebih terlihat.",
      uses: [
        "Membaca query hasil ORM atau log yang tertulis dalam satu baris.",
        "Merapikan query sebelum code review atau dokumentasi.",
        "Memahami JOIN dan subquery yang bersarang dalam.",
      ],
    },
    en: {
      intro:
        "SQL Formatter breaks long queries into clear lines and indentation, with dialects for PostgreSQL, MySQL, SQLite, SQL Server, and more. Keywords can be uppercased so the query structure stands out.",
      uses: [
        "Reading ORM-generated or logged queries written on a single line.",
        "Tidying queries before a code review or in documentation.",
        "Understanding deeply nested JOINs and subqueries.",
      ],
    },
  },
  markdown: {
    id: {
      intro:
        "Markdown Preview menampilkan hasil GitHub Flavored Markdown secara langsung saat kamu mengetik, termasuk tabel, task list, dan blok kode. HTML hasilnya disanitasi dan bisa disalin.",
      uses: [
        "Menulis README atau deskripsi pull request dan melihat hasilnya sebelum dikirim.",
        "Mengubah catatan Markdown menjadi HTML yang aman ditempel ke CMS.",
        "Mengecek format tabel Markdown yang rumit.",
      ],
    },
    en: {
      intro:
        "Markdown Preview renders GitHub Flavored Markdown live as you type, including tables, task lists, and code blocks. The resulting HTML is sanitized and ready to copy.",
      uses: [
        "Drafting a README or pull request description and seeing the result before posting.",
        "Turning Markdown notes into HTML that is safe to paste into a CMS.",
        "Checking the layout of complex Markdown tables.",
      ],
    },
  },
  "svg-optimizer": {
    id: {
      intro:
        "SVG Optimizer memakai SVGO untuk membuang metadata editor, atribut yang tidak perlu, dan presisi angka berlebih dari file SVG. Ukuran sebelum dan sesudah serta pratinjaunya ditampilkan berdampingan.",
      uses: [
        "Memperkecil ikon hasil ekspor Figma, Illustrator, atau Inkscape.",
        "Menyiapkan SVG untuk ditanam inline di HTML atau komponen React.",
        "Mengurangi ukuran aset agar halaman lebih cepat dimuat.",
      ],
    },
    en: {
      intro:
        "SVG Optimizer uses SVGO to strip editor metadata, redundant attributes, and excess numeric precision from SVG files. Before and after sizes and previews are shown side by side.",
      uses: [
        "Shrinking icons exported from Figma, Illustrator, or Inkscape.",
        "Preparing SVGs to inline in HTML or React components.",
        "Cutting asset size so pages load faster.",
      ],
    },
  },
  curl: {
    id: {
      intro:
        "cURL Converter mengubah perintah curl menjadi kode JavaScript fetch, Python requests, atau Go net/http. Method, header, body, autentikasi Basic, dan cookie ikut diterjemahkan, termasuk format $'…' dari fitur Copy as cURL di DevTools.",
      uses: [
        "Memindahkan request dari DevTools browser atau dokumentasi API ke dalam kode.",
        "Membuat contoh request untuk dokumentasi dalam beberapa bahasa.",
        "Memahami apa saja yang dikirim oleh perintah curl yang panjang.",
      ],
    },
    en: {
      intro:
        "cURL Converter turns curl commands into JavaScript fetch, Python requests, or Go net/http code. Method, headers, body, Basic auth, and cookies are carried over, including the $'…' quoting from DevTools Copy as cURL.",
      uses: [
        "Moving a request from browser DevTools or API docs into code.",
        "Producing request examples for documentation in several languages.",
        "Understanding what a long curl command actually sends.",
      ],
    },
  },
  "data-converter": {
    id: {
      intro:
        "Data Converter mengubah data antar JSON, YAML, TOML, XML, dan CSV ke arah mana pun. Struktur bersarang dipertahankan sejauh format tujuan mendukungnya.",
      uses: [
        "Memindahkan konfigurasi dari YAML ke JSON atau TOML.",
        "Mengubah export CSV menjadi JSON untuk diolah di kode.",
        "Membaca response XML lama dalam bentuk JSON yang lebih ringkas.",
      ],
    },
    en: {
      intro:
        "Data Converter translates data between JSON, YAML, TOML, XML, and CSV in any direction. Nested structures are preserved as far as the target format allows.",
      uses: [
        "Moving configuration from YAML to JSON or TOML.",
        "Turning a CSV export into JSON for use in code.",
        "Reading legacy XML responses as more compact JSON.",
      ],
    },
  },
  "json-to-ts": {
    id: {
      intro:
        "JSON to TypeScript membuat interface TypeScript atau schema Zod dari contoh JSON. Field yang tidak selalu ada ditandai opsional, dan nilai null menjadi tipe nullable.",
      uses: [
        "Membuat tipe untuk response API pihak ketiga tanpa menulis manual.",
        "Menyiapkan schema Zod untuk validasi data runtime.",
        "Mendokumentasikan bentuk data dari contoh payload.",
      ],
    },
    en: {
      intro:
        "JSON to TypeScript generates TypeScript interfaces or Zod schemas from sample JSON. Fields that are not always present become optional, and null values become nullable types.",
      uses: [
        "Typing third-party API responses without writing them by hand.",
        "Setting up a Zod schema for runtime data validation.",
        "Documenting the shape of data from a sample payload.",
      ],
    },
  },
  jsonpath: {
    id: {
      intro:
        "JSONPath mengambil bagian tertentu dari dokumen JSON dengan ekspresi seperti $.store.book[*].author. Wildcard, recursive descent (..), slice, dan filter ?() didukung, dan hasilnya langsung terlihat.",
      uses: [
        "Menguji ekspresi JSONPath sebelum dipakai di kode, Postman, atau Kubernetes.",
        "Mengambil field tertentu dari response API yang besar.",
        "Memfilter elemen array berdasarkan nilai field-nya.",
      ],
    },
    en: {
      intro:
        "JSONPath extracts parts of a JSON document with expressions like $.store.book[*].author. Wildcards, recursive descent (..), slices, and ?() filters are supported, and results update live.",
      uses: [
        "Testing JSONPath expressions before using them in code, Postman, or Kubernetes.",
        "Pulling specific fields out of a large API response.",
        "Filtering array elements by the value of a field.",
      ],
    },
  },
  "json-schema": {
    id: {
      intro:
        "JSON Schema Validator memeriksa dokumen JSON terhadap JSON Schema draft-07, 2019-09, atau 2020-12 menggunakan Ajv. Setiap error ditampilkan dengan path lokasi dan keyword yang gagal.",
      uses: [
        "Memastikan payload API sesuai kontrak sebelum dikirim.",
        "Menguji schema baru dengan contoh data yang valid dan tidak valid.",
        "Melacak penyebab error validasi yang muncul di backend.",
      ],
    },
    en: {
      intro:
        "JSON Schema Validator checks a JSON document against a draft-07, 2019-09, or 2020-12 JSON Schema using Ajv. Every error is shown with its location path and the failing keyword.",
      uses: [
        "Making sure an API payload matches its contract before sending it.",
        "Testing a new schema against valid and invalid sample data.",
        "Tracking down validation errors raised by a backend.",
      ],
    },
  },
  timestamp: {
    id: {
      intro:
        "Timestamp mengonversi Unix timestamp dalam detik, milidetik, mikrodetik, atau nanodetik menjadi tanggal yang mudah dibaca, dan sebaliknya. Satuannya dideteksi otomatis dari jumlah digit.",
      uses: [
        "Membaca waktu dari log, database, atau klaim exp pada JWT.",
        "Membuat timestamp untuk tanggal tertentu saat menulis test atau query.",
        "Membandingkan waktu UTC dengan zona waktu lokal.",
      ],
    },
    en: {
      intro:
        "Timestamp converts Unix timestamps in seconds, milliseconds, microseconds, or nanoseconds into readable dates, and back. The unit is detected automatically from the number of digits.",
      uses: [
        "Reading times from logs, databases, or a JWT exp claim.",
        "Producing a timestamp for a specific date when writing tests or queries.",
        "Comparing UTC with your local time zone.",
      ],
    },
  },
  "number-base": {
    id: {
      intro:
        "Number Base mengonversi bilangan antara biner, oktal, desimal, dan heksadesimal tanpa batas presisi. Representasi two's complement untuk bilangan negatif juga ditampilkan.",
      uses: [
        "Membaca nilai heksadesimal dari memory dump atau register.",
        "Menghitung bitmask dan flag dalam bentuk biner.",
        "Mengonversi angka yang terlalu besar untuk kalkulator biasa.",
      ],
    },
    en: {
      intro:
        "Number Base converts numbers between binary, octal, decimal, and hexadecimal with arbitrary precision. Two's complement representations of negative numbers are shown too.",
      uses: [
        "Reading hex values from a memory dump or register.",
        "Working out bitmasks and flags in binary.",
        "Converting numbers too large for an ordinary calculator.",
      ],
    },
  },
  chmod: {
    id: {
      intro:
        "Chmod Calculator menerjemahkan izin file Unix antara bentuk oktal (755) dan simbolik (rwxr-xr-x). Bit khusus setuid, setgid, dan sticky bit juga bisa diatur.",
      uses: [
        "Menentukan angka chmod yang tepat untuk script, folder, atau kunci SSH.",
        "Membaca arti izin dari output ls -l.",
        "Memahami efek setuid atau sticky bit sebelum menerapkannya.",
      ],
    },
    en: {
      intro:
        "Chmod Calculator translates Unix file permissions between octal (755) and symbolic (rwxr-xr-x) form. The special setuid, setgid, and sticky bits can be set as well.",
      uses: [
        "Picking the right chmod value for a script, directory, or SSH key.",
        "Reading what the permissions in ls -l output mean.",
        "Understanding what setuid or the sticky bit does before applying it.",
      ],
    },
  },
  cidr: {
    id: {
      intro:
        "Subnet Calculator menghitung alamat network, broadcast, netmask, wildcard, dan rentang host yang bisa dipakai dari notasi CIDR IPv4 seperti 192.168.1.0/24.",
      uses: [
        "Merencanakan subnet untuk VPC, VLAN, atau jaringan kantor.",
        "Mengecek apakah sebuah IP masuk dalam rentang CIDR tertentu.",
        "Menulis aturan firewall atau security group dengan rentang yang benar.",
      ],
    },
    en: {
      intro:
        "Subnet Calculator works out the network address, broadcast, netmask, wildcard, and usable host range from IPv4 CIDR notation such as 192.168.1.0/24.",
      uses: [
        "Planning subnets for a VPC, VLAN, or office network.",
        "Checking whether an IP falls inside a given CIDR range.",
        "Writing firewall rules or security groups with the correct range.",
      ],
    },
  },
  cron: {
    id: {
      intro:
        "Cron Parser menerjemahkan ekspresi cron seperti */15 9-17 * * 1-5 ke dalam kalimat biasa dan menampilkan 10 jadwal eksekusi berikutnya.",
      uses: [
        "Memastikan jadwal cron job atau GitHub Actions berjalan pada waktu yang dimaksud.",
        "Memahami ekspresi cron yang ditulis orang lain.",
        "Menyusun jadwal baru dan langsung melihat waktu eksekusinya.",
      ],
    },
    en: {
      intro:
        "Cron Parser translates cron expressions such as */15 9-17 * * 1-5 into plain language and lists the next 10 scheduled runs.",
      uses: [
        "Making sure a cron job or GitHub Actions schedule runs when you expect.",
        "Understanding cron expressions written by someone else.",
        "Building a new schedule and seeing its run times immediately.",
      ],
    },
  },
  color: {
    id: {
      intro:
        "Color Converter mengonversi warna antar HEX, RGB, HSL, dan OKLCH sekaligus, lengkap dengan rasio kontras WCAG terhadap putih dan hitam.",
      uses: [
        "Menerjemahkan warna dari desain ke format yang dipakai di CSS.",
        "Beralih ke OKLCH untuk palet yang lebih konsisten secara persepsi.",
        "Mengecek keterbacaan warna sebelum dipakai sebagai warna teks.",
      ],
    },
    en: {
      intro:
        "Color Converter converts a color between HEX, RGB, HSL, and OKLCH at once, along with its WCAG contrast ratio against white and black.",
      uses: [
        "Translating a color from a design file into the format your CSS uses.",
        "Moving to OKLCH for more perceptually consistent palettes.",
        "Checking legibility before using a color for text.",
      ],
    },
  },
  contrast: {
    id: {
      intro:
        "Contrast Checker menghitung rasio kontras antara warna teks dan latar, lalu menilainya terhadap standar WCAG AA dan AAA untuk teks normal dan teks besar.",
      uses: [
        "Memastikan desain memenuhi syarat aksesibilitas.",
        "Memilih warna teks yang tetap terbaca di atas warna brand.",
        "Mengecek kombinasi warna mode gelap.",
      ],
    },
    en: {
      intro:
        "Contrast Checker calculates the contrast ratio between text and background colors, then rates it against WCAG AA and AAA for normal and large text.",
      uses: [
        "Making sure a design meets accessibility requirements.",
        "Choosing a text color that stays readable on a brand color.",
        "Checking dark mode color pairs.",
      ],
    },
  },
  base64: {
    id: {
      intro:
        "Base64 meng-encode teks menjadi Base64 dan men-decode-nya kembali, termasuk varian URL-safe tanpa padding. Teks Unicode seperti emoji dan aksara non-Latin ditangani dengan benar lewat UTF-8.",
      uses: [
        "Membaca isi header Authorization Basic atau payload yang di-encode.",
        "Menyiapkan nilai untuk Kubernetes Secret atau variabel lingkungan.",
        "Men-decode bagian data dari URL atau token.",
      ],
    },
    en: {
      intro:
        "Base64 encodes text to Base64 and decodes it back, including the unpadded URL-safe variant. Unicode text such as emoji and non-Latin scripts is handled correctly via UTF-8.",
      uses: [
        "Reading a Basic Authorization header or an encoded payload.",
        "Preparing values for a Kubernetes Secret or environment variable.",
        "Decoding data embedded in a URL or token.",
      ],
    },
  },
  "url-encoder": {
    id: {
      intro:
        "URL Encoder melakukan percent-encoding pada teks agar aman dipakai di URL, dan men-decode %20 dan kawan-kawannya kembali ke teks asli. Tersedia mode untuk komponen query maupun URL utuh.",
      uses: [
        "Menyusun query string yang berisi spasi, &, atau karakter non-ASCII.",
        "Membaca parameter redirect atau callback yang ter-encode.",
        "Men-debug URL yang rusak karena encoding ganda.",
      ],
    },
    en: {
      intro:
        "URL Encoder percent-encodes text so it is safe in a URL, and decodes %20 and friends back to the original text. Modes are available for query components and whole URLs.",
      uses: [
        "Building query strings that contain spaces, &, or non-ASCII characters.",
        "Reading encoded redirect or callback parameters.",
        "Debugging URLs broken by double encoding.",
      ],
    },
  },
  "html-entity": {
    id: {
      intro:
        "HTML Entity mengubah karakter khusus seperti <, >, &, dan tanda kutip menjadi entity HTML, dan men-decode entity bernama (&amp;) maupun numerik (&#39;) kembali ke teks.",
      uses: [
        "Menampilkan potongan kode HTML sebagai teks di halaman web.",
        "Membaca teks dari feed atau database yang penuh entity.",
        "Mencegah karakter khusus merusak markup.",
      ],
    },
    en: {
      intro:
        "HTML Entity turns special characters such as <, >, &, and quotes into HTML entities, and decodes named (&amp;) or numeric (&#39;) entities back to text.",
      uses: [
        "Showing HTML snippets as text on a web page.",
        "Reading text from feeds or databases full of entities.",
        "Keeping special characters from breaking markup.",
      ],
    },
  },
  "text-escape": {
    id: {
      intro:
        "Text Escape meng-escape teks agar aman dipakai sebagai string JSON, pola regex, argumen shell, atau literal SQL. Setiap konteks punya aturan escape sendiri, dan tool ini menerapkan yang tepat.",
      uses: [
        "Menempelkan teks multi-baris ke dalam string JSON.",
        "Mencari teks yang mengandung titik, kurung, atau bintang dengan regex.",
        "Menyusun perintah shell dengan argumen yang mengandung spasi atau tanda kutip.",
      ],
    },
    en: {
      intro:
        "Text Escape escapes text so it is safe to use as a JSON string, regex pattern, shell argument, or SQL literal. Each context has its own escaping rules, and this tool applies the right ones.",
      uses: [
        "Putting multi-line text inside a JSON string.",
        "Searching with regex for text that contains dots, brackets, or asterisks.",
        "Building shell commands with arguments that contain spaces or quotes.",
      ],
    },
  },
  "image-base64": {
    id: {
      intro:
        "Image & Base64 mengubah gambar menjadi data URI Base64 lengkap dengan snippet CSS dan HTML siap pakai, atau menampilkan string Base64 kembali sebagai gambar.",
      uses: [
        "Menanam ikon kecil langsung di CSS atau email HTML.",
        "Melihat isi gambar dari string Base64 di response API.",
        "Menyiapkan gambar placeholder tanpa file terpisah.",
      ],
    },
    en: {
      intro:
        "Image & Base64 turns images into Base64 data URIs with ready-to-use CSS and HTML snippets, or renders a Base64 string back as an image.",
      uses: [
        "Embedding small icons directly in CSS or HTML email.",
        "Viewing an image returned as a Base64 string by an API.",
        "Preparing placeholder images without a separate file.",
      ],
    },
  },
  "image-tools": {
    id: {
      intro:
        "Image Compressor mengompres, mengubah ukuran, dan mengonversi gambar ke WebP, JPEG, atau PNG. Gambar diproses di perangkatmu sendiri, tidak diunggah ke mana pun.",
      uses: [
        "Memperkecil foto sebelum diunggah ke situs atau aplikasi.",
        "Mengonversi PNG atau JPEG ke WebP untuk web yang lebih cepat.",
        "Mengubah ukuran screenshot untuk dokumentasi.",
      ],
    },
    en: {
      intro:
        "Image Compressor compresses, resizes, and converts images to WebP, JPEG, or PNG. Images are processed on your own device and never uploaded.",
      uses: [
        "Shrinking photos before uploading them to a site or app.",
        "Converting PNG or JPEG to WebP for a faster web.",
        "Resizing screenshots for documentation.",
      ],
    },
  },
  qr: {
    id: {
      intro:
        "QR Code membuat kode QR dari teks atau URL dan mengekspornya sebagai PNG atau SVG. Tool ini juga bisa membaca isi QR code dari gambar.",
      uses: [
        "Membuat QR untuk tautan, Wi-Fi, atau kontak yang akan dicetak.",
        "Mengecek isi QR code sebelum memindainya dengan ponsel.",
        "Membuat QR berbentuk SVG yang tetap tajam di ukuran berapa pun.",
      ],
    },
    en: {
      intro:
        "QR Code creates QR codes from text or URLs and exports them as PNG or SVG. It can also read the contents of a QR code from an image.",
      uses: [
        "Making QR codes for links, Wi-Fi, or contacts that will be printed.",
        "Checking what a QR code contains before scanning it with a phone.",
        "Creating SVG QR codes that stay sharp at any size.",
      ],
    },
  },
  jwt: {
    id: {
      intro:
        "JWT men-decode header dan payload JSON Web Token, menampilkan masa berlakunya, dan memverifikasi signature dengan secret atau public key. Token baru bisa dibuat dengan HMAC, RSA, ECDSA, atau EdDSA.",
      uses: [
        "Melihat klaim dan waktu kedaluwarsa token saat men-debug autentikasi.",
        "Memastikan token ditandatangani dengan kunci yang benar.",
        "Membuat token uji untuk development atau test otomatis.",
      ],
    },
    en: {
      intro:
        "JWT decodes the header and payload of a JSON Web Token, shows when it expires, and verifies the signature with a secret or public key. New tokens can be signed with HMAC, RSA, ECDSA, or EdDSA.",
      uses: [
        "Inspecting claims and expiry while debugging authentication.",
        "Confirming a token was signed with the right key.",
        "Creating test tokens for development or automated tests.",
      ],
    },
  },
  bcrypt: {
    id: {
      intro:
        "Bcrypt membuat hash password dengan cost factor yang bisa diatur, dan mencocokkan password dengan hash bcrypt yang sudah ada.",
      uses: [
        "Membuat hash password untuk seed database atau akun admin.",
        "Mengecek apakah sebuah password cocok dengan hash yang tersimpan.",
        "Menguji pengaruh cost factor terhadap waktu hashing.",
      ],
    },
    en: {
      intro:
        "Bcrypt creates password hashes with an adjustable cost factor and checks passwords against existing bcrypt hashes.",
      uses: [
        "Generating password hashes for database seeds or admin accounts.",
        "Checking whether a password matches a stored hash.",
        "Seeing how the cost factor affects hashing time.",
      ],
    },
  },
  argon2: {
    id: {
      intro:
        "Argon2 & scrypt membuat hash password dengan Argon2id, Argon2i, Argon2d, atau scrypt, dengan parameter memori, iterasi, dan paralelisme yang bisa diatur. Hash Argon2 yang ada juga bisa diverifikasi.",
      uses: [
        "Membuat hash Argon2id sesuai rekomendasi OWASP untuk penyimpanan password.",
        "Menguji parameter memori dan iterasi sebelum dipakai di server.",
        "Memverifikasi hash Argon2 dari database.",
      ],
    },
    en: {
      intro:
        "Argon2 & scrypt hashes passwords with Argon2id, Argon2i, Argon2d, or scrypt, with adjustable memory, iteration, and parallelism parameters. Existing Argon2 hashes can be verified too.",
      uses: [
        "Creating Argon2id hashes in line with OWASP password storage guidance.",
        "Tuning memory and iteration parameters before using them on a server.",
        "Verifying Argon2 hashes taken from a database.",
      ],
    },
  },
  hash: {
    id: {
      intro:
        "Hash Generator menghitung checksum MD5, SHA-1, SHA-256, SHA-384, dan SHA-512 dari teks atau file sekaligus. File dibaca langsung di browser, sehingga file besar pun tidak perlu diunggah.",
      uses: [
        "Memverifikasi integritas file unduhan dengan checksum resminya.",
        "Membuat hash untuk cache key atau deduplikasi data.",
        "Membandingkan dua file tanpa membuka isinya.",
      ],
    },
    en: {
      intro:
        "Hash Generator computes MD5, SHA-1, SHA-256, SHA-384, and SHA-512 checksums of text or files at once. Files are read in the browser, so even large files never need uploading.",
      uses: [
        "Verifying a download against its published checksum.",
        "Producing hashes for cache keys or data deduplication.",
        "Comparing two files without opening them.",
      ],
    },
  },
  hmac: {
    id: {
      intro:
        "HMAC Generator menghitung HMAC dengan SHA-1, SHA-256, SHA-384, atau SHA-512 dari pesan dan secret key, dalam format hex atau Base64.",
      uses: [
        "Memverifikasi signature webhook dari Stripe, GitHub, atau layanan lain.",
        "Men-debug signature request API yang ditolak server.",
        "Membuat signature uji untuk integrasi baru.",
      ],
    },
    en: {
      intro:
        "HMAC Generator computes an HMAC with SHA-1, SHA-256, SHA-384, or SHA-512 from a message and secret key, in hex or Base64.",
      uses: [
        "Verifying webhook signatures from Stripe, GitHub, or other services.",
        "Debugging API request signatures the server rejects.",
        "Producing test signatures for a new integration.",
      ],
    },
  },
  aes: {
    id: {
      intro:
        "AES Encrypt mengenkripsi dan mendekripsi teks dengan AES-256-GCM melalui Web Crypto API. Kunci diturunkan dari password dengan PBKDF2, dan salt serta IV disertakan dalam hasil enkripsi.",
      uses: [
        "Mengirim catatan rahasia yang hanya bisa dibuka dengan password.",
        "Mengenkripsi teks sensitif sebelum disimpan di tempat yang kurang aman.",
        "Mempelajari cara kerja AES-GCM dan PBKDF2.",
      ],
    },
    en: {
      intro:
        "AES Encrypt encrypts and decrypts text with AES-256-GCM via the Web Crypto API. The key is derived from a password with PBKDF2, and the salt and IV are included in the ciphertext.",
      uses: [
        "Sharing a secret note that only opens with a password.",
        "Encrypting sensitive text before storing it somewhere less secure.",
        "Learning how AES-GCM and PBKDF2 work.",
      ],
    },
  },
  keygen: {
    id: {
      intro:
        "Key Generator membuat pasangan kunci RSA, ECDSA (P-256, P-384, P-521), atau Ed25519 dalam format PEM dan JWK. Kunci dibuat dengan Web Crypto API dan siap dipakai untuk menandatangani JWT.",
      uses: [
        "Membuat kunci untuk menandatangani dan memverifikasi JWT.",
        "Menyiapkan JWKS untuk server OAuth atau OpenID Connect.",
        "Membuat kunci uji untuk development tanpa OpenSSL.",
      ],
    },
    en: {
      intro:
        "Key Generator creates RSA, ECDSA (P-256, P-384, P-521), or Ed25519 key pairs in PEM and JWK formats. Keys are generated with the Web Crypto API and are ready to sign JWTs.",
      uses: [
        "Creating keys to sign and verify JWTs.",
        "Setting up a JWKS for an OAuth or OpenID Connect server.",
        "Generating test keys for development without OpenSSL.",
      ],
    },
  },
  totp: {
    id: {
      intro:
        "TOTP / 2FA membuat kode one-time password sesuai RFC 6238, sama seperti Google Authenticator atau Authy. Tempel secret Base32 atau URI otpauth://, lalu lihat kode saat ini, kode berikutnya, dan QR code untuk dipindai.",
      uses: [
        "Menguji implementasi 2FA di aplikasi tanpa perlu ponsel.",
        "Membuat secret dan QR code baru untuk akun uji.",
        "Memeriksa isi URI otpauth:// dari QR code yang dipindai.",
      ],
    },
    en: {
      intro:
        "TOTP / 2FA generates RFC 6238 one-time passwords, just like Google Authenticator or Authy. Paste a Base32 secret or an otpauth:// URI to see the current code, the next code, and a QR code to scan.",
      uses: [
        "Testing a 2FA implementation without reaching for a phone.",
        "Creating a new secret and QR code for a test account.",
        "Inspecting an otpauth:// URI taken from a scanned QR code.",
      ],
    },
  },
  x509: {
    id: {
      intro:
        "X.509 Decoder membaca sertifikat dalam format PEM atau DER dan menampilkan subject, issuer, masa berlaku, Subject Alternative Name, key usage, serta fingerprint SHA-1 dan SHA-256.",
      uses: [
        "Mengecek kapan sertifikat TLS kedaluwarsa.",
        "Memastikan domain yang tercakup di SAN sudah benar.",
        "Mencocokkan fingerprint sertifikat saat konfigurasi mTLS atau pinning.",
      ],
    },
    en: {
      intro:
        "X.509 Decoder reads certificates in PEM or DER format and shows the subject, issuer, validity period, Subject Alternative Names, key usage, and SHA-1 and SHA-256 fingerprints.",
      uses: [
        "Checking when a TLS certificate expires.",
        "Confirming which domains the SAN covers.",
        "Matching certificate fingerprints when setting up mTLS or pinning.",
      ],
    },
  },
  password: {
    id: {
      intro:
        "Password Generator membuat password acak yang kuat dengan crypto.getRandomValues, generator acak yang aman secara kriptografis. Panjang dan jenis karakter bisa diatur, dan estimasi entropinya ditampilkan.",
      uses: [
        "Membuat password unik untuk akun baru atau password manager.",
        "Membuat secret untuk database, API, atau variabel lingkungan.",
        "Melihat seberapa kuat password berdasarkan entropinya.",
      ],
    },
    en: {
      intro:
        "Password Generator creates strong random passwords with crypto.getRandomValues, a cryptographically secure random source. Length and character sets are adjustable, and an entropy estimate is shown.",
      uses: [
        "Creating a unique password for a new account or password manager.",
        "Generating secrets for databases, APIs, or environment variables.",
        "Seeing how strong a password is from its entropy.",
      ],
    },
  },
  uuid: {
    id: {
      intro:
        "UUID / ULID membuat UUID v4 acak, UUID v7 yang terurut berdasarkan waktu, atau ULID, satu per satu maupun dalam jumlah banyak sekaligus.",
      uses: [
        "Membuat primary key untuk data seed atau fixture test.",
        "Memilih UUID v7 atau ULID agar index database tetap berurutan.",
        "Membuat ID unik untuk request, file, atau resource.",
      ],
    },
    en: {
      intro: "UUID / ULID generates random UUID v4, time-ordered UUID v7, or ULID, one at a time or in bulk.",
      uses: [
        "Creating primary keys for seed data or test fixtures.",
        "Choosing UUID v7 or ULID to keep database indexes ordered.",
        "Generating unique IDs for requests, files, or resources.",
      ],
    },
  },
  lorem: {
    id: {
      intro:
        "Lorem Ipsum membuat teks placeholder klasik dalam jumlah paragraf, kalimat, atau kata yang kamu tentukan.",
      uses: [
        "Mengisi mockup dan prototipe sebelum konten asli tersedia.",
        "Menguji tampilan layout dengan teks pendek maupun panjang.",
        "Membuat data dummy untuk database atau test.",
      ],
    },
    en: {
      intro:
        "Lorem Ipsum generates classic placeholder text by the number of paragraphs, sentences, or words you choose.",
      uses: [
        "Filling mockups and prototypes before real content exists.",
        "Testing layouts with both short and long text.",
        "Producing dummy data for databases or tests.",
      ],
    },
  },
  regex: {
    id: {
      intro:
        "Regex Tester menguji regular expression JavaScript secara langsung: semua match disorot, grup tangkapan (termasuk named group) ditampilkan, dan hasil replace terlihat seketika.",
      uses: [
        "Menyusun pola validasi email, nomor telepon, atau format lain.",
        "Men-debug regex yang tidak cocok seperti yang diharapkan.",
        "Mencoba pola replace sebelum menjalankannya di kode atau editor.",
      ],
    },
    en: {
      intro:
        "Regex Tester tests JavaScript regular expressions live: every match is highlighted, capture groups (including named groups) are listed, and replacement results appear instantly.",
      uses: [
        "Building patterns to validate emails, phone numbers, or other formats.",
        "Debugging a regex that does not match as expected.",
        "Trying a replace pattern before running it in code or an editor.",
      ],
    },
  },
  diff: {
    id: {
      intro:
        "Text Diff membandingkan dua teks per baris, kata, atau karakter dan menyorot bagian yang ditambah atau dihapus. Hasilnya bisa disalin sebagai unified patch.",
      uses: [
        "Membandingkan dua versi file konfigurasi.",
        "Melihat perubahan pada teks yang tidak ada di version control.",
        "Membuat patch untuk dibagikan ke rekan kerja.",
      ],
    },
    en: {
      intro:
        "Text Diff compares two texts by line, word, or character and highlights what was added or removed. The result can be copied as a unified patch.",
      uses: [
        "Comparing two versions of a configuration file.",
        "Seeing changes in text that is not under version control.",
        "Creating a patch to share with a colleague.",
      ],
    },
  },
  "json-diff": {
    id: {
      intro:
        "JSON Diff membandingkan dua dokumen JSON berdasarkan strukturnya, bukan teksnya. Urutan key dan format diabaikan, dan setiap perbedaan ditampilkan dengan path seperti $.user.roles[1].",
      uses: [
        "Membandingkan response API sebelum dan sesudah perubahan backend.",
        "Mencari perbedaan konfigurasi JSON antar environment.",
        "Memeriksa snapshot test yang gagal tanpa terganggu urutan key.",
      ],
    },
    en: {
      intro:
        "JSON Diff compares two JSON documents by structure rather than text. Key order and formatting are ignored, and every difference is shown with a path such as $.user.roles[1].",
      uses: [
        "Comparing API responses before and after a backend change.",
        "Finding configuration differences between environments.",
        "Checking failing snapshot tests without key-order noise.",
      ],
    },
  },
  "case-converter": {
    id: {
      intro:
        "Case Converter mengubah teks ke camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dan gaya penamaan lain sekaligus.",
      uses: [
        "Mengganti nama variabel saat memindahkan kode antar bahasa.",
        "Mengubah nama kolom database snake_case menjadi properti camelCase.",
        "Membuat slug URL atau nama file kebab-case.",
      ],
    },
    en: {
      intro:
        "Case Converter turns text into camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and other naming styles at once.",
      uses: [
        "Renaming variables when porting code between languages.",
        "Mapping snake_case database columns to camelCase properties.",
        "Producing kebab-case URL slugs or file names.",
      ],
    },
  },
  "text-stats": {
    id: {
      intro:
        "Text Stats menghitung karakter, kata, baris, dan ukuran byte UTF-8 dari teks, lalu menemukan karakter tak terlihat seperti zero-width space, non-breaking space, dan kontrol bidi.",
      uses: [
        "Mengecek batas karakter untuk meta description, tweet, atau kolom database.",
        "Mencari karakter tersembunyi yang membuat kode atau string comparison gagal.",
        "Mendeteksi kontrol bidi yang bisa disalahgunakan dalam serangan Trojan Source.",
      ],
    },
    en: {
      intro:
        "Text Stats counts the characters, words, lines, and UTF-8 bytes in text, then finds invisible characters such as zero-width spaces, non-breaking spaces, and bidi controls.",
      uses: [
        "Checking character limits for meta descriptions, posts, or database columns.",
        "Finding hidden characters that break code or string comparisons.",
        "Spotting bidi controls that can be abused in Trojan Source attacks.",
      ],
    },
  },
}
