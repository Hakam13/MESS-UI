import { NextResponse } from "next/server";
import os from "os";

export async function GET() {
    // Mendapatkan network interfaces dari server
    const networkInterfaces = os.networkInterfaces();
    let serverIp = "IP tidak ditemukan";

    // Cari interface yang memiliki alamat IPv4 (bukan internal/localhost)
    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        if (interfaces) {
            for (const iface of interfaces) {
                if (iface.family === 'IPv4' && !iface.internal) {
                    serverIp = iface.address;
                    break;
                }
            }
        }
    }

    return NextResponse.json({
        hello: "world",
        name: "yekaa",
        serverIp: serverIp //"192.168.30.7"
    });
}
