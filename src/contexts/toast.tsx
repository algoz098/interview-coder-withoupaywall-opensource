import { createContext, useContext } from "react"

type ToastVariant = "neutral" | "success" | "error"

interface ToastContextType {
  showToast: (title: string, description: string, variant: ToastVariant) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
)

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
