import { useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
  title: string
  description?: string
  duration?: number
  type?: ToastType
}

interface Toast extends ToastOptions {
  id: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, duration = 3000, type = 'info' }: ToastOptions) => {
    const id = Date.now()
    const newToast: Toast = { id, title, description, duration, type }
    setToasts((prevToasts) => [...prevToasts, newToast])

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, duration)
  }, [])

  return { toast, toasts }
}