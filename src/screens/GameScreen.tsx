import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useMinesweeper } from "../hooks/useMinesweeper";
import { Board } from "../components/Board";

export const GameScreen: React.FC = () => {
  // Invocamos nuestro custom hook, que maneja TODA la lógica compleja
  const {
    board,
    status,
    timer,
    flagsCount,
    startNewGame,
    handleCellPress,
    handleCellLongPress,
  } = useMinesweeper();

  // Función para determinar qué carita mostrar según el estado del juego
  const getFaceIcon = () => {
    switch (status) {
      case "WON":
        return "😎";
      case "LOST":
        return "😵";
      default:
        return "😊";
    }
  };

  // Función para formatear los números al estilo clásico (ej: 005, 012)
  const formatNumber = (num: number) => {
    const safeNum = Math.max(0, num); // Evitamos números negativos visuales
    return safeNum.toString().padStart(3, "0");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Encabezado Superior (Header) */}
        <View style={styles.header}>
          {/* Contador de Minas (Banderas restantes) */}
          <View style={styles.digitalBox}>
            <Text style={styles.digitalText}>{formatNumber(flagsCount)}</Text>
          </View>

          {/* Botón de Reinicio (Carita) */}
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => startNewGame()}
            activeOpacity={0.7}
          >
            <Text style={styles.faceText}>{getFaceIcon()}</Text>
          </TouchableOpacity>

          {/* Temporizador */}
          <View style={styles.digitalBox}>
            <Text style={styles.digitalText}>{formatNumber(timer)}</Text>
          </View>
        </View>

        {/* Tablero de Juego */}
        <View style={styles.boardWrapper}>
          <Board
            board={board}
            onCellPress={handleCellPress}
            onCellLongPress={handleCellLongPress}
          />
        </View>

        {/* Mensaje de Fin de Juego (Opcional, para dar feedback claro) */}
        {status === "WON" && (
          <Text style={styles.resultText}>¡HAS GANADO!</Text>
        )}
        {status === "LOST" && (
          <Text style={styles.resultText}>¡HAS PERDIDO!</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#C0C0C0", // Color clásico de fondo de Windows
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#BDBDBD",
    padding: 10,
    marginBottom: 20,
    // Bordes biselados inversos para hundir el header
    borderWidth: 3,
    borderTopColor: "#7B7B7B",
    borderLeftColor: "#7B7B7B",
    borderBottomColor: "#FFFFFF",
    borderRightColor: "#FFFFFF",
  },
  digitalBox: {
    backgroundColor: "#000000",
    padding: 5,
    borderWidth: 2,
    borderTopColor: "#7B7B7B",
    borderLeftColor: "#7B7B7B",
    borderBottomColor: "#FFFFFF",
    borderRightColor: "#FFFFFF",
    width: 60,
    alignItems: "center",
  },
  digitalText: {
    color: "#FF0000", // Rojo clásico de los displays digitales
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "monospace", // Para simular fuente de reloj digital
  },
  resetButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C0C0C0",
    borderWidth: 3,
    borderTopColor: "#FFFFFF",
    borderLeftColor: "#FFFFFF",
    borderBottomColor: "#7B7B7B",
    borderRightColor: "#7B7B7B",
  },
  faceText: {
    fontSize: 28,
  },
  boardWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  resultText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});
