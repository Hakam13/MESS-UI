import { useEffect, useState } from 'react';
import { Button, Flex, Table, Text } from '@mantine/core';
import {useAtom} from "jotai/index";
import {serverIPAddressAtom} from "@/agreggatorClient/AggregatorClient";

// Define TypeScript interface for Alarm data
interface TagValue {
    tagName: string;
    tagValue: string;
}

interface Alarm {
    acknowledgeBy: string | null;
    acknowledgeTimestamp: string | null;
    acknowledgedFlag: boolean;
    actionTaken: string | null;
    alarmDescription: string;
    alarmId: string;
    alarmStatus: boolean;
    alarmType: string;
    comments: string | null;
    tagValues: string; // JSON string
    timestamp: string;
}

// Component
export default function AppShellViewAlarms() {
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const [alarmSystemIPAddress, setServerIp] = useAtom(serverIPAddressAtom);

    // Function to fetch alarms
    const fetchAlarms = async () => {
        try {
            const response = await fetch(`http://${alarmSystemIPAddress}:1000/getAllAlarms`);
            const data: Alarm[] = await response.json();
            setAlarms(data);
        } catch (error) {
            console.error('Error fetching alarms:', error);
        }
    };

    // Set interval to fetch data every 2 seconds
    useEffect(() => {
        fetchAlarms(); // Initial fetch
        const intervalId = setInterval(fetchAlarms, 1000);
        return () => clearInterval(intervalId); // Clean up interval on component unmount
    }, []);

    // Function to determine row background color based on alarmType
    const getAlarmRowColor = (alarmStatus: boolean, alarmType: string) => {
        if (!alarmStatus) {
            return 'green'; // Set the row color to green if alarmStatus is false
        }

        switch (alarmType) {
            case 'INFORMATIONAL':
                return '#00B5FF';
            case 'WARNING':
                return '#f7e620';
            case 'CRITICAL':
                return '#F06418';
            case 'EMERGENCY':
                return '#F21616';
            default:
                return 'green'; // Default color if alarmType doesn't match
        }
    };

    // Render rows
    const rows = alarms.map(alarm => {
        // Parse tagValues from JSON string to object
        const parsedTagValues: TagValue[] = JSON.parse(alarm.tagValues);

        return (
            <Table.Tr key={alarm.alarmId} bg={getAlarmRowColor(alarm.alarmStatus, alarm.alarmType)}>
                <Table.Td><Text fw={500} size={"sm"}>{new Date(alarm.timestamp).toLocaleString()}</Text></Table.Td>
                <Table.Td><Text fw={500} size={"sm"}>{alarm.alarmId}</Text></Table.Td>
                <Table.Td><Text fw={500} size={"sm"}>{alarm.alarmType}</Text></Table.Td>
                <Table.Td><Text fw={500} size={"sm"}>{alarm.alarmStatus ? 'Active' : 'Inactive'}</Text></Table.Td>
                <Table.Td><Text fw={500} size={"sm"}>{alarm.alarmDescription}</Text></Table.Td>
                <Table.Td>
                    <Text fw={500} size={"sm"}>
                        {parsedTagValues?.map(tag => (
                            <div key={tag.tagName}>{tag.tagName} : {tag.tagValue}</div>
                        ))}

                        {/*{String(parsedTagValues)}*/}
                    </Text>
                </Table.Td>
                {/*<Table.Td><Text fw={500} size={"sm"}>{alarm.acknowledgeBy || 'N/A'}</Text></Table.Td>*/}
                {/*<Table.Td><Text fw={500} size={"sm"}>{alarm.acknowledgeTimestamp || 'N/A'}</Text></Table.Td>*/}
                {/*<Table.Td><Text fw={500} size={"sm"}>{alarm.acknowledgedFlag ? 'Yes' : 'No'}</Text></Table.Td>*/}
                {/*<Table.Td>*/}
                {/*    <Text fw={500} size={"sm"}>*/}
                {/*        {alarm.alarmStatus ?*/}
                {/*            <>*/}
                {/*                <Button variant={"filled"}>ACK</Button>*/}
                {/*            </>*/}
                {/*            :*/}
                {/*            <></>*/}
                {/*        }*/}
                {/*    </Text>*/}
                {/*</Table.Td>*/}
            </Table.Tr>
        );
    });

    return (
        <>
            <Flex direction={"row"} gap={"sm"}>
                <Button>Acknowledge</Button>
                <Button>Clear Alarm</Button>
                <Button>History</Button>
            </Flex>
            <Table stickyHeader stickyHeaderOffset={80} striped highlightOnHover withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Timestamp</Table.Th>
                        <Table.Th>Alarm ID</Table.Th>
                        <Table.Th>Type</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Current Values</Table.Th>
                        <Table.Th>Description</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </>
    );
}
