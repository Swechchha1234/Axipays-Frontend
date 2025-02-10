import React from 'react';
import Plot from 'react-plotly.js';

const LineChart = () => {
  const trace1 = {
    x: ["Day1", "Day2", "Day3", "Day4", "Day5", "Day6", "Day7"],
    y: [0, 0, 0, 0, 0, 0, 0],
    // type: 'scatter',
    // mode: 'lines+markers',
    marker: { color: 'blue' }
  };

  const data = [trace1];
  const layout = {
    height:300,
    margin: {
      l: 50,  
      r: 50, 
      t: 80, 
      b: 80  
    },
    shapes: [
      {
        type: 'line',
        x0: 0,
        y0: 0.5,
        x1: 1,
        y1: 0.5,
        xref: 'paper', 
        yref: 'paper', 
        line: {
          color: 'blue',
          width: 2,
        },
      },
    ],
  };
  return (
    <div  style={{
      position: 'relative',
      width: '100%',
      height: '100%', 
      borderRadius: '15px',
      overflow: 'hidden',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    }}>
    <Plot
      data={data}
      layout={layout}
      style={{ width: '100%', height: '100%'}}
    />
    </div>
  );
};

export default LineChart;
