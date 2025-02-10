import React from "react";
import Plot from "react-plotly.js";

const VolumeGraph = ({volume}) => {
  return (
    <div style={{ width: "250px", height: "150px", textAlign: "center", position: "relative" }}>
      <Plot
        data={[
          {
            x: [1, 2, 3, 4, 5], 
            y: [1, 1, 1, 1, 1], 
            // y: [10, 200, 150, 250, 300], 
            type: "scatter",
            mode: "lines",
            line: { color: "#28A745", width: 2 },
            // fill: "tozeroy",
            fillcolor: "rgba(40, 167, 69, 0.2)", 
          },
        ]}
        layout={{
          width: 150,
          height: 50,
          margin: { t: 10, b: 10, l: 10, r: 10 },
          xaxis: { visible: false },
          yaxis: { visible: false },
          showlegend: false,
          paper_bgcolor: "rgba(0,0,0,0)", 
          plot_bgcolor: "rgba(0,0,0,0)", 
        }}
        config={{ staticPlot: true }} 
      />
      <div style={{ marginTop: "-7px" }}>
        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#0A2955" }}>
          $000 <span style={{ color: "#28A745", fontSize: "16px", fontWeight: "bold" }}></span>
        </div>
        <div style={{ fontSize: "16px", color: "#0A2955" }}>{volume}</div>
      </div>
    </div>
  );
};

export default VolumeGraph;
