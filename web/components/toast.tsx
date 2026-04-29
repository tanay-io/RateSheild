"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Toast = {
  id: string;
  title: string;
  detail?: string;
  type: "success" | "error";
};
type ToastContextValue = { push: (toast: Omit<Toast, "id">) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

let toastSequence = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((toast: Omit<Toast, "id">) => {
    const id = `${Date.now()}-${toastSequence++}`;
    setToasts((items) => [{ ...toast, id }, ...items].slice(0, 4));
    window.setTimeout(
      () => setToasts((items) => items.filter((item) => item.id !== id)),
      3000,
    );
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex w-80 max-w-[calc(100vw-48px)] flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className={cn(
                "rounded-lg border border-white/10 bg-surface px-4 py-3 text-[13px] shadow-2xl",
                toast.type === "success"
                  ? "border-l-4 border-l-green"
                  : "border-l-4 border-l-red",
              )}
            >
              <div className="font-medium text-white">{toast.title}</div>
              {toast.detail ? (
                <div className="mt-1 text-[11px] text-secondary">
                  {toast.detail}
                </div>
              ) : null}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) throw new Error("useToast must be used inside ToastProvider");
  return value;
}
