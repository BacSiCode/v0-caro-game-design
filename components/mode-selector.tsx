"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Bot, Grid3x3 } from "lucide-react"
import { useState } from "react"
import type { GameMode } from "@/app/page"

interface ModeSelectorProps {
  onSelectMode: (mode: GameMode, size: number) => void
}

export function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState(15)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground mb-4 text-balance">Caro Game</h1>
          <p className="text-lg sm:text-xl text-muted-foreground text-pretty">
            Trò chơi cờ caro với AI thông minh sử dụng thuật toán Minimax
          </p>
        </div>

        <Card className="p-6 sm:p-8 mb-6 bg-card/80 backdrop-blur-sm border-2">
          <div className="flex items-center gap-3 mb-4">
            <Grid3x3 className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-card-foreground">Chọn kích thước bàn cờ</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[7, 10, 15, 20].map((size) => (
              <Button
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                onClick={() => setSelectedSize(size)}
                className="h-16 text-lg font-semibold"
              >
                {size}×{size}
              </Button>
            ))}
          </div>
        </Card>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <Card
            className="p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-card/80 backdrop-blur-sm border-2 hover:border-primary"
            onClick={() => onSelectMode("pvp", selectedSize)}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-2">Người vs Người</h2>
                <p className="text-muted-foreground text-sm sm:text-base text-pretty">
                  Chơi với bạn bè trên cùng một thiết bị
                </p>
              </div>
              <Button size="lg" className="w-full mt-4">
                Bắt đầu chơi
              </Button>
            </div>
          </Card>

          <Card
            className="p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer bg-card/80 backdrop-blur-sm border-2 hover:border-secondary"
            onClick={() => onSelectMode("pve", selectedSize)}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-secondary/10 flex items-center justify-center">
                <Bot className="h-8 w-8 sm:h-10 sm:w-10 text-secondary" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-2">Người vs Máy</h2>
                <p className="text-muted-foreground text-sm sm:text-base text-pretty">
                  Thử thách với AI sử dụng thuật toán Minimax
                </p>
              </div>
              <Button size="lg" variant="secondary" className="w-full mt-4">
                Thách đấu AI
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-8 p-6 bg-muted/50 rounded-lg border">
          <h3 className="font-semibold text-foreground mb-2">Luật chơi:</h3>
          <ul className="text-sm text-muted-foreground space-y-1 leading-relaxed">
            <li>• Người chơi lần lượt đặt quân X và O lên bàn cờ</li>
            <li>• Người chơi đầu tiên tạo được 5 quân liên tiếp (ngang, dọc, chéo) sẽ thắng</li>
            <li>• Trong chế độ chơi với máy, bạn là X và đi trước, máy là O</li>
            <li>• AI sử dụng thuật toán Minimax để đưa ra nước đi tối ưu</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
