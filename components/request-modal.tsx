"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import type { GameRequest } from "@/lib/types"

interface RequestModalProps {
  request: GameRequest
  onAccept: () => void
  onReject: () => void
}

export function RequestModal({ request, onAccept, onReject }: RequestModalProps) {
  const isDrawRequest = request.type === "draw"
  const playerName = request.from === "X" ? "Người chơi X" : "Người chơi O"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6 sm:p-8 bg-card border-2 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-card-foreground text-center mb-2">
          {isDrawRequest ? "Yêu cầu hòa" : "Yêu cầu đầu hàng"}
        </h2>

        <p className="text-center text-muted-foreground mb-6">
          {playerName} {isDrawRequest ? "xin hòa" : "xin đầu hàng"}. Bạn có đồng ý không?
        </p>

        <div className="flex gap-3">
          <Button onClick={onReject} variant="outline" size="lg" className="flex-1 bg-transparent">
            <XCircle className="mr-2 h-5 w-5" />
            Từ chối
          </Button>
          <Button onClick={onAccept} size="lg" className="flex-1">
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Đồng ý
          </Button>
        </div>
      </Card>
    </div>
  )
}
