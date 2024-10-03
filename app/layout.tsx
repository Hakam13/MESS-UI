
import "@mantine/core/styles.css";
import React from "react";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import { theme } from "@/theme";
import '@mantine/carousel/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import {createStore, Provider as JotaiProvider} from 'jotai';
import AggregatorClient from "@/agreggatorClient/AggregatorClient";

export const metadata = {
  title: "JVT OptiMES",
  description: "...",
};

const jotaiStore = createStore()

export default function RootLayout({ children }: { children: any }) {
  return (
      <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/images/javindo.png" />
        <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
          <title>{metadata.title}</title>
      </head>
      <body>
      <JotaiProvider>
        <MantineProvider theme={theme}>
            <AggregatorClient/>
            <Notifications />
          {children}
        </MantineProvider>
      </JotaiProvider>
      </body>
      </html>
  );
}