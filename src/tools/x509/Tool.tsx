import { CircleCheck, CircleX, FileUp } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { ClearButton } from "@/components/ActionButtons"
import { Badge } from "@/components/Badge"
import { ErrorText } from "@/components/ErrorText"
import { FileDrop } from "@/components/FileDrop"
import { GlassButton } from "@/components/glass/GlassButton"
import { GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { ValueRow } from "@/components/ValueRow"
import { useLocale, useMessages } from "@/i18n/locale"
import { pickFile } from "@/lib/file"
import { attempt } from "@/lib/result"
import { formatDateTime, relativeTime } from "@/lib/time"
import { type Certificate, certificateTextFromFile, fingerprint, type PublicKeyInfo, parseCertificates } from "./logic"
import { messages, type Status } from "./messages"

const statusOf = ({ notBefore, notAfter }: Certificate, now = new Date()): Status =>
  now < notBefore ? "notYetValid" : now > notAfter ? "expired" : "valid"

const describeKey = ({ algorithm, size, curve, exponent }: PublicKeyInfo) =>
  [algorithm, curve, size && `${size} bit`, exponent && `e=${exponent}`].filter(Boolean).join(" · ")

export default function X509Tool() {
  const t = useMessages(messages)
  const [input, setInput] = useState("")
  const parsed = useMemo(() => (input.trim() ? attempt(() => parseCertificates(input)) : null), [input])

  const loadFile = async (file: File | null) => {
    if (file) setInput(certificateTextFromFile(new Uint8Array(await file.arrayBuffer())))
  }

  return (
    <div className="flex flex-col gap-4">
      <FileDrop label={t.input} onFile={loadFile}>
        <GlassPanel variant="solid" className="flex flex-col gap-3 p-4">
          <GlassTextarea
            aria-label={t.input}
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
          />
          <div className="flex gap-2">
            <GlassButton onClick={async () => loadFile(await pickFile(".pem,.crt,.cer,.der"))}>
              <FileUp aria-hidden="true" className="size-4" />
              {t.openFile}
            </GlassButton>
            <ClearButton onClick={() => setInput("")} disabled={!input} />
          </div>
          {parsed && !parsed.ok && <ErrorText>{parsed.error}</ErrorText>}
        </GlassPanel>
      </FileDrop>

      {parsed?.ok &&
        parsed.value.map((certificate, i) => (
          <CertificateCard
            key={certificate.serial + certificate.issuer}
            certificate={certificate}
            title={parsed.value.length > 1 ? t.certificate(i + 1, parsed.value.length) : undefined}
          />
        ))}
    </div>
  )
}

function CertificateCard({ certificate, title }: { certificate: Certificate; title?: string }) {
  const t = useMessages(messages)
  const locale = useLocale()
  const status = statusOf(certificate)
  const [fingerprints, setFingerprints] = useState({ sha256: "", sha1: "" })
  const { basicConstraints } = certificate

  useEffect(() => {
    let live = true
    Promise.all([fingerprint(certificate.der, "SHA-256"), fingerprint(certificate.der, "SHA-1")]).then(
      ([sha256, sha1]) => live && setFingerprints({ sha256, sha1 }),
    )
    return () => {
      live = false
    }
  }, [certificate.der])

  const date = (value: Date) => `${formatDateTime(value, locale)} (${relativeTime(value, locale)})`

  return (
    <GlassPanel variant="solid" className="flex flex-col gap-2 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        {title && <h2 className="mr-1 text-sm font-medium text-ink-soft">{title}</h2>}
        <Badge tone={status === "valid" ? "success" : "danger"} icon={status === "valid" ? CircleCheck : CircleX}>
          {t.status[status]}
        </Badge>
        {certificate.subject === certificate.issuer && <Badge>{t.selfSigned}</Badge>}
        {basicConstraints?.ca && <Badge>CA</Badge>}
      </div>
      <div>
        <ValueRow label={t.subject} value={certificate.subject} />
        <ValueRow label={t.issuer} value={certificate.issuer} />
        <ValueRow label={t.notBefore} value={date(certificate.notBefore)} />
        <ValueRow label={t.notAfter} value={date(certificate.notAfter)} />
        <ValueRow label={t.serial} value={certificate.serial} />
        <ValueRow label={t.publicKey} value={describeKey(certificate.publicKey)} />
        <ValueRow label={t.signature} value={certificate.signatureAlgorithm} />
        {certificate.subjectAltNames.length > 0 && (
          <ValueRow label={t.subjectAltNames} value={certificate.subjectAltNames.join(", ")} />
        )}
        {basicConstraints && (
          <ValueRow
            label={t.basicConstraints}
            value={[
              basicConstraints.ca ? "CA" : t.notCa,
              basicConstraints.pathLength !== undefined && t.pathLength(basicConstraints.pathLength),
            ]
              .filter(Boolean)
              .join(", ")}
          />
        )}
        {certificate.keyUsage.length > 0 && <ValueRow label={t.keyUsage} value={certificate.keyUsage.join(", ")} />}
        {certificate.extendedKeyUsage.length > 0 && (
          <ValueRow label={t.extendedKeyUsage} value={certificate.extendedKeyUsage.join(", ")} />
        )}
        <ValueRow label="SHA-256" value={fingerprints.sha256} />
        <ValueRow label="SHA-1" value={fingerprints.sha1} />
      </div>
      {certificate.extensions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pb-1">
          <span className="w-32 shrink-0 text-sm text-ink-soft">{t.extensions}</span>
          {certificate.extensions.map(({ oid, name, critical }) => (
            <Badge key={oid}>{critical ? `${name} (${t.critical})` : name}</Badge>
          ))}
        </div>
      )}
    </GlassPanel>
  )
}
