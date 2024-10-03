import {
    Badge,
    Box,
    Burger,
    Center,
    Divider,
    Flex,
    Group,
    Indicator,
    SimpleGrid,
    Stack,
    Text,
    Title
} from "@mantine/core";
import styled from "@emotion/styled";
import {useAtom} from "jotai/index";
import {loggedIn} from "@/app/atomConstantType/atoms";

const SoftwareIcon = styled.img<{
    x?: string
}>`
    object-fit: cover;
    width: 3rem;
    height: 3rem;
`;

export default function AppShellComponentMainHeader(date?: string, systemStatus?: string, loggerStatus?: string) {
    const [loggedInStatus, setLoggedInStatus]=useAtom(loggedIn);

    let finalLoggerStatus = loggerStatus;
    let finalColor = "green"; // Warna default

    if (systemStatus === "RUNNING" && loggerStatus === "STOPPED") {
        finalLoggerStatus = "IDLE";
        finalColor = "orange";
    } else if (systemStatus === "STOPPED" && loggerStatus === "STOPPED") {
        finalLoggerStatus = "STOPPED";
        finalColor = "red";
    }

    return (
        <>
            <Group justify={"space-between"} px={"sm"} align={"center"} h={"100%"}>
                <Flex direction={"row"} align={"center"} justify={"space-between"}>

                    <Divider orientation={"vertical"}/>
                </Flex>

                <Divider orientation={"vertical"}/>

                <Group gap="xs" align={"center"}>
                    <Flex direction={"row"}>
                        <SoftwareIcon src={"/images/javindo.png"} ></SoftwareIcon>
                        <Title order={1}>JVT OptiMES</Title>
                    </Flex>
                </Group>

                <Divider orientation={"vertical"}/>

                <Stack
                    align="flex-end"
                    justify="flex-start"
                >
                    <Title order={4}>{date}</Title>
                    <Text>Logged In: {String(loggedInStatus)}</Text>
                    <Flex direction={"row"} justify={"flex-end"}  mt={"-10px"} gap={"sm"}>
                        <SimpleGrid cols={2}>
                            <Indicator
                                color={systemStatus === "STOPPED" ? "red" : "green"}
                                radius="lg"
                                size={12}
                                withBorder
                                processing={systemStatus !== "STOPPED"}
                                position="middle-end"
                            >
                                <Badge w={"100%"} variant="outline" radius="sm">DATA LOGGER : {systemStatus}</Badge>
                            </Indicator>
                            <Indicator
                                color={finalColor}
                                radius="lg"
                                size={12}
                                withBorder
                                processing={systemStatus !== "STOPPED"}
                                position="middle-end"
                            >
                                <Badge w={"100%"} variant="outline" radius="sm">PM READER : {finalLoggerStatus}</Badge>
                            </Indicator>
                        </SimpleGrid>
                    </Flex>
                </Stack>
            </Group>
        </>
    )
}
