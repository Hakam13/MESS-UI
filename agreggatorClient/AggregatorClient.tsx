"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {atom, useAtom} from "jotai";

export const hardwareSharedMemoryAtom = atom<any>({});
export const softwareSharedMemoryAtom = atom<any>({});

export const serverIPAddressAtom = atom<string>("")

export default function AggregatorClient() {
    const [gatewayValue, setGatewayValue] = useAtom(hardwareSharedMemoryAtom);
    const [softwareMemory, setSoftwareMemory] = useAtom(softwareSharedMemoryAtom);
    const [serverIp, setServerIp] = useAtom(serverIPAddressAtom);

    useEffect(() => {
        // Fetch server IP from the API
        const fetchServerIp = async () => {
            const response = await fetch('api/utils/getIPAddress');
            const data = await response.json();
            setServerIp(data.serverIp);
        };

        fetchServerIp();
    }, []);

    useEffect(() => {
        if (serverIp) {
            const socket = io(`http://${serverIp}:8000`, {
                path: '/socket.io/',
            });

            // Terhubung ke server Socket.IO
            socket.on('connect', () => {
                console.log('Connected to Socket.IO server');
            });

            // Mendengarkan semua pesan
            socket.onAny((topic, message) => {
                const parsedMsg = JSON.stringify(message);
                const jsonfyMsg = JSON.parse(parsedMsg);

                if (topic == "readings") {
                    setGatewayValue(jsonfyMsg);
                    //console.log("plc:", jsonfyMsg)
                } else if (topic == "software-shared-memory"){
                    setSoftwareMemory(jsonfyMsg);
                }
            });

            // Membersihkan event listener saat komponen unmount
            return () => {
                socket.off('connect');
                socket.offAny();
            };
        }
    }, [serverIp]);

    return (<></>);
}
