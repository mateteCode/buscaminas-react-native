import { useState, useCallback, useEffect } from "react";
import { BoardData, GameStatus, DifficultyConfig } from "../types";
import { DIFFICULTIES } from "../constants/gameConfig";
import {
  initializeBoard,
  revealCell,
  toggleFlag,
  checkWinCondition,
} from "../core/boardEngine";

export const useMinesweeper = (
  initialDifficulty: DifficultyConfig = DIFFICULTIES.BEGINNER,
) => {
  // Estados de React
  const [board, setBoard] = useState<BoardData>([]);
  const [status, setStatus] = useState<GameStatus>("IDLE");
  const [difficulty, setDifficulty] =
    useState<DifficultyConfig>(initialDifficulty);
  const [timer, setTimer] = useState<number>(0);
  const [flagsPlaced, setFlagsPlaced] = useState<number>(0);

  // Inicializar una nueva partida
  const startNewGame = useCallback(
    (newDifficulty?: DifficultyConfig) => {
      const gameDifficulty = newDifficulty || difficulty;

      // Usamos nuestro motor para crear el tablero inicial
      const newBoard = initializeBoard(
        gameDifficulty.rows,
        gameDifficulty.cols,
        gameDifficulty.mines,
      );

      setBoard(newBoard);
      setDifficulty(gameDifficulty);
      setStatus("PLAYING");
      setTimer(0);
      setFlagsPlaced(0);
    },
    [difficulty],
  );

  // Manejar el clic (toque) en una celda
  const handleCellPress = useCallback(
    (row: number, col: number) => {
      // Si no estamos jugando (perdimos o ganamos), ignoramos el toque
      if (status !== "PLAYING") return;

      // Llamamos a nuestro motor para revelar (y hacer la cascada si corresponde)
      const { newBoard, hitMine } = revealCell(board, row, col);
      setBoard(newBoard);

      if (hitMine) {
        setStatus("LOST");
        return; // Salimos temprano
      }

      // Si no pisó una mina, comprobamos si ganó
      if (checkWinCondition(newBoard)) {
        setStatus("WON");
      }
    },
    [board, status],
  );

  // Manejar el clic largo (mantener presionado para poner bandera)
  const handleCellLongPress = useCallback(
    (row: number, col: number) => {
      if (status !== "PLAYING") return;

      const cell = board[row][col];

      // Evitamos poner más banderas que el número de minas
      if (!cell.isFlagged && flagsPlaced >= difficulty.mines) return;

      const newBoard = toggleFlag(board, row, col);
      setBoard(newBoard);

      // Actualizamos el contador visual de banderas
      setFlagsPlaced((prev) => (!cell.isFlagged ? prev + 1 : prev - 1));
    },
    [board, status, flagsPlaced, difficulty.mines],
  );

  // Temporizador básico
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "PLAYING") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  // Inicializar el juego la primera vez que se monta el hook
  useEffect(() => {
    if (status === "IDLE") {
      startNewGame();
    }
  }, [status, startNewGame]);

  // Exponemos los estados y las funciones para que la UI las consuma
  return {
    board,
    status,
    difficulty,
    timer,
    flagsCount: difficulty.mines - flagsPlaced, // Minas restantes teóricas
    startNewGame,
    handleCellPress,
    handleCellLongPress,
  };
};
