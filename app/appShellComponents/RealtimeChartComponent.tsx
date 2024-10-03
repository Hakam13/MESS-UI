// components/RealTimeChart.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import {Box, Paper} from "@mantine/core";

export default function RealtimeChartComponent(
    {
        title,
        subtext,
        dataSource,
        dataUnit,
        maximumDataPoint,
        moving,
        colour,
        chartWidth,
        chartHeight
    }: {
        title: string
        subtext: string
        dataSource: any
        dataUnit: string
        maximumDataPoint: number
        moving: boolean
        colour: string
        chartWidth: any
        chartHeight: any
    }
) {
    const chartRef = useRef<HTMLDivElement>(null);
    const [chartInstance, setChartInstance] = useState<echarts.EChartsType | null>(null);
    const [data, setData] = useState<{ name: string, value: [string, number] }[]>([]);
    
    // Maximum data points to display in the chart
    const MAX_DATA_POINTS = maximumDataPoint;

    // Initialize the chart
    useEffect(() => {
        if (chartRef.current && !chartInstance) {
            const instance = echarts.init(chartRef.current);
            setChartInstance(instance);
        }
    }, [chartRef, chartInstance]);

    useEffect(() => {
        const updateChartData = () => {
            const currentTime = new Date();
            const formattedTime = `${currentTime.getFullYear()}/${currentTime.getMonth() + 1}/${currentTime.getDate()} ${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
            const newValue = dataSource || 0; // Ensure fallback to 0 if undefined

            setData((prevData: any) => {
                const newData = [...prevData, { name: formattedTime, value: [formattedTime, newValue] }];
                // Limit the data to the last 100 readings
                return newData.length > MAX_DATA_POINTS ? newData.slice(-MAX_DATA_POINTS) : newData;
            });
        };

        if (moving){
            // Update the chart at regular intervals (1 second)
            const interval = setInterval(() => {
                updateChartData();
            }, 1000);

            // Clean up the interval on component unmount
            return () => clearInterval(interval);
        } else {
            updateChartData()
        }

    }, [MAX_DATA_POINTS, dataSource, moving]);

    // Update the chart whenever data changes
    useEffect(() => {
        if (chartInstance) {
            chartInstance.setOption({
                title: {
                    text: title,
                    textStyle: {
                        color: 'black',
                        fontSize: 18,
                        fontWeight: 'bold'
                    },
                    subtext: `Current Value: ${dataSource || 0}`,
                    subtextStyle: {
                        color: 'black',
                        fontSize: 14,
                        fontWeight: 'bold'
                    },
                    top: 10,
                    padding: [
                        5,  // up
                        0, // right
                        5,  // down
                        5, // left
                    ],
                },
                grid: {
                    left: '10%',
                    right: '5%',
                    bottom: '10%',
                    top: '30%',
                },
                // legend: {
                //     orient: 'vertical',
                //     left: 10,
                //     top: 'center'
                // },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'cross' },
                    formatter: function (params: any) {
                        params = params[0];
                        const date = new Date(params.name);
                        return (
                            `Time: ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} | Value: ${params.value[1]}`
                        );
                    },
                },
                toolbox:{
                    show: true,
                    feature: {
                    },
                },
                xAxis: {
                    type: 'time',  // Use 'category' to handle string dates
                    // data: data.map(item => new Date(item.name)),
                    boundaryGap: false,
                },
                yAxis: {
                    type: 'value',
                    boundaryGap: [0, '100%'],
                    axisLabel: {
                        formatter: `{value} ${dataUnit}`
                    }
                },
                series: [
                    {
                        name: 'Reading',
                        type: 'line',
                        data: data,
                        showSymbol: false,
                        smooth: true,
                        color: `${colour || '#3baefe'}`,
                        markLine: {
                            data: [
                                { type: 'average', name: 'Avg' },
                                [
                                    {
                                        symbol: 'none',
                                        x: '90%',
                                        yAxis: 'max'
                                    },
                                    {
                                        symbol: 'circle',
                                        label: {
                                            position: 'start',
                                            formatter: 'Max'
                                        },
                                        type: 'max',
                                        name: 'max'
                                    }
                                ]
                            ]
                        }
                    },
                ],
            });
        }
    }, [chartInstance, colour, data, dataSource, dataUnit, title]);

    return (
        <Paper shadow={"xs"} p={"sm"}>
            <div ref={chartRef} style={{ width: chartWidth, height: chartHeight }}></div>
        </Paper>
    );
};
