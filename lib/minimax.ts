import type { Player, Difficulty } from "@/app/page"
import { checkWinner, evaluatePosition } from "./game-logic"

interface Move {
  row: number
  col: number
  score?: number
}

function getDepthByDifficulty(difficulty: Difficulty, boardSize: number, moveCount: number): number {
  if (difficulty === "easy") {
    // Easy: very shallow search, mostly random
    return 1
  } else if (difficulty === "medium") {
    // Medium: moderate search depth
    if (moveCount < 8) return 2
    if (boardSize <= 10) return 3
    if (boardSize <= 15) return 2
    return 1
  } else {
    // Hard: deep aggressive search
    if (moveCount < 8) return 4
    if (boardSize <= 7) return 6
    if (boardSize <= 10) return 5
    if (boardSize <= 15) return 4
    return 3
  }
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

function getStrategicMoves(board: Player[][], difficulty: Difficulty, maxMoves = 15): Move[] {
  const size = board.length
  const moves: Move[] = []
  const occupied = new Set<string>()

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] !== null) {
        occupied.add(`${row},${col}`)
      }
    }
  }

  if (occupied.size === 0) {
    const center = Math.floor(size / 2)
    return [{ row: center, col: center }]
  }

  const candidates = new Set<string>()

  const searchRadius = difficulty === "easy" ? 2 : difficulty === "medium" ? 1.5 : 1

  for (const pos of occupied) {
    const [r, c] = pos.split(",").map(Number)
    for (let dr = -Math.ceil(searchRadius); dr <= Math.ceil(searchRadius); dr++) {
      for (let dc = -Math.ceil(searchRadius); dc <= Math.ceil(searchRadius); dc++) {
        const newRow = r + dr
        const newCol = c + dc
        if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && board[newRow][newCol] === null) {
          candidates.add(`${newRow},${newCol}`)
        }
      }
    }
  }

  for (const pos of candidates) {
    const [row, col] = pos.split(",").map(Number)
    moves.push({ row, col })
  }

  const moveLimit = difficulty === "easy" ? 8 : difficulty === "medium" ? 12 : 20

  if (moves.length > moveLimit) {
    const center = Math.floor(size / 2)
    moves.sort((a, b) => {
      const distA = Math.abs(a.row - center) + Math.abs(a.col - center)
      const distB = Math.abs(b.row - center) + Math.abs(b.col - center)
      return distA - distB
    })
    return moves.slice(0, moveLimit)
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
  difficulty: Difficulty,
): number {
  const opponent = aiPlayer === "X" ? "O" : "X"

  const emptyCells = getEmptyCells(board)
  if (emptyCells.length === 0) return 0
  if (depth === 0) return evaluatePosition(board, aiPlayer)

  if (isMaximizing) {
    let maxScore = Number.NEGATIVE_INFINITY
    const moves = getStrategicMoves(board, difficulty, difficulty === "easy" ? 8 : difficulty === "medium" ? 12 : 20)

    for (const move of moves) {
      board[move.row][move.col] = aiPlayer

      if (checkWinner(board, move.row, move.col, aiPlayer)) {
        board[move.row][move.col] = null
        return 100000 - depth
      }

      const score = minimax(board, depth - 1, alpha, beta, false, aiPlayer, difficulty)
      board[move.row][move.col] = null

      maxScore = Math.max(maxScore, score)
      alpha = Math.max(alpha, score)
      if (beta <= alpha) break
    }

    return maxScore
  } else {
    let minScore = Number.POSITIVE_INFINITY
    const moves = getStrategicMoves(board, difficulty, difficulty === "easy" ? 8 : difficulty === "medium" ? 12 : 20)

    for (const move of moves) {
      board[move.row][move.col] = opponent

      if (checkWinner(board, move.row, move.col, opponent)) {
        board[move.row][move.col] = null
        return -100000 + depth
      }

      const score = minimax(board, depth - 1, alpha, beta, true, aiPlayer, difficulty)
      board[move.row][move.col] = null

      minScore = Math.min(minScore, score)
      beta = Math.min(beta, score)
      if (beta <= alpha) break
    }

    return minScore
  }
}

export function getBestMove(
  board: Player[][],
  aiPlayer: Player,
  difficulty: "easy" | "medium" | "hard" = "medium",
  moveCount = 0,
): Move | null {
  const moves = getStrategicMoves(board, difficulty, 20)
  if (moves.length === 0) return null

  if (difficulty === "easy") {
    if (Math.random() < 0.6) {
      return moves[Math.floor(Math.random() * Math.min(3, moves.length))]
    }
  }

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
      if (difficulty !== "easy" || Math.random() < 0.5) {
        return move
      }
    }
    board[move.row][move.col] = null
  }

  const depth = getDepthByDifficulty(difficulty, board.length, moveCount)

  for (const move of moves) {
    board[move.row][move.col] = aiPlayer
    const score = minimax(board, depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, false, aiPlayer, difficulty)
    board[move.row][move.col] = null

    if (score > bestScore) {
      bestScore = score
      bestMove = move
    }
  }

  return bestMove
}
