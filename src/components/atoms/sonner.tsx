"use client";

import { Toaster as Sonner, toast as sonnerToast } from "sonner";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="bottom-left"
      closeButton={false}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "w-full",
        },
      }}
      {...props}
    />
  );
};

// Custom toast function with full UI control
const toast = {
  success: (message: string) => {
    sonnerToast.custom(t => (
      <div className="border-l-secondary flex w-full min-w-[400px] items-center gap-3 rounded-xl border border-l-4 border-gray-200 bg-white px-4 py-3 shadow-lg">
        <CheckCircle2 className="text-secondary h-5 w-5 shrink-0" />
        <p className="text-font-primary flex-1 text-sm font-medium">
          {message}
        </p>
        <button
          type="button"
          onClick={() => sonnerToast.dismiss(t)}
          className="text-font-primary shrink-0 p-1 transition-colors hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    ));
  },
  error: (message: string) => {
    sonnerToast.custom(t => (
      <div className="border-l-destructive flex w-full min-w-[400px] items-center gap-3 rounded-xl border border-l-4 border-gray-200 bg-white px-4 py-3 shadow-lg">
        <XCircle className="text-destructive h-5 w-5 shrink-0" />
        <p className="text-font-primary flex-1 text-sm font-medium">
          {message}
        </p>
        <button
          type="button"
          onClick={() => sonnerToast.dismiss(t)}
          className="text-font-primary shrink-0 p-1 transition-colors hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    ));
  },
  warning: (message: string) => {
    sonnerToast.custom(t => (
      <div className="flex w-full min-w-[400px] items-center gap-3 rounded-xl border border-l-4 border-gray-200 border-l-yellow-500 bg-white px-4 py-3 shadow-lg">
        <AlertCircle className="h-5 w-5 shrink-0 text-yellow-500" />
        <p className="text-font-primary flex-1 text-sm font-medium">
          {message}
        </p>
        <button
          type="button"
          onClick={() => sonnerToast.dismiss(t)}
          className="text-font-primary shrink-0 p-1 transition-colors hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    ));
  },
};

export { Toaster, toast };
