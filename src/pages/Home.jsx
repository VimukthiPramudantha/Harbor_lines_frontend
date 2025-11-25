import React from "react";
import FloatingLines from "../components/FloatingLines";

export default function Home() {
  return (
    <div style={{ width: "100%", height: "600px", position: "relative" }}>
      <FloatingLines
        enabledWaves={["top", "middle", "bottom"]}
        // Array - specify line count per wave; Number - same count for all waves
        lineCount={[10, 15, 20]}
        // Array - specify line distance per wave; Number - same distance for all waves
        lineDistance={[8, 6, 4]}
        bendRadius={5.0}
        bendStrength={-0.5}
        interactive={true}
        parallax={true}
      />
    </div>
  );
}
