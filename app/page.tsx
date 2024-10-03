"use client"

import {ActionIcon, Affix, AppShell, Modal, Text} from "@mantine/core";
import React, {useEffect} from "react";
import {useAtom} from "jotai";
import {appShellViewState, loggedIn} from "@/app/atomConstantType/atoms";
import AppShellComponentMainHeader from "@/app/appShellComponents/appShellComponentMainHeader";
import {useDisclosure} from "@mantine/hooks";
import AppShellModalViewSelector from "@/app/appShellModals/appShellModalViewSelector";
import {AppShellViewsConstants} from "@/app/atomConstantType/constants";
import AppShellViewLogin from "@/app/appShellViews/appShellViewLogin";
import AppShellViewHome from "@/app/appShellViews/appShellViewHome";
import AppShellViewHistorian from "@/app/appShellViews/appShellViewHistorian";
import AppShellViewUsers from "@/app/appShellViews/appShellViewUsers"
import AppShellViewMachine from "@/app/appShellViews/appShellViewMachine"
import AppShellViewAlarms from "@/app/appShellViews/appShellViewAlarms";
import HomeView from "./appShellViews/homeView";
import AppShellViewAdminDashboard from "./appShellViews/appShellViewAdminDashboard";

export default function ResponsiveSizes() {
    const [appShellViewStateValue, setAppShellViewStateValue] = useAtom(appShellViewState);
    const [opened, { open, close }] = useDisclosure(false);
    const[loggedInStatus, setLoggedInStatus]=useAtom(loggedIn);

    const appShellViewRender = () => {
        if (loggedInStatus){
            switch (appShellViewStateValue) {
                case AppShellViewsConstants.AppShellViewLogin:
                    return <AppShellViewLogin></AppShellViewLogin>
                case AppShellViewsConstants.AppShellViewHome:
                    // return <AppShellViewHome></AppShellViewHome>
                    return <HomeView></HomeView>
                case AppShellViewsConstants.AppShellViewHistorian:
                    return <AppShellViewHistorian></AppShellViewHistorian>
                case AppShellViewsConstants.AppShellViewAlarms:
                    return <AppShellViewAlarms></AppShellViewAlarms>
                case AppShellViewsConstants.AppShellViewAdminDashboard:
                    return <AppShellViewAdminDashboard></AppShellViewAdminDashboard>
                case AppShellViewsConstants.AppShellViewUsers:
                    return<AppShellViewUsers></AppShellViewUsers>
                case AppShellViewsConstants.AppShellViewMachine:
                    return<AppShellViewMachine></AppShellViewMachine>
                default:
                    return <div>Segment tidak valid</div>;
            }
        } else {
            switch (appShellViewStateValue) {
                case AppShellViewsConstants.AppShellViewLogin:
                    return <AppShellViewLogin></AppShellViewLogin>
                case AppShellViewsConstants.AppShellViewHome:
                    return <AppShellViewLogin></AppShellViewLogin>
                case AppShellViewsConstants.AppShellViewHistorian:
                    return <AppShellViewLogin></AppShellViewLogin>
                case AppShellViewsConstants.AppShellViewAlarms:
                    return <AppShellViewLogin></AppShellViewLogin>
                default:
                    return <div>Segment tidak valid</div>;
            }
        }
    };


    return (
        <AppShell
            header={{height: {base: 60, md: 70, lg: 80}}}
            // navbar={{ width: '7%', breakpoint: 'sm' }}
            padding="md"
        >
            <AppShell.Header>
                {AppShellComponentMainHeader()}
            </AppShell.Header>

            {/*<AppShell.Navbar p={"sm"}>*/}
            {/*    <AppShellComponentMainSidebar/>*/}
            {/*</AppShell.Navbar>*/}

            <AppShell.Main bg={"#f7f7f7"}>
                {appShellViewRender()}

                <Modal
                    opened={opened}
                    onClose={close}
                    withCloseButton={true}
                    size={"70%"}
                    radius={10}
                    removeScrollProps={{ allowPinchZoom: true, removeScrollBar: true}}
                    transitionProps={{ transition: 'fade', duration: 200 }}
                >
                    <AppShellModalViewSelector onClose={close}/>
                </Modal>


                <Affix position={{ top: 0, left: 0 }}>
                    <ActionIcon
                        onClick={open}
                        variant="gradient"
                        size={80}
                        px={"md"}
                        radius={"xs"}
                        gradient
                            ={{ from: 'indigo', to: 'cyan', deg: 90 }}
                    >
                        <Text size={"lg"} fw={"bold"}>Menu</Text>
                    </ActionIcon>
                </Affix>

            </AppShell.Main>
        </AppShell>
    );
}
