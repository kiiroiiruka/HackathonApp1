import type React from "react"
import { Stack } from "expo-router"

export const screenOptions = {
  title: "Map", // This sets the title in the header
}

const MapScreen: React.FC = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Map" }} /> {/* This also sets the title */}
      <div style={styles.container}>
        <h1 style={styles.text}>デフォルトのマップ画面</h1>
      </div>
    </>
  )
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: "24px",
    color: "#333",
  },
}

export default MapScreen