import { DifficultyConfig } from "../types";

export const DIFFICULTIES = {
  BEGINNER: { rows: 9, cols: 9, mines: 10 } as DifficultyConfig,
  INTERMEDIATE: { rows: 16, cols: 16, mines: 40 } as DifficultyConfig,
  EXPERT: { rows: 30, cols: 16, mines: 99 } as DifficultyConfig,
};

// Direcciones para calcular las celdas adyacentes (arriba, abajo, diagonales, etc.)
export const ADJACENT_DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];
