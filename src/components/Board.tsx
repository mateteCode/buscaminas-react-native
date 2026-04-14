import React from "react";
import { View, StyleSheet } from "react-native";
import { BoardData } from "../types";
import { Cell } from "./Cell";

interface BoardProps {
  board: BoardData;
  // Pasamos las coordenadas hacia arriba al componente padre
  onCellPress: (row: number, col: number) => void;
  onCellLongPress: (row: number, col: number) => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  onCellPress,
  onCellLongPress,
}) => {
  return (
    <View style={styles.boardContainer}>
      {/* Primer map: Iteramos sobre las filas */}
      {board.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {/* Segundo map: Iteramos sobre las celdas de esa fila */}
          {row.map((cell, colIndex) => (
            <Cell
              key={`cell-${rowIndex}-${colIndex}`}
              cell={cell}
              // Ejecutamos las funciones enviando la posición exacta
              onPress={() => onCellPress(rowIndex, colIndex)}
              onLongPress={() => onCellLongPress(rowIndex, colIndex)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    backgroundColor: "#BDBDBD",
    padding: 10,
    borderWidth: 4,
    borderTopColor: "#7B7B7B",
    borderLeftColor: "#7B7B7B",
    borderBottomColor: "#FFFFFF",
    borderRightColor: "#FFFFFF",
  },
  row: {
    flexDirection: "row", // Esto hace que las celdas se alineen horizontalmente
  },
});
