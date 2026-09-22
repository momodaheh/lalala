import { Chart } from '@antv/g2';
import { useEffect, useRef } from 'react';

const ProductionEcharts = () => {
  const chartRef = useRef(null)

  useEffect(() => {
    if (!chartRef.current) {
    }
  })
  const renderChart = () => {
    const chart = new Chart({
      container: chartRef.current,
      autoFit: true,
    });
    chart.options({
      title: {
        text: '生产图表',
      },
      encode: {
        x: 'date',
        y: 'value',
      },
      
    });
  };
  return <div ref={chartRef}>生产图表</div>;
};

export default ProductionEcharts;
