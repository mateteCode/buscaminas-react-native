export interface CellData {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

export type BoardData = CellData[][];

export type GameStatus = "IDLE" | "PLAYING" | "WON" | "LOST";

export interface DifficultyConfig {
  rows: number;
  cols: number;
  mines: number;
}
