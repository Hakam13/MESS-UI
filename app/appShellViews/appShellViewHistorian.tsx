import { useEffect, useState } from "react";
import { Affix, Badge, Button, Divider, Fieldset, Flex, Input, NativeSelect, NumberInput, Stack, Text, rem } from '@mantine/core';
import { DateInput, TimeInput } from "@mantine/dates";
import moment from "moment-timezone";
import { IconCalendar, IconChartHistogram, IconClock, IconFileTypeCsv, IconFileTypeXls } from "@tabler/icons-react";
import {useAtom} from "jotai/index";
import {serverIPAddressAtom} from "@/agreggatorClient/AggregatorClient";
import HistorianChartComponent from "@/app/appShellComponents/HistorianChartComponent";

// Step 1: Define the TypeScript interface for the JSON response
interface HistorianService {
    ServiceName: string;
    APIPath: string;
    HTTPMethod: string;
    Description: string;
    SkipHistorianFlag: string;
    SQLQuery: string;
}

interface HistorianChartBuilderProps {
    selectedServiceName: string;
    historianServiceList: HistorianService[];
    setSelectedServiceName: (name: string) => void;
    service: HistorianService | undefined;
    onGenerateChart: () => void;
    startDate: Date | null;
    setStartDate: (date: Date | null) => void;
    startTime: string;
    setStartTime: (time: string) => void;
    endDate: Date | null;
    setEndDate: (date: Date | null) => void;
    endTime: string;
    setEndTime: (time: string) => void;
    sampleInterval: number;
    setSampleInterval: (interval: number) => void;
    sampleUnit: string;
    setSampleUnit: (unit: string) => void;
}

// Utility functions
const formatDateTime = (date: Date | null, time: string): string => {
    if (!date || !time) return '';
    return moment(date).utc().format(`YYYY-MM-DDT${time}:00.00000Z`);
};

const convertSamplingUnit = (unit: string): string => {
    const unitsMap: { [key: string]: string } = {
        'Second': 's',
        'Minute': 'm',
        'Hour': 'h',
        'Day': 'd',
        'Month': 'M',
        'Year': 'Y',
    };
    return unitsMap[unit] || '';
};

