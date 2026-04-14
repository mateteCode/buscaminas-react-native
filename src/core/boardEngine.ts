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

// Revelar una celda (y aplicar cascada si es 0)
export const revealCell = (
  board: BoardData,
  row: number,
  col: number,
): { newBoard: BoardData; hitMine: boolean } => {
  // Deep copy para mantener la inmutabilidad de React
  const newBoard: BoardData = board.map((r) => r.map((c) => ({ ...c })));
  const cell = newBoard[row][col];

  // Si ya está revelada o tiene bandera, no hacemos nada
  if (cell.isRevealed || cell.isFlagged) {
    return { newBoard, hitMine: false };
  }

  // Revelamos la celda seleccionada
  cell.isRevealed = true;

  // Si es mina, el juego termina
  if (cell.isMine) {
    return { newBoard, hitMine: true };
  }

  // Algoritmo "Flood Fill" (BFS - Breadth-First Search) para la cascada
  if (cell.adjacentMines === 0) {
    const queue: number[][] = [[row, col]];

    while (queue.length > 0) {
      // Tomamos la primera coordenada de la cola
      const [r, c] = queue.shift()!;

      // Revisamos sus vecinos
      ADJACENT_DIRECTIONS.forEach(([dr, dc]) => {
        const newRow = r + dr;
        const newCol = c + dc;

        const isRowValid = newRow >= 0 && newRow < newBoard.length;
        const isColValid = newCol >= 0 && newCol < newBoard[0].length;

        if (isRowValid && isColValid) {
          const neighbor = newBoard[newRow][newCol];

          // Si el vecino no está revelado, no tiene bandera y no es mina
          if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
            neighbor.isRevealed = true;

            // Si el vecino también es 0, lo agregamos a la cola para seguir expandiendo
            if (neighbor.adjacentMines === 0) {
              queue.push([newRow, newCol]);
            }
          }
        }
      });
    }
  }

  return { newBoard, hitMine: false };
};

// Colocar o quitar una bandera
export const toggleFlag = (
  board: BoardData,
  row: number,
  col: number,
): BoardData => {
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));
  const cell = newBoard[row][col];

  // Solo podemos poner bandera si la celda no está revelada
  if (!cell.isRevealed) {
    cell.isFlagged = !cell.isFlagged;
  }

  return newBoard;
};

// Comprobar si el jugador ha ganado
export const checkWinCondition = (board: BoardData): boolean => {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const cell = board[r][c];
      // Si hay una celda que NO es mina y NO está revelada, el juego aún no se gana
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  // Si revisó todo y todas las celdas seguras están reveladas, ¡Ganó!
  return true;
};
