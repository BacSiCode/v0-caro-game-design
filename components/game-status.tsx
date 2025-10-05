"use client"

import { Card } from "@/components/ui/card"
import { Trophy, Users, Bot, Circle, X } from "lucide-react"
import type { Player, GameMode } from "@/app/page"

interface GameStatusProps {
  currentPlayer: Player
  winner: Player | "draw" | null
  gameMode: GameMode
  moveCount: number
}

export function GameStatus({ currentPlayer, winner, gameMode, moveCount }: GameStatusProps) {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-2">
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-border">
          {gameMode === "pvp" ? <Users className="h-6 w-6 text-primary" /> : <Bot className="h-6 w-6 text-secondary" />}
          <h2 className="text-xl font-semibold text-card-foreground">Trạng thái trận đấu</h2>
        </div>

        {winner ? (
          <div className="text-center py-6 space-y-3">
            <Trophy className="h-16 w-16 mx-auto text-yellow-500 animate-bounce" />
            {winner === "draw" ? (
              <>
                <h3 className="text-2xl font-bold text-foreground">Hòa!</h3>
                <p className="text-muted-foreground">Trận đấu kết thúc hòa</p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-foreground">
                  {winner === "X" ? "Người chơi X" : gameMode === "pve" ? "AI" : "Người chơi O"} thắng!
                </h3>
                <div className={`text-5xl font-bold ${winner === "X" ? "text-primary" : "text-secondary"}`}>
                  {winner}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-2">Lượt của</p>
              <div className="flex items-center justify-center gap-3">
                {currentPlayer === "X" ? (
                  <X className="h-8 w-8 text-primary" />
                ) : (
                  <Circle className="h-8 w-8 text-secondary" />
                )}
                <span className={`text-3xl font-bold ${currentPlayer === "X" ? "text-primary" : "text-secondary"}`}>
                  {currentPlayer}
                </span>
              </div>
              {gameMode === "pve" && (
                <p className="text-sm text-muted-foreground mt-2">
                  {currentPlayer === "X" ? "Bạn" : "AI đang suy nghĩ..."}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
              <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <X className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">X</span>
                </div>
                <p className="text-xs text-muted-foreground">{gameMode === "pve" ? "Bạn" : "Người chơi 1"}</p>
              </div>
              <div className="text-center p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Circle className="h-5 w-5 text-secondary" />
                  <span className="text-sm font-medium text-secondary">O</span>
                </div>
                <p className="text-xs text-muted-foreground">{gameMode === "pve" ? "AI" : "Người chơi 2"}</p>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Số nước đã đi: <span className="font-semibold text-foreground">{moveCount}</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
