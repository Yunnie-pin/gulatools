import { FileUp } from "lucide-react"
import { useEffect, useState } from "react"
import { ErrorText } from "@/components/ErrorText"
import { FileDrop } from "@/components/FileDrop"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { Segmented } from "@/components/glass/Segmented"
import { ValueRow } from "@/components/ValueRow"
import { pickFile } from "@/lib/file"
import { formatBytes } from "@/lib/format"
import { useAsync } from "@/lib/use-async"
import { ALGORITHMS, type Digests, hashFile, hashText } from "./logic"

type Source = "text" | "file"
type Case = "lower" | "upper"

const SOURCES = [
  { value: "text", label: "Teks" },
  { value: "file", label: "File" },
] as const satisfies readonly { value: Source; label: string }[]

const CASES = [
  { value: "lower", label: "abc" },
  { value: "upper", label: "ABC" },
] as const satisfies readonly { value: Case; label: string }[]

export default function HashTool() {
  const [source, setSource] = useState<Source>("text")
  const [letterCase, setLetterCase] = useState<Case>("lower")
  const [text, setText] = useState("")
  const [digests, setDigests] = useState<Digests | null>(null)

  useEffect(() => {
    if (source !== "text") return
    let live = true
    hashText(text).then((result) => live && setDigests(result))
    return () => {
      live = false
    }
  }, [source, text])

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel className="flex flex-wrap items-center gap-3 px-4 py-3">
        <Segmented<Source>
          label="Sumber"
          value={source}
          options={SOURCES}
          onChange={(next) => {
            setSource(next)
            setDigests(null)
          }}
        />
        <Segmented<Case> label="Huruf" value={letterCase} options={CASES} onChange={setLetterCase} />
      </GlassPanel>

      <GlassPanel variant="solid" className="p-4">
        {source === "text" ? (
          <GlassTextarea
            aria-label="Teks yang akan di-hash"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ketik atau tempel teks…"
            className="font-sans"
          />
        ) : (
          <FilePicker onDigests={setDigests} />
        )}
      </GlassPanel>

      {digests && (
        <GlassPanel variant="solid" className="px-4 py-1.5">
          {ALGORITHMS.map(({ id, label }) => (
            <ValueRow key={id} label={label} value={letterCase === "upper" ? digests[id].toUpperCase() : digests[id]} />
          ))}
        </GlassPanel>
      )}
    </div>
  )
}

function FilePicker({ onDigests }: { onDigests: (digests: Digests) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const task = useAsync(async (picked: File) => {
    const digests = await hashFile(picked)
    onDigests(digests)
    return digests
  })

  const load = (picked: File | null) => {
    if (!picked) return
    setFile(picked)
    task.run(picked)
  }

  return (
    <FileDrop label="File yang akan di-hash" onFile={load}>
      <div className="flex min-h-36 flex-col items-center justify-center gap-3 rounded-glass-md border-2 border-dashed border-black/10 p-6 text-center dark:border-white/15">
        <FileUp aria-hidden="true" className="size-8 text-ink-soft" />
        <p className="text-sm text-ink-soft">
          {file ? `${file.name} · ${formatBytes(file.size)}` : "Seret file ke sini, ukuran berapa pun"}
        </p>
        <GlassButton onClick={async () => load(await pickFile())} disabled={task.pending}>
          {task.pending ? "Menghitung…" : "Pilih file"}
        </GlassButton>
        {task.result && !task.result.ok && <ErrorText>{task.result.error}</ErrorText>}
      </div>
    </FileDrop>
  )
}
