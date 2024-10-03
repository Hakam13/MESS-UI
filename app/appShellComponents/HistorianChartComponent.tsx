import { useEffect } from "react";
import * as echarts from "echarts";
import { Flex } from "@mantine/core";

// Function to trim or round numbers
function trimValue(value: number, decimals: number, roundUp: boolean): number {
    const factor = Math.pow(10, decimals);
    return roundUp
        ? Math.ceil(value * factor) / factor // Round up
        : Math.floor(value * factor) / factor; // Round down
}

export default function HistorianChartComponent({
                                         data,
                                         dataPointName,
                                         chartProperties = [], // Ensure chartProperties is an array
    chartWidth,
    chartHeight
                                     }: {
    data: Array<{ [key: string]: any }>;
    dataPointName: string;
    chartProperties: Array<{ [key: string]: any }>
    chartWidth: any
    chartHeight: any
}) {
    const chartId = dataPointName;

    useEffect(() => {
        if (data.length === 0 || !Array.isArray(chartProperties)) return; // Ensure chartProperties is an array

        // Extract timeData and dynamic seriesKeys
        const timeData = data.map((item) => new Date(item.timestamp).toLocaleString());
        const seriesKeys = Object.keys(data[0]).filter((key) => key !== "timestamp");

        // Find the chart properties based on dataPointName
        const chartProps = chartProperties.find((prop) => prop.tagName === dataPointName);

        if (!chartProps) {
            console.error("No chart properties found for:", dataPointName);
            return;
        }

        // Build seriesData dynamically based on chartProperties
        const seriesData = seriesKeys.map((key) => {
            let chartType = chartProps.VisualChartType?.[key] || "line"; // Default to "line" if not found

            // If chartType is 'area', set the type to 'line' but still apply areaStyle
            const actualType = chartType === "area" ? "line" : chartType;

            return {
                type: actualType,
                name: key,
                barGap: 0,
                emphasis: {
                    focus: "series",
                },
                sampling: "lttb",
                stack: chartProps.VisualChartStackedFlag?.[key] || "", // Default to empty if not found
                lineStyle: {
                    width: 1,
                },
                color: chartProps.VisualTagColour?.[key] || "#000", // Default color to black if not found

                // Conditionally add areaStyle if type is "area"
                ...(chartType === "area" && { areaStyle: {} }),

                data: data.map((item) => trimValue(item[key], 3, false)), // Trim data
            };
        });

        // Initialize chart
        const chartElement = document.getElementById(chartId) as HTMLDivElement | null;
        if (!chartElement) return;

        const myChart = echarts.init(chartElement);

        myChart.setOption({
            title: {
                text: dataPointName,
                left: "left",
                subtextStyle: {
                    color: "black",
                    fontSize: 14,
                    fontWeight: "bold",
                },
                top: 0,
                padding: [5, 10, 50, 10],
            },
            grid: {
                left: "15%",
                right: "10%",
                bottom: "20%",
                top: "15%",
            },
            tooltip: {
                axisPointer: { type: "cross" },
                trigger: "axis",
            },
            legend: {
                orient: "vertical",
                left: 10,
                top: "center",
            },
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    magicType: { show: true, type: ["line", "bar", "stack"] },
                    restore: {},
                    saveAsImage: { show: true },
                },
            },
            xAxis: {
                type: "category",
                axisTick: { alignWithLabel: true },
                axisLine: { onZero: true },
                splitLine: { show: false },
                splitArea: { show: true },
                data: timeData, // Dynamic xAxis data from timestamps
            },
            yAxis: {},
            dataZoom: [
                { type: "slider", xAxisIndex: 0, filterMode: "none" },
                { type: "slider", yAxisIndex: 0, filterMode: "none" },
                { type: "inside", xAxisIndex: 0, filterMode: "none" },
                { type: "inside", yAxisIndex: 0, filterMode: "none" },
            ],
            series: seriesData, // Dynamic series generated from keys and chartProperties
        });

        myChart.on("finished", () => {
            console.log("Chart rendered");
        });

        // Cleanup chart on component unmount
        return () => {
            if (myChart) {
                myChart.dispose();
            }
        };
    }, [data, dataPointName, chartProperties]); // Include chartProperties in dependencies

    return (
            <Flex id={chartId} style={{ width: chartWidth, height: chartHeight }} />
    );
}
