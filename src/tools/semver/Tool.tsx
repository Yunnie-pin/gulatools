import { useDeferredValue, useMemo } from "react"
import { ClearButton, SampleButton } from "@/components/ActionButtons"
import { Badge } from "@/components/Badge"
import { ErrorText } from "@/components/ErrorText"
import { Field } from "@/components/Field"
import { Checkbox } from "@/components/glass/Checkbox"
import { GlassInput, GlassTextarea } from "@/components/glass/GlassInput"
import { GlassPanel } from "@/components/glass/GlassPanel"
import { ValueRow } from "@/components/ValueRow"
import { useMessages } from "@/i18n/locale"
import { usePersistentState } from "@/lib/persist"
import { attempt } from "@/lib/result"
import { checkRange, type VersionCheck } from "./logic"
import { messages } from "./messages"

const SAMPLE_RANGE = "^1.4.0 || >=2.1.0 <3"
const SAMPLE_VERSIONS = "1.3.9\n1.4.0\n1.12.2\n2.0.5\n2.1.0\n2.9.0-beta.1\n3.0.0"

export default function SemverTool() {
  const t = useMessages(messages)
  const [range, setRange] = usePersistentState("range", "")
  const [versions, setVersions] = usePersistentState("versions", "")
  const [includePrerelease, setIncludePrerelease] = usePersistentState("includePrerelease", false)
  const deferredVersions = useDeferredValue(versions)
  const report = useMemo(
    () => attempt(() => checkRange(range, deferredVersions, includePrerelease)),
    [range, deferredVersions, includePrerelease],
  )

  const status = (check: VersionCheck) =>
    !check.valid ? (
      <Badge>{t.invalid}</Badge>
    ) : check.satisfies ? (
      <Badge tone="success">{t.satisfies}</Badge>
    ) : (
      <Badge tone="danger">{t.notSatisfies}</Badge>
    )

  return (
    <div className="flex flex-col gap-4">
      <GlassPanel variant="solid" className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1 basis-72">
            <Field label={t.range}>
              {(id) => (
                <GlassInput
                  id={id}
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                  placeholder="^1.2.0"
                  spellCheck={false}
                  className="font-mono"
                />
              )}
            </Field>
          </div>
          <SampleButton
            onClick={() => {
              setRange(SAMPLE_RANGE)
              setVersions(SAMPLE_VERSIONS)
            }}
          />
          <ClearButton
            onClick={() => {
              setRange("")
              setVersions("")
            }}
            disabled={!range && !versions}
          />
        </div>
        <Field label={t.versions}>
          {(id) => (
            <GlassTextarea
              id={id}
              rows={6}
              value={versions}
              onChange={(e) => setVersions(e.target.value)}
              placeholder={"1.2.3\n2.0.0"}
              spellCheck={false}
              className="font-mono"
            />
          )}
        </Field>
        <Checkbox label={t.includePrerelease} checked={includePrerelease} onChange={setIncludePrerelease} />
      </GlassPanel>

      {!report.ok ? (
        <ErrorText>{report.error}</ErrorText>
      ) : (
        <>
          <GlassPanel variant="solid" className="px-4 py-1.5">
            <ValueRow label={t.normalized} value={report.value.normalized} />
            <ValueRow label={t.min} value={report.value.min ?? ""} />
            <ValueRow label={t.best} value={report.value.best ?? ""} />
          </GlassPanel>
          {report.value.checks.length > 0 && (
            <GlassPanel variant="solid" className="px-4 py-1.5">
              <ul>
                {report.value.checks.map((check, index) => (
                  <li
                    // biome-ignore lint/suspicious/noArrayIndexKey: the same version may be listed twice
                    key={index}
                    className="flex items-center justify-between gap-3 border-b border-black/5 py-2.5 last:border-0 dark:border-white/10"
                  >
                    <code className="font-mono text-sm break-all">{check.version}</code>
                    {status(check)}
                  </li>
                ))}
              </ul>
            </GlassPanel>
          )}
        </>
      )}
    </div>
  )
}
