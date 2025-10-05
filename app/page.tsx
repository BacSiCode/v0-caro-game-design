"use client"

import { useState } from "react"
import { GameBoard } from "@/components/game-board"
import { ModeSelector } from "@/components/mode-selector"
import { GameStatus } from "@/components/game-status"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

export type GameMode = "pvp" | "pve" | null
export type Player = "X" | "O" | null

export default function CaroGame() {
  const [gameMode, setGameMode] = useState<GameMode>(null)
  const [boardSize, setBoardSize] = useState(15)
  const [board, setBoard] = useState<Player[][]>(
    Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(null)),
  )
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
  const [winner, setWinner] = useState<Player | "draw">(null)
  const [winningLine, setWinningLine] = useState<number[][]>([])
  const [moveCount, setMoveCount] = useState(0)

  const resetGame = () => {
    const newBoard = Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(null))
    setBoard(newBoard)
    setCurrentPlayer("X")
    setWinner(null)
    setWinningLine([])
    setMoveCount(0)
  }

  const handleModeSelect = (mode: GameMode, size: number) => {
    setGameMode(mode)
    setBoardSize(size)
    const newBoard = Array(size)
      .fill(null)
      .map(() => Array(size).fill(null))
    setBoard(newBoard)
    setCurrentPlayer("X")
    setWinner(null)
    setWinningLine([])
    setMoveCount(0)
  }

  const backToMenu = () => {
    setGameMode(null)
    resetGame()
  }

  if (!gameMode) {
    return <ModeSelector onSelectMode={handleModeSelect} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-2 text-balance">Caro Game</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {gameMode === "pvp" ? "Người chơi vs Người chơi" : "Người chơi vs Máy (AI Minimax)"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          <div className="flex-1 flex justify-center">
            <GameBoard
              board={board}
              setBoard={setBoard}
              currentPlayer={currentPlayer}
              setCurrentPlayer={setCurrentPlayer}
              winner={winner}
              setWinner={setWinner}
              winningLine={winningLine}
              setWinningLine={setWinningLine}
              gameMode={gameMode}
              moveCount={moveCount}
              setMoveCount={setMoveCount}
            />
          </div>

          <div className="w-full lg:w-80 space-y-4">
            <GameStatus currentPlayer={currentPlayer} winner={winner} gameMode={gameMode} moveCount={moveCount} />

            <div className="flex flex-col gap-3">
              <Button onClick={resetGame} variant="outline" size="lg" className="w-full bg-transparent">
                <RotateCcw className="mr-2 h-5 w-5" />
                Chơi lại
              </Button>
              <Button onClick={backToMenu} variant="secondary" size="lg" className="w-full">
                Về menu chính
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
