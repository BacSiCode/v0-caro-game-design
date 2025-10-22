export type GameMode = "pvp" | "pve" | null
export type Difficulty = "easy" | "medium" | "hard"
export type Player = "X" | "O" | null
export type RequestType = "draw" | "surrender" | null

export interface GameRequest {
  type: RequestType
  from: Player
  status: "pending" | "accepted" | "rejected"
}
