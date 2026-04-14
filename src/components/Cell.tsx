import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { CellData } from "../types";

interface CellProps {
  cell: CellData;
  onPress: () => void;
  onLongPress: () => void;
}

// Función auxiliar para mantener los colores clásicos del Buscaminas
const getNumberColor = (mines: number): string => {
  switch (mines) {
    case 1:
      return "#0000FF"; // Azul
    case 2:
      return "#008000"; // Verde
    case 3:
      return "#FF0000"; // Rojo
    case 4:
      return "#000080"; // Azul oscuro
    case 5:
      return "#800000"; // Granate
    case 6:
      return "#008080"; // Verde azulado
    case 7:
      return "#000000"; // Negro
    case 8:
      return "#808080"; // Gris
    default:
      return "#000000";
  }
};

export const Cell: React.FC<CellProps> = ({ cell, onPress, onLongPress }) => {
  // Determinamos el contenido a mostrar
  let content = null;

  if (cell.isRevealed) {
    if (cell.isMine) {
      content = <Text style={styles.mineText}>💣</Text>;
    } else if (cell.adjacentMines > 0) {
      content = (
        <Text
          style={[
            styles.numberText,
            { color: getNumberColor(cell.adjacentMines) },
          ]}
        >
          {cell.adjacentMines}
        </Text>
      );
    }
  } else if (cell.isFlagged) {
    content = <Text style={styles.flagText}>🚩</Text>;
  }

  return (
    <TouchableOpacity
      style={[styles.cell, cell.isRevealed ? styles.revealed : styles.hidden]}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={300} // Tiempo en ms para que registre la bandera rápido
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>{content}</View>
    </TouchableOpacity>
  );
};

// Usamos StyleSheet para no mezclar lógica con presentación
const styles = StyleSheet.create({
  cell: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "#7B7B7B",
    alignItems: "center",
    justifyContent: "center",
  },
  hidden: {
    backgroundColor: "#BDBDBD",
    borderTopColor: "#FFFFFF",
    borderLeftColor: "#FFFFFF",
    borderWidth: 3, // Efecto 3D clásico de botón sin presionar
  },
  revealed: {
    backgroundColor: "#E0E0E0",
    borderWidth: 1,
    borderColor: "#A0A0A0", // Plano cuando está revelado
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  mineText: {
    fontSize: 16,
  },
  flagText: {
    fontSize: 16,
  },
});
