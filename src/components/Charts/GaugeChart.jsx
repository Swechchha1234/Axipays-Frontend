import React from "react";
import Plot from "react-plotly.js";

const ApprovalRatioGauge = () => {
  return (

    <div style={{ width: "250px", height: "150px", textAlign: "center", position: "relative" }}>
      <Plot
        data={[
          {
            type: "pie",
            x: [1, 2, 3, 4, 5],
            values: [30, 70, 100],
            rotation: 270,
            textinfo: "none",
            hole: 0.6,
            sort: false,
            direction: "clockwise",
            marker: {
              // colors: ["#0A2955", "#F0F0F0", "rgba(255,255,255,0)"],
              colors: ["#F0F0F0", "#F0F0F0", "rgba(255,255,255,0)"],
            },
          },
        ]}
        layout={{
          width: 200,
          height: 150,
          margin: { t: 10, b: 10, l: 10, r: 10 },
          xaxis: { visible: false },
          yaxis: { visible: false },
          showlegend: false,
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          annotations: [
            {
              text: "0%",
              x: 0.5,
              y: 0.60,
              margin: { t: -10, b: 0, l: 0, r: 0 },
              font: { size: 24, color: "#0A2955" },
              showarrow: false,
            },
          ]
        }}
        config={{ staticPlot: true }}
      />
      <div style={{ marginTop: "-70px", marginBottom: "-50px" }}>
        <div style={{ fontSize: "16px", color: "#0A2955" }}>Approval Ratio</div>
      </div>
    </div>

  );
};

export default ApprovalRatioGauge;