// Main component
export default function AppShellViewHistorian() {
    const [historianServiceList, setHistorianServiceList] = useState<HistorianService[]>([]);
    const [selectedServiceName, setSelectedServiceName] = useState('');
    const [chartData, setChartData] = useState<any[]>([]);
    const [historianName, setHistorianName] = useState<string>("Historian");
    const [chartProperties, setChartProperties] =  useState<any[]>([]);

    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [startTime, setStartTime] = useState('00:00');
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [endTime, setEndTime] = useState('23:59');
    const [sampleInterval, setSampleInterval] = useState(1);
    const [sampleUnit, setSampleUnit] = useState('Hour');

    const [historianAPIAddress, setServerIp] = useAtom(serverIPAddressAtom);

    // Fetch historian services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch(`http://${historianAPIAddress}:2222/service-info`);
                const data: HistorianService[] = await response.json();
                setHistorianServiceList(data);
                if (data.length > 0) setSelectedServiceName(data[0].ServiceName);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };
        fetchServices();
    }, [historianAPIAddress]);

    const handleGenerateChart = async () => {
        const selectedService = historianServiceList.find(service => service.ServiceName === selectedServiceName);
        if (!selectedService) return;

        const startTimestamp = formatDateTime(startDate, startTime);
        const endTimestamp = formatDateTime(endDate, endTime);
        const sampling = `${sampleInterval}${convertSamplingUnit(sampleUnit)}`;

        try {
            const response = await fetch(`http://${historianAPIAddress}:2222/${selectedService.APIPath}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productionId: "1-112" }),
            });
            const data = await response.json();

            const historianName = data.historianMetadata.dataPointName;
            const historianData = data.historianData;
            const chartProperties = data.historianMetadata.chartProperties;

            setHistorianName(historianName);
            setChartData(historianData);
            setChartProperties(chartProperties);
        } catch (error) {
            console.error('Error generating chart:', error);
        }
    };

    return (
        <>
            <Flex h={"95vh"}>
                <HistorianChartComponent
                    data={chartData}
                    dataPointName={historianName}
                    chartProperties={chartProperties}
                    chartWidth={"100%"}
                    chartHeight={500}
                />
            </Flex>
            <Affix position={{ left:0, bottom: 0 }} w={"100vw"}>
                <HistorianChartBuilder
                    selectedServiceName={selectedServiceName}
                    historianServiceList={historianServiceList}
                    setSelectedServiceName={setSelectedServiceName}
                    service={historianServiceList.find(s => s.ServiceName === selectedServiceName)}
                    onGenerateChart={handleGenerateChart}
                    startDate={startDate} setStartDate={setStartDate}
                    startTime={startTime} setStartTime={setStartTime}
                    endDate={endDate} setEndDate={setEndDate}
                    endTime={endTime} setEndTime={setEndTime}
                    sampleInterval={sampleInterval} setSampleInterval={setSampleInterval}
                    sampleUnit={sampleUnit} setSampleUnit={setSampleUnit}
                />
            </Affix>
        </>
    );
}

// HistorianChartBuilder separated out
function HistorianChartBuilder({
   selectedServiceName, historianServiceList, setSelectedServiceName, service, onGenerateChart,
   startDate, setStartDate, startTime, setStartTime, endDate, setEndDate, endTime, setEndTime,
   sampleInterval, setSampleInterval, sampleUnit, setSampleUnit
}: HistorianChartBuilderProps) {
    return (
        <>
            <Fieldset p={"xs"} legend={<Badge color="blue" variant="filled">Chart Builder</Badge>} variant="filled">
                <Flex direction={"row"} align={"center"} justify={"center"} gap={"md"}>

                    {/* Populate NativeSelect with ServiceName from historianServiceList */}
                    <Flex direction={"column"} w={"20%"}>
                        <Text fw={600} size={"sm"}>Data Point</Text>
                        <NativeSelect
                            size={"xs"}
                            value={selectedServiceName}
                            onChange={(event) => setSelectedServiceName(event.currentTarget.value)}
                            data={historianServiceList?.map((service: HistorianService) => service.ServiceName) || []}
                        />
                    </Flex>

                    <Divider orientation={"vertical"} />

                    <Flex direction={"column"} w={"20%"}>
                        <Text fw={600} size={"sm"}>Description</Text>
                        <Text c={"dimmed"} size={"sm"}>{service?.Description}</Text>
                    </Flex>

                    <Divider orientation={"vertical"} />

                    {/* Date & Time Inputs */}
                    <Flex direction={"column"} gap={"sm"}>
                        <DateInput
                            size={"xs"}
                            leftSection={<IconCalendar size={18}/>}
                            clearable
                            value={startDate}
                            onChange={setStartDate}
                            label="Start (Date)"
                            placeholder="Select start date"
                        />
                        <Input.Wrapper onChange={(x: any) => setStartTime(x.target.value)}>
                            <TimeInput defaultValue={startTime} leftSection={<IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />} description={"Default: 00:00"}/>
                        </Input.Wrapper>
                    </Flex>

                    <Flex direction={"column"} gap={"sm"}>
                        <DateInput
                            size={"xs"}
                            leftSection={<IconCalendar size={18}/>}
                            clearable
                            value={endDate}
                            onChange={setEndDate}
                            label="End (Date)"
                            placeholder="Select end date"
                        />
                        <Input.Wrapper onChange={(x: any) => setEndTime(x.target.value)} defaultValue={endTime}>
                            <TimeInput defaultValue={endTime} leftSection={<IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />} description={"Default: 23:59"}/>
                        </Input.Wrapper>
                    </Flex>

                    <Divider orientation={"vertical"} />

                    {/* Sample Interval and Sample Unit */}
                    <Flex direction={"column"}>
                        <NumberInput
                            size={"xs"}
                            label="Sample Interval"
                            min={1}
                            defaultValue={sampleInterval}
                            onChange={(event)=>setSampleInterval(Number(event))}
                            placeholder=""
                        />
                        <NativeSelect
                            size={"xs"}
                            value={sampleUnit}
                            label="Sample Unit"
                            onChange={(event) => setSampleUnit(event.currentTarget.value)}
                            data={['Second','Minute','Hour', 'Day', 'Month', 'Year']}
                        />
                    </Flex>

                    <Divider orientation={"vertical"} />

                    <Stack gap={"xs"}>
                        <Button
                            size={"xs"}
                            color="green"
                            leftSection={<IconChartHistogram size={18} />}
                            onClick={onGenerateChart}
                        >
                            Generate
                        </Button>
                        <Button
                            size={"xs"}
                            leftSection={<IconFileTypeXls size={18} />}
                            onClick={() => { console.log("Export to Excel") }}
                            variant="filled"
                        >
                            Export to Excel
                        </Button>
                        <Button
                            size={"xs"}
                            leftSection={<IconFileTypeCsv size={18} />}
                            onClick={() => { console.log("Export to CSV") }}
                            variant="filled"
                        >
                            Export to CSV
                        </Button>
                    </Stack>

                </Flex>
            </Fieldset>
        </>
    );
}
