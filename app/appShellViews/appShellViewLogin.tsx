import {Button, Card, TextInput, Text, Group, Badge, Image, Flex} from "@mantine/core";
import { useAtom } from "jotai";
import {appShellViewState, loggedIn} from "@/app/atomConstantType/atoms";
import {AppShellViewsConstants} from "@/app/atomConstantType/constants";
import {useState} from "react";

export default function AppShellViewLogin() {
    const [loggedInStatus, setLoggedInStatus]=useAtom(loggedIn);
    const [appShellViewStateValue, setAppShellViewStateValue] = useAtom(appShellViewState);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    function loggingIn(){
        setLoggedInStatus(true)
        setAppShellViewStateValue(AppShellViewsConstants.AppShellViewHome)
    }

    return(
        <>
            <Flex direction={"row"} justify={"center"}>
                <Card w={"fit-content"} shadow="sm" padding="lg" radius="md" withBorder>
                    <Card.Section component="a" href="https://mantine.dev/">
                        <Image
                            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                            height={160}
                            alt="Norway"
                        />
                    </Card.Section>

                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={700} size={"lg"}>Login</Text>
                        <Badge color="blue">Client</Badge>
                    </Group>

                    <Flex direction={"column"} gap={"md"}>
                        <TextInput
                            value={username}
                            onChange={(event) => setUsername(event.currentTarget.value)}
                            label="Operator Username"
                            placeholder="JTP-JaneDoe"
                        />
                        <TextInput
                            value={password}
                            onChange={(event) => setPassword(event.currentTarget.value)}
                            label="Operator Password"
                            placeholder="****"
                        />
                        <Button onClick={()=> loggingIn()}>Login</Button>
                    </Flex>
                </Card>
            </Flex>
        </>
    )
}