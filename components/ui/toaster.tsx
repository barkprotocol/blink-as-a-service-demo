import React from 'react'
import { useToast } from '@/lib/use-toast'
import { AnimatePresence, motion } from 'framer-motion'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-0 right-0 p-4 w-full md:max-w-sm z-50 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`mb-4 p-4 rounded-md shadow-lg pointer-events-auto ${
              toast.type === 'success' ? 'bg-green-500' :
              toast.type === 'error' ? 'bg-red-500' :
              toast.type === 'warning' ? 'bg-yellow-500' :
              'bg-blue-500'
            } text-white`}
          >
            <h3 className="font-semibold">{toast.title}</h3>
            {toast.description && <p className="mt-1 text-sm">{toast.description}</p>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}