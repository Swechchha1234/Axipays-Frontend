import React, { useEffect, useState, useMemo } from 'react';
import Plot from 'react-plotly.js';

const StackedBarChart = ({ fromDate, toDate }) => {
  const [chartType, setChartType] = useState('bar');
  const historicalData = {
    '2025-01-01': { success: 0, failed: 0, incomplete: 0 },
    '2025-01-02': { success: 0, failed: 0, incomplete: 0 },
    '2025-01-03': { success: 0, failed: 0, incomplete: 0 },
    '2025-01-04': { success: 0, failed: 0, incomplete: 0 },
    '2025-01-05': { success: 0, failed: 0, incomplete: 0 },
    '2025-01-06': { success: 0, failed: 0, incomplete: 0 },
    '2025-01-07': { success: 0, failed: 0, incomplete: 0 },
  };

  useEffect(() => {
    const diffDays = Math.ceil((new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24));
    setChartType(diffDays > 14 ? 'line' : 'bar');
  }, [fromDate, toDate]);

  const generateDataForDateRange = () => {
    const successData = [];
    const failedData = [];
    const incompleteData = [];
    const labels = [];

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      const { success = 0, failed = 0, incomplete = 0 } = historicalData[dateString] || {};

      if (chartType === 'bar') {
        successData.push(success);
        failedData.push(failed);
        incompleteData.push(incomplete);
        labels.push(dateString);
      } else {
        const monthString = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
        const prevIndex = labels.indexOf(monthString);

        if (prevIndex === -1) {
          labels.push(monthString);
          successData.push(success);
          failedData.push(failed);
          incompleteData.push(incomplete);
        } else {
          successData[prevIndex] += success;
          failedData[prevIndex] += failed;
          incompleteData[prevIndex] += incomplete;
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return { successData, failedData, incompleteData, labels };
  };

  const { successData, failedData, incompleteData, labels } = useMemo(generateDataForDateRange, [fromDate, toDate, chartType]);

  const data = [
    { x: labels, y: successData, name: 'Success', type: chartType === 'bar' ? 'bar' : 'scatter', mode: chartType === 'bar' ? undefined : 'lines+markers', marker: { color: '#005CB8' }, showlegend: false },
    { x: labels, y: failedData, name: 'Failed', type: chartType === 'bar' ? 'bar' : 'scatter', mode: chartType === 'bar' ? undefined : 'lines+markers', marker: { color: '#247CFF' }, showlegend: false },
    { x: labels, y: incompleteData, name: 'Incomplete', type: chartType === 'bar' ? 'bar' : 'scatter', mode: chartType === 'bar' ? undefined : 'lines+markers', marker: { color: '#D6EBFF' }, showlegend: false },
  ];

  const layout = {
    title: {
      font: { size: 16 },
      x: 0.5,
      xanchor: 'center',
    },
    barmode: chartType === 'bar' ? 'stack' : undefined,
    xaxis: {
      tickmode: 'array',
      tickvals: labels,
      ticktext: labels.map(date => chartType === 'bar' ? date.split('-')[2] : `${date.split('-')[1]}-${date.split('-')[0]}`), // Show day or month-year
    },
    yaxis: {},
    bargap: 0.7,
    height: 300,
    margin: { l: 50, r: 50, t: 40, b: 30 },
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '15px', overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
      <Plot data={data} layout={layout} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default StackedBarChart;
