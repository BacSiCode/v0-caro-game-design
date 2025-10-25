"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"

interface ConfirmationModalProps {
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  isDangerous?: boolean
}

export function ConfirmationModal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  isDangerous = false,
}: ConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 sm:p-8 bg-card border-2 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-center mb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${isDangerous ? "bg-red-500/20" : "bg-yellow-500/20"}`}
          >
            <AlertCircle className={`h-6 w-6 ${isDangerous ? "text-red-600" : "text-yellow-600"}`} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">{title}</h2>

        <p className="text-center text-muted-foreground mb-6">{message}</p>

        <div className="flex gap-3">
          <Button onClick={onCancel} variant="outline" size="lg" className="flex-1 bg-transparent">
            <XCircle className="mr-2 h-5 w-5" />
            {cancelText}
          </Button>
          <Button onClick={onConfirm} size="lg" className="flex-1" variant={isDangerous ? "destructive" : "default"}>
            <CheckCircle2 className="mr-2 h-5 w-5" />
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  )
}
