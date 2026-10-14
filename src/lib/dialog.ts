import { type MouseEvent, type PointerEvent, useRef } from "react"

export function useLightDismiss() {
  const pressedBackdrop = useRef(false)

  return {
    onPointerDown: (e: PointerEvent<HTMLDialogElement>) => {
      pressedBackdrop.current = e.target === e.currentTarget
    },
    onClick: (e: MouseEvent<HTMLDialogElement>) => {
      if (pressedBackdrop.current && e.target === e.currentTarget) e.currentTarget.close()
      pressedBackdrop.current = false
    },
  }
}
