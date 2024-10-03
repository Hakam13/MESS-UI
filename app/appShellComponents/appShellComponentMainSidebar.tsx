import { useState } from 'react';
import {Center, Tooltip, UnstyledButton, Stack, Text, rem, Flex, Button, Divider} from '@mantine/core';
import {
    IconHome2,
    IconGauge,
    IconDeviceDesktopAnalytics,
    IconSettings,
    IconSnowflake,
    IconSwitchHorizontal,
    IconLogout, IconRefresh, IconZoomExclamation,
} from '@tabler/icons-react';
import classes from './NavbarMinimalColoured.module.css';
import {useAtom} from "jotai/index";
import {navbarScreenState, refreshHomeScreenDataAtom} from "@/app/atomConstantType/atoms";
import styled from "@emotion/styled";

interface NavbarLinkProps {
    icon: typeof IconHome2;
    label: string;
    active?: boolean;
    onClick?(): void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
    return (
        <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
            <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
                <Flex
                    justify="center"
                    align="center"
                    direction="column"
                    wrap="wrap"
                    p={"md"}
                >
                    <Icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
                    <Text size={"xs"}>{label}</Text>
                </Flex>
            </UnstyledButton>
        </Tooltip>
    );
}

const tabLinks = [
    { icon: IconHome2, label: 'Home' },
    { icon: IconGauge, label: 'Events' },
    { icon: IconGauge, label: 'Production Manager' },
    { icon: IconGauge, label: 'Resource Management' },
    { icon: IconZoomExclamation, label: 'Alarms' },
    { icon: IconDeviceDesktopAnalytics, label: 'Historian' },
    { icon: IconSettings, label: 'Settings' },
];


const SoftwareIcon = styled.img<{
    x?: string
}>`
  object-fit: cover;
  width: 3rem;
    filter: blur(0.5px);
  height: 3rem;
`;

export default function AppShellComponentMainSidebar() {
    const [active, setActive] = useAtom(navbarScreenState);
    const [refresh, setRefresh] = useAtom(refreshHomeScreenDataAtom)

    const handleRefresh = () => {
        setRefresh(!refresh);
    };

    const links = tabLinks.map((link, index) => (
        <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => setActive(index)}
        />
    ));

    return (
        <>
            <Center>
                <SoftwareIcon src={"/images/javindo.png"} ></SoftwareIcon>
            </Center>
            <Flex direction={"column"} align={"center"}>
                <Text size={"xs"} fw={200}>Javindotech</Text>
            </Flex>
            <Divider orientation={"horizontal"} my={"sm"}></Divider>

            <Flex direction={"column"} justify={"space-around"} h={"100%"} w={"100%"}>
                <Stack
                    justify="center"
                    gap={"sm"}
                >
                    {links}
                </Stack>

                <Stack>
                    {/*<Button variant="light" size={"sm"} onClick={handleRefresh}>*/}
                    {/*    <Flex direction={"column"} align={"center"} justify={"center"}>*/}
                    {/*        <IconRefresh style={{ width: rem(15), height: rem(15), }} stroke={1.5}/>*/}
                    {/*        <Text size={"xs"}>Refresh</Text>*/}
                    {/*    </Flex>*/}
                    {/*</Button>*/}

                </Stack>

            </Flex>
        </>

    );
}