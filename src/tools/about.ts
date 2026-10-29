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
    ja: {
      intro:
        "JSON Formatter は、読みにくい JSON をインデント付きの見やすい形に整形するか、1 行に圧縮します。構文エラーは正確な位置とともに表示します。",
      uses: [
        "1 行で返ってきた API レスポンスを読むとき。",
        "設定ファイルで抜けているカンマや括弧を探すとき。",
        "保存や送信の前に JSON ペイロードを小さくするとき。",
      ],
    },
  },
  "code-formatter": {
    id: {
      intro:
        "Code Formatter memakai Prettier untuk merapikan JavaScript, TypeScript, CSS, HTML, Markdown, GraphQL, YAML, dan XML dengan gaya yang konsisten. Hasilnya sama seperti menjalankan Prettier di proyek, tanpa perlu instalasi.",
      uses: [
        "Merapikan potongan kode dari Stack Overflow atau chat sebelum ditempel ke proyek.",
        "Menyeragamkan indentasi file YAML, HTML, atau XML seperti pom.xml dan SOAP response.",
        "Mengecek hasil Prettier tanpa membuka editor.",
      ],
    },
    en: {
      intro:
        "Code Formatter uses Prettier to format JavaScript, TypeScript, CSS, HTML, Markdown, GraphQL, YAML, and XML in a consistent style. The output matches running Prettier in a project, with nothing to install.",
      uses: [
        "Cleaning up snippets from Stack Overflow or chat before pasting them into a project.",
        "Normalizing indentation in YAML, HTML, or XML files such as pom.xml and SOAP responses.",
        "Checking Prettier output without opening an editor.",
      ],
    },
    ja: {
      intro:
        "Code Formatter は Prettier を使って、JavaScript、TypeScript、CSS、HTML、Markdown、GraphQL、YAML、XML を一貫したスタイルに整形します。プロジェクトで Prettier を実行したときと同じ結果を、インストールなしで得られます。",
      uses: [
        "Stack Overflow やチャットから拾ったコードを、プロジェクトに貼る前に整えるとき。",
        "YAML、HTML、または pom.xml や SOAP レスポンスのような XML のインデントをそろえるとき。",
        "エディターを開かずに Prettier の出力を確認するとき。",
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
    ja: {
      intro:
        "SQL Formatter は、長いクエリを読みやすい改行とインデントに整形します。PostgreSQL、MySQL、SQLite、SQL Server などの方言に対応し、キーワードを大文字にしてクエリの構造を目立たせることもできます。",
      uses: [
        "ORM が生成したクエリやログに 1 行で出力されたクエリを読むとき。",
        "コードレビューやドキュメントの前にクエリを整えるとき。",
        "深くネストした JOIN やサブクエリを理解するとき。",
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
    ja: {
      intro:
        "Markdown Preview は、GitHub Flavored Markdown を入力と同時にプレビューします。表、タスクリスト、コードブロックにも対応し、サニタイズ済みの HTML をコピーできます。",
      uses: [
        "README やプルリクエストの説明を、投稿前に見た目を確認しながら書くとき。",
        "Markdown のメモを CMS に安全に貼れる HTML に変換するとき。",
        "複雑な Markdown の表のレイアウトを確認するとき。",
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
    ja: {
      intro:
        "SVG Optimizer は SVGO を使って、SVG からエディターのメタデータ、不要な属性、過剰な数値精度を取り除きます。最適化前後のサイズとプレビューを並べて表示します。",
      uses: [
        "Figma、Illustrator、Inkscape から書き出したアイコンを軽くするとき。",
        "SVG を HTML や React コンポーネントにインラインで埋め込む準備をするとき。",
        "アセットを小さくしてページの読み込みを速くするとき。",
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
    ja: {
      intro:
        "cURL Converter は、curl コマンドを JavaScript fetch、Python requests、Go net/http のコードに変換します。メソッド、ヘッダー、ボディ、Basic 認証、Cookie を引き継ぎ、DevTools の「Copy as cURL」で使われる $'…' 形式の引用符にも対応しています。",
      uses: [
        "ブラウザの DevTools や API ドキュメントのリクエストをコードに移すとき。",
        "複数の言語でドキュメント用のリクエスト例を作るとき。",
        "長い curl コマンドが実際に何を送っているかを把握するとき。",
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
    ja: {
      intro:
        "Data Converter は、JSON、YAML、TOML、XML、CSV の間でデータを相互に変換します。変換先の形式が対応する範囲で、ネストした構造を保ちます。",
      uses: [
        "設定を YAML から JSON や TOML に移すとき。",
        "CSV のエクスポートをコードで扱うために JSON に変換するとき。",
        "古い XML レスポンスを簡潔な JSON として読むとき。",
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
    ja: {
      intro:
        "JSON to TypeScript は、サンプル JSON から TypeScript のインターフェースや Zod スキーマを生成します。常には存在しないフィールドは省略可能に、null の値は null 許容の型になります。",
      uses: [
        "サードパーティ API のレスポンスに、手書きせずに型を付けるとき。",
        "実行時のデータ検証用に Zod スキーマを用意するとき。",
        "サンプルのペイロードからデータの形をドキュメント化するとき。",
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
    ja: {
      intro:
        "JSONPath は、$.store.book[*].author のような式で JSON ドキュメントの一部を取り出します。ワイルドカード、再帰下降（..）、スライス、?() フィルターに対応し、結果はリアルタイムで更新されます。",
      uses: [
        "コード、Postman、Kubernetes で使う前に JSONPath 式を試すとき。",
        "大きな API レスポンスから特定のフィールドを取り出すとき。",
        "フィールドの値で配列の要素を絞り込むとき。",
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
    ja: {
      intro:
        "JSON Schema Validator は、Ajv を使って JSON を draft-07、2019-09、2020-12 の JSON Schema で検証します。すべてのエラーを位置のパスと失敗したキーワードとともに表示します。",
      uses: [
        "API のペイロードが仕様どおりか、送信前に確認するとき。",
        "新しいスキーマを、有効なデータと無効なデータでテストするとき。",
        "バックエンドで発生した検証エラーの原因を探すとき。",
      ],
    },
  },
  timestamp: {
    id: {
      intro:
        "Timestamp mengonversi Unix timestamp dalam detik, milidetik, mikrodetik, atau nanodetik menjadi tanggal yang mudah dibaca, dan sebaliknya. Satuannya dideteksi otomatis dari jumlah digit. Waktu yang sama bisa dilihat di beberapa zona waktu sekaligus beserta offset UTC-nya, termasuk daylight saving, dan selisihnya dengan tanggal lain bisa dihitung.",
      uses: [
        "Membaca waktu dari log, database, atau klaim exp pada JWT.",
        "Menjadwalkan rapat atau deploy untuk tim di beberapa zona waktu.",
        "Menghitung berapa lama sebuah token, sertifikat, atau job berjalan.",
      ],
    },
    en: {
      intro:
        "Timestamp converts Unix timestamps in seconds, milliseconds, microseconds, or nanoseconds into readable dates, and back. The unit is detected automatically from the number of digits. The same moment can be shown in several time zones with their UTC offsets, including daylight saving, and the gap to another date can be measured.",
      uses: [
        "Reading times from logs, databases, or a JWT exp claim.",
        "Scheduling a meeting or deploy for a team across time zones.",
        "Working out how long a token, certificate, or job has been running.",
      ],
    },
    ja: {
      intro:
        "Timestamp は、秒、ミリ秒、マイクロ秒、ナノ秒の Unix タイムスタンプを読みやすい日付に変換し、その逆も行います。単位は桁数から自動で判別します。同じ時刻を複数のタイムゾーンで UTC オフセット（夏時間を含む）とともに表示でき、別の日付との差も計算できます。",
      uses: [
        "ログ、データベース、JWT の exp クレームに含まれる時刻を読むとき。",
        "複数のタイムゾーンにまたがるチームの会議やデプロイを予定するとき。",
        "トークン、証明書、ジョブがどれくらいの時間有効・稼働しているかを調べるとき。",
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
    ja: {
      intro:
        "Number Base は、2 進数、8 進数、10 進数、16 進数の間で数値を精度の制限なく変換します。負の数の 2 の補数表現も表示します。",
      uses: [
        "メモリダンプやレジスタの 16 進数の値を読むとき。",
        "ビットマスクやフラグを 2 進数で考えるとき。",
        "普通の電卓では扱えないほど大きな数を変換するとき。",
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
    ja: {
      intro:
        "Chmod Calculator は、Unix のファイルパーミッションを 8 進数（755）と記号表記（rwxr-xr-x）の間で変換します。特殊ビットの setuid、setgid、スティッキービットも設定できます。",
      uses: [
        "スクリプト、ディレクトリ、SSH 鍵に適した chmod の値を選ぶとき。",
        "ls -l の出力に表示されるパーミッションの意味を読むとき。",
        "setuid やスティッキービットを適用する前に、その効果を理解するとき。",
      ],
    },
  },
  cidr: {
    id: {
      intro:
        "Subnet Calculator menghitung alamat network, broadcast, netmask, wildcard, dan rentang host yang bisa dipakai dari notasi CIDR IPv4 seperti 192.168.1.0/24. Untuk IPv6 seperti 2001:db8::/48, tool ini menampilkan rentang alamat, jumlah subnet /64, jenis alamat, bentuk ringkas dan lengkap, serta nama reverse DNS ip6.arpa.",
      uses: [
        "Merencanakan subnet untuk VPC, VLAN, atau jaringan kantor.",
        "Mengecek apakah sebuah IP masuk dalam rentang CIDR tertentu.",
        "Menulis aturan firewall atau security group dengan rentang yang benar.",
      ],
    },
    en: {
      intro:
        "Subnet Calculator works out the network address, broadcast, netmask, wildcard, and usable host range from IPv4 CIDR notation such as 192.168.1.0/24. For IPv6 such as 2001:db8::/48, it shows the address range, the number of /64 subnets, the address type, compressed and expanded forms, and the ip6.arpa reverse DNS name.",
      uses: [
        "Planning subnets for a VPC, VLAN, or office network.",
        "Checking whether an IP falls inside a given CIDR range.",
        "Writing firewall rules or security groups with the correct range.",
      ],
    },
    ja: {
      intro:
        "Subnet Calculator は、192.168.1.0/24 のような IPv4 の CIDR 表記から、ネットワークアドレス、ブロードキャスト、ネットマスク、ワイルドカード、利用可能なホスト範囲を計算します。2001:db8::/48 のような IPv6 では、アドレス範囲、/64 サブネットの数、アドレスの種類、省略形と完全形、ip6.arpa の逆引き DNS 名を表示します。",
      uses: [
        "VPC、VLAN、社内ネットワークのサブネットを設計するとき。",
        "ある IP が特定の CIDR 範囲に含まれるか確認するとき。",
        "正しい範囲でファイアウォールやセキュリティグループのルールを書くとき。",
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
    ja: {
      intro:
        "Cron Parser は、*/15 9-17 * * 1-5 のような cron 式を自然な文章に変換し、次の 10 回の実行日時を一覧表示します。",
      uses: [
        "cron ジョブや GitHub Actions のスケジュールが意図した時刻に動くか確認するとき。",
        "他の人が書いた cron 式を理解するとき。",
        "新しいスケジュールを作り、実行日時をすぐに確認するとき。",
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
    ja: {
      intro:
        "Color Converter は、色を HEX、RGB、HSL、OKLCH に一度に変換し、白と黒に対する WCAG のコントラスト比も表示します。",
      uses: [
        "デザインファイルの色を CSS で使う形式に変換するとき。",
        "知覚的に均一なパレットを作るために OKLCH に移行するとき。",
        "文字色として使う前に読みやすさを確認するとき。",
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
    ja: {
      intro:
        "Contrast Checker は、文字色と背景色のコントラスト比を計算し、通常のテキストと大きなテキストについて WCAG AA と AAA の基準で判定します。",
      uses: [
        "デザインがアクセシビリティの要件を満たしているか確認するとき。",
        "ブランドカラーの上でも読みやすい文字色を選ぶとき。",
        "ダークモードの配色を確認するとき。",
      ],
    },
  },
  base64: {
    id: {
      intro:
        "Base64 meng-encode teks menjadi Base64 dan men-decode-nya kembali, termasuk varian URL-safe tanpa padding. Base32 (RFC 4648), Base58 (alfabet Bitcoin), dan Hex juga tersedia. Teks Unicode seperti emoji dan aksara non-Latin ditangani dengan benar lewat UTF-8.",
      uses: [
        "Membaca isi header Authorization Basic atau payload yang di-encode.",
        "Menyiapkan nilai untuk Kubernetes Secret atau variabel lingkungan.",
        "Membaca secret 2FA dalam Base32, ID Base58, atau hex dump.",
      ],
    },
    en: {
      intro:
        "Base64 encodes text to Base64 and decodes it back, including the unpadded URL-safe variant. Base32 (RFC 4648), Base58 (Bitcoin alphabet), and Hex are available too. Unicode text such as emoji and non-Latin scripts is handled correctly via UTF-8.",
      uses: [
        "Reading a Basic Authorization header or an encoded payload.",
        "Preparing values for a Kubernetes Secret or environment variable.",
        "Reading a Base32 2FA secret, a Base58 ID, or a hex dump.",
      ],
    },
    ja: {
      intro:
        "Base64 は、テキストを Base64 にエンコードし、元に戻します。パディングなしの URL セーフ版にも対応しています。Base32（RFC 4648）、Base58（Bitcoin のアルファベット）、Hex も使えます。絵文字や非ラテン文字などの Unicode テキストも UTF-8 で正しく扱います。",
      uses: [
        "Basic 認証の Authorization ヘッダーやエンコードされたペイロードを読むとき。",
        "Kubernetes の Secret や環境変数に入れる値を用意するとき。",
        "Base32 の 2 段階認証シークレット、Base58 の ID、16 進ダンプを読むとき。",
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
    ja: {
      intro:
        "URL Encoder は、テキストを URL で安全に使えるようパーセントエンコードし、%20 などを元のテキストに戻します。クエリのコンポーネント用と URL 全体用のモードがあります。",
      uses: [
        "スペース、&、非 ASCII 文字を含むクエリ文字列を組み立てるとき。",
        "エンコードされたリダイレクトやコールバックのパラメーターを読むとき。",
        "二重エンコードで壊れた URL をデバッグするとき。",
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
    ja: {
      intro:
        "HTML Entity は、<、>、&、引用符などの特殊文字を HTML エンティティにし、名前付き（&amp;）や数値（&#39;）のエンティティをテキストに戻します。",
      uses: [
        "HTML のコード片を Web ページ上でテキストとして表示するとき。",
        "エンティティだらけのフィードやデータベースのテキストを読むとき。",
        "特殊文字でマークアップが壊れるのを防ぐとき。",
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
    ja: {
      intro:
        "Text Escape は、テキストを JSON 文字列、正規表現パターン、シェル引数、SQL リテラルとして安全に使えるようエスケープします。文脈ごとに異なるエスケープ規則を正しく適用します。",
      uses: [
        "複数行のテキストを JSON 文字列に入れるとき。",
        "ドット、括弧、アスタリスクを含むテキストを正規表現で検索するとき。",
        "スペースや引用符を含む引数でシェルコマンドを組み立てるとき。",
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
    ja: {
      intro:
        "Image & Base64 は、画像をそのまま使える CSS・HTML スニペット付きの Base64 データ URI に変換するか、Base64 文字列を画像として表示します。",
      uses: [
        "小さなアイコンを CSS や HTML メールに直接埋め込むとき。",
        "API が Base64 文字列で返した画像を確認するとき。",
        "別ファイルなしでプレースホルダー画像を用意するとき。",
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
    ja: {
      intro:
        "Image Compressor は、画像を圧縮・リサイズし、WebP、JPEG、PNG に変換します。画像は自分の端末で処理され、どこにもアップロードされません。",
      uses: [
        "サイトやアプリにアップロードする前に写真を小さくするとき。",
        "Web を速くするために PNG や JPEG を WebP に変換するとき。",
        "ドキュメント用にスクリーンショットをリサイズするとき。",
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
    ja: {
      intro:
        "QR Code は、テキストや URL から QR コードを作成し、PNG または SVG で書き出します。画像から QR コードの内容を読み取ることもできます。",
      uses: [
        "印刷するリンク、Wi-Fi、連絡先の QR コードを作るとき。",
        "スマートフォンで読み取る前に QR コードの中身を確認するとき。",
        "どのサイズでもくっきり表示される SVG の QR コードを作るとき。",
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
    ja: {
      intro:
        "JWT は、JSON Web Token のヘッダーとペイロードをデコードし、有効期限を表示して、シークレットや公開鍵で署名を検証します。HMAC、RSA、ECDSA、EdDSA で新しいトークンに署名することもできます。",
      uses: [
        "認証のデバッグ中にクレームや有効期限を確認するとき。",
        "トークンが正しい鍵で署名されているか確かめるとき。",
        "開発や自動テスト用のトークンを作るとき。",
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
    ja: {
      intro:
        "Bcrypt は、コスト係数を調整してパスワードのハッシュを作成し、既存の bcrypt ハッシュとパスワードが一致するか確認します。",
      uses: [
        "データベースのシードや管理者アカウント用のパスワードハッシュを作るとき。",
        "パスワードが保存済みのハッシュと一致するか確認するとき。",
        "コスト係数がハッシュ化の時間にどう影響するか確かめるとき。",
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
    ja: {
      intro:
        "Argon2 & scrypt は、Argon2id、Argon2i、Argon2d、scrypt でパスワードをハッシュ化します。メモリ、反復回数、並列度は調整でき、既存の Argon2 ハッシュの検証もできます。",
      uses: [
        "OWASP のパスワード保存ガイドラインに沿った Argon2id ハッシュを作るとき。",
        "サーバーで使う前にメモリと反復回数のパラメーターを調整するとき。",
        "データベースから取り出した Argon2 ハッシュを検証するとき。",
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
    ja: {
      intro:
        "Hash Generator は、テキストやファイルの MD5、SHA-1、SHA-256、SHA-384、SHA-512 チェックサムを一度に計算します。ファイルはブラウザ内で読み込むため、大きなファイルもアップロード不要です。",
      uses: [
        "ダウンロードしたファイルを公開されているチェックサムと照合するとき。",
        "キャッシュキーやデータの重複排除のためにハッシュを作るとき。",
        "中身を開かずに 2 つのファイルを比較するとき。",
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
    ja: {
      intro:
        "HMAC Generator は、メッセージと秘密鍵から SHA-1、SHA-256、SHA-384、SHA-512 の HMAC を計算し、16 進数または Base64 で表示します。",
      uses: [
        "Stripe、GitHub などから届く Webhook の署名を検証するとき。",
        "サーバーに拒否された API リクエストの署名をデバッグするとき。",
        "新しい連携のテスト用署名を作るとき。",
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
    ja: {
      intro:
        "AES Encrypt は、Web Crypto API を使って AES-256-GCM でテキストを暗号化・復号します。鍵はパスワードから PBKDF2 で導出し、salt と IV は暗号文に含めます。",
      uses: [
        "パスワードでしか開けない秘密のメモを共有するとき。",
        "安全とはいえない場所に保存する前に機密テキストを暗号化するとき。",
        "AES-GCM と PBKDF2 の仕組みを学ぶとき。",
      ],
    },
  },
  keygen: {
    id: {
      intro:
        "Key Generator membuat pasangan kunci RSA, ECDSA (P-256, P-384, P-521), atau Ed25519 dalam format PEM dan JWK. Kunci dibuat dengan Web Crypto API dan siap dipakai untuk menandatangani JWT. Kunci yang sudah ada, termasuk public key dari sertifikat X.509, bisa dikonversi antara PEM dan JWK lengkap dengan JWK thumbprint-nya.",
      uses: [
        "Membuat kunci untuk menandatangani dan memverifikasi JWT.",
        "Mengubah PEM menjadi JWK untuk JWKS server OAuth atau OpenID Connect.",
        "Mengambil public key dan kid dari sertifikat atau private key yang ada.",
      ],
    },
    en: {
      intro:
        "Key Generator creates RSA, ECDSA (P-256, P-384, P-521), or Ed25519 key pairs in PEM and JWK formats. Keys are generated with the Web Crypto API and are ready to sign JWTs. Existing keys, including the public key of an X.509 certificate, can be converted between PEM and JWK along with their JWK thumbprint.",
      uses: [
        "Creating keys to sign and verify JWTs.",
        "Turning a PEM into a JWK for an OAuth or OpenID Connect JWKS.",
        "Extracting the public key and kid from an existing certificate or private key.",
      ],
    },
    ja: {
      intro:
        "Key Generator は、RSA、ECDSA（P-256、P-384、P-521）、Ed25519 の鍵ペアを PEM と JWK の形式で作成します。鍵は Web Crypto API で生成され、そのまま JWT の署名に使えます。X.509 証明書の公開鍵を含む既存の鍵も、JWK サムプリント付きで PEM と JWK の間で変換できます。",
      uses: [
        "JWT の署名と検証に使う鍵を作るとき。",
        "OAuth や OpenID Connect の JWKS 用に PEM を JWK に変換するとき。",
        "既存の証明書や秘密鍵から公開鍵と kid を取り出すとき。",
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
    ja: {
      intro:
        "TOTP / 2FA は、Google Authenticator や Authy と同じ RFC 6238 のワンタイムパスワードを生成します。Base32 のシークレットか otpauth:// URI を貼り付けると、現在のコード、次のコード、読み取り用の QR コードが表示されます。",
      uses: [
        "スマートフォンを使わずにアプリの 2 段階認証の実装をテストするとき。",
        "テスト用アカウントの新しいシークレットと QR コードを作るとき。",
        "読み取った QR コードの otpauth:// URI の中身を確認するとき。",
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
    ja: {
      intro:
        "X.509 Decoder は、PEM または DER 形式の証明書を読み込み、subject、issuer、有効期間、サブジェクト代替名、鍵用途、SHA-1 と SHA-256 のフィンガープリントを表示します。",
      uses: [
        "TLS 証明書の有効期限を確認するとき。",
        "SAN に含まれるドメインを確認するとき。",
        "mTLS や証明書ピンニングの設定で証明書のフィンガープリントを照合するとき。",
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
    ja: {
      intro:
        "Password Generator は、暗号学的に安全な乱数生成器である crypto.getRandomValues を使って強力なランダムパスワードを作ります。長さと文字の種類は調整でき、エントロピーの目安も表示します。",
      uses: [
        "新しいアカウントやパスワードマネージャー用に固有のパスワードを作るとき。",
        "データベース、API、環境変数用のシークレットを生成するとき。",
        "エントロピーからパスワードの強さを確認するとき。",
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
    ja: {
      intro: "UUID / ULID は、ランダムな UUID v4、時刻順の UUID v7、ULID を 1 つずつ、またはまとめて生成します。",
      uses: [
        "シードデータやテストのフィクスチャ用に主キーを作るとき。",
        "データベースのインデックスを順序よく保つために UUID v7 や ULID を選ぶとき。",
        "リクエスト、ファイル、リソースに一意の ID を付けるとき。",
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
    ja: {
      intro: "Lorem Ipsum は、段落、文、単語の数を指定して、定番のダミーテキストを生成します。",
      uses: [
        "本物のコンテンツができる前に、モックアップやプロトタイプを埋めるとき。",
        "短いテキストと長いテキストでレイアウトを試すとき。",
        "データベースやテスト用のダミーデータを作るとき。",
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
    ja: {
      intro:
        "Regex Tester は、JavaScript の正規表現をリアルタイムでテストします。すべてのマッチがハイライトされ、キャプチャグループ（名前付きグループを含む）が一覧表示され、置換結果もすぐに確認できます。",
      uses: [
        "メールアドレス、電話番号などの形式を検証するパターンを作るとき。",
        "思ったとおりにマッチしない正規表現をデバッグするとき。",
        "コードやエディターで実行する前に置換パターンを試すとき。",
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
    ja: {
      intro:
        "Text Diff は、2 つのテキストを行、単語、文字の単位で比較し、追加・削除された部分をハイライトします。結果は unified パッチとしてコピーできます。",
      uses: [
        "設定ファイルの 2 つのバージョンを比較するとき。",
        "バージョン管理されていないテキストの変更点を確認するとき。",
        "同僚と共有するパッチを作るとき。",
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
    ja: {
      intro:
        "JSON Diff は、2 つの JSON ドキュメントをテキストではなく構造で比較します。キーの順序や書式は無視し、違いを $.user.roles[1] のようなパスとともに表示します。",
      uses: [
        "バックエンドの変更前後で API レスポンスを比較するとき。",
        "環境ごとの JSON 設定の違いを探すとき。",
        "キーの順序に惑わされずに失敗したスナップショットテストを確認するとき。",
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
    ja: {
      intro:
        "Case Converter は、テキストを camelCase、PascalCase、snake_case、kebab-case、CONSTANT_CASE などの命名スタイルに一度に変換します。",
      uses: [
        "言語間でコードを移植するときに変数名を変えるとき。",
        "snake_case のデータベースのカラムを camelCase のプロパティに対応させるとき。",
        "kebab-case の URL スラッグやファイル名を作るとき。",
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
    ja: {
      intro:
        "Text Stats は、テキストの文字数、単語数、行数、UTF-8 のバイト数を数え、ゼロ幅スペース、ノーブレークスペース、双方向制御文字などの見えない文字を検出します。",
      uses: [
        "meta description、投稿、データベースのカラムの文字数制限を確認するとき。",
        "コードや文字列比較を壊している見えない文字を探すとき。",
        "Trojan Source 攻撃に悪用されうる双方向制御文字を見つけるとき。",
      ],
    },
  },
  "sort-lines": {
    id: {
      intro:
        "Sort & Dedupe Lines mengurutkan baris teks secara alami, sehingga file2 muncul sebelum file10. Duplikat bisa dihapus dengan tetap mempertahankan kemunculan pertama, dan urutan bisa dibalik atau diacak.",
      uses: [
        "Merapikan daftar email, domain, atau ID yang berulang.",
        "Mengurutkan import, dependency, atau entri konfigurasi.",
        "Mengacak daftar nama untuk undian atau pembagian tugas.",
      ],
    },
    en: {
      intro:
        "Sort & Dedupe Lines sorts text lines naturally, so file2 comes before file10. Duplicates can be removed while keeping the first occurrence, and the order can be reversed or shuffled.",
      uses: [
        "Cleaning up lists of emails, domains, or IDs with repeats.",
        "Sorting imports, dependencies, or configuration entries.",
        "Shuffling a list of names for a draw or task assignment.",
      ],
    },
    ja: {
      intro:
        "Sort & Dedupe Lines は、テキストの行を自然順に並べ替えるので、file2 は file10 より前に来ます。最初に出てきたものを残して重複を削除でき、並び順を逆にしたりシャッフルしたりもできます。",
      uses: [
        "重複のあるメールアドレス、ドメイン、ID の一覧を整理するとき。",
        "import、依存関係、設定項目を並べ替えるとき。",
        "抽選や担当決めのために名前の一覧をシャッフルするとき。",
      ],
    },
  },
  slug: {
    id: {
      intro:
        "Slug Generator mengubah judul menjadi slug URL yang hanya berisi huruf, angka, dan pemisah. Huruf beraksen ditransliterasi (é menjadi e, ß menjadi ss), dan setiap baris diproses terpisah.",
      uses: [
        "Membuat permalink artikel blog atau halaman produk yang ramah SEO.",
        "Membuat nama file atau ID yang aman dari judul bebas.",
        "Mengubah banyak judul sekaligus menjadi slug.",
      ],
    },
    en: {
      intro:
        "Slug Generator turns titles into URL slugs made only of letters, digits, and a separator. Accented letters are transliterated (é becomes e, ß becomes ss), and each line is handled separately.",
      uses: [
        "Creating SEO-friendly permalinks for blog posts or product pages.",
        "Deriving safe file names or IDs from free-form titles.",
        "Converting many titles to slugs at once.",
      ],
    },
    ja: {
      intro:
        "Slug Generator は、タイトルを英数字と区切り文字だけの URL スラッグに変換します。アクセント付きの文字は置き換え（é は e、ß は ss）、各行を個別に処理します。",
      uses: [
        "ブログ記事や商品ページの SEO に適したパーマリンクを作るとき。",
        "自由なタイトルから安全なファイル名や ID を作るとき。",
        "たくさんのタイトルをまとめてスラッグにするとき。",
      ],
    },
  },
  "url-parser": {
    id: {
      intro:
        "URL Parser memecah URL menjadi protocol, username, host, port, path, query, dan fragment dalam bentuk yang sudah di-decode. Query param ditampilkan sebagai tabel yang bisa diedit, dan URL dibangun ulang dengan encoding yang benar.",
      uses: [
        "Membaca parameter tracking, redirect, atau callback dari URL yang panjang.",
        "Mengubah atau menambah query param tanpa salah encoding.",
        "Men-debug URL yang punya key berulang atau karakter khusus.",
      ],
    },
    en: {
      intro:
        "URL Parser breaks a URL into its protocol, username, host, port, path, query, and fragment, all decoded. Query params appear as an editable table, and the URL is rebuilt with correct encoding.",
      uses: [
        "Reading tracking, redirect, or callback parameters from a long URL.",
        "Changing or adding query params without encoding mistakes.",
        "Debugging URLs with repeated keys or special characters.",
      ],
    },
    ja: {
      intro:
        "URL Parser は、URL をプロトコル、ユーザー名、ホスト、ポート、パス、クエリ、フラグメントに分解し、すべてデコードして表示します。クエリパラメーターは編集可能な表で表示され、正しいエンコードで URL を組み立て直します。",
      uses: [
        "長い URL からトラッキング、リダイレクト、コールバックのパラメーターを読むとき。",
        "エンコードを間違えずにクエリパラメーターを変更・追加するとき。",
        "キーの重複や特殊文字を含む URL をデバッグするとき。",
      ],
    },
  },
  semver: {
    id: {
      intro:
        "SemVer Checker mengecek versi mana yang memenuhi sebuah range semver dengan library semver yang sama dengan yang dipakai npm. Range seperti ^1.2.0 atau ~2.3 diuraikan menjadi batas lengkapnya, dan versi tertinggi yang cocok ditampilkan.",
      uses: [
        "Memahami kenapa npm memasang versi tertentu dari sebuah dependency.",
        "Mengecek apakah rilis baru akan ikut terpasang oleh range di package.json.",
        "Mempelajari beda ^, ~, dan range eksplisit, termasuk perilaku khusus versi 0.x.",
      ],
    },
    en: {
      intro:
        "SemVer Checker checks which versions satisfy a semver range using the same semver library npm uses. Ranges such as ^1.2.0 or ~2.3 are expanded into their full bounds, and the highest matching version is shown.",
      uses: [
        "Understanding why npm installed a particular version of a dependency.",
        "Checking whether a new release will be picked up by a range in package.json.",
        "Learning how ^, ~, and explicit ranges differ, including the special 0.x behavior.",
      ],
    },
    ja: {
      intro:
        "SemVer Checker は、npm と同じ semver ライブラリを使って、semver の範囲を満たすバージョンを確認します。^1.2.0 や ~2.3 のような範囲を完全な上下限に展開し、一致する最大のバージョンを表示します。",
      uses: [
        "npm が依存関係の特定のバージョンをインストールした理由を理解するとき。",
        "新しいリリースが package.json の範囲で取り込まれるか確認するとき。",
        "0.x 特有の挙動を含め、^、~、明示的な範囲の違いを学ぶとき。",
      ],
    },
  },
  glob: {
    id: {
      intro:
        "Glob Tester menguji pola glob seperti src/**/*.ts terhadap daftar path dan memisahkan path yang cocok dan yang tidak. Pola berawalan ! mengecualikan path, dan regex hasil kompilasi setiap pola ikut ditampilkan.",
      uses: [
        "Menyusun pola include dan exclude untuk tsconfig, ESLint, Vite, atau CI.",
        "Men-debug .gitignore atau .dockerignore yang tidak bekerja seperti yang diharapkan.",
        "Memahami beda * dan ** serta penanganan dotfile.",
      ],
    },
    en: {
      intro:
        "Glob Tester checks glob patterns such as src/**/*.ts against a list of paths and splits them into matches and non-matches. Patterns starting with ! exclude paths, and the compiled regex of each pattern is shown too.",
      uses: [
        "Writing include and exclude patterns for tsconfig, ESLint, Vite, or CI.",
        "Debugging a .gitignore or .dockerignore that does not behave as expected.",
        "Understanding the difference between * and ** and how dotfiles are handled.",
      ],
    },
    ja: {
      intro:
        "Glob Tester は、src/**/*.ts のような glob パターンをパスの一覧に対して試し、一致したものとしなかったものに分けます。! で始まるパターンは除外として扱い、各パターンをコンパイルした正規表現も表示します。",
      uses: [
        "tsconfig、ESLint、Vite、CI の include / exclude パターンを書くとき。",
        "思ったとおりに動かない .gitignore や .dockerignore をデバッグするとき。",
        "* と ** の違いや、ドットファイルの扱いを理解するとき。",
      ],
    },
  },
  gzip: {
    id: {
      intro:
        "Gzip / Deflate mengompres teks dengan gzip, zlib, atau raw deflate menggunakan CompressionStream bawaan browser, lalu menampilkan hasilnya sebagai Base64. Saat dekompres, format dideteksi otomatis dari header data.",
      uses: [
        "Membaca payload terkompresi dari log, cookie, atau message queue.",
        "Memperkirakan seberapa kecil sebuah payload setelah dikompres.",
        "Menyiapkan data terkompresi untuk test atau fixture.",
      ],
    },
    en: {
      intro:
        "Gzip / Deflate compresses text with gzip, zlib, or raw deflate using the browser's built-in CompressionStream and shows the result as Base64. When decompressing, the format is detected automatically from the data header.",
      uses: [
        "Reading compressed payloads from logs, cookies, or message queues.",
        "Estimating how much smaller a payload gets once compressed.",
        "Preparing compressed data for tests or fixtures.",
      ],
    },
    ja: {
      intro:
        "Gzip / Deflate は、ブラウザ標準の CompressionStream を使って gzip、zlib、raw deflate でテキストを圧縮し、結果を Base64 で表示します。展開するときは、データのヘッダーから形式を自動で判別します。",
      uses: [
        "ログ、Cookie、メッセージキューに含まれる圧縮されたペイロードを読むとき。",
        "ペイロードが圧縮でどれだけ小さくなるかを見積もるとき。",
        "テストやフィクスチャ用の圧縮データを用意するとき。",
      ],
    },
  },
  "docker-compose": {
    id: {
      intro:
        "Docker run → Compose mengubah perintah docker run menjadi service di compose.yaml. Port, volume, environment, restart policy, network, healthcheck, dan logging dipetakan ke key Compose yang sesuai, dan flag yang tidak bisa dikonversi dicantumkan sebagai komentar.",
      uses: [
        "Memindahkan container yang dijalankan manual ke Docker Compose.",
        "Menyatukan beberapa perintah docker run menjadi satu file compose.",
        "Mengubah contoh docker run dari README sebuah image menjadi konfigurasi yang bisa disimpan di repo.",
      ],
    },
    en: {
      intro:
        "Docker run → Compose turns docker run commands into services in a compose.yaml. Ports, volumes, environment, restart policy, networks, healthchecks, and logging are mapped to the matching Compose keys, and flags that cannot be converted are listed in a comment.",
      uses: [
        "Moving manually started containers to Docker Compose.",
        "Combining several docker run commands into one compose file.",
        "Turning the docker run example from an image's README into config you can keep in a repo.",
      ],
    },
    ja: {
      intro:
        "Docker run → Compose は、docker run コマンドを compose.yaml のサービスに変換します。ポート、ボリューム、環境変数、再起動ポリシー、ネットワーク、ヘルスチェック、ログ設定を対応する Compose のキーに割り当て、変換できなかったオプションはコメントとして残します。",
      uses: [
        "手動で起動しているコンテナを Docker Compose に移すとき。",
        "複数の docker run コマンドを 1 つの compose ファイルにまとめるとき。",
        "イメージの README にある docker run の例を、リポジトリで管理できる設定にするとき。",
      ],
    },
  },
  "user-agent": {
    id: {
      intro:
        "User-Agent Parser membaca string User-Agent dan menampilkan browser, engine, sistem operasi, jenis perangkat, model, dan arsitektur CPU-nya, menggunakan ua-parser-js.",
      uses: [
        "Membaca User-Agent dari log server atau laporan bug.",
        "Mengecek User-Agent browser sendiri saat men-debug masalah kompatibilitas.",
        "Memahami kenapa deteksi perangkat di aplikasi memberi hasil yang salah.",
      ],
    },
    en: {
      intro:
        "User-Agent Parser reads a User-Agent string and shows its browser, engine, operating system, device type, model, and CPU architecture, using ua-parser-js.",
      uses: [
        "Reading User-Agents from server logs or bug reports.",
        "Checking your own browser's User-Agent while debugging compatibility issues.",
        "Understanding why device detection in an app gives the wrong result.",
      ],
    },
    ja: {
      intro:
        "User-Agent Parser は、ua-parser-js を使って User-Agent 文字列を読み取り、ブラウザ、エンジン、OS、デバイスの種類、モデル、CPU アーキテクチャを表示します。",
      uses: [
        "サーバーログやバグ報告にある User-Agent を読むとき。",
        "互換性の問題をデバッグしながら自分のブラウザの User-Agent を確認するとき。",
        "アプリのデバイス判定が誤っている理由を調べるとき。",
      ],
    },
  },
  minifier: {
    id: {
      intro:
        "JS & CSS Minifier memperkecil JavaScript dengan Terser dan CSS dengan CSSO, dua minifier yang juga dipakai di banyak build tool. Komentar dan spasi dibuang, nama variabel lokal dipersingkat, dan rule CSS yang sama digabung.",
      uses: [
        "Memperkecil script atau stylesheet untuk ditanam inline di HTML.",
        "Mengecek seberapa besar ukuran kode setelah di-minify.",
        "Menyiapkan bookmarklet atau snippet kecil tanpa menyiapkan build tool.",
      ],
    },
    en: {
      intro:
        "JS & CSS Minifier shrinks JavaScript with Terser and CSS with CSSO, two minifiers used by many build tools. Comments and whitespace are removed, local variable names are shortened, and identical CSS rules are merged.",
      uses: [
        "Shrinking a script or stylesheet to inline in HTML.",
        "Checking how large code gets once minified.",
        "Preparing a bookmarklet or small snippet without setting up a build tool.",
      ],
    },
    ja: {
      intro:
        "JS & CSS Minifier は、多くのビルドツールでも使われている Terser で JavaScript を、CSSO で CSS を圧縮します。コメントと空白を取り除き、ローカル変数名を短くし、同じ CSS ルールをまとめます。",
      uses: [
        "HTML にインラインで埋め込むスクリプトやスタイルシートを小さくするとき。",
        "圧縮後のコードのサイズを確認するとき。",
        "ビルドツールを用意せずにブックマークレットや小さなスニペットを作るとき。",
      ],
    },
  },
  "css-generator": {
    id: {
      intro:
        "CSS Generator membuat kode CSS untuk gradient linear atau radial, box-shadow berlapis, dan efek glassmorphism dengan backdrop-filter. Setiap perubahan langsung terlihat di pratinjau, dan kodenya siap disalin, termasuk prefix -webkit- yang masih dibutuhkan Safari.",
      uses: [
        "Membuat latar gradient untuk hero section atau tombol.",
        "Menyusun bayangan berlapis yang terlihat lebih natural daripada satu box-shadow.",
        "Membuat kartu atau panel kaca transparan untuk UI modern.",
      ],
    },
    en: {
      intro:
        "CSS Generator builds CSS for linear or radial gradients, layered box-shadows, and glassmorphism with backdrop-filter. Every change shows up in the live preview, and the code is ready to copy, including the -webkit- prefix Safari still needs.",
      uses: [
        "Creating gradient backgrounds for hero sections or buttons.",
        "Stacking shadow layers that look more natural than a single box-shadow.",
        "Making frosted glass cards or panels for a modern UI.",
      ],
    },
    ja: {
      intro:
        "CSS Generator は、線形・放射状のグラデーション、重ねがけの box-shadow、backdrop-filter を使ったグラスモーフィズムの CSS を作成します。変更はすぐにライブプレビューに反映され、Safari でまだ必要な -webkit- プレフィックスを含むコードをそのままコピーできます。",
      uses: [
        "ヒーローセクションやボタンのグラデーション背景を作るとき。",
        "1 つの box-shadow より自然に見える重ねがけの影を作るとき。",
        "モダンな UI 向けにすりガラス風のカードやパネルを作るとき。",
      ],
    },
  },
}
