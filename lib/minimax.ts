import type { Player } from "@/app/page"
import { checkWinner, evaluatePosition } from "./game-logic"

interface Move {
  row: number
  col: number
  score?: number
}

function getAdaptiveDepth(board: Player[][], moveCount: number): number {
  const size = board.length

  // Early game (first 10 moves): use shallow depth for speed
  if (moveCount < 10) return 2

  // Adjust depth based on board size
  if (size <= 7) return 4
  if (size <= 10) return 3
  if (size <= 15) return 2
  return 1 // Large boards use minimal depth
}

function getEmptyCells(board: Player[][]): Move[] {
  const cells: Move[] = []
  const size = board.length

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === null) {
        cells.push({ row, col })
      }
    }
  }

  return cells
}

function getStrategicMoves(board: Player[][], maxMoves = 15): Move[] {
  const size = board.length
  const moves: Move[] = []
  const occupied = new Set<string>()

  // Find all occupied cells
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] !== null) {
        occupied.add(`${row},${col}`)
      }
    }
  }

  // If board is empty, return center
  if (occupied.size === 0) {
    const center = Math.floor(size / 2)
    return [{ row: center, col: center }]
  }

  const candidates = new Set<string>()
  for (const pos of occupied) {
    const [r, c] = pos.split(",").map(Number)
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const newRow = r + dr
        const newCol = c + dc
        if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && board[newRow][newCol] === null) {
          candidates.add(`${newRow},${newCol}`)
        }
      }
    }
  }

  // Convert to moves array
  for (const pos of candidates) {
    const [row, col] = pos.split(",").map(Number)
    moves.push({ row, col })
  }

  if (moves.length > maxMoves) {
    const center = Math.floor(size / 2)
    moves.sort((a, b) => {
      const distA = Math.abs(a.row - center) + Math.abs(a.col - center)
      const distB = Math.abs(b.row - center) + Math.abs(b.col - center)
      return distA - distB
    })
    return moves.slice(0, maxMoves)
  }

  return moves
}

function minimax(
  board: Player[][],
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiPlayer: Player,
): number {
  const opponent = aiPlayer === "X" ? "O" : "X"

  // Check terminal states
  const emptyCells = getEmptyCells(board)
  if (emptyCells.length === 0) return 0
  if (depth === 0) return evaluatePosition(board, aiPlayer)

  if (isMaximizing) {
    let maxScore = Number.NEGATIVE_INFINITY
    const moves = getStrategicMoves(board, 12)

    for (const move of moves) {
      board[move.row][move.col] = aiPlayer

      if (checkWinner(board, move.row, move.col, aiPlayer)) {
        board[move.row][move.col] = null
        return 100000 - depth
      }

      const score = minimax(board, depth - 1, alpha, beta, false, aiPlayer)
      board[move.row][move.col] = null

      maxScore = Math.max(maxScore, score)
      alpha = Math.max(alpha, score)
      if (beta <= alpha) break
    }

    return maxScore
  } else {
    let minScore = Number.POSITIVE_INFINITY
    const moves = getStrategicMoves(board, 12)

    for (const move of moves) {
      board[move.row][move.col] = opponent

      if (checkWinner(board, move.row, move.col, opponent)) {
        board[move.row][move.col] = null
        return -100000 + depth
      }

      const score = minimax(board, depth - 1, alpha, beta, true, aiPlayer)
      board[move.row][move.col] = null

      minScore = Math.min(minScore, score)
      beta = Math.min(beta, score)
      if (beta <= alpha) break
    }

    return minScore
  }
}

export function getBestMove(board: Player[][], aiPlayer: Player, moveCount = 0): Move | null {
  const moves = getStrategicMoves(board, 15)
  if (moves.length === 0) return null

  let bestMove: Move | null = null
  let bestScore = Number.NEGATIVE_INFINITY

  // Check for immediate winning move
  for (const move of moves) {
    board[move.row][move.col] = aiPlayer
    if (checkWinner(board, move.row, move.col, aiPlayer)) {
      board[move.row][move.col] = null
      return move
    }
    board[move.row][move.col] = null
  }

  // Check for blocking opponent's winning move
  const opponent = aiPlayer === "X" ? "O" : "X"
  for (const move of moves) {
    board[move.row][move.col] = opponent
    if (checkWinner(board, move.row, move.col, opponent)) {
      board[move.row][move.col] = null
      return move
    }
    board[move.row][move.col] = null
  }

  const depth = getAdaptiveDepth(board, moveCount)

  // Use minimax for best strategic move
  for (const move of moves) {
    board[move.row][move.col] = aiPlayer
    const score = minimax(board, depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false, aiPlayer)
    board[move.row][move.col] = null

    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}
