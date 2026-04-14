import { CellData, BoardData } from "../types";
import { ADJACENT_DIRECTIONS } from "../constants/gameConfig";

// Generar un tablero vacío
export const createEmptyBoard = (rows: number, cols: number): BoardData => {
  const board: BoardData = [];
  for (let r = 0; r < rows; r++) {
    const row: CellData[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      });
    }
    board.push(row);
  }
  return board;
};

// Plantar minas aleatoriamente
export const plantMines = (board: BoardData, numMines: number): BoardData => {
  const rows = board.length;
  const cols = board[0].length;
  let minesPlanted = 0;

  // Hacemos una copia profunda (deep copy) de la matriz para no mutar el argumento original
  const newBoard: BoardData = board.map((row) =>
    row.map((cell) => ({ ...cell })),
  );

  while (minesPlanted < numMines) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomCol = Math.floor(Math.random() * cols);

    // Solo colocamos la mina si esa celda no tiene una ya
    if (!newBoard[randomRow][randomCol].isMine) {
      newBoard[randomRow][randomCol].isMine = true;
      minesPlanted++;
    }
  }

  return newBoard;
};

// Calcular los números de advertencia (minas adyacentes)
export const calculateAdjacentMines = (board: BoardData): BoardData => {
  const rows = board.length;
  const cols = board[0].length;

  const newBoard: BoardData = board.map((row) =>
    row.map((cell) => ({ ...cell })),
  );

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Si la celda es una mina, no necesitamos calcular sus adyacencias
      if (newBoard[r][c].isMine) continue;

      let mineCount = 0;

      // Revisamos las 8 direcciones posibles usando nuestra constante
      ADJACENT_DIRECTIONS.forEach(([dr, dc]) => {
        const newRow = r + dr;
        const newCol = c + dc;

        const isRowValid = newRow >= 0 && newRow < rows;
        const isColValid = newCol >= 0 && newCol < cols;

        // Si la posición vecina es válida y tiene una mina, sumamos al contador
        if (isRowValid && isColValid && newBoard[newRow][newCol].isMine) {
          mineCount++;
        }
      });

      newBoard[r][c].adjacentMines = mineCount;
    }
  }

  return newBoard;
};

// Función "Factory" para construir el tablero completo listo para jugar
export const initializeBoard = (
  rows: number,
  cols: number,
  mines: number,
): BoardData => {
  let board = createEmptyBoard(rows, cols);
  board = plantMines(board, mines);
  board = calculateAdjacentMines(board);
  return board;
};
