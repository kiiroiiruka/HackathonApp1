import React from "react";

const MapScreen: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.text}>デフォルトのマップ画面</h1>
    </div>
  );
};

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
};

export default MapScreen;
