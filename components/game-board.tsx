"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import type { Player, GameMode, Difficulty } from "@/app/page"
import { checkWinner } from "@/lib/game-logic"
import { getBestMove } from "@/lib/minimax"

interface GameBoardProps {
  board: Player[][]
  setBoard: (board: Player[][]) => void
  currentPlayer: Player
  setCurrentPlayer: (player: Player) => void
  winner: Player | "draw" | null
  setWinner: (winner: Player | "draw" | null) => void
  winningLine: number[][]
  setWinningLine: (line: number[][]) => void
  gameMode: GameMode
  difficulty?: Difficulty
  moveCount: number
  setMoveCount: (count: number) => void
}

export function GameBoard({
  board,
  setBoard,
  currentPlayer,
  setCurrentPlayer,
  winner,
  setWinner,
  winningLine,
  setWinningLine,
  gameMode,
  difficulty = "medium",
  moveCount,
  setMoveCount,
}: GameBoardProps) {
  const boardSize = board.length
  const aiThinkingRef = useRef(false)

  const getAIDelay = () => {
    if (difficulty === "easy") return 300
    if (difficulty === "medium") return 500
    return 800 // hard mode takes longer to think
  }

  useEffect(() => {
    if (gameMode === "pve" && currentPlayer === "O" && !winner && !aiThinkingRef.current) {
      aiThinkingRef.current = true
      const timer = setTimeout(() => {
        const aiMove = getBestMove(board, "O", difficulty, moveCount)
        if (aiMove) {
          makeAIMove(aiMove.row, aiMove.col)
        }
        aiThinkingRef.current = false
      }, getAIDelay())
      return () => clearTimeout(timer)
    }
  }, [currentPlayer, winner, gameMode, board, moveCount, difficulty])

  const makeAIMove = (row: number, col: number) => {
    if (board[row][col] || winner) return

    const newBoard = board.map((r) => [...r])
    newBoard[row][col] = "O"
    setBoard(newBoard)
    setMoveCount(moveCount + 1)

    const winResult = checkWinner(newBoard, row, col, "O")
    if (winResult) {
      setWinner("O")
      setWinningLine(winResult)
    } else if (moveCount + 1 >= boardSize * boardSize) {
      setWinner("draw")
    } else {
      setCurrentPlayer("X")
    }
  }

  const handleCellClick = (row: number, col: number) => {
    if (board[row][col] || winner) return
    if (gameMode === "pve" && currentPlayer === "O") return

    const newBoard = board.map((r) => [...r])
    newBoard[row][col] = currentPlayer
    setBoard(newBoard)
    setMoveCount(moveCount + 1)

    const winResult = checkWinner(newBoard, row, col, currentPlayer)
    if (winResult) {
      setWinner(currentPlayer)
      setWinningLine(winResult)
    } else if (moveCount + 1 >= boardSize * boardSize) {
      setWinner("draw")
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
    }
  }

  const isWinningCell = (row: number, col: number) => {
    return winningLine.some(([r, c]) => r === row && c === col)
  }

  const cellSize =
    boardSize <= 10
      ? "w-10 h-10 sm:w-12 sm:h-12"
      : boardSize <= 15
        ? "w-8 h-8 sm:w-10 sm:h-10"
        : "w-6 h-6 sm:w-8 sm:h-8"
  const fontSize =
    boardSize <= 10 ? "text-xl sm:text-2xl" : boardSize <= 15 ? "text-lg sm:text-xl" : "text-base sm:text-lg"

  return (
    <div className="inline-block p-4 sm:p-6 bg-card rounded-xl shadow-2xl border-2 border-border">
      <div className="grid gap-1 sm:gap-1.5" style={{ gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))` }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              disabled={!!winner || !!cell || (gameMode === "pve" && currentPlayer === "O")}
              className={cn(
                cellSize,
                "rounded-md border-2 font-bold transition-all duration-200",
                "hover:scale-105 active:scale-95",
                "disabled:cursor-not-allowed",
                cell === "X" && "bg-primary/10 border-primary text-primary",
                cell === "O" && "bg-secondary/10 border-secondary text-secondary",
                !cell && !winner && "bg-muted/50 border-border hover:bg-muted hover:border-primary/50",
                isWinningCell(rowIndex, colIndex) && "animate-pulse ring-4 ring-yellow-400 scale-110",
                fontSize,
              )}
            >
              {cell}
            </button>
          )),
        )}
      </div>
    </div>
  )
}
