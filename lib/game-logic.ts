import type { Player } from "@/app/page"

export function checkWinner(board: Player[][], row: number, col: number, player: Player): number[][] | null {
  const size = board.length
  const directions = [
    [0, 1], // horizontal
    [1, 0], // vertical
    [1, 1], // diagonal \
    [1, -1], // diagonal /
  ]

  for (const [dx, dy] of directions) {
    const line: number[][] = [[row, col]]

    // Check forward direction
    let r = row + dx
    let c = col + dy
    while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === player) {
      line.push([r, c])
      r += dx
      c += dy
    }

    // Check backward direction
    r = row - dx
    c = col - dy
    while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === player) {
      line.push([r, c])
      r -= dx
      c -= dy
    }

    if (line.length >= 5) {
      return line
    }
  }

  return null
}

export function evaluateLine(
  board: Player[][],
  row: number,
  col: number,
  dx: number,
  dy: number,
  player: Player,
): number {
  const size = board.length
  let count = 0
  let openEnds = 0
  let r = row
  let c = col

  // Count consecutive pieces
  while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === player) {
    count++
    r += dx
    c += dy
  }
  if (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === null) {
    openEnds++
  }

  r = row - dx
  c = col - dy
  while (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === player) {
    count++
    r -= dx
    c -= dy
  }
  if (r >= 0 && r < size && c >= 0 && c < size && board[r][c] === null) {
    openEnds++
  }

  // Scoring based on pattern strength
  if (count >= 5) return 100000
  if (count === 4) {
    if (openEnds === 2) return 10000
    if (openEnds === 1) return 1000
  }
  if (count === 3) {
    if (openEnds === 2) return 1000
    if (openEnds === 1) return 100
  }
  if (count === 2) {
    if (openEnds === 2) return 100
    if (openEnds === 1) return 10
  }

  return count
}

export function evaluatePosition(board: Player[][], player: Player): number {
  const size = board.length
  const opponent = player === "X" ? "O" : "X"
  let score = 0
  const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ]

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === player) {
        for (const [dx, dy] of directions) {
          score += evaluateLine(board, row, col, dx, dy, player)
        }
      } else if (board[row][col] === opponent) {
        for (const [dx, dy] of directions) {
          score -= evaluateLine(board, row, col, dx, dy, opponent) * 1.1
        }
      }
    }
  }

  return score
}
