"use client"

import AggregatorClient, {hardwareSharedMemoryAtom} from "@/agreggatorClient/AggregatorClient";
import {useAtom} from "jotai";
import RealtimeChartComponent from "@/app/appShellComponents/RealtimeChartComponent";

export default function TestingPage(){
    const[readings]=useAtom(hardwareSharedMemoryAtom)

    const value1 = Number(readings["Mesin1_HoldingRegister_Register1"])
    const value2 = Number(readings["Mesin1_HoldingRegister_Register2"])
    const totalValue = value1 + value2

    return (
        <>
            <h1>Aggregator Client Monitor</h1>
            <p>Mesin1 - HoldingRegister - Register1: {readings["Mesin1_HoldingRegister_reg1"]}</p>
            <p>Mesin1 - HoldingRegister - Register2: {readings["Mesin1_HoldingRegister_reg2"]}</p>
            <p>Mesin1 - HoldingRegister - Register3: {readings["Mesin1_HoldingRegister_reg3"]}</p>
            <p>-</p>
            <p>Custom Tags: {readings["NodeCustom_GroupCustom_Custom1"]}</p>
            <p>-</p>
            <p>Mesin1 - Running Time: {readings["Mesin1_Utility_RunningHour"]}</p>
            <p>Mesin2 - Running Time: {readings["Mesin2_Utility_RunningHour"]}</p>
            <p>Mesin3 - Running Time: {readings["Mesin3_Utility_RunningHour"]}</p>
            <p>-</p>
            <RealtimeChartComponent
                title={"chart1"}
                subtext={"ini chart 1"}
                dataSource={readings["Mesin1_HoldingRegister_reg1"]}
                dataUnit={"RPM"}
                maximumDataPoint={60}
                moving={true}
                colour={"hotpink"}
                chartWidth={"100%"}
                chartHeight={300}
            />
            <RealtimeChartComponent
                title={"chart2"}
                subtext={"ini chart 2"}
                dataSource={readings["Mesin1_HoldingRegister_reg2"]}
                dataUnit={"Cel."}
                maximumDataPoint={60}
                moving={false}
                colour={"green"}
                chartWidth={"100%"}
                chartHeight={300}
            />
            <p></p>
            <p>Start: {readings["Mesin2_StatusMesin_Start"]}</p>
            <p>Stop: {readings["Mesin2_StatusMesin_Stop"]}</p>
            <p>Counter: {readings["Mesin2_CounterMonitor_C1"]}</p>
            <p>Output: {readings["Mesin2_MonitorOutput_Y10"]}</p>
            <p>-</p>
            <p>mqttNode1 - group1 - tag1 : {readings["r_mqttNode1_group1_tag1"]}</p>
            <p>mqttNode1 - group1 - tag2 : {readings["r_mqttNode1_group1_tag2"]}</p>
            <p>mqttNode1 - group1 - tag3 : {readings["r_mqttNode1_group1_tag3"]}</p>
            <p>-</p>
        </>
    );
}