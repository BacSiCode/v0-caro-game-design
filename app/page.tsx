"use client"

import { useState } from "react"
import { GameBoard } from "@/components/game-board"
import { ModeSelector } from "@/components/mode-selector"
import { GameStatus } from "@/components/game-status"
import { RequestModal } from "@/components/request-modal"
import { Button } from "@/components/ui/button"
import { Flag, Handshake } from "lucide-react"
import { ConfirmationModal } from "@/components/confirmation-modal"
import type { GameMode, Difficulty, Player, GameRequest } from "@/lib/types"

export default function CaroGame() {
  const [gameMode, setGameMode] = useState<GameMode>(null)
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [boardSize, setBoardSize] = useState(15)
  const [board, setBoard] = useState<Player[][]>(
    Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(null)),
  )
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X")
  const [winner, setWinner] = useState<Player | "draw" | null>(null)
  const [winningLine, setWinningLine] = useState<number[][]>([])
  const [moveCount, setMoveCount] = useState(0)

  const [gameRequest, setGameRequest] = useState<GameRequest | null>(null)
  const [surrenderConfirmation, setSurrenderConfirmation] = useState(false)

  const resetGame = () => {
    const newBoard = Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(null))
    setBoard(newBoard)
    setCurrentPlayer("X")
    setWinner(null)
    setWinningLine([])
    setMoveCount(0)
    setGameRequest(null)
  }

  const handleModeSelect = (mode: GameMode, size: number, diff?: Difficulty) => {
    setGameMode(mode)
    setBoardSize(size)
    if (diff) setDifficulty(diff)
    const newBoard = Array(size)
      .fill(null)
      .map(() => Array(size).fill(null))
    setBoard(newBoard)
    setCurrentPlayer("X")
    setWinner(null)
    setWinningLine([])
    setMoveCount(0)
    setGameRequest(null)
  }

  const backToMenu = () => {
    setGameMode(null)
    resetGame()
  }

  const handleDrawRequest = () => {
    if (gameMode === "pvp") {
      setGameRequest({
        type: "draw",
        from: currentPlayer,
        status: "pending",
      })
    } else {
      setWinner("draw")
    }
  }

  const handleSurrenderRequest = () => {
    setSurrenderConfirmation(true)
  }

  const confirmSurrender = () => {
    setSurrenderConfirmation(false)
    if (gameMode === "pvp") {
      const opponent = currentPlayer === "X" ? "O" : "X"
      setWinner(opponent)
    } else {
      setWinner(currentPlayer === "X" ? "O" : "X")
    }
  }

  const handleRequestResponse = (accepted: boolean) => {
    if (!gameRequest) return

    if (accepted) {
      if (gameRequest.type === "draw") {
        setWinner("draw")
      } else if (gameRequest.type === "surrender") {
        const opponent = gameRequest.from === "X" ? "O" : "X"
        setWinner(opponent)
      }
    }
    setGameRequest(null)
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
            {gameMode === "pvp"
              ? "Người chơi vs Người chơi"
              : `Người chơi vs Máy (${difficulty === "easy" ? "Dễ" : difficulty === "medium" ? "Trung bình" : "Khó"})`}
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
              difficulty={difficulty}
              moveCount={moveCount}
              setMoveCount={setMoveCount}
            />
          </div>

          <div className="w-full lg:w-80 space-y-4">
            <GameStatus currentPlayer={currentPlayer} winner={winner} gameMode={gameMode} moveCount={moveCount} />

            <div className="flex flex-col gap-3">
              {!winner && (
                <>
                  <Button onClick={handleSurrenderRequest} variant="destructive" size="lg" className="w-full">
                    <Flag className="mr-2 h-5 w-5" />
                    Xin đầu hàng
                  </Button>
                  <Button onClick={handleDrawRequest} variant="outline" size="lg" className="w-full bg-transparent">
                    <Handshake className="mr-2 h-5 w-5" />
                    Xin hòa
                  </Button>
                </>
              )}
              {winner && (
                <Button onClick={resetGame} variant="default" size="lg" className="w-full">
                  Chơi lại
                </Button>
              )}
              <Button onClick={backToMenu} variant="secondary" size="lg" className="w-full">
                Về menu chính
              </Button>
            </div>
          </div>
        </div>
      </div>

      {gameRequest && gameMode === "pvp" && (
        <RequestModal
          request={gameRequest}
          onAccept={() => handleRequestResponse(true)}
          onReject={() => handleRequestResponse(false)}
        />
      )}

      {surrenderConfirmation && (
        <ConfirmationModal
          title="Xác nhận đầu hàng"
          message="Bạn có chắc chắn muốn đầu hàng không?"
          onConfirm={confirmSurrender}
          onCancel={() => setSurrenderConfirmation(false)}
          confirmText="Đầu hàng"
          cancelText="Hủy"
          isDangerous={true}
        />
      )}
    </div>
  )
}
