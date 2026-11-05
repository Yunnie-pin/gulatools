import CodeMirror, { EditorView, type Extension, Prec } from "@uiw/react-codemirror"
import { useMemo } from "react"
import { useEditorSettings } from "@/lib/editor-settings"
import { useTheme } from "@/lib/theme"

const glassTheme = Prec.highest(
  EditorView.theme({
    "&": { height: "100%", backgroundColor: "transparent", color: "var(--ink)" },
    "&.cm-focused": { outline: "none" },
    ".cm-scroller": { fontFamily: "var(--font-mono)", lineHeight: "1.6" },
    ".cm-gutters": { backgroundColor: "transparent", border: "none", color: "var(--ink-soft)" },
    ".cm-activeLine, .cm-activeLineGutter": { backgroundColor: "var(--glass-hover)" },
  }),
)

type EditorProps = {
  value: string
  onChange?: (value: string) => void
  language?: Extension
  placeholder?: string
  label: string
}

export function Editor({ value, onChange, language, placeholder, label }: EditorProps) {
  const { resolved } = useTheme()
  const { fontSize, wrap, lineNumbers } = useEditorSettings()
  const extensions = useMemo(
    () => [
      glassTheme,
      EditorView.theme({ "&": { fontSize: `${fontSize}px` } }),
      ...(wrap ? [EditorView.lineWrapping] : []),
      EditorView.contentAttributes.of({ "aria-label": label }),
      ...(language ? [language] : []),
    ],
    [language, label, fontSize, wrap],
  )
  const setup = useMemo(() => ({ lineNumbers, foldGutter: lineNumbers }), [lineNumbers])

  return (
    <CodeMirror
      value={value}
      onChange={onChange}
      readOnly={!onChange}
      theme={resolved}
      extensions={extensions}
      basicSetup={setup}
      placeholder={placeholder}
      height="100%"
      className="h-full min-h-0"
    />
  )
}
