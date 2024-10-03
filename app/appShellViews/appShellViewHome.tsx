import {Button, Card, Flex, Paper, Text, Title} from "@mantine/core";
import {useAtom} from "jotai/index";
import {
    hardwareSharedMemoryAtom,
    serverIPAddressAtom,
    softwareSharedMemoryAtom
} from "@/agreggatorClient/AggregatorClient";
import RealtimeChartComponent from "../appShellComponents/RealtimeChartComponent";

// Mockup data work orders
const workOrders = [
    {
        id: 1,
        name: "Work#1001",
        description: "Manufacture 500 units of product A",
        progress: "50%",
        machineStatus: "Running",
        machineSpeed: "1200 rpm",
        machineMode: "Automatic",
        paperConsumption: "300 kg",
        paperWaste: "10 kg",
        productOutput: "250 units"
    },
    {
        id: 2,
        name: "Work#1002",
        description: "Manufacture 300 units of product B",
        progress: "75%",
        machineStatus: "Running",
        machineSpeed: "1500 rpm",
        machineMode: "Manual",
        paperConsumption: "200 kg",
        paperWaste: "5 kg",
        productOutput: "225 units"
    },
    {
        id: 3,
        name: "Work#1003",
        description: "Manufacture 1000 units of product C",
        progress: "40%",
        machineStatus: "Stopped",
        machineSpeed: "0 rpm",
        machineMode: "Standby",
        paperConsumption: "100 kg",
        paperWaste: "3 kg",
        productOutput: "300 units"
    }
];

export default function AppShellViewHome() {
    const [serverIp, setServerIp] = useAtom(serverIPAddressAtom);
    const [hardwareMemory, setHardwareMemory] = useAtom(hardwareSharedMemoryAtom);
    const [softwareMemory, setSoftwareMemory] = useAtom(softwareSharedMemoryAtom);

    return (
        <>
            <Flex direction={"column"} justify={"space-around"}>
                <Flex direction={"row"} gap={"md"} justify={"center"}>
                    {/* Map work orders into cards */}
                    {workOrders.map((order) => (
                            <Card key={order.id}>
                                <Title order={5}>Work Order Details</Title>
                                <Text>Order Name: {order.name}</Text>
                                <Text>Description: {order.description}</Text>
                                <Text>Work Progress: {order.progress}</Text>
                                <Button onClick={()=> changeWorkOrder(serverIp, order.name)}>Select</Button>
                            </Card>
                    ))}
                </Flex>
                
                    <Flex direction={"row"} gap={"xl"} justify={"center"}>
                        
                        <Paper mt={"md"} shadow={"xs"}>
                            <Flex direction={"column"} gap={"md"}>
                            <Title order={5}>Machine Condition</Title>
                                <Text>Machine Status:</Text>
                                <Text>Machine Speed:</Text>
                                <Text>Machine Mode: {
                                    Number(softwareMemory["Client_RunningMode_Value"]) === 1
                                    ? "Setup/Trial"
                                    : Number(softwareMemory["Client_RunningMode_Value"]) === 2
                                    ? "Normal"
                                    : Number(softwareMemory["Client_RunningMode_Value"]) === 3
                                    ? "Maintenance"
                                    : Number(softwareMemory["Client_RunningMode_Value"]) === 4
                                    ? "Resetting"
                                    : "Unknown Status"
                                }</Text>
                            </Flex>
                        </Paper>

                        <RealtimeChartComponent
                                chartHeight={250}
                                chartWidth={250}
                                colour="pink"
                                dataSource={hardwareMemory["Mesin1_PaperConsumption_Normal1"]}
                                dataUnit="cm"
                                maximumDataPoint={20}
                                moving={false}
                                subtext=""
                                title="penggunaan kertas"
                            />
                    
                    <Paper mt={"md"} shadow={"xs"}>
                        <Flex direction={"column"}>
                            <Title order={5}>MES Data</Title>
                            <Text>Work Order Id:{softwareMemory["Client_WorkOrderId_Value"]} </Text>
                            <Text>Setup1: {hardwareMemory["Mesin1_PaperConsumption_Setup1"]} </Text>
                            <Text>Setup2: {hardwareMemory["Mesin1_PaperConsumption_Setup2"]} </Text>
                            <Text>Normal1: {hardwareMemory["Mesin1_PaperConsumption_Normal1"]} </Text>
                            <Text>Normal2: {hardwareMemory["Mesin1_PaperConsumption_Normal2"]} </Text>
                            <Text>Maintenance1: {hardwareMemory["Mesin1_PaperConsumption_Maintenance1"]} </Text>
                            <Text>Maintenance2: {hardwareMemory["Mesin1_PaperConsumption_Maintenance2"]} </Text>   
                        </Flex>
                    </Paper>
                    </Flex>
                    
                    
                    <Flex direction={"row"} gap={"xs"} justify={"center"} mt={"md"} mb={"sm"}>
                        <Button onClick={()=> changeRunningMode(serverIp, 1)}>Setup Mode</Button>
                        <Button onClick={()=> changeRunningMode(serverIp, 2)}>Normal Run Mode</Button>
                        <Button onClick={()=> changeRunningMode(serverIp, 3)}>Maintenance Mode</Button>
                        <Button onClick={()=> changeRunningMode(serverIp, 4)}>Reset</Button>
                        <Button onClick={()=> changeEnabler(serverIp, 1)}>Enabler</Button>
                        <Button onClick={()=> changeEnabler(serverIp, 0)}>Disabler</Button>
                    </Flex>
                

                
                
            </Flex>
        </>
    );
}

async function changeEnabler(ipaddress: string, mode: number) {
    try {
        fetch(`http://${ipaddress}:1111/modbus-write`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "Node": "Mesin1",
                "Group": "Enabler",
                "Tag": "reg5",
                "Value": `${mode}`,
                "ValueDataType": "uint16"
            }),
        })

        console.log('Running mode changed successfully');

    } catch (error) {
        console.error('Error changing running mode', error);
    }
}

async function changeRunningMode(ipaddress: string, mode: number) {
    try {
        // Menjalankan kedua request secara paralel menggunakan Promise.all
        const [response1, response2] = await Promise.all([
            fetch(`http://${ipaddress}:1111/modbus-write`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "Node": "Mesin1",
                    "Group": "HoldingRegister",
                    "Tag": "reg4",
                    "Value": `${mode}`,
                    "ValueDataType": "uint16"
                }),
            }),
            fetch(`http://${ipaddress}:5555/set-software-key-val-pair`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "node": "Client",
                    "group": "RunningMode",
                    "tag": "Value",
                    "value": `${mode}`
                }),
            })
        ]);

        // Optional: Memeriksa status kedua response jika perlu
        if (!response1.ok || !response2.ok) {
            throw new Error('One of the requests failed');
        }

        console.log('Running mode changed successfully');

    } catch (error) {
        console.error('Error changing running mode', error);
    }
}

async function changeWorkOrder(ipaddress: string, workOrderId: string){
    try {
        const response = await fetch(`http://${ipaddress}:5555/set-software-key-val-pair`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "node": "Client",
                "group": "WorkOrderId",
                "tag": "Value",
                "value": `${workOrderId}`
            }),
        });
    } catch (error) {
        console.error('Error changing running mode', error);
    }
}
