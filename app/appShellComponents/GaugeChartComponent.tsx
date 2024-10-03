import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { TooltipComponent, TooltipComponentOption } from 'echarts/components';
import { GaugeChart, GaugeSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([TooltipComponent, GaugeChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  TooltipComponentOption | GaugeSeriesOption
>;

const GaugeChartComponent: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const myChart = echarts.init(chartRef.current!);
    
    const option: EChartsOption = {
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%',
      },
      series: [
        {
          name: 'Pressure',
          type: 'gauge',
          progress: {
            show: true,
          },
          detail: {
            valueAnimation: true,
            formatter: '{value}',
          },
          data: [
            {
              value: 79,
              name: 'SCORE',
            },
          ],
        },
      ],
    };

    myChart.setOption(option);

    // Cleanup on component unmount
    return () => {
      myChart.dispose();
    };
  }, []);

  return <div ref={chartRef} style={{ width: '300px', height: '250px' }} />;
};

export default GaugeChartComponent;
